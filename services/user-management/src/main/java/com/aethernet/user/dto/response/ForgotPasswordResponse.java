package com.aethernet.user.dto.response;

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
public class ForgotPasswordResponse {

    private String message;

    /**
     * Token is included for development/testing scenarios where email delivery is not
     * wired. Do not expose this in production UIs.
     */
    private String resetToken;
}
