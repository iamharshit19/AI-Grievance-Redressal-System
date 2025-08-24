import express, { json } from 'express';
const router = express.Router();
import Grievance from '../models/Grievance.js';
import bcrypt from 'bcryptjs';
import Admin from '../models/admin.js'; 
import axios from "axios";
const generateTrackingId = () => {
  const prefix = 'GRV';
  const random = Math.floor(100000 + Math.random() * 900000); 
  return `${prefix}-${random}`;
};
const classifyGrievancePriority = async (message) => {
  try {
    const response = await axios.post("http://localhost:5002/classify-priority", { message });
    return response.data.priority || "Low";
  } catch (error) {
    console.error("Priority classification failed:", error.message);
    return "Low"; 
  }
};


router.post('/submit', async (req, res) => {
  try {
    const { name, email, message, createdAt, status,department, address, code } = req.body;
    const trackingId = generateTrackingId();
    const priority = await classifyGrievancePriority(message);
    const grievance = new Grievance({ name, email, message, department, trackingId, createdAt, status, address, priority,  code});
    await grievance.save();
    res.status(201).json({ message: 'Grievance submitted successfully', trackingId: grievance.trackingId });

  } catch (err) {
    console.error("Error in /submit:", err);
    res.status(500).json({ error: 'Failed to submit grievance'});
  }
});

router.get('/track/:trackingId', async (req, res) => {
  try {
    const grievance = await Grievance.findOne({ trackingId: req.params.trackingId });
    if (!grievance) {
      return res.status(404).json({ error: 'Grievance not found' });
    }
    res.json(grievance);
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving grievance' });
  }
});

router.get("/stats", async (req, res) => {
  try {
    

    const departmentCounts = await Grievance.aggregate([
      {
        $group: {
          _id: "$department",
          resolved: {
            $sum: {
              $cond: [{ $eq: ["$status", "Resolved"] }, 1, 0],
            },
          },
          unresolved: {
            $sum: {
              $cond: [{ $eq: ["$status", "Processing"] }, 1, 0],
            },
          },
        },
      },
    ]);
    const statusCounts = await Grievance.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      statusCounts,
      departmentCounts,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
  
});

export default router;


