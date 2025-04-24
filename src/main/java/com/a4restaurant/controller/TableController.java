package com.a4restaurant.controller;

import com.a4restaurant.model.RestaurantTable;
import com.a4restaurant.model.RestaurantTable.TableStatus;
import com.a4restaurant.model.TableReservation;
import com.a4restaurant.repository.TableRepository;
import com.a4restaurant.repository.TableReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true", maxAge = 3600)
public class TableController {

    @Autowired
    private TableRepository tableRepository;

    @Autowired
    private TableReservationRepository reservationRepository;

    @GetMapping
    public ResponseEntity<List<RestaurantTable>> getAllTables() {
        List<RestaurantTable> tables = tableRepository.findAll();
        List<TableReservation> reservations = reservationRepository.findAll();

        for (RestaurantTable table : tables) {
            boolean isReserved = reservations.stream()
                .anyMatch(res -> res.getTable() != null && res.getTable().getId().equals(table.getId()));
            if (isReserved) {
                table.setStatus(TableStatus.RESERVED);
            } else {
                table.setStatus(TableStatus.AVAILABLE);
            }
        }
        return ResponseEntity.ok(tables);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RestaurantTable> getTable(@PathVariable Long id) {
        return tableRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<RestaurantTable> updateTableStatus(
            @PathVariable Long id,
            @RequestParam TableStatus status) {
        return tableRepository.findById(id)
                .map(table -> {
                    table.setStatus(status);
                    RestaurantTable updatedTable = tableRepository.save(table);
                    return ResponseEntity.ok(updatedTable);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/reservations")
    public synchronized ResponseEntity<TableReservation> createReservation(@RequestBody TableReservation reservation) {
        if (reservation.getTable() == null || reservation.getTable().getId() == null) {
            throw new IllegalArgumentException("Missing tableId in reservation body");
        }
        RestaurantTable table = tableRepository.findById(reservation.getTable().getId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid table ID"));
        if (table.getStatus() == TableStatus.RESERVED || table.getStatus() == TableStatus.OCCUPIED) {
            throw new IllegalStateException("Table is already reserved or occupied");
        }
        table.setStatus(TableStatus.RESERVED);
        tableRepository.save(table);
        reservation.setTable(table);
        TableReservation savedReservation = reservationRepository.save(reservation);
        return ResponseEntity.ok(savedReservation);
    }

    @GetMapping("/reservations")
    public ResponseEntity<List<TableReservation>> getReservations() {
        List<TableReservation> reservations = reservationRepository.findAll();
        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/available")
    public ResponseEntity<List<RestaurantTable>> getAvailableTables() {
        List<RestaurantTable> availableTables = tableRepository.findByStatus(TableStatus.AVAILABLE);
        return ResponseEntity.ok(availableTables);
    }

    @DeleteMapping("/reservations/{tableId}")
    public ResponseEntity<?> clearReservation(@PathVariable Long tableId) {
        RestaurantTable table = tableRepository.findById(tableId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid table ID"));
        TableReservation reservation = reservationRepository.findByTable(table);
        if (reservation != null) {
            reservationRepository.delete(reservation);
        }
        table.setStatus(TableStatus.AVAILABLE);
        tableRepository.save(table);
        return ResponseEntity.ok().build();
    }
} 