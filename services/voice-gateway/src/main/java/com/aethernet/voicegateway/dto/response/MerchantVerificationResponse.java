package com.aethernet.voicegateway.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class MerchantVerificationResponse {
    
    private final String merchantId;
    private final String merchantName;
    private final Boolean isAvailable;
    private final Integer estimatedPreparationTime;
    private final String responseMessage;
    
    // Constructor
    public MerchantVerificationResponse(String merchantId, String merchantName, Boolean isAvailable, 
                                      Integer estimatedPreparationTime, String responseMessage) {
        this.merchantId = merchantId;
        this.merchantName = merchantName;
        this.isAvailable = isAvailable;
        this.estimatedPreparationTime = estimatedPreparationTime;
        this.responseMessage = responseMessage;
    }
    
    // Getters
    public String getMerchantId() { return merchantId; }
    public String getMerchantName() { return merchantName; }
    public Boolean getIsAvailable() { return isAvailable; }
    public Integer getEstimatedPreparationTime() { return estimatedPreparationTime; }
    public String getResponseMessage() { return responseMessage; }
}