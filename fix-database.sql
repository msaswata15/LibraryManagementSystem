-- Fix null book_id and member_id in borrowing_record table
DELETE FROM borrowing_record WHERE book_id IS NULL OR member_id IS NULL;

-- Fix null start_date and end_date in users table
UPDATE users 
SET start_date = CURRENT_DATE 
WHERE start_date IS NULL;

UPDATE users 
SET end_date = CURRENT_DATE + INTERVAL '1 year' 
WHERE end_date IS NULL;

-- Add constraints to prevent future null values
ALTER TABLE borrowing_record 
ALTER COLUMN book_id SET NOT NULL,
ALTER COLUMN member_id SET NOT NULL;

-- Optional: Add check constraints
-- ALTER TABLE users ADD CONSTRAINT check_start_date CHECK (start_date IS NOT NULL);
-- ALTER TABLE users ADD CONSTRAINT check_end_date CHECK (end_date IS NOT NULL);
