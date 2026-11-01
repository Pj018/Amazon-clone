package com.amazon.prime.controller;

import com.amazon.prime.service.SellerAnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/seller")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Seller Central Analytics API", description = "Endpoints for merchant telemetry, velocity, and health")
public class SellerController {

    private final SellerAnalyticsService sellerAnalyticsService;

    @GetMapping("/analytics")
    @Operation(summary = "Get Seller Central GMV, conversion, and fulfillment telemetry")
    public ResponseEntity<SellerAnalyticsService.SellerAnalyticsPayload> getAnalytics() {
        return ResponseEntity.ok(sellerAnalyticsService.getAnalyticsOverview());
    }
}
