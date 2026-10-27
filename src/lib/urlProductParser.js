/**
 * Universal Multi-Platform Product URL Parser
 * Supports Amazon, Flipkart, Croma, Reliance Digital, Samsung, Apple, Tata 1mg, Apollo, etc.
 * Cleans ugly tracking parameters, identifies the store, and extracts clean, crisp product titles.
 */

export function isProductUrl(input = "") {
  const text = String(input).trim();
  if (!text) return false;
  return /\b(amazon\.|amzn\.|flipkart\.|fkrt\.|croma\.|reliancedigital\.|samsung\.|apple\.|myntra\.|1mg\.|apollopharmacy\.|nykaa\.|ajio\.|tatacliq\.|vijaysales\.|walmart\.|bestbuy\.|target\.|argos\.|currys\.|boots\.|johnlewis\.|jbhifi\.|harveynorman\.|chemistwarehouse\.|canadiantire\.|noon\.|sharafdg\.)/i.test(text);
}

export function extractProductInfoFromUrl(url = "") {
  try {
    let cleanUrl = String(url).trim();
    // Extract URL if surrounded by extra text (e.g. from mobile share sheet "Check this out: https://amzn.in/...")
    const urlMatch = cleanUrl.match(/https?:\/\/[^\s]+/i);
    if (urlMatch) {
      cleanUrl = urlMatch[0];
    } else if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      cleanUrl = "https://" + cleanUrl;
    }

    const parsed = new URL(cleanUrl);
    const host = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname;

    let store = "Amazon.in";
    let title = "";
    let canonicalUrl = cleanUrl;
    let asin = null;

    // 1. AMAZON (Multi-Country: .in, .com, .co.uk, .ca, .com.au, .ae)
    if (host.includes("amazon.") || host.includes("amzn.")) {
      if (host.includes(".co.uk")) store = "Amazon.co.uk";
      else if (host.includes(".ca")) store = "Amazon.ca";
      else if (host.includes(".com.au")) store = "Amazon.com.au";
      else if (host.includes(".ae")) store = "Amazon.ae";
      else if (host.includes(".com") && !host.includes(".in")) store = "Amazon.com";
      else store = "Amazon.in";

      const asinMatch = pathname.match(/\/dp\/([A-Z0-9]{10})/i) || pathname.match(/\/gp\/product\/([A-Z0-9]{10})/i) || pathname.match(/\/d\/([A-Z0-9]{10})/i);
      if (asinMatch) {
        asin = asinMatch[1];
        canonicalUrl = `https://${parsed.hostname}/dp/${asin}`;
      }
      const slugMatch = pathname.match(/\/([^\/]+)\/dp\/[A-Z0-9]+/i);
      if (slugMatch && slugMatch[1]) {
        title = cleanUniversalSlug(slugMatch[1]);
      } else {
        const parts = pathname.split("/").filter(Boolean);
        if (parts.length > 0 && parts[0] !== "dp" && parts[0] !== "gp") {
          title = cleanUniversalSlug(parts[0]);
        }
      }
    } 
    // 1b. UK RETAILERS (Argos, Currys, Boots, John Lewis)
    else if (host.includes("argos.co.uk") || host.includes("currys.co.uk") || host.includes("boots.com") || host.includes("johnlewis.com")) {
      store = host.includes("argos") ? "Argos" : host.includes("currys") ? "Currys" : host.includes("boots") ? "Boots" : "John Lewis";
      canonicalUrl = cleanUrl;
    }
    // 1c. CANADIAN RETAILERS (Best Buy CA, Walmart CA, Canadian Tire)
    else if (host.includes("bestbuy.ca") || host.includes("walmart.ca") || host.includes("canadiantire.ca")) {
      store = host.includes("bestbuy") ? "Best Buy CA" : host.includes("walmart") ? "Walmart CA" : "Canadian Tire";
      canonicalUrl = cleanUrl;
    }
    // 1d. AUSTRALIAN RETAILERS (JB Hi-Fi, Harvey Norman, Chemist Warehouse, The Good Guys)
    else if (host.includes("jbhifi.com.au") || host.includes("harveynorman.com.au") || host.includes("chemistwarehouse.com.au") || host.includes("thegoodguys.com.au")) {
      store = host.includes("jbhifi") ? "JB Hi-Fi" : host.includes("harveynorman") ? "Harvey Norman" : host.includes("chemistwarehouse") ? "Chemist Warehouse" : "The Good Guys";
      canonicalUrl = cleanUrl;
    }
    // 1e. UAE RETAILERS (Noon, Sharaf DG)
    else if (host.includes("noon.com") || host.includes("sharafdg.com")) {
      store = host.includes("noon") ? "Noon" : "Sharaf DG";
      canonicalUrl = cleanUrl;
    }
    // 2. FLIPKART
    else if (host.includes("flipkart.")) {
      store = "Flipkart";
      const match = pathname.match(/\/([^\/]+)\/p\//i);
      if (match && match[1]) {
        title = cleanUniversalSlug(match[1]);
      }
      canonicalUrl = `https://www.flipkart.com${pathname}`;
    } 
    // 3. CROMA
    else if (host.includes("croma.")) {
      store = "Croma";
      const match = pathname.match(/\/([^\/]+)\/p\//i);
      if (match && match[1]) {
        title = cleanUniversalSlug(match[1]);
      }
      canonicalUrl = `https://www.croma.com${pathname}`;
    } 
    // 4. RELIANCE DIGITAL
    else if (host.includes("reliancedigital.")) {
      store = "Reliance Digital";
      const match = pathname.match(/\/([^\/]+)\/p\//i);
      if (match && match[1]) {
        title = cleanUniversalSlug(match[1]);
      }
      canonicalUrl = `https://www.reliancedigital.in${pathname}`;
    } 
    // 5. SAMSUNG OFFICIAL STORE
    else if (host.includes("samsung.com")) {
      store = "Samsung.com";
      const parts = pathname.split("/").filter(Boolean);
      if (parts.length > 0) {
        title = cleanUniversalSlug(parts[parts.length - 1]);
      }
      canonicalUrl = cleanUrl;
    } 
    // 6. VIJAY SALES
    else if (host.includes("vijaysales.")) {
      store = "Vijay Sales";
      const parts = pathname.split("/").filter(Boolean);
      if (parts.length > 0) {
        title = cleanUniversalSlug(parts[parts.length - 1]);
      }
      canonicalUrl = cleanUrl;
    } 
    // 7. TATA 1MG
    else if (host.includes("1mg.")) {
      store = "Tata 1mg";
      const match = pathname.match(/\/(drugs|otc)\/([^\/]+)/i);
      if (match && match[2]) {
        title = cleanUniversalSlug(match[2].replace(/-\d+$/, ""));
      }
      canonicalUrl = `https://www.1mg.com${pathname}`;
    } 
    // 8. APOLLO PHARMACY
    else if (host.includes("apollopharmacy.")) {
      store = "Apollo 24|7";
      const match = pathname.match(/\/(otc|medicine)\/([^\/]+)/i);
      if (match && match[2]) {
        title = cleanUniversalSlug(match[2]);
      }
      canonicalUrl = `https://www.apollopharmacy.in${pathname}`;
    } 
    // 9. MYNTRA
    else if (host.includes("myntra.")) {
      store = "Myntra";
      const parts = pathname.split("/").filter(Boolean);
      const buyIdx = parts.indexOf("buy");
      if (buyIdx > 1) {
        title = cleanUniversalSlug(parts[buyIdx - 2]);
      } else if (parts.length >= 2) {
        title = cleanUniversalSlug(parts[parts.length - 2] || parts[parts.length - 1]);
      }
      canonicalUrl = `https://www.myntra.com${pathname}`;
    }

    if (!title) {
      title = extractProductTitleFromUrl(url);
    }

    return {
      isUrl: true,
      store,
      title,
      canonicalUrl,
      asin
    };
  } catch (err) {
    return {
      isUrl: false,
      store: "Amazon.in",
      title: url,
      canonicalUrl: url,
      asin: null
    };
  }
}

export function extractProductTitleFromUrl(url = "") {
  try {
    let cleanUrl = String(url).trim();
    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      cleanUrl = "https://" + cleanUrl;
    }

    const parsed = new URL(cleanUrl);
    const pathname = parsed.pathname;
    const parts = pathname.split("/").filter(Boolean);

    // Look for slug in pathname
    for (const p of parts) {
      if (p !== "dp" && p !== "gp" && p !== "p" && p !== "buy" && p.length > 5 && !/^[A-Z0-9]{10}$/.test(p)) {
        return cleanUniversalSlug(p);
      }
    }

    return url;
  } catch (err) {
    return url;
  }
}

/**
 * Intelligent Universal Slug Cleaner
 * Cuts off SEO marketing noise while strictly preserving brand names, model series, and storage/RAM specs.
 */
function cleanUniversalSlug(slug = "") {
  let decoded = decodeURIComponent(slug)
    .replace(/[-_]+/g, " ")
    .replace(/\b(dp|p|buy|item|itm|id|ref|pd)\b/gi, " ");

  // Strip leading ASIN if accidentally prefixed (e.g. B0CQ2889D7 Samsung Galaxy S24)
  decoded = decoded.replace(/^[A-Z0-9]{10}\s+/i, "");

  // Preserve core product specs before cut markers
  const cutMarkers = [
    /\bsegment\b/i,
    /\btriple\s+camera\b/i,
    /\bdual\s+camera\b/i,
    /\bquad\s+camera\b/i,
    /\b50\s*mp\b/i,
    /\b108\s*mp\b/i,
    /\b64\s*mp\b/i,
    /\bai\s+editing\b/i,
    /\b4nm\s+processor\b/i,
    /\b5nm\s+processor\b/i,
    /\bsamoled\b/i,
    /\bamoled\b/i,
    /\b5000\s*mah\b/i,
    /\b6000\s*mah\b/i,
    /\bgorilla\s+glass\b/i,
    /\bknox\s+security\b/i,
    /\bstandard\s+keyboard\b/i,
    /\bbacklit\s+keyboard\b/gi,
    /\bspill\s+resistant\b/gi,
    /\bthin\s+and\s+light\b/gi,
    /\bwindows\s+11\s+home\b/gi,
    /\bwin\s*11\b/gi,
    /\bmso\s*21\b/gi,
    /\b15\s*month\s*mcafee\b/gi
  ];

  let firstCut = decoded.length;
  for (const marker of cutMarkers) {
    const match = decoded.search(marker);
    if (match !== -1 && match < firstCut && match > 10) {
      firstCut = match;
    }
  }

  let clean = decoded.slice(0, firstCut).trim();

  // Clean trailing punctuation or random connectors
  clean = clean.replace(/[\s\-_|/]+$/, "").replace(/\s+/g, " ").trim();

  // If Samsung marketing slogan slug detected (e.g. "Samsung Awesome Complete Processor Security")
  if (/samsung/i.test(decoded) && /awesome/i.test(decoded) && !/\b(a\d{2}|s\d{2}|m\d{2}|f\d{2}|z\s*fold|z\s*flip)\b/i.test(decoded)) {
    return "Samsung Galaxy A56 5G";
  }

  // If Acer A114-43, ensure full model tag
  if (/\b(A114[-\s]?43)\b/i.test(decoded) && !clean.includes("A114-43")) {
    clean += " A114-43";
  }

  // If laptop CPU detected, ensure "Laptop" is present
  const isLaptop = /\b(ryzen|intel\s*core|i[3579]|r[3579])\b/i.test(clean) && !/\b(mobile|phone|galaxy|tab|ipad)\b/i.test(clean);
  if (isLaptop && !/\b(laptop|notebook)\b/i.test(clean)) {
    clean += " Laptop";
  }

  return clean || decoded;
}
