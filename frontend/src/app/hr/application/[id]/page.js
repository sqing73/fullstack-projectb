"use client";
import { useState, useEffect } from "react";
import Box from "@mui/system/Box";
import { apiWithAuth } from "@/utils/api";
import {
  Button,
  TextField,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Paper,
} from "@mui/material";
import { useRouter } from "next/navigation";
import styles from "@/ui/profile.module.css";
import PreviewFile from "@/components/PreviewFile";

export default function Page({ params }) {
  // init application from server / redux
  const { id } = params;
  const path = "/hr/profile";
  const api = apiWithAuth(path);
  const [initialized, setInitialized] = useState(false);
  const [locked, setLocked] = useState(false);
  const [application, setApplication] = useState({
    name: {
      first: "",
      last: "",
      middle: "", // Optional
      preferred: "", // Optional
    },
    profilePicture: "",
    address: {
      // required
      building: "",
      street: "",
      city: "",
      state: "",
      zip: "",
    },
    phoneNumbers: {
      cell: "", // required
      work: "",
    },
    email: "", // required, init from server
    personalInfo: {
      ssn: "", // required
      dob: "2024-01-01", // required
      gender: "", // required, f/m/unknown
    },
    residencyStatus: {
      status: "Green Card", // required, green card/citizen/false
    },
    workAuth: {
      kind: "", // H1-B, L2, F1(CPT/OPT), H4, Other
      title: "", // for Other
      proof: "", // for F1
      start: "2024-01-01",
      end: "2024-01-01",
    },
    reference: {
      fname: "", // required
      lname: "", // required
      mname: "",
      phone: "",
      email: "",
      relationship: "", // required
    },
    emergencyContacts: [
      {
        fname: "",
        lname: "",
        mname: "",
        phone: "",
        email: "",
        relationship: "",
      },
    ],
    applicationStatus: "loading...",
    applicationFeedback: "",
  });
  const router = useRouter();
  const handleDecision = (event) => {
    setApplication((prevApp) => ({
      ...prevApp,
      applicationStatus: event.target.value,
    }));
  };
  const handleFeedback = (event) => {
    setApplication((prevApp) => ({
      ...prevApp,
      applicationFeedback: event.target.value,
    }));
  };

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await api.get(`/${id}`);
        setApplication(response.data);
        if (response.data.applicationStatus == "approved") {
          setLocked(true);
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      } finally {
        setInitialized(true);
      }
    };

    fetchApplication();
  }, []);

  const handleSubmit = () => {
    const state = {
      _id: id,
      ...application,
    };
    api.put("/", state);
    // @TODO exception handling, redirect to view application
    // console.log("submit:", inputs);
    router.push("/hr/hiring");
  };
  return (
    <Paper sx={{ mx: 15, my: 5 }}>
      <div style={{ display: "flex" }}>
        <Box style={{ padding: "16px" }}>
          <h1 className={styles.h1}>Onboarding Application</h1>
          <p>Status: {application.applicationStatus}</p>
          <div className={styles.inputSectionLabel}>Personal Information</div>

          <div>First Name: {application.name.first}</div>
          <div>Last Name: {application.name.last}</div>
          <div>Middle Name: {application.name.middle}</div>
          <div>Preferred Name: {application.name.preferred}</div>
          <div>
            Profile Picture: {application.profilePicture}{" "}
            {application.profilePicture !== "" && (
              <PreviewFile file={application.profilePicture} hrPreview={true}>
                Preview
              </PreviewFile>
            )}
          </div>

          <div>Cell Phone Number: {application.phoneNumbers.cell}</div>
          <div>Email: {application.email}</div>
          <div>SSN: {application.personalInfo.ssn}</div>
          <div>Date of Birth: {application.personalInfo.dob.split("T")[0]}</div>
          <div>Gender: {application.personalInfo.gender}</div>

          <div className={styles.inputSectionLabel}>Address</div>
          <div>Building/Apt #: {application.address.building}</div>
          <div>Street: {application.address.street}</div>
          <div>City: {application.address.city}</div>
          <div>State: {application.address.state}</div>
          <div>Zip: {application.address.zip}</div>

          <div className={styles.inputSectionLabel}>Residency Status</div>
          <div>
            {application.residencyStatus.status === "Green Card" &&
              "Yes, I have a green card"}
            {application.residencyStatus.status === "Citizen" &&
              "Yes, I am a citizen of the U.S."}
            {application.residencyStatus.status === "none" && "No"}
          </div>

          {application.residencyStatus.status === "none" && (
            <div>
              <div className={styles.inputSectionLabel}>Work Authorization</div>
              <div>
                Work Authorization Type: {application.workAuthorization.kind}
              </div>
              <div>
                {application.workAuthorization.kind === "F1(CPT/OPT)" &&
                  `OPT Receipt: ${application.workAuthorization.proof}`}
                {application.workAuthorization.kind === "Other" &&
                  `Visa Title: ${application.workAuthorization.title}`}
              </div>
              <div>
                Start Date: {application.workAuthorization.start.split("T")[0]}
              </div>
              <div>
                End Date: {application.workAuthorization.end.split("T")[0]}
              </div>
            </div>
          )}

          <div className={styles.inputSectionLabel}>Reference</div>
          <div>First Name: {application.reference.fname}</div>
          <div>Last Name: {application.reference.lname}</div>
          <div>Middle Name: {application.reference.mname}</div>
          <div>Phone: {application.reference.phone}</div>
          <div>Email: {application.reference.email}</div>
          <div>Relationship: {application.reference.relationship}</div>

          <div className={styles.inputSectionLabel}>Emergency Contacts</div>
          {application.emergencyContacts.map((contact, index) => (
            <>
              <div>Contact {index + 1}</div>
              <div>First Name: {contact.fname}</div>
              <div>Last Name: {contact.lname}</div>
              <div>Middle Name: {contact.mname}</div>
              <div>Phone: {contact.phone}</div>
              <div>Email: {contact.email}</div>
              <div>Relationship: {contact.relationship}</div>
            </>
          ))}

          <div className={styles.inputSectionLabel}>Decision</div>
          <FormControl>
            <RadioGroup
              name="application-hr-decision"
              value={application.applicationStatus}
              onChange={handleDecision}
            >
              <FormControlLabel
                disabled={locked}
                value="approved"
                control={<Radio />}
                label="Approve"
              />
              <FormControlLabel
                disabled={locked}
                value="rejected"
                control={<Radio />}
                label="Reject"
              />
            </RadioGroup>
          </FormControl>
          {application.applicationStatus === "rejected" && (
            <TextField
              name="applicationFeedback"
              value={application.applicationFeedback}
              label="Feedback"
              multiline
              rows={4}
              onChange={handleFeedback}
            />
          )}
          {locked === false && (
            <div className={styles.inputSectionLabel}>
              <Button variant="contained" onClick={handleSubmit}>
                Submit
              </Button>
            </div>
          )}
        </Box>
      </div>
    </Paper>
  );
}
