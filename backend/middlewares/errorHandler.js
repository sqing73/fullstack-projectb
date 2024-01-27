const ApiError = require("../errors/ApiError");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ message: err.message });
  } else if (err instanceof jwt.JsonWebTokenError) {
    return res.status(401).json({ message: "Invalid authorization token" });
  } else if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  }
  console.error("\x1b[31m", err.message, "\x1b[0m");
  return res.status(500).json({ message: "Internal server error" });
};

module.exports = errorHandler;
