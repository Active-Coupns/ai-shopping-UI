import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { getSubscriptionsCatalog } from "@/data/subscriptionsRegistry";

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL || "";
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || "";

let redisClient = null;
if (UPSTASH_REDIS_REST_URL && UPSTASH_REDIS_REST_TOKEN) {
  redisClient = new Redis({
    url: UPSTASH_REDIS_REST_URL,
    token: UPSTASH_REDIS_REST_TOKEN
  });
}

// In-memory fallback if Redis is unreachable
const memoryOnDemandCatalog = new Map();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = (searchParams.get("country") || "IN").toUpperCase();
    const isUK = country === "GB" || country === "UK";
    const isUS = country === "US";
    const isCA = country === "CA";
    const isAU = country === "AU";
    const isAE = country === "AE";
    const setKey = isAE ? "ondemand_slugs_set_ae" : (isAU ? "ondemand_slugs_set_au" : (isCA ? "ondemand_slugs_set_ca" : (isUK ? "ondemand_slugs_set_gb" : (isUS ? "ondemand_slugs_set_us" : "ondemand_slugs_set"))));
    const keyPrefix = isAE ? "ondemand_sub_ae_" : (isAU ? "ondemand_sub_au_" : (isCA ? "ondemand_sub_ca_" : (isUK ? "ondemand_sub_gb_" : (isUS ? "ondemand_sub_us_" : "ondemand_sub_"))));

    let onDemandSubs = [];
    if (redisClient) {
      const keys = await redisClient.smembers(setKey).catch(() => []);
      if (Array.isArray(keys) && keys.length > 0) {
        for (const slug of keys) {
          const raw = await redisClient.get(`${keyPrefix}${slug}`).catch(() => null);
          if (raw) {
            const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
            onDemandSubs.push(parsed);
          }
        }
      }
    }

    if (onDemandSubs.length === 0 && memoryOnDemandCatalog.size > 0) {
      onDemandSubs = Array.from(memoryOnDemandCatalog.values()).filter(
        (s) => {
          const c = (s.country || "IN").toUpperCase();
          return c === country || (isUK && (c === "GB" || c === "UK"));
        }
      );
    }

    return NextResponse.json({
      success: true,
      count: onDemandSubs.length,
      brands: onDemandSubs
    });
  } catch (err) {
    console.error("[On-Demand Subscriptions] GET Error:", err);
    return NextResponse.json({ success: true, count: 0, brands: [] });
  }
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const rawBrandName = String(body.brandName || "").trim();
    const rawCountry = String(body.country || "IN").toUpperCase();

    // 1. SECURITY GUARDRAIL: Input Validation & Sanitization
    if (!rawBrandName || rawBrandName.length < 2 || rawBrandName.length > 40) {
      return NextResponse.json({ 
        error: "Brand name must be between 2 and 40 characters." 
      }, { status: 400 });
    }

    // Strict whitelist regex: Alphanumeric, spaces, and safe brand symbols (- + & . ')
    const SAFE_BRAND_REGEX = /^[a-zA-Z0-9\s\-+&.'’]{2,40}$/;
    if (!SAFE_BRAND_REGEX.test(rawBrandName)) {
      return NextResponse.json({ 
        error: "Invalid brand name format. Only letters, numbers, spaces, and safe symbols (- + & . ') are allowed." 
      }, { status: 400 });
    }

    // Reject dangerous injection tokens
    const DANGEROUS_PATTERNS = [
      /<script/i, /<\/script>/i, /javascript:/i, /eval\(/i, /onload=/i, /onerror=/i,
      /ignore\s+(previous|all)\s+instructions/i, /system\s*:/i, /you\s+are\s+now/i,
      /drop\s+table/i, /select\s+.*\s+from/i, /union\s+select/i
    ];
    if (DANGEROUS_PATTERNS.some(pattern => pattern.test(rawBrandName))) {
      return NextResponse.json({ 
        error: "Security violation: Disallowed characters or prompt injection patterns detected." 
      }, { status: 400 });
    }

    const isUK = rawCountry === "GB" || rawCountry === "UK";
    const isUS = rawCountry === "US";
    const isCA = rawCountry === "CA";
    const isAU = rawCountry === "AU";
    const isAE = rawCountry === "AE";
    const country = isAE ? "AE" : (isAU ? "AU" : (isCA ? "CA" : (isUK ? "GB" : (isUS ? "US" : "IN"))));
    const setKey = isAE ? "ondemand_slugs_set_ae" : (isAU ? "ondemand_slugs_set_au" : (isCA ? "ondemand_slugs_set_ca" : (isUK ? "ondemand_slugs_set_gb" : (isUS ? "ondemand_slugs_set_us" : "ondemand_slugs_set"))));
    const keyPrefix = isAE ? "ondemand_sub_ae_" : (isAU ? "ondemand_sub_au_" : (isCA ? "ondemand_sub_ca_" : (isUK ? "ondemand_sub_gb_" : (isUS ? "ondemand_sub_us_" : "ondemand_sub_"))));
    const currencySymbol = isAE ? "AED" : (isAU ? "A$" : (isCA ? "C$" : (isUK ? "£" : (isUS ? "$" : "₹"))));

    // 2. SECURITY GUARDRAIL: Strict Slug Sanitization
    const cleanSlug = rawBrandName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    if (!cleanSlug || cleanSlug.length < 2 || cleanSlug.length > 50 || !/^[a-z0-9-]+$/.test(cleanSlug)) {
      return NextResponse.json({ 
        error: "Could not generate a valid slug from the provided brand name." 
      }, { status: 400 });
    }

    // Check if brand already exists in static catalog
    const staticCatalog = getSubscriptionsCatalog(country);
    const existingInStatic = staticCatalog.find(
      (s) => s.name.toLowerCase().includes(rawBrandName.toLowerCase()) || 
             s.id.toLowerCase() === rawBrandName.toLowerCase() ||
             s.id.toLowerCase() === cleanSlug
    );

    if (existingInStatic) {
      return NextResponse.json({
        success: true,
        isNew: false,
        message: "Brand already exists in baseline catalog.",
        brand: existingInStatic
      });
    }

    // Check Redis for cached on-demand brand
    if (redisClient) {
      const cached = await redisClient.get(`${keyPrefix}${cleanSlug}`).catch(() => null);
      if (cached) {
        const parsed = typeof cached === "string" ? JSON.parse(cached) : cached;
        return NextResponse.json({
          success: true,
          isNew: false,
          isCached: true,
          brand: parsed
        });
      }
    }

    if (memoryOnDemandCatalog.has(`${country}_${cleanSlug}`)) {
      return NextResponse.json({
        success: true,
        isNew: false,
        isCached: true,
        brand: memoryOnDemandCatalog.get(`${country}_${cleanSlug}`)
      });
    }

    // Research & generate complete 4-level data using Groq AI
    const systemPrompt = isAE
      ? `You are a real-time digital subscription catalog architect for the United Arab Emirates (UAE / AE).
The user wants to generate verified UAE subscription catalog data for "${rawBrandName}".

Generate a 100% verified, production-ready subscription entry matching our exact schema.
Include real UAE subscription plans (e.g. Standard, Premium 4K), pricing in AED, screen limits, resolution, and the 4-Level Savings Blueprint (carrier perks from Etisalat by e& Freedom / eLife fiber or du Power / Home Wireless, vouchers at Smiles by e& / YouGotaGift / ENBD credit cards, combo passes, promo codes).

OUTPUT STRICTLY AS VALID JSON MATCHING THIS EXACT SCHEMA:
{
  "id": "${cleanSlug}",
  "name": "${rawBrandName}",
  "country": "AE",
  "currencySymbol": "AED",
  "category": "video",
  "tagline": "Catchy 1-line description of the service and content in the UAE",
  "logoText": "Short 3-6 char uppercase text for logo box",
  "accentColor": "from-red-600 to-emerald-900",
  "badge": "Popular UAE Entertainment",
  "popularShows": ["Popular Show 1", "Popular Show 2", "Popular Show 3", "Popular Show 4"],
  "plans": [
    {
      "name": "Standard",
      "price": 35.00,
      "period": "month",
      "screens": 2,
      "resolution": "Full HD (1080p)",
      "devices": "All Devices (TV, Phone, Laptop)",
      "audio": "Dolby 5.1",
      "ads": "Ad-Supported"
    },
    {
      "name": "Premium 4K",
      "price": 55.00,
      "period": "month",
      "screens": 4,
      "resolution": "4K Ultra HD",
      "devices": "All Devices (TV, Phone, Laptop)",
      "audio": "Dolby Atmos",
      "ads": "100% Ad-Free"
    }
  ],
  "savingsBlueprint": {
    "telecomFree": [
      {
        "operator": "Etisalat by e& / du",
        "plan": "e& Freedom Plan / eLife Fiber or du Power perk",
        "claimSteps": "Claim via My Etisalat UAE or du App under Entertainment Perks"
      }
    ],
    "voucherSavings": {
      "provider": "Smiles by e& / YouGotaGift UAE",
      "discountPercent": "15% Smiles Value",
      "instructions": "Redeem accumulated Smiles points or buy discounted digital gift cards using cashback credit cards (ENBD / ADCB)",
      "effectivePrice": 29.75
    },
    "comboPass": {
      "passName": "e& Entertainment Multi-Pass",
      "passPrice": 79.00,
      "individualSum": 110.00,
      "netSavings": "31.00/mo",
      "bundledWith": ["OSN+", "Starzplay", "Shahid VIP"]
    },
    "coupons": [
      {
        "code": "UAESTREAM26",
        "discount": "Special UAE introductory discount",
        "verified": true
      }
    ],
    "officialUrl": "https://www.google.ae"
  },
  "seo": {
    "slug": "${cleanSlug}",
    "catchyH1": "${rawBrandName} UAE Subscription Plans 2026: Pricing, Discounts & Deals",
    "seoKeywords": ["${rawBrandName} UAE plans", "${rawBrandName} discount", "${rawBrandName} Etisalat du perk"],
    "faqs": [
      {
        "question": "How to get this subscription at a discount in the UAE?",
        "answer": "Check telecom perks from Etisalat by e& or du, or redeem Smiles points for vouchers."
      }
    ]
  }
}`
      : isAU
      ? `You are a real-time digital subscription catalog architect for Australia (AU).
The user wants to generate verified Australian subscription catalog data for "${rawBrandName}".

Generate a 100% verified, production-ready subscription entry matching our exact schema.
Include real Australian subscription plans (e.g. Basic, Standard, Premium 4K), pricing in AUD (A$), screen limits, resolution, and the 4-Level Savings Blueprint (carrier perks from Optus SubHub 10% discount / Telstra Plus $10-$12.50 credits / Hubbl Stack & Save, vouchers at Woolworths 20x Everyday Rewards or Cashrewards/ShopBack, combo passes, promo codes).

OUTPUT STRICTLY AS VALID JSON MATCHING THIS EXACT SCHEMA:
{
  "id": "${cleanSlug}",
  "name": "${rawBrandName}",
  "country": "AU",
  "currencySymbol": "A$",
  "category": "video",
  "tagline": "Catchy 1-line description of the service and content in Australia",
  "logoText": "Short 3-6 char uppercase text for logo box",
  "accentColor": "from-amber-500 to-emerald-900",
  "badge": "Popular Australian Streaming",
  "popularShows": ["Popular Show 1", "Popular Show 2", "Popular Show 3", "Popular Show 4"],
  "plans": [
    {
      "name": "Standard with Ads",
      "price": 7.99,
      "period": "month",
      "screens": 2,
      "resolution": "Full HD (1080p)",
      "devices": "All Devices (TV, Phone, Laptop)",
      "audio": "Dolby 5.1",
      "ads": "Ad-Supported"
    },
    {
      "name": "Premium Ad-Free",
      "price": 16.99,
      "period": "month",
      "screens": 4,
      "resolution": "4K Ultra HD",
      "devices": "All Devices (TV, Phone, Laptop)",
      "audio": "Dolby Atmos",
      "ads": "100% Ad-Free"
    }
  ],
  "savingsBlueprint": {
    "telecomFree": [
      {
        "operator": "Optus SubHub / Telstra",
        "plan": "Optus SubHub 10% discount or Telstra Plus perk",
        "claimSteps": "How to activate in My Optus SubHub or My Telstra account"
      }
    ],
    "voucherSavings": {
      "provider": "Woolworths Everyday Rewards / Cashrewards",
      "discountPercent": "10% Reward Value",
      "instructions": "Buy digital gift card during 20x points weeks or activate Cashrewards before checkout",
      "effectivePrice": 14.99
    },
    "comboPass": {
      "passName": "Optus SubHub Entertainment Trio",
      "passPrice": 32.00,
      "individualSum": 40.00,
      "netSavings": "8.00/mo",
      "bundledWith": ["Partner Service 1", "Partner Service 2"]
    },
    "coupons": [
      {
        "code": "AUSTREAM26",
        "discount": "Special Australian introductory discount",
        "verified": true
      }
    ],
    "officialUrl": "https://www.google.com.au"
  },
  "seo": {
    "slug": "${cleanSlug}",
    "catchyH1": "${rawBrandName} Australia Subscription Plans 2026: Pricing, Discounts & Deals",
    "seoKeywords": ["${rawBrandName} Australia plans", "${rawBrandName} discount", "${rawBrandName} Optus Telstra perk"],
    "faqs": [
      {
        "question": "How to get this subscription at a discount in Australia?",
        "answer": "Check wireless perks from Optus SubHub 10% stacking or Telstra Plus, or use Cashrewards for cashback."
      }
    ]
  }
}`
      : isCA
      ? `You are a real-time digital subscription catalog architect for Canada (CA).
The user wants to generate verified Canadian subscription catalog data for "${rawBrandName}".

Generate a 100% verified, production-ready subscription entry matching our exact schema.
Include real Canadian subscription plans (e.g. Standard with Ads, Ad-Free, Premium), pricing in CAD (C$), screen limits, resolution, and the 4-Level Savings Blueprint (carrier perks from Telus Stream+ / Bell Fibe TV & Crave / Rogers Ignite / RBC free DashPass, vouchers at Costco Canada or Rakuten CA, combo passes like Telus Stream+, promo codes).

OUTPUT STRICTLY AS VALID JSON MATCHING THIS EXACT SCHEMA:
{
  "id": "${cleanSlug}",
  "name": "${rawBrandName}",
  "country": "CA",
  "currencySymbol": "C$",
  "category": "video",
  "tagline": "Catchy 1-line description of the service and content in Canada",
  "logoText": "Short 3-6 char uppercase text for logo box",
  "accentColor": "from-red-600 to-slate-900",
  "badge": "Popular Canadian Streaming",
  "popularShows": ["Popular Show 1", "Popular Show 2", "Popular Show 3", "Popular Show 4"],
  "plans": [
    {
      "name": "Standard with Ads",
      "price": 6.99,
      "period": "month",
      "screens": 2,
      "resolution": "Full HD (1080p)",
      "devices": "All Devices (TV, Phone, Laptop)",
      "audio": "Dolby 5.1",
      "ads": "Ad-Supported"
    },
    {
      "name": "Premium Ad-Free",
      "price": 14.99,
      "period": "month",
      "screens": 4,
      "resolution": "4K Ultra HD",
      "devices": "All Devices (TV, Phone, Laptop)",
      "audio": "Dolby Atmos",
      "ads": "100% Ad-Free"
    }
  ],
  "savingsBlueprint": {
    "telecomFree": [
      {
        "operator": "Telus / Bell / Rogers",
        "plan": "Carrier perk, Telus Stream+, or Fibe TV bundle",
        "claimSteps": "How to activate in MyTelus or MyBell account"
      }
    ],
    "voucherSavings": {
      "provider": "Costco Canada / Rakuten CA",
      "discountPercent": "10%-15% Off",
      "instructions": "Buy digital voucher at Costco Canada or activate Rakuten CA for cashback",
      "effectivePrice": 12.99
    },
    "comboPass": {
      "passName": "Telus Stream+ Entertainment Pack",
      "passPrice": 20.00,
      "individualSum": 38.00,
      "netSavings": "18.00/mo",
      "bundledWith": ["Partner Service 1", "Partner Service 2"]
    },
    "coupons": [
      {
        "code": "CANSTREAM26",
        "discount": "Special Canadian introductory discount",
        "verified": true
      }
    ],
    "officialUrl": "https://www.google.ca"
  },
  "seo": {
    "slug": "${cleanSlug}",
    "catchyH1": "${rawBrandName} Canada Subscription Plans 2026: Pricing, Discounts & Deals",
    "seoKeywords": ["${rawBrandName} Canada plans", "${rawBrandName} discount", "${rawBrandName} Telus Bell perk"],
    "faqs": [
      {
        "question": "How to get this subscription at a discount in Canada?",
        "answer": "Check wireless perks from Telus Stream+ or Bell, or buy discounted gift cards at Costco Canada."
      }
    ]
  }
}`
      : isUK
      ? `You are a real-time digital subscription catalog architect for the United Kingdom (UK / GB).
The user wants to generate verified UK subscription catalog data for "${rawBrandName}".

Generate a 100% verified, production-ready subscription entry matching our exact schema.
Include real UK subscription plans (e.g. Standard with Ads, Ad-Free, Premium), pricing in GBP (£), screen limits, resolution, and the 4-Level Savings Blueprint (carrier perks from EE Inclusive Extras / O2 Priority up to 6 months free / Vodafone VeryMe / Sky TV or Cinema bundled Paramount+ & Discovery+, vouchers at TopCashback, Quidco or CDKeys, combo passes like Sky Stream or Virgin Media Stream, promo codes).

OUTPUT STRICTLY AS VALID JSON MATCHING THIS EXACT SCHEMA:
{
  "id": "${cleanSlug}",
  "name": "${rawBrandName}",
  "country": "GB",
  "currencySymbol": "£",
  "category": "video",
  "tagline": "Catchy 1-line description of the service and content in the UK",
  "logoText": "Short 3-6 char uppercase text for logo box",
  "accentColor": "from-blue-600 to-indigo-900",
  "badge": "Popular UK Streaming",
  "popularShows": ["Popular Show 1", "Popular Show 2", "Popular Show 3", "Popular Show 4"],
  "plans": [
    {
      "name": "Standard with Ads",
      "price": 4.99,
      "period": "month",
      "screens": 2,
      "resolution": "Full HD (1080p)",
      "devices": "All Devices (TV, Phone, Laptop)",
      "audio": "Dolby 5.1",
      "ads": "Ad-Supported"
    },
    {
      "name": "Premium Ad-Free",
      "price": 10.99,
      "period": "month",
      "screens": 4,
      "resolution": "4K Ultra HD",
      "devices": "All Devices (TV, Phone, Laptop)",
      "audio": "Dolby Atmos",
      "ads": "100% Ad-Free"
    }
  ],
  "savingsBlueprint": {
    "telecomFree": [
      {
        "operator": "EE / O2 / Sky / Vodafone",
        "plan": "Carrier perk, Inclusive Extra, or TV bundle details",
        "claimSteps": "How to activate in My EE or O2 Priority account"
      }
    ],
    "voucherSavings": {
      "provider": "TopCashback / CDKeys",
      "discountPercent": "5%-15% Off",
      "instructions": "Buy digital voucher or activate cashback before checkout",
      "effectivePrice": 9.49
    },
    "comboPass": {
      "passName": "Sky Stream / Virgin Media Stream Bundle",
      "passPrice": 18.00,
      "individualSum": 28.00,
      "netSavings": "10/mo",
      "bundledWith": ["Partner Service 1", "Partner Service 2"]
    },
    "coupons": [
      {
        "code": "UKSTREAM26",
        "discount": "Special UK introductory discount",
        "verified": true
      }
    ],
    "officialUrl": "https://www.google.co.uk"
  },
  "seo": {
    "slug": "${cleanSlug}",
    "catchyH1": "${rawBrandName} UK Subscription Plans 2026: Pricing, Discounts & Deals",
    "seoKeywords": ["${rawBrandName} UK plans", "${rawBrandName} discount", "${rawBrandName} EE O2 perk"],
    "faqs": [
      {
        "question": "How to get this subscription at a discount in the UK?",
        "answer": "Check mobile perks from EE or O2 Priority, or use TopCashback for cashback."
      }
    ]
  }
}`
      : isUS 
      ? `You are a real-time digital subscription catalog architect for the United States (US).
The user wants to generate verified US subscription catalog data for "${rawBrandName}".

Generate a 100% verified, production-ready subscription entry matching our exact schema.
Include real US subscription plans (e.g. Standard with Ads, Ad-Free, Premium 4K), pricing in USD ($), screen limits, resolution, and the 4-Level Savings Blueprint (carrier perks from T-Mobile 'On Us' / Verizon myPlan $10 perks / Spectrum $0 perks, vouchers at Target Circle 5% or Costco 10-15%, combo passes like Disney/Hulu/Max $16.99 or Walmart+, promo codes).

OUTPUT STRICTLY AS VALID JSON MATCHING THIS EXACT SCHEMA:
{
  "id": "${cleanSlug}",
  "name": "${rawBrandName}",
  "country": "US",
  "currencySymbol": "$",
  "category": "video",
  "tagline": "Catchy 1-line description of the service and content in the US",
  "logoText": "Short 3-6 char uppercase text for logo box",
  "accentColor": "from-blue-600 to-indigo-900",
  "badge": "Popular US Streaming",
  "popularShows": ["Popular Show 1", "Popular Show 2", "Popular Show 3", "Popular Show 4"],
  "plans": [
    {
      "name": "Standard with Ads",
      "price": 7.99,
      "period": "month",
      "screens": 2,
      "resolution": "Full HD (1080p)",
      "devices": "All Devices (TV, Phone, Laptop)",
      "audio": "Dolby 5.1",
      "ads": "Ad-Supported"
    },
    {
      "name": "Premium Ad-Free",
      "price": 14.99,
      "period": "month",
      "screens": 4,
      "resolution": "4K Ultra HD",
      "devices": "All Devices (TV, Phone, Laptop)",
      "audio": "Dolby Atmos",
      "ads": "100% Ad-Free"
    }
  ],
  "savingsBlueprint": {
    "telecomFree": [
      {
        "operator": "T-Mobile / Verizon / Spectrum",
        "plan": "Carrier perk or myPlan savings",
        "claimSteps": "How to activate in carrier account"
      }
    ],
    "voucherSavings": {
      "provider": "Target Circle / Costco",
      "discountPercent": "5%-10% Off",
      "instructions": "Buy digital gift card at Target Circle or Costco wholesale",
      "effectivePrice": 13.99
    },
    "comboPass": {
      "passName": "Mega Streamer Pass",
      "passPrice": 19.99,
      "individualSum": 32.99,
      "netSavings": "13/mo",
      "bundledWith": ["Partner Service 1", "Partner Service 2"]
    },
    "coupons": [
      {
        "code": "STREAMUS26",
        "discount": "Special promotional discount",
        "verified": true
      }
    ],
    "officialUrl": "https://www.google.com"
  },
  "seo": {
    "slug": "${cleanSlug}",
    "catchyH1": "${rawBrandName} US Subscription Plans 2026: Pricing, Discounts & Deals",
    "seoKeywords": ["${rawBrandName} US plans", "${rawBrandName} discount", "${rawBrandName} carrier perk"],
    "faqs": [
      {
        "question": "How to get this subscription at a discount in the US?",
        "answer": "Check wireless perks from T-Mobile, Verizon, or student discounts."
      }
    ]
  }
}`
      : `You are a real-time digital subscription catalog architect for India.
The user wants to generate verified Indian subscription catalog data for the platform "${rawBrandName}".

Generate a 100% verified, production-ready subscription entry matching our exact schema.
Include real Indian subscription plans (e.g. Mobile, Standard, Annual Gold, Premium), pricing in INR (₹), screen limits, resolution, and the 4-Level Savings Blueprint (telecom ₹0 perks like Airtel Xstream / JioFiber, vouchers on Gyftr / Amazon Pay, combo passes like Times Prime / Tata Play Binge, promo codes).

OUTPUT STRICTLY AS VALID JSON MATCHING THIS EXACT SCHEMA:
{
  "id": "${cleanSlug}",
  "name": "${rawBrandName}",
  "country": "IN",
  "currencySymbol": "₹",
  "category": "video",
  "tagline": "Catchy 1-line description of the service and content in India",
  "logoText": "Short 3-6 char uppercase text for logo box",
  "accentColor": "from-amber-600 to-rose-700",
  "badge": "Top Regional OTT",
  "popularShows": ["Popular Show 1", "Popular Show 2", "Popular Show 3", "Popular Show 4"],
  "plans": [
    {
      "name": "Mobile Edition",
      "price": 399,
      "period": "year",
      "screens": 1,
      "resolution": "HD (720p)",
      "devices": "Mobile & Tablet only",
      "audio": "Stereo",
      "ads": "Ad-Free"
    },
    {
      "name": "Gold (Annual)",
      "price": 699,
      "period": "year",
      "screens": 4,
      "resolution": "4K Ultra HD",
      "devices": "All Devices (TV, Web, Phone)",
      "audio": "Dolby 5.1",
      "ads": "100% Ad-Free"
    }
  ],
  "savingsBlueprint": {
    "telecomFree": [
      {
        "operator": "Airtel / Jio",
        "plan": "Recharge or Fiber plan details",
        "claimSteps": "How to claim via Airtel Thanks or MyJio"
      }
    ],
    "voucherSavings": {
      "provider": "Amazon Pay / Gyftr",
      "discountPercent": "10% Instant Cashback",
      "instructions": "Buy gift voucher with credit card for extra savings",
      "effectivePrice": 629
    },
    "comboPass": {
      "passName": "Tata Play Binge / Airtel Xstream Play",
      "passPrice": 999,
      "individualSum": 2500,
      "netSavings": "1,500+",
      "bundledWith": ["Disney+ Hotstar", "SonyLIV", "ZEE5"]
    },
    "coupons": [
      {
        "code": "PROMO2026",
        "discount": "Special Verification Offer",
        "verified": true
      }
    ],
    "officialUrl": "https://www.google.com"
  },
  "seo": {
    "slug": "${cleanSlug}",
    "catchyH1": "${rawBrandName} Subscription Plans 2026: Pricing, Discounts & Free Claim Guide",
    "seoKeywords": ["${rawBrandName} free plans", "${rawBrandName} discounted subscription", "${rawBrandName} Airtel Jio bundle"],
    "faqs": [
      {
        "question": "How to get this subscription for free in India?",
        "answer": "Check Airtel Xstream or JioFiber bundles which offer it with broadband packs."
      }
    ]
  }
}`;

    let brandData = null;

    if (GROQ_API_KEY) {
      try {
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${GROQ_API_KEY}`
          },
          body: JSON.stringify({
            model: "qwen/qwen3.8-27b",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: `Generate verified ${isAU ? "Australian" : (isCA ? "Canadian" : (isUK ? "UK" : (isUS ? "US" : "Indian")))} subscription catalog data for: ${rawBrandName}` }
            ],
            temperature: 0.1,
            response_format: { type: "json_object" }
          }),
          signal: AbortSignal.timeout(10000)
        });

        if (groqRes.ok) {
          const json = await groqRes.json();
          const content = json.choices?.[0]?.message?.content;
          if (content) {
            brandData = parseAiJson(content);
          }
        }
      } catch (err) {
        console.warn("[On-Demand Subscriptions] Groq error:", err.message);
      }
    }

    if (!brandData) {
      brandData = generateFallbackBrand(rawBrandName, cleanSlug, country);
    }

    // 3. SECURITY GUARDRAIL: Strict Schema & URL Sanitization
    const sanitizedBrand = sanitizeBrandData(brandData, rawBrandName, cleanSlug, country, currencySymbol);

    // 4. SECURITY GUARDRAIL: Persist to Redis with 90-Day TTL (Auto-cleanup)
    if (redisClient) {
      try {
        await redisClient.set(`${keyPrefix}${cleanSlug}`, JSON.stringify(sanitizedBrand), { ex: 7776000 });
        await redisClient.sadd(setKey, cleanSlug);
        console.log(`[On-Demand Subscriptions] Successfully stored brand '${cleanSlug}' in Redis (${country}) with 90-day TTL.`);
      } catch (redisErr) {
        console.warn("[On-Demand Subscriptions] Redis save error:", redisErr.message);
      }
    }

    // Also persist to in-memory fallback
    memoryOnDemandCatalog.set(`${country}_${cleanSlug}`, sanitizedBrand);

    return NextResponse.json({
      success: true,
      isNew: true,
      brand: sanitizedBrand
    });
  } catch (globalErr) {
    console.error("[On-Demand Subscriptions] Global error:", globalErr);
    return NextResponse.json({
      success: false,
      error: globalErr.message
    }, { status: 500 });
  }
}

/**
 * Validates and sanitizes AI-generated brand JSON to prevent
 * database corruption, XSS, malicious URLs, or negative prices.
 */
function sanitizeBrandData(data, rawName, cleanSlug, country, currencySymbol) {
  if (!data || typeof data !== "object") {
    return generateFallbackBrand(rawName, cleanSlug, country);
  }

  const sanitized = { ...data };

  sanitized.id = cleanSlug;
  sanitized.name = typeof data.name === "string" ? data.name.slice(0, 50).trim() : rawName;
  sanitized.country = country;
  sanitized.currencySymbol = currencySymbol;
  sanitized.category = ["video", "music", "productivity", "cloud", "gaming", "delivery", "security", "combo"].includes(data.category)
    ? data.category
    : "video";
  sanitized.tagline = typeof data.tagline === "string" ? data.tagline.slice(0, 160).trim() : `Subscription plans for ${sanitized.name}`;
  sanitized.logoText = typeof data.logoText === "string" ? data.logoText.slice(0, 8).toUpperCase().replace(/[^A-Z0-9]/g, "") : rawName.slice(0, 4).toUpperCase();
  sanitized.accentColor = typeof data.accentColor === "string" && data.accentColor.startsWith("from-") ? data.accentColor.slice(0, 60) : "from-slate-700 to-indigo-900";
  sanitized.badge = typeof data.badge === "string" ? data.badge.slice(0, 40) : "Verified OTT";
  sanitized.popularShows = Array.isArray(data.popularShows) ? data.popularShows.slice(0, 8).map(s => String(s).slice(0, 50)) : ["Popular Content", "Trending Series"];

  // Plans Validation
  if (!Array.isArray(data.plans) || data.plans.length === 0) {
    sanitized.plans = generateFallbackBrand(rawName, cleanSlug, country).plans;
  } else {
    sanitized.plans = data.plans.slice(0, 6).map((p, pIdx) => ({
      name: typeof p.name === "string" ? p.name.slice(0, 40).trim() : `Plan ${pIdx + 1}`,
      price: typeof p.price === "number" && !isNaN(p.price) && p.price >= 0 ? Number(p.price.toFixed(2)) : 9.99,
      period: ["year", "annual", "half-year", "quarter"].some(k => String(p.period).toLowerCase().includes(k)) ? "year" : "month",
      screens: typeof p.screens === "number" && p.screens >= 1 && p.screens <= 20 ? Math.floor(p.screens) : 2,
      resolution: typeof p.resolution === "string" ? p.resolution.slice(0, 30) : "Full HD",
      devices: typeof p.devices === "string" ? p.devices.slice(0, 50) : "All Devices",
      audio: typeof p.audio === "string" ? p.audio.slice(0, 30) : "Dolby 5.1",
      ads: String(p.ads || "").toLowerCase().includes("free") ? "100% Ad-Free" : "Ad-Supported"
    }));
  }

  // URL & Phishing Sanitization: Ensure officialUrl starts strictly with https://
  const rawUrl = String(data.savingsBlueprint?.officialUrl || "");
  let safeUrl = `https://www.${cleanSlug}.com`;
  if (rawUrl.startsWith("https://") && !rawUrl.includes("javascript:") && !rawUrl.includes("data:")) {
    try {
      const parsedUrl = new URL(rawUrl);
      if (parsedUrl.protocol === "https:") {
        safeUrl = rawUrl;
      }
    } catch {}
  }

  sanitized.savingsBlueprint = {
    telecomFree: Array.isArray(data.savingsBlueprint?.telecomFree) ? data.savingsBlueprint.telecomFree.slice(0, 3).map(t => ({
      operator: String(t.operator || "").slice(0, 50),
      plan: String(t.plan || "").slice(0, 80),
      claimSteps: String(t.claimSteps || "").slice(0, 250)
    })) : [],
    voucherSavings: {
      provider: String(data.savingsBlueprint?.voucherSavings?.provider || "").slice(0, 60),
      discountPercent: String(data.savingsBlueprint?.voucherSavings?.discountPercent || "5-10%").slice(0, 30),
      instructions: String(data.savingsBlueprint?.voucherSavings?.instructions || "").slice(0, 250),
      effectivePrice: typeof data.savingsBlueprint?.voucherSavings?.effectivePrice === "number" ? Number(data.savingsBlueprint.voucherSavings.effectivePrice.toFixed(2)) : 0
    },
    comboPass: {
      passName: String(data.savingsBlueprint?.comboPass?.passName || "").slice(0, 60),
      passPrice: Number(data.savingsBlueprint?.comboPass?.passPrice) || 0,
      individualSum: Number(data.savingsBlueprint?.comboPass?.individualSum) || 0,
      netSavings: String(data.savingsBlueprint?.comboPass?.netSavings || "").slice(0, 30),
      bundledWith: Array.isArray(data.savingsBlueprint?.comboPass?.bundledWith) ? data.savingsBlueprint.comboPass.bundledWith.slice(0, 5).map(b => String(b).slice(0, 40)) : []
    },
    coupons: Array.isArray(data.savingsBlueprint?.coupons) ? data.savingsBlueprint.coupons.slice(0, 3).map(c => ({
      code: String(c.code || "SAVE26").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 15),
      discount: String(c.discount || "Promotional Discount").slice(0, 40),
      verified: true
    })) : [],
    officialUrl: safeUrl
  };

  // SEO Sanitization
  sanitized.seo = {
    slug: cleanSlug,
    catchyH1: typeof data.seo?.catchyH1 === "string" ? data.seo.catchyH1.slice(0, 120) : `${sanitized.name} Plans & Savings 2026`,
    seoKeywords: Array.isArray(data.seo?.seoKeywords) ? data.seo.seoKeywords.slice(0, 6).map(k => String(k).slice(0, 40)) : [`${sanitized.name} plans`],
    faqs: Array.isArray(data.seo?.faqs) ? data.seo.faqs.slice(0, 4).map(f => ({
      question: String(f.question || "").slice(0, 140),
      answer: String(f.answer || "").slice(0, 350)
    })) : []
  };

  return sanitized;
}

function parseAiJson(rawText) {
  try {
    let cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    }
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

function generateFallbackBrand(rawName, slug, country = "IN") {
  const isAE = country === "AE";
  const isAU = country === "AU";
  const isCA = country === "CA";
  const isUK = country === "GB" || country === "UK";
  const isUS = country === "US";
  const currencySymbol = isAE ? "AED" : (isAU ? "A$" : (isCA ? "C$" : (isUK ? "£" : (isUS ? "$" : "₹"))));
  return {
    id: slug,
    name: rawName,
    country: isAE ? "AE" : (isAU ? "AU" : (isCA ? "CA" : (isUK ? "GB" : country))),
    currencySymbol: currencySymbol,
    tagline: `Premium streaming entertainment, web series & movies in ${isAE ? "the UAE" : (isAU ? "Australia" : (isCA ? "Canada" : (isUK ? "the UK" : (isUS ? "the US" : "India"))))}`,
    logoText: rawName.slice(0, 4).toUpperCase(),
    accentColor: isAE ? "from-red-600 to-emerald-900" : (isAU ? "from-amber-500 to-emerald-900" : (isCA ? "from-red-600 to-slate-900" : (isUK ? "from-indigo-600 to-sky-800" : (isUS ? "from-blue-600 to-indigo-900" : "from-amber-600 to-rose-700")))),
    badge: isAE ? "Popular UAE Streamer" : (isAU ? "Popular Australian Streamer" : (isCA ? "Popular Canadian Streamer" : (isUK ? "Popular UK Streamer" : (isUS ? "Popular US Streamer" : "Verified Regional OTT")))),
    popularShows: ["Top Originals", "Popular Cinema", "Live Specials"],
    plans: isAE ? [
      {
        name: "Standard",
        price: 35.00,
        period: "month",
        screens: 2,
        resolution: "HD (1080p)",
        devices: "All Devices",
        audio: "Dolby 5.1",
        ads: "Ad-Supported"
      },
      {
        name: "Premium 4K",
        price: 55.00,
        period: "month",
        screens: 4,
        resolution: "4K Ultra HD",
        devices: "All Devices",
        audio: "Dolby Atmos",
        ads: "100% Ad-Free"
      }
    ] : isAU ? [
      {
        name: "Standard with Ads",
        price: 7.99,
        period: "month",
        screens: 2,
        resolution: "HD (1080p)",
        devices: "All Devices",
        audio: "Dolby 5.1",
        ads: "Ad-Supported"
      },
      {
        name: "Premium Ad-Free",
        price: 16.99,
        period: "month",
        screens: 4,
        resolution: "4K Ultra HD",
        devices: "All Devices",
        audio: "Dolby Atmos",
        ads: "100% Ad-Free"
      }
    ] : isCA ? [
      {
        name: "Standard with Ads",
        price: 6.99,
        period: "month",
        screens: 2,
        resolution: "HD (1080p)",
        devices: "All Devices",
        audio: "Dolby 5.1",
        ads: "Ad-Supported"
      },
      {
        name: "Premium Ad-Free",
        price: 13.99,
        period: "month",
        screens: 4,
        resolution: "4K Ultra HD",
        devices: "All Devices",
        audio: "Dolby Atmos",
        ads: "100% Ad-Free"
      }
    ] : isUK ? [
      {
        name: "Standard with Ads",
        price: 4.99,
        period: "month",
        screens: 2,
        resolution: "HD (1080p)",
        devices: "All Devices",
        audio: "Dolby 5.1",
        ads: "Ad-Supported"
      },
      {
        name: "Premium Ad-Free",
        price: 9.99,
        period: "month",
        screens: 4,
        resolution: "4K Ultra HD",
        devices: "All Devices",
        audio: "Dolby Atmos",
        ads: "100% Ad-Free"
      }
    ] : isUS ? [
      {
        name: "Standard with Ads",
        price: 7.99,
        period: "month",
        screens: 2,
        resolution: "HD (1080p)",
        devices: "All Devices",
        audio: "Dolby 5.1",
        ads: "Ad-Supported"
      },
      {
        name: "Premium Ad-Free",
        price: 14.99,
        period: "month",
        screens: 4,
        resolution: "4K Ultra HD",
        devices: "All Devices",
        audio: "Dolby Atmos",
        ads: "100% Ad-Free"
      }
    ] : [
      {
        name: "Standard Mobile",
        price: 299,
        period: "year",
        screens: 1,
        resolution: "HD (720p)",
        devices: "Mobile only",
        audio: "Stereo",
        ads: "Ad-Free"
      },
      {
        name: "Premium All-Access",
        price: 599,
        period: "year",
        screens: 4,
        resolution: "Full HD / 4K",
        devices: "All Devices (TV & Mobile)",
        audio: "Dolby 5.1",
        ads: "100% Ad-Free"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: isAE ? "Etisalat by e& / du" : (isAU ? "Optus SubHub / Telstra" : (isCA ? "Telus / Bell / Rogers" : (isUK ? "EE / O2 / Sky" : (isUS ? "T-Mobile / Verizon" : "Airtel / Jio")))),
          plan: isAE ? "e& Freedom Plan / eLife Fiber or du Power perk" : (isAU ? "Optus SubHub 10% discount or Telstra Plus credit" : (isCA ? "Telus Stream+ or Bell Fibe TV pack" : (isUK ? "EE Inclusive Extras or O2 Priority perk" : (isUS ? "Carrier perk on unlimited plans" : "Included in Select Fiber & Broadband packs")))),
          claimSteps: isAE ? "Claim in My Etisalat or du App entertainment perks" : (isAU ? "Activate in My Optus SubHub or My Telstra portal" : (isCA ? "Activate in MyTelus or MyBell entertainment rewards portal" : (isUK ? "Activate in My EE or O2 Priority rewards portal" : (isUS ? "Claim in carrier rewards portal" : "Open Airtel Thanks or MyJio app and claim complimentary subscription"))))
        }
      ],
      voucherSavings: {
        provider: isAE ? "Smiles by e& / YouGotaGift UAE" : (isAU ? "Woolworths Everyday Rewards / Cashrewards" : (isCA ? "Costco Canada / Rakuten CA" : (isUK ? "TopCashback / CDKeys" : (isUS ? "Target Circle / Costco" : "Amazon Pay / Gyftr")))),
        discountPercent: isAE ? "15% Smiles Value" : (isAU ? "10% Reward Value" : (isCA ? "10%-15% Off" : (isUK ? "5%-15% Off" : (isUS ? "5%-10% Off" : "10% Cashback")))),
        instructions: isAE ? "Redeem Smiles points or buy gift cards using ENBD / ADCB cashback cards" : (isAU ? "Buy digital gift cards during 20x points weeks or activate Cashrewards before checkout" : (isCA ? "Buy digital gift cards at Costco CA or activate Rakuten CA before payment" : (isUK ? "Buy digital gift cards or activate cashback before payment" : (isUS ? "Buy discounted digital gift cards" : "Buy gift voucher with credit card for extra 10% savings")))),
        effectivePrice: isAE ? 29.75 : (isAU ? 15.29 : (isCA ? 11.99 : (isUK ? 8.99 : (isUS ? 13.99 : 539))))
      },
      comboPass: {
        passName: isAE ? "e& Entertainment Multi-Pass" : (isAU ? "Optus SubHub Entertainment Trio" : (isCA ? "Telus Stream+ Entertainment Pack" : (isUK ? "Sky Stream / Virgin Media Stream Bundle" : (isUS ? "Mega Entertainment Bundle" : "Tata Play Binge / Airtel Xstream")))),
        passPrice: isAE ? 79.00 : (isAU ? 32.00 : (isCA ? 20.00 : (isUK ? 18.00 : (isUS ? 19.99 : 999)))),
        individualSum: isAE ? 110.00 : (isAU ? 40.00 : (isCA ? 38.00 : (isUK ? 28.00 : (isUS ? 32.99 : 2200)))),
        netSavings: isAE ? "31.00/mo" : (isAU ? "8.00/mo" : (isCA ? "18.00/mo" : (isUK ? "10/mo" : (isUS ? "13/mo" : "1,200+")))),
        bundledWith: isAE ? ["OSN+", "Starzplay", "Shahid VIP"] : (isAU ? ["Stan", "BINGE", "Optus Sport"] : (isCA ? ["Netflix", "Disney+", "Prime Video"] : (isUK ? ["Sky TV", "Netflix", "Discovery+"] : (isUS ? ["Disney+", "Hulu", "Max"] : ["Hotstar", "SonyLIV", "ZEE5"]))))
      },
      coupons: [
        {
          code: isAE ? "UAESTREAM26" : (isAU ? "AUSTREAM26" : (isCA ? "CANSTREAM26" : (isUK ? "UKSTREAM26" : "STREAM2026"))),
          discount: isAE ? "AED 10 Off First Month" : (isAU ? "$5 Off First Month" : (isCA ? "$5 Off First Month" : (isUK ? "£2 Off First 3 Months" : (isUS ? "$5 Off First Month" : "Flat ₹50 Instant Discount")))),
          verified: true
        }
      ],
      officialUrl: `https://www.${slug}.com`
    },
    seo: {
      slug: slug,
      catchyH1: `${rawName} Subscription Plans 2026: Pricing, Discounts & Deals`,
      seoKeywords: [`${rawName} plans`, `${rawName} save money`, `${rawName} coupon code`],
      faqs: [
        {
          question: `How to get ${rawName} subscription at lowest price?`,
          answer: `Check our verified 4-level savings blueprint to get it free via carrier perks or save up to 50% with bundles.`
        }
      ]
    }
  };
}
