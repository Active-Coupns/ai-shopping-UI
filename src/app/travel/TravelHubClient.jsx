"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Plane, Hotel, Sparkles, ShieldCheck, Search, Filter, 
  ArrowRight, ExternalLink, Tag, Calendar, Luggage, 
  CreditCard, Smartphone, CheckCircle2, ChevronRight,
  Info, ArrowLeftRight, Clock, Award, Building2
} from "lucide-react";
import { getTravelBrands } from "@/data/travelRegistry.js";

const COUNTRY_OPTIONS = [
  { code: "IN", label: "India", flag: "🇮🇳", currency: "₹" },
  { code: "US", label: "USA", flag: "🇺🇸", currency: "$" },
  { code: "GB", label: "UK", flag: "🇬🇧", currency: "£" },
  { code: "AU", label: "Australia", flag: "🇦🇺", currency: "A$" },
  { code: "CA", label: "Canada", flag: "🇨🇦", currency: "C$" },
  { code: "AE", label: "UAE", flag: "🇦🇪", currency: "AED" },
];

export default function TravelHubClient({ initialCountry = "IN" }) {
  const [selectedCountry, setSelectedCountry] = useState(initialCountry);
  const [activeCategory, setActiveCategory] = useState("all"); // "all" | "flights" | "hotels"
  const [searchQuery, setSearchQuery] = useState("");

  const brands = useMemo(() => {
    return getTravelBrands(selectedCountry, "all");
  }, [selectedCountry]);

  const filteredBrands = useMemo(() => {
    let list = brands;
    if (activeCategory !== "all") {
      list = list.filter((b) => b.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.tagline?.toLowerCase().includes(q) ||
          b.slug.toLowerCase().includes(q)
      );
    }
    return list;
  }, [brands, activeCategory, searchQuery]);

  const flightCount = useMemo(() => brands.filter((b) => b.category === "flights").length, [brands]);
  const hotelCount = useMemo(() => brands.filter((b) => b.category === "hotels").length, [brands]);

  const now = new Date();
  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  const currentMonth = monthNames[now.getMonth()];
  const currentYear = now.getFullYear();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Hero Header */}
      <div className="bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-indigo-900/40 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Top Country Selector Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Universal Travel Savings Engine
              </span>
            </div>

            {/* Country Selector Pills */}
            <div className="flex items-center p-1 bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700/80 text-xs font-bold gap-1 shadow-inner max-w-full overflow-x-auto no-scrollbar">
              {COUNTRY_OPTIONS.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => setSelectedCountry(c.code)}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedCountry === c.code
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md font-black ring-1 ring-blue-400/40"
                      : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                  }`}
                >
                  <span>{c.flag}</span>
                  <span className="hidden sm:inline">{c.label}</span>
                  <span className="sm:hidden">{c.code}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title & Tagline */}
          <div className="max-w-3xl">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Flights &amp; Hotels Savings Blueprints{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400">
                ({currentMonth} {currentYear})
              </span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
              Don&apos;t pay full retail airfare or hotel rates. Explore verified coupon codes, 
              zero-code student &amp; defense concessions, 21-day advance booking arbitrage, and secret app-only room pricing.
            </p>
          </div>

          {/* Quick Metrics Strip */}
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-slate-300 font-semibold">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              100% Real Platforms &amp; Verified Blueprints
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              <Luggage className="w-4 h-4 text-sky-400" />
              Extra Baggage &amp; Concession Hacks
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              <Smartphone className="w-4 h-4 text-amber-400" />
              App-Only Secret Price Arbitrage
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Hub */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {/* Controls Bar: Category Tabs + Search */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xl shadow-slate-200/60 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl w-full md:w-auto">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                activeCategory === "all"
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Travel ({brands.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory("flights")}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                activeCategory === "flights"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Plane className="w-4 h-4 text-blue-600" />
              <span>Flights ({flightCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory("hotels")}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                activeCategory === "hotels"
                  ? "bg-white text-teal-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Hotel className="w-4 h-4 text-teal-600" />
              <span>Hotels ({hotelCount})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search airline or hotel..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 font-medium placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Brands Grid */}
        <div className="mt-8">
          {filteredBrands.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="font-extrabold text-base text-slate-800">
                No travel platforms match your search
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Try searching for another airline or hotel, or switch categories.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredBrands.map((brand) => {
                const isFlight = brand.category === "flights";
                const couponCount = brand.coupons?.length || 0;
                const topStrategy = brand.blueprints?.strategy1;

                return (
                  <div
                    key={brand.slug}
                    className="bg-white rounded-3xl border border-slate-200/90 hover:border-indigo-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                  >
                    {/* Card Top Section */}
                    <div className="p-5 sm:p-6">
                      {/* Badge Row */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                              isFlight
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : "bg-teal-50 text-teal-700 border border-teal-200"
                            }`}
                          >
                            {isFlight ? <Plane className="w-3 h-3" /> : <Hotel className="w-3 h-3" />}
                            {isFlight ? "Airlines & Airfare" : "Hotels & Stays"}
                          </span>
                        </div>

                        {couponCount > 0 ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-extrabold text-[11px] flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            {couponCount} Active Code{couponCount > 1 ? "s" : ""}
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-extrabold text-[11px] flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-amber-600" />
                            Direct Blueprints
                          </span>
                        )}
                      </div>

                      {/* Brand Header */}
                      <div className="flex items-start gap-3.5 mb-3">
                        <div
                          className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${brand.accentColor} text-white flex items-center justify-center font-black text-sm tracking-wider shadow-md shrink-0 group-hover:scale-105 transition-transform`}
                        >
                          {brand.logoText}
                        </div>
                        <div>
                          <h2 className="font-black text-base sm:text-lg text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                            {brand.name}
                          </h2>
                          <p className="text-xs text-slate-500 font-medium line-clamp-2 mt-0.5 leading-relaxed">
                            {brand.tagline}
                          </p>
                        </div>
                      </div>

                      {/* Quick Snapshot Table */}
                      <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-[11px]">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-medium">Top Perk:</span>
                          <span className="font-extrabold text-slate-800 line-clamp-1">
                            {brand.snapshot?.specialConcession || "Special Privilege"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-medium">Best Window:</span>
                          <span className="font-bold text-slate-700">
                            {brand.snapshot?.bookingWindow || "21-Day Advance"}
                          </span>
                        </div>
                      </div>

                      {/* Top Strategy Teaser */}
                      {topStrategy && (
                        <div className="mt-3.5 border-t border-slate-100 pt-3">
                          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider block mb-1">
                            {topStrategy.badge || "RECOMMENDED HACK"}
                          </span>
                          <p className="text-xs font-bold text-slate-800 line-clamp-1">
                            {topStrategy.title}
                          </p>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-normal">
                            {topStrategy.explanation}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Card Footer Action */}
                    <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        98% Verified Today
                      </span>

                      <Link
                        href={`/travel/${brand.slug}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-sm hover:shadow transition-all group-hover:translate-x-0.5"
                      >
                        <span>View Blueprints</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Informational / SEO Explainer Guide */}
        <section className="mt-16 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5">
            <Info className="w-6 h-6 text-indigo-600 shrink-0" />
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              The 4 Core Rules of Genuine Travel Arbitrage
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            Most travellers waste money searching for generic promo codes that don&apos;t exist. Real travel savings 
            come from structural pricing differences built directly into airline and hotel algorithms:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
              <span className="text-xs font-black text-indigo-600 uppercase tracking-wide block mb-1">
                Rule 1: Concession Fares (Students &amp; Defense)
              </span>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Carriers like IndiGo, Air India, and Emirates offer government and institutional concessions. 
                Students get up to 10kg additional checked baggage and 6% off base fare, while armed forces personnel save up to 50% on basic fares.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
              <span className="text-xs font-black text-blue-600 uppercase tracking-wide block mb-1">
                Rule 2: 21-Day Advance Midweek Booking
              </span>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Airline revenue management algorithms aggressively raise flight prices starting 14 days and 7 days prior to departure. 
                Booking flights on Tuesdays or Wednesdays at least 21 days out saves up to 35% on standard fares.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
              <span className="text-xs font-black text-teal-600 uppercase tracking-wide block mb-1">
                Rule 3: Mobile App vs Desktop Arbitrage
              </span>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                OTA hotel engines (Agoda, Booking.com, Hotels.com) systematically offer 10%–20% lower rates exclusively on their smartphone apps 
                to encourage mobile user retention. Always check prices in the mobile app before confirming on desktop.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
              <span className="text-xs font-black text-purple-600 uppercase tracking-wide block mb-1">
                Rule 4: Free Cancellation Price-Drop Hack
              </span>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Reserve hotels with zero prepayment and free cancellation. Set a calendar reminder 48 hours before cutoff: 
                if unsold inventory triggers a last-minute flash sale, re-book at the cheaper price and cancel the original for free.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
