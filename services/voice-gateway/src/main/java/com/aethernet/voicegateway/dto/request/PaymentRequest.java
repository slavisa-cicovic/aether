package com.aethernet.voicegateway.dto.request;

import com.fasterxml.jackson.annotation.JsonValue;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PaymentRequest {
    
    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;
    
    private PaymentDetails paymentDetails;
    
    // Nested DTO for payment details
    @Data
    public static class PaymentDetails {
        private String token; 
    }
    
    // Enum for payment methods
    public enum PaymentMethod {
        CARD("card"),
        WALLET("wallet");
        
        private final String value;
        
        PaymentMethod(String value) {
            this.value = value;
        }
        
        @JsonValue
        public String getValue() {
            return value;
        }
        
        public static PaymentMethod fromValue(String value) {
            for (PaymentMethod method : PaymentMethod.values()) {
                if (method.value.equalsIgnoreCase(value)) {
                    return method;
                }
            }
            throw new IllegalArgumentException("Unknown payment method: " + value);
        }
    }
}