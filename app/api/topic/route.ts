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
            "Science",
            "Sports",
            "Politics",
            "Health",
            "Business",
            "Entertainment",
            "Education",
            "Environment",
            "General",
            "Greeting",
            "Finance",
            "Economy",
            "Artificial Intelligence",
            "Cybersecurity",
            "Startups",
            "Gaming",
            "Movies",
            "Music",
            "Travel",
            "Food",
            "Lifestyle",
            "Fashion",
            "Art",
            "History",
            "Culture",
            "Religion",
            "Space",
            "Climate Change",
            "Social Issues",
            "Technology News",
            "Productivity",
            "Programming",
            "Hardware",
            "Software",
            "Mobile",
            "Education Policy",
            "Online Learning",
            "Sports Events",
            "Fitness",
            "Mental Health",
            "Medicine",
            "Public Policy",
            "Crime",
            "Weather",
            "World News",
            "Local News",
            "Humor",
            "Motivation",
            "Relationships",
            "Career",
            "Finance Tips",
            "Real Estate",
            "Cryptocurrency",
            "Stock Market",
            "Economics",
          ],
        },
      }),
    });

    const data = await response.json();
    console.log("HF response:", data);
    const topic = data?.labels?.[0] || "Unknown";
    const confidence = data?.scores?.[0] || null;
    console.log(topic, confidence);

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
