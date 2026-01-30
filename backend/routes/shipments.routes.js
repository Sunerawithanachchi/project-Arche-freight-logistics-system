const express = require("express");
const router = express.Router();
const shipmentsController = require("../controllers/shipments.controller");

//GET /shipments -fetch all shipments
router.get("/", shipmentsController.getShipments);

router.get("/:id", shipmentsController.getShipmentById);

//POST /shipments - create a new shipment
router.post("/", shipmentsController.createShipment);

router.patch("/:id/status", shipmentsController.updateStatus);

module.exports = router;
