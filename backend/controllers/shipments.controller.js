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
const shipmentService = require ("../services/shipment.service");
const getShipments = async(req, res)=>{
  try{
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
  } catch (error){
    //faliure safe behaviour- log the error and return the empty list 
    console.error("[DB CONNECTION ERROR]: Returning empty list to maintain stability");
     return res.status(200).json([]); 
  }
};
const createShipment = async(req, res)=>{
  const {origin , destination , status} = req.body;
  const VALID_STATUSES = ['BOOKED', 'IN_TRANSIT', 'DELIVERED'];

  // 1 validation layer
  if(!origin || !destination || !status){
    return res.status(400).json({error:'All fields (origin, destination, status) are required.'});
  }
  if(!VALID_STATUSES.includes(status)){
    return res.status(400).json({error:`Invalid status.Must be one of ${VALID_STATUSES.join(', ')}`});
  }
  try{
    //2 Database interaction (parameterized)
    const query =`
    INSERT INTO shipments (origin, destination, status)
    VALUES ($1, $2, $3)
    RETURNING *;
    `;
    const result = await db.query(query, [origin, destination, status]);

    //3 Success response 
    res.status(201).json(result.rows[0]);

  } catch (err){
    // Error handling
    console.error('Database error:',err);
    res.status(500).json({error: 'Internal Server Error'});
  }
};

const updateStatus = async (req, res,) =>{
  try{
    const {id} = req.params;
    const {status} = req.body;

    //basic request validation
    if(!status){
      return res.status(400).json({error: "Status is required"});
    }

    const updatedShipment = await shipmentService.updateShipmentStatus(id, status);
    res.json(updatedShipment);
  } catch (error){
    // This allows the service to dictate the status code (404 or 409)
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({error: error.message});

  }
};

// Exports always at the bottom
module.exports = {
  getShipments,
  createShipment,
  updateStatus
};
