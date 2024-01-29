import React from 'react';

const VisaStatus = ({ visaStatus, visaCurrStep }) => {
    const highlightedSteps = ['OPTreceipt', 'OPTead', 'I983', 'I20'];

    const getMessage = (step) => {
        const status = step?.step?.status || 'N/A';
        const feedback = step?.step?.feedback || 'N/A';

        switch (step.key) {
            case 'OPTreceipt':
                if (status === 'pending') return "Waiting for HR to approve your OPT Receipt";
                if (status === 'approved') return "Please upload a copy of your OPT EAD";
                if (status === 'rejected') return `Feedback: ${feedback}`;
                break;
            case 'OPTead':
                if (status === 'pending') return "Waiting for HR to approve your OPT EAD";
                if (status === 'approved') return "Please download and fill out the I-983 form";
                if (status === 'rejected') return `Feedback: ${feedback}`;
                break;
            case 'I983':
                if (status === 'pending') return "Waiting for HR to approve and sign your I-983";
                if (status === 'approved') return "Please send the I-983 along with all necessary documents to your school and upload the new I-20";
                if (status === 'rejected') return `Feedback: ${feedback}`;
                break;
            case 'I20':
                if (status === 'pending') return "Waiting for HR to approve your I-20";
                if (status === 'approved') return "All documents have been approved";
                if (status === 'rejected') return `Feedback: ${feedback}`;
                break;
            default:
                return 'N/A';
        }
    };

    return (
        <div style={{ textAlign: 'center', width: '100%' }}>
            <h2 style={{ fontSize: highlightedSteps.includes(visaCurrStep) ? '1.5em' : '1em', display: 'inline-block', padding: '5px' }}>
                Current Visa Step: {visaCurrStep}
            </h2>
            <div style={{ paddingTop: '20px' }}>
                {Object.entries(visaStatus).map(([key, value]) => (
                    <div key={key} style={{ display: 'inline-block', margin: '10px', padding: '10px', border: '1px solid #ddd', fontSize: highlightedSteps.includes(key) ? '1.2em' : '1em' }}>
                        <h3>{key}</h3>
                        <p>Status: {value?.step?.status || 'N/A'}</p>
                        <p>Message: {getMessage({ key, ...value })}</p>
                        <p>Document: {value?.step?.file || 'No file'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VisaStatus;
