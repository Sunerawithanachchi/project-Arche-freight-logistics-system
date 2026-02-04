const pool = require("../db");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 12;

const createUser = async (userData) => {
  const { name, email, password } = userData;

  const hash = await bcrypt.hash(password, SALT_ROUNDS);

  // store the hash not the password

  try {
    const result = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id",
      [name, email, hash]
    );
    return result.rows[0];
  } catch (err) {
    //if db is down our pool/query will throw
    // the controller or global error handler will catch it
    throw err;
  }
};

module.exports = { createUser };
