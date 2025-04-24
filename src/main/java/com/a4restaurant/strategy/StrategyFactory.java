package com.a4restaurant.strategy;

public class StrategyFactory {
    public static BillingStrategy getStrategy(String strategyName) {
        if (strategyName == null) return new NoDiscountStrategy();
        switch (strategyName) {
            case "Percentage Discount":
                return new PercentageDiscountStrategy();
            case "Flat Discount":
                return new FlatDiscountStrategy();
            case "No Discount":
            default:
                return new NoDiscountStrategy();
        }
    }
}
