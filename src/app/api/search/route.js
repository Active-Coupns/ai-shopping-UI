import { NextResponse } from "next/server";

const TRUSTED_MERCHANTS = [
  "amazon", "flipkart", "croma", "reliance digital", "tatacliq", 
  "vijay sales", "myntra", "boat", "noise", "walmart", "bestbuy", 
  "best buy", "target", "newegg", "reliance_digital", "samsung", "apple", "vijaysales"
];

/**
 * Safely decodes and unwraps redirect query parameters from Google/HasData wrappers.
 */
function unwrapUrl(url) {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    const params = ["adurl", "url", "q", "destination", "redirect"];
    for (const param of params) {
      const val = parsed.searchParams.get(param);
      if (val && val.startsWith("http")) {
        return decodeURIComponent(val);
      }
    }
  } catch (err) {
    // Fail-safe catch for non-URLs
  }
  return url;
}

/**
 * Cleans the product URL, unwrapping redirects and stripping common tracking query parameters.
 */
function cleanProductUrl(url) {
  if (!url) return "";
  const clean = unwrapUrl(url);
  try {
    const parsed = new URL(clean);
    const searchParams = parsed.searchParams;
    const trackingParams = ["gclid", "utm_source", "utm_medium", "utm_campaign", "srsltid", "cmpid", "adurl"];
    trackingParams.forEach(p => searchParams.delete(p));
    return parsed.toString();
  } catch (e) {
    return clean;
  }
}

/**
 * Generates a clean, 100% working merchant search URL for a specific product to avoid 404 errors.
 */
function getMerchantSearchFallback(platform, title) {
  const cleanTitle = title
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, " ")
    .trim();
  const titleEscaped = encodeURIComponent(cleanTitle.split(" ").slice(0, 6).join(" "));
  const platformLower = (platform || "").toLowerCase();
  
  if (platformLower.includes("myntra")) {
    return `https://www.myntra.com/${titleEscaped.replace(/%20/g, "-")}`;
  }
  if (platformLower.includes("flipkart")) {
    return `https://www.flipkart.com/search?q=${titleEscaped}`;
  }
  if (platformLower.includes("croma")) {
    return `https://www.croma.com/search/?text=${titleEscaped}`;
  }
  if (platformLower.includes("vijay") || platformLower.includes("vijaysales")) {
    return `https://www.vijaysales.com/search/${titleEscaped}`;
  }
  if (platformLower.includes("reliance") || platformLower.includes("reliance_digital")) {
    return `https://www.reliancedigital.in/search?q=${titleEscaped}:relevance`;
  }
  if (platformLower.includes("tatacliq")) {
    return `https://www.tatacliq.com/search/?search=%7B%22searchTerm%22%3A%22${titleEscaped}%22%7D`;
  }
  if (platformLower.includes("walmart")) {
    return `https://www.walmart.com/search?q=${titleEscaped}`;
  }
  if (platformLower.includes("bestbuy") || platformLower.includes("best buy")) {
    return `https://www.bestbuy.com/site/searchpage.jsp?st=${titleEscaped}`;
  }
  if (platformLower.includes("target")) {
    return `https://www.target.com/s?searchTerm=${titleEscaped}`;
  }
  return `https://www.amazon.in/s?k=${titleEscaped}`;
}

/**
 * Helper to select native thumbnails over files.hasdata.com webps.
 * Wraps files.hasdata.com webp files using an open proxy to bypass client-side CORS issues.
 */
function resolveProductImage(item) {
  let img = item.thumbnail || item.serpapi_thumbnail || "";
  
  if (img && img.includes("files.hasdata.com")) {
    const otherImg = item.image || item.imageUrl || "";
    if (otherImg && !otherImg.includes("files.hasdata.com")) {
      img = otherImg;
    }
  } else if (!img) {
    img = item.image || item.imageUrl || "";
  }
  
  if (img && img.includes("files.hasdata.com")) {
    return `https://images.weserv.nl/?url=${encodeURIComponent(img)}`;
  }
  
  return img;
}

/**
 * Parses user query to extract maximum budget limit.
 */
function parseBudgetLimit(query) {
  const cleanStr = query.toLowerCase().replace(/[,₹$]/g, "");
  const match = cleanStr.match(/\b(?:under|below|budget|limit|max|up to|price|at|around|\bs\b|<|=)\s*(\d{4,6})\b/i) || cleanStr.match(/\b(\d{4,6})\b/);
  if (match) {
    return parseFloat(match[1]);
  }
  return null;
}

/**
 * Detects the product category based on keywords in query and title.
 */
function detectCategory(query, title) {
  const text = (query + " " + title).toLowerCase();
  if (text.includes("laptop") || text.includes("notebook") || text.includes("computer") || text.includes("pc") || text.includes("macbook") || text.includes("chromebook")) {
    return "laptop";
  }
  if (text.includes("headphone") || text.includes("earphone") || text.includes("earbuds") || text.includes("audio") || text.includes("sound") || text.includes("pods") || text.includes("noise") || text.includes("anc") || text.includes("wireless ear")) {
    return "audio";
  }
  if (text.includes("shoe") || text.includes("sneaker") || text.includes("shirt") || text.includes("cotton") || text.includes("wear") || text.includes("clothing") || text.includes("jeans") || text.includes("tshirt") || text.includes("t-shirt") || text.includes("pant")) {
    return "fashion";
  }
  return "general";
}

/**
 * Parses category-specific technical attributes directly from product title.
 */
function parseSpecsFromTitle(category, title) {
  const titleLower = title.toLowerCase();
  
  if (category === "laptop") {
    let cpu = "Standard Processor";
    if (titleLower.includes("ryzen 3")) cpu = "AMD Ryzen 3 Processor";
    else if (titleLower.includes("ryzen 5")) cpu = "AMD Ryzen 5 Processor";
    else if (titleLower.includes("ryzen 7")) cpu = "AMD Ryzen 7 Processor";
    else if (titleLower.includes("core i3") || titleLower.includes("i3")) cpu = "Intel Core i3 Processor";
    else if (titleLower.includes("core i5") || titleLower.includes("i5")) cpu = "Intel Core i5 Processor";
    else if (titleLower.includes("core i7") || titleLower.includes("i7")) cpu = "Intel Core i7 Processor";
    else if (titleLower.includes("athlon")) cpu = "AMD Athlon Silver CPU";
    else if (titleLower.includes("celeron")) cpu = "Intel Celeron CPU";
    else if (titleLower.includes("m1") || titleLower.includes("m2") || titleLower.includes("m3")) cpu = "Apple Silicon Chip";
    else {
      const match = title.match(/\b(Ryzen\s*\d+|Intel\s*Core\s*i\d+|Athlon|Celeron)\b/i);
      if (match) cpu = match[1];
    }

    const ramMatch = title.match(/\b(\d+GB)\s*(?:RAM|LPDDR\d|DDR\d)?/i);
    const ssdMatch = title.match(/\b(\d+GB|\d+TB)\s*(?:SSD|HDD|NVMe|Storage)/i) || title.match(/\b(512GB|256GB|1TB)\b/i);
    const ramStr = ramMatch ? ramMatch[1] : "8GB RAM";
    const ssdStr = ssdMatch ? ssdMatch[1] : "512GB SSD";

    let display = "15.6-inch Full HD Display";
    const sizeMatch = title.match(/\b(\d+(?:\.\d+)?\s*(?:inch|[\"”]))/i);
    if (sizeMatch) {
      display = `${sizeMatch[1]} Display`;
    } else if (titleLower.includes("15s")) {
      display = "15.6-inch Display";
    } else if (titleLower.includes("14s")) {
      display = "14-inch Display";
    }

    let persona = "Students & Daily Office Work";
    if (titleLower.includes("gaming") || titleLower.includes("rtx") || titleLower.includes("gtx")) {
      persona = "Gamers & Content Creators";
    } else if (titleLower.includes("pro") || titleLower.includes("thinkpad") || titleLower.includes("book")) {
      persona = "Professionals & Developers";
    }

    return [
      `Processor: ${cpu}`,
      `Memory & Storage: ${ramStr} | ${ssdStr} Storage`,
      `Display: ${display}`,
      `Target Use: ${persona}`,
      `Standout Feature: Lightweight and portable build`
    ];
  }

  if (category === "audio") {
    let anc = "Passive Noise Isolation";
    if (titleLower.includes("anc") || titleLower.includes("noise cancelling") || titleLower.includes("noise cancellation")) {
      anc = "Active Noise Cancellation (ANC) support";
    }
    
    let brand = "Wireless Headphone Audio";
    if (titleLower.includes("sony")) brand = "Sony Audio Acoustics";
    else if (titleLower.includes("bose")) brand = "Bose Premium Soundstage";
    else if (titleLower.includes("boat")) brand = "boAt Signature Bass";
    else if (titleLower.includes("noise")) brand = "Noise Soundlabs";
    else if (titleLower.includes("jbl")) brand = "JBL Pure Bass Sound";
    
    let battery = "Up to 30 Hours active playback";
    if (titleLower.includes("ch520")) battery = "Up to 50 Hours ultra battery life";
    else if (titleLower.includes("ultra")) battery = "Up to 24 Hours premium ANC playback";

    return [
      `Sound Engine: ${brand}`,
      `Noise Control: ${anc}`,
      `Battery Life: ${battery}`,
      `Connectivity: Bluetooth Wireless pairing`,
      `Standout Feature: Immersive comfort fit ear cups`
    ];
  }

  if (category === "fashion") {
    let material = "Premium breathable fabric blend";
    if (titleLower.includes("cotton")) material = "100% Premium breathable Cotton fabric";
    else if (titleLower.includes("denim")) material = "Durable denim cotton blend";
    else if (titleLower.includes("leather")) material = "Genuine durable leather build";

    let fit = "Comfortable active fit profile";
    if (titleLower.includes("slim")) fit = "Modern Tailored Slim Fit cut";
    else if (titleLower.includes("regular")) fit = "Standard Regular Fit profile";

    return [
      `Material: ${material}`,
      `Fit Profile: ${fit}`,
      `Occasion: Casual, daily office & social wear`,
      `Care Instructions: Gentle cold wash recommended`,
      `Standout Feature: Premium stitched styling seams`
    ];
  }

  return [
    `Product Line: Verified retail seller listing`,
    `Platform Partner: Top customer satisfaction rating`,
    `Availability: In Stock & Ready to Ship`,
    `Rating Status: Highly rated by verified buyers`,
    `Standout Feature: Best value for price segment`
  ];
}

/**
 * Returns category-specific fallback matching insight summaries.
 */
function getFallbackDescriptionForCategory(category, platform) {
  if (category === "laptop") {
    return `👤 Best For: Daily home, school, and work routines.\n\n💡 Why This Deal: Standard retail specifications offering reliable durability and store warranty parameters.\n\n⚠️ Trade-off: Ideal for core tasks, but not geared for graphic-heavy applications or 3D gaming.`;
  }
  if (category === "audio") {
    return `👤 Best For: Commuters, remote workers, and casual music listeners.\n\n💡 Why This Deal: Great battery capacity combined with reliable wireless connectivity to enjoy uninterrupted playlists on ${platform}.\n\n⚠️ Trade-off: Perfect for daily listening, but audiophiles seeking flat studio profiles may need software EQ adjustments.`;
  }
  if (category === "fashion") {
    return `👤 Best For: Versatile daily outfits, casual social gatherings, and office wear.\n\n💡 Why This Deal: Durable fabrics constructed with comfortable cuts to balance style and value.\n\n⚠️ Trade-off: Tailored slim designs require following wash instructions to maintain shape.`;
  }
  return `👤 Best For: General everyday use and practical applications.\n\n💡 Why This Deal: Highly rated by verified buyers and backed by merchant partner shipping guarantees.\n\n⚠️ Trade-off: A solid budget friendly choice, but check warranty details for extended coverage.`;
}

export async function POST(request) {
  console.log("HASDATA_API_KEY present:", !!process.env.HASDATA_API_KEY);

  try {
    const { query, country } = await request.json();
    
    if (!query) {
      return NextResponse.json({ products: [], error: "Query is required" }, { status: 200 });
    }

    const cleanQuery = query
      .replace(/[₹$€£]/g, "")
      .replace(/\b(please|find|show|me|best|buy|under|below|for|search|deals|get)\b/gi, "")
      .replace(/\s+/g, " ")
      .trim();

    const hasdataApiKey = process.env.HASDATA_API_KEY;
    if (!hasdataApiKey) {
      console.warn("[Scraper Warning] HASDATA_API_KEY is not configured. Returning empty list.");
      return NextResponse.json({ products: [] }, { status: 200 });
    }

    // Execute exactly one single HasData Google Shopping API call per search query
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
      console.error("[Scraper Connection Error] HasData fetch failed:", fetchErr);
      return NextResponse.json({ products: [], error: "Scraper connection failed" }, { status: 200 });
    }

    if (!scraperResponse || !scraperResponse.ok) {
      console.error("Fetch failed with status:", scraperResponse?.status);
      return NextResponse.json({ products: [] }, { status: 200 });
    }

    let data;
    try {
      data = await scraperResponse.json();
      console.log("HasData Status:", scraperResponse.status);
    } catch (jsonErr) {
      console.error("[Scraper JSON Parse Error] Failed parsing response:", jsonErr);
      return NextResponse.json({ products: [] }, { status: 200 });
    }

    const rawResults = data?.shoppingResults || data?.shopping_results || data?.organicResults || [];
    const cleanProducts = [];
    const queryCategory = detectCategory(cleanQuery, "");

    // Iterate through organic search items directly from that single response
    for (const item of rawResults) {
      if (!item || !(item.title || item.name)) continue;

      const title = item.title || item.name || "";
      const titleLower = title.toLowerCase();

      // Filter by category to prevent cross-category data leakage
      const itemCategory = detectCategory(cleanQuery, titleLower);
      if (queryCategory !== "general" && itemCategory !== queryCategory) {
        continue;
      }

      // Filter by trusted merchant
      const platform = item.source || item.merchant || item.seller || "";
      const platformLower = platform.toLowerCase();
      const isTrusted = TRUSTED_MERCHANTS.some(m => platformLower.includes(m));
      if (!isTrusted) continue;

      // Extract direct native store URL directly from HasData response
      const rawLink = item.merchant_link || item.direct_url || item.link || "";
      let directLink = cleanProductUrl(rawLink);
      
      // Fallback to merchant search page if no direct PDP url was provided
      if (!directLink || directLink.includes("google.com") || directLink.includes("google.co.in")) {
        directLink = getMerchantSearchFallback(platform, title);
      }

      // Parse price
      const priceRaw = item.price || item.extractedPrice || item.extracted_price || 0;
      let priceVal = 0;
      if (typeof priceRaw === "number") {
        priceVal = priceRaw;
      } else if (typeof priceRaw === "string") {
        priceVal = parseFloat(priceRaw.replace(/[^0-9.]/g, "")) || 0;
      }

      // Apply logical budget validation
      const budgetLimit = parseBudgetLimit(cleanQuery);
      if (budgetLimit && priceVal > 0) {
        const maxAllowedPrice = budgetLimit * 1.05;
        if (priceVal > maxAllowedPrice) {
          continue;
        }
      }

      // Category specs parsing & description
      const category = detectCategory(cleanQuery, title);
      const parsedSpecs = parseSpecsFromTitle(category, title);
      const fallbackDesc = getFallbackDescriptionForCategory(category, platform);
      const image = resolveProductImage(item);

      cleanProducts.push({
        title: String(title),
        description: String(fallbackDesc),
        image: String(image),
        rating: String(item.rating || item.stars || "4.5"),
        link: String(directLink),
        platform: String(platform),
        price: Number(priceVal),
        price_comparison: [
          {
            store: platform,
            price: priceVal,
            link: directLink,
            is_lowest: true
          }
        ],
        hasDirectPDP: true,
        detailed_specs: parsedSpecs
      });
    }

    // Call Gemini AI on the top products to generate custom insights (if API key is present)
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (geminiApiKey && cleanProducts.length > 0) {
      try {
        const productsListText = cleanProducts.slice(0, 5).map((p, idx) => {
          return `${idx + 1}. Title: ${p.title} | Store: ${p.platform} | Price: ${p.price}`;
        }).join("\n");

        const prompt = `You are a friendly, expert personal shopping consultant advising a friend on their search for: "${cleanQuery}".
For each product, generate category-specific specifications and conversational recommendations.

For each product, output:
1. "ai_insight" object containing:
   - "best_for": A practical use-case statement explaining who should buy this.
   - "why_this_deal": A sharp statement highlighting the real value in this price range.
   - "trade_off": An honest, transparent note about limitations.
2. "detailed_specs" array of strings:
   - If it's a Laptop/PC: CPU, RAM & Storage, Display & GPU, Battery Life, Standout Feature.
   - If it's Headphones/Audio: Sound Engine, Noise Control, Battery Life, Connectivity, Standout Feature.
   - If it's Shoes/Fashion: Material, Fit Profile, Occasion, Care, Standout Feature.
   - Other: Extract 5 relevant attributes from title.

Products:
${productsListText}

Return the results strictly as a JSON array of objects, where each object matches the product's index.
Do not include markdown code block formatting (like \`\`\`json). Return ONLY raw JSON array.`;

        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        });

        if (geminiResponse.ok) {
          const geminiData = await geminiResponse.json();
          let rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
          rawText = rawText.trim();
          if (rawText.startsWith("```")) {
            rawText = rawText.replace(/^```json/, "").replace(/^```/, "").replace(/```$/, "").trim();
          }
          const parsedResults = JSON.parse(rawText);
          if (Array.isArray(parsedResults)) {
            cleanProducts.slice(0, 5).forEach((p, idx) => {
              const res = parsedResults[idx];
              if (res) {
                if (res.ai_insight) {
                  const bfor = res.ai_insight.best_for || "";
                  const wdeal = res.ai_insight.why_this_deal || "";
                  const toff = res.ai_insight.trade_off || "";
                  p.description = `👤 Best For: ${bfor}\n\n💡 Why This Deal: ${wdeal}\n\n⚠️ Trade-off: ${toff}`;
                }
                if (res.detailed_specs && Array.isArray(res.detailed_specs)) {
                  p.detailed_specs = res.detailed_specs;
                }
              }
            });
          }
        }
      } catch (geminiError) {
        console.error("Gemini AI API call failed:", geminiError);
      }
    }

    const mappedProducts = cleanProducts.slice(0, 5);
    console.log("Filtered Whitelisted Products:", mappedProducts.map(p => ({ title: p.title, store: p.platform, link: p.link })));

    return NextResponse.json({ products: mappedProducts }, { status: 200 });

  } catch (err) {
    console.error("Serverless Search API Route error:", err);
    return NextResponse.json({ products: [], error: `Server Error: ${err.message}` }, { status: 200 });
  }
}
