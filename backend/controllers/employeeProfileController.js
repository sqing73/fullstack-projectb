const Employee = require('../models/employeeProfile');

exports.getAllEmployeeProfiles = async (req, res) => {
    try {
        const employees = await Employee.find({}, 'name ssn workAuthorizationTitle phoneNumber email');
        res.json(employees);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
