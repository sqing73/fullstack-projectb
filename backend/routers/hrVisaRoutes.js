const express = require('express');
const router = express.Router();
const hrVisaController = require('../controllers/hrVisaController');

router.get('/all-info', hrVisaController.getAllEmployeeVisaInfo);
router.post('/document-status', hrVisaController.updateDocumentStatus);

module.exports = router;
