const fs = require('fs');

async function checkPerformance() {
  const res = await fetch('https://ai-shopping-ui-arc-nesterstore.vercel.app');
  const html = await res.text();
  const scriptRegex = /src="(\/_next\/static\/[^"]+)"/g;
  const scripts = [];
  let match;
  while ((match = scriptRegex.exec(html)) !== null) {
    scripts.push(match[1]);
  }
  console.log('Total scripts found:', scripts.length);

  let totalSize = 0;
  for (const s of scripts) {
    const sRes = await fetch('https://ai-shopping-ui-arc-nesterstore.vercel.app' + s);
    const buf = await sRes.arrayBuffer();
    const kb = Math.round(buf.byteLength / 1024);
    totalSize += kb;
    console.log(`${kb} KB -> ${s}`);
  }
  console.log(`\nTOTAL JS transferred: ${totalSize} KB (${(totalSize / 1024).toFixed(2)} MB)`);
}

checkPerformance().catch(console.error);
