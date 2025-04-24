package com.a4restaurant.config;

import com.a4restaurant.observer.OrderStatusNotifier;
import com.a4restaurant.observer.DatabaseOrderStatusObserver;
import com.a4restaurant.repository.OrderRepository;
import com.a4restaurant.repository.OrderStatusHistoryRepository;
import com.a4restaurant.websocket.WebSocketOrderStatusObserver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.SimpMessagingTemplate;

@Configuration
public class OrderStatusObserverConfig {
    @Bean
    public WebSocketOrderStatusObserver webSocketOrderStatusObserver(SimpMessagingTemplate messagingTemplate) {
        WebSocketOrderStatusObserver observer = new WebSocketOrderStatusObserver(messagingTemplate);
        OrderStatusNotifier.registerObserver(observer);
        return observer;
    }

    @Bean
    public DatabaseOrderStatusObserver databaseOrderStatusObserver(
        OrderRepository orderRepository,
        OrderStatusHistoryRepository historyRepository
    ) {
        DatabaseOrderStatusObserver observer = new DatabaseOrderStatusObserver(orderRepository, historyRepository);
        OrderStatusNotifier.registerObserver(observer);
        return observer;
    }
}
