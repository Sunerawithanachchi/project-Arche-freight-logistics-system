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

## 2026-02-01 Identity vs. Ownership : Decoupled the trust boundary. Middleware now handles cryptographic identity verification (Who are you?), while Service layers handle ownership enforcement (Can you touch this shipment?). This prevents business logic from leaking into the authentication layer.
