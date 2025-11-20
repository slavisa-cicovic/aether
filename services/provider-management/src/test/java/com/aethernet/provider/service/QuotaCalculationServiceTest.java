package com.aethernet.provider.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.aethernet.provider.config.TransportPricingProperties;
import com.aethernet.provider.dto.ProviderQuotaResponse;
import com.aethernet.provider.dto.ProviderVerificationRequest;
import com.aethernet.provider.mapper.QuotaMapper;
import com.aethernet.provider.model.EndUserCategory;
import com.aethernet.provider.model.PricedItem;
import com.aethernet.provider.model.ProviderCategory;
import com.aethernet.provider.model.ProviderPricingContext;

class QuotaCalculationServiceTest {

    private QuotaCalculationService service;

    @Mock
    private FakeProviderPriceProvider fakeProviderPriceProvider;

    @Mock
    private CalendarRuleService calendarRuleService;

    @Mock
    private ValueRiskService valueRiskService;

    private final QuotaMapper quotaMapper = Mappers.getMapper(QuotaMapper.class);

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        TransportPricingProperties props = new TransportPricingProperties();
        props.setBasePrice(BigDecimal.valueOf(300));
        service = new QuotaCalculationService(quotaMapper, fakeProviderPriceProvider, calendarRuleService,
                valueRiskService, props);
    }

    @Test
    void calculatesQuotaWithMultipliers() {
        ProviderVerificationRequest request = new ProviderVerificationRequest();
        request.setProviderId("provider-1");
        request.setProviderName("Demo");

        ProviderVerificationRequest.ProviderItemPrice item = new ProviderVerificationRequest.ProviderItemPrice();
        item.setName("item1");
        item.setQuantity(2);
        item.setUnitPrice(150);
        request.setItems(List.of(item));

        ProviderPricingContext context = ProviderPricingContext.builder()
                .category(ProviderCategory.DEFAULT)
                .items(List.of(PricedItem.builder().name("item1").quantity(2).unitPrice(150).build()))
                .totalValue(300)
                .build();

        when(fakeProviderPriceProvider.enrichPricing(request, quotaMapper.toPricedItems(request.getItems())))
                .thenReturn(context);
        when(calendarRuleService.resolveMultiplier("provider-1")).thenReturn(1.2);
        when(valueRiskService.resolveMultiplier(300)).thenReturn(1.05);

        ProviderQuotaResponse response = service.calculate(request, EndUserCategory.HEAVY);

        assertThat(response.getFinalTransportPrice()).isEqualByComparingTo("340.20");
        assertThat(response.getCalendarMultiplier()).isEqualTo(1.2);
        assertThat(response.getUserMultiplier()).isEqualTo(0.9);
        assertThat(response.getProviderMultiplier()).isEqualTo(1.0);
    }
}
