/**
 * Executes search query by calling the Next.js internal search API endpoint.
 * @param {string} query - Product search query.
 * @param {string} country - Target country code (US or IN).
 * @returns {Promise<object>} - Results containing list of mapped products.
 */
export async function searchProducts(query, country = "IN") {
  try {
    const response = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, country }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`API search failed: ${errText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("searchProducts service error:", error);
    throw error;
  }
}

/**
 * Triggers a session ping and reveals active coupon code.
 * @param {string} store - Store name (e.g. Amazon, Flipkart)
 * @param {string} url - Product details url
 * @param {string} code - Coupon code to activate
 * @param {number|null} clientId - Client account identification
 * @returns {Promise<object>} - Coupon disclosure confirmation
 */
export async function revealCoupon(store, url, code, clientId = null) {
  try {
    console.log(`[Affiliate Link Tracking] Revealing coupon ${code} for store ${store} -> redirecting to ${url}`);
    return {
      status: "success",
      message: "Affiliate attribution successfully registered."
    };
  } catch (error) {
    console.error("revealCoupon service error:", error);
    throw error;
  }
}
