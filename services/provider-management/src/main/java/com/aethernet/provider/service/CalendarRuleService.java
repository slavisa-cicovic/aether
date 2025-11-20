package com.aethernet.provider.service;

import java.time.Clock;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.aethernet.provider.model.ProviderCalendarRule;
import com.aethernet.provider.repository.ProviderCalendarRuleRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.fortuna.ical4j.model.DateTime;
import net.fortuna.ical4j.model.Period;
import net.fortuna.ical4j.model.Recur;
import net.fortuna.ical4j.model.parameter.Value;
import net.fortuna.ical4j.model.property.RRule;

@Slf4j
@Service
@RequiredArgsConstructor
public class CalendarRuleService {

    private final ProviderCalendarRuleRepository ruleRepository;
    private final Clock clock = Clock.systemDefaultZone();

    public double resolveMultiplier(String providerId) {
        List<ProviderCalendarRule> rules = ruleRepository.findByProviderProviderId(providerId);
        if (rules.isEmpty()) {
            return 1.0;
        }

        LocalDateTime now = LocalDateTime.now(clock);

        Optional<ProviderCalendarRule> matched = rules.stream()
                .filter(rule -> matches(rule, now))
                .max(Comparator.comparing(ProviderCalendarRule::getMultiplier));

        return matched.map(r -> r.getMultiplier().doubleValue()).orElse(1.0);
    }

    private boolean matches(ProviderCalendarRule rule, LocalDateTime dateTime) {
        try {
            RRule rrule = new RRule(rule.getRrule());
            Recur recur = rrule.getRecur();

            LocalDate currentDate = dateTime.toLocalDate();
            DateTime periodStart = new DateTime(currentDate.atStartOfDay(ZoneId.systemDefault()).toInstant().toEpochMilli());
            DateTime periodEnd = new DateTime(currentDate.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant().toEpochMilli());
            Period period = new Period(periodStart, periodEnd);

            var dates = recur.getDates(periodStart, period, Value.DATE_TIME);
            return dates.stream().anyMatch(d -> isSameDay(d, currentDate));
        } catch (Exception ex) {
            log.warn("Failed to evaluate rrule {}: {}", rule.getRrule(), ex.getMessage());
            return false;
        }
    }

    private boolean isSameDay(Object dateObj, LocalDate currentDate) {
        if (dateObj instanceof DateTime dt) {
            LocalDate ruleDate = dt.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
            return ruleDate.isEqual(currentDate);
        }
        return false;
    }
}
