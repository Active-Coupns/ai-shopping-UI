/**
 * User Journey & Activity Tracker (Client-Side Non-Intrusive Ledger)
 * 
 * Tracks user browsing signals, clicks, AI review requests, and search activity
 * in a local-first mirror + sends non-blocking telemetry beacons to the backend.
 * 
 * Strict Principle: NEVER modifies or tampers with the user's raw search query.
 */

const SESSION_KEY = "shopsmart_session_id_v2";
const MIRROR_KEY = "shopsmart_journey_mirror_v2";
const MAX_LOCAL_ITEMS = 8;

export function getSessionId() {
  if (typeof window === "undefined") return "server_session";
  try {
    let sid = localStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = `usr_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
      localStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch (_) {
    return "anon_fallback_session";
  }
}

function getLocalMirror() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(MIRROR_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

function updateLocalMirror(updater) {
  if (typeof window === "undefined") return;
  try {
    const current = getLocalMirror() || {
      sessionId: getSessionId(),
      searches: [],
      clickedProducts: [],
      aiSummaries: [],
      guideContext: null
    };
    const updated = updater(current);
    localStorage.setItem(MIRROR_KEY, JSON.stringify(updated));
  } catch (_) {}
}

async function sendBeacon(eventType, payload) {
  if (typeof window === "undefined") return;
  const sessionId = getSessionId();

  try {
    const body = JSON.stringify({ sessionId, eventType, payload });
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      // Use Beacon API for 0ms delay during tab switches or navigation
      const blob = new Blob([body], { type: "application/json" });
      const sent = navigator.sendBeacon("/api/telemetry/event", blob);
      if (sent) return;
    }

    // Fallback to non-blocking fetch with keepalive
    fetch("/api/telemetry/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true
    }).catch(() => {});
  } catch (_) {}
}

export const userJourneyTracker = {
  /**
   * Log Page Visit
   */
  recordVisit() {
    updateLocalMirror(m => ({
      ...m,
      lastActive: Date.now()
    }));
    sendBeacon("VISIT", {});
  },

  /**
   * Log User Search (Purely for telemetry and contextual AI awareness, never alters query)
   */
  recordSearch(query, mode = "shopping") {
    const cleanQuery = String(query || "").trim();
    if (!cleanQuery) return;

    updateLocalMirror(m => {
      const filtered = (m.searches || []).filter(s => s.query.toLowerCase() !== cleanQuery.toLowerCase());
      return {
        ...m,
        searches: [{ query: cleanQuery, mode, timestamp: Date.now() }, ...filtered].slice(0, MAX_LOCAL_ITEMS)
      };
    });

    sendBeacon("SEARCH", { query: cleanQuery, mode });
  },

  /**
   * Log Product Deal Click (when user clicks "View Deal" / "Buy Directly")
   */
  recordProductClick(product, storeName) {
    if (!product || !product.title) return;
    const item = {
      title: product.title,
      price: product.price || product.rawPrice || "N/A",
      store: storeName || product.store_name || product.store || "Online Store",
      dealLink: product.deal_link || product.affiliateUrl || "#"
    };

    updateLocalMirror(m => {
      const filtered = (m.clickedProducts || []).filter(p => p.title.toLowerCase() !== item.title.toLowerCase());
      return {
        ...m,
        clickedProducts: [{ ...item, timestamp: Date.now() }, ...filtered].slice(0, MAX_LOCAL_ITEMS)
      };
    });

    sendBeacon("PRODUCT_CLICK", item);
  },

  /**
   * Log "Ask AI About Product" Summary Request
   */
  recordAiSummary(product, storeName, category = "ecommerce") {
    if (!product || !product.title) return;
    const item = {
      title: product.title,
      price: product.price || product.rawPrice || "N/A",
      store: storeName || product.store_name || product.store || "Online Store",
      category
    };

    updateLocalMirror(m => {
      const filtered = (m.aiSummaries || []).filter(p => p.title.toLowerCase() !== item.title.toLowerCase());
      return {
        ...m,
        aiSummaries: [{ ...item, timestamp: Date.now() }, ...filtered].slice(0, MAX_LOCAL_ITEMS)
      };
    });

    sendBeacon("AI_SUMMARY_ASKED", item);
  },

  /**
   * Sync AI Guide Context (When user converses with Pre-Search AI Guide)
   */
  recordGuideSync(personaData = {}) {
    updateLocalMirror(m => ({
      ...m,
      guideContext: {
        ...personaData,
        timestamp: Date.now()
      }
    }));

    sendBeacon("AI_GUIDE_SYNC", personaData);
  },

  /**
   * Get Recently Inspected Products to feed into AI Review comparison
   */
  getRecentViewedProducts() {
    const mirror = getLocalMirror();
    if (!mirror) return [];
    
    // Combine clicked products & AI summaries, unique by title
    const combined = [...(mirror.aiSummaries || []), ...(mirror.clickedProducts || [])];
    const unique = [];
    const seen = new Set();

    for (const item of combined) {
      const key = (item.title || "").toLowerCase().slice(0, 40);
      if (key && !seen.has(key)) {
        seen.add(key);
        unique.push({
          title: item.title,
          price: item.price,
          store: item.store
        });
      }
      if (unique.length >= 4) break;
    }

    return unique;
  },

  /**
   * Get Full Journey Context (for AI Guide or Personalization)
   */
  getJourneyContext() {
    return getLocalMirror();
  },

  /**
   * Clear Session Journey
   */
  clearJourney() {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(MIRROR_KEY);
      } catch (_) {}
    }
    const sessionId = getSessionId();
    fetch(`/api/telemetry/event?sessionId=${encodeURIComponent(sessionId)}&action=clear`, {
      method: "GET"
    }).catch(() => {});
  }
};

export default userJourneyTracker;
