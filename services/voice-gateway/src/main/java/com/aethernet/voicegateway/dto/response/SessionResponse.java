package com.aethernet.voicegateway.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class SessionResponse {
    
    private final String sessionId;
    private final String status;
    private final String welcomeMessage;
    
    // Constructor
    public SessionResponse(String sessionId, String status, String welcomeMessage) {
        this.sessionId = sessionId;
        this.status = status;
        this.welcomeMessage = welcomeMessage;
    }
    
    // Getters
    public String getSessionId() { return sessionId; }
    public String getStatus() { return status; }
    public String getWelcomeMessage() { return welcomeMessage; }
}