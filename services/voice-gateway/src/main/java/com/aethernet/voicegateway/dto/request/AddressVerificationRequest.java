package com.aethernet.voicegateway.dto.request;

import jakarta.validation.constraints.NotNull;

public class AddressVerificationRequest {
    
    @NotNull(message = "Spoken address is required")
    private String spokenAddress;
    
    // Constructors
    public AddressVerificationRequest() {}
    
    public AddressVerificationRequest(String spokenAddress) {
        this.spokenAddress = spokenAddress;
    }
    
    // Getters and Setters
    public String getSpokenAddress() { return spokenAddress; }
    public void setSpokenAddress(String spokenAddress) { this.spokenAddress = spokenAddress; }
}