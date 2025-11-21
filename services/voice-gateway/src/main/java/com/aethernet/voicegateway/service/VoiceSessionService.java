package com.aethernet.voicegateway.service;

import com.aethernet.voicegateway.dto.request.*;
import com.aethernet.voicegateway.dto.response.*;
import com.aethernet.voicegateway.model.VoiceSession;

public interface VoiceSessionService {
    SessionResponse createSession(SessionCreateRequest request, String transactionId);
    AddressVerificationResponse verifyAddress(String sessionId, AddressVerificationRequest request);
    ProviderVerificationResponse verifyProvider(String sessionId, ProviderVerificationRequest request);
    QuoteResponse calculateQuote(String sessionId, QuoteRequest request);
    OrderConfirmationResponse confirmOrder(String sessionId, OrderConfirmationRequest request);
    PaymentResponse processPayment(String sessionId, PaymentRequest request);
    void cancelSession(String sessionId, CancelRequest request);
    VoiceSession getSessionOrThrow(String sessionId);
    boolean isSessionActive(String sessionId);
}
