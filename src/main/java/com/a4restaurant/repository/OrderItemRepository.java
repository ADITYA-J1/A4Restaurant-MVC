package com.a4restaurant.repository;

import com.a4restaurant.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrderId(Long orderId);
    List<OrderItem> findByStatus(OrderItem.OrderItemStatus status);
    List<OrderItem> findByMenuItemId(Long menuItemId);
} 