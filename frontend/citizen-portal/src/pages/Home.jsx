import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

function Home() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12"
    >
      {/* HERO SECTION */}
      <motion.div variants={itemVariants} className="text-center max-w-4xl mx-auto">
        <div className="inline-block bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border border-blue-100">
           Empowering Citizens with AI
        </div>
        <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Resolve Civic Issues <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
            Faster & Transparently
          </span>
        </h2>
        <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
          The easiest way to report potholes, water issues, and sanitation problems. 
          Track your complaints in real-time.
        </p>
      </motion.div>

      {/* ACTION CARDS - REMOVED THE CHATBOT CARD */}
      <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <ActionCard
          title="Submit Grievance"
          description="File a new complaint about roads, electricity, or water."
          to="/submit"
          icon={<FileTextIcon />}
          color="bg-blue-600"
          btnText="File Complaint"
        />

        <ActionCard
          title="Track Status"
          description="Check real-time updates on your submitted issues."
          to="/track"
          icon={<SearchIcon />}
          color="bg-indigo-600"
          btnText="Check Status"
        />
      </motion.div>

      {/* WHY CHOOSE US - Feature Grid */}
      <motion.div variants={itemVariants} className="bg-white rounded-3xl p-10 shadow-xl border border-blue-500">
        <div className="text-center mb-10">
          <h3 className="text-2xl font-bold text-gray-900">Why use Samadhan?</h3>
          <p className="text-gray-500">Built for speed, transparency, and accountability.</p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8">
          <Feature 
            title="AI Categorization" 
            desc="Automatically routes complaints to the right department."
            icon=""
          />
          <Feature 
            title="Real-time Tracking" 
            desc="Get SMS & Web updates at every step of resolution."
            icon=""
          />
          <Feature 
            title="Transparent Stats" 
            desc="View public dashboards of solved cases in your area."
            icon=""
          />
          <Feature 
            title="Fast Resolution" 
            desc="Escalation protocols ensure officers act quickly."
            icon=""
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- SUB COMPONENTS ---

function ActionCard({ title, description, to, icon, color, btnText }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-blue-500 flex flex-col h-full hover:shadow-xl transition-all"
    >
      <div className={`w-12 h-12 rounded-xl ${color} text-white flex items-center justify-center mb-4 shadow-md`}>
        {icon}
      </div>
      <h4 className="text-xl font-bold text-gray-900 mb-2">{title}</h4>
      <p className="text-gray-500 mb-6 flex-grow">{description}</p>
      <Link
        to={to}
        className="w-full block text-center py-3 rounded-lg font-semibold bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-blue-700 border border-gray-200 transition-colors"
      >
        {btnText} →
      </Link>
    </motion.div>
  );
}

function Feature({ title, desc, icon }) {
  return (
    <div className="text-center p-4">
      <div className="text-4xl mb-3">{icon}</div>
      <h5 className="font-bold text-gray-900 mb-1">{title}</h5>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
  );
}

// --- ICONS (SVG) ---
const FileTextIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
);

const SearchIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);

export default Home;