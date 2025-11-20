package com.aethernet.provider.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aethernet.provider.model.ProviderCalendarRule;

public interface ProviderCalendarRuleRepository extends JpaRepository<ProviderCalendarRule, Long> {
    List<ProviderCalendarRule> findByProviderProviderId(String providerId);
}
