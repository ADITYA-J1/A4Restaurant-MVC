-- Manual SQL migration for TableReservation table to add table_id foreign key

ALTER TABLE tablereservation ADD COLUMN table_id BIGINT;

-- If you want to make all existing reservations point to a specific table (e.g., table with id=1), run:
UPDATE tablereservation SET table_id = 1 WHERE table_id IS NULL;

-- Add foreign key constraint (assuming your table is named 'restaurant_table')
ALTER TABLE tablereservation ADD CONSTRAINT fk_table_reservation_table FOREIGN KEY (table_id) REFERENCES restaurant_table(id);

-- If you want to make the column NOT NULL after updating existing rows:
ALTER TABLE tablereservation ALTER COLUMN table_id SET NOT NULL;
