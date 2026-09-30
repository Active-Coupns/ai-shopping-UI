"use client";

import React, { useState, useEffect } from "react";
import { Search, Sparkles, X, Pill, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

const ECOM_QUERIES_IN = [
  "Best laptop under ₹50,000",
  "Sabse sasta 5G phone",
  "Noise cancelling headphones",
  "Pure cotton party shirt",
  "Top 4K vlog camera"
];

const HEALTH_QUERIES_IN = [
  "ON Gold Standard Whey 2kg",
  "Dolo 650 strip of 15 tabs",
  "MuscleBlaze Biozyme Whey",
  "Telma 40mg strip",
  "Creatine monohydrate 250g"
];

const QUICK_TRENDING_ECOM_IN = [
  { label: "⚡ Laptops under ₹50K", query: "Best laptop under ₹50,000 for coding & gaming" },
  { label: "🔥 Top 5G Phones", query: "Sabse sasta 5G mobile phone" },
  { label: "🎧 ANC Earbuds", query: "Noise-cancelling headphones for travel" },
  { label: "👔 Party Shirts", query: "Party cotton shirt under ₹3,000" },
  { label: "👟 Sneakers Deals", query: "Best white sneakers for men" }
];

const QUICK_TRENDING_HEALTH_IN = [
  { label: "💪 ON Whey 2kg", query: "ON Gold Standard 100% Whey 2kg" },
  { label: "💊 Dolo 650 (1mg vs Apollo)", query: "Dolo 650 Strip of 15 Tablets" },
  { label: "⚡ MB Creatine 250g", query: "MuscleBlaze Micronized Creatine 250g" },
  { label: "🩺 Telma 40 BP Care", query: "Telma 40mg Strip of 15 Tablets" },
  { label: "🌿 Shelcal 500", query: "Shelcal 500 Strip of 15 Tablets" }
];

const ECOM_QUERIES_US = [
  "Best laptop under $600 for work & gaming",
  "Top 5G unlocked smartphone deals",
  "Sony noise cancelling headphones",
  "Men's slim fit oxford dress shirt",
  "4K streaming camera with AI autofocus"
];

const HEALTH_QUERIES_US = [
  "Optimum Nutrition Gold Standard 100% Whey 5lb",
  "Tylenol Extra Strength 500mg caplets 100 count",
  "Optimum Nutrition Micronized Creatine Powder 300g",
  "Advil Dual Action with Acetaminophen 144 caplets",
  "Centrum Men's Daily Multivitamin 200 tablets"
];

const QUICK_TRENDING_ECOM_US = [
  { label: "⚡ Laptops under $600", query: "Best laptop under $600 for work & gaming" },
  { label: "🔥 Unlocked 5G Phones", query: "Top 5G unlocked smartphone deals" },
  { label: "🎧 Noise Cancelling Earbuds", query: "Sony noise cancelling headphones" },
  { label: "👔 Oxford Shirts", query: "Men's slim fit oxford dress shirt" },
  { label: "👟 Nike & Adidas Deals", query: "Men's running sneakers on sale" }
];

const QUICK_TRENDING_HEALTH_US = [
  { label: "💪 ON Gold Whey 5lb", query: "Optimum Nutrition Gold Standard 100% Whey 5lb" },
  { label: "💊 Tylenol Extra Strength", query: "Tylenol Extra Strength 500mg caplets 100 count" },
  { label: "⚡ ON Creatine 300g", query: "Optimum Nutrition Micronized Creatine Powder 300g" },
  { label: "🩺 Advil Dual Action", query: "Advil Dual Action with Acetaminophen 144 caplets" },
  { label: "🌿 Centrum Multivitamin", query: "Centrum Men's Daily Multivitamin 200 tablets" }
];

export default function SearchHero({ country = "IN", onSubmit }) {
  const [activeTab, setActiveTab] = useState("ecommerce"); // "ecommerce" | "health"
  const [query, setQuery] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [queryIndex, setQueryIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const isUS = String(country).toUpperCase() === "US";

  const exampleQueries = activeTab === "health"
    ? (isUS ? HEALTH_QUERIES_US : HEALTH_QUERIES_IN)
    : (isUS ? ECOM_QUERIES_US : ECOM_QUERIES_IN);

  const trendingList = activeTab === "health"
    ? (isUS ? QUICK_TRENDING_HEALTH_US : QUICK_TRENDING_HEALTH_IN)
    : (isUS ? QUICK_TRENDING_ECOM_US : QUICK_TRENDING_ECOM_IN);

  // Reset typewriter when tab or country changes
  useEffect(() => {
    setQueryIndex(0);
    setCharIndex(0);
    setIsDeleting(false);
    setPlaceholder("");
  }, [activeTab, country]);

  // Smooth Typewriter effect
  useEffect(() => {
    const currentFullText = exampleQueries[queryIndex] || exampleQueries[0] || "";
    let timer;

    if (isDeleting) {
      if (placeholder.length > 0) {
        timer = setTimeout(() => {
          setPlaceholder((prev) => prev.slice(0, -1));
        }, 20);
      } else {
        setIsDeleting(false);
        setQueryIndex((prev) => (prev + 1) % exampleQueries.length);
        setCharIndex(0);
      }
    } else {
      if (charIndex < currentFullText.length) {
        timer = setTimeout(() => {
          setPlaceholder(currentFullText.slice(0, charIndex + 1));
          setCharIndex((prev) => prev + 1);
        }, 50);
      } else {
        timer = setTimeout(() => setIsDeleting(true), 2600);
      }
    }

    return () => clearTimeout(timer);
  }, [placeholder, charIndex, isDeleting, queryIndex, activeTab, country]);

  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastSubmitTime < 1500) return;
    setLastSubmitTime(now);

    const finalQuery = query.trim() || exampleQueries[queryIndex];
    onSubmit(finalQuery);
  };

  const handlePromptClick = (promptQuery) => {
    const now = Date.now();
    if (now - lastSubmitTime < 1500) return;
    setLastSubmitTime(now);

    setQuery(promptQuery);
    onSubmit(promptQuery);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-4 sm:py-8 text-center flex flex-col justify-center items-center">
      
      {/* 1. Catchy Brand Tag & Headline */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-4 sm:mb-6 max-w-xl mx-auto"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[11px] font-bold text-brand-indigo mb-2.5 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-brand-indigo animate-pulse" />
          <span>{isUS ? "US AI Deal & Health Finder" : "AI Deal & Health Finder"}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Find the Best Price, <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-indigo via-purple-600 to-pink-600">Instantly.</span>
        </h1>
        
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5 leading-relaxed">
          {activeTab === "health"
            ? (isUS 
                ? "Real-time prices across CVS, Walgreens, GNC, iHerb & Walmart Pharmacy." 
                : "Real-time prices across 1mg, Apollo 24|7, HealthKart & PharmEasy.")
            : (isUS 
                ? "Real-time comparison across Amazon.com, Walmart, Best Buy & Target." 
                : "Real-time comparison across Amazon, Flipkart, Myntra & Croma.")}
        </p>
      </motion.div>

      {/* 2. Clean Minimal Segmented Tab */}
      <div className="flex items-center p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 mb-4 sm:mb-6 w-full max-w-xs shadow-inner">
        <button
          type="button"
          onClick={() => setActiveTab("ecommerce")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "ecommerce"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>{isUS ? "US Shopping" : "Shopping"}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("health")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "health"
              ? "bg-white text-emerald-700 shadow-sm"
              : "text-slate-500 hover:text-emerald-700"
          }`}
        >
          <Pill className="w-3.5 h-3.5" />
          <span>{isUS ? "US Pharmacy" : "Pharmacy"}</span>
        </button>
      </div>

      {/* 3. Sleek Modern Search Bar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="w-full max-w-xl mb-4 sm:mb-6"
      >
        <form 
          onSubmit={handleSubmit}
          className="flex items-center gap-1.5 bg-white border border-slate-200 hover:border-slate-300 focus-within:border-brand-indigo focus-within:ring-4 focus-within:ring-indigo-500/10 rounded-2xl p-1.5 sm:p-2 shadow-lg shadow-slate-100/80 transition-all"
        >
          <div className="pl-2.5 text-slate-400 shrink-0">
            {activeTab === "health" ? (
              <Pill className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
            ) : (
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-brand-indigo" />
            )}
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              placeholder 
                ? placeholder + " |" 
                : (activeTab === "health" 
                    ? (isUS ? "Search Tylenol, Whey Protein, Creatine..." : "Search Dolo, Whey Protein, Creatine...") 
                    : (isUS ? "Search laptops, iPhones, Nike sneakers..." : "Search laptops, phones, shoes, shirts..."))
            }
            className="w-full min-w-0 bg-transparent border-0 px-2 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-0 text-xs sm:text-sm font-semibold tracking-wide"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 bg-slate-100 transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="submit"
            className={`flex items-center gap-1 text-white font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-all shadow-md active:scale-95 text-xs sm:text-sm shrink-0 cursor-pointer ${
              activeTab === "health"
                ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20"
                : "bg-gradient-to-r from-brand-indigo to-brand-violet hover:from-indigo-600 hover:to-purple-700 shadow-indigo-500/20"
            }`}
          >
            <span>Search</span>
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </form>
      </motion.div>

      {/* 4. Catchy Trending Suggestions (Clean 1-line Chips) */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="w-full max-w-xl"
      >
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1 justify-start sm:justify-center">
          {trendingList.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePromptClick(item.query)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer shadow-2xs active:scale-95 hover:border-slate-300"
            >
              {item.label}
            </button>
          ))}
        </div>
      </motion.div>

    </div>
  );
}
