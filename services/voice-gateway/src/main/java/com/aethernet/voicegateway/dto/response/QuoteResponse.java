package com.aethernet.voicegateway.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.math.BigDecimal;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class QuoteResponse {
    
    private final Boolean deliveryAvailable;
    private final Integer estimatedDeliveryMinutes;
    private final PriceBreakdown breakdown;
    private final String currency;
    private final String responseMessage;
    
    // Constructor
    public QuoteResponse(Boolean deliveryAvailable, Integer estimatedDeliveryMinutes, 
                        PriceBreakdown breakdown, String currency, String responseMessage) {
        this.deliveryAvailable = deliveryAvailable;
        this.estimatedDeliveryMinutes = estimatedDeliveryMinutes;
        this.breakdown = breakdown;
        this.currency = currency;
        this.responseMessage = responseMessage;
    }
    
    // Getters
    public Boolean getDeliveryAvailable() { return deliveryAvailable; }
    public Integer getEstimatedDeliveryMinutes() { return estimatedDeliveryMinutes; }
    public PriceBreakdown getBreakdown() { return breakdown; }
    public String getCurrency() { return currency; }
    public String getResponseMessage() { return responseMessage; }
    
    // Nested DTO for price breakdown
    public static class PriceBreakdown {
        private final BigDecimal itemsTotal;
        private final BigDecimal deliveryFee;
        private final BigDecimal total;
        
        // Constructor
        public PriceBreakdown(BigDecimal itemsTotal, BigDecimal deliveryFee, BigDecimal total) {
            this.itemsTotal = itemsTotal;
            this.deliveryFee = deliveryFee;
            this.total = total;
        }
        
        // Getters
        public BigDecimal getItemsTotal() { return itemsTotal; }
        public BigDecimal getDeliveryFee() { return deliveryFee; }
        public BigDecimal getTotal() { return total; }
    }
}