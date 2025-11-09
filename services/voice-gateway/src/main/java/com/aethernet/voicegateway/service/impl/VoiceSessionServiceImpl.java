package com.aethernet.voicegateway.service.impl;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aethernet.voicegateway.dto.request.AddressVerificationRequest;
import com.aethernet.voicegateway.dto.request.CancelRequest;
import com.aethernet.voicegateway.dto.request.MerchantVerificationRequest;
import com.aethernet.voicegateway.dto.request.OrderConfirmationRequest;
import com.aethernet.voicegateway.dto.request.PaymentRequest;
import com.aethernet.voicegateway.dto.request.QuoteRequest;
import com.aethernet.voicegateway.dto.request.SessionCreateRequest;
import com.aethernet.voicegateway.dto.response.AddressVerificationResponse;
import com.aethernet.voicegateway.dto.response.MerchantVerificationResponse;
import com.aethernet.voicegateway.dto.response.OrderConfirmationResponse;
import com.aethernet.voicegateway.dto.response.PaymentResponse;
import com.aethernet.voicegateway.dto.response.QuoteResponse;
import com.aethernet.voicegateway.dto.response.SessionResponse;
import com.aethernet.voicegateway.exception.AddressVerificationException;
import com.aethernet.voicegateway.exception.DuplicateSessionException;
import com.aethernet.voicegateway.exception.MerchantNotFoundException;
import com.aethernet.voicegateway.exception.NoDronesAvailableException;
import com.aethernet.voicegateway.exception.PaymentProcessingException;
import com.aethernet.voicegateway.exception.SessionNotFoundException;
import com.aethernet.voicegateway.model.VoiceSession;
import com.aethernet.voicegateway.repository.VoiceSessionRepository;
import com.aethernet.voicegateway.service.VoiceSessionService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
public class VoiceSessionServiceImpl implements VoiceSessionService {

    @Autowired
    private VoiceSessionRepository voiceSessionRepository;

    @Override
    public SessionResponse createSession(SessionCreateRequest request, String transactionId) {
        log.info("Creating new voice session for phone: {}, callSid: {}", request.getUserPhoneNumber(),
                request.getCallSid());
        try {
            VoiceSession session = new VoiceSession();
            session.setSessionId(generateSessionId());
            session.setUserPhoneNumber(request.getUserPhoneNumber());
            session.setCallSid(request.getCallSid());
            session.setLanguage(request.getLanguage());
            session.setStatus("active");
            session.setTransactionId(transactionId);

            VoiceSession savedSession = voiceSessionRepository.save(session);

            log.info("Voice session created successfully: {}", savedSession.getSessionId());

            return new SessionResponse(
                    savedSession.getSessionId(),
                    savedSession.getStatus(),
                    "Dobrodošli u AetherNet. Da li želite da naručite novu dostavu?");

        } catch (DataIntegrityViolationException e) {
            log.warn("Duplicate call SID detected: {}", request.getCallSid());
            throw new DuplicateSessionException(
                    "Već postoji aktivna sesija za ovaj poziv. Molimo pokušajte ponovo.",
                    request.getCallSid());
        } catch (Exception e) {
            log.error("Failed to create session for callSid: {}", request.getCallSid(), e);
            throw new RuntimeException("Došlo je do greške pri kreiranju sesije. Molimo pokušajte ponovo.");
        }
    }

    @Override
    public AddressVerificationResponse verifyAddress(String sessionId, AddressVerificationRequest request) {
        log.info("Verifying address for session: {}, address: {}", sessionId, request.getSpokenAddress());
        VoiceSession session = getSessionOrThrow(sessionId);
        validateSessionIsActive(session);

        // Simulacija address verification logike
        String spokenAddress = request.getSpokenAddress();

        // Provera za ambiguous address
        if (spokenAddress.toLowerCase().contains("123") && !spokenAddress.contains("123 ")) {
            throw new AddressVerificationException(
                    "Našao sam više adresa. Da li ste mislili na Bulevar Kralja Aleksandra 123 ili Bulevar Kralja Aleksandra 123a?",
                    "ADDRESS_AMBIGUOUS",
                    List.of("Bulevar Kralja Aleksandra 123", "Bulevar Kralja Aleksandra 123a"));
        }

        // Simulacija uspešne verifikacije
        AddressVerificationResponse.VerifiedAddress verifiedAddress = new AddressVerificationResponse.VerifiedAddress(
                "Bulevar Kralja Aleksandra 123",
                "stan 5",
                "Beograd",
                "11000",
                44.8125,
                20.4612);

        session.markAddressVerified();
        voiceSessionRepository.save(session);

        log.info("Address verified for session: {} in {} seconds", sessionId, session.getAddressVerificationDuration());
        return new AddressVerificationResponse(
                verifiedAddress,
                0.95,
                "Hvala. Šta želite da naručite i od koga?");
    }

    @Override
    public MerchantVerificationResponse verifyMerchant(String sessionId, MerchantVerificationRequest request) {
        VoiceSession session = getSessionOrThrow(sessionId);
        validateSessionIsActive(session);

        String merchantName = request.getMerchantName();
        String merchantId = request.getMerchantId();

        // Simulacija provere dostupnosti pošiljaoca
        if ("Nepostojeći Bistro".equalsIgnoreCase(merchantName)) {
            List<MerchantNotFoundException.AlternativeMerchant> alternatives = List.of(
                    new MerchantNotFoundException.AlternativeMerchant("merch_456abc", "Bistro Moskva", 0.8),
                    new MerchantNotFoundException.AlternativeMerchant("merch_123def", "Cafe Drina", 1.2));

            throw new MerchantNotFoundException(merchantName, alternatives);
        }

        session.markMerchantVerified(merchantId, merchantName);
        voiceSessionRepository.save(session);

        log.info("Merchant verified for session: {} in {} seconds",
                sessionId, session.getMerchantVerificationDuration());

        // Simulacija uspešne provere
        return new MerchantVerificationResponse(
                "merch_789xyz",
                "Bistro Slavija",
                true,
                15,
                "Odličan izbor. Kada želite da vam dostavimo? Odmah ili određeno vreme?");
    }

    @Override
    public QuoteResponse calculateQuote(String sessionId, QuoteRequest request) {
        VoiceSession session = getSessionOrThrow(sessionId);
        validateSessionIsActive(session);

        // Simulacija provere dostupnosti dronova
        if (session.getUserPhoneNumber().endsWith("9999")) {
            throw new NoDronesAvailableException("zone_beograd_centar");
        }

        // Simulacija kalkulacije cene
        QuoteResponse.PriceBreakdown breakdown = new QuoteResponse.PriceBreakdown(
                new BigDecimal("650.00"),
                new BigDecimal("200.00"),
                new BigDecimal("850.00"));

        return new QuoteResponse(
                true,
                25,
                breakdown,
                "RSD",
                "Vaša dostava će stići za 25 minuta. Ukupna cena je 850 dinara, uključujući dostavu. Da li potvrđujete narudžbinu?");
    }

    @Override
    public OrderConfirmationResponse confirmOrder(String sessionId, OrderConfirmationRequest request) {
        VoiceSession session = getSessionOrThrow(sessionId);
        validateSessionIsActive(session);

        if (!Boolean.TRUE.equals(request.getUserConfirmed())) {
            throw new RuntimeException("User did not confirm the order");
        }

        // Simulacija kreiranja narudžbine
        String orderId = "order_aeth" + UUID.randomUUID().toString().substring(0, 8);
        String paymentIntentId = "pi_" + UUID.randomUUID().toString().substring(0, 8);

        // Ažuriraj status sesije
        session.setStatus("order_confirmed");
        voiceSessionRepository.save(session);

        return new OrderConfirmationResponse(
                orderId,
                "pending_payment",
                paymentIntentId,
                "Hvala. Kako želite da platite? Karticom preko telefona ili novčanikom u aplikaciji?");
    }

    @Override
    public PaymentResponse processPayment(String sessionId, PaymentRequest request) {
        VoiceSession session = getSessionOrThrow(sessionId);

        if (!"order_confirmed".equals(session.getStatus())) {
            throw new IllegalStateException(
                    "Narudžbina nije potvrđena. Molimo potvrdite narudžbinu pre plaćanja. Status: "
                            + session.getStatus());
        }

        if (session.getPaymentProcessedAt() != null) {
            throw new IllegalStateException("Plaćanje je već procesirano za ovu narudžbinu");
        }

        // Simulacija procesiranja plaćanja
        if (request.getPaymentDetails() != null &&
                "fail".equals(request.getPaymentDetails().getToken())) {
            throw new PaymentProcessingException(
                    "Payment failed due to insufficient funds",
                    "pi_abc123",
                    "INSUFFICIENT_FUNDS");
        }

        // Simulacija uspešnog plaćanja
        String orderId = "order_aeth789012";

        // Ažuriraj status sesije
        session.markPaymentProcessed();
        voiceSessionRepository.save(session);

        log.info("Payment processed for session: {}. Total session duration: {} seconds",
                sessionId, session.getTotalSessionDuration());

        return new PaymentResponse(
                "succeeded",
                orderId,
                "https://track.aethernet.com/" + orderId,
                "Vaša narudžbina je prihvaćena! Broj vaše pošiljke je AETH-789-012. Dron će krenuti uskoro. Pratite njegov let putem SMS linka koji ćete dobiti. Hvala što koristite AetherNet!");
    }

    @Override
    public void cancelSession(String sessionId, CancelRequest request) {
        VoiceSession session = getSessionOrThrow(sessionId);

        session.markCancelled(request.getReason().name());
        voiceSessionRepository.save(session);

        log.info("Session cancelled: {}. Reason: {}. Total duration: {} seconds",
                sessionId, request.getReason(), session.getTotalCallDurationSeconds());
        voiceSessionRepository.save(session);
    }

    @Override
    public VoiceSession getSessionOrThrow(String sessionId) {
        return voiceSessionRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new SessionNotFoundException(sessionId));
    }

    @Override
    public boolean isSessionActive(String sessionId) {
        return voiceSessionRepository.findBySessionId(sessionId)
                .map(session -> "active".equals(session.getStatus()))
                .orElse(false);
    }

    // Private helper methods
    private void validateSessionIsActive(VoiceSession session) {
        if (!"active".equals(session.getStatus())) {
            throw new RuntimeException("Session is not active: " + session.getStatus());
        }
    }

    private String generateSessionId() {
        return "sess_" + UUID.randomUUID().toString().substring(0, 13);
    }
}