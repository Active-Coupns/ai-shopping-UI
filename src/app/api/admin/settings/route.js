import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { redis } from "@/services/redis";
import { getAdminSettings, saveAdminSettings, defaultSettings, normalizeSettings } from "@/services/admin";

const SETTINGS_REDIS_KEY = "config:admin:settings";

function getAdminAllowlist() {
  const raw = process.env.ADMIN_USER_IDS;
  if (!raw || typeof raw !== "string") return new Set();
  return new Set(
    raw
      .split(",")
      .map(id => id.trim())
      .filter(id => id.length > 0)
  );
}

function verifyAdminAuthorization(request) {
  let userId = null;
  try {
    const authObj = getAuth(request);
    userId = authObj?.userId || null;
  } catch (authErr) {
    console.warn("[Admin Settings] Authentication resolution error:", authErr.message);
    return {
      authorized: false,
      status: 401,
      payload: { error: "UNAUTHORIZED", message: "Valid authentication session required." }
    };
  }

  if (!userId) {
    return {
      authorized: false,
      status: 401,
      payload: { error: "UNAUTHORIZED", message: "Sign-in required to access admin settings." }
    };
  }

  const allowlist = getAdminAllowlist();
  if (allowlist.size === 0) {
    if (process.env.NODE_ENV === "development") {
      return { authorized: true, userId };
    }
    console.warn("[Admin Settings] Access denied: ADMIN_USER_IDS is unconfigured or empty (failing closed).");
    return {
      authorized: false,
      status: 403,
      payload: { error: "FORBIDDEN", message: "Admin authorization is unconfigured or disabled on this server." }
    };
  }

  if (!allowlist.has(userId)) {
    console.warn(`[Admin Settings] Forbidden: User ${userId} is not in ADMIN_USER_IDS allowlist.`);
    return {
      authorized: false,
      status: 403,
      payload: { error: "FORBIDDEN", message: "User is not authorized as an administrator." }
    };
  }

  return { authorized: true, userId };
}

export async function GET(request) {
  const authCheck = verifyAdminAuthorization(request);
  if (!authCheck.authorized) {
    return NextResponse.json(authCheck.payload, { status: authCheck.status });
  }

  try {
    const settings = await getAdminSettings();
    return NextResponse.json(settings);
  } catch (err) {
    console.warn("Failed reading admin settings:", err);
    return NextResponse.json(defaultSettings);
  }
}

export async function POST(request) {
  const authCheck = verifyAdminAuthorization(request);
  if (!authCheck.authorized) {
    return NextResponse.json(authCheck.payload, { status: authCheck.status });
  }

  try {
    const body = await request.json();
    const normalized = normalizeSettings(body);

    await redis.set(SETTINGS_REDIS_KEY, JSON.stringify(normalized));
    console.log("Successfully persisted updated Admin Settings to Redis:", SETTINGS_REDIS_KEY);

    return NextResponse.json({ data: normalized, error: null });
  } catch (err) {
    console.error("Failed saving admin settings to Redis:", err);
    return NextResponse.json({ error: "Failed to save admin settings" }, { status: 500 });
  }
}
