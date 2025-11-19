package com.aethernet.user.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ErrorResponse {
    private String message;
    private String error;
    private int status;
    private String path;
    private long timestamp;
}
