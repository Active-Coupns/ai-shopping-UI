import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/robots.txt",
  "/sitemap.xml",
  "/subscriptions(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/reset-password(.*)",
  "/admin(.*)",
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
  "/api/subscriptions(.*)",
  "/api/trust-sheet(.*)"
]);

const handler = clerkMiddleware(
  async (auth, req) => {
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
