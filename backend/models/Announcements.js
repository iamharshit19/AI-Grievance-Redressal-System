
import mongoose from 'mongoose';

const AnnouncementSchema = new mongoose.Schema({
  title: String,
  content: String,
  type: String, 
  audience: String, 
  expiryDate: Date,
  isPinned: Boolean,
  distributionChannels: {
    email: Boolean,
    webApp: Boolean,
    sms: Boolean
  },
  attachments: [
    {
      name: String,
      type: String,
      size: Number,
      url: String
    }
  ],
  viewCount: { type: Number, default: 0 },
  acknowledgments: { type: Number, default: 0 },
  author: String,
  authorRole: String,
  department: String,
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Announcement', AnnouncementSchema);
