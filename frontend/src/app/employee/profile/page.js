"use client";
import { useState, useEffect } from "react";
import Box from "@mui/system/Box";
import { apiWithAuth } from "@/utils/api";
import {
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import SideMenu from "@/shared/nav";
import { useDispatch, useSelector } from "react-redux";
import { applicationActions } from "@/store/reducers/application";
import styles from "@/ui/profile.module.css";

export default function Page() {
  // init application from server / redux
  // const { id } = params;
  const path = "/employee/profile";
  const api = apiWithAuth(path);
  const [readOnly, setReadOnly] = useState({
    name: true,
    address: true,
    contact: true,
    employment: true,
    emergencyContacts: true,
    documents: true,
    editing: false,
  });
  const [backup, setBackup] = useState({});
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
    workAuthorization: {
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
    const fetchApplication = async () => {
      try {
        const response = await api.get("/");
        setInputs(response.data); // Assuming the response contains the application data
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      } finally {
        // setInitialized(true);
      }
    };

    fetchApplication();
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
  // const dispatch = useDispatch();
  const handleEdit = (name) => {
    return () => {
      if (readOnly.editing === false) {
        setReadOnly((prevReadOnly) => ({
          ...prevReadOnly,
          [name]: false,
          editing: true,
        }));
        setBackup(inputs);
      }
    };
  };
  const handleCancel = () => {
    setInputs(backup);
    setReadOnly({
      name: true,
      address: true,
      contact: true,
      employment: true,
      emergencyContacts: true,
      documents: true,
      editing: false,
    });
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
      workAuthorization: inputs.workAuthorization ?? {
        kind: "",
        title: "",
        proof: "",
        start: "2024-01-01",
        end: "2024-01-01",
      },
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
    };
    // dispatch(applicationActions.setApplicationInfo({...state}));
    api.put("/", state);
    // @TODO exception handling, redirect to view application
    // console.log("submit:", inputs);
  };

  return (
    <div style={{ display: "flex" }}>
      {/*<SideMenu />*/}
      <Box style={{ padding: "16px" }}>
        <h1 className={styles.h1}>Personal Information</h1>
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <div className={styles.inputSectionLabel}>Name</div>
          {readOnly.name ? (
            <Button
              className={styles.miniButton}
              variant="contained"
              disabled={readOnly.editing}
              onClick={handleEdit("name")}
            >
              Edit
            </Button>
          ) : (
            <>
              <Button
                className={styles.miniButton}
                variant="contained"
                onClick={handleSubmit}
              >
                Save
              </Button>
              <Button
                className={styles.miniButton}
                variant="contained"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </>
          )}
        </div>
        <TextField
          required
          name="name.first"
          value={inputs.name.first}
          label="First Name"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: readOnly.name,
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
            readOnly: readOnly.name,
          }}
        />
        <TextField
          name="name.middle"
          value={inputs.name.middle}
          label="Middle Name"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: readOnly.name,
          }}
        />
        <TextField
          name="name.preferred"
          value={inputs.name.preferred}
          label="Preferred Name"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: readOnly.name,
          }}
        />
        <TextField
          name="profilePicture"
          value={inputs.profilePicture}
          label="Profile Picture"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: readOnly.name,
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
            readOnly: readOnly.name,
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
            readOnly: readOnly.name,
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
            readOnly: readOnly.name,
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
              readOnly: readOnly.name,
            }}
          >
            <MenuItem value={"Male"}>Male</MenuItem>
            <MenuItem value={"Female"}>Female</MenuItem>
            <MenuItem value={"Other"}>I do not wish to answer</MenuItem>
          </Select>
        </FormControl>
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <div className={styles.inputSectionLabel}>Contact</div>
          {readOnly.contact ? (
            <Button
              className={styles.miniButton}
              variant="contained"
              disabled={readOnly.editing}
              onClick={handleEdit("contact")}
            >
              Edit
            </Button>
          ) : (
            <>
              <Button
                className={styles.miniButton}
                variant="contained"
                onClick={handleSubmit}
              >
                Save
              </Button>
              <Button
                className={styles.miniButton}
                variant="contained"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </>
          )}
        </div>
        <TextField
          required
          name="phoneNumbers.cell"
          value={inputs.phoneNumbers.cell}
          label="Cell Phone Number"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: readOnly.contact,
          }}
        />
        <TextField
          required
          name="phoneNumbers.work"
          value={inputs.phoneNumbers.work}
          label="Work Phone Number"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: readOnly.contact,
          }}
        />

        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <div className={styles.inputSectionLabel}>Address</div>
          {readOnly.address ? (
            <Button
              className={styles.miniButton}
              variant="contained"
              disabled={readOnly.editing}
              onClick={handleEdit("address")}
            >
              Edit
            </Button>
          ) : (
            <>
              <Button
                className={styles.miniButton}
                variant="contained"
                onClick={handleSubmit}
              >
                Save
              </Button>
              <Button
                className={styles.miniButton}
                variant="contained"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </>
          )}
        </div>
        <TextField
          name="address.building"
          value={inputs.address.building}
          label="Building/Apt #"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: readOnly.address,
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
            readOnly: readOnly.address,
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
            readOnly: readOnly.address,
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
            readOnly: readOnly.address,
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
            readOnly: readOnly.address,
          }}
        />
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <div className={styles.inputSectionLabel}>
            Are you permanent resident or citizen of the U.S.?
          </div>
          {readOnly.employment ? (
            <Button
              className={styles.miniButton}
              variant="contained"
              disabled={readOnly.editing}
              onClick={handleEdit("employment")}
            >
              Edit
            </Button>
          ) : (
            <>
              <Button
                className={styles.miniButton}
                variant="contained"
                onClick={handleSubmit}
              >
                Save
              </Button>
              <Button
                className={styles.miniButton}
                variant="contained"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </>
          )}
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
              readOnly: readOnly.employment,
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
                  value={inputs.workAuthorization.kind}
                  onChange={handleInputChange}
                  inputProps={{
                    readOnly: readOnly.employment,
                  }}
                >
                  <MenuItem value={"H1-B"}>H1-B</MenuItem>
                  <MenuItem value={"L2"}>L2</MenuItem>
                  <MenuItem value={"F1(CPT/OPT)"}>F1(CPT/OPT)</MenuItem>
                  <MenuItem value={"H4"}>H4</MenuItem>
                  <MenuItem value={"Other"}>Other</MenuItem>
                </Select>
              </FormControl>
              {inputs.workAuthorization.kind === "F1(CPT/OPT)" ? (
                <TextField
                  name="workAuth.proof"
                  value={inputs.workAuthorization.proof}
                  label={"OPT Receipt"}
                  variant="standard"
                  onChange={handleInputChange}
                  InputProps={{
                    readOnly: readOnly.employment,
                  }}
                />
              ) : inputs.workAuthorization.kind === "Other" ? (
                <TextField
                  name="workAuth.title"
                  value={inputs.workAuthorization.title}
                  label={"Visa Title"}
                  variant="standard"
                  onChange={handleInputChange}
                  InputProps={{
                    readOnly: readOnly.employment,
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
                value={inputs.workAuthorization.start}
                label="Start Date"
                variant="standard"
                onChange={handleInputChange}
                InputProps={{
                  readOnly: readOnly.employment,
                }}
              />
              <TextField
                required
                type="date"
                name="workAuth.end"
                value={inputs.workAuthorization.end}
                label="End Date"
                variant="standard"
                onChange={handleInputChange}
                InputProps={{
                  readOnly: readOnly.employment,
                }}
              />
            </div>
          ) : (
            <div></div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <div className={styles.inputSectionLabel}>Emergency Contacts</div>
          {readOnly.emergencyContacts ? (
            <Button
              className={styles.miniButton}
              variant="contained"
              disabled={readOnly.editing}
              onClick={handleEdit("emergencyContacts")}
            >
              Edit
            </Button>
          ) : (
            <>
              <Button
                className={styles.miniButton}
                variant="contained"
                onClick={handleSubmit}
              >
                Save
              </Button>
              <Button
                className={styles.miniButton}
                variant="contained"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </>
          )}
        </div>
        <TextField
          required
          name="emergencyContacts.fname"
          value={inputs.emergencyContacts.fname}
          label="First Name"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: readOnly.emergencyContacts,
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
            readOnly: readOnly.emergencyContacts,
          }}
        />
        <TextField
          name="emergencyContacts.mname"
          value={inputs.emergencyContacts.mname}
          label="Middle Name"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: readOnly.emergencyContacts,
          }}
        />
        <TextField
          name="emergencyContacts.phone"
          value={inputs.emergencyContacts.phone}
          label="Phone"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: readOnly.emergencyContacts,
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
            readOnly: readOnly.emergencyContacts,
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
            readOnly: readOnly.emergencyContacts,
          }}
        />
      <div style={{ display: "flex", alignItems: "flex-end" }}>
          <div className={styles.inputSectionLabel}>Documents</div>
          {readOnly.documents ? (
            <Button
              className={styles.miniButton}
              variant="contained"
              disabled={readOnly.editing}
              onClick={handleEdit("documents")}
            >
              Edit
            </Button>
          ) : (
            <>
              <Button
                className={styles.miniButton}
                variant="contained"
                onClick={handleSubmit}
              >
                Save
              </Button>
              <Button
                className={styles.miniButton}
                variant="contained"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </>
          )}
        </div>
        {/* display profile picture and opt receipt if exists */}
      </Box>
    </div>
  );
}
