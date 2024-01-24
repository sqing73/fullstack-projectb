"use client";
import { useState, useEffect } from "react";
import Box from "@mui/system/Box";
import { Button, TextField } from "@mui/material";
import SideMenu from "@/shared/nav";
export default function Page({ params }) {
  // init application from server / redux
  const { id } = params;
  const notEditable = false;
  const [inputs, setInputs] = useState({
    fname: "", // required
    lname: "", // required
    mname: "",
    pname: "",
    profilePicture: "",
    address: {
      // required
      apt: "",
      street: "",
      city: "",
      state: "",
      zip: "",
    },
    cell: "", // required
    email: "", // required, init from server
    ssn: "", // required
    dob: "2024-01-01", // required
    gender: "", // required, f/m/na
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
  const handleSubmit = () => {
    console.log("submit:", inputs)
  }
  // application states: unsubmitted(*), pending, approved, rejected(*), *=notEditable
  // @TODO state workauth gender type
  return (
    <div style={{ display: "flex" }}>
      <SideMenu username="Kyrios" />
      <Box style={{ padding: "16px" }}>
        <h1>Onboarding Application</h1>
        <p>
          Application ID: {id} {notEditable ? "" : "(Read Only)"}
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
            readOnly: notEditable,
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
            readOnly: notEditable,
          }}
        />
        <TextField
          name="mname"
          value={inputs.mname}
          label="Middle Name"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: notEditable,
          }}
        />
        <TextField
          name="pname"
          value={inputs.pname}
          label="Preferred Name"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: notEditable,
          }}
        />
        <TextField
          name="profilePicture"
          value={inputs.fname}
          label="Profile Picture"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: notEditable,
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
            readOnly: notEditable,
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
            readOnly: notEditable,
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
            readOnly: notEditable,
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
            readOnly: notEditable,
          }}
        />
        <TextField
          required
          name="gender"
          value={inputs.gender}
          label="Gender"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: notEditable,
          }}
        />

        <div className="input-section-label">Address</div>
        <TextField
          name="address.apt"
          value={inputs.address.apt}
          label="Building/Apt #"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: notEditable,
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
            readOnly: notEditable,
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
            readOnly: notEditable,
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
            readOnly: notEditable,
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
            readOnly: notEditable,
          }}
        />

        <div className="input-section-label">
          Are you permanent resident or citizen of the U.S?
        </div>
        <TextField
          required
          name="citizen"
          value={inputs.citizen}
          label=""
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: notEditable,
          }}
        />
        <div>
          {inputs.citizen === "false" ? (
            <div>
              <TextField
                required
                name="workAuth.type"
                value={inputs.workAuth.type}
                label="Work Authorization"
                variant="standard"
                onChange={handleInputChange}
                InputProps={{
                  readOnly: notEditable,
                }}
              />
              <TextField
                name="workAuth.proof"
                value={inputs.workAuth.proof}
                label={
                  inputs.workAuth.type === "F1" ? "OPT Receipt" : "Visa Title"
                }
                variant="standard"
                onChange={handleInputChange}
                InputProps={{
                  readOnly: notEditable,
                }}
              />
              <TextField
                required
                type="date"
                name="workAuth.start"
                value={inputs.workAuth.start}
                label="Start Date"
                variant="standard"
                onChange={handleInputChange}
                InputProps={{
                  readOnly: notEditable,
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
                  readOnly: notEditable,
                }}
              />
            </div>
          ) : (
            <div></div>
          )}
        </div>
        <div className="input-section-label">
          Reference
        </div>
        <TextField
          required
          name="reference.fname"
          value={inputs.reference.fname}
          label="First Name"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: notEditable,
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
            readOnly: notEditable,
          }}
        />
        <TextField
          name="reference.mname"
          value={inputs.reference.mname}
          label="Middle Name"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: notEditable,
          }}
        />
        <TextField
          name="reference.phone"
          value={inputs.reference.phone}
          label="Phone"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: notEditable,
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
            readOnly: notEditable,
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
            readOnly: notEditable,
          }}
        />
        <div className="input-section-label">
            <Button
                variant="contained"
                onClick={handleSubmit}
            >
                    Submit
            </Button>
        </div>
      </Box>
    </div>
  );
}
