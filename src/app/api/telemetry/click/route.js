import { NextResponse } from "next/server";
import { redis } from "@/services/redis";

export async function GET() {
  try {
    const clicks = await redis.get("telemetry:affiliate_clicks") || 0;
    return NextResponse.json({ clicks: parseInt(clicks) || 0 });
  } catch (err) {
    return NextResponse.json({ clicks: 0, error: err.message });
  }
}

export async function POST() {
  try {
    const clicks = await redis.incr("telemetry:affiliate_clicks");
    return NextResponse.json({ clicks });
  } catch (err) {
    return NextResponse.json({ clicks: 0, error: err.message });
  }
}
