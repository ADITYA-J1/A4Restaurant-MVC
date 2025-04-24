package com.a4restaurant.controller;

import com.a4restaurant.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @Autowired
    private MenuItemRepository menuRepo;

    @GetMapping("/")
    public String home() {
        return "index";
    }

    @GetMapping("/menu")
    public String menu(Model model) {
        model.addAttribute("menuItems", menuRepo.findAll());
        return "menu";
    }
}
