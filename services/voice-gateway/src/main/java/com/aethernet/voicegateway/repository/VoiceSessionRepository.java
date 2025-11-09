package com.aethernet.voicegateway.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aethernet.voicegateway.model.VoiceSession;

@Repository
public interface VoiceSessionRepository extends JpaRepository<VoiceSession, UUID> {
    
    // Pronalazi sesiju po sessionId (public ID)
    Optional<VoiceSession> findBySessionId(String sessionId);
    
    // Pronalazi aktivne sesije za određenog korisnika
    List<VoiceSession> findByUserPhoneNumberAndStatus(String userPhoneNumber, String status);
    
    // Pronalazi sesije po callSid (telekom operator ID)
    Optional<VoiceSession> findByCallSid(String callSid);
    
    // Proverava da li postoji aktivna sesija za callSid
    boolean existsByCallSidAndStatus(String callSid, String status);
    
    // Pronalazi sve sesije starije od određenog vremena (za cleanup)
    List<VoiceSession> findByCreatedAtBefore(LocalDateTime dateTime);
    
    // Pronalazi sesije po statusu
    List<VoiceSession> findByStatus(String status);
    
    // Custom query za pronalaženje sesija sa određenim statusom i telefonom
    @Query("SELECT vs FROM VoiceSession vs WHERE vs.userPhoneNumber = :phoneNumber AND vs.status IN :statuses")
    List<VoiceSession> findByPhoneNumberAndStatuses(
        @Param("phoneNumber") String phoneNumber,
        @Param("statuses") List<String> statuses
    );
    
    // Custom query za update statusa sesije
    @Query("UPDATE VoiceSession vs SET vs.status = :newStatus WHERE vs.sessionId = :sessionId")
    void updateSessionStatus(@Param("sessionId") String sessionId, @Param("newStatus") String newStatus);
    
    // Broji aktivne sesije za određenog korisnika
    @Query("SELECT COUNT(vs) FROM VoiceSession vs WHERE vs.userPhoneNumber = :phoneNumber AND vs.status = 'active'")
    long countActiveSessionsByPhoneNumber(@Param("phoneNumber") String phoneNumber);


    // ANALYTICS QUERIES
    @Query("SELECT vs FROM VoiceSession vs WHERE vs.sessionCompletedAt BETWEEN :start AND :end")
    List<VoiceSession> findCompletedSessionsInPeriod(@Param("start") LocalDateTime start, 
                                                   @Param("end") LocalDateTime end);
    
    // Umesto totalSessionDuration (koji je calculated), koristimo sessionCompletedAt i sessionCreatedAt
    @Query("SELECT AVG(TIMESTAMPDIFF(SECOND, vs.sessionCreatedAt, vs.sessionCompletedAt)) " +
           "FROM VoiceSession vs WHERE vs.status = 'completed' AND vs.sessionCompletedAt IS NOT NULL")
    Double getAverageSessionDuration();
    
    @Query("SELECT AVG(TIMESTAMPDIFF(SECOND, vs.sessionCreatedAt, vs.addressVerifiedAt)) " +
           "FROM VoiceSession vs WHERE vs.addressVerifiedAt IS NOT NULL")
    Double getAverageAddressVerificationDuration();
    
    @Query("SELECT AVG(TIMESTAMPDIFF(SECOND, vs.addressVerifiedAt, vs.merchantVerifiedAt)) " +
           "FROM VoiceSession vs WHERE vs.addressVerifiedAt IS NOT NULL AND vs.merchantVerifiedAt IS NOT NULL")
    Double getAverageMerchantVerificationDuration();
    
    @Query("SELECT AVG(TIMESTAMPDIFF(SECOND, vs.merchantVerifiedAt, vs.quoteCalculatedAt)) " +
           "FROM VoiceSession vs WHERE vs.merchantVerifiedAt IS NOT NULL AND vs.quoteCalculatedAt IS NOT NULL")
    Double getAverageQuoteCalculationDuration();
    
    @Query("SELECT COUNT(vs) FROM VoiceSession vs WHERE vs.status = :status AND vs.createdAt >= :since")
    Long countSessionsByStatusSince(@Param("status") String status, 
                                   @Param("since") LocalDateTime since);
    
    @Query("SELECT vs FROM VoiceSession vs WHERE " +
           "TIMESTAMPDIFF(SECOND, vs.sessionCreatedAt, vs.sessionCompletedAt) > :threshold " +
           "AND vs.sessionCompletedAt IS NOT NULL")
    List<VoiceSession> findLongCalls(@Param("threshold") Integer thresholdSeconds);
    
    // DODATNE ANALYTICS METODE
    @Query("SELECT COUNT(vs) FROM VoiceSession vs WHERE vs.status = 'completed'")
    Long countCompletedSessions();
    
    @Query("SELECT COUNT(vs) FROM VoiceSession vs WHERE vs.status = 'cancelled'")
    Long countCancelledSessions();
    
    @Query("SELECT vs FROM VoiceSession vs WHERE vs.sessionCompletedAt IS NOT NULL " +
           "ORDER BY vs.sessionCompletedAt DESC")
    List<VoiceSession> findRecentCompletedSessions(Pageable pageable);
    
    // Success rate po danu
    @Query("SELECT FUNCTION('DATE', vs.sessionCompletedAt) as date, " +
           "COUNT(CASE WHEN vs.status = 'completed' THEN 1 END) as completed, " +
           "COUNT(CASE WHEN vs.status = 'cancelled' THEN 1 END) as cancelled " +
           "FROM VoiceSession vs " +
           "WHERE vs.sessionCompletedAt IS NOT NULL " +
           "GROUP BY FUNCTION('DATE', vs.sessionCompletedAt) " +
           "ORDER BY date DESC")
    List<Object[]> getDailySuccessRates();
}