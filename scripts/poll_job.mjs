import fs from 'fs';
import path from 'path';

async function pollJob() {
  const envText = fs.readFileSync('.env.local', 'utf8');
  let key = '';
  for (const line of envText.split('\n')) {
    if (line.startsWith('PIXELAPI_KEY=')) {
      key = line.split('=')[1].trim();
    }
  }

  const jobId = "a8300ea8-197e-4eb2-98d9-3a591935fa5c";
  console.log(`Polling job ${jobId}...`);

  for (let i = 0; i < 40; i++) {
    await new Promise(r => setTimeout(r, 4000));
    const res = await fetch(`https://api.pixelapi.dev/v1/virtual-tryon/jobs/${jobId}`, {
      headers: { "Authorization": `Bearer ${key}` }
    });
    const data = await res.json();
    console.log(`[${i+1}] Status: ${data.status}`);
    if (data.status === 'completed' || data.status === 'succeeded') {
      const outputUrl = data.output_url || data.result_url || data.output_image_url;
      console.log('✅ COMPLETED! Output URL:', outputUrl);
      
      // Save image
      const imgRes = await fetch(outputUrl);
      const buf = Buffer.from(await imgRes.arrayBuffer());
      const outPath = path.join(process.cwd(), 'public', 'test_results', 'IN_men_upper.jpg');
      fs.writeFileSync(outPath, buf);
      console.log('Saved to', outPath, 'Bytes:', buf.length);
      break;
    } else if (data.status === 'failed') {
      console.log('❌ FAILED:', data);
      break;
    }
  }
}

pollJob().catch(console.error);
