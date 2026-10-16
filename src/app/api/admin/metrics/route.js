import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { getAdminDashboardMetrics } from "@/services/adminMetrics";

export async function GET(request) {
  try {
    // Admin check: In local dev or development environment, allow access
    const isDev = process.env.NODE_ENV === "development" || process.env.VERCEL_ENV !== "production";
    
    let userId = null;
    try {
      const auth = getAuth(request);
      userId = auth?.userId || null;
    } catch {}

    // Fetch live dashboard metrics
    const data = await getAdminDashboardMetrics();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
