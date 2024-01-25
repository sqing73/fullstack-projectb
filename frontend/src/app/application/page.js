import SideMenu from "@/shared/nav";
import { Button, Box } from "@mui/material";
import { apiWithAuth } from "@/utils/api";
import { redirect } from 'next/navigation';
import { useDispatch } from "react-redux";
import { applicationActions } from "@/store/reducers/application";

const Applications = () => {
  // @ Init User, Save info to redux, redirect to Start New Application / View Submitted Application automatically
  const id = 1; // 1 for debug
  const [application, setApplication] = useState(null);
  const path = "/application";
  const api = apiWithAuth(path);
  const dispatch = useDispatch();

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

  const handleReturn = () => {
    redirect("/");
  }
  return (
    <div style={{ display: "flex" }}>
      <SideMenu />
      <div>
        <Box style={{ padding: "16px" }}>
          <h1>Onboarding Application</h1>
          <p>Application ID: {id} (Read Only)</p>
          <p>Status {}</p>
          <div className="input-section-label">Personal Information</div>

          <div>First Name: {application.fname}</div>
          <div>Last Name: {application.lname}</div>
          <div>Middle Name: {application.mname}</div>
          <div>Preferred Name: {application.pname}</div>
          <div>Profile Picture: {application.profilePicture}</div>

          <div>Cell Phone Number: {application.cell}</div>
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
            {application.citizen === "green card" && "Yes, I have a green card"}
            {application.citizen === "citizen" && "Yes, I am a citizen of the U.S."}
            {application.citizen === "false" && "No"}
          </div>

          {application.citizen === "false" && (
            <div>
              <div className="input-section-label">Work Authorization</div>
              <div>Work Authorization Type: {application.workAuth.type}</div>
              <div>
                {application.workAuth.type === "F1" &&
                  `OPT Receipt: ${application.workAuth.proof}`}
                {application.workAuth.type === "Other" &&
                  `Visa Title: ${application.workAuth.proof}`}
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

          <div className="input-section-label">
            <Button variant="contained" onClick={handleReturn}>
              Return
            </Button>
          </div>
        </Box>
      </div>
    </div>
  );
};
export default Applications;
