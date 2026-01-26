const errorHandler = (err, req, res, next)=>{
  //Internal logging (visible to me ,not to client)
  console.error(`[Error log]: 4{err.message}`);

  //determine the status code
  //priority
  
  const statusCode = err.statusCode || 500;

  //clean the message (security rule)
  // If its a 500 error ,we hide the raw err.message (it might contain sql details)
  // If its a 4xx error, we show the message (e.g. status is required)

  const message = statusCode >= 500 ? "Internal Server error": err.message;

  //send the response 
  res.status (statusCode).json({
    error: message, 
    // stack traces are for developers only 
    stack: process.env.NODE_ENV === 'development' ? err.stack:undefined
  });
};

module.exports = errorHandler;