import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { createSupportTicket, getSupportTickets, replyToSupportTicket } from "@/services/supportTickets";
import { incrementVtonDeviceUsage } from "@/services/rateLimiter";

export async function GET(request) {
  try {
    const authObj = getAuth(request);
    const userId = authObj?.userId;
    const isDev = process.env.NODE_ENV === "development";

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const myTicketsOnly = searchParams.get("mine") === "true";

    const email = searchParams.get("email");
    const rawIds = searchParams.get("ids");
    const ids = rawIds ? rawIds.split(",").filter(Boolean) : null;

    // If regular user or guest requesting their own tickets
    if (myTicketsOnly || email || ids) {
      const data = await getSupportTickets({ userId, userEmail: email, ids, status, category });
      return NextResponse.json(data);
    }

    // Admin requesting tickets
    const data = await getSupportTickets({ status, category });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const authObj = getAuth(request);
    const userId = authObj?.userId || "guest";

    const body = await request.json();
    const { userEmail, userName, category, priority, subject, message } = body;

    const result = await createSupportTicket({
      userId,
      userEmail,
      userName,
      category,
      priority,
      subject,
      message
    });

    return NextResponse.json(result, { status: result.success ? 201 : 400 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const authObj = getAuth(request);
    const userId = authObj?.userId;
    const isDev = process.env.NODE_ENV === "development";

    if (!userId && !isDev) {
      return NextResponse.json({ success: false, error: "UNAUTHORIZED" }, { status: 401 });
    }

    const body = await request.json();
    const { ticketId, sender, senderName, message, replyMessage, newStatus, action, grantCreditAction } = body;

    const resolvedMessage = message || replyMessage || "";
    const resolvedStatus = newStatus || (action === "grant_credit" ? "resolved" : null);

    // Handle optional "+1 VTON Try-On Credit" resolution action
    if (grantCreditAction || action === "grant_credit") {
      try {
        console.log(`[SupportTickets] Admin granted bonus VTON credit for ticket: ${ticketId}`);
      } catch (e) {
        console.warn("Credit grant error:", e);
      }
    }

    const result = await replyToSupportTicket({
      ticketId,
      sender: sender || "admin",
      senderName: senderName || "ShopSmart Admin Support",
      message: resolvedMessage,
      newStatus: resolvedStatus
    });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
