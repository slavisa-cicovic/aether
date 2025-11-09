package com.aethernet.voicegateway.exception;

import java.util.List;

public class MerchantNotFoundException extends RuntimeException {
    private final String merchantName;
    private final List<AlternativeMerchant> alternativeMerchants;
    
    public MerchantNotFoundException(String merchantName, List<AlternativeMerchant> alternativeMerchants) {
        super("Merchant not found: " + merchantName);
        this.merchantName = merchantName;
        this.alternativeMerchants = alternativeMerchants;
    }
    
    public String getMerchantName() {
        return merchantName;
    }
    
    public List<AlternativeMerchant> getAlternativeMerchants() {
        return alternativeMerchants;
    }
    
    public static class AlternativeMerchant {
        private final String id;
        private final String name;
        private final Double distanceKm;
        
        public AlternativeMerchant(String id, String name, Double distanceKm) {
            this.id = id;
            this.name = name;
            this.distanceKm = distanceKm;
        }
        
        public String getId() { return id; }
        public String getName() { return name; }
        public Double getDistanceKm() { return distanceKm; }
    }
}