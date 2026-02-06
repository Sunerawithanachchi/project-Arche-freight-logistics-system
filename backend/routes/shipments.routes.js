const express = require("express");
const router = express.Router();
const shipmentsController = require("../controllers/shipments.controller");

const auth = require("../middleware/auth");
const requireRole = require("../middleware/authorize");

//GET /shipments -fetch all shipments
router.get("/", auth, shipmentsController.getShipments);

router.get("/:id", auth, shipmentsController.getShipmentById);

//POST /shipments - create a new shipment -> admin only 2026-02-06 ticket 10:2
router.post(
  "/",
  auth,
  requireRole("admin"),
  shipmentsController.createShipment
);

//PATCH /shipments/:id/status - admin only

router.patch(
  "/:id/status",
  auth,
  requireRole("admin"),
  shipmentsController.updateStatus
);

module.exports = router;
