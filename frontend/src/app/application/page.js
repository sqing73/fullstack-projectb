import SideMenu from "@/shared/nav";
import { Button, Box } from "@mui/material";
import { apiWithAuth } from "@/utils/api";
import { redirect } from 'next/navigation';
import { useDispatch } from "react-redux";
import { applicationActions } from "@/store/reducers/application";

const Applications = () => {
  // @ Init User, Save info to redux, redirect to Start New Application / View Submitted Application automatically
  // const id = 1;
  
  const path = "/profile";
  const api = apiWithAuth(path);
  let readOnly = true;
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await api.get("/");
        // setApplication(response.data); // Assuming the response contains the application data
        dispatch(applicationActions.setApplicationInfo({...response.data}));
        if (response.data.applicationStatus === "rejected") {
           readOnly = false;
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        readOnly = false;
      }
    };

    fetchApplication();
  }, []);

  
  return (
    <div style={{ display: "flex" }}>
      <SideMenu />
      {readOnly?<ViewApplication />:<EditApplication api={api} readOnly={false}/>}
    </div>
  );
};

const ViewApplication = () => {
  const application = useSelector(state => state.application);

  const handleReturn = () => {
    redirect("/");
  }
  
  return (
    <div>
        <Box style={{ padding: "16px" }}>
          <h1>Onboarding Application</h1>
          <p>(Read Only)</p>
          <p>Status: {application.applicationStatus}</p>
          <div className="input-section-label">Personal Information</div>

          <div>First Name: {application.name.fname}</div>
          <div>Last Name: {application.name.lname}</div>
          <div>Middle Name: {application.name.mname}</div>
          <div>Preferred Name: {application.name.pname}</div>
          <div>Profile Picture: {application.profilePicture}</div>

          <div>Cell Phone Number: {application.phoneNumbers.cell}</div>
          <div>Email: {application.email}</div>
          <div>SSN: {application.ssn}</div>
          <div>Date of Birth: {application.dob}</div>
          <div>Gender: {application.gender}</div>

          <div className="input-section-label">Address</div>
          <div>Building/Apt #: {application.address.building}</div>
          <div>Street: {application.address.street}</div>
          <div>City: {application.address.city}</div>
          <div>State: {application.address.state}</div>
          <div>Zip: {application.address.zip}</div>

          <div className="input-section-label">Residency Status</div>
          <div>
            {application.residencyStatus.status === "Green Card" && "Yes, I have a green card"}
            {application.residencyStatus.status === "Citizen" && "Yes, I am a citizen of the U.S."}
            {application.residencyStatus.status === "none" && "No"}
          </div>

          {application.residencyStatus.status === "none" && (
            <div>
              <div className="input-section-label">Work Authorization</div>
              <div>Work Authorization Type: {application.workAuth.type}</div>
              <div>
                {application.workAuth.type === "F1(OPT/CPT)" &&
                  `OPT Receipt: ${application.workAuth.proof}`}
                {application.workAuth.type === "Other" &&
                  `Visa Title: ${application.workAuth.title}`}
              </div>
              <div>Start Date: {application.workAuth.start}</div>
              <div>End Date: {application.workAuth.end}</div>
            </div>
          )}

          <div className="input-section-label">Reference</div>
          <div>First Name: {application.reference.fname}</div>
          <div>Last Name: {application.reference.lname}</div>
          <div>Middle Name: {application.reference.mname}</div>
          <div>Phone: {application.reference.phone}</div>
          <div>Email: {application.reference.email}</div>
          <div>Relationship: {application.reference.relationship}</div>

          <div className="input-section-label">Emergency Contacts</div>
          <div>First Name: {application.emergencyContacts.fname}</div>
          <div>Last Name: {application.emergencyContacts.lname}</div>
          <div>Middle Name: {application.emergencyContacts.mname}</div>
          <div>Phone: {application.emergencyContacts.phone}</div>
          <div>Email: {application.emergencyContacts.email}</div>
          <div>Relationship: {application.emergencyContacts.relationship}</div>
          <div className="input-section-label">
            <Button variant="contained" onClick={handleReturn}>
              Return
            </Button>
          </div>
        </Box>
      </div>
  );
}

const EditApplication = (props) => {
  // init application from server / redux
  // const { id } = params;
  const { api } = props;
  let readOnly = false; // legacy option

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
      pname: "",
      phone: "",
      email: "",
      relationship: "",
    },
  });

  useEffect(() => {
    const application = useSelector(state => state.application);

    if (props.readOnly === true) {
      readOnly = true;
    }
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
        pname: "",
        phone: "",
        email: "",
        relationship: "",
      },
      applicationStatus: "pending",
    }
    dispatch(applicationActions.setApplicationInfo({...state}));
    api.post("/", state);
    // @TODO exception handling, redirect to view application
    // console.log("submit:", inputs);
  };
  // application states: unsubmitted, pending(*), approved(*), rejected, *=readOnly
  return (
    <div style={{ display: "flex" }}>
      <SideMenu />
      <Box style={{ padding: "16px" }}>
        <h1>Onboarding Application</h1>
        <p>
          {readOnly ? "(Read Only)" : ""}
        </p>
        <div className="input-section-label">Personal Information</div>
        <TextField
          required
          name="fname"
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
          name="lname"
          value={inputs.name.last}
          label="Last Name"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: readOnly,
          }}
        />
        <TextField
          name="mname"
          value={inputs.name.middle}
          label="Middle Name"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            readOnly: readOnly,
          }}
        />
        <TextField
          name="pname"
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
          name="cell"
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
          name="ssn"
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
          name="dob"
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
            name="gender"
            labelId="gender-select-label"
            value={inputs.personalInfo.gender}
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
          {inputs.residencyStatus.status === "false" ? (
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
              {inputs.workAuth.kind === "F1(OPT/CPT)" ? (
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

<div className="input-section-label">Emergency Contacts</div>
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
        <div className="input-section-label">
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </Box>
    </div>
  );
}

export default Applications;
