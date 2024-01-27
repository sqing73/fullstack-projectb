"use client";
import React, { useEffect } from "react";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MuiLink from "@mui/material/Link";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { EMPLOYEE_API } from "@/utils/api";

const Link = styled(MuiLink)({
  cursor: "pointer",
  "&:hover": {
    textDecoration: "underline",
  },
});

const dotRe = /\.([a-zA-Z]+)$/;
const imageFile = /jpeg|jpg|png/;

const PreviewFile = ({ file }) => {
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [url, setUrl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    URL.revokeObjectURL(url);
    setOpen(false);
  };

  const match = file.match(dotRe);
  const fileType = match ? match[1] : null;
  const isImage = fileType.match(imageFile);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    border: "2px solid #1976d2",
  };

  useEffect(() => {
    const endpoint = isImage ? "/assets/userAvatars" : "/assets/userFiles";
    setLoading(true);
    EMPLOYEE_API.get(`${endpoint}/${file}`, { responseType: "blob" })
      .then((response) => {
        const blobUrl = URL.createObjectURL(response.data);
        setUrl(() => blobUrl);
        setLoading(() => false);
      })
      .catch((err) => {
        setLoading(() => false);
        const response = err.response;
        if (!response || !response.data) {
          setError(err.message);
        } else {
          response.data.text().then((text) => {
            const jsonData = JSON.parse(text);
            setError(jsonData.message);
          });
        }
      });
  }, []);

  return (
    <>
      <Link onClick={handleOpen}>preview</Link>
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
          <Box
            sx={style}
            width={isImage ? 250 : 900}
            height={isImage ? 250 : 900}
          >
            {error && <Typography>{error}</Typography>}
            {loading && <Typography>Loading...</Typography>}
            {!loading &&
              !error &&
              (isImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  style={{ width: "100%", height: "100%" }}
                  src={url}
                  alt={file}
                />
              ) : (
                <embed
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  type="application/pdf"
                  src={url}
                />
              ))}
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default PreviewFile;
