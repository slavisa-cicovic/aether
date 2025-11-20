package com.aethernet.provider.model;

public enum ProviderCategory {
    DEFAULT(1.0),
    HEAVY_PROVIDER(0.95),
    UNVERIFIED(1.1);

    private final double multiplier;

    ProviderCategory(double multiplier) {
        this.multiplier = multiplier;
    }

    public double multiplier() {
        return multiplier;
    }
}
