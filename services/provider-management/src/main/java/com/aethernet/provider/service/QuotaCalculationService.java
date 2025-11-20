package com.aethernet.provider.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

import org.springframework.stereotype.Service;

import com.aethernet.provider.config.TransportPricingProperties;
import com.aethernet.provider.dto.ProviderQuotaResponse;
import com.aethernet.provider.dto.ProviderVerificationRequest;
import com.aethernet.provider.mapper.QuotaMapper;
import com.aethernet.provider.model.EndUserCategory;
import com.aethernet.provider.model.PricedItem;
import com.aethernet.provider.model.ProviderPricingContext;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class QuotaCalculationService {

    private final QuotaMapper quotaMapper;
    private final FakeProviderPriceProvider fakeProviderPriceProvider;
    private final CalendarRuleService calendarRuleService;
    private final ValueRiskService valueRiskService;
    private final TransportPricingProperties pricingProperties;

    public ProviderQuotaResponse calculate(ProviderVerificationRequest request, EndUserCategory userCategory) {
        List<PricedItem> mappedItems = request.getItems() == null
                ? List.of()
                : quotaMapper.toPricedItems(request.getItems());
        ProviderPricingContext pricingContext = fakeProviderPriceProvider.enrichPricing(request, mappedItems);

        BigDecimal base = pricingProperties.getBasePrice();
        double calendarMultiplier = calendarRuleService.resolveMultiplier(request.getProviderId());
        double userMultiplier = userCategory.multiplier();
        double providerMultiplier = pricingContext.getCategory().multiplier();
        double valueRiskMultiplier = valueRiskService.resolveMultiplier(pricingContext.getTotalValue());

        BigDecimal finalPrice = base
                .multiply(BigDecimal.valueOf(calendarMultiplier))
                .multiply(BigDecimal.valueOf(userMultiplier))
                .multiply(BigDecimal.valueOf(providerMultiplier))
                .multiply(BigDecimal.valueOf(valueRiskMultiplier))
                .setScale(2, RoundingMode.HALF_UP);

        return ProviderQuotaResponse.builder()
                .providerId(request.getProviderId())
                .providerName(request.getProviderName())
                .items(quotaMapper.toResponseItems(pricingContext.getItems()))
                .totalValue(pricingContext.getTotalValue())
                .baseTransportPrice(base)
                .calendarMultiplier(calendarMultiplier)
                .userMultiplier(userMultiplier)
                .providerMultiplier(providerMultiplier)
                .valueRiskMultiplier(valueRiskMultiplier)
                .finalTransportPrice(finalPrice)
                .build();
    }
}
