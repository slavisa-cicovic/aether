package com.aethernet.voicegateway.config.converters;

import org.springframework.core.convert.converter.Converter;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

import com.aethernet.voicegateway.dto.request.PaymentRequest;

@Component
public class PaymentRequestMethodConverter implements Converter<String, PaymentRequest.PaymentMethod> {
    
    @Override
    public PaymentRequest.PaymentMethod convert(@NonNull String source) {
        if (source == null || source.trim().isEmpty()) {
            return null;
        }
        return PaymentRequest.PaymentMethod.fromValue(source);
    }
}