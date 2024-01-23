const ApplicationStatus = require('../models/ApplicationStatus');
const Employee = require('../models/employee'); // Import Employee model

exports.getEmployeeApplicationInfo = async (req, res) => {
    try {
        const employeeId = req.user.id; // Assuming this is provided by user authentication
        const appStatus = await ApplicationStatus.findOne({ employeeId: employeeId })
                                                   .populate('employeeId', 'name');

        if (!appStatus) {
            return res.status(404).send('Application status not found');
        }

        const response = {
            id: appStatus._id, // ObjectId of the application status record
            name: `${appStatus.employeeId.name.first} ${appStatus.employeeId.name.last}`, // Full name
            applicationStatus: appStatus.status, // Application status
            nextStep: appStatus.nextStep, // Next step in the process
        };

        res.json(response);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
