package com.aethernet.provider.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.aethernet.provider.dto.ProviderQuotaResponse;
import com.aethernet.provider.dto.ProviderVerificationRequest;
import com.aethernet.provider.model.PricedItem;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface QuotaMapper {

    @Mapping(target = "quantity", source = "quantity", defaultValue = "1")
    @Mapping(target = "unitPrice", source = "unitPrice", defaultValue = "0")
    PricedItem toPricedItem(ProviderVerificationRequest.ProviderItemPrice dto);

    List<PricedItem> toPricedItems(List<ProviderVerificationRequest.ProviderItemPrice> dto);

    ProviderQuotaResponse.ResponseItem toResponseItem(PricedItem item);

    List<ProviderQuotaResponse.ResponseItem> toResponseItems(List<PricedItem> items);
}
