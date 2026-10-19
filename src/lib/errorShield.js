/**
 * Enterprise Secret & Infrastructure Leak Shield
 * Prevents sensitive API keys, connection strings, database URLs, and server paths
 * from leaking into client responses, console dumps, or public-facing crash dossiers.
 */

// Regex patterns for sensitive credentials and credentials formats
const SENSITIVE_PATTERNS = [
  // Groq API Keys (gsk_...)
  { pattern: /\bgsk_[a-zA-Z0-9_\-]{20,}\b/g, replacement: "[REDACTED_GROQ_KEY]" },
  // OpenAI Keys (sk-..., sk-proj-...)
  { pattern: /\bsk-(?:proj-)?[a-zA-Z0-9_\-]{20,}\b/g, replacement: "[REDACTED_AI_KEY]" },
  // Clerk Publishable & Secret Keys (pk_test_..., sk_test_..., pk_live_..., sk_live_...)
  { pattern: /\b(?:pk|sk)_(?:test|live)_[a-zA-Z0-9_\$]{15,}\b/g, replacement: "[REDACTED_CLERK_KEY]" },
  // Upstash / Redis Connection Strings
  { pattern: /rediss?:\/\/[^:\s]+:[^@\s]+@[^\s\/]+/gi, replacement: "rediss://[REDACTED_USER]:[REDACTED_PASS]@[HOST]" },
  // RapidAPI / Generic Bearer Tokens
  { pattern: /(?:Bearer\s+)[A-Za-z0-9\-_.~+/]{20,}={0,2}/gi, replacement: "Bearer [REDACTED_BEARER_TOKEN]" },
  // Authorization headers in JSON strings
  { pattern: /"(?:authorization|x-api-key|rapidapi-key)":\s*"[^"]+"/gi, replacement: '"authorization": "[REDACTED_HEADER]"' },
  // Windows absolute user paths (e.g. C:\Users\ASUS\...)
  { pattern: /[a-zA-Z]:\\Users\\[^\\]+\\[^\s"'<>]+/gi, replacement: "[LOCAL_APP_PATH]" },
  // Unix absolute home paths (/home/user/... or /Users/user/...)
  { pattern: /\/(?:home|Users)\/[^\/\s]+\/[^\s"'<>]+/gi, replacement: "[LOCAL_APP_PATH]" },
  // Database connection URLs (postgres://, mysql://, mongodb+srv://)
  { pattern: /(?:postgres|postgresql|mysql|mongodb(?:\+srv)?):\/\/[^\s"'<>]+/gi, replacement: "[REDACTED_DATABASE_URL]" }
];

/**
 * Redact all secret tokens, credentials, and internal paths from any string
 */
export function maskSecretTokens(input) {
  if (!input) return "";
  let text = typeof input === "string" ? input : String(input);
  
  for (const { pattern, replacement } of SENSITIVE_PATTERNS) {
    text = text.replace(pattern, replacement);
  }
  return text;
}

/**
 * Sanitize an error object or message for safe client delivery
 * Ensures internal provider names, database schemas, and stack traces never leak to users.
 */
export function safeClientError(err, fallbackMessage = "A secure server error occurred. Please try again shortly.") {
  if (!err) return { message: fallbackMessage, code: "INTERNAL_ERROR" };

  const rawMessage = typeof err === "string" ? err : (err?.message || fallbackMessage);
  const sanitized = maskSecretTokens(rawMessage);

  // Strip internal provider names or sensitive infrastructure cues
  const userSafe = sanitized
    .replace(/OpenWebNinja/gi, "Product Search Network")
    .replace(/Groq/gi, "AI Engine")
    .replace(/RapidAPI/gi, "Affiliate Gateway")
    .replace(/Upstash|Redis/gi, "High-Speed Cache")
    .replace(/ECONNREFUSED|ENOTFOUND|ETIMEDOUT/g, "SERVICE_TIMEOUT");

  return {
    message: userSafe,
    safe: true
  };
}

/**
 * Deep sanitize an object (e.g. request headers, body, or error metadata) before logging
 */
export function sanitizeLogPayload(obj) {
  if (!obj || typeof obj !== "object") {
    return maskSecretTokens(String(obj || ""));
  }

  try {
    const jsonStr = JSON.stringify(obj);
    const masked = maskSecretTokens(jsonStr);
    return JSON.parse(masked);
  } catch {
    return "[Unserializable Payload]";
  }
}
