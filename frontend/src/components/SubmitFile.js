import React from "react";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { EMPLOYEE_API } from "@/utils/api";

const dotRe = /\.([a-zA-Z]+)$/;

const SubmitFile = ({ image = false, onFileName, onSuccess, onUploadSuccess, stepName, ...props }) => {
  const endpoint = image ? "/assets/userAvatars" : "/assets/userFiles";
  const [submissionError, setSubmissionError] = React.useState(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const filetypes = image ? /jpeg|jpg|png/ : /pdf/;

  const handleFileChange = async (event) => {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const fileName = file.name;
      const match = fileName.match(dotRe);
      const fileType = match ? match[1] : null;

      if (!fileType || !filetypes.test(fileType)) {
        return setSubmissionError(
          image ? "Only accept jpeg, jpg, png files" : "Only accept pdf"
        );
      }

      const formData = new FormData();
      formData.append("file", file);
      setSubmitting(true);

      try {
        const res = await EMPLOYEE_API.post(endpoint, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        onFileName && onFileName(res.data.fileName);
        setSubmissionError(null);
        setSuccess(true);

        // Call the onUploadSuccess callback with fileName and stepName
        onUploadSuccess && onUploadSuccess(fileName, stepName);

        // Call the onSuccess callback if provided
        onSuccess && onSuccess();
      } catch (error) {
        console.log(error);
        setSubmissionError(error.response?.data?.message || "Unknown error");
      }

      setSubmitting(false);
    }
  };

  return (
    <Stack direction="column" {...props} alignItems="center">
      <Button
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
        disabled={submitting}
      >
        {submitting ? "Submitting..." : "Upload file"}
        <input
          type="file"
          name="file"
          encType="multipart/form-data"
          hidden
          onChange={handleFileChange}
        />
      </Button>
      {success && <Typography color="green">File Submitted</Typography>}
      {submissionError && (
        <Typography color="red">{submissionError}</Typography>
      )}
    </Stack>
  );
};

export default SubmitFile;
