
import React, { useState } from "react";
import ReactMarkdown from 'react-markdown'; 

function Chatbot() {
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
                setError("AI service is temporarily unavailable. Please try again in a few moments.");
            } else {
                setError(`Error: ${err.message}. Please try again.`);
            }
        } finally {
            setLoading(false); 
               }
    };

    return (
        <div className="max-w-xl w-full mx-auto p-4 bg-white rounded-lg shadow-lg font-sans">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Grievance Assistant</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <textarea
                    rows={6} 
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    placeholder="Describe your issue formally, e.g., 'I am writing to complain about the persistent water logging in my street after every rainfall, causing inconvenience to residents and potential health hazards.'"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200 ease-in-out resize-y"
                    disabled={loading} 
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading} 
                >
                    {loading ? "Generating..." : "Generate Grievance"}
                </button>
            </form>

            {error && (
                <div className="mt-6 p-4 border border-red-400 rounded-md bg-red-50 text-red-700">
                    <strong>Error:</strong>
                    <p>{error}</p>
                </div>
            )}

{response && (
    <div className="mt-6 p-5 border border-gray-200 rounded-md bg-gray-50 text-gray-800 shadow-inner relative">
        <strong className="block text-lg mb-2 text-blue-700">AI Suggestion:</strong>
        <ReactMarkdown>{response}</ReactMarkdown>

        <button
            onClick={async () => {
                await navigator.clipboard.writeText(response);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000); 
            }}
            className="absolute top-3 right-3 bg-green-500 text-white text-sm px-3 py-1 rounded hover:bg-green-600 transition"
        >
            {copied ? "Copied!" : "Copy"}
        </button>
    </div>
)}

        </div>
    );
}

export default Chatbot;
