package com.aethernet.voicegateway.service;

import java.time.LocalDateTime;
import java.util.Map;

public interface AnalyticsService {

    Map<String, Object> getSessionAnalytics(LocalDateTime from, LocalDateTime to);

    public Map<String, Object> getDailyMetrics();

}