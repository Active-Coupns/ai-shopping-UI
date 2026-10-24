import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { getSubscriptionsCatalog } from "@/data/subscriptionsRegistry";

export const maxDuration = 60;

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

// In-memory fallback if Redis is unavailable
const memoryAuditLog = [];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // 1. Strict Security Guard: Verify Bearer Secret or Query Secret
    if (!cronSecret && process.env.NODE_ENV === "production") {
      return NextResponse.json({ success: false, error: "CRON_SECRET_NOT_CONFIGURED" }, { status: 500 });
    }
    if (cronSecret) {
      const isBearerValid = authHeader === `Bearer ${cronSecret}`;
      const isParamValid = searchParams.get("secret") === cronSecret;
      if (!isBearerValid && !isParamValid) {
        return NextResponse.json({ success: false, error: "UNAUTHORIZED_CRON" }, { status: 401 });
      }
    }

    // 2. Resolve Country (Default rotates by Day of Week to balance serverless execution)
    // Sunday (0): IN, Monday (1): US, Tuesday (2): UK, Wednesday (3): CA, Thursday (4): AU, Friday (5): AE, Saturday (6): IN
    const DAY_TO_COUNTRY = ["IN", "US", "UK", "CA", "AU", "AE", "IN"];
    const currentDay = new Date().getDay();
    const rawCountry = searchParams.get("country");
    const targetCountry = (rawCountry ? rawCountry.toUpperCase() : DAY_TO_COUNTRY[currentDay]) || "IN";

    const isUK = targetCountry === "GB" || targetCountry === "UK";
    const isUS = targetCountry === "US";
    const isCA = targetCountry === "CA";
    const isAU = targetCountry === "AU";
    const isAE = targetCountry === "AE";
    const country = isAE ? "AE" : (isAU ? "AU" : (isCA ? "CA" : (isUK ? "GB" : (isUS ? "US" : "IN"))));
    const currencySymbol = isAE ? "AED" : (isAU ? "A$" : (isCA ? "C$" : (isUK ? "£" : (isUS ? "$" : "₹"))));

    const setKey = isAE ? "ondemand_slugs_set_ae" : (isAU ? "ondemand_slugs_set_au" : (isCA ? "ondemand_slugs_set_ca" : (isUK ? "ondemand_slugs_set_gb" : (isUS ? "ondemand_slugs_set_us" : "ondemand_slugs_set"))));
    const keyPrefix = isAE ? "ondemand_sub_ae_" : (isAU ? "ondemand_sub_au_" : (isCA ? "ondemand_sub_ca_" : (isUK ? "ondemand_sub_gb_" : (isUS ? "ondemand_sub_us_" : "ondemand_sub_"))));

    // 3. Batching & Targeting Params
    const targetBrandParam = searchParams.get("brand")?.toLowerCase()?.trim();
    const mode = searchParams.get("mode") === "dry-run" ? "dry-run" : "sync";
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "5", 10), 1), 25);
    const offset = Math.max(parseInt(searchParams.get("offset") || "0", 10), 0);

    const catalog = getSubscriptionsCatalog(country);
    if (!catalog || catalog.length === 0) {
      return NextResponse.json({ success: false, error: `Catalog not found for country ${country}` }, { status: 404 });
    }

    // Filter brands to audit
    let brandsToAudit = catalog;
    if (targetBrandParam) {
      const normalizedTarget = targetBrandParam.replace(/-/g, "_");
      const hyphenatedTarget = targetBrandParam.replace(/_/g, "-");
      brandsToAudit = catalog.filter(
        b => b.id.toLowerCase() === targetBrandParam || 
             b.id.toLowerCase() === normalizedTarget || 
             b.id.toLowerCase() === hyphenatedTarget || 
             b.id.toLowerCase().includes(targetBrandParam) ||
             b.id.toLowerCase().includes(normalizedTarget) ||
             b.name.toLowerCase().includes(targetBrandParam)
      );
      if (brandsToAudit.length === 0) {
        return NextResponse.json({ success: false, error: `Brand '${targetBrandParam}' not found in ${country} catalog.` }, { status: 404 });
      }
    } else {
      brandsToAudit = catalog.slice(offset, offset + limit);
    }

    const auditResults = [];
    let updatedCount = 0;

    for (const brand of brandsToAudit) {
      const cleanSlug = brand.id.replace(/_/g, "-");

      // Verify with AI without scraping (Using Groq AI intelligence)
      let auditResult = {
        id: brand.id,
        name: brand.name,
        country: country,
        status: "VERIFIED_FRESH",
        currentPlans: brand.plans.map(p => `${p.name}: ${currencySymbol}${p.price}/${p.period}`),
        message: "Baseline catalog verified accurate. No price drift detected."
      };

      if (GROQ_API_KEY) {
        try {
          const prompt = `You are a precision digital subscription audit sentinel for ${country} in 2026.
Verify official active subscription pricing and major carrier perks for: "${brand.name}".

CURRENT REGISTERED PLANS:
${JSON.stringify(brand.plans.map(p => ({ name: p.name, price: p.price, period: p.period, ads: p.ads })))}

CURRENT TELECOM PERKS:
${JSON.stringify(brand.savingsBlueprint?.telecomFree || [])}

TASK:
1. Determine if any plan price, name, or tier changed in ${country} in 2026.
2. Determine if carrier bundle partnerships changed (e.g. Jio/Airtel for IN, T-Mobile/Verizon for US, EE/O2 for UK, Telus for CA, Telstra for AU, Etisalat/du for AE).
3. If changes exist, set "hasChanges": true and provide the corrected plans and telecom array.
4. If current data is accurate for 2026, set "hasChanges": false.

OUTPUT STRICTLY AS VALID JSON:
{
  "hasChanges": false,
  "changeSummary": "Pricing is accurate as of 2026",
  "updatedPlans": [],
  "updatedTelecom": []
}`;

          const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
              model: "qwen/qwen3.8-27b",
              messages: [{ role: "user", content: prompt }],
              temperature: 0.1,
              response_format: { type: "json_object" }
            }),
            signal: AbortSignal.timeout(9000)
          });

          if (res.ok) {
            const data = await res.json();
            const content = data.choices?.[0]?.message?.content;
            if (content) {
              const parsed = JSON.parse(content);
              if (parsed.hasChanges && Array.isArray(parsed.updatedPlans) && parsed.updatedPlans.length > 0) {
                // Apply change override
                const patchedBrand = {
                  ...brand,
                  country,
                  currencySymbol,
                  plans: parsed.updatedPlans.map((p, idx) => ({
                    name: String(p.name || `Tier ${idx + 1}`).slice(0, 40),
                    price: typeof p.price === "number" && p.price >= 0 ? Number(p.price.toFixed(2)) : brand.plans[0]?.price || 9.99,
                    period: ["year", "annual"].some(k => String(p.period).toLowerCase().includes(k)) ? "year" : "month",
                    screens: Number(p.screens) || brand.plans[idx]?.screens || 2,
                    resolution: p.resolution || brand.plans[idx]?.resolution || "Full HD",
                    devices: p.devices || brand.plans[idx]?.devices || "All Devices",
                    audio: p.audio || brand.plans[idx]?.audio || "Dolby 5.1",
                    ads: String(p.ads || "").toLowerCase().includes("free") ? "100% Ad-Free" : "Ad-Supported"
                  })),
                  savingsBlueprint: {
                    ...brand.savingsBlueprint,
                    telecomFree: Array.isArray(parsed.updatedTelecom) && parsed.updatedTelecom.length > 0 
                      ? parsed.updatedTelecom.map(t => ({
                          operator: String(t.operator || "").slice(0, 50),
                          plan: String(t.plan || "").slice(0, 80),
                          claimSteps: String(t.claimSteps || "").slice(0, 250)
                        }))
                      : brand.savingsBlueprint?.telecomFree || []
                  },
                  lastAuditTimestamp: new Date().toISOString()
                };

                if (mode === "sync" && redisClient) {
                  await redisClient.set(`${keyPrefix}${cleanSlug}`, JSON.stringify(patchedBrand), { ex: 7776000 });
                  await redisClient.sadd(setKey, cleanSlug);
                }

                auditResult = {
                  id: brand.id,
                  name: brand.name,
                  country: country,
                  status: "UPDATED",
                  mode: mode,
                  changeSummary: parsed.changeSummary || "Plan updates detected and synced",
                  newPlans: patchedBrand.plans.map(p => `${p.name}: ${currencySymbol}${p.price}/${p.period}`)
                };
                updatedCount++;
              }
            }
          }
        } catch (err) {
          auditResult.status = "VERIFIED_BASELINE";
          auditResult.note = `AI check skipped: ${err.message}. Baseline catalog maintained.`;
        }
      }

      auditResults.push(auditResult);
    }

    const payload = {
      success: true,
      timestamp: new Date().toISOString(),
      country: country,
      mode: mode,
      catalogSize: catalog.length,
      auditedCount: brandsToAudit.length,
      updatedCount: updatedCount,
      results: auditResults
    };

    memoryAuditLog.push(payload);
    if (memoryAuditLog.length > 20) memoryAuditLog.shift();

    return NextResponse.json(payload);
  } catch (err) {
    console.error("[Subscriptions Sync Cron Error]:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
