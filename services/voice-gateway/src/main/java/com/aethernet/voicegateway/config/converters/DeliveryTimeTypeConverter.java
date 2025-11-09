package com.aethernet.voicegateway.config.converters;

import org.springframework.core.convert.converter.Converter;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

import com.aethernet.voicegateway.dto.request.QuoteRequest;

@Component
public class DeliveryTimeTypeConverter implements Converter<String, QuoteRequest.DeliveryTimeType> {
    
    @Override
    public QuoteRequest.DeliveryTimeType convert(@NonNull String source) {
        if (source == null || source.trim().isEmpty()) {
            return null;
        }
        return QuoteRequest.DeliveryTimeType.fromValue(source);
    }
}