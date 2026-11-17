"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Ticket, Film, Music, Trophy, CreditCard, Sparkles, 
  ShieldCheck, Search, Filter, ArrowRight, ExternalLink, 
  Tag, Calendar, Clock, Award, CheckCircle2, ChevronRight,
  Info, Users, DollarSign
} from "lucide-react";
import { getEventBrands } from "@/data/travelRegistry.js";

const COUNTRY_OPTIONS = [
  { code: "IN", label: "India", flag: "🇮🇳", currency: "₹" },
  { code: "US", label: "USA", flag: "🇺🇸", currency: "$" },
  { code: "GB", label: "UK", flag: "🇬🇧", currency: "£" },
  { code: "AU", label: "Australia", flag: "🇦🇺", currency: "A$" },
  { code: "CA", label: "Canada", flag: "🇨🇦", currency: "C$" },
  { code: "AE", label: "UAE", flag: "🇦🇪", currency: "AED" },
];

export default function EventsHubClient({ initialCountry = "IN" }) {
  const [selectedCountry, setSelectedCountry] = useState(initialCountry);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const brands = useMemo(() => {
    return getEventBrands(selectedCountry);
  }, [selectedCountry]);

  const filteredBrands = useMemo(() => {
    let list = brands;

    if (activeFilter !== "all") {
      list = list.filter((b) => {
        const text = `${b.name} ${b.tagline} ${b.id}`.toLowerCase();
        if (activeFilter === "movies") return text.includes("cinema") || text.includes("movie") || text.includes("pvr") || text.includes("amc") || text.includes("cineplex") || text.includes("vox") || text.includes("odeon");
        if (activeFilter === "concerts") return text.includes("concert") || text.includes("ticketmaster") || text.includes("livenation") || text.includes("insider") || text.includes("live") || text.includes("music");
        if (activeFilter === "bogo") return text.includes("bogo") || text.includes("bank") || text.includes("card") || (b.coupons && b.coupons.some(c => (c.code || "").includes("BOGO") || (c.discount || "").includes("Free")));
        return true;
      });
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
  }, [brands, activeFilter, searchQuery]);

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
      <div className="bg-gradient-to-b from-purple-950 via-slate-900 to-slate-950 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-purple-900/40 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Top Country Selector Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Universal Entertainment &amp; Ticket Savings
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
                      ? "bg-gradient-to-r from-purple-600 to-rose-600 text-white shadow-md font-black ring-1 ring-purple-400/40"
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
              Concerts, Movies &amp; Events Savings{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-amber-300">
                ({currentMonth} {currentYear})
              </span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
              Unlock verified Buy-1-Get-1 (BOGO) credit card passes, 24-hour pre-show ticket resale price drops, 
              early bird festival phase arbitrage, and zero-fee movie ticket subscriptions.
            </p>
          </div>

          {/* Metrics Strip */}
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-slate-300 font-semibold">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              <CreditCard className="w-4 h-4 text-purple-400" />
              BOGO Bank Card Cheat Sheets (ICICI, HDFC, Axis, Amex)
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              <Clock className="w-4 h-4 text-amber-400" />
              24-Hour Resale Price Collapse Alerts
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              <Film className="w-4 h-4 text-rose-400" />
              Movie Pass &amp; Concession Hacks
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Hub */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {/* Controls Bar: Filter Chips + Search */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xl shadow-slate-200/60 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setActiveFilter("all")}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                activeFilter === "all"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:text-slate-900"
              }`}
            >
              All Events ({brands.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("movies")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                activeFilter === "movies"
                  ? "bg-rose-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:text-slate-900"
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Cinemas &amp; Movies</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("concerts")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                activeFilter === "concerts"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:text-slate-900"
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>Concerts &amp; Festivals</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("bogo")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                activeFilter === "bogo"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:text-slate-900"
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>BOGO Bank Passes</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search BookMyShow, Ticketmaster..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 font-medium placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
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
              <Ticket className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="font-extrabold text-base text-slate-800">
                No entertainment platforms match your filter
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Try switching event categories or clear your search term.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredBrands.map((brand) => {
                const couponCount = brand.coupons?.length || 0;
                const topStrategy = brand.blueprints?.strategy1;

                return (
                  <div
                    key={brand.slug}
                    className="bg-white rounded-3xl border border-slate-200/90 hover:border-purple-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                  >
                    {/* Card Top Section */}
                    <div className="p-5 sm:p-6">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-2.5 py-1 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                          <Ticket className="w-3 h-3" />
                          Events &amp; Entertainment
                        </span>

                        {couponCount > 0 ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-extrabold text-[11px] flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            {couponCount} Active Deal{couponCount > 1 ? "s" : ""}
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-extrabold text-[11px] flex items-center gap-1">
                            <CreditCard className="w-3 h-3 text-amber-600" />
                            BOGO Card Blueprints
                          </span>
                        )}
                      </div>

                      {/* Brand Identity */}
                      <div className="flex items-start gap-3.5 mb-3">
                        <div
                          className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${brand.accentColor} text-white flex items-center justify-center font-black text-sm tracking-wider shadow-md shrink-0 group-hover:scale-105 transition-transform`}
                        >
                          {brand.logoText}
                        </div>
                        <div>
                          <h2 className="font-black text-base sm:text-lg text-slate-900 group-hover:text-purple-600 transition-colors line-clamp-1">
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
                            {brand.snapshot?.bestSavings || "Buy 1 Get 1 Free"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-medium">Card Matrix:</span>
                          <span className="font-bold text-purple-700">
                            {brand.snapshot?.specialConcession || "BOGO Bank Cards"}
                          </span>
                        </div>
                      </div>

                      {/* Top Strategy Teaser */}
                      {topStrategy && (
                        <div className="mt-3.5 border-t border-slate-100 pt-3">
                          <span className="text-[10px] font-black text-purple-600 uppercase tracking-wider block mb-1">
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
                        Live Tested Today
                      </span>

                      <Link
                        href={`/events/${brand.slug}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-sm hover:shadow transition-all group-hover:translate-x-0.5"
                      >
                        <span>View BOGO Blueprints</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Informational SEO Guide */}
        <section className="mt-16 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5">
            <Info className="w-6 h-6 text-purple-600 shrink-0" />
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              The 3 Secrets to Slashing Event &amp; Movie Ticket Costs
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            Standard coupon codes for concerts and cinemas are rare. Genuine entertainment savings rely on bank payment partnerships, 
            ticket release phases, and secondary resale market timing:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
              <span className="text-xs font-black text-purple-600 uppercase tracking-wide block mb-1">
                1. Buy 1 Get 1 (BOGO) Credit Card Portals
              </span>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Over 35 Indian and international credit cards (ICICI Sapphiro, HDFC, Axis, Amex) offer complimentary 1+1 movie and event tickets 
                every single month directly within the checkout offer gateway.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
              <span className="text-xs font-black text-rose-600 uppercase tracking-wide block mb-1">
                2. Phase-1 Early Bird Arbitrage
              </span>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Music festivals and arena tours sell tickets in staggered pricing phases. Phase-1 Early Bird tickets are up to 40% cheaper 
                than Phase-4 general admission tickets for the exact same admission zone.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
              <span className="text-xs font-black text-emerald-600 uppercase tracking-wide block mb-1">
                3. The 24-Hour Resale Price Collapse
              </span>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                On platforms like StubHub and Ticketmaster Exchange, scalpers and ticket holders who cannot attend panic in the final 
                4 to 24 hours before showtime, slashing prices up to 70% below original face value.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
