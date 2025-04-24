package com.a4restaurant.strategy;

public class NoDiscountStrategy implements BillingStrategy {
    @Override
    public double calculateTotal(double subtotal, double discountAmount) {
        return subtotal;
    }
    @Override
    public String getStrategyName() {
        return "No Discount";
    }
}
