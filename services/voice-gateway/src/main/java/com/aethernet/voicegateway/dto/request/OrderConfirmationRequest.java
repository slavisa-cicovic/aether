package com.aethernet.voicegateway.dto.request;

import com.fasterxml.jackson.annotation.JsonValue;

import jakarta.validation.constraints.NotNull;

public class OrderConfirmationRequest {
    
    @NotNull(message = "User confirmation is required")
    private Boolean userConfirmed;
    
    private PaymentMethod paymentMethod;
    
    // Constructors
    public OrderConfirmationRequest() {}
    
    public OrderConfirmationRequest(Boolean userConfirmed, PaymentMethod paymentMethod) {
        this.userConfirmed = userConfirmed;
        this.paymentMethod = paymentMethod;
    }
    
    // Getters and Setters
    public Boolean getUserConfirmed() { return userConfirmed; }
    public void setUserConfirmed(Boolean userConfirmed) { this.userConfirmed = userConfirmed; }
    
    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }
    
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