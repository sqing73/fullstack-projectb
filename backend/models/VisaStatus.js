const mongoose = require('mongoose');

const visaStatusSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    visaType: String,
    documents: [{
        name: String,
        status: String, // 'pending', 'approved', 'rejected'
        feedback: String
    }],
});

module.exports = mongoose.model('VisaStatus', visaStatusSchema);
