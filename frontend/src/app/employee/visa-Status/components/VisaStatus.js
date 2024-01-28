import React from 'react';

const VisaStatus = ({ visaStatus, visaCurrStep }) => {
    return (
        <div>
            <h2>Current Visa Step: {visaCurrStep}</h2>
            {Object.entries(visaStatus).map(([key, value]) => (
                <div key={key}>
                    <h3>{key}</h3>
                    <p>Status: {value?.step?.status || 'N/A'}</p>
                    <p>Feedback: {value?.step?.feedback || 'N/A'}</p>
                    <p>Document: {value?.step?.file || 'No file'}</p>
                </div>
            ))}
        </div>
    );
};

export default VisaStatus;
