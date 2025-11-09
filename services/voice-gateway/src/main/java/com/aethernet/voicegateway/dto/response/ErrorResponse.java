package com.aethernet.voicegateway.dto.response;

import java.time.LocalDateTime;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;

import io.swagger.v3.oas.annotations.media.Schema;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(description = "Standardizovani error response")
public record ErrorResponse(
    @Schema(description = "Vreme kada se error desio", example = "2024-01-15T10:30:00")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    LocalDateTime timestamp,
    
    @Schema(description = "HTTP status kod", example = "400")
    Integer status,
    
    @Schema(description = "HTTP error poruka", example = "Bad Request")
    String error,
    
    @Schema(description = "Detaljna poruka o grešci", example = "Validation failed")
    String message,
    
    @Schema(description = "API putanja gde se error desio", example = "/v1/voice/sessions")
    String path,
    
    @Schema(description = "Aplikacioni error kod", example = "VALIDATION_ERROR")
    String errorCode,
    
    @Schema(description = "Dodatni detalji o grešci")
    Map<String, Object> details
) {
    // Builder pattern za lakše kreiranje
    public static ErrorResponseBuilder builder() {
        return new ErrorResponseBuilder();
    }
    
    public static class ErrorResponseBuilder {
        private LocalDateTime timestamp;
        private Integer status;
        private String error;
        private String message;
        private String path;
        private String errorCode;
        private Map<String, Object> details;
        
        public ErrorResponseBuilder timestamp(LocalDateTime timestamp) {
            this.timestamp = timestamp;
            return this;
        }
        
        public ErrorResponseBuilder status(Integer status) {
            this.status = status;
            return this;
        }
        
        public ErrorResponseBuilder error(String error) {
            this.error = error;
            return this;
        }
        
        public ErrorResponseBuilder message(String message) {
            this.message = message;
            return this;
        }
        
        public ErrorResponseBuilder path(String path) {
            this.path = path;
            return this;
        }
        
        public ErrorResponseBuilder errorCode(String errorCode) {
            this.errorCode = errorCode;
            return this;
        }
        
        public ErrorResponseBuilder details(Map<String, Object> details) {
            this.details = details;
            return this;
        }
        
        public ErrorResponse build() {
            return new ErrorResponse(timestamp, status, error, message, path, errorCode, details);
        }
    }
}