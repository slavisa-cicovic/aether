package com.aethernet.user.domain;

import java.time.LocalDateTime;

import org.springframework.lang.NonNull;

import com.aethernet.user.domain.audit.BaseAuditEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "password_reset_tokens")
public class PasswordResetToken extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NonNull
    @Column(name = "token", nullable = false, unique = true, length = 255)
    private String token;

    @NonNull
    @Column(name = "expires_at", nullable = false, columnDefinition = "datetime(3)")
    private LocalDateTime expiresAt;

    @Builder.Default
    @Column(nullable = false)
    private boolean used = false;

    @Column(name = "used_at", columnDefinition = "datetime(3)")
    private LocalDateTime usedAt;

    @NonNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
