import React, { useState, useEffect } from "react";
// NOTE: Ensure you have installed these dependencies: npm install react-leaflet leaflet
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const API = import.meta.env.VITE_API_URL;

// Fix for default Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map clicks
function LocationMarker({ setLocation }) {
  useMapEvents({
    click(e) {
      setLocation({ latitude: e.latlng.lat, longitude: e.latlng.lng });
    },
  });
  return null;
}

// Component to update map view when location changes (e.g. via GPS button)
function MapViewUpdater({ location }) {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.flyTo([location.latitude, location.longitude], 16);
    }
  }, [location, map]);
  return null;
}

function GrievanceForm() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");
  const [department, setdept] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [code, setcode] = useState("");
  const [address, setadd] = useState("");
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [showDuplicateMessage, setShowDuplicateMessage] = useState(false);
  const [grievances, setGrievances] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  // Default center (e.g., Center of India, or a default city like New Delhi)
  // You can adjust this to your specific region
  const defaultCenter = [20.5937, 78.9629]; 
  const defaultZoom = 5;

  useEffect(() => {
    // --- KEY FEATURE: Auto-fill logic from LocalStorage ---
    // Checks if a user is logged in and pre-fills their details
    const storedUser = localStorage.getItem("citizen");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        // Autofill mobile if available
        if (user.phone) setMobile(user.phone);
        // Autofill name if available
        if (user.name) setName(user.name);
      } catch (err) {
        console.error("Error parsing stored user data:", err);
      }
    }

    const fetchGrievances = async () => {
      try {
        const res = await fetch(`${API}/api/admin-dashboard/grievances`);
        if (res.ok) {
          const data = await res.json();
          setGrievances(data);
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
      setShowDuplicateMessage(false);
    }
  };

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setcode(newCode);
    checkDuplicateGrievance(newCode, department);
  };

  const handleDepartmentChange = (e) => {
    const newDepartment = e.target.value;
    setdept(newDepartment);
    checkDuplicateGrievance(code, newDepartment);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const processFiles = (files) => {
    if (files.length + images.length > 5) {
      alert("You can upload a maximum of 5 images");
      return;
    }
    setImages([...images, ...files]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    if (files.length > 0) {
      processFiles(files);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const getLocation = () => {
    setLoadingLocation(true);
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoadingLocation(false);
      },
      (error) => {
        setLocationError("Unable to retrieve your location. Please enable location services.");
        setLoadingLocation(false);
      }
    );
  };

  const handleSubmit = async () => {
    if (!name || !mobile || !message || !department) {
      alert("Please fill in all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("mobile", mobile);
    formData.append("message", message);
    formData.append("department", department);
    formData.append("code", code);
    formData.append("address", address);
    
    if (location) {
      formData.append("latitude", location.latitude);
      formData.append("longitude", location.longitude);
    }

    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const response = await fetch(`${API}/api/grievance/submit`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setTrackingId(data.trackingId);
        
        // Reset form logic
        const storedUser = localStorage.getItem("citizen");
        // If not logged in, clear personal details. If logged in, keep them.
        if (!storedUser) {
           setName("");
           setMobile("");
        }
        
        setMessage("");
        setdept("");
        setcode("");
        setadd("");
        setImages([]);
        setLocation(null);
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
      <div className="w-full max-w-2xl mx-auto space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Submit a Grievance</h2>
          <p className="text-gray-500 text-sm mt-1">Fill out the form below to report an issue</p>
        </div>

        {showDuplicateMessage && (
          <div className="p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-700 rounded-r shadow-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Potential Duplicate:</span>
            </div>
            <p className="mt-1 text-sm ml-7">Similar grievances have been reported in this area for this department.</p>
          </div>
        )}
        
        {/* Personal Details Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Personal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                placeholder="Full Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Mobile Number *</label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                pattern="[0-9]{10}"
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                placeholder="9876543210"
              />
            </div>
          </div>
        </div>

        {/* Issue Details Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Issue Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Department *</label>
              <select
                name="department"
                value={department}
                onChange={handleDepartmentChange}
                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
              >
                <option value="">Select Department</option>
                <option value="Water">Water Supply</option>
                <option value="Electricity">Electricity</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Roads">Roads & Transport</option>
                <option value="Sanitation">Sanitation</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Area Code</label>
              <input
                type="text"
                value={code}
                onChange={handleCodeChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                placeholder="e.g. 302001"
              />
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-600 mb-1">Address (Optional)</label>
             <input
              type="text"
              value={address}
              onChange={(e) => setadd(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
              placeholder="Street, Landmark, City"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Description *</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
              placeholder="Please describe the issue in detail..."
            />
          </div>
        </div>

        {/* Modular Image Upload Section */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-600">Evidence (Images)</label>
          
          <div 
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              isDragging 
                ? "border-blue-500 bg-blue-50" 
                : "border-gray-300 bg-gray-50 hover:bg-gray-100"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
             <div className="flex flex-col items-center justify-center cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <svg className="w-10 h-10 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <p className="text-sm text-gray-600 font-medium">Click to upload or drag & drop</p>
                <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (max. 5)</p>
             </div>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              {images.map((image, index) => (
                <div key={index} className="group relative rounded-lg overflow-hidden shadow-sm aspect-square border border-gray-200">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="text-white opacity-0 group-hover:opacity-100 bg-red-500 p-1.5 rounded-full hover:bg-red-600 transition-all transform scale-90 group-hover:scale-100"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Interactive Map Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
             <label className="block text-sm font-medium text-gray-600">Location Pin</label>
             <div className="flex gap-2 text-xs">
                {location && (
                  <button 
                    type="button" 
                    onClick={() => setLocation(null)}
                    className="text-red-500 hover:text-red-700 flex items-center transition-colors"
                  >
                    Clear Pin
                  </button>
                )}
                <span className="text-gray-400">|</span>
                <span className="text-gray-500">Click map to drop pin</span>
             </div>
          </div>
          
          <div className="relative rounded-xl overflow-hidden border border-gray-300 h-80 bg-gray-100 shadow-md group z-0">
             <MapContainer 
               center={defaultCenter} 
               zoom={defaultZoom} 
               style={{ height: '100%', width: '100%' }}
               scrollWheelZoom={true}
             >
               <TileLayer
                 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
               />
               <LocationMarker setLocation={setLocation} />
               <MapViewUpdater location={location} />
               {location && <Marker position={[location.latitude, location.longitude]} />}
             </MapContainer>

             {/* Map Controls Overlay */}
             <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-2 z-[1000] pointer-events-none">
                {/* Coordinates Badge */}
                {location ? (
                  <div className="bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm border border-gray-200 text-xs font-mono text-gray-700 mb-2">
                    {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                  </div>
                ) : (
                  <div className="bg-black/60 backdrop-blur px-3 py-1 rounded-full text-xs text-white mb-2">
                    Click anywhere on map to select location
                  </div>
                )}

                {/* GPS Button */}
                <button
                  type="button"
                  onClick={getLocation}
                  disabled={loadingLocation}
                  className={`pointer-events-auto flex items-center gap-2 px-5 py-2.5 rounded-full font-medium shadow-md transition-all transform hover:scale-105 active:scale-95 ${
                    location 
                      ? "bg-white text-gray-800 hover:bg-gray-50 border border-gray-200" 
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  } ${loadingLocation ? "opacity-75 cursor-wait" : ""}`}
                >
                   {loadingLocation ? (
                     <>
                       <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                       <span>Locating...</span>
                     </>
                   ) : (
                     <>
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                       <span>{location ? "Update via GPS" : "Pin My Current Location"}</span>
                     </>
                   )}
                </button>
             </div>
          </div>
          
          {locationError && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
               <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
               {locationError}
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-4 px-8 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transform hover:-translate-y-0.5"
        >
          Submit Grievance
        </button>
      </div>

      {trackingId && (
        <div className="mt-6 p-6 bg-green-50 border border-green-200 text-green-900 rounded-xl max-w-2xl mx-auto shadow-sm text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Grievance Submitted!</h3>
          <p className="mb-4">Your complaint has been registered successfully.</p>
          <div className="bg-white inline-block px-6 py-3 rounded-lg border border-green-200 shadow-sm">
             <p className="text-xs text-green-600 uppercase font-semibold tracking-wider">Tracking ID</p>
             <p className="text-2xl font-mono font-bold text-green-800">{trackingId}</p>
          </div>
          <p className="mt-4 text-sm opacity-80">Please save this ID to track status updates.</p>
        </div>
      )}
    </>
  );
}

export default GrievanceForm;