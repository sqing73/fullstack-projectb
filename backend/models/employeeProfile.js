const mongoose = require('mongoose');


const employeeProfileSchema = new mongoose.Schema({
    name: String,
    ssn: String, 
    workAuthorizationTitle: String,
    phoneNumber: String,
    email: String,
});

const EmployeeProfile = mongoose.model('EmployeeProfile', employeeProfileSchema, 'employeesProfiles');


module.exports = EmployeeProfile;
