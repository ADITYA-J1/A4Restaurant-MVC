package com.a4restaurant.observer;

import com.a4restaurant.model.Order;
import com.a4restaurant.model.OrderStatusHistory;
import com.a4restaurant.repository.OrderRepository;
import com.a4restaurant.repository.OrderStatusHistoryRepository;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
public class DatabaseOrderStatusObserver implements OrderStatusObserver {
    private final OrderRepository orderRepository;
    private final OrderStatusHistoryRepository historyRepository;

    public DatabaseOrderStatusObserver(OrderRepository orderRepository, OrderStatusHistoryRepository historyRepository) {
        this.orderRepository = orderRepository;
        this.historyRepository = historyRepository;
    }

    @Override
    public void onOrderStatusChanged(Long orderId, String newStatus) {
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order != null) {
            OrderStatusHistory history = new OrderStatusHistory();
            history.setOrderId(orderId);
            history.setOldStatus(order.getStatus().name());
            history.setNewStatus(newStatus);
            history.setChangedAt(LocalDateTime.now());
            historyRepository.save(history);
        }
    }
}
