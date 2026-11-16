"use client";

import React, { useState, useRef, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ShieldCheck, Tag } from "lucide-react";
import { getTopBrandsForCountry } from "@/data/countryBrandsCatalog";

const CATEGORIES = [
  { 
    id: "all", 
    label: "Top 100 Stores", 
    emoji: "🔥", 
    bgGradient: "from-violet-900 via-purple-950 to-slate-950",
    iconBg: "bg-violet-500/25 border-violet-400/40 text-violet-300"
  },
  { 
    id: "retail", 
    label: "Megastores & Retail", 
    emoji: "🏬", 
    bgGradient: "from-blue-900 via-indigo-950 to-slate-950",
    iconBg: "bg-blue-500/25 border-blue-400/40 text-blue-300"
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
    label: "Groceries & Daily", 
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
    id: "health", 
    label: "Health & Pharma", 
    emoji: "💊", 
    bgGradient: "from-teal-900 via-emerald-950 to-slate-950",
    iconBg: "bg-teal-500/25 border-teal-400/40 text-teal-300"
  },
  { 
    id: "travel", 
    label: "Travel & Rides", 
    emoji: "✈️", 
    bgGradient: "from-emerald-900 via-teal-950 to-slate-950",
    iconBg: "bg-emerald-500/25 border-emerald-400/40 text-emerald-300"
  }
];

export default function StoreCardCarousel({ onSelectStore, country = "IN" }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const scrollContainerRef = useRef(null);

  const countryBrands = useMemo(() => {
    const raw = getTopBrandsForCountry(country);
    return raw.map(b => ({
      key: b.id,
      name: b.name,
      category: b.category,
      catGroup: b.catGroup || "retail",
      logo: b.logo || "🛍️",
      gradient: "from-violet-500/10 via-purple-500/5 to-transparent",
      borderHover: "hover:border-violet-400/80 hover:shadow-violet-500/10",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      offersCount: 3,
      bestOffer: b.bestOffer || "Verified Codes & Savings",
      tagline: b.tagline || "Official Verified Savings"
    }));
  }, [country]);

  const matchesCat = (store, catId) => {
    if (catId === "all") return true;
    if (catId === "fashion") return store.catGroup === "fashion" || store.catGroup === "beauty";
    return store.catGroup === catId;
  };

  const categoryCounts = useMemo(() => {
    const counts = { all: countryBrands.length };
    CATEGORIES.forEach(cat => {
      if (cat.id !== "all") {
        counts[cat.id] = countryBrands.filter(s => matchesCat(s, cat.id)).length;
      }
    });
    return counts;
  }, [countryBrands]);

  const filteredStores = countryBrands.filter(s => matchesCat(s, activeCategory));

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
          <Link
            key={store.key}
            href={`/coupons/${store.key}`}
            onClick={(e) => {
              if (onSelectStore) {
                e.preventDefault();
                onSelectStore(store.name);
              }
            }}
            className="block text-inherit no-underline"
          >
            <motion.div
              whileHover={{ y: -3, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
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
          </Link>
        ))}
      </div>
    </div>
  );
}
