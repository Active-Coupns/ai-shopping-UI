import { NextResponse } from "next";

export async function POST(request) {
  console.log("HASDATA_API_KEY present:", !!process.env.HASDATA_API_KEY);

  try {
    const { query, country } = await request.json();
    
    if (!query) {
      return NextResponse.json({ products: [], error: "Query is required" }, { status: 200 });
    }

    // 1. Sanitize the query keywords (remove currency symbols, extra spacing)
    const cleanQuery = query
      .replace(/[₹$€£]/g, "")
      .replace(/\b(please|find|show|me|best|buy|under|below|for|search|deals|get)\b/gi, "")
      .replace(/\s+/g, " ")
      .trim();

    const hasdataApiKey = process.env.HASDATA_API_KEY;
    if (!hasdataApiKey) {
      return NextResponse.json(
        { products: [], error: "HASDATA_API_KEY is not configured." },
        { status: 200 }
      );
    }

    // 2. Fetch live data from HasData targeting Google Shopping
    const gl = (country || "IN").toLowerCase();
    const domain = gl === "us" ? "google.com" : "google.co.in";
    const hasdataUrl = `https://api.hasdata.com/scrape/google/serp?q=${encodeURIComponent(cleanQuery)}&domain=${domain}&gl=${gl}&tbm=shop&apiKey=${hasdataApiKey}`;

    let scraperResponse;
    try {
      scraperResponse = await fetch(hasdataUrl, {
        method: "GET",
        headers: {
          "x-api-key": hasdataApiKey,
          "Content-Type": "application/json"
        }
      });
    } catch (fetchErr) {
      console.error("[Scraper Connection Error] HasData fetch threw:", fetchErr);
      return NextResponse.json(
        { products: [], error: fetchErr.message || "Scraper connection failed" },
        { status: 200 }
      );
    }

    if (!scraperResponse || !scraperResponse.ok) {
      const errorText = scraperResponse ? await scraperResponse.text() : "No response object";
      console.error("Fetch failed with status:", scraperResponse?.status, errorText);
      return NextResponse.json(
        { products: [], error: errorText },
        { status: 200 }
      );
    }

    let data;
    try {
      data = await scraperResponse.json();
    } catch (jsonErr) {
      console.error("[Scraper JSON Parse Error] Failed parsing response:", jsonErr);
      return NextResponse.json(
        { products: [], error: "Invalid JSON response from Scraper API" },
        { status: 200 }
      );
    }

    const rawResults = data?.shoppingResults || data?.shopping_results || data?.organicResults || data?.organic_results || [];

    // 3. Map into clean array containing strictly the exact 6 fields and filter invalid items
    const cleanProducts = rawResults
      .map(item => {
        if (!item) return null;
        return {
          title: item.title || item.name || "",
          description: item.snippet || item.description || "Great value product matching your search query.",
          image: item.thumbnail || item.image || "",
          rating: String(item.rating || item.stars || "4.5"),
          link: item.link || item.product_link || "",
          platform: item.source || item.merchant || "Online Store"
        };
      })
      .filter(p => p !== null && p.title && p.link && p.image);

    // 4. Return clean JSON response
    return NextResponse.json({ products: cleanProducts }, { status: 200 });

  } catch (err) {
    console.error("Serverless Search API Route error:", err);
    return NextResponse.json(
      { products: [], error: `Server Error: ${err.message}` },
      { status: 200 }
    );
  }
}
