"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Zap, ArrowRight, TrendingDown, Flame } from "lucide-react";
import { DEAL_CATEGORIES } from "@/services/dealsService";

export default function CategoryDealsExplorer({ onSelectCategory, onCustomDealSearch, isLoading = false }) {
  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-2 text-left">
      {/* Spotlight Header Banner */}
      <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-violet-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20 shrink-0">
            <Flame className="w-5 h-5 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                Live Price Drops & Lightning Deals
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-[10px] font-extrabold text-rose-700 animate-pulse">
                LIVE TODAY
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any category below to fetch today&apos;s steepest price drops across Amazon, Flipkart, Myntra & Croma.
            </p>
          </div>
        </div>

        <div className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5 shrink-0 bg-white/80 px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs">
          <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
          <span>Real-time On-Demand Scanning</span>
        </div>
      </div>

      {/* 8-Grid Category Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {DEAL_CATEGORIES.map((cat, idx) => (
          <motion.button
            key={cat.id}
            type="button"
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelectCategory(cat.id)}
            disabled={isLoading}
            className="group relative p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-gradient-to-b hover:from-white hover:to-violet-50/40 border border-slate-200/90 hover:border-violet-300 transition-all shadow-xs hover:shadow-md cursor-pointer text-left flex flex-col justify-between min-h-[135px] sm:min-h-[145px] overflow-hidden"
          >
            {/* Top Row: Icon + Discount Badge */}
            <div className="flex items-start justify-between gap-1 w-full mb-2">
              <span className="text-2xl sm:text-3xl p-1 rounded-xl bg-slate-50 group-hover:bg-violet-100/60 transition-colors">
                {cat.icon}
              </span>
              <span className="text-[10px] font-black text-rose-600 bg-rose-50 border border-rose-200/80 px-2 py-0.5 rounded-full shadow-2xs">
                {cat.badge}
              </span>
            </div>

            {/* Middle & Bottom: Title, Desc, and Arrow */}
            <div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-violet-900 transition-colors leading-tight">
                {cat.name}
              </h4>
              <p className="text-[10px] sm:text-[11px] text-slate-500 line-clamp-1 mt-0.5 leading-snug">
                {cat.desc}
              </p>

              <div className="mt-2.5 flex items-center justify-between text-[11px] font-bold text-violet-700 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>View Deals</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
