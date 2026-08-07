// Test fetching and mapping via client service
async function testService() {
  try {
    console.log("Sending request to http://localhost:3000/api/search...");
    const response = await fetch("http://localhost:3000/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: "iPhone 16",
        country: "IN"
      })
    });

    const data = await response.json();
    const rawProducts = data.products || [];
    console.log(`Received ${rawProducts.length} raw products.`);

    if (rawProducts.length > 0) {
      const p = rawProducts[0];
      console.log("First raw product:", JSON.stringify(p, null, 2));

      // Re-map like services/api.js does:
      const mapped = {
        title: p.title,
        store: p.platform || "Online Store",
        rating: p.rating || "4.5",
        image: p.image,
        aiReason: p.description || "Great product.",
        affiliateUrl: p.link || "#"
      };

      console.log("Mapped fields verify:", JSON.stringify(mapped, null, 2));
    }
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

testService();
