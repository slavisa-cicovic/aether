package com.aethernet.provider.model;

public enum EndUserCategory {
    DEFAULT(1.0),
    HEAVY(0.9),
    PREMIUM(0.8);

    private final double multiplier;

    EndUserCategory(double multiplier) {
        this.multiplier = multiplier;
    }

    public double multiplier() {
        return multiplier;
    }
}
