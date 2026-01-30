const { validate: isUuid } = require("uuid");

const mockUserMiddleware = (req, res, next) => {
  const userId = req.headers["x-user-id"];

  // 1 missing x-user-id -> 401
  if (!userId) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Missing x-user-id header",
    });
  }
  // Invalid uuid -> 401
  if (!isUuid(userId)) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Invalid Identity format (UUID Required)",
    });
  }
  // Attach to req.user
  req.user = { id: userId };

  //Log to console so we can check its working
  console.log(`[IDENTITY]: Request identified for user ${userId}`);
  next();
};

module.exports = mockUserMiddleware;
