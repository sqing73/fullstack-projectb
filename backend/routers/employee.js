const express = require("express");
const { body } = require("express-validator");
const { signin, logout, signup } = require("../controllers/employee");
const { requireEmployeeAuth } = require("../middlewares/auth");
const employeeVisaController = require("../controllers/employeeVisaController");
const {
  imageUpload,
  documentUpload,
  fileAuthorization,
} = require("../middlewares/employeeFile");
const {
  fileUploadHandler,
  fileServeHandler,
} = require("../controllers/employeeFileController");

const router = require("express").Router();

router.post("/signin", signin);

router.post(
  "/signup",
  body("username").isLength({ min: 1 }).withMessage("Enter a valid username "),
  body("password")
    .isLength({ min: 2 })
    .withMessage("Password must be at least 2 characters long"),
  signup
);

router.use(requireEmployeeAuth);

router.post("/logout", logout);

router.get("/visaStatus", employeeVisaController.getVisaStatus);

router
  .get("/profile", employeeVisaController.getEmployeeProfile)
  .post("/profile", employeeVisaController.createEmployeeProfile)
  .put("/profile", employeeVisaController.modifyEmployeeProfile);

router.post(
  "/assets/userAvatars",
  imageUpload.single("file"),
  fileUploadHandler
);
router.post(
  "/assets/userFiles",
  documentUpload.single("file"),
  fileUploadHandler
);

router.get("/assets/userFiles/:filename", fileAuthorization, fileServeHandler);
router.get(
  "/assets/userAvatars/:filename",
  fileAuthorization,
  fileServeHandler
);

module.exports = router;
