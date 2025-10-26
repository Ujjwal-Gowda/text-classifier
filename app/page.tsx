"use client";

import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [activeClassifier, setActiveClassifier] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const classifiers = [
    { id: "language", name: "Language" },
    { id: "sentiment", name: "Sentiment" },
    { id: "topic", name: "Topic" },
    { id: "spam", name: "Spam" },
  ];

  const handleClassify = async (classifierId: string) => {
    if (!text.trim()) {
      setError("Please enter some text to classify");
      return;
    }

    setLoading(true);
    setError(null);
    setActiveClassifier(classifierId);
    setResult(null);

    try {
      const res = await fetch(`/api/${classifierId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getResultDisplay = () => {
    if (!result || !activeClassifier) return null;

    const classifierConfig = {
      language: { label: "Detected Language", valueKey: "language" },
      sentiment: { label: "Sentiment", valueKey: "sentiment" },
      topic: { label: "Topic", valueKey: "topic" },
      spam: { label: "Classification", valueKey: "sentiment" },
    };

    const config =
      classifierConfig[activeClassifier as keyof typeof classifierConfig];
    const value = result[config.valueKey];
    const confidence = result.confidence;

    return (
      <div className="mt-8 p-8 bg-[#1a1a1a] rounded-lg border border-gray-800">
        <div className="mb-6">
          <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-2">
            {config.label}
          </h3>
          <p className="text-4xl font-light text-white capitalize">{value}</p>
        </div>
        {typeof confidence === "number" && (
          <div>
            <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-2">
              Confidence
            </h3>
            <p className="text-2xl font-light text-white">
              {(confidence * 100).toFixed(1)}%
            </p>
          </div>
        )}
        {typeof confidence === "string" && (
          <div>
            <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-2">
              Confidence
            </h3>
            <p className="text-2xl font-light text-white capitalize">
              {confidence}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#2a2d32] text-white">
      <div className="flex">
        {/* Left side - Navigation */}
        <div className="w-1/2 p-16 flex flex-col justify-between min-h-screen">
          <div>
            <h1 className="text-2xl font-bold tracking-wide mb-32">
              TEXT CLASSIFIER
            </h1>

            <nav className="space-y-8">
              {classifiers.map((classifier, index) => (
                <button
                  key={classifier.id}
                  onClick={() => handleClassify(classifier.id)}
                  disabled={loading || !text.trim()}
                  className={`block text-7xl font-light text-left transition-all duration-500 relative group
                    ${!text.trim() ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
                    ${activeClassifier === classifier.id
                      ? "text-white"
                      : "text-gray-600 hover:text-white"
                    }
                  `}
                  style={{
                    opacity:
                      activeClassifier === classifier.id
                        ? 1
                        : text.trim()
                          ? 0.4
                          : 0.3,
                  }}
                >
                  {classifier.name}
                  <div
                    className={`absolute left-0 bottom-0 h-[2px] bg-white transition-all duration-500
                    ${activeClassifier === classifier.id ? "w-full" : "w-0 group-hover:w-full"}
                  `}
                  />
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Right side - Input and Output */}
        <div className="w-1/2 bg-[#1a1a1a] p-16 flex flex-col min-h-screen">
          <div className="flex-1 flex flex-col">
            {/* Text input */}
            <div className="mb-8">
              <label className="block text-sm uppercase tracking-wider text-gray-500 mb-4">
                Input Text
              </label>
              <textarea
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setError(null);
                }}
                placeholder="Enter your text here to classify..."
                rows={8}
                className="w-full p-6 bg-[#2a2d32] border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-gray-700 transition-all resize-none text-lg font-light"
              />
              <div className="flex items-center justify-between mt-3 px-2">
                <span className="text-sm text-gray-600">
                  {text.length} characters
                </span>
                {text.trim() && (
                  <button
                    onClick={() => {
                      setText("");
                      setResult(null);
                      setActiveClassifier(null);
                      setError(null);
                    }}
                    className="text-sm text-gray-500 hover:text-white transition-colors uppercase tracking-wider"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Loading state */}
            {loading && (
              <div className="flex items-center justify-center py-20">
                <div className="w-12 h-12 border-2 border-gray-700 border-t-white rounded-full animate-spin" />
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="p-6 bg-red-900/20 border border-red-900/50 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Results */}
            {!loading && !error && result && (
              <div>
                <label className="block text-sm uppercase tracking-wider text-gray-500 mb-4">
                  Result
                </label>
                {getResultDisplay()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
