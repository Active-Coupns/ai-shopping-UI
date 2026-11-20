/**
 * Benefisto — Dodo Payments Official Integration Service
 * Manages multi-currency checkout sessions, recurring subscriptions, and credit packs.
 */

// Production & Test API Keys
const DODO_API_KEY = process.env.DODO_PAYMENTS_API_KEY || "dodo_test_JpP4KvwP6CkRLgBB.HOFehGrKM-sSN6sAUQpqA3CawrAkmM54pcUGIK6JwqhlQtgU";
const IS_LIVE = DODO_API_KEY.startsWith("dodo_live_") || process.env.DODO_PAYMENTS_MODE === "live";
const DODO_BASE_URL = IS_LIVE ? "https://live.dodopayments.com" : "https://test.dodopayments.com";

/**
 * Benefisto Curated Credit Packs & VIP Subscriptions
 */
export const DODO_PRODUCTS = {
  starter: {
    id: "pdt_0NsLgfLE5oqwEqeTWejLi",
    name: "Benefisto Starter (30 Sparks)",
    priceInr: 19,
    priceUsd: 0.99,
    sparks: 30,
    tryonCount: 10,
    isRecurring: false,
    badge: "Trial Pack",
    description: "30 Sparks — Good for 10 Virtual Try-Ons or 30 Deep Product Reviews"
  },
  power: {
    id: "pdt_0NsLgitB68bSsuv45VzFV",
    name: "Benefisto Power Shopper (100 Sparks)",
    priceInr: 49,
    priceUsd: 1.99,
    sparks: 100,
    tryonCount: 33,
    isRecurring: false,
    badge: "Most Popular — 50% Off",
    description: "100 Sparks — Good for 33 Virtual Try-Ons or 100 Deep Product Reviews"
  },
  vip: {
    id: "pdt_0NsLgivPL6SCz7qeataFl",
    name: "Benefisto VIP Monthly Pass",
    priceInr: 99,
    priceUsd: 3.99,
    sparks: 250,
    tryonCount: 25,
    isRecurring: true,
    badge: "Best Value VIP",
    description: "Unlimited AI Shopping Searches + 25 Virtual Try-Ons every month + VIP Alerts"
  }
};

/**
 * Creates a Dodo Payments checkout session
 */
export async function createDodoCheckoutSession({
  planKey = "power",
  userId,
  userEmail,
  userName = "Shopper",
  country = "IN",
  returnUrl = "https://www.benefisto.com/?payment=success"
}) {
  const product = DODO_PRODUCTS[planKey] || DODO_PRODUCTS.power;

  const payload = {
    product_cart: [
      {
        product_id: product.id,
        quantity: 1
      }
    ],
    billing_currency: country === "IN" ? "INR" : "USD",
    return_url: returnUrl,
    customer: {
      email: userEmail || "shopper@benefisto.com",
      name: userName || "Benefisto User"
    },
    metadata: {
      userId: userId || "guest",
      planKey: planKey,
      sparks: String(product.sparks),
      isRecurring: String(product.isRecurring)
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
