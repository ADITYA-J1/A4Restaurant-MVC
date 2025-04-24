package com.a4restaurant.repository;

import com.a4restaurant.model.Order;
import com.a4restaurant.model.Order.OrderStatus;
import com.a4restaurant.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    List<Order> findByTableId(Long tableId);
    
    List<Order> findByStatus(OrderStatus status);
    List<Order> findByStatusNot(Order.OrderStatus status);
    List<Order> findByOrderTimeBetween(LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT o FROM Order o WHERE o.status IN ('PENDING', 'IN_PROGRESS') ORDER BY o.orderTime ASC")
    List<Order> findActiveOrders();
    
    @Query("SELECT o FROM Order o WHERE o.table.id = :tableId AND o.status != 'COMPLETED'")
    List<Order> findActiveOrdersByTable(@Param("tableId") Long tableId);

    List<Order> findByUser(User user);

    List<Order> findByUserId(Long userId);

    List<Order> findByUserIdAndVisitId(Long userId, String visitId);

    @Query("SELECT o FROM Order o WHERE o.status = :status")
    List<Order> findByOrderStatus(@Param("status") com.a4restaurant.model.Order.OrderStatus status);

    @Query("SELECT o FROM Order o WHERE o.status != :status")
    List<Order> findByOrderStatusNot(@Param("status") com.a4restaurant.model.Order.OrderStatus status);

    @Query("SELECT DISTINCT o.user FROM Order o WHERE o.status = :status")
    List<User> findUsersWithPendingOrders(@Param("status") com.a4restaurant.model.Order.OrderStatus status);
} 
