const ApiError = require("../errors/ApiError");

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  console.error("\x1b[31m", err.message, "\x1b[0m");
  return res.status(500).json({ message: "Internal server error" });
};

module.exports = errorHandler;
