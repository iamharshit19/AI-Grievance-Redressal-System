import React, { useState } from 'react';
import { 
  Bell, Pin, Clock, Eye, Check, Image as ImageIcon, 
  FileText, Link as LinkIcon, Video, AlertTriangle, 
  Calendar, Users, Bot, Upload, Mail, MessageSquare,
  PhoneCall, Filter,
  Trash2, 
  Edit,
  User,
  LayoutGrid,
  History
} from 'lucide-react';

 
function AnnouncementForm({ newAnnouncement, setNewAnnouncement, handleMediaUpload, announcementTypes, audienceTypes }) {
    
   return( 
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Title</label>
        <input
          type="text"
          className="w-full p-2 border rounded-lg"
          value={newAnnouncement.title}
          onChange={e => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Content</label>
        <textarea
          className="w-full p-2 border rounded-lg h-32"
          value={newAnnouncement.content}
          onChange={e => setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Type</label>
          <select
            className="w-full p-2 border rounded-lg"
            value={newAnnouncement.type}
            onChange={e => setNewAnnouncement(prev => ({ ...prev, type: e.target.value }))}
          >
            {announcementTypes.map(type => (
              <option key={type.id} value={type.id}>{type.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Audience</label>
          <select
            className="w-full p-2 border rounded-lg"
            value={newAnnouncement.audience}
            onChange={e => setNewAnnouncement(prev => ({ ...prev, audience: e.target.value }))}
          >
            {audienceTypes.map(type => (
              <option key={type.id} value={type.id}>{type.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Expiry Date</label>
        <input
          type="datetime-local"
          className="w-full p-2 border rounded-lg"
          value={newAnnouncement.expiryDate}
          onChange={e => setNewAnnouncement(prev => ({ ...prev, expiryDate: e.target.value }))}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Distribution Channels</label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={newAnnouncement.distributionChannels.webApp}
              onChange={e => setNewAnnouncement(prev => ({
                ...prev,
                distributionChannels: { ...prev.distributionChannels, webApp: e.target.checked }
              }))}
            />
            <Bell className="ml-2" size={16} /> Web App
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={newAnnouncement.distributionChannels.email}
              onChange={e => setNewAnnouncement(prev => ({
                ...prev,
                distributionChannels: { ...prev.distributionChannels, email: e.target.checked }
              }))}
            />
            <Mail className="ml-2" size={16} /> Email
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={newAnnouncement.distributionChannels.sms}
              onChange={e => setNewAnnouncement(prev => ({
                ...prev,
                distributionChannels: { ...prev.distributionChannels, sms: e.target.checked }
              }))}
            />
            <MessageSquare className="ml-2" size={16} /> SMS
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Attachments</label>
        <div className="border-2 border-dashed rounded-lg p-4 text-center">
          <input
            type="file"
            multiple
            className="hidden"
            id="file-upload"
            onChange={e => handleMediaUpload(e.target.files)}
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="mx-auto mb-2" />
            <span className="text-sm text-gray-600">Click to upload files</span>
          </label>
        </div>
        {newAnnouncement.attachments.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {newAnnouncement.attachments.map((file, index) => (
              <div key={index} className="flex items-center gap-2 bg-gray-100 p-2 rounded">
                <FileText size={16} />
                <span className="text-sm">{file.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={newAnnouncement.isPinned}
            onChange={e => setNewAnnouncement(prev => ({ ...prev, isPinned: e.target.checked }))}
          />
          <Pin className="ml-2" size={16} /> Pin Announcement
        </label>
      </div>
    </div>
  )
};
  export default AnnouncementForm