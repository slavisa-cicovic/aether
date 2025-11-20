package com.aethernet.provider.service;

import java.security.SecureRandom;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import com.aethernet.provider.dto.ProviderVerificationRequest;
import com.aethernet.provider.model.PricedItem;
import com.aethernet.provider.model.ProviderCategory;
import com.aethernet.provider.model.ProviderPricingContext;

@Component
public class FakeProviderPriceProvider {

    private static final int MIN_PRICE = 10;
    private static final int MAX_PRICE = 200;
    private final SecureRandom random = new SecureRandom();

    public ProviderPricingContext enrichPricing(ProviderVerificationRequest request, List<PricedItem> mappedItems) {
        List<PricedItem> items = CollectionUtils.isEmpty(mappedItems)
                ? List.of(defaultItem())
                : mappedItems.stream()
                        .map(this::fillPriceIfMissing)
                        .collect(Collectors.toList());

        long totalValue = items.stream()
                .mapToLong(item -> (long) item.getQuantity() * item.getUnitPrice())
                .sum();

        ProviderCategory category = pickRandomCategory();

        return ProviderPricingContext.builder()
                .category(category)
                .items(items)
                .totalValue(totalValue)
                .build();
    }

    private ProviderCategory pickRandomCategory() {
        ProviderCategory[] categories = ProviderCategory.values();
        return categories[random.nextInt(categories.length)];
    }

    private PricedItem fillPriceIfMissing(PricedItem item) {
        int price = item.getUnitPrice() > 0 ? item.getUnitPrice() : randomPrice();
        int qty = item.getQuantity() > 0 ? item.getQuantity() : 1;
        return PricedItem.builder()
                .name(item.getName())
                .quantity(qty)
                .unitPrice(price)
                .build();
    }

    private PricedItem defaultItem() {
        return PricedItem.builder()
                .name("item")
                .quantity(1)
                .unitPrice(randomPrice())
                .build();
    }

    private int randomPrice() {
        return random.nextInt((MAX_PRICE - MIN_PRICE) + 1) + MIN_PRICE;
    }
}
