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
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import { useSelector, useDispatch } from "react-redux";
import { fetchRegistrations } from "@/store/reducers/registration";
import RegistrationGenerate from "./RegistrationGenerate";

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

const RegistrationContent = () => {
  const registrations = useSelector(
    (state) => state.registration.registrations
  );
  const status = useSelector((state) => state.registration.status);
  const dispatch = useDispatch();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [fetched, setFetched] = React.useState(false);

  React.useEffect(() => {
    if (!fetched) {
      dispatch(fetchRegistrations());
    }

    return () => {
      setFetched(true);
    };
  }, [registrations, dispatch, fetched]);

  if (status !== "idle") {
    return <Typography>Loading...</Typography>;
  }

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

      <Button
        sx={{ ml: "auto", my: 2 }}
        variant="outlined"
        onClick={handleOpen}
      >
        Generate
      </Button>

      {registrations.length === 0 && (
        <Typography>No registrations found</Typography>
      )}

      {registrations.length > 0 && (
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell align="right">Employee</TableCell>
                <TableCell align="right">Link</TableCell>
                <TableCell align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {registrations.map((registration) => (
                <TableRow
                  key={registration._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {registration.email}
                  </TableCell>
                  <TableCell align="right">
                    {registration.employeeName}
                  </TableCell>
                  <TableCell align="right">
                    <Link
                      href={`http://localhost:3000/register/${registration._id}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {`http://localhost:3000/register/${registration._id}`}
                    </Link>
                  </TableCell>
                  <TableCell align="right">
                    {registration.status === "active" ? "Active" : "Complete"}
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

export default RegistrationContent;
