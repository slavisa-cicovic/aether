package com.aethernet.voicegateway.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PaymentResponse {

    private final String paymentStatus;
    private final String orderId;
    private final String trackingUrl;
    private final String responseMessage;

}