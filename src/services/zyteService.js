/**
 * ShopSmart AI — Official Brand Offer & Coupon Engine (Powered by Zyte API)
 *
 * Fetches 100% verified official promotional codes and offer pages directly from
 * brand D2C stores (e.g. boAt, Noise, Myntra, Domino's, Nike, Sephora) without
 * third-party affiliate intermediaries.
 *
 * Utilizes Zyte's Pay-As-You-Go HTTP response body extraction ($0.13 - $0.50 / 1k requests).
 */

import crypto from "crypto";
import { redis } from "./redis.js";

export function getZyteApiKey() {
  return (process.env.ZYTE_API_KEY || "").trim();
}

/**
 * Detect country code from URL domain for dynamic IP routing in Zyte API.
 * Ensures local country IPs (US, GB, CA, IN, AU, DE, FR, AE, JP) to bypass anti-bot and regional blocking.
 */
export function detectCountryCode(targetUrl) {
  if (!targetUrl || typeof targetUrl !== "string") return undefined;
  const lower = targetUrl.toLowerCase();
  try {
    const parsed = new URL(lower.startsWith("http") ? lower : `https://${lower}`);
    const host = parsed.hostname;
    if (host.endsWith(".ca") || host.includes("amazon.ca") || host.includes("walmart.ca")) return "CA";
    if (host.endsWith(".co.uk") || host.endsWith(".uk") || host.includes("amazon.co.uk")) return "GB";
    if (host.endsWith(".in") || host.includes("flipkart.com") || host.includes("amazon.in") || host.includes("croma.com") || host.includes("reliancedigital.in")) return "IN";
    if (host.endsWith(".com.au") || host.endsWith(".au") || host.includes("amazon.com.au")) return "AU";
    if (host.endsWith(".de") || host.includes("amazon.de")) return "DE";
    if (host.endsWith(".fr") || host.includes("amazon.fr")) return "FR";
    if (host.endsWith(".ae") || host.includes("amazon.ae")) return "AE";
    if (host.endsWith(".jp") || host.includes("amazon.co.jp")) return "JP";
    if (host.endsWith(".com") || host.includes("amazon.com") || host.includes("bestbuy.com") || host.includes("walmart.com")) return "US";
  } catch {}
  return undefined;
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

  // 1. Check Redis Cache First ($0 cost, 1ms latency)
  const urlHash = crypto.createHash("sha256").update(cleanUrl).digest("hex").slice(0, 32);
  const cacheKey = `cache:zyte:prod:v3:${urlHash}`;
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      const parsed = typeof cached === "string" ? JSON.parse(cached) : cached;
      if (parsed && parsed.title) {
        return { ...parsed, fromCache: true };
      }
    }
  } catch (_) {}

  const authHeader = "Basic " + Buffer.from(apiKey + ":").toString("base64");
  const geo = detectCountryCode(cleanUrl);

  const requestBody = {
    url: cleanUrl,
    ...(browserHtml ? { browserHtml: true } : { httpResponseBody: true }),
    ...(geo ? { geolocation: geo } : {})
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
export async function extractProductWithZyte(targetUrl, { timeoutMs = 35000 } = {}) {
  const apiKey = getZyteApiKey();
  if (!apiKey) {
    console.warn("[ZyteService] ZYTE_API_KEY is not configured.");
    return null;
  }

  const cleanUrl = String(targetUrl || "").trim();
  if (!isSafeExternalUrl(cleanUrl)) return null;

  // 1. Check Redis Cache First ($0 cost, 1ms latency)
  const urlHash = crypto.createHash("sha256").update(cleanUrl).digest("hex").slice(0, 32);
  const cacheKey = `cache:zyte:prod:v3:${urlHash}`;
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      const parsed = typeof cached === "string" ? JSON.parse(cached) : cached;
      if (parsed && parsed.title) {
        return { ...parsed, fromCache: true };
      }
    }
  } catch (_) {}

  const authHeader = "Basic " + Buffer.from(apiKey + ":").toString("base64");
  const geo = detectCountryCode(cleanUrl);

  try {
    const res = await fetch("https://api.zyte.com/v1/extract", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader
      },
      body: JSON.stringify({
        url: cleanUrl,
        product: true,
        ...(geo ? { geolocation: geo } : {})
      }),
      signal: AbortSignal.timeout(timeoutMs)
    });

    if (!res.ok) {
      console.warn(`[ZyteService] Product extract to ${cleanUrl} returned HTTP status ${res.status}`);
      return null;
    }

    const data = await res.json();
    if (!data.product || !data.product.name || data.product.name === "404 Not Found" || data.product.name.toLowerCase().includes("page not found")) {
      return null;
    }

    const prod = data.product;
    // Check for Amazon 404 dog image placeholder
    if (prod.mainImage?.url && (prod.mainImage.url.includes("104._TTD_") || prod.mainImage.url.includes("dog"))) {
      return null;
    }
    const priceNum = typeof prod.price === "number" ? prod.price : parseFloat(prod.price) || null;

    let curr = (prod.currency || "").toUpperCase();
    if (!curr) {
      if (cleanUrl.includes(".ca/") || cleanUrl.includes("amazon.ca")) curr = "CAD";
      else if (cleanUrl.includes(".co.uk/") || cleanUrl.includes("amazon.co.uk")) curr = "GBP";
      else if (cleanUrl.includes(".com.au/") || cleanUrl.includes("amazon.com.au")) curr = "AUD";
      else if (cleanUrl.includes(".ae/") || cleanUrl.includes("amazon.ae")) curr = "AED";
      else if (cleanUrl.includes(".com/") || cleanUrl.includes("amazon.com") || cleanUrl.includes("bestbuy.com")) curr = "USD";
      else curr = "INR";
    }

    const sym = curr === "USD" ? "$" : curr === "GBP" ? "£" : curr === "CAD" ? "C$" : curr === "EUR" ? "€" : curr === "AED" ? "AED " : "₹";
    const loc = curr === "USD" ? "en-US" : curr === "GBP" ? "en-GB" : curr === "CAD" ? "en-CA" : "en-IN";

    const extractedResult = {
      success: true,
      title: prod.name || "",
      brand: prod.brand?.name || "",
      price: priceNum ? `${sym}${Number.isInteger(priceNum) ? priceNum.toLocaleString(loc) : priceNum.toFixed(2)}` : "",
      rawPrice: priceNum,
      currency: curr,
      image: prod.mainImage?.url || prod.images?.[0]?.url || "",
      description: prod.description || "",
      specifications: prod.specifications || [],
      features: prod.features || [],
      aggregateRating: prod.aggregateRating || null,
      rating: prod.aggregateRating?.ratingValue || null,
      reviewCount: prod.aggregateRating?.reviewCount || null,
      url: cleanUrl
    };

    try {
      await redis.set(cacheKey, JSON.stringify(extractedResult), { ex: 86400 * 3 });
    } catch (_) {}

    return extractedResult;
  } catch (err) {
    console.warn(`[ZyteService] Product extraction failed for ${cleanUrl}:`, err.message);
    return null;
  }
}

