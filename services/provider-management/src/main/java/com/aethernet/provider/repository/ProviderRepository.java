package com.aethernet.provider.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aethernet.provider.model.Provider;

public interface ProviderRepository extends JpaRepository<Provider, String> {
}
