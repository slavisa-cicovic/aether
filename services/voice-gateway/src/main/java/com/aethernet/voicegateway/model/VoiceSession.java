package com.aethernet.voicegateway.model;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Entity
@Table(name = "voice_sessions", uniqueConstraints = {
    @UniqueConstraint(name = "uk_voice_sessions_call_sid", columnNames = "call_sid"),
    @UniqueConstraint(name = "uk_voice_sessions_session_id", columnNames = "session_id")
}, indexes = {
    @Index(name = "idx_phone_status", columnList = "user_phone_number, status"),
    @Index(name = "idx_created_at", columnList = "created_at"),
    @Index(name = "idx_call_sid", columnList = "call_sid"),
    @Index(name = "idx_transaction_id", columnList = "transaction_id")
})
@Data
public class VoiceSession {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(name = "session_id", unique = true, nullable = false, length = 50)
    @NotNull(message = "Session ID cannot be null")
    private String sessionId;
    
    @Column(name = "user_phone_number", nullable = false, length = 20)
    @NotNull(message = "Phone number cannot be null")
    @Pattern(regexp = "^\\+[1-9]\\d{1,14}$", message = "Phone number must be in E.164 format")
    private String userPhoneNumber;
    
    @Column(name = "call_sid", nullable = false, length = 50)
    @NotNull(message = "Call SID cannot be null")
    private String callSid;
    
    @Column(name = "language", nullable = false, length = 10)
    @NotNull(message = "Language cannot be null")
    private String language = "sr-Latn";
    
    @Column(name = "status", nullable = false, length = 20)
    @NotNull(message = "Status cannot be null")
    private String status = "active"; // active, completed, cancelled, expired
    
    @Column(name = "transaction_id", length = 50)
    private String transactionId;
    
    // TIMING FIELDS - NOVO
    @Column(name = "call_started_at")
    private LocalDateTime callStartedAt;
    
    @Column(name = "session_created_at")
    private LocalDateTime sessionCreatedAt;
    
    @Column(name = "address_verified_at")
    private LocalDateTime addressVerifiedAt;
    
    @Column(name = "provider_verified_at")
    private LocalDateTime providerVerifiedAt;
    
    @Column(name = "quote_calculated_at")
    private LocalDateTime quoteCalculatedAt;
    
    @Column(name = "order_confirmed_at")
    private LocalDateTime orderConfirmedAt;
    
    @Column(name = "payment_processed_at")
    private LocalDateTime paymentProcessedAt;
    
    @Column(name = "session_completed_at")
    private LocalDateTime sessionCompletedAt;
    
    @Column(name = "total_call_duration_seconds")
    private Integer totalCallDurationSeconds;
    
    // ORDER DETAILS - NOVO
    @Column(name = "order_id", length = 50)
    private String orderId;
    
    @Column(name = "provider_id", length = 50)
    private String providerId;
    
    @Column(name = "provider_name", length = 100)
    private String providerName;
    
    @Column(name = "delivery_address", columnDefinition = "TEXT")
    private String deliveryAddress;
    
    @Column(name = "total_amount", precision = 10, scale = 2)
    private java.math.BigDecimal totalAmount;
    
    @Column(name = "currency", length = 3)
    private String currency = "RSD";
    
    // TECHNICAL METADATA - NOVO
    @Column(name = "user_agent", length = 500)
    private String userAgent;
    
    @Column(name = "ip_address", length = 45)
    private String ipAddress;
    
    @Column(name = "metadata", columnDefinition = "JSON")
    private String metadata; // JSON za dodatne podatke
    
    // AUDIT FIELDS
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @Column(name = "expires_at")
    private LocalDateTime expiresAt;
    
    // Constructors
    public VoiceSession() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
        this.sessionCreatedAt = now;
        this.expiresAt = now.plusHours(1);
    }
    
    public VoiceSession(String sessionId, String userPhoneNumber, String callSid, String language) {
        this();
        this.sessionId = sessionId;
        this.userPhoneNumber = userPhoneNumber;
        this.callSid = callSid;
        this.language = language;
    }
    
    // TIMING METHODS - NOVO
    public void markAddressVerified() {
        this.addressVerifiedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public void markProviderVerified(String providerId, String providerName) {
        this.providerVerifiedAt = LocalDateTime.now();
        this.providerId = providerId;
        this.providerName = providerName;
        this.updatedAt = LocalDateTime.now();
    }
    
    public void markQuoteCalculated(java.math.BigDecimal totalAmount, String currency) {
        this.quoteCalculatedAt = LocalDateTime.now();
        this.totalAmount = totalAmount;
        this.currency = currency;
        this.updatedAt = LocalDateTime.now();
    }
    
    public void markOrderConfirmed(String orderId) {
        this.orderConfirmedAt = LocalDateTime.now();
        this.orderId = orderId;
        this.updatedAt = LocalDateTime.now();
    }
    
    public void markPaymentProcessed() {
        this.paymentProcessedAt = LocalDateTime.now();
        this.status = "completed";
        this.sessionCompletedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        
        // Calculate total call duration
        if (this.callStartedAt != null) {
            this.totalCallDurationSeconds = (int) java.time.Duration.between(
                this.callStartedAt, this.sessionCompletedAt
            ).getSeconds();
        }
    }
    
    public void markCancelled(String reason) {
        this.status = "cancelled";
        this.sessionCompletedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        
        // Store cancellation reason in metadata
        if (this.metadata == null) {
            this.metadata = "{\"cancellation_reason\": \"" + reason + "\"}";
        }
        
        // Calculate total call duration even for cancelled sessions
        if (this.callStartedAt != null) {
            this.totalCallDurationSeconds = (int) java.time.Duration.between(
                this.callStartedAt, this.sessionCompletedAt
            ).getSeconds();
        }
    }
    
    // DURATION CALCULATION METHODS - NOVO
    public Integer getAddressVerificationDuration() {
        if (sessionCreatedAt != null && addressVerifiedAt != null) {
            return (int) java.time.Duration.between(sessionCreatedAt, addressVerifiedAt).getSeconds();
        }
        return null;
    }
    
    public Integer getProviderVerificationDuration() {
        if (addressVerifiedAt != null && providerVerifiedAt != null) {
            return (int) java.time.Duration.between(addressVerifiedAt, providerVerifiedAt).getSeconds();
        }
        return null;
    }
    
    public Integer getQuoteCalculationDuration() {
        if (providerVerifiedAt != null && quoteCalculatedAt != null) {
            return (int) java.time.Duration.between(providerVerifiedAt, quoteCalculatedAt).getSeconds();
        }
        return null;
    }
    
    public Integer getOrderConfirmationDuration() {
        if (quoteCalculatedAt != null && orderConfirmedAt != null) {
            return (int) java.time.Duration.between(quoteCalculatedAt, orderConfirmedAt).getSeconds();
        }
        return null;
    }
    
    public Integer getPaymentProcessingDuration() {
        if (orderConfirmedAt != null && paymentProcessedAt != null) {
            return (int) java.time.Duration.between(orderConfirmedAt, paymentProcessedAt).getSeconds();
        }
        return null;
    }
    
    public Integer getTotalSessionDuration() {
        if (sessionCreatedAt != null && sessionCompletedAt != null) {
            return (int) java.time.Duration.between(sessionCreatedAt, sessionCompletedAt).getSeconds();
        }
        return null;
    }
    
    // PrePersist and PreUpdate
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (updatedAt == null) {
            updatedAt = LocalDateTime.now();
        }
        if (sessionCreatedAt == null) {
            sessionCreatedAt = LocalDateTime.now();
        }
        if (expiresAt == null) {
            expiresAt = LocalDateTime.now().plusHours(1);
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
}
