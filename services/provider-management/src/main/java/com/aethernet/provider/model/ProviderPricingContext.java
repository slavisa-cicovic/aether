package com.aethernet.provider.model;

import java.util.List;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class ProviderPricingContext {
    ProviderCategory category;
    List<PricedItem> items;
    long totalValue;
}
