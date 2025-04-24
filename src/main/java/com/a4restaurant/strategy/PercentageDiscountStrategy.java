package com.a4restaurant.strategy;

public class PercentageDiscountStrategy implements BillingStrategy {
    @Override
    public double calculateTotal(double subtotal, double discountAmount) {
        return subtotal - (subtotal * (discountAmount / 100.0));
    }
    @Override
    public String getStrategyName() {
        return "Percentage Discount";
    }
}
