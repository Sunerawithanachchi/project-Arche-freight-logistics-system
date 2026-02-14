Day 3- Ticket 3: Domain-Driven Routing Implementation
Date: 2026-01-14

Key Achievements

• Decoupling: Moved shipment logic out of `app.js` into a dedicated `controllers/` and `routes/` structure.

• Architecture: Followed the Single Responsibility Principle (SRP) for better scalability.

• Git Recovery: Learned to resolve "Permission Denied" errors by killing ghost `node.exe` processes and clearing untracked file blockers.

File Structure Created

• `backend/controllers/shipments.controller.js`

• `backend/routes/shipments.routes.js`

Commands for Reference

• `taskkill /F /IM node.exe` (Kill locking processes)

• `git merge --abort` (Recovery from failed merge)

## 2026-01-31 Failure Containment : Implemented lazy DB connection and global error mapping. The system now returns 503 Service Unavailable for infra failures instead of 500s, preventing process crashes and data leaks. Health checks report "degraded" status but remain online.

## Centralized Error Handling & Safety

error handler centralizes all backend error handling to ensure consistent, secure, and predictable API responses. It logs internal error details for debugging while preventing sensitive implementation details (such as SQL errors or stack traces) from leaking to the client. The handler prioritizes known error cases, assigns appropriate HTTP status codes, and falls back to a safe 500 Internal Server Error for unexpected failures.
By separating internal logging from client-facing responses, this approach improves observability for developers while maintaining security and API stability in production environments.

## 2026-02-01 Identity vs. Ownership : Decoupled the trust boundary. Middleware now handles cryptographic identity verification (Who are you?), while Service layers handle ownership enforcement (Can you touch this shipment?). This prevents business logic from leaking into the authentication layer.

## 2026-02-03 Core Implementation Logic

Integrated Identity Provisioning: Transitioned from static/mock authentication to a dynamic Register-and-Issue flow. The POST /users endpoint now serves as the primary gateway for both data persistence and cryptographic credential delivery.

Cryptographic "Token Factory": Established a dedicated issuance utility (utils/token.js). This centralizes JWT signing logic, ensuring consistent enforcement of the sub (Subject) and exp (Expiration) claims across the entire system.

Decoupled Auth Architecture: Maintained a strict "Separation of Concerns" by isolating the Token Printer (Utility) from the Auth Guard (Middleware). This ensures the authentication logic doesn't care how a token is made, only that it is valid.

Data Integrity & Resilience
Relational Constraints as Guardrails: Implemented a UNIQUE constraint on the email column at the database level. This acts as the final "source of truth" to prevent data corruption or duplicate identities.

Semantic Error Mapping: Moved beyond generic 500 Internal Server Errors by mapping specific Postgres states to REST-compliant HTTP codes:

## Postgres 23505 → 409 Conflict: Provides clear feedback to the client regarding duplicate resources.

## Postgres 22P02 → 400 Bad Request: Correctly identifies malformed input before it compromises system logic.

Credential Hygiene: Enforced a mandatory 1-hour expiration window on all issued tokens. This limits the "blast radius" in the event of a token compromise, fulfilling basic security compliance standards.

## 2026-02-05 The Hashing Process

When a user signs up, you don't store their password. Instead:

Salt Generation: A random string (the salt) is created.

Hashing: The password and salt are combined and run through the bcrypt algorithm.

Storage: You store the resulting hash (which includes the salt) in your database.
12 rounds is currently the industry "sweet spot"—it takes about 250–350ms to hash

## 2026-02-06 RBAC architecture

Successfully migrated the API from a flat authentication model to a tiered Role-Based Access Control (RBAC) architecture. This ensures that while all registered users can access the system, high-risk operations (Create/Update Shipments) are strictly reserved for administrative identities.

## Current state of shipment API

view Shipments -> All Authenticated -> Operators & Admins can track logistics.
Create Shipment-> Admin Only -> Prevents unauthorized freight entries.
Update Status -> Admin Only

##express.json() explain
express.json is a built-in middleware that acts as a basic syntax checker. It reads the raw text stream coming from a request and uses JSON.parse to turn it into a JavaScript object stored in req.body. However, it only cares if the JSON is formatted correctly with proper commas and brackets. It does not care about the actual content, meaning it will allow a user to send an age as a string, an email without an @ symbol, or even extra malicious fields like isAdmin set to true. This leaves your req.body populated but dirty and unverified.

##Zod is a runtime schema validation library used to validate and parse external data (such as HTTP request bodies) before it reaches business logic. It ensures incoming data matches expected shapes and types, providing clear, structured validation errors. Zod complements TypeScript by enforcing data correctness at runtime, helping prevent invalid or unsafe data from propagating through the system.

##JSON response headers define how clients interpret API responses and help prevent unsafe content handling. Explicitly setting Content-Type: application/json ensures responses are treated strictly as data rather than executable content, reducing the risk of content-type confusion and unintended client-side behavior.

## Helmet

Helmet helps secure Express applications by setting a collection of HTTP response headers that enforce safer browser behavior. These headers reduce common attack vectors such as clickjacking, MIME-type sniffing, and cross-site scripting by instructing clients on how content may be framed, interpreted, and executed.
