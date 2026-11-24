const { runShard } = require('./run_shard_pipeline.js');

async function main() {
  console.log(`=====================================================================`);
  console.log(`  STARTING FINAL AUTOMATED CHAINED EXECUTION: SHARD 5 & SHARD 6`);
  console.log(`  Shard 5: 74 Major Brands (Meesho, Starbucks, Bewakoof, Australian Giants)`);
  console.log(`  Shard 6: 74 Power Brands (Blinkit, AJIO, Chaayos, UAE & Middle East)`);
  console.log(`=====================================================================\n`);

  const startTotal = Date.now();

  // 1. Run Shard 5
  console.log(`\n#####################################################################`);
  console.log(`  STEP 1: EXECUTING SHARD 5`);
  console.log(`#####################################################################\n`);
  await runShard("5");

  console.log(`\n>>> Shard 5 Finished! Pausing 5 seconds before immediately starting Shard 6...\n`);
  await new Promise(r => setTimeout(r, 5000));

  // 2. Run Shard 6
  console.log(`\n#####################################################################`);
  console.log(`  STEP 2: EXECUTING SHARD 6 (THE FINAL MILE)`);
  console.log(`#####################################################################\n`);
  await runShard("6");

  const totalElapsed = ((Date.now() - startTotal) / 1000).toFixed(1);
  console.log(`\n=====================================================================`);
  console.log(`  ALL 6 SHARDS (100% OF 600 GLOBAL BRANDS) COMPLETED IN ${totalElapsed}s!`);
  console.log(`=====================================================================\n`);
}

main().catch(err => {
  console.error("Fatal error in Chained Shards 5 & 6 Execution:", err);
  process.exit(1);
});
