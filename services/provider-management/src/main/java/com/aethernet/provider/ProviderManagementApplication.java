package com.aethernet.provider;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.context.annotation.Import;

import com.aethernet.common.health.HealthConfiguration;

@SpringBootApplication
@ConfigurationPropertiesScan
@Import(HealthConfiguration.class)
public class ProviderManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProviderManagementApplication.class, args);
    }
}
