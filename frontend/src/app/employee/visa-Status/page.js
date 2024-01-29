"use client";
import React, { useState, useEffect } from 'react';
import VisaStatus from './components/VisaStatus';
import PreviewFile from '@/components/PreviewFile'; 
import SubmitFile from '@/components/SubmitFile'; 
import { EMPLOYEE_API } from '../../../utils/api';

const VisaStatusPage = () => {
  const [visaData, setVisaData] = useState({ visaStatus: {}, visaCurrStep: "" });

  useEffect(() => {
    const fetchVisaData = async () => {
      try {
        const response = await EMPLOYEE_API.get('/visaStatus');
        console.log("Fetched visa data:", response.data); 
        setVisaData(response.data);
      } catch (error) {
        console.error('Error fetching visa data', error);
      }
    };

    fetchVisaData();
  }, []);

  const handleFileUploadSuccess = (fileName) => {
    setVisaData(prevState => {
      const updatedVisaStatus = { ...prevState.visaStatus };
      const currentStep = prevState.visaCurrStep;

      if (updatedVisaStatus[currentStep]) {
        updatedVisaStatus[currentStep] = {
          ...updatedVisaStatus[currentStep],
          step: {
            ...updatedVisaStatus[currentStep].step,
            status: "pending",
            file: fileName
          }
        };
      } else {
        // Initialize the step if it doesn't exist
        updatedVisaStatus[currentStep] = {
          step: {
            status: "pending",
            file: fileName,
            feedback: null
          }
        };
      }

      return {
        ...prevState,
        visaStatus: updatedVisaStatus
      };
    });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      <VisaStatus visaStatus={visaData.visaStatus} visaCurrStep={visaData.visaCurrStep} />

      <div style={{ marginTop: '20px' }}>
        <SubmitFile onUploadSuccess={handleFileUploadSuccess} stepName={visaData.visaCurrStep} />
      </div>
    </div>
  );
};

export default VisaStatusPage;


