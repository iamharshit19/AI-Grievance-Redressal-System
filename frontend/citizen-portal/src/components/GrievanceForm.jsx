import React, { useState, useEffect } from "react";
const API = import.meta.env.VITE_API_URL;



function GrievanceForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [department, setdept] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [code, setcode] = useState("");
  const [address, setadd] = useState("");
  const [showDuplicateMessage, setShowDuplicateMessage] = useState(false);
  const [grievances, setGrievances] = useState([]);

  useEffect(() => {
    const fetchGrievances = async () => {
      try {
        const res = await fetch(`${API}/api/admin-dashboard/grievances`);
        if (res.ok) {
          const data = await res.json();
          setGrievances(data);
        } else {
          console.error("Failed to fetch existing grievances");
        }
      } catch (error) {
        console.error("Error fetching existing grievances:", error);
      }
    };

    fetchGrievances();
  }, []);

 
  const checkDuplicateGrievance = (currentCode, currentDepartment) => {
    if (currentCode && currentDepartment) {
      const isDuplicate = grievances.some(
        (g) => g.code === currentCode && g.department === currentDepartment
      );
      setShowDuplicateMessage(isDuplicate);
    } else {
      setShowDuplicateMessage(false); // Hide message if code or department is cleared
    }
  };

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setcode(newCode);
    checkDuplicateGrievance(newCode, department); // Check on code change
  };

  const handleDepartmentChange = (e) => {
    const newDepartment = e.target.value;
    setdept(newDepartment);
    checkDuplicateGrievance(code, newDepartment); // Check on department change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const grievance = { name, email, message, department, code, address };

    try {
      const response = await fetch(`${API}/api/grievance/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(grievance),
      });

      const data = await response.json();

      if (response.ok) {
        setTrackingId(data.trackingId);
        setName("");
        setEmail("");
        setMessage("");
        setdept("");
        setcode("");
        setadd("");
        setShowDuplicateMessage(false); 
      } else {
        alert("Failed: " + data.error);
      }
    } catch (error) {
      console.error("Error submitting grievance:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-6 bg-white p-6 rounded-lg shadow-md">
        {showDuplicateMessage && (
          <div className="mb-4 p-3 bg-yellow-100 text-yellow-700 rounded">
            ⚠️ There are multiple grievances launched from this area regarding this department.
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-half mr-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Area Code"
            value={code}
            onChange={handleCodeChange} 
            className="w-half p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <input
          type="text"
          placeholder="Your Address"
          value={address}
          onChange={(e) => setadd(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <div className="flex flex-col w-full">
            <select
              name="department"
              value={department}
              onChange={handleDepartmentChange} 
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Choose department</option>
              <option value="Water">Water</option>
              <option value="Electricity">Electricity</option>
              <option value="Agriculture">Agriculture</option>
            </select>
          </div>
        </div>

        <textarea
          placeholder="Describe your grievance"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={8}
          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          className="w-full py-3 px-6 bg-gradient-to-r from-[#19376D] to-[#0B2447] text-white font-semibold rounded-lg hover:from-[#FFA41B] hover:to-[#FF8C00] transition duration-300"
        >
          Submit
        </button>
      </form>
      {trackingId && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded">
          <p>✅ Grievance submitted successfully!</p>
          <p>
            <strong>Your Tracking ID:</strong> {trackingId}
          </p>
          <p>Save this ID to track your grievance later.</p>
        </div>
      )}
    </>
  );
}

export default GrievanceForm;