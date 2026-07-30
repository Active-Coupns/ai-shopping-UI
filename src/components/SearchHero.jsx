"use client";

import React, { useState, useEffect } from "react";
import { Search, Sparkles, Laptop, Shirt, Headphones, Trophy } from "lucide-react";
import { motion } from "framer-motion";

const EXAMPLE_QUERIES = [
  "Best laptop under ₹50,000 for coding & gaming",
  "Party cotton shirt under ₹3,000",
  "Noise-cancelling headphones for travel",
  "Ergonomic office chair for back pain"
];

const CHIPS = [
  { label: "Laptop under ₹50k", text: "Best laptop under ₹50,000 for coding & gaming", icon: Laptop },
  { label: "Party Shirt under ₹3k", text: "Party cotton shirt under ₹3,000", icon: Shirt },
  { label: "Travel ANC Headphones", text: "Noise-cancelling headphones for travel", icon: Headphones },
  { label: "Office Chair", text: "Ergonomic office chair for back pain", icon: Trophy }
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
      // Deleting character
      timer = setTimeout(() => {
        setPlaceholder((prev) => prev.slice(0, -1));
        setCharIndex((prev) => prev - 1);
      }, 30); // Backspacing speed
    } else {
      // Typing character
      timer = setTimeout(() => {
        setPlaceholder((prev) => prev + currentFullText[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 70); // Typing speed
    }

    // Handlers for switching directions or next query
    if (!isDeleting && charIndex === currentFullText.length) {
      // Finished typing, pause then delete
      timer = setTimeout(() => setIsDeleting(true), 2500);
    } else if (isDeleting && placeholder === "") {
      // Finished deleting, go to next query
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
    <div className="w-full max-w-3xl mx-auto px-4 py-16 md:py-24 text-center">
      {/* Title & Subtitle */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel text-brand-indigo text-xs font-semibold mb-4 tracking-wide shadow-[0_0_15px_rgba(99,102,241,0.1)] border-brand-indigo/20">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Next-Gen AI Shopper</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
          Find the Perfect Product
        </h1>
        <p className="text-base md:text-lg text-slate-400 max-w-xl mx-auto">
          AI combs reviews, prices, and specs to recommend the absolute best products tailored to your precise needs.
        </p>
      </motion.div>

      {/* Glassmorphic Search Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative mb-6"
      >
        {/* Neon Ambient Glows */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-brand-indigo to-brand-violet opacity-30 blur-lg group-hover:opacity-40 transition duration-1000"></div>

        <form onSubmit={handleSubmit} className="relative flex items-center glass-panel rounded-2xl p-2 shadow-2xl focus-within:ring-2 focus-within:ring-brand-indigo/50 focus-within:border-brand-indigo/50 transition-all duration-300">
          <div className="pl-3 text-slate-400 flex items-center justify-center">
            <Search className="w-6 h-6 text-brand-indigo" />
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder + " |"}
            className="w-full bg-transparent border-0 px-4 py-3 md:py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-0 text-sm md:text-base font-medium"
          />

          <button
            type="submit"
            className="flex items-center gap-2 bg-gradient-to-r from-brand-indigo to-brand-violet hover:from-brand-indigo/90 hover:to-brand-violet/90 text-white font-semibold px-6 py-2.5 md:py-3.5 rounded-xl transition-all duration-300 shadow-[0_4px_20px_rgba(99,102,241,0.3)] hover:shadow-[0_4px_30px_rgba(168,85,247,0.5)] active:scale-95 text-sm"
          >
            <span>Search</span>
            <Sparkles className="w-4 h-4 hidden md:inline" />
          </button>
        </form>
      </motion.div>

      {/* Recommendation Tag Chips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-wrap justify-center gap-2.5"
      >
        <span className="text-slate-500 text-xs md:text-sm font-medium self-center mr-1">Try asking for:</span>
        {CHIPS.map((chip, idx) => {
          const Icon = chip.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleChipClick(chip.text)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-panel glass-panel-hover text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm"
            >
              <Icon className="w-3.5 h-3.5 text-brand-indigo" />
              <span>{chip.label}</span>
            </button>
          );
        })}
      </motion.div>
    </div>
  );
}
