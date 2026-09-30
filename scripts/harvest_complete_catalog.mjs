import fs from 'fs';
import path from 'path';

// Complete 24 Fashion Categories
export const MASTER_CATEGORIES = [
  // MEN (8 Categories)
  {
    gender: "men",
    categoryKey: "formal_shirts",
    categoryLabel: "Formal & Oxford Shirts",
    myntraSlug: "men-formal-shirts",
    defaultFabric: "100% Breathable Oxford Cotton",
    defaultOccasion: "Office & Formal Meetings",
    defaultFit: "Modern Slim Fit"
  },
  {
    gender: "men",
    categoryKey: "casual_shirts",
    categoryLabel: "Casual & Linen Shirts",
    myntraSlug: "men-casual-shirts",
    defaultFabric: "Premium Pure Linen Blend",
    defaultOccasion: "Casual Outing & Weekend Brunches",
    defaultFit: "Relaxed Cuban Fit"
  },
  {
    gender: "men",
    categoryKey: "drop_shoulder_tshirts",
    categoryLabel: "Drop-Shoulder & Oversized Tees",
    myntraSlug: "men-oversized-tshirts",
    defaultFabric: "240 GSM Heavyweight Terry Cotton",
    defaultOccasion: "Streetwear & College",
    defaultFit: "Relaxed Drop Shoulder"
  },
  {
    gender: "men",
    categoryKey: "polos",
    categoryLabel: "Classic & Textured Polos",
    myntraSlug: "polo-tshirts-men",
    defaultFabric: "100% Pique Cotton Knit",
    defaultOccasion: "Smart Casual & Evening Dinner",
    defaultFit: "Athletic Regular Fit"
  },
  {
    gender: "men",
    categoryKey: "ethnic_kurtas",
    categoryLabel: "Ethnic Kurtas & Nehru Sets",
    myntraSlug: "men-kurtas",
    defaultFabric: "Pure Handloom Slub Cotton",
    defaultOccasion: "Festive & Cultural Celebrations",
    defaultFit: "Classic Straight Fit"
  },
  {
    gender: "men",
    categoryKey: "blazers_suits",
    categoryLabel: "Blazers & Formal Suits",
    myntraSlug: "men-blazers",
    defaultFabric: "Premium Poly-Viscose Suiting Blend",
    defaultOccasion: "Weddings, Receptions & Black Tie",
    defaultFit: "Tailored Structured Fit"
  },
  {
    gender: "men",
    categoryKey: "jackets_hoodies",
    categoryLabel: "Jackets & Oversized Hoodies",
    myntraSlug: "men-jackets",
    defaultFabric: "Premium Windproof Cotton Fleece",
    defaultOccasion: "Winter & Evening Streetwear",
    defaultFit: "Modern Relaxed Fit"
  },
  {
    gender: "men",
    categoryKey: "men_trousers",
    categoryLabel: "Jeans, Chinos & Trousers",
    myntraSlug: "men-jeans",
    defaultFabric: "Stretch Denim & Cotton Twill",
    defaultOccasion: "Everyday Versatile Wear",
    defaultFit: "Tapered Regular Fit"
  },

  // WOMEN (10 Categories)
  {
    gender: "women",
    categoryKey: "women_kurtis",
    categoryLabel: "Kurtis & Anarkali Sets",
    myntraSlug: "women-kurtas-kurtis-suits",
    defaultFabric: "100% Pure Mulmul Cotton",
    defaultOccasion: "Festive, Daily & Office Ethnic",
    defaultFit: "Flared Anarkali Fit"
  },
  {
    gender: "women",
    categoryKey: "women_sarees",
    categoryLabel: "Sarees & Party Ethnic",
    myntraSlug: "sarees",
    defaultFabric: "Pure Satin Silk & Organza Blend",
    defaultOccasion: "Weddings, Receptions & Formal Events",
    defaultFit: "Traditional 5.5m Drape"
  },
  {
    gender: "women",
    categoryKey: "women_lehengas",
    categoryLabel: "Lehengas & Grand Festive Gowns",
    myntraSlug: "lehenga-choli",
    defaultFabric: "Embroidered Net & Velvet Zari",
    defaultOccasion: "Weddings, Sangeet & Grand Festivals",
    defaultFit: "Flared Royal Lehenga Fit"
  },
  {
    gender: "women",
    categoryKey: "women_dresses",
    categoryLabel: "Dresses & Maxi One-Pieces",
    myntraSlug: "dresses",
    defaultFabric: "Lightweight Breathable Georgette",
    defaultOccasion: "Vacation, Party & Date Nights",
    defaultFit: "Flowing A-Line Fit"
  },
  {
    gender: "women",
    categoryKey: "women_tops",
    categoryLabel: "Tops & Peplum Blouses",
    myntraSlug: "tops",
    defaultFabric: "Stretch Ribbed Cotton",
    defaultOccasion: "Casual Daywear & Parties",
    defaultFit: "Tailored Crop Fit"
  },
  {
    gender: "women",
    categoryKey: "women_coords",
    categoryLabel: "Co-Ord Sets & Pant-Suits",
    myntraSlug: "women-co-ords",
    defaultFabric: "Premium Linen Poly Stretch",
    defaultOccasion: "Modern Semi-Formal & Brunch",
    defaultFit: "Structured Tailored Fit"
  },
  {
    gender: "women",
    categoryKey: "women_shirts",
    categoryLabel: "Workwear Shirts & Formal Tops",
    myntraSlug: "women-shirts",
    defaultFabric: "100% Smooth Cotton Poplin",
    defaultOccasion: "Corporate Office & Business Formal",
    defaultFit: "Clean Structured Fit"
  },
  {
    gender: "women",
    categoryKey: "women_tees",
    categoryLabel: "Oversized & Graphic Tees",
    myntraSlug: "women-tshirts",
    defaultFabric: "100% Combed Bio-Washed Cotton",
    defaultOccasion: "Loungewear & Street Casual",
    defaultFit: "Oversized Boxy Fit"
  },
  {
    gender: "women",
    categoryKey: "women_jackets",
    categoryLabel: "Winter Shrugs & Overcoats",
    myntraSlug: "women-jackets",
    defaultFabric: "Cashmere Wool Poly Blend",
    defaultOccasion: "Winterwear & Evening Layering",
    defaultFit: "Relaxed Trench & Overcoat Fit"
  },
  {
    gender: "women",
    categoryKey: "women_bottoms",
    categoryLabel: "Palazzos, Skirts & Wide Jeans",
    myntraSlug: "women-jeans",
    defaultFabric: "Soft Washed Breathable Denim",
    defaultOccasion: "Casual & Indo-Western Styling",
    defaultFit: "High-Waist Wide Leg"
  },

  // KIDS (6 Categories)
  {
    gender: "kids",
    categoryKey: "boys_shirts",
    categoryLabel: "Boys Party Shirts & Polos",
    myntraSlug: "boys-shirts",
    defaultFabric: "100% Soft Cotton",
    defaultOccasion: "Birthdays & Family Celebrations",
    defaultFit: "Comfort Regular Fit"
  },
  {
    gender: "kids",
    categoryKey: "boys_tees",
    categoryLabel: "Boys Graphic Tees & Casuals",
    myntraSlug: "boys-tshirts",
    defaultFabric: "100% Bio-Washed Cotton",
    defaultOccasion: "Daily Casual & Playwear",
    defaultFit: "Regular Fit"
  },
  {
    gender: "kids",
    categoryKey: "boys_ethnic",
    categoryLabel: "Boys Ethnic Kurta-Dhoti Sets",
    myntraSlug: "boys-ethnic-wear",
    defaultFabric: "Pure Handloom Cotton Silk",
    defaultOccasion: "Diwali, Weddings & Puja Events",
    defaultFit: "Traditional Straight Fit"
  },
  {
    gender: "kids",
    categoryKey: "girls_frocks",
    categoryLabel: "Girls Frocks & Party Dresses",
    myntraSlug: "girls-dresses",
    defaultFabric: "Soft Georgette & Tulle Net",
    defaultOccasion: "Birthdays & Princess Parties",
    defaultFit: "Flared Ballerina Fit"
  },
  {
    gender: "kids",
    categoryKey: "girls_ethnic",
    categoryLabel: "Girls Ethnic Lehengas & Kurtis",
    myntraSlug: "girls-ethnic-wear",
    defaultFabric: "Zari Embroidered Brocade & Silk",
    defaultOccasion: "Festive Poojas & Wedding Functions",
    defaultFit: "Flared Lehenga Choli"
  },
  {
    gender: "kids",
    categoryKey: "girls_casuals",
    categoryLabel: "Girls Tops & Co-Ord Sets",
    myntraSlug: "girls-tops",
    defaultFabric: "100% Breathable Ribbed Cotton",
    defaultOccasion: "Outings & Vacation Fun",
    defaultFit: "Comfort Fit"
  }
];

export function extractProductsFromHtml(html, catDef) {
  const products = [];

  // Method 1: Extract Myntra window.__myx JSON
  const match = html.match(/window\.__myx\s*=\s*(\{.*?\});<\/script>/s);
  if (match) {
    try {
      const data = JSON.parse(match[1]);
      const rawProducts = data?.searchData?.results?.products || [];
      for (const p of rawProducts) {
        const id = `myntra-${p.productId || p.id || Math.random().toString(36).substring(2, 9)}`;
        const title = p.productName || p.additionalInfo || `${p.brand} ${catDef.categoryLabel}`;
        const brand = p.brand || "Premium Brand";
        const price = p.price || 999;
        const originalPrice = p.mrp || Math.round(price * 1.4);
        const discount = p.discountDisplayLabel || `${Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF`;
        const directLink = p.landingPageUrl ? `https://www.myntra.com/${p.landingPageUrl}` : `https://www.myntra.com/${catDef.myntraSlug}`;
        
        let imageUrl = p.images?.[0]?.src || p.searchImage || "";
        if (imageUrl && !imageUrl.startsWith("http")) {
          imageUrl = `https://assets.myntassets.com/${imageUrl}`;
        }

        if (title && price && imageUrl) {
          products.push({
            id,
            gender: catDef.gender,
            category: catDef.categoryKey,
            category_label: catDef.categoryLabel,
            title,
            brand,
            color: p.primaryColour || "Multicolor",
            price: `₹${Number(price).toLocaleString('en-IN')}`,
            raw_price: Number(price),
            original_price: `₹${Number(originalPrice).toLocaleString('en-IN')}`,
            discount_percent: parseInt(discount.replace(/[^0-9]/g, ''), 10) || 40,
            store: "Myntra",
            direct_link: directLink,
            deal_link: directLink,
            image: imageUrl,
            image_url: imageUrl,
            description: p.description || `${brand} ${title} in premium ${catDef.defaultFabric}. Suitable for ${catDef.defaultOccasion}.`,
            fabric: p.articleAttributes?.Fabric || catDef.defaultFabric,
            occasion: p.articleAttributes?.Occasion || catDef.defaultOccasion,
            fit: p.articleAttributes?.Fit || catDef.defaultFit,
            rating: p.rating ? parseFloat(p.rating.toFixed(1)) : 4.4,
            reviews_count: p.ratingCount || 340,
            tryon_compatible: true,
            price_comparison: [
              {
                store_name: "Myntra",
                price: Number(price),
                deal_link: directLink,
                is_lowest: true
              },
              {
                store_name: "Ajio",
                price: Math.round(Number(price) * 1.08),
                deal_link: `https://www.ajio.com/search/?text=${encodeURIComponent(brand + ' ' + title)}`,
                is_lowest: false
              }
            ]
          });
        }
      }
    } catch (e) {
      console.warn(`JSON parse failed for ${catDef.categoryKey}:`, e.message);
    }
  }

  return products;
}
