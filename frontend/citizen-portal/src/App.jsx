import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import SubmitGrievance from './pages/SubmitGrievance';
import TrackGrievance from './pages/TrackGrievance';
import Statistics from './pages/Statistics';
import Chatbot from './pages/Chatbot';
import Announcements from './pages/Announcements';
import { motion } from 'framer-motion';
import { useState } from 'react';

function App() {
  const location = useLocation();
  const [showLocalForm, setShowLocalForm] = useState(false); 

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`relative flex-grow pb-24 md:pb-32`} 
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B2447]/90 to-black/90 z-10" />

        <div className="relative z-20">
          <div className='bg-gradient-to-r from-[#3a7ec7] to-[#123864] text-center py-4 sm:py-6'>
            <nav className='text-white flex justify-center gap-6 sm:gap-10'>
              <Link to="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 sm:px-5 py-2 sm:py-3 text-sm sm:text-base rounded-lg font-semibold text-white hover:text-black hover:bg-white transition-all duration-300 "
                >
                  Home
                </motion.button>
              </Link>
              <Link to="/announcement">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 sm:px-5 py-2 sm:py-3 text-sm sm:text-base rounded-lg font-semibold text-white hover:text-black hover:bg-white transition-all duration-300 "
                >Announcements</motion.button>
              </Link>
              <Link to="/track">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 sm:px-5 py-2 sm:py-3 text-sm sm:text-base rounded-lg font-semibold text-white hover:text-black hover:bg-white transition-all duration-300 "
                >Track Grievance</motion.button>
              </Link>
              <Link to="/statistics">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 sm:px-5 py-2 sm:py-3 text-sm sm:text-base rounded-lg font-semibold text-white hover:text-black hover:bg-white transition-all duration-300 "
                >Statistics</motion.button>
              </Link>
            </nav>
          </div>

          <main className="relative container mx-auto px-4 pt-8 md:pt-12 pb-12 z-0">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/submit" element={<SubmitGrievance />} />
              <Route path="/track" element={<TrackGrievance />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/announcement" element={<Announcements />} />
            </Routes>
          </main>
        </div >
      </motion.section>
<div className='bg-gradient-to-r from-[#0B2447]/90 to-black/90 '>
      {location.pathname === "/" && (
        
       <motion.div className="mt-10 mb-10 grid sm:flex-row justify-center items-center gap-10"
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.6, delay: 0.3 }}>
          <Link to="/submit">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 sm:px-10 py-4 sm:py-5 text-sm sm:text-base bg-gradient-to-r from-[#19376D] to-[#0B2447] rounded-lg font-semibold text-white hover:from-[#FFA41B] hover:to-[#FF8C00] transition-all duration-300 shadow-lg"
            >
              Submit Grievance
            </motion.button>
           
          </Link>
   
          
          <Link to="/chatbot">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 ml-6 sm:px-10 py-4 sm:py-5 text-sm sm:text-base bg-gradient-to-r from-[#19376D] to-[#0B2447] rounded-lg font-semibold text-white hover:from-[#FFA41B] hover:to-[#FF8C00] transition-all duration-300 shadow-lg"
            >
              Chatbot 💬
            </motion.button>
          </Link>
          </motion.div>
        
      )}
      </div>
      

      {location.pathname === "/" && (
        <footer className="bg-gradient-to-r from-[#3a7ec7] to-[#123864] text-gray-200 py-8 mt-auto">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <p className="mb-2">Thank you for helping us improve!</p>
              <p className="text-gray-400">© 2025 Grievance System</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;