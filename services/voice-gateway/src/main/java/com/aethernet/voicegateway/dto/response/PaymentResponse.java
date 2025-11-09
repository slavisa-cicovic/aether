package com.aethernet.voicegateway.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class PaymentResponse {
    
    private final String paymentStatus;
    private final String orderId;
    private final String trackingUrl;
    private final String responseMessage;
    
    // Constructor
    public PaymentResponse(String paymentStatus, String orderId, String trackingUrl, String responseMessage) {
        this.paymentStatus = paymentStatus;
        this.orderId = orderId;
        this.trackingUrl = trackingUrl;
        this.responseMessage = responseMessage;
    }
    
    // Getters
    public String getPaymentStatus() { return paymentStatus; }
    public String getOrderId() { return orderId; }
    public String getTrackingUrl() { return trackingUrl; }
    public String getResponseMessage() { return responseMessage; }
}