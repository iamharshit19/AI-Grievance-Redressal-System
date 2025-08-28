import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
const API = import.meta.env.VITE_API_URL;


const COLORS = ["#23568f", "#FF8042"];

function Statistics() {
  const [statusData, setStatusData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/grievance/stats`)
      .then((res) => res.json())
      .then((stats) => {
            const resolvedCount =
  stats.statusCounts.find((s) => s._id === "Resolved")?.count || 0;

const unresolvedCount =
  stats.statusCounts.find((s) => ["Processing", "Rejected", "Pending"].includes(s._id))?.count || 0;

setStatusData([
  { name: "Resolved", value: resolvedCount },
  { name: "Unresolved", value: unresolvedCount },
]);

        const departmentFormatted = stats.departmentCounts.map((dept) => ({
          name: dept._id,
          Resolved: dept.resolved,
          Unresolved: dept.unresolved,
        }));
        setDepartmentData(departmentFormatted);
      })
      .catch((error) => {
        console.error("Failed to fetch stats:", error);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-[#0B2447]">
        Grievance Statistics
      </h2>

      <div className="mb-12">
        <h3 className="text-xl font-semibold mb-4">Overall Resolution Status</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
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

      
      <div>
        <h3 className="text-xl font-semibold mb-4">Department-wise Grievance Status</h3>
        
        <ResponsiveContainer width="100%" height={300}>
  <BarChart
    data={departmentData}
    margin={{ top: 10, right: 30, left: 0, bottom: 60 }}>

            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name"/>

            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Resolved" fill="#23568f" />
            <Bar dataKey="Unresolved" fill="#FF8042" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Statistics;
