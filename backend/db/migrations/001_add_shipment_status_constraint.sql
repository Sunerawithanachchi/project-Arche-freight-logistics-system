-- Migration: Add CHECK constraint to shipment status
-- Date: 2026-01-23 

-- 1 Remove rows that violate the upcoming constraint
DELETE FROM shipments 
WHERE status NOT IN ('BOOKED', 'IN_TRANSIT' , 'DELIVERED');

-- 2 Apply the constraint
ALTER TABLE shipments
ADD CONSTRAINT chk_status 
CHECK(status IN ('BOOKED', 'IN_TRANSIT', 'DELIVERED'));