import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return new Response(
        JSON.stringify({ error: "Missing 'text' in request body." }),
        { status: 400 },
      );
    }

    const HF_API_URL =
      "https://api-inference.huggingface.co/models/facebook/bart-large-mnli";
    const HF_API_TOKEN = process.env.HF_TOKEN;

    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: text,
        parameters: {
          candidate_labels: [
            "Technology",
            "Sports",
            "Politics",
            "Health",
            "Business",
            "Entertainment",
            "Education",
            "Environment",
          ],
        },
      }),
    });

    const data = await response.json();
    console.log("HF response:", data);
    const topic = data?.labels?.[0] || "Unknown";
    const confidence = data?.scores?.[0] || null;

    return NextResponse.json({
      topic: topic,
      confidence: confidence,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
