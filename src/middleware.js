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

const handler = clerkMiddleware(
  async (auth, req) => {
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
    const isSentinel = host.startsWith("sentinelx9.");

    // 1. Sentinelx9 Secret Subdomain Auto-Routing:
    // When accessing sentinelx9.benefisto.com at root '/', internally load '/admin'
    if (isSentinel && req.nextUrl.pathname === "/") {
      return NextResponse.rewrite(new URL("/admin", req.url));
    }

    // 2. Strict Subdomain Isolation Shield:
    // Block direct access to /admin on the public main domain (benefisto.com/admin)
    // Return 404 so unauthorized public visitors cannot even discover the admin panel
    if (req.nextUrl.pathname.startsWith("/admin") && !isSentinel) {
      return NextResponse.rewrite(new URL("/404", req.url));
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
