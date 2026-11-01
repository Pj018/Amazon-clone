package com.amazon.prime;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * Amazon Prime Retail Ecosystem - Spring Boot 3.x Backend Application Entry Point.
 * Provides RESTful microservices for Catalog, Orders, Fulfillment, Seller Central, and Security Vault.
 */
@SpringBootApplication
@EnableJpaRepositories
public class AmazonPrimeApplication {

    public static void main(String[] args) {
        SpringApplication.run(AmazonPrimeApplication.class, args);
        System.out.println("=========================================================");
        System.out.println("🚀 Amazon Prime Retail Spring Boot Backend Running on :8080");
        System.out.println("📖 Swagger UI Docs: http://localhost:8080/swagger-ui.html");
        System.out.println("🛡️ Spring Security Active with JWT & Role-Based Access");
        System.out.println("🗄️ MySQL Connection Pool configured via HikariCP");
        System.out.println("=========================================================");
    }
}
