package com.aethernet.voicegateway.dto.request;

import com.fasterxml.jackson.annotation.JsonValue;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CancelRequest {
    
    @NotNull(message = "Cancel reason is required")
    private CancelReason reason;
    
    private String description;
    
    // Enum for cancel reasons
    public enum CancelReason {
        USER_CANCELLED("user_cancelled"),
        CALL_ENDED("call_ended"), 
        TIMEOUT("timeout"),
        PAYMENT_FAILED("payment_failed"),
        TECHNICAL_ISSUE("technical_issue");
        
        private final String value;
        
        CancelReason(String value) {
            this.value = value;
        }
        
        @JsonValue
        public String getValue() {
            return value;
        }
        
        public static CancelReason fromValue(String value) {
            for (CancelReason reason : CancelReason.values()) {
                if (reason.value.equalsIgnoreCase(value)) {
                    return reason;
                }
            }
            throw new IllegalArgumentException("Unknown cancel reason: " + value);
        }
    }
}