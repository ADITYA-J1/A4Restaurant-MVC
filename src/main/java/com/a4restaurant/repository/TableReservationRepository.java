package com.a4restaurant.repository;

import com.a4restaurant.model.TableReservation;
import com.a4restaurant.model.RestaurantTable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TableReservationRepository extends JpaRepository<TableReservation, Long> {
    List<TableReservation> findByUserId(Long userId);
    TableReservation findByTable(RestaurantTable table);
}
