import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import './index.css'
import Dashboard from "./components/Dashboard";
import { useState } from "react";
import GrievanceDashboard from "./components/GrievancesDashboard";
import Announcements from "./components/Announcements";
function App() {
  const[isAuthenticated, setAuthenticated] = useState(false);
  
  return (
    <> 
       <Routes>
        <Route path="/" element={<Signup />} />
        <Route
        path="/admin/login"
        element={<Login setAuthenticated={setAuthenticated} />} 
      />
      <Route path="/admin/signup" element={<Signup />} />
     <Route path="/admin/dashboard" element={<Dashboard/>}/>
     <Route path="/admin/dashboard/Grievances" element={<GrievanceDashboard/>}/>
     <Route path="/admin/dashboard/announcements" element={<Announcements/>}/>
     </Routes>
  
    </>
  );
}
export default App;