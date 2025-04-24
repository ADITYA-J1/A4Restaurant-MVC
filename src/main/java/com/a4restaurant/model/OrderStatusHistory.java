package com.a4restaurant.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "order_status_history")
public class OrderStatusHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long orderId;
    private String oldStatus;
    private String newStatus;
    private LocalDateTime changedAt;

    public OrderStatusHistory() {}
    public OrderStatusHistory(Long orderId, String oldStatus, String newStatus, LocalDateTime changedAt) {
        this.orderId = orderId;
        this.oldStatus = oldStatus;
        this.newStatus = newStatus;
        this.changedAt = changedAt;
    }
    public Long getId() { return id; }
    public Long getOrderId() { return orderId; }
    public String getOldStatus() { return oldStatus; }
    public String getNewStatus() { return newStatus; }
    public LocalDateTime getChangedAt() { return changedAt; }
    public void setId(Long id) { this.id = id; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    public void setOldStatus(String oldStatus) { this.oldStatus = oldStatus; }
    public void setNewStatus(String newStatus) { this.newStatus = newStatus; }
    public void setChangedAt(LocalDateTime changedAt) { this.changedAt = changedAt; }
}
