const hasdataApiKey = "1b16d3c9-0c60-4b74-a1d9-4b9e6d1f479d";
const cleanQuery = "laptop 50000";
const domain = "google.co.in";
const gl = "in";
const hasdataUrl = `https://api.hasdata.com/scrape/google/serp?q=${encodeURIComponent(cleanQuery)}&domain=${domain}&gl=${gl}&tbm=shop&apiKey=${hasdataApiKey}`;

async function testHasData() {
  try {
    console.log("Fetching live data from HasData url...");
    const response = await fetch(hasdataUrl, {
      method: "GET",
      headers: {
        "x-api-key": hasdataApiKey,
        "Content-Type": "application/json"
      }
    });

    console.log("Response Status:", response.status);
    const data = await response.json();
    
    console.log("Top-level Response Keys:", Object.keys(data));
    if (data.requestInfo) {
      console.log("Request Info:", JSON.stringify(data.requestInfo, null, 2));
    }

    const shoppingResults = data.shoppingResults || data.shopping_results || [];
    console.log(`Found ${shoppingResults.length} shoppingResults items.`);
    if (shoppingResults.length > 0) {
      console.log("First shoppingResult item keys:", Object.keys(shoppingResults[0]));
      console.log("First shoppingResult item payload:", JSON.stringify(shoppingResults[0], null, 2));
    }

    const organicResults = data.organicResults || data.organic_results || [];
    console.log(`Found ${organicResults.length} organicResults items.`);
    if (organicResults.length > 0) {
      console.log("First organicResult item keys:", Object.keys(organicResults[0]));
      console.log("First organicResult item payload:", JSON.stringify(organicResults[0], null, 2));
    }
  } catch (err) {
    console.error("Fetch threw error:", err);
  }
}

testHasData();
