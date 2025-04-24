package com.a4restaurant.strategy;

public class FlatDiscountStrategy implements BillingStrategy {
    @Override
    public double calculateTotal(double subtotal, double discountAmount) {
        return subtotal - discountAmount;
    }
    @Override
    public String getStrategyName() {
        return "Flat Discount";
    }
}
