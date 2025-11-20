package com.aethernet.user.config;

import java.util.Objects;
import java.util.Set;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;

import com.aethernet.user.domain.Role;
import com.aethernet.user.domain.User;
import com.aethernet.user.repository.RoleRepository;
import com.aethernet.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AdminUserProperties adminUserProperties;

    @Override
    public void run(String... args) {

        // -------------------------------------------------------
        // 1. Create Roles if they do not exist
        // -------------------------------------------------------
        Role adminRole = ensureRoleExists("ADMIN", "Administrator role");
        ensureRoleExists("USER", "Default user role");

        // -------------------------------------------------------
        // 2. Create Admin User if not exists
        // -------------------------------------------------------
        if (!adminUserProperties.isSeedEnabled()) {
            log.info("Admin user seeding is disabled via configuration.");
            return;
        }

        if (!StringUtils.hasText(adminUserProperties.getEmail())
                || !StringUtils.hasText(adminUserProperties.getPassword())) {
            log.warn("Skipping admin user creation; app.admin.email/password not configured.");
            return;
        }

        // -------------------------------------------------------
        // 2. Create Admin User if not exists
        // -------------------------------------------------------
        if (!userRepository.existsByEmail(adminUserProperties.getEmail())) {

            User admin = User.builder()
                    .email(adminUserProperties.getEmail())
                    .passwordHash(Objects.requireNonNull(
                            passwordEncoder.encode(adminUserProperties.getPassword())))
                    .firstName(adminUserProperties.getFirstName())
                    .lastName(adminUserProperties.getLastName())
                    .roles(Set.of(adminRole))
                    .active(true)
                    .locked(false)
                    .deleted(false)
                    .build();

            userRepository.save(Objects.requireNonNull(admin));

            log.info("✔ Created default admin user: {}", adminUserProperties.getEmail());
        } else {
            log.info("✔ Admin user already exists: {}", adminUserProperties.getEmail());
        }
    }

    private Role ensureRoleExists(String roleName, String description) {
        return roleRepository.findByName(roleName)
                .orElseGet(() -> createRole(roleName, description));
    }

    @SuppressWarnings("null")
    private Role createRole(String roleName, String description) {
        Role role = Role.builder()
                .name(Objects.requireNonNull(roleName))
                .description(Objects.requireNonNull(description))
                .build();

        Role saved = Objects.requireNonNull(roleRepository.save(role), "Failed to save role: " + roleName);
        return saved;
    }
}
