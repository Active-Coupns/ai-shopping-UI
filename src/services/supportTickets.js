import { redis } from "@/services/redis";

const TICKETS_KEY = "support:tickets:list";

/**
 * Create a new support ticket
 */
export async function createSupportTicket({
  userId = "guest",
  userEmail = "",
  userName = "Customer",
  category = "general", // billing | vton | coupons | technical | general
  priority = "normal",  // low | normal | high
  subject = "",
  message = ""
}) {
  try {
    const cleanSub = String(subject || "").trim().slice(0, 150);
    const cleanMsg = String(message || "").trim().slice(0, 1000);
    const cleanEmail = String(userEmail || "").trim().toLowerCase().slice(0, 100);

    if (!cleanSub || !cleanMsg) {
      return { success: false, error: "Subject and message are required" };
    }

    const ticketId = `tkt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const ticket = {
      id: ticketId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      userId,
      userEmail: cleanEmail,
      userName: String(userName || "Customer").slice(0, 60),
      category,
      priority: category === "billing" ? "high" : priority,
      status: "open", // open | in_progress | resolved
      subject: cleanSub,
      message: cleanMsg,
      replies: []
    };

    // Prepend to Redis tickets list
    await redis.lpush(TICKETS_KEY, JSON.stringify(ticket));

    return { success: true, ticket };
  } catch (err) {
    console.error("[SupportTickets] Creation error:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Fetch all tickets (for admin) or filtered by user
 */
export async function getSupportTickets({ userId = null, userEmail = null, ids = null, status = null, category = null, limit = 50 }) {
  try {
    const rawList = await redis.lrange(TICKETS_KEY, 0, limit - 1).catch(() => []);
    let tickets = (rawList || []).map(item => {
      try {
        return typeof item === "string" ? JSON.parse(item) : item;
      } catch {
        return null;
      }
    }).filter(Boolean);

    // If initial list is empty, populate 2 sample realistic tickets so the UI is immediately interactive
    if (tickets.length === 0) {
      const sample1 = {
        id: "tkt_sample_1",
        createdAt: Date.now() - 3600000 * 2,
        updatedAt: Date.now() - 3600000 * 2,
        userId: "user_sample_a",
        userEmail: "vikram.patel@gmail.com",
        userName: "Vikram Patel",
        category: "vton",
        priority: "high",
        status: "open",
        subject: "VTON Try-On timed out on cellular 5G",
        message: "Hi, I tried to test an orange hoodie on my photo but the render timed out after 30 seconds and my try-on count decreased. Could you please check and restore the credit?",
        replies: []
      };

      const sample2 = {
        id: "tkt_sample_2",
        createdAt: Date.now() - 3600000 * 5,
        updatedAt: Date.now() - 3600000 * 1,
        userId: "user_sample_b",
        userEmail: "ananya.singh@outlook.com",
        userName: "Ananya Singh",
        category: "coupons",
        priority: "normal",
        status: "in_progress",
        subject: "boAt coupon code question",
        message: "The BOATHEAD code gave me flat discount on Airdopes, but does it apply to smartwatches as well?",
        replies: [
          {
            sender: "admin",
            senderName: "ShopSmart Support",
            message: "Hello Ananya, the BOATHEAD code is valid for audio and wearables on orders above ₹999 on official boAt store.",
            timestamp: Date.now() - 3600000 * 1
          }
        ]
      };

      tickets = [sample1, sample2];
      await redis.lpush(TICKETS_KEY, JSON.stringify(sample2));
      await redis.lpush(TICKETS_KEY, JSON.stringify(sample1));
    }

    if (userId || userEmail || ids) {
      tickets = tickets.filter(t => {
        if (userId && (t.userId === userId || t.userEmail?.toLowerCase() === userId.toLowerCase())) return true;
        if (userEmail && t.userEmail && t.userEmail.toLowerCase() === String(userEmail).toLowerCase()) return true;
        if (Array.isArray(ids) && ids.includes(t.id)) return true;
        return false;
      });
    }

    if (status && status !== "all") {
      tickets = tickets.filter(t => t.status === status);
    }

    if (category && category !== "all") {
      tickets = tickets.filter(t => t.category === category);
    }

    return { success: true, count: tickets.length, tickets };
  } catch (err) {
    console.error("[SupportTickets] Fetch error:", err);
    return { success: false, count: 0, tickets: [] };
  }
}

/**
 * Reply to a ticket or update its status
 */
export async function replyToSupportTicket({
  ticketId,
  sender = "admin", // admin | user
  senderName = "ShopSmart Support",
  message = "",
  newStatus = null
}) {
  try {
    const rawList = await redis.lrange(TICKETS_KEY, 0, 100).catch(() => []);
    let targetIndex = -1;
    let targetTicket = null;

    for (let i = 0; i < rawList.length; i++) {
      try {
        const t = typeof rawList[i] === "string" ? JSON.parse(rawList[i]) : rawList[i];
        if (t.id === ticketId) {
          targetIndex = i;
          targetTicket = t;
          break;
        }
      } catch {}
    }

    if (!targetTicket || targetIndex === -1) {
      return { success: false, error: "Ticket not found" };
    }

    const reply = {
      sender,
      senderName: String(senderName || "Support").slice(0, 50),
      message: String(message || "").trim().slice(0, 1000),
      timestamp: Date.now()
    };

    if (message) {
      targetTicket.replies = Array.isArray(targetTicket.replies) ? targetTicket.replies : [];
      targetTicket.replies.push(reply);
    }

    if (newStatus) {
      targetTicket.status = newStatus;
    }

    targetTicket.updatedAt = Date.now();

    // Update in Redis with fallback
    try {
      if (typeof redis.lset === "function") {
        await redis.lset(TICKETS_KEY, targetIndex, JSON.stringify(targetTicket));
      } else {
        throw new Error("lset not available");
      }
    } catch (lsetErr) {
      // Fallback: replace list cleanly
      rawList[targetIndex] = JSON.stringify(targetTicket);
      await redis.del(TICKETS_KEY).catch(() => {});
      for (let j = rawList.length - 1; j >= 0; j--) {
        await redis.lpush(TICKETS_KEY, typeof rawList[j] === "string" ? rawList[j] : JSON.stringify(rawList[j])).catch(() => {});
      }
    }

    return { success: true, ticket: targetTicket };
  } catch (err) {
    console.error("[SupportTickets] Reply error:", err);
    return { success: false, error: err.message };
  }
}
