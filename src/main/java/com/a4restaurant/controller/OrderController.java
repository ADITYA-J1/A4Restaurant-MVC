package com.a4restaurant.controller;

import com.a4restaurant.dto.PayUserOrdersRequest;
import com.a4restaurant.model.Order;
import com.a4restaurant.model.OrderItem;
import com.a4restaurant.model.User;
import com.a4restaurant.service.OrderService;
import com.a4restaurant.command.UpdateOrderStatusCommand;
import com.a4restaurant.command.CommandInvoker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id);
    }

    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        return orderService.createOrder(order);
    }

    @PutMapping("/{id}/status")
    public Order updateOrderStatus(@PathVariable Long id, @RequestBody String status) {
        return orderService.updateOrderStatus(id, Order.OrderStatus.valueOf(status));
    }

    @PutMapping("/{id}/items")
    public ResponseEntity<?> addOrderItem(@PathVariable Long id, @RequestBody OrderItem orderItem) {
        try {
            OrderItem addedItem = orderService.addOrderItem(id, orderItem.getMenuItem().getId(), 
                                                          orderItem.getQuantity(), 
                                                          orderItem.getSpecialInstructions());
            return ResponseEntity.ok(addedItem);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{orderId}/items/{itemId}")
    public ResponseEntity<?> removeOrderItem(@PathVariable Long orderId, @PathVariable Long itemId) {
        try {
            orderService.removeOrderItem(orderId, itemId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/complete")
    public Order completeOrder(@PathVariable Long id) {
        return orderService.completeOrder(id);
    }

    @GetMapping("/active")
    public List<Order> getActiveOrders() {
        return orderService.getActiveOrders();
    }

    @GetMapping("/table/{tableId}")
    public List<Order> getOrdersByTable(@PathVariable Long tableId) {
        return orderService.getOrdersByTable(tableId);
    }

    @GetMapping("/user/{userId}")
    public List<Order> getOrdersByUser(@PathVariable Long userId) {
        return orderService.getOrdersByUser(userId);
    }

    @GetMapping("/user/{userId}/visit/{visitId}")
    public List<Order> getOrdersByUserAndVisit(@PathVariable Long userId, @PathVariable String visitId) {
        return orderService.getOrdersByUserAndVisit(userId, visitId);
    }

    @GetMapping("/status")
    public List<Order> getOrdersByPaymentStatus(@RequestParam String paymentStatus) {
        return orderService.getOrdersByPaymentStatus(paymentStatus);
    }

    @GetMapping("/pending-users")
    public List<User> getUsersWithPendingOrders() {
        return orderService.getUsersWithPendingOrders();
    }

    @PostMapping("/pay-user-orders")
    public ResponseEntity<?> payUserOrders(@RequestBody PayUserOrdersRequest request) {
        orderService.payUserOrders(request.getUserId(), request.getOrderIds(), request.getPaymentMethod(), request.getDiscountAmount(), request.getCouponCode());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{orderId}/command/status")
    public ResponseEntity<?> updateOrderStatusViaCommand(
            @PathVariable Long orderId,
            @RequestParam String status
    ) {
        UpdateOrderStatusCommand command = new UpdateOrderStatusCommand(
            orderService, orderId, Order.OrderStatus.valueOf(status)
        );
        new CommandInvoker().runCommand(command);
        return ResponseEntity.ok("Order status updated via command!");
    }
}