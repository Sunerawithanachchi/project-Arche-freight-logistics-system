const VALID_STATUSES = ["BOOKED", "IN_TRANSIT", "DELIVERED"];
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
  throw new Error("CRITICAL: Database connection timed out");
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
};
