
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";
import dotenv from 'dotenv';
dotenv.config();


const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "123456";



router.post("/signup", async (req, res) => {
  const { name, email, password, role, department } = req.body;
  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ name, email, password: hashedPassword, role, department});
    await newAdmin.save();

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Signup failed" });
  }
});


router.post("/login", async (req, res) => {
  const { email, password, role, department } = req.body;

  try {
    const admin = await Admin.findOne({ email});
    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
   
    const token = jwt.sign({ id: admin._id, email: admin.email }, SECRET_KEY, {
      expiresIn: "1d",
    });
    if (role && admin.role !== role) {
      return res.status(401).json({ error: "Invalid role" });
    }
    
    if ((role === "department_head" || role === "department_officer") && admin.department !== department) {
      return res.status(401).json({ error: "Invalid department" });
    }
    

    res.status(200).json({ token, message: "Login successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
