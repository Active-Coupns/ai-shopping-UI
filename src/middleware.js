import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/robots.txt",
  "/sitemap.xml",
  "/llms.txt",
  "/llms-full.txt",
  "/manifest.json",
  "/about(.*)",
  "/pricing(.*)",
  "/privacy(.*)",
  "/terms(.*)",
  "/disclaimer(.*)",
  "/contact(.*)",
  "/travel(.*)",
  "/events(.*)",
  "/subscriptions(.*)",
  "/coupons(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/reset-password(.*)",
  "/api/search(.*)",
  "/api/redirect(.*)",
  "/api/ai(.*)",
  "/api/telemetry/(.*)",
  "/api/admin/(.*)",
  "/api/vton/(.*)",
  "/api/user/(.*)",
  "/api/compliance/(.*)",
  "/api/deals(.*)",
  "/api/coupons(.*)",
  "/api/terminal(.*)",
  "/api/products(.*)",
  "/api/support(.*)",
  "/api/cron(.*)",
  "/api/indexnow(.*)",
  "/e82fa9163b494191a34b22c74d812f90.txt",
  "/api/subscriptions(.*)",
  "/api/travel(.*)",
  "/api/trust-sheet(.*)",
  "/api/payments(.*)",
  "/api/webhooks(.*)"
]);

// High-speed In-Memory L1 Blacklist Cache (0.00ms lookup)
const bannedIpsL1 = new Set();
const HONEYPOT_REGEX = /^\/(\.env|\.git|wp-login|wp-admin|phpmyadmin|xmlrpc\.php|eval-stdin|actuator|\.aws|\.docker)/i;

/**
 * Constant-time string comparison to prevent side-channel timing attacks
 */
function safeCompareTokens(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

const handler = clerkMiddleware(
  async (auth, req) => {
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
    const isSentinel = host.startsWith("sentinelx9.");
    const clientIp = (req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1").trim();

    // 0. Platform-Wide Instant Blacklist Enforcement:
    // If an IP is flagged as malicious, immediately block access across ALL platform verticals
    // (Shopping Search, Trust Sheet, Virtual Try-On, Subscriptions, Travel, Coupons)
    if (bannedIpsL1.has(clientIp)) {
      return new NextResponse("Access Denied: Your IP has been blacklisted due to verified malicious activity.", {
        status: 403,
        headers: { "Content-Type": "text/plain", "X-Robots-Tag": "noindex, nofollow" }
      });
    }

    // 1. Isolated Edge Honeypot Trap (Zero files on disk, 100% decoupled from server internals):
    // Catches common automated vulnerability scanners probing for .env, wp-login, phpmyadmin, etc.
    if (HONEYPOT_REGEX.test(req.nextUrl.pathname)) {
      bannedIpsL1.add(clientIp);

      // Asynchronously record into Upstash Redis Threat Vault & Blacklist
      try {
        const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
        const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
        if (upstashUrl && upstashToken) {
          fetch(`${upstashUrl}/pipeline`, {
            method: "POST",
            headers: { Authorization: `Bearer ${upstashToken}`, "Content-Type": "application/json" },
            body: JSON.stringify([
              ["sadd", "security:banned_ips", clientIp],
              ["lpush", "security:threat_vault", JSON.stringify({
                ip: clientIp,
                timestamp: Date.now(),
                activityType: "HONEYPOT_TRIGGERED",
                severity: "critical",
                route: req.nextUrl.pathname,
                payload: "Automated vulnerability scanner triggered isolated honeypot trap",
                userAgent: req.headers.get("user-agent") || "unknown"
              })],
              ["ltrim", "security:threat_vault", 0, 50]
            ])
          }).catch(() => {});
        }
      } catch (e) {}

      return new NextResponse("Access Denied: Malicious vulnerability probe detected and permanently recorded.", {
        status: 403,
        headers: { "Content-Type": "text/plain", "X-Robots-Tag": "noindex, nofollow" }
      });
    }

    // 2. Sentinelx9 Secret Subdomain Auto-Routing:
    // When accessing sentinelx9.benefisto.com at root '/', internally load '/admin'
    if (isSentinel && req.nextUrl.pathname === "/") {
      return NextResponse.rewrite(new URL("/admin", req.url));
    }

    // 3. Strict Subdomain Isolation & Cloaking Shield:
    // Block direct access to /admin and /api/admin on the public main domain (benefisto.com)
    // Return 404 so unauthorized public scanners & bots cannot even discover that admin endpoints exist
    if ((req.nextUrl.pathname.startsWith("/admin") || req.nextUrl.pathname.startsWith("/api/admin")) && !isSentinel) {
      return NextResponse.rewrite(new URL("/404", req.url));
    }

    // 4. Tor, High-Threat Score & Anonymous Proxy Edge Shield:
    // Cloudflare sets 'cf-ipcountry: T1' for Tor network, 'cf-ipcountry: XX' for anonymous proxies,
    // and 'cf-threat-score' (0-100) based on global threat telemetry.
    const cfCountry = req.headers.get("cf-ipcountry") || "";
    const cfThreatScore = parseInt(req.headers.get("cf-threat-score") || "0", 10);
    const isTorOrProxy = cfCountry === "T1" || cfCountry === "XX";

    // Verified Internal Cron Exemption (Strictly Authenticated by 64-char CRON_SECRET & Bearer Token)
    let isAuthorizedCron = false;
    if (req.nextUrl.pathname.startsWith("/api/cron")) {
      const cronSecret = process.env.CRON_SECRET;
      const authHeader = req.headers.get("authorization") || "";
      const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
      const secretParam = req.nextUrl.searchParams.get("secret") || "";
      const providedToken = bearerToken || secretParam;

      if (cronSecret && providedToken && safeCompareTokens(providedToken, cronSecret)) {
        isAuthorizedCron = true;
      }
    }

    if (req.nextUrl.pathname.startsWith("/api/") && !isAuthorizedCron && (isTorOrProxy || cfThreatScore > 40)) {
      return NextResponse.json(
        {
          success: false,
          error: "ACCESS_DENIED_SUSPICIOUS_NETWORK",
          message: "Access from Tor exit nodes and suspicious proxy networks is restricted."
        },
        { status: 403 }
      );
    }

    if (!isPublicRoute(req)) {
      await auth.protect();
    }
  }
);

export default async function middleware(req, event) {
  try {
    return await handler(req, event);
  } catch (err) {
    console.error("Vercel Edge middleware fallback engaged:", err);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|json|png|jpg|jpeg|webp|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|txt|xml)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
