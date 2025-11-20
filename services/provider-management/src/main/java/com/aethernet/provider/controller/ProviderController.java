package com.aethernet.provider.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aethernet.provider.dto.ProviderQuotaResponse;
import com.aethernet.provider.dto.ProviderVerificationRequest;
import com.aethernet.provider.model.EndUserCategory;
import com.aethernet.provider.service.QuotaCalculationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/v1/provider")
@RequiredArgsConstructor
@Validated
public class ProviderController {

    private final QuotaCalculationService quotaCalculationService;

    @PostMapping("/calculate-quota")
    public ResponseEntity<ProviderQuotaResponse> calculateQuota(
            @RequestBody @Valid ProviderVerificationRequest request,
            @RequestParam(name = "userType", defaultValue = "DEFAULT") String userType) {

        EndUserCategory category = parseUserCategory(userType);
        ProviderQuotaResponse response = quotaCalculationService.calculate(request, category);
        return ResponseEntity.ok(response);
    }

    private EndUserCategory parseUserCategory(String value) {
        try {
            return EndUserCategory.valueOf(value.toUpperCase());
        } catch (Exception ex) {
            return EndUserCategory.DEFAULT;
        }
    }
}
