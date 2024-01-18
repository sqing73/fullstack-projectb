const { body } = require('express-validator');

exports.validateDocumentStatus = [
    body('visaStatusId').isMongoId().withMessage('Invalid Visa Status ID'),
    body('documentName').not().isEmpty().withMessage('Document name is required'),
    body('newStatus').isIn(['approved', 'rejected']).withMessage('Invalid status value')
    // Add more validators as needed
];

// You can add more validation functions for different visa-related operations
