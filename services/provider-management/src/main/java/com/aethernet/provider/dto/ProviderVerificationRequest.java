package com.aethernet.provider.dto;

import java.util.List;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProviderVerificationRequest {

    @NotNull
    private String providerId;

    @NotNull
    private String providerName;

    private List<ProviderItemPrice> items;

    @Data
    public static class ProviderItemPrice {
        private String name;
        private Integer quantity = 1;
        private Integer unitPrice;
    }
}
