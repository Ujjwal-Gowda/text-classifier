import { NextResponse } from "next/server";

export async function POST(req: Request) {
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
      "https://router.huggingface.co/hf-inference/models/papluca/xlm-roberta-base-language-detection",
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: text }),
        method: "POST",
      },
    );
    if (!res.ok) {
      const errorData = await res.text();
      return NextResponse.json(
        { error: `HF error: ${errorData}` },
        { status: res.status },
      );
    }

    const data = await res.json();
    const prediction =
      Array.isArray(data) && Array.isArray(data[0]) ? data[0] : [];
    const top = prediction[0] || { label: "unknown", score: 0 };
    return NextResponse.json({
      language: top.label,
      confidence: top.score,
    });
  } catch (error) {
    console.error("Language detection error:", error);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
