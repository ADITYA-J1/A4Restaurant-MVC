-- Create restaurant_tables table
CREATE TABLE IF NOT EXISTS restaurant_tables (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    table_number VARCHAR(10) NOT NULL,
    capacity INT NOT NULL,
    status VARCHAR(20) NOT NULL,
    type VARCHAR(20) NOT NULL,
    last_cleaned TIMESTAMP,
    next_available_time TIMESTAMP,
    waiting_time INT
);

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    price DOUBLE NOT NULL,
    category VARCHAR(20) NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    image_url VARCHAR(255),
    is_spicy BOOLEAN DEFAULT FALSE,
    is_vegetarian BOOLEAN DEFAULT FALSE,
    is_vegan BOOLEAN DEFAULT FALSE
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    table_id BIGINT NOT NULL,
    order_time TIMESTAMP NOT NULL,
    completion_time TIMESTAMP,
    status VARCHAR(20) NOT NULL,
    special_requests TEXT,
    total_amount DOUBLE NOT NULL,
    discount_amount DOUBLE DEFAULT 0,
    FOREIGN KEY (table_id) REFERENCES restaurant_tables(id)
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    menu_item_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    special_instructions TEXT,
    price DOUBLE NOT NULL,
    status VARCHAR(20) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);

-- Insert sample data for tables
INSERT INTO restaurant_tables (table_number, capacity, status, type) VALUES
('T1', 4, 'AVAILABLE', 'INDOOR'),
('T2', 6, 'AVAILABLE', 'INDOOR'),
('T3', 2, 'AVAILABLE', 'OUTDOOR'),
('T4', 8, 'AVAILABLE', 'VIP'),
('T5', 4, 'AVAILABLE', 'BAR'),
('T6', 6, 'AVAILABLE', 'OUTDOOR'),
('T7', 4, 'AVAILABLE', 'INDOOR'),
('T8', 10, 'AVAILABLE', 'VIP');

-- Insert sample data for menu items
INSERT INTO menu_items (name, description, price, category, is_available, is_spicy, is_vegetarian, is_vegan) VALUES
('Garlic Bread', 'Freshly baked bread with garlic butter', 5.99, 'STARTERS', TRUE, FALSE, TRUE, FALSE),
('Bruschetta', 'Toasted bread with tomatoes and basil', 6.99, 'STARTERS', TRUE, FALSE, TRUE, TRUE),
('Margherita Pizza', 'Classic pizza with tomato and mozzarella', 12.99, 'MAIN_COURSE', TRUE, FALSE, TRUE, FALSE),
('Spaghetti Carbonara', 'Pasta with creamy sauce and bacon', 14.99, 'MAIN_COURSE', TRUE, FALSE, FALSE, FALSE),
('Chicken Tikka Masala', 'Grilled chicken in creamy tomato sauce', 16.99, 'MAIN_COURSE', TRUE, TRUE, FALSE, FALSE),
('Chocolate Cake', 'Rich chocolate cake with ganache', 7.99, 'DESSERTS', TRUE, FALSE, TRUE, FALSE),
('Tiramisu', 'Classic Italian dessert with coffee', 8.99, 'DESSERTS', TRUE, FALSE, TRUE, FALSE),
('Coca Cola', 'Regular soft drink', 2.99, 'BEVERAGES', TRUE, FALSE, TRUE, TRUE),
('Iced Tea', 'Freshly brewed iced tea', 3.99, 'BEVERAGES', TRUE, FALSE, TRUE, TRUE),
('French Fries', 'Crispy golden fries', 4.99, 'SIDES', TRUE, FALSE, TRUE, TRUE); 