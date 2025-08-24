import { Schema, model } from 'mongoose';

const grievanceSchema = new Schema({
  name: String,
  code: String,
  email: String,
  message: String,
  department: String,
  address: String,
  trackingId: { type: String, unique: true, required: true },
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Processing", "Resolved", "Rejected"]
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Low',
  },
  createdAt: { type: Date, default: Date.now },
 
});

export default model('Grievance', grievanceSchema);
