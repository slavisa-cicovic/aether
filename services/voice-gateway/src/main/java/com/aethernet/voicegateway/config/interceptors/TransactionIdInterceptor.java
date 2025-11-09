package com.aethernet.voicegateway.config.interceptors;

import java.util.UUID;

import org.slf4j.MDC;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class TransactionIdInterceptor implements HandlerInterceptor {

    private static final String TRANSACTION_ID_HEADER = "X-Transaction-ID";
    private static final String MDC_TRANSACTION_KEY = "transactionId";

     
    @Override
    public boolean preHandle(@NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull Object handler) throws Exception {

        String transactionId = request.getHeader(TRANSACTION_ID_HEADER);

        // Ako nema transaction ID, generišemo novi
        if (transactionId == null || transactionId.trim().isEmpty()) {
            transactionId = generateTransactionId();
            log.warn("Missing X-Transaction-ID header, generated: {}", transactionId);
        }

        // Set transaction ID za response
        response.setHeader(TRANSACTION_ID_HEADER, transactionId);

        // Set u MDC (Mapped Diagnostic Context) za logging
        MDC.put(MDC_TRANSACTION_KEY, transactionId);

        // Set kao request attribute za korišćenje u servicima
        request.setAttribute(TRANSACTION_ID_HEADER, transactionId);

        return true;
    }

    @Override
    public void afterCompletion(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull Object handler,
            @Nullable Exception ex) {
        // Cleanup MDC
        MDC.remove(MDC_TRANSACTION_KEY);
    }

    private String generateTransactionId() {
        return "txn-" + UUID.randomUUID().toString().substring(0, 8);
    }
}