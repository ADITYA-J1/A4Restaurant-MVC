package com.a4restaurant.service;

import com.a4restaurant.model.OrderItem;
import com.a4restaurant.repository.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrderItemService {

    @Autowired
    private OrderItemRepository orderItemRepository;

    public List<OrderItem> getOrderItemsByOrderId(Long orderId) {
        return orderItemRepository.findByOrderId(orderId);
    }

    public OrderItem getOrderItemById(Long id) {
        return orderItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order item not found with id: " + id));
    }

    @Transactional
    public OrderItem createOrderItem(OrderItem orderItem) {
        // Set initial status
        orderItem.setStatus(OrderItem.OrderItemStatus.PENDING);
        
        // If price is not set, get it from the menu item
        if (orderItem.getPrice() == null) {
            orderItem.setPrice(orderItem.getMenuItem().getPrice());
        }
        
        return orderItemRepository.save(orderItem);
    }

    @Transactional
    public OrderItem updateOrderItem(Long id, OrderItem orderItem) {
        OrderItem existingItem = getOrderItemById(id);
        
        existingItem.setQuantity(orderItem.getQuantity());
        existingItem.setPrice(orderItem.getPrice());
        existingItem.setSpecialInstructions(orderItem.getSpecialInstructions());
        existingItem.setStatus(orderItem.getStatus());

        return orderItemRepository.save(existingItem);
    }

    @Transactional
    public void deleteOrderItem(Long id) {
        OrderItem orderItem = getOrderItemById(id);
        orderItemRepository.delete(orderItem);
    }

    @Transactional
    public OrderItem updateStatus(Long id, OrderItem.OrderItemStatus status) {
        OrderItem orderItem = getOrderItemById(id);
        orderItem.setStatus(status);
        return orderItemRepository.save(orderItem);
    }

    @Transactional
    public OrderItem updateQuantity(Long id, Integer quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }
        
        OrderItem orderItem = getOrderItemById(id);
        orderItem.setQuantity(quantity);
        return orderItemRepository.save(orderItem);
    }
} 