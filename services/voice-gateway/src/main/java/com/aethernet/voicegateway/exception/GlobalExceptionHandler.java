package com.aethernet.voicegateway.exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

        @ExceptionHandler(SessionNotFoundException.class)
        public ResponseEntity<ErrorResponse> handleSessionNotFound(SessionNotFoundException ex,
                        HttpServletRequest request) {
                ErrorResponse error = ErrorResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .status(HttpStatus.NOT_FOUND.value())
                                .error("Session Not Found")
                                .message(ex.getMessage())
                                .path(request.getRequestURI())
                                .errorCode("SESSION_NOT_FOUND")
                                .details(Map.of("sessionId", ex.getSessionId()))
                                .build();

                return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
        }

        @ExceptionHandler(AddressVerificationException.class)
        public ResponseEntity<ErrorResponse> handleAddressVerification(AddressVerificationException ex,
                        HttpServletRequest request) {
                ErrorResponse error = ErrorResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .status(HttpStatus.UNPROCESSABLE_ENTITY.value())
                                .error("Address Verification Failed")
                                .message(ex.getMessage())
                                .path(request.getRequestURI())
                                .errorCode(ex.getErrorCode())
                                .details(Map.of("suggestions", ex.getSuggestions()))
                                .build();

                return new ResponseEntity<>(error, HttpStatus.UNPROCESSABLE_ENTITY);
        }

        @ExceptionHandler(ProviderNotFoundException.class)
        public ResponseEntity<ErrorResponse> handleProviderNotFound(ProviderNotFoundException ex,
                        HttpServletRequest request) {
                ErrorResponse error = ErrorResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .status(HttpStatus.NOT_FOUND.value())
                                .error("Provider Not Found")
                                .message(ex.getMessage())
                                .path(request.getRequestURI())
                                .errorCode("PROVIDER_NOT_FOUND")
                                .details(Map.of(
                                                "providerName", ex.getProviderName(),
                                                "alternative_providers", ex.getAlternativeProviders()))
                                .build();

                return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
        }

        @ExceptionHandler(NoDronesAvailableException.class)
        public ResponseEntity<ErrorResponse> handleNoDronesAvailable(NoDronesAvailableException ex,
                        HttpServletRequest request) {
                ErrorResponse error = ErrorResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .status(HttpStatus.SERVICE_UNAVAILABLE.value())
                                .error("Service Unavailable")
                                .message(ex.getMessage())
                                .path(request.getRequestURI())
                                .errorCode("NO_DRONES_AVAILABLE")
                                .details(Map.of("zone", ex.getZone()))
                                .build();

                return new ResponseEntity<>(error, HttpStatus.SERVICE_UNAVAILABLE);
        }

        @ExceptionHandler(PaymentProcessingException.class)
        public ResponseEntity<ErrorResponse> handlePaymentProcessing(PaymentProcessingException ex,
                        HttpServletRequest request) {
                ErrorResponse error = ErrorResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .status(HttpStatus.BAD_REQUEST.value())
                                .error("Payment Processing Failed")
                                .message(ex.getMessage())
                                .path(request.getRequestURI())
                                .errorCode(ex.getErrorCode())
                                .details(Map.of("paymentIntentId", ex.getPaymentIntentId()))
                                .build();

                return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(DuplicateSessionException.class)
        public ResponseEntity<ErrorResponse> handleDuplicateSession(DuplicateSessionException ex,
                        HttpServletRequest request) {
                ErrorResponse error = ErrorResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .status(HttpStatus.CONFLICT.value())
                                .error("Duplicate Session")
                                .message(ex.getMessage())
                                .path(request.getRequestURI())
                                .errorCode("DUPLICATE_SESSION")
                                .details(Map.of("callSid", ex.getCallSid()))
                                .build();

                return new ResponseEntity<>(error, HttpStatus.CONFLICT);
        }

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex,
                        HttpServletRequest request) {
                Map<String, Object> errors = new HashMap<>();
                ex.getBindingResult().getAllErrors().forEach((error) -> {
                        String fieldName = ((FieldError) error).getField();
                        String errorMessage = error.getDefaultMessage();
                        errors.put(fieldName, errorMessage);
                });

                ErrorResponse error = ErrorResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .status(HttpStatus.BAD_REQUEST.value())
                                .error("Validation Failed")
                                .message("Request validation failed")
                                .path(request.getRequestURI())
                                .errorCode("VALIDATION_ERROR")
                                .details(errors)
                                .build();

                return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(IllegalArgumentException.class)
        public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex,
                        HttpServletRequest request) {
                ErrorResponse error = ErrorResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .status(HttpStatus.BAD_REQUEST.value())
                                .error("Invalid Argument")
                                .message(ex.getMessage())
                                .path(request.getRequestURI())
                                .errorCode("INVALID_ARGUMENT")
                                .build();

                return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(IllegalStateException.class)
        public ResponseEntity<ErrorResponse> handleIllegalState(IllegalStateException ex,
                        HttpServletRequest request) {
                ErrorResponse error = ErrorResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .status(HttpStatus.BAD_REQUEST.value())
                                .error("Invalid Operation")
                                .message(ex.getMessage())
                                .path(request.getRequestURI())
                                .errorCode("INVALID_OPERATION")
                                .build();

                return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(DataIntegrityViolationException.class)
        public ResponseEntity<ErrorResponse> handleDataIntegrityViolation(DataIntegrityViolationException ex,
                        HttpServletRequest request) {
                ErrorResponse error = ErrorResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .status(HttpStatus.CONFLICT.value())
                                .error("Data Integrity Violation")
                                .message("Došlo je do konflikta podataka. Molimo pokušajte ponovo.")
                                .path(request.getRequestURI())
                                .errorCode("DATA_INTEGRITY_VIOLATION")
                                .details(Map.of("rootCause", getRootCauseMessage(ex)))
                                .build();

                log.warn("Data integrity violation: {}", getRootCauseMessage(ex));

                return new ResponseEntity<>(error, HttpStatus.CONFLICT);
        }

        @ExceptionHandler(Exception.class)
        public ResponseEntity<ErrorResponse> handleGenericException(Exception ex,
                        HttpServletRequest request) {
                ErrorResponse error = ErrorResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                                .error("Internal Server Error")
                                .message("An unexpected error occurred")
                                .path(request.getRequestURI())
                                .errorCode("INTERNAL_ERROR")
                                .build();

                // Log the actual exception for debugging
                log.error("Unhandled exception: {}", ex.getMessage(), ex);

                return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        private String getRootCauseMessage(Exception ex) {
                Throwable rootCause = ex;
                while (rootCause.getCause() != null && rootCause.getCause() != rootCause) {
                        rootCause = rootCause.getCause();
                }
                return rootCause.getMessage();
        }
}
