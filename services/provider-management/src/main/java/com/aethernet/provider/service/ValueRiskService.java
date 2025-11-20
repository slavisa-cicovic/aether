package com.aethernet.provider.service;

import org.springframework.stereotype.Service;

@Service
public class ValueRiskService {

    public double resolveMultiplier(long totalValue) {
        if (totalValue < 2000) {
            return 1.0;
        }
        if (totalValue < 7000) {
            return 1.05;
        }
        if (totalValue < 20000) {
            return 1.15;
        }
        return 1.30;
    }
}
