package com.a4restaurant.observer;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class OrderStatusNotifier {
    private static final List<OrderStatusObserver> observers = new CopyOnWriteArrayList<>();

    public static void registerObserver(OrderStatusObserver observer) {
        observers.add(observer);
    }

    public static void removeObserver(OrderStatusObserver observer) {
        observers.remove(observer);
    }

    public static void notifyObservers(Long orderId, String newStatus) {
        for (OrderStatusObserver observer : observers) {
            observer.onOrderStatusChanged(orderId, newStatus);
        }
    }
}
