package com.aethernet.provider.config;

import java.math.BigDecimal;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Data;

@Data
@ConfigurationProperties(prefix = "transport")
public class TransportPricingProperties {
    private BigDecimal basePrice = BigDecimal.valueOf(300);
}
