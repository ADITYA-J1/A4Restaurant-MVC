package com.a4restaurant.command;

import com.a4restaurant.model.Order;
import com.a4restaurant.service.OrderService;

public class UpdateOrderStatusCommand implements OrderCommand {
    private final OrderService orderService;
    private final Long orderId;
    private final Order.OrderStatus newStatus;

    public UpdateOrderStatusCommand(OrderService orderService, Long orderId, Order.OrderStatus newStatus) {
        this.orderService = orderService;
        this.orderId = orderId;
        this.newStatus = newStatus;
    }

    @Override
    public void execute() {
        orderService.updateOrderStatus(orderId, newStatus);
    }
}
