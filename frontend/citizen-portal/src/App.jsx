import React from "react";
import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import logo from "./assets/logo.png"; // Make sure your logo is here

import Home from "./pages/Home";
import SubmitGrievance from "./pages/SubmitGrievance";
import TrackGrievance from "./pages/TrackGrievance";
import Statistics from "./pages/Statistics";
import Chatbot from "./pages/Chatbot";
import Announcements from "./pages/Announcements";
import Login from "./pages/Login";

function App() {
  const location = useLocation();

  
  const navClass = ({ isActive }) =>
    `px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
        : "text-gray-600 hover:bg-gray-100 hover:text-blue-700"
    }`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      
      {/* HEADER: White with subtle shadow */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3 cursor-pointer">
            {/* Replace with your logo image path */}
            <img src={logo} alt="Samadhan Logo" className="h-10 w-auto object-contain" />
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-none">SAMADHAN</h1>
              <p className="text-xs text-blue-600 font-medium tracking-wide">We are listening..</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex gap-1 md:gap-2">
            <NavLink to="/home" className={navClass}>Home</NavLink>
            <NavLink to="/track" className={navClass}>Track</NavLink>
            <NavLink to="/announcement" className={navClass}>Updates</NavLink>
            <NavLink to="/statistics" className={navClass}>Stats</NavLink>
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT: With smooth page transitions */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/submit" element={<SubmitGrievance />} />
            <Route path="/track" element={<TrackGrievance />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/announcement" element={<Announcements />} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* FOOTER: Minimalist */}
      <footer className="bg-white border-t border-gray-200 py-8 ">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
          <p className="mb-2">© 2025 Samadhan • Unified Civic Grievance Redressal System</p>
          <div className="flex justify-center gap-4 text-gray-400">
            <a href="#" className="hover:text-blue-600 transition">Privacy</a>
            <span>•</span>
            <a href="#" className="hover:text-blue-600 transition">Terms</a>
            <span>•</span>
            <a href="#" className="hover:text-blue-600 transition">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;