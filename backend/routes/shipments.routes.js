const express = require("express");
const router = express.Router();
const shipmentsController = require("../controllers/shipments.controller");

//GET /shipments
router.get("/", shipmentsController.getShipments);

module.exports = router;
