package com.a4restaurant.service;

import com.a4restaurant.model.*;
import com.a4restaurant.repository.*;
import com.a4restaurant.strategy.*;
import com.a4restaurant.observer.OrderStatusNotifier;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private TableService tableService;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }

    @Transactional
    public Order createOrder(Order order) {
        // Validate table
        if (order.getTable() == null || order.getTable().getId() == null) {
            throw new RuntimeException("Table is required for creating an order");
        }
        if (order.getUser() == null || order.getUser().getId() == null) {
            throw new RuntimeException("User is required for creating an order");
        }
        if (order.getVisitId() == null || order.getVisitId().isEmpty()) {
            throw new RuntimeException("visitId is required for creating an order");
        }

        // Get the table from the database
        RestaurantTable table = tableService.getTableById(order.getTable().getId());
        if (table == null) {
            throw new RuntimeException("Table not found with id: " + order.getTable().getId());
        }

        // Find existing open order for user, table, and visit
        List<Order> openOrders = orderRepository.findByUserIdAndVisitId(order.getUser().getId(), order.getVisitId())
            .stream().filter(o -> o.getTable().getId().equals(table.getId()) &&
                (o.getStatus() == Order.OrderStatus.PENDING || o.getStatus() == Order.OrderStatus.IN_PROGRESS))
            .toList();
        Order existingOrder = openOrders.isEmpty() ? null : openOrders.get(0);

        if (existingOrder != null) {
            // Add new items to existing order
            double totalAmount = existingOrder.getTotalAmount() != null ? existingOrder.getTotalAmount() : 0.0;
            double discountAmount = existingOrder.getDiscountAmount() != null ? existingOrder.getDiscountAmount() : 0.0;
            if (order.getItems() != null && !order.getItems().isEmpty()) {
                for (OrderItem item : order.getItems()) {
                    MenuItem menuItem = menuItemRepository.findById(item.getMenuItem().getId())
                        .orElseThrow(() -> new RuntimeException("Menu item not found with id: " + item.getMenuItem().getId()));
                    item.setMenuItem(menuItem);
                    item.setPrice(menuItem.getPrice());
                    totalAmount += item.getPrice() * item.getQuantity();
                    item.setOrder(existingOrder);
                    item.setStatus(OrderItem.OrderItemStatus.PENDING);
                    orderItemRepository.save(item);
                }
            }
            // If discount is present in the payload, update it
            if (order.getDiscountAmount() != null && order.getDiscountAmount() > 0) {
                discountAmount = order.getDiscountAmount();
            }
            // Billing Strategy
            String billingStrategy = order.getBillingStrategy() != null ? order.getBillingStrategy() : "No Discount";
            existingOrder.setBillingStrategy(billingStrategy);
            BillingStrategy strategy = StrategyFactory.getStrategy(billingStrategy);
            existingOrder.setTotalAmount(strategy.calculateTotal(totalAmount, discountAmount));
            existingOrder.setDiscountAmount(discountAmount);
            orderRepository.save(existingOrder);
            return existingOrder;
        }

        // If no existing order, create new one as before
        order.setTable(table);
        order.setOrderTime(LocalDateTime.now());
        order.setStatus(Order.OrderStatus.PENDING);
        order.setDiscountAmount(order.getDiscountAmount() != null ? order.getDiscountAmount() : 0.0);
        String billingStrategy = order.getBillingStrategy() != null ? order.getBillingStrategy() : "No Discount";
        order.setBillingStrategy(billingStrategy);

        double subtotal = 0.0;
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                MenuItem menuItem = menuItemRepository.findById(item.getMenuItem().getId())
                    .orElseThrow(() -> new RuntimeException("Menu item not found with id: " + item.getMenuItem().getId()));
                item.setMenuItem(menuItem);
                item.setPrice(menuItem.getPrice());
                subtotal += item.getPrice() * item.getQuantity();
                item.setOrder(order);
                item.setStatus(OrderItem.OrderItemStatus.PENDING);
            }
        }
        BillingStrategy strategy = StrategyFactory.getStrategy(billingStrategy);
        order.setTotalAmount(strategy.calculateTotal(subtotal, order.getDiscountAmount()));
        Order savedOrder = orderRepository.save(order);
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                item.setOrder(savedOrder);
                orderItemRepository.save(item);
            }
        }
        return savedOrder;
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, Order.OrderStatus status) {
        Order order = getOrderById(orderId);
        order.setStatus(status);
        if (status == Order.OrderStatus.COMPLETED) {
            order.setCompletionTime(LocalDateTime.now());
        }
        Order updatedOrder = orderRepository.save(order);
        // Notify observers (WebSocket, etc.)
        OrderStatusNotifier.notifyObservers(orderId, status.name());
        return updatedOrder;
    }

    @Transactional
    public OrderItem addOrderItem(Long orderId, Long menuItemId, Integer quantity, String specialInstructions) {
        Order order = getOrderById(orderId);
        MenuItem menuItem = menuItemRepository.findById(menuItemId)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        if (!menuItem.isAvailable()) {
            throw new RuntimeException("Menu item is not available");
        }

        OrderItem orderItem = new OrderItem();
        orderItem.setOrder(order);
        orderItem.setMenuItem(menuItem);
        orderItem.setQuantity(quantity);
        orderItem.setSpecialInstructions(specialInstructions);
        orderItem.setPrice(menuItem.getPrice());
        orderItem.setStatus(OrderItem.OrderItemStatus.PENDING);

        orderItemRepository.save(orderItem);

        // Update order total
        updateOrderTotal(orderId);

        return orderItem;
    }

    @Transactional
    public void removeOrderItem(Long orderId, Long orderItemId) {
        OrderItem orderItem = orderItemRepository.findById(orderItemId)
                .orElseThrow(() -> new RuntimeException("Order item not found"));

        if (!orderItem.getOrder().getId().equals(orderId)) {
            throw new RuntimeException("Order item does not belong to this order");
        }

        orderItemRepository.delete(orderItem);
        updateOrderTotal(orderId);
    }

    @Transactional
    public Order completeOrder(Long orderId) {
        Order order = getOrderById(orderId);
        order.setStatus(Order.OrderStatus.COMPLETED);
        order.setCompletionTime(LocalDateTime.now());
        return orderRepository.save(order);
    }

    public List<Order> getOrdersByTable(Long tableId) {
        return orderRepository.findByTableId(tableId);
    }

    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserId(userId);
    }
    public List<Order> getActiveOrders() {
        // Assuming you have an OrderRepository
        return orderRepository.findByOrderStatusNot(Order.OrderStatus.COMPLETED);
        // Or if you want specific statuses:
        // return orderRepository.findByOrderStatusIn(List.of(
        //     Order.OrderStatus.PENDING,
        //     Order.OrderStatus.IN_PROGRESS,
        //     Order.OrderStatus.READY,
        //     Order.OrderStatus.DELIVERED
        // ));
    }

    @Transactional
    public Order applyDiscount(Long orderId, Double discountAmount) {
        Order order = getOrderById(orderId);
        order.setDiscountAmount(discountAmount);
        return orderRepository.save(order);
    }

    private void updateOrderTotal(Long orderId) {
        Order order = getOrderById(orderId);
        double subtotal = order.getItems().stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
        String billingStrategy = order.getBillingStrategy() != null ? order.getBillingStrategy() : "No Discount";
        BillingStrategy strategy = StrategyFactory.getStrategy(billingStrategy);
        double total = strategy.calculateTotal(subtotal, order.getDiscountAmount() != null ? order.getDiscountAmount() : 0);
        order.setTotalAmount(total);
        orderRepository.save(order);
    }

    public List<OrderItem> getActiveOrderItems() {
        return orderItemRepository.findByStatus(OrderItem.OrderItemStatus.PENDING);
    }

    public List<OrderItem> getOrderItems(Long orderId) {
        return orderItemRepository.findByOrderId(orderId);
    }

    public List<Order> getOrdersByPaymentStatus(String status) {
        // Map string to enum safely
        com.a4restaurant.model.Order.OrderStatus orderStatus;
        try {
            orderStatus = com.a4restaurant.model.Order.OrderStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new RuntimeException("Invalid order status: " + status);
        }
        // Use findByStatus instead of findByOrderStatus for correct mapping
        return orderRepository.findByStatus(orderStatus);
    }

    public List<User> getUsersWithPendingOrders() {
        return orderRepository.findUsersWithPendingOrders(com.a4restaurant.model.Order.OrderStatus.PENDING);
    }

    @Transactional
    public void payUserOrders(Long userId, List<Long> orderIds, String paymentMethod, Double discountAmount, String couponCode) {
        List<Order> orders = orderRepository.findAllById(orderIds);
        for (Order order : orders) {
            if (order.getUser().getId().equals(userId) && order.getStatus() == Order.OrderStatus.PENDING) {
                // Save discount and coupon info
                if (discountAmount != null && discountAmount > 0) {
                    order.setDiscountAmount(discountAmount);
                    order.setTotalAmount(order.getTotalAmount() - discountAmount);
                }
                if (couponCode != null && !couponCode.isEmpty()) {
                    order.setCouponCode(couponCode);
                }
                // Always set a valid status from enum
                order.setStatus(Order.OrderStatus.PAID);
                // Optionally, set payment details or create Payment record here
            }
        }
        orderRepository.saveAll(orders);
    }

    public List<Order> getOrdersByUserAndVisit(Long userId, String visitId) {
        return orderRepository.findByUserIdAndVisitId(userId, visitId);
    }
}