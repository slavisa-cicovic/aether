package com.aethernet.voicegateway.dto.request;

import java.time.OffsetDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonValue;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class QuoteRequest {
    
    @NotNull(message = "Delivery time type is required")
    private DeliveryTimeType deliveryTimeType;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss[.SSS]X")
    private OffsetDateTime scheduledTime;
    

    // Enum for delivery time types
    public enum DeliveryTimeType {
        NOW("now"),
        SCHEDULED("scheduled");
        
        private final String value;
        
        DeliveryTimeType(String value) {
            this.value = value;
        }
        
        @JsonValue
        public String getValue() {
            return value;
        }
        
        // Metoda za konverziju iz stringa
        public static DeliveryTimeType fromValue(String value) {
            for (DeliveryTimeType type : DeliveryTimeType.values()) {
                if (type.value.equalsIgnoreCase(value)) {
                    return type;
                }
            }
            throw new IllegalArgumentException("Unknown delivery time type: " + value);
        }
    }
}
