-- Update existing menu items with new field values
UPDATE menu_items SET
    spicy_level = 2,
    rating = 4.5,
    preparation_time = 20,
    allergen_info = 'Contains dairy'
WHERE name = 'Butter Chicken';

UPDATE menu_items SET
    spicy_level = 1,
    rating = 4.2,
    preparation_time = 15,
    allergen_info = 'Contains dairy'
WHERE name = 'Dal Makhani';

UPDATE menu_items SET
    spicy_level = 3,
    rating = 4.7,
    preparation_time = 25,
    allergen_info = 'Contains gluten'
WHERE name = 'Masala Dosa';

UPDATE menu_items SET
    spicy_level = 4,
    rating = 4.8,
    preparation_time = 30,
    allergen_info = 'Contains nuts'
WHERE name = 'Hyderabadi Biryani';

UPDATE menu_items SET
    spicy_level = 0,
    rating = 4.3,
    preparation_time = 15,
    allergen_info = 'Contains gluten, dairy'
WHERE name = 'Margherita Pizza';

UPDATE menu_items SET
    spicy_level = 0,
    rating = 4.6,
    preparation_time = 20,
    allergen_info = 'Contains dairy, eggs'
WHERE name = 'Tiramisu';

UPDATE menu_items SET
    spicy_level = 2,
    rating = 4.4,
    preparation_time = 15,
    allergen_info = 'Contains gluten'
WHERE name = 'Chicken Tacos';

UPDATE menu_items SET
    spicy_level = 1,
    rating = 4.1,
    preparation_time = 10,
    allergen_info = 'Contains dairy'
WHERE name = 'Guacamole & Nachos';

UPDATE menu_items SET
    spicy_level = 1,
    rating = 4.5,
    preparation_time = 15,
    allergen_info = 'Contains gluten'
WHERE name = 'Classic Burger';

UPDATE menu_items SET
    spicy_level = 0,
    rating = 4.7,
    preparation_time = 20,
    allergen_info = 'Contains fish'
WHERE name = 'Grilled Salmon'; 