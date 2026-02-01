const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
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

    // inject indentity into the request object
    req.user = { id: decoded.sub || decoded.user_id };

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
