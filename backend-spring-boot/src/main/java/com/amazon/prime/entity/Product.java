package com.amazon.prime.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @Column(length = 64)
    private String id;

    @NotBlank
    @Column(nullable = false, length = 255)
    private String title;

    @NotBlank
    @Column(nullable = false, length = 128)
    private String brand;

    @NotBlank
    @Column(nullable = false, length = 64)
    private String category;

    @NotNull
    @PositiveOrZero
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @NotNull
    @PositiveOrZero
    @Column(name = "original_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal originalPrice;

    @Column(precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal rating = BigDecimal.valueOf(4.5);

    @Column(name = "review_count")
    @Builder.Default
    private Integer reviewCount = 0;

    @NotBlank
    @Column(nullable = false, length = 512)
    private String image;

    @Column(name = "is_prime")
    @Builder.Default
    private Boolean isPrime = true;

    @Column(name = "is_best_seller")
    @Builder.Default
    private Boolean isBestSeller = false;

    @Column(name = "in_stock")
    @Builder.Default
    private Boolean inStock = true;

    @Column(name = "stock_count")
    @Builder.Default
    private Integer stockCount = 100;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
