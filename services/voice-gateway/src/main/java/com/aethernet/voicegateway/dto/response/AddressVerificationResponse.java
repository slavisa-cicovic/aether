package com.aethernet.voicegateway.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class AddressVerificationResponse {
    
    private final VerifiedAddress verifiedAddress;
    private final Double confidenceScore;
    private final String responseMessage;
    
    // Constructor
    public AddressVerificationResponse(VerifiedAddress verifiedAddress, Double confidenceScore, String responseMessage) {
        this.verifiedAddress = verifiedAddress;
        this.confidenceScore = confidenceScore;
        this.responseMessage = responseMessage;
    }
    
    // Getters
    public VerifiedAddress getVerifiedAddress() { return verifiedAddress; }
    public Double getConfidenceScore() { return confidenceScore; }
    public String getResponseMessage() { return responseMessage; }
    
    // Nested DTO for verified address
    public static class VerifiedAddress {
        private final String street;
        private final String apartment;
        private final String city;
        private final String zipCode;
        private final Double latitude;
        private final Double longitude;
        
        // Constructor
        public VerifiedAddress(String street, String apartment, String city, String zipCode, Double latitude, Double longitude) {
            this.street = street;
            this.apartment = apartment;
            this.city = city;
            this.zipCode = zipCode;
            this.latitude = latitude;
            this.longitude = longitude;
        }
        
        // Getters
        public String getStreet() { return street; }
        public String getApartment() { return apartment; }
        public String getCity() { return city; }
        public String getZipCode() { return zipCode; }
        public Double getLatitude() { return latitude; }
        public Double getLongitude() { return longitude; }
    }
}