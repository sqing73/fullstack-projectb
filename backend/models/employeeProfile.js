const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: String,
    ssn: String, 
    workAuthorizationTitle: String,
    phoneNumber: String,
    email: String,

});

module.exports = mongoose.model('Employee', employeeSchema);
