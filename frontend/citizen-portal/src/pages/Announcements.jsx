import React, { useEffect, useState } from "react";
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
        console.error("Failed to load announcements:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-600">
        Loading announcements…
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Latest Announcements
      </h2>

      <div className="max-w-3xl mx-auto">
        {announcements.length === 0 ? (
          <p className="text-center text-gray-600">
            No announcements yet.
          </p>
        ) : (
          <div className="space-y-6">
            {announcements.map((a) => (
              <div
                key={a._id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm p-5"
              >
                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-900">
                  {a.title}
                </h3>

                {/* Meta */}
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(a.timestamp).toLocaleString()}
                </p>

                {/* Content */}
                <p className="mt-3 text-gray-700 leading-relaxed">
                  {a.content}
                </p>

                {/* Attachments */}
                {a.attachments?.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700">
                      Attachments:
                    </p>
                    <ul className="list-disc list-inside">
                      {a.attachments.map((file, i) => (
                        <li
                          key={i}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {file.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Announcements;
