async function runTest() {
  try {
    console.log("Sending test POST search request to local Next.js search API...");
    const response = await fetch("http://localhost:3000/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: "Best gaming laptop under ₹50,000",
        country: "IN"
      })
    });

    console.log("Response Status:", response.status);
    const data = await response.json();
    console.log("Response JSON Data:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Test Request Failed:", err);
  }
}

runTest();
