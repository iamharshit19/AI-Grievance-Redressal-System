import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion'; // Using existing motion lib
import GrievanceForm from '../components/GrievanceForm'; // Assuming this exists as per your code
import Chatbot from '../pages/Chatbot'; // Import the Chatbot

function SubmitGrievance() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="relative min-h-screen">
      <div className="text-xl text-center sm:text-2xl md:text-4xl font-bold mb-4 sm:mb-6 text-black mt-4 sm:mt-6">
        <h1>Submit Your Grievance</h1>
      </div>
      <br />
      
      {/* The Main Form */}
      <GrievanceForm />

      {/* --- FLOATING CHATBOT WIDGET --- */}
      
      {/* 1. The Popup Window */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden flex flex-col"
          >
            {/* Header of the Popup */}
            <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
              <span className="font-semibold text-sm">AI Assistant</span>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="text-white hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            
            {/* Body of the Popup */}
            <div className="flex-1 p-2 overflow-hidden">
                <Chatbot compact={true} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. The Floating Button (FAB) */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-50 focus:outline-none focus:ring-4 focus:ring-blue-300"
        title="Need help writing?"
      >
        {isChatOpen ? (
          // Close Icon
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        ) : (
          // Bot/Chat Icon
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        )}
      </button>

    </div>
  );
}

export default SubmitGrievance;