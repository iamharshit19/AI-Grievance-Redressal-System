import { useState, useEffect } from "react";

// Safe API URL definition
const API = "http://localhost:5000";

export default function TrackGrievance() {
  const [inputId, setInputId] = useState("");
  const [grievance, setGrievance] = useState(null);
  const [error, setError] = useState("");
  
  // New state for user history
  const [myGrievances, setMyGrievances] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [user, setUser] = useState(null);

  // Check login status on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("citizen");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        if (userData.phone) {
          fetchUserGrievances(userData.phone);
        }
      } catch (e) {
        console.error("Auth error", e);
      }
    }
  }, []);

  const fetchUserGrievances = async (mobile) => {
    setLoadingHistory(true);
    try {
      const res = await fetch(`${API}/api/grievance/user/${mobile}`);
      const data = await res.json();
      if (res.ok) {
        setMyGrievances(data.grievanceList || []);
      }
    } catch (err) {
      console.error("Failed to fetch history");
    } finally {
      setLoadingHistory(false);
    }
  };

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

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved": return "bg-green-100 text-green-800 border-green-200";
      case "Rejected": return "bg-red-100 text-red-800 border-red-200";
      case "Processing": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 mb-20">
      
      {/* 1. Main Search Section */}
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 mb-10">
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">Track Your Grievance</h2>
        <p className="text-gray-500 text-center mb-6 text-sm">Enter a specific Tracking ID to see its live status</p>

        <div className="flex flex-col sm:flex-row items-center gap-3 max-w-lg mx-auto">
          <input
            placeholder="e.g. GRV-123456"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            onClick={handleSearch}
            className="w-full sm:w-auto py-3 px-8 rounded-lg font-semibold transition duration-300 bg-blue-600 text-white hover:bg-blue-700 shadow-md"
          >
            Search
          </button>
        </div>

        {/* Search Results */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-700 border border-red-100 rounded-lg text-center animate-pulse">
            {error}
          </div>
        )}

        {grievance && (
          <div className="mt-8 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
              <span className="font-mono font-bold text-gray-600">#{grievance.trackingId}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(grievance.status)}`}>
                {grievance.status}
              </span>
            </div>
            <div className="p-6 bg-white grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Subject</p>
                <p className="text-gray-800 font-medium">{grievance.department}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Submitted On</p>
                <p className="text-gray-800">{new Date(grievance.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Message</p>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  {grievance.message}
                </p>
              </div>
              {grievance.name && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Submitted By</p>
                  <p className="text-gray-800">{grievance.name}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 2. Authenticated User History Section */}
      {user ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-800">My Past Grievances</h3>
              <p className="text-sm text-gray-500">History for +91-{user.phone}</p>
            </div>
            <button 
              onClick={() => fetchUserGrievances(user.phone)}
              className="text-blue-600 text-sm hover:underline flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
              Refresh
            </button>
          </div>

          {loadingHistory ? (
            <div className="text-center py-10 text-gray-500">Loading history...</div>
          ) : myGrievances.length > 0 ? (
            <div className="grid gap-4">
              {myGrievances.map((item) => (
                <div key={item._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-gray-800">{item.department}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="font-mono text-xs text-gray-500">{item.trackingId}</span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-1 max-w-md">{item.message}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                    <button
                      onClick={() => {
                        setInputId(item.trackingId);
                        handleSearch(); // Auto-search this ID to show full details above
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium border border-blue-100 px-3 py-1 rounded-lg hover:bg-blue-50"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500 mb-2">No grievances found for this number.</p>
              <a href="/submit" className="text-blue-600 font-medium hover:underline">Submit your first grievance</a>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-blue-800 font-medium mb-2">Want to see your grievance history?</p>
          <p className="text-sm text-blue-600 mb-4">Log in to view all complaints lodged by your mobile number.</p>
          <a href="/" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition">
            Log In Now
          </a>
        </div>
      )}
    </div>
  );
}