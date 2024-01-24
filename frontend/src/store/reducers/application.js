import { createSlice, } from "@reduxjs/toolkit";

const initialApplicationState = {
    name: {
        first: "",
        last: "",
        middle: "",  // Optional
        preferred: ""  // Optional
    },
    personalInfo: {
        ssn: "", 
        dob: "2024-01-01",  // Assuming Date of Birth is needed
        gender: ""  // Assuming Gender is needed
        // ... other personal info fields ...
    },
    residencyStatus: {
        status: "",  // e.g., 'Citizen', 'Permanent Resident', etc.
        // ... other residency status fields ...
    },
    phoneNumbers: {
        cell: "",
        work: ""  // Separate cell and work numbers
    },
    email: "",
    profilePicture: "",  // Assuming you store profile picture URL or path
    address: {
        building: "",
        street: "",
        city: "",
        state: "",
        zip: ""
    },
    workAuthorization: {
        // Define work authorization fields if needed
        type: "", // H1-B, L2, F1(CPT/OPT), H4, Other
        proof: "", // URL link to pdf for F1, visa title for other
        start: "2024-01-01",
        end: "2024-01-01",
    },
    reference: {
        fname: "",
        lname: "",
        mname: "",
        pname: "",
        phone: "",
        email: "",
        relationship: "",
    },
    inProgress: "yes",  // If you want to track if the profile is in progress
    nextStep: "HR Review",  // Next step in the application or profile process
};

const applicationSlice = createSlice({
  name: "application",
  initialState: initialApplicationState,
  reducers: {
    setApplicationInfo(state, { payload }) {
      state.name = {
        first: payload.fname,
        last: payload.lname,
        middle: payload.mname,
        preferred: payload.pname
      };
      state.personalInfo = {
        ssn: payload.ssn,
        dob: payload.dob,
        gender: payload.gender,
      };
      state.residencyStatus = {
        status: payload.citzen,
      };
      state.phoneNumbers = {
        cell: payload.cell,
      };
      state.email = payload.email;
      state.profilePicture = payload.profilePicture;
      state.address = payload.address;
      state.workAuthorization = payload.workAuthorization;
      state.reference = payload.reference;
    },
  },
});

export const applicationActions = applicationSlice.actions;

export default applicationSlice;