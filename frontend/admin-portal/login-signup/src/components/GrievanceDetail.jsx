import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ResolutionTimeline from './ResolutionTimeline';

const GrievanceDetails = ({ grievance, onClose }) => {
  if (!grievance) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start p-10 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-black">×</button>
        <h2 className="text-xl font-bold mb-4">Grievance Details</h2>

        <div className="space-y-2 text-sm text-gray-700">
          <p><strong>Name:</strong> {grievance.name}</p>
          <p><strong>Email:</strong> {grievance.email}</p>
          <p><strong>Department:</strong> {grievance.department}</p>
          <p><strong>Message:</strong> {grievance.message}</p>
          <p><strong>Address:</strong> {grievance.address}</p>
          <p><strong>Status:</strong> {grievance.status}</p>
          <p><strong>Tracking ID:</strong> {grievance.trackingId}</p>
          <p><strong>Created At:</strong> {new Date(grievance.createdAt).toLocaleString()}</p>
        </div>

        
      </div>
    </div>
  );
};

export default GrievanceDetails;
