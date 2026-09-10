import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Polyfill process.env for Clerk in Edge environment if missing
if (typeof process !== "undefined" && process.env) {
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY =
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    "pk_test_ZWxlY3RyaWMtY3ViLTQ5NDQuY2xlcmsuYWNjb3VudHMuZGV2JA";
  process.env.CLERK_SECRET_KEY =
    process.env.CLERK_SECRET_KEY ||
    "sk_test_wMH1KcNxkOWdhyo2ndsO64JXQKoBoEmKceKyp5eyFn";
}

const publishableKey =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  "pk_test_ZWxlY3RyaWMtY3ViLTQ5NDQuY2xlcmsuYWNjb3VudHMuZGV2JA";
const secretKey =
  process.env.CLERK_SECRET_KEY ||
  "sk_test_wMH1KcNxkOWdhyo2ndsO64JXQKoBoEmKceKyp5eyFn";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/reset-password(.*)",
  "/api/search(.*)",
  "/api/redirect(.*)",
  "/api/telemetry/(.*)"
]);

const handler = clerkMiddleware(
  async (auth, req) => {
    if (!isPublicRoute(req)) {
      await auth.protect();
    }
  },
  {
    publishableKey,
    secretKey,
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
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|json|png|jpg|jpeg|webp|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
