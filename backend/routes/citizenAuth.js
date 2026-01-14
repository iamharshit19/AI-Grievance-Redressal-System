import express from "express";
import Citizen from "../models/Citizen.js";

const router = express.Router();

const normalizePhone = (phone) => {
  if (phone.startsWith("+91")) return phone;
  return "+91" + phone;
};

// --- SEND OTP ---
router.post("/send-otp", async (req, res) => {
  try {
    let { phone } = req.body;
    if (!phone) return res.status(400).json({ error: "Phone required" });

    phone = normalizePhone(phone);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    // 🔴 OLD CODE (The Problem):
    // await Citizen.findOneAndUpdate({ phone }, { phone, otp, otpExpires: expiry }, ...);

    // 🟢 NEW CODE (The Fix): Use $set
    const citizen = await Citizen.findOneAndUpdate(
      { phone },
      { 
        $set: { 
          otp: otp, 
          otpExpires: expiry 
        } 
      },
      { upsert: true, new: true } // 'new: true' returns the doc AFTER update
    );

    // DEBUG: Confirm it saved in the console
    console.log("DB Update Result -> Phone:", citizen.phone, "OTP:", citizen.otp);

    res.json({ message: "OTP sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
// --- VERIFY OTP ---
router.post("/verify-otp", async (req, res) => {
  try {
    let { phone, otp } = req.body;

    phone = normalizePhone(phone);

    const user = await Citizen.findOne({ phone });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Debugging logs
    console.log(`Verifying: Input [${otp}] vs DB [${user.otp}]`);

    if (!user.otp || user.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (user.otpExpires < new Date()) {
      return res.status(400).json({ error: "OTP expired" });
    }

    // Clear OTP after success
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ message: "Login successful", citizen: user });
  } catch (error) {
    console.error("Verify Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;