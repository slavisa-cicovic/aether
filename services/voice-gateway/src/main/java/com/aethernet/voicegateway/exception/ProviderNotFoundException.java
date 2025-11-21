package com.aethernet.voicegateway.exception;

import java.util.List;

public class ProviderNotFoundException extends RuntimeException {
    private final String providerName;
    private final List<AlternativeProvider> alternativeProviders;

    public ProviderNotFoundException(String providerName, List<AlternativeProvider> alternativeProviders) {
        super("Provider not found: " + providerName);
        this.providerName = providerName;
        this.alternativeProviders = alternativeProviders;
    }

    public String getProviderName() {
        return providerName;
    }

    public List<AlternativeProvider> getAlternativeProviders() {
        return alternativeProviders;
    }

    public static class AlternativeProvider {
        private final String id;
        private final String name;
        private final Double distanceKm;
        
        public AlternativeProvider(String id, String name, Double distanceKm) {
            this.id = id;
            this.name = name;
            this.distanceKm = distanceKm;
        }
        
        public String getId() { return id; }
        public String getName() { return name; }
        public Double getDistanceKm() { return distanceKm; }
    }
}
