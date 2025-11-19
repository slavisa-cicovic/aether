package com.aethernet.user.config;

import java.util.Objects;
import java.util.Set;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

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
        if (!userRepository.existsByEmail("admin@local")) {

            User admin = User.builder()
                    .email("admin@local")
                    .passwordHash(Objects.requireNonNull(passwordEncoder.encode("admin")))
                    .firstName("System")
                    .lastName("Administrator")
                    .roles(Set.of(adminRole))
                    .active(true)
                    .locked(false)
                    .deleted(false)
                    .build();

            userRepository.save(Objects.requireNonNull(admin));

            log.info("✔ Created default admin user: admin@local / admin");
        } else {
            log.error("✔ Admin user already exists.");
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
