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


export default function Page({ params }) {
  // init application from server / redux
  const { id } = params;
  let readOnly = false;
  const path = "/application";
  const api = apiWithAuth(path);
  const [inputs, setInputs] = useState({
    fname: "", // required
    lname: "", // required
    mname: "",
    pname: "",
    profilePicture: "",
    address: {
      // required
      building: "",
      street: "",
      city: "",
      state: "",
      zip: "",
    },
    cell: "", // required
    email: "", // required, init from server
    ssn: "", // required
    dob: "2024-01-01", // required
    gender: "", // required, f/m/unknown
    citizen: "Green Card", // required, green card/citizen/false
    workAuth: {
      type: "", // H1-B, L2, F1(CPT/OPT), H4, Other
      proof: "", // OPT Receipt (file) / visa title
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
  });

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await api.get("/");
        setApplication(response.data); // Assuming the response contains the application data
        dispatch(applicationActions.setApplicationInfo({...response.data}));
        if (response.data.nextStep === "Resubmit") {
            redirect(`/application/employee_view/${id}`);
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        redirect(`/application/employee_view/${id}`);
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
  const dispatch = useDispatch();

  const handleSubmit = () => {
    const state = {
      name: {
        first: inputs.fname ?? "",
        last: inputs.lname ?? "",
        middle: inputs.mname ?? "",
        preferred: inputs.pname ?? "",
      },
      personalInfo: {
        ssn: inputs.ssn ?? "",
        dob: inputs.dob ?? "2024-01-01",
        gender: inputs.gender ?? "",
      },
      residencyStatus: {
        status: inputs.citizen ?? "",
      },
      phoneNumbers: {
        cell: inputs.cell ?? "",
      },
      email: inputs.email ?? "",
      profilePicture: inputs.profilePicture ?? "",
      address: inputs.address ?? "",
      workAuthorization: inputs.workAuthorization ?? {
        type: "",
        proof: "",
        start: "2024-01-01",
        end: "2024-01-01",
      },
      reference: inputs.reference ?? {
        fname: "",
        lname: "",
        mname: "",
        pname: "",
        phone: "",
        email: "",
        relationship: "",
      },
      nextStep: "HR Review",
    }
    dispatch(applicationActions.setApplicationInfo({...state}));
    api.post(`/${id}`, state);
    // @TODO redirect to view application
    // console.log("submit:", inputs);
  };
  // application states: unsubmitted, pending(*), approved(*), rejected, *=readOnly
  return (
    <div style={{ display: "flex" }}>
      <SideMenu />
      <Box style={{ padding: "16px" }}>
        <h1>Onboarding Application</h1>
        <p>
          Application ID: {id} {readOnly ? "(Read Only)" : ""}
        </p>
        <div className="input-section-label">Personal Information</div>
        <TextField
          required
          name="fname"
          value={inputs.fname}
          label="First Name"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: readOnly,
          }}
        />
        <TextField
          required
          name="lname"
          value={inputs.lname}
          label="Last Name"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: readOnly,
          }}
        />
        <TextField
          name="mname"
          value={inputs.mname}
          label="Middle Name"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: readOnly,
          }}
        />
        <TextField
          name="pname"
          value={inputs.pname}
          label="Preferred Name"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: readOnly,
          }}
        />
        <TextField
          name="profilePicture"
          value={inputs.fname}
          label="Profile Picture"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: readOnly,
          }}
        />

        <TextField
          required
          name="cell"
          value={inputs.cell}
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
          name="ssn"
          value={inputs.ssn}
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
          name="dob"
          value={inputs.dob}
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
            name="gender"
            labelId="gender-select-label"
            value={inputs.gender}
            label="Gender"
            onChange={handleInputChange}
            inputProps={{
              readOnly: readOnly,
            }}
          >
            <MenuItem value={"male"}>Male</MenuItem>
            <MenuItem value={"female"}>Female</MenuItem>
            <MenuItem value={"unknown"}>I do not wish to answer</MenuItem>
          </Select>
        </FormControl>
        <div className="input-section-label">Address</div>
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

        <div className="input-section-label">
          Are you permanent resident or citizen of the U.S.?
        </div>
        <FormControl
          variant="standard"
          sx={{ m: 1, minWidth: 200 }}
          size="small"
        >
          <Select
            required
            name="citizen"
            label=""
            value={inputs.citizen}
            onChange={handleInputChange}
            inputProps={{
              readOnly: readOnly,
            }}
          >
            <MenuItem value={"green card"}>Yes, I have green card</MenuItem>
            <MenuItem value={"citizen"}>Yes, I am citizen of the U.S.</MenuItem>
            <MenuItem value={"false"}>No</MenuItem>
          </Select>
        </FormControl>
        <div>
          {inputs.citizen === "false" ? (
            <div>
              <FormControl
                variant="standard"
                sx={{ m: 1, minWidth: 200 }}
                size="small"
              >
                <InputLabel id="wa-select-label">Work Authorization</InputLabel>
                <Select
                  required
                  name="workAuth.type"
                  labelId="wa-select-label"
                  label="Work Authorization"
                  value={inputs.workAuth.type}
                  onChange={handleInputChange}
                  inputProps={{
                    readOnly: readOnly,
                  }}
                >
                  <MenuItem value={"H1-B"}>H1-B</MenuItem>
                  <MenuItem value={"L2"}>L2</MenuItem>
                  <MenuItem value={"F1"}>F1(CPT/OPT)</MenuItem>
                  <MenuItem value={"H4"}>H4</MenuItem>
                  <MenuItem value={"Other"}>Other</MenuItem>
                </Select>
              </FormControl>
              {inputs.workAuth.type === "F1" ? (
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
              ) : inputs.workAuth.type === "Other" ? (
                <TextField
                  name="workAuth.proof"
                  value={inputs.workAuth.proof}
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
        <div className="input-section-label">Reference</div>
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
        <div className="input-section-label">
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </Box>
    </div>
  );
}
