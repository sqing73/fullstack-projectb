const mongoose = require("mongoose");

const submissionStatus = new mongoose.Schema({
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
    required: true,
  },
});

const visaStep = new mongoose.Schema({
  step: {
    status: submissionStatus,
    file: String,
    feedback: String,
    _id: false,
  },
});

const employeeProfileSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      unique: true,
    },
    name: {
      first: String,
      last: String,
      middle: String, // Optional
      preferred: String, // Optional
    },
    personalInfo: {
      ssn: String,
      dob: Date, // Assuming Date of Birth is needed
      gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
      }, // Assuming Gender is needed
      // ... other personal info fields ...
    },
    residencyStatus: {
      isPermanentResidentOrCitizen: Boolean, // if no, create new work authorization
      status: {
        type: String,
        enum: ["Citizen", "Green Card", "none"],
        default: "none",
      },
    },
    phoneNumbers: {
      cell: String,
      work: String, // Separate cell and work numbers
    },
    email: String,
    profilePicture: String, // Assuming you store profile picture URL or path
    address: {
      building: String,
      street: String,
      city: String,
      state: String,
      zip: String,
    },
    workAuthorization: {
      type: {
        kind: {
          type: String,
          enum: ["H1-B", "L2", "F1(CPT/OPT)", "H4", "Other"],
        }, // H1-B, L2, F1(CPT/OPT), H4, Other
        title: { type: String, default: null }, // if kind is other, fill in this field
        proof: { type: String, default: null }, // if kind is not F1, if f1 fill in the opt receipt in visa status
        start: Date,
        end: Date,
      },
      default: null,
    },
    visaStatus: {
      type: {
        OPTreceipt: {
          type: visaStep,
          default: null,
        },
        OPTead: {
          type: visaStep,
          default: null,
        },
        I20: {
          type: visaStep,
          default: null,
        },
        I983: {
          type: visaStep,
          default: null,
        },
      },
      default: null,
      _id: false,
    },
    reference: {
      fname: String,
      lname: String,
      mname: String,
      phone: String,
      email: String,
      relationship: String,
    },
    emergencyContacts: [
      {
        fname: String,
        lname: String,
        mname: String,
        phone: String,
        email: String,
        relationship: String,
      },
    ],
    visaCurrStep: {
      type: String,
      enum: ["none", "OPTreceipt", "OPTead", "I983", "I20", "complete"],
      default: "none",
    },
    applicationStatus: submissionStatus,
    applicationFeedback: {
      type: String,
      default: null,
    },
  },
  {
    versionKey: false,
  }
);

const EmployeeProfile = mongoose.model(
  "EmployeeProfile",
  employeeProfileSchema
);

module.exports = EmployeeProfile;
