/**
 * Authorization middleware to restrict access by role
 * @param {string} requiredRole - e.g., 'admin' or 'operator'
 */
const requireRole = (requiredRole) => {
  return (req, res, next) => {
    // 1. Safety check: Did the auth middleware run first?
    if (!req.user) {
      return res.status(500).json({
        error: "Internal server error",
        message: "Authorization content missing, check middleware order",
      });
    }

    // 2. AC #3 & #5: Check if the user's role matches the requirement
    if (req.user.role !== requiredRole) {
      return res.status(403).json({
        error: "Forbidden",
        message: `This resource require ${requiredRole} privileges.`,
      });
    }

    // success: proceed to the controller
    next();
  };
};

module.exports = requireRole;
