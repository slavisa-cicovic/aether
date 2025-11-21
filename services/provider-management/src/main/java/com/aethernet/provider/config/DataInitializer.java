package com.aethernet.provider.config;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import com.aethernet.provider.model.CalendarRuleType;
import com.aethernet.provider.model.Provider;
import com.aethernet.provider.model.ProviderCalendarRule;
import com.aethernet.provider.model.ProviderCategory;
import com.aethernet.provider.repository.ProviderCalendarRuleRepository;
import com.aethernet.provider.repository.ProviderRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@RequiredArgsConstructor
@SuppressWarnings("null")
public class DataInitializer implements CommandLineRunner {

        private final ProviderRepository providerRepository;
        private final ProviderCalendarRuleRepository calendarRuleRepository;

        @Override
        public void run(String... args) {
                Provider provider = providerRepository.findById("provider-1")
                                .orElseGet(() -> providerRepository.save(Provider.builder()
                                                .providerId("provider-1")
                                                .name("Demo Provider")
                                                .category(ProviderCategory.DEFAULT)
                                                .build()));

                if (calendarRuleRepository.findByProviderProviderId(provider.getProviderId()).isEmpty()) {
                        ProviderCalendarRule weekday = ProviderCalendarRule.builder()
                                        .provider(provider)
                                        .ruleType(CalendarRuleType.WORKDAY)
                                        .rrule("FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR")
                                        .multiplier(BigDecimal.valueOf(1.0))
                                        .build();

                        ProviderCalendarRule weekend = ProviderCalendarRule.builder()
                                        .provider(provider)
                                        .ruleType(CalendarRuleType.WEEKEND)
                                        .rrule("FREQ=WEEKLY;BYDAY=SA,SU")
                                        .multiplier(BigDecimal.valueOf(1.2))
                                        .build();

                        ProviderCalendarRule holiday = ProviderCalendarRule.builder()
                                        .provider(provider)
                                        .ruleType(CalendarRuleType.HOLIDAY)
                                        .rrule("FREQ=YEARLY;BYMONTHDAY=" + LocalDate.now().getDayOfMonth() + ";BYMONTH="
                                                        + LocalDate.now().getMonthValue())
                                        .multiplier(BigDecimal.valueOf(1.3))
                                        .build();

                        calendarRuleRepository.saveAll(List.of(weekday, weekend, holiday));
                        log.info("Seeded calendar rules for provider {}", provider.getProviderId());
                }
        }
}
