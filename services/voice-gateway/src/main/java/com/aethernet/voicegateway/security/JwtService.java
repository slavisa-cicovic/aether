package com.aethernet.voicegateway.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.aethernet.voicegateway.config.AuthProperties;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final AuthProperties authProperties;

    public Claims parseToken(String token) {
        if (!StringUtils.hasText(token)) {
            throw new JwtException("Missing JWT token");
        }

        AuthProperties.JwtAuth jwtProps = authProperties.getJwt();
        if (jwtProps == null) {
            throw new IllegalStateException("JWT properties are not configured");
        }

        var parserBuilder = Jwts.parser()
                .verifyWith(getSigningKey(jwtProps));

        if (!StringUtils.hasText(jwtProps.getIssuer())) {
            throw new IllegalStateException("JWT issuer must be configured");
        }
        parserBuilder.requireIssuer(jwtProps.getIssuer());

        return parserBuilder
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean isExpired(Claims claims) {
        Date expiration = claims.getExpiration();
        return expiration == null || expiration.before(new Date());
    }

    private SecretKey getSigningKey(AuthProperties.JwtAuth jwtProps) {
        String secret = jwtProps.getSecret();
        if (!StringUtils.hasText(secret)) {
            throw new IllegalStateException("JWT secret must be configured");
        }
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }
}
