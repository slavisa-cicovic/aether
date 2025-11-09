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
@Tag(name = "Voice Sessions", description = "API za upravljanje glasovnim sesijama narudžbina")
@SecurityRequirement(name = "bearerAuth")
public class VoiceSessionController {
    
    @Autowired
    private VoiceSessionService voiceSessionService;
    
    @Operation(
        summary = "Kreiranje sesije",
        description = "Kreira novu glasovnu sesiju za narudžbinu. Ovo je prvi korak u procesu naručivanja."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "201", 
            description = "Sesija uspešno kreirana",
            content = @Content(schema = @Schema(implementation = SessionResponse.class))
        ),
        @ApiResponse(
            responseCode = "400", 
            description = "Nevažeći podaci zahteva",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        ),
        @ApiResponse(
            responseCode = "409", 
            description = "Već postoji aktivna sesija za ovaj poziv",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        ),
        @ApiResponse(
            responseCode = "401", 
            description = "Neautorizovani pristup",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        )
    })
    @PostMapping
    public ResponseEntity<SessionResponse> createSession(
            @Parameter(description = "Podaci za kreiranje sesije", required = true)
            @Valid @RequestBody SessionCreateRequest request,
            
            @Parameter(description = "Jedinstveni ID transakcije za praćenje", required = true)
            @RequestHeader("X-Transaction-ID") String transactionId) {
        
        SessionResponse response = voiceSessionService.createSession(request, transactionId);
        return ResponseEntity.status(201).body(response);
    }
    
    @Operation(
        summary = "Verifikacija adrese",
        description = "Proverava i geokodira adresu koju je korisnik izgovorio tokom poziva."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200", 
            description = "Adresa uspešno verifikovana",
            content = @Content(schema = @Schema(implementation = AddressVerificationResponse.class))
        ),
        @ApiResponse(
            responseCode = "422", 
            description = "Adresa je nejasna - potrebna dodatna potvrda",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        ),
        @ApiResponse(
            responseCode = "404", 
            description = "Sesija nije pronađena",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        )
    })
    @PostMapping("/{sessionId}/verify-address")
    public ResponseEntity<?> verifyAddress(
            @Parameter(description = "ID sesije", required = true, example = "sess_abc123def456")
            @PathVariable String sessionId,
            
            @Parameter(description = "Izgovorena adresa za verifikaciju", required = true)
            @Valid @RequestBody AddressVerificationRequest request,
            
            @Parameter(description = "Jedinstveni ID transakcije za praćenje", required = true)
            @RequestHeader("X-Transaction-ID") String transactionId) {
        
        AddressVerificationResponse response = voiceSessionService.verifyAddress(sessionId, request);
        return ResponseEntity.ok(response);
    }
    
    @Operation(
        summary = "Verifikacija pošiljaoca",
        description = "Proverava da li pošiljalac postoji u bazi i da li je dostupan za dostavu."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200", 
            description = "Pošiljalac uspešno verifikovan",
            content = @Content(schema = @Schema(implementation = MerchantVerificationResponse.class))
        ),
        @ApiResponse(
            responseCode = "404", 
            description = "Pošiljalac nije pronađen - predloženi alternativni pošiljaoci",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        )
    })
    @PostMapping("/{sessionId}/verify-merchant")
    public ResponseEntity<?> verifyMerchant(
            @Parameter(description = "ID sesije", required = true)
            @PathVariable String sessionId,
            
            @Parameter(description = "Podaci o pošiljaocu i naručenim stavkama", required = true)
            @Valid @RequestBody MerchantVerificationRequest request,
            
            @Parameter(description = "Jedinstveni ID transakcije za praćenje", required = true)
            @RequestHeader("X-Transaction-ID") String transactionId) {
        
        MerchantVerificationResponse response = voiceSessionService.verifyMerchant(sessionId, request);
        return ResponseEntity.ok(response);
    }
    
    @Operation(
        summary = "Kalkulacija cene dostave",
        description = "Proverava dostupnost dronova i računa ukupnu cenu dostave."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200", 
            description = "Cena uspešno izračunata",
            content = @Content(schema = @Schema(implementation = QuoteResponse.class))
        ),
        @ApiResponse(
            responseCode = "503", 
            description = "Nema dostupnih dronova u zoni",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        )
    })
    @PostMapping("/{sessionId}/calculate-quote")
    public ResponseEntity<?> calculateQuote(
            @Parameter(description = "ID sesije", required = true)
            @PathVariable String sessionId,
            
            @Parameter(description = "Podaci o vremenu dostave", required = true)
            @Valid @RequestBody QuoteRequest request,
            
            @Parameter(description = "Jedinstveni ID transakcije za praćenje", required = true)
            @RequestHeader("X-Transaction-ID") String transactionId) {
        
        QuoteResponse response = voiceSessionService.calculateQuote(sessionId, request);
        return ResponseEntity.ok(response);
    }
    
    @Operation(
        summary = "Potvrda narudžbine",
        description = "Finalizira narudžbinu i kreira je u sistemu. Menja status sesije na 'order_confirmed'."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "201", 
            description = "Narudžbina uspešno potvrđena",
            content = @Content(schema = @Schema(implementation = OrderConfirmationResponse.class))
        ),
        @ApiResponse(
            responseCode = "400", 
            description = "Korisnik nije potvrdio narudžbinu ili sesija nije aktivna",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        )
    })
    @PostMapping("/{sessionId}/confirm-order")
    public ResponseEntity<?> confirmOrder(
            @Parameter(description = "ID sesije", required = true)
            @PathVariable String sessionId,
            
            @Parameter(description = "Potvrda narudžbine i način plaćanja", required = true)
            @Valid @RequestBody OrderConfirmationRequest request,
            
            @Parameter(description = "Jedinstveni ID transakcije za praćenje", required = true)
            @RequestHeader("X-Transaction-ID") String transactionId) {
        
        OrderConfirmationResponse response = voiceSessionService.confirmOrder(sessionId, request);
        return ResponseEntity.status(201).body(response);
    }
    
    @Operation(
        summary = "Procesiranje plaćanja",
        description = "Procesira plaćanje nakon što je narudžbina potvrđena. Menja status sesije na 'completed'."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200", 
            description = "Plaćanje uspešno procesirano",
            content = @Content(schema = @Schema(implementation = PaymentResponse.class))
        ),
        @ApiResponse(
            responseCode = "400", 
            description = "Greška pri procesiranju plaćanja ili narudžbina nije potvrđena",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        )
    })
    @PostMapping("/{sessionId}/process-payment")
    public ResponseEntity<?> processPayment(
            @Parameter(description = "ID sesije", required = true)
            @PathVariable String sessionId,
            
            @Parameter(description = "Podaci o plaćanju", required = true)
            @Valid @RequestBody PaymentRequest request,
            
            @Parameter(description = "Jedinstveni ID transakcije za praćenje", required = true)
            @RequestHeader("X-Transaction-ID") String transactionId) {
        
        PaymentResponse response = voiceSessionService.processPayment(sessionId, request);
        return ResponseEntity.ok(response);
    }
    
    @Operation(
        summary = "Otkazivanje sesije",
        description = "Otkazuje sesiju narudžbine. Koristi se ako korisnik otkaže narudžbinu ili se poziv prekine."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200", 
            description = "Sesija uspešno otkazana"
        ),
        @ApiResponse(
            responseCode = "404", 
            description = "Sesija nije pronađena"
        )
    })
    @PostMapping("/{sessionId}/cancel")
    public ResponseEntity<?> cancelSession(
            @Parameter(description = "ID sesije", required = true)
            @PathVariable String sessionId,
            
            @Parameter(description = "Razlog otkazivanja", required = true)
            @Valid @RequestBody CancelRequest request,
            
            @Parameter(description = "Jedinstveni ID transakcije za praćenje", required = true)
            @RequestHeader("X-Transaction-ID") String transactionId) {
        
        voiceSessionService.cancelSession(sessionId, request);
        return ResponseEntity.ok(new CancelResponse("cancelled", "Session cancelled successfully"));
    }
    
    // Helper DTO za cancel response
    public record CancelResponse(String sessionStatus, String message) {}
}