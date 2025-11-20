package com.aethernet.provider.model;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class PricedItem {
    String name;
    int quantity;
    int unitPrice;
}
