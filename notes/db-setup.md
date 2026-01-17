# Database Setup - Day 4 Ticket 1

## Database Name
`freight_ops_dev`

## Table Schema: shipments
| Column      | Type    | Constraints |
|-------------|---------|-------------|
| id          | SERIAL  | PRIMARY KEY |
| origin      | TEXT    | NOT NULL    |
| destination | TEXT    | NOT NULL    |
| status      | TEXT    | NOT NULL    |

## Manual Seed Data
Inserted 4 rows manually via psql on 2026-01-17. 
Includes one invalid status (`LOST_IN_STORM`) for validation testing.