import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { query, country } = await request.json();
    
    const gatewayUrl = (process.env.NEXT_PUBLIC_GATEWAY_URL || "https://ai-shopping-ucde.onrender.com").trim();
    const apiKey = (() => {
      const k = process.env.NEXT_PUBLIC_GATEWAY_API_KEY;
      return (k && k.trim() !== "") ? k.trim() : "gw_49219b7938a801d920087bc153c6ec2b";
    })();

    const response = await fetch(`${gatewayUrl}/v1/search`, {
      method: "POST",
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: query || "Best laptop under ₹50,000 for coding & gaming",
        country: country || "IN",
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json(
        { error: `Gateway search failed: ${errText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API proxy search route error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
