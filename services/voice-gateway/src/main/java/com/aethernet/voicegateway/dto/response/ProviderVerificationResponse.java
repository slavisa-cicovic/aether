package com.aethernet.voicegateway.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProviderVerificationResponse {

    private final String providerId;
    private final String providerName;
    private final Boolean isAvailable;
    private final Integer estimatedPreparationTime;
    private final String responseMessage;

    public ProviderVerificationResponse(String providerId, String providerName, Boolean isAvailable,
                                      Integer estimatedPreparationTime, String responseMessage) {
        this.providerId = providerId;
        this.providerName = providerName;
        this.isAvailable = isAvailable;
        this.estimatedPreparationTime = estimatedPreparationTime;
        this.responseMessage = responseMessage;
    }

    public String getProviderId() { return providerId; }
    public String getProviderName() { return providerName; }
    public Boolean getIsAvailable() { return isAvailable; }
    public Integer getEstimatedPreparationTime() { return estimatedPreparationTime; }
    public String getResponseMessage() { return responseMessage; }
}
