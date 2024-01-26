const EmployeeProfile = require('../models/employeeProfile');
const sendEmail = require('../utils/sendEmail');

exports.getAllEmployeeApplicationInfo = async (req, res) => {
    try {
        const employeeProfiles = await EmployeeProfile.find({});
        let responseDetails = [];  // Array to hold the response details

        if (employeeProfiles.length === 0) {
            return res.status(404).json({ message: "No employee profiles found" });
        }

        for (const profile of employeeProfiles) {
            let feedbackMessage = '';

            // Process each visa status step
            const optReceiptStatus = profile.visaStatus?.OPTreceipt?.status;
            const optEADStatus = profile.visaStatus?.OPTead?.status;
            const i983Status = profile.visaStatus?.I983?.status;
            const i20Status = profile.visaStatus?.I20?.status;

            // Generate feedback for each step
            if (optReceiptStatus) {
                feedbackMessage += `OPT Receipt: ${generateFeedback(optReceiptStatus, 'OPT EAD')}`;
            }
            if (optEADStatus) {
                feedbackMessage += `OPT EAD: ${generateFeedback(optEADStatus, 'I-983 form')}`;
            }
            if (i983Status) {
                feedbackMessage += `I-983: ${generateFeedback(i983Status, 'I-20')}`;
            }
            if (i20Status) {
                feedbackMessage += `I-20: ${generateFeedback(i20Status, 'all documents have been approved')}`;
            } else if (profile.visaStatus?.I20 === null) {
                feedbackMessage += `I-20: Not yet submitted. `;
            }

            // Send email if there is a feedback message
            if (feedbackMessage) {
                await sendEmail(profile.email, `<p>${feedbackMessage}</p>`);
            }

            // Include name, workAuthorization, and visaCurrStep in the response
            const name = `${profile.name.first} ${profile.name.last}`;
            const workAuthorization = profile.workAuthorization;
            const visaCurrStep = profile.visaCurrStep;

            // Add details to the responseDetails array
            responseDetails.push({
                name,
                workAuthorization,
                visaCurrStep,
                feedbackSent: feedbackMessage !== ''
            });
        }

        res.json({ 
            message: 'Feedback emails sent successfully',
            details: responseDetails
        });
    } catch (error) {
        console.error("Error: ", error);
        res.status(500).send(error.message);
    }
};

function generateFeedback(status, nextStep) {
    switch (status) {
        case 'pending':
            return `Status: Pending. Waiting for HR to approve your ${nextStep}. `;
        case 'approved':
            return `Status: Approved. Please proceed with ${nextStep}. `;
        case 'rejected':
            return `Status: Rejected. Please check HR's feedback. `;
        default:
            return `Status: ${status}. `;
    }
}
