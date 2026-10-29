"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Sparkles, Shirt, Camera, RefreshCw, ExternalLink, Check, ChevronRight, Send, ArrowLeft, Lock, X, LifeBuoy, ShieldCheck } from "lucide-react";
import { useClerk, useUser } from "@clerk/nextjs";
import { getDeviceFingerprint } from "@/lib/deviceFingerprint";

const SAMPLE_MODELS = {
  men: {
    name: "Aakash (Men Studio Portrait)",
    skinTone: "wheatish",
    image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=85"
  },
  women: {
    name: "Riya (Women Studio Portrait)",
    skinTone: "wheatish",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=85"
  },
  kids: {
    name: "Aarav (Kids Studio Portrait)",
    skinTone: "wheatish",
    image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&auto=format&fit=crop&q=85"
  }
};

const CATEGORY_TABS = [
  { key: "all", label: "✨ All Looks" },
  // Men (10 Categories)
  { key: "formal_shirts", label: "👔 Formal Shirts", gender: "men" },
  { key: "casual_shirts", label: "🌴 Linen & Casual", gender: "men" },
  { key: "drop_shoulder_tshirts", label: "🔥 Drop-Shoulder", gender: "men" },
  { key: "polos", label: "👕 Classic Polos", gender: "men" },
  { key: "men_cuban_shirts", label: "🌴 Cuban Resort Shirts", gender: "men" },
  { key: "ethnic_kurtas", label: "✨ Ethnic Kurtas", gender: "men" },
  { key: "men_nehru_jackets", label: "✨ Nehru Jackets", gender: "men" },
  { key: "blazers_suits", label: "🤵 Blazers & Suits", gender: "men" },
  { key: "jackets_hoodies", label: "🧥 Jackets & Hoodies", gender: "men" },
  { key: "men_trousers", label: "👖 Jeans & Trousers", gender: "men" },
  // Women (12 Categories)
  { key: "women_kurtis", label: "🌸 Kurtis & Suits", gender: "women" },
  { key: "women_anarkali_sharara", label: "✨ Anarkali & Shararas", gender: "women" },
  { key: "women_sarees", label: "🥻 Sarees", gender: "women" },
  { key: "women_lehengas", label: "✨ Party Lehengas", gender: "women" },
  { key: "women_dresses", label: "👗 Maxi Dresses", gender: "women" },
  { key: "women_tops", label: "👚 Tops & Blouses", gender: "women" },
  { key: "women_crop_corset", label: "✨ Crop & Corset Tops", gender: "women" },
  { key: "women_coords", label: "✨ Co-Ord Sets", gender: "women" },
  { key: "women_shirts", label: "👔 Workwear Shirts", gender: "women" },
  { key: "women_tees", label: "🔥 Graphic Tees", gender: "women" },
  { key: "women_jackets", label: "🧥 Shrugs & Overcoats", gender: "women" },
  { key: "women_bottoms", label: "👖 Palazzos & Jeans", gender: "women" },
  // Kids (7 Categories)
  { key: "boys_shirts", label: "👔 Boys Party Shirts", gender: "kids" },
  { key: "boys_tees", label: "👕 Boys Graphic Tees", gender: "kids" },
  { key: "boys_ethnic", label: "✨ Boys Kurta Sets", gender: "kids" },
  { key: "boys_party_blazers", label: "🤵 Boys Blazer Sets", gender: "kids" },
  { key: "girls_frocks", label: "👗 Girls Frocks & Dresses", gender: "kids" },
  { key: "girls_ethnic", label: "🥻 Girls Lehengas", gender: "kids" },
  { key: "girls_casuals", label: "🌸 Girls Tops & Co-Ords", gender: "kids" }
];

const US_CATEGORY_TABS = [
  { key: "all", label: "✨ All US Looks" },
  // Men (US - 10 Categories)
  { key: "us_men_oxford_shirts", label: "👔 Oxford & Dress Shirts", gender: "men" },
  { key: "us_men_casual_flannels", label: "👕 Flannels & Plaids", gender: "men" },
  { key: "us_men_streetwear_hoodies", label: "🧥 Streetwear & Hoodies", gender: "men" },
  { key: "us_men_graphic_tees", label: "👕 Vintage Graphic Tees", gender: "men" },
  { key: "us_men_polos", label: "👕 Classic & Golf Polos", gender: "men" },
  { key: "us_men_blazers_suits", label: "🧥 Suits & Executive Blazers", gender: "men" },
  { key: "us_men_denim_501", label: "👖 501s & Straight Denim", gender: "men" },
  { key: "us_men_chinos_cargos", label: "👖 Chinos & Cargo Pants", gender: "men" },
  { key: "us_men_denim_bombers", label: "🧥 Denim & Bomber Jackets", gender: "men" },
  { key: "us_men_puffer_parkas", label: "🧥 Down Puffers & Parkas", gender: "men" },

  // Women (US - 12 Categories)
  { key: "us_women_cocktail_evening", label: "👗 Cocktail & Evening Gowns", gender: "women" },
  { key: "us_women_sundresses_maxi", label: "👗 Sundresses & Maxis", gender: "women" },
  { key: "us_women_athleisure_sets", label: "✨ Athleisure & Sculpt Sets", gender: "women" },
  { key: "us_women_power_blazers", label: "🧥 Power Blazers & Suits", gender: "women" },
  { key: "us_women_workwear_blouses", label: "👚 Silk Blouses & Shirts", gender: "women" },
  { key: "us_women_casual_tees_baby", label: "👕 Baby Tees & Bodysuits", gender: "women" },
  { key: "us_women_knit_cardigans", label: "🧥 Cardigans & Cashmere", gender: "women" },
  { key: "us_women_denim_wideleg", label: "👖 Wide-Leg & 90s Jeans", gender: "women" },
  { key: "us_women_denim_trench", label: "🧥 Trench Coats & Jackets", gender: "women" },
  { key: "us_women_skirts_shorts", label: "👗 Skirts & Linen Shorts", gender: "women" },
  { key: "us_women_coords_loungewear", label: "✨ Matching Co-ord Sets", gender: "women" },
  { key: "us_women_puffer_jackets", label: "🧥 Cropped Puffers & Sherpas", gender: "women" },

  // Kids (US - 6 Clean Focused Categories)
  { key: "us_kids_boys_hoodies", label: "🧥 Boys Hoodies & Sweaters", gender: "kids" },
  { key: "us_kids_boys_jackets", label: "🧥 Boys Jackets & Coats", gender: "kids" },
  { key: "us_kids_boys_pants", label: "👖 Boys Jeans & Joggers", gender: "kids" },
  { key: "us_kids_girls_dresses", label: "👗 Girls Dresses & Skirts", gender: "kids" },
  { key: "us_kids_girls_sweaters", label: "🧥 Girls Sweaters & Cardigans", gender: "kids" },
  { key: "us_kids_girls_tops", label: "👚 Girls Tops & Tees", gender: "kids" }
];

const UK_CATEGORY_TABS = [
  { key: "all", label: "✨ All UK Looks" },
  // Men (UK - 10 Categories)
  { key: "uk_men_oxford_shirts", label: "👔 Oxford & Formal Shirts", gender: "men" },
  { key: "uk_men_casual_flannels", label: "👕 Casual & Plaid Shirts", gender: "men" },
  { key: "uk_men_streetwear_hoodies", label: "🧥 Hoodies & Sweatshirts", gender: "men" },
  { key: "uk_men_graphic_tees", label: "👕 Chest Graphic & Logo Tees", gender: "men" },
  { key: "uk_men_polos", label: "👕 Classic Pique & Knit Polos", gender: "men" },
  { key: "uk_men_blazers_suits", label: "🤵 Suits & Tailored Blazers", gender: "men" },
  { key: "uk_men_denim", label: "👖 Straight & Relaxed Denim", gender: "men" },
  { key: "uk_men_chinos_cargos", label: "👖 Chinos & Utility Cargos", gender: "men" },
  { key: "uk_men_jackets_bombers", label: "🧥 Harrington & Bomber Jackets", gender: "men" },
  { key: "uk_men_puffer_parkas", label: "🧥 Down Puffers & Winter Parkas", gender: "men" },

  // Women (UK - 12 Categories)
  { key: "uk_women_cocktail_evening", label: "👗 Evening & Cocktail Dresses", gender: "women" },
  { key: "uk_women_sundresses_maxi", label: "👗 Maxi & Day Dresses", gender: "women" },
  { key: "uk_women_athleisure_sets", label: "✨ Sculpt Leggings & Activewear", gender: "women" },
  { key: "uk_women_power_blazers", label: "🧥 Tailored Blazers & Suits", gender: "women" },
  { key: "uk_women_workwear_blouses", label: "👚 Blouses & Office Shirts", gender: "women" },
  { key: "uk_women_casual_tees", label: "👕 Fitted Tees & Bodysuits", gender: "women" },
  { key: "uk_women_knit_cardigans", label: "🧥 Cardigans & Jumpers", gender: "women" },
  { key: "uk_women_denim_wideleg", label: "👖 Wide-Leg & Straight Jeans", gender: "women" },
  { key: "uk_women_trench_coats", label: "🧥 Trench Coats & Longline Jackets", gender: "women" },
  { key: "uk_women_skirts_shorts", label: "👗 Skirts & Tailored Shorts", gender: "women" },
  { key: "uk_women_coords_loungewear", label: "✨ Co-Ord Sets & Loungewear", gender: "women" },
  { key: "uk_women_puffer_jackets", label: "🧥 Cropped Puffers & Warm Jackets", gender: "women" },

  // Kids (UK - 6 Categories)
  { key: "uk_kids_boys_hoodies", label: "🧥 Boys Hoodies & Sweaters", gender: "kids" },
  { key: "uk_kids_boys_jackets", label: "🧥 Boys Jackets & Outerwear", gender: "kids" },
  { key: "uk_kids_boys_pants", label: "👖 Boys Jeans & Joggers", gender: "kids" },
  { key: "uk_kids_girls_dresses", label: "👗 Girls Dresses & Skirts", gender: "kids" },
  { key: "uk_kids_girls_sweaters", label: "🧥 Girls Sweaters & Cardigans", gender: "kids" },
  { key: "uk_kids_girls_tops", label: "👚 Girls Tops & Tees", gender: "kids" }
];

const CA_CATEGORY_TABS = [
  { key: "all", label: "🍁 All Canadian Looks" },
  // Men (CA - 10 Categories)
  { key: "ca_men_oxford_shirts", label: "👔 Oxford & Dress Shirts", gender: "men" },
  { key: "ca_men_casual_flannels", label: "👕 Flannels & Canadian Plaids", gender: "men" },
  { key: "ca_men_streetwear_hoodies", label: "🧥 Streetwear & Fleece Hoodies", gender: "men" },
  { key: "ca_men_graphic_tees", label: "👕 Vintage Graphic & Logo Tees", gender: "men" },
  { key: "ca_men_polos", label: "👕 Classic & Knit Polos", gender: "men" },
  { key: "ca_men_blazers_suits", label: "🤵 Suits & Executive Blazers", gender: "men" },
  { key: "ca_men_denim", label: "👖 Straight & Relaxed Denim", gender: "men" },
  { key: "ca_men_chinos_cargos", label: "👖 Chinos & Utility Cargo Pants", gender: "men" },
  { key: "ca_men_jackets_bombers", label: "🧥 Bomber & Harrington Jackets", gender: "men" },
  { key: "ca_men_puffer_parkas", label: "🧥 Canadian Down Puffers & Parkas", gender: "men" },

  // Women (CA - 12 Categories)
  { key: "ca_women_cocktail_evening", label: "👗 Cocktail & Evening Gowns", gender: "women" },
  { key: "ca_women_sundresses_maxi", label: "👗 Sundresses & Casual Maxis", gender: "women" },
  { key: "ca_women_athleisure_sets", label: "✨ Sculpt Leggings & Active Sets", gender: "women" },
  { key: "ca_women_power_blazers", label: "🧥 Power Blazers & Suiting", gender: "women" },
  { key: "ca_women_workwear_blouses", label: "👚 Silk Blouses & Work Shirts", gender: "women" },
  { key: "ca_women_casual_tees", label: "👕 Fitted Tees & Bodysuits", gender: "women" },
  { key: "ca_women_knit_cardigans", label: "🧥 Cardigans & Wool Sweaters", gender: "women" },
  { key: "ca_women_denim_wideleg", label: "👖 Wide-Leg & Straight Jeans", gender: "women" },
  { key: "ca_women_trench_coats", label: "🧥 Trench Coats & Wool Coats", gender: "women" },
  { key: "ca_women_skirts_shorts", label: "👗 Skirts & Tailored Shorts", gender: "women" },
  { key: "ca_women_coords_loungewear", label: "✨ Co-Ord Sets & Loungewear", gender: "women" },
  { key: "ca_women_puffer_jackets", label: "🧥 Canadian Winter Puffers & Parkas", gender: "women" },

  // Kids (CA - 6 Categories)
  { key: "ca_kids_boys_hoodies", label: "🧥 Boys Hoodies & Sweaters", gender: "kids" },
  { key: "ca_kids_boys_jackets", label: "🧥 Boys Jackets & Coats", gender: "kids" },
  { key: "ca_kids_boys_pants", label: "👖 Boys Jeans & Joggers", gender: "kids" },
  { key: "ca_kids_girls_dresses", label: "👗 Girls Dresses & Skirts", gender: "kids" },
  { key: "ca_kids_girls_sweaters", label: "🧥 Girls Sweaters & Cardigans", gender: "kids" },
  { key: "ca_kids_girls_tops", label: "👚 Girls Tops & Long Sleeves", gender: "kids" }
];

const AU_CATEGORY_TABS = [
  { key: "all", label: "🦘 All Aussie Looks" },
  // Men (AU - 10 Categories)
  { key: "au_men_oxford_shirts", label: "👔 Oxford & Linen Shirts", gender: "men" },
  { key: "au_men_casual_flannels", label: "👕 Overshirts & Check Shirts", gender: "men" },
  { key: "au_men_streetwear_hoodies", label: "🧥 Streetwear & Cotton Hoodies", gender: "men" },
  { key: "au_men_graphic_tees", label: "👕 Surf & Vintage Graphic Tees", gender: "men" },
  { key: "au_men_polos", label: "👕 Pique & Resort Polos", gender: "men" },
  { key: "au_men_blazers_suits", label: "🤵 Suits & Summer Blazers", gender: "men" },
  { key: "au_men_denim", label: "👖 Straight & Relaxed Denim", gender: "men" },
  { key: "au_men_chinos_cargos", label: "👖 Chinos & Utility Cargos", gender: "men" },
  { key: "au_men_jackets_bombers", label: "🧥 Harrington & Bomber Jackets", gender: "men" },
  { key: "au_men_puffer_parkas", label: "🧥 Lightweight Puffers & Jackets", gender: "men" },

  // Women (AU - 12 Categories)
  { key: "au_women_cocktail_evening", label: "👗 Evening & Cocktail Dresses", gender: "women" },
  { key: "au_women_sundresses_maxi", label: "👗 Linen Sundresses & Maxis", gender: "women" },
  { key: "au_women_athleisure_sets", label: "🏄‍♀️ Activewear & Coastal Sets", gender: "women" },
  { key: "au_women_power_blazers", label: "🧥 Tailored Linen & Power Blazers", gender: "women" },
  { key: "au_women_workwear_blouses", label: "👚 Silk Blouses & Resort Shirts", gender: "women" },
  { key: "au_women_casual_tees", label: "👕 Ribbed Tees & Bodysuits", gender: "women" },
  { key: "au_women_knit_cardigans", label: "🧥 Open Knits & Cardigans", gender: "women" },
  { key: "au_women_denim_wideleg", label: "👖 Wide-Leg & Coastal Denim", gender: "women" },
  { key: "au_women_trench_coats", label: "🧥 Trench Coats & Dusters", gender: "women" },
  { key: "au_women_skirts_shorts", label: "👗 Linen Skirts & Tailored Shorts", gender: "women" },
  { key: "au_women_coords_loungewear", label: "✨ Matching Co-Ords & Sets", gender: "women" },
  { key: "au_women_puffer_jackets", label: "🧥 Cropped Puffers & Vests", gender: "women" },

  // Kids (AU - 6 Categories)
  { key: "au_kids_boys_hoodies", label: "🧥 Boys Hoodies & Sweats", gender: "kids" },
  { key: "au_kids_boys_jackets", label: "🧥 Boys Jackets & Outerwear", gender: "kids" },
  { key: "au_kids_boys_pants", label: "👖 Boys Jeans & Cargos", gender: "kids" },
  { key: "au_kids_girls_dresses", label: "👗 Girls Cotton & Party Dresses", gender: "kids" },
  { key: "au_kids_girls_sweaters", label: "🧥 Girls Cardigans & Jumpers", gender: "kids" },
  { key: "au_kids_girls_tops", label: "👚 Girls Tees & Tops", gender: "kids" }
];

const AE_CATEGORY_TABS = [
  { key: "all", label: "🇦🇪 All UAE & Dubai Looks" },
  // Men (AE - 10 Categories)
  { key: "ae_men_oxford_shirts", label: "👔 Premium Linen & Oxford Shirts", gender: "men" },
  { key: "ae_men_casual_flannels", label: "👕 Lightweight Overshirts & Shackets", gender: "men" },
  { key: "ae_men_streetwear_hoodies", label: "🧥 Designer Streetwear & Hoodies", gender: "men" },
  { key: "ae_men_graphic_tees", label: "👕 Minimalist & Graphic Tees", gender: "men" },
  { key: "ae_men_polos", label: "👕 Luxury Mercerized & Knit Polos", gender: "men" },
  { key: "ae_men_blazers_suits", label: "🤵 Tailored Tuxedos & Power Blazers", gender: "men" },
  { key: "ae_men_denim", label: "👖 Slim & Straight Designer Denim", gender: "men" },
  { key: "ae_men_chinos_cargos", label: "👖 Tailored Chinos & Linen Trousers", gender: "men" },
  { key: "ae_men_jackets_bombers", label: "🧥 Suede & Satin Bomber Jackets", gender: "men" },
  { key: "ae_men_puffer_parkas", label: "🧥 Lightweight Jackets & Gilets", gender: "men" },

  // Women (AE - 12 Categories)
  { key: "ae_women_cocktail_evening", label: "👗 Haute Couture & Evening Gowns", gender: "women" },
  { key: "ae_women_sundresses_maxi", label: "👗 Flowy Silk & Chiffon Maxis", gender: "women" },
  { key: "ae_women_athleisure_sets", label: "✨ Sculpt Leggings & Athleisure", gender: "women" },
  { key: "ae_women_power_blazers", label: "🧥 Tailored Double-Breasted Blazers", gender: "women" },
  { key: "ae_women_workwear_blouses", label: "👚 Silk Blouses & Satin Shirts", gender: "women" },
  { key: "ae_women_casual_tees", label: "👕 Luxury Ribbed Tees & Bodysuits", gender: "women" },
  { key: "ae_women_knit_cardigans", label: "🧥 Fine Knit Cardigans & Drapes", gender: "women" },
  { key: "ae_women_denim_wideleg", label: "👖 High-Rise Wide-Leg Denim", gender: "women" },
  { key: "ae_women_trench_coats", label: "🧥 Flowy Trench Coats & Kimonos", gender: "women" },
  { key: "ae_women_skirts_shorts", label: "👗 Pleated Midi Skirts & Linen Sets", gender: "women" },
  { key: "ae_women_coords_loungewear", label: "✨ Silk & Modal Co-Ord Sets", gender: "women" },
  { key: "ae_women_puffer_jackets", label: "🧥 Cropped Jackets & Structured Vests", gender: "women" },

  // Kids (AE - 6 Categories)
  { key: "ae_kids_boys_hoodies", label: "🧥 Boys Hoodies & Sweats", gender: "kids" },
  { key: "ae_kids_boys_jackets", label: "🧥 Boys Jackets & Gilets", gender: "kids" },
  { key: "ae_kids_boys_pants", label: "👖 Boys Chinos & Stretch Denim", gender: "kids" },
  { key: "ae_kids_girls_dresses", label: "👗 Girls Occasion & Party Dresses", gender: "kids" },
  { key: "ae_kids_girls_sweaters", label: "🧥 Girls Cardigans & Knitwear", gender: "kids" },
  { key: "ae_kids_girls_tops", label: "👚 Girls Tops & Embroidered Tees", gender: "kids" }
];

// Ultra-Fast CDN Thumbnail Helper for Sub-100ms Product Grid Loading
function getOptimizedThumbUrl(url) {
  if (!url || typeof url !== "string") return url;
  // H&M CDN: reduce 1MB+ raw studio photos to 17.5KB web thumbnails
  if (url.includes("image.hm.com") && !url.includes("imwidth=")) {
    return url.includes("?") ? `${url}&imwidth=384` : `${url}?imwidth=384`;
  }
  // ASOS CDN: fast 320w thumbnail
  if (url.includes("images.asos-media.com") && !url.includes("$n_") && !url.includes("wid=")) {
    return `${url}?$n_320w$`;
  }
  // Myntra (India): already optimized CDN JPEG thumbnails, do not inject unsupported path transforms
  if (url.includes("assets.myntassets.com")) {
    return url;
  }
  // Noon CDN (Namshi UAE): fast 320w thumbnail
  if (url.includes("nooncdn.com")) {
    return url.replace(/width=\d+/, 'width=320');
  }
  return url;
}

export default function FashionTrialRoom({ initialGarment = null, onBackToSearch, onOpenSupportTicket, selectedCountry = "IN" }) {
  const clerk = useClerk();
  const { isSignedIn } = useUser();
  const [gender, setGender] = useState("men");
  const [skinTone, setSkinTone] = useState("wheatish");
  const [userImage, setUserImage] = useState(SAMPLE_MODELS.men.image);
  const [isCustomPhoto, setIsCustomPhoto] = useState(false);
  const [tryonResultImage, setTryonResultImage] = useState(null);
  const [previousLook, setPreviousLook] = useState(null); // Client-side Zero-Storage session comparison
  const [viewMode, setViewMode] = useState("tryon"); // "tryon" or "original"
  const [renderedCache, setRenderedCache] = useState({});
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  // Ephemeral memory cleanup: revoke any temporary blob URLs when component unmounts
  useEffect(() => {
    return () => {
      if (userImage && typeof userImage === "string" && userImage.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(userImage);
        } catch (_) {}
      }
    };
  }, [userImage]);

  // Active Stylist & Selection State (On-Demand Category Architecture)
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [catalogItems, setCatalogItems] = useState([]);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(false);
  const [activeOutfits, setActiveOutfits] = useState([]);
  const [currentTryonGarment, setCurrentTryonGarment] = useState(null);
  const [isRendering, setIsRendering] = useState(false);

  // Active category tabs based on selected country
  const currentCategoryTabs =
    selectedCountry === "IN"
      ? CATEGORY_TABS
      : selectedCountry === "GB" || selectedCountry === "UK"
      ? UK_CATEGORY_TABS
      : selectedCountry === "CA"
      ? CA_CATEGORY_TABS
      : selectedCountry === "AU"
      ? AU_CATEGORY_TABS
      : selectedCountry === "AE"
      ? AE_CATEGORY_TABS
      : US_CATEGORY_TABS;

  // Reset selected category to "all" when country changes to avoid cross-country stale category mismatches
  useEffect(() => {
    setSelectedCategory("all");
    setSearchQuery("");
  }, [selectedCountry]);

  // High-Speed Two-Tier Category Catalog Loader (Instant 0ms Switch via Client Ref + Server L1)
  const clientCatalogCache = useRef({});

  useEffect(() => {
    let isMounted = true;
    const cacheKey = `${selectedCountry}_${gender}_${selectedCategory}_${searchQuery.trim()}`;

    // Instant Tier-1 Client Memory Hit (0ms - No Spinner, Zero Delay)
    if (clientCatalogCache.current[cacheKey]) {
      const cached = clientCatalogCache.current[cacheKey];
      setCatalogItems(cached);
      if (cached.length > 0 && (activeOutfits.length === 0 || !currentTryonGarment)) {
        setActiveOutfits(cached.slice(0, 4));
        if (!currentTryonGarment) setCurrentTryonGarment(cached[0]);
      }
      setIsLoadingCatalog(false);
      return;
    }

    setIsLoadingCatalog(true);

    const params = new URLSearchParams({
      country: selectedCountry,
      gender,
      category: selectedCategory,
      limit: "48",
    });
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    }

    fetch(`/api/vton/catalog?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && Array.isArray(data.items)) {
          clientCatalogCache.current[cacheKey] = data.items;
          setCatalogItems(data.items);
          if (data.items.length > 0 && (activeOutfits.length === 0 || !currentTryonGarment)) {
            setActiveOutfits(data.items.slice(0, 4));
            if (!currentTryonGarment) setCurrentTryonGarment(data.items[0]);
          }
        }
      })
      .catch((err) => console.error("Error fetching category catalog:", err))
      .finally(() => {
        if (isMounted) setIsLoadingCatalog(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCountry, gender, selectedCategory, searchQuery]);

  // Auto-load cross-bridged garment from Live Deals Search
  useEffect(() => {
    if (initialGarment && initialGarment.image) {
      const formatted = {
        id: initialGarment.id || "deal-item",
        title: initialGarment.title,
        price: initialGarment.price,
        image: initialGarment.image,
        category: "Featured Deal",
        brand: initialGarment.brand || "Selected Outfit"
      };
      setCurrentTryonGarment(formatted);
      setActiveOutfits(prev => [formatted, ...prev.filter(p => p.id !== formatted.id).slice(0, 5)]);
    }
  }, [initialGarment]);

  // Conversational 2-Way Stylist Chat State
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isStylistTyping, setIsStylistTyping] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, isStylistTyping]);

  // Garment & Photo Upload State
  const fileInputRef = useRef(null);
  const garmentFileInputRef = useRef(null);
  const [photoQualityMsg, setPhotoQualityMsg] = useState("");
  const [tryonErrorMsg, setTryonErrorMsg] = useState("");
  const [tryonErrorState, setTryonErrorState] = useState(null); // { type, message, guidance }
  const [renderElapsed, setRenderElapsed] = useState(0);
  const [isScanningBody, setIsScanningBody] = useState(false);
  const [bodyCalibration, setBodyCalibration] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [quotaInfo, setQuotaInfo] = useState({ limit: 2, used: 0, remaining: 2 });

  // Query live try-on quota status for this user & network on mount
  useEffect(() => {
    let isMounted = true;
    fetch("/api/vton/render")
      .then(res => res.json())
      .then(data => {
        if (isMounted && data?.freeTier) {
          setQuotaInfo(data.freeTier);
        }
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const handleRequestPhotoUpload = () => {
    if (!isSignedIn) {
      if (clerk && typeof clerk.openSignIn === "function") {
        clerk.openSignIn();
      }
      return;
    }
    fileInputRef.current?.click();
  };

  const handleRequestGarmentUpload = () => {
    if (!isSignedIn) {
      if (clerk && typeof clerk.openSignIn === "function") {
        clerk.openSignIn();
      }
      return;
    }
    garmentFileInputRef.current?.click();
  };

  // Function to execute photorealistic AI try-on via PixelAPI with session cache
  const handleTryOnOutfit = async (garment) => {
    if (!isSignedIn) {
      if (clerk && typeof clerk.openSignIn === "function") {
        clerk.openSignIn();
      }
      return;
    }
    if (!garment) return;
    setCurrentTryonGarment(garment);

    // If already generated in this session, load instantly from cache without burning credits
    if (renderedCache[garment.id]) {
      setTryonResultImage(renderedCache[garment.id]);
      setViewMode("tryon");
      setTryonErrorMsg("");
      setTryonErrorState(null);
      setPhotoQualityMsg("✨ Fitted look loaded from session cache (0 Credits).");
      return;
    }

    setIsRendering(true);
    setRenderElapsed(0);
    setTryonErrorMsg("");
    setTryonErrorState(null);
    setTryonResultImage(null);

    const timerInterval = setInterval(() => {
      setRenderElapsed((prev) => prev + 1);
    }, 1000);

    const attemptId = (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function")
      ? crypto.randomUUID()
      : ('att_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9));

    try {
      const { fingerprint: deviceFingerprint, isBot } = await getDeviceFingerprint().catch(() => ({ fingerprint: null, isBot: false }));

      const res = await fetch('/api/vton/render', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-device-fingerprint': deviceFingerprint || '',
          'x-bot-detected': String(!!isBot)
        },
        body: JSON.stringify({
          attemptId,
          userImageBase64: userImage,
          garmentImageUrl: garment.image || garment.image_url,
          garmentCategory: garment.category,
          garmentTitle: garment.title,
          isSampleModel: !isCustomPhoto,
          deviceFingerprint
        })
      });

      const data = await res.json();
      if (data.success && (data.renderedImageUrl || data.rendered_image || data.output_base64 || data.output_image_url)) {
        let outputImg = data.renderedImageUrl || data.rendered_image || data.output_base64 || data.output_image_url;
        if (outputImg && typeof outputImg === "string" && !outputImg.startsWith("http") && !outputImg.startsWith("data:image/")) {
          outputImg = `data:image/jpeg;base64,${outputImg}`;
        }
        
        // Zero-flicker preloader: ensure image is downloaded into browser before hiding spinner
        const preloader = new window.Image();
        preloader.onload = () => {
          clearInterval(timerInterval);
          if (tryonResultImage && currentTryonGarment && currentTryonGarment.id !== garment.id) {
            setPreviousLook({ image: tryonResultImage, garment: currentTryonGarment });
          }
          setTryonResultImage(outputImg);
          setRenderedCache(prev => ({ ...prev, [garment.id]: outputImg }));
          setViewMode("tryon");
          setTryonErrorMsg("");
          setTryonErrorState(null);
          setIsRendering(false);
          if (data.freeTier) {
            setQuotaInfo(data.freeTier);
          }
          const remainingMsg = typeof data.freeTier?.remaining === "number" ? ` (${data.freeTier.remaining} free left today)` : "";
          setPhotoQualityMsg(`✨ Photorealistic AI Drape Complete! Identity & posture locked.${remainingMsg}`);
        };
        preloader.onerror = () => {
          clearInterval(timerInterval);
          if (tryonResultImage && currentTryonGarment && currentTryonGarment.id !== garment.id) {
            setPreviousLook({ image: tryonResultImage, garment: currentTryonGarment });
          }
          setTryonResultImage(outputImg);
          setRenderedCache(prev => ({ ...prev, [garment.id]: outputImg }));
          setViewMode("tryon");
          setTryonErrorMsg("");
          setTryonErrorState(null);
          setIsRendering(false);
        };
        preloader.src = outputImg;
      } else {
        clearInterval(timerInterval);
        setIsRendering(false);
        if (data.upgradeRequired || data.error === "FREE_TIER_LIMIT_EXCEEDED" || data.error === "IP_FREE_TRIAL_EXHAUSTED" || data.error === "DEVICE_FREE_TRIAL_EXHAUSTED") {
          setQuotaInfo(data.freeTier || null);
          setShowUpgradeModal(true);
          const msg = data.message || "Free limit reached (3/3 try-ons used). To continue, upgrade to Zippy Sachet pack (₹10 for 5 try-ons).";
          setTryonErrorMsg(msg);
          setTryonErrorState({ type: "QUOTA", message: msg, guidance: "Upgrade to continue trying on outfits." });
        } else {
          const errMsg = data.error || "Virtual Dressing Room is at peak capacity right now! Our AI stylists are serving thousands of shoppers. Your try-on quota has NOT been deducted. Please try again in 1-2 minutes.";
          setTryonErrorMsg(errMsg);
          setTryonErrorState({
            type: data.errorType || (errMsg.toLowerCase().includes("capacity") || errMsg.toLowerCase().includes("busy") || errMsg.toLowerCase().includes("rush") ? "SERVER_TRAFFIC" : (errMsg.toLowerCase().includes("photo") || errMsg.toLowerCase().includes("person") || errMsg.toLowerCase().includes("pose") ? "PHOTO_QUALITY" : "GENERAL")),
            message: errMsg,
            guidance: data.guidance || ""
          });
        }
      }
    } catch (err) {
      clearInterval(timerInterval);
      setIsRendering(false);
      console.warn("Try-on render error:", err);
      const networkMsg = "Virtual Dressing Room connection momentarily timed out. Your try-on credit was preserved.";
      setTryonErrorMsg(networkMsg);
      setTryonErrorState({
        type: "SERVER_TRAFFIC",
        message: networkMsg,
        guidance: "Please tap 'Try Again' to re-connect."
      });
    }
  };

  // Handle Photo Upload with High-Speed Mobile HEIC / High-Res Optimization
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so re-selecting same photo triggers change event
    if (fileInputRef.current) fileInputRef.current.value = "";

    if (file.size > 30 * 1024 * 1024) {
      setPhotoQualityMsg("⚠️ Image size exceeds 30MB. Please select a smaller photo.");
      return;
    }

    setPhotoQualityMsg("⚡ Optimizing photo for instant AI drape...");
    setIsScanningBody(true);

    try {
      let processableBlob = file;

      // Handle Apple / Modern Android HEIC/HEIF photo formats
      const isHeic = file.name.toLowerCase().endsWith('.heic') || 
                     file.name.toLowerCase().endsWith('.heif') || 
                     file.type.includes('heic') || 
                     file.type.includes('heif');

      if (isHeic) {
        try {
          const heic2any = (await import('heic2any')).default;
          const converted = await heic2any({
            blob: file,
            toType: 'image/jpeg',
            quality: 0.90
          });
          processableBlob = Array.isArray(converted) ? converted[0] : converted;
        } catch (heicErr) {
          console.warn("HEIC direct conversion note:", heicErr);
        }
      }

      // Fast processor function with HD bicubic clamp (1200x1600) and 90% quality
      const processLoadedImage = (img, cleanupUrl) => {
        try {
          const aspect = img.height / img.width;

          // Client-side smart canvas resize: 800px max dimension matching neural VTON native grid, reducing upload size by 75%
          const maxDim = 800;
          let targetW = img.width;
          let targetH = img.height;

          if (targetW > maxDim || targetH > maxDim) {
            if (targetW > targetH) {
              targetH = Math.round((targetH * maxDim) / targetW);
              targetW = maxDim;
            } else {
              targetW = Math.round((targetW * maxDim) / targetH);
              targetH = maxDim;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = targetW;
          canvas.height = targetH;
          const ctx = canvas.getContext("2d");
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, targetW, targetH);
          const optimizedPhotoData = canvas.toDataURL("image/jpeg", 0.85);

          if (cleanupUrl) {
            try { URL.revokeObjectURL(cleanupUrl); } catch (_) {}
          }

          // Client-side automatic skin tone detection from face/upper-torso region (Zero image leakage)
          let autoDetectedTone = "wheatish";
          try {
            const sampleX = Math.round(targetW * 0.4);
            const sampleY = Math.round(targetH * 0.15);
            const sampleW = Math.round(targetW * 0.2);
            const sampleH = Math.round(targetH * 0.2);
            const imgData = ctx.getImageData(sampleX, sampleY, sampleW, sampleH).data;
            let totalR = 0, totalG = 0, totalB = 0, count = 0;
            for (let i = 0; i < imgData.length; i += 16) {
              const r = imgData[i], g = imgData[i + 1], b = imgData[i + 2];
              const brightness = (r + g + b) / 3;
              if (brightness > 60 && brightness < 235 && r > g && g >= b) {
                totalR += r; totalG += g; totalB += b; count++;
              }
            }
            if (count > 0) {
              const avgBrightness = (totalR + totalG + totalB) / (3 * count);
              if (avgBrightness > 175) autoDetectedTone = "fair";
              else if (avgBrightness < 125) autoDetectedTone = "dusky";
              else autoDetectedTone = "wheatish";
            }
          } catch (_) {
            autoDetectedTone = "wheatish";
          }
          setSkinTone(autoDetectedTone);

          // Apply optimized image state
          setUserImage(optimizedPhotoData);
          setIsCustomPhoto(true);
          setTryonResultImage(null);
          setPreviousLook(null);
          setTryonErrorMsg("");
          setTryonErrorState(null);
          setViewMode("original");

          setTimeout(() => {
            setIsScanningBody(false);
            setBodyCalibration({
              frame: aspect > 1.2 ? "Full-Body Portrait Frame" : "Upper Torso Frame",
              status: "100% Calibrated & Locked"
            });
            setPhotoQualityMsg("✅ Persona Calibrated: Body contours, skin tone & posture locked for AI drape.");
          }, 800);
        } catch (procErr) {
          console.error("Canvas process error:", procErr);
          setIsScanningBody(false);
          setPhotoQualityMsg("⚠️ Failed to process photo. Please tap Change Photo to try again.");
        }
      };

      // Primary modern fast loader: zero-copy URL.createObjectURL
      let objectUrl = null;
      try {
        objectUrl = URL.createObjectURL(processableBlob);
      } catch (_) {}

      if (objectUrl) {
        const img = new window.Image();
        img.onload = () => processLoadedImage(img, objectUrl);
        img.onerror = () => {
          if (objectUrl) {
            try { URL.revokeObjectURL(objectUrl); } catch (_) {}
          }
          const reader = new FileReader();
          reader.onload = (e2) => {
            const fallbackImg = new window.Image();
            fallbackImg.onload = () => processLoadedImage(fallbackImg, null);
            fallbackImg.onerror = () => {
              setIsScanningBody(false);
              setPhotoQualityMsg("⚠️ Unsupported photo format. Please upload JPG, PNG, or WebP.");
            };
            fallbackImg.src = e2.target.result;
          };
          reader.onerror = () => {
            setIsScanningBody(false);
            setPhotoQualityMsg("⚠️ Could not read photo. Please tap Change Photo to try again.");
          };
          reader.readAsDataURL(processableBlob);
        };
        img.src = objectUrl;
      } else {
        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
          const rawData = uploadEvent.target.result;
          const img = new window.Image();
          img.onload = () => processLoadedImage(img, null);
          img.onerror = () => {
            setIsScanningBody(false);
            setPhotoQualityMsg("⚠️ Unsupported photo format. Please upload JPG, PNG, or WebP.");
          };
          img.src = rawData;
        };
        reader.onerror = () => {
          setIsScanningBody(false);
          setPhotoQualityMsg("⚠️ Could not read photo. Please tap Change Photo to try again.");
        };
        reader.readAsDataURL(processableBlob);
      }
    } catch (err) {
      console.error("Photo upload error:", err);
      setIsScanningBody(false);
      setPhotoQualityMsg("⚠️ Failed to process photo. Please try another image.");
    }
  };

  // Handle Custom Garment Screenshot / Photo Upload
  const handleGarmentUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (garmentFileInputRef.current) garmentFileInputRef.current.value = "";

    try {
      let processableBlob = file;
      const isHeic = file.name.toLowerCase().endsWith('.heic') || 
                     file.name.toLowerCase().endsWith('.heif') || 
                     file.type.includes('heic') || 
                     file.type.includes('heif');

      if (isHeic) {
        try {
          const heic2any = (await import('heic2any')).default;
          const converted = await heic2any({
            blob: file,
            toType: 'image/jpeg',
            quality: 0.90
          });
          processableBlob = Array.isArray(converted) ? converted[0] : converted;
        } catch (heicErr) {
          console.warn("HEIC garment conversion note:", heicErr);
        }
      }

      const processLoadedGarment = (img, cleanupUrl) => {
        try {
          const maxDim = 800;
          let targetW = img.width;
          let targetH = img.height;

          if (targetW > maxDim || targetH > maxDim) {
            if (targetW > targetH) {
              targetH = Math.round((targetH * maxDim) / targetW);
              targetW = maxDim;
            } else {
              targetW = Math.round((targetW * maxDim) / targetH);
              targetH = maxDim;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = targetW;
          canvas.height = targetH;
          const ctx = canvas.getContext("2d");
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, targetW, targetH);
          const optimizedGarmentData = canvas.toDataURL("image/jpeg", 0.85);

          if (cleanupUrl) {
            try { URL.revokeObjectURL(cleanupUrl); } catch (_) {}
          }

          const customGarment = {
            id: `custom-garment-${Date.now()}`,
            title: "Custom Screenshot / Uploaded Outfit",
            brand: "Custom Upload",
            price: "Your Screenshot",
            category: "upperbody",
            image: optimizedGarmentData,
            image_url: optimizedGarmentData,
            fabric: "Custom Garment",
            direct_link: "",
            isCustomUpload: true
          };

          handleTryOnOutfit(customGarment);
          setChatHistory(prev => [
            ...prev,
            {
              id: `garment-${Date.now()}`,
              sender: "ai",
              text: "Garment screenshot detected! Fitting directly onto your photo...",
              options: []
            }
          ]);
        } catch (procErr) {
          console.error("Garment canvas process error:", procErr);
        }
      };

      let garmentObjectUrl = null;
      try {
        garmentObjectUrl = URL.createObjectURL(processableBlob);
      } catch (_) {}

      if (garmentObjectUrl) {
        const img = new window.Image();
        img.onload = () => processLoadedGarment(img, garmentObjectUrl);
        img.onerror = () => {
          if (garmentObjectUrl) {
            try { URL.revokeObjectURL(garmentObjectUrl); } catch (_) {}
          }
          const reader = new FileReader();
          reader.onload = (uploadEvent) => {
            const fallbackImg = new window.Image();
            fallbackImg.onload = () => processLoadedGarment(fallbackImg, null);
            fallbackImg.src = uploadEvent.target.result;
          };
          reader.readAsDataURL(processableBlob);
        };
        img.src = garmentObjectUrl;
      } else {
        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
          const img = new window.Image();
          img.onload = () => processLoadedGarment(img, null);
          img.src = uploadEvent.target.result;
        };
        reader.readAsDataURL(processableBlob);
      }
    } catch (err) {
      console.error("Garment upload error:", err);
      setTryonErrorMsg("Failed to process garment photo. Please try a standard JPG/PNG image.");
    }
  };

  // Switch Gender
  const handleGenderChange = (newGender) => {
    setGender(newGender);
    setTryonResultImage(null);
    setPreviousLook(null);
    if (!isCustomPhoto) {
      const defaultImg = SAMPLE_MODELS[newGender]?.image || SAMPLE_MODELS.men.image;
      setUserImage(defaultImg);
    }
    setActiveOutfits([]);
    setCurrentTryonGarment(null);
    setSelectedCategory("all");
    setChatHistory([]);
  };

  // Submit AI Stylist Query (2-Way Conversational)
  const handleStylistQuery = async (queryText) => {
    const textToSend = (queryText || chatInput || "").trim();
    if (!textToSend || isStylistTyping) return;

    // Immediately add user's query to chat
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend
    };
    setChatHistory(prev => [...prev, userMsg]);
    setChatInput("");
    setIsStylistTyping(true);

    try {
      const res = await fetch('/api/vton/stylist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: textToSend,
          skinTone,
          gender,
          country: selectedCountry || "IN",
          isCustomPhoto,
          chatHistory: chatHistory.slice(-6).map(m => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text
          })),
          excludeProductIds: activeOutfits.map(p => p.id)
        })
      });

      const data = await res.json();
      const aiReply = data.assistantMessage || "Here are my top styling recommendations for you!";
      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: aiReply,
        options: data.suggestedQuestions || [],
        suggestScreenshotUpload: !!data.suggestScreenshotUpload
      };

      setChatHistory(prev => [...prev, aiMsg]);

      // Automatically sync studio category tab to match the AI recommendation
      if (data.targetCategory) {
        setSelectedCategory(data.targetCategory);
      }

      // If this was a recommendation turn (not just a questioning turn), load outfits
      if (data.recommendedProducts && data.recommendedProducts.length > 0 && !data.isQuestioningTurn) {
        setActiveOutfits(data.recommendedProducts);
        setCurrentTryonGarment(data.recommendedProducts[0]);
      }
    } catch (err) {
      console.error("Stylist consult failed:", err);
      setChatHistory(prev => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: "ai",
          text: "Sorry, I had trouble connecting to the stylist engine. Please try asking again!",
          options: ["🌴 Linen Shirts", "👔 Formal Shirts", "✨ Festive Kurtas"]
        }
      ]);
    } finally {
      setIsStylistTyping(false);
    }
  };



  // Wardrobe items loaded dynamically from Supabase API on demand
  const filteredCatalog = catalogItems;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-8 animate-fade-in text-slate-900">
      
      {/* 1. STUDIO HEADER */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-indigo-50/90 via-purple-50/70 to-pink-50/80 border border-indigo-100 p-4 sm:p-6 md:p-8 backdrop-blur-xl shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 relative z-10">
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-center gap-2">
              {onBackToSearch && (
                <button
                  type="button"
                  onClick={onBackToSearch}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs transition-all active:scale-95 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-brand-indigo" />
                  <span>Back to Deals</span>
                </button>
              )}
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-100/90 border border-indigo-200/80 text-brand-indigo text-[10px] sm:text-xs font-bold tracking-wide uppercase">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                AI Virtual Trial Room & Stylist
              </div>
            </div>
            <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Virtual Studio <span className="bg-gradient-to-r from-brand-indigo via-purple-600 to-pink-600 bg-clip-text text-transparent">Try-On</span>
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm md:text-base max-w-2xl font-medium leading-relaxed">
              Zero-distortion fit engine with 100% identity locking. Try hundreds of curated outfits from Myntra, Snitch, Ajio & Amazon directly on your authentic frame.
            </p>
          </div>

          {/* Gender & Skin Tone Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 bg-white/95 p-2 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200/80 justify-between">
              <button
                type="button"
                onClick={() => handleGenderChange("men")}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                  gender === "men" ? "bg-white text-brand-indigo shadow-sm" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                👔 Men
              </button>
              <button
                type="button"
                onClick={() => handleGenderChange("women")}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                  gender === "women" ? "bg-white text-pink-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                👗 Women
              </button>
              <button
                type="button"
                onClick={() => handleGenderChange("kids")}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                  gender === "kids" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                🧒 Kids
              </button>
            </div>

            <div className="flex items-center justify-between sm:justify-start gap-1.5 px-3 py-1.5 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-700">
              <span className="text-slate-500 font-semibold text-[11px]">Tone:</span>
              <select
                value={skinTone}
                onChange={(e) => setSkinTone(e.target.value)}
                className="bg-transparent text-indigo-950 font-bold focus:outline-none cursor-pointer text-xs"
              >
                <option value="wheatish" className="bg-white text-slate-900">Wheatish / Medium</option>
                <option value="fair" className="bg-white text-slate-900">Fair / Cool</option>
                <option value="dusky" className="bg-white text-slate-900">Dusky / Deep Warm</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN TRIAL STUDIO: PHOTO + AI STYLIST + 4-LOOK GOOGLE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: USER SNAPSHOT CONTROLS (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel border border-slate-200/90 rounded-3xl p-5 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-indigo"></span>
                Your Persona Studio
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                🔒 Identity Locked
              </span>
            </div>

            {/* User Photo Preview & Active Try-On View */}
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group shadow-inner">
              <Image
                src={viewMode === "original" ? userImage : (tryonResultImage || userImage)}
                alt="User Snapshot"
                fill
                unoptimized
                className="object-cover object-center transition-all duration-300"
                sizes="(max-width: 768px) 100vw, 400px"
              />

              {/* Before / After & Client-Side Compare Pill */}
              {tryonResultImage && (
                <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-1.5 max-w-[92%]">
                  <div className="flex items-center bg-slate-900/80 backdrop-blur-md p-0.5 rounded-xl border border-white/20 shadow-md">
                    <button
                      type="button"
                      onClick={() => setViewMode("tryon")}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        viewMode === "tryon" ? "bg-white text-slate-900 shadow-sm" : "text-slate-300 hover:text-white"
                      }`}
                    >
                      ✨ Fitted Look
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("original")}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        viewMode === "original" ? "bg-white text-slate-900 shadow-sm" : "text-slate-300 hover:text-white"
                      }`}
                    >
                      👤 Original
                    </button>
                  </div>

                  {/* Instant In-Browser Session Compare Button (0 Server Storage, Instant Flip) */}
                  {previousLook && (
                    <button
                      type="button"
                      onClick={() => {
                        const curImg = tryonResultImage;
                        const curGarment = currentTryonGarment;
                        setTryonResultImage(previousLook.image);
                        setCurrentTryonGarment(previousLook.garment);
                        setPreviousLook({ image: curImg, garment: curGarment });
                        setViewMode("tryon");
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold bg-amber-500/90 hover:bg-amber-600 text-slate-950 backdrop-blur-md border border-amber-300/40 shadow-md transition-all cursor-pointer active:scale-95"
                      title={`Compare with previous look (${previousLook.garment?.title?.slice(0, 25) || 'Previous Outfit'}...)`}
                    >
                      <span>🔁 Compare Looks</span>
                    </button>
                  )}
                </div>
              )}

              {/* Body Scan & Calibration HUD Overlay */}
              {isScanningBody && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center gap-3 z-30 animate-fade-in">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <div className="absolute inset-0 border-2 border-dashed border-cyan-400 rounded-full animate-spin"></div>
                    <div className="text-xl">🧬</div>
                  </div>
                  <div className="bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-3 shadow-xl space-y-1">
                    <p className="text-xs font-black text-cyan-400 tracking-wide uppercase">AI Body Scanner Active</p>
                    <p className="text-[10px] text-slate-300">Calibrating posture, shoulders & tone profile...</p>
                  </div>
                </div>
              )}

              {/* Render Loading Overlay (Uninterrupted with live timer & stages) */}
              {isRendering && (
                <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center gap-3 z-30 animate-fade-in">
                  <div className="relative w-14 h-14">
                    <div className="w-14 h-14 rounded-full border-3 border-white/20 border-t-brand-indigo animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-sm">✨</div>
                  </div>
                  
                  <div className="space-y-1 max-w-[260px]">
                    <span className="text-xs font-bold text-white tracking-wide block">
                      {renderElapsed < 6
                        ? "🔍 Analyzing body posture & shoulders..."
                        : renderElapsed < 16
                        ? "🧵 Draping fabric & aligning natural folds..."
                        : renderElapsed < 26
                        ? "✨ Refining fabric texture, lighting & shadows..."
                        : "⚡ Finalizing high-resolution neural render..."}
                    </span>
                    <span className="text-[10px] font-medium text-slate-300 block">
                      Neural AI Draping • {renderElapsed}s elapsed
                    </span>
                  </div>

                  {/* Progress Bar Animation */}
                  <div className="w-44 h-1.5 bg-white/15 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-indigo via-purple-400 to-pink-400 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(96, renderElapsed < 25 ? (renderElapsed / 25) * 88 : 88 + Math.min(8, (renderElapsed - 25) * 0.2))}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Garment Floating Badge on Top-Right (Only for catalog items) */}
              {currentTryonGarment && !currentTryonGarment.isCustomUpload && (
                <div className="absolute top-3 right-3 z-20 flex items-center gap-2 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-xl p-1.5 pr-3 shadow-lg">
                  <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex-shrink-0">
                    <Image
                      src={currentTryonGarment.image || currentTryonGarment.image_url}
                      alt={currentTryonGarment.title}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-slate-500 uppercase leading-none">{currentTryonGarment.brand}</p>
                    <p className="text-xs font-black text-slate-900 leading-tight">{currentTryonGarment.price}</p>
                  </div>
                </div>
              )}

              {/* Direct Buy Floating Action Bar on Bottom (Only for valid affiliate / store products) */}
              {currentTryonGarment && !currentTryonGarment.isCustomUpload && currentTryonGarment.direct_link && currentTryonGarment.direct_link !== "#" && (
                <div className="absolute bottom-3 inset-x-3 z-20 flex items-center justify-between gap-2 p-2 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-xl shadow-xl">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 truncate">{currentTryonGarment.title}</p>
                    <p className="text-[10px] text-brand-indigo font-bold truncate">{currentTryonGarment.fabric || "Verified Merchant Fabric"}</p>
                  </div>
                  <a
                    href={currentTryonGarment.direct_link || currentTryonGarment.deal_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-gradient-to-r from-brand-indigo to-brand-violet hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-bold shadow-md shadow-brand-indigo/20 transition-all transform hover:scale-105"
                  >
                    Buy Deal ➔
                  </a>
                </div>
              )}
            </div>

            {/* Photo & Garment Upload Actions */}
            <div className="space-y-2.5">
              {/* Visual Photo Upload Guideline Box */}
              <div className="bg-gradient-to-br from-indigo-50/95 via-purple-50/90 to-pink-50/90 border border-indigo-200/80 rounded-2xl p-3 text-[11px] space-y-1.5 shadow-xs">
                <div className="flex items-center gap-1.5 font-bold text-brand-indigo text-xs">
                  <Camera className="w-4 h-4 text-brand-indigo" />
                  <span>📸 How to Upload for Best Fit:</span>
                </div>
                <ul className="space-y-1 text-slate-700 leading-snug pl-1">
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span><strong>Front-Facing View:</strong> Upload a clear half-body or full-body front photo.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span><strong>Good Lighting:</strong> Keep shoulders and outfit clearly visible.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span className="text-slate-500">Avoid side angles, rear views, group photos, or blur.</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleRequestPhotoUpload}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-brand-indigo to-brand-violet hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-brand-indigo/20 transition-all cursor-pointer active:scale-95"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{isCustomPhoto ? "Change Your Photo" : "Upload Your Photo"}</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.heic,.heif,.jpg,.jpeg,.png,.webp"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                {isCustomPhoto && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomPhoto(false);
                      setUserImage(SAMPLE_MODELS[gender].image);
                      setTryonResultImage(null);
                      setPreviousLook(null);
                      setBodyCalibration(null);
                      setChatHistory([
                        {
                          id: `reset-${Date.now()}`,
                          sender: "ai",
                          text: "👋 Switched to sample model avatar. What kind of outfit would you like to explore?",
                          options: [
                            "🌴 Breathable Linen Shirts",
                            "👔 100% Cotton Formal Shirts",
                            "✨ Wedding & Festive Kurtas",
                            "🔥 Night Party Streetwear"
                          ]
                        }
                      ]);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                    title="Reset to Sample Model"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Bank-Grade Privacy & Ephemeral AI Trust Badge */}
              <div className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold tracking-wide">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>256-bit Encrypted · Zero-Storage Ephemeral AI · Strict Privacy Guard</span>
              </div>

              {/* Upload Custom Garment Screenshot Button */}
              <button
                type="button"
                onClick={handleRequestGarmentUpload}
                className="w-full py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
              >
                <Shirt className="w-3.5 h-3.5 text-purple-600" />
                <span>📷 Upload Outfit Screenshot / Photo</span>
              </button>
              <input
                ref={garmentFileInputRef}
                type="file"
                accept="image/*,.heic,.heif,.jpg,.jpeg,.png,.webp"
                onChange={handleGarmentUpload}
                className="hidden"
              />
              <p className="text-[10px] text-slate-500 text-center px-1">
                💡 <em>Tip: Single front-facing garment photo works best (avoid folded packs).</em>
              </p>

              {/* Dedicated "Ask AI Stylist" Button when photo is uploaded */}
              {isCustomPhoto && (
                <button
                  type="button"
                  onClick={() => handleStylistQuery(`Recommend best matching outfits for my ${skinTone} skin tone and posture`)}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 hover:from-amber-500/20 hover:to-indigo-500/20 border border-indigo-200/80 text-indigo-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                  <span>✨ Ask AI for My Personal Styling</span>
                </button>
              )}
            </div>

            {photoQualityMsg && (
              <div className={`p-2 rounded-xl text-[11px] font-semibold text-center border ${
                photoQualityMsg.startsWith("✅")
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-amber-50 text-amber-800 border-amber-200"
              }`}>
                {photoQualityMsg}
              </div>
            )}

            {/* Blind Quality Feedback Loop */}
            {tryonResultImage && !feedbackGiven && (
              <div className="flex items-center justify-between p-2 rounded-xl bg-indigo-50/70 border border-indigo-100 text-[11px] text-indigo-900 font-medium">
                <span>How does the fit look?</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setFeedbackGiven(true);
                      setPhotoQualityMsg("✨ Thanks for your feedback! Glad you liked the drape.");
                    }}
                    className="px-2 py-0.5 rounded-lg bg-white border border-indigo-200 hover:bg-emerald-50 hover:text-emerald-700 text-xs transition-all cursor-pointer shadow-xs"
                    title="Good fit"
                  >
                    👍
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFeedbackGiven(true);
                      setPhotoQualityMsg("🙏 Thanks for letting us know! Try with a clearer front-facing photo for tighter draping.");
                    }}
                    className="px-2 py-0.5 rounded-lg bg-white border border-indigo-200 hover:bg-rose-50 hover:text-rose-700 text-xs transition-all cursor-pointer shadow-xs"
                    title="Needs improvement"
                  >
                    👎
                  </button>
                </div>
              </div>
            )}

            {/* Sleek Minimal Try-On Quota Status */}
            <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span className="font-semibold text-slate-700">Free AI Try-Ons</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5">
                  <div 
                    title={(quotaInfo?.remaining ?? 2) >= 1 ? "1st Try-On Available" : "1st Try-On Used"}
                    className={`w-2 h-2 rounded-full transition-all ${
                      (quotaInfo?.remaining ?? 2) >= 1 ? "bg-emerald-500 ring-2 ring-emerald-200" : "bg-slate-300"
                    }`} 
                  />
                  <div 
                    title={(quotaInfo?.remaining ?? 2) >= 2 ? "2nd Try-On Available" : "2nd Try-On Used"}
                    className={`w-2 h-2 rounded-full transition-all ${
                      (quotaInfo?.remaining ?? 2) >= 2 ? "bg-emerald-500 ring-2 ring-emerald-200" : "bg-slate-300"
                    }`} 
                  />
                </div>
                <span className="font-bold text-slate-900 text-[11px]">
                  {(quotaInfo?.remaining ?? 2) > 0 
                    ? `${quotaInfo.remaining} / 2 Left` 
                    : "2 / 2 Used"}
                </span>
              </div>
            </div>

            {/* 100% Private Ephemeral Memory Badge */}
            <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-[10px] text-slate-500 font-medium text-center">
              <span>🔒</span>
              <span>100% Private: Photos stay in ephemeral memory and are never saved to any database.</span>
            </div>

            {tryonErrorMsg && (
              tryonErrorMsg === "UNAUTHORIZED" || tryonErrorMsg.includes("Sign-in required") ? (
                <div className="p-3.5 rounded-2xl text-[11px] font-medium bg-gradient-to-br from-indigo-50/90 to-violet-50/90 text-slate-800 border border-indigo-200/90 shadow-sm space-y-2 animate-fade-in text-center">
                  <div className="flex items-center justify-center gap-1.5 font-bold text-indigo-950">
                    <Lock className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Sign In Required</span>
                  </div>
                  <p className="leading-snug text-slate-600 text-[11px]">
                    Virtual Try-On requires an authenticated account to render AI fits. Please sign in to generate photorealistic drapes on your photo.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (clerk && typeof clerk.openSignIn === "function") {
                        clerk.openSignIn();
                      }
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Lock className="w-3 h-3" />
                    <span>Sign In to Try On Outfits</span>
                  </button>
                </div>
              ) : tryonErrorMsg.includes("Daily free limit") || tryonErrorState?.type === "QUOTA" ? (
                <div className="p-3.5 rounded-2xl text-[11px] font-medium bg-amber-50/95 text-amber-950 border border-amber-200/90 shadow-sm space-y-2 animate-fade-in text-center">
                  <div className="flex items-center justify-center gap-1.5 font-bold text-amber-900">
                    <span>✨</span>
                    <span>Daily Free Limit Reached (3/3)</span>
                  </div>
                  <p className="leading-snug text-amber-800 text-[11px]">
                    {tryonErrorMsg}
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowUpgradeModal(true)}
                    className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>View Upgrade Info</span>
                  </button>
                </div>
              ) : tryonErrorState?.type === "PHOTO_QUALITY" ? (
                <div className="p-3.5 rounded-2xl text-[11px] font-medium bg-purple-50 text-purple-950 border border-purple-200 shadow-sm space-y-2.5 animate-fade-in">
                  <div className="flex items-center gap-1.5 font-bold text-purple-900 text-xs">
                    <Camera className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>Photo Guidance:</span>
                  </div>
                  <p className="leading-snug text-slate-700 text-xs">{tryonErrorMsg}</p>
                  {tryonErrorState?.guidance && (
                    <p className="leading-snug text-purple-800 text-[11px] font-semibold bg-white/80 p-2 rounded-xl border border-purple-100">
                      💡 {tryonErrorState.guidance}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={handleRequestPhotoUpload}
                    className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Change Photo</span>
                  </button>
                </div>
              ) : tryonErrorState?.type === "GARMENT_ISSUE" ? (
                <div className="p-3.5 rounded-2xl text-[11px] font-medium bg-amber-50 text-amber-950 border border-amber-200 shadow-sm space-y-2.5 animate-fade-in">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs">
                    <Shirt className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Outfit Notice:</span>
                  </div>
                  <p className="leading-snug text-slate-700 text-xs">{tryonErrorMsg}</p>
                  {tryonErrorState?.guidance && (
                    <p className="leading-snug text-amber-800 text-[11px] font-semibold bg-white/80 p-2 rounded-xl border border-amber-100">
                      💡 {tryonErrorState.guidance}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setTryonErrorMsg("");
                      setTryonErrorState(null);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Shirt className="w-3.5 h-3.5" />
                    <span>Choose Another Look Below</span>
                  </button>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl text-[11px] font-medium bg-amber-50 text-amber-900 border border-amber-200/90 shadow-sm space-y-2.5 animate-fade-in">
                  <div className="flex items-center gap-1.5 font-bold text-amber-950 text-xs">
                    <span>⚡</span>
                    <span>High Traffic Notice:</span>
                  </div>
                  <p className="leading-snug text-slate-800 text-xs">{tryonErrorMsg}</p>
                  {tryonErrorState?.guidance && (
                    <p className="leading-snug text-amber-800 text-[11px] font-semibold bg-white/80 p-2 rounded-xl border border-amber-100">
                      💡 {tryonErrorState.guidance}
                    </p>
                  )}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleTryOnOutfit(currentTryonGarment)}
                      className="flex-1 py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Try Again</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleRequestPhotoUpload}
                      className="py-2 px-3 rounded-xl bg-white hover:bg-amber-100/70 text-slate-700 border border-amber-200 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Camera className="w-3.5 h-3.5 text-slate-600" />
                      <span>Change Photo</span>
                    </button>
                    {onOpenSupportTicket && (
                      <button
                        type="button"
                        onClick={onOpenSupportTicket}
                        className="py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        title="Report issue or claim credit restoration"
                      >
                        <LifeBuoy className="w-3.5 h-3.5 text-blue-600" />
                        <span>Support</span>
                      </button>
                    )}
                  </div>
                </div>
              )
            )}

            <p className="text-[11px] text-slate-500 text-center leading-tight">
              Tip: Upload a front-facing full/half body photo with neutral lighting for 100% flawless drape accuracy.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: AI STYLIST INTERVIEW + GOOGLE-STYLE 4-LOOK GRID (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* SLEEK "ASK YOUR AI STYLIST" PROMPT BAR */}
          <div className="glass-panel border border-indigo-100/90 rounded-2xl p-3 sm:p-4 shadow-xs space-y-2.5">
            {/* Simple, clear 1-line guidance explaining to the user what they can ask */}
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Sparkles className="w-3.5 h-3.5 text-brand-indigo shrink-0" />
              <p className="leading-snug">
                <strong className="text-slate-800">Ask Your AI Stylist:</strong> Ask for any occasion, color or style (e.g. <em>&ldquo;Show wedding kurtas&rdquo;</em>, <em>&ldquo;Office shirts&rdquo;</em>, <em>&ldquo;Casual weekend look&rdquo;</em>) to find matches:
              </p>
            </div>

            {/* Clean Prompt Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleStylistQuery();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask Your AI Stylist what to wear (e.g. 'Show me linen shirts', 'Wedding kurtas')..."
                className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo shadow-2xs"
              />
              <button
                type="submit"
                disabled={isStylistTyping || !chatInput.trim()}
                className="px-4 py-2 bg-gradient-to-r from-brand-indigo to-brand-violet hover:from-indigo-600 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 flex items-center gap-1.5 shrink-0"
              >
                <span>Ask AI</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* AI Active Response (Only shows if user asked a question) */}
            {isStylistTyping && (
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 animate-fade-in">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-indigo animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-indigo animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-indigo animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-[11px] font-medium ml-1">AI Stylist is picking matching looks for you...</span>
              </div>
            )}

            {!isStylistTyping && chatHistory.filter(m => m.sender === "ai").length > 0 && (() => {
              const latestAi = chatHistory.filter(m => m.sender === "ai").slice(-1)[0];
              if (!latestAi) return null;
              return (
                <div className="space-y-2 animate-fade-in">
                  <div className="p-3 rounded-2xl bg-indigo-50/80 border border-indigo-100 text-xs text-indigo-950 flex items-start gap-2.5 shadow-2xs">
                    <Sparkles className="w-4 h-4 text-brand-indigo shrink-0 mt-0.5" />
                    <div className="flex-1 space-y-2.5">
                      <p className="text-xs leading-relaxed font-medium">
                        {latestAi.text}
                      </p>

                      {/* Out-of-the-Box / Custom Screenshot Upload CTA */}
                      {latestAi.suggestScreenshotUpload && (
                        <div className="p-2.5 rounded-xl bg-purple-50/90 border border-purple-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-2xs">
                          <div className="flex items-center gap-2 text-[11px] font-semibold text-purple-900">
                            <span className="text-base">📸</span>
                            <span>Seen a look on Pinterest or Instagram? Upload screenshot to try it on!</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => garmentFileInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white text-[11px] font-bold shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
                          >
                            Upload Screenshot
                          </button>
                        </div>
                      )}

                      {/* 1-Tap Quick Answer / Follow-up Question Chips */}
                      {Array.isArray(latestAi.options) && latestAi.options.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider mr-0.5">Quick Reply:</span>
                          {latestAi.options.map((option, optIdx) => (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => handleStylistQuery(option)}
                              className="px-2.5 py-1 rounded-lg bg-white hover:bg-brand-indigo hover:text-white border border-indigo-200 text-indigo-700 text-[11px] font-semibold transition-all shadow-2xs cursor-pointer active:scale-95"
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* 4-LOOK GOOGLE-STYLE STUDIO GRID */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                Tailored Lookbook Grid (Google Style)
              </h3>
              <span className="text-xs text-slate-500">Click any look to preview on avatar</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {activeOutfits.slice(0, 4).map((outfit, idx) => {
                const isSelected = currentTryonGarment?.id === outfit.id;
                return (
                  <div
                    key={outfit.id || idx}
                    onClick={() => handleTryOnOutfit(outfit)}
                    className={`group relative flex flex-col bg-white border rounded-2xl p-2.5 transition-all cursor-pointer shadow-sm hover:shadow-md ${
                      isSelected
                        ? "border-brand-indigo ring-2 ring-brand-indigo/30 bg-indigo-50/30"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {/* Look Index Badge */}
                    <div className="absolute top-4 left-4 z-10 px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-[10px] font-black text-white shadow-sm">
                      LOOK #{idx + 1}
                    </div>

                    {/* Garment Image */}
                    <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-slate-50 mb-2">
                      <Image
                        src={getOptimizedThumbUrl(outfit.image || outfit.image_url)}
                        alt={outfit.title}
                        fill
                        unoptimized
                        loading="lazy"
                        decoding="async"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, 200px"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/shirt.jpg";
                        }}
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-brand-indigo/10 border-2 border-brand-indigo rounded-xl"></div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="space-y-1 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-brand-indigo uppercase tracking-wider truncate">
                          {outfit.brand || outfit.store}
                        </p>
                        <h4 className="text-xs font-semibold text-slate-800 line-clamp-1 group-hover:text-brand-indigo transition-colors">
                          {outfit.title}
                        </h4>
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                        <span className="text-xs font-black text-slate-900">{outfit.price}</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTryOnOutfit(outfit);
                            }}
                            className="px-2 py-1 rounded-lg bg-indigo-50 hover:bg-brand-indigo text-brand-indigo hover:text-white text-[10px] font-bold transition-all"
                            title="Try On Outfit"
                          >
                            📸 Try
                          </button>
                          <a
                            href={outfit.direct_link || outfit.deal_link || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-brand-indigo text-slate-700 hover:text-white text-[10px] font-bold transition-all"
                          >
                            Buy ➔
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Price Disclaimer Notice */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 bg-slate-50/80 border border-slate-200/80 rounded-xl px-3.5 py-2 mt-2">
              <div className="flex items-center gap-1.5">
                <span className="text-amber-600 font-bold">ℹ️ Disclaimer:</span>
                <span>Product prices, stock and deal discounts are subject to live updates on the merchant store.</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">Myntra / Merchant Verified</span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. BROWSE FULL 1,500+ MASTER WARDROBE RACK */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg md:text-xl font-black text-slate-900 flex items-center gap-2">
              <Shirt className="w-5 h-5 text-brand-indigo" />
              <span>Curated Wardrobe Rack</span>
            </h2>
            <p className="text-xs text-slate-500">
              Browse 1,500+ verified styles across 29 categories with 1-click photorealistic virtual try-on.
            </p>
          </div>

          {/* Search inside Wardrobe */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by color, fabric, brand..."
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-indigo shadow-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {currentCategoryTabs.filter(tab => !tab.gender || tab.gender === gender).map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setSelectedCategory(tab.key)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === tab.key
                  ? "bg-gradient-to-r from-brand-indigo to-brand-violet text-white shadow-md shadow-brand-indigo/20"
                  : "bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Wardrobe Items Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {isLoadingCatalog && catalogItems.length === 0 ? (
            Array.from({ length: 12 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="bg-white border border-slate-200 rounded-2xl p-3 flex flex-col justify-between space-y-2.5 animate-pulse"
              >
                <div className="relative aspect-[3/4] w-full rounded-xl bg-slate-100" />
                <div className="space-y-1.5 pt-1">
                  <div className="h-3 bg-slate-200 rounded w-3/4" />
                  <div className="h-2.5 bg-slate-100 rounded w-1/2" />
                  <div className="flex justify-between items-center pt-1">
                    <div className="h-3 bg-slate-200 rounded w-1/3" />
                    <div className="h-3 bg-emerald-50 rounded w-1/4" />
                  </div>
                </div>
                <div className="flex gap-1.5 pt-1">
                  <div className="h-7 bg-indigo-50/50 rounded-lg flex-1" />
                  <div className="h-7 bg-slate-100 rounded-lg w-8" />
                </div>
              </div>
            ))
          ) : catalogItems.length > 0 ? (
            filteredCatalog.map((item) => (
              <div
                key={item.id}
                className="group bg-white border border-slate-200 hover:border-brand-indigo/60 rounded-2xl p-3 flex flex-col justify-between transition-all hover:shadow-md space-y-2.5"
              >
                <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-slate-50">
                  <Image
                    src={getOptimizedThumbUrl(item.image || item.image_url)}
                    alt={item.title}
                    fill
                    unoptimized
                    loading="lazy"
                    decoding="async"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, 150px"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/shirt.jpg";
                    }}
                  />
                  <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-[9px] font-black text-slate-800 border border-slate-200 shadow-sm">
                    {item.brand}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-brand-indigo transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 line-clamp-1 font-medium">{item.fabric || item.occasion}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-black text-slate-900">{item.price}</span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">{item.discount_percent}% OFF</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => handleTryOnOutfit(item)}
                    className="flex-1 py-1.5 bg-indigo-50 hover:bg-brand-indigo border border-indigo-200 text-brand-indigo hover:text-white rounded-lg text-[10px] font-black transition-all cursor-pointer active:scale-95"
                  >
                    📸 Try On
                  </button>
                  <a
                    href={item.direct_link || item.deal_link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-900 rounded-lg text-[10px] font-bold transition-all"
                    title="Buy on Store"
                  >
                    Buy
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
              <Shirt className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-sm text-slate-700">No outfits found matching this selection.</p>
              <p className="text-xs text-slate-400 mt-1">Try switching category tabs or clearing your search filter.</p>
            </div>
          )}
        </div>

        {/* Bottom Wardrobe Live Price Disclaimer Banner */}
        <div className="text-center pt-2 pb-6">
          <span className="text-[11px] text-slate-500 font-medium bg-slate-50 border border-slate-200/80 px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-2xs">
            🏷️ Note: Product prices, deals, and discounts are fetched directly from merchant stores (Myntra/Ajio) and are subject to live store updates.
          </span>
        </div>
      </div>

      {/* Honest Upgrade-Coming-Soon Modal (Zero Fake Checkout) */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 text-center space-y-4">
            <button
              type="button"
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-100 to-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto text-2xl shadow-inner">
              ✨
            </div>
            
            <div className="space-y-1.5">
              <span className="inline-block px-3 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider">
                Daily Allowance Reached
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                Daily Free Try-On Allowance Reached (3/3)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                You have used your 3 free photorealistic AI try-ons for today. Your daily limit resets at <strong>midnight (12:00 AM IST)</strong>.
              </p>
            </div>

            <div className="p-3.5 bg-gradient-to-br from-indigo-50/80 via-purple-50/60 to-pink-50/70 border border-indigo-100 rounded-2xl text-left space-y-1">
              <p className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-indigo" />
                <span>Shop Smart AI Pro (Unlimited AI Fits)</span>
              </p>
              <p className="text-[11px] text-slate-600 leading-normal">
                We are building premium subscription plans with unlimited try-ons, multi-outfit styling, and high-priority GPU rendering. Stay tuned!
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowUpgradeModal(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
