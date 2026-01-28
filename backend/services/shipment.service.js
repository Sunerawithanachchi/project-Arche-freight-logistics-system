const pool = require ("../db");
//const { getShipments } = require("../controllers/shipments.controller");

//The "State machine" rules
const VALID_TRANSITIONS ={
    BOOKED : ["IN_TRANSIT"],
    IN_TRANSIT: ["DELIVERED"],
    DELIVERED: [], // Terminal state , no further moves allowed
};

const updateShipmentStatus = async (id, nextStatus)=>{
    // fetch current status
    const currentResult = await pool.query(
        "SELECT status FROM shipments WHERE id = $1",
        [id]
    );

    if (currentResult.rows.length === 0){
        const error = new Error ("Shipment Not Found");
        error.statusCode = 404;
        throw error ;
    }
    const currentStatus = currentResult.rows[0].status.trim().toUpperCase() ;
    const targetStatus = nextStatus.toUpperCase();

    //  detect no-op
    if(currentStatus === targetStatus){
        const error = new Error (`Conflict: Shipment is already ${targetStatus} `);
        error.statusCode = 409;
        throw error;
    }

    // business logic - check if the trasaction is legal
    const allowedNext = VALID_TRANSITIONS[currentStatus];

    if(!allowedNext || !allowedNext.includes(targetStatus)){
        const error = new Error (
            `Illegal Transition From ${currentStatus} to ${targetStatus}`
        );

        error.statusCode = 409; // conflict
        throw error ; 
    }

    // Update the database
    const updateResult = await pool.query(
        "UPDATE shipments SET status = $1, updated_at = NOW() WHERE id =$2 RETURNING *",
        [targetStatus, id]
    );

    return updateResult.rows[0];

};

module.exports = {
    updateShipmentStatus,
} ;