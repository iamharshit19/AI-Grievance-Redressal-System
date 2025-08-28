import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../index.css'
function Login({ setAuthenticated }) {
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const roles = [
    { value: "admin", label: "Admin" },
    { value: "department_head", label: "Department Head" },
    { value: "department_officer", label: "Department Officer" },
  ];

  const departments = ["Health", "Education", "Transport"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API}/api/admin/login`, {
        email,
        password,
        role,
        department
      });
      console.log("Login response:", response);
      if (response.status === 200) {
        setAuthenticated(true);
        localStorage.setItem("isAuthenticated", "true");
        alert(response.data.message || "Login Successful");
        try {
          
          navigate("/admin/dashboard");
        } catch (navError) {
          console.error("Navigation error:", navError);
          alert("Login successful, but dashboard navigation failed.");
        }
      } else {
        alert("Login failed due to unexpected status");
      }
    } catch (err) {
      console.error("Login error caught:", err);
      alert(err.response?.data?.error || "Login failed (catch block)");
    }
  }; 
        
   
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#f3f4f8] to-[#e5e7eb]">
      <div className="px-8 py-6 bg-[#f8f9fc] shadow-xl rounded-lg w-[450px] border border-gray-100">
        <div className="text-center mb-8">
        
          <h4 className="text-xl text-gray-700 mt-1">
            AI-GRS Portal Login
          </h4>
          <div className="flex justify-center gap-2 mt-4">
            <div className="h-1 w-12 bg-[#FF9933] rounded-full opacity-70"></div>
            <div className="h-1 w-12 bg-[#000080] rounded-full opacity-70"></div>
            <div className="h-1 w-12 bg-[#138808] rounded-full opacity-70"></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                आपकी भूमिका (Your Role)
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-transparent transition duration-150"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="">Select Role</option>
                {roles.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            {(role === "department_head" || role === "department_officer") && (
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  विभाग (Department)
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-transparent transition duration-150"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-gray-700 font-medium mb-2">
               Email
              </label>
              <input
                type="text"
                placeholder="Enter your Email"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-transparent transition duration-150"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                पासवर्ड (Password)
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-transparent transition duration-150"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <button 
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#FF9933] via-[#000080] to-[#138808] text-white rounded-md hover:opacity-90 transition duration-150 font-medium text-lg shadow-md"
            >
              प्रवेश करें (Login)
            </button>
          </div>

          <div className="text-center text-sm text-gray-600 mt-4">
            <a href="#" className="hover:text-[#FF9933]">Forgot Password?</a>
            <div className="mt-2">
              Need Help? Contact Support
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}




export default Login