const url = "http://localhost:3002/api/search";

const QUERIES = [
  "hiking boots",
  "office desk",
  "chef knife",
  "wireless mouse",
  "yoga mat",
  "slow cooker",
  "blender",
  "water bottle",
  "electric kettle",
  "sleeping bag"
];

const user = {
  id: "automated-contract-regression-test",
  email: "regressiontester@example.com",
  user_metadata: {
    full_name: "Regression Tester",
    country: "US",
    search_count_today: 0,
    last_search_date: new Date().toISOString().split("T")[0]
  }
};

const token = "mock-jwt-token-jwt-" + btoa(JSON.stringify(user));

function isValidDirectPDPUrl(link) {
  if (!link) return false;
  const lower = link.toLowerCase();
  
  // Enforce zero Google aggregator leak policy
  if (
    lower.includes("google.com/search") ||
    lower.includes("google.co.in/search") ||
    lower.includes("google.co.uk/search") ||
    lower.includes("/search?") ||
    lower.includes("serpapi.com") ||
    lower.includes("ibp=")
  ) {
    return false;
  }
  
  // Enforce direct PDP rule (no generic search page shortcuts allowed)
  if (
    lower.includes("amazon.in/s?k=") ||
    lower.includes("amazon.com/s?k=") ||
    lower.includes("flipkart.com/search?q=") ||
    lower.includes("ajio.com/search/?text=") ||
    lower.includes("myntra.com/search?q=")
  ) {
    return false;
  }

  return lower.startsWith("http://") || lower.startsWith("https://");
}

async function verifyServer() {
  try {
    const res = await fetch("http://localhost:3002/reset-password", { method: "GET" }).catch(() => null);
    if (!res) {
      console.error("Error: Next.js dev server is not running on http://localhost:3002.");
      console.error("Please run the dev server on port 3002 before executing the tests.");
      process.exit(1);
    }
  } catch (e) {
    console.error("Failed to connect to dev server:", e.message);
    process.exit(1);
  }
}

async function runQueries() {
  await verifyServer();
  console.log("Next.js dev server verified on port 3002. Starting 10-query regression validation suite...\n");
  
  let failed = false;

  for (let i = 0; i < QUERIES.length; i++) {
    const query = QUERIES[i];
    console.log(`[Query ${i + 1}/10] Testing query: "${query}"...`);
    
    let attempts = 2;
    let success = false;
    let products = [];
    let duration = 0;

    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        const startTime = Date.now();
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ query, country: "US" })
        });
        duration = ((Date.now() - startTime) / 1000).toFixed(2);

        if (!res.ok) {
          console.error(`  Attempt ${attempt}: Request failed with status ${res.status}`);
          continue;
        }

        const data = await res.json();
        products = data.products || [];

        // Check if count is within target range
        const hasValidCount = products.length >= 8 && products.length <= 10;
        
        // Assert links
        let hasLinkFailure = false;
        products.forEach((p, idx) => {
          if (!isValidDirectPDPUrl(p.deal_link || "")) {
            hasLinkFailure = true;
            console.error(`  Attempt ${attempt} Link Error: Invalid direct PDP link: "${p.deal_link}"`);
          }
        });

        if (hasValidCount && !hasLinkFailure) {
          success = true;
          break;
        } else {
          console.warn(`  Attempt ${attempt} Warning: Count: ${products.length}, Link failures: ${hasLinkFailure ? "Yes" : "No"}`);
          // Sleep 5 seconds before the next retry attempt to let rate limits settle
          if (attempt < attempts) {
            console.log("  Sleeping 5s before retry...");
            await new Promise(resolve => setTimeout(resolve, 5000));
          }
        }
      } catch (err) {
        console.error(`  Attempt ${attempt} Error: ${err.message}`);
        if (attempt < attempts) {
          console.log("  Sleeping 5s before retry...");
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }
    }

    if (success) {
      console.log(`  PASS: Validated successfully! (Count: ${products.length}, Duration: ${duration}s)`);
    } else {
      console.error(`  FAIL: Validation failed for "${query}" after ${attempts} attempts.`);
      failed = true;
    }
    console.log("----------------------------------------------------------------");
    // Space out test queries by 10s to avoid SerpApi rolling rate limits
    await new Promise(resolve => setTimeout(resolve, 10000));
  }

  if (failed) {
    console.error("\nTEST SUITE FAILED: Regression check detected invalid links or count bottlenecks.");
    process.exit(1);
  } else {
    console.log("\nTEST SUITE SUCCESS: All 10 queries verified successfully! 100% compliant with link resolution contract.");
    process.exit(0);
  }
}

runQueries();
