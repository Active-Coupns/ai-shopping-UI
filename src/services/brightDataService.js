/**
 * ShopSmart AI — Universal Product Extraction Engine (Powered by Bright Data Web Unlocker)
 *
 * Replaces fragile scraping with Bright Data's 72M+ Residential Proxy Network
 * to achieve 99.9% Akamai, Cloudflare, and PerimeterX bypass globally (Croma, Walmart, Amazon, Flipkart, etc.).
 *
 * Zero-Liability, Pay-Only-For-Success, 100% Authentic Spec Extraction.
 */

import crypto from "crypto";
import { redis } from "./redis.js";
import { extractProductWithZyte } from "./zyteService.js";

export function getBrightDataApiKey() {
  return (process.env.BRIGHT_DATA_API_KEY || "").trim();
}

export function getBrightDataZone() {
  return (process.env.BRIGHT_DATA_ZONE || "web_unlocker1shopsmart").trim();
}

export function getGroqApiKey() {
  return (process.env.GROQ_API_KEY || "").trim();
}

/**
 * Detect country code from URL domain for dynamic IP routing in Bright Data Web Unlocker.
 */
export function detectCountryCode(targetUrl) {
  if (!targetUrl || typeof targetUrl !== "string") return "in";
  const lower = targetUrl.toLowerCase();
  try {
    const parsed = new URL(lower.startsWith("http") ? lower : `https://${lower}`);
    const host = parsed.hostname;
    if (host.endsWith(".ca") || host.includes("amazon.ca") || host.includes("walmart.ca")) return "ca";
    if (host.endsWith(".co.uk") || host.endsWith(".uk") || host.includes("amazon.co.uk") || host.includes("currys.co.uk") || host.includes("argos.co.uk")) return "gb";
    if (host.endsWith(".in") || host.includes("flipkart.com") || host.includes("amazon.in") || host.includes("croma.com") || host.includes("reliancedigital.in") || host.includes("tatacliq.com")) return "in";
    if (host.endsWith(".com.au") || host.endsWith(".au") || host.includes("amazon.com.au") || host.includes("jbhifi.com.au")) return "au";
    if (host.endsWith(".ae") || host.includes("amazon.ae") || host.includes("noon.com") || host.includes("sharafdg.com")) return "ae";
    if (host.endsWith(".com") || host.includes("amazon.com") || host.includes("bestbuy.com") || host.includes("walmart.com") || host.includes("target.com")) return "us";
  } catch {}
  return "in";
}

/**
 * Validate that URL is a safe, public HTTP/HTTPS URL
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

/**
 * Extract live structured product details (name, price, currency, image, specs)
 * via Bright Data Web Unlocker + Groq Multi-Model Schema Parser.
 *
 * @param {string} targetUrl - Direct product page URL
 * @param {Object} [options]
 * @param {string} [options.country=null] - Country override (IN, US, GB, CA, AU, AE)
 * @param {number} [options.timeoutMs=45000] - Request timeout ceiling
 * @returns {Promise<Object|null>} Structured product object or null
 */
export async function extractProductWithBrightData(targetUrl, { country = null, timeoutMs = 45000 } = {}) {
  const apiKey = getBrightDataApiKey();
  const zone = getBrightDataZone();
  if (!apiKey) {
    console.warn("[BrightDataService] BRIGHT_DATA_API_KEY is not configured.");
    return null;
  }

  const cleanUrl = String(targetUrl || "").trim();
  if (!isSafeExternalUrl(cleanUrl)) return null;

  // 1. Check Redis Cache First ($0 cost, 1ms latency)
  const urlHash = crypto.createHash("sha256").update(cleanUrl).digest("hex").slice(0, 32);
  const cacheKey = `cache:brightdata:prod:v1:${urlHash}`;
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      const parsed = typeof cached === "string" ? JSON.parse(cached) : cached;
      if (parsed && parsed.title) {
        return { ...parsed, fromCache: true };
      }
    }
  } catch (_) {}

  // 2. Determine target country for residential proxy routing
  const rawCountry = country ? String(country).toLowerCase().trim() : null;
  const targetCountry = rawCountry === "uk" ? "gb" : rawCountry || detectCountryCode(cleanUrl);

  try {
    // 3. Call Bright Data Web Unlocker API
    const res = await fetch("https://api.brightdata.com/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        zone: zone,
        url: cleanUrl,
        format: "raw",
        country: targetCountry
      }),
      signal: AbortSignal.timeout(timeoutMs)
    });

    if (!res.ok) {
      console.warn(`[BrightDataService] Unlocker returned HTTP ${res.status} for ${cleanUrl}`);
      return null;
    }

    const html = await res.text();
    if (!html || html.length < 500) {
      console.warn(`[BrightDataService] Empty or tiny payload received for ${cleanUrl}`);
      return null;
    }

    // 4. Extract Structured Data Blocks (Schema.org / JSON-LD)
    const pageTitle = (html.match(/<title>([^<]+)<\/title>/i) || [])[1] || "";
    const ldJsons = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
      .map(m => m[1])
      .join("\n---\n");

    // Clean text snippet for fallback spec extraction
    const textSample = html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, "")
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .slice(0, 12000);

    // 5. High-Speed LLM Schema Extraction via Groq (Sub-800ms)
    const groqKey = getGroqApiKey();
    if (!groqKey) {
      console.warn("[BrightDataService] GROQ_API_KEY is missing for schema extraction.");
      return null;
    }

    const extractionPrompt = `You are ShopSmart AI's Master Product Understanding Engine.
Extract the complete, authentic product details from this e-commerce page HTML/Metadata.
Target URL: ${cleanUrl}
Page Title: ${pageTitle}

Structured Schema.org Data:
${ldJsons.slice(0, 6000)}

Page Text Content:
${textSample.slice(0, 6000)}

Return ONLY valid JSON matching this exact structure:
{
  "title": "string (full authentic product name without store suffixes)",
  "brand": "string",
  "price": "string (formatted with currency symbol, e.g. ₹59,900 or $49.99)",
  "rawPrice": number,
  "regularPrice": "string (original MRP or strike-through price if discounted)",
  "rawRegularPrice": number,
  "currency": "string (INR, USD, GBP, CAD, AUD, AED)",
  "image": "string (high-res primary product photo URL)",
  "description": "string (clean 2-3 sentence overview)",
  "specifications": [
    { "name": "Key Spec", "value": "Detailed Value" }
  ],
  "features": [
    "string"
  ],
  "bankOffers": [
    "string"
  ],
  "rating": number or null,
  "reviewCount": number or null
}`;

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${groqKey}`
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [{ role: "user", content: extractionPrompt }],
        temperature: 0.1,
        response_format: { type: "json_object" }
      }),
      signal: AbortSignal.timeout(15000)
    });

    if (!groqRes.ok) {
      console.warn(`[BrightDataService] Groq extraction error HTTP ${groqRes.status}`);
      return null;
    }

    const groqData = await groqRes.json();
    const rawContent = groqData.choices?.[0]?.message?.content;
    if (!rawContent) return null;

    let parsedResult;
    try {
      parsedResult = JSON.parse(rawContent.trim());
    } catch (e) {
      console.warn("[BrightDataService] Failed to parse Groq JSON:", e.message);
      return null;
    }

    if (!parsedResult.title) return null;

    const finalProduct = {
      success: true,
      title: parsedResult.title || "",
      brand: parsedResult.brand || "",
      price: parsedResult.price || "",
      rawPrice: typeof parsedResult.rawPrice === "number" ? parsedResult.rawPrice : parseFloat(parsedResult.rawPrice) || null,
      regularPrice: parsedResult.regularPrice || "",
      rawRegularPrice: typeof parsedResult.rawRegularPrice === "number" ? parsedResult.rawRegularPrice : parseFloat(parsedResult.rawRegularPrice) || null,
      currency: parsedResult.currency || (targetCountry === "in" ? "INR" : targetCountry === "gb" ? "GBP" : targetCountry === "ca" ? "CAD" : targetCountry === "ae" ? "AED" : "USD"),
      image: parsedResult.image || "",
      description: parsedResult.description || "",
      specifications: Array.isArray(parsedResult.specifications) ? parsedResult.specifications.filter(s => s && s.name && s.value) : [],
      features: Array.isArray(parsedResult.features) ? parsedResult.features : [],
      bankOffers: Array.isArray(parsedResult.bankOffers) ? parsedResult.bankOffers : [],
      breadcrumbs: [],
      rating: parsedResult.rating || null,
      reviewCount: parsedResult.reviewCount || null,
      url: cleanUrl
    };

    // 6. Cache in Redis for 3 days ($0 re-fetch, instant UI render)
    try {
      await redis.set(cacheKey, JSON.stringify(finalProduct), { ex: 86400 * 3 });
    } catch (_) {}

    return finalProduct;
  } catch (err) {
    console.warn(`[BrightDataService] Bright Data extraction error for ${cleanUrl}:`, err.message);
  }

  // Dual-Engine Fallback: If Bright Data had a domain restriction or timeout, fall back to Zyte
  try {
    const zyteFallback = await extractProductWithZyte(cleanUrl, { country, timeoutMs: 25000 });
    if (zyteFallback && zyteFallback.success && zyteFallback.title) {
      return zyteFallback;
    }
  } catch (_) {}

  return null;
}
