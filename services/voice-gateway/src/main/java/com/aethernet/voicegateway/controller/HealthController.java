package com.aethernet.voicegateway.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@Tag(name = "Health", description = "Health check and monitoring endpoints")
public class HealthController {
    
    @Operation(
        summary = "Health check",
        description = "Checks if the service is running and responsive. Does not require authentication."
    )
    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP", "service", "AetherVoice Gateway");
    }
    
    @Operation(
        summary = "Service info", 
        description = "Returns basic information about the service. Does not require authentication."
    )
    @GetMapping("/info")
    public Map<String, Object> info() {
        return Map.of(
            "name", "AetherVoice Gateway",
            "version", "1.0.0", 
            "description", "Backend service for voice agent integration"
        );
    }
}