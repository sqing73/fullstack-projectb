import { createSlice } from "@reduxjs/toolkit";

const initialApplicationState = {
  name: {
    first: "",
    last: "",
    middle: "", // Optional
    preferred: "", // Optional
  },
  personalInfo: {
    ssn: "",
    dob: "2024-01-01", // Assuming Date of Birth is needed
    gender: "", // Assuming Gender is needed
    // ... other personal info fields ...
  },
  residencyStatus: {
    status: "", // e.g., 'Citizen', 'Permanent Resident', etc.
    // ... other residency status fields ...
  },
  phoneNumbers: {
    cell: "",
    work: "", // Separate cell and work numbers
  },
  email: "",
  profilePicture: "", // Assuming you store profile picture URL or path
  address: {
    building: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  },
  workAuthorization: {
    // Define work authorization fields if needed
    type: "", // H1-B, L2, F1(CPT/OPT), H4, Other
    title: "", // for Other
    proof: "", // URL link to pdf for F1
    start: "2024-01-01",
    end: "2024-01-01",
  },
  reference: {
    fname: "",
    lname: "",
    mname: "",
    phone: "",
    email: "",
    relationship: "",
  },
  emergencyContacts: {
    fname: "",
    lname: "",
    mname: "",
    phone: "",
    email: "",
    relationship: "",
  },
  applicationStatus: "pending", 
  applicationFeedback: "",
};

const applicationSlice = createSlice({
  name: "application",
  initialState: initialApplicationState,
  reducers: {
    setApplicationInfo(state, { payload }) {
        Object.keys(payload).forEach(key => {
            state[key] = payload[key];
            });
    },
  },
});

export const applicationActions = applicationSlice.actions;

export default applicationSlice;
