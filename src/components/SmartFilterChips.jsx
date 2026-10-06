"use client";

import React, { useMemo } from "react";
import { Sparkles, Check, Filter } from "lucide-react";
import { motion } from "framer-motion";

import { generateSmartChips } from "@/lib/smartChips";
export { generateSmartChips };

export default function SmartFilterChips({
  products = [],
  searchQuery = "",
  activeChipId = "all",
  onSelectChip
}) {
  const chips = useMemo(() => {
    return generateSmartChips(products, searchQuery);
  }, [products, searchQuery]);

  if (!chips || chips.length <= 1) return null;

  return (
    <div className="mb-6 pb-1">
      <div className="flex items-center gap-2 mb-2.5">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200/80 text-[11px] font-black text-indigo-700 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
          <span>AI Smart Filter (In-Memory Instant 0ms)</span>
        </div>
        <span className="text-xs text-slate-400 font-medium hidden sm:inline">
          Filter {products.length} live verified deals instantly
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {chips.map(chip => {
          const isActive = activeChipId === chip.id;
          return (
            <button
              key={chip.id}
              onClick={() => onSelectChip && onSelectChip(chip.id, chip.filter)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/15 border border-slate-800"
                  : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 hover:border-slate-300 shadow-2xs"
              }`}
            >
              <span>{chip.icon}</span>
              <span>{chip.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                {chip.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
