package com.aethernet.voicegateway.exception;

public class NoDronesAvailableException extends RuntimeException {
    private final String zone;
    
    public NoDronesAvailableException(String zone) {
        super("No drones available in zone: " + zone);
        this.zone = zone;
    }
    
    public String getZone() {
        return zone;
    }
}