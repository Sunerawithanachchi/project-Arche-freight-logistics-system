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

const db = require('../db'); // Import the gatekeeper 
const asyncHandler = require('../utils/asyncHandler');
const shipmentService = require ("../services/shipment.service");

const getShipments = asyncHandler(async(req, res)=>{
  
    // attempt to fetch data from postgres
    const result = await db.query('SELECT * FROM shipments');
    const shipments = result.rows ; 

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
  
});
const createShipment = asyncHandler(async(req, res)=> {
  const {origin , destination, status} = req.body;
  const VALID_STATUSES = ['BOOKED' , 'IN_TRANSIT' , 'DELIVERED'];

  if(!origin || !destination || !status){
    const error = new Error ('All fields (origin , destination, status) are required');
    error.statusCode = 400;
    throw error;
  }
  if(!VALID_STATUSES.includes(status)){
    const error = new Error (`Invalid status. Must be one of ${VALID_STATUSES.join(',')}`);
    error.statusCode = 400;
    throw error;
  }

  const query =`INSERT INTO shipments (origin, destination, status) VALUES ($1, $2, $3) RETURNING *;` ;
  const result = await db.query(query, [origin, destination, status]);

  res.status(201).json(result.rows[0]);
});

const updateStatus = asyncHandler(async(req, res) =>{
  const {id} = req.params;
  const {status} = req.body;

  if(!status){
    const error = new Error ("Status is Required");
    error.statusCode = 400;
    throw error; // the wrapper will catch this and send to middleware
  }
  const updatedShipment = await shipmentService.updateShipmentStatus(id, status);
  res.json(updatedShipment); 
});

// Exports always at the bottom
module.exports = {
  getShipments,
  createShipment,
  updateStatus
};
