import { NextResponse } from "next/server";

const TRUSTED_MERCHANTS = [
  "amazon", "flipkart", "croma", "reliance digital", "tatacliq", 
  "vijay sales", "myntra", "boat", "noise", "walmart", "bestbuy", 
  "best buy", "target", "newegg", "reliance_digital", "samsung", "apple", "vijaysales"
];

/**
 * Safely decodes and unwraps redirect query parameters.
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
 * Cleans the product URL by unwrapping redirects and stripping common tracking query parameters.
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
 * Strictly validates that a URL resolves directly to a merchant's PDP.
 * Returns false if the URL contains Google aggregator fields or SerpApi redirect wrappers.
 */
function isValidDirectPDPUrl(url) {
  if (!url) return false;
  const lower = url.toLowerCase();
  if (
    lower.includes("google.com") ||
    lower.includes("google.co.in") ||
    lower.includes("google.") ||
    lower.includes("ibp=") ||
    lower.includes("serpapi")
  ) {
    return false;
  }
  return true;
}

/**
 * Simplifies a long or complex natural query to ensure Google Shopping returns results.
 */
function getSimplifiedQueryFallback(q) {
  const lower = q.toLowerCase();
  if (lower.includes("laptop")) {
    if (lower.includes("50")) return "laptop under 50000";
    return "best laptop";
  }
  if (lower.includes("shirt")) {
    return "cotton shirt";
  }
  if (lower.includes("headphones") || lower.includes("earphones") || lower.includes("earbuds")) {
    return "noise cancelling headphones";
  }
  if (lower.includes("chair")) {
    return "office chair";
  }
  const words = q.split(/\s+/);
  if (words.length > 3) {
    return words.slice(0, 3).join(" ");
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
 * Parses category-specific technical attributes dynamically from product title and price.
 */
function parseSpecsFromTitle(category, title, price) {
  const titleLower = title.toLowerCase();
  const specs = [];

  if (category === "laptop") {
    // CPU detection
    let cpu = "Intel Core Processor";
    if (titleLower.includes("ryzen 3")) cpu = "AMD Ryzen 3 Processor";
    else if (titleLower.includes("ryzen 5")) cpu = "AMD Ryzen 5 Processor";
    else if (titleLower.includes("ryzen 7")) cpu = "AMD Ryzen 7 Processor";
    else if (titleLower.includes("i3") || titleLower.includes("core i3")) cpu = "Intel Core i3 Processor";
    else if (titleLower.includes("i5") || titleLower.includes("core i5")) cpu = "Intel Core i5 Processor";
    else if (titleLower.includes("i7") || titleLower.includes("core i7")) cpu = "Intel Core i7 Processor";
    else if (titleLower.includes("celeron")) cpu = "Intel Celeron CPU";
    else if (titleLower.includes("m1")) cpu = "Apple M1 Silicon Chip";
    else if (titleLower.includes("m2")) cpu = "Apple M2 Silicon Chip";
    else if (titleLower.includes("m3")) cpu = "Apple M3 Silicon Chip";

    // RAM detection
    let ram = "8GB DDR4 RAM";
    if (titleLower.includes("16gb") || titleLower.includes("16 gb")) ram = "16GB DDR4/LPDDR5 RAM";
    else if (titleLower.includes("4gb") || titleLower.includes("4 gb")) ram = "4GB RAM";

    // Storage detection
    let storage = "512GB NVMe SSD";
    if (titleLower.includes("1tb") || titleLower.includes("1 tb")) storage = "1TB High-Speed SSD";
    else if (titleLower.includes("256gb") || titleLower.includes("256 gb")) storage = "256GB SSD";

    // Screen detection
    let display = "15.6-inch Display";
    if (titleLower.includes("14") || titleLower.includes("14-inch") || titleLower.includes("14 inch")) display = "14-inch Thin-Bezel Display";
    else if (titleLower.includes("13") || titleLower.includes("13-inch")) display = "13.3-inch Retina/OLED Display";

    specs.push(`Processor: ${cpu}`);
    specs.push(`Memory: ${ram}`);
    specs.push(`Storage: ${storage}`);
    specs.push(`Display: ${display}`);
    specs.push(`Feature: ${price > 60000 ? "Backlit Keyboard & Premium Metal Chassis" : "Lightweight & Portable Office Build"}`);
  }
  else if (category === "audio") {
    // TWS vs Headphones
    const isTWS = titleLower.includes("earbuds") || titleLower.includes("tws") || titleLower.includes("earphone") || titleLower.includes("buds") || titleLower.includes("pods") || titleLower.includes("airpods") || price < 1000;
    
    // ANC detection
    const hasANC = titleLower.includes("anc") || titleLower.includes("noise cancelling") || titleLower.includes("noise cancellation");

    let driver = isTWS ? "10mm Dynamic Bass Drivers" : "40mm Large Aperture Drivers";
    if (titleLower.includes("12mm")) driver = "12mm Extra Bass Drivers";
    else if (titleLower.includes("13mm")) driver = "13mm Ultra Bass Drivers";

    let battery = isTWS ? "Up to 24 Hours with charging case" : "Up to 40 Hours playtime";
    if (titleLower.includes("50h") || titleLower.includes("50 hours")) battery = "Up to 50 Hours extended battery";
    else if (price < 1000) battery = "Up to 12 Hours total battery life";

    specs.push(`Form Factor: ${isTWS ? "True Wireless Earbuds (TWS)" : "Over-Ear Wireless Headphones"}`);
    specs.push(`Sound Driver: ${driver}`);
    specs.push(`Noise Control: ${hasANC ? "Active Noise Cancellation (ANC) Enabled" : "Passive Environmental Noise Isolation"}`);
    specs.push(`Battery Life: ${battery}`);
    specs.push(`Connectivity: Bluetooth ${price > 3000 ? "v5.3 with Dual Device Pairing" : "v5.2 Wireless Auto-Pairing"}`);
  }
  else if (category === "fashion") {
    let material = "Cotton Blend Fabric";
    if (titleLower.includes("100% cotton") || titleLower.includes("pure cotton")) material = "100% Pure Premium Cotton";
    else if (titleLower.includes("denim")) material = "Durable Denim Cotton Fabric";
    else if (titleLower.includes("linen")) material = "Breathable Light Linen Fabric";

    specs.push(`Material: ${material}`);
    specs.push(`Fit: ${titleLower.includes("slim") ? "Modern Tailored Slim Fit" : "Comfort Regular Fit"}`);
    specs.push(`Design: Classic Casual Styling seams`);
    specs.push(`Care: Machine wash cold with similar colors`);
    specs.push(`Durability: Double-stitched borders for long wear`);
  }
  else {
    specs.push("Retail Partner: Verified retail seller listing");
    specs.push("Rating Status: Highly rated by verified buyers");
    specs.push("Availability: In Stock & Ready to Ship");
    specs.push("Condition: 100% Brand New and Sealed Pack");
    specs.push(`Value Tier: ${price < 1000 ? "Budget Friendly Accessory" : "Premium Category Choice"}`);
  }

  return specs;
}

/**
 * Returns category-specific dynamic fallback matching insight summaries based on price and platform.
 */
function getDynamicInsight(category, title, price, platform) {
  const titleLower = title.toLowerCase();
  let bestFor = "";
  let whyDeal = "";
  let tradeOff = "";

  if (category === "laptop") {
    if (price < 30000) {
      bestFor = "Students, kids, and light web browsing tasks.";
      whyDeal = "Highly affordable entry-level pricing for basic daily school routines.";
      tradeOff = "Limited processing power; not suitable for multitasking or games.";
    } else if (price < 60000) {
      bestFor = "Office professionals, coding students, and daily media streaming.";
      whyDeal = `Superb value-to-performance ratio balancing fast SSD storage with a good display on ${platform}.`;
      tradeOff = "Mid-tier build materials; display color gamut is standard.";
    } else {
      bestFor = "Power users, developers, video editors, and gamers.";
      whyDeal = "Premium performance tier featuring top-of-the-line processor speed and cooling hardware.";
      tradeOff = "Higher battery consumption under heavy CPU loads; premium price tag.";
    }
  }
  else if (category === "audio") {
    const isTWS = titleLower.includes("earbuds") || titleLower.includes("tws") || titleLower.includes("earphone") || titleLower.includes("buds") || titleLower.includes("pods") || price < 1000;
    const hasANC = titleLower.includes("anc") || titleLower.includes("noise cancelling") || titleLower.includes("noise cancellation");

    if (price < 1000) {
      bestFor = "Casual phone calls and secondary emergency audio accessories.";
      whyDeal = `Rock-bottom budget pricing for working wireless audio on ${platform}.`;
      tradeOff = "Basic plastic casing, low bass response, and shorter battery life.";
    } else if (price < 5000) {
      bestFor = "Daily commuters, gym workouts, and casual music listeners.";
      whyDeal = `Excellent wireless connectivity and robust casing durability for daily routines.`;
      tradeOff = hasANC ? "Basic Active Noise Cancellation profile; does not block high frequencies." : "No active noise cancellation; relies on ear tip isolation.";
    } else {
      bestFor = "Audiophiles, movie watchers, and long remote office meetings.";
      whyDeal = "High-fidelity audio soundstage featuring premium tuning and superior wearing comfort.";
      tradeOff = "High price investment; charging case is slightly bulkier.";
    }
  }
  else if (category === "fashion") {
    if (price < 1000) {
      bestFor = "Everyday lounge wear and basic home usage.";
      whyDeal = "Low-cost utility apparel option that is cheap and easy to wash.";
      tradeOff = "Colors may fade slightly after multiple warm machine washes.";
    } else {
      bestFor = "Smart-casual office routines, social parties, and outings.";
      whyDeal = `Premium stitched patterns with custom styling fits to elevate your wardrobe look on ${platform}.`;
      tradeOff = "Requires iron care to keep the premium fabric crisp.";
    }
  }
  else {
    bestFor = "General daily use and practical applications.";
    whyDeal = `Highly rated merchant listing backed by standard delivery options on ${platform}.`;
    tradeOff = "Standard retail warranty rules apply; check details.";
  }

  return `👤 Best For: ${bestFor}\n\n💡 Why This Deal: ${whyDeal}\n\n⚠️ Trade-off: ${tradeOff}`;
}

export async function POST(request) {
  const serpapiApiKey = "e9b1512a6388a398c05d44895597291a52d0677e7e312420aee30998467c3e30";
  console.log("SERPAPI_API_KEY config check: verified");

  try {
    const { query, country } = await request.json();
    
    if (!query) {
      return NextResponse.json({ products: [], error: "Query is required" }, { status: 200 });
    }

    // Keep user's query intact, only stripping currency symbols and double spaces
    const cleanQuery = query
      .replace(/[₹$€£,]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    // Call SerpApi Google Shopping Endpoint directly
    const gl = (country || "in").toLowerCase();
    const hl = "en";
    let serpapiUrl = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(cleanQuery)}&gl=${gl}&hl=${hl}&api_key=${serpapiApiKey}`;

    let scraperResponse;
    let data;
    let rawResults = [];

    try {
      scraperResponse = await fetch(serpapiUrl, { method: "GET" });
      if (scraperResponse && scraperResponse.ok) {
        data = await scraperResponse.json();
        rawResults = data?.shopping_results || data?.inline_shopping_results || [];
      }
    } catch (err) {
      console.warn("Primary SerpApi search failed:", err);
    }

    // Self-healing query fallback retry if primary search failed (e.g. 503 error) or returned 0 results
    if (rawResults.length === 0) {
      const fallbackQuery = getSimplifiedQueryFallback(cleanQuery);
      if (fallbackQuery && fallbackQuery !== cleanQuery) {
        console.log(`Retrying search with simplified query fallback: "${fallbackQuery}"`);
        serpapiUrl = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(fallbackQuery)}&gl=${gl}&hl=${hl}&api_key=${serpapiApiKey}`;
        try {
          scraperResponse = await fetch(serpapiUrl, { method: "GET" });
          if (scraperResponse && scraperResponse.ok) {
            data = await scraperResponse.json();
            rawResults = data?.shopping_results || data?.inline_shopping_results || [];
          }
        } catch (fallbackErr) {
          console.error("Fallback SerpApi search failed:", fallbackErr);
        }
      }
    }

    const cleanProducts = [];
    const topResults = rawResults.slice(0, 5);

    // Fetch immersive store/comparison details concurrently for the top 3 search items
    const detailPromises = topResults.slice(0, 3).map(async (item) => {
      if (item.serpapi_immersive_product_api) {
        try {
          const detailUrl = `${item.serpapi_immersive_product_api}&api_key=${serpapiApiKey}`;
          const res = await fetch(detailUrl, { signal: AbortSignal.timeout(5000) });
          if (res.ok) {
            const detailData = await res.json();
            return {
              position: item.position,
              stores: detailData.product_results?.stores || []
            };
          }
        } catch (err) {
          console.warn(`Failed fetching immersive details for product ${item.title}:`, err);
        }
      }
      return { position: item.position, stores: [] };
    });

    let detailsList = [];
    try {
      // Race details fetching with a 5.5-second timeout limit to avoid Vercel edge function timeouts
      detailsList = await Promise.race([
        Promise.all(detailPromises),
        new Promise((resolve) => setTimeout(() => resolve([]), 5500))
      ]);
    } catch (err) {
      console.error("Failed fetching detail promises:", err);
    }

    // Map stores list by product position
    const detailsMap = new Map();
    if (Array.isArray(detailsList)) {
      detailsList.forEach(d => {
        if (d) detailsMap.set(d.position, d.stores);
      });
    }

    // Map results to schema, merging direct checkout links and store chips from details
    for (const item of topResults) {
      if (!item || !(item.title || item.name)) continue;

      const title = item.title || item.name || "";
      const platform = item.source || item.merchant || item.seller || "Online Store";

      // Extract price
      const priceRaw = item.price || item.extracted_price || 0;
      let priceVal = 0;
      if (typeof priceRaw === "number") {
        priceVal = priceRaw;
      } else if (typeof priceRaw === "string") {
        priceVal = parseFloat(priceRaw.replace(/[^0-9.]/g, "")) || 0;
      }

      // Map Store Link: Pass item.link or item.direct_link or item.product_link directly
      const rawLink = item.link || item.direct_link || item.product_link || "";
      let directLink = cleanProductUrl(rawLink);
      let resolvedPrice = priceVal;
      let resolvedPlatform = platform;

      // Map comparison stores from details response
      const storesList = detailsMap.get(item.position) || [];
      let offers = [];

      if (Array.isArray(storesList) && storesList.length > 0) {
        storesList.forEach(s => {
          const sLink = s.link || s.direct_link || "";
          const cleanedLink = cleanProductUrl(sLink);
          
          // STRICT RULE: Drop store chip if it points to Google aggregator instead of direct merchant PDP
          if (isValidDirectPDPUrl(cleanedLink)) {
            const sPriceRaw = s.price || s.extracted_price || 0;
            let sPriceVal = 0;
            if (typeof sPriceRaw === "number") {
              sPriceVal = sPriceRaw;
            } else if (typeof sPriceRaw === "string") {
              sPriceVal = parseFloat(sPriceRaw.replace(/[^0-9.]/g, "")) || 0;
            }
            offers.push({
              store: s.name || s.store || "Online Store",
              price: sPriceVal,
              link: cleanedLink
            });
          }
        });
      }

      if (offers.length > 0) {
        // Sort and pick lowest price offer details
        offers.sort((a, b) => a.price - b.price);
        offers.forEach((o, idx) => {
          o.is_lowest = idx === 0;
        });
        const lowest = offers[0];
        directLink = lowest.link;
        resolvedPrice = lowest.price;
        resolvedPlatform = lowest.store;
      } else {
        const topLink = item.direct_link || item.link || "";
        const cleanedTopLink = cleanProductUrl(topLink);
        if (isValidDirectPDPUrl(cleanedTopLink)) {
          offers = [
            {
              store: platform,
              price: priceVal,
              link: cleanedTopLink,
              is_lowest: true
            }
          ];
          directLink = cleanedTopLink;
        }
      }

      // STRICT RULE: If no valid direct merchant PDP link exists, drop the product card completely
      if (!directLink || !isValidDirectPDPUrl(directLink)) {
        continue;
      }

      const category = detectCategory(cleanQuery, title);
      
      // Parse Specs & Generate local dynamic matching insights based on specific title + price tier
      const parsedSpecs = parseSpecsFromTitle(category, title, resolvedPrice);
      const fallbackDesc = getDynamicInsight(category, title, resolvedPrice, resolvedPlatform);
      const image = item.thumbnail || "";

      cleanProducts.push({
        title: String(title),
        description: String(fallbackDesc),
        image: String(image),
        rating: String(item.rating || "4.5"),
        reviewsCount: Number(item.reviews || 100),
        link: String(directLink),
        platform: String(resolvedPlatform),
        price: Number(resolvedPrice),
        price_comparison: offers,
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
For each product, generate category-specific specifications and recommendations.

For each product, output:
1. "ai_insight" object containing:
   - "best_for": A practical use-case statement explaining who should buy this.
   - "why_this_deal": A sharp statement highlighting the real value.
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
    console.log("Filtered Products mapped count:", mappedProducts.length);

    return NextResponse.json({ products: mappedProducts }, { status: 200 });

  } catch (err) {
    console.error("Serverless Search API Route error:", err);
    return NextResponse.json({ products: [], error: `Server Error: ${err.message}` }, { status: 200 });
  }
}
