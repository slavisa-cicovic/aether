package com.aethernet.voicegateway.exception;

public class PaymentProcessingException extends RuntimeException {
    private final String paymentIntentId;
    private final String errorCode;
    
    public PaymentProcessingException(String message, String paymentIntentId, String errorCode) {
        super(message);
        this.paymentIntentId = paymentIntentId;
        this.errorCode = errorCode;
    }
    
    public String getPaymentIntentId() {
        return paymentIntentId;
    }
    
    public String getErrorCode() {
        return errorCode;
    }
}