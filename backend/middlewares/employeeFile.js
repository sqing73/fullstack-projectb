const multer = require("multer");
const path = require("path");
const ApiError = require("../errors/ApiError");

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "assets/userAvatars/");
  },
  filename: function (req, file, cb) {
    cb(null, req.user._id + "-" + Date.now() + path.extname(file.originalname));
  },
});

const imageFileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new ApiError(400, "Only accept jpeg, jpg, png files"), null, false);
  }
};

const imageUpload = multer({
  storage: imageStorage,
  fileFilter: imageFileFilter,
});

const documentStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "assets/userFiles");
  },
  filename: function (req, file, cb) {
    cb(null, req.user._id + "-" + Date.now() + path.extname(file.originalname));
  },
});

const documentFileFilter = (req, file, cb) => {
  const filetypes = /pdf|doc|docx/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new ApiError(400, "Only accept pdf, doc, docx files"), null, false);
  }
};

const documentUpload = multer({
  storage: documentStorage,
  fileFilter: documentFileFilter,
});

const fileAuthorization = (req, res, next) => {
  const { filename } = req.params;
  const fileOwner = filename.split("-")[0];
  if (
    filename !== "template1.pdf" &&
    filename !== "template2.pdf" &&
    fileOwner !== req.user._id.toString()
  ) {
    return next(new ApiError(400, "Not authorizated"));
  }
  next();
};

module.exports = { imageUpload, documentUpload, fileAuthorization };
