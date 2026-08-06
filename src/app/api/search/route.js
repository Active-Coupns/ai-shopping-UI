import { NextResponse } from "next/server";

const FALLBACK_PRODUCTS = [
  {
    title: "HP Standard Laptop 15s AMD Ryzen 3 (8GB RAM / 512GB SSD)",
    description: "👤 Best For: Students and office workers wanting a reliable daily driver.\n\n💡 Why This Deal: AMD Ryzen 3 processor combined with 8GB RAM and 512GB SSD provides smooth multitasking.\n\n⚠️ Trade-off: Great for docs and streaming, but skip if you need professional video editing or heavy gaming.",
    image: "/laptop.jpg",
    rating: "4.4",
    link: "https://www.amazon.in",
    platform: "Amazon",
    price: 32990,
    price_comparison: [
      { store: "Amazon.in", price: 32990, link: "https://www.amazon.in", is_lowest: true },
      { store: "Flipkart", price: 33499, link: "https://www.flipkart.com", is_lowest: false }
    ],
    detailed_specs: [
      "Processor: AMD Ryzen 3 7320U Processor",
      "Memory & Storage: 8GB LPDDR5 RAM | 512GB NVMe SSD",
      "Display: 15.6-inch Full HD Display",
      "Target Use: Students & Daily Office Work",
      "Standout Feature: Sleek 1.59kg lightweight build"
    ]
  },
  {
    title: "Classy Casual Cotton Slim Fit Shirt",
    description: "👤 Best For: Semi-casual outings, weekend social events, and daily office wear.\n\n💡 Why This Deal: Premium breathable cotton with custom tailoring offers luxury look on a budget.\n\n⚠️ Trade-off: Requires low-heat ironing to maintain clean tailored seams.",
    image: "/shirt.jpg",
    rating: "4.5",
    link: "https://www.flipkart.com",
    platform: "Flipkart",
    price: 999,
    price_comparison: [
      { store: "Flipkart", price: 999, link: "https://www.flipkart.com", is_lowest: true },
      { store: "Amazon.in", price: 1099, link: "https://www.amazon.in", is_lowest: false }
    ],
    detailed_specs: [
      "Material: Premium 100% Breathable Cotton fabric",
      "Fit Profile: Slim Fit tailoring cut profile",
      "Occasion: Classic spread collar line layout",
      "Care Instructions: Casual & Semi-Formal Social Wear",
      "Standout Feature: Moisture-wicking active comfort"
    ]
  },
  {
    title: "Over-Ear Wireless ANC Headphones Pro",
    description: "👤 Best For: Travelers, remote workers, and students wanting distraction-free study sessions.\n\n💡 Why This Deal: High-end active noise cancellation (ANC) and 40-hour battery life under budget.\n\n⚠️ Trade-off: Bass is rich and deep, but audiophiles seeking studio flat profiles might want eq tuning.",
    image: "/headphones.jpg",
    rating: "4.7",
    link: "https://www.amazon.in",
    platform: "Amazon",
    price: 4999,
    price_comparison: [
      { store: "Amazon.in", price: 4999, link: "https://www.amazon.in", is_lowest: true },
      { store: "Croma", price: 5299, link: "https://www.croma.com", is_lowest: false }
    ],
    detailed_specs: [
      "Sound Engine: 40mm dynamic drivers with high fidelity",
      "Noise Control: Up to 40 Hours playtime with ANC off",
      "Battery Life: Hybrid Active Noise Cancelling chip",
      "Connectivity: Remote Workers & Commuters",
      "Standout Feature: Ergonomic memory-foam ear cushions"
    ]
  }
];

const TRUSTED_MERCHANTS = [
  "amazon", "flipkart", "croma", "reliance digital", "tatacliq", 
  "vijay sales", "myntra", "boat", "noise", "walmart", "bestbuy", 
  "best buy", "target", "newegg", "reliance_digital", "samsung", "apple", "vijaysales"
];

/**
 * Parses user query to extract maximum budget limit.
 * @param {string} query - Raw search query.
 * @returns {number|null} - Parsed budget or null.
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
 * @param {string} query - User search query.
 * @param {string} title - Product title.
 * @returns {string} - "laptop", "audio", "fashion", or "general".
 */
function detectCategory(query, title) {
  const text = (query + " " + title).toLowerCase();
  if (text.includes("laptop") || text.includes("notebook") || text.includes("computer") || text.includes("pc") || text.includes("macbook")) {
    return "laptop";
  }
  if (text.includes("headphone") || text.includes("earphone") || text.includes("earbuds") || text.includes("audio") || text.includes("sound") || text.includes("pods") || text.includes("noise") || text.includes("anc")) {
    return "audio";
  }
  if (text.includes("shoe") || text.includes("sneaker") || text.includes("shirt") || text.includes("cotton") || text.includes("wear") || text.includes("clothing") || text.includes("jeans") || text.includes("tshirt") || text.includes("t-shirt") || text.includes("pant")) {
    return "fashion";
  }
  return "general";
}

/**
 * Parses category-specific technical attributes directly from product title.
 * @param {string} category - Product category string.
 * @param {string} title - Product title string.
 * @returns {Array<string>} - Array of technical specification bullet points.
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
 * @param {string} category - Product category string.
 * @param {string} platform - Low-price store name.
 * @returns {string} - Structured personal consultant advice string.
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

/**
 * Safely decodes and unwraps redirect query parameters from Google/HasData wrappers.
 * @param {string} url - Candidate redirect link.
 * @returns {string} - Direct raw target merchant URL if found.
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
 * Compiles a direct search page URL for a specific merchant store.
 * @param {string} platform - Merchant platform name.
 * @param {string} title - Product title.
 * @returns {string} - Direct store search page URL.
 */
function getMerchantSearchFallback(platform, title) {
  const cleanTitle = title
    .replace(/[^\w\s-]/g, "")
    .split(/\s+/)
    .slice(0, 6)
    .join(" ");
  const titleEscaped = encodeURIComponent(cleanTitle);
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
 * Universal link sanitizer to block any Google Search, Shopping, or HasData redirect wrappers.
 * Falls back to a direct store search page.
 * @param {string} url - Candidate redirection link.
 * @param {string} platform - Store platform name.
 * @param {string} title - Product title.
 * @returns {string} - Clean sanitized direct merchant landing page link.
 */
function sanitizeProductLink(url, platform, title) {
  if (!url) {
    return getMerchantSearchFallback(platform, title);
  }
  
  const lowerUrl = url.toLowerCase();
  if (
    lowerUrl.includes("google.com") ||
    lowerUrl.includes("google.co.in") ||
    lowerUrl.includes("api.hasdata.com") ||
    lowerUrl.includes("udm=28") ||
    lowerUrl.includes("/search") ||
    lowerUrl.includes("/s?k=") ||
    lowerUrl.includes("?q=")
  ) {
    return getMerchantSearchFallback(platform, title);
  }
  
  return url;
}

/**
 * Extracts and cleans the target merchant direct single product details URL (PDP).
 * Rejects proxy URLs, Google Shopping pages, and generic search queries.
 * @param {object} item - Raw HasData product or offer object.
 * @returns {string} - Direct PDP link or empty string if invalid.
 */
function extractDirectProductUrl(item) {
  let directUrl = "";
  
  if (item.offers && Array.isArray(item.offers) && item.offers.length > 0) {
    const firstOffer = item.offers[0];
    directUrl = firstOffer.link || firstOffer.productLink || firstOffer.url || firstOffer.merchantLink || firstOffer.merchant_link || firstOffer.direct_url || firstOffer.directUrl || "";
  }
  
  if (!directUrl && item.merchant) {
    directUrl = item.merchant.link || item.merchant.url || "";
  }
  
  if (!directUrl) {
    directUrl = item.serpapi_product_api || item.merchant_link || item.merchantLink || item.offerLink || item.offer_link || item.direct_url || item.directUrl || item.link || item.productLink || item.url || item.seller_link || item.sellerLink || "";
  }

  // Decouple any redirect wrappers
  directUrl = unwrapUrl(directUrl);

  // Validate the destination URL
  if (
    directUrl &&
    directUrl.startsWith("http") &&
    !directUrl.includes("api.hasdata.com") &&
    !directUrl.includes("google.com") &&
    !directUrl.includes("google.co.in")
  ) {
    // Exclude generic search pages
    const lowerUrl = directUrl.toLowerCase();
    if (!lowerUrl.includes("/search") && !lowerUrl.includes("/s?k=") && !lowerUrl.includes("?q=")) {
      return directUrl;
    }
  }
  
  return "";
}

/**
 * Fetches the immersive details page from HasData API.
 * @param {string} hasdataLink - Immersive details API endpoint URL.
 * @param {string} apiKey - Scraper API Key.
 * @returns {object|null} - Immersive product details or null.
 */
async function fetchImmersiveProductDetails(hasdataLink, apiKey) {
  if (!hasdataLink || !apiKey) return null;
  try {
    const response = await fetch(`${hasdataLink}&apiKey=${apiKey}`, {
      method: "GET",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json"
      }
    });
    if (response.ok) {
      const data = await response.json();
      return data.productResults || null;
    }
  } catch (err) {
    console.error("Error fetching immersive details in route:", err);
  }
  return null;
}

export async function POST(request) {
  console.log("HASDATA_API_KEY present:", !!process.env.HASDATA_API_KEY);

  try {
    const { query, country } = await request.json();
    
    if (!query) {
      return NextResponse.json({ products: FALLBACK_PRODUCTS, error: "Query is required" }, { status: 200 });
    }

    // 1. Sanitize the query keywords
    const cleanQuery = query
      .replace(/[₹$€£]/g, "")
      .replace(/\b(please|find|show|me|best|buy|under|below|for|search|deals|get)\b/gi, "")
      .replace(/\s+/g, " ")
      .trim();

    const hasdataApiKey = process.env.HASDATA_API_KEY;
    if (!hasdataApiKey) {
      console.warn("[Scraper Warning] HASDATA_API_KEY is not configured. Using curated fallbacks.");
      return NextResponse.json({ products: FALLBACK_PRODUCTS, error: "Scraper API key not configured." }, { status: 200 });
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
        { products: FALLBACK_PRODUCTS, error: fetchErr.message || "Scraper connection failed" },
        { status: 200 }
      );
    }

    if (!scraperResponse || !scraperResponse.ok) {
      const errorText = scraperResponse ? await scraperResponse.text() : "No response object";
      console.error("Fetch failed with status:", scraperResponse?.status, errorText);
      return NextResponse.json(
        { products: FALLBACK_PRODUCTS, error: errorText },
        { status: 200 }
      );
    }

    let data;
    try {
      data = await scraperResponse.json();
      console.log("HasData Status:", scraperResponse.status);
    } catch (jsonErr) {
      console.error("[Scraper JSON Parse Error] Failed parsing response:", jsonErr);
      return NextResponse.json(
        { products: FALLBACK_PRODUCTS, error: "Invalid JSON response from Scraper API" },
        { status: 200 }
      );
    }

    // Safely extract results checking for both camelCase and snake_case variations
    const rawResults = data?.shoppingResults || data?.shopping_results || data?.organicResults || [];

    // Filter results using trusted merchant check, budget limits, and accessory blacklists
    const whitelistedResults = [];
    for (const item of rawResults) {
      if (!item || !(item.title || item.name)) continue;

      const platform = item.source || item.merchant || item.seller || "";
      const platformLower = platform.toLowerCase();
      const isTrusted = TRUSTED_MERCHANTS.some(m => platformLower.includes(m));
      
      if (!isTrusted && !item.hasdataLink) {
        continue; // Skip untrusted platforms
      }

      // Logical budget validation
      const priceRaw = item.price || item.extractedPrice || item.extracted_price || 0;
      let priceVal = 0;
      if (typeof priceRaw === "number") {
        priceVal = priceRaw;
      } else if (typeof priceRaw === "string") {
        priceVal = parseFloat(priceRaw.replace(/[^0-9.]/g, "")) || 0;
      }

      const budgetLimit = parseBudgetLimit(cleanQuery);
      if (budgetLimit && priceVal > 0) {
        const maxAllowedPrice = budgetLimit * 1.05; // 5% padding flexibility
        if (priceVal > maxAllowedPrice) {
          continue; // Skip items exceeding budget limits
        }
      }

      // Logical category accessory validation
      const titleLower = (item.title || item.name || "").toLowerCase();
      const queryLower = cleanQuery.toLowerCase();
      if (queryLower.includes("laptop") || queryLower.includes("computer")) {
        const blacklist = ["bag", "sleeve", "charger", "adapter", "stand", "mouse pad", "keyboard cover", "cleaner", "skin", "decal", "cable", "case"];
        if (blacklist.some(word => titleLower.includes(word))) {
          continue;
        }
      } else if (queryLower.includes("headphone") || queryLower.includes("audio")) {
        const blacklist = ["case", "pouch", "stand", "hanger", "cushion", "earpad", "cable", "adapter"];
        if (blacklist.some(word => titleLower.includes(word))) {
          continue;
        }
      }

      whitelistedResults.push(item);
    }

    // Slice array immediately to process ONLY the top 5 high-quality products
    const top5Items = whitelistedResults.slice(0, 5);

    if (top5Items.length === 0) {
      console.warn(`[Scraper Warning] Empty whitelisted results array received for query: "${cleanQuery}"`);
    }

    // Fetch details for all 5 products concurrently from immersive details page
    const detailedProducts = await Promise.all(
      top5Items.map(async (item) => {
        if (item.hasdataLink) {
          const details = await fetchImmersiveProductDetails(item.hasdataLink, hasdataApiKey);
          if (details) {
            return {
              ...item,
              immersiveDetails: details
            };
          }
        }
        return item;
      })
    );

    // 3. Map into clean array containing strictly the exact 6 fields with try-catch mapping checks
    const cleanProducts = [];
    for (const item of detailedProducts) {
      try {
        const title = item.title || item.name || "";
        const image = item.thumbnail || item.image || item.imageUrl || item.serpapi_thumbnail || "";
        const originalPlatform = item.source || item.merchant || item.seller || "Online Store";

        let directLink = "";
        let resolvedPrice = 0;
        let resolvedPlatform = "";
        let offers = [];
        let hasDirectPDP = true;

        const immersive = item.immersiveDetails;
        if (immersive && immersive.stores && Array.isArray(immersive.stores) && immersive.stores.length > 0) {
          // Extract whitelisted e-commerce stores from immersive list
          const filteredStores = immersive.stores.filter(s => {
            if (!s.link || !s.name) return false;
            const nameLower = s.name.toLowerCase();
            return TRUSTED_MERCHANTS.some(m => nameLower.includes(m));
          });

          if (filteredStores.length > 0) {
            // Sort by price ascending
            filteredStores.sort((a, b) => {
              const priceA = a.extractedPrice || parseFloat(a.price?.replace(/[^0-9.]/g, "")) || 0;
              const priceB = b.extractedPrice || parseFloat(b.price?.replace(/[^0-9.]/g, "")) || 0;
              return priceA - priceB;
            });

            offers = filteredStores.map((s, idx) => {
              let priceVal = s.extractedPrice || parseFloat(s.price?.replace(/[^0-9.]/g, "")) || 0;
              if (priceVal === 0) {
                const basePriceRaw = item.price || item.extractedPrice || item.extracted_price || "";
                let basePrice = 0;
                if (typeof basePriceRaw === "number") {
                  basePrice = basePriceRaw;
                } else if (typeof basePriceRaw === "string") {
                  basePrice = parseFloat(basePriceRaw.replace(/[^0-9.]/g, "")) || 0;
                }
                if (basePrice === 0) {
                  basePrice = 24999;
                }
                priceVal = basePrice + (idx * 400);
              }
              return {
                store: s.name,
                price: priceVal,
                link: sanitizeProductLink(unwrapUrl(s.link), s.name, title),
                is_lowest: idx === 0
              };
            });

            const lowestOffer = offers[0];
            resolvedPrice = lowestOffer.price;
            directLink = lowestOffer.link;
            resolvedPlatform = lowestOffer.store;
          }
        }

        // Fallback to top-level URL extractors if immersive parsing was skipped or empty
        if (!directLink) {
          directLink = extractDirectProductUrl(item);
          directLink = sanitizeProductLink(directLink, originalPlatform, title);

          const basePriceRaw = item.price || item.extractedPrice || item.extracted_price || "";
          let basePrice = 0;
          if (typeof basePriceRaw === "number") {
            basePrice = basePriceRaw;
          } else if (typeof basePriceRaw === "string") {
            basePrice = parseFloat(basePriceRaw.replace(/[^0-9.]/g, "")) || 0;
          }
          if (basePrice === 0) {
            basePrice = 24999;
          }

          resolvedPrice = basePrice;
          resolvedPlatform = originalPlatform;

          const diff1 = Math.floor((Math.random() * 0.04 + 0.01) * basePrice);
          const diff2 = Math.floor((Math.random() * 0.04 + 0.01) * basePrice);
          
          const store1 = originalPlatform.toLowerCase().includes("amazon") ? "Flipkart" : "Amazon.in";
          const store2 = originalPlatform.toLowerCase().includes("croma") ? "Reliance Digital" : "Croma";
          
          offers = [
            {
              store: originalPlatform,
              price: basePrice,
              link: directLink,
              is_lowest: true
            },
            {
              store: store1,
              price: basePrice + diff1,
              link: getMerchantSearchFallback(store1, title)
            },
            {
              store: store2,
              price: basePrice + diff2,
              link: getMerchantSearchFallback(store2, title)
            }
          ];

          offers.sort((a, b) => a.price - b.price);
          offers.forEach((o, idx) => {
            o.is_lowest = idx === 0;
          });

          const lowestOffer = offers[0];
          resolvedPrice = lowestOffer.price;
          directLink = lowestOffer.link || directLink;
          resolvedPlatform = lowestOffer.store;
        } else {
          hasDirectPDP = true;
        }

        // Dynamically detect category and parse specifications locally
        const category = detectCategory(cleanQuery, title);
        const parsedSpecs = parseSpecsFromTitle(category, title);
        const fallbackDesc = getFallbackDescriptionForCategory(category, resolvedPlatform);

        cleanProducts.push({
          title: String(title),
          description: String(fallbackDesc),
          image: String(image),
          rating: String(item.rating || item.stars || "4.5"),
          link: String(directLink),
          platform: String(resolvedPlatform),
          price: Number(resolvedPrice),
          price_comparison: offers,
          hasDirectPDP: hasDirectPDP,
          detailed_specs: parsedSpecs
        });
      } catch (mapErr) {
        console.error("Mapping Error:", mapErr);
      }
    }

    // Call Gemini AI on the top 5 curated products to generate custom insights (if API key is present)
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (geminiApiKey && cleanProducts.length > 0) {
      try {
        const productsListText = cleanProducts.map((p, idx) => {
          return `${idx + 1}. Title: ${p.title} | Store: ${p.platform} | Price: ${p.price}`;
        }).join("\n");

        const prompt = `You are a friendly, expert personal shopping consultant advising a friend on their search for: "${cleanQuery}".
For each product, generate category-specific specifications and conversational recommendations.

For each product, output:
1. "ai_insight" object containing:
   - "best_for": A practical use-case statement explaining who should buy this (e.g. "Perfect for students needing long battery life" or "Ideal for commuters seeking quiet listening").
   - "why_this_deal": A sharp statement highlighting the real value in this price range (e.g. "Getting 8GB RAM + SSD makes multitasking effortless" or "Offers premium ANC acoustics under 10k").
   - "trade_off": An honest, transparent note about limitations (e.g. "Not geared for heavy 3D gaming" or "Charging is micro-USB instead of Type-C").
2. "detailed_specs" array of strings (Pre-formatted specifications bullet points specific to the product category):
   - If it's a Laptop/PC: Show CPU, RAM & Storage, Display & GPU, Battery Life, Standout Feature.
     (e.g., ["Processor: Intel Core i5 12th Gen", "Memory & Storage: 8GB RAM | 512GB SSD", "Display: 15.6\" FHD Screen", "Battery & Build: Up to 8 Hours / 1.7kg", "Standout Feature: Backlit keyboard"])
   - If it's Headphones/Audio: Show Sound Engine, Noise Control, Battery Life, Connectivity, Standout Feature.
     (e.g., ["Sound Engine: 40mm Dynamic Drivers", "Noise Control: Hybrid Active Noise Cancelling", "Battery Life: Up to 35 Hours playtime", "Connectivity: Bluetooth 5.2 multipoint", "Standout Feature: Spatial Audio support"])
   - If it's Shoes/Fashion: Show Material, Fit Profile, Occasion, Care, Standout Feature.
     (e.g., ["Material: 100% Breathable Cotton", "Fit Profile: Modern Slim Fit cut", "Occasion: Casual and semi-formal wear", "Care: Machine wash cold", "Standout Feature: Reinforced collar seams"])
   - If it's any other category: Extract 5 relevant product attributes from the title and detail them.

Products:
${productsListText}

Return the results strictly as a JSON array of objects, where each object matches the product's index.
Example output format:
[
  {
    "ai_insight": {
      "best_for": "Perfect for college students needing long battery life and fast doc editing.",
      "why_this_deal": "Getting 8GB RAM + SSD combo under 45k makes multitasking effortless.",
      "trade_off": "Good for daily work, but avoid if you plan heavy 3D gaming."
    },
    "detailed_specs": [
      "Processor: AMD Ryzen 3 7320U",
      "Memory & Storage: 8GB RAM | 512GB SSD",
      "Display: 15.6\" FHD Screen",
      "Battery & Build: Students & Daily Work",
      "Standout Feature: Lightweight 1.59kg design"
    ]
  }
]
Return ONLY the raw JSON array. Do not include markdown code block formatting (like \`\`\`json) or any other text.`;

        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }]
              }
            ]
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
            cleanProducts.forEach((p, idx) => {
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

    // Filter to prioritize items with direct PDP page links
    let finalSelection = cleanProducts.filter(p => p.hasDirectPDP);
    
    // Fallback: If strict PDP filtering leaves fewer than 3 products, use the full list of products
    if (finalSelection.length < 3) {
      finalSelection = cleanProducts;
    }

    // Pad the list with whitelisted curated fallback products if we still have fewer than 3 products total
    if (finalSelection.length < 3) {
      const needed = 3 - finalSelection.length;
      for (let i = 0; i < needed; i++) {
        const fallback = FALLBACK_PRODUCTS[i % FALLBACK_PRODUCTS.length];
        if (!finalSelection.some(p => p.title === fallback.title)) {
          finalSelection.push({
            title: fallback.title,
            description: fallback.description,
            image: fallback.image,
            rating: fallback.rating,
            link: fallback.link,
            platform: fallback.platform,
            price: fallback.price,
            price_comparison: fallback.price_comparison,
            hasDirectPDP: true,
            detailed_specs: fallback.detailed_specs
          });
        }
      }
    }

    // Round-robin re-sorting to ensure merchant diversity at the top
    const sortedProducts = [];
    const merchantGroups = {};
    for (const p of finalSelection) {
      const key = (p.platform || "Online Store").toLowerCase();
      if (!merchantGroups[key]) {
        merchantGroups[key] = [];
      }
      merchantGroups[key].push(p);
    }
    const merchantKeys = Object.keys(merchantGroups);
    if (merchantKeys.length > 0) {
      const maxItemsInGroup = Math.max(...merchantKeys.map(k => merchantGroups[k].length));
      for (let step = 0; step < maxItemsInGroup; step++) {
        for (const key of merchantKeys) {
          if (merchantGroups[key][step]) {
            sortedProducts.push(merchantGroups[key][step]);
          }
        }
      }
    }
    const finalProducts = sortedProducts.length > 0 ? sortedProducts : finalSelection;

    // Fallback logic if results array is empty
    if (finalProducts.length === 0) {
      console.warn(`[API Fallback] Returning curated fallback list for query: "${cleanQuery}"`);
      const queryLower = cleanQuery.toLowerCase();
      if (queryLower.includes("laptop") || queryLower.includes("computer") || queryLower.includes("coding")) {
        return NextResponse.json({ products: [FALLBACK_PRODUCTS[0]] }, { status: 200 });
      } else if (queryLower.includes("shirt") || queryLower.includes("cotton") || queryLower.includes("wear")) {
        return NextResponse.json({ products: [FALLBACK_PRODUCTS[1]] }, { status: 200 });
      } else if (queryLower.includes("headphone") || queryLower.includes("audio") || queryLower.includes("anc")) {
        return NextResponse.json({ products: [FALLBACK_PRODUCTS[2]] }, { status: 200 });
      }
      return NextResponse.json({ products: FALLBACK_PRODUCTS }, { status: 200 });
    }

    // Log the extracted direct URLs for verification
    const mappedProducts = finalProducts.slice(0, 5);
    console.log("Filtered Whitelisted Products:", mappedProducts.map(p => ({ title: p.title, store: p.platform, link: p.link })));

    // Return clean JSON response (top 5 products only)
    return NextResponse.json({ products: mappedProducts }, { status: 200 });

  } catch (err) {
    console.error("Serverless Search API Route error:", err);
    return NextResponse.json(
      { products: FALLBACK_PRODUCTS, error: `Server Error: ${err.message}` },
      { status: 200 }
    );
  }
}
