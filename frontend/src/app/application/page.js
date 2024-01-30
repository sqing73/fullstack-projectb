"use client";
import { useState, useEffect } from "react";
import SideMenu from "@/shared/nav";
import {
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
} from "@mui/material";
import { apiWithAuth } from "@/utils/api";
import { redirect } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { applicationActions } from "@/store/reducers/application";
import styles from "@/ui/profile.module.css";

const Applications = () => {
  // @ Init User, Save info to redux, redirect to Start New Application / View Submitted Application automatically
  // const id = 1;

  const path = "/employee/profile";
  const api = apiWithAuth(path);
  const [readOnly, setReadOnly] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await api.get("/");
        // setApplication(response.data); // Assuming the response contains the application data
        dispatch(applicationActions.setApplicationInfo({ ...response.data }));
        if (response.data.applicationStatus === "rejected") {
          setReadOnly(false);
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        setReadOnly(false);
      } finally {
        setInitialized(true);
      }
    };

    fetchApplication();
  }, []);

  return (
    <div style={{ display: "flex" }}>
      {/*<SideMenu />*/}
      {initialized === true &&
        (readOnly ? <ViewApplication /> : <EditApplication api={api} />)}
    </div>
  );
};

const ViewApplication = () => {
  const application = useSelector((state) => state.application);

  const handleReturn = () => {
    redirect("../");
  };

  return (
    <div>
      <Box style={{ padding: "16px" }}>
        <h1 className={styles.h1}>Onboarding Application</h1>
        <p>(Read Only)</p>
        <p>Status: {application.applicationStatus}</p>
        <div className={styles.inputSectionLabel}>Personal Information</div>

        <div>First Name: {application.name.first}</div>
        <div>Last Name: {application.name.last}</div>
        <div>Middle Name: {application.name.middle}</div>
        <div>Preferred Name: {application.name.preferred}</div>
        <div>Profile Picture: {application.profilePicture}</div>

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
        <div>First Name: {application.emergencyContacts.fname}</div>
        <div>Last Name: {application.emergencyContacts.lname}</div>
        <div>Middle Name: {application.emergencyContacts.mname}</div>
        <div>Phone: {application.emergencyContacts.phone}</div>
        <div>Email: {application.emergencyContacts.email}</div>
        <div>Relationship: {application.emergencyContacts.relationship}</div>
        <div className={styles.inputSectionLabel}>
          <Button variant="contained" onClick={handleReturn}>
            Return
          </Button>
        </div>
      </Box>
    </div>
  );
};

const EditApplication = (props) => {
  // init application from server / redux
  // const { id } = params;
  const { api } = props;
  const readOnly = false; // legacy option
  const application = useSelector((state) => state.application);

  const [inputs, setInputs] = useState({
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
    emergencyContacts: {
      fname: "",
      lname: "",
      mname: "",
      phone: "",
      email: "",
      relationship: "",
    },
  });

  useEffect(() => {
    //
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const [field, subField] = name.split(".");

    if (subField) {
      setInputs((prevInputs) => ({
        ...prevInputs,
        [field]: {
          ...prevInputs[field],
          [subField]: value,
        },
      }));
    } else {
      setInputs((prevInputs) => ({
        ...prevInputs,
        [name]: value,
      }));
    }
  };
  const dispatch = useDispatch();

  const handleFileUploadSuccess = async (filename) => {
    if (filename) {
      setInputs((prevInputs) => ({
        ...prevInputs,
        workAuth: {
          ...prevInputs.workAuth,
          proof: filename,
        },
      }));
    }
  };

  const handleSubmit = () => {
    const state = {
      name: inputs.name ?? {
        first: "",
        last: "",
        middle: "", // Optional
        preferred: "", // Optional
      },
      personalInfo: inputs.personalInfo ?? {
        ssn: "",
        dob: "2024-01-01",
        gender: "",
      },
      residencyStatus: {
        status: inputs.residencyStatus.status ?? "",
      },
      phoneNumbers: inputs.phoneNumbers ?? {
        cell: "",
        work: "", // Separate cell and work numbers
      },
      email: inputs.email ?? "",
      profilePicture: inputs.profilePicture ?? "",
      address: inputs.address ?? {
        building: "",
        street: "",
        city: "",
        state: "",
        zip: "",
      },
      workAuthorization: {
        kind: inputs.workAuth.kind ?? "",
        title: inputs.workAuth.kind === "Other" ? inputs.workAuth.title : "",
        proof:
          inputs.workAuth.kind === "F1(CPT/OPT)" ? inputs.workAuth.proof : "",
        start: "2024-01-01",
        end: "2024-01-01",
      },
      visaStatus:
        inputs.workAuth.kind === "F1(CPT/OPT)"
          ? {
              OPTreceipt: {
                step: {
                  status: "pending",
                  file: inputs.workAuth.proof,
                  feedback: null,
                },
              },
              OPTead: null,
              I20: null,
              I983: null,
            }
          : null,
      visaCurrStep:
        inputs.workAuth.kind === "F1(CPT/OPT)" ? "OPTreceipt" : "none",
      reference: inputs.reference ?? {
        fname: "",
        lname: "",
        mname: "",
        phone: "",
        email: "",
        relationship: "",
      },
      emergencyContacts: inputs.emergencyContacts ?? {
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
    dispatch(applicationActions.setApplicationInfo({ ...state }));
    try {
      if (application.applicationStatus === "rejected") {
        api.put("/", state);
      } else {
        api.post("/", state);
      }
    } catch (err) {
      console.error("Failed to submit user application:", err);
    }
    // @TODO exception handling, redirect to view application
  };
  return (
    <div style={{ display: "flex" }}>
      {/*<SideMenu />*/}
      <Box style={{ padding: "16px" }}>
        <h1 className={styles.h1}>Onboarding Application</h1>
        <p>Application Status {application.applicationStatus ?? "Unsubmitted"}</p>
        {application.applicationStatus === "rejected" && <p>Feedback: {application.applicationFeedback}</p>}
        <div className={styles.inputSectionLabel}>Personal Information</div>
        <TextField
          required
          name="name.first"
          value={inputs.name.first}
          label="First Name"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: readOnly,
          }}
        />
        <TextField
          required
          name="name.last"
          value={inputs.name.last}
          label="Last Name"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: readOnly,
          }}
        />
        <TextField
          name="name.middle"
          value={inputs.name.middle}
          label="Middle Name"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: readOnly,
          }}
        />
        <TextField
          name="name.preferred"
          value={inputs.name.preferred}
          label="Preferred Name"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: readOnly,
          }}
        />
        <TextField
          name="profilePicture"
          value={inputs.profilePicture}
          label="Profile Picture"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: readOnly,
          }}
        />

        <TextField
          required
          name="phoneNumbers.cell"
          value={inputs.phoneNumbers.cell}
          label="Cell Phone Number"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: readOnly,
          }}
        />
        <TextField
          required
          type="email"
          name="email"
          value={inputs.email}
          label="Email"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: readOnly,
          }}
        />
        <TextField
          required
          name="personalInfo.ssn"
          value={inputs.personalInfo.ssn}
          label="SSN"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: readOnly,
          }}
        />
        <TextField
          required
          type="date"
          name="personalInfo.dob"
          value={inputs.personalInfo.dob}
          label="Date of Birth"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: readOnly,
          }}
        />
        <FormControl
          variant="standard"
          sx={{ m: 1, minWidth: 200 }}
          size="small"
        >
          <InputLabel id="gender-select-label">Gender</InputLabel>
          <Select
            required
            name="personalInfo.gender"
            labelId="gender-select-label"
            value={inputs.personalInfo.gender}
            label="Gender"
            onChange={handleInputChange}
            inputProps={{
              readOnly: readOnly,
            }}
          >
            <MenuItem value={"Male"}>Male</MenuItem>
            <MenuItem value={"Female"}>Female</MenuItem>
            <MenuItem value={"Other"}>I do not wish to answer</MenuItem>
          </Select>
        </FormControl>
        <div className={styles.inputSectionLabel}>Address</div>
        <TextField
          name="address.building"
          value={inputs.address.building}
          label="Building/Apt #"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: readOnly,
          }}
        />
        <TextField
          required
          name="address.street"
          value={inputs.address.street}
          label="Street"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: readOnly,
          }}
        />
        <TextField
          required
          name="address.city"
          value={inputs.address.city}
          label="City"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: readOnly,
          }}
        />
        <TextField
          required
          name="address.state"
          value={inputs.address.state}
          label="State"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: readOnly,
          }}
        />
        <TextField
          required
          name="address.zip"
          value={inputs.address.zip}
          label="Zip"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: readOnly,
          }}
        />

        <div className={styles.inputSectionLabel}>
          Are you permanent resident or citizen of the U.S.?
        </div>
        <FormControl
          variant="standard"
          sx={{ m: 1, minWidth: 200 }}
          size="small"
        >
          <Select
            required
            name="residencyStatus.status"
            label=""
            value={inputs.residencyStatus.status}
            onChange={handleInputChange}
            inputProps={{
              readOnly: readOnly,
            }}
          >
            <MenuItem value={"Green Card"}>Yes, I have green card</MenuItem>
            <MenuItem value={"Citizen"}>Yes, I am citizen of the U.S.</MenuItem>
            <MenuItem value={"none"}>No</MenuItem>
          </Select>
        </FormControl>
        <div>
          {inputs.residencyStatus.status === "none" ? (
            <div>
              <FormControl
                variant="standard"
                sx={{ m: 1, minWidth: 200 }}
                size="small"
              >
                <InputLabel id="wa-select-label">Work Authorization</InputLabel>
                <Select
                  required
                  name="workAuth.kind"
                  labelId="wa-select-label"
                  label="Work Authorization"
                  value={inputs.workAuth.kind}
                  onChange={handleInputChange}
                  inputProps={{
                    readOnly: readOnly,
                  }}
                >
                  <MenuItem value={"H1-B"}>H1-B</MenuItem>
                  <MenuItem value={"L2"}>L2</MenuItem>
                  <MenuItem value={"F1(CPT/OPT)"}>F1(CPT/OPT)</MenuItem>
                  <MenuItem value={"H4"}>H4</MenuItem>
                  <MenuItem value={"Other"}>Other</MenuItem>
                </Select>
              </FormControl>
              {inputs.workAuth.kind === "F1(CPT/OPT)" ? (
                <TextField
                  name="workAuth.proof"
                  value={inputs.workAuth.proof}
                  label={"OPT Receipt"}
                  variant="standard"
                  onChange={handleInputChange}
                  InputProps={{
                    readOnly: readOnly,
                  }}
                />
              ) : inputs.workAuth.kind === "Other" ? (
                <TextField
                  name="workAuth.title"
                  value={inputs.workAuth.title}
                  label={"Visa Title"}
                  variant="standard"
                  onChange={handleInputChange}
                  InputProps={{
                    readOnly: readOnly,
                  }}
                />
              ) : (
                <div></div>
              )}
              <div></div>
              <TextField
                required
                type="date"
                name="workAuth.start"
                value={inputs.workAuth.start}
                label="Start Date"
                variant="standard"
                onChange={handleInputChange}
                InputProps={{
                  readOnly: readOnly,
                }}
              />
              <TextField
                required
                type="date"
                name="workAuth.end"
                value={inputs.workAuth.end}
                label="End Date"
                variant="standard"
                onChange={handleInputChange}
                InputProps={{
                  readOnly: readOnly,
                }}
              />
            </div>
          ) : (
            <div></div>
          )}
        </div>
        <div className={styles.inputSectionLabel}>Reference</div>
        <TextField
          required
          name="reference.fname"
          value={inputs.reference.fname}
          label="First Name"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: readOnly,
          }}
        />
        <TextField
          required
          name="reference.lname"
          value={inputs.reference.lname}
          label="Last Name"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: readOnly,
          }}
        />
        <TextField
          name="reference.mname"
          value={inputs.reference.mname}
          label="Middle Name"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: readOnly,
          }}
        />
        <TextField
          name="reference.phone"
          value={inputs.reference.phone}
          label="Phone"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: readOnly,
          }}
        />
        <TextField
          type="email"
          name="reference.email"
          value={inputs.reference.email}
          label="Email"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: readOnly,
          }}
        />
        <TextField
          required
          name="reference.relationship"
          value={inputs.reference.relationship}
          label="Relationship"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: readOnly,
          }}
        />

        <div className={styles.inputSectionLabel}>Emergency Contacts</div>
        <TextField
          required
          name="emergencyContacts.fname"
          value={inputs.emergencyContacts.fname}
          label="First Name"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: readOnly,
          }}
        />
        <TextField
          required
          name="emergencyContacts.lname"
          value={inputs.emergencyContacts.lname}
          label="Last Name"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: readOnly,
          }}
        />
        <TextField
          name="emergencyContacts.mname"
          value={inputs.emergencyContacts.mname}
          label="Middle Name"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: readOnly,
          }}
        />
        <TextField
          name="emergencyContacts.phone"
          value={inputs.emergencyContacts.phone}
          label="Phone"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: readOnly,
          }}
        />
        <TextField
          type="email"
          name="emergencyContacts.email"
          value={inputs.emergencyContacts.email}
          label="Email"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: readOnly,
          }}
        />
        <TextField
          required
          name="emergencyContacts.relationship"
          value={inputs.emergencyContacts.relationship}
          label="Relationship"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: readOnly,
          }}
        />
        <div className={styles.inputSectionLabel}>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </Box>
    </div>
  );
};

export default Applications;
