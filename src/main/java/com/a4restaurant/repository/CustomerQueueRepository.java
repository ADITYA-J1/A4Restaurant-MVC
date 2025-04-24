package com.a4restaurant.repository;

import com.a4restaurant.model.CustomerQueue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerQueueRepository extends JpaRepository<CustomerQueue, Long> {
    List<CustomerQueue> findAllByOrderByJoinTimeAsc();
} 