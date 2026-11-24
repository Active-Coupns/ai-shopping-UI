const { runShard } = require('./run_shard_pipeline.js');

async function main() {
  console.log(`=====================================================================`);
  console.log(`  STARTING AUTOMATED CHAINED EXECUTION: SHARD 3 & SHARD 4`);
  console.log(`  Shard 3: 75 High-Impact Indian & European Brands`);
  console.log(`  Shard 4: 75 Power Giants (Amazon, Swiggy, KFC, Myntra, etc.)`);
  console.log(`=====================================================================\n`);

  const startTotal = Date.now();

  // 1. Run Shard 3
  console.log(`\n#####################################################################`);
  console.log(`  STEP 1: EXECUTING SHARD 3`);
  console.log(`#####################################################################\n`);
  await runShard("3");

  console.log(`\n>>> Shard 3 Finished! Pausing 5 seconds before immediately starting Shard 4...\n`);
  await new Promise(r => setTimeout(r, 5000));

  // 2. Run Shard 4
  console.log(`\n#####################################################################`);
  console.log(`  STEP 2: EXECUTING SHARD 4`);
  console.log(`#####################################################################\n`);
  await runShard("4");

  const totalElapsed = ((Date.now() - startTotal) / 1000).toFixed(1);
  console.log(`\n=====================================================================`);
  console.log(`  ALL SHARD 3 & SHARD 4 EXECUTION COMPLETED IN ${totalElapsed}s!`);
  console.log(`=====================================================================\n`);
}

main().catch(err => {
  console.error("Fatal error in Chained Shards 3 & 4 Execution:", err);
  process.exit(1);
});
