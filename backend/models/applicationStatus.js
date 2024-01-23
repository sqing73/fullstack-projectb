const mongoose = require('mongoose');

const applicationStatusSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    status: String, // Overall status of the application
    nextStep: String, // Next step in the process
    // Other relevant fields as per your application's need
});

module.exports = mongoose.model('ApplicationStatus', applicationStatusSchema);
