package com.aethernet.voicegateway.config.filters;

import java.io.IOException;
import java.util.List;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class DummyJwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String AUTH_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    // Dummy "valid" token za development
    private static final String DUMMY_VALID_TOKEN = "dummy-voice-agent-token";

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader(AUTH_HEADER);

        if (authHeader != null && authHeader.startsWith(BEARER_PREFIX)) {
            String token = authHeader.substring(BEARER_PREFIX.length());

            if (validateDummyToken(token)) {
                // Set authentication context
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        "voice-agent", // principal
                        null, // credentials
                        List.of(new SimpleGrantedAuthority("ROLE_VOICE_AGENT")));

                SecurityContextHolder.getContext().setAuthentication(authentication);
            } else {
                // Invalid token
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("{\"error\": \"Invalid token\"}");
                return;
            }
        } else {
            // Missing authorization header
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\": \"Authorization header is required\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private boolean validateDummyToken(String token) {
        // Proveri da li je token naš dummy token
        return DUMMY_VALID_TOKEN.equals(token);
    }
}