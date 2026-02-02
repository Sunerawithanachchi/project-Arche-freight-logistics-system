const pool = require("../db");

const createUser = async (userData) => {
  const { name, email } = userData;

  try {
    const result = await pool.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id",
      [name, email]
    );
    return result.rows[0];
  } catch (err) {
    //if db is down our pool/query will throw
    // the controller or global error handler will catch it
    throw err;
  }
};

module.exports = { createUser };
