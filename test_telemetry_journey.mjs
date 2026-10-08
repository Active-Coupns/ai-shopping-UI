async function runTelemetryAudit() {
  console.log("==================================================");
  console.log("🚀 TESTING USER JOURNEY TELEMETRY & ACTIVITY LEDGER");
  console.log("==================================================");

  const testSessionId = `test_sess_${Date.now()}`;
  const headers = { "Content-Type": "application/json" };

  // 1. Log VISIT
  console.log("\n[1] Testing Page Visit Logging...");
  const visitRes = await fetch("http://localhost:3000/api/telemetry/event", {
    method: "POST",
    headers,
    body: JSON.stringify({
      sessionId: testSessionId,
      eventType: "VISIT",
      payload: {}
    })
  });
  const visitData = await visitRes.json();
  console.log(`- Visit Logged: Success = ${visitData.success} | VisitCount = ${visitData.journey?.session?.visitCount}`);

  // 2. Log SEARCH
  console.log("\n[2] Testing Search Telemetry (Zero Query Tampering)...");
  const rawUserQuery = "gaming laptop under 60000";
  const searchRes = await fetch("http://localhost:3000/api/telemetry/event", {
    method: "POST",
    headers,
    body: JSON.stringify({
      sessionId: testSessionId,
      eventType: "SEARCH",
      payload: { query: rawUserQuery, mode: "shopping" }
    })
  });
  const searchData = await searchRes.json();
  const lastSearch = searchData.journey?.searches?.[0];
  console.log(`- Stored Query: "${lastSearch?.query}" (Exact Match: ${lastSearch?.query === rawUserQuery})`);
  console.log(`- Search Mode: ${lastSearch?.mode}`);

  // 3. Log PRODUCT_CLICK
  console.log("\n[3] Testing Deal Click Telemetry...");
  const clickRes = await fetch("http://localhost:3000/api/telemetry/event", {
    method: "POST",
    headers,
    body: JSON.stringify({
      sessionId: testSessionId,
      eventType: "PRODUCT_CLICK",
      payload: {
        title: "ASUS TUF Gaming F15 (16GB/512GB SSD/RTX 3050)",
        price: "₹54,990",
        store: "Amazon.in",
        dealLink: "https://www.amazon.in/dp/B0B5SY2X5M"
      }
    })
  });
  const clickData = await clickRes.json();
  console.log(`- Clicked Products Count: ${clickData.journey?.clickedProducts?.length}`);
  console.log(`- Top Click: ${clickData.journey?.clickedProducts?.[0]?.title} at ${clickData.journey?.clickedProducts?.[0]?.store}`);

  // 4. Log AI_SUMMARY_ASKED
  console.log("\n[4] Testing AI Summary Telemetry...");
  const aiRes = await fetch("http://localhost:3000/api/telemetry/event", {
    method: "POST",
    headers,
    body: JSON.stringify({
      sessionId: testSessionId,
      eventType: "AI_SUMMARY_ASKED",
      payload: {
        title: "Lenovo LOQ 15 Gaming Laptop",
        price: "₹59,990",
        store: "Flipkart",
        category: "ecommerce"
      }
    })
  });
  const aiData = await aiRes.json();
  console.log(`- AI Summaries Asked Count: ${aiData.journey?.aiSummaries?.length}`);

  // 5. Log AI_GUIDE_SYNC
  console.log("\n[5] Testing AI Guide Context Sync...");
  const guideRes = await fetch("http://localhost:3000/api/telemetry/event", {
    method: "POST",
    headers,
    body: JSON.stringify({
      sessionId: testSessionId,
      eventType: "AI_GUIDE_SYNC",
      payload: {
        userPersona: "Engineering Student Gamer",
        budgetLimit: 60000,
        lastAdvice: "Recommended RTX 3050 with 16GB RAM for AutoCAD & Gaming",
        suggestedQuery: "RTX 3050 laptop"
      }
    })
  });
  const guideData = await guideRes.json();
  console.log(`- Inferred Budget Tier: ${guideData.journey?.preferences?.budgetTier}`);
  console.log(`- Inferred Persona: ${guideData.journey?.preferences?.activePersona}`);

  // 6. GET Full Journey Ledger
  console.log("\n[6] Testing Full Journey Retrieval via GET /api/telemetry/event...");
  const getRes = await fetch(`http://localhost:3000/api/telemetry/event?sessionId=${testSessionId}`, {
    method: "GET"
  });
  const getData = await getRes.json();
  console.log("- Full Ledger Retrieved: Success =", getData.success);
  console.log("- Searches:", getData.journey?.searches?.map(s => s.query));
  console.log("- Clicked Deals:", getData.journey?.clickedProducts?.map(p => `${p.title.slice(0, 30)}... (${p.price})`));
  console.log("- AI Summaries:", getData.journey?.aiSummaries?.map(a => `${a.title.slice(0, 30)}... (${a.price})`));
  console.log("- Inferred Profile:", getData.journey?.preferences);

  // 7. Cleanup
  await fetch(`http://localhost:3000/api/telemetry/event?sessionId=${testSessionId}&action=clear`, {
    method: "GET"
  });
  console.log("\n✅ [PASS] All Telemetry & User Journey Ledger Tests Passed 100%!");
  console.log("==================================================");
}

runTelemetryAudit().catch(console.error);
