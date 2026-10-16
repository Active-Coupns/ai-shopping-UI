import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { getRecentCrashes, clearCrashes, recordCrashException } from "@/services/crashVault";

export async function GET(request) {
  try {
    const authObj = getAuth(request);
    const userId = authObj?.userId;
    const isDev = process.env.NODE_ENV === "development";

    if (!userId && !isDev) {
      return NextResponse.json({ success: false, error: "UNAUTHORIZED" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "30", 10);

    const data = await getRecentCrashes(limit);
    return NextResponse.json({ success: true, ...data });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const recorded = await recordCrashException({
      error: body.error ? new Error(body.error) : new Error(body.message || "Simulated test crash"),
      message: body.message || "Runtime exception",
      component: body.component || "client/api",
      route: body.route || "/test",
      severity: body.severity || "error",
      meta: body.meta || {}
    });
    return NextResponse.json({ success: true, crash: recorded });
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

    const cleared = await clearCrashes();
    return NextResponse.json({ success: cleared });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
