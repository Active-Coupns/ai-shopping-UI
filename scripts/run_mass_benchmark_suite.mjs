import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { generateAuditPdf } from './generate_audit_pdf.mjs';

const PROJECT_ROOT = 'C:\\Users\\ASUS\\.gemini\\antigravity\\scratch\\ai-shopping-assistant';
const RESULTS_DIR = path.join(PROJECT_ROOT, 'public', 'test_results');
const MODELS_DIR = path.join(PROJECT_ROOT, 'public', 'models');

if (!fs.existsSync(RESULTS_DIR)) {
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
}

// Read API Key
const envText = fs.readFileSync(path.join(PROJECT_ROOT, '.env.local'), 'utf8');
let PIXELAPI_KEY = '';
for (const line of envText.split('\n')) {
  if (line.startsWith('PIXELAPI_KEY=')) {
    PIXELAPI_KEY = line.split('=')[1].trim();
  }
}

// 4 Benchmark Models
const MODELS = {
  men: path.join(MODELS_DIR, 'men_model.jpg'),
  women: path.join(MODELS_DIR, 'women_model.jpg'),
  kids_boy: path.join(MODELS_DIR, 'kids_boy_model.jpg'),
  kids_girl: path.join(MODELS_DIR, 'kids_girl_model.jpg'),
};

// Load Verified Matrix (36 Items across 6 Countries)
const matrixPath = path.join(PROJECT_ROOT, 'scripts', 'verified_test_matrix.json');
const TEST_MATRIX = JSON.parse(fs.readFileSync(matrixPath, 'utf8'));

// Helper: Run a single VTON test
async function runSingleTest(testItem) {
  const t0 = Date.now();
  console.log(`\n================================================================`);
  console.log(`🚀 [${testItem.country}] Running Test: ${testItem.id}`);
  console.log(`🏷️ ${testItem.categoryLabel} (${testItem.categoryType}) - Model: ${testItem.modelKey}`);
  console.log(`👔 Garment: ${testItem.garment.title} | ${testItem.garment.brand} | ${testItem.garment.price}`);

  const modelPath = MODELS[testItem.modelKey];
  const modelBuf = fs.readFileSync(modelPath);
  const personB64 = modelBuf.toString('base64');

  // Pre-fetch and sanitize garment image to standard baseline JPEG
  const garmentLocalPath = path.join(RESULTS_DIR, `${testItem.id}_garment.jpg`);
  let garmentB64 = '';
  try {
    const gRes = await fetch(testItem.garment.image, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const gRaw = Buffer.from(await gRes.arrayBuffer());
    // Convert to standard JPEG
    const gJpg = await sharp(gRaw).jpeg({ quality: 92 }).toBuffer();
    fs.writeFileSync(garmentLocalPath, gJpg);
    garmentB64 = gJpg.toString('base64');
  } catch (err) {
    console.error(`❌ Failed to fetch/sanitize garment image:`, err.message);
    return {
      ...testItem,
      success: false,
      error: `Garment image error: ${err.message}`,
      latency: (Date.now() - t0) / 1000
    };
  }

  // Exact PixelAPI category mapping: "upperbody", "lowerbody", "dress", "kurti"
  let targetCat = 'upperbody';
  const titleLower = (testItem.garment.title || '').toLowerCase();
  if (testItem.categoryType.includes('Lower')) {
    targetCat = 'lowerbody';
  } else if (testItem.categoryType.includes('Dress') || titleLower.includes('dress') || titleLower.includes('frock')) {
    targetCat = 'dress';
  } else if (titleLower.includes('kurti') || titleLower.includes('kurta')) {
    targetCat = 'kurti';
  } else {
    targetCat = 'upperbody';
  }

  // Submit to PixelAPI with automatic retries for transient 503s
  let jobId = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch("https://api.pixelapi.dev/v1/virtual-tryon", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${PIXELAPI_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          person_image: personB64,
          garment_image: garmentB64,
          category: targetCat,
          n_samples: 1,
          n_steps: 22,
          ephemeral: true,
          auto_delete: true
        })
      });

      if (res.ok) {
        const body = await res.json();
        jobId = body.job_id || body.id;
        console.log(`✅ Job accepted: ${jobId} (Attempt ${attempt}, Category: ${targetCat})`);
        break;
      } else {
        const text = await res.text();
        console.warn(`⚠️ Submit attempt ${attempt} returned status ${res.status}: ${text.slice(0, 100)}`);
        if (text.includes("Use lowerbody")) {
          targetCat = "lowerbody";
          console.log(`🔄 Adaptive Category Switch -> lowerbody`);
        } else if (text.includes("Use upperbody")) {
          targetCat = "upperbody";
          console.log(`🔄 Adaptive Category Switch -> upperbody`);
        } else if (text.includes("Use dress")) {
          targetCat = "dress";
          console.log(`🔄 Adaptive Category Switch -> dress`);
        } else if (res.status === 503 && attempt < 3) {
          console.log(`⏳ Waiting 5s before retry...`);
          await new Promise(r => setTimeout(r, 5000));
        }
      }
    } catch (err) {
      console.warn(`⚠️ Network exception on submit attempt ${attempt}:`, err.message);
      if (attempt < 3) await new Promise(r => setTimeout(r, 4000));
    }
  }

  if (!jobId) {
    return {
      ...testItem,
      success: false,
      error: 'PixelAPI failed to accept job after 3 attempts',
      latency: (Date.now() - t0) / 1000,
      modelImagePath: modelPath,
      garmentImagePath: garmentLocalPath
    };
  }

  // Poll until completion (up to 45 attempts x 3s = 135s)
  let outputUrl = null;
  for (let i = 0; i < 45; i++) {
    await new Promise(r => setTimeout(r, 3000));
    try {
      const pollRes = await fetch(`https://api.pixelapi.dev/v1/virtual-tryon/jobs/${jobId}`, {
        headers: { "Authorization": `Bearer ${PIXELAPI_KEY}` }
      });
      if (pollRes.ok) {
        const pollData = await pollRes.json();
        process.stdout.write(`.`);
        if (pollData.status === 'completed' || pollData.status === 'succeeded') {
          outputUrl = pollData.output_url || pollData.result_url || pollData.output_image_url;
          console.log(`\n🎉 Job completed in ${((Date.now() - t0) / 1000).toFixed(1)}s!`);
          break;
        } else if (pollData.status === 'failed') {
          console.log(`\n❌ Worker reported job failed:`, pollData.error_message || 'Unknown error');
          break;
        }
      }
    } catch (pollErr) {}
  }

  const latencySec = (Date.now() - t0) / 1000;
  const renderedImagePath = path.join(RESULTS_DIR, `${testItem.id}_output.jpg`);

  if (outputUrl) {
    try {
      const outRes = await fetch(outputUrl);
      const outBuf = Buffer.from(await outRes.arrayBuffer());
      fs.writeFileSync(renderedImagePath, outBuf);
      console.log(`💾 Saved AI output to ${renderedImagePath} (${(outBuf.length / 1024).toFixed(1)} KB)`);
    } catch (dlErr) {
      console.error(`⚠️ Could not save output image:`, dlErr.message);
    }
  }

  return {
    ...testItem,
    success: !!outputUrl,
    jobId,
    latency: latencySec,
    outputUrl,
    modelImagePath: modelPath,
    garmentImagePath: garmentLocalPath,
    renderedImagePath: outputUrl ? renderedImagePath : null,
    status: outputUrl ? 200 : 500,
    garmentTitle: testItem.garment.title,
    garmentBrand: testItem.garment.brand,
    garmentPrice: testItem.garment.price
  };
}

// Master Runner across All 6 Countries
async function runMasterBenchmark() {
  console.log('================================================================');
  console.log('🌍 SHOPSMART AI - 6-COUNTRY VTON PRODUCTION BENCHMARK SUITE 🌍');
  console.log('================================================================');
  console.log(`Total tests scheduled: ${TEST_MATRIX.length}`);
  console.log(`Markets: IN (India), US (USA), UK (United Kingdom), CA (Canada), AU (Australia), AE (UAE)`);
  console.log(`Categories per market: Men Upper, Men Lower, Women Upper, Women Lower, Kids Boy, Kids Girl\n`);

  const results = [];
  const logFile = path.join(RESULTS_DIR, 'benchmark_log.json');
  const pdfFile = path.join(PROJECT_ROOT, 'MASS_VTON_TESTING_AUDIT_REPORT.pdf');
  const mdFile = path.join(PROJECT_ROOT, 'MASS_VTON_TESTING_AUDIT_REPORT.md');

  for (let i = 0; i < TEST_MATRIX.length; i++) {
    const item = TEST_MATRIX[i];
    const res = await runSingleTest(item);
    results.push(res);
    fs.writeFileSync(logFile, JSON.stringify(results, null, 2));

    // Update Markdown dynamically after each test so progress is saved live
    let mdContent = `# 🌍 ShopSmart AI Virtual Try-On - Global 6-Market Mass Testing Audit\n\n`;
    mdContent += `**Date:** ${new Date().toISOString()}\n`;
    mdContent += `**Engine:** PixelAPI-Neural-VTON (Diffusion Pipeline v2.4)\n`;
    mdContent += `**Completed Tests:** ${results.length} / ${TEST_MATRIX.length}\n`;
    const passCount = results.filter(r => r.success).length;
    const avgLat = (results.reduce((a, r) => a + (r.latency || 0), 0) / (results.length || 1)).toFixed(1);
    mdContent += `**Pass Rate:** ${((passCount / results.length) * 100).toFixed(0)}% (${passCount}/${results.length})\n`;
    mdContent += `**Average End-to-End Latency:** ${avgLat}s\n\n`;

    mdContent += `## 📋 Detailed Country Matrix Results\n\n`;
    mdContent += `| Country | Gender | Type | Garment Title | Price | Latency | Status |\n`;
    mdContent += `| :---: | :---: | :---: | :--- | :---: | :---: | :---: |\n`;

    for (const r of results) {
      const flag = r.country === 'IN' ? '🇮🇳' : r.country === 'US' ? '🇺🇸' : r.country === 'UK' ? '🇬🇧' : r.country === 'CA' ? '🇨🇦' : r.country === 'AU' ? '🇦🇺' : '🇦🇪';
      mdContent += `| ${flag} ${r.country} | ${r.gender.toUpperCase()} | ${r.categoryType} | ${r.garmentTitle?.slice(0, 60)} | ${r.garmentPrice} | ${r.latency.toFixed(1)}s | ${r.success ? '✅ PASS' : '❌ FAIL'} |\n`;
    }

    fs.writeFileSync(mdFile, mdContent);

    // Wait 3s between tests
    if (i < TEST_MATRIX.length - 1) {
      console.log('⏳ Pausing 3s before next test...');
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  console.log('\n================================================================');
  console.log('📊 GENERATING FINAL AUDIT PDF...');
  console.log('================================================================');

  await generateAuditPdf(results, pdfFile);
  console.log(`✅ Saved Visual Audit PDF: ${pdfFile}`);
  console.log('🎉 MASTER BENCHMARK SUITE COMPLETED SUCCESSFULLY!');
}

runMasterBenchmark().catch(console.error);
