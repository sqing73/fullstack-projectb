'use client'
import React from "react";
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
import { useSelector, useDispatch } from "react-redux";
// import { fetchRegistrations } from "@/store/reducers/registration";
import RegistrationGenerate from "./RegistrationGenerate";
import { useRouter } from "next/navigation";
import { fetchProfiles, profileActions } from "@/store/reducers/profile";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #1976d2",
  p: 4,
};

const OnboardContent = () => {
  const profiles = useSelector((state) => state.profile.profiles);
  const status = useSelector((state) => state.registration.status);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [fetched, setFetched] = React.useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const force_request = true; // DEBUG
  React.useEffect(() => {
    if (force_request || (!fetched && profiles.length === 0)) {
      dispatch(fetchProfiles());
    }
    return () => setFetched(true);
  }, []);

  if (status !== "idle") {
    return <Typography>Loading...</Typography>;
  }

  const handleClick = (id) => {
    return () => {
      console.log("redirect to ", id);
      router.push(`/hr/application/${id}`)
    };
  };
  return (
    <>
      {/* generate new token modal */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
        keepMounted
      >
        <Fade in={open}>
          <Box sx={style}>
            <RegistrationGenerate setRegistrationGenerateOpen={setOpen} />
          </Box>
        </Fade>
      </Modal>

      {profiles.length === 0 && <Typography>No profile found</Typography>}

      {profiles.length > 0 && (
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell align="right">Employee Name</TableCell>
                <TableCell align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {profiles.map((profile) => (
                <TableRow
                  key={profile._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  onClick={handleClick(profile._id)}
                >
                  <TableCell component="th" scope="row">
                    {profile.email}
                  </TableCell>
                  <TableCell align="right">
                    {profile.name.first} {profile.name.last}
                  </TableCell>
                  <TableCell align="right">
                    {profile.applicationStatus}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default OnboardContent;
