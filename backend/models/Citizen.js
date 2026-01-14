import mongoose from "mongoose";

const citizenSchema = new mongoose.Schema({
  phone: { type: String, unique: true, required: true },

  otp: { type: String },
  otpExpires: { type: Date },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Citizen", citizenSchema);
