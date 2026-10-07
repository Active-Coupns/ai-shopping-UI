"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Check, ArrowUpRight, Zap, ShieldCheck, Star, 
  TrendingDown, Award, Sparkles, Scale, ShoppingBag,
  ChevronLeft, ChevronRight
} from "lucide-react";

const formatPrice = (val, currency) => {
  if (val === undefined || val === null || val === "" || String(val).toLowerCase().includes("nan")) return "N/A";
  const isUSD = currency === "USD" || currency === "$";
  let num = val;
  if (typeof val === "string") {
    num = parseFloat(val.replace(/[$₹\s,]/g, ""));
  }
  if (typeof num !== "number" || isNaN(num) || num <= 0) return "N/A";
  return new Intl.NumberFormat(isUSD ? "en-US" : "en-IN", {
    style: "currency",
    currency: isUSD ? "USD" : "INR",
    maximumFractionDigits: 0,
  }).format(num);
};

function extractSpec(product, regex) {
  const text = ((product.title || "") + " " + (product.specs || []).join(" ") + " " + (product.description || "")).toLowerCase();
  const match = text.match(regex);
  return match ? match[0] : null;
}

export default function HeadToHeadModal({
  isOpen,
  onClose,
  productA,
  productB: initialProductB,
  allProducts = []
}) {
  // Candidate products excluding productA
  const candidateList = useMemo(() => {
    if (!productA || !allProducts || allProducts.length === 0) return [];
    const aId = productA.id || productA.product_id || productA.title;
    return allProducts.filter(p => (p.id || p.product_id || p.title) !== aId);
  }, [productA, allProducts]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (initialProductB && candidateList.length > 0) {
      const idx = candidateList.findIndex(p => (p.id || p.product_id || p.title) === (initialProductB.id || initialProductB.product_id || initialProductB.title));
      setCurrentIndex(idx !== -1 ? idx : 0);
    } else {
      setCurrentIndex(0);
    }
  }, [initialProductB, candidateList, isOpen]);

  const handlePrev = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (candidateList.length === 0) return;
    setCurrentIndex(prev => (prev === 0 ? candidateList.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (candidateList.length === 0) return;
    setCurrentIndex(prev => (prev === candidateList.length - 1 ? 0 : prev + 1));
  };

  const activeProductB = candidateList[currentIndex] || initialProductB || candidateList[0] || null;

  if (!isOpen || !productA || !activeProductB) return null;

  const productB = activeProductB;

  const priceA = typeof productA.price === "number" ? productA.price : parseFloat(String(productA.price || "").replace(/[^0-9.]/g, "")) || 0;
  const priceB = typeof productB.price === "number" ? productB.price : parseFloat(String(productB.price || "").replace(/[^0-9.]/g, "")) || 0;
  
  const priceDiff = Math.abs(priceA - priceB);
  const cheaperProduct = priceA < priceB ? "A" : priceA > priceB ? "B" : "SAME";

  // Specs extraction
  const cpuA = extractSpec(productA, /\b(i[3579]-?\d{4,5}[a-z]?|core\s*i[3579]|ryzen\s*[3579]-?\d{4}[a-z]?|intel\s*core|amd\s*ryzen|m[123]\s*(?:pro|max)?)\b/i) || "Standard Processor";
  const cpuB = extractSpec(productB, /\b(i[3579]-?\d{4,5}[a-z]?|core\s*i[3579]|ryzen\s*[3579]-?\d{4}[a-z]?|intel\s*core|amd\s*ryzen|m[123]\s*(?:pro|max)?)\b/i) || "Standard Processor";

  const ramA = extractSpec(productA, /\b(8|16|24|32)\s*gb(?:\s*ram)?\b/i) || "8GB RAM";
  const ramB = extractSpec(productB, /\b(8|16|24|32)\s*gb(?:\s*ram)?\b/i) || "8GB RAM";

  const storageA = extractSpec(productA, /\b(256\s*gb|512\s*gb|1\s*tb|2\s*tb)\s*(?:ssd)?\b/i) || "512GB SSD";
  const storageB = extractSpec(productB, /\b(256\s*gb|512\s*gb|1\s*tb|2\s*tb)\s*(?:ssd)?\b/i) || "512GB SSD";

  const gpuA = extractSpec(productA, /\b(rtx\s*\d{4}|gtx\s*\d{4}|radeon|rx\s*\d+|iris\s*xe|integrated|dedicated\s*graphics)\b/i) || "Integrated Graphics";
  const gpuB = extractSpec(productB, /\b(rtx\s*\d{4}|gtx\s*\d{4}|radeon|rx\s*\d+|iris\s*xe|integrated|dedicated\s*graphics)\b/i) || "Integrated Graphics";

  const displayA = extractSpec(productA, /\b(15\.6|14|13\.3|16)\s*(?:inch|\")?\s*(?:fhd|ips|oled|1080p)?\b/i) || "FHD Display";
  const displayB = extractSpec(productB, /\b(15\.6|14|13\.3|16)\s*(?:inch|\")?\s*(?:fhd|ips|oled|1080p)?\b/i) || "FHD Display";

  const ratingA = parseFloat(productA.rating || "4.3");
  const ratingB = parseFloat(productB.rating || "4.3");

  // Determine intelligent trade-off advice
  const hasMoreRamA = ramA.includes("16") && !ramB.includes("16");
  const hasMoreRamB = ramB.includes("16") && !ramA.includes("16");

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.94, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.94, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl p-5 sm:p-7 shadow-2xl relative border border-slate-200 bg-white text-slate-900"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Title */}
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700">
              <Scale className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Head-to-Head Comparison (VS Mode)
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Side-by-side hardware specifications & AI value analysis
              </p>
            </div>
          </div>

          {/* 1. TOP CARDS SIDE-BY-SIDE */}
          <div className="grid grid-cols-2 gap-3 sm:gap-6 mb-6 relative">
            {/* VS Badge in Center */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 text-white font-black text-xs shadow-xl border-2 border-white">
              VS
            </div>

            {/* Product A Card */}
            <div className="p-3.5 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="w-full h-32 sm:h-40 rounded-xl bg-white p-2 border border-slate-100 mb-3 flex items-center justify-center overflow-hidden">
                  <img
                    src={productA.image || "/laptop.jpg"}
                    alt={productA.title}
                    className="object-contain max-h-full max-w-full"
                  />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 mb-1 block">
                  Option A • {productA.store_name || productA.store || "Online Store"}
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 mb-2">
                  {productA.title}
                </h3>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-200/80 flex items-baseline justify-between">
                <div>
                  <span className="text-lg sm:text-2xl font-black text-slate-900">
                    {formatPrice(productA.price, productA.currency)}
                  </span>
                  {cheaperProduct === "A" && priceDiff > 0 && (
                    <span className="block text-[10px] font-extrabold text-emerald-600">
                      Save ₹{priceDiff.toLocaleString("en-IN")} vs Option B
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{ratingA}</span>
                </div>
              </div>
            </div>

            {/* Product B Card (Interactive Carousel Slider) */}
            <div className="p-3.5 sm:p-5 rounded-2xl bg-gradient-to-b from-purple-50/40 via-slate-50/80 to-slate-50/80 border-2 border-purple-200/90 flex flex-col justify-between relative shadow-sm">
              <div>
                {/* Header with Counter and Option Tag */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-100/90 px-2 py-0.5 rounded-md">
                      Option B
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold truncate max-w-[85px] sm:max-w-[130px]">
                      {productB.store_name || productB.store || "Online Store"}
                    </span>
                  </div>

                  {candidateList.length > 1 && (
                    <div className="flex items-center gap-1 bg-white border border-purple-200 px-2 py-0.5 rounded-full shadow-2xs">
                      <span className="text-[10px] font-extrabold text-purple-700">
                        {currentIndex + 1} / {candidateList.length}
                      </span>
                    </div>
                  )}
                </div>

                {/* Carousel Image Stage with Left & Right Floating Controls */}
                <div className="relative w-full h-32 sm:h-40 rounded-xl bg-white p-2 border border-slate-200/80 mb-2.5 flex items-center justify-center overflow-hidden group/carousel">
                  {/* Left Carousel Arrow Button */}
                  {candidateList.length > 1 && (
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="absolute left-1.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 hover:bg-white text-slate-700 hover:text-purple-700 shadow-md border border-slate-200 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
                      title="Previous Product"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                    </button>
                  )}

                  {/* Right Carousel Arrow Button */}
                  {candidateList.length > 1 && (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 hover:bg-white text-slate-700 hover:text-purple-700 shadow-md border border-slate-200 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
                      title="Next Product"
                    >
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                    </button>
                  )}

                  {/* Animated Product Image */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={productB.id || productB.product_id || productB.title || currentIndex}
                      initial={{ opacity: 0, x: 18 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -18 }}
                      transition={{ duration: 0.18 }}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <img
                        src={productB.image || "/laptop.jpg"}
                        alt={productB.title}
                        className="object-contain max-h-full max-w-full"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Quick Slider Dots & Navigation Buttons */}
                {candidateList.length > 1 && (
                  <div className="flex items-center justify-between gap-1.5 mb-2 px-0.5">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="px-2 py-0.5 rounded-lg bg-white hover:bg-purple-50 text-purple-700 text-[10px] font-bold border border-purple-200 transition-all cursor-pointer flex items-center gap-0.5 active:scale-95 shadow-2xs"
                    >
                      <ChevronLeft className="w-3 h-3" />
                      <span>Prev</span>
                    </button>

                    <div className="flex items-center gap-1 overflow-hidden justify-center px-1">
                      {candidateList.slice(0, Math.min(6, candidateList.length)).map((_, dotIdx) => (
                        <button
                          key={dotIdx}
                          type="button"
                          onClick={() => setCurrentIndex(dotIdx)}
                          className={`rounded-full transition-all cursor-pointer ${
                            currentIndex === dotIdx
                              ? "w-3.5 h-1.5 bg-purple-600"
                              : "w-1.5 h-1.5 bg-purple-200 hover:bg-purple-300"
                          }`}
                          title={`Product ${dotIdx + 1}`}
                        />
                      ))}
                      {candidateList.length > 6 && (
                        <span className="text-[9px] font-bold text-purple-500">+{candidateList.length - 6}</span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-2 py-0.5 rounded-lg bg-white hover:bg-purple-50 text-purple-700 text-[10px] font-bold border border-purple-200 transition-all cursor-pointer flex items-center gap-0.5 active:scale-95 shadow-2xs"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                )}

                <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 mb-2 min-h-[2rem]">
                  {productB.title}
                </h3>
              </div>

              <div className="mt-2 pt-2 border-t border-purple-200/70 flex items-baseline justify-between">
                <div>
                  <span className="text-lg sm:text-2xl font-black text-slate-900">
                    {formatPrice(productB.price, productB.currency)}
                  </span>
                  {cheaperProduct === "B" && priceDiff > 0 && (
                    <span className="block text-[10px] font-extrabold text-emerald-600">
                      Save ₹{priceDiff.toLocaleString("en-IN")} vs Option A
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{ratingB}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. AI VERDICT & DECISION SUMMARY */}
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-indigo-50/90 via-purple-50/50 to-slate-50 border border-indigo-200/80 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
              <h4 className="text-xs font-black uppercase tracking-wider text-indigo-900">
                AI Head-to-Head Winner & Trade-Offs
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white border border-indigo-100">
                <span className="font-extrabold text-indigo-700 block mb-1">
                  💡 Choose Option A if:
                </span>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {cheaperProduct === "A" && priceDiff > 0 ? `Aapka budget tight hai (₹${priceDiff.toLocaleString("en-IN")} sasta hai) aur standard office/study work priority hai.` : hasMoreRamA ? "Aapko heavy multitasking aur coding ke liye zyada RAM chahiye." : "Aap is brand aur reliable build quality ko prefer karte hain."}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white border border-purple-100">
                <span className="font-extrabold text-purple-700 block mb-1">
                  💡 Choose Option B if:
                </span>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {cheaperProduct === "B" && priceDiff > 0 ? `Aapko maximum savings chahiye (₹${priceDiff.toLocaleString("en-IN")} sasta hai) aur value-for-money configuration priority hai.` : hasMoreRamB ? "Aapko future-proof 16GB RAM aur fast processing performance chahiye." : "Aapko iska display aur slim design pasand hai."}
                </p>
              </div>
            </div>
          </div>

          {/* 3. HARDWARE SPEC MATRIX */}
          <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100/80 text-[10px] uppercase tracking-wider text-slate-600 font-extrabold">
                <tr>
                  <th className="p-3 w-1/3">Hardware Specification</th>
                  <th className="p-3 w-1/3 text-indigo-900">Option A</th>
                  <th className="p-3 w-1/3 text-purple-900">Option B</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-slate-600">Processor / CPU</td>
                  <td className="p-3 font-bold text-slate-900">{cpuA}</td>
                  <td className="p-3 font-bold text-slate-900">{cpuB}</td>
                </tr>
                <tr className="hover:bg-slate-50/50 bg-slate-50/30">
                  <td className="p-3 font-semibold text-slate-600">RAM (Memory)</td>
                  <td className={`p-3 font-bold ${hasMoreRamA ? "text-emerald-700 font-black" : "text-slate-900"}`}>{ramA}</td>
                  <td className={`p-3 font-bold ${hasMoreRamB ? "text-emerald-700 font-black" : "text-slate-900"}`}>{ramB}</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-slate-600">Storage (SSD)</td>
                  <td className="p-3 font-bold text-slate-900">{storageA}</td>
                  <td className="p-3 font-bold text-slate-900">{storageB}</td>
                </tr>
                <tr className="hover:bg-slate-50/50 bg-slate-50/30">
                  <td className="p-3 font-semibold text-slate-600">Graphics (GPU)</td>
                  <td className="p-3 font-bold text-slate-900">{gpuA}</td>
                  <td className="p-3 font-bold text-slate-900">{gpuB}</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-slate-600">Screen Display</td>
                  <td className="p-3 font-bold text-slate-900">{displayA}</td>
                  <td className="p-3 font-bold text-slate-900">{displayB}</td>
                </tr>
                <tr className="hover:bg-slate-50/50 bg-slate-50/30">
                  <td className="p-3 font-semibold text-slate-600">Store Destination</td>
                  <td className="p-3 font-bold text-slate-900">{productA.store_name || productA.store || "Online Store"}</td>
                  <td className="p-3 font-bold text-slate-900">{productB.store_name || productB.store || "Online Store"}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 4. DUAL DIRECT BUY BUTTONS */}
          <div className="grid grid-cols-2 gap-3 sm:gap-6 pt-2">
            <a
              href={productA.affiliateUrl || productA.deal_link || productA.link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl text-center font-extrabold text-xs sm:text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Buy Option A ({formatPrice(productA.price, productA.currency)})</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>

            <a
              href={productB.affiliateUrl || productB.deal_link || productB.link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl text-center font-extrabold text-xs sm:text-sm text-white bg-purple-600 hover:bg-purple-700 shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Buy Option B ({formatPrice(productB.price, productB.currency)})</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
