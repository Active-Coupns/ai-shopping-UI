async function verifyHM() {
  const categories = [
    { key: "us_kids_boys_hoodies", label: "Boys Hoodies & Sweatshirts", url: "https://www2.hm.com/en_us/kids/boys/clothing/sweaters-sweatshirts/_jcr_content/main/productlisting.display.json" },
    { key: "us_kids_boys_tees", label: "Boys Graphic Tees & Polos", url: "https://www2.hm.com/en_us/kids/boys/clothing/tops-t-shirts.display.json" },
    { key: "us_kids_boys_pants", label: "Boys Jeans & Joggers", url: "https://www2.hm.com/en_us/kids/boys/clothing/jeans/_jcr_content/main/productlisting.display.json" },
    { key: "us_kids_girls_dresses", label: "Girls Dresses & Skirts", url: "https://www2.hm.com/en_us/kids/girls/clothing/dresses/_jcr_content/main/productlisting.display.json" },
    { key: "us_kids_girls_sweaters", label: "Girls Sweaters & Cardigans", url: "https://www2.hm.com/en_us/kids/girls/clothing/sweaters-sweatshirts/_jcr_content/main/productlisting.display.json" },
    { key: "us_kids_girls_tops_sets", label: "Girls Tops & Sets", url: "https://www2.hm.com/en_us/kids/girls/clothing/tops-t-shirts/_jcr_content/main/productlisting.display.json" }
  ];

  for (const c of categories) {
    const res = await fetch(c.url, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" } });
    const d = await res.json();
    const products = d.products || [];
    console.log(`\n================== ${c.label} (${products.length} products) ==================`);
    products.slice(0, 3).forEach(p => {
      console.log("Title:", p.title);
      console.log("Price:", p.price);
      console.log("Link:", "https://www2.hm.com" + p.link);
      console.log("Image:", p.image?.[0]?.src);
      console.log("---");
    });
  }
}
verifyHM();
