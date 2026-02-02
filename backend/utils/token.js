const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  // payload is minimal just the ID
  const payload = { sub: userId };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h", // requirement 4 token expiry must be enforced
  });
};

module.exports = { generateToken };
