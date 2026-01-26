const asyncHandler = (fn) => (req, res, next) =>{
    // this ensures any rejected promise is sent straight to next (err)
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;