import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import '../index.css'
const API = import.meta.env.VITE_API_URL;
function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "", department: ""});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const roles = [
    { value: "admin", label: "Admin" },
    { value: "department_head", label: "Department Head" },
    { value: "department_officer", label: "Department Officer" },
  ];

  const departments = ["Health", "Education", "Transport"];
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/admin/signup`, form);
      setMessage("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/admin/login"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <>
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
    

      <div className="px-8 py-6 bg-white shadow-md rounded-lg w-[450px] border">
        
      <h4 className="text-xl text-center text-gray-700 mt-1 font-bold mb-6">
            AI-GRS Portal Login
          </h4>
          <div className="flex justify-center gap-2 mt-4">
            <div className="h-1 w-12 bg-[#FF9933] rounded-full opacity-70"></div>
            <div className="h-1 w-12 bg-[#000080] rounded-full opacity-70"></div>
            <div className="h-1 w-12 bg-[#138808] rounded-full opacity-70"></div>
          </div>
          <br />
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Signup</h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            name="name"
            placeholder="Full Name"
            className="w-full px-4 py-3 border rounded-md"
            onChange={handleChange}
            required
          />
          <select
            name="role"
            className="w-full px-4 py-3 border rounded-md"
            value={form.role}
            onChange={handleChange}
            required
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>

          {(form.role === "department_head" || form.role === "department_officer") && (
            <select
              name="department"
              className="w-full px-4 py-3 border rounded-md"
              value={form.department}
              onChange={handleChange}
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          )}
    
    
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 border rounded-md"
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border rounded-md"
            onChange={handleChange}
            required
          />
          <button  className="w-full py-3 bg-gradient-to-r from-[#FF9933] via-[#000080] to-[#138808] text-white rounded-md hover:opacity-90 transition duration-150 font-medium text-lg shadow-md">
            Sign Up
          </button>
        </form>
        {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
        <Link to={"/admin/login"}><div className="text-center text-sm text-gray-600 mt-4">
          <a className="hover:text-[#FF9933]">Have an account Login</a>
          </div>
          </Link>
      
      </div>
    </div>
     
 </>  
  );
}

export default Signup;
