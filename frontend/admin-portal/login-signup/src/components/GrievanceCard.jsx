import GrievanceDetails from './GrievanceDetail'; 
import { useState } from 'react';



const GrievanceCard = ({ data, onStatusChange }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  return (
    <div className="bg-white p-4 shadow rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h4 className="font-semibold">{data.title}</h4>
          <p className="text-sm text-gray-600">From: {data.name} - {data.department}</p>
        </div>
        <select
          value={data.status}
          onChange={(e) => onStatusChange(data._id, e.target.value)}
          className="border p-2 rounded"
        >
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Resolved">Resolved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
      <p className="text-sm text-gray-700">{data.address}</p>
      <p className="text-xs text-gray-500">Tracking ID: {data.trackingId}</p>
      <span
        className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${getPriorityColor(
          data.priority
        )}`}
      >
        Priority: {data.priority || 'Not Assigned'}
      </span>
    </div>
  );
};

export default GrievanceCard;
