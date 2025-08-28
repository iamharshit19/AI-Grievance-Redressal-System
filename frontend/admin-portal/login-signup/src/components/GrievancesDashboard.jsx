import GrievanceCard from './GrievanceCard';
import ResolutionTimeline from './ResolutionTimeline';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GrievanceDetails from './GrievanceDetail'; 
const API = import.meta.env.VITE_API_URL;
const GrievancesDashboard = () => {
  const [grievances, setGrievances] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [selectedGrievance, setSelectedGrievance] = useState(null); 
  const fetchGrievances = async () => {
    try {
      const res = await axios.get(`${API}/api/admin-dashboard/grievances`);
      console.log("Fetched grievances:", res.data); 
      setGrievances(res.data);
    } catch (err) {
      console.error('Error fetching grievances:', err);
    }
   
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API}/api/admin-dashboard/stats`);
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    fetchGrievances();
    fetchStats();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`${API}/api/admin-dashboard/grievances/${id}/status`, { status: newStatus });
      setGrievances((prev) =>
        prev.map((g) => (g._id === id ? { ...g, status: newStatus } : g))
      );
      fetchStats();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row p-6 gap-6 bg-gray-100 min-h-screen">
    
      <div className="flex-1 space-y-6">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 shadow rounded text-center">
            <h4 className="text-gray-700 font-semibold">Total</h4>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-yellow-100 p-4 shadow rounded text-center">
            <h4 className="text-gray-700 font-semibold">Pending</h4>
            <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
          </div>
          <div className="bg-blue-100 p-4 shadow rounded text-center">
            <h4 className="text-gray-700 font-semibold">In Progress</h4>
            <p className="text-2xl font-bold text-blue-700">{stats.inProgress}</p>
          </div>
          <div className="bg-green-100 p-4 shadow rounded text-center">
            <h4 className="text-gray-700 font-semibold">Resolved</h4>
            <p className="text-2xl font-bold text-green-700">{stats.resolved}</p>
          </div>
        </div>

        {grievances.map((g) => (
  <div onClick={() => setSelectedGrievance(g)} key={g._id}>
    <GrievanceCard data={g} onStatusChange={handleStatusChange} />
  </div>
))}

      </div>
      {selectedGrievance && (
  <GrievanceDetails
    grievance={selectedGrievance}
    onClose={() => setSelectedGrievance(null)}
  />
)}

     
    </div>
  );
};

export default GrievancesDashboard;
