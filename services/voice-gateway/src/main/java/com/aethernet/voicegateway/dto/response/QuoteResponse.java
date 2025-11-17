package com.aethernet.voicegateway.dto.response;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class QuoteResponse {
    
    private final Boolean deliveryAvailable;
    private final Integer estimatedDeliveryMinutes;
    private final PriceBreakdown breakdown;
    private final String currency;
    private final String responseMessage;
    
    
    @Data
    public static class PriceBreakdown {
        private final BigDecimal itemsTotal;
        private final BigDecimal deliveryFee;
        private final BigDecimal total;
    }
}