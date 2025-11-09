package com.aethernet.voicegateway.exception;

public class SessionNotFoundException extends RuntimeException {
    private final String sessionId;
    
    public SessionNotFoundException(String sessionId) {
        super("Session not found: " + sessionId);
        this.sessionId = sessionId;
    }
    
    public String getSessionId() {
        return sessionId;
    }
}