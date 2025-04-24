package com.a4restaurant.controller;

import com.a4restaurant.model.*;
import com.a4restaurant.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    @Autowired private MenuItemRepository menuItemRepo;
    @Autowired private TableReservationRepository tableRepo;
    @Autowired private PaymentRepository paymentRepo;
    @Autowired private FeedbackRepository feedbackRepo;
    @Autowired private UserRepository userRepo;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TableReservation>> getUserReservations(@PathVariable Long userId) {
        List<TableReservation> reservations = tableRepo.findByUserId(userId);
        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TableReservation> getReservation(@PathVariable Long id) {
        TableReservation reservation = tableRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Reservation not found"));
        return ResponseEntity.ok(reservation);
    }

    @PostMapping
    public ResponseEntity<TableReservation> createReservation(@RequestBody TableReservation reservation) {
        TableReservation savedReservation = tableRepo.save(reservation);
        return ResponseEntity.ok(savedReservation);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TableReservation> updateReservation(
            @PathVariable Long id,
            @RequestBody TableReservation reservation) {
        if (!tableRepo.existsById(id)) {
            throw new RuntimeException("Reservation not found");
        }
        reservation.setId(id);
        TableReservation updatedReservation = tableRepo.save(reservation);
        return ResponseEntity.ok(updatedReservation);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelReservation(@PathVariable Long id) {
        if (!tableRepo.existsById(id)) {
            throw new RuntimeException("Reservation not found");
        }
        tableRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/available")
    public ResponseEntity<Boolean> checkAvailability(
            @RequestParam String date,
            @RequestParam String time,
            @RequestParam int guests) {
        // Add your availability checking logic here
        // For now, returning true as placeholder
        return ResponseEntity.ok(true);
    }
}
