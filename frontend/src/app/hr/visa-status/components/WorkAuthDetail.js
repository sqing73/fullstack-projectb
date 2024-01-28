import React from "react";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const WorkAuthDetail = ({ workAuthorizaton }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const startDate = new Date(workAuthorizaton.start);
  const endDate = new Date(workAuthorizaton.end);
  const daysRemaining = Math.ceil(
    (endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <>
      <Button onClick={handleOpen}>{workAuthorizaton.kind}</Button>
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
      >
        <Fade in={open}>
          <Card sx={style}>
            <CardContent>Title: {workAuthorizaton.kind}</CardContent>
            {workAuthorizaton.title && (
              <CardContent>Other Title: {workAuthorizaton.title}</CardContent>
            )}
            <CardContent>Start: {startDate.toLocaleDateString()}</CardContent>
            <CardContent>End: {endDate.toLocaleDateString()}</CardContent>
            <CardContent>
              Days Remaing:{" "}
              {daysRemaining > 0
                ? `${daysRemaining} days remaining`
                : "expired"}
            </CardContent>
          </Card>
        </Fade>
      </Modal>
    </>
  );
};

export default WorkAuthDetail;
