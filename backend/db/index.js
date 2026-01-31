const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Failure-Safe Requirement: Log errors but don't let the app crash
pool.on("error", (err) => {
  console.error("[DB-CRITICAL]: Unexpected error on idle client", err.message);
});

// A simple check function we can use later
const checkConnection = async () => {
  try {
    const client = await pool.connect();
    client.release();
    return true;
  } catch (err) {
    console.error("[DB-OFFLINE]: Database is unreachable at the moment.");
    return false;
  }
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  checkConnection,
};
