package com.aethernet.voicegateway.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonValue;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class QuoteRequest {
    
    @NotNull(message = "Delivery time type is required")
    private DeliveryTimeType deliveryTimeType;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'")
    private LocalDateTime scheduledTime;
    
    // Constructors
    public QuoteRequest() {}
    
    public QuoteRequest(DeliveryTimeType deliveryTimeType) {
        this.deliveryTimeType = deliveryTimeType;
    }
    
     public QuoteRequest(DeliveryTimeType deliveryTimeType, LocalDateTime scheduledTime) {
        this.deliveryTimeType = deliveryTimeType;
        this.scheduledTime = scheduledTime;
    }
    
    // Getters and Setters
    public DeliveryTimeType getDeliveryTimeType() { return deliveryTimeType; }
    public void setDeliveryTimeType(DeliveryTimeType deliveryTimeType) { this.deliveryTimeType = deliveryTimeType; }
    
    public LocalDateTime getScheduledTime() { return scheduledTime; }
    public void setScheduledTime(LocalDateTime scheduledTime) { this.scheduledTime = scheduledTime; }
    

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