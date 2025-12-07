package com.aethernet.user.controller;

import java.util.Collections;
import java.util.Optional;
import java.util.Set;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aethernet.user.domain.User;
import com.aethernet.user.dto.request.ForgotPasswordRequest;
import com.aethernet.user.dto.request.LoginRequest;
import com.aethernet.user.dto.request.RegisterUserRequest;
import com.aethernet.user.dto.request.RefreshTokenRequest;
import com.aethernet.user.dto.request.ResetPasswordRequest;
import com.aethernet.user.dto.response.ForgotPasswordResponse;
import com.aethernet.user.dto.response.LoginResponse;
import com.aethernet.user.dto.response.UserResponse;
import com.aethernet.user.service.auth.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // =========================================================================
    // LOGIN
    // =========================================================================
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {

        LoginResponse login = authService.login(request);
        return ResponseEntity.ok(login);
    }

    // =========================================================================
    // REGISTER
    // =========================================================================
    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@Valid @RequestBody RegisterUserRequest request) {
        LoginResponse register = authService.register(request);
        return ResponseEntity.ok(register);
    }

    // =========================================================================
    // REFRESH TOKEN
    // =========================================================================
    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(authService.refresh(request));
    }

    // =========================================================================
    // LOGOUT
    // =========================================================================
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@Valid @RequestBody RefreshTokenRequest request) {
        authService.logout(request.getRefreshToken());
        return ResponseEntity.ok().build();
    }

    // =========================================================================
    // FORGOT / RESET PASSWORD
    // =========================================================================
    @PostMapping("/forgot-password")
    public ResponseEntity<ForgotPasswordResponse> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {
        ForgotPasswordResponse response = authService.initiatePasswordReset(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok().build();
    }

    // =========================================================================
    // CURRENT USER
    // =========================================================================
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser() {
        User user = authService.getCurrentUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        UserResponse response = UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .lang(user.getLang())
                .active(user.isActive())
                .locked(user.isLocked())
                .roles(toRoleNames(user))
                .build();

        return ResponseEntity.ok(response);
    }

    private Set<String> toRoleNames(User user) {
        return Optional.ofNullable(user.getRoles())
                .orElseGet(Collections::emptySet)
                .stream()
                .map(role -> role.getName())
                .collect(java.util.stream.Collectors.toSet());
    }
}
