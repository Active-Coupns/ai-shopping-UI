import { SUPPORTED_COUNTRIES } from "./countryConfig";

/**
 * High-Reliability IP Geolocation Country Detector
 * 1. Honors user's saved preference in localStorage first (if already selected/confirmed)
 * 2. Fetches real client ISP geolocation via public endpoint (uses Nagpur/India ISP connection)
 * 3. Falls back to internal /api/geo/detect endpoint
 * 4. Defaults to "IN" (India) — NEVER falls back to US from clock timezone
 */
export async function detectUserCountry() {
  if (typeof window === "undefined") return "IN";

  // 1. Check if user already confirmed or selected a country
  try {
    const saved = localStorage.getItem("user_selected_country");
    if (saved && SUPPORTED_COUNTRIES[saved.toUpperCase()]) {
      return saved.toUpperCase();
    }
  } catch (_) {}

  // 2. Client-side fetch using user's real internet connection (Nagpur/India ISP IP)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch("https://api.country.is", {
      signal: controller.signal,
      headers: { "Accept": "application/json" }
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      const code = String(data?.country || "").toUpperCase();
      if (SUPPORTED_COUNTRIES[code]) {
        console.log("[ShopSmart Geo] Detected country via IP:", code);
        return code;
      }
    }
  } catch (_) {}

  // 3. Fallback: Check internal API route
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);
    const res = await fetch("/api/geo/detect", { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      const code = String(data?.country || "").toUpperCase();
      if (SUPPORTED_COUNTRIES[code]) {
        return code;
      }
    }
  } catch (_) {}

  // 4. Default to India ("IN")
  return "IN";
}
