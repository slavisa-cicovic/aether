package com.aethernet.voicegateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.aethernet.voicegateway.config.filters.ConfigurableAuthFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
                http
                                .csrf(csrf -> csrf.disable())
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authorizeHttpRequests(authz -> authz
                                                .requestMatchers(
                                                                "/health",
                                                                "/info",
                                                                "/actuator/health",
                                                                "/swagger-ui.html",
                                                                "/swagger-ui/**",
                                                                "/swagger-ui/index.html",
                                                                "/api-docs",
                                                                "/api-docs/**",
                                                                "/webjars/**",
                                                                "/swagger-resources/**",
                                                                "/configuration/**",
                                                                "/v3/api-docs",
                                                                "/v3/api-docs/**")
                                                .permitAll()
                                                .requestMatchers("/analytics/**").hasRole("ADMIN")
                                                .requestMatchers("/v1/voice/sessions/**").hasRole("VOICE_AGENT") // Zahtevaju
                                                                                                                 // autentifikaciju
                                                .anyRequest().authenticated() // Ostali zahtevaju auth
                                )
                                .addFilterBefore(configurableAuthFilter(), UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        @Bean
        public ConfigurableAuthFilter configurableAuthFilter() {
                return new ConfigurableAuthFilter();
        }
}