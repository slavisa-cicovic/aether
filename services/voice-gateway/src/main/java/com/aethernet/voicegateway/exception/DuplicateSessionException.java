package com.aethernet.voicegateway.exception;

public class DuplicateSessionException extends RuntimeException {
    private final String callSid;
    
    public DuplicateSessionException(String message, String callSid) {
        super(message);
        this.callSid = callSid;
    }
    
    public String getCallSid() {
        return callSid;
    }
}