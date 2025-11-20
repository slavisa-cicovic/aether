package com.aethernet.provider.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProviderQuotaResponse {

    private String providerId;
    private String providerName;
    private List<ResponseItem> items;
    private long totalValue;

    private BigDecimal baseTransportPrice;
    private double calendarMultiplier;
    private double userMultiplier;
    private double providerMultiplier;
    private double valueRiskMultiplier;
    private BigDecimal finalTransportPrice;

    @Data
    @Builder
    public static class ResponseItem {
        private String name;
        private int qty;
        private int unitPrice;
    }
}
