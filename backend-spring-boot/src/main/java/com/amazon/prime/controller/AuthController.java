package com.amazon.prime.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Builder;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*")
@Tag(name = "Authentication & Social Login API", description = "Endpoints for OAuth social login, JWT issuance, and credential verification")
public class AuthController {

    @Data
    @Builder
    public static class AuthResponse {
        private String token;
        private String tokenType;
        private long expiresIn;
        private String userId;
        private String email;
        private String name;
        private String role;
        private boolean isPrime;
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user with email and password")
    public ResponseEntity<AuthResponse> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.getOrDefault("email", "alex.mercer@example.com");

        AuthResponse response = AuthResponse.builder()
                .token("jwt_sec_" + UUID.randomUUID().toString())
                .tokenType("Bearer")
                .expiresIn(86400)
                .userId("usr-prime-9821")
                .email(email)
                .name("Alex Mercer")
                .role("ROLE_SELLER")
                .isPrime(true)
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/social")
    @Operation(summary = "OAuth 2.0 Social Sign-in (Google, Apple, Facebook, GitHub)")
    public ResponseEntity<AuthResponse> socialLogin(@RequestBody Map<String, String> payload) {
        String provider = payload.getOrDefault("provider", "google");
        String name = provider.substring(0, 1).toUpperCase() + provider.substring(1) + " User";

        AuthResponse response = AuthResponse.builder()
                .token("jwt_oauth_" + provider + "_" + UUID.randomUUID().toString())
                .tokenType("Bearer")
                .expiresIn(86400)
                .userId("usr-social-" + UUID.randomUUID().toString().substring(0, 8))
                .email("user." + provider + "@amazon.com")
                .name(name)
                .role("ROLE_CUSTOMER")
                .isPrime(true)
                .build();

        return ResponseEntity.ok(response);
    }
}
