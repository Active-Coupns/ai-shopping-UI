/**
 * Test Suite: Universal Server-Side Credit Vault & Quota Lock
 * Verifies atomic 10-call daily quota enforcement, cache-hit zero cost,
 * and read-only credit balance inspection.
 */

import { UniversalCreditVault } from '../src/services/universalCreditVault.js';
import { redis } from '../src/services/redis.js';

async function runCreditVaultTests() {
  console.log('========================================================');
  console.log('⚡ UNIVERSAL CREDIT VAULT: VERIFICATION & BENCHMARK');
  console.log('========================================================\n');

  let passed = 0;
  let failed = 0;

  const testUserId = `test_user_suite_${Date.now()}`;
  const testIp = `192.168.1.${Math.floor(Math.random() * 250) + 1}`;
  const testFp = `hw_suite_${Date.now()}`;

  // 1. Initial balance inspection (Read-Only)
  console.log('>>> [TEST 1] Read-Only Credit Inspection (No Deduction)...');
  const initialInspect = await UniversalCreditVault.getRemaining({
    userId: testUserId,
    clientIp: testIp,
    deviceFingerprint: testFp
  });

  if (initialInspect.remaining === 10 && initialInspect.current === 0) {
    console.log(`✅ PASS: Initial balance is strictly 10/10 remaining (Latency: ${initialInspect.latencyMs.toFixed(1)}ms)`);
    passed++;
  } else {
    console.error('❌ FAIL: Initial balance expected 10, got:', initialInspect);
    failed++;
  }

  // 2. Consume 10 sequential credits
  console.log('\n>>> [TEST 2] Consuming 10 Daily Credits Sequentially...');
  let allAllowed = true;
  let latencies = [];

  for (let i = 1; i <= 10; i++) {
    const res = await UniversalCreditVault.consume({
      userId: testUserId,
      clientIp: testIp,
      deviceFingerprint: testFp,
      isCacheHit: false,
      enforceInDev: true
    });
    latencies.push(res.latencyMs);

    if (!res.allowed || res.remaining !== (10 - i)) {
      allAllowed = false;
      console.error(`❌ Call ${i} failed:`, res);
      break;
    }
  }

  if (allAllowed) {
    const avgLatency = (latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(1);
    console.log(`✅ PASS: 10/10 calls allowed cleanly. Remaining decremented from 9 -> 0. (Avg Latency: ${avgLatency}ms)`);
    passed++;
  } else {
    failed++;
  }

  // 3. 11th call must be strictly BLOCKED
  console.log('\n>>> [TEST 3] 11th Call Enforcement (Exhausted Quota)...');
  const call11 = await UniversalCreditVault.consume({
    userId: testUserId,
    clientIp: testIp,
    deviceFingerprint: testFp,
    isCacheHit: false,
    enforceInDev: true
  });

  if (!call11.allowed && call11.error === 'DAILY_CREDIT_EXHAUSTED' && call11.remaining === 0) {
    console.log(`✅ PASS: 11th call strictly blocked with DAILY_CREDIT_EXHAUSTED! (Latency: ${call11.latencyMs.toFixed(1)}ms)`);
    passed++;
  } else {
    console.error('❌ FAIL: 11th call was not blocked correctly:', call11);
    failed++;
  }

  // 4. Cache-hit zero cost test
  console.log('\n>>> [TEST 4] Cache Hit Zero-Cost Policy...');
  const cacheHitUser = `test_cache_user_${Date.now()}`;
  const cacheHitRes = await UniversalCreditVault.consume({
    userId: cacheHitUser,
    clientIp: testIp,
    deviceFingerprint: testFp,
    isCacheHit: true,
    enforceInDev: true
  });

  if (cacheHitRes.allowed && cacheHitRes.remaining === 10 && cacheHitRes.isCacheHit) {
    console.log(`✅ PASS: Cache hit consumed 0 credits. Remaining stayed at 10/10 (Latency: ${cacheHitRes.latencyMs.toFixed(1)}ms)`);
    passed++;
  } else {
    console.error('❌ FAIL: Cache hit did not preserve 10 credits:', cacheHitRes);
    failed++;
  }

  // Summary
  console.log('\n========================================================');
  console.log(`📊 TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('========================================================\n');

  // Clean up Redis test keys
  try {
    const today = new Date().toISOString().split('T')[0];
    const keys = await redis.keys(`quota:universal_vault:*:${today}`);
    if (keys && keys.length > 0) {
      for (const k of keys) {
        if (k.includes('test_user_suite_') || k.includes('test_cache_user_')) {
          await redis.del(k);
        }
      }
    }
  } catch (_) {}

  process.exit(failed > 0 ? 1 : 0);
}

runCreditVaultTests().catch(err => {
  console.error('Suite crashed:', err);
  process.exit(1);
});
