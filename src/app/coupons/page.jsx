"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Search, 
  Tag, 
  Sparkles, 
  ShieldCheck, 
  Percent, 
  ExternalLink,
  Tv,
  Plane,
  ChevronRight
} from "lucide-react";
import { COUNTRY_TOP_BRANDS } from "@/data/countryBrandsCatalog";
import { getCountryMeta } from "@/lib/countryConfig";

const CATEGORIES = [
  { id: "all", label: "All Stores", icon: "🔥" },
  { id: "retail", label: "Retail & Mega Stores", icon: "🛍️" },
  { id: "tech", label: "Tech & Gadgets", icon: "⚡" },
  { id: "fashion", label: "Fashion & Lifestyle", icon: "👗" },
  { id: "beauty", label: "Beauty & Health", icon: "✨" },
  { id: "travel", label: "Travel & Hotels", icon: "✈️" },
  { id: "food", label: "Food & Delivery", icon: "🍕" },
  { id: "hosting", label: "SaaS & Hosting", icon: "💻" }
];

export default function CouponsMasterHubPage() {
  const [selectedCountry, setSelectedCountry] = useState("IN");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const countryMeta = useMemo(() => getCountryMeta(selectedCountry), [selectedCountry]);
  const currentBrands = useMemo(() => COUNTRY_TOP_BRANDS[selectedCountry] || [], [selectedCountry]);

  // Filtered brands based on search & category
  const filteredBrands = useMemo(() => {
    return currentBrands.filter((brand) => {
      const matchesSearch = 
        !searchQuery.trim() ||
        brand.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        brand.domain.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        (brand.category && brand.category.toLowerCase().includes(searchQuery.toLowerCase().trim()));

      const matchesCat = 
        selectedCategory === "all" ||
        brand.catGroup === selectedCategory ||
        (selectedCategory === "fashion" && brand.catGroup === "apparel") ||
        (selectedCategory === "hosting" && (brand.catGroup === "tech" || brand.catGroup === "saas"));

      return matchesSearch && matchesCat;
    });
  }, [currentBrands, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900">
      {/* Top Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/85 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-sm shadow-sm group-hover:scale-105 transition-transform">
              %
            </div>
            <div>
              <span className="font-black text-base tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors">
                Benefisto
              </span>
              <span className="text-[10px] font-bold text-emerald-600 block -mt-1 tracking-wider uppercase">
                Verified Coupons &amp; Deals Hub
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {/* Country Selector */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold gap-1">
              {[
                { code: "IN", flag: "🇮🇳" },
                { code: "US", flag: "🇺🇸" },
                { code: "GB", flag: "🇬🇧" },
                { code: "CA", flag: "🇨🇦" },
                { code: "AU", flag: "🇦🇺" },
                { code: "AE", flag: "🇦🇪" }
              ].map(({ code, flag }) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setSelectedCountry(code)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                    selectedCountry === code
                      ? "bg-white text-emerald-600 shadow-2xs font-black ring-1 ring-slate-200"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <span>{flag}</span>
                  <span>{code}</span>
                </button>
              ))}
            </div>

            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Tested &amp; Auto-Verified Promo Codes ({countryMeta?.name || "Global"})</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Active Coupons &amp; Discount Codes for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
              {countryMeta?.name || "Top Brands"}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Browse verified coupon codes, exclusive sitewide promotions, and instant cashback offers for 100+ premier brands in {countryMeta?.name}.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto mt-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search store by name (e.g. Nike, Amazon, Zara, Hostinger)...`}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-sm font-medium transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 px-2 py-1 rounded-lg bg-slate-100"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center justify-center flex-wrap gap-2 pt-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/20"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200/60"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Two-Way Flywheel Promotional Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/subscriptions"
            className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100/80 hover:border-indigo-300 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                <Tv className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-indigo-700 block">Universal Subscriptions Hub</span>
                <span className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Netflix, Spotify, ChatGPT &amp; SaaS Deals →
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-indigo-500 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/travel"
            className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100/80 hover:border-amber-300 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
                <Plane className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-700 block">Smart Travel Hub</span>
                <span className="text-sm font-black text-slate-900 group-hover:text-amber-600 transition-colors">
                  Flights, Hotels &amp; OTA Promo Codes →
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-amber-500 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Stores Directory Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              Verified Brand Directory ({filteredBrands.length} Stores in {selectedCountry})
            </h2>
            <p className="text-xs text-slate-500">
              Click any merchant to view today&apos;s active voucher codes, percentage discounts, and clearance offers.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
            Live Shard Synchronized
          </span>
        </div>

        {filteredBrands.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
            <Tag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No stores found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              We couldn&apos;t find any merchants matching &quot;{searchQuery}&quot; in {countryMeta?.name}. Try selecting &quot;All Stores&quot; or changing your search terms.
            </p>
            <button
              type="button"
              onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
              className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredBrands.map((brand) => (
              <Link
                key={brand.id}
                href={`/coupons/${brand.id}?country=${selectedCountry}`}
                className="group flex flex-col justify-between p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-300 hover:shadow-md transition-all relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl shadow-2xs group-hover:scale-105 transition-transform">
                        {brand.logo || "🛍️"}
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                          {brand.name}
                        </h3>
                        <span className="text-[11px] font-semibold text-slate-400 block line-clamp-1">
                          {brand.domain}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Offer highlight pill */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold">
                    <Percent className="w-3 h-3 text-emerald-600" />
                    <span>{brand.bestOffer || "Verified Discounts"}</span>
                  </div>

                  {brand.tagline && (
                    <p className="text-[11px] text-slate-500 line-clamp-1 italic">
                      &quot;{brand.tagline}&quot;
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600 group-hover:text-emerald-600 transition-colors">
                  <span>View Coupons</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 group-hover:text-emerald-600 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
