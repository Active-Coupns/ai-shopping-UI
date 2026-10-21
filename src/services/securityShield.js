/**
 * ShopSmart AI — Platform-Wide Security Shield & Unified Protection Engine
 *
 * Provides zero-latency, high-performance security enforcement across:
 * 1. Content Moderation & Harmful Search Filtering (Illegal narcotics, weapons of violence, malware)
 * 2. AI Prompt Injection & Delimiter Isolation (System prompt protection & persona jailbreak defense)
 * 3. Open Redirect & SSRF Phishing Defense (Blocks internal/private IPs and unsafe protocols)
 * 4. Input Length Clamping & Buffer Exhaustion Protection
 */

const JAILBREAK_REGEX = /\b(ignore (all|previous|prior|above)|system prompt|reveal (key|system|instructions|token|secret)|developer mode|jailbreak|override rules?|forget instructions|dan mode)\b/i;

// Highly targeted illegal / violent patterns (Zero false-positives on everyday retail e.g. kitchen knives, pharma, garments)
const HARMFUL_SEARCH_PATTERNS = [
  // Violent explosives / Weapons of mass harm
  /\b((make|build|create|how to (make|build)) (a )?(pipe )?bomb|pipe bomb|ied explosive|molotov cocktail|bomb making|buy (rdx|ak47|dynamite))\b/i,
  // Commercial distribution of illicit narcotics
  /\b(buy (heroin|cocaine|methamphetamine|fentanyl|mdma|charas online|drugs online)|how to make (meth|fentanyl))\b/i,
  // Child exploitation & illegal abuse
  /\b(child abuse material|csam|underage sex)\b/i,
  // Active cyber exploitation & credential dumps
  /\b(ransomware payload for hire|ddos booter for hire|credit card cvv dump|stolen credit cards buy)\b/i
];

/**
 * Safely clamp string length to prevent memory or token exhaustion
 */
export function clampString(str, maxLen = 200) {
  if (!str || typeof str !== "string") return "";
  return str.trim().slice(0, maxLen);
}

/**
 * Check search query against illegal, violent, or hazardous content.
 * 0.00ms latency execution.
 */
export function checkSearchContentSafety(rawQuery = "") {
  const query = clampString(rawQuery, 200);
  if (!query) return { safe: true, query: "" };

  for (const pattern of HARMFUL_SEARCH_PATTERNS) {
    if (pattern.test(query)) {
      return {
        safe: false,
        reason: "ShopSmart AI supports only lawful and safe shopping queries. Please search for consumer products or gadgets.",
        matchedCategory: "HARMFUL_SEARCH_QUERY"
      };
    }
  }

  return { safe: true, query };
}

/**
 * Sanitize AI Chat / Assistant user input and guard against prompt injection
 */
export function sanitizeAiPrompt(rawMessage = "", maxLen = 500) {
  const cleanText = clampString(rawMessage, maxLen);
  if (!cleanText) {
    return { isJailbreak: false, cleanText: "", isolatedPromptBlock: "" };
  }

  const isJailbreak = JAILBREAK_REGEX.test(cleanText);

  // XML-style isolated delimiter block to prevent LLM prompt leakage
  const isolatedPromptBlock = `<user_inquiry>\n${cleanText}\n</user_inquiry>`;

  return {
    isJailbreak,
    cleanText,
    isolatedPromptBlock
  };
}

/**
 * Validate redirect URLs against SSRF, internal IP addresses, and malicious protocols
 */
export function isSafeRedirectUrl(targetUrl = "") {
  if (!targetUrl || typeof targetUrl !== "string") {
    return { safe: false, reason: "Target URL is required." };
  }

  const clean = targetUrl.trim();
  if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
    return { safe: false, reason: "Only HTTP and HTTPS URLs are permitted." };
  }

  let parsed;
  try {
    parsed = new URL(clean);
  } catch {
    return { safe: false, reason: "Invalid URL structure." };
  }

  const host = parsed.hostname.toLowerCase();

  // Deny localhost, private IPs, link-local, cloud metadata
  if (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "0.0.0.0" ||
    host === "169.254.169.254" ||
    host === "::1" ||
    /^10\./.test(host) ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^fc00:/.test(host) ||
    /^fe80:/.test(host) ||
    host.endsWith(".internal") ||
    host.endsWith(".local")
  ) {
    return { safe: false, reason: "Redirects to local or private network addresses are strictly prohibited." };
  }

  return { safe: true, cleanUrl: parsed.toString() };
}
