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

## 19 Jan 2026 - Backend Architecture: Database Integration Simplified
1. Why did we create a "Pool"?

Think of a Pool like a "group of open phone lines" to the database.

• The Problem: Logging into the database for every single click is slow and exhausts resources.

• The Solution: A Pool keeps a few connections "pre-warmed." When a user requests data, the app borrows a "phone line," uses it, and then hangs up (returns it to the pool) instead of shutting it down. This makes the app much faster and more stable.

2. How `db/index.js` exports data

This file acts as the Gateway.

• It uses `pg` (the driver) to define the connection details.

• It exports a single `query` function. This is a security and design choice: we don't expose the whole database "engine" to the rest of the app, only a specific "window" through which the app can send SQL commands.

3. How `shipment.controller.js` connects

The controller is the Translator.

• It "imports" that gateway: `const db = require('../db')`.

• Inside the controller, it uses `await db.query(...)`. The `await` tells the code: "Wait for the database to finish talking before moving to the next line."

• This separation means the controller handles logic (like filtering statuses), while `db/index.js` handles the plumbing (the actual connection).
