package com.aethernet.voicegateway.dto.request;

import java.util.List;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProviderVerificationRequest {

    @NotNull(message = "Provider id is required")
    private String providerId;

    @NotNull(message = "Provider name is required")
    private String providerName;

    private List<OrderItemRequest> items;

    @Data
    public static class OrderItemRequest {
        private String name;
        private Integer quantity = 1;
    }
}
