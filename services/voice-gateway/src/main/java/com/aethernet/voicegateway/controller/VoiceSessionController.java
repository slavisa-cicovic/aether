package com.aethernet.voicegateway.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aethernet.voicegateway.dto.request.AddressVerificationRequest;
import com.aethernet.voicegateway.dto.request.CancelRequest;
import com.aethernet.voicegateway.dto.request.MerchantVerificationRequest;
import com.aethernet.voicegateway.dto.request.OrderConfirmationRequest;
import com.aethernet.voicegateway.dto.request.PaymentRequest;
import com.aethernet.voicegateway.dto.request.QuoteRequest;
import com.aethernet.voicegateway.dto.request.SessionCreateRequest;
import com.aethernet.voicegateway.dto.response.AddressVerificationResponse;
import com.aethernet.voicegateway.dto.response.ErrorResponse;
import com.aethernet.voicegateway.dto.response.MerchantVerificationResponse;
import com.aethernet.voicegateway.dto.response.OrderConfirmationResponse;
import com.aethernet.voicegateway.dto.response.PaymentResponse;
import com.aethernet.voicegateway.dto.response.QuoteResponse;
import com.aethernet.voicegateway.dto.response.SessionResponse;
import com.aethernet.voicegateway.service.VoiceSessionService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/voice/sessions")
@Tag(name = "Voice Sessions", description = "API for managing voice order sessions")
@SecurityRequirement(name = "bearerAuth")
public class VoiceSessionController {
    
    @Autowired
    private VoiceSessionService voiceSessionService;
    
    @Operation(
        summary = "Create session",
        description = "Creates a new voice session for order placement. This is the first step in the ordering process."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "201", 
            description = "Session successfully created",
            content = @Content(schema = @Schema(implementation = SessionResponse.class))
        ),
        @ApiResponse(
            responseCode = "400", 
            description = "Invalid request data",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        ),
        @ApiResponse(
            responseCode = "409", 
            description = "Active session already exists for this call",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        ),
        @ApiResponse(
            responseCode = "401", 
            description = "Unauthorized access",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        )
    })
    @PostMapping
    public ResponseEntity<SessionResponse> createSession(
            @Parameter(description = "Session creation data", required = true)
            @Valid @RequestBody SessionCreateRequest request,
            
            @Parameter(description = "Unique transaction ID for tracking", required = true)
            @RequestHeader("X-Transaction-ID") String transactionId) {
        
        SessionResponse response = voiceSessionService.createSession(request, transactionId);
        return ResponseEntity.status(201).body(response);
    }
    
    @Operation(
        summary = "Verify address",
        description = "Verifies and geocodes the address spoken by the user during the call."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200", 
            description = "Address successfully verified",
            content = @Content(schema = @Schema(implementation = AddressVerificationResponse.class))
        ),
        @ApiResponse(
            responseCode = "422", 
            description = "Address is ambiguous - additional confirmation required",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        ),
        @ApiResponse(
            responseCode = "404", 
            description = "Session not found",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        )
    })
    @PostMapping("/{sessionId}/verify-address")
    public ResponseEntity<?> verifyAddress(
            @Parameter(description = "Session ID", required = true, example = "sess_abc123def456")
            @PathVariable String sessionId,
            
            @Parameter(description = "Spoken address for verification", required = true)
            @Valid @RequestBody AddressVerificationRequest request,
            
            @Parameter(description = "Unique transaction ID for tracking", required = true)
            @RequestHeader("X-Transaction-ID") String transactionId) {
        
        AddressVerificationResponse response = voiceSessionService.verifyAddress(sessionId, request);
        return ResponseEntity.ok(response);
    }
    
    @Operation(
        summary = "Verify merchant",
        description = "Checks if the merchant exists in the database and is available for delivery."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200", 
            description = "Merchant successfully verified",
            content = @Content(schema = @Schema(implementation = MerchantVerificationResponse.class))
        ),
        @ApiResponse(
            responseCode = "404", 
            description = "Merchant not found - suggested alternative merchants",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        )
    })
    @PostMapping("/{sessionId}/verify-merchant")
    public ResponseEntity<?> verifyMerchant(
            @Parameter(description = "Session ID", required = true)
            @PathVariable String sessionId,
            
            @Parameter(description = "Merchant data and ordered items", required = true)
            @Valid @RequestBody MerchantVerificationRequest request,
            
            @Parameter(description = "Unique transaction ID for tracking", required = true)
            @RequestHeader("X-Transaction-ID") String transactionId) {
        
        MerchantVerificationResponse response = voiceSessionService.verifyMerchant(sessionId, request);
        return ResponseEntity.ok(response);
    }
    
    @Operation(
        summary = "Calculate delivery quote",
        description = "Checks drone availability and calculates total delivery price."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200", 
            description = "Price successfully calculated",
            content = @Content(schema = @Schema(implementation = QuoteResponse.class))
        ),
        @ApiResponse(
            responseCode = "503", 
            description = "No drones available in the zone",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        )
    })
    @PostMapping("/{sessionId}/calculate-quote")
    public ResponseEntity<?> calculateQuote(
            @Parameter(description = "Session ID", required = true)
            @PathVariable String sessionId,
            
            @Parameter(description = "Delivery time data", required = true)
            @Valid @RequestBody QuoteRequest request,
            
            @Parameter(description = "Unique transaction ID for tracking", required = true)
            @RequestHeader("X-Transaction-ID") String transactionId) {
        
        QuoteResponse response = voiceSessionService.calculateQuote(sessionId, request);
        return ResponseEntity.ok(response);
    }
    
    @Operation(
        summary = "Confirm order",
        description = "Finalizes the order and creates it in the system. Changes session status to 'order_confirmed'."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "201", 
            description = "Order successfully confirmed",
            content = @Content(schema = @Schema(implementation = OrderConfirmationResponse.class))
        ),
        @ApiResponse(
            responseCode = "400", 
            description = "User did not confirm the order or session is not active",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        )
    })
    @PostMapping("/{sessionId}/confirm-order")
    public ResponseEntity<?> confirmOrder(
            @Parameter(description = "Session ID", required = true)
            @PathVariable String sessionId,
            
            @Parameter(description = "Order confirmation and payment method", required = true)
            @Valid @RequestBody OrderConfirmationRequest request,
            
            @Parameter(description = "Unique transaction ID for tracking", required = true)
            @RequestHeader("X-Transaction-ID") String transactionId) {
        
        OrderConfirmationResponse response = voiceSessionService.confirmOrder(sessionId, request);
        return ResponseEntity.status(201).body(response);
    }
    
    @Operation(
        summary = "Process payment",
        description = "Processes payment after the order is confirmed. Changes session status to 'completed'."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200", 
            description = "Payment successfully processed",
            content = @Content(schema = @Schema(implementation = PaymentResponse.class))
        ),
        @ApiResponse(
            responseCode = "400", 
            description = "Payment processing error or order not confirmed",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        )
    })
    @PostMapping("/{sessionId}/process-payment")
    public ResponseEntity<?> processPayment(
            @Parameter(description = "Session ID", required = true)
            @PathVariable String sessionId,
            
            @Parameter(description = "Payment data", required = true)
            @Valid @RequestBody PaymentRequest request,
            
            @Parameter(description = "Unique transaction ID for tracking", required = true)
            @RequestHeader("X-Transaction-ID") String transactionId) {
        
        PaymentResponse response = voiceSessionService.processPayment(sessionId, request);
        return ResponseEntity.ok(response);
    }
    
    @Operation(
        summary = "Cancel session",
        description = "Cancels the order session. Used if the user cancels the order or the call ends."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200", 
            description = "Session successfully cancelled"
        ),
        @ApiResponse(
            responseCode = "404", 
            description = "Session not found"
        )
    })
    @PostMapping("/{sessionId}/cancel")
    public ResponseEntity<?> cancelSession(
            @Parameter(description = "Session ID", required = true)
            @PathVariable String sessionId,
            
            @Parameter(description = "Cancellation reason", required = true)
            @Valid @RequestBody CancelRequest request,
            
            @Parameter(description = "Unique transaction ID for tracking", required = true)
            @RequestHeader("X-Transaction-ID") String transactionId) {
        
        voiceSessionService.cancelSession(sessionId, request);
        return ResponseEntity.ok(new CancelResponse("cancelled", "Session cancelled successfully"));
    }
    
    // Helper DTO for cancel response
    public record CancelResponse(String sessionStatus, String message) {}
}