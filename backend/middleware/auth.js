const jwt = require("jsonwebtoken");
const pool = require("../db");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // check for bearer token structure
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Missing or malformed authentication header",
    });
  }

  // extract the token from the header
  const token = authHeader.split(" ")[1];

  // verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.sub || decoded.user_id;

    //fetch user role from the db
    const result = await pool.query(
      "SELECT id, role FROM users WHERE id = $1",
      [userId]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // inject full indentity into the request object
    req.user = {
      id: user.id,
      role: user.role,
    };

    next();
  } catch (err) {
    // uniform 401 response for any token failure
    return res.status(401).json({
      error: "Unauthorized",
      message: "Invalid or expired token",
    });
  }
};
module.exports = auth;
