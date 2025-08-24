// routes/announcements.js
import express from 'express';
import Announcement from '../models/Announcements.js';

const router = express.Router();

// POST: Create Announcement
router.post('/', async (req, res) => {
  console.log("Post /api/annoucements hit");
  try {
    const announcement = new Announcement(req.body);
    await announcement.save();
    res.status(201).json(announcement);
  } catch (err) {
    res.status(500).json({ message: 'Error creating announcement', error: err });
  }
});

// GET: Public Announcements for citizen portal
router.get('/', async (req, res) => {
  try {
    const announcements = await Announcement.find({ audience: 'public' }).sort({ isPinned: -1, timestamp: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching announcements', error: err });
  }
});

export default router;
