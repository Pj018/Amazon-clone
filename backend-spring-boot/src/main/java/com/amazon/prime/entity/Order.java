package com.amazon.prime.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @Column(length = 64)
    private String id;

    @Column(name = "user_id", length = 64)
    private String userId;

    @Column(nullable = false, length = 64)
    private String date;

    @Column(nullable = false, length = 64)
    private String status; // Processing, Shipped, Out for Delivery, Delivered, Returned

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total;

    @Column(name = "shipping_recipient", nullable = false)
    private String shippingRecipient;

    @Column(name = "shipping_street", nullable = false)
    private String shippingStreet;

    @Column(name = "shipping_city", nullable = false)
    private String shippingCity;

    @Column(name = "shipping_state", nullable = false)
    private String shippingState;

    @Column(name = "shipping_zip", nullable = false)
    private String shippingZip;

    @Column(name = "delivery_option", nullable = false)
    private String deliveryOption;

    @Column(name = "tracking_number", nullable = false)
    private String trackingNumber;

    @Column(nullable = false)
    private String carrier;

    @Column(name = "estimated_delivery", nullable = false)
    private String estimatedDelivery;

    @Column(name = "payment_method", nullable = false)
    private String paymentMethod;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
