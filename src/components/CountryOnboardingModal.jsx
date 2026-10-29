"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Globe, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { COUNTRIES_LIST, SUPPORTED_COUNTRIES, detectCountryFromTimezone } from "@/lib/countryConfig";

export default function CountryOnboardingModal({ isOpen, onConfirm, currentCountry = "IN" }) {
  const [selected, setSelected] = useState("IN");

  // On mount or when opened, pre-select based on timezone or current country
  useEffect(() => {
    if (isOpen) {
      const detected = detectCountryFromTimezone();
      setSelected(currentCountry && SUPPORTED_COUNTRIES[currentCountry] ? currentCountry : detected);
      // Lock scroll while onboarding modal is open
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, currentCountry]);

  if (!isOpen) return null;

  const handleSelectAndSubmit = (code) => {
    setSelected(code);
  };

  const handleFinalSubmit = () => {
    if (onConfirm && selected) {
      onConfirm(selected);
    }
  };

  const activeMeta = SUPPORTED_COUNTRIES[selected] || SUPPORTED_COUNTRIES.IN;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-4">
        {/* Strict non-dismissible backdrop overlay (NO cancel on click) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md pointer-events-auto"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 320 }}
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-indigo-100 overflow-hidden z-10 flex flex-col max-h-[92vh]"
        >
          {/* Header Banner */}
          <div className="relative p-6 sm:p-7 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white overflow-hidden shrink-0">
            {/* Ambient Lighting Orbs */}
            <div className="absolute -top-24 -left-24 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider text-indigo-200 mb-3 shadow-inner">
                <Globe className="w-3.5 h-3.5 text-amber-300" />
                <span>Mandatory Regional Setup</span>
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white mb-2">
                Select Your Shopping Country
              </h2>

              <p className="text-xs sm:text-sm text-indigo-200/90 max-w-md mx-auto font-medium leading-relaxed">
                ShopSmart AI customizes verified discount coupons, live store comparisons, travel perks, and pricing currency strictly for your region.
              </p>
            </div>
          </div>

          {/* Country Selection Grid (Strict: Must Click to Select) */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
              {COUNTRIES_LIST.map((c) => {
                const isSelected = selected === c.code;

                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleSelectAndSubmit(c.code)}
                    className={`relative p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-gradient-to-br from-indigo-50/90 to-purple-50/70 border-indigo-600 ring-2 ring-indigo-600/30 shadow-md scale-[1.02]"
                        : "bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/80 shadow-2xs"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}

                    <div>
                      <div className="text-3xl sm:text-4xl mb-1.5 filter drop-shadow-xs">{c.flag}</div>
                      <div className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                        {c.name}
                      </div>
                      <div className="text-[11px] font-bold text-indigo-700 mt-0.5">
                        {c.currency} ({c.symbol})
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-500 font-semibold mt-2 pt-2 border-t border-slate-100 line-clamp-1">
                      {c.popularStores.split(",")[0]}, {c.popularStores.split(",")[1] || ""}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Country Confirmation Summary Pill */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs text-slate-700">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{activeMeta.flag}</span>
                <div>
                  <p className="font-bold text-slate-900">
                    Selected: <span className="text-indigo-600 font-black">{activeMeta.name}</span> ({activeMeta.currency})
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Active Stores: {activeMeta.popularStores}
                  </p>
                </div>
              </div>
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            </div>
          </div>

          {/* Strict Action Footer (NO CANCEL, ONLY SUBMIT) */}
          <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex flex-col gap-2 shrink-0">
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-black text-sm sm:text-base shadow-lg shadow-indigo-500/25 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 group"
            >
              <span>Confirm {activeMeta.name} &amp; Start Shopping</span>
              <ArrowRight className="w-4 h-4 text-amber-300 transition-transform group-hover:translate-x-1" />
            </button>

            <p className="text-[11px] text-slate-700 font-bold text-center">
              🔒 You can switch your shopping country at any time via the flag menu in the top bar.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
