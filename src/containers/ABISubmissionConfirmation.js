import React from 'react';

export default function SubmissionConfirmation() {
  return (
    <div className="p-4" style={{ color: 'white', backgroundColor: 'black', minHeight: '100vh' }}>
      <h1 className="text-2xl font-bold mb-4">Submission Received</h1>
      <p className="text-lg mb-4">We have received your Protocol ABI Submission. After reviewing it, we will let you know if it is approved.</p>
      <p>Thank you for your contribution!</p>
    </div>
  );
}
