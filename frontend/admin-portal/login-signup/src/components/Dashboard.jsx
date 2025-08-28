import React, { useEffect, useState } from "react";
import { useNavigate, Routes, Route, Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import axios from "axios";
import GrievancesDashboard from "./GrievancesDashboard";
import Announcements from "./Announcements";
const API = import.meta.env.VITE_API_URL;
function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    pending: 0,
    critical: 0,
  });

  const [monthlyProgress, setMonthlyProgress] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [tasks, setTasks] = useState([]);

  // Add this derived data for PieChart
  const statusData = [
    { name: "Resolved", value: stats.resolved },
    { name: "Pending", value: stats.pending },
    { name: "Critical", value: stats.critical },
  ];

  const COLORS = ["#10b981", "#fbbf24", "#ef4444"];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsRes = await axios.get(`${API}/api/admin-dashboard/stats`);
        setStats(statsRes.data);
      } catch (err) {
        console.error("Error fetching stats", err);
      }
    };

    const fetchMonthly = async () => {
      try {
        const res = await axios.get(`${API}/api/admin-dashboard/progress/monthly`);
        setMonthlyProgress(res.data);
      } catch (err) {
        console.error("Error fetching monthly progress", err);
      }
    };

    const fetchAlerts = async () => {
      try {
        const res = await axios.get(`${API}/api/admin-dashboard/alerts`);
        setAlerts(res.data);
      } catch (err) {
        console.error("Error fetching alerts", err);
      }
    };

    const fetchTasks = async () => {
      try {
        const res = await axios.get(`${API}/api/admin-dashboard/tasks`);
        setTasks(res.data);
      } catch (err) {
        console.error("Error fetching tasks", err);
      }
    };

    fetchStats();
    fetchMonthly();
    fetchAlerts();
    fetchTasks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/admin/login");
  };

  return (
    <>
      <div className="min-h-screen bg-[#f6f7fb] p-6">
        
        <header className="flex justify-between items-center mb-6">
 
  <div className="flex items-center gap-5 ">
    <Link to="/admin/dashboard/Grievances">
      <button className="px-4 my-4 ml-1 sm:my-5 py-2 sm:py-4 text-sm rounded-lg font-semibold text-white bg-black">
        Grievances
      </button>
    </Link>
    <Link to="/admin/dashboard/announcements">
      <button className="px-4 my-4 sm:my-5 py-2 sm:py-4 text-sm rounded-lg font-semibold text-white bg-black">
        Announcements
      </button>
    </Link>
  </div>


  <div>
    <button
      className="px-4 my-4 sm:my-5 py-2 sm:py-4 text-sm rounded-lg font-semibold text-white bg-black mr-1"
      onClick={handleLogout}
    >
      Logout
    </button>
  </div>
</header>


        <section className="bg-gray-900 text-white p-6 rounded-xl shadow mb-6">
          <div className="text-xl font-bold">Welcome back, Admin</div>
          <p className="text-sm mt-1">Here's what's happening in your jurisdiction today</p>
          <div className="mt-4 flex justify-between">
            <div>
              <p className="text-lg">
                New Grievances: <span className="text-purple-400 font-bold">12</span>
              </p>
              <p className="text-xs">+2 today</p>
            </div>
            <div>
              <p className="text-lg">
                Pending Actions: <span className="text-yellow-300 font-bold">5</span>
              </p>
              <p className="text-xs">3 urgent</p>
            </div>
            <div>
              <p className="text-lg">
                Resolved Today: <span className="text-green-400 font-bold">8</span>
              </p>
              <p className="text-xs">94% success</p>
            </div>
          </div>
        </section>

   
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-100 p-6 rounded-lg text-center shadow">
            <h3 className="text-xl font-bold">{stats.total}</h3>
            <p className="text-sm text-gray-600">Total Cases</p>
          </div>
          <div className="bg-green-100 p-6 rounded-lg text-center shadow">
            <h3 className="text-xl font-bold">{stats.resolved}</h3>
            <p className="text-sm text-gray-600">Resolved</p>
          </div>
          <div className="bg-yellow-100 p-6 rounded-lg text-center shadow">
            <h3 className="text-xl font-bold">{stats.pending}</h3>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
          <div className="bg-red-100 p-6 rounded-lg text-center shadow">
            <h3 className="text-xl font-bold">{stats.critical}</h3>
            <p className="text-sm text-gray-600">Critical</p>
          </div>
        </section>

<section className="w-full p-6 bg-white shadow-md rounded-lg mt-6">
  <h3 className="font-semibold text-lg mb-4">Monthly Overview</h3>

  <div className="flex flex-col md:flex-row gap-6 justify-between">
  
    <div className="w-full md:w-2/3 h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={monthlyProgress.length ? monthlyProgress : [{ name: "No data", total: 0, resolved: 0 }]} barSize={25}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#3b82f6" name="Total Grievances" />
          <Bar dataKey="resolved" fill="#10b981" name="Resolved" />
        </BarChart>
      </ResponsiveContainer>
    </div>

    
    <div className="w-full md:w-1/3 h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={statusData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {statusData.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
</section>


        
        <div className="md:grid-cols-2 gap-6 mb-6">
          <div className="bg-red-100 p-6 rounded-xl shadow">
            <h3 className="font-semibold text-red-700 mb-4">Critical Alerts</h3>
            {alerts.map((alert, index) => (
              <div key={index} className="mb-4">
                <p className="font-bold">⚠️ {alert.title}</p>
                <p className="text-sm">
                  {alert.message} - {alert.time}
                </p>
              </div>
            ))}
          </div>
        </div>

        
        <section className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-4">Assigned Tasks</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 border-l-4 rounded ${
                  task.priority === "high"
                    ? "bg-red-50 border-red-500"
                    : task.priority === "medium"
                    ? "bg-yellow-50 border-yellow-500"
                    : "bg-green-50 border-green-500"
                }`}
              >
                <h4 className="font-bold capitalize">{task.priority} Priority</h4>
                <p>
                  {task.title} - {task.deadline}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      
      <Routes>
        <Route path="/admin/dashboard/Grievances" element={<GrievancesDashboard />} />
        <Route path="/admin/dashboard/announcements" element={<Announcements/>}/>
      </Routes>
    </>
  );
}

export default Dashboard;
