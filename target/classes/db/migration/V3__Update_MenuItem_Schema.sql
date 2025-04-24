-- Add missing columns to menu_items table
ALTER TABLE menu_items
    ADD COLUMN spicy_level INT NOT NULL DEFAULT 0,
    ADD COLUMN rating DOUBLE NOT NULL DEFAULT 0.0,
    ADD COLUMN allergen_info VARCHAR(255),
    ADD COLUMN preparation_time INT;

-- Update existing records with default values
UPDATE menu_items SET
    spicy_level = 0 WHERE spicy_level IS NULL,
    rating = 0.0 WHERE rating IS NULL,
    preparation_time = 15 WHERE preparation_time IS NULL;

-- Add check constraints
ALTER TABLE menu_items
    ADD CONSTRAINT menu_items_spicy_level_check
    CHECK (spicy_level >= 0 AND spicy_level <= 5),
    
    ADD CONSTRAINT menu_items_rating_check
    CHECK (rating >= 0 AND rating <= 5),
    
    ADD CONSTRAINT menu_items_preparation_time_check
    CHECK (preparation_time > 0); 