package com.aethernet.voicegateway.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class OrderConfirmationResponse {
    
    private final String orderId;
    private final String status;
    private final String paymentIntentId;
    private final String responseMessage;
    
    // Constructor
    public OrderConfirmationResponse(String orderId, String status, String paymentIntentId, String responseMessage) {
        this.orderId = orderId;
        this.status = status;
        this.paymentIntentId = paymentIntentId;
        this.responseMessage = responseMessage;
    }
    
    // Getters
    public String getOrderId() { return orderId; }
    public String getStatus() { return status; }
    public String getPaymentIntentId() { return paymentIntentId; }
    public String getResponseMessage() { return responseMessage; }
}