package com.a4restaurant.controller;

import com.a4restaurant.model.CustomerQueue;
import com.a4restaurant.model.QueueStatus;
import com.a4restaurant.repository.CustomerQueueRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/queue")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true", maxAge = 3600)
@Validated
public class QueueController {

    @Autowired
    private CustomerQueueRepository queueRepository;

    @GetMapping
    public ResponseEntity<List<CustomerQueue>> getQueue() {
        List<CustomerQueue> queue = queueRepository.findAllByOrderByJoinTimeAsc();
        return ResponseEntity.ok(queue);
    }

    @PostMapping
    public ResponseEntity<CustomerQueue> addToQueue(@Valid @RequestBody CustomerQueue customer) {
        customer.setStatus(QueueStatus.WAITING);
        customer.setJoinTime(new java.util.Date());
        CustomerQueue savedCustomer = queueRepository.save(customer);
        return ResponseEntity.ok(savedCustomer);
    }

    @PutMapping("/{id}/estimate")
    public ResponseEntity<CustomerQueue> updateWaitTime(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> request) {
        
        Integer estimatedWaitMinutes = request.get("estimatedWaitMinutes");
        if (estimatedWaitMinutes == null || estimatedWaitMinutes < 0 || estimatedWaitMinutes > 240) {
            return ResponseEntity.badRequest().build();
        }

        return queueRepository.findById(id)
                .map(customer -> {
                    customer.setEstimatedWaitMinutes(estimatedWaitMinutes);
                    CustomerQueue updatedCustomer = queueRepository.save(customer);
                    return ResponseEntity.ok(updatedCustomer);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<CustomerQueue> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        
        String statusStr = request.get("status");
        if (statusStr == null) {
            return ResponseEntity.badRequest().build();
        }

        try {
            QueueStatus newStatus = QueueStatus.valueOf(statusStr.toUpperCase());
            return queueRepository.findById(id)
                    .map(customer -> {
                        customer.setStatus(newStatus);
                        CustomerQueue updatedCustomer = queueRepository.save(customer);
                        return ResponseEntity.ok(updatedCustomer);
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeFromQueue(@PathVariable Long id) {
        return queueRepository.findById(id)
                .map(customer -> {
                    queueRepository.delete(customer);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getQueueStatus() {
        long count = queueRepository.count();
        String status = count > 0 ? "ACTIVE" : "EMPTY";
        return ResponseEntity.ok(Map.of(
            "status", status,
            "count", count
        ));
    }
} 