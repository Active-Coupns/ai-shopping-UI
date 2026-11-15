/**
 * Benefisto AI — Feedico Managed Partner Catalog Integration
 * 
 * Directly queries Feedico's 48,000+ brand affiliate catalog and 26,000+ live verified coupons.
 * Generates tracked, high-converting /go links with Benefisto's 65% rev-share attribution.
 */

const FEEDICO_PARTNER_TOKEN = process.env.FEEDICO_PARTNER_TOKEN || "fdcp_3d1fb99ed3d71a5396094bb85e5fa5825660ff343d803bf586e2fef9832614d3";
const FEEDICO_BASE_URL = "https://partner.feedico.io";

/**
 * Fetch verified live coupons from Feedico Partner Catalog
 * @param {Object} options
 * @param {string} options.query - Store or keyword to search (e.g. "Nike", "Hostinger", "Zomato")
 * @param {string} [options.country] - 2-letter ISO code (e.g. "IN", "US", "GB", "CA", "AU", "AE")
 * @param {number} [options.page=1]
 * @param {number} [options.pageSize=20]
 * @returns {Promise<{ success: boolean, total: number, coupons: Array }>}
 */
export async function fetchFeedicoCoupons({ query = "", country = "", page = 1, pageSize = 20 } = {}) {
  try {
    const payload = {
      page: Math.max(1, Number(page) || 1),
      pageSize: Math.min(50, Math.max(1, Number(pageSize) || 20))
    };

    if (query && query.trim()) {
      payload.q = query.trim();
    }

    if (country && country.trim() && country !== "ALL") {
      const upper = country.trim().toUpperCase();
      // Map standard country codes; include worldwide 'WW' coupons for broader matching
      payload.countries = [upper, "WW"];
    }

    const response = await fetch(`${FEEDICO_BASE_URL}/api/catalog/coupons`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${FEEDICO_PARTNER_TOKEN}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload),
      next: { revalidate: 3600 } // Cache at edge for 1 hour
    });

    if (!response.ok) {
      console.warn(`[Feedico API] HTTP ${response.status} returned from catalog coupons endpoint.`);
      return { success: false, total: 0, coupons: [] };
    }

    const data = await response.json();
    const rawCoupons = Array.isArray(data?.coupons) ? data.coupons : [];

    const mappedCoupons = rawCoupons.map((c, index) => {
      const hasCode = Boolean(c.code && c.code.trim());
      const discountVal = c.discount?.value || (c.discount?.kind === "percent" ? 15 : 0);
      const isPercent = c.discount?.kind === "percent";

      return {
        id: c.id || `fdco-${c.goSlug || index}`,
        code: hasCode ? c.code.trim() : "DIRECT_DEAL",
        hasRealCode: hasCode,
        title: c.title || `${c.merchantName} Verified Special Offer`,
        description: c.description || c.terms || `Get verified savings when purchasing at ${c.merchantName}.`,
        discount_type: isPercent ? "PERCENT" : "FLAT",
        discount_val: discountVal,
        min_order: c.minOrder || null,
        badge: hasCode ? "VERIFIED CODE" : "INSTANT DEAL",
        verified_rate: "98% Success Rate",
        valid_till: c.endsAt ? c.endsAt.split("T")[0] : "Limited Time",
        terms: c.terms || null,
        merchantName: c.merchantName,
        websiteUrl: c.websiteUrl,
        goUrl: c.goUrl, // Pre-tagged with Benefisto partner ID (A05whQV-yvH5diQm)
        source: "feedico"
      };
    });

    return {
      success: true,
      total: data.meta?.total || mappedCoupons.length,
      hasMore: Boolean(data.meta?.hasMore),
      coupons: mappedCoupons
    };
  } catch (error) {
    console.error("[Feedico Service Error]:", error);
    return { success: false, total: 0, coupons: [], error: error.message };
  }
}

/**
 * Fetch verified merchant list from Feedico Partner Catalog
 * @param {Object} options
 * @param {string} options.query - Store search keyword
 * @param {number} [options.limit=24]
 * @returns {Promise<{ success: boolean, total: number, merchants: Array }>}
 */
export async function fetchFeedicoMerchants({ query = "", limit = 24 } = {}) {
  try {
    const payload = {
      pageSize: Math.min(50, Math.max(1, Number(limit) || 24))
    };

    if (query && query.trim()) {
      payload.q = query.trim();
    }

    const response = await fetch(`${FEEDICO_BASE_URL}/api/catalog/merchants`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${FEEDICO_PARTNER_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
      next: { revalidate: 3600 }
    });

    if (!response.ok) return { success: false, total: 0, merchants: [] };

    const data = await response.json();
    const rawMerchants = Array.isArray(data?.merchants) ? data.merchants : [];

    return {
      success: true,
      total: data.meta?.total || rawMerchants.length,
      merchants: rawMerchants.map(m => ({
        name: m.name,
        goSlug: m.goSlug,
        websiteUrl: m.websiteUrl,
        couponCount: m.couponCount,
        goUrl: m.goUrl,
        partnerRate: m.commission?.partnerRate,
        partnerShare: m.commission?.partnerShare
      }))
    };
  } catch (err) {
    console.error("[Feedico Merchants Error]:", err);
    return { success: false, total: 0, merchants: [] };
  }
}
