package com.aethernet.voicegateway.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "addresses")
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "session_id")
    private String sessionId;
    
    @Column(name = "spoken_address")
    private String spokenAddress;
    
    @Column(name = "verified_street")
    private String verifiedStreet;
    
    @Column(name = "apartment")
    private String apartment;
    
    @Column(name = "city")
    private String city;
    
    @Column(name = "zip_code")
    private String zipCode;
    
    @Column(name = "latitude", precision = 10, scale = 6)
    private BigDecimal latitude;
    
    @Column(name = "longitude", precision = 10, scale = 6)
    private BigDecimal longitude;
    
    @Column(name = "confidence_score")
    private Double confidenceScore;
    
    // Getters and setters...
}