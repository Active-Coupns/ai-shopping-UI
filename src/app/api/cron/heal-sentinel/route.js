import { NextResponse } from "next/server";
import { runSentinelDiagnosticProbe } from "@/services/autoHealingSentinel";

export const maxDuration = 60;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // Optional bearer secret check if configured in Vercel
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      const secretParam = searchParams.get("secret");
      if (secretParam !== cronSecret) {
        return NextResponse.json({ success: false, error: "UNAUTHORIZED_CRON" }, { status: 401 });
      }
    }

    const audit = await runSentinelDiagnosticProbe(false);
    return NextResponse.json({ success: true, audit });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
