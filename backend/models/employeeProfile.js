const mongoose = require('mongoose');


const employeeProfileSchema = new mongoose.Schema({
    name: String,
    ssn: String, 
    workAuthorizationTitle: String,
    phoneNumber: String,
    email: String,
});

// Renaming the model to 'EmployeeProfile' to avoid conflict with 'Employee' model
const EmployeeProfile = mongoose.model('EmployeeProfile', employeeProfileSchema, 'employeesProfiles');


module.exports = EmployeeProfile;
