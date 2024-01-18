const express = require('express');
const router = express.Router();
const employeeVisaController = require('../controllers/employeeVisaController');

router.get('/info', employeeVisaController.getEmployeeVisaInfo);
// Additional routes as needed

module.exports = router;
