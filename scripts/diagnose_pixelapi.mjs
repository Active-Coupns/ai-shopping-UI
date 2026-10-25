import fs from 'fs';
import path from 'path';

async function testSubmit() {
  const envText = fs.readFileSync('.env.local', 'utf8');
  let key = '';
  for (const line of envText.split('\n')) {
    if (line.startsWith('PIXELAPI_KEY=')) {
      key = line.split('=')[1].trim();
    }
  }

  const modelPath = path.join(process.cwd(), 'public', 'models', 'men_model.jpg');
  const modelBuf = fs.readFileSync(modelPath);
  const personB64 = modelBuf.toString('base64');

  // Fetch a clean garment image
  const garmentUrl = "https://assets.myntassets.com/assets/images/2026/APRIL/28/2ahKMACa_610ff4aab81247e59dd8d3d1eb4793f8.jpg";
  console.log('Fetching garment image...');
  const gRes = await fetch(garmentUrl);
  const gBuf = Buffer.from(await gRes.arrayBuffer());
  const garmentB64 = gBuf.toString('base64');

  console.log('Person b64 len:', personB64.length, 'Garment b64 len:', garmentB64.length);
  console.log('Submitting to PixelAPI...');

  const t0 = Date.now();
  const res = await fetch("https://api.pixelapi.dev/v1/virtual-tryon", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${key}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      person_image: personB64,
      garment_image: garmentB64,
      category: "upperbody",
      n_samples: 1,
      n_steps: 22,
      ephemeral: true,
      auto_delete: true
    })
  });

  console.log('Response status:', res.status, 'Time:', ((Date.now() - t0)/1000).toFixed(2) + 's');
  const bodyText = await res.text();
  console.log('Response body:', bodyText);
}

testSubmit().catch(console.error);
