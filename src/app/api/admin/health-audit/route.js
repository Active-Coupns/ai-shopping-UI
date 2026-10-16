import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { runSystemHealthAudit } from "@/services/aiHealthAuditor";

export async function GET(request) {
  try {
    const authObj = getAuth(request);
    const userId = authObj?.userId;
    const isDev = process.env.NODE_ENV === "development";

    if (!userId && !isDev) {
      return NextResponse.json({ success: false, error: "UNAUTHORIZED" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const force = searchParams.get("force") === "true";

    const report = await runSystemHealthAudit(force);
    return NextResponse.json({ success: true, report });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
