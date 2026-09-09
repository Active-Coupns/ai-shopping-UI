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
  { label: "⚡ Laptop under ₹50K", query: "Best laptop under ₹50,000 for coding & gaming", icon: Laptop, color: "border-indigo-500/40 text-indigo-300 bg-indigo-500/10" },
  { label: "🔥 Sabse sasta 5G", query: "Sabse sasta 5G mobile phone", icon: Zap, color: "border-cyan-500/40 text-cyan-300 bg-cyan-500/10" },
  { label: "🎧 ANC Headphones", query: "Noise-cancelling headphones for travel & focus", icon: Headphones, color: "border-emerald-500/40 text-emerald-300 bg-emerald-500/10" },
  { label: "👟 Shoes under ₹3K", query: "Party cotton shirt under ₹3,000", icon: Shirt, color: "border-amber-500/40 text-amber-300 bg-amber-500/10" },
  { label: "📷 4K Vlog Camera", query: "Top 4K Vlogging Camera with AI Tracking", icon: Camera, color: "border-purple-500/40 text-purple-300 bg-purple-500/10" }
];

const AI_PROMPTS_US = [
  { label: "⚡ Gaming Laptop under $600", query: "Best laptop under $600 for coding & gaming", icon: Laptop, color: "border-indigo-500/40 text-indigo-300 bg-indigo-500/10" },
  { label: "🔥 Flagship 5G Phone", query: "Best flagship 5G mobile phone", icon: Zap, color: "border-cyan-500/40 text-cyan-300 bg-cyan-500/10" },
  { label: "🎧 Wireless ANC Headphones", query: "Noise-cancelling headphones for travel & focus", icon: Headphones, color: "border-emerald-500/40 text-emerald-300 bg-emerald-500/10" },
  { label: "👟 Sneakers under $100", query: "Casual brand sneakers under $100", icon: Shirt, color: "border-amber-500/40 text-amber-300 bg-amber-500/10" },
  { label: "📷 4K Vlogging Cam", query: "Top 4K Vlogging Camera with AI Tracking", icon: Camera, color: "border-purple-500/40 text-purple-300 bg-purple-500/10" }
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
    <div className="w-full max-w-4xl mx-auto px-4 pt-10 sm:pt-16 md:pt-20 pb-12 text-center relative">
      
      {/* Top AI Badge & Headline (Pushed down with generous top spacing for open breathable look) */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6 sm:mb-8 flex flex-col items-center"
      >
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-brand-indigo/25 via-purple-500/25 to-emerald-500/25 border border-brand-indigo/40 text-[10px] sm:text-xs font-bold text-slate-200 mb-3 sm:mb-4 shadow-lg backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-brand-indigo animate-pulse shrink-0" />
          <span>ShopSmart AI 4.0 Studio • Autonomous Deal Intelligence</span>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-2 sm:mb-3 leading-tight max-w-3xl mx-auto">
          Search & Compare <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-indigo via-brand-violet to-emerald-400">Live E-Commerce Deals</span>
        </h1>
        
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto font-medium leading-relaxed px-2">
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
        className="relative mb-6 sm:mb-8 max-w-2xl mx-auto"
      >
        {/* Glow backdrop boundary */}
        <div className="absolute -inset-1.5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-brand-indigo via-brand-violet to-emerald-400 opacity-40 blur-lg transition duration-500"></div>

        <div className="relative glass-panel rounded-2xl sm:rounded-3xl p-2 sm:p-3 shadow-2xl border border-brand-indigo/40 bg-slate-950/90 backdrop-blur-2xl">
          {/* Search Form: Integrated Inline Glass Input + Trigger Button */}
          <form onSubmit={handleSubmit} className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 rounded-xl sm:rounded-2xl p-1 sm:p-1.5 shadow-inner">
            <div className="pl-2 text-brand-indigo flex items-center justify-center shrink-0">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-brand-indigo" />
            </div>
            
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder ? placeholder + " |" : "Search products, laptops, phones..."}
              className="w-full min-w-0 bg-transparent border-0 px-2 py-2 sm:py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-0 text-xs sm:text-sm font-semibold tracking-wide"
            />

            {query && (
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => setQuery("")}
                className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800 transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="submit"
              suppressHydrationWarning
              className="flex items-center gap-1.5 bg-gradient-to-r from-brand-indigo via-brand-violet to-purple-600 hover:from-brand-indigo/90 hover:to-purple-500 text-white font-extrabold px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all duration-300 shadow-md hover:shadow-brand-indigo/40 active:scale-95 text-xs sm:text-sm shrink-0 cursor-pointer"
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
        className="max-w-2xl mx-auto mb-6 sm:mb-8"
      >
        <div className="flex items-center justify-between mb-2 px-1 text-left">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-brand-indigo" />
            <span>Popular AI Prompts</span>
          </span>
          <span className="text-[9px] text-slate-400 font-medium">1-Tap Auto Search</span>
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-sm ${prompt.color}`}
              >
                <IconComp className="w-3.5 h-3.5 shrink-0" />
                <span>{prompt.label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Ticker Marquee */}
      <div className="w-full overflow-hidden bg-slate-950/60 border border-slate-800/80 rounded-xl py-1.5 mb-2 z-20 relative backdrop-blur-md">
        <div className="flex whitespace-nowrap animate-marquee gap-8 font-mono text-[9px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
          <div className="flex items-center gap-1.5 shrink-0">
            <Flame className="w-3 h-3 text-brand-violet animate-pulse" /> 
            <span>LIVE DEALS: FLAT 50% OFF ON SNEAKERS & WATCHES</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Tag className="w-3 h-3 text-emerald-400" /> 
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
