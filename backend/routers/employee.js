const express = require('express');
const { body } = require("express-validator");
const { signin, logout, signup } = require("../controllers/employee");
const { requireEmployeeAuth } = require("../middlewares/auth");
const employeeVisaController = require('../controllers/employeeVisaController'); 


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
router.get('/VisaStatus', employeeVisaController.getEmployeeApplicationInfo);

router.post("/api/Visa/", employeeVisaController.createEmployeeApplication)
router.get('/api/Visa/:id', employeeVisaController.getEmployeeApplication);
router.put('/api/Visa/:id', employeeVisaController.modifyEmployeeApplication);

module.exports = router;
