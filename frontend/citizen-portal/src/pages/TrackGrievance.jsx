import { useState } from "react";
const API = import.meta.env.VITE_API_URL;


function TrackGrievance() {
  const [inputId, setInputId] = useState("");
  const [grievance, setGrievance] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setError("");
    setGrievance(null);

    try {
      const response = await fetch(`${API}/api/grievance/track/${inputId}`);
      const data = await response.json();

      if (response.ok) {
        setGrievance(data);
      } else {
        setError(data.error || "Grievance not found");
      }
    } catch (err) {
      setError("An error occurred while fetching the grievance");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 text-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Track Your Grievance</h2>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <input
          placeholder="Enter Tracking ID"
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg text-black"
        />
        <button
          onClick={handleSearch}
          className="py-3 px-6 bg-gradient-to-r from-[#19376D] to-[#0B2447] text-white font-semibold rounded-lg hover:from-[#FFA41B] hover:to-[#FF8C00] transition duration-300"
        >
          Search
        </button>
      </div>
<div className="w-full ">
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-800 rounded">{error}</div>
      )}

      {grievance && (
        <div className="mt-6 p-4 bg-green-100 text-black rounded w-full">
          <p><strong>Name:</strong> {grievance.name}</p>
          <p><strong>Email:</strong> {grievance.email}</p>
          <p><strong>Area Code:</strong> {grievance.code}</p>
          <p><strong>Address:</strong> {grievance.address}</p>
          <p><strong>Status:</strong>{grievance.status}</p>
          <p><strong>Department:</strong>{grievance.department}</p>
          <p><strong>Message:</strong> {grievance.message}</p>
          <p><strong>Submitted At:</strong> {new Date(grievance.createdAt).toLocaleString()}</p>
          <p><strong>Tracking ID:</strong> {grievance.trackingId}</p>
         
        </div>
      )}
      </div>
    </div>
  )
}

export default TrackGrievance;
