"use client";

import React, { useState, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ShieldCheck, Tag } from "lucide-react";

const CATEGORIES = [
  { 
    id: "all", 
    label: "All Stores", 
    emoji: "🔥", 
    bgGradient: "from-violet-900 via-purple-950 to-slate-950",
    iconBg: "bg-violet-500/25 border-violet-400/40 text-violet-300"
  },
  { 
    id: "food", 
    label: "Food & Dining", 
    emoji: "🍕", 
    bgGradient: "from-rose-900 via-red-950 to-slate-950",
    iconBg: "bg-rose-500/25 border-rose-400/40 text-rose-300"
  },
  { 
    id: "grocery", 
    label: "Quick Grocery", 
    emoji: "⚡", 
    bgGradient: "from-amber-900 via-yellow-950 to-slate-950",
    iconBg: "bg-amber-500/25 border-amber-400/40 text-amber-300"
  },
  { 
    id: "fashion", 
    label: "Fashion & Beauty", 
    emoji: "👗", 
    bgGradient: "from-pink-900 via-fuchsia-950 to-slate-950",
    iconBg: "bg-pink-500/25 border-pink-400/40 text-pink-300"
  },
  { 
    id: "tech", 
    label: "Tech & Gadgets", 
    emoji: "💻", 
    bgGradient: "from-sky-900 via-blue-950 to-slate-950",
    iconBg: "bg-sky-500/25 border-sky-400/40 text-sky-300"
  },
  { 
    id: "travel", 
    label: "Travel & Rides", 
    emoji: "✈️", 
    bgGradient: "from-emerald-900 via-teal-950 to-slate-950",
    iconBg: "bg-emerald-500/25 border-emerald-400/40 text-emerald-300"
  }
];

export const FEATURED_STORES = [
  {
    key: "zomato",
    name: "Zomato",
    category: "Food Delivery & Dining",
    catGroup: "food",
    logo: "🍕",
    gradient: "from-red-500/10 via-rose-500/5 to-transparent",
    borderHover: "hover:border-red-400/80 hover:shadow-red-500/10",
    badgeColor: "bg-red-50 text-red-700 border-red-200",
    offersCount: 4,
    bestOffer: "Flat 50% OFF up to ₹100",
    tagline: "Universal Cart & Bank Deals"
  },
  {
    key: "swiggy",
    name: "Swiggy",
    category: "Food Delivery",
    catGroup: "food",
    logo: "🛵",
    gradient: "from-orange-500/10 via-amber-500/5 to-transparent",
    borderHover: "hover:border-orange-400/80 hover:shadow-orange-500/10",
    badgeColor: "bg-orange-50 text-orange-700 border-orange-200",
    offersCount: 3,
    bestOffer: "Flat 50% OFF up to ₹100",
    tagline: "Verified Gourmet & Daily Codes"
  },
  {
    key: "blinkit",
    name: "Blinkit",
    category: "10-Min Grocery Delivery",
    catGroup: "grocery",
    logo: "⚡",
    gradient: "from-amber-400/15 via-yellow-400/5 to-transparent",
    borderHover: "hover:border-amber-400/80 hover:shadow-amber-500/10",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    offersCount: 2,
    bestOffer: "Flat ₹100 OFF on ₹499+",
    tagline: "Instant Grocery Savings"
  },
  {
    key: "zepto",
    name: "Zepto",
    category: "10-Min Grocery Delivery",
    catGroup: "grocery",
    logo: "🚀",
    gradient: "from-purple-500/10 via-violet-500/5 to-transparent",
    borderHover: "hover:border-purple-400/80 hover:shadow-purple-500/10",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    offersCount: 2,
    bestOffer: "Flat ₹100 OFF + Free Del",
    tagline: "Fresh Fruits & Essentials"
  },
  {
    key: "dominos",
    name: "Domino's Pizza",
    category: "Pizza & Delivery",
    catGroup: "food",
    logo: "🍕",
    gradient: "from-blue-600/10 via-indigo-600/5 to-transparent",
    borderHover: "hover:border-blue-400/80 hover:shadow-blue-500/10",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    offersCount: 2,
    bestOffer: "Flat ₹300 OFF First Order",
    tagline: "Weekend Pizza Party Deals"
  },
  {
    key: "myntra",
    name: "Myntra",
    category: "Fashion & Lifestyle",
    catGroup: "fashion",
    logo: "👗",
    gradient: "from-pink-500/10 via-rose-500/5 to-transparent",
    borderHover: "hover:border-pink-400/80 hover:shadow-pink-500/10",
    badgeColor: "bg-pink-50 text-pink-700 border-pink-200",
    offersCount: 3,
    bestOffer: "Flat ₹200 OFF on ₹999+",
    tagline: "Top Apparel & Footwear"
  },
  {
    key: "ajio",
    name: "Ajio",
    category: "Fashion & Trends",
    catGroup: "fashion",
    logo: "🛍️",
    gradient: "from-slate-700/10 via-slate-800/5 to-transparent",
    borderHover: "hover:border-slate-500/80 hover:shadow-slate-500/10",
    badgeColor: "bg-slate-100 text-slate-800 border-slate-300",
    offersCount: 2,
    bestOffer: "Flat ₹500 OFF on ₹1,990+",
    tagline: "International Brands & Trends"
  },
  {
    key: "nykaa",
    name: "Nykaa",
    category: "Beauty & Cosmetics",
    catGroup: "fashion",
    logo: "💄",
    gradient: "from-fuchsia-500/10 via-pink-500/5 to-transparent",
    borderHover: "hover:border-fuchsia-400/80 hover:shadow-fuchsia-500/10",
    badgeColor: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
    offersCount: 1,
    bestOffer: "Flat ₹150 OFF for New Shoppers",
    tagline: "Skincare & Cosmetics"
  },
  {
    key: "croma",
    name: "Croma Electronics",
    category: "Gadgets & Appliances",
    catGroup: "tech",
    logo: "💻",
    gradient: "from-teal-500/10 via-emerald-500/5 to-transparent",
    borderHover: "hover:border-teal-400/80 hover:shadow-teal-500/10",
    badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
    offersCount: 1,
    bestOffer: "Flat ₹500 OFF on ₹10,000+",
    tagline: "Laptops, Audio & Electronics"
  },
  {
    key: "makemytrip",
    name: "MakeMyTrip",
    category: "Flights & Hotels",
    catGroup: "travel",
    logo: "✈️",
    gradient: "from-rose-600/10 via-red-600/5 to-transparent",
    borderHover: "hover:border-rose-400/80 hover:shadow-rose-500/10",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    offersCount: 1,
    bestOffer: "12% OFF up to ₹1,500 Flights",
    tagline: "Domestic Flight Booking"
  },
  {
    key: "uber",
    name: "Uber India",
    category: "Cab & Auto Rides",
    catGroup: "travel",
    logo: "🚗",
    gradient: "from-slate-900/10 via-black/5 to-transparent",
    borderHover: "hover:border-slate-800/80 hover:shadow-slate-900/10",
    badgeColor: "bg-slate-100 text-slate-900 border-slate-300",
    offersCount: 1,
    bestOffer: "Flat 50% OFF up to ₹75",
    tagline: "First 2 Rides Special"
  }
];

export default function StoreCardCarousel({ onSelectStore }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const scrollContainerRef = useRef(null);

  const categoryCounts = useMemo(() => {
    const counts = { all: FEATURED_STORES.length };
    CATEGORIES.forEach(cat => {
      if (cat.id !== "all") {
        counts[cat.id] = FEATURED_STORES.filter(s => s.catGroup === cat.id).length;
      }
    });
    return counts;
  }, []);

  const filteredStores = activeCategory === "all"
    ? FEATURED_STORES
    : FEATURED_STORES.filter(s => s.catGroup === activeCategory);

  const scroll = (direction) => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = direction === "left" ? -340 : 340;
    scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-4 sm:mt-6 text-left px-1">
      {/* Category Tabs Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-violet-600 shrink-0" />
            <h3 className="text-xs sm:text-base font-extrabold text-slate-900 tracking-tight">
              Featured Stores &amp; Verified Codes
            </h3>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/90 text-[9px] sm:text-[10px] font-bold text-emerald-700 shadow-2xs">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>100% Verified</span>
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
            Tap any store box below to explore all working promo codes & cart discounts
          </p>
        </div>

        {/* Carousel Navigation Arrows */}
        <div className="hidden sm:flex items-center gap-1.5 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 shadow-2xs transition-all active:scale-95 cursor-pointer"
            title="Previous Stores"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 shadow-2xs transition-all active:scale-95 cursor-pointer"
            title="Next Stores"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Mini Visual Tiles (AdvCoupon style) */}
      <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar scroll-smooth py-1 px-0.5 mb-3 scrollbar-none">
        {CATEGORIES.map(cat => {
          const isSelected = activeCategory === cat.id;
          const count = categoryCounts[cat.id] ?? 0;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`relative w-[130px] sm:w-[155px] h-[70px] sm:h-[76px] p-2.5 rounded-2xl bg-gradient-to-br ${cat.bgGradient} text-white flex flex-col justify-between shrink-0 text-left transition-all duration-200 cursor-pointer overflow-hidden group select-none active:scale-95 ${
                isSelected
                  ? "ring-2 ring-violet-400 ring-offset-2 ring-offset-white shadow-md shadow-violet-500/30 border border-violet-300/40 scale-[1.02]"
                  : "border border-white/10 hover:border-white/20 hover:scale-[1.01] shadow-2xs opacity-90 hover:opacity-100"
              }`}
            >
              {/* Ambient Light Orb */}
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-white/10 rounded-full blur-xl pointer-events-none group-hover:bg-white/20 transition-all" />

              {/* Top Row: Translucent Squircle Emoji + Counter Pill */}
              <div className="flex items-center justify-between relative z-10">
                <div className={`w-6 h-6 rounded-lg ${cat.iconBg} backdrop-blur-xs flex items-center justify-center border shrink-0 shadow-2xs text-xs`}>
                  <span>{cat.emoji}</span>
                </div>
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black tracking-wider ${
                  isSelected ? "bg-white text-slate-900 shadow-2xs" : "bg-white/15 text-white/90 backdrop-blur-xs border border-white/10"
                }`}>
                  {count}
                </span>
              </div>

              {/* Bottom Row: Category Name + Subtle Arrow Circle */}
              <div className="flex items-end justify-between relative z-10 gap-1">
                <span className="font-extrabold text-[11px] sm:text-xs text-white leading-tight truncate">
                  {cat.label}
                </span>
                <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                  isSelected 
                    ? "bg-white text-slate-950 scale-110 shadow-2xs" 
                    : "bg-white/15 text-white/70 group-hover:translate-x-0.5"
                }`}>
                  <ChevronRight className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Smooth Carousel Container */}
      <div
        ref={scrollContainerRef}
        className="flex items-stretch gap-3 sm:gap-4 overflow-x-auto pb-3 pt-1 px-0.5 scroll-smooth scrollbar-none"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {filteredStores.map((store) => (
          <motion.div
            key={store.key}
            whileHover={{ y: -3, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={() => onSelectStore(store.name)}
            className={`min-w-[220px] sm:min-w-[270px] max-w-[270px] p-3.5 sm:p-5 rounded-2xl bg-white border border-slate-200/90 ${store.borderHover} shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group select-none`}
            style={{ scrollSnapAlign: "start" }}
          >
            {/* Ambient Background Gradient Accent */}
            <div className={`absolute inset-0 bg-gradient-to-br ${store.gradient} pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity`} />

            <div className="relative z-10">
              {/* Header: Logo, Name & Live Count */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-xl shadow-2xs group-hover:scale-110 transition-transform">
                    {store.logo}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 group-hover:text-violet-700 transition-colors tracking-tight">
                      {store.name}
                    </h4>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {store.category}
                    </span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border shrink-0 ${store.badgeColor}`}>
                  {store.offersCount} Active
                </span>
              </div>

              {/* Best Discount Hook Banner */}
              <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/60 mb-2">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-0.5">
                  <Sparkles className="w-3 h-3 fill-amber-500 text-amber-500" />
                  <span>Top Discount</span>
                </div>
                <p className="text-xs font-black text-slate-900">
                  {store.bestOffer}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {store.tagline}
                </p>
              </div>
            </div>

            {/* Footer Action: View Codes */}
            <div className="relative z-10 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified
              </span>
              <span className="text-xs font-bold text-violet-600 group-hover:text-violet-800 flex items-center gap-1 group-hover:translate-x-1 transition-all">
                <span>View Codes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
