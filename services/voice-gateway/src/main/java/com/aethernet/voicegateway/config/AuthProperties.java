package com.aethernet.voicegateway.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app.auth")
public class AuthProperties {

    private AuthMode mode = AuthMode.DUMMY;
    private DummyAuth dummy = new DummyAuth();
    private JwtAuth jwt = new JwtAuth();

    public enum AuthMode {
        DUMMY, JWT, OAUTH2
    }

    public static class DummyAuth {
        private String token = "dummy-voice-agent-token";

        // Getters and setters
        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }
    }

    public static class JwtAuth {
        private String secret;
        private String issuer;

        // Getters and setters
        public String getSecret() {
            return secret;
        }

        public void setSecret(String secret) {
            this.secret = secret;
        }

        public String getIssuer() {
            return issuer;
        }

        public void setIssuer(String issuer) {
            this.issuer = issuer;
        }
    }

    // Getters and setters
    public AuthMode getMode() {
        return mode;
    }

    public void setMode(AuthMode mode) {
        this.mode = mode;
    }

    public DummyAuth getDummy() {
        return dummy;
    }

    public void setDummy(DummyAuth dummy) {
        this.dummy = dummy;
    }

    public JwtAuth getJwt() {
        return jwt;
    }

    public void setJwt(JwtAuth jwt) {
        this.jwt = jwt;
    }
}