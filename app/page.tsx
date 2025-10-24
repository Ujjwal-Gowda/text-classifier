"use client";

import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [langResult, setLangResult] = useState<any>(null);
  const [sentimentResult, setSentimentResult] = useState<any>(null);
  const [spamResult, setSpamResult] = useState<any>(null);
  const [topicResult, setTopicResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [dynamic, setDynamic] = useState("");
  const handleDetection = async () => {
    try {
      if (!dynamic) {
        console.error("API path not set");
        return;
      }
      const res = await fetch(`/api/${dynamic}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();

      if (dynamic === "language") setLangResult(data);
      else if (dynamic === "topic") setTopicResult(data);
      else if (dynamic === "sentiment") setSentimentResult(data);
      else if (dynamic === "spam") setSpamResult(data);
    } catch (err) {
      setError(err.message);
    }
  };
  // const handleLanguage = async () => {
  //   try {
  //     const res = await fetch("/api/language", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ text }),
  //     });
  //     const data = await res.json();
  //     setLangResult(data);
  //   } catch (err: any) {
  //     setError(err.message);
  //   }
  // };
  // const handleTopic = async () => {
  //   try {
  //     const res = await fetch("/api/topic", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ text }),
  //     });
  //     const data = await res.json();
  //     setTopicResult(data);
  //   } catch (err: any) {
  //     setError(err.message);
  //   }
  // };
  //
  // const handleSentiment = async () => {
  //   try {
  //     const res = await fetch("/api/sentiment", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ text }),
  //     });
  //     const data = await res.json();
  //     setSentimentResult(data);
  //   } catch (err: any) {
  //     setError(err.message);
  //   }
  // };
  //
  // const handleSpam = async () => {
  //   try {
  //     const res = await fetch("/api/spam", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ text }),
  //     });
  //     const data = await res.json();
  //     setSpamResult(data);
  //   } catch (err: any) {
  //     setError(err.message);
  //   }
  // };
  //
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
          onClick={() => {
            setDynamic("language");
            handleDetection();
          }}
          className="bg-yellow-500 px-4 py-2 rounded"
        >
          Detect Language
        </button>
        <button
          onClick={() => {
            setDynamic("topic");
            handleDetection();
          }}
          className="bg-blue-500 px-4 py-2 rounded"
        >
          Detect Topic
        </button>
        <button
          onClick={() => {
            setDynamic("sentiment");
            handleDetection();
          }}
          className="bg-green-500 px-4 py-2 rounded"
        >
          Detect Sentiment
        </button>
        <button
          onClick={() => {
            setDynamic("spam");
            handleDetection();
          }}
          className="bg-red-500 px-4 py-2 rounded"
        >
          Detect Spam
        </button>
      </div>

      {error && <p className="text-red-400 mt-4">Error: {error}</p>}

      {langResult && (
        <div className="mt-6 text-center">
          <h2 className="text-xl font-bold">🌐 Language Result</h2>
          <p>
            Language:{" "}
            <span className="font-semibold">{langResult.language}</span>
          </p>
          <p>Confidence: {(langResult.confidence * 100).toFixed(2)}%</p>
        </div>
      )}
      {spamResult && (
        <div className="mt-6 text-center">
          <h2 className="text-xl font-bold">🚫 Spam Detection</h2>
          <p>
            Sentiment:{" "}
            <span className="font-semibold">{spamResult.sentiment}</span>
          </p>
          <p>Confidence: {(spamResult.confidence * 100).toFixed(2)}%</p>
        </div>
      )}
      {topicResult && (
        <div className="mt-6 text-center">
          <h2 className="text-xl font-bold">🌐 Topic Result</h2>
          <p>
            Topic: <span className="font-semibold">{topicResult.topic}</span>
          </p>
          <p>Confidence: {(topicResult.confidence * 100).toFixed(2)}%</p>
        </div>
      )}
      {sentimentResult && (
        <div className="mt-6 text-center">
          <h2 className="text-xl font-bold">💬 Sentiment Result</h2>
          <p>
            Sentiment:{" "}
            <span className="font-semibold">{sentimentResult.sentiment}</span>
          </p>
          <p>Confidence: {(sentimentResult.confidence * 100).toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
}
