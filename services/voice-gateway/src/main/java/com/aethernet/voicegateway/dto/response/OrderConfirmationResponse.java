package com.aethernet.voicegateway.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OrderConfirmationResponse {
    
    private final String orderId;
    private final String status;
    private final String paymentIntentId;
    private final String responseMessage;        
}