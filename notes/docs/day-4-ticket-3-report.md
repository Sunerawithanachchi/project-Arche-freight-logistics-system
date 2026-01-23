# Ticket 3 Completion Report: Controlled Shipment Creation 2026-01-24

## 1. Validation Strategy
 implemented a **two-tier validation** approach:
- **Application Layer:** Express controller checks for missing fields and valid status strings before querying the DB. This provides fast feedback (400 Bad Request) to the client.
- **Database Layer:** The `chk_status` constraint (from Ticket 2) acts as the final safety net for data integrity.

## 2. Error Paths
- **Expected Errors (400):** Handled via conditional checks in the controller. These prevent malformed data from reaching the database.
- **Unexpected Errors (500):** Handled via a `try/catch` block in the controller. Database connection issues or query syntax errors are logged to the console while returning a safe message to the client.

## 3. Security: Parameterized Queries
 used the `$1, $2, $3` placeholder syntax for the `INSERT` statement. 
- **Why it matters:** This prevents **SQL Injection** attacks by ensuring the database treats user input strictly as data, never as executable code.

## 4. Verification Results
The following tests were performed via a custom Node.js test script:
-  **Valid POST:** Created ID 7 (Hamburg -> Madrid)
-  **Invalid Status:** Rejected with 400 (Input: "FLYING")
-  **Missing Fields:** Rejected with 400 (Input: Missing destination)