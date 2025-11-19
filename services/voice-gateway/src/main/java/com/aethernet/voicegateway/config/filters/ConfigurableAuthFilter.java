package com.aethernet.voicegateway.config.filters;

import java.io.IOException;
import java.util.List;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.aethernet.voicegateway.config.AuthProperties;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class ConfigurableAuthFilter extends OncePerRequestFilter {

    private final AuthProperties authProperties;

    public ConfigurableAuthFilter(AuthProperties authProperties) {
        this.authProperties = authProperties;
    }

    // PUBLIC ENDPOINTS
    private static final List<String> PUBLIC_ENDPOINTS = List.of(
            "/health",
            "/info",
            "/actuator/health",
            "/v1/health",
            "/v1/info");

    // PUBLIC PATTERNS - KORIGOVANO
    private static final List<String> PUBLIC_PATTERNS = List.of(
            "/swagger-ui",
            "/api-docs", // 👈 BEZ /v1
            "/webjars",
            "/swagger-resources",
            "/configuration");

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        String requestURI = request.getRequestURI();

        if (isPublicEndpoint(requestURI)) {
            log.debug("Skipping authentication for public endpoint: {}", requestURI);
            filterChain.doFilter(request, response);
            return;
        }

        handleDummyAuth(request, response, filterChain);
    }

    private boolean isPublicEndpoint(String path) {
        if (PUBLIC_ENDPOINTS.stream().anyMatch(endpoint -> path.equals(endpoint))) {
            return true;
        }

        // Proveri pattern match-eve
        if (PUBLIC_PATTERNS.stream().anyMatch(pattern -> path.startsWith(pattern))) {
            return true;
        }

        return path.contains("swagger") ||
                path.contains("api-docs") ||
                path.contains("webjars") ||
                path.contains("configuration");
    }

    private void handleDummyAuth(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws IOException, ServletException {

        String authHeader = request.getHeader("Authorization");

        log.debug("Handling dummy auth for: {}", request.getRequestURI());

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring("Bearer ".length());

            if (validateDummyToken(token)) {
                // Set authentication context
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        "voice-agent", // principal
                        null, // credentials
                        List.of(new SimpleGrantedAuthority("ROLE_VOICE_AGENT")));

                SecurityContextHolder.getContext().setAuthentication(authentication);
                filterChain.doFilter(request, response);
            } else {
                // Invalid token
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\": \"Invalid token\"}");
            }
        } else {
            // Missing authorization header
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Authorization header is required\"}");
        }
    }

    private boolean validateDummyToken(String token) {
        return authProperties.getDummy().getToken().equals(token);
    }

    @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) throws ServletException {
        return authProperties.getMode() != AuthProperties.AuthMode.DUMMY;
    }
}
