const bcrypt = require("bcrypt");
const pool = require("../db");

const authenticate = async (email, password) => {
  // find the user
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  const user = result.rows[0];

  // security rule: if no user or password didn't match return null
  // we use bcrypt to prevent timing attcks
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return null;
  }

  return user;
};

module.exports = { authenticate };
