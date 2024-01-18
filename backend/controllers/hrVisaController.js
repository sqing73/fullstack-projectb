const VisaStatus = require('../models/VisaStatus');

exports.getAllEmployeeVisaInfo = async (req, res) => {
    try {
        const allVisaInfo = await VisaStatus.find().populate('employeeId', 'name'); // Assuming 'employeeId' references a User model with 'name'

        const response = allVisaInfo.map(visa => ({
            name: visa.employeeId.name, // Employee Name
            workAuthorization: { /* Extract work authorization data */ },
            status: visa.status, // Employee's Visa Status
            documents: visa.documents // All documents
        }));

        res.json(response);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.updateDocumentStatus = async (req, res) => {
    // Method to update the status of an employee's document (approve/reject)
};
