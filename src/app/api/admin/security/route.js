import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { 
  getSecurityIncidents, 
  releaseIpThrottle, 
  throttleIpManually, 
  banIp, 
  unbanIp, 
  clearSecurityVault, 
  recordSecurityIncident 
} from "@/services/securityRadar";

export async function GET(request) {
  try {
    const authObj = getAuth(request);
    const userId = authObj?.userId;
    const isDev = process.env.NODE_ENV === "development";

    if (!userId && !isDev) {
      return NextResponse.json({ success: false, error: "UNAUTHORIZED" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "40", 10);

    const data = await getSecurityIncidents(limit);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const authObj = getAuth(request);
    const userId = authObj?.userId;
    const isDev = process.env.NODE_ENV === "development";

    if (!userId && !isDev) {
      return NextResponse.json({ success: false, error: "UNAUTHORIZED" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { action, ip, reason, minutes, incidentData } = body;

    if (action === "release_throttle") {
      const ok = await releaseIpThrottle(ip);
      return NextResponse.json({ success: ok, message: `Slow-down released for IP: ${ip}. Full speed restored.` });
    }

    if (action === "throttle_ip") {
      const ok = await throttleIpManually(ip, minutes || 15);
      return NextResponse.json({ success: ok, message: `Silent slow-down applied to IP: ${ip} for ${minutes || 15} minutes.` });
    }

    if (action === "ban_ip") {
      const ok = await banIp(ip, reason || "Banned by administrator");
      return NextResponse.json({ success: ok, message: `IP ${ip} permanently blacklisted.` });
    }

    if (action === "unban_ip") {
      const ok = await unbanIp(ip);
      return NextResponse.json({ success: ok, message: `IP ${ip} removed from blacklist.` });
    }

    if (action === "simulate_incident") {
      const recorded = await recordSecurityIncident({
        ip: incidentData?.ip || "194.26.29.112",
        userId: incidentData?.userId || "anonymous",
        userEmail: incidentData?.userEmail || "guest",
        activityType: incidentData?.activityType || "RAPID_BURST_FLOOD",
        severity: incidentData?.severity || "critical",
        route: incidentData?.route || "/api/search",
        payload: incidentData?.payload || "Simulated 45 concurrent search scraping requests in 6 seconds",
        userAgent: incidentData?.userAgent || "curl/8.4.0",
        meta: { test: true }
      });
      return NextResponse.json({ success: true, incident: recorded });
    }

    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const authObj = getAuth(request);
    const userId = authObj?.userId;
    const isDev = process.env.NODE_ENV === "development";

    if (!userId && !isDev) {
      return NextResponse.json({ success: false, error: "UNAUTHORIZED" }, { status: 401 });
    }

    const cleared = await clearSecurityVault();
    return NextResponse.json({ success: cleared });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
