import React, { useEffect } from "react";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CardContent from "@mui/material/CardContent";
import Collapse from "@mui/material/Collapse";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import { CardActions, Stack } from "@mui/material";
import { HR_API } from "@/utils/api";
import PreviewFile from "@/components/PreviewFile";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const ProfielDetail = ({ profile }) => {
  const [expanded, setExpanded] = React.useState({
    address: false,
    personalInfo: false,
    residencyStatus: false,
    phoneNumbers: false,
    workAuthorization: false,
    reference: false,
    emergencyContacts: false,
  });
  const [pictureUrl, setPictureUrl] = React.useState(profile.profilePicture);

  useEffect(() => {
    HR_API.get(`/assets/userAvatars/${pictureUrl}`, { responseType: "blob" })
      .then((response) => {
        const blobUrl = URL.createObjectURL(response.data);
        setPictureUrl(() => blobUrl);
      })
      .catch((error) => {
        console.log("picture fetch error", error);
      });
  }, []);

  const handleExpandClick = (field) => {
    setExpanded((prev) => {
      const newState = { ...prev };
      for (let key of Object.keys(newState)) {
        if (key !== field) {
          newState[key] = false;
        }
      }
      newState[field] = !newState[field];
      return newState;
    });
  };

  return (
    <>
      <CardHeader
        avatar={
          <Avatar
            src={pictureUrl}
            // sx={{ width: 56, height: 56 }}
          >
            {profile.name?.first[0]}
          </Avatar>
        }
        title={profile.fullname}
      />
      <CardContent>
        <Typography>{profile.email}</Typography>

        {/* personal info */}
        <Box>
          <CardActions disableSpacing sx={{ p: 0 }}>
            <Typography variant="body1">Personal Information</Typography>
            <ExpandMore
              expand={expanded.personalInfo}
              onClick={() => handleExpandClick("personalInfo")}
              aria-expanded={expanded.personalInfo}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </CardActions>
          <Collapse in={expanded.personalInfo} timeout="auto" unmountOnExit>
            <CardContent>
              <Stack direction="column">
                <Typography paragraph>
                  SSN: {profile.personalInfo?.ssn}
                </Typography>
                <Typography paragraph>
                  Street:{" "}
                  {
                    new Date(profile.personalInfo?.dob)
                      .toLocaleString()
                      .split(",")[0]
                  }
                </Typography>
                <Typography paragraph>
                  Gender: {profile.personalInfo?.gender}
                </Typography>
              </Stack>
            </CardContent>
          </Collapse>
        </Box>
        <Divider />

        {/* address details */}
        <Box>
          <CardActions disableSpacing sx={{ p: 0 }}>
            <Typography variant="body1">Address</Typography>
            <ExpandMore
              expand={expanded.address}
              onClick={() => handleExpandClick("address")}
              aria-expanded={expanded.address}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </CardActions>
          <Collapse in={expanded.address} timeout="auto" unmountOnExit>
            <CardContent>
              <Stack direction="column">
                <Typography paragraph>
                  Building: {profile.address?.building}
                </Typography>
                <Typography paragraph>
                  Street: {profile.address?.street}
                </Typography>
                <Typography paragraph>City: {profile.address?.city}</Typography>
                <Typography paragraph>
                  State: {profile.address?.state}
                </Typography>
                <Typography paragraph>Zip: {profile.address?.zip}</Typography>
              </Stack>
            </CardContent>
          </Collapse>
        </Box>

        <Divider />
        {/* phone numbers */}
        <Box>
          <CardActions disableSpacing sx={{ p: 0 }}>
            <Typography variant="body1">Phone Numbers</Typography>
            <ExpandMore
              expand={expanded.phoneNumbers}
              onClick={() => handleExpandClick("phoneNumbers")}
              aria-expanded={expanded.phoneNumbers}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </CardActions>
          <Collapse in={expanded.phoneNumbers} timeout="auto" unmountOnExit>
            <CardContent>
              <Stack direction="column">
                <Typography paragraph>
                  Cell Phone: {profile.phoneNumbers?.cell}
                </Typography>
                <Typography paragraph>
                  Work Phone: {profile.phoneNumbers?.work}
                </Typography>
              </Stack>
            </CardContent>
          </Collapse>
        </Box>

        <Divider />
        {/* residency status */}
        <Box>
          <CardActions disableSpacing sx={{ p: 0 }}>
            <Typography variant="body1">Residency Status</Typography>
            <ExpandMore
              expand={expanded.residencyStatus}
              onClick={() => handleExpandClick("residencyStatus")}
              aria-expanded={expanded.residencyStatus}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </CardActions>
          <Collapse in={expanded.residencyStatus} timeout="auto" unmountOnExit>
            <CardContent>
              <Stack direction="column">
                <Typography paragraph>
                  Permanent Resident or Citizen:{" "}
                  {profile.residencyStatus?.isPermanentResidentOrCitizen
                    ? "Yes"
                    : "No"}
                </Typography>
                <Typography paragraph>
                  Status: {profile.residencyStatus?.status || "N/A"}
                </Typography>
              </Stack>
            </CardContent>
          </Collapse>
        </Box>

        {/* work authorizations */}
        {profile.workAuthorization && (
          <>
            <Divider />
            <Box>
              <CardActions disableSpacing sx={{ p: 0 }}>
                <Typography variant="body1">Work Authorizations</Typography>
                <ExpandMore
                  expand={expanded.workAuthorization}
                  onClick={() => handleExpandClick("workAuthorization")}
                  aria-expanded={expanded.workAuthorization}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
                </ExpandMore>
              </CardActions>
              <Collapse
                in={expanded.workAuthorization}
                timeout="auto"
                unmountOnExit
              >
                <CardContent>
                  <Stack direction="column">
                    <Typography paragraph>
                      Visa Title: {profile.workAuthorization?.kind || "N/A"}
                    </Typography>
                    {profile.workAuthorization?.title && (
                      <Typography paragraph>
                        Title: {profile.workAuthorization?.title}
                      </Typography>
                    )}
                    <Typography paragraph>
                      Start:{" "}
                      {new Date(
                        profile.workAuthorization.start
                      ).toLocaleDateString()}
                    </Typography>
                    <Typography>
                      End:{" "}
                      {new Date(
                        profile.workAuthorization.end
                      ).toLocaleDateString()}
                    </Typography>
                    <Typography>
                      File:{" "}
                      <PreviewFile
                        file={profile.workAuthorization?.proof}
                        hrPreview={true}
                      />
                    </Typography>
                  </Stack>
                </CardContent>
              </Collapse>
            </Box>
          </>
        )}
        <Divider />

        {/* reference */}
        <Box>
          <CardActions disableSpacing sx={{ p: 0 }}>
            <Typography variant="body1">Reference</Typography>
            <ExpandMore
              expand={expanded.reference}
              onClick={() => handleExpandClick("reference")}
              aria-expanded={expanded.reference}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </CardActions>
          <Collapse in={expanded.reference} timeout="auto" unmountOnExit>
            <CardContent>
              <Stack direction="column">
                <Typography paragraph>
                  First Name: {profile.reference?.fname}
                </Typography>
                <Typography paragraph>
                  Middle Name: {profile.reference?.mname}
                </Typography>
                <Typography paragraph>
                  Last Name: {profile.reference?.lname}
                </Typography>
                <Typography paragraph>
                  Phone Number: {profile.reference?.phone}
                </Typography>
                <Typography paragraph>
                  Email Address: {profile.reference?.email}
                </Typography>
                <Typography paragraph>
                  Relationship: {profile.reference?.relationship}
                </Typography>
              </Stack>
            </CardContent>
          </Collapse>
        </Box>

        {/* emergency contacts */}
        <Divider />
        <Box>
          <CardActions disableSpacing sx={{ p: 0 }}>
            <Typography variant="body1">Emergency Contacts</Typography>
            <ExpandMore
              expand={expanded.emergencyContacts}
              onClick={() => handleExpandClick("emergencyContacts")}
              aria-expanded={expanded.emergencyContacts}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </CardActions>
          <Collapse
            in={expanded.emergencyContacts}
            timeout="auto"
            unmountOnExit
          >
            {profile.emergencyContacts.map((contact, idx) => {
              return (
                <CardContent key={contact._id}>
                  <Stack direction="column">
                    <Typography paragraph>
                      First Name: {contact.fname}
                    </Typography>
                    <Typography paragraph>
                      Middle Name: {contact.mname}
                    </Typography>
                    <Typography paragraph>
                      Last Name: {contact.lname}
                    </Typography>
                    <Typography paragraph>
                      Phone Number: {contact.phone}
                    </Typography>
                    <Typography paragraph>
                      Email Address: {contact.email}
                    </Typography>
                    <Typography paragraph>
                      Relationship: {contact.relationship}
                    </Typography>
                  </Stack>
                </CardContent>
              );
            })}
          </Collapse>
        </Box>
      </CardContent>
    </>
  );
};

export default ProfielDetail;
