package com.a4restaurant.service;

import com.a4restaurant.model.MenuItem;
import com.a4restaurant.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MenuItemService {

    @Autowired
    private MenuItemRepository menuItemRepository;

    public List<MenuItem> getAllMenuItems() {
        return menuItemRepository.findAll();
    }

    public MenuItem getMenuItemById(Long id) {
        return menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu item not found with id: " + id));
    }

    public List<MenuItem> getMenuItemsByCategory(String category) {
        return menuItemRepository.findByCategory(category);
    }

    @Transactional
    public MenuItem createMenuItem(MenuItem menuItem) {
        return menuItemRepository.save(menuItem);
    }

    @Transactional
    public MenuItem updateMenuItem(Long id, MenuItem menuItem) {
        MenuItem existingItem = getMenuItemById(id);
        
        existingItem.setName(menuItem.getName());
        existingItem.setDescription(menuItem.getDescription());
        existingItem.setPrice(menuItem.getPrice());
        existingItem.setCategory(menuItem.getCategory());
        existingItem.setAvailable(menuItem.isAvailable());
        existingItem.setImageUrl(menuItem.getImageUrl());
        existingItem.setSpicyLevel(menuItem.getSpicyLevel());
        existingItem.setRating(menuItem.getRating());
        existingItem.setIsVegetarian(menuItem.getIsVegetarian());
        existingItem.setAllergenInfo(menuItem.getAllergenInfo());
        existingItem.setPreparationTime(menuItem.getPreparationTime());

        return menuItemRepository.save(existingItem);
    }

    @Transactional
    public void deleteMenuItem(Long id) {
        MenuItem menuItem = getMenuItemById(id);
        menuItemRepository.delete(menuItem);
    }

    @Transactional
    public MenuItem updateAvailability(Long id, boolean available) {
        MenuItem menuItem = getMenuItemById(id);
        menuItem.setAvailable(available);
        return menuItemRepository.save(menuItem);
    }
} 