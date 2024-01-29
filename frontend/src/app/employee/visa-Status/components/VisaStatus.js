import React from 'react';

const VisaStatus = ({ visaStatus, visaCurrStep }) => {
    const highlightedSteps = ['OPTreceipt', 'OPTead', 'I983', 'I20']; 

    return (
        <div style={{ textAlign: 'center', width: '100%' }}>
            <h2 style={{ 
                fontSize: highlightedSteps.includes(visaCurrStep) ? '1.5em' : '1em',
                display: 'inline-block', 
                padding: '5px' 
            }}>
                Current Visa Step: {visaCurrStep}
            </h2>
            <div style={{ paddingTop: '20px' }}>
                {Object.entries(visaStatus).map(([key, value]) => (
                    <div key={key} style={{
                        display: 'inline-block', 
                        margin: '10px', 
                        padding: '10px', 
                        border: '1px solid #ddd', 
                        fontSize: highlightedSteps.includes(key) ? '1.2em' : '1em'
                    }}>
                        <h3>{key}</h3>
                        <p>Status: {value?.step?.status || 'N/A'}</p>
                        <p>Feedback: {value?.step?.feedback || 'N/A'}</p>
                        <p>Document: {value?.step?.file || 'No file'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VisaStatus;