/**
 * Dynamic Smart Filter Chips Generator (Pure In-Memory Filter Engine)
 * Strictly inspects the loaded products and generates 4-5 specification-driven hardware filters.
 * NEVER creates store-name or brand chips.
 * Isolates categories strictly to prevent unrelated traits (e.g. audio traits on laptop queries).
 */

function getProductSearchText(p) {
  const title = p.title || "";
  const specs = Array.isArray(p.specs) ? p.specs.join(" ") : (p.specs || "");
  const desc = p.description || "";
  return `${title} ${specs} ${desc}`.toLowerCase();
}

function detectQueryCategory(query = "", products = []) {
  const q = String(query || "").toLowerCase();

  // 1. Primary Check: Query Intent
  if (/\b(laptop|laptops|notebook|macbook|chromebook|thinkpad|vivobook|zenbook|ideapad|loq|tuf|legion|victus|omen|predator)\b/i.test(q)) return "laptop";
  if (/\b(phone|phones|mobile|mobiles|smartphone|smartphones|iphone|galaxy|oneplus|realme|redmi|poco|iqoo|pixel)\b/i.test(q)) return "mobile";
  if (/\b(wash|washing|washer|dryer)\b/i.test(q)) return "washing";
  if (/\b(headphone|headphones|earphone|earphones|earbud|earbuds|airpods|tws|neckband|speaker|speakers|soundbar|buds|audio)\b/i.test(q)) return "audio";
  if (/\b(shoe|shoes|sneaker|sneakers|boots|footwear|loafers|sandals)\b/i.test(q)) return "footwear";
  if (/\b(shirt|tshirt|t-shirt|jeans|jacket|hoodie|saree|kurti|dress|clothes|cloth|wear)\b/i.test(q)) return "apparel";
  if (/\b(watch|watches|smartwatch|smartwatches)\b/i.test(q)) return "watch";

  // 2. Secondary Check: Dominant Category across products in memory
  const counts = { laptop: 0, mobile: 0, washing: 0, audio: 0, footwear: 0, apparel: 0, watch: 0 };
  for (const p of products) {
    const text = getProductSearchText(p);
    if (/\b(laptop|notebook|macbook|chromebook|thinkpad|vivobook|zenbook|ideapad|loq|tuf|legion|victus|omen|predator)\b/i.test(text)) counts.laptop++;
    else if (/\b(phone|smartphone|iphone|galaxy|mobile)\b/i.test(text)) counts.mobile++;
    else if (/\b(washing\s*machine|front\s*load|top\s*load)\b/i.test(text)) counts.washing++;
    else if (/\b(earbuds?|headphones?|buds|tws|neckband)\b/i.test(text)) counts.audio++;
    else if (/\b(sneakers?|shoes?|footwear)\b/i.test(text)) counts.footwear++;
    else if (/\b(shirt|t-?shirt|jeans|kurti|dress)\b/i.test(text)) counts.apparel++;
    else if (/\b(smartwatch|fitness\s*tracker)\b/i.test(text)) counts.watch++;
  }

  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  if (entries[0] && entries[0][1] >= 2) {
    return entries[0][0];
  }

  return "general";
}

export function generateSmartChips(products = [], query = "") {
  if (!Array.isArray(products) || products.length === 0) return [];

  const chips = [
    {
      id: "all",
      label: "All (Top Deals)",
      icon: "✨",
      count: products.length,
      filter: () => true
    }
  ];

  const category = detectQueryCategory(query, products);
  const potentialTraits = [];

  // ==========================================
  // 1. SPECIFICATION FILTERS BY CATEGORY
  // ==========================================

  if (category === "laptop") {
    // Laptop Hardware Specifications (Pure Spec Driven)
    potentialTraits.push({
      id: "intel-core",
      label: "Intel Core i5 / i7",
      icon: "💻",
      test: p => /\b(i5|i7|core\s*i[57]|intel\s*core)\b/i.test(getProductSearchText(p))
    });
    potentialTraits.push({
      id: "amd-ryzen",
      label: "AMD Ryzen",
      icon: "🚀",
      test: p => /\b(ryzen|ryzen\s*[357]|amd)\b/i.test(getProductSearchText(p))
    });
    potentialTraits.push({
      id: "16gb-ram",
      label: "16GB RAM",
      icon: "⚡",
      test: p => /\b16\s*gb(?:\s*ram)?\b/i.test(getProductSearchText(p))
    });
    potentialTraits.push({
      id: "gaming-gpu",
      label: "Gaming / RTX GPU",
      icon: "🎮",
      test: p => /\b(gaming|rtx|gtx|radeon|rx\s*\d+|geforce|dedicated\s*(?:gpu|graphics)|gpu)\b/i.test(getProductSearchText(p))
    });
    potentialTraits.push({
      id: "8gb-ram",
      label: "8GB RAM",
      icon: "⚡",
      test: p => /\b8\s*gb(?:\s*ram)?\b/i.test(getProductSearchText(p))
    });
    potentialTraits.push({
      id: "512gb-ssd",
      label: "512GB+ SSD",
      icon: "💾",
      test: p => /\b(512\s*gb|1\s*tb|2\s*tb)\s*(?:ssd)?\b/i.test(getProductSearchText(p))
    });
    potentialTraits.push({
      id: "thin-light",
      label: "Thin & Light",
      icon: "🪶",
      test: p => /\b(thin|light|slim|ultrabook|ultra-thin|1\.[1-6]\s*kg)\b/i.test(getProductSearchText(p))
    });
    potentialTraits.push({
      id: "fhd-display",
      label: "15.6\" FHD Display",
      icon: "🖥️",
      test: p => /\b(15\.6|14|fhd|1080p|ips)\b/i.test(getProductSearchText(p))
    });
  } else if (category === "mobile") {
    // Smartphone Hardware Specifications
    potentialTraits.push({
      id: "5g-network",
      label: "5G Ready",
      icon: "📶",
      test: p => /\b5g\b/i.test(getProductSearchText(p))
    });
    potentialTraits.push({
      id: "amoled-display",
      label: "AMOLED / 120Hz",
      icon: "📱",
      test: p => /\b(amoled|oled|120hz|super\s*amoled)\b/i.test(getProductSearchText(p))
    });
    potentialTraits.push({
      id: "256gb-storage",
      label: "256GB Storage",
      icon: "💾",
      test: p => /\b256\s*gb\b/i.test(getProductSearchText(p))
    });
    potentialTraits.push({
      id: "8gb-ram",
      label: "8GB+ RAM",
      icon: "⚡",
      test: p => /\b(8|12|16)\s*gb\s*ram\b/i.test(getProductSearchText(p))
    });
    potentialTraits.push({
      id: "fast-charging",
      label: "5000mAh / Fast Charge",
      icon: "🔋",
      test: p => /\b(5000\s*mah|6000\s*mah|fast\s*charg\w+|67w|80w|120w)\b/i.test(getProductSearchText(p))
    });
  } else if (category === "audio") {
    // Audio Tech Specifications
    potentialTraits.push({
      id: "anc-tech",
      label: "Active Noise Cancellation (ANC)",
      icon: "🔇",
      test: p => /\b(anc|noise\s*cancell?ing|active\s*noise)\b/i.test(getProductSearchText(p))
    });
    potentialTraits.push({
      id: "tws-earbuds",
      label: "TWS Earbuds",
      icon: "🎧",
      test: p => /\b(tws|earbuds?|true\s*wireless|in-ear)\b/i.test(getProductSearchText(p))
    });
    potentialTraits.push({
      id: "long-battery",
      label: "30h+ Battery",
      icon: "🔋",
      test: p => /\b(30|40|50|60)\s*(?:hours?|hrs?)\b/i.test(getProductSearchText(p))
    });
    potentialTraits.push({
      id: "over-ear",
      label: "Over-Ear / Headphone",
      icon: "🎵",
      test: p => /\b(over-?ear|on-?ear|headband)\b/i.test(getProductSearchText(p))
    });
  } else if (category === "washing") {
    // Washing Machine Specifications
    potentialTraits.push({
      id: "front-load",
      label: "Front Load",
      icon: "🌀",
      test: p => /\bfront\s*load\b/i.test(getProductSearchText(p))
    });
    potentialTraits.push({
      id: "top-load",
      label: "Top Load",
      icon: "🧺",
      test: p => /\btop\s*load\b/i.test(getProductSearchText(p))
    });
    potentialTraits.push({
      id: "8kg-plus",
      label: "8 Kg+ Capacity",
      icon: "⚖️",
      test: p => /\b(8|8\.5|9|9\.5|10|10\.5)\s*kg\b/i.test(getProductSearchText(p))
    });
    potentialTraits.push({
      id: "5-star",
      label: "5-Star Energy",
      icon: "⚡",
      test: p => /\b(5\s*star|5-star|inverter)\b/i.test(getProductSearchText(p))
    });
  } else if (category === "footwear") {
    // Footwear Specifications
    potentialTraits.push({
      id: "sports-running",
      label: "Sports & Running",
      icon: "🏃",
      test: p => /\b(running|sports?|athletic|training|gym)\b/i.test(getProductSearchText(p))
    });
    potentialTraits.push({
      id: "casual-lifestyle",
      label: "Casual / Lifestyle",
      icon: "👟",
      test: p => /\b(casual|lifestyle|street|sneaker)\b/i.test(getProductSearchText(p))
    });
    potentialTraits.push({
      id: "cushioned-comfort",
      label: "Cushioned Comfort",
      icon: "☁️",
      test: p => /\b(cushion|foam|comfort|soft|memory\s*foam)\b/i.test(getProductSearchText(p))
    });
  } else if (category === "apparel") {
    // Apparel Specifications
    potentialTraits.push({
      id: "cotton-linen",
      label: "100% Cotton / Linen",
      icon: "🌿",
      test: p => /\b(cotton|linen|pure\s*cotton)\b/i.test(getProductSearchText(p))
    });
    potentialTraits.push({
      id: "slim-fit",
      label: "Slim Fit",
      icon: "✨",
      test: p => /\bslim\s*fit\b/i.test(getProductSearchText(p))
    });
    potentialTraits.push({
      id: "casual-wear",
      label: "Casual Wear",
      icon: "👔",
      test: p => /\b(casual|daily|regular)\b/i.test(getProductSearchText(p))
    });
    potentialTraits.push({
      id: "printed-checks",
      label: "Printed / Checks",
      icon: "🎨",
      test: p => /\b(print|printed|check|checked|stripe|striped)\b/i.test(getProductSearchText(p))
    });
  } else if (category === "watch") {
    // Smartwatch Specifications
    potentialTraits.push({
      id: "amoled-screen",
      label: "AMOLED Display",
      icon: "📱",
      test: p => /\b(amoled|retina)\b/i.test(getProductSearchText(p))
    });
    potentialTraits.push({
      id: "bt-calling",
      label: "Bluetooth Calling",
      icon: "📞",
      test: p => /\b(bt\s*calling|bluetooth\s*calling|call)\b/i.test(getProductSearchText(p))
    });
    potentialTraits.push({
      id: "health-tracker",
      label: "Heart Rate & SpO2",
      icon: "❤️",
      test: p => /\b(spo2|heart\s*rate|fitness|sports\s*modes?)\b/i.test(getProductSearchText(p))
    });
  }

  // ==========================================
  // 2. BUDGET TIER FILTER (PURE NUMERIC SPLIT)
  // ==========================================
  const prices = products
    .map(p => {
      if (typeof p.rawPrice === "number" && p.rawPrice > 0) return p.rawPrice;
      if (typeof p.price === "number" && p.price > 0) return p.price;
      const num = parseFloat(String(p.price || "").replace(/[^0-9.]/g, ""));
      return isNaN(num) ? 0 : num;
    })
    .filter(pr => pr > 0);

  if (prices.length >= 3) {
    const minP = Math.min(...prices);
    const maxP = Math.max(...prices);
    if (maxP - minP >= 250) {
      // Find midpoint rounded to a clean ₹50 or ₹500
      const step = (maxP - minP) > 10000 ? 500 : 50;
      const midP = Math.round((minP + maxP) / 2 / step) * step;
      
      const testPrice = p => {
        const val = typeof p.rawPrice === "number" && p.rawPrice > 0 
          ? p.rawPrice 
          : parseFloat(String(p.price || "").replace(/[^0-9.]/g, "")) || 0;
        return val > 0 && val <= midP;
      };

      const underMidCount = products.filter(testPrice).length;
      if (underMidCount >= 2 && underMidCount < products.length) {
        const formattedMid = midP >= 100000 
          ? `₹${(midP / 100000).toFixed(1)}L` 
          : `₹${midP.toLocaleString("en-IN")}`;
        potentialTraits.push({
          id: "budget-tier",
          label: `Under ${formattedMid}`,
          icon: "💰",
          test: testPrice
        });
      }
    }
  }

  // ==========================================
  // 3. TOP RATED FILTER (4.3+ Rating)
  // ==========================================
  const testTopRated = p => (parseFloat(p.rating) || 0) >= 4.3;
  const topRatedMatches = products.filter(testTopRated).length;
  if (topRatedMatches >= 2 && topRatedMatches < products.length) {
    potentialTraits.push({
      id: "top-rated",
      label: "Top Rated (4.3+)",
      icon: "⭐",
      test: testTopRated
    });
  }

  // ==========================================
  // 4. COLLECT SPEC TRAITS (MAX 6 TOTAL CHIPS)
  // ==========================================
  potentialTraits.forEach(trait => {
    if (chips.length >= 6) return;
    const matching = products.filter(trait.test);
    if (matching.length >= 2 && matching.length < products.length) {
      chips.push({
        id: trait.id,
        label: trait.label,
        icon: trait.icon,
        count: matching.length,
        filter: trait.test
      });
    }
  });

  return chips;
}
