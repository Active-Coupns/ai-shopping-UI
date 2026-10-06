/**
 * Dynamic Smart Chips Generator (Pure In-Memory Filter Engine)
 * Strictly inspects the loaded 20 products and generates 4-5 contextual filters.
 * NEVER requires an extra network request or API call.
 */
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

  const qLower = (query || "").toLowerCase();

  // Trait testers
  const potentialTraits = [];

  // 1. Washing Machines Traits
  const isWashingQuery = qLower.includes("wash") || products.some(p => (p.title || "").toLowerCase().includes("wash"));
  if (isWashingQuery) {
    potentialTraits.push({
      id: "front-load",
      label: "Front Load",
      icon: "🌀",
      test: p => {
        const text = ((p.title || "") + " " + (p.specs || []).join(" ")).toLowerCase();
        return text.includes("front load") || text.includes("front-load");
      }
    });
    potentialTraits.push({
      id: "top-load",
      label: "Top Load",
      icon: "🧺",
      test: p => {
        const text = ((p.title || "") + " " + (p.specs || []).join(" ")).toLowerCase();
        return text.includes("top load") || text.includes("top-load");
      }
    });
    potentialTraits.push({
      id: "8kg-plus",
      label: "8 Kg+ Capacity",
      icon: "⚖️",
      test: p => {
        const text = ((p.title || "") + " " + (p.specs || []).join(" ")).toLowerCase();
        return /\b(8|8\.5|9|9\.5|10|10\.5)\s*kg\b/i.test(text);
      }
    });
    potentialTraits.push({
      id: "5-star",
      label: "5-Star Energy",
      icon: "⚡",
      test: p => {
        const text = ((p.title || "") + " " + (p.specs || []).join(" ")).toLowerCase();
        return /5\s*star|5-star/i.test(text);
      }
    });
  }

  // 2. Laptops / Tech Traits
  const isLaptopQuery = qLower.includes("laptop") || products.some(p => (p.title || "").toLowerCase().includes("laptop"));
  if (isLaptopQuery) {
    potentialTraits.push({
      id: "gaming-gpu",
      label: "Gaming / RTX GPU",
      icon: "🎮",
      test: p => {
        const text = ((p.title || "") + " " + (p.specs || []).join(" ")).toLowerCase();
        return /\b(gaming|rtx|gtx|radeon|rx\s*\d+|geforce|dedicated)\b/i.test(text);
      }
    });
    potentialTraits.push({
      id: "16gb-ram",
      label: "16GB RAM",
      icon: "⚡",
      test: p => {
        const text = ((p.title || "") + " " + (p.specs || []).join(" ")).toLowerCase();
        return /\b16\s*gb\b/i.test(text);
      }
    });
    potentialTraits.push({
      id: "intel-core",
      label: "Intel Core i5 / i7",
      icon: "💻",
      test: p => {
        const text = ((p.title || "") + " " + (p.specs || []).join(" ")).toLowerCase();
        return /\b(i5|i7|core\s*i[57]|intel)\b/i.test(text);
      }
    });
    potentialTraits.push({
      id: "amd-ryzen",
      label: "AMD Ryzen",
      icon: "🚀",
      test: p => {
        const text = ((p.title || "") + " " + (p.specs || []).join(" ")).toLowerCase();
        return /ryzen/i.test(text);
      }
    });
  }

  // 3. Smartphones Traits
  const isMobileQuery = qLower.includes("phone") || qLower.includes("mobile") || products.some(p => /\b(smartphone|mobile|phone|5g)\b/i.test(p.title || ""));
  if (isMobileQuery) {
    potentialTraits.push({
      id: "5g-network",
      label: "5G Ready",
      icon: "📶",
      test: p => /\b5g\b/i.test((p.title || "") + " " + (p.specs || []).join(" "))
    });
    potentialTraits.push({
      id: "256gb-storage",
      label: "256GB Storage",
      icon: "💾",
      test: p => /\b256\s*gb\b/i.test((p.title || "") + " " + (p.specs || []).join(" "))
    });
    potentialTraits.push({
      id: "amoled-display",
      label: "AMOLED / 120Hz",
      icon: "📱",
      test: p => /\b(amoled|oled|120hz)\b/i.test((p.title || "") + " " + (p.specs || []).join(" "))
    });
  }

  // 4. Audio Traits
  const isAudioQuery = qLower.includes("headphone") || qLower.includes("earbud") || qLower.includes("buds") || qLower.includes("audio") || products.some(p => /\b(earbuds?|headphones?|buds|tws|neckband)\b/i.test(p.title || ""));
  if (isAudioQuery) {
    potentialTraits.push({
      id: "anc-tech",
      label: "Active Noise Cancellation (ANC)",
      icon: "🔇",
      test: p => /\b(anc|noise\s*cancell?ing|active\s*noise)\b/i.test((p.title || "") + " " + (p.specs || []).join(" ") + " " + (p.description || ""))
    });
    potentialTraits.push({
      id: "tws-earbuds",
      label: "TWS Earbuds",
      icon: "🎧",
      test: p => /\b(tws|earbuds?|in-ear|true\s*wireless)\b/i.test((p.title || "") + " " + (p.specs || []).join(" "))
    });
    potentialTraits.push({
      id: "over-ear",
      label: "Over-Ear / Headphone",
      icon: "🎵",
      test: p => /\b(over-?ear|on-?ear|headphones?)\b/i.test((p.title || "") + " " + (p.specs || []).join(" "))
    });
  }

  // 5. Footwear Traits
  const isFootwearQuery = qLower.includes("shoe") || qLower.includes("sneaker") || products.some(p => /\b(sneakers?|shoes?|footwear)\b/i.test(p.title || ""));
  if (isFootwearQuery) {
    potentialTraits.push({
      id: "casual-lifestyle",
      label: "Casual / Lifestyle",
      icon: "👟",
      test: p => /\b(casual|lifestyle|street|sneaker)\b/i.test((p.title || "") + " " + (p.specs || []).join(" ") + " " + (p.description || ""))
    });
    potentialTraits.push({
      id: "white-sneakers",
      label: "White Sneakers",
      icon: "⚪",
      test: p => /\bwhite\b/i.test((p.title || "") + " " + (p.description || ""))
    });
    potentialTraits.push({
      id: "running-sports",
      label: "Sports & Running",
      icon: "🏃",
      test: p => /\b(running|sports?|athletic|training|gym)\b/i.test((p.title || "") + " " + (p.specs || []).join(" ") + " " + (p.description || ""))
    });
  }

  // 6. Apparel, Clothing & Shirts Traits
  const isApparelQuery = qLower.includes("shirt") || qLower.includes("cloth") || qLower.includes("wear") || qLower.includes("tshirt") || qLower.includes("jeans") || products.some(p => /\b(shirt|t-?shirt|jeans|trouser|kurti|dress|wear|cotton|linen)\b/i.test(p.title || ""));
  if (isApparelQuery) {
    potentialTraits.push({
      id: "cotton-linen",
      label: "Cotton / Linen",
      icon: "🌿",
      test: p => /\b(cotton|linen|pure\s*cotton)\b/i.test((p.title || "") + " " + (p.specs || []).join(" ") + " " + (p.description || ""))
    });
    potentialTraits.push({
      id: "casual-daily",
      label: "Casual Wear",
      icon: "👔",
      test: p => /\b(casual|daily|regular)\b/i.test((p.title || "") + " " + (p.specs || []).join(" ") + " " + (p.description || ""))
    });
    potentialTraits.push({
      id: "slim-fit",
      label: "Slim Fit",
      icon: "✨",
      test: p => /\bslim\s*fit\b/i.test((p.title || "") + " " + (p.specs || []).join(" ") + " " + (p.description || ""))
    });
    potentialTraits.push({
      id: "printed-checks",
      label: "Printed / Checks",
      icon: "🎨",
      test: p => /\b(print|printed|check|checked|checkered|stripe|striped)\b/i.test((p.title || "") + " " + (p.specs || []).join(" ") + " " + (p.description || ""))
    });
  }

  // 7. Store-Level Filters (e.g., On Amazon.in, On Myntra, On Flipkart)
  const storeCounts = {};
  products.forEach(p => {
    const s = (p.store_name || p.store || "").trim();
    if (s) storeCounts[s] = (storeCounts[s] || 0) + 1;
  });
  Object.entries(storeCounts).forEach(([store, count]) => {
    if (count >= 2 && count < products.length) {
      potentialTraits.push({
        id: `store-${store.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
        label: `On ${store}`,
        icon: "🏬",
        test: p => (p.store_name || p.store || "").toLowerCase() === store.toLowerCase()
      });
    }
  });

  // 8. Common Brand Traits Present in the products
  const brandKeywords = [
    "samsung", "lg", "ifb", "bosch", "whirlpool", "panasonic", "haier",
    "asus", "hp", "lenovo", "dell", "acer", "apple",
    "oneplus", "realme", "redmi", "xiaomi", "vivo", "oppo", "iqoo", "motorola",
    "nike", "puma", "adidas", "campus", "asian", "red tape", "bata", "sparx", "woodland",
    "boat", "noise", "jbl", "sony", "boult",
    "deelmo", "indian garage", "here&now", "indian terrain", "urbano", "roadster", "snitch", 
    "allen solly", "peter england", "highlander", "dennis lingo", "levis", "us polo"
  ];

  const brandCounts = {};
  products.forEach(p => {
    const t = (p.title || "").toLowerCase();
    brandKeywords.forEach(b => {
      if (t.includes(b)) {
        brandCounts[b] = (brandCounts[b] || 0) + 1;
      }
    });
  });

  Object.entries(brandCounts).forEach(([brand, count]) => {
    if (count >= 2) {
      const capBrand = brand.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
      potentialTraits.push({
        id: `brand-${brand.replace(/\s+/g, "-")}`,
        label: capBrand,
        icon: "🏷️",
        test: p => (p.title || "").toLowerCase().includes(brand)
      });
    }
  });

  // 9. Price Split (Under Midpoint)
  const prices = products
    .map(p => p.rawPrice || parseFloat(String(p.price || "").replace(/[^0-9.]/g, "")) || 0)
    .filter(pr => pr > 0);

  if (prices.length >= 3) {
    const minP = Math.min(...prices);
    const maxP = Math.max(...prices);
    if (maxP - minP >= 250) {
      const midP = Math.round((minP + maxP) / 2 / 50) * 50;
      const underMidCount = products.filter(p => (p.rawPrice || 0) <= midP).length;
      if (underMidCount >= 2 && underMidCount < products.length) {
        const formattedMid = midP >= 100000 ? `₹${(midP / 100000).toFixed(1)}L` : `₹${midP.toLocaleString("en-IN")}`;
        potentialTraits.push({
          id: "budget-tier",
          label: `Under ${formattedMid}`,
          icon: "💰",
          test: p => (p.rawPrice || 0) <= midP
        });
      }
    }
  }

  // 10. Top Rated (4.3+ Rating)
  const topRatedMatches = products.filter(p => (parseFloat(p.rating) || 0) >= 4.3).length;
  if (topRatedMatches >= 2 && topRatedMatches < products.length) {
    potentialTraits.push({
      id: "top-rated",
      label: "Top Rated (4.3+)",
      icon: "⭐",
      test: p => (parseFloat(p.rating) || 0) >= 4.3
    });
  }

  // Collect ONLY traits that have at least 2 matching products in memory
  // Limit to at most 5 total chips so UI stays super clean
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
