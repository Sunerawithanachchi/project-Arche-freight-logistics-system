-- 001_initial_schema.sql

CREATE TABLE IF NOT EXISTS shipments (
    id SERIAL PRIMARY KEY,
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'BOOKED',

    --DAY 6 ticket 1 requirement : production timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    --Business logic constraint (The "state machine" enforcement at db level)
    CONSTRAINT check_status CHECK (status IN ('BOOKED', 'IN_TRANSIT', 'DELIVERED')) 
);

-- 2. Justified index
--why: we frequently filter shipments by status 
--without an index postgre has to scan every single row (Sequential scan)

CREATE INDEX idx_shipments_status ON shipments(status);