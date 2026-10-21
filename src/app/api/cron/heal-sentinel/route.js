import { NextResponse } from "next/server";
import { runSentinelDiagnosticProbe } from "@/services/autoHealingSentinel";
import { validateCountryCode } from "@/lib/countryConfig";

export const maxDuration = 60;

const ALLOWED_CLUSTERS = new Set(["apac", "emea", "americas"]);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // Strict Authorization Check: If CRON_SECRET is set, require valid bearer or secret param
    if (cronSecret) {
      const isBearerValid = authHeader === `Bearer ${cronSecret}`;
      const isParamValid = searchParams.get("secret") === cronSecret;
      if (!isBearerValid && !isParamValid) {
        return NextResponse.json({ success: false, error: "UNAUTHORIZED_CRON" }, { status: 401 });
      }
    }

    const rawCountry = searchParams.get("country");
    const rawCluster = searchParams.get("cluster");

    const country = rawCountry ? validateCountryCode(rawCountry) : null;
    const cluster = (rawCluster && ALLOWED_CLUSTERS.has(rawCluster.toLowerCase())) ? rawCluster.toLowerCase() : null;

    const audit = await runSentinelDiagnosticProbe({
      targetCountry: country,
      targetCluster: cluster,
      isManualTrigger: false
    });

    return NextResponse.json({ 
      success: true, 
      target: country || cluster || "all",
      status: audit.status,
      audit 
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
