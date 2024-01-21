const express = require('express');
const router = express.Router();
const hrVisaController = require('../controllers/hrVisaController');

router.get('/hrVisaStatus', hrVisaController.getAllEmployeeVisaInfo);


module.exports = router;
