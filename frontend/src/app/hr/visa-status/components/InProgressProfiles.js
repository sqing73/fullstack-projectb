import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import WorkAuthDetail from "./WorkAuthDetail";
import { useSelector, useDispatch } from "react-redux";
import { Paper, TextField, Typography } from "@mui/material";
import {
  fetchProfiles,
  profileActions,
  updateVisaStatus,
} from "@/store/reducers/profile";
import PreviewFile from "@/components/PreviewFile";

const InProgressProfiles = () => {
  const profiles = useSelector((state) => state.profile.profiles);
  const dispatch = useDispatch();
  const status = useSelector((state) => state.profile.status);
  const [inputsMap, setInputsMap] = useState({});

  const [fetched, setFetched] = React.useState(false);

  React.useEffect(() => {
    if (!fetched && profiles.length === 0) {
      dispatch(fetchProfiles());
    }
    return () => setFetched(true);
  }, [fetched, profiles]);

  React.useEffect(() => {
    const map = {};
    profiles.forEach((profile) => {
      map[profile._id] = false;
    });
    setInputsMap(() => map);
  }, [profiles]);

  const profilesInprogress = React.useMemo(() => {
    return profiles.filter(
      (profile) =>
        profile.applicationStatus === "approved" &&
        profile.visaCurrStep !== "none" &&
        profile.visaCurrStep !== "complete"
    );
  }, [profiles]);

  const handleActionClick = async (profileId, action) => {
    if (action === "reject") {
      setInputsMap((prev) => ({ ...prev, [profileId]: true }));
    } else if (action === "approve") {
      dispatch(updateVisaStatus({ profileId, action: "approve" }));
    }
  };

  const handleFeedbackKeydown = async (e, profileId) => {
    if (e.key === "Enter") {
      if (!e.target.value) {
        dispatch(profileActions.unknownErrorSet("feedback cannot be empty"));
      } else {
        dispatch(
          updateVisaStatus({
            profileId,
            action: "reject",
            feedback: e.target.value,
          })
        );
      }
    }
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Work Authorization</TableCell>
              <TableCell align="right">Next Step</TableCell>
              <TableCell align="right">Document</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          {status === "loading" && <Typography>loading....</Typography>}
          {status === "idle" && (
            <TableBody>
              {profilesInprogress.map((profile) => {
                let nextStep = "N/A";
                let document = null;
                let actions = false;

                if (!profile.visaStatus[profile.visaCurrStep]) {
                  nextStep = `wait to upload ${profile.visaCurrStep} document`;
                } else {
                  switch (
                    profile.visaStatus[profile.visaCurrStep].step.status
                  ) {
                    case "pending":
                      actions = true;
                      document =
                        profile.visaStatus[profile.visaCurrStep].step.file;
                      nextStep = `wait to review ${profile.visaCurrStep} document`;
                      break;
                    case "rejected":
                      nextStep = `wait to upload new ${profile.visaCurrStep} document`;
                      break;
                  }
                }
                return (
                  <TableRow
                    key={profile._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {profile.fullname}
                    </TableCell>
                    <TableCell align="right">
                      {profile.residencyStatus?.isPermanentResidentOrCitizen &&
                        profile.residencyStatus.status}
                      {profile.residencyStatus &&
                        !profile.residencyStatus
                          .isPermanentResidentOrCitizen && (
                          <WorkAuthDetail
                            workAuthorizaton={profile.workAuthorization}
                          />
                        )}
                    </TableCell>
                    <TableCell align="right">{nextStep}</TableCell>
                    <TableCell align="right">
                      {document && (
                        <PreviewFile file={document} hrPreview={true}>
                          preview
                        </PreviewFile>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {actions && (
                        <>
                          <Button
                            onClick={() =>
                              handleActionClick(profile._id, "approve")
                            }
                          >
                            approve
                          </Button>
                          <Button
                            color="error"
                            onClick={() =>
                              handleActionClick(profile._id, "reject")
                            }
                          >
                            reject
                          </Button>
                          <TextField
                            inputProps={{ sx: { p: 0.2 } }}
                            onKeyDown={(e) =>
                              handleFeedbackKeydown(e, profile._id)
                            }
                            hidden={!inputsMap[profile._id]}
                          ></TextField>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          )}
        </Table>
      </TableContainer>
    </>
  );
};

export default InProgressProfiles;
