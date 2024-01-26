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

// Update these routes to use the correct function names
router.get('/VisaStatus', employeeVisaController.getEmployeeVisaInfo); // Updated function name
router.post("/api/Visa/", employeeVisaController.createEmployeeVisa); // Updated function name
router.get('/api/Visa/:id', employeeVisaController.getEmployeeVisa); // Updated function name
router.put('/api/Visa/:id', employeeVisaController.modifyEmployeeVisa); // Updated function name

module.exports = router;
