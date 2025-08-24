//import { GoogleGenAI } from "@google/genai";
import express, { json } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import { config } from 'dotenv';
import grievanceRoutes from './routes/grievance.js';
import adminAuthRoutes from "./routes/adminAUth.js";
import adminDashboardRoutes from "./routes/adminDashboard.js";
import announcementRoutes from './routes/announcements.js';



config();
const app = express();
app.use(cors());
app.use(json());
app.use("/api/admin-dashboard", adminDashboardRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/grievance', grievanceRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.log(err));
