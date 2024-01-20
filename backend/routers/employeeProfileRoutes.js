const express = require('express');
const router = express.Router();
const employeeProfileController = require('../controllers/employeeProfileController');

router.get('/profiles', employeeProfileController.getAllEmployeeProfiles);

module.exports = router;
