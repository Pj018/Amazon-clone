package com.amazon.prime.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "security_audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SecurityAuditLog {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 255)
    private String event;

    @Column(nullable = false, length = 64)
    private String timestamp;

    @Column(name = "ip_address", nullable = false, length = 64)
    private String ipAddress;

    @Column(nullable = false, length = 128)
    private String device;

    @Column(nullable = false, length = 32)
    private String status; // SUCCESS, WARNING, ALERT

    @Column(nullable = false, length = 128)
    private String signature;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
