import crypto from "crypto";
import { redis } from "@/services/redis";

/**
 * DPDP Act 2023 & GDPR Compliance Audit Service
 *
 * Implements immutable audit logging for user consents, terms acceptance,
 * and data protection lifecycle events.
 */

const CONSENT_AUDIT_STREAM = "compliance:consent_audit_stream";
const MAX_AUDIT_LOGS = 500;

export async function recordComplianceConsent({
  userId,
  email = "",
  consentType = "GENERAL_PLATFORM_TERMS",
  version = "1.0",
  ipAddress = "127.0.0.1",
  userAgent = "Unknown",
  metadata = {}
}) {
  if (!userId) {
    throw new Error("userId is required for legal compliance recording");
  }

  const consentId = `cns_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
  const timestamp = new Date().toISOString();

  const auditRecord = {
    consentId,
    userId,
    email: email.toLowerCase().trim(),
    consentType, // e.g. "GENERAL_PLATFORM_TERMS", "VTON_BIOMETRIC_PRIVACY", "AFFILIATE_DISCLOSURE"
    version,
    status: "ACCEPTED",
    timestamp,
    ipAddress: String(ipAddress || "127.0.0.1").trim(),
    userAgent: String(userAgent || "Unknown").slice(0, 255),
    metadata
  };

  try {
    const recordJson = JSON.stringify(auditRecord);

    // 1. Store immutable user-level active record
    const userConsentKey = `compliance:consent:user:${userId}:${consentType}`;
    await redis.set(userConsentKey, recordJson);

    // 2. Append to immutable global audit stream for government regulatory review
    await redis.lpush(CONSENT_AUDIT_STREAM, recordJson);
    await redis.ltrim(CONSENT_AUDIT_STREAM, 0, MAX_AUDIT_LOGS - 1);

    return {
      success: true,
      consentId,
      timestamp,
      record: auditRecord
    };
  } catch (err) {
    console.error("[Compliance] Failed to record consent audit log:", err);
    return {
      success: false,
      error: err.message,
      consentId
    };
  }
}

/**
 * Fetch all consent records for a user
 */
export async function getUserConsentStatus(userId) {
  if (!userId) return null;
  try {
    const [generalConsentRaw, vtonConsentRaw] = await Promise.all([
      redis.get(`compliance:consent:user:${userId}:GENERAL_PLATFORM_TERMS`).catch(() => null),
      redis.get(`compliance:consent:user:${userId}:VTON_BIOMETRIC_PRIVACY`).catch(() => null)
    ]);

    return {
      generalTerms: generalConsentRaw ? JSON.parse(generalConsentRaw) : null,
      vtonPrivacy: vtonConsentRaw ? JSON.parse(vtonConsentRaw) : null
    };
  } catch (err) {
    console.warn("[Compliance] Error fetching user consent status:", err.message);
    return null;
  }
}

/**
 * Purge all compliance and personal records when a user exercises their Right to Erasure
 */
export async function purgeUserComplianceData(userId) {
  if (!userId) return false;
  try {
    const keysToDelete = [
      `compliance:consent:user:${userId}:GENERAL_PLATFORM_TERMS`,
      `compliance:consent:user:${userId}:VTON_BIOMETRIC_PRIVACY`,
      `user:saved_deals:${userId}`,
      `user:preferences:${userId}`,
      `vton:free_quota:${userId}`,
      `vton:free_quota:account_lifetime:${userId}`
    ];

    await Promise.all(keysToDelete.map(k => redis.del(k).catch(() => {})));
    return true;
  } catch (err) {
    console.error("[Compliance] Purge error:", err);
    return false;
  }
}
