package com.aethernet.voicegateway.dto.request;

import java.util.List;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MerchantVerificationRequest {
    
    @NotNull(message = "Merchant id is required")
    private String merchantId;
    
    @NotNull(message = "Merchant name is required")
    private String merchantName;
    
    private List<OrderItemRequest> items;
    
    
    @Data
    public static class OrderItemRequest {
        private String name;
        private Integer quantity = 1;
        
    }
}