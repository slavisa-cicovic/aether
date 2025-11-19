package com.aethernet.voicegateway.security;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;

import com.aethernet.voicegateway.config.AuthProperties;
import com.aethernet.voicegateway.config.AuthProperties.AuthMode;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletResponse;

class JwtAuthenticationFilterTest {

    private static final String SECRET = "this_is_a_dev_secret_key_for_tests_only_32";
    private static final String ISSUER = "aether-user-management";

    private AuthProperties authProperties;
    private JwtService jwtService;
    private JwtAuthenticationFilter filter;

    @BeforeEach
    void setUp() {
        authProperties = new AuthProperties();
        AuthProperties.JwtAuth jwtAuth = new AuthProperties.JwtAuth();
        jwtAuth.setSecret(SECRET);
        jwtAuth.setIssuer(ISSUER);
        authProperties.setJwt(jwtAuth);
        authProperties.setMode(AuthMode.JWT);

        jwtService = new JwtService(authProperties);
        filter = new JwtAuthenticationFilter(jwtService, authProperties);
        SecurityContextHolder.clearContext();
    }

    @Test
    void shouldAuthenticateValidToken() throws Exception {
        String token = generateToken(Date.from(Instant.now().plusSeconds(300)));

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader(HttpHeaders.AUTHORIZATION, "Bearer " + token);
        request.setRequestURI("/v1/voice/sessions");

        MockHttpServletResponse response = new MockHttpServletResponse();
        AtomicBoolean chainCalled = new AtomicBoolean(false);
        FilterChain filterChain = (req, res) -> chainCalled.set(true);

        filter.doFilter(request, response, filterChain);

        assertThat(chainCalled).isTrue();

        var authentication = SecurityContextHolder.getContext().getAuthentication();
        assertThat(authentication).isNotNull();
        assertThat(authentication.getPrincipal()).isInstanceOf(JwtAuthenticatedPrincipal.class);

        JwtAuthenticatedPrincipal principal = (JwtAuthenticatedPrincipal) authentication.getPrincipal();
        assertThat(principal.email()).isEqualTo("agent@aether.net");
        assertThat(principal.roles()).containsExactly("VOICE_AGENT");
    }

    @Test
    void shouldRejectExpiredToken() throws Exception {
        String token = generateToken(Date.from(Instant.now().minusSeconds(60)));

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader(HttpHeaders.AUTHORIZATION, "Bearer " + token);

        MockHttpServletResponse response = new MockHttpServletResponse();
        AtomicBoolean chainCalled = new AtomicBoolean(false);
        FilterChain filterChain = (req, res) -> chainCalled.set(true);

        filter.doFilter(request, response, filterChain);

        assertThat(chainCalled).isFalse();
        assertThat(response.getStatus()).isEqualTo(HttpServletResponse.SC_UNAUTHORIZED);
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
    }

    private String generateToken(Date expiration) {
        return Jwts.builder()
                .issuer(ISSUER)
                .subject("agent@aether.net")
                .claim("userId", 42)
                .claim("email", "agent@aether.net")
                .claim("roles", List.of("VOICE_AGENT"))
                .issuedAt(Date.from(Instant.now()))
                .expiration(expiration)
                .signWith(Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8)))
                .compact();
    }
}
