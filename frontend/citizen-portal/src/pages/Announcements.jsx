import React, { useEffect, useState } from 'react';
const API = import.meta.env.VITE_API_URL;


function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch(`${API}/api/announcements`);
        const data = await res.json();
        setAnnouncements(data);
      } catch (err) {
        console.error('Failed to load announcements:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  if (loading) return <p>Loading announcements...</p>;

  return (
    <div className="p-4 ">
      <h2 className="text-2xl font-bold mb-4 text-center max-w-xl mx-auto mt-10 text-white">Latest Announcements</h2>
      <div className=''>
      {announcements.length === 0 ? (
        <p>No announcements yet.</p>
      ) : (
        <div className="space-y-4 ">
          {announcements.map((a) => (
            <div key={a._id} className="p-4 border border-gray-200 rounded shadow-sm bg-white">
              <h3 className="text-lg font-semibold">{a.title}</h3>
              <p className="text-sm text-gray-600">{new Date(a.timestamp).toLocaleString()}</p>
              <p className="mt-2">{a.content}</p>
              {a.attachments?.length > 0 && (
                <div className="mt-3 space-y-1">
                  <strong>Attachments:</strong>
                  {a.attachments.map((file, i) => (
                    <p key={i} className="text-sm text-blue-600">{file.name}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
    </div>  );
}

export default Announcements;
