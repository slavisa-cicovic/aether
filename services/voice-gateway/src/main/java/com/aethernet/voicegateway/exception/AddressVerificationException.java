package com.aethernet.voicegateway.exception;

import java.util.List;

public class AddressVerificationException extends RuntimeException {
    private final String errorCode;
    private final List<String> suggestions;
    
    public AddressVerificationException(String message, String errorCode, List<String> suggestions) {
        super(message);
        this.errorCode = errorCode;
        this.suggestions = suggestions;
    }
    
    public String getErrorCode() {
        return errorCode;
    }
    
    public List<String> getSuggestions() {
        return suggestions;
    }
}