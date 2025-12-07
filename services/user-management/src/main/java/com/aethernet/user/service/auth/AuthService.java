package com.aethernet.user.service.auth;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import com.aethernet.user.domain.PasswordResetToken;
import com.aethernet.user.domain.RefreshToken;
import com.aethernet.user.domain.Role;
import com.aethernet.user.domain.User;
import com.aethernet.user.dto.request.ForgotPasswordRequest;
import com.aethernet.user.dto.request.LoginRequest;
import com.aethernet.user.dto.request.RefreshTokenRequest;
import com.aethernet.user.dto.request.RegisterUserRequest;
import com.aethernet.user.dto.request.ResetPasswordRequest;
import com.aethernet.user.dto.response.ForgotPasswordResponse;
import com.aethernet.user.dto.response.LoginResponse;
import com.aethernet.user.dto.response.UserResponse;
import com.aethernet.user.repository.PasswordResetTokenRepository;
import com.aethernet.user.repository.RefreshTokenRepository;
import com.aethernet.user.repository.RoleRepository;
import com.aethernet.user.repository.UserRepository;
import com.aethernet.user.service.security.JwtService;
import com.aethernet.user.service.security.UserPrincipal;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    // =========================================================================
    // LOGIN
    // =========================================================================

    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .filter(u -> !u.isDeleted())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        // AuthenticationManager will throw if invalid
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));

        String accessToken = jwtService.generateToken(new UserPrincipal(user));
        String refreshToken = createRefreshToken(user);

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(toUserResponse(user))
                .build();
    }

    // =========================================================================
    // REGISTER
    // =========================================================================

    public LoginResponse register(RegisterUserRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already in use");
        }

        Role userRole = roleRepository.findByName("VOICE_AGENT")
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR, "Default USER role is missing"));

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .lang(resolveLang(request.getLang()))
                .roles(Set.of(userRole))
                .active(true)
                .locked(false)
                .deleted(false)
                .build();

        userRepository.save(user);

        String accessToken = jwtService.generateToken(new UserPrincipal(user));
        String refreshToken = createRefreshToken(user);

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(toUserResponse(user))
                .build();
    }

    // =========================================================================
    // REFRESH TOKEN
    // =========================================================================

    public LoginResponse refresh(RefreshTokenRequest request) {

        RefreshToken token = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token"));

        if (token.isRevoked() || token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token expired or revoked");
        }

        User user = token.getUser();

        String newAccessToken = jwtService.generateToken(new UserPrincipal(user));
        String newRefreshToken = createRefreshToken(user);

        // revoke old token
        token.setRevoked(true);
        refreshTokenRepository.save(token);

        return LoginResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .user(toUserResponse(user))
                .build();
    }

    // =========================================================================
    // LOGOUT
    // =========================================================================

    public void logout(String refreshToken) {
        refreshTokenRepository.findByToken(refreshToken).ifPresent(token -> {
            token.setRevoked(true);
            refreshTokenRepository.save(token);
        });
    }

    // =========================================================================
    // FORGOT / RESET PASSWORD
    // =========================================================================

    @Transactional
    public ForgotPasswordResponse initiatePasswordReset(ForgotPasswordRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail())
                .filter(u -> !u.isDeleted() && u.isActive() && !u.isLocked());

        if (userOpt.isEmpty()) {
            // Don't leak user existence
            return ForgotPasswordResponse.builder()
                    .message("If the account exists, a reset link has been sent.")
                    .build();
        }

        User user = userOpt.get();
        LocalDateTime now = LocalDateTime.now();

        List<PasswordResetToken> activeTokens = passwordResetTokenRepository
                .findAllByUserAndUsedFalseAndExpiresAtAfter(user, now);
        activeTokens.forEach(existing -> {
            existing.setUsed(true);
            existing.setUsedAt(now);
        });
        passwordResetTokenRepository.saveAll(activeTokens);

        PasswordResetToken token = PasswordResetToken.builder()
                .token(UUID.randomUUID().toString())
                .user(user)
                .expiresAt(now.plusMinutes(30))
                .build();

        passwordResetTokenRepository.save(token);

        return ForgotPasswordResponse.builder()
                .message("If the account exists, a reset link has been sent.")
                // Expose token so mobile clients can complete the flow without email wiring.
                .resetToken(token.getToken())
                .build();
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken token = passwordResetTokenRepository
                .findByTokenAndUsedFalseAndExpiresAtAfter(request.getToken(), LocalDateTime.now())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid or expired reset token"));

        User user = token.getUser();
        if (!user.getEmail().equalsIgnoreCase(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid reset token for email");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setLocked(false);
        user.setDeleted(false);

        token.setUsed(true);
        token.setUsedAt(LocalDateTime.now());

        // revoke existing refresh tokens after password change
        List<RefreshToken> activeTokens = refreshTokenRepository.findAllByUserAndRevokedFalse(user);
        activeTokens.forEach(rt -> rt.setRevoked(true));
        refreshTokenRepository.saveAll(activeTokens);

        userRepository.save(user);
        passwordResetTokenRepository.save(token);
    }

    // =========================================================================
    // CURRENT USER
    // =========================================================================

    public User getCurrentUser() {

        if (SecurityContextHolder.getContext().getAuthentication() == null)
            return null;

        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!(principal instanceof UserPrincipal up))
            return null;

        return up.getUser();
    }

    // =========================================================================
    // INTERNAL HELPERS
    // =========================================================================

    private String createRefreshToken(@NonNull User user) {

        RefreshToken token = RefreshToken.builder()
                .user(user)
                .token(java.util.UUID.randomUUID().toString())
                .expiresAt(LocalDateTime.now().plusDays(30))
                .revoked(false)
                .build();

        refreshTokenRepository.save(token);

        return token.getToken();
    }

    private UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .lang(user.getLang())
                .active(user.isActive())
                .locked(user.isLocked())
                .roles(toRoleNames(user))
                .build();
    }

    private Set<String> toRoleNames(User user) {
        return Optional.ofNullable(user.getRoles())
                .orElseGet(Collections::emptySet)
                .stream()
                .map(role -> role.getName())
                .collect(java.util.stream.Collectors.toSet());
    }

    private String resolveLang(String lang) {
        return StringUtils.hasText(lang) ? lang : "en";
    }
}
