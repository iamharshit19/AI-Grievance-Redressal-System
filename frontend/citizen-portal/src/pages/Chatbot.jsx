import React, { useState } from "react";
import ReactMarkdown from 'react-markdown';

function Chatbot({ compact = false }) { // Added a compact prop for widget mode
    const [userMessage, setUserMessage] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResponse("");

        try {
            const res = await fetch("http://localhost:5001/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            setResponse(data.reply);
        } catch (err) {
            console.error("Failed to fetch AI response:", err);
            if (err.message.includes("AI service is temporarily unavailable")) {
                setError("AI service is temporarily unavailable.");
            } else {
                setError(`Error: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`w-full flex flex-col h-full ${compact ? 'p-2' : 'max-w-xl mx-auto p-4 bg-white rounded-lg shadow-lg'}`}>
            {!compact && <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Grievance Assistant</h2>}
            
            <div className="flex-grow overflow-y-auto mb-4 custom-scrollbar">
                {error && (
                    <div className="p-3 mb-2 border border-red-400 rounded-md bg-red-50 text-red-700 text-sm">
                        {error}
                    </div>
                )}

                {response && (
                    <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-800 shadow-inner relative text-sm">
                        <strong className="block text-blue-700 mb-1">AI Suggestion:</strong>
                        <ReactMarkdown>{response}</ReactMarkdown>
                        <button
                            onClick={async () => {
                                await navigator.clipboard.writeText(response);
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2000);
                            }}
                            className="absolute top-2 right-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded hover:bg-green-600 transition"
                        >
                            {copied ? "Copied!" : "Copy"}
                        </button>
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="mt-auto space-y-3">
                <textarea
                    rows={compact ? 3 : 6}
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    placeholder={compact ? "Describe issue..." : "Describe your issue formally..."}
                    className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    disabled={loading}
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white text-sm font-semibold py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
                    disabled={loading}
                >
                    {loading ? "..." : "Generate Draft"}
                </button>
            </form>
        </div>
    );
}

export default Chatbot;