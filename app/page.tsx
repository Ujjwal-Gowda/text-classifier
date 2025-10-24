"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [result, setResult] = useState<{
    language?: string;
    confidence?: number;
    error?: string;
  }>({});
  const [text, setText] = useState("");
  const handlesubbmit = () => {
    async function detectLanguage() {
      try {
        const res = await fetch("/api/language", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: text }),
        });

        const data = await res.json();
        setResult(data); // ✅ save result in state
      } catch (err: any) {
        setResult({ error: err.message });
      }
    }

    detectLanguage();
  };
  return (
    <div className="flex min-h-screen flex-col items-center justify-center font-sans bg-gray-900 text-white">
      <h1 className="text-3xl mb-6">Language Detection Test</h1>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handlesubbmit}>click here </button>
      {/* Loading State */}
      {!result.language && !result.error && (
        <p className="text-gray-400">Detecting language...</p>
      )}

      {/* Success State */}
      {result.language && (
        <div className="text-center">
          <p className="text-xl">
            🌐 Detected language: <strong>{result.language}</strong>
          </p>
          <p className="text-gray-400 mt-2">
            Confidence: {(result.confidence! * 100).toFixed(2)}%
          </p>
        </div>
      )}

      {/* Error State */}
      {result.error && (
        <p className="text-red-400 mt-4">Error: {result.error}</p>
      )}
    </div>
  );
}
