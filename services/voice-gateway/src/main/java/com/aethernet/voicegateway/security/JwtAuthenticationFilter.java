package com.aethernet.voicegateway.security;

import java.io.IOException;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.http.HttpHeaders;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.aethernet.voicegateway.config.AuthProperties;
import com.aethernet.voicegateway.config.AuthProperties.AuthMode;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends org.springframework.web.filter.OncePerRequestFilter {

    private static final String BEARER_PREFIX = "Bearer ";
    private static final List<String> PUBLIC_ENDPOINTS = List.of(
            "/health",
            "/info",
            "/actuator/health",
            "/swagger-ui",
            "/api-docs",
            "/swagger-resources",
            "/webjars",
            "/configuration");

    private final JwtService jwtService;
    private final AuthProperties authProperties;

    @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) throws ServletException {
        return authProperties.getMode() != AuthMode.JWT;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        String path = request.getRequestURI();

        if (isPublic(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        if (!StringUtils.hasText(authHeader) || !authHeader.startsWith(BEARER_PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(BEARER_PREFIX.length());

        try {
            Claims claims = jwtService.parseToken(token);
            if (jwtService.isExpired(claims)) {
                writeUnauthorized(response, "Token expired");
                return;
            }

            setAuthentication(claims);
        } catch (JwtException | IllegalArgumentException ex) {
            log.warn("Failed to validate JWT: {}", ex.getMessage());
            writeUnauthorized(response, "Invalid token");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private void setAuthentication(Claims claims) {
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            return;
        }

        JwtAuthenticatedPrincipal principal = buildPrincipal(claims);
        Set<String> roles = principal.roles();

        var authorities = roles.stream()
                .map(role -> role.startsWith("ROLE_") ? role : "ROLE_" + role)
                .map(org.springframework.security.core.authority.SimpleGrantedAuthority::new)
                .collect(Collectors.toSet());

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                principal,
                null,
                authorities);

        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    private JwtAuthenticatedPrincipal buildPrincipal(Claims claims) {
        Integer userId = extractUserId(claims);
        String email = claims.get("email", String.class);
        if (!StringUtils.hasText(email)) {
            email = claims.getSubject();
        }

        Set<String> roles = extractRoles(claims);
        return new JwtAuthenticatedPrincipal(userId, email, roles);
    }

    private Integer extractUserId(Claims claims) {
        Number number = claims.get("userId", Number.class);
        return number != null ? number.intValue() : null;
    }

    private Set<String> extractRoles(Claims claims) {
        Object rolesClaim = claims.get("roles");
        if (rolesClaim instanceof Collection<?> collection && !collection.isEmpty()) {
            return collection.stream()
                    .map(Object::toString)
                    .collect(Collectors.toSet());
        }
        return Set.of();
    }

    private void writeUnauthorized(HttpServletResponse response, String message) throws IOException {
        if (response.isCommitted()) {
            return;
        }
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter()
                .write("{\"error\": \"" + message + "\"}");
    }

    private boolean isPublic(String path) {
        if (!StringUtils.hasText(path)) {
            return false;
        }

        return PUBLIC_ENDPOINTS.stream().anyMatch(path::startsWith)
                || path.contains("swagger")
                || path.contains("api-docs")
                || path.contains("webjars")
                || path.contains("configuration");
    }
}
