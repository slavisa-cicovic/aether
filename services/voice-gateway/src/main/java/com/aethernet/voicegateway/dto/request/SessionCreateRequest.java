package com.aethernet.voicegateway.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Schema(description = "Zahtev za kreiranje nove glasovne sesije")
@Data
public class SessionCreateRequest {
    
     @Schema(
        description = "User phone number u E.164 formatu",
        example = "+381641234567",
        required = true
    )
    @NotNull(message = "Phone number is required")
    @Pattern(regexp = "^\\+[1-9]\\d{1,14}$", message = "Phone number must be in E.164 format")
    private String userPhoneNumber;
    
    @Schema(
        description = "Jedinstveni ID poziva od telekom operatora",
        example = "CA1234567890abcdef",
        required = true
    )
    @NotNull(message = "Call SID is required")
    private String callSid;
    
    @Schema(
        description = "Jezik korisnika",
        example = "sr-Latn",
        defaultValue = "sr-Latn"
    )
    private String language = "sr-Latn";
    
    
}