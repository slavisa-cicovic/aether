package com.aethernet.voicegateway.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.aethernet.common.cors.CorsProperties;
import com.aethernet.voicegateway.config.converters.CancelReasonConverter;
import com.aethernet.voicegateway.config.converters.DeliveryTimeTypeConverter;
import com.aethernet.voicegateway.config.converters.PaymentMethodConverter;
import com.aethernet.voicegateway.config.converters.PaymentRequestMethodConverter;
import com.aethernet.voicegateway.config.interceptors.RequestLoggingInterceptor;
import com.aethernet.voicegateway.config.interceptors.TransactionIdInterceptor;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
public class WebConfig implements WebMvcConfigurer {

        @Autowired
        private DeliveryTimeTypeConverter deliveryTimeTypeConverter;

        @Autowired
        private PaymentMethodConverter paymentMethodConverter;

        @Autowired
        private PaymentRequestMethodConverter paymentRequestMethodConverter;

        @Autowired
        private CancelReasonConverter cancelReasonConverter;
        @Autowired
        private CorsProperties corsProperties;

        @SuppressWarnings("null")
        @Override
        public void addCorsMappings(@NonNull CorsRegistry registry) {
                if (corsProperties.getAllowedOrigins() != null && !corsProperties.getAllowedOrigins().isEmpty()) {

                        registry.addMapping("/v1/**")
                                        .allowedOrigins(corsProperties.getAllowedOrigins().toArray(new String[0]))
                                        .allowedMethods(corsProperties.getAllowedMethods().toArray(new String[0]))
                                        .allowedHeaders(corsProperties.getAllowedHeaders().toArray(new String[0]))
                                        .exposedHeaders(corsProperties.getExposedHeaders().toArray(new String[0]))
                                        .allowCredentials(corsProperties.isAllowCredentials())
                                        .maxAge(corsProperties.getMaxAge());
                }
        }

        @Override
        public void addInterceptors(@NonNull InterceptorRegistry registry) {
                // Logging interceptor za sve requestove
                registry.addInterceptor(new RequestLoggingInterceptor())
                                .addPathPatterns("/v1/**")
                                .excludePathPatterns("/health", "/info");

                // Transaction ID validation interceptor
                registry.addInterceptor(new TransactionIdInterceptor())
                                .addPathPatterns("/v1/voice/sessions/**");
        }

        @Override
        public void configureMessageConverters(@NonNull List<HttpMessageConverter<?>> converters) {
                // Spring Boot već konfiguriše osnovne message converters
                // Ovo je mesto za custom converters ako su potrebni
        }

        @SuppressWarnings("null")
        @Override
        public void addFormatters(@NonNull FormatterRegistry registry) {
                registry.addConverter(deliveryTimeTypeConverter);
                registry.addConverter(paymentMethodConverter);
                registry.addConverter(paymentRequestMethodConverter);
                registry.addConverter(cancelReasonConverter);
        }

        @Override
        public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
                registry.addResourceHandler("/swagger-ui.html**")
                                .addResourceLocations("classpath:/META-INF/resources/");

                registry.addResourceHandler("/webjars/**")
                                .addResourceLocations("classpath:/META-INF/resources/webjars/");
        }
}