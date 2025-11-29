package com.aethernet.common.health;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@Tag(name = "Health", description = "Health check and monitoring endpoints")
public class HealthController {

    private final String serviceName;
    private final String serviceVersion;
    private final String serviceDescription;

    public HealthController(
            @Value("${spring.application.name:Aether Service}") String serviceName,
            @Value("${app.info.version:}") String serviceVersion,
            @Value("${app.info.description:}") String serviceDescription) {
        this.serviceName = serviceName;
        this.serviceVersion = serviceVersion;
        this.serviceDescription = serviceDescription;
    }

    @Operation(summary = "Health check", description = "Checks if the service is running and responsive. Does not require authentication.")
    @GetMapping("/v1/health")
    public Map<String, Object> health() {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("status", "UP");
        payload.put("service", serviceName);
        payload.put("timestamp", Instant.now().toString());
        return payload;
    }

    @Operation(summary = "Service info", description = "Returns basic information about the service. Does not require authentication.")
    @GetMapping("/v1/info")
    public Map<String, Object> info() {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("name", serviceName);
        if (!serviceVersion.isBlank()) {
            payload.put("version", serviceVersion);
        }
        if (!serviceDescription.isBlank()) {
            payload.put("description", serviceDescription);
        }
        payload.put("timestamp", Instant.now().toString());
        return payload;
    }
}
