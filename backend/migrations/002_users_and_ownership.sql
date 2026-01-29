CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- modify shipment table
-- we add the column first , then the constraint
ALTER TABLE shipments ADD COLUMN owner_id UUID NOT NULL;

--Enforce foreign key
-- ON DELETE RESTRICT prevent deleting a user if they still have shipments
ALTER TABLE shipments 
ADD CONSTRAINT fk_shipment_owner
FOREIGN KEY (owner_id)
REFERENCES users(id)
ON DELETE RESTRICT ;