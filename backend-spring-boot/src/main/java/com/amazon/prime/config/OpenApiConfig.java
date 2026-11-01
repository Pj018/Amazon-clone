package com.amazon.prime.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .servers(List.of(
                new Server().url("http://localhost:8080").description("Local Spring Boot Server"),
                new Server().url("https://api.amazonprime-retail.internal").description("Production Gateway")
            ))
            .info(new Info()
                .title("Amazon Prime Retail Ecosystem REST API")
                .version("v1.0.0")
                .description("Enterprise Spring Boot 3.3.4 RESTful Microservice Specification. " +
                             "Includes Catalog CRUD, Order State Transitions, Seller Central GMV Velocity, " +
                             "Encrypted Vault Backups, and OAuth Social Authentication.")
                .contact(new Contact()
                    .name("Amazon Prime Retail Platform Engineering")
                    .email("support@amazon-prime-retail.internal"))
                .license(new License().name("Apache 2.0").url("https://spring.io")));
    }
}
