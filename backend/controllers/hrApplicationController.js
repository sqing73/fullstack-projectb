// hrApplicationController.js
const EmployeeProfile = require('../models/employeeProfile'); // Ensure this path is correct

exports.getAllEmployeeApplicationInfo = async (req, res) => {
    try {
        const employeeProfiles = await EmployeeProfile.find({});

        const response = employeeProfiles.map(profile => {
            // Constructing name
            const firstName = profile.name?.first || '';
            const middleName = profile.name?.middle ? profile.name.middle + ' ' : '';
            const lastName = profile.name?.last || '';
            const name = `${firstName} ${middleName}${lastName}`.trim();

            // Directly accessing each application status field and extracting their status
            const optReceiptStatus = profile.applicationStatus?.OPTReceipt?.status;
            const optEADStatus = profile.applicationStatus?.OPTEAD?.status;
            const i20Status = profile.applicationStatus?.I20?.status;
            const i983Status = profile.applicationStatus?.I983?.status;

            // Constructing the application status string
            let applicationStatus = [optReceiptStatus, optEADStatus, i20Status, i983Status]
                .filter(status => status)
                .join(', ');

            applicationStatus = applicationStatus || 'Status Not Available';

            // Extracting next step
            const nextStep = profile.nextStep || 'Next Step Not Available';

            return {
                id: profile._id.toString(),
                name: name,
                applicationStatus: applicationStatus,
                nextStep: nextStep
            };
        });

        res.json(response);
    } catch (error) {
        console.error("Error: ", error); // Error logging
        res.status(500).send(error.message);
    }
};
