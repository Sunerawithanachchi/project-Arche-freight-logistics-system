const pool = require("../db");

//The "State machine" rules
const VALID_TRANSITIONS = {
  BOOKED: ["IN_TRANSIT"],
  IN_TRANSIT: ["DELIVERED"],
  DELIVERED: [], // Terminal state , no further moves allowed
};

const createShipment = async (shipmentData) => {
  const { origin, destination, status, owner_id } = shipmentData;

  const VALID_STATUSES = ["BOOKED", "IN_TRANSIT", "DELIVERED"];
  if (!VALID_STATUSES.includes(status)) {
    const error = new Error(
      `Invalid status. Must be one of ${VALID_STATUSES.join(",")}`,
    );
    error.statusCode = 400;
    throw error;
  }

  // validate owner existence (application layer safety)
  const userCheck = await pool.query("SELECT id FROM users WHERE id = $1", [
    owner_id,
  ]);

  if (userCheck.rows.length === 0) {
    const error = new Error("Invalid owner: user does not exist");
    error.statusCode = 404;
    throw error;
  }

  //insert with owner_id
  const query = `
    INSERT INTO shipments (origin, destination, status, owner_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `;

  const result = await pool.query(query, [
    origin,
    destination,
    status,
    owner_id,
  ]);
  return result.rows[0];
};

const getShipments = async (ownerIdFilter = null) => {
  //query adjustment : filter by owner if ID is provided
  let query = "SELECT * FROM shipments";
  let params = [];

  if (ownerIdFilter) {
    query += " WHERE owner_id = $1";
    params.push(ownerIdFilter);
  }

  const result = await pool.query(query, params);
  const shipments = result.rows;

  const VALID_STATUSES = ["BOOKED", "IN_TRANSIT", "DELIVERED"];
  return shipments.filter((shipment) => {
    const isValid = VALID_STATUSES.includes(shipment.status);
    if (!isValid) {
      console.warn(
        `[DATA QUALITY]: Skipping shipment ${shipment.id} with status ${shipment.status}`,
      );
    }
    return isValid;
  });
};

const updateShipmentStatus = async (id, nextStatus) => {
  // fetch current status
  const currentResult = await pool.query(
    "SELECT status FROM shipments WHERE id = $1",
    [id],
  );

  if (currentResult.rows.length === 0) {
    const error = new Error("Shipment Not Found");
    error.statusCode = 404;
    throw error;
  }
  const currentStatus = currentResult.rows[0].status.trim().toUpperCase();
  const targetStatus = nextStatus.toUpperCase();

  //  detect no-op
  if (currentStatus === targetStatus) {
    const error = new Error(`Conflict: Shipment is already ${targetStatus} `);
    error.statusCode = 409;
    throw error;
  }

  // business logic - check if the trasaction is legal
  const allowedNext = VALID_TRANSITIONS[currentStatus];

  if (!allowedNext || !allowedNext.includes(targetStatus)) {
    const error = new Error(
      `Illegal Transition From ${currentStatus} to ${targetStatus}`,
    );

    error.statusCode = 409; // conflict
    throw error;
  }

  // Update the database
  const updateResult = await pool.query(
    "UPDATE shipments SET status = $1, updated_at = NOW() WHERE id =$2 RETURNING *",
    [targetStatus, id],
  );

  return updateResult.rows[0];
};

module.exports = {
  createShipment,
  getShipments,
  updateShipmentStatus,
};
