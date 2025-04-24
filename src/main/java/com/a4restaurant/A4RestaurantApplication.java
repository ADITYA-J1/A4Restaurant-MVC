package com.a4restaurant;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = "com.a4restaurant")
@EntityScan("com.a4restaurant.model")
@EnableJpaRepositories("com.a4restaurant.repository")
public class A4RestaurantApplication {
    public static void main(String[] args) {
        SpringApplication.run(A4RestaurantApplication.class, args);
    }
}
