/**
 * ShopSmart AI — Official Brand Offer & Coupon Engine (Powered by Zyte API)
 *
 * Fetches 100% verified official promotional codes and offer pages directly from
 * brand D2C stores (e.g. boAt, Noise, Myntra, Domino's, Nike, Sephora) without
 * third-party affiliate intermediaries.
 *
 * Utilizes Zyte's Pay-As-You-Go HTTP response body extraction ($0.13 - $0.50 / 1k requests).
 */

export function getZyteApiKey() {
  return (process.env.ZYTE_API_KEY || "").trim();
}

/**
 * Fetch raw HTML content from an official merchant website via Zyte API.
 *
 * @param {string} targetUrl - Official brand offer / store URL
 * @param {Object} options
 * @param {boolean} [options.browserHtml=false] - Whether full browser JS execution is required (default false for cheap HTTP response)
 * @param {number} [options.timeoutMs=20000] - Timeout ceiling in milliseconds
 * @returns {Promise<string|null>} Clean decoded HTML or null if failed / unconfigured
 */
/**
 * Validate that URL is a safe, public HTTP/HTTPS URL and not a private SSRF vector
 */
export function isSafeExternalUrl(targetUrl) {
  if (!targetUrl || typeof targetUrl !== "string") return false;
  const clean = targetUrl.trim();
  if (!clean.startsWith("http://") && !clean.startsWith("https://")) return false;
  try {
    const parsed = new URL(clean);
    if (!["http:", "https:"].includes(parsed.protocol)) return false;
    const host = parsed.hostname.toLowerCase();
    if (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "0.0.0.0" ||
      host === "169.254.169.254" ||
      host === "::1" ||
      /^10\./.test(host) ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host) ||
      /^192\.168\./.test(host) ||
      host.endsWith(".internal") ||
      host.endsWith(".local")
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function fetchOfficialBrandPage(targetUrl, { browserHtml = false, timeoutMs = 20000 } = {}) {
  const apiKey = getZyteApiKey();
  if (!apiKey) {
    console.warn("[ZyteService] Notice: ZYTE_API_KEY environment variable is not configured.");
    return null;
  }

  const cleanUrl = String(targetUrl || "").trim();
  if (!isSafeExternalUrl(cleanUrl)) return null;

  const authHeader = "Basic " + Buffer.from(apiKey + ":").toString("base64");

  const requestBody = {
    url: cleanUrl,
    ...(browserHtml ? { browserHtml: true } : { httpResponseBody: true })
  };

  try {
    const res = await fetch("https://api.zyte.com/v1/extract", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(timeoutMs)
    });

    if (!res.ok) {
      console.warn(`[ZyteService] Request to ${cleanUrl} returned HTTP status ${res.status}`);
      return null;
    }

    const data = await res.json();
    const encodedBody = browserHtml ? data.browserHtml : data.httpResponseBody;

    if (!encodedBody) {
      console.warn(`[ZyteService] No HTML payload returned for ${cleanUrl}`);
      return null;
    }

    const html = Buffer.from(encodedBody, "base64").toString("utf8");
    return html;
  } catch (err) {
    console.warn(`[ZyteService] Failed to fetch ${cleanUrl}:`, err.message);
    return null;
  }
}

/**
 * Extract live structured product details (name, price, currency, image, specs) directly using Zyte API.
 *
 * @param {string} targetUrl - Direct product page URL (Amazon, Flipkart, Croma, boAt, etc.)
 * @param {Object} [options]
 * @param {number} [options.timeoutMs=20000] - Request timeout ceiling
 * @returns {Promise<Object|null>} Structured product object or null
 */
export async function extractProductWithZyte(targetUrl, { timeoutMs = 20000 } = {}) {
  const apiKey = getZyteApiKey();
  if (!apiKey) {
    console.warn("[ZyteService] ZYTE_API_KEY is not configured.");
    return null;
  }

  const cleanUrl = String(targetUrl || "").trim();
  if (!isSafeExternalUrl(cleanUrl)) return null;

  const authHeader = "Basic " + Buffer.from(apiKey + ":").toString("base64");

  try {
    const res = await fetch("https://api.zyte.com/v1/extract", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader
      },
      body: JSON.stringify({
        url: cleanUrl,
        product: true
      }),
      signal: AbortSignal.timeout(timeoutMs)
    });

    if (!res.ok) {
      console.warn(`[ZyteService] Product extract to ${cleanUrl} returned HTTP status ${res.status}`);
      return null;
    }

    const data = await res.json();
    if (!data.product || data.product.name === "404 Not Found") {
      return null;
    }

    const prod = data.product;
    const priceNum = typeof prod.price === "number" ? prod.price : parseFloat(prod.price) || null;

    return {
      success: true,
      title: prod.name || "",
      brand: prod.brand?.name || "",
      price: priceNum ? `₹${Math.round(priceNum).toLocaleString("en-IN")}` : "",
      rawPrice: priceNum,
      currency: prod.currency || "INR",
      image: prod.mainImage?.url || prod.images?.[0]?.url || "",
      description: prod.description || "",
      specifications: prod.specifications || [],
      features: prod.features || [],
      url: cleanUrl
    };
  } catch (err) {
    console.warn(`[ZyteService] Product extraction failed for ${cleanUrl}:`, err.message);
    return null;
  }
}

