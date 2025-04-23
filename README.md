# A4RestaurantSpringBoot

A comprehensive Restaurant Management System built with Spring Boot. This project demonstrates robust backend architecture, leveraging modern design principles and patterns to ensure scalability, maintainability, and clarity.

## 🚀 Project Overview
A4RestaurantSpringBoot-FINAL is a backend application for managing restaurant operations such as orders, menu items, and order status history. It is designed for extensibility and follows best practices in object-oriented analysis and design (OOAD).

## ✨ Features
- Place, update, and manage restaurant orders
- Maintain order status history
- Repository pattern for data access abstraction
- Database migrations for schema evolution

## 🏗️ Design Principles & Patterns
This codebase explicitly applies several design principles (e.g., SOLID, DRY) and design patterns (Singleton, Strategy).

A detailed mapping of these principles and patterns—including code locations 

## 🛠️ Tech Stack
- Java 17+
- Spring Boot
- Spring Data JPA
- H2 / MySQL (configurable)
- Flyway (for database migrations)
- Maven

## ⚙️ Setup Instructions
1. **Clone the repository:**
   ```bash
   git clone 
   cd A4RestaurantSpringBoot-FINAL
   ```
2. **Configure the database:**
   - Edit `src/main/resources/application.properties` as needed.
3. **Run database migrations:**
   Flyway will auto-run on application startup.
4. **Build and run the application:**
   ```bash
   mvn spring-boot:run
   ```
5. **Access the API:**
   The backend runs at `http://localhost:8080/` by default.

## 📚 Usage
- Use API clients like Postman to interact with endpoints for orders and menu management.

---
*Last updated: 2025-04-23*
