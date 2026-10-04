/**
 * URL Product Title Extractor for E-Commerce & Pharmacy Links
 * Parses pasted product URLs from Amazon, Flipkart, Myntra, Croma, Reliance Digital, 1mg, Apollo
 * and returns clean, human-readable search queries in 0ms without web scraping.
 */

export function isProductUrl(input = "") {
  const text = String(input).trim();
  if (!text.startsWith("http://") && !text.startsWith("https://") && !text.startsWith("www.")) {
    return false;
  }
  return /\b(amazon\.|flipkart\.|myntra\.|croma\.|reliancedigital\.|1mg\.|apollopharmacy\.|nykaa\.|ajio\.|tatacliq\.|zeptonow\.|blinkit\.)/i.test(text);
}

export function extractProductInfoFromUrl(url = "") {
  try {
    let cleanUrl = String(url).trim();
    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      cleanUrl = "https://" + cleanUrl;
    }

    const parsed = new URL(cleanUrl);
    const host = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname;

    let store = "Amazon.in";
    let title = "";
    let canonicalUrl = cleanUrl;
    let asin = null;

    if (host.includes("amazon.")) {
      store = host.includes(".com") ? "Amazon.com" : "Amazon.in";
      const asinMatch = pathname.match(/\/dp\/([A-Z0-9]{10})/i) || pathname.match(/\/gp\/product\/([A-Z0-9]{10})/i);
      if (asinMatch) {
        asin = asinMatch[1];
        canonicalUrl = `https://${parsed.hostname}/dp/${asin}`;
      }
      const slugMatch = pathname.match(/\/([^\/]+)\/dp\/[A-Z0-9]+/i);
      if (slugMatch && slugMatch[1]) {
        title = cleanSlug(slugMatch[1]);
      } else {
        const parts = pathname.split("/").filter(Boolean);
        if (parts.length > 0 && parts[0] !== "dp" && parts[0] !== "gp") {
          title = cleanSlug(parts[0]);
        }
      }
    } else if (host.includes("flipkart.")) {
      store = "Flipkart";
      const match = pathname.match(/\/([^\/]+)\/p\//i);
      if (match && match[1]) {
        title = cleanSlug(match[1]);
      }
      canonicalUrl = `https://www.flipkart.com${pathname}`;
    } else if (host.includes("croma.")) {
      store = "Croma";
      const match = pathname.match(/\/([^\/]+)\/p\//i);
      if (match && match[1]) {
        title = cleanSlug(match[1]);
      }
      canonicalUrl = `https://www.croma.com${pathname}`;
    } else if (host.includes("reliancedigital.")) {
      store = "Reliance Digital";
      const match = pathname.match(/\/([^\/]+)\/p\//i);
      if (match && match[1]) {
        title = cleanSlug(match[1]);
      }
      canonicalUrl = `https://www.reliancedigital.in${pathname}`;
    } else if (host.includes("1mg.")) {
      store = "Tata 1mg";
      const match = pathname.match(/\/(drugs|otc)\/([^\/]+)/i);
      if (match && match[2]) {
        title = cleanSlug(match[2].replace(/-\d+$/, ""));
      }
      canonicalUrl = `https://www.1mg.com${pathname}`;
    } else if (host.includes("apollopharmacy.")) {
      store = "Apollo 24|7";
      const match = pathname.match(/\/(otc|medicine)\/([^\/]+)/i);
      if (match && match[2]) {
        title = cleanSlug(match[2]);
      }
      canonicalUrl = `https://www.apollopharmacy.in${pathname}`;
    } else if (host.includes("myntra.")) {
      store = "Myntra";
      const parts = pathname.split("/").filter(Boolean);
      const buyIdx = parts.indexOf("buy");
      if (buyIdx > 1) {
        title = cleanSlug(parts[buyIdx - 2]);
      } else if (parts.length >= 2) {
        title = cleanSlug(parts[parts.length - 2] || parts[parts.length - 1]);
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
    const host = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname;

    // 1. AMAZON (e.g. /Dell-R5-7520U-Processor-Standard-Keyboard/dp/B0G48V56FV or /Apple-iPhone-16-128-GB/dp/B0DJ2XYZ)
    if (host.includes("amazon.")) {
      const match = pathname.match(/\/([^\/]+)\/dp\/[A-Z0-9]+/i);
      if (match && match[1]) {
        return cleanSlug(match[1]);
      }
      const parts = pathname.split("/").filter(Boolean);
      if (parts.length > 0 && parts[0] !== "dp" && parts[0] !== "gp") {
        return cleanSlug(parts[0]);
      }
    }

    // 2. FLIPKART (e.g. /apple-iphone-16-black-128-gb/p/itm43212abcd)
    if (host.includes("flipkart.")) {
      const match = pathname.match(/\/([^\/]+)\/p\//i);
      if (match && match[1]) {
        return cleanSlug(match[1]);
      }
      const parts = pathname.split("/").filter(Boolean);
      if (parts.length > 0) return cleanSlug(parts[0]);
    }

    // 3. MYNTRA (e.g. /shirts/roadster/men-navy-blue-cotton-casual-shirt/12345/buy)
    if (host.includes("myntra.")) {
      const parts = pathname.split("/").filter(Boolean);
      const buyIdx = parts.indexOf("buy");
      if (buyIdx > 1) {
        return cleanSlug(parts[buyIdx - 2]);
      }
      if (parts.length >= 2) {
        return cleanSlug(parts[parts.length - 2] || parts[parts.length - 1]);
      }
    }

    // 4. CROMA (e.g. /apple-iphone-16-128gb-black-/p/309123)
    if (host.includes("croma.")) {
      const match = pathname.match(/\/([^\/]+)\/p\//i);
      if (match && match[1]) {
        return cleanSlug(match[1]);
      }
    }

    // 5. RELIANCE DIGITAL (e.g. /apple-iphone-16-128-gb-black/p/494422998)
    if (host.includes("reliancedigital.")) {
      const match = pathname.match(/\/([^\/]+)\/p\//i);
      if (match && match[1]) {
        return cleanSlug(match[1]);
      }
    }

    // 6. TATA 1MG (e.g. /drugs/dolo-650-tablet-41221)
    if (host.includes("1mg.")) {
      const match = pathname.match(/\/drugs\/([^\/]+)/i);
      if (match && match[1]) {
        return cleanSlug(match[1].replace(/-\d+$/, ""));
      }
      const matchOtc = pathname.match(/\/otc\/([^\/]+)/i);
      if (matchOtc && matchOtc[1]) {
        return cleanSlug(matchOtc[1].replace(/-\d+$/, ""));
      }
    }

    // 7. APOLLO PHARMACY (e.g. /otc/dolo-650-mg-strip-of-15-tablets)
    if (host.includes("apollopharmacy.")) {
      const match = pathname.match(/\/(otc|medicine)\/([^\/]+)/i);
      if (match && match[2]) {
        return cleanSlug(match[2]);
      }
    }

    // 8. AJIO (e.g. /dnmx-men-slim-fit-shirt/p/4412345)
    if (host.includes("ajio.")) {
      const match = pathname.match(/\/([^\/]+)\/p\//i);
      if (match && match[1]) {
        return cleanSlug(match[1]);
      }
    }

    // Generic fallback
    const fallbackParts = pathname.split("/").filter((p) => p.length > 3 && !/^\d+$/.test(p) && p !== "product" && p !== "item");
    if (fallbackParts.length > 0) {
      return cleanSlug(fallbackParts[0]);
    }

    return url;
  } catch (err) {
    return url;
  }
}

/**
 * Converts dashed/underscored URL slugs into clean capitalized product titles
 * and removes trailing technical marketing filler from Amazon/Flipkart slugs.
 */
function cleanSlug(slug = "") {
  let decoded = decodeURIComponent(slug)
    .replace(/[-_]+/g, " ")
    .replace(/\b(dp|p|buy|item|itm|id|ref|pd)\b/gi, " ");

  // Remove Amazon/Flipkart technical bullet noise from the end of product slugs
  const technicalFillerPatterns = [
    /\bstandard\s+keyboard\b/gi,
    /\bbacklit\s+keyboard\b/gi,
    /\bspill\s+resistant\s+keyboard\b/gi,
    /\bchicklet\s+keyboard\b/gi,
    /\benglish\s+keyboard\b/gi,
    /\bfingerprint\s+reader\b/gi,
    /\bintegrated\s+graphics\b/gi,
    /\banti\s+glare\b/gi,
    /\bnarrow\s+border\b/gi,
    /\bthin\s+and\s+light\b/gi,
    /\bwindows\s+11\s+home\b/gi,
    /\bwin\s*11\b/gi,
    /\bmso\s*21\b/gi,
    /\b15\s*month\s*mcafee\b/gi,
    /\bwith\s+alexa\b/gi,
    /\bprocessor\b/gi,
    /\bcarbon\s+black\b/gi,
    /\bplatinum\s+silver\b/gi,
    /\bdark\s+ash\s+silver\b/gi,
    // Audio & Earbud Slugs technical noise
    /\b\d+(\.\d+)?\s*mm\s*drivers?\b/gi,
    /\bdrivers?\b/gi,
    /\b\d+\s*hrs?\s*playback\b/gi,
    /\bplayback\b/gi,
    /\bfast\s*charging\b/gi,
    /\bsupervooc\b/gi,
    /\bip\d{2}\b/gi,
    /\bwater\s*resistant\b/gi,
    /\bsweat\s*resistant\b/gi,
    /\bwith\s*mic\b/gi,
    /\bdual\s*mic\b/gi,
    /\bquad\s*mic\b/gi,
    /\bbluetooth\s*v?\d+(\.\d+)?\b/gi,
    /\blatency\b/gi
  ];

  technicalFillerPatterns.forEach((pattern) => {
    decoded = decoded.replace(pattern, " ");
  });

  decoded = decoded.replace(/\s+/g, " ").trim();

  // If slug contains a laptop brand + processor (e.g. Dell R5-7520U), ensure 'Laptop' keyword is present
  const isLaptopCpu = /\b(dell|hp|lenovo|asus|acer)\b.*\b(r[3579][-\s]?\d{4}[a-z]?|i[3579][-\s]?\d{4,5}[a-z]?|ryzen\s*[3579]|core\s*i[3579])\b/i.test(decoded);
  if (isLaptopCpu && !/\b(laptop|notebook)\b/i.test(decoded)) {
    decoded += " Laptop";
  }

  return decoded;
}
