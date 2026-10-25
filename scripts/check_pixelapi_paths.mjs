import fs from 'fs';

async function checkAccount() {
  const envText = fs.readFileSync('.env.local', 'utf8');
  let key = '';
  for (const line of envText.split('\n')) {
    if (line.startsWith('PIXELAPI_KEY=')) {
      key = line.split('=')[1].trim();
    }
  }

  // Check /docs or swagger
  const res = await fetch("https://api.pixelapi.dev/openapi.json");
  const openapi = await res.json();
  console.log('Available paths in PixelAPI:');
  console.log(Object.keys(openapi.paths));
}

checkAccount().catch(console.error);
