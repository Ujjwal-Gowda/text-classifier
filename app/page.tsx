"use client";

import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [langResult, setLangResult] = useState<any>(null);
  const [sentimentResult, setSentimentResult] = useState<any>(null);
  const [spamResult, setSpamResult] = useState<any>(null);
  const [topicResult, setTopicResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLanguage = async () => {
    try {
      const res = await fetch("/api/language", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setLangResult(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleTopic = async () => {
    try {
      const res = await fetch("/api/topic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setTopicResult(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSentiment = async () => {
    try {
      const res = await fetch("/api/sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setSentimentResult(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSpam = async () => {
    try {
      const res = await fetch("/api/spam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setSpamResult(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white font-sans">
      <h1 className="text-3xl mb-6">Text Classifier</h1>

      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text..."
        className="border p-2 rounded text-white"
      />

      <div className="mt-4 flex gap-4">
        <button
          onClick={handleLanguage}
          className="bg-yellow-500 px-4 py-2 rounded"
        >
          Detect Language
        </button>
        <button onClick={handleTopic} className="bg-blue-500 px-4 py-2 rounded">
          Detect Topic
        </button>
        <button
          onClick={handleSentiment}
          className="bg-green-500 px-4 py-2 rounded"
        >
          Detect Sentiment
        </button>
        <button onClick={handleSpam} className="bg-red-500 px-4 py-2 rounded">
          Detect Spam
        </button>
      </div>

      {error && <p className="text-red-400 mt-4">Error: {error}</p>}

      {langResult && (
        <div className="mt-6 text-center">
          <h2 className="text-xl font-bold">🌐 Language Result</h2>
          <pre>{JSON.stringify(langResult, null, 2)}</pre>
        </div>
      )}
      {topicResult && (
        <div className="mt-6 text-center">
          <h2 className="text-xl font-bold">🌐 Language Result</h2>
          <pre>{JSON.stringify(topicResult, null, 2)}</pre>
        </div>
      )}
      {spamResult && (
        <div className="mt-6 text-center">
          <h2 className="text-xl font-bold">🌐 spam Result</h2>
          <pre>{JSON.stringify(spamResult, null, 2)}</pre>
        </div>
      )}
      {sentimentResult && (
        <div className="mt-6 text-center">
          <h2 className="text-xl font-bold">💬 Sentiment Result</h2>
          <pre>{JSON.stringify(sentimentResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
