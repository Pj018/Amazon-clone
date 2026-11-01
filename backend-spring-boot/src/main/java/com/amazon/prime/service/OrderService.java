package com.amazon.prime.service;

import com.amazon.prime.entity.Order;
import com.amazon.prime.entity.OrderItem;
import com.amazon.prime.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderService {

    private final OrderRepository orderRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Optional<Order> getOrderById(String id) {
        return orderRepository.findById(id);
    }

    public List<Order> getOrdersByUser(String userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional
    public Order placeOrder(Order order) {
        if (order.getId() == null || order.getId().isBlank()) {
            order.setId("114-" + (1000000 + (int)(Math.random() * 9000000)) + "-" + (1000000 + (int)(Math.random() * 9000000)));
        }
        if (order.getStatus() == null) {
            order.setStatus("Processing");
        }
        if (order.getTrackingNumber() == null) {
            order.setTrackingNumber("TBA" + (100000000000L + (long)(Math.random() * 900000000000L)));
        }

        // Establish bidirectional entity mapping
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                item.setOrder(order);
            }
        }

        return orderRepository.save(order);
    }

    @Transactional
    public Order updateOrderStatus(String orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with id: " + orderId));

        order.setStatus(newStatus);
        return orderRepository.save(order);
    }
}
