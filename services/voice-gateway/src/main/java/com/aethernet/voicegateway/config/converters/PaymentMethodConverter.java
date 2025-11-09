package com.aethernet.voicegateway.config.converters;

import org.springframework.core.convert.converter.Converter;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

import com.aethernet.voicegateway.dto.request.OrderConfirmationRequest;

@Component
public class PaymentMethodConverter implements Converter<String, OrderConfirmationRequest.PaymentMethod> {
    
    @Override
    public OrderConfirmationRequest.PaymentMethod convert(@NonNull String source) {
        if (source == null || source.trim().isEmpty()) {
            return null;
        }
        return OrderConfirmationRequest.PaymentMethod.fromValue(source);
    }
}