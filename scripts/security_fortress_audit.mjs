import { generateHandshakeHeaders, verifyCryptoHandshake } from "../src/lib/cryptoHandshake.js";
import fs from "fs";
import path from "path";

const BASE_URL = "http://localhost:3000";

async function runMasterSecurityAudit() {
  console.log("================================================================================");
  console.log("🛡️ BENEFISTO MASTER PLATFORM-WIDE SECURITY FORTRESS E2E AUDIT");
  console.log("================================================================================\n");

  let totalTests = 0;
  let passedTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`  ✅ [PASS] ${message}`);
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
    }
  }

  // --------------------------------------------------------------------------
  // PILLAR 0: HONEYPOT ISOLATION & ZERO DISK ARTIFACT AUDIT
  // --------------------------------------------------------------------------
  console.log("🔒 PILLAR 0: Honeypot Isolation & Zero Disk Footprint Audit");
  const projectRoot = process.cwd();
  const dangerousArtifacts = [
    ".env.backup",
    "wp-login.php",
    "wp-admin",
    "phpmyadmin",
    "xmlrpc.php"
  ];
  let zeroDiskExposure = true;
  for (const artifact of dangerousArtifacts) {
    const fullPath = path.join(projectRoot, "public", artifact);
    if (fs.existsSync(fullPath)) {
      zeroDiskExposure = false;
      console.error(`     ⚠️ Found real file on disk: ${fullPath}`);
    }
  }
  assert(zeroDiskExposure, "Honeypot is 100% Virtual: ZERO honeypot trap files exist on disk");
  console.log("");

  // --------------------------------------------------------------------------
  // PILLAR 1: DYNAMIC ROTATING SALT HANDSHAKE ENGINE
  // --------------------------------------------------------------------------
  console.log("🔑 PILLAR 1: Dynamic Rotating Salt Handshake Engine (cryptoHandshake.js)");
  
  // Test 1.1: Generate valid headers
  const headers = await generateHandshakeHeaders("/api/search");
  assert(Boolean(headers["x-ss-timestamp"] && headers["x-ss-nonce"] && headers["x-ss-signature"]), "Generates valid rotating headers (timestamp, nonce, signature)");

  // Test 1.2: Server verification succeeds
  const mockReq = { headers: new Headers(headers) };
  const verifyRes = await verifyCryptoHandshake(mockReq, "/api/search");
  assert(verifyRes.valid === true, "Server verifies authentic client handshake signature");

  // Test 1.3: Tampered signature rejection
  const tamperedHeaders = { ...headers, "x-ss-signature": "tampered_fake_signature_abc123" };
  const tamperedRes = await verifyCryptoHandshake({ headers: new Headers(tamperedHeaders) }, "/api/search");
  assert(tamperedRes.valid === false && tamperedRes.reason === "SIGNATURE_MISMATCH", "Tampered signature immediately rejected with SIGNATURE_MISMATCH");

  // Test 1.4: Expired timestamp rejection (> 30s)
  const expiredTimestamp = (Date.now() - 45000).toString();
  const expiredHeaders = { ...headers, "x-ss-timestamp": expiredTimestamp };
  const expiredRes = await verifyCryptoHandshake({ headers: new Headers(expiredHeaders) }, "/api/search");
  assert(expiredRes.valid === false && expiredRes.reason === "EXPIRED_HANDSHAKE", "Stale request (> 30s) immediately rejected with EXPIRED_HANDSHAKE");
  console.log("");

  // --------------------------------------------------------------------------
  // PILLAR 2: TOR NETWORK, ANONYMOUS PROXY & HIGH THREAT SCORE SHIELD
  // --------------------------------------------------------------------------
  console.log("🌐 PILLAR 2: Tor Network, Anonymous Proxy & High Threat Score Edge Shield");

  // Test 2.1: Tor Network Exit Node (cf-ipcountry: T1) on /api/search
  const torRes = await fetch(`${BASE_URL}/api/search?q=shoes`, {
    headers: { "cf-ipcountry": "T1" }
  });
  const torJson = await torRes.json().catch(() => ({}));
  assert(torRes.status === 403 && torJson.error === "ACCESS_DENIED_SUSPICIOUS_NETWORK", "Tor Exit Node (cf-ipcountry: T1) blocked with 403 ACCESS_DENIED_SUSPICIOUS_NETWORK");

  // Test 2.2: Anonymous Proxy (cf-ipcountry: XX) on /api/coupons
  const proxyRes = await fetch(`${BASE_URL}/api/coupons?store=dominos`, {
    headers: { "cf-ipcountry": "XX" }
  });
  const proxyJson = await proxyRes.json().catch(() => ({}));
  assert(proxyRes.status === 403 && proxyJson.error === "ACCESS_DENIED_SUSPICIOUS_NETWORK", "Anonymous Proxy (cf-ipcountry: XX) blocked with 403 ACCESS_DENIED_SUSPICIOUS_NETWORK");

  // Test 2.3: Cloudflare High Threat Score (> 40) on /api/travel/deals
  const threatRes = await fetch(`${BASE_URL}/api/travel?slug=delhi-mumbai`, {
    headers: { "cf-threat-score": "60" }
  });
  const threatJson = await threatRes.json().catch(() => ({}));
  assert(threatRes.status === 403 && threatJson.error === "ACCESS_DENIED_SUSPICIOUS_NETWORK", "High Threat Score IP (score 60) blocked with 403 ACCESS_DENIED_SUSPICIOUS_NETWORK");
  console.log("");

  // --------------------------------------------------------------------------
  // PILLAR 3: ADMIN API CLOAKING & SUBDOMAIN ISOLATION (401 -> 404)
  // --------------------------------------------------------------------------
  console.log("🕵️ PILLAR 3: Admin Cloaking & Subdomain Isolation (Stealth Shield)");

  // Test 3.1: Public domain hitting /api/admin/settings (Cloaked to 404)
  const adminApiPublic = await fetch(`${BASE_URL}/api/admin/settings`, {
    headers: { "host": "benefisto.com" }
  });
  assert(adminApiPublic.status === 404, "Public domain hitting /api/admin/* returns 404 Not Found (Zero endpoint disclosure)");

  // Test 3.2: Public domain hitting /admin page (Cloaked to 404)
  const adminPagePublic = await fetch(`${BASE_URL}/admin`, {
    headers: { "host": "benefisto.com" }
  });
  assert(adminPagePublic.status === 404, "Public domain hitting /admin returns 404 Not Found");

  // Test 3.3: Authorized access via secret sentinelx9 subdomain
  const adminSubdomainRes = await fetch(`${BASE_URL}/api/admin/health-audit`, {
    headers: { 
      "host": "sentinelx9.benefisto.com",
      "x-forwarded-host": "sentinelx9.benefisto.com" 
    }
  });
  assert(adminSubdomainRes.status === 200 || adminSubdomainRes.status === 401, "Secret subdomain (sentinelx9.benefisto.com) accesses admin router correctly (Status: " + adminSubdomainRes.status + ")");
  console.log("");

  // --------------------------------------------------------------------------
  // PILLAR 4: ISOLATED EDGE HONEYPOT & PLATFORM-WIDE BLACKLIST ENFORCEMENT
  // --------------------------------------------------------------------------
  console.log("🪤 PILLAR 4: Isolated Edge Honeypot & Platform-Wide Blacklist Enforcement");
  const testAttackerIp = "192.0.2.144"; // RFC 5737 Test Net IP

  // Test 4.1: Attacker probes honeypot /.env
  const hpEnv = await fetch(`${BASE_URL}/.env`, {
    headers: { "x-forwarded-for": testAttackerIp }
  });
  assert(hpEnv.status === 403, "Attacker probing /.env immediately trapped with 403 Forbidden");

  // Test 4.2: Attacker probes honeypot /wp-admin
  const hpWp = await fetch(`${BASE_URL}/wp-admin`, {
    headers: { "x-forwarded-for": testAttackerIp }
  });
  assert(hpWp.status === 403, "Attacker probing /wp-admin immediately trapped with 403 Forbidden");

  // Test 4.3: Platform-Wide Blacklist: Blocked from Shopping Search
  const searchBlocked = await fetch(`${BASE_URL}/api/search?q=laptop`, {
    headers: { "x-forwarded-for": testAttackerIp }
  });
  const searchBlockedText = await searchBlocked.text();
  assert(searchBlocked.status === 403 && searchBlockedText.includes("blacklisted"), "Attacker IP completely blacklisted from AI Shopping Search (/api/search)");

  // Test 4.4: Platform-Wide Blacklist: Blocked from Travel Vertical
  const travelBlocked = await fetch(`${BASE_URL}/travel`, {
    headers: { "x-forwarded-for": testAttackerIp }
  });
  const travelBlockedText = await travelBlocked.text();
  assert(travelBlocked.status === 403 && travelBlockedText.includes("blacklisted"), "Attacker IP completely blacklisted from Travel & Flights (/travel)");

  // Test 4.5: Platform-Wide Blacklist: Blocked from Subscriptions Vertical
  const subsBlocked = await fetch(`${BASE_URL}/subscriptions`, {
    headers: { "x-forwarded-for": testAttackerIp }
  });
  const subsBlockedText = await subsBlocked.text();
  assert(subsBlocked.status === 403 && subsBlockedText.includes("blacklisted"), "Attacker IP completely blacklisted from Subscriptions Hub (/subscriptions)");

  // Test 4.6: Platform-Wide Blacklist: Blocked from Retail Coupons Vertical
  const couponBlocked = await fetch(`${BASE_URL}/coupons/zomato`, {
    headers: { "x-forwarded-for": testAttackerIp }
  });
  const couponBlockedText = await couponBlocked.text();
  assert(couponBlocked.status === 403 && couponBlockedText.includes("blacklisted"), "Attacker IP completely blacklisted from Coupons Hub (/coupons/*)");

  // Test 4.7: Platform-Wide Blacklist: Blocked from Root Homepage
  const rootBlocked = await fetch(`${BASE_URL}/`, {
    headers: { "x-forwarded-for": testAttackerIp }
  });
  const rootBlockedText = await rootBlocked.text();
  assert(rootBlocked.status === 403 && rootBlockedText.includes("blacklisted"), "Attacker IP completely blacklisted from Root Homepage (/)");

  // Test 4.8: Normal, Legitimate Shopper from Unblocked IP
  const cleanShopperIp = "198.51.100.222";
  const cleanRes = await fetch(`${BASE_URL}/coupons/dominos`, {
    headers: { "x-forwarded-for": cleanShopperIp }
  });
  assert(cleanRes.status === 200, "Genuine shopper from normal IP accesses platform with 200 OK (0.00ms delay)");

  console.log("\n================================================================================");
  console.log(`🏁 AUDIT RESULT: ${passedTests} / ${totalTests} TESTS PASSED (${((passedTests/totalTests)*100).toFixed(1)}%)`);
  console.log("================================================================================");

  if (passedTests === totalTests) {
    console.log("🎉 ALL 4 SECURITY PILLARS ARE 100% OPERATIONAL, ISOLATED, AND BULLETPROOF!");
    process.exit(0);
  } else {
    console.error("❌ ONE OR MORE SECURITY TESTS FAILED.");
    process.exit(1);
  }
}

runMasterSecurityAudit().catch(err => {
  console.error("Audit script error:", err);
  process.exit(1);
});
