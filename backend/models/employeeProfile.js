const mongoose = require('mongoose');

const employeeProfileSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
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
        status: String,  // e.g., 'Citizen', 'Permanent Resident', etc.
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
        type: String, // H1-B, L2, F1(CPT/OPT), H4, Other
        proof: String, // URL link to pdf for F1, visa title for other
        start: Date,
        end: Date,
    },
    VisaStatus: {
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
    reference: {
        fname: String,
        lname: String,
        mname: String,
        phone: String,
        email: String,
        relationship: String
    },
    visaNextStep: String,
    emergencyContacts: [{
        fname: String,
        lname: String,
        mname: String,
        phone: String,
        email: String,
        relationship: String
    }],
    documentSummary: {
        profilePicture: String,
        driverLicense: String,
        workAuthorization: {
            OPTReceipt: String,
            OPTEAD: String,
            I983: String,
            I20: String
        }
    }
});

const EmployeeProfile = mongoose.model('EmployeeProfile', employeeProfileSchema, 'employeesProfiles');

module.exports = EmployeeProfile;
