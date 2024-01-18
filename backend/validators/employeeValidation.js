const { body } = require('express-validator');

exports.validateEmployeeProfile = [
    body('employeeId').isMongoId().withMessage('Invalid Employee ID'),
    body('name').not().isEmpty().withMessage('Name is required'),
    // Include more fields as per your Employee model
    // Example:
    // body('email').isEmail().withMessage('Invalid email address'),
    // body('department').not().isEmpty().withMessage('Department is required')
];

// Additional validation functions for other employee operations can be added here
