package com.a4restaurant.controller;

import com.a4restaurant.model.OrderItem;
import com.a4restaurant.service.OrderItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-items")
public class OrderItemController {

    @Autowired
    private OrderItemService orderItemService;

    @GetMapping("/order/{orderId}")
    public List<OrderItem> getOrderItems(@PathVariable Long orderId) {
        return orderItemService.getOrderItemsByOrderId(orderId);
    }

    @GetMapping("/{id}")
    public OrderItem getOrderItem(@PathVariable Long id) {
        return orderItemService.getOrderItemById(id);
    }

    @PostMapping
    public OrderItem createOrderItem(@RequestBody OrderItem orderItem) {
        return orderItemService.createOrderItem(orderItem);
    }

    @PutMapping("/{id}")
    public OrderItem updateOrderItem(@PathVariable Long id, @RequestBody OrderItem orderItem) {
        return orderItemService.updateOrderItem(id, orderItem);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrderItem(@PathVariable Long id) {
        orderItemService.deleteOrderItem(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/status")
    public OrderItem updateStatus(@PathVariable Long id, @RequestBody String status) {
        return orderItemService.updateStatus(id, OrderItem.OrderItemStatus.valueOf(status));
    }

    @PutMapping("/{id}/quantity")
    public OrderItem updateQuantity(@PathVariable Long id, @RequestBody Integer quantity) {
        return orderItemService.updateQuantity(id, quantity);
    }
} 