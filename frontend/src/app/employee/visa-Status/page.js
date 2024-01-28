"use client";
import React, { useState, useEffect } from 'react';
import { EMPLOYEE_API } from '../../../utils/api';
import VisaStatus from './components/VisaStatus';

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
    </div>
  );
};

export default VisaStatusPage;
