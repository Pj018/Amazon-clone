package com.amazon.prime.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.lang.management.ManagementFactory;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/system")
@CrossOrigin(origins = "*")
@Tag(name = "System Info API", description = "Endpoints for backend runtime telemetry and health status")
public class SystemInfoController {

    @GetMapping("/info")
    @Operation(summary = "Get Spring Boot & MySQL runtime specification")
    public ResponseEntity<Map<String, Object>> getSystemInfo() {
        Map<String, Object> info = new LinkedHashMap<>();
        info.put("framework", "Spring Boot 3.3.4");
        info.put("runtime", "Java 17 / OpenJDK 64-Bit Server VM");
        info.put("database", "MySQL 8.0 / InnoDB Engine");
        info.put("orm", "Hibernate 6.5 / Spring Data JPA");
        info.put("security", "Spring Security 6.3 with JWT Bearer & RBAC");
        info.put("connectionPool", "HikariCP 5.1.0");
        info.put("swaggerDocs", "/swagger-ui.html");
        info.put("uptimeSeconds", ManagementFactory.getRuntimeMXBean().getUptime() / 1000);
        info.put("timestamp", Instant.now().toString());
        info.put("status", "HEALTHY");

        return ResponseEntity.ok(info);
    }
}
