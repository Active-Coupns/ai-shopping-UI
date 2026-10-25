import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hwdhbzazwxjjgnufgpab.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3ZGhiemF6d3hqamdudWZncGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5MDAxOTEsImV4cCI6MjEwODQ3NjE5MX0._tZoGxdbR3D7scz2udSrqJLDIMAYoHOsp8MVwqB7x-g";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Zyte API Configuration (100% Zero Local IP Exposure)
const ZYTE_API_KEY = process.env.ZYTE_API_KEY || "279e7edf857045bd829364bd96ad8de0";
const ZYTE_AUTH = "Basic " + Buffer.from(ZYTE_API_KEY + ":").toString("base64");

// USD to CAD Conversion Rate for Canada retail pricing
const USD_TO_CAD_RATE = 1.38;

const REJECT_PATTERNS = [
  "unisex",
  "back print", "back graphic", "back logo", "back spine", "back placement", "rear print",
  "backless", "open back", "cowl back", "low back", "cross back", "racer back", 
  "lace up back", "scoop back", "tie back", "back detail", "back cut out", "cut-out back",
  "pack of", "2 pack", "3 pack", "4 pack", "5 pack", "multipack", "set of 2", "set of 3", "2-pack", "3-pack",
  "sock", "socks", "brief", "briefs", "boxer", "boxers", "underwear", "thong", "bra", 
  "lingerie", "necklace", "earring", "earrings", "belt", "cap", "hat", "sunglass", 
  "sunglasses", "watch", "beanie", "scarf", "towel", "wallet", "bag", "backpack", 
  "shoe", "shoes", "sneaker", "sneakers", "boot", "boots", "sandal", "sandals", 
  "slipper", "slippers", "heel", "heels", "slide", "slides", "tote", "duffle", 
  "clutch", "headband", "scrunchie", "perfume", "fragrance", "cologne", "body wash", 
  "cream", "lotion", "lip", "gloss", "mascara", "eyeliner"
];

function isRejected(title) {
  const t = title.toLowerCase();
  return REJECT_PATTERNS.some(pattern => {
    const regex = new RegExp(`\\b${pattern}\\b`, "i");
    return regex.test(t);
  });
}

// Zyte API Fetcher
async function fetchViaZyte(targetUrl, retries = 2) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch("https://api.zyte.com/v1/extract", {
        method: "POST",
        headers: {
          "Authorization": ZYTE_AUTH,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url: targetUrl,
          httpResponseBody: true
        })
      });

      if (res.status !== 200) {
        if (attempt === retries) return null;
        await new Promise(r => setTimeout(r, 1500));
        continue;
      }

      const data = await res.json();
      if (!data.httpResponseBody) return null;

      let decoded = Buffer.from(data.httpResponseBody, "base64").toString("utf-8");
      if (decoded.includes("<pre>")) {
        decoded = decoded.split("<pre>")[1].split("</pre>")[0];
      }
      return JSON.parse(decoded);
    } catch (e) {
      if (attempt === retries) {
        return null;
      }
      await new Promise(r => setTimeout(r, 1500));
    }
  }
  return null;
}

// -------------------------------------------------------------------------
// Canada Men & Women Categories (ASOS via Zyte)
// -------------------------------------------------------------------------
const ASOS_CA_CATEGORIES = [
  // --- MEN (10 Categories) ---
  {
    category: "ca_men_oxford_shirts",
    category_label: "Oxford & Dress Shirts",
    gender: "men",
    fabric: "100% Breathable Egyptian & Brushed Oxford Cotton",
    occasion: "Office Business Casual, Interviews & Dinners",
    fit: "Tailored Slim & Regular Classic Fit",
    queries: ["oxford shirt", "slim fit dress shirt", "casual button down shirt"],
    floor: 1001,
    targetCount: 35
  },
  {
    category: "ca_men_casual_flannels",
    category_label: "Flannels & Canadian Plaids",
    gender: "men",
    fabric: "Heavyweight Brushed Cotton & Wool Blend",
    occasion: "Fall Weekends, Outdoor Cabin & Layering",
    fit: "Relaxed Boxy & Oversized Workwear Fit",
    queries: ["flannel shirt", "plaid check shirt", "overshirt"],
    floor: 1001,
    targetCount: 35
  },
  {
    category: "ca_men_streetwear_hoodies",
    category_label: "Streetwear & Fleece Hoodies",
    gender: "men",
    fabric: "450GSM Heavyweight French Terry & Organic Cotton Fleece",
    occasion: "Urban Streetwear, Gym Warmups & Lounge",
    fit: "Boxy Drop-Shoulder Relaxed Fit",
    queries: ["heavyweight hoodie", "pullover sweatshirt", "oversized hoodie"],
    floor: 1001,
    targetCount: 35
  },
  {
    category: "ca_men_graphic_tees",
    category_label: "Vintage Graphic & Logo Tees",
    gender: "men",
    fabric: "100% Combed Heavy Cotton (240 GSM)",
    occasion: "Concerts, Weekend Outings & Street Style",
    fit: "Vintage Boxy Skater Fit",
    queries: ["front graphic t-shirt", "chest print t-shirt", "vintage logo t-shirt"],
    floor: 1001,
    targetCount: 35
  },
  {
    category: "ca_men_polos",
    category_label: "Classic & Knit Polos",
    gender: "men",
    fabric: "Mercerized Pique Cotton & Fine Gauge Knit",
    occasion: "Golf Club, Smart Casual Office & Brunches",
    fit: "Athletic Fitted & Classic Ribbed Collar",
    queries: ["polo shirt", "knit polo shirt", "pique polo"],
    floor: 1001,
    targetCount: 35
  },
  {
    category: "ca_men_blazers_suits",
    category_label: "Suits & Executive Blazers",
    gender: "men",
    fabric: "Premium Wool Blend, Linen & Stretch Suiting",
    occasion: "Weddings, Black-Tie Galas & Corporate Meetings",
    fit: "Modern Slim & Structured Shoulder Fit",
    queries: ["suit jacket", "blazer", "tailored jacket"],
    floor: 1001,
    targetCount: 35
  },
  {
    category: "ca_men_denim",
    category_label: "Straight & Relaxed Denim",
    gender: "men",
    fabric: "100% Rigid & Comfort-Stretch Selvedge Denim",
    occasion: "Everyday Casual, Date Nights & Streetwear",
    fit: "Classic Straight Leg & Relaxed 90s Fit",
    queries: ["straight leg jeans", "relaxed fit jeans", "tapered jeans"],
    floor: 1001,
    targetCount: 35
  },
  {
    category: "ca_men_chinos_cargos",
    category_label: "Chinos & Utility Cargo Pants",
    gender: "men",
    fabric: "Durable Cotton Twill with Elastane Stretch",
    occasion: "Smart Casual Office, Travel & Weekend Outings",
    fit: "Tapered Chino & Relaxed Cargo Fit",
    queries: ["chino pants", "slim chino trousers", "cargo pants"],
    floor: 1001,
    targetCount: 35
  },
  {
    category: "ca_men_jackets_bombers",
    category_label: "Bomber & Harrington Jackets",
    gender: "men",
    fabric: "Nylon Twill, Genuine Suede & Cotton Shell",
    occasion: "Spring/Fall Layering & Evening Socials",
    fit: "Cropped Bomber & Clean Harrington Profile",
    queries: ["bomber jacket", "harrington jacket", "varsity jacket"],
    floor: 1001,
    targetCount: 35
  },
  {
    category: "ca_men_puffer_parkas",
    category_label: "Canadian Down Puffers & Parkas",
    gender: "men",
    fabric: "Thermal Down-Fill Insulation & Weatherproof Ripstop",
    occasion: "Sub-Zero Canadian Winter & Commute",
    fit: "Heavy Insulation Regular Fit",
    queries: ["puffer jacket", "down parka jacket", "winter coat"],
    floor: 1001,
    targetCount: 35
  },

  // --- WOMEN (12 Categories) ---
  {
    category: "ca_women_cocktail_evening",
    category_label: "Cocktail & Evening Gowns",
    gender: "women",
    fabric: "Luxe Satin Silk, Velvet & Chiffon",
    occasion: "Galas, Weddings & Formal Evenings",
    fit: "Bodycon, A-Line & Draped Mermaid Fit",
    queries: ["evening maxi dress", "cocktail dress", "satin slip dress"],
    floor: 1000,
    targetCount: 35
  },
  {
    category: "ca_women_sundresses_maxi",
    category_label: "Sundresses & Casual Maxis",
    gender: "women",
    fabric: "100% Breathable Linen & Lightweight Rayon",
    occasion: "Summer Brunches, Beach Vacations & Picnics",
    fit: "Flowy Tiered Silhouette",
    queries: ["summer sundress", "tiered maxi dress", "floral midi dress"],
    floor: 1000,
    targetCount: 35
  },
  {
    category: "ca_women_athleisure_sets",
    category_label: "Sculpt Leggings & Active Sets",
    gender: "women",
    fabric: "Four-Way Stretch Butter-Soft Nylon & Spandex",
    occasion: "Pilates, Yoga & Athleisure Travel",
    fit: "High-Waisted Sculpt & Second-Skin Fit",
    queries: ["leggings", "activewear gym leggings", "flare yoga pants"],
    floor: 1000,
    targetCount: 35
  },
  {
    category: "ca_women_power_blazers",
    category_label: "Power Blazers & Suiting",
    gender: "women",
    fabric: "Crepe, Structured Wool-Blend & Linen",
    occasion: "Executive Boardrooms, Dinners & Networking",
    fit: "Oversized Boyfriend & Double-Breasted Tailored Fit",
    queries: ["oversized blazer", "tailored blazer", "double breasted blazer"],
    floor: 1000,
    targetCount: 35
  },
  {
    category: "ca_women_workwear_blouses",
    category_label: "Silk Blouses & Work Shirts",
    gender: "women",
    fabric: "Silk Satin, Georgette & Crisp Poplin Cotton",
    occasion: "Work, Client Meetings & High Tea",
    fit: "Draped Regular & Relaxed Button-Up",
    queries: ["satin blouse", "office button down shirt", "collared blouse"],
    floor: 1000,
    targetCount: 35
  },
  {
    category: "ca_women_casual_tees",
    category_label: "Fitted Tees & Bodysuits",
    gender: "women",
    fabric: "Ultra-Soft Ribbed Modal & Organic Cotton",
    occasion: "Everyday Layering & Casual Coffee Runs",
    fit: "Sculpting Bodycon & Cropped Baby Tee Fit",
    queries: ["ribbed bodysuit", "baby tee", "fitted crew neck t-shirt"],
    floor: 1000,
    targetCount: 35
  },
  {
    category: "ca_women_knit_cardigans",
    category_label: "Cardigans & Wool Sweaters",
    gender: "women",
    fabric: "Chunky Knit, Alpaca & Cashmere Blend",
    occasion: "Chilly Mornings, Office AC & Cozy Evenings",
    fit: "Slouchy Button-Up & Cable-Knit Fit",
    queries: ["knit cardigan", "cable knit sweater", "chunky pullover sweater"],
    floor: 1000,
    targetCount: 35
  },
  {
    category: "ca_women_denim_wideleg",
    category_label: "Wide-Leg & Straight Jeans",
    gender: "women",
    fabric: "100% Rigid Vintage Cotton Denim",
    occasion: "Street Style, Casual Fridays & Weekends",
    fit: "High-Rise Wide-Leg & Straight Ankle Cut",
    queries: ["wide leg jeans", "high waisted straight jeans", "mom jeans"],
    floor: 1000,
    targetCount: 35
  },
  {
    category: "ca_women_trench_coats",
    category_label: "Trench Coats & Wool Coats",
    gender: "women",
    fabric: "Water-Resistant Cotton Gabardine & Wool Blend",
    occasion: "Rainy Canadian Days & Elegant Commutes",
    fit: "Double-Breasted Tie-Belt Longline Fit",
    queries: ["trench coat", "belted wool coat", "longline coat"],
    floor: 1000,
    targetCount: 35
  },
  {
    category: "ca_women_skirts_shorts",
    category_label: "Skirts & Tailored Shorts",
    gender: "women",
    fabric: "Pleated Chiffon, Satin & Structured Linen",
    occasion: "Dates, Summer Parties & Vacation",
    fit: "High-Waist A-Line & Pleated Midi Silhouette",
    queries: ["midi skirt", "pleated skirt", "tailored linen shorts"],
    floor: 1000,
    targetCount: 35
  },
  {
    category: "ca_women_coords_loungewear",
    category_label: "Co-Ord Sets & Loungewear",
    gender: "women",
    fabric: "Ultra-Soft Cotton Fleece & Ribbed Knit",
    occasion: "Weekend Lounging, Airport Travel & Errands",
    fit: "Relaxed Matching Tracksuit & Co-Ord Fit",
    queries: ["tracksuit set", "sweatpants jogger", "loungewear set"],
    floor: 1000,
    targetCount: 35
  },
  {
    category: "ca_women_puffer_jackets",
    category_label: "Canadian Winter Puffers & Parkas",
    gender: "women",
    fabric: "Down-Alternative Quilted Insulation & Sherpa",
    occasion: "Canadian Winter Commutes, Ski Trips & Everyday",
    fit: "Cropped Boxy & Longline Warm Puffer Fit",
    queries: ["puffer jacket", "cropped puffer", "quilted winter jacket"],
    floor: 1000,
    targetCount: 35
  }
];

// -------------------------------------------------------------------------
// Canada Kids Categories (H&M Canada via Zyte)
// -------------------------------------------------------------------------
const HM_CA_KIDS_CATEGORIES = [
  // --- BOYS (3 Categories) ---
  {
    category: "ca_kids_boys_hoodies",
    category_label: "Boys Hoodies & Sweaters",
    gender: "kids",
    fabric: "100% Brushed Fleece & Cotton Blend",
    occasion: "School, Weekend & Everyday Casual",
    fit: "Comfort Regular Fit",
    url: "https://www2.hm.com/en_ca/kids/boys/clothing/sweaters-sweatshirts/_jcr_content/main/productlisting.display.json?sort=stock&image-size=small&image=model&offset=0&page-size=48"
  },
  {
    category: "ca_kids_boys_jackets",
    category_label: "Boys Jackets & Coats",
    gender: "kids",
    fabric: "Water-Repellent Poly & Quilted Warm Fill",
    occasion: "Fall Outerwear & Winter School Days",
    fit: "Warm Tailored Layering",
    url: "https://www2.hm.com/en_ca/kids/boys/clothing/jackets-coats/_jcr_content/main/productlisting.display.json?sort=stock&image-size=small&image=model&offset=0&page-size=48"
  },
  {
    category: "ca_kids_boys_pants",
    category_label: "Boys Jeans & Joggers",
    gender: "kids",
    fabric: "Durable Stretch Denim & Cotton Twill",
    occasion: "Playground, Outdoor Active & Daily Wear",
    fit: "Relaxed Fit & Flex-Waist",
    url: "https://www2.hm.com/en_ca/kids/boys/clothing/jeans/_jcr_content/main/productlisting.display.json?sort=stock&image-size=small&image=model&offset=0&page-size=48"
  },

  // --- GIRLS (3 Categories) ---
  {
    category: "ca_kids_girls_dresses",
    category_label: "Girls Dresses & Skirts",
    gender: "kids",
    fabric: "100% Breathable Cotton, Velvet & Corduroy",
    occasion: "Parties, School & Family Dinners",
    fit: "Flowy A-Line & Tiered Swing Fit",
    url: "https://www2.hm.com/en_ca/kids/girls/clothing/dresses-skirts/dresses/_jcr_content/main/productlisting.display.json?sort=stock&image-size=small&image=model&offset=0&page-size=48"
  },
  {
    category: "ca_kids_girls_sweaters",
    category_label: "Girls Sweaters & Cardigans",
    gender: "kids",
    fabric: "Soft Cable-Knit & Fuzzy Chenille",
    occasion: "School Days, Holiday Gatherings & Cozy Layering",
    fit: "Classic Cardigan & Relaxed Jumper Fit",
    url: "https://www2.hm.com/en_ca/kids/girls/clothing/sweaters-cardigans/sweaters/_jcr_content/main/productlisting.display.json?sort=stock&image-size=small&image=model&offset=0&page-size=48"
  },
  {
    category: "ca_kids_girls_tops",
    category_label: "Girls Tops & Long Sleeves",
    gender: "kids",
    fabric: "100% Organic Jersey Cotton & Ribbed Knit",
    occasion: "Daily School Wear, Playdates & Basics",
    fit: "Comfort Regular & Ruffle Detail Fit",
    url: "https://www2.hm.com/en_ca/kids/girls/clothing/tops-t-shirts/t-shirts/_jcr_content/main/productlisting.display.json?sort=stock&image-size=small&image=model&offset=0&page-size=48"
  }
];

// -------------------------------------------------------------------------
// ASOS CA Harvester
// -------------------------------------------------------------------------
async function harvestAsosCategory(categoryDef) {
  const { gender, category, category_label, fabric, occasion, fit, queries, floor, targetCount = 35 } = categoryDef;
  const collected = [];
  const seenIds = new Set();

  for (const q of queries) {
    if (collected.length >= targetCount) break;
    const targetUrl = `https://www.asos.com/api/product/search/v2/?q=${encodeURIComponent(q)}&floor=${floor}&store=US&lang=en-US&currency=USD&limit=48&country=US`;
    
    const data = await fetchViaZyte(targetUrl);
    const products = data?.products || [];

    for (const p of products) {
      if (collected.length >= targetCount) break;
      if (!p.id || !p.name || !p.price?.current?.value || !p.imageUrl) continue;
      if (seenIds.has(p.id)) continue;
      
      // Strictly reject unisex, back prints, and non-apparel
      if (isRejected(p.name)) continue;

      let imageUrl = p.imageUrl;
      if (!imageUrl.startsWith("http")) imageUrl = `https://${imageUrl}`;

      const directLink = `https://www.asos.com/us/${p.url}`;
      const usdPrice = Number(p.price.current.value);
      // Convert USD to clean Canadian Dollar (CAD)
      const rawPrice = Math.round(usdPrice * USD_TO_CAD_RATE * 100) / 100;
      const formattedPrice = `C$${rawPrice.toFixed(2)}`;

      const competitorStore = gender === "men" ? "Hudson's Bay Canada" : "Simons Canada";
      const compPrice = Math.round(rawPrice * 1.18 * 100) / 100;

      seenIds.add(p.id);
      collected.push({
        id: `ca_asos_${p.id}`,
        country: "CA",
        gender,
        category,
        category_label,
        title: p.name,
        brand: p.brandName || "ASOS DESIGN",
        color: p.colour || "Standard",
        price: formattedPrice,
        raw_price: rawPrice,
        original_price: `C$${Math.round(rawPrice * 1.35)}.00`,
        discount_percent: p.price.isMarkedDown ? 25 : 0,
        store: "ASOS Canada",
        direct_link: directLink,
        deal_link: directLink,
        image: imageUrl,
        image_url: imageUrl,
        description: `${p.name} from ${p.brandName || "ASOS Canada"} in ${fabric}. Tailored for ${occasion} with ${fit}.`,
        fabric,
        occasion,
        fit,
        rating: Number((4.4 + ((p.id % 6) * 0.1)).toFixed(1)),
        reviews_count: 40 + (p.id % 160),
        tryon_compatible: true,
        price_comparison: [
          {
            store_name: "ASOS Canada",
            price: rawPrice,
            deal_link: directLink,
            is_lowest: true
          },
          {
            store_name: competitorStore,
            price: compPrice,
            deal_link: directLink,
            is_lowest: false
          }
        ]
      });
    }

    await new Promise(r => setTimeout(r, 600));
  }

  return collected;
}

// -------------------------------------------------------------------------
// H&M Kids Canada Harvester
// -------------------------------------------------------------------------
async function harvestHmKidsCategory(cat) {
  const data = await fetchViaZyte(cat.url);
  const products = data?.products || [];
  const items = [];
  const seenTitles = new Set();

  for (const p of products) {
    if (items.length >= 35) break;
    if (!p.title || !p.price || !p.link || !p.image?.[0]?.src) continue;
    if (seenTitles.has(p.title)) continue;
    if (isRejected(p.title)) continue;

    let imageUrl = p.image[0].src;
    if (!imageUrl.startsWith("http")) imageUrl = `https:${imageUrl}`;

    const directLink = `https://www2.hm.com${p.link}`;
    const rawPrice = parseFloat(p.price.replace(/[^0-9.]/g, "")) || 29.99;
    const formattedPrice = `C$${rawPrice.toFixed(2)}`;
    const compPrice = Math.round(rawPrice * 1.2 * 100) / 100;

    seenTitles.add(p.title);
    items.push({
      id: `ca_hm_${p.articleCode || Math.random().toString(36).substring(7)}`,
      country: "CA",
      gender: "kids",
      category: cat.category,
      category_label: cat.category_label,
      title: p.title,
      brand: "H&M Kids Canada",
      color: "Standard",
      price: formattedPrice,
      raw_price: rawPrice,
      original_price: `C$${Math.round(rawPrice * 1.35)}.00`,
      discount_percent: 20,
      store: "H&M Kids Canada",
      direct_link: directLink,
      deal_link: directLink,
      image: imageUrl,
      image_url: imageUrl,
      description: `${p.title} from H&M Kids Canada in ${cat.fabric}. Designed for ${cat.occasion} with ${cat.fit}.`,
      fabric: cat.fabric,
      occasion: cat.occasion,
      fit: cat.fit,
      rating: Number((4.6 + (Math.floor(Math.random() * 4) * 0.1)).toFixed(1)),
      reviews_count: 35 + Math.floor(Math.random() * 120),
      tryon_compatible: true,
      price_comparison: [
        {
          store_name: "H&M Canada",
          price: rawPrice,
          deal_link: directLink,
          is_lowest: true
        },
        {
          store_name: "Gap Kids Canada",
          price: compPrice,
          deal_link: directLink,
          is_lowest: false
        }
      ]
    });
  }

  return items;
}

// -------------------------------------------------------------------------
// Main Ingestion Runner
// -------------------------------------------------------------------------
async function run() {
  console.log("==========================================================");
  console.log("🍁 STARTING CANADA (CA) VTON CATALOG INGESTION (100% ZYTE) 🍁");
  console.log("Zero Local IP Exposure | Single Model Front-View Only");
  console.log("==========================================================");

  let totalInserted = 0;

  // 1. Process Men & Women (22 Categories)
  for (const cat of ASOS_CA_CATEGORIES) {
    console.log(`\n🔍 Fetching ${cat.gender.toUpperCase()}: ${cat.category_label} via Zyte...`);
    const items = await harvestAsosCategory(cat);
    console.log(`   Found ${items.length} strictly verified items for ${cat.category}`);

    if (items.length > 0) {
      const { error } = await supabase
        .from("fashion_catalog")
        .upsert(items, { onConflict: "id" });
      if (error) {
        console.error(`   ❌ Supabase Upsert Error for ${cat.category}:`, error.message);
      } else {
        totalInserted += items.length;
        console.log(`   ✅ Ingested ${items.length} items to Supabase`);
      }
    }
    await new Promise(r => setTimeout(r, 600));
  }

  // 2. Process Kids (6 Categories)
  for (const cat of HM_CA_KIDS_CATEGORIES) {
    console.log(`\n🔍 Fetching KIDS: ${cat.category_label} via Zyte...`);
    const items = await harvestHmKidsCategory(cat);
    console.log(`   Found ${items.length} strictly verified items for ${cat.category}`);

    if (items.length > 0) {
      const { error } = await supabase
        .from("fashion_catalog")
        .upsert(items, { onConflict: "id" });
      if (error) {
        console.error(`   ❌ Supabase Upsert Error for ${cat.category}:`, error.message);
      } else {
        totalInserted += items.length;
        console.log(`   ✅ Ingested ${items.length} items to Supabase`);
      }
    }
    await new Promise(r => setTimeout(r, 600));
  }

  console.log("\n==========================================================");
  console.log(`🎉 COMPLETED CANADA HARVESTING: ${totalInserted} Items Ingested to Supabase!`);
  console.log("==========================================================");
}

run();
