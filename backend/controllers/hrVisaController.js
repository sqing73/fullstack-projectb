const EmployeeProfile = require('../models/employeeProfile'); // Ensure this path is correct

exports.getAllEmployeeApplicationInfo = async (req, res) => {
    try {
        // Fetching all employee profiles from the database
        const employeeProfiles = await EmployeeProfile.find({});

        // Check if employeeProfiles array is empty
        if (employeeProfiles.length === 0) {
            return res.status(404).json({ message: "No employee profiles found" });
        }

        const response = employeeProfiles.map(profile => {
            // Constructing name
            const firstName = profile.name?.first || '';
            const middleName = profile.name?.middle ? profile.name.middle + ' ' : '';
            const lastName = profile.name?.last || '';
            const name = `${firstName} ${middleName}${lastName}`.trim();

            // Directly accessing each visa status field and extracting their status
            const optReceiptStatus = profile.VisaStatus?.OPTReceipt?.status || 'Not Available';
            const optEADStatus = profile.VisaStatus?.OPTEAD?.status || 'Not Available';
            const i20Status = profile.VisaStatus?.I20?.status || 'Not Available';
            const i983Status = profile.VisaStatus?.I983?.status || 'Not Available';

            // Constructing the visa application status string
            let visaApplicationStatus = [optReceiptStatus, optEADStatus, i20Status, i983Status]
                .filter(status => status !== 'Not Available')
                .join(', ');

            visaApplicationStatus = visaApplicationStatus || 'Status Not Available';

            // Extracting next step
            const nextStep = profile.visaNextStep || 'Next Step Not Available';

            return {
                id: profile._id.toString(),
                name: name,
                visaApplicationStatus: visaApplicationStatus,
                nextStep: nextStep
            };
        });

        res.json(response);
    } catch (error) {
        console.error("Error: ", error); // Error logging
        res.status(500).send(error.message);
    }
};
