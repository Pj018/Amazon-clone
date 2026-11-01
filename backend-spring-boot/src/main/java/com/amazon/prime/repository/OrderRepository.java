package com.amazon.prime.repository;

import com.amazon.prime.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {

    List<Order> findByUserIdOrderByCreatedAtDesc(String userId);

    List<Order> findByStatusIgnoreCase(String status);

    @Query("SELECT SUM(o.total) FROM Order o WHERE o.status != 'Returned'")
    BigDecimal calculateGrossMerchandiseValue();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = 'Delivered'")
    long countDeliveredOrders();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status IN ('Processing', 'Shipped', 'Out for Delivery')")
    long countActiveFulfillmentOrders();
}
