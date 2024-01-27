const ApiError = require("../errors/ApiError");
const path = require("path");
const fs = require("fs");

const fileUploadHandler = (req, res, next) => {
  if (!req.file) {
    next(new ApiError({ message: "No file uploaded" }));
  }
  return res
    .status(200)
    .json({ message: "File upload success", fileName: req.file.filename });
};

const fileServeHandler = (req, res, next) => {
  const filePath = path.join(__dirname, `..${req.path}`);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    next(new ApiError(404, "File not found"));
  }
};

module.exports = { fileUploadHandler, fileServeHandler };
