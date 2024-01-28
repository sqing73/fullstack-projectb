"use client";
import React, { useState, useEffect } from 'react';
import { EMPLOYEE_API } from '../../../utils/api';
import VisaStatus from './components/VisaStatus';
import PreviewFile from '@/components/PreviewFile'; 
import SubmitFile from '@/components/SubmitFile'; 

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

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      <VisaStatus visaStatus={visaData.visaStatus} visaCurrStep={visaData.visaCurrStep} />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
        <PreviewFile file="template1.pdf">Empty Template</PreviewFile>
        <PreviewFile file="template2.pdf">Sample Template</PreviewFile>
      </div>

      <div style={{ marginTop: '20px' }}>
        <SubmitFile /> 
      </div>
    </div>
  );
};

export default VisaStatusPage;
