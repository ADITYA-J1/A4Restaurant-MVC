package com.a4restaurant.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "restaurant_tables")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantTable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String tableNumber;

    @Column(nullable = false)
    private Integer capacity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TableStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TableType type;

    @Column
    private LocalDateTime nextAvailableTime;

    @Column
    private LocalDateTime lastCleaned;

    @Column
    private Integer waitingTime;

    @OneToMany(mappedBy = "table", cascade = CascadeType.ALL)
    @JsonManagedReference(value = "table-orders")
    @JsonIgnore // Prevents recursion when serializing tables
    private List<Order> orders;

    public enum TableStatus {
        AVAILABLE,
        OCCUPIED,
        RESERVED,
        CLEANING
    }

    public enum TableType {
        INDOOR,
        OUTDOOR,
        VIP,
        BAR
    }
} 