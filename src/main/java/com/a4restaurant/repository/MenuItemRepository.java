package com.a4restaurant.repository;

import com.a4restaurant.model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByCategory(String category);
    List<MenuItem> findByAvailable(boolean available);
    List<MenuItem> findByCategoryAndAvailable(String category, boolean available);
}
