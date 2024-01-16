const ApiError = require("../errors/ApiError");

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  return res
    .status(500)
    .json({ message: err.message || "Internal server error" });
};

module.exports = errorHandler;
