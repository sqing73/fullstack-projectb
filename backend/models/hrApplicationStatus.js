// hrApplicationStatus.js
const mongoose = require('mongoose');

const hrApplicationStatusSchema = new mongoose.Schema({
    employeeId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Employee', // Reference to Employee model
        required: true
    },
    applicationStatus: String, // Status of the application
    nextStep: String, // Next step for the employee
});

module.exports = mongoose.model('HRApplicationStatus', hrApplicationStatusSchema);
