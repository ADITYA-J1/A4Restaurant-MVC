package com.a4restaurant.observer;

public interface OrderStatusObserver {
    void onOrderStatusChanged(Long orderId, String newStatus);
}
