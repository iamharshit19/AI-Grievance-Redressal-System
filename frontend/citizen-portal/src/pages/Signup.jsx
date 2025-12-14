import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function Signup() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const sendOtp = async () => {
    if (!phone || !name) {
      alert("Please enter both Name and Mobile Number.");
      return;
    }
    try {
      // Pass 'name' so backend can create the user with a name
      const res = await fetch(`${API}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, name }), 
      });
      if (res.ok) {
        setStep(2);
      } else {
        alert("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  const verifyOtp = async () => {
    try {
      // Pass 'name' again in verify just in case the backend updates user profile on verification
      const res = await fetch(`${API}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp, name }),
      });

      const data = await res.json();

      if (res.ok) {
        // Save user data (including name) to LocalStorage
        localStorage.setItem("citizen", JSON.stringify(data.citizen));
        navigate("/home");
      } else {
        alert(data.error || "Invalid OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden">
      
      {/* LEFT PANEL */}
      <div className="hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative">
        <div>
          <h1 className="text-3xl font-bold mb-2 tracking-wide">SAMADHAN</h1>
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-6 leading-tight">
            Join the Community <br/> & Drive Change.
          </h2>
          
          <div className="mt-8 space-y-6">
            <FeatureRow 
              title="Report Issues" 
              desc="Instantly report civic problems in your area." 
            />
            <FeatureRow 
              title="Stay Informed" 
              desc="Get real-time updates on resolution status." 
            />
            <FeatureRow 
              title="Make an Impact" 
              desc="Contribute to a cleaner, safer city." 
            />
          </div>
        </div>

        <div className="mt-8">
          <p className="text-xs uppercase tracking-wider opacity-70 mb-3 font-semibold">
            Trusted Partners
          </p>
          <div className="flex gap-6 opacity-90 font-medium">
            <span>GovTech</span>
            <span>CivicLabs</span>
            <span>IndiaStack</span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex flex-col justify-center items-center bg-white px-6 h-full">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-sm text-gray-500">Sign up to start reporting grievances.</p>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
                  Mobile Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  maxLength={10}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <button
                onClick={sendOtp}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-transform active:scale-[0.98]"
              >
                Send OTP
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
                  One-Time Password
                </label>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none transition-all text-center tracking-widest text-lg"
                />
              </div>
              <button
                onClick={verifyOtp}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-transform active:scale-[0.98]"
              >
                Verify & Register
              </button>
              <button 
                onClick={() => setStep(1)}
                className="w-full text-sm text-gray-500 hover:text-gray-800 underline mt-2"
              >
                Change Details
              </button>
            </div>
          )}

          <div className="mt-8 text-center border-t pt-6">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <button 
                onClick={() => navigate("/")} 
                className="text-blue-600 font-semibold hover:underline"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureRow({ title, desc }) {
  return (
    <div>
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-white/80 text-sm">{desc}</p>
    </div>
  );
}