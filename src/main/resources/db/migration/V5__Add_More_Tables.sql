-- First, delete existing tables to avoid duplicates
DELETE FROM restaurant_tables;

-- Insert 12 tables with different capacities and types
INSERT INTO restaurant_tables (table_number, capacity, status, type) VALUES
-- Indoor Tables
('T1', 2, 'AVAILABLE', 'INDOOR'),  -- Small table for couples
('T2', 4, 'AVAILABLE', 'INDOOR'),  -- Standard family table
('T3', 4, 'AVAILABLE', 'INDOOR'),  -- Standard family table
('T4', 6, 'AVAILABLE', 'INDOOR'),  -- Larger family table

-- Outdoor Tables
('T5', 2, 'AVAILABLE', 'OUTDOOR'), -- Romantic outdoor setting
('T6', 4, 'AVAILABLE', 'OUTDOOR'), -- Family outdoor table
('T7', 6, 'AVAILABLE', 'OUTDOOR'), -- Large outdoor gathering
('T8', 8, 'AVAILABLE', 'OUTDOOR'), -- Party outdoor table

-- VIP Tables
('T9', 4, 'AVAILABLE', 'VIP'),    -- Small VIP group
('T10', 8, 'AVAILABLE', 'VIP'),   -- Large VIP party

-- Bar Tables
('T11', 2, 'AVAILABLE', 'BAR'),   -- Bar couple seating
('T12', 4, 'AVAILABLE', 'BAR');   -- Bar group seating 