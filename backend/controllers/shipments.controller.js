/* const VALID_STATUSES = ["BOOKED", "IN_TRANSIT", "DELIVERED"];
// A static array represent our "Database" for now

const shipments = [
  {
    id: "101",
    origin: "Colombo",
    destination: "Singapore",
    status: "IN_TRANSIT",
  },
  { id: "102", origin: "Mumbai", destination: "Dubai", status: "DELIVERED" },
  {
    id: "103",
    origin: "Rotterdam",
    destination: "New york",
    status: "LOST_IN_STORM",
  },
];

const getShipments = (req, res) => {
  const validShipments = shipments.filter((shipment) => {
    const isValid = VALID_STATUSES.includes(shipment.status);
    if (!isValid) {
      //log warning
      console.warn(
        `[VALIDATION WARNING]: Shipment ${shipment.id} has an invalid status: ${shipment.status}`
      );
    }
    return isValid; // only keep it if it comes true
  });
  res.status(200).json(validShipments);
};

module.exports = {
  getShipments,
};*/

//const db = require("../db"); // Import the gatekeeper
const asyncHandler = require("../utils/asyncHandler");
const shipmentService = require("../services/shipment.service");

//GET /shipments
const getShipments = asyncHandler(async (req, res) => {
  // Extract filter from URL  (e.g./shipments?owner_id=...)
  const { owner_id } = req.query;

  const shipments = await shipmentService.getShipments(owner_id);
  res.status(200).json(shipments);
});
/*
    //filter logic 
    const VALID_STATUSES = ["BOOKED" , "IN_TRANSIT", "DELIVERED"];
    const validShipments = shipments.filter(shipment =>{
      const isValid = VALID_STATUSES.includes(shipment.status);
      if(!isValid){
        console.warn(`[DATA QUALITY]: Skipping shipment ${shipment.id} with status: ${shipment.status}`);
      }
      return isValid;
    });
    res.status(200).json(validShipments);
  
});*/

//POST /Shipments
const createShipment = asyncHandler(async (req, res) => {
  const { origin, destination, status, owner_id } = req.body;

  if (!origin || !destination || !status || !owner_id) {
    const error = new Error(
      "All fields (origin , destination, status , owner_id) are required",
    );
    error.statusCode = 400;
    throw error;
  }
  try {
    const newShipment = await shipmentService.createShipment({
      origin,
      destination,
      status,
      owner_id,
    });
    res.status(201).json(newShipment);
  } catch (err) {
    console.error("The actual error is:", err);
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

const updateStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    const error = new Error("Status is Required");
    error.statusCode = 400;
    throw error; // the wrapper will catch this and send to middleware
  }
  const updatedShipment = await shipmentService.updateShipmentStatus(
    id,
    status,
  );
  res.status(200).json(updatedShipment);
});

// Exports always at the bottom
module.exports = {
  getShipments,
  createShipment,
  updateStatus,
};
