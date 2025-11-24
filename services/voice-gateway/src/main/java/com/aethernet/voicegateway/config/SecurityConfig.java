package com.aethernet.voicegateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

import com.aethernet.common.cors.CorsConfig;
import com.aethernet.common.health.HealthConfiguration;
import com.aethernet.voicegateway.config.AuthProperties.AuthMode;
import com.aethernet.voicegateway.config.filters.ConfigurableAuthFilter;
import com.aethernet.voicegateway.security.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@Import({ CorsConfig.class, HealthConfiguration.class })
public class SecurityConfig {

        private final AuthProperties authProperties;
        private final ConfigurableAuthFilter configurableAuthFilter;
        private final JwtAuthenticationFilter jwtAuthenticationFilter;
        private final CorsConfigurationSource corsConfigurationSource;

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
                http
                                .cors(cors -> cors.configurationSource(corsConfigurationSource))
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
                                                .requestMatchers("/v1/voice/sessions/**").hasRole("VOICE_AGENT")
                                                .anyRequest().authenticated()
                                );

                if (authProperties.getMode() == AuthMode.DUMMY) {
                        http.addFilterBefore(configurableAuthFilter, UsernamePasswordAuthenticationFilter.class);
                } else {
                        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
                }

                return http.build();
        }
}
