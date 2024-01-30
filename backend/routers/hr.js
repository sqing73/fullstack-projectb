const express = require("express");
const employeeProfileController = require("../controllers/employeeProfileController");
const hrVisaController = require("../controllers/hrVisaController");
const { body } = require("express-validator");
const { signin, logout, modifyEmployeeProfile } = require("../controllers/hr");
const {
  addRegistration,
  getRegistrationById,
} = require("../controllers/registration");
const { requireHrAuth } = require("../middlewares/auth");
const { fileServeHandler } = require("../controllers/employeeFileController");

const router = require("express").Router();

router.post("/signin", signin);

router.use(requireHrAuth);

router.post("/logout", logout);

router
  .route("/registration")
  .get(getRegistrationById)
  .post(
    body("email").isEmail().withMessage("Enter a valid email address"),
    body("employee").isLength({ min: 1 }).withMessage("Enter a valid name "),
    addRegistration
  );

router.get(
  "/employeeProfile",
  employeeProfileController.getAllEmployeeProfiles
);
router
  .get("/VisaStatus", hrVisaController.getAllEmployeeApplicationInfo)
  .put("/VisaStatus", hrVisaController.updateVisaStatueById);

router.get("/assets/userFiles/:filename", fileServeHandler);
router.get("/assets/userAvatars/:filename", fileServeHandler);

router
  .put("/profile", modifyEmployeeProfile);

router.get(
  "/noProfileEmployee",
  employeeProfileController.getNotProfiledEmployees
);

module.exports = router;
