package com.aethernet.voicegateway.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.aethernet.voicegateway.config.filters.ConfigurableAuthFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

        @Autowired
        private CorsProperties corsProperties;

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
                http
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
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

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();

                if (corsProperties.getAllowedOrigins() != null && !corsProperties.getAllowedOrigins().isEmpty()) {
                        configuration.setAllowedOrigins(corsProperties.getAllowedOrigins());
                }
                configuration.setAllowedMethods(corsProperties.getAllowedMethods());
                configuration.setAllowedHeaders(corsProperties.getAllowedHeaders());
                configuration.setExposedHeaders(corsProperties.getExposedHeaders());
                configuration.setAllowCredentials(corsProperties.isAllowCredentials());
                configuration.setMaxAge(corsProperties.getMaxAge());

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration); 
                source.registerCorsConfiguration("/v1/**", configuration);

                return source;
        }
}