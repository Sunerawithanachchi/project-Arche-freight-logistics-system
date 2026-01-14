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
