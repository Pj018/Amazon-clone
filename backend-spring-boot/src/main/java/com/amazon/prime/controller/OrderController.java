package com.amazon.prime.controller;

import com.amazon.prime.entity.Order;
import com.amazon.prime.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Order Fulfillment API", description = "Endpoints for order placement, tracking, and fulfillment workflow")
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    @Operation(summary = "Get all orders or orders by user")
    public ResponseEntity<List<Order>> getOrders(@RequestParam(required = false) String userId) {
        if (userId != null && !userId.isBlank()) {
            return ResponseEntity.ok(orderService.getOrdersByUser(userId));
        }
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order details and tracking status by ID")
    public ResponseEntity<Order> getOrderById(@PathVariable String id) {
        return orderService.getOrderById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Place a new customer order")
    public ResponseEntity<Order> placeOrder(@Valid @RequestBody Order order) {
        Order placed = orderService.placeOrder(order);
        return ResponseEntity.status(HttpStatus.CREATED).body(placed);
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update order fulfillment state (Processing -> Shipped -> Out for Delivery -> Delivered)")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> statusPayload) {

        String newStatus = statusPayload.get("status");
        if (newStatus == null || newStatus.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            Order updated = orderService.updateOrderStatus(id, newStatus);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.notFound().build();
        }
    }
}
