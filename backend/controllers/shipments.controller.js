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
module.exports = {getShipments};
