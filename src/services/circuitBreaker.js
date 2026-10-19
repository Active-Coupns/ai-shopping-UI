/**
 * Enterprise Resilience Engine: In-Memory / Distributed Circuit Breaker Pattern
 * Protects serverless functions and backend workers from external API downtime,
 * cascading timeouts, rate limit spikes, and 5xx outages (e.g. Groq, OpenWeb Ninja, RapidAPI).
 */

const CIRCUIT_STATES = {
  CLOSED: "CLOSED",       // Normal: requests flow through
  OPEN: "OPEN",           // Tripped: fail-fast, execute fallback immediately
  HALF_OPEN: "HALF_OPEN"  // Recovery test: allow 1 canary request
};

// Default Configuration
const DEFAULT_CONFIG = {
  failureThreshold: 3,      // Number of failures before tripping OPEN
  cooldownPeriodMs: 45000,  // Cooldown before entering HALF_OPEN (45s)
  timeoutMs: 12000,         // Max execution timeout before considering it a failure (12s)
};

// In-Memory state registry per service
const circuits = new Map();

function getOrCreateCircuit(serviceName, customConfig = {}) {
  const normName = String(serviceName).toLowerCase().trim();
  if (!circuits.has(normName)) {
    circuits.set(normName, {
      name: normName,
      state: CIRCUIT_STATES.CLOSED,
      failureCount: 0,
      successCount: 0,
      lastFailureTime: 0,
      nextAttemptTime: 0,
      totalTrips: 0,
      config: { ...DEFAULT_CONFIG, ...customConfig }
    });
  }
  return circuits.get(normName);
}

/**
 * Execute a critical external API call protected by the Circuit Breaker
 * 
 * @param {string} serviceName - Unique identifier for the service (e.g. 'openweb', 'groq', 'deals')
 * @param {Function} primaryFn - The primary async function executing the API call
 * @param {Function} fallbackFn - The fallback function if circuit is OPEN or call fails
 * @param {Object} options - Custom threshold and timeout overrides
 */
export async function executeWithCircuitBreaker(serviceName, primaryFn, fallbackFn = null, options = {}) {
  const circuit = getOrCreateCircuit(serviceName, options);
  const now = Date.now();

  // 1. Check if Circuit is OPEN
  if (circuit.state === CIRCUIT_STATES.OPEN) {
    if (now >= circuit.nextAttemptTime) {
      // Cooldown expired: move to HALF_OPEN to test canary request
      circuit.state = CIRCUIT_STATES.HALF_OPEN;
      console.warn(`[CircuitBreaker] Service '${circuit.name}' entered HALF-OPEN canary state.`);
    } else {
      // Circuit still tripped: Fail-fast immediately to preserve system resources
      const remainingCooldownSec = Math.ceil((circuit.nextAttemptTime - now) / 1000);
      console.warn(`[CircuitBreaker] Service '${circuit.name}' is OPEN. Failing fast (${remainingCooldownSec}s remaining).`);
      
      if (typeof fallbackFn === "function") {
        return await fallbackFn(new Error(`Circuit breaker is OPEN for '${circuit.name}'`));
      }
      return null;
    }
  }

  // 2. Execute Primary Call with Strict Timeout
  try {
    const timeoutPromise = new Promise((_, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`[CircuitBreaker] Execution timed out after ${circuit.config.timeoutMs}ms`));
      }, circuit.config.timeoutMs);
      if (timer?.unref) timer.unref();
    });

    const result = await Promise.race([
      primaryFn(),
      timeoutPromise
    ]);

    // Call succeeded!
    onSuccess(circuit);
    return result;

  } catch (err) {
    onFailure(circuit, err);

    if (typeof fallbackFn === "function") {
      try {
        return await fallbackFn(err);
      } catch (fallbackErr) {
        console.error(`[CircuitBreaker] Fallback function also failed for '${circuit.name}':`, fallbackErr.message);
        throw fallbackErr;
      }
    }
    
    // If no fallback provided, re-throw
    throw err;
  }
}

function onSuccess(circuit) {
  if (circuit.state === CIRCUIT_STATES.HALF_OPEN) {
    console.log(`[CircuitBreaker] Service '${circuit.name}' canary succeeded. Resetting to CLOSED.`);
    circuit.state = CIRCUIT_STATES.CLOSED;
    circuit.failureCount = 0;
  } else {
    // Decay failure count on successful requests
    if (circuit.failureCount > 0) {
      circuit.failureCount = Math.max(0, circuit.failureCount - 1);
    }
  }
  circuit.successCount++;
}

function onFailure(circuit, err) {
  circuit.failureCount++;
  circuit.lastFailureTime = Date.now();
  console.warn(`[CircuitBreaker] Failure recorded for '${circuit.name}' (${circuit.failureCount}/${circuit.config.failureThreshold}):`, err.message);

  if (circuit.state === CIRCUIT_STATES.HALF_OPEN || circuit.failureCount >= circuit.config.failureThreshold) {
    circuit.state = CIRCUIT_STATES.OPEN;
    circuit.totalTrips++;
    circuit.nextAttemptTime = Date.now() + circuit.config.cooldownPeriodMs;
    console.error(`[CircuitBreaker] Circuit TRIPPED to OPEN for '${circuit.name}'! Fast-failing for ${circuit.config.cooldownPeriodMs / 1000}s.`);
  }
}

/**
 * Inspect health status of all registered external service circuits
 */
export function getCircuitBreakerReport() {
  const report = {};
  for (const [name, c] of circuits.entries()) {
    report[name] = {
      state: c.state,
      failureCount: c.failureCount,
      successCount: c.successCount,
      totalTrips: c.totalTrips,
      isAvailable: c.state !== CIRCUIT_STATES.OPEN
    };
  }
  return report;
}

/**
 * Manually reset a tripped circuit breaker (e.g. from Admin Panel)
 */
export function resetCircuit(serviceName) {
  const normName = String(serviceName).toLowerCase().trim();
  if (circuits.has(normName)) {
    const c = circuits.get(normName);
    c.state = CIRCUIT_STATES.CLOSED;
    c.failureCount = 0;
    c.nextAttemptTime = 0;
    return true;
  }
  return false;
}
