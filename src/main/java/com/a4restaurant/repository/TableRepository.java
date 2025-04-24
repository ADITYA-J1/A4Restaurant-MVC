package com.a4restaurant.repository;

import com.a4restaurant.model.RestaurantTable;
import com.a4restaurant.model.RestaurantTable.TableStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TableRepository extends JpaRepository<RestaurantTable, Long> {
    
    List<RestaurantTable> findByStatus(TableStatus status);
    
    List<RestaurantTable> findByCapacityGreaterThanEqual(Integer capacity);
    
    List<RestaurantTable> findByType(RestaurantTable.TableType type);
    
    @Query("SELECT t FROM RestaurantTable t WHERE t.nextAvailableTime <= :time AND t.status = 'RESERVED'")
    List<RestaurantTable> findAvailableAfterTime(LocalDateTime time);
    
    @Query("SELECT t FROM RestaurantTable t WHERE t.status = 'AVAILABLE' OR (t.status = 'RESERVED' AND t.nextAvailableTime <= :time)")
    List<RestaurantTable> findAvailableTables(LocalDateTime time);
    
    @Query("SELECT AVG(t.waitingTime) FROM RestaurantTable t")
    Double findAverageWaitingTime();
} 