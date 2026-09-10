const serpapiApiKey = "e9b1512a6388a398c05d44895597291a52d0677e7e312420aee30998467c3e30";

async function runDiagnostic() {
  const query = "hiking boots";
  console.log(`Searching for "${query}" on Google Shopping...`);
  
  const searchUrl = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(query)}&gl=us&hl=en&api_key=${serpapiApiKey}`;
  const searchRes = await fetch(searchUrl);
  const searchData = await searchRes.json();
  const rawResults = searchData.shopping_results || [];
  
  console.log(`Found ${rawResults.length} raw results.`);
  
  const item = rawResults.find(r => r.serpapi_immersive_product_api);
  if (!item) {
    console.log("No product with immersive details api found.");
    return;
  }
  
  console.log(`Product: "${item.title}"`);
  console.log(`Immersive Details API URL: ${item.serpapi_immersive_product_api}`);
  
  const detailUrl = `${item.serpapi_immersive_product_api}&api_key=${serpapiApiKey}`;
  const detailRes = await fetch(detailUrl);
  const detailData = await detailRes.json();
  const stores = detailData.product_results?.stores || [];
  
  console.log(`Found ${stores.length} stores.`);
  stores.forEach((s, idx) => {
    console.log(`Store ${idx + 1}: ${s.name || s.store} | Link: ${s.link} | Price: ${s.price}`);
  });
}

runDiagnostic();
