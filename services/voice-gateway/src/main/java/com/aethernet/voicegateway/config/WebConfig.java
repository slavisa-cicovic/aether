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

import com.aethernet.voicegateway.config.converters.CancelReasonConverter;
import com.aethernet.voicegateway.config.converters.DeliveryTimeTypeConverter;
import com.aethernet.voicegateway.config.converters.PaymentMethodConverter;
import com.aethernet.voicegateway.config.converters.PaymentRequestMethodConverter;
import com.aethernet.voicegateway.config.interceptors.RequestLoggingInterceptor;
import com.aethernet.voicegateway.config.interceptors.TransactionIdInterceptor;

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

    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        registry.addMapping("/v1/**")
                .allowedOrigins(
                        "http://localhost:3000", // React dev server
                        "https://app.aethernet.com", // Production frontend
                        "https://staging.aethernet.com" // Staging frontend
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .exposedHeaders(
                        "X-Transaction-ID",
                        "X-Session-ID",
                        "X-Request-ID")
                .allowCredentials(true)
                .maxAge(3600); // 1 sat cache za preflight
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