package com.aethernet.user.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

@Data
@Configuration
@ConfigurationProperties(prefix = "app.admin")
public class AdminUserProperties {

    /**
     * Enable/disable seeding the admin user on startup.
     */
    private boolean seedEnabled = true;

    /**
     * Admin login email.
     */
    private String email;

    /**
     * Plaintext password to encode during seeding.
     */
    private String password;

    private String firstName = "System";
    private String lastName = "Administrator";
}
