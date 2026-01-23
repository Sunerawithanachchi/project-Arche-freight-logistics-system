# Day 4 -Ticket 2 Completion Report: Data Integrity & Constraints

## 1. Handling Existing Invalid Data
During the audit, one row was found with the status `LOST_IN_STORM`. 
- **Action taken:** The row was deleted prior to applying the constraint to ensure the `ALTER TABLE` command succeeded without conflict.

## 2. Decision: CHECK Constraint vs. ENUM
- **Choice:** `CHECK` Constraint.
- **Reasoning:** While ENUMs are useful for static types, `CHECK` constraints are more flexible for evolving business logic in PostgreSQL. It allows us to modify valid statuses in the future with a simple `ALTER TABLE` without the overhead of managing custom types.

## 3. Responsibility Boundaries
- **Database Enforces:** Data Integrity. It ensures no invalid strings ever enter the `status` column, acting as the "Final Line of Defense."
- **Application Enforces:** User Experience & Defensive Filtering. The Node.js app filters out invalid statuses during the fetch process to ensure the UI remains stable even if the DB contains legacy or unexpected data.

## 4. Proof of Constraint
Attempting to insert an invalid status (`LOST_IN_STORM`) now results in the following error:
`ERROR: new row for relation "shipments" violates check constraint "chk_status"`
`DETAIL: Failing row contains (6, London, New York, LOST_IN_STORM).`