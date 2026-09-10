"use client";

import React, { useState, useEffect } from "react";
import { Search, Sparkles, Laptop, Shirt, Headphones, Tag, Flame, Shield, Globe, Camera, Zap, Compass, ArrowRight, X } from "lucide-react";
import { motion } from "framer-motion";

const EXAMPLE_QUERIES = [
  "Best laptop under ₹50,000 for coding & gaming",
  "Top 4K Vlogging Camera with AI Tracking",
  "Noise-cancelling headphones for travel & focus",
  "Party cotton shirt under ₹3,000",
  "Sabse sasta 5G mobile phone"
];

const US_EXAMPLE_QUERIES = [
  "Best laptop under $600 for coding & gaming",
  "Top 4K Vlogging Camera with AI Tracking",
  "Noise-cancelling headphones for travel & focus",
  "Casual brand sneakers under $100",
  "Best flagship 5G mobile phone"
];

const AI_PROMPTS_IN = [
  { label: "⚡ Laptop under ₹50K", query: "Best laptop under ₹50,000 for coding & gaming", icon: Laptop, color: "border-indigo-200 text-indigo-700 bg-indigo-50/90 shadow-xs hover:bg-indigo-100" },
  { label: "🔥 Sabse sasta 5G", query: "Sabse sasta 5G mobile phone", icon: Zap, color: "border-cyan-200 text-cyan-700 bg-cyan-50/90 shadow-xs hover:bg-cyan-100" },
  { label: "🎧 ANC Headphones", query: "Noise-cancelling headphones for travel & focus", icon: Headphones, color: "border-emerald-200 text-emerald-700 bg-emerald-50/90 shadow-xs hover:bg-emerald-100" },
  { label: "👟 Shoes under ₹3K", query: "Party cotton shirt under ₹3,000", icon: Shirt, color: "border-amber-200 text-amber-700 bg-amber-50/90 shadow-xs hover:bg-amber-100" },
  { label: "📷 4K Vlog Camera", query: "Top 4K Vlogging Camera with AI Tracking", icon: Camera, color: "border-purple-200 text-purple-700 bg-purple-50/90 shadow-xs hover:bg-purple-100" }
];

const AI_PROMPTS_US = [
  { label: "⚡ Gaming Laptop under $600", query: "Best laptop under $600 for coding & gaming", icon: Laptop, color: "border-indigo-200 text-indigo-700 bg-indigo-50/90 shadow-xs hover:bg-indigo-100" },
  { label: "🔥 Flagship 5G Phone", query: "Best flagship 5G mobile phone", icon: Zap, color: "border-cyan-200 text-cyan-700 bg-cyan-50/90 shadow-xs hover:bg-cyan-100" },
  { label: "🎧 Wireless ANC Headphones", query: "Noise-cancelling headphones for travel & focus", icon: Headphones, color: "border-emerald-200 text-emerald-700 bg-emerald-50/90 shadow-xs hover:bg-emerald-100" },
  { label: "👟 Sneakers under $100", query: "Casual brand sneakers under $100", icon: Shirt, color: "border-amber-200 text-amber-700 bg-amber-50/90 shadow-xs hover:bg-amber-100" },
  { label: "📷 4K Vlogging Cam", query: "Top 4K Vlogging Camera with AI Tracking", icon: Camera, color: "border-purple-200 text-purple-700 bg-purple-50/90 shadow-xs hover:bg-purple-100" }
];

export default function SearchHero({ country = "IN", onSubmit }) {
  const [query, setQuery] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [queryIndex, setQueryIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const exampleQueries = country === "US" ? US_EXAMPLE_QUERIES : EXAMPLE_QUERIES;
  const promptList = country === "US" ? AI_PROMPTS_US : AI_PROMPTS_IN;

  // Typewriter effect
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
        }, 55);
      } else {
        timer = setTimeout(() => setIsDeleting(true), 2400);
      }
    }

    return () => clearTimeout(timer);
  }, [placeholder, charIndex, isDeleting, queryIndex, country]);

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
    <div className="w-full max-w-4xl mx-auto px-4 pt-14 sm:pt-20 md:pt-24 pb-16 text-center relative flex flex-col justify-center min-h-[60vh] sm:min-h-[68vh]">
      
      {/* Top AI Badge & Headline (Pushed down with generous top spacing for open breathable look) */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-7 sm:mb-9 flex flex-col items-center mt-2 sm:mt-4"
      >
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-brand-indigo/15 via-purple-500/15 to-emerald-500/15 border border-brand-indigo/30 text-[10px] sm:text-xs font-bold text-slate-700 mb-3 sm:mb-4 shadow-sm backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-brand-indigo animate-pulse shrink-0" />
          <span>ShopSmart AI 4.0 Studio • Autonomous Deal Intelligence</span>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-2.5 sm:mb-4 leading-snug max-w-3xl mx-auto">
          Search & Compare <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-indigo via-brand-violet to-purple-600">Live E-Commerce Deals</span>
        </h1>
        
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto font-medium leading-relaxed px-3">
          {country === "US"
            ? "Analyzes prices across Amazon.com, Walmart, Best Buy & Target to find verified market deals."
            : "Analyzes prices across Amazon.in, Flipkart, Myntra & Croma to find verified market deals."}
        </p>
      </motion.div>

      {/* Cyber AI Command Search Console */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="relative mb-7 sm:mb-9 max-w-2xl mx-auto w-full"
      >
        {/* Glow backdrop boundary */}
        <div className="absolute -inset-1.5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-brand-indigo/40 via-brand-violet/30 to-purple-400/40 opacity-50 blur-lg transition duration-500"></div>

        <div className="relative glass-panel rounded-2xl sm:rounded-3xl p-2 sm:p-3 shadow-xl border border-brand-indigo/30 bg-white/90 backdrop-blur-2xl">
          {/* Search Form: Integrated Inline Glass Input + Trigger Button */}
          <form onSubmit={handleSubmit} suppressHydrationWarning className="flex items-center gap-1.5 bg-white border border-slate-200/90 rounded-xl sm:rounded-2xl p-1.5 sm:p-2 shadow-sm">
            <div className="pl-2.5 text-brand-indigo flex items-center justify-center shrink-0">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-brand-indigo" />
            </div>
            
            <input
              type="text"
              suppressHydrationWarning
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder ? placeholder + " |" : "Search products, laptops, phones..."}
              className="w-full min-w-0 bg-transparent border-0 px-2 py-2 sm:py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-0 text-xs sm:text-sm font-semibold tracking-wide"
            />

            {query && (
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => setQuery("")}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 bg-slate-100 transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="submit"
              suppressHydrationWarning
              className="flex items-center gap-1.5 bg-gradient-to-r from-brand-indigo via-brand-violet to-purple-600 hover:from-brand-indigo/90 hover:to-purple-500 text-white font-extrabold px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all duration-300 shadow-md hover:shadow-brand-indigo/30 active:scale-95 text-xs sm:text-sm shrink-0 cursor-pointer"
            >
              <span>Ask AI</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </motion.div>

      {/* Quick Horizontal Swipeable AI Prompts */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="max-w-2xl mx-auto mb-7 sm:mb-9 w-full"
      >
        <div className="flex items-center justify-between mb-2 px-1 text-left">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-brand-indigo" />
            <span>Popular AI Prompts</span>
          </span>
          <span className="text-[9px] text-slate-500 font-medium">1-Tap Auto Search</span>
        </div>

        {/* Horizontal Scroll Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-0.5">
          {promptList.map((prompt, idx) => {
            const IconComp = prompt.icon;
            return (
              <button
                key={idx}
                type="button"
                suppressHydrationWarning
                onClick={() => handlePromptClick(prompt.query)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-xs ${prompt.color}`}
              >
                <IconComp className="w-3.5 h-3.5 shrink-0" />
                <span>{prompt.label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Ticker Marquee */}
      <div className="w-full overflow-hidden bg-white/80 border border-slate-200/90 rounded-xl py-1.5 mb-2 z-20 relative backdrop-blur-md shadow-xs">
        <div className="flex whitespace-nowrap animate-marquee gap-8 font-mono text-[9px] sm:text-xs font-bold uppercase tracking-wider text-slate-600">
          <div className="flex items-center gap-1.5 shrink-0">
            <Flame className="w-3 h-3 text-brand-violet animate-pulse" /> 
            <span>LIVE DEALS: FLAT 50% OFF ON SNEAKERS & WATCHES</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Tag className="w-3 h-3 text-emerald-600" /> 
            <span>AMAZON & FLIPKART: EXTRA 15% CREDIT SAVINGS</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Shield className="w-3 h-3 text-brand-indigo" /> 
            <span>VERIFIED AFFILIATE LINKS: ZERO QUICK-COMMERCE LEAKS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
