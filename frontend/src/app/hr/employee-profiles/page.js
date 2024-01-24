"use client";
import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useSelector, useDispatch } from "react-redux";
import { fetchProfiles, profileActions } from "@/store/reducers/profile";
import ProfielDetail from "./components/ProfileDetail";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
};

const Page = () => {
  const profiles = useSelector((state) => state.profile.profiles);
  const error = useSelector((state) => state.profile.error.unknonw);
  const status = useSelector((state) => state.profile.status);
  const [searchedProfiles, setSearchedProfiles] = React.useState([]);
  const dispatch = useDispatch();
  const [fetched, setFetched] = useState(false);
  const [selectedProfle, setSelectedProfile] = useState({});
  const [openDetail, setOpenDetail] = React.useState(false);

  const nameToProfileOptions = React.useMemo(() => {
    const res = [];
    profiles.forEach((profile) => {
      let searchName = profile.name?.preferred
        ? `${profile.fullName}, ${profile.name.preferred}`
        : profile.fullName;
      res.push(searchName);
    });
    return res;
  }, [profiles]);

  React.useEffect(() => {
    if (!fetched && profiles.length === 0) {
      dispatch(fetchProfiles());
    }
    return () => setFetched(true);
  }, [dispatch, fetched, profiles]);

  const handleDetailClose = () => setOpenDetail(false);

  const handleDetailOpen = (profile) => {
    setSelectedProfile(profile);
    setOpenDetail(true);
  };

  const errorAlert = error && (
    <Alert
      severity="error"
      onClose={() => {
        dispatch(profileActions.unknownErrorRead());
      }}
    >
      {error}
    </Alert>
  );

  const handleSearchInputDone = (e) => {
    if (e.key === "Enter") {
      const transformedInput = e.target.value.toLowerCase();
      const searchResult = profiles.filter((profile) => {
        const transformedFullName = profile.fullName.toLowerCase();
        return (
          transformedFullName.includes(transformedInput) ||
          transformedInput.includes(transformedFullName)
        );
      });
      setSearchedProfiles(() => searchResult);
    }
  };

  const profilesDisplayed =
    searchedProfiles.length > 0 ? searchedProfiles : profiles;

  return (
    <>
      {errorAlert}
      {/* employee profile modal */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openDetail}
        onClose={handleDetailClose}
        closeAfterTransition
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openDetail}>
          <Card sx={style}>
            {/* <RegistrationGenerate setRegistrationGenerateOpen={setOpen} /> */}
            <ProfielDetail profile={selectedProfle} />
          </Card>
        </Fade>
      </Modal>

      <Box sx={{ width: "100%", p: 15 }}>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={nameToProfileOptions}
          sx={{ width: 300, mb: 3 }}
          renderInput={(params) => (
            <TextField
              {...params}
              onKeyDown={handleSearchInputDone}
              label="name"
            />
          )}
        />
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">SSN</TableCell>
                <TableCell align="right">Authorization</TableCell>
                <TableCell align="right">Phone Number</TableCell>
                <TableCell align="right">Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {profilesDisplayed.map((profile) => (
                <TableRow
                  key={profile._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Button
                      sx={{ p: 0 }}
                      onClick={() => handleDetailOpen(profile)}
                    >
                      {profile.fullName}
                    </Button>
                  </TableCell>
                  <TableCell align="right">
                    {profile.personalInfo.ssn}
                  </TableCell>
                  <TableCell align="right">
                    {profile.residencyStatus?.isPermanentResidentOrCitizen
                      ? profile.residencyStatus.status
                      : profile.workAuthorization?.title || "N/A"}
                  </TableCell>
                  <TableCell align="right">
                    {profile.phoneNumbers.cell}
                  </TableCell>
                  <TableCell align="right">{profile.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {status !== "idle" && <Typography>Loading...</Typography>}
        {fetched && status === "idle" && profiles.length === 0 && (
          <Typography>No profiles found</Typography>
        )}
      </Box>
    </>
  );
};

export default Page;
