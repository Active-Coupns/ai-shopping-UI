// Real Step-by-Step Test Suite for Admin Panel & Main Platform Features

async function runCompleteTestSuite() {
  console.log('====================================================');
  console.log('🚀 STARTING REAL STEP-BY-STEP ADMIN PANEL TESTS');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  // ----------------------------------------------------------------
  // 1. TEST KILL-SWITCH: VTON TRIAL ROOM
  // ----------------------------------------------------------------
  console.log('>>> [TEST 1A] Kill-Switch: Disabling vtonTrialRoom...');
  await fetch('http://localhost:3004/api/admin/features', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vtonTrialRoom: false })
  });

  const vtonRes = await fetch('http://localhost:3004/api/vton/render', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'origin': 'http://localhost:3004' },
    body: JSON.stringify({})
  });
  const vtonData = await vtonRes.json();
  if (vtonRes.status === 503 && vtonData.error === 'FEATURE_DISABLED') {
    console.log('✅ PASS: vtonTrialRoom kill-switch successfully blocked request (503 FEATURE_DISABLED)!');
    passed++;
  } else {
    console.error('❌ FAIL: vtonTrialRoom was not blocked correctly:', vtonRes.status, vtonData);
    failed++;
  }

  // Restore vtonTrialRoom
  await fetch('http://localhost:3004/api/admin/features', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vtonTrialRoom: true })
  });

  // ----------------------------------------------------------------
  // 2. TEST KILL-SWITCH: AI CONCIERGE & CHAT
  // ----------------------------------------------------------------
  console.log('\n>>> [TEST 1B] Kill-Switch: Disabling aiConciergeChat...');
  await fetch('http://localhost:3004/api/admin/features', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ aiConciergeChat: false })
  });

  const conciergeRes = await fetch('http://localhost:3004/api/ai/concierge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: 'laptop' })
  });
  const conciergeData = await conciergeRes.json();
  if (conciergeRes.status === 503 && conciergeData.error === 'FEATURE_DISABLED') {
    console.log('✅ PASS: aiConciergeChat kill-switch successfully blocked request (503 FEATURE_DISABLED)!');
    passed++;
  } else {
    console.error('❌ FAIL: aiConciergeChat was not blocked correctly:', conciergeRes.status, conciergeData);
    failed++;
  }

  // Restore aiConciergeChat
  await fetch('http://localhost:3004/api/admin/features', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ aiConciergeChat: true })
  });

  // ----------------------------------------------------------------
  // 3. TEST KILL-SWITCH: ZYTE COUPON SCRAPER
  // ----------------------------------------------------------------
  console.log('\n>>> [TEST 1C] Kill-Switch: Disabling zyteCouponScraper...');
  await fetch('http://localhost:3004/api/admin/features', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ zyteCouponScraper: false })
  });

  const couponRes = await fetch('http://localhost:3004/api/coupons?store=nike');
  const couponData = await couponRes.json();
  if (couponRes.status === 503 && couponData.error === 'FEATURE_DISABLED') {
    console.log('✅ PASS: zyteCouponScraper kill-switch successfully blocked request (503 FEATURE_DISABLED)!');
    passed++;
  } else {
    console.error('❌ FAIL: zyteCouponScraper was not blocked correctly:', couponRes.status, couponData);
    failed++;
  }

  // Restore zyteCouponScraper
  await fetch('http://localhost:3004/api/admin/features', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ zyteCouponScraper: true })
  });

  // ----------------------------------------------------------------
  // 4. TEST KILL-SWITCH: HEAD-TO-HEAD COMPARE
  // ----------------------------------------------------------------
  console.log('\n>>> [TEST 1D] Kill-Switch: Disabling headToHeadCompare...');
  await fetch('http://localhost:3004/api/admin/features', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ headToHeadCompare: false })
  });

  const compareRes = await fetch('http://localhost:3004/api/products/compare', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId: 'test123' })
  });
  const compareData = await compareRes.json();
  if (compareRes.status === 503 && compareData.error === 'FEATURE_DISABLED') {
    console.log('✅ PASS: headToHeadCompare kill-switch successfully blocked request (503 FEATURE_DISABLED)!');
    passed++;
  } else {
    console.error('❌ FAIL: headToHeadCompare was not blocked correctly:', compareRes.status, compareData);
    failed++;
  }

  // Restore headToHeadCompare
  await fetch('http://localhost:3004/api/admin/features', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ headToHeadCompare: true })
  });

  // ----------------------------------------------------------------
  // 5. TEST CRASH VAULT: RECORDING REAL UNHANDLED EXCEPTION
  // ----------------------------------------------------------------
  console.log('\n>>> [TEST 2] Crash Vault: Recording real unhandled exception into Redis...');
  const testErr = new Error('Test Scraper Worker Timeout on Flipkart Product Page at openweb.js:48:12');
  const crashPostRes = await fetch('http://localhost:3004/api/admin/crashes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      error: testErr.message,
      message: 'Scraper Timeout Error',
      component: 'openweb_scraper',
      route: '/api/search',
      severity: 'critical'
    })
  });
  const crashPostData = await crashPostRes.json();

  const crashesGetRes = await fetch('http://localhost:3004/api/admin/crashes');
  const crashesGetData = await crashesGetRes.json();
  const foundCrash = (crashesGetData.crashes || []).find(c => c.component === 'openweb_scraper');

  if (foundCrash) {
    console.log('✅ PASS: Crash Vault successfully recorded and persisted exception in Redis list!');
    console.log('       Crash ID:', foundCrash.id, '| Location:', foundCrash.location, '| Msg:', foundCrash.message);
    passed++;
  } else {
    console.error('❌ FAIL: Crash was not found in vault:', crashesGetData);
    failed++;
  }

  // ----------------------------------------------------------------
  // 6. TEST 6-HOUR AI HEALTH AUDITOR: REAL TELEMETRY & REPORT
  // ----------------------------------------------------------------
  console.log('\n>>> [TEST 3] AI Health Auditor: Triggering on-demand diagnostic scan with forceFresh=true...');
  const auditRes = await fetch('http://localhost:3004/api/admin/health-audit?force=true');
  const auditData = await auditRes.json();
  if (auditData.success && auditData.report && auditData.report.healthScore !== undefined) {
    console.log('✅ PASS: AI Health Auditor completed live scan!');
    console.log('       Status:', auditData.report.status);
    console.log('       Health Score:', auditData.report.healthScore + '/100');
    console.log('       Headline:', auditData.report.headline);
    console.log('       Summary:', auditData.report.summary);
    console.log('       Action Items:', auditData.report.actionItems);
    passed++;
  } else {
    console.error('❌ FAIL: AI Health Auditor failed:', auditData);
    failed++;
  }

  // ----------------------------------------------------------------
  // 7. TEST SUPPORT TICKET SYSTEM: USER SUBMIT -> ADMIN RESOLUTION
  // ----------------------------------------------------------------
  console.log('\n>>> [TEST 4] Support Helpdesk: User creates ticket -> Admin grants credit & resolves...');
  const ticketRes = await fetch('http://localhost:3004/api/support/tickets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userEmail: 'pooja.sharma@gmail.com',
      userName: 'Pooja Sharma',
      category: 'vton',
      subject: 'My Try-On got stuck on 95%',
      message: 'Hi team, my try-on credit was deducted when the page hung. Please help restore it.'
    })
  });
  const ticketData = await ticketRes.json();
  const createdTicket = ticketData.ticket;

  if (createdTicket && createdTicket.id) {
    console.log('       1. User created ticket:', createdTicket.id, '| Subject:', createdTicket.subject);
    
    // Admin replies & grants credit
    const replyRes = await fetch('http://localhost:3004/api/support/tickets', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ticketId: createdTicket.id,
        action: 'grant_credit',
        replyMessage: 'Hi Pooja, your account credit has been restored (+1 Free VTON Credit). Sorry for the delay!'
      })
    });
    const replyData = await replyRes.json();

    // Verify user sees the resolution
    const userTicketsRes = await fetch('http://localhost:3004/api/support/tickets?email=pooja.sharma@gmail.com');
    const userTicketsData = await userTicketsRes.json();
    const updatedTicket = (userTicketsData.tickets || []).find(t => t.id === createdTicket.id);

    if (updatedTicket && updatedTicket.status === 'resolved' && updatedTicket.replies.length > 0) {
      console.log('✅ PASS: Real Support Ticket full lifecycle passed! (Created -> Admin Resolved -> Admin Reply visible)');
      console.log('       Status:', updatedTicket.status, '| Replies:', updatedTicket.replies.length);
      passed++;
    } else {
      console.error('❌ FAIL: Ticket reply was not reflected properly:', updatedTicket);
      failed++;
    }
  } else {
    console.error('❌ FAIL: Ticket could not be created:', ticketData);
    failed++;
  }

  // ----------------------------------------------------------------
  // 8. TEST COUPON / BRAND DATA
  // ----------------------------------------------------------------
  console.log('\n>>> [TEST 5] Brand Coupons: Testing live store coupon fetching (Myntra)...');
  const myntraRes = await fetch('http://localhost:3004/api/coupons?store=Myntra&country=IN');
  const myntraData = await myntraRes.json();
  if (myntraData.success && myntraData.coupons && myntraData.coupons.length > 0) {
    console.log('✅ PASS: Brand Coupon engine returned live coupons for Myntra!');
    console.log('       Store:', myntraData.storeName, '| Coupons found:', myntraData.coupons.length);
    console.log('       Sample Code:', myntraData.coupons[0].code, '|', myntraData.coupons[0].title);
    passed++;
  } else {
    console.error('❌ FAIL: Coupon fetch failed:', myntraData);
    failed++;
  }

  console.log('\n====================================================');
  console.log(`🎉 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');
}

runCompleteTestSuite();
