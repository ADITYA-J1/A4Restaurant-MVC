-- First, clean up any existing data that doesn't match our new categories
DELETE FROM menu_items WHERE category NOT IN ('NORTH_INDIAN', 'SOUTH_INDIAN', 'ITALIAN', 'MEXICAN', 'CONTINENTAL', 'JAIN');

-- Update any NULL values in the existing columns
UPDATE menu_items SET
    spicy_level = 0 WHERE spicy_level IS NULL;
    
UPDATE menu_items SET
    rating = 0.0 WHERE rating IS NULL;
    
UPDATE menu_items SET
    is_vegetarian = false WHERE is_vegetarian IS NULL;
    
UPDATE menu_items SET
    preparation_time = 15 WHERE preparation_time IS NULL;

-- Add check constraint for categories
ALTER TABLE menu_items
    ADD CONSTRAINT menu_items_category_check
    CHECK (category IN ('NORTH_INDIAN', 'SOUTH_INDIAN', 'ITALIAN', 'MEXICAN', 'CONTINENTAL', 'JAIN'));

-- Delete existing menu items
DELETE FROM menu_items;

-- Add sample menu items for each category
INSERT INTO menu_items (
    name, 
    description, 
    price, 
    category, 
    is_available, 
    image_url, 
    spicy_level, 
    is_vegetarian, 
    preparation_time, 
    allergen_info
) VALUES
-- North Indian
('Butter Chicken', 'Creamy tomato-based curry with tender chicken pieces', 350.00, 'NORTH_INDIAN', true, '/images/menu/north-indian/butter-chicken.jpeg', 2, false, 25, 'Dairy, Chicken'),
('Dal Makhani', 'Creamy black lentils cooked overnight', 250.00, 'NORTH_INDIAN', true, '/images/menu/north-indian/dal-makhani.jpeg', 1, true, 20, 'Dairy'),
('Paneer Tikka', 'Grilled cottage cheese with spices', 280.00, 'NORTH_INDIAN', true, '/images/menu/north-indian/paneer-tikka.jpeg', 2, true, 15, 'Dairy'),

-- South Indian
('Masala Dosa', 'Crispy rice crepe with spiced potato filling', 180.00, 'SOUTH_INDIAN', true, '/images/menu/south-indian/masala-dosa.jpeg', 2, true, 15, 'None'),
('Idli Sambar', 'Steamed rice cakes with lentil soup', 150.00, 'SOUTH_INDIAN', true, '/images/menu/south-indian/idli-sambar.jpeg', 1, true, 10, 'None'),
('Hyderabadi Biryani', 'Aromatic rice dish with spiced meat', 380.00, 'SOUTH_INDIAN', true, '/images/menu/south-indian/biryani.jpeg', 3, false, 30, 'None'),

-- Italian
('Margherita Pizza', 'Classic pizza with tomato sauce and mozzarella', 450.00, 'ITALIAN', true, '/images/menu/italian/margherita.jpeg', 0, true, 20, 'Gluten, Dairy'),
('Pasta Carbonara', 'Creamy pasta with bacon and egg', 380.00, 'ITALIAN', true, '/images/menu/italian/carbonara.jpeg', 0, false, 15, 'Gluten, Dairy, Egg'),
('Tiramisu', 'Classic Italian coffee-flavored dessert', 280.00, 'ITALIAN', true, '/images/menu/italian/tiramisu.jpeg', 0, true, 10, 'Dairy, Egg'),

-- Mexican
('Chicken Tacos', 'Soft tortillas with spiced chicken filling', 320.00, 'MEXICAN', true, '/images/menu/mexican/tacos.jpeg', 2, false, 15, 'Gluten'),
('Vegetarian Quesadilla', 'Grilled tortilla with cheese and vegetables', 280.00, 'MEXICAN', true, '/images/menu/mexican/quesadilla.jpeg', 1, true, 12, 'Gluten, Dairy'),
('Guacamole & Nachos', 'Fresh avocado dip with crispy tortilla chips', 220.00, 'MEXICAN', true, '/images/menu/mexican/guacamole.jpeg', 1, true, 8, 'None'),

-- Continental
('Classic Burger', 'Juicy beef patty with fresh vegetables', 380.00, 'CONTINENTAL', true, '/images/menu/continental/burger.jpeg', 0, false, 15, 'Gluten, Dairy'),
('Caesar Salad', 'Crispy lettuce with classic Caesar dressing', 280.00, 'CONTINENTAL', true, '/images/menu/continental/caesar-salad.jpeg', 0, false, 10, 'Dairy, Egg'),
('Grilled Salmon', 'Fresh salmon with herbs and lemon butter', 520.00, 'CONTINENTAL', true, '/images/menu/continental/salmon.jpeg', 0, false, 20, 'Fish, Dairy'); 