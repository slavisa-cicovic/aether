package com.aethernet.voicegateway.controller;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aethernet.voicegateway.service.AnalyticsService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/analytics")
@Tag(name = "Analytics", description = "API za analytics i reporting")
@SecurityRequirement(name = "bearerAuth")
public class AnalyticsController {
    
    @Autowired
    private AnalyticsService analyticsService;
    
    @GetMapping("/sessions")
    public ResponseEntity<Map<String, Object>> getSessionAnalytics(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to) {
        
        // Default to last 7 days if not specified
        if (from == null) {
            from = LocalDateTime.now().minusDays(7);
        }
        if (to == null) {
            to = LocalDateTime.now();
        }
        
        Map<String, Object> analytics = analyticsService.getSessionAnalytics(from, to);
        return ResponseEntity.ok(analytics);
    }
    
    @GetMapping("/daily")
    public ResponseEntity<Map<String, Object>> getDailyMetrics() {
        Map<String, Object> metrics = analyticsService.getDailyMetrics();
        return ResponseEntity.ok(metrics);
    }
}