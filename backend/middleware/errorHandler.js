const errorHandler = (err, req, res, next) => {
  //Internal logging (visible to me ,not to client)
  console.error(`[Error log]: ${err.message}`);

  // Detect db failure (the blast radius containment)
  const isDatabaseDown =
    err.code === "ECONNREFUSED" ||
    err.code === "28P01" ||
    err.message.includes("connection");

  //determine the status code
  //priority

  let statusCode = err.statusCode || 500;
  let message = err.message;

  if (isDatabaseDown) {
    statusCode = 503; // service unavailable
    message = "Service temporarily degraded. Database unreachable.";
  } else if (err.code === "23505") {
    return res.status(409).json({
      error: "Conflict",
      message: "A user with this email already exists.",
    });
  }
  // NEW: Catch Postgres UUID syntax errors (Error code '22P02')
  else if (err.code === "22P02") {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Invalid identity format",
    });
  } else if (statusCode >= 500) {
    message = "Internal Server Error";
  }

  //clean the message (security rule)
  // If its a 500 error ,we hide the raw err.message (it might contain sql details)
  // If its a 4xx error, we show the message (e.g. status is required)

  //send the response
  res.status(statusCode).json({
    error: message,
    // stack traces are for developers only
    // Provide status for the Health Check's context
    status: isDatabaseDown ? "degraded" : "error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = errorHandler;
