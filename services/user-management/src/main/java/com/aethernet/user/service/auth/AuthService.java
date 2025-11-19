package com.aethernet.user.service.auth;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.aethernet.user.domain.RefreshToken;
import com.aethernet.user.domain.User;
import com.aethernet.user.dto.request.LoginRequest;
import com.aethernet.user.dto.request.RefreshTokenRequest;
import com.aethernet.user.dto.response.LoginResponse;
import com.aethernet.user.dto.response.UserResponse;
import com.aethernet.user.repository.RefreshTokenRepository;
import com.aethernet.user.repository.UserRepository;
import com.aethernet.user.service.security.JwtService;
import com.aethernet.user.service.security.UserPrincipal;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
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

    @SuppressWarnings("null")
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
                .active(user.isActive())
                .locked(user.isLocked())
                .roles(
                        user.getRoles()
                                .stream()
                                .map(role -> role.getName())
                                .collect(java.util.stream.Collectors.toSet()))
                .build();
    }
}
