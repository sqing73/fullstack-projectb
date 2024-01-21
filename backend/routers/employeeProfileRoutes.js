const express = require('express');
const router = express.Router();
const employeeProfileController = require('../controllers/employeeProfileController');

router.get('/', employeeProfileController.getAllEmployeeProfiles);

module.exports = router;
