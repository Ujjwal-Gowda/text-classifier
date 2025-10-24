import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000); // ⏱️ 20 seconds
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: "Missing 'text' field" },
        { status: 400 },
      );
    }
    console.log(process.env.HF_TOKEN);
    const res = await fetch(
      "https://router.huggingface.co/hf-inference/models/tabularisai/multilingual-sentiment-analysis",
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: text }),
        method: "POST",
      },
    );
    clearTimeout(timeout);
    if (!res.ok) {
      const errorData = await res.text();
      return NextResponse.json(
        { error: `HF error: ${errorData}` },
        { status: res.status },
      );
    }
    const data = await res.json();
    console.log(data);
    const prediction =
      Array.isArray(data) && Array.isArray(data[0]) ? data[0] : [];
    const top = prediction[0] || { label: "unknown", score: 0 };
    return NextResponse.json({
      sentiment: top.label,
      confidence: top.score,
    });
  } catch (error) {
    if (error.name === "AbortError") {
      return NextResponse.json({ error: "Request timed out" }, { status: 504 });
    }
    console.error("Sentiment analysis  error:", error);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
