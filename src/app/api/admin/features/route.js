import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { getFeatureFlags, updateFeatureFlags, defaultFeatureFlags } from "@/services/featureFlags";

export { getFeatureFlags, defaultFeatureFlags };

export const dynamic = "force-dynamic";

export async function GET() {
  const flags = await getFeatureFlags();
  return NextResponse.json(
    { success: true, features: flags },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    }
  );
}

export async function POST(request) {
  try {
    const authObj = getAuth(request);
    const userId = authObj?.userId;
    const isDev = process.env.NODE_ENV === "development";

    if (!userId && !isDev) {
      return NextResponse.json({ success: false, error: "UNAUTHORIZED" }, { status: 401 });
    }

    const body = await request.json();
    const updates = body.features || body;
    const updated = await updateFeatureFlags(updates);

    return NextResponse.json({ success: true, features: updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
