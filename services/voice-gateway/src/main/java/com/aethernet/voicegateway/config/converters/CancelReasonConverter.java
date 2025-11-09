package com.aethernet.voicegateway.config.converters;

import org.springframework.core.convert.converter.Converter;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

import com.aethernet.voicegateway.dto.request.CancelRequest;

@Component
public class CancelReasonConverter implements Converter<String, CancelRequest.CancelReason> {
    
    @Override
    public CancelRequest.CancelReason convert(@NonNull String source) {
        if (source == null || source.trim().isEmpty()) {
            return null;
        }
        return CancelRequest.CancelReason.fromValue(source);
    }
}