const mongoose = require('mongoose');

const employeeProfileSchema = new mongoose.Schema({
    name: {
        first: String,
        last: String,
        middle: String,  // Optional
        preferred: String  // Optional
    },
    personalInfo: {
        ssn: String, 
        dob: Date,  // Assuming Date of Birth is needed
        gender: String  // Assuming Gender is needed
        // ... other personal info fields ...
    },
    residencyStatus: {
        isPermanentResidentOrCitizen: Boolean,
        status: String  // e.g., 'Citizen', 'Permanent Resident', etc.
        // ... other residency status fields ...
    },
    phoneNumbers: {
        cell: String,
        work: String  // Separate cell and work numbers
    },
    email: String,
    profilePicture: String,  // Assuming you store profile picture URL or path
    address: {
        building: String,
        street: String,
        city: String,
        state: String,
        zip: String
    },
    workAuthorization: {
        // Define work authorization fields if needed
    },
    applicationStatus: {
        OPTReceipt: {
            status: String,
            message: String
        },
        OPTEAD: {
            status: String,
            message: String
        },
        I20: {
            status: String,
            message: String
        },
        I983: {
            documents: {
                emptyTemplate: String,
                sampleTemplate: String
            },
            status: String,
            message: String,
            uploadButton: String
        }
        // ... other application status fields if needed ...
    },
    inProgress: String,  // If you want to track if the profile is in progress
    nextStep: String,  // Next step in the application or profile process
    // ... any additional fields like references, emergency contacts, etc. ...
});

const EmployeeProfile = mongoose.model('EmployeeProfile', employeeProfileSchema, 'employeesProfiles');

module.exports = EmployeeProfile;
