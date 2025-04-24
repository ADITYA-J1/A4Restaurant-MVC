package com.a4restaurant.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Entity
@Table(name = "menu_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MenuItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private Double price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Column(name = "is_available", nullable = false)
    private boolean available;

    @Column
    private String imageUrl;

    @Column(nullable = false)
    private Integer spicyLevel = 0;

    @Column(nullable = false)
    private Double rating = 0.0;

    @Column(nullable = false)
    private Boolean isVegetarian = false;

    @Column
    private String allergenInfo;

    @Column
    private Integer preparationTime; // in minutes

    @OneToMany(mappedBy = "menuItem")
    @JsonIgnore // Prevents recursion when serializing menu items
    private List<OrderItem> orderItems;

    public enum Category {
        NORTH_INDIAN("North Indian"),
        SOUTH_INDIAN("South Indian"),
        ITALIAN("Italian"),
        MEXICAN("Mexican"),
        CONTINENTAL("Continental"),
        JAIN("Jain");

        private final String displayName;

        Category(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }
}
