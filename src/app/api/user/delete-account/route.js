import { NextResponse } from "next/server";
import { getAuth, clerkClient } from "@clerk/nextjs/server";
import { purgeUserComplianceData } from "@/services/compliance";

export async function POST(request) {
  try {
    const authObj = getAuth(request);
    const userId = authObj?.userId;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "UNAUTHORIZED", message: "Sign-in required to delete account." },
        { status: 401 }
      );
    }

    // 1. Purge personal and compliance data from Redis
    await purgeUserComplianceData(userId);

    // 2. Permanently delete user from Clerk Auth Directory
    try {
      const client = await (typeof clerkClient === "function" ? clerkClient() : clerkClient);
      await client.users.deleteUser(userId);
    } catch (clerkErr) {
      console.error("[Account Deletion] Auth directory deletion error:", clerkErr);
      return NextResponse.json(
        { success: false, error: "AUTH_SERVICE_ERROR", message: "Could not remove user from identity directory. Please contact support." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Your account and all associated personal data have been permanently erased."
    }, { status: 200 });

  } catch (err) {
    console.error("[Account Deletion] Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "SERVER_ERROR", message: "An unexpected error occurred during account deletion." },
      { status: 500 }
    );
  }
}
