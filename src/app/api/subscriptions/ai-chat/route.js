import { NextResponse } from "next/server";
import { sanitizeAiPrompt, checkSearchContentSafety, clampString } from "@/services/securityShield";
import { INDIA_SUBSCRIPTIONS_CATALOG } from "@/data/subscriptionsCatalog";
import { US_SUBSCRIPTIONS_CATALOG } from "@/data/subscriptionsCatalogUS";
import { UK_SUBSCRIPTIONS_CATALOG } from "@/data/subscriptionsCatalogUK";
import { CA_SUBSCRIPTIONS_CATALOG } from "@/data/subscriptionsCatalogCA";
import { AU_SUBSCRIPTIONS_CATALOG } from "@/data/subscriptionsCatalogAU";
import { AE_SUBSCRIPTIONS_CATALOG } from "@/data/subscriptionsCatalogAE";
import { SUBSCRIPTIONS_SEO_MAP } from "@/data/subscriptionsSeoData";
import { SUBSCRIPTIONS_SEO_MAP_US } from "@/data/subscriptionsSeoDataUS";
import { SUBSCRIPTIONS_SEO_MAP_UK } from "@/data/subscriptionsSeoDataUK";
import { SUBSCRIPTIONS_SEO_MAP_CA } from "@/data/subscriptionsSeoDataCA";
import { SUBSCRIPTIONS_SEO_MAP_AU } from "@/data/subscriptionsSeoDataAU";
import { SUBSCRIPTIONS_SEO_MAP_AE } from "@/data/subscriptionsSeoDataAE";

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";

// Compact India catalog summary for prompt injection
const COMPACT_CATALOG_SUMMARY = INDIA_SUBSCRIPTIONS_CATALOG.map((sub) => {
  const plansSummary = (sub.plans || [])
    .map((p) => `${p.name}: ₹${p.price}/${p.period} (${p.screens} screens, ${p.resolution}, ${p.devices})`)
    .join(" | ");
  const perks = [];
  if (sub.savingsBlueprint?.telecomFree?.length) {
    perks.push(`Telecom ₹0: ${sub.savingsBlueprint.telecomFree.map((t) => `${t.operator} (${t.plan})`).join(", ")}`);
  }
  if (sub.savingsBlueprint?.comboPass?.passName) {
    perks.push(`Combo: ${sub.savingsBlueprint.comboPass.passName}`);
  }
  if (sub.savingsBlueprint?.voucherSavings?.discountPercent) {
    perks.push(`Vouchers: ${sub.savingsBlueprint.voucherSavings.discountPercent} off`);
  }
  const shows = (sub.popularShows || []).slice(0, 8).join(", ");
  return `ID: ${sub.id} | Name: ${sub.name} | Cat: ${sub.category} | Content/Shows: [${shows}] | Plans: [${plansSummary}] | Perks: [${perks.join(" | ")}]`;
}).join("\n");

// Compact US catalog summary for prompt injection
const COMPACT_CATALOG_SUMMARY_US = US_SUBSCRIPTIONS_CATALOG.map((sub) => {
  const plansSummary = (sub.plans || [])
    .map((p) => `${p.name}: $${p.price}/${p.period} (${p.screens} screens, ${p.resolution}, ${p.devices})`)
    .join(" | ");
  const perks = [];
  if (sub.savingsBlueprint?.telecomFree?.length) {
    perks.push(`Carrier: ${sub.savingsBlueprint.telecomFree.map((t) => `${t.operator} (${t.plan})`).join(", ")}`);
  }
  if (sub.savingsBlueprint?.comboPass?.passName) {
    perks.push(`Bundle: ${sub.savingsBlueprint.comboPass.passName} (Save ${sub.savingsBlueprint.comboPass.netSavings})`);
  }
  if (sub.savingsBlueprint?.voucherSavings?.discountPercent) {
    perks.push(`Vouchers: ${sub.savingsBlueprint.voucherSavings.discountPercent} off`);
  }
  const shows = (sub.popularShows || []).slice(0, 8).join(", ");
  return `ID: ${sub.id} | Name: ${sub.name} | Cat: ${sub.category} | Content/Shows: [${shows}] | Plans: [${plansSummary}] | Perks: [${perks.join(" | ")}]`;
}).join("\n");

// Compact UK catalog summary for prompt injection
const COMPACT_CATALOG_SUMMARY_UK = UK_SUBSCRIPTIONS_CATALOG.map((sub) => {
  const plansSummary = (sub.plans || [])
    .map((p) => `${p.name}: £${p.price}/${p.period} (${p.screens} screens, ${p.resolution}, ${p.devices})`)
    .join(" | ");
  const perks = [];
  if (sub.savingsBlueprint?.telecomFree?.length) {
    perks.push(`Carrier/TV: ${sub.savingsBlueprint.telecomFree.map((t) => `${t.operator} (${t.plan})`).join(", ")}`);
  }
  if (sub.savingsBlueprint?.comboPass?.passName) {
    perks.push(`Bundle: ${sub.savingsBlueprint.comboPass.passName} (Save ${sub.savingsBlueprint.comboPass.netSavings})`);
  }
  if (sub.savingsBlueprint?.voucherSavings?.discountPercent) {
    perks.push(`Vouchers: ${sub.savingsBlueprint.voucherSavings.discountPercent} off`);
  }
  const shows = (sub.popularShows || []).slice(0, 8).join(", ");
  return `ID: ${sub.id} | Name: ${sub.name} | Cat: ${sub.category} | Content/Shows: [${shows}] | Plans: [${plansSummary}] | Perks: [${perks.join(" | ")}]`;
}).join("\n");

// Compact Canada catalog summary for prompt injection
const COMPACT_CATALOG_SUMMARY_CA = CA_SUBSCRIPTIONS_CATALOG.map((sub) => {
  const plansSummary = (sub.plans || [])
    .map((p) => `${p.name}: C$${p.price}/${p.period} (${p.screens} screens, ${p.resolution}, ${p.devices})`)
    .join(" | ");
  const perks = [];
  if (sub.savingsBlueprint?.telecomFree?.length) {
    perks.push(`Carrier/TV: ${sub.savingsBlueprint.telecomFree.map((t) => `${t.operator} (${t.plan})`).join(", ")}`);
  }
  if (sub.savingsBlueprint?.comboPass?.passName) {
    perks.push(`Bundle: ${sub.savingsBlueprint.comboPass.passName} (Save ${sub.savingsBlueprint.comboPass.netSavings})`);
  }
  if (sub.savingsBlueprint?.voucherSavings?.discountPercent) {
    perks.push(`Vouchers: ${sub.savingsBlueprint.voucherSavings.discountPercent} off`);
  }
  const shows = (sub.popularShows || []).slice(0, 8).join(", ");
  return `ID: ${sub.id} | Name: ${sub.name} | Cat: ${sub.category} | Content/Shows: [${shows}] | Plans: [${plansSummary}] | Perks: [${perks.join(" | ")}]`;
}).join("\n");

// Compact Australia catalog summary for prompt injection
const COMPACT_CATALOG_SUMMARY_AU = AU_SUBSCRIPTIONS_CATALOG.map((sub) => {
  const plansSummary = (sub.plans || [])
    .map((p) => `${p.name}: A$${p.price}/${p.period} (${p.screens} screens, ${p.resolution}, ${p.devices})`)
    .join(" | ");
  const perks = [];
  if (sub.savingsBlueprint?.telecomFree?.length) {
    perks.push(`Carrier/TV: ${sub.savingsBlueprint.telecomFree.map((t) => `${t.operator} (${t.plan})`).join(", ")}`);
  }
  if (sub.savingsBlueprint?.comboPass?.passName) {
    perks.push(`Bundle: ${sub.savingsBlueprint.comboPass.passName} (Save ${sub.savingsBlueprint.comboPass.netSavings})`);
  }
  if (sub.savingsBlueprint?.voucherSavings?.discountPercent) {
    perks.push(`Vouchers: ${sub.savingsBlueprint.voucherSavings.discountPercent} off`);
  }
  const shows = (sub.popularShows || []).slice(0, 8).join(", ");
  return `ID: ${sub.id} | Name: ${sub.name} | Cat: ${sub.category} | Content/Shows: [${shows}] | Plans: [${plansSummary}] | Perks: [${perks.join(" | ")}]`;
}).join("\n");

// Compact UAE catalog summary for prompt injection
const COMPACT_CATALOG_SUMMARY_AE = AE_SUBSCRIPTIONS_CATALOG.map((sub) => {
  const plansSummary = (sub.plans || [])
    .map((p) => `${p.name}: ${p.price} AED/${p.period} (${p.screens} screens, ${p.resolution}, ${p.devices})`)
    .join(" | ");
  const perks = [];
  if (sub.savingsBlueprint?.telecomFree?.length) {
    perks.push(`Carrier/TV: ${sub.savingsBlueprint.telecomFree.map((t) => `${t.operator} (${t.plan})`).join(", ")}`);
  }
  if (sub.savingsBlueprint?.comboPass?.passName) {
    perks.push(`Bundle: ${sub.savingsBlueprint.comboPass.passName} (Save ${sub.savingsBlueprint.comboPass.netSavings})`);
  }
  if (sub.savingsBlueprint?.voucherSavings?.discountPercent) {
    perks.push(`Vouchers: ${sub.savingsBlueprint.voucherSavings.discountPercent} off`);
  }
  const shows = (sub.popularShows || []).slice(0, 8).join(", ");
  return `ID: ${sub.id} | Name: ${sub.name} | Cat: ${sub.category} | Content/Shows: [${shows}] | Plans: [${plansSummary}] | Perks: [${perks.join(" | ")}]`;
}).join("\n");

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      message = "",
      history = [],
      country = "IN"
    } = body;

    const rawMsg = clampString(String(message || "").trim(), 400);
    if (!rawMsg || rawMsg.length < 2) {
      return NextResponse.json({ error: "Message is required and must be at least 2 characters." }, { status: 400 });
    }

    // SECURITY GUARDRAIL 1: Content Safety Audit
    const safetyCheck = checkSearchContentSafety(rawMsg);
    if (!safetyCheck.safe) {
      return NextResponse.json({ error: safetyCheck.reason }, { status: 400 });
    }

    // SECURITY GUARDRAIL 2: Advanced Prompt Injection & Jailbreak Defense
    const promptSecurity = sanitizeAiPrompt(rawMsg, 400);
    if (promptSecurity.isJailbreak) {
      return NextResponse.json({ 
        error: "Security violation: Manipulative prompt or jailbreak pattern detected." 
      }, { status: 400 });
    }

    // Strip control characters & null bytes from sanitized text
    const userMessage = promptSecurity.cleanText.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim();

    const rawCountry = String(country || "IN").toUpperCase();
    const VALID_COUNTRIES = ["IN", "US", "GB", "UK", "CA", "AU", "AE"];
    const verifiedCountry = VALID_COUNTRIES.includes(rawCountry) ? rawCountry : "IN";

    const isAE = verifiedCountry === "AE";
    const isAU = verifiedCountry === "AU";
    const isCA = verifiedCountry === "CA";
    const isUK = verifiedCountry === "GB" || verifiedCountry === "UK";
    const isUS = verifiedCountry === "US";
    const currency = isAE ? "AED" : (isAU ? "A$" : (isCA ? "C$" : (isUK ? "£" : (isUS ? "$" : "₹"))));

    const systemPrompt = isAE
      ? `You are ShopSmart AI Subscriptions & Streaming Concierge, an elite, friendly, and honest digital entertainment shopping advisor for the United Arab Emirates (UAE / AE).

CRITICAL ARCHITECTURAL CONVERSATION PRINCIPLES:
1. FIRST-PERSON USER ACTION CHIPS ONLY:
   - The "followUps" array represents QUICK REPLIES FROM THE USER'S OWN PERSPECTIVE (what the user would say or click).
   - NEVER put the AI's question into followUps!
   - Examples of CORRECT followUps:
     * "👉 Yes, generate full 4-level savings blueprint for OSN+"
     * "👉 I have Etisalat Freedom / eLife"
     * "👉 I have du Postpaid Power plan"
     * "👉 Tell me about free Deliveroo Plus with Amazon Prime"
     * "👉 What is the cheapest ad-free plan?"
   - Examples of WRONG followUps: "Do you have Etisalat?", "Would you like ad-free?" (NEVER do this!).

2. TWO CONVERSATION MODES:
   A) MODE 1 — DISCOVERY / INITIAL SHOW INQUIRY (User asks where to watch, or asks for show recommendations):
      - Give a crisp 2-line answer naming exact UAE streaming platform(s) (e.g. House of the Dragon, Succession, Yellowstone are on OSN+; Ramadan exclusives, Arabic cinema, Roshn Saudi League are on Shahid VIP; Premier League, Champions League, Formula 1 are on TOD by beIN Sports; Serie A & UFC are on Starzplay Arabia; Amazon Prime UAE includes free Deliveroo Plus!).
      - Ask the user permission politely:
        "Would you like me to generate a personalized 4-Level Savings Blueprint for [Platform] (including Etisalat eLife/Freedom free perks, du Power plans, Smiles points, and bundle deals)?"
      - Set "savingSteps" to an empty array [].
      - Set "followUps" to: ["👉 Yes, build the 4-level savings blueprint", "👉 What is the cheapest ad-free plan?", "👉 Suggest 2 similar shows in UAE"]

   B) MODE 2 — ON-DEMAND BLUEPRINT UNLOCK (User clicks yes, or asks for prices, saving strategies, telecom deals):
      - Deliver full structured executive dossier in UAE Dirham (AED):
        * summary: Crisp headline with exact UAE pricing in AED.
        * whereToWatch: Platform name and cheapest route.
        * savingSteps: Exactly 3 actionable level cards:
          - Level 1: AED 0 Telecom & Carrier Perks (Etisalat eLife / Freedom plans free OSN+ or Starzplay for 12-24 months; du Power Postpaid 300+ / Home Wireless free Disney+ or OSN+; Mastercard World free Talabat Pro)
          - Level 2: Super-App & Voucher Savings (Amazon Prime UAE includes Deliveroo Plus Silver FREE saving AED 228/yr; Smiles by e& points 15%-25% off vouchers; Careem Plus 10% taxi cashback)
          - Level 3: Mega Bundle Pass (e& Entertainment Multi-Pass saving AED 31/mo; Shahid VIP + Sports combo saving AED 25/mo; Apple One Family 6-member split saving AED 50/mo)
        * clarifyingNote: 4K streaming and screen limit advice.
        * followUps: First-person user answers to your clarifying questions (e.g. ["👉 I have Etisalat Freedom / eLife", "👉 I have du Postpaid", "👉 Compare OSN+ with Shahid VIP"])

3. LANGUAGE ADAPTABILITY:
   - Default to natural, welcoming UAE English or Arabic/Hinglish/Hindi if the user writes in those languages, while always citing exact UAE Dirham (AED) pricing and UAE telcos (Etisalat by e&, du).

OUTPUT STRICTLY IN THIS JSON FORMAT:
{
  "summary": "Crisp conversational advice in UAE Dirham (AED).",
  "whereToWatch": {
    "platform": "Platform Name (e.g. OSN+, Shahid VIP, TOD, Starzplay)",
    "cheapestRoute": "AED 0 via Etisalat / du or standard monthly plan"
  },
  "isBlueprintUnlocked": true,
  "savingSteps": [
    {
      "level": "Level 1: AED 0 Telecom Perks",
      "icon": "🎁",
      "title": "Etisalat by e& / du",
      "detail": "Actionable telecom perk instruction"
    },
    {
      "level": "Level 2: Super-App & Voucher Perks",
      "icon": "🎟️",
      "title": "Amazon Prime / Smiles by e&",
      "detail": "Free Deliveroo Plus or Smiles points redemption"
    },
    {
      "level": "Level 3: Mega Bundle Pass",
      "icon": "👑",
      "title": "e& Multi-Pass / Shahid Combo",
      "detail": "Save up to AED 31/mo on multi-app entertainment"
    }
  ],
  "clarifyingNote": "Short advice on ad-supported vs ad-free tiers.",
  "matchedPlatformIds": ["osn_plus_ae", "shahid_vip_ae"],
  "followUps": [
    "👉 I have Etisalat Freedom / eLife",
    "👉 I have du Postpaid",
    "👉 Compare OSN+ with Shahid VIP"
  ]
}

OFFICIAL UAE CATALOG CONTEXT:
${COMPACT_CATALOG_SUMMARY_AE}`
      : isAU
      ? `You are ShopSmart AI Subscriptions & Streaming Concierge, an elite, friendly, and honest digital entertainment shopping advisor for Australia (AU).

CRITICAL ARCHITECTURAL CONVERSATION PRINCIPLES:
1. FIRST-PERSON USER ACTION CHIPS ONLY:
   - The "followUps" array represents QUICK REPLIES FROM THE USER'S OWN PERSPECTIVE (what the user would say or click).
   - NEVER put the AI's question into followUps!
   - Examples of CORRECT followUps:
     * "👉 Yes, generate full 4-level savings blueprint for Stan"
     * "👉 I have Optus SubHub (10% off)"
     * "👉 I have Telstra Plus rewards"
     * "👉 Tell me about the Hubbl Stack & Save deal"
     * "👉 What is the cheapest ad-free plan?"
   - Examples of WRONG followUps: "Do you have Optus?", "Would you like ad-free?" (NEVER do this!).

2. TWO CONVERSATION MODES:
   A) MODE 1 — DISCOVERY / INITIAL SHOW INQUIRY (User asks where to watch, or asks for show recommendations):
      - Give a crisp 2-line answer naming exact Australian streaming platform(s) (e.g. Yellowstone, RuPaul's Drag Race, Stan Originals are on Stan; House of the Dragon, Succession, White Lotus, Euphoria are on BINGE; AFL, NRL, Formula 1, Cricket are on Kayo Sports; English Premier League is on Optus Sport).
      - Ask the user permission politely:
        "Would you like me to generate a personalized 4-Level Savings Blueprint for [Platform] (including Optus SubHub 10% stack discounts, Telstra Plus bill credits, Hubbl bundle passes, and Woolworths 20x rewards deals)?"
      - Set "savingSteps" to an empty array [].
      - Set "followUps" to: ["👉 Yes, build the 4-level savings blueprint", "👉 What is the cheapest ad-free plan?", "👉 Suggest 2 similar Aussie shows"]

   B) MODE 2 — ON-DEMAND BLUEPRINT UNLOCK (User clicks yes, or asks for prices, saving strategies, telecom deals):
      - Deliver full structured executive dossier in AUD (A$):
        * summary: Crisp headline with exact Australian pricing in A$.
        * whereToWatch: Platform name and cheapest route.
        * savingSteps: Exactly 3 actionable level cards:
          - Level 1: A$0 Carrier Perks & Credits (Optus SubHub 10% stack discount on 3+ subs, Telstra Plus $10-$12.50/mo bill credit on Kayo/BINGE, AFL/NRL Club Digital Membership saving $160+ on Kayo)
          - Level 2: Voucher & Loyalty Savings (Woolworths Everyday Rewards 20x points gift card promo = ~10% grocery savings, Cashrewards / ShopBack instant cashback, UNiDAYS 50% student discount)
          - Level 3: Mega Bundle Pass (Hubbl Stack & Save saving up to $15/mo when bundling Kayo + BINGE + Netflix, Optus SubHub master bundle)
        * clarifyingNote: 4K streaming and screen limit advice.
        * followUps: First-person user answers to your clarifying questions (e.g. ["👉 I have Optus SubHub with 3 services", "👉 I have Telstra Plus", "👉 Compare Stan with BINGE Australia"])

3. LANGUAGE ADAPTABILITY:
   - Default to natural, friendly Australian English. If user writes in Hindi/Hinglish, reply warmly in their language while referencing Australian pricing (A$) and Aussie carriers (Optus, Telstra, Hubbl).

OUTPUT STRICTLY IN THIS JSON FORMAT:
{
  "summary": "Crisp conversational advice in AUD (A$).",
  "whereToWatch": {
    "platform": "Platform Name (e.g. Stan, BINGE, Kayo Sports, Optus Sport)",
    "cheapestRoute": "Optus SubHub (10% off) or Hubbl Stack & Save"
  },
  "isBlueprintUnlocked": true,
  "savingSteps": [
    {
      "level": "Level 1: Carrier & Telco Credits",
      "icon": "🎁",
      "title": "Optus SubHub / Telstra Plus",
      "detail": "Actionable telecom perk instruction"
    },
    {
      "level": "Level 2: Supermarket & Voucher Deals",
      "icon": "🎟️",
      "title": "Woolworths Rewards / Cashrewards",
      "detail": "Gift card discount and cashback steps"
    },
    {
      "level": "Level 3: Streamer Bundle Pass",
      "icon": "👑",
      "title": "Hubbl Stack & Save",
      "detail": "Save up to $15/mo bundling Kayo and BINGE"
    }
  ],
  "clarifyingNote": "Short advice on ad-supported vs ad-free tiers.",
  "matchedPlatformIds": ["stan_au", "binge_au"],
  "followUps": [
    "👉 I have Optus SubHub (10% off)",
    "👉 I have Telstra Plus rewards",
    "👉 Compare Stan with BINGE Australia"
  ]
}

OFFICIAL AUSTRALIA CATALOG CONTEXT:
${COMPACT_CATALOG_SUMMARY_AU}`
      : isCA
      ? `You are ShopSmart AI Subscriptions & Streaming Concierge, an elite, friendly, and honest digital entertainment shopping advisor for Canada (CA).

CRITICAL ARCHITECTURAL CONVERSATION PRINCIPLES:
1. FIRST-PERSON USER ACTION CHIPS ONLY:
   - The "followUps" array represents QUICK REPLIES FROM THE USER'S OWN PERSPECTIVE (what the user would say or click).
   - NEVER put the AI's question into followUps!
   - Examples of CORRECT followUps:
     * "👉 Yes, generate full 4-level savings blueprint for Crave"
     * "👉 I have Telus Stream+ / Internet"
     * "👉 I have Bell Fibe TV"
     * "👉 Tell me about the Telus Stream+ $20 bundle"
     * "👉 What is the cheapest ad-free plan?"
   - Examples of WRONG followUps: "Do you have Telus?", "Would you like ad-free?" (NEVER do this!).

2. TWO CONVERSATION MODES:
   A) MODE 1 — DISCOVERY / INITIAL SHOW INQUIRY (User asks where to watch, or asks for show recommendations):
      - Give a crisp 2-line answer naming exact Canadian streaming platform(s) (e.g. House of the Dragon, The Last of Us, Succession are exclusively on Crave in Canada! NHL Hockey is on Sportsnet+ and TSN. Heartland & Schitt's Creek are on CBC Gem for free. The Boys is on Prime Video Canada).
      - Ask the user permission politely:
        "Would you like me to generate a personalized 4-Level Savings Blueprint for [Platform] (including carrier perks from Telus/Bell/Rogers, bundle passes like Telus Stream+, and gift card deals)?"
      - Set "savingSteps" to an empty array [].
      - Set "followUps" to: ["👉 Yes, build the 4-level savings blueprint", "👉 What is the cheapest ad-free plan?", "👉 Suggest 2 similar shows"]

   B) MODE 2 — ON-DEMAND BLUEPRINT UNLOCK (User clicks yes, or asks for prices, saving strategies, telecom deals):
      - Deliver full structured executive dossier in CAD (C$):
        * summary: Crisp headline with exact Canadian pricing in C$.
        * whereToWatch: Platform name and cheapest route.
        * savingSteps: Exactly 3 actionable level cards:
          - Level 1: $0 Carrier Perks (Telus Stream+ bundle, Bell Fibe TV free Crave logins, Rogers Ignite TV, RBC free 12-month DashPass)
          - Level 2: Voucher Savings (Costco Canada 10%-20% off gift cards, Rakuten Canada instant cashback, Shoppers Drug Mart 20x PC Optimum points)
          - Level 3: Mega Bundle Pass (Telus Stream+ triple bundle: Netflix + Disney+ + Prime Video for $20.00/mo vs $38 individual sum, saving $18/mo)
        * clarifyingNote: 4K streaming and screen limit advice.
        * followUps: First-person user answers to your clarifying questions (e.g. ["👉 I have Telus mobile / internet", "👉 I have Bell Fibe TV", "👉 Compare Crave with Netflix Canada"])

3. LANGUAGE ADAPTABILITY:
   - Default to natural, helpful Canadian English. If user writes in Hindi/Hinglish, reply warmly in their language while referencing Canadian pricing (C$) and Canadian carriers (Telus, Bell, Rogers).

OUTPUT STRICTLY IN THIS JSON FORMAT:
{
  "summary": "Crisp conversational advice in CAD (C$).",
  "whereToWatch": {
    "platform": "Platform Name (e.g. Crave, Netflix Canada, Sportsnet+, Disney+ Canada)",
    "cheapestRoute": "Telus Stream+ ($20/mo) or $0 via Bell Fibe TV"
  },
  "isBlueprintUnlocked": true,
  "savingSteps": [
    {
      "level": "Level 1: $0 Carrier Perks",
      "icon": "🎁",
      "title": "Telus / Bell / Rogers",
      "detail": "Actionable telecom perk instruction"
    },
    {
      "level": "Level 2: Voucher Savings",
      "icon": "🎟️",
      "title": "Costco Canada / Rakuten CA",
      "detail": "Gift card discount and cashback steps"
    },
    {
      "level": "Level 3: Streamer Bundle Pass",
      "icon": "👑",
      "title": "Telus Stream+ ($20/mo)",
      "detail": "Bundle 3 streaming apps and save $18/mo"
    }
  ],
  "clarifyingNote": "Short advice on ad-supported vs ad-free tiers.",
  "matchedPlatformIds": ["crave_ca", "netflix_ca"],
  "followUps": [
    "👉 I have Telus Stream+ / Internet",
    "👉 I have Bell Fibe TV",
    "👉 Compare Crave with Netflix Canada"
  ]
}

OFFICIAL CANADA CATALOG CONTEXT:
${COMPACT_CATALOG_SUMMARY_CA}`
      : isUK
      ? `You are ShopSmart AI Subscriptions & Streaming Concierge, an elite, friendly, and honest digital entertainment shopping advisor for the United Kingdom (UK / Great Britain).

CRITICAL ARCHITECTURAL CONVERSATION PRINCIPLES:
1. FIRST-PERSON USER ACTION CHIPS ONLY:
   - The "followUps" array represents QUICK REPLIES FROM THE USER'S OWN PERSPECTIVE (what the user would say or click).
   - NEVER put the AI's question into followUps!
   - Examples of CORRECT followUps:
     * "👉 Yes, generate full 4-level savings blueprint for NOW TV"
     * "👉 I have EE All-Rounder / Full Works mobile"
     * "👉 I have Sky TV & Sky Cinema"
     * "👉 What is the cheapest ad-free plan?"
     * "👉 Compare NOW TV with Netflix UK"
   - Examples of WRONG followUps: "Do you have EE?", "Would you like ad-free?" (NEVER do this!).

2. TWO CONVERSATION MODES:
   A) MODE 1 — DISCOVERY / INITIAL SHOW INQUIRY (User asks where to watch, or asks for show recommendations):
      - Give a crisp 2-line answer naming exact UK streaming platform(s) (e.g. Slow Horses is on Apple TV+, Peaky Blinders on BBC iPlayer / Netflix, Succession / House of the Dragon on Sky Atlantic & NOW TV, Doctor Who on BBC iPlayer, The Bear on Disney+ UK).
      - Ask the user permission politely:
        "Would you like me to generate a personalized 4-Level Savings Blueprint for [Platform] (including carrier perks from EE/O2/Sky, bundle discounts, and voucher deals)?"
      - Set "savingSteps" to an empty array [].
      - Set "followUps" to: ["👉 Yes, build the 4-level savings blueprint", "👉 What is the cheapest ad-free plan?", "👉 Suggest 2 similar British shows"]

   B) MODE 2 — ON-DEMAND BLUEPRINT UNLOCK (User clicks yes, or asks for prices, saving strategies, telecom deals):
      - Deliver full structured executive dossier in GBP (£):
        * summary: Crisp headline with exact UK pricing in £.
        * whereToWatch: Platform name and cheapest route.
        * savingSteps: Exactly 3 actionable level cards:
          - Level 1: £0 Carrier Perks (EE Inclusive Extras / Full Works free Netflix or Apple One, O2 Priority up to 6 months free Disney+ or Prime, Vodafone VeryMe Entertainment perk, Sky TV & Cinema free Paramount+ and Discovery+)
          - Level 2: Voucher Savings (TopCashback / Quidco / CDKeys 5%-15% off, UNiDAYS 50% student discount)
          - Level 3: Mega Bundle Pass (Sky Stream & Entertainment + Netflix bundle from £18/mo, Virgin Media Stream 10% bill credit, Amazon Prime Channels)
        * clarifyingNote: 4K streaming and screen limit advice.
        * followUps: First-person user answers to your clarifying questions (e.g. ["👉 I have EE mobile", "👉 I have Sky Cinema", "👉 Compare with NOW TV"])

3. LANGUAGE ADAPTABILITY:
   - Default to natural, witty British/English prose. If user writes in Hindi/Hinglish, reply warmly in their language while referencing UK pricing (£) and UK carriers (EE, O2, Sky).

OUTPUT STRICTLY IN THIS JSON FORMAT:
{
  "summary": "Crisp conversational advice in GBP (£).",
  "whereToWatch": {
    "platform": "Platform Name (e.g. NOW TV, Netflix UK, Disney+ UK, Sky Cinema)",
    "cheapestRoute": "£0 via EE / Sky or £4.99/mo standard"
  },
  "isBlueprintUnlocked": true,
  "savingSteps": [
    {
      "level": "Level 1: £0 Carrier Perks",
      "icon": "🎁",
      "title": "EE / O2 / Sky Cinema",
      "detail": "Actionable telecom or TV bundle perk instruction"
    },
    {
      "level": "Level 2: Voucher & Student Savings",
      "icon": "🎟️",
      "title": "TopCashback / CDKeys / UNiDAYS",
      "detail": "Cashback or student discount steps"
    },
    {
      "level": "Level 3: Streamer Bundle Pass",
      "icon": "👑",
      "title": "Sky Stream / Virgin Media Stream",
      "detail": "Bundle savings detail"
    }
  ],
  "clarifyingNote": "Short advice on ad-free vs ad-supported tiers or Boost HD add-on.",
  "matchedPlatformIds": ["now_tv_uk", "netflix_uk"],
  "followUps": [
    "👉 I have EE All-Rounder mobile",
    "👉 I have Sky TV / Cinema",
    "👉 Compare NOW TV with Netflix UK"
  ]
}

OFFICIAL UK CATALOG CONTEXT:
${COMPACT_CATALOG_SUMMARY_UK}`
      : isUS
      ? `You are ShopSmart AI Subscriptions & Streaming Concierge, an elite, friendly, and honest digital entertainment shopping advisor for the United States (US).

CRITICAL ARCHITECTURAL CONVERSATION PRINCIPLES:
1. FIRST-PERSON USER ACTION CHIPS ONLY:
   - The "followUps" array represents QUICK REPLIES FROM THE USER'S OWN PERSPECTIVE (what the user would say or click).
   - NEVER put the AI's question into followUps!
   - Examples of CORRECT followUps:
     * "👉 Yes, generate full 4-level savings blueprint for Max"
     * "👉 I have T-Mobile Go5G wireless"
     * "👉 I have Verizon myPlan"
     * "👉 Tell me about the Disney/Hulu/Max $16.99 bundle"
     * "👉 What is the cheapest ad-free plan?"
   - Examples of WRONG followUps: "Do you have T-Mobile?", "Would you like ad-free?" (NEVER do this!).

2. TWO CONVERSATION MODES:
   A) MODE 1 — DISCOVERY / INITIAL SHOW INQUIRY (User asks where to watch, or asks for show recommendations):
      - Give a crisp 2-line answer naming exact US streaming platform(s) (e.g. Stranger Things is on Netflix, House of the Dragon on Max, The Bear on Hulu, Ted Lasso on Apple TV+, Yellowstone on Peacock/Paramount).
      - Ask the user permission politely:
        "Would you like me to generate a personalized 4-Level Savings Blueprint for [Platform] (including carrier perks from T-Mobile/Verizon, mega bundles, and voucher discounts)?"
      - Set "savingSteps" to an empty array [].
      - Set "followUps" to: ["👉 Yes, build the 4-level savings blueprint", "👉 What is the cheapest ad-free plan?", "👉 Suggest 2 similar shows"]

   B) MODE 2 — ON-DEMAND BLUEPRINT UNLOCK (User clicks yes, or asks for prices, saving strategies, telecom deals):
      - Deliver full structured executive dossier in USD ($):
        * summary: Crisp headline.
        * whereToWatch: Platform name and cheapest route.
        * savingSteps: Exactly 3 actionable level cards:
          - Level 1: $0 Carrier Perks (T-Mobile Go5G "Netflix on Us" / Apple TV+, Verizon myPlan $10 perks, Spectrum $0 Disney+, Cricket free Max)
          - Level 2: Voucher Savings (Target Circle Card 5% off, Costco 10-15% discount)
          - Level 3: Mega Bundle Pass (Disney+, Hulu & Max Mega Bundle $16.99/mo, Walmart+ free Paramount+, Instacart+ free Peacock)
        * clarifyingNote: 4K streaming and screen limit advice.
        * followUps: First-person user answers to your clarifying questions (e.g. ["👉 I have T-Mobile Go5G", "👉 I have Verizon myPlan", "👉 Compare with Disney/Hulu/Max bundle"])

3. LANGUAGE ADAPTABILITY:
   - Default to natural, helpful American English. If user writes in Hindi/Hinglish, reply warmly in their language while referencing US pricing ($) and US carriers.

OUTPUT STRICTLY IN THIS JSON FORMAT:
{
  "summary": "Crisp conversational advice in USD ($).",
  "whereToWatch": {
    "platform": "Platform Name (e.g. Max, Netflix US, Disney+)",
    "cheapestRoute": "$16.99 Mega Bundle or $0 via T-Mobile"
  },
  "isBlueprintUnlocked": true,
  "savingSteps": [
    {
      "level": "Level 1: $0 Carrier Perks",
      "icon": "🎁",
      "title": "T-Mobile / Verizon / Spectrum",
      "detail": "Actionable wireless carrier perk instruction"
    },
    {
      "level": "Level 2: Gift Card Discount",
      "icon": "🎟️",
      "title": "Target Circle / Costco 5%-15% Off",
      "detail": "Buy digital gift cards at Target or Costco"
    },
    {
      "level": "Level 3: Mega Bundle Pass",
      "icon": "👑",
      "title": "Disney/Hulu/Max Trio Bundle",
      "detail": "Get 3 streamers for $16.99/mo and save 43%"
    }
  ],
  "clarifyingNote": "Short advice on ad-free vs ad-supported tiers.",
  "matchedPlatformIds": ["max_us", "disney_hulu_max_bundle"],
  "followUps": [
    "👉 I have T-Mobile Go5G",
    "👉 I have Verizon myPlan",
    "👉 Tell me about the Disney/Hulu/Max bundle"
  ]
}

OFFICIAL US CATALOG CONTEXT:
${COMPACT_CATALOG_SUMMARY_US}`
      : `You are ShopSmart AI Subscriptions & OTT Concierge, a brilliant, warm, and highly professional digital entertainment shopping advisor for India.

CRITICAL ARCHITECTURAL CONVERSATION PRINCIPLES:
1. FIRST-PERSON USER ACTION CHIPS ONLY:
   - The "followUps" array represents QUICK REPLIES FROM THE USER'S OWN PERSPECTIVE (what the user would say or click).
   - NEVER put the AI's question into followUps!
   - Examples of CORRECT followUps:
     * "👉 Haan, Amazon Prime ka complete 4-level blueprint banao"
     * "👉 Mere paas JioFiber connection hai"
     * "👉 Mere paas Airtel SIM hai"
     * "👉 TV vs Mobile ka sasta plan batao"
     * "👉 Iske jaise 2 aur best shows batao"
   - Examples of WRONG followUps: "Kya aap Jio use karte hain?", "Kya aap TV par dekhenge?" (NEVER do this!).

2. TWO CONVERSATION MODES:
   A) MODE 1 — DISCOVERY / INITIAL SHOW INQUIRY (User asks where to watch, or asks for K-Drama, Business series, Cricket):
      - Give a crisp 2-3 line answer naming the exact platform(s) in India (e.g., Mirzapur is on Prime Video, Stranger Things on Netflix, Scam 1992 on SonyLIV, K-Dramas like Crash Landing on You on Netflix, Business series on SonyLIV/ZEE5).
      - Ask the user permission politely:
        "Kya main aapke liye [Platform Name] ke saare plans, screen limits, aur 4-Level Savings Blueprint (₹0 Telecom deals, vouchers, combo pass) ki complete personalized strategy generate karoon?"
      - Set "savingSteps" to an empty array [] or 1 brief tip.
      - In "followUps", provide 1-tap user actions:
        ["👉 Haan, [Platform] ka complete 4-level blueprint banao", "👉 TV vs Mobile ka sasta plan batao", "👉 [Genre] ke 2 aur best shows batao"]

   B) MODE 2 — ON-DEMAND BLUEPRINT UNLOCK (User clicks "Haan blueprint banao", or explicitly asks for prices, saving strategies, telecom deals):
      - Deliver the full structured executive dossier:
        * summary: Crisp headline.
        * whereToWatch: Platform name and cheapest route.
        * savingSteps: Exactly 3 actionable level cards:
          - Level 1: ₹0 Telecom Perks (Jio / Airtel prepaid/postpaid/fiber)
          - Level 2: Super Combo / Voucher (Times Prime ₹1,199 / Gyftr cashback)
          - Level 3: Smart Strategy (1-Month binge & cancel / Family split)
        * clarifyingNote: TV vs Phone screen and resolution warning.
        * followUps: First-person user answers to your clarifying questions (e.g. ["👉 Mere paas Jio connection hai", "👉 Mere paas Airtel SIM hai", "👉 TV par dekhne ke liye konsa lu?"])

3. LANGUAGE ADAPTABILITY:
   - Match user language naturally (Hinglish/Hindi if user writes in Hindi/Hinglish, English if in English).
   - Keep tone warm, witty, honest, and expert-level.

OUTPUT STRICTLY IN THIS JSON FORMAT:
{
  "summary": "Crisp conversational summary or show streaming details.",
  "whereToWatch": {
    "platform": "Platform Name (e.g. Amazon Prime Video, Netflix, Disney+ Hotstar)",
    "cheapestRoute": "Short plan highlight (e.g. ₹299/mo or ₹0 via Telecom)"
  },
  "isBlueprintUnlocked": true,
  "savingSteps": [
    {
      "level": "Level 1: ₹0 Telecom",
      "icon": "🎁",
      "title": "Short title",
      "detail": "1-2 sentence specific actionable tip"
    },
    {
      "level": "Level 2: Super Combo / Voucher",
      "icon": "🎟️",
      "title": "Short title",
      "detail": "1-2 sentence specific actionable tip"
    },
    {
      "level": "Level 3: Smart Binge Strategy",
      "icon": "⚡",
      "title": "Short title",
      "detail": "1-2 sentence specific actionable tip"
    }
  ],
  "clarifyingNote": "Short advice or question about device/operator.",
  "matchedPlatformIds": ["prime_video", "timesprime"],
  "followUps": [
    "👉 First-person user action 1",
    "👉 First-person user action 2",
    "👉 First-person user action 3"
  ]
}

OFFICIAL INDIA CATALOG CONTEXT:
${COMPACT_CATALOG_SUMMARY}`;

    // Construct conversation messages (Sanitized & capped to avoid prompt injection / token blowup)
    const formattedHistory = (Array.isArray(history) ? history.slice(-6) : []).map((msg) => ({
      role: msg.role === "assistant" ? "assistant" : "user",
      content: typeof msg.content === "string" ? msg.content.slice(0, 400) : JSON.stringify(msg.content || "").slice(0, 400)
    }));

    const conversationMessages = [
      { role: "system", content: systemPrompt },
      ...formattedHistory,
      { role: "user", content: `<user_inquiry>\n${userMessage}\n</user_inquiry>` }
    ];

    let structuredData = null;

    // 1. Try Groq (Sub-Second response)
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
            messages: conversationMessages,
            temperature: 0.2,
            response_format: { type: "json_object" }
          }),
          signal: AbortSignal.timeout(8000)
        });

        if (groqRes.ok) {
          const data = await groqRes.json();
          const content = data.choices?.[0]?.message?.content;
          if (content) {
            structuredData = parseAiJson(content);
          }
        }
      } catch (err) {
        console.warn("[Subscriptions AI Chat] Groq error:", err.message);
      }
    }

    // 2. Fallback to OpenRouter
    if (!structuredData && OPENROUTER_API_KEY) {
      const orModels = ["liquid/lfm-2.5-2.6b:free", "google/gemini-2.0-flash-001"];
      for (const model of orModels) {
        try {
          const orRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
              "HTTP-Referer": "http://localhost:3000",
              "X-Title": "ShopSmart Subscriptions Advisor"
            },
            body: JSON.stringify({
              model,
              messages: conversationMessages,
              temperature: 0.2,
              max_tokens: 700
            }),
            signal: AbortSignal.timeout(10000)
          });

          if (orRes.ok) {
            const data = await orRes.json();
            const content = data.choices?.[0]?.message?.content;
            if (content) {
              structuredData = parseAiJson(content);
              if (structuredData) break;
            }
          }
        } catch (err) {
          console.warn(`[Subscriptions AI Chat] OpenRouter ${model} error:`, err.message);
        }
      }
    }

    // 3. Fallback rule-based catalog engine
    if (!structuredData) {
      structuredData = generateCatalogFallbackStructured(userMessage, isUS, isUK, isCA, isAU, isAE);
    }

    const activeCatalog = isAE ? AE_SUBSCRIPTIONS_CATALOG : (isAU ? AU_SUBSCRIPTIONS_CATALOG : (isCA ? CA_SUBSCRIPTIONS_CATALOG : (isUK ? UK_SUBSCRIPTIONS_CATALOG : (isUS ? US_SUBSCRIPTIONS_CATALOG : INDIA_SUBSCRIPTIONS_CATALOG))));
    const activeSeoMap = isAE ? SUBSCRIPTIONS_SEO_MAP_AE : (isAU ? SUBSCRIPTIONS_SEO_MAP_AU : (isCA ? SUBSCRIPTIONS_SEO_MAP_CA : (isUK ? SUBSCRIPTIONS_SEO_MAP_UK : (isUS ? SUBSCRIPTIONS_SEO_MAP_US : SUBSCRIPTIONS_SEO_MAP))));

    // Enrich matched platforms with catalog and SEO metadata
    const enrichedPlatforms = (structuredData.matchedPlatformIds || [])
      .map((id) => {
        let normalizedId = id;
        if (id === "osn" || id === "osn_plus") normalizedId = "osn_plus_ae";
        if (id === "shahid" || id === "shahid_vip") normalizedId = "shahid_vip_ae";
        if (id === "tod" || id === "tod_tv") normalizedId = "tod_tv_ae";
        if (id === "starzplay" || id === "starz") normalizedId = "starzplay_ae";
        if (id === "anghami" || id === "anghami_plus") normalizedId = "anghami_ae";
        if (id === "talabat" || id === "talabat_pro") normalizedId = "talabat_pro_ae";
        if (id === "careem" || id === "careem_plus") normalizedId = "careem_plus_ae";
        if (id === "noon" || id === "noon_one") normalizedId = "noon_one_ae";
        if (id === "deliveroo" || id === "deliveroo_plus") normalizedId = "deliveroo_plus_ae";
        if (id === "spacetoon" || id === "spacetoon_go") normalizedId = "spacetoon_go_ae";
        if (id === "stan") normalizedId = "stan_au";
        if (id === "binge") normalizedId = "binge_au";
        if (id === "kayo" || id === "kayo_sports") normalizedId = "kayo_sports_au";
        if (id === "optus" || id === "optus_sport") normalizedId = "optus_sport_au";
        if (id === "foxtel" || id === "foxtel_now") normalizedId = "foxtel_now_au";
        if (id === "crave") normalizedId = "crave_ca";
        if (id === "sportsnet" || id === "sportsnet_plus") normalizedId = "sportsnet_plus_ca";
        if (id === "tsn" || id === "tsn_plus") normalizedId = "tsn_plus_ca";
        if (id === "cbc_gem" || id === "cbc") normalizedId = "cbc_gem_ca";
        if (id === "stacktv") normalizedId = "stacktv_ca";
        if (id === "britbox") normalizedId = isAU ? "britbox_au" : "britbox";
        if (id === "hayu") normalizedId = isAU ? "hayu_au" : "hayu";
        if (id === "doordash" || id === "dashpass") normalizedId = isAU ? "doordash_au" : (isCA ? "doordash_ca" : "doordash");
        if (id === "uber_one") normalizedId = isAU ? "uber_one_au" : (isCA ? "uber_one_ca" : (isUK ? "uber_one_uk" : "uber_one"));
        if (id === "prime_video" || id === "prime") normalizedId = isAE ? "prime_ae" : (isAU ? "prime_au" : (isCA ? "prime_ca" : (isUK ? "prime_uk" : (isUS ? "prime_us" : "prime"))));
        if (id === "netflix") normalizedId = isAE ? "netflix_ae" : (isAU ? "netflix_au" : (isCA ? "netflix_ca" : (isUK ? "netflix_uk" : (isUS ? "netflix_us" : "netflix"))));
        if (id === "max") normalizedId = isAE ? "osn_plus_ae" : (isAU ? "binge_au" : (isCA ? "crave_ca" : (isUS ? "max_us" : "max")));
        if (id === "disney" || id === "disney_plus") normalizedId = isAE ? "disney_ae" : (isAU ? "disney_au" : (isCA ? "disney_ca" : (isUK ? "disney_uk" : (isUS ? "disney_us" : "hotstar"))));
        if (id === "apple_tv" || id === "apple_tv_plus") normalizedId = isAE ? "apple_tv_ae" : (isAU ? "apple_tv_au" : (isCA ? "apple_tv_ca" : (isUK ? "apple_tv_uk" : (isUS ? "apple_tv_plus" : "apple_tv"))));
        if (id === "apple_one") normalizedId = isAE ? "apple_one_ae" : (isAU ? "apple_one_au" : (isUK ? "apple_one_uk" : (isUS ? "apple_one_us" : "apple_one")));
        if (id === "now_tv" || id === "now") normalizedId = "now_tv_uk";
        if (id === "sky" || id === "sky_cinema") normalizedId = "sky_cinema_uk";
        if (id === "spotify") normalizedId = isAE ? "spotify_ae" : (isAU ? "spotify_au" : (isCA ? "spotify_ca" : (isUK ? "spotify_uk" : "spotify")));
        if (id === "paramount" || id === "paramount_plus") normalizedId = isAE ? "osn_plus_ae" : (isAU ? "paramount_au" : (isCA ? "paramount_ca" : (isUK ? "paramount_uk" : (isUS ? "paramount_plus" : "paramount"))));
        if (id === "youtube" || id === "youtube_premium") normalizedId = isAE ? "youtube_premium_ae" : (isAU ? "youtube_premium_au" : (isUS ? "youtube_premium_us" : "youtube_premium"));
        if (id === "crunchyroll") normalizedId = isAE ? "crunchyroll_ae" : "crunchyroll";
        if (id === "ps_plus") normalizedId = isAE ? "ps_plus_ae" : "ps_plus";
        if (id === "xbox_game_pass") normalizedId = isAE ? "xbox_game_pass_ae" : "xbox_game_pass";
        if (id === "chatgpt_plus") normalizedId = isAE ? "chatgpt_plus_ae" : "chatgpt_plus";
        if (id === "claude_pro") normalizedId = isAE ? "claude_pro_ae" : "claude_pro";
        if (id === "microsoft_365") normalizedId = isAE ? "microsoft_365_ae" : "microsoft_365";
        if (id === "google_one") normalizedId = isAE ? "google_one_ae" : "google_one";
        if (id === "audible") normalizedId = isAE ? "audible_ae" : "audible";

        const sub = activeCatalog.find((s) => s.id === normalizedId || s.id === id);
        if (!sub) return null;
        const seoData = activeSeoMap[sub.id] || 
          Object.values(activeSeoMap).find((s) => s.aliases?.includes(sub.id) || s.slug === sub.id) || null;
        const lowestPlan = sub.plans?.[0];
        const bestValuePlan = sub.plans?.find((p) => p.period?.includes("year") || p.period?.includes("annual")) || lowestPlan;
        return {
          id: sub.id,
          name: sub.name,
          category: sub.category,
          tagline: sub.tagline,
          logoText: sub.logoText,
          accentColor: sub.accentColor,
          badge: sub.badge,
          startingPrice: lowestPlan ? `${currency}${lowestPlan.price}/${lowestPlan.period}` : "",
          bestPlan: bestValuePlan ? `${bestValuePlan.name} (${currency}${bestValuePlan.price}/${bestValuePlan.period})` : "",
          savingsTip: sub.savingsBlueprint?.telecomFree?.[0]
            ? `Free via ${sub.savingsBlueprint.telecomFree[0].operator}`
            : sub.savingsBlueprint?.comboPass?.passName
            ? `Available in ${sub.savingsBlueprint.comboPass.passName}`
            : `${sub.savingsBlueprint?.voucherSavings?.discountPercent || "5-10%"} Voucher Savings`,
          officialUrl: sub.savingsBlueprint?.officialUrl || `https://www.${sub.id}.com`,
          seoSlug: seoData?.slug ? `/subscriptions/${seoData.slug}` : `/subscriptions/${sub.id.replace(/_/g, "-")}`
        };
      })
      .filter(Boolean);

    // Primary SEO deep-dive slug
    const primarySeoSlug = enrichedPlatforms[0]?.seoSlug || null;

    return NextResponse.json({
      success: true,
      summary: structuredData.summary || (isAE ? "Here are the top streaming plans and savings for your UAE entertainment:" : (isAU ? "Here are the top streaming plans and savings for your Australian entertainment:" : (isCA ? "Here are the top streaming plans and savings for your Canadian entertainment:" : (isUK ? "Here are the top streaming plans and savings for your UK entertainment:" : (isUS ? "Here are the top streaming plans and savings for your US entertainment:" : "Aapke entertainment ke liye best verified plans:"))))),
      whereToWatch: structuredData.whereToWatch || null,
      isBlueprintUnlocked: !!structuredData.isBlueprintUnlocked,
      savingSteps: Array.isArray(structuredData.savingSteps) ? structuredData.savingSteps : [],
      clarifyingNote: structuredData.clarifyingNote || null,
      recommendedPlatforms: enrichedPlatforms,
      seoSlug: primarySeoSlug,
      followUps: Array.isArray(structuredData.followUps) && structuredData.followUps.length > 0
        ? structuredData.followUps
        : isAE ? [
            "👉 I have Etisalat Freedom / eLife",
            "👉 I have du Postpaid",
            "👉 Tell me about free Deliveroo Plus with Prime"
          ] : isAU ? [
            "👉 I have Optus SubHub (10% off)",
            "👉 I have Telstra Plus rewards",
            "👉 What is the cheapest ad-free plan?"
          ] : isCA ? [
            "👉 I have Telus Stream+ / Internet",
            "👉 I have Bell Fibe TV",
            "👉 What is the cheapest ad-free plan?"
          ] : isUK ? [
            "👉 I have EE All-Rounder mobile",
            "👉 I have Sky TV / Cinema",
            "👉 What is the cheapest ad-free plan?"
          ] : isUS ? [
            "👉 I have T-Mobile Go5G wireless",
            "👉 I have Verizon myPlan",
            "👉 What is the cheapest ad-free plan?"
          ] : [
            "👉 Mere paas Jio/Airtel connection hai",
            "👉 Times Prime combo ke baare me batao",
            "👉 TV vs Mobile ka sabse sasta plan konsa hai?"
          ]
    });
  } catch (globalErr) {
    console.error("[Subscriptions AI Chat] Global error:", globalErr);
    return NextResponse.json({
      success: false,
      summary: "I encountered a minor issue processing your request. Please try asking again!",
      whereToWatch: null,
      isBlueprintUnlocked: false,
      savingSteps: [],
      clarifyingNote: null,
      recommendedPlatforms: [],
      seoSlug: null,
      followUps: [
        "👉 Top streaming deals in US",
        "👉 Disney Hulu Max bundle price",
        "👉 T-Mobile free Netflix guide"
      ]
    }, { status: 500 });
  }
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

function generateCatalogFallbackStructured(query, isUS = false, isUK = false, isCA = false, isAU = false, isAE = false) {
  const q = query.toLowerCase();

  const isAskingBlueprint = q.includes("blueprint") || q.includes("plan") || q.includes("sasta") || q.includes("cheap") || q.includes("offer") || q.includes("banao") || q.includes("price") || q.includes("deal");

  // UNITED ARAB EMIRATES (UAE / AE) FALLBACK ENGINE
  if (isAE) {
    if (q.includes("dragon") || q.includes("hbo") || q.includes("osn") || q.includes("succession") || q.includes("last of us") || q.includes("white lotus") || q.includes("yellowstone")) {
      if (!isAskingBlueprint) {
        return {
          summary: "House of the Dragon, The Last of Us, Succession, and all HBO/Warner Bros hits stream exclusively on OSN+ in the UAE! Before paying AED 49/month directly, did you know Etisalat eLife/Freedom plans and du Power plans include OSN+ at AED 0? Would you like me to generate our verified 4-Level Savings Blueprint?",
          whereToWatch: {
            platform: "OSN+ (UAE)",
            cheapestRoute: "AED 0 via Etisalat / du or AED 35.00/mo Standard with Ads"
          },
          isBlueprintUnlocked: false,
          savingSteps: [],
          clarifyingNote: "OSN+ is the official exclusive Middle East streaming home for HBO and Paramount+.",
          matchedPlatformIds: ["osn_plus_ae"],
          followUps: [
            "👉 Yes, build the 4-level savings blueprint for OSN+",
            "👉 I have Etisalat Freedom / eLife",
            "👉 I have du Postpaid Power plan"
          ]
        };
      }
      return {
        summary: "Here is your verified 4-Level Savings Blueprint for OSN+ in the UAE!",
        whereToWatch: {
          platform: "OSN+ (UAE)",
          cheapestRoute: "AED 0 via Etisalat / du or AED 35.00/mo Standard"
        },
        isBlueprintUnlocked: true,
        savingSteps: [
          {
            level: "Level 1: AED 0 Telecom & Fiber Perks",
            icon: "🎁",
            title: "Etisalat by e& / du",
            detail: "Selected Etisalat Freedom mobile post-paid and e& Home Fibre internet packages include OSN+ on us for 12 months. du Home Wireless Plus and Power Postpaid 300+ customers can also select OSN+ as their complimentary streaming benefit."
          },
          {
            level: "Level 2: Smiles & Bank Card Savings",
            icon: "🎟️",
            title: "Smiles by e& / YouGotaGift",
            detail: "Redeem accumulated Smiles points inside the Smiles app for OSN+ digital subscription vouchers. Alternatively, purchase digital gift codes via YouGotaGift with ENBD or ADCB credit cards for up to 10% instant cashback."
          },
          {
            level: "Level 3: e& Entertainment Multi-Pass",
            icon: "👑",
            title: "e& Multi-App Pass",
            detail: "Subscribe to the e& Entertainment Multi-Pass (AED 79/mo) which bundles OSN+, Starzplay, and Shahid VIP together, saving AED 31.00/month vs separate subscriptions."
          }
        ],
        clarifyingNote: "OSN+ Standard (AED 49/mo) is ad-free 1080p on 2 screens. Premium 4K with Dolby Atmos is AED 69/mo on 4 screens.",
        matchedPlatformIds: ["osn_plus_ae", "starzplay_ae", "shahid_vip_ae"],
        followUps: [
          "👉 I have Etisalat Freedom / eLife",
          "👉 I have du Postpaid",
          "👉 Compare OSN+ with Shahid VIP"
        ]
      };
    }

    if (q.includes("shahid") || q.includes("ramadan") || q.includes("arabic") || q.includes("saudi league") || q.includes("roshn")) {
      if (!isAskingBlueprint) {
        return {
          summary: "Top Arabic dramas, Ramadan 2026 exclusives, Arabic cinema, and the Roshn Saudi League stream on Shahid VIP! du Home Ultimate Fibre packages include Shahid VIP at AED 0, and Etisalat offers 50% carrier billing discounts. Would you like our 4-Level Savings Blueprint?",
          whereToWatch: {
            platform: "Shahid VIP (UAE)",
            cheapestRoute: "AED 0 via du Home Ultimate or AED 24.99/mo (with Ads)"
          },
          isBlueprintUnlocked: false,
          savingSteps: [],
          clarifyingNote: "Shahid VIP is MBC Group's leading global Arabic streaming service.",
          matchedPlatformIds: ["shahid_vip_ae"],
          followUps: [
            "👉 Yes, build the 4-level savings blueprint for Shahid VIP",
            "👉 Tell me about Shahid VIP + Sports pricing",
            "👉 I have du Home Fiber"
          ]
        };
      }
      return {
        summary: "Here is your verified 4-Level Savings Blueprint for Shahid VIP in the UAE!",
        whereToWatch: {
          platform: "Shahid VIP (UAE)",
          cheapestRoute: "AED 0 via du Home Ultimate or AED 349.99/year (Save ~30%)"
        },
        isBlueprintUnlocked: true,
        savingSteps: [
          {
            level: "Level 1: du & Etisalat Telecom Perks",
            icon: "🎁",
            title: "du Home Ultimate & Etisalat Billing",
            detail: "du Home Ultimate Fibre plans include Shahid VIP at AED 0 for your contract duration. Etisalat customers paying with direct carrier billing receive 50% discount on their first 3 months via My Etisalat app."
          },
          {
            level: "Level 2: Annual Subscription Discount",
            icon: "🎟️",
            title: "Shahid VIP Annual Pass",
            detail: "Switch from monthly AED 39.99/mo to the annual pass (AED 349.99/yr) to get 12 months for the price of ~8.5 months, saving AED 130/year."
          },
          {
            level: "Level 3: Shahid VIP + Sports Combo",
            icon: "👑",
            title: "Sports & Entertainment Combo",
            detail: "Bundle Shahid VIP entertainment with Roshn Saudi League live football (AED 69.99/mo) to save AED 24.99/month compared to paying separately."
          }
        ],
        clarifyingNote: "Shahid VIP is AED 39.99/mo ad-free (3 screens Full HD). Ad-supported tier is AED 24.99/mo.",
        matchedPlatformIds: ["shahid_vip_ae"],
        followUps: [
          "👉 I have du Home internet",
          "👉 Tell me about Roshn Saudi League matches",
          "👉 Compare Shahid VIP with OSN+"
        ]
      };
    }

    if (q.includes("premier league") || q.includes("epl") || q.includes("tod") || q.includes("bein") || q.includes("champions league")) {
      return {
        summary: "All 380 English Premier League matches, UEFA Champions League, and Formula 1 stream live on TOD (by beIN Media Group) in the UAE! eLife and du TV subscribers with beIN Sports packages get complimentary digital TOD streaming credentials. Non-subscribers can buy the TOD Total Annual Pass for AED 799/yr (saving AED 220/yr).",
        whereToWatch: {
          platform: "TOD (beIN Media Group)",
          cheapestRoute: "AED 0 via eLife / du beIN TV subscription or AED 84.99/mo Total"
        },
        isBlueprintUnlocked: true,
        savingSteps: [
          {
            level: "Level 1: eLife / du TV Complementary Access",
            icon: "⚽",
            title: "Free Digital Access with TV Package",
            detail: "If your household subscribes to beIN Sports on Etisalat eLife TV or du TV, you can activate TOD credentials at AED 0 to stream all matches on smartphones and laptops."
          },
          {
            level: "Level 2: Bank Statement Cashback",
            icon: "🎟️",
            title: "YouGotaGift UAE / ENBD Cashback",
            detail: "Buy TOD digital gift vouchers through YouGotaGift using ENBD or ADCB credit cards for up to 10% instant statement cashback."
          },
          {
            level: "Level 3: TOD Total Annual Pass",
            icon: "👑",
            title: "Annual Billing Discount",
            detail: "Pay AED 799 upfront for the TOD Total Annual Pass instead of AED 84.99/mo to save AED 220.88/year on all live football and entertainment."
          }
        ],
        clarifyingNote: "TOD Total supports 4K Ultra HD on supported Smart TVs with 2 concurrent streams.",
        matchedPlatformIds: ["tod_tv_ae"],
        followUps: [
          "👉 I have Etisalat eLife beIN package",
          "👉 Compare TOD with Starzplay Sports",
          "👉 How do I activate 4K Ultra HD streams?"
        ]
      };
    }

    if (q.includes("deliveroo") || q.includes("prime") || q.includes("food delivery") || q.includes("talabat") || q.includes("careem")) {
      return {
        summary: "UAE Food Delivery Strategy: Amazon Prime UAE (AED 16/mo or AED 140/yr) includes Deliveroo Plus Silver (worth AED 19/mo) completely FREE! You get free delivery on food orders over AED 30 across the UAE, plus Prime Video, and free next-day Amazon shipping. Careem Plus (AED 19/mo) also gives 10% cashback on Hala taxi rides and free food delivery.",
        whereToWatch: {
          platform: "Amazon Prime UAE & Deliveroo Plus",
          cheapestRoute: "AED 16.00/mo (Deliveroo Plus Silver included free at AED 0)"
        },
        isBlueprintUnlocked: true,
        savingSteps: [
          {
            level: "Level 1: Free Deliveroo Plus with Prime",
            icon: "🍔",
            title: "Amazon.ae Prime Integration",
            detail: "Link your Amazon.ae Prime account inside the Deliveroo app to unlock Deliveroo Plus Silver for 100% FREE (saving AED 19/month or AED 228/year)."
          },
          {
            level: "Level 2: Careem Plus 10% Taxi Cashback",
            icon: "🚕",
            title: "Careem Plus ROI Strategy",
            detail: "Careem Plus (AED 19/mo) pays for itself with just 2 Hala taxi rides per month (10% cashback into your Careem Pay wallet) plus free food deliveries."
          },
          {
            level: "Level 3: du Postpaid Free Amazon Prime",
            icon: "👑",
            title: "du Postpaid 12 Months Free",
            detail: "du Postpaid mobile plans starting from AED 150/mo include free Amazon Prime membership for 12 months via the du App."
          }
        ],
        clarifyingNote: "Amazon Prime Annual is AED 140/year (equivalent to just AED 11.66/month).",
        matchedPlatformIds: ["prime_ae", "deliveroo_plus_ae", "careem_plus_ae"],
        followUps: [
          "👉 How to link Amazon Prime with Deliveroo",
          "👉 Careem Plus vs Talabat Pro comparison",
          "👉 I have du Postpaid"
        ]
      };
    }

    return {
      summary: "We have 25 verified UAE streaming, music, delivery, and productivity platforms ready in AED. What would you like to explore: HBO hits on OSN+, Arabic originals on Shahid VIP, Premier League on TOD, or free Deliveroo Plus with Prime?",
      whereToWatch: {
        platform: "Multi-Platform UAE Entertainment",
        cheapestRoute: "Etisalat / du Telecom Perks & Amazon Prime Bundles"
      },
      isBlueprintUnlocked: false,
      savingSteps: [],
      clarifyingNote: "Tell me any show, match, or app in the UAE to reveal verified 4-level savings blueprints in AED.",
      matchedPlatformIds: ["osn_plus_ae", "shahid_vip_ae", "prime_ae"],
      followUps: [
        "👉 OSN+ UAE pricing & telecom deals",
        "👉 Shahid VIP Arabic originals blueprint",
        "👉 Free Deliveroo Plus with Amazon Prime trick"
      ]
    };
  }

  // AUSTRALIA FALLBACK ENGINE
  if (isAU) {
    if (q.includes("dragon") || q.includes("hbo") || q.includes("binge") || q.includes("succession") || q.includes("white lotus") || q.includes("euphoria") || q.includes("last of us")) {
      if (!isAskingBlueprint) {
        return {
          summary: "House of the Dragon, Succession, and all HBO/Warner Bros hits stream exclusively on BINGE in Australia! Before paying $10/mo to $22/mo directly, did you know Telstra Plus gives up to $10/mo bill credits, Optus SubHub gives a 10% stack discount, and Hubbl Stack & Save bundles BINGE with Kayo? Would you like me to generate our verified 4-Level Savings Blueprint?",
          whereToWatch: {
            platform: "BINGE (Australia)",
            cheapestRoute: "A$10.00/mo (Basic with Ads) or discounted via Telstra Plus / Optus SubHub"
          },
          isBlueprintUnlocked: false,
          savingSteps: [],
          clarifyingNote: "BINGE is the official home of HBO, Warner Bros, and top Foxtel drama in Australia.",
          matchedPlatformIds: ["binge_au"],
          followUps: [
            "👉 Yes, build the 4-level savings blueprint for BINGE",
            "👉 I have Telstra Plus rewards",
            "👉 Tell me about the Hubbl Stack & Save deal"
          ]
        };
      }
      return {
        summary: "Here is your verified 4-Level Savings Blueprint for BINGE Australia!",
        whereToWatch: {
          platform: "BINGE (Australia)",
          cheapestRoute: "A$10.00/mo Basic or stack with Hubbl / Optus SubHub"
        },
        isBlueprintUnlocked: true,
        savingSteps: [
          {
            level: "Level 1: Telco Credits & Perks",
            icon: "🎁",
            title: "Telstra Plus & Optus SubHub",
            detail: "Eligible Telstra mobile/broadband customers can redeem Telstra Plus points or member pricing for $10-$12.50/mo bill credits. Optus SubHub users get an instant 10% monthly discount when stacking 3+ services."
          },
          {
            level: "Level 2: Supermarket & Loyalty Deals",
            icon: "🎟️",
            title: "Woolworths Everyday Rewards",
            detail: "Buy Apple / Google Play or streaming vouchers during Woolworths 20x Everyday Rewards point promotions to convert points into 10% off your future grocery shop."
          },
          {
            level: "Level 3: Hubbl Stack & Save",
            icon: "👑",
            title: "Hubbl Bundle Pass",
            detail: "Stack BINGE + Kayo Sports + Netflix on a single Hubbl account to unlock up to $15.00/month recurring stack discounts directly on your bill."
          }
        ],
        clarifyingNote: "BINGE Basic (A$10/mo) includes HD on 1 screen with limited ads. Standard is A$19/mo (2 screens HD ad-free).",
        matchedPlatformIds: ["binge_au", "kayo_sports_au"],
        followUps: [
          "👉 I have Optus SubHub (10% off)",
          "👉 I have Telstra Plus bill credits",
          "👉 Compare BINGE with Stan Australia"
        ]
      };
    }

    if (q.includes("stan") || q.includes("yellowstone") || q.includes("drag race") || q.includes("better call saul")) {
      if (!isAskingBlueprint) {
        return {
          summary: "Yellowstone, RuPaul's Drag Race, and Stan Originals stream exclusively on Stan in Australia! Stan also offers an optional Stan Sport add-on (A$15/mo) for UEFA Champions League and Rugby. Did you know you can bundle Stan in Optus SubHub for an instant 10% monthly discount? Would you like our complete 4-Level Savings Blueprint?",
          whereToWatch: {
            platform: "Stan Australia",
            cheapestRoute: "A$12.00/mo (Basic) or 10% off via Optus SubHub"
          },
          isBlueprintUnlocked: false,
          savingSteps: [],
          clarifyingNote: "Stan plans range from Basic (A$12/mo, SD, 1 screen) to Premium (A$22/mo, 4K UHD, 4 screens).",
          matchedPlatformIds: ["stan_au"],
          followUps: [
            "👉 Yes, build the 4-level savings blueprint for Stan",
            "👉 Tell me about Stan Sport add-on",
            "👉 I have Optus SubHub"
          ]
        };
      }
      return {
        summary: "Here is your verified 4-Level Savings Blueprint for Stan Australia!",
        whereToWatch: {
          platform: "Stan Australia",
          cheapestRoute: "A$12.00/mo Basic or 10% off with Optus SubHub"
        },
        isBlueprintUnlocked: true,
        savingSteps: [
          {
            level: "Level 1: Carrier Bundle Discounts",
            icon: "🎁",
            title: "Optus SubHub 10% Off",
            detail: "Optus customers can bundle Stan inside Optus SubHub along with 2 other eligible subs (Netflix, Prime, BINGE) to get an automated 10% discount credited on their Optus invoice every month."
          },
          {
            level: "Level 2: Supermarket 20x Points",
            icon: "🎟️",
            title: "Everyday Rewards / Flybuys",
            detail: "Purchase Apple or Google Play gift cards during Woolworths 20x Everyday Rewards points promotions. Pay your Stan bill through in-app billing to capture 10% real value back."
          },
          {
            level: "Level 3: Binge & Rotate Strategy",
            icon: "⚡",
            title: "Monthly Rotation Strategy",
            detail: "Stan has zero lock-in contracts. Activate Stan for 1 month to binge Yellowstone and Stan Originals, then pause and switch to BINGE or Kayo to save over A$120/year."
          }
        ],
        clarifyingNote: "Stan offers a 30-day free trial on core entertainment tiers for brand-new accounts.",
        matchedPlatformIds: ["stan_au"],
        followUps: [
          "👉 I have Optus SubHub (10% off)",
          "👉 Tell me about Stan Sport pricing",
          "👉 What are the 4K Ultra HD device rules?"
        ]
      };
    }

    if (q.includes("afl") || q.includes("nrl") || q.includes("kayo") || q.includes("cricket") || q.includes("f1") || q.includes("formula 1")) {
      if (!isAskingBlueprint) {
        return {
          summary: "AFL, NRL, Formula 1, and international cricket stream live and on-demand on Kayo Sports in Australia! Did you know you can save over A$160/year by getting a Digital Club Membership through your favorite AFL/NRL team, or redeem Telstra Plus points for up to $12.50/mo bill credits? Would you like our 4-Level Savings Blueprint?",
          whereToWatch: {
            platform: "Kayo Sports",
            cheapestRoute: "A$240/yr via AFL/NRL Club Digital Membership (saves A$180 vs A$35/mo)"
          },
          isBlueprintUnlocked: false,
          savingSteps: [],
          clarifyingNote: "Kayo Sports covers over 50 sports in 4K Ultra HD on the Basic tier.",
          matchedPlatformIds: ["kayo_sports_au"],
          followUps: [
            "👉 Yes, build the 4-level savings blueprint for Kayo",
            "👉 How does the AFL/NRL club membership trick work?",
            "👉 I have Telstra Plus"
          ]
        };
      }
      return {
        summary: "Here is your verified 4-Level Savings Blueprint for Kayo Sports Australia!",
        whereToWatch: {
          platform: "Kayo Sports",
          cheapestRoute: "A$240/yr via AFL/NRL Club Digital Pass (Save A$180/yr)"
        },
        isBlueprintUnlocked: true,
        savingSteps: [
          {
            level: "Level 1: AFL / NRL Digital Club Privilege",
            icon: "🏉",
            title: "AFL & NRL Club Digital Membership",
            detail: "Almost every AFL and NRL club (Richmond, Collingwood, Broncos, Rabbitohs) offers a Digital Club Membership for ~A$240-$260/yr that includes a full 12-month Kayo Basic voucher. This slashes the regular A$35/mo (A$420/yr) price by ~40%!"
          },
          {
            level: "Level 2: Telstra Plus $10-$12.50/mo Credit",
            icon: "🎁",
            title: "Telstra Plus Perks",
            detail: "Telstra post-paid customers can redeem Telstra Plus points for a $10 to $12.50/month bill credit on Kayo Sports for up to 12 months."
          },
          {
            level: "Level 3: Hubbl Stack & Save",
            icon: "👑",
            title: "Hubbl Multi-App Bundle",
            detail: "Bundle Kayo Sports with BINGE and Netflix via Hubbl to save up to A$15.00/month recurring on your overall household streaming bill."
          }
        ],
        clarifyingNote: "Kayo Sports Basic is A$35.00/mo (4K, 2 screens). Hubbl or club passes make it dramatically cheaper.",
        matchedPlatformIds: ["kayo_sports_au", "binge_au"],
        followUps: [
          "👉 Explain the AFL/NRL club voucher steps",
          "👉 I have Telstra Plus rewards",
          "👉 Compare Kayo Sports with Optus Sport"
        ]
      };
    }

    if (q.includes("optus") || q.includes("premier league") || q.includes("epl") || q.includes("la liga")) {
      return {
        summary: "The English Premier League and Spanish LaLiga stream exclusively on Optus Sport in Australia! Optus mobile or home internet customers get Optus Sport for just A$6.99/mo (over 70% off standard A$24.99/mo).",
        whereToWatch: {
          platform: "Optus Sport",
          cheapestRoute: "A$6.99/mo for Optus customers (saves A$18/mo) or A$24.99/mo standalone"
        },
        isBlueprintUnlocked: true,
        savingSteps: [
          {
            level: "Level 1: Optus Customer Rate",
            icon: "⚽",
            title: "A$6.99/mo Optus SIM / NBN Discount",
            detail: "Link your Optus prepaid, postpaid, or home internet account via My Optus app to unlock the subsidized A$6.99/mo pricing instead of A$24.99/mo."
          },
          {
            level: "Level 2: Annual Prepaid Pass",
            icon: "🎟️",
            title: "A$229/yr Annual Pass",
            detail: "Non-Optus users can purchase the annual pass for A$229/yr to save A$70 compared to paying A$24.99 monthly."
          },
          {
            level: "Level 3: Optus SubHub Integration",
            icon: "👑",
            title: "Optus SubHub Multi-Stack",
            detail: "Manage your other entertainment subscriptions inside Optus SubHub to enjoy an additional 10% stack discount on services like Netflix and Stan."
          }
        ],
        clarifyingNote: "Optus Sport broadcasts all 380 Premier League matches live with 1080p Full HD.",
        matchedPlatformIds: ["optus_sport_au"],
        followUps: [
          "👉 I have an Optus mobile plan",
          "👉 Compare Optus Sport with Kayo Sports",
          "👉 How do I activate via My Optus app?"
        ]
      };
    }

    return {
      summary: "We have 25 verified Australian streaming platforms ready. What would you like to watch: AFL/NRL on Kayo, HBO hits on BINGE, Stan Originals, or Premier League on Optus Sport?",
      whereToWatch: {
        platform: "Multi-Platform Australian Entertainment",
        cheapestRoute: "Hubbl Stack & Save or Optus SubHub (10% off)"
      },
      isBlueprintUnlocked: false,
      savingSteps: [],
      clarifyingNote: "Tell me any Australian show, sport, or platform to reveal verified 4-level savings blueprints.",
      matchedPlatformIds: ["stan_au", "binge_au", "kayo_sports_au"],
      followUps: [
        "👉 BINGE Australia pricing & deals",
        "👉 Stan Australia Yellowstone blueprint",
        "👉 Kayo Sports AFL/NRL club pass trick"
      ]
    };
  }

  // CANADA FALLBACK ENGINE
  if (isCA) {
    if (q.includes("dragon") || q.includes("hbo") || q.includes("crave") || q.includes("succession") || q.includes("last of us")) {
      if (!isAskingBlueprint) {
        return {
          summary: "House of the Dragon and The Last of Us stream exclusively on Crave in Canada! Before paying $22/mo for Crave Premium alone, did you know Bell Fibe TV customers can get Crave bundled with bill credits, and Virgin Plus offers exclusive member discounts? Would you like me to generate our verified 4-Level Savings Blueprint?",
          whereToWatch: {
            platform: "Crave (Canada)",
            cheapestRoute: "$9.99/mo (Basic with Ads) or $0 via Bell Fibe TV promo"
          },
          isBlueprintUnlocked: false,
          savingSteps: [],
          clarifyingNote: "Crave also includes all HBO, Max Originals, and Canadian hits like Letterkenny.",
          matchedPlatformIds: ["crave_ca"],
          followUps: [
            "👉 Yes, build the 4-level savings blueprint for Crave",
            "👉 I have Bell Fibe TV / Internet",
            "👉 Tell me about the Crave + Starz bundle"
          ]
        };
      }
      return {
        summary: "Here is your verified 4-Level Savings Blueprint for Crave in Canada!",
        whereToWatch: {
          platform: "Crave (Canada)",
          cheapestRoute: "$0 via Bell Fibe TV bundles or $9.99/mo Basic"
        },
        isBlueprintUnlocked: true,
        savingSteps: [
          {
            level: "Level 1: $0 Carrier Perks",
            icon: "🎁",
            title: "Bell Fibe TV & Virgin Plus",
            detail: "Bell Fibe TV Better/Best packages include Crave. Virgin Plus members also get up to $5/month bill credit discounts via the Member Lounge app."
          },
          {
            level: "Level 2: Voucher Savings",
            icon: "🎟️",
            title: "Costco Canada / Rakuten CA",
            detail: "Buy Crave annual digital vouchers at Costco Canada wholesale, or activate Rakuten CA before subscribing for up to $15 statement cashback."
          },
          {
            level: "Level 3: Short Binge & Cancel",
            icon: "⚡",
            title: "1-Month Binge Strategy",
            detail: "Pay $22 for 1 month of 4K Ad-Free Premium to binge your favorite season, then cancel immediately to avoid recurring billing."
          }
        ],
        clarifyingNote: "Crave Premium ($22/mo) supports 4 concurrent streams and 4K Ultra HD on living room Smart TVs.",
        matchedPlatformIds: ["crave_ca"],
        followUps: [
          "👉 I have Bell Fibe TV",
          "👉 I want ad-free streaming only",
          "👉 Compare Crave with Netflix Canada"
        ]
      };
    }

    if (q.includes("hockey") || q.includes("nhl") || q.includes("sportsnet") || q.includes("blue jays")) {
      return {
        summary: "NHL Hockey and Toronto Blue Jays MLB games are broadcast on Sportsnet+! If you have Rogers Ignite TV or Bell Fibe with Sportsnet, you can stream for $0 completely free with your cable login. Would you like me to unlock the full Sportsnet+ savings blueprint?",
        whereToWatch: {
          platform: "Sportsnet+ (Canada)",
          cheapestRoute: "$0 with Cable login or $19.99/mo Standard"
        },
        isBlueprintUnlocked: false,
        savingSteps: [],
        clarifyingNote: "Sportsnet+ Premium ($34.99/mo) includes 1,000+ out-of-market NHL games and the entire WWE Network.",
        matchedPlatformIds: ["sportsnet_plus_ca"],
        followUps: [
          "👉 Yes, build Sportsnet+ savings blueprint",
          "👉 I have Rogers Ignite TV",
          "👉 How much does the Annual Pass save?"
        ]
      };
    }

    if (q.includes("telus") || q.includes("stream+") || q.includes("bundle")) {
      return {
        summary: "Telus Stream+ is Canada's best streaming combo! It packages Netflix Standard with Ads, Disney+ Standard with Ads, and Amazon Prime Video together for just $20.00/mo instead of $38.00 individually, saving you $18 every single month ($216/year).",
        whereToWatch: {
          platform: "Telus Stream+ Bundle",
          cheapestRoute: "$20.00/mo (Save 47% across 3 platforms)"
        },
        isBlueprintUnlocked: true,
        savingSteps: [
          {
            level: "Level 1: Telus Eligibility",
            icon: "🎁",
            title: "Telus Mobile or Internet",
            detail: "Available to any Telus postpaid wireless or home internet subscriber through the MyTelus app."
          },
          {
            level: "Level 2: Keep Existing Profiles",
            icon: "⚡",
            title: "Link Existing Accounts",
            detail: "You do not lose your Netflix or Disney+ viewing history; simply link your existing account credentials to Telus Stream+ billing."
          },
          {
            level: "Level 3: Upgrade to Ad-Free",
            icon: "👑",
            title: "Stream+ Premium Option",
            detail: "You can upgrade to ad-free and 4K tiers for a nominal $18/mo bundle discount."
          }
        ],
        clarifyingNote: "Telus Stream+ can be cancelled at any time with no long-term contracts.",
        matchedPlatformIds: ["netflix_ca", "disney_ca", "prime_ca"],
        followUps: [
          "👉 I have Telus mobile service",
          "👉 Compare with separate subscriptions",
          "👉 Does Prime include DoorDash DashPass?"
        ]
      };
    }

    return {
      summary: "Welcome to ShopSmart AI Canada Streaming Concierge! We track all 25 top Canadian platforms (Crave, Netflix CA, Disney+ CA, Prime Video, Sportsnet+, TSN, CBC Gem) and verified perks from Telus Stream+ ($20/mo bundle), Bell Fibe TV, Rogers, Costco Canada, and RBC free DashPass. What would you like to watch?",
      whereToWatch: {
        platform: "Canadian Streaming Platforms",
        cheapestRoute: "Telus Stream+ ($20/mo) or Free on CBC Gem ($0)"
      },
      isBlueprintUnlocked: false,
      savingSteps: [],
      clarifyingNote: "Tell me any movie, show, NHL team, or platform name to see verified Canadian pricing (C$) and carrier perks.",
      matchedPlatformIds: ["crave_ca", "netflix_ca", "sportsnet_plus_ca"],
      followUps: [
        "👉 House of the Dragon (Crave) deals",
        "👉 Telus Stream+ $20 bundle savings",
        "👉 How to watch NHL hockey cheap in Canada"
      ]
    };
  }

  // UK FALLBACK ENGINE
  if (isUK) {
    if (q.includes("slow horses") || q.includes("apple") || q.includes("ted lasso")) {
      if (!isAskingBlueprint) {
        return {
          summary: "Slow Horses (Gary Oldman) is exclusively on Apple TV+! But before paying £8.99/mo, did you know EE customers can get Apple One free with Inclusive Extras, and Barclaycard / Currys offers 3-5 months free? Would you like me to unlock the full 4-Level Savings Blueprint?",
          whereToWatch: {
            platform: "Apple TV+ (UK)",
            cheapestRoute: "£0 via EE All-Rounder / Currys Perks or £8.99/mo"
          },
          isBlueprintUnlocked: false,
          savingSteps: [],
          clarifyingNote: "Apple TV+ supports 4K HDR, Dolby Atmos, and family sharing for up to 6 members.",
          matchedPlatformIds: ["apple_tv_uk", "apple_one_uk"],
          followUps: [
            "👉 Yes, build the 4-level savings blueprint for Apple TV+",
            "👉 I have EE mobile contract",
            "👉 Tell me about Apple One bundle (£18.95/mo)"
          ]
        };
      }
      return {
        summary: "Here is your verified 4-Level Savings Blueprint for Apple TV+ in the UK!",
        whereToWatch: {
          platform: "Apple TV+ (UK)",
          cheapestRoute: "£0 via EE Inclusive Extra or Currys Perks (Save 100%)"
        },
        isBlueprintUnlocked: true,
        savingSteps: [
          {
            level: "Level 1: £0 Carrier Perks",
            icon: "🎁",
            title: "EE Inclusive Extras & Currys",
            detail: "EE All-Rounder or Full Works plans let you select Apple One or Apple TV+ free as an Inclusive Extra. Currys Perks also offers 3 months free without device purchase."
          },
          {
            level: "Level 2: Super Combo Pass",
            icon: "👑",
            title: "Apple One UK (£18.95/mo)",
            detail: "Bundles Apple TV+, Apple Music, Apple Arcade, and 50GB iCloud storage, saving £7.50/mo compared to individual plans."
          },
          {
            level: "Level 3: Short Binge & Cancel",
            icon: "⚡",
            title: "1-Month Binge & Cancel",
            detail: "Subscribe for 1 month (£8.99), binge Slow Horses Seasons 1-4, and cancel immediately to avoid rolling charges."
          }
        ],
        clarifyingNote: "Family sharing allows up to 5 family members to watch with their own Apple IDs at no extra charge.",
        matchedPlatformIds: ["apple_tv_uk", "apple_one_uk"],
        followUps: [
          "👉 I have EE mobile contract",
          "👉 How to claim Currys 3-month trial",
          "👉 Compare Apple TV+ with NOW TV"
        ]
      };
    }

    if (q.includes("peaky blinders") || q.includes("doctor who") || q.includes("bbc") || q.includes("iplayer")) {
      return {
        summary: "Peaky Blinders and Doctor Who are available 100% free on BBC iPlayer for UK residents with a standard TV Licence! You can also stream Peaky Blinders in 4K UHD on Netflix UK (£4.99/mo). Would you like to see the Netflix UK savings blueprint?",
        whereToWatch: {
          platform: "BBC iPlayer & Netflix UK",
          cheapestRoute: "Free on BBC iPlayer (TV Licence) or £4.99/mo on Netflix"
        },
        isBlueprintUnlocked: false,
        savingSteps: [],
        clarifyingNote: "BBC iPlayer requires a UK TV licence. Netflix UK has ad-supported (£4.99) and 4K Premium (£17.99) tiers.",
        matchedPlatformIds: ["netflix_uk"],
        followUps: [
          "👉 Yes, build Netflix UK savings blueprint",
          "👉 I have EE / Sky TV",
          "👉 Suggest 2 similar British crime dramas"
        ]
      };
    }

    if (q.includes("now") || q.includes("sky") || q.includes("succession") || q.includes("house of the dragon")) {
      return {
        summary: "House of the Dragon and Succession are broadcast on Sky Atlantic and streamed on NOW TV (Entertainment Pass £6.99/mo) or Sky Stream (£18/mo bundled with Netflix). Would you like me to generate the complete UK savings blueprint?",
        whereToWatch: {
          platform: "NOW TV & Sky Stream",
          cheapestRoute: "Sky Stream £18/mo (Includes Netflix) or NOW TV £6.99/mo"
        },
        isBlueprintUnlocked: false,
        savingSteps: [],
        clarifyingNote: "NOW Boost (£6/mo) is required for Full HD 1080p, 5.1 audio, and 3 simultaneous streams without ads.",
        matchedPlatformIds: ["now_tv_uk", "sky_cinema_uk"],
        followUps: [
          "👉 Yes, build NOW TV & Sky savings blueprint",
          "👉 I have Sky TV / Cinema",
          "👉 What is NOW Boost add-on?"
        ]
      };
    }

    return {
      summary: "Welcome to ShopSmart AI UK Streaming Concierge! We track all 25 top UK platforms (NOW TV, Sky Cinema, Netflix UK, Disney+ UK, Apple TV+, ITVX Premium, Prime Video UK) and verified perks from EE, O2 Priority, Vodafone, and TopCashback. What would you like to watch?",
      whereToWatch: {
        platform: "UK Streaming Platforms",
        cheapestRoute: "Sky Stream (£18/mo) or EE Inclusive Extras (£0)"
      },
      isBlueprintUnlocked: false,
      savingSteps: [],
      clarifyingNote: "Tell me any movie, series, or British platform name to see verified UK pricing (£) and carrier perks.",
      matchedPlatformIds: ["netflix_uk", "now_tv_uk", "sky_cinema_uk"],
      followUps: [
        "👉 Slow Horses (Apple TV+) deals",
        "👉 NOW TV vs Sky Stream pricing",
        "👉 EE free Netflix & Apple One perks"
      ]
    };
  }

  // US FALLBACK ENGINE
  if (isUS) {
    if (q.includes("dragon") || q.includes("hbo") || q.includes("max") || q.includes("succession")) {
      if (!isAskingBlueprint) {
        return {
          summary: "House of the Dragon is exclusively on Max (HBO)! But before paying $9.99/mo for Max alone, would you like me to generate our verified 4-Level Savings Blueprint showing how to get the Disney+, Hulu & Max Mega Bundle for $16.99 (saving 43%) or claim it free via Cricket Wireless?",
          whereToWatch: {
            platform: "Max (HBO)",
            cheapestRoute: "$16.99/mo Mega Bundle or $0 via Cricket"
          },
          isBlueprintUnlocked: false,
          savingSteps: [],
          clarifyingNote: "Max also includes Succession, The Last of Us, and DC Universe movies.",
          matchedPlatformIds: ["max_us", "disney_hulu_max_bundle"],
          followUps: [
            "👉 Yes, build the complete 4-level savings blueprint for Max",
            "👉 Tell me about the Disney/Hulu/Max $16.99 bundle",
            "👉 How to get Max free with cell phone plan?"
          ]
        };
      }

      return {
        summary: "Here is your verified 4-Level Savings Blueprint for Max (HBO) in the United States!",
        whereToWatch: {
          platform: "Max (HBO)",
          cheapestRoute: "$16.99/mo Trio Bundle (Save 43%) or $0 via Cricket"
        },
        isBlueprintUnlocked: true,
        savingSteps: [
          {
            level: "Level 1: $0 Carrier Perks",
            icon: "🎁",
            title: "Cricket Wireless / AT&T",
            detail: "Cricket Wireless includes Max With Ads free on its $60/mo top unlimited plan. Select legacy AT&T plans also retain complimentary Max."
          },
          {
            level: "Level 2: Super Combo Pass",
            icon: "👑",
            title: "Disney+, Hulu & Max Mega Bundle ($16.99/mo)",
            detail: "Instead of paying $9.99 for Max alone, get all 3 platforms for $16.99/mo, saving you $155.76 per year."
          },
          {
            level: "Level 3: Verizon $10 Perk",
            icon: "⚡",
            title: "Verizon myPlan Netflix & Max ($10/mo)",
            detail: "Verizon myPlan users can add both Netflix and Max with ads for just $10/mo total, saving 41%."
          }
        ],
        clarifyingNote: "Only Max Ultimate ($20.99/mo) includes 4K UHD and Dolby Atmos sound.",
        matchedPlatformIds: ["max_us", "disney_hulu_max_bundle"],
        followUps: [
          "👉 I have Verizon myPlan",
          "👉 I want ad-free streaming only",
          "👉 Show me Netflix US deals"
        ]
      };
    }

    if (q.includes("stranger things") || q.includes("netflix") || q.includes("squid game")) {
      return {
        summary: "Stranger Things is exclusively on Netflix! In the US, Netflix starts at $6.99/mo with ads, but T-Mobile customers get 'Netflix on Us' at $0 complimentary cost. Would you like me to unlock the full 4-Level Savings Blueprint?",
        whereToWatch: {
          platform: "Netflix (US)",
          cheapestRoute: "$0 via T-Mobile or $6.99/mo Standard with Ads"
        },
        isBlueprintUnlocked: false,
        savingSteps: [],
        clarifyingNote: "Netflix Premium 4K is $22.99/mo for 4 simultaneous screens.",
        matchedPlatformIds: ["netflix_us"],
        followUps: [
          "👉 Yes, generate the 4-level blueprint for Netflix",
          "👉 I have T-Mobile cell service",
          "👉 Compare Standard vs Premium 4K"
        ]
      };
    }

    return {
      summary: "Welcome to ShopSmart AI US Streaming Concierge! We track all 25 top US platforms (Netflix, Max, Disney+, Hulu, Apple TV+, Paramount+, Prime Video) and verified perks from T-Mobile, Verizon, Target, and Costco. What would you like to watch?",
      whereToWatch: {
        platform: "US Streaming Platforms",
        cheapestRoute: "Disney/Hulu/Max Trio Bundle ($16.99/mo)"
      },
      isBlueprintUnlocked: false,
      savingSteps: [],
      clarifyingNote: "Tell me any movie, show, or platform name to see verified pricing and carrier savings.",
      matchedPlatformIds: ["netflix_us", "disney_hulu_max_bundle", "max_us"],
      followUps: [
        "👉 House of the Dragon (Max) deals",
        "👉 Disney+, Hulu & Max $16.99 bundle",
        "👉 T-Mobile Netflix & Apple TV+ free perks"
      ]
    };
  }

  // INDIA FALLBACK ENGINE
  if (q.includes("mirzapur") || q.includes("prime") || q.includes("panchayat")) {
    if (!isAskingBlueprint) {
      return {
        summary: "Mirzapur exclusively Amazon Prime Video par available hai! Lekin direct ₹1,499 pay karne ki zaroorat nahi hai. Kya main aapke liye Amazon Prime ka complete 4-Level Savings Blueprint (₹0 Telecom deals, vouchers, family split privilege) generate karoon?",
        whereToWatch: {
          platform: "Amazon Prime Video",
          cheapestRoute: "₹0 via Telecom ya ₹299/month (Binge & Cancel)"
        },
        isBlueprintUnlocked: false,
        savingSteps: [],
        clarifyingNote: "Prime Video par Panchayat, The Boys aur Farzi bhi available hain.",
        matchedPlatformIds: ["prime_video"],
        followUps: [
          "👉 Haan, Amazon Prime ka complete 4-level blueprint banao",
          "👉 Mere paas Jio / Airtel SIM hai",
          "👉 Sirf TV par dekhne ke liye konsa plan best hai?"
        ]
      };
    }

    return {
      summary: "Ye raha Amazon Prime Video ka complete on-demand Savings Blueprint! Aap ise ₹0 mein ya ₹399/year mein dekh sakte hain.",
      whereToWatch: {
        platform: "Amazon Prime Video",
        cheapestRoute: "₹0 via Airtel/Jio recharge ya ₹299/mo (Binge & Cancel)"
      },
      isBlueprintUnlocked: true,
      savingSteps: [
        {
          level: "Level 1: ₹0 Telecom",
          icon: "🎁",
          title: "Airtel / Jiofiber Check",
          detail: "Airtel ₹839/₹999 postpaid ya JioFiber 150Mbps pack par Prime Video free milta hai. Current recharge check karein."
        },
        {
          level: "Level 2: Super Combo",
          icon: "🎟️",
          title: "Times Prime Pass (₹1,199/yr)",
          detail: "Prime Video ke saath Hotstar aur SonyLIV bhi ek hi combo membership me milti hain."
        },
        {
          level: "Level 3: Short Binge Strategy",
          icon: "⚡",
          title: "1-Month Plan leke Cancel",
          detail: "Pura saal bhar pay karne ke bajaye ₹299 ka monthly pack leke show binge karein aur baad me cancel karein."
        }
      ],
      clarifyingNote: "Prime Video 4K UHD support karta hai. Living room TV ke liye ₹299/month ya ₹1,499 annual plan best hai.",
      matchedPlatformIds: ["prime_video", "timesprime"],
      followUps: [
        "👉 Mere paas Jio connection hai",
        "👉 Mere paas Airtel SIM hai",
        "👉 Times Prime Super Pass ke baare me batao"
      ]
    };
  }

  if (q.includes("k-drama") || q.includes("korean") || q.includes("drama")) {
    return {
      summary: "Top Korean Dramas (jaise Crash Landing on You, Squid Game, Queen of Tears, Vincenzo) exclusively Netflix par available hain! Kuch popular shows Rakuten Viki aur MX Player par bhi milte hain. Kya main aapke liye Netflix ke plans aur ₹0 savings tricks generate karoon?",
      whereToWatch: {
        platform: "Netflix (K-Drama Hub)",
        cheapestRoute: "₹149/month (Mobile) ya ₹499/month (Standard Full HD)"
      },
      isBlueprintUnlocked: false,
      savingSteps: [],
      clarifyingNote: "Netflix par 200+ Korean Dramas Hindi dubbed audio ke saath bhi available hain.",
      matchedPlatformIds: ["netflix"],
      followUps: [
        "👉 Haan, Netflix ka 4-level savings blueprint banao",
        "👉 Top 3 romantic K-Dramas suggest karo",
        "👉 TV par dekhne ke liye sasta plan batao"
      ]
    };
  }

  if (q.includes("business") || q.includes("startup") || q.includes("shark tank") || q.includes("scam")) {
    return {
      summary: "Business aur startup lovers ke liye 2 sabse tagdi series hain:\n1. Scam 1992 (Harshad Mehta) aur Shark Tank India — dono SonyLIV par hain.\n2. TVF Pitchers — ZEE5 par available hai.\nKya main aapko SonyLIV ke plans aur Times Prime कॉम्बो की strategy dikhaoon?",
      whereToWatch: {
        platform: "SonyLIV & ZEE5",
        cheapestRoute: "Times Prime Combo (₹1,199/yr me dono included)"
      },
      isBlueprintUnlocked: false,
      savingSteps: [],
      clarifyingNote: "Times Prime me SonyLIV Premium aur Disney+ Hotstar dono mil jate hain.",
      matchedPlatformIds: ["sonyliv", "zee5", "timesprime"],
      followUps: [
        "👉 Haan, SonyLIV ke plans aur savings blueprint banao",
        "👉 TVF Pitchers (ZEE5) ke plans batao",
        "👉 Kya dono Times Prime me milte hain?"
      ]
    };
  }

  return {
    summary: "Aapke entertainment ke liye hamare paas 25 verified Indian OTT platforms ready hain. Aap bataiye kya dekhna chahte hain: Cricket, Bollywood, K-Drama ya Business web series?",
    whereToWatch: {
      platform: "Multi-Platform Entertainment",
      cheapestRoute: "Times Prime Combo (₹1,199/yr)"
    },
    isBlueprintUnlocked: false,
    savingSteps: [],
    clarifyingNote: "Aap kisi bhi show ya movie ka naam bata sakte hain.",
    matchedPlatformIds: ["hotstar", "prime_video", "timesprime"],
    followUps: [
      "👉 Best K-Drama shows suggest karo",
      "👉 Business & Startup series suggest karo",
      "👉 Cricket & Live Sports TV pack batao"
    ]
  };
}
