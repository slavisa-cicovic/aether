package com.aethernet.voicegateway.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.aethernet.voicegateway.model.VoiceSession;
import com.aethernet.voicegateway.repository.VoiceSessionRepository;
import com.aethernet.voicegateway.service.AnalyticsService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    @Autowired
    private VoiceSessionRepository voiceSessionRepository;

    public Map<String, Object> getSessionAnalytics(LocalDateTime from, LocalDateTime to) {
        Map<String, Object> analytics = new HashMap<>();

        try {
            // Completed sessions in period
            var completedSessions = voiceSessionRepository.findCompletedSessionsInPeriod(from, to);

            analytics.put("total_completed_sessions", completedSessions.size());

            // Average durations
            Double avgSessionDuration = voiceSessionRepository.getAverageSessionDuration();
            Double avgAddressDuration = voiceSessionRepository.getAverageAddressVerificationDuration();
            Double avgMerchantDuration = voiceSessionRepository.getAverageMerchantVerificationDuration();
            Double avgQuoteDuration = voiceSessionRepository.getAverageQuoteCalculationDuration();

            analytics.put("average_session_duration_seconds",
                    avgSessionDuration != null ? Math.round(avgSessionDuration) : 0);
            analytics.put("average_address_verification_seconds",
                    avgAddressDuration != null ? Math.round(avgAddressDuration) : 0);
            analytics.put("average_merchant_verification_seconds",
                    avgMerchantDuration != null ? Math.round(avgMerchantDuration) : 0);
            analytics.put("average_quote_calculation_seconds",
                    avgQuoteDuration != null ? Math.round(avgQuoteDuration) : 0);

            // Success rate
            Long completedCount = voiceSessionRepository.countSessionsByStatusSince("completed", from);
            Long cancelledCount = voiceSessionRepository.countSessionsByStatusSince("cancelled", from);
            Long totalCount = completedCount + cancelledCount;

            if (totalCount > 0) {
                double successRate = (double) completedCount / totalCount * 100;
                analytics.put("success_rate_percent", Math.round(successRate * 100.0) / 100.0);
            } else {
                analytics.put("success_rate_percent", 0);
            }

            // Additional metrics
            analytics.put("total_sessions_completed", voiceSessionRepository.countCompletedSessions());
            analytics.put("total_sessions_cancelled", voiceSessionRepository.countCancelledSessions());

            // Recent sessions for sampling
            List<VoiceSession> recentSessions = voiceSessionRepository.findRecentCompletedSessions(
                    PageRequest.of(0, 5));
            analytics.put("recent_session_ids",
                    recentSessions.stream().map(VoiceSession::getSessionId).collect(Collectors.toList()));

        } catch (Exception e) {
            log.error("Error calculating analytics", e);
            analytics.put("error", "Failed to calculate analytics");
        }

        return analytics;
    }

    public Map<String, Object> getDailyMetrics() {
        Map<String, Object> metrics = new HashMap<>();

        try {
            List<Object[]> dailyRates = voiceSessionRepository.getDailySuccessRates();
            List<Map<String, Object>> dailyMetrics = new ArrayList<>();

            for (Object[] dailyRate : dailyRates) {
                Map<String, Object> dayMetric = new HashMap<>();
                dayMetric.put("date", dailyRate[0]);
                dayMetric.put("completed_sessions", dailyRate[1]);
                dayMetric.put("cancelled_sessions", dailyRate[2]);

                Long completed = (Long) dailyRate[1];
                Long cancelled = (Long) dailyRate[2];
                Long total = completed + cancelled;

                if (total > 0) {
                    double successRate = (double) completed / total * 100;
                    dayMetric.put("success_rate", Math.round(successRate * 100.0) / 100.0);
                } else {
                    dayMetric.put("success_rate", 0);
                }

                dailyMetrics.add(dayMetric);
            }

            metrics.put("daily_metrics", dailyMetrics);

        } catch (Exception e) {
            log.error("Error calculating daily metrics", e);
            metrics.put("error", "Failed to calculate daily metrics");
        }

        return metrics;
    }
}