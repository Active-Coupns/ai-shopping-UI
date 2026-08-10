"use client";

import React, { useState, useEffect } from "react";
import { Search, Sparkles, Laptop, Shirt, Headphones, Trophy, Tag, Flame, Shield, Globe } from "lucide-react";
import { motion } from "framer-motion";

const EXAMPLE_QUERIES = [
  "Best laptop under ₹50,000 for coding & gaming",
  "Party cotton shirt under ₹3,000",
  "Noise-cancelling headphones for travel",
  "Ergonomic office chair for back pain"
];

const CATEGORY_CHIPS = [
  { label: "📱 Tech & Mobiles", text: "Best flagship 5G mobile phone under 40000", icon: Laptop },
  { label: "👟 Fashion & Sneakers", text: "Premium brand sports running sneakers under 5000", icon: Shirt },
  { label: "🍔 Food Deals", text: "Zomato food coupon discount vouchers", icon: Headphones },
  { label: "✈️ Travel Offers", text: "Uber cab ride discount coupon codes", icon: Trophy }
];

export default function SearchHero({ onSubmit }) {
  const [query, setQuery] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [queryIndex, setQueryIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Typing effect loop
  useEffect(() => {
    const currentFullText = EXAMPLE_QUERIES[queryIndex];
    let timer;

    if (isDeleting) {
      timer = setTimeout(() => {
        setPlaceholder((prev) => prev.slice(0, -1));
        setCharIndex((prev) => prev - 1);
      }, 30);
    } else {
      timer = setTimeout(() => {
        setPlaceholder((prev) => prev + currentFullText[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 70);
    }

    if (!isDeleting && charIndex === currentFullText.length) {
      timer = setTimeout(() => setIsDeleting(true), 2500);
    } else if (isDeleting && placeholder === "") {
      setIsDeleting(false);
      setQueryIndex((prev) => (prev + 1) % EXAMPLE_QUERIES.length);
      setCharIndex(0);
    }

    return () => clearTimeout(timer);
  }, [placeholder, charIndex, isDeleting, queryIndex]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalQuery = query.trim() || EXAMPLE_QUERIES[queryIndex];
    onSubmit(finalQuery);
  };

  const handleChipClick = (text) => {
    setQuery(text);
    onSubmit(text);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-12 text-center relative">
      
      {/* Live Deals Ticker Marquee */}
      <div className="w-full overflow-hidden bg-slate-950/40 border border-slate-900/60 rounded-xl py-3 mb-10 z-20 relative backdrop-blur-sm">
        <div className="flex whitespace-nowrap animate-marquee gap-10 font-mono text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-400">
          <div className="flex items-center gap-2 shrink-0">
            <Flame className="w-3.5 h-3.5 text-brand-violet animate-pulse" /> 
            <span>DEAL ALERT: FLAT 50% OFF ON PREMIUM BRAND SNEAKERS</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Tag className="w-3.5 h-3.5 text-brand-indigo" /> 
            <span>AMAZON MONSOON SALE LIVE: EXTRA 15% CREDIT SAVINGS</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Shield className="w-3.5 h-3.5 text-brand-violet" /> 
            <span>VERIFIED COUPONS: SWIGGY FREE DELIVERY VOUCHERS ADDED</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Globe className="w-3.5 h-3.5 text-brand-indigo" /> 
            <span>GLOBAL OFFERS ACTIVE: SAVE UP TO 25% ON INTERSTATE TRAVELS</span>
          </div>
          {/* Double-render for infinite marquee loop */}
          <div className="flex items-center gap-2 shrink-0">
            <Flame className="w-3.5 h-3.5 text-brand-violet animate-pulse" /> 
            <span>DEAL ALERT: FLAT 50% OFF ON PREMIUM BRAND SNEAKERS</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Tag className="w-3.5 h-3.5 text-brand-indigo" /> 
            <span>AMAZON MONSOON SALE LIVE: EXTRA 15% CREDIT SAVINGS</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Shield className="w-3.5 h-3.5 text-brand-violet" /> 
            <span>VERIFIED COUPONS: SWIGGY FREE DELIVERY VOUCHERS ADDED</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Globe className="w-3.5 h-3.5 text-brand-indigo" /> 
            <span>GLOBAL OFFERS ACTIVE: SAVE UP TO 25% ON INTERSTATE TRAVELS</span>
          </div>
        </div>
      </div>

      {/* Cyberpunk Centerpiece: Glowing pulse-animated Floating AI Orb */}
      <div className="relative flex justify-center mb-8">
        {/* Outer glowing halo ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-40 md:h-40 bg-brand-indigo/25 rounded-full blur-2xl animate-pulse" />
        
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            boxShadow: [
              "0 0 20px rgba(99, 102, 241, 0.4)",
              "0 0 50px rgba(168, 85, 247, 0.6)",
              "0 0 20px rgba(99, 102, 241, 0.4)"
            ]
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-brand-indigo via-brand-violet to-purple-600 flex items-center justify-center p-1.5 z-10"
        >
          <div className="w-full h-full rounded-full bg-slate-950/90 flex flex-col items-center justify-center border border-brand-indigo/30 p-2 text-center">
            <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-brand-indigo mb-1 animate-pulse" />
            <span className="text-[9px] md:text-[10px] font-black uppercase text-brand-violet tracking-widest">AI Core</span>
          </div>
        </motion.div>
      </div>

      {/* Title & Subtitle */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-3">
          What are you looking to buy today?
        </h1>
        <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          Combs customer reviews, live seller ratings, and discount codes to recommend the absolute best merchant deals in real-time.
        </p>
      </motion.div>

      {/* Glassmorphic Search Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative mb-8 max-w-2xl mx-auto"
      >
        {/* Glow backdrop boundary */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-brand-indigo to-brand-violet opacity-30 blur-lg transition duration-500"></div>

        <form onSubmit={handleSubmit} className="relative flex items-center glass-panel rounded-2xl p-1.5 shadow-2xl focus-within:ring-2 focus-within:ring-brand-indigo/50 focus-within:border-brand-indigo/50 transition-all duration-300">
          <div className="pl-3 text-slate-400 flex items-center justify-center">
            <Search className="w-5 h-5 text-brand-indigo" />
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder + " |"}
            className="w-full bg-transparent border-0 px-3 py-3 md:py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-0 text-xs md:text-sm font-medium"
          />

          <button
            type="submit"
            className="flex items-center gap-1.5 bg-gradient-to-r from-brand-indigo to-brand-violet hover:from-brand-indigo/90 hover:to-brand-violet/90 text-white font-bold px-5 py-2.5 md:py-3 rounded-xl transition-all duration-300 shadow-md active:scale-95 text-xs shrink-0 cursor-pointer"
          >
            <span>Ask AI</span>
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </form>
      </motion.div>

      {/* Interactive Category Badges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto"
      >
        {CATEGORY_CHIPS.map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleChipClick(chip.text)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl glass-panel glass-panel-hover text-[11px] font-bold text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95 border-slate-800"
          >
            <span>{chip.label}</span>
          </button>
        ))}
      </motion.div>
    </div>
  );
}
