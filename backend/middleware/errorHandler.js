const errorHandler = (err, req, res, next) => {
  // 1. Log the error for the developer
  console.error(`[SERVER ERROR]: ${err.message}`);

  // send a safe response to the client
  // we use 500 (internal server error) as the default
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    error: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = errorHandler;
