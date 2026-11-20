const BASE_URL = "http://localhost:3000";
const TEST_USER_ID = `test_user_${Date.now()}`;

console.log("=================================================================");
console.log("🚀 STARTING BENEFISTO PAYMENT & WEBHOOK GATEWAY END-TO-END TEST");
console.log(`👤 Test User ID: ${TEST_USER_ID}`);
console.log(`🌐 Base URL: ${BASE_URL}`);
console.log("=================================================================\n");

async function runTests() {
  let passedCount = 0;
  let failedCount = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passedCount++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failedCount++;
    }
  }

  // --- TEST 1: Webhook GET Health Check ---
  console.log("▶️ TEST 1: Dodo Webhook GET Health Check");
  try {
    const res = await fetch(`${BASE_URL}/api/webhooks/dodo`);
    const data = await res.json();
    assert(res.status === 200, "Webhook endpoint responded with HTTP 200");
    assert(data.status === "ok", "Webhook health check returned status: 'ok'");
  } catch (err) {
    assert(false, `Webhook GET failed: ${err.message}`);
  }
  console.log("");

  // --- TEST 2: Checkout Session Creation (Dodo API Test Mode) ---
  console.log("▶️ TEST 2: Create Dodo Checkout Session via /api/payments/checkout");
  let checkoutSessionId = null;
  try {
    const res = await fetch(`${BASE_URL}/api/payments/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        planKey: "tryon_medium",
        country: "IN",
        returnUrl: "http://localhost:3000/?payment=success&plan=tryon_medium"
      })
    });
    const data = await res.json();
    assert(res.status === 200, "Checkout creation returned HTTP 200");
    assert(data.success === true, "Response has success: true");
    assert(data.planKey === "tryon_medium", "Plan key matches 'tryon_medium'");
    assert(typeof data.checkoutUrl === "string" && data.checkoutUrl.startsWith("http"), "Valid checkout URL generated");
    assert(typeof data.sessionId === "string" && data.sessionId.length > 0, "Valid session ID generated");
    checkoutSessionId = data.sessionId;
    console.log(`    Checkout URL: ${data.checkoutUrl.slice(0, 50)}...`);
    console.log(`    Session ID: ${data.sessionId}`);
  } catch (err) {
    assert(false, `Checkout session creation failed: ${err.message}`);
  }
  console.log("");

  // --- TEST 3: Mock Webhook Event — Try-On Medium (14 Credits) ---
  console.log("▶️ TEST 3: Webhook Event - payment.succeeded for Try-On Medium (+14 Credits)");
  const paymentId1 = `pay_mock_${Date.now()}_1`;
  try {
    const mockPayload1 = {
      type: "payment.succeeded",
      data: {
        payment_id: paymentId1,
        amount: 4900,
        currency: "INR",
        customer: {
          customer_id: TEST_USER_ID,
          email: "tester@benefisto.com"
        },
        metadata: {
          userId: TEST_USER_ID,
          planKey: "tryon_medium",
          category: "tryon",
          credits: "14",
          validityDays: "60"
        }
      }
    };

    const res = await fetch(`${BASE_URL}/api/webhooks/dodo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mockPayload1)
    });
    const data = await res.json();
    assert(res.status === 200, "Webhook returned HTTP 200");
    assert(data.received === true, "Webhook confirmed event receipt");
  } catch (err) {
    assert(false, `Webhook delivery failed: ${err.message}`);
  }
  console.log("");

  // --- TEST 4: Mock Webhook Event — Additive Stacking for Try-On Large (+30 Credits) ---
  console.log("▶️ TEST 4: Webhook Event - Additive Stacking for Try-On Large (+30 Credits -> Total 44)");
  const paymentId2 = `pay_mock_${Date.now()}_2`;
  try {
    const mockPayload2 = {
      type: "payment.succeeded",
      data: {
        payment_id: paymentId2,
        amount: 9900,
        currency: "INR",
        customer: {
          customer_id: TEST_USER_ID,
          email: "tester@benefisto.com"
        },
        metadata: {
          userId: TEST_USER_ID,
          planKey: "tryon_large",
          category: "tryon",
          credits: "30",
          validityDays: "60"
        }
      }
    };

    const res = await fetch(`${BASE_URL}/api/webhooks/dodo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mockPayload2)
    });
    const data = await res.json();
    assert(res.status === 200, "Webhook returned HTTP 200 for additive top-up");
    assert(data.received === true, "Webhook confirmed additive event receipt");
  } catch (err) {
    assert(false, `Additive top-up webhook delivery failed: ${err.message}`);
  }
  console.log("");

  // --- TEST 5: Mock Webhook Event — Search Medium (+120 Credits) & Search Large (+260 Credits) ---
  console.log("▶️ TEST 5: Webhook Event - AI Search Top-up (+120 and +260 Credits -> Total 380)");
  const paymentId3 = `pay_mock_${Date.now()}_3`;
  const paymentId4 = `pay_mock_${Date.now()}_4`;
  try {
    // Top-up 1: Medium (120)
    await fetch(`${BASE_URL}/api/webhooks/dodo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "payment.succeeded",
        data: {
          payment_id: paymentId3,
          amount: 3900,
          currency: "INR",
          metadata: {
            userId: TEST_USER_ID,
            planKey: "search_medium",
            category: "search",
            credits: "120",
            validityDays: "60"
          }
        }
      })
    });

    // Top-up 2: Large (260) -> Stacks to 380
    const res = await fetch(`${BASE_URL}/api/webhooks/dodo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "payment.succeeded",
        data: {
          payment_id: paymentId4,
          amount: 7900,
          currency: "INR",
          metadata: {
            userId: TEST_USER_ID,
            planKey: "search_large",
            category: "search",
            credits: "260",
            validityDays: "60"
          }
        }
      })
    });
    const data = await res.json();
    assert(res.status === 200, "Search credits webhook returned HTTP 200");
    assert(data.received === true, "Search credits webhook confirmed receipt");
  } catch (err) {
    assert(false, `Search credits webhook failed: ${err.message}`);
  }
  console.log("");

  // --- TEST 6: Direct Redis State Verification ---
  console.log("▶️ TEST 6: Verify Database / Redis Balance & 60-Day Expiry");
  try {
    const { redis } = await import("./src/services/redis.js");
    
    // Check Try-On balance
    const tryonCredits = parseInt(await redis.get(`user_tryon_credits:${TEST_USER_ID}`) || "0", 10);
    const tryonExpiry = parseInt(await redis.get(`user_tryon_expiry:${TEST_USER_ID}`) || "0", 10);
    const tryonExpiryDays = Math.round((tryonExpiry - Date.now()) / (24 * 60 * 60 * 1000));

    console.log(`    Try-On Credits in Redis: ${tryonCredits} (Expected: 44)`);
    console.log(`    Try-On Expiry Days: ~${tryonExpiryDays} days from now`);
    assert(tryonCredits === 44, `Try-On credits correctly stacked to 44 (14 + 30)`);
    assert(tryonExpiryDays >= 59 && tryonExpiryDays <= 61, `Try-On expiry window is ~60 days`);

    // Check Search balance
    const searchCredits = parseInt(await redis.get(`user_search_credits:${TEST_USER_ID}`) || "0", 10);
    const searchExpiry = parseInt(await redis.get(`user_search_expiry:${TEST_USER_ID}`) || "0", 10);
    const searchExpiryDays = Math.round((searchExpiry - Date.now()) / (24 * 60 * 60 * 1000));

    console.log(`    Search Credits in Redis: ${searchCredits} (Expected: 380)`);
    console.log(`    Search Expiry Days: ~${searchExpiryDays} days from now`);
    assert(searchCredits === 380, `Search credits correctly stacked to 380 (120 + 260)`);
    assert(searchExpiryDays >= 59 && searchExpiryDays <= 61, `Search expiry window is ~60 days`);

    // Check Transaction History (Receipts)
    const history = await redis.lrange(`user_payments:${TEST_USER_ID}`, 0, 5);
    console.log(`    Stored Payment Receipts: ${history.length} items`);
    assert(history.length >= 2, `Payment receipts recorded in transaction ledger`);

    // --- TEST 7: Consumption & Atomic Deduction Test ---
    console.log("\n▶️ TEST 7: Credit Consumption & Atomic Deduction (Try-On and Search)");
    const newTryon = await redis.decrby(`user_tryon_credits:${TEST_USER_ID}`, 1);
    console.log(`    Deducted 1 Try-On Credit. New Balance: ${newTryon} (Expected: 43)`);
    assert(newTryon === 43, `Try-On credit atomically decremented from 44 to 43`);

    const newSearch = await redis.decrby(`user_search_credits:${TEST_USER_ID}`, 1);
    console.log(`    Deducted 1 Search Credit. New Balance: ${newSearch} (Expected: 379)`);
    assert(newSearch === 379, `Search credit atomically decremented from 380 to 379`);

    // Clean up test keys
    await redis.del(`user_tryon_credits:${TEST_USER_ID}`);
    await redis.del(`user_tryon_expiry:${TEST_USER_ID}`);
    await redis.del(`user_search_credits:${TEST_USER_ID}`);
    await redis.del(`user_search_expiry:${TEST_USER_ID}`);
    await redis.del(`user_payments:${TEST_USER_ID}`);
    console.log("    🧹 Test keys cleanly purged from Redis.");
  } catch (err) {
    assert(false, `Direct Redis verification failed: ${err.message}`);
  }
  console.log("");

  // --- FINAL SUMMARY ---
  console.log("=================================================================");
  console.log(`📊 FINAL TEST REPORT: ${passedCount} PASSED, ${failedCount} FAILED`);
  if (failedCount === 0) {
    console.log("🎉 ALL PAYMENT GATEWAY & WEBHOOK INTEGRATION TESTS PASSED 100%!");
  } else {
    console.log("⚠️ SOME TESTS FAILED. PLEASE REVIEW LOGS.");
  }
  console.log("=================================================================");
}

runTests().catch(err => {
  console.error("Fatal test runner crash:", err);
  process.exit(1);
});
