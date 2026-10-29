import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    // 1. Inspect platform-provided geographic headers
    const headers = request.headers;
    const headerCountry = 
      headers.get("x-vercel-ip-country") ||
      headers.get("cf-ipcountry") ||
      headers.get("x-country-code") ||
      headers.get("x-geo-country");

    if (headerCountry && headerCountry.length === 2) {
      return NextResponse.json({
        success: true,
        country: headerCountry.toUpperCase(),
        source: "geo-header"
      });
    }

    // 2. Identify client IP
    const forwardedFor = headers.get("x-forwarded-for");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : headers.get("x-real-ip");

    // Check if IP is localhost/private
    const isLocal = !clientIp || 
      clientIp === "::1" || 
      clientIp === "127.0.0.1" || 
      clientIp.startsWith("192.168.") || 
      clientIp.startsWith("10.") ||
      clientIp.startsWith("172.");

    if (isLocal) {
      return NextResponse.json({
        success: true,
        country: "IN", // Default development environment to India
        isLocal: true,
        source: "local-dev"
      });
    }

    return NextResponse.json({
      success: true,
      country: "IN",
      source: "fallback"
    });
  } catch (error) {
    return NextResponse.json({
      success: true,
      country: "IN",
      error: error.message
    });
  }
}
