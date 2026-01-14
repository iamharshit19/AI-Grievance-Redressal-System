import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import axios from "axios";
import Grievance from '../models/Grievance.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// --- 1. Cloudinary Configuration & Validation ---
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.error("❌ ERROR: Cloudinary environment variables are missing in .env file!");
  console.error("   Required: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET");
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret
});

// --- 2. Multer Storage Setup (Cloudinary) ---
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'grievances',
    // 'allowedFormats' is the modern syntax (camelCase), supports jpg, png, etc.
    allowedFormats: ['jpg', 'png', 'jpeg', 'webp'], 
  },
});

const upload = multer({ storage: storage });

// --- Helper Functions ---
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
    // Don't spam console if ML service is down, just default to Low
    return "Low"; 
  }
};

// --- Routes ---

// 1. Submit Grievance (Wrapper to catch Image Upload Errors safely)
router.post('/submit', (req, res, next) => {
    // Create the middleware function
    const uploadMiddleware = upload.array('images', 5);
    
    // Call it manually to handle errors
    uploadMiddleware(req, res, (err) => {
      if (err) {
        console.error("❌ Image Upload Failed:", err);
        // FORCE JSON RESPONSE
        return res.status(500).json({ 
            error: 'Image upload failed. Please check server logs.', 
            details: err.message || 'Unknown Multer error',
            hint: 'Verify Cloudinary credentials in .env'
        });
      }
      // If no error, proceed to the async handler below
      next();
    });
  }, async (req, res) => {
  try {
    // 1. Extract fields
    const { name, email, mobile, message, department, address, code, latitude, longitude } = req.body;
    
    // 2. Extract Image URLs from Cloudinary response
    // If no images were uploaded, req.files will be empty/undefined
    const imageUrls = req.files ? req.files.map(file => file.path) : [];

    const trackingId = generateTrackingId();
    const priority = await classifyGrievancePriority(message);

    // 3. Construct Grievance
    const grievanceData = {
      name, 
      email,
      mobile,
      message, 
      department, 
      trackingId, 
      address, 
      priority,  
      code,
      images: imageUrls,
    };

    // 4. Handle Location parsing
    if (latitude && longitude && latitude !== 'undefined' && longitude !== 'undefined') {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        grievanceData.location = {
          latitude: lat,
          longitude: lng
        };
      }
    }

    const grievance = new Grievance(grievanceData);
    await grievance.save();

    res.status(201).json({ 
      message: 'Grievance submitted successfully', 
      trackingId: grievance.trackingId 
    });

  } catch (err) {
    console.error("❌ Error in /submit handler:", err);
    res.status(500).json({ error: 'Failed to submit grievance', details: err.message });
  }
});

// 2. Track Single Grievance (Public Search)
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

// 3. NEW: User History (Fetch all grievances by mobile number)
router.get('/user/:mobile', async (req, res) => {
  try {
    const { mobile } = req.params;
    if (!mobile) return res.status(400).json({ error: "Mobile number required" });

    // Find grievances matching the mobile number, sort by newest first
    const grievances = await Grievance.find({ mobile }).sort({ createdAt: -1 });
    
    res.json({ grievanceList: grievances });
  } catch (err) {
    console.error("Error fetching user history:", err);
    res.status(500).json({ error: 'Error retrieving user history' });
  }
});

// 4. Admin Stats
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