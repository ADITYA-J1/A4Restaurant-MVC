package com.a4restaurant.websocket;

import com.a4restaurant.observer.OrderStatusObserver;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
public class WebSocketOrderStatusObserver implements OrderStatusObserver {
    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketOrderStatusObserver(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    public void onOrderStatusChanged(Long orderId, String newStatus) {
        messagingTemplate.convertAndSend("/topic/order-status", new OrderStatusMessage(orderId, newStatus));
    }

    public static class OrderStatusMessage {
        private Long orderId;
        private String status;

        public OrderStatusMessage(Long orderId, String status) {
            this.orderId = orderId;
            this.status = status;
        }
        public Long getOrderId() { return orderId; }
        public String getStatus() { return status; }
    }
}
