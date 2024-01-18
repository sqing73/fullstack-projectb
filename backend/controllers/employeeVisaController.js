const VisaStatus = require('../models/VisaStatus');

exports.getEmployeeVisaInfo = async (req, res) => {
    try {
        const employeeId = req.user.id; // Assuming authentication provides user ID
        const visaInfo = await VisaStatus.findOne({ employeeId: employeeId });

        if (!visaInfo) {
            return res.status(404).send('Visa information not found');
        }

        const response = {
            status: visaInfo.status, // Example: 'OPT Approved'
            todo: visaInfo.documents.filter(doc => doc.status === 'pending') // List of pending documents
        };

        res.json(response);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
