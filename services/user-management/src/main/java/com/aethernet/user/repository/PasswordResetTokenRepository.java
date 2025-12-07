package com.aethernet.user.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aethernet.user.domain.PasswordResetToken;
import com.aethernet.user.domain.User;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Integer> {

    Optional<PasswordResetToken> findByTokenAndUsedFalseAndExpiresAtAfter(String token, LocalDateTime now);

    List<PasswordResetToken> findAllByUserAndUsedFalseAndExpiresAtAfter(User user, LocalDateTime now);
}
