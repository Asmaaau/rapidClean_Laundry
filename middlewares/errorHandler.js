// const errorResponse = require("../helper/errorResponse");

module.exports = errorHandler = (err, req, res, next) => {
  let error = err;
  error.message = err.message;

  // console.log(error)

  if (error.errno === 1062) {
    error.message = "Email already exist"
    error.statusCode = 401
  }









  //  send response to user
  res.status(error.statusCode || 500).json({
    status: false,
    message: error.message || "server error",
});
};