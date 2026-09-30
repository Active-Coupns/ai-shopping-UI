import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'src', 'data');
const jsonPath = path.join(dataDir, 'fashionCatalog.json');
const jsPath = path.join(dataDir, 'fashionCatalog.js');

let catalog = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

const additionalCategories = [
  // 10. WOMEN SAREES
  {
    id: "fashion-women_sarees-1-1790454600001",
    gender: "women",
    category: "women_sarees",
    category_label: "Sarees & Party Ethnic",
    title: "Mitera Pink & Gold-Toned Pure Georgette Festive Saree with Blouse Piece",
    brand: "Mitera",
    color: "Pink",
    price: "₹1,249",
    raw_price: 1249,
    original_price: "₹3,999",
    discount_percent: 68,
    store: "Myntra",
    direct_link: "https://www.myntra.com/sarees/mitera/mitera-pink--gold-toned-pure-georgette-festive-saree/19283741/buy",
    deal_link: "https://www.myntra.com/sarees/mitera/mitera-pink--gold-toned-pure-georgette-festive-saree/19283741/buy",
    image: "https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/19283741/2022/8/12/f2a4f66a-04b3-46ea-9d89-63a562efb25e1660292723611MiteraPinkGeorgetteSaree1.jpg",
    image_url: "https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/19283741/2022/8/12/f2a4f66a-04b3-46ea-9d89-63a562efb25e1660292723611MiteraPinkGeorgetteSaree1.jpg",
    fabric: "Pure Georgette & Zari Woven Border",
    occasion: "Weddings, Receptions & Formal Events",
    fit: "Traditional 5.5m Drape",
    rating: 4.5,
    reviews_count: 820,
    tryon_compatible: true,
    price_comparison: [
      {
        store_name: "Myntra",
        price: 1249,
        deal_link: "https://www.myntra.com/sarees/mitera/mitera-pink--gold-toned-pure-georgette-festive-saree/19283741/buy",
        is_lowest: true
      },
      {
        store_name: "Ajio",
        price: 1399,
        deal_link: "https://www.ajio.com/s/sarees-4444-8888",
        is_lowest: false
      }
    ]
  },
  {
    id: "fashion-women_sarees-2-1790454600002",
    gender: "women",
    category: "women_sarees",
    category_label: "Sarees & Party Ethnic",
    title: "Suta Midnight Blue Mulberry Silk Handwoven Festive Saree",
    brand: "Suta",
    color: "Navy",
    price: "₹2,450",
    raw_price: 2450,
    original_price: "₹3,200",
    discount_percent: 23,
    store: "Myntra",
    direct_link: "https://www.myntra.com/sarees/suta/suta-navy-blue-mulberry-silk-saree/18374920/buy",
    deal_link: "https://www.myntra.com/sarees/suta/suta-navy-blue-mulberry-silk-saree/18374920/buy",
    image: "https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/18374920/2022/6/24/c4892c53-b0bf-4bfb-9fa1-a75d5069b1df1656066224213SutaBlueSaree1.jpg",
    image_url: "https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/18374920/2022/6/24/c4892c53-b0bf-4bfb-9fa1-a75d5069b1df1656066224213SutaBlueSaree1.jpg",
    fabric: "100% Handwoven Mulberry Silk",
    occasion: "Festive Poojas & Evening Gatherings",
    fit: "Classic Fluid Drape",
    rating: 4.7,
    reviews_count: 512,
    tryon_compatible: true,
    price_comparison: [
      {
        store_name: "Myntra",
        price: 2450,
        deal_link: "https://www.myntra.com/sarees/suta/suta-navy-blue-mulberry-silk-saree/18374920/buy",
        is_lowest: true
      }
    ]
  },
  {
    id: "fashion-women_sarees-3-1790454600003",
    gender: "women",
    category: "women_sarees",
    category_label: "Sarees & Party Ethnic",
    title: "Kalini Emerald Green Floral Embroidered Organza Saree",
    brand: "Kalini",
    color: "Green",
    price: "₹1,499",
    raw_price: 1499,
    original_price: "₹3,499",
    discount_percent: 57,
    store: "Myntra",
    direct_link: "https://www.myntra.com/sarees/kalini/kalini-green-embroidered-organza-saree/21094830/buy",
    deal_link: "https://www.myntra.com/sarees/kalini/kalini-green-embroidered-organza-saree/21094830/buy",
    image: "https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/21094830/2023/1/18/d32f51eb-9875-4b08-bcfa-193c6f4a3bf11674036987114KaliniGreenSaree1.jpg",
    image_url: "https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/21094830/2023/1/18/d32f51eb-9875-4b08-bcfa-193c6f4a3bf11674036987114KaliniGreenSaree1.jpg",
    fabric: "Premium Lightweight Organza Silk",
    occasion: "Cocktails, Engagements & Parties",
    fit: "Sheer Structured Drape",
    rating: 4.4,
    reviews_count: 340,
    tryon_compatible: true,
    price_comparison: [
      {
        store_name: "Myntra",
        price: 1499,
        deal_link: "https://www.myntra.com/sarees/kalini/kalini-green-embroidered-organza-saree/21094830/buy",
        is_lowest: true
      }
    ]
  },

  // 11. WOMEN OVERSIZED & GRAPHIC TEES
  {
    id: "fashion-women_tees-1-1790454600004",
    gender: "women",
    category: "women_tees",
    category_label: "Oversized & Graphic Tees",
    title: "Bewakoof Women Lavender Tokyo Typography Graphic Oversized T-Shirt",
    brand: "Bewakoof",
    color: "Lavender",
    price: "₹499",
    raw_price: 499,
    original_price: "₹999",
    discount_percent: 50,
    store: "Myntra",
    direct_link: "https://www.myntra.com/tshirts/bewakoof/bewakoof-women-lavender-oversized-t-shirt/23091823/buy",
    deal_link: "https://www.myntra.com/tshirts/bewakoof/bewakoof-women-lavender-oversized-t-shirt/23091823/buy",
    image: "https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/23091823/2023/5/11/4a29930f-b44c-41ad-a2f0-e4eef65507b91683802919102BewakoofLavenderTshirt1.jpg",
    image_url: "https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/23091823/2023/5/11/4a29930f-b44c-41ad-a2f0-e4eef65507b91683802919102BewakoofLavenderTshirt1.jpg",
    fabric: "100% Combed Bio-Washed Cotton",
    occasion: "Loungewear & Street Casual",
    fit: "Oversized Boxy Fit",
    rating: 4.6,
    reviews_count: 1420,
    tryon_compatible: true,
    price_comparison: [
      {
        store_name: "Myntra",
        price: 499,
        deal_link: "https://www.myntra.com/tshirts/bewakoof/bewakoof-women-lavender-oversized-t-shirt/23091823/buy",
        is_lowest: true
      },
      {
        store_name: "Bewakoof.com",
        price: 549,
        deal_link: "https://www.bewakoof.com/women-printed-t-shirts",
        is_lowest: false
      }
    ]
  },
  {
    id: "fashion-women_tees-2-1790454600005",
    gender: "women",
    category: "women_tees",
    category_label: "Oversized & Graphic Tees",
    title: "The Souled Store Women Off-White Friends Graphic Oversized Cotton T-Shirt",
    brand: "The Souled Store",
    color: "White",
    price: "₹799",
    raw_price: 799,
    original_price: "₹1,299",
    discount_percent: 38,
    store: "Myntra",
    direct_link: "https://www.myntra.com/tshirts/the-souled-store/the-souled-store-women-friends-oversized-tshirt/22419082/buy",
    deal_link: "https://www.myntra.com/tshirts/the-souled-store/the-souled-store-women-friends-oversized-tshirt/22419082/buy",
    image: "https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/22419082/2023/3/21/2e5e1927-4638-4e89-8d1e-873b8cb468a91679383619192SouledStoreTshirt1.jpg",
    image_url: "https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/22419082/2023/3/21/2e5e1927-4638-4e89-8d1e-873b8cb468a91679383619192SouledStoreTshirt1.jpg",
    fabric: "220 GSM 100% Terry Cotton",
    occasion: "College, Casual Outings & Weekends",
    fit: "Relaxed Drop Shoulder Fit",
    rating: 4.7,
    reviews_count: 2190,
    tryon_compatible: true,
    price_comparison: [
      {
        store_name: "Myntra",
        price: 799,
        deal_link: "https://www.myntra.com/tshirts/the-souled-store/the-souled-store-women-friends-oversized-tshirt/22419082/buy",
        is_lowest: true
      }
    ]
  },

  // 12. WOMEN CO-ORD SETS & BLAZERS
  {
    id: "fashion-women_coords-1-1790454600006",
    gender: "women",
    category: "women_coords",
    category_label: "Co-Ord Sets & Blazers",
    title: "Tokyo Talkies Women Beige Solid Blazer & Trousers Co-Ord Set",
    brand: "Tokyo Talkies",
    color: "Beige",
    price: "₹1,499",
    raw_price: 1499,
    original_price: "₹3,299",
    discount_percent: 54,
    store: "Myntra",
    direct_link: "https://www.myntra.com/co-ords/tokyo-talkies/tokyo-talkies-women-beige-blazer-trouser-set/21893012/buy",
    deal_link: "https://www.myntra.com/co-ords/tokyo-talkies/tokyo-talkies-women-beige-blazer-trouser-set/21893012/buy",
    image: "https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/21893012/2023/2/10/7c49e290-7bf0-4598-8bc2-10f845d4cecf1676019318192TokyoTalkiesBeigeCoord1.jpg",
    image_url: "https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/21893012/2023/2/10/7c49e290-7bf0-4598-8bc2-10f845d4cecf1676019318192TokyoTalkiesBeigeCoord1.jpg",
    fabric: "Premium Linen Poly Stretch Blend",
    occasion: "Modern Semi-Formal, Brunch & Meetings",
    fit: "Structured Tailored Fit",
    rating: 4.5,
    reviews_count: 670,
    tryon_compatible: true,
    price_comparison: [
      {
        store_name: "Myntra",
        price: 1499,
        deal_link: "https://www.myntra.com/co-ords/tokyo-talkies/tokyo-talkies-women-beige-blazer-trouser-set/21893012/buy",
        is_lowest: true
      },
      {
        store_name: "Ajio",
        price: 1699,
        deal_link: "https://www.ajio.com/s/blazers-coords",
        is_lowest: false
      }
    ]
  },
  {
    id: "fashion-women_coords-2-1790454600007",
    gender: "women",
    category: "women_coords",
    category_label: "Co-Ord Sets & Blazers",
    title: "Vero Moda Women Black Single-Breasted Formal Lapel Blazer",
    brand: "Vero Moda",
    color: "Black",
    price: "₹2,299",
    raw_price: 2299,
    original_price: "₹4,499",
    discount_percent: 48,
    store: "Myntra",
    direct_link: "https://www.myntra.com/blazers/vero-moda/vero-moda-women-black-formal-blazer/19873041/buy",
    deal_link: "https://www.myntra.com/blazers/vero-moda/vero-moda-women-black-formal-blazer/19873041/buy",
    image: "https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/19873041/2022/9/14/a12b4890-3cb1-49fa-87ec-f490bc891f9e1663158912301VeroModaBlazer1.jpg",
    image_url: "https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/19873041/2022/9/14/a12b4890-3cb1-49fa-87ec-f490bc891f9e1663158912301VeroModaBlazer1.jpg",
    fabric: "High-Grade Crepe Weave Poly Elastane",
    occasion: "Corporate Presentations & Formal Office",
    fit: "Classic Tailored Fit",
    rating: 4.8,
    reviews_count: 940,
    tryon_compatible: true,
    price_comparison: [
      {
        store_name: "Myntra",
        price: 2299,
        deal_link: "https://www.myntra.com/blazers/vero-moda/vero-moda-women-black-formal-blazer/19873041/buy",
        is_lowest: true
      }
    ]
  }
];

catalog.push(...additionalCategories);

fs.writeFileSync(jsonPath, JSON.stringify(catalog, null, 2), 'utf-8');
fs.writeFileSync(jsPath, `// Auto-generated Curated Fashion Master Catalog\nexport const FASHION_CATALOG = ${JSON.stringify(catalog, null, 2)};\n`, 'utf-8');

console.log(`✅ Master Fashion Catalog successfully updated with ${catalog.length} items across all 12 categories!`);
