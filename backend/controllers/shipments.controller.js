// A static array represent our "Database" for now

const shipments = [
  {
    id: "101",
    origin: "Colombo",
    destination: "Singapore",
    status: "In Transit",
  },
  { id: "102", origin: "Mumbai", destination: "Dubai", status: "Pending" },
  {
    id: "103",
    origin: "Rotterdam",
    destination: "New york",
    status: "Delivered",
  },
];

const getShipments = (req, res) => {
  res.status(200).json(shipments);
};

module.exports = {
  getShipments,
};
