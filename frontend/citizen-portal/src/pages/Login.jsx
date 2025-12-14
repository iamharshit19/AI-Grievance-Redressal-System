import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function Login() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const sendOtp = async () => {
    if (!phone) return;
    try {
      const res = await fetch(`${API}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
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
      const res = await fetch(`${API}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        // --- KEY CHANGE: Save user data to LocalStorage ---
        // We store the whole citizen object (phone, name, etc.)
        localStorage.setItem("citizen", JSON.stringify(data.citizen));
        
        navigate("/home");
      } else {
        alert(data.error || "Invalid OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    // H-[calc(100vh-4rem)] accounts for the navbar height to prevent scrollbars
    <div className="h-[calc(100vh-4rem)] w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden">
      
      {/* LEFT PANEL */}
      <div className="hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-purple-700 to-teal-500 text-white relative">
        <div>
          <h1 className="text-3xl font-bold mb-2 tracking-wide">SAMADHAN</h1>
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-6 leading-tight">
            Your Voice Heard, <br/> & Resolved.
          </h2>
          
          <div className="mt-8 space-y-6">
            <FeatureRow 
              title="AI-assisted drafting" 
              desc="Draft grievances automatically with AI tools." 
            />
            <FeatureRow 
              title="Real-time tracking" 
              desc="Monitor the status of your complaints live." 
            />
            <FeatureRow 
              title="Transparent governance" 
              desc="Ensuring accountability at every step." 
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-sm text-gray-500">Please enter your details to sign in.</p>
          </div>

          {step === 1 && (
            <div className="space-y-4">
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
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                />
              </div>
              <button
                onClick={sendOtp}
                className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-black transition-transform active:scale-[0.98]"
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
                className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-black transition-transform active:scale-[0.98]"
              >
                Verify & Login
              </button>
              <button 
                onClick={() => setStep(1)}
                className="w-full text-sm text-gray-500 hover:text-gray-800 underline mt-2"
              >
                Change Phone Number
              </button>
            </div>
          )}

          <div className="mt-8 text-center border-t pt-6">
            <p className="text-sm text-gray-500">
              Want to check status only?{" "}
              <button 
                onClick={() => navigate("/track")} 
                className="text-purple-600 font-semibold hover:underline"
              >
                Track Grievance
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