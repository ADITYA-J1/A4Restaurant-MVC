package com.a4restaurant.service;

import com.a4restaurant.model.RestaurantTable;
import com.a4restaurant.model.RestaurantTable.TableStatus;
import com.a4restaurant.repository.TableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TableService {

    @Autowired
    private TableRepository tableRepository;

    public List<RestaurantTable> getAllTables() {
        return tableRepository.findAll();
    }

    public RestaurantTable getTableById(Long id) {
        return tableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Table not found with id: " + id));
    }

    @Transactional
    public RestaurantTable saveTable(RestaurantTable table) {
        return tableRepository.save(table);
    }

    @Transactional
    public RestaurantTable updateTableStatus(Long id, TableStatus status) {
        RestaurantTable table = getTableById(id);
        table.setStatus(status);
        return tableRepository.save(table);
    }

    @Transactional
    public RestaurantTable reserveTable(Long id, LocalDateTime reservationTime) {
        RestaurantTable table = getTableById(id);
        table.setStatus(TableStatus.RESERVED);
        table.setNextAvailableTime(reservationTime);
        return tableRepository.save(table);
    }

    @Transactional
    public RestaurantTable markTableAsCleaned(Long id) {
        RestaurantTable table = getTableById(id);
        table.setStatus(TableStatus.AVAILABLE);
        table.setLastCleaned(LocalDateTime.now());
        return tableRepository.save(table);
    }

    public List<RestaurantTable> getAvailableTables(Integer capacity) {
        return tableRepository.findByCapacityGreaterThanEqual(capacity)
                .stream()
                .filter(table -> table.getStatus() == TableStatus.AVAILABLE)
                .toList();
    }

    public List<RestaurantTable> getTablesByType(RestaurantTable.TableType type) {
        return tableRepository.findByType(type);
    }

    public Double getAverageWaitingTime() {
        return tableRepository.findAverageWaitingTime();
    }

    @Transactional
    public RestaurantTable updateWaitingTime(Long id, Integer waitingTime) {
        RestaurantTable table = getTableById(id);
        table.setWaitingTime(waitingTime);
        return tableRepository.save(table);
    }
} 