/**
 * Benefisto — Dodo Payments Integration Service
 * Manages localized 60-day credit packs for Virtual Try-On and AI Shopping Search.
 */

const DODO_API_KEY = process.env.DODO_PAYMENTS_API_KEY || "dodo_test_JpP4KvwP6CkRLgBB.HOFehGrKM-sSN6sAUQpqA3CawrAkmM54pcUGIK6JwqhlQtgU";
const IS_LIVE = DODO_API_KEY.startsWith("dodo_live_") || process.env.DODO_PAYMENTS_MODE === "live";
const DODO_BASE_URL = IS_LIVE ? "https://live.dodopayments.com" : "https://test.dodopayments.com";

const LIVE_PRODUCT_IDS = {
  tryon_medium: "pdt_0NsPQyJ5kRsnh2Ez2iz5z",
  tryon_large: "pdt_0NsPR1cPQuX4dgkldfe1c",
  search_medium: "pdt_0NsPR1fUYu9UvLugIhLBo",
  search_large: "pdt_0NsPR1hEd0GbVRSCUSSnA"
};

const TEST_PRODUCT_IDS = {
  tryon_medium: "pdt_0NsMRB0afKy5FubtlNt7G",
  tryon_large: "pdt_0NsMRB2VG2QaXxa2csfnp",
  search_medium: "pdt_0NsMRB5gQlAg1apTrj9tz",
  search_large: "pdt_0NsMRBD7GcWtPXhZh08cW"
};

export function getDodoProductId(planKey) {
  if (IS_LIVE) {
    return LIVE_PRODUCT_IDS[planKey] || LIVE_PRODUCT_IDS.tryon_medium;
  }
  return TEST_PRODUCT_IDS[planKey] || TEST_PRODUCT_IDS.tryon_medium;
}

export const COUNTRY_CONFIG = {
  IN: { code: "INR", symbol: "₹", name: "India" },
  US: { code: "USD", symbol: "$", name: "United States" },
  GB: { code: "GBP", symbol: "£", name: "United Kingdom" },
  CA: { code: "CAD", symbol: "C$", name: "Canada" },
  AU: { code: "AUD", symbol: "A$", name: "Australia" },
  AE: { code: "AED", symbol: "AED ", name: "UAE" }
};

/**
 * 2-Tier Clean Credit Packs (60 Days Validity strictly, Additive Top-up)
 */
export const DODO_PRODUCTS = {
  // --- VIRTUAL TRY-ON PACKS ---
  tryon_medium: {
    id: "pdt_0NsMRB0afKy5FubtlNt7G",
    category: "tryon",
    tier: "medium",
    name: "Try-On Pack — Medium",
    credits: 14,
    validityDays: 60,
    badge: "Most Popular",
    prices: {
      IN: 49,
      US: 2.49,
      GB: 1.99,
      CA: 3.49,
      AU: 3.99,
      AE: 9.99
    },
    description: "14 Virtual Try-Ons (High GPU Speed • 60 Days Validity)"
  },
  tryon_large: {
    id: "pdt_0NsMRB2VG2QaXxa2csfnp",
    category: "tryon",
    tier: "large",
    name: "Try-On Pack — Large",
    credits: 30,
    validityDays: 60,
    badge: "Best Value (Save 20%)",
    prices: {
      IN: 99,
      US: 4.99,
      GB: 3.99,
      CA: 6.99,
      AU: 7.49,
      AE: 18.99
    },
    description: "30 Virtual Try-Ons (High GPU Speed • 60 Days Validity)"
  },

  // --- AI SHOPPING & SEARCH PACKS ---
  search_medium: {
    id: "pdt_0NsMRB5gQlAg1apTrj9tz",
    category: "search",
    tier: "medium",
    name: "Search Pack — Medium",
    credits: 120,
    validityDays: 60,
    badge: "Popular Top-Up",
    prices: {
      IN: 39,
      US: 1.99,
      GB: 1.69,
      CA: 2.69,
      AU: 2.99,
      AE: 7.99
    },
    description: "120 Deep AI Search, Trust Sheet & Price Calls (60 Days Validity)"
  },
  search_large: {
    id: "pdt_0NsMRBD7GcWtPXhZh08cW",
    category: "search",
    tier: "large",
    name: "Search Pack — Large",
    credits: 260,
    validityDays: 60,
    badge: "Heavy Shopper (Save 25%)",
    prices: {
      IN: 79,
      US: 3.99,
      GB: 3.29,
      CA: 5.49,
      AU: 5.99,
      AE: 14.99
    },
    description: "260 Deep AI Search, Trust Sheet & Price Calls (60 Days Validity)"
  }
};

/**
 * Creates a Dodo Payments checkout session
 */
export async function createDodoCheckoutSession({
  planKey = "tryon_medium",
  userId,
  userEmail,
  userName = "Shopper",
  country = "IN",
  returnUrl = "https://www.benefisto.com/?payment=success"
}) {
  const product = DODO_PRODUCTS[planKey] || DODO_PRODUCTS.tryon_medium;
  const productId = getDodoProductId(planKey);
  const currency = country === "IN" ? "INR" : "USD";

  const payload = {
    product_cart: [
      {
        product_id: productId,
        quantity: 1
      }
    ],
    billing_currency: currency,
    return_url: returnUrl,
    customer: {
      email: userEmail || "shopper@benefisto.com",
      name: userName || "Benefisto User"
    },
    metadata: {
      userId: userId || "guest",
      planKey: planKey,
      category: product.category,
      credits: String(product.credits),
      validityDays: String(product.validityDays)
    }
  };

  const response = await fetch(`${DODO_BASE_URL}/checkouts`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${DODO_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[Dodo Service] Checkout creation failed:", response.status, errorText);
    throw new Error(`Dodo checkout creation failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return {
    sessionId: data.session_id,
    checkoutUrl: data.checkout_url
  };
}
