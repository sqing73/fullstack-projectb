"use client";
import React, { useState, useEffect } from "react";
import VisaStatus from "./components/VisaStatus";
import PreviewFile from "@/components/PreviewFile";
import SubmitFile from "@/components/SubmitFile";
import { EMPLOYEE_API } from "../../../utils/api";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Alert from "@mui/material/Alert";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Button } from "@mui/material";

const VisaStatusPage = () => {
  const [visaData, setVisaData] = useState({
    visaStatus: {},
    visaCurrStep: "",
  });
  const [error, setError] = useState("");
  // const [selectedStep, setSelectedStep] = useState('');

  useEffect(() => {
    const fetchVisaData = async () => {
      try {
        const response = await EMPLOYEE_API.get("/visaStatus");
        console.log("Fetched visa data:", response.data);
        setVisaData(response.data);
      } catch (error) {
        console.error("Error fetching visa data", error);
      }
    };

    fetchVisaData();
  }, []);

  const handleFileUploadSuccess = async (filename) => {
    if (filename) {
      try {
        const res = await EMPLOYEE_API.put("/visaStatus", { filename });
        setVisaData(() => ({
          visaStatus: res.data.visaStatus,
          visaCurrStep: res.data.visaCurrStep,
        }));
      } catch (err) {
        console.log(err);
        setError(err.message);
      }
    }
  };

  // const handleFileUploadSuccess = (fileName) => {
  //   setVisaData(prevState => {
  //     const updatedVisaStatus = { ...prevState.visaStatus };

  //     if (updatedVisaStatus[selectedStep]) {
  //       updatedVisaStatus[selectedStep] = {
  //         ...updatedVisaStatus[selectedStep],
  //         step: {
  //           ...updatedVisaStatus[selectedStep].step,
  //           status: "pending",
  //           file: fileName
  //         }
  //       };
  //     } else {
  //       updatedVisaStatus[selectedStep] = {
  //         step: {
  //           status: "pending",
  //           file: fileName,
  //           feedback: null
  //         }
  //       };
  //     }

  //     return {
  //       ...prevState,
  //       visaStatus: updatedVisaStatus
  //     };
  //   });
  // };

  // const handleStepChange = (event) => {
  //   setSelectedStep(event.target.value);
  // };

  return (
    <>
      {error && (
        <Alert
          severity="error"
          onClose={() => {
            setError("");
          }}
        >
          {error}
        </Alert>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <VisaStatus
          visaStatus={visaData.visaStatus}
          visaCurrStep={visaData.visaCurrStep}
        />

        <FormControl style={{ margin: "20px", minWidth: 120 }}>
          <InputLabel id="visa-step-select-label">Visa Step</InputLabel>
          {/* <Select
          labelId="visa-step-select-label"
          id="visa-step-select"
          value={selectedStep}
          label="Visa Step"
          onChange={handleStepChange}
        >
          <MenuItem value="OPTreceipt">OPT Receipt</MenuItem>
          <MenuItem value="OPTead">OPT EAD</MenuItem>
          <MenuItem value="I983">I-983</MenuItem>
          <MenuItem value="I20">I-20</MenuItem>
        </Select> */}
        </FormControl>
        {visaData.visaCurrStep !== "complete" &&
          visaData.visaCurrStep !== "none" && (
            <div style={{ marginTop: "20px" }}>
              <SubmitFile onFileUploadSuccess={handleFileUploadSuccess} />
              {/* <SubmitFile onUploadSuccess={handleFileUploadSuccess} stepName={selectedStep} /> */}
            </div>
          )}
      </div>
    </>
  );
};

export default VisaStatusPage;
