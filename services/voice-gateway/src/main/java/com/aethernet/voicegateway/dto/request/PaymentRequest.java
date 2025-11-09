package com.aethernet.voicegateway.dto.request;

import com.fasterxml.jackson.annotation.JsonValue;

import jakarta.validation.constraints.NotNull;

public class PaymentRequest {
    
    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;
    
    private PaymentDetails paymentDetails;
    
    // Constructors
    public PaymentRequest() {}
    
    public PaymentRequest(PaymentMethod paymentMethod, PaymentDetails paymentDetails) {
        this.paymentMethod = paymentMethod;
        this.paymentDetails = paymentDetails;
    }
    
    // Getters and Setters
    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }
    
    public PaymentDetails getPaymentDetails() { return paymentDetails; }
    public void setPaymentDetails(PaymentDetails paymentDetails) { this.paymentDetails = paymentDetails; }
    
    // Nested DTO for payment details
    public static class PaymentDetails {
        private String token; // tokenizirani podaci o kartici
        
        // Constructors, getters, setters...
        public PaymentDetails() {}
        
        public PaymentDetails(String token) {
            this.token = token;
        }
        
        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }
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