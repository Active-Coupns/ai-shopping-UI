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
export async function fetchOfficialBrandPage(targetUrl, { browserHtml = false, timeoutMs = 20000 } = {}) {
  const apiKey = getZyteApiKey();
  if (!apiKey) {
    console.warn("[ZyteService] Notice: ZYTE_API_KEY environment variable is not configured.");
    return null;
  }

  const cleanUrl = String(targetUrl || "").trim();
  if (!cleanUrl.startsWith("http")) return null;

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
