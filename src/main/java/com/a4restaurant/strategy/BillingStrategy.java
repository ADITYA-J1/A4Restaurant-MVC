package com.a4restaurant.strategy;

public interface BillingStrategy {
    double calculateTotal(double subtotal, double discountAmount);
    String getStrategyName();
}
