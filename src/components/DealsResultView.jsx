"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  ExternalLink, 
  Flame, 
  Sparkles, 
  Star, 
  TrendingDown, 
  CheckCircle2, 
  Search,
  Zap,
  ShoppingBag,
  ShieldCheck,
  Tag,
  Clock,
  AlertCircle
} from "lucide-react";
import { DEAL_CATEGORIES } from "@/services/dealsService";

export default function DealsResultView({
  dealsData,
  isLoading = false,
  activeCategoryId = "smartphones",
  onSelectCategory,
  onBack,
  onCompareProduct
}) {
  const [selectedCatId, setSelectedCatId] = useState(activeCategoryId);
  const [isSwitching, setIsSwitching] = useState(false);

  // Sync selectedCatId if parent changes activeCategoryId
  React.useEffect(() => {
    if (activeCategoryId) {
      setSelectedCatId(activeCategoryId);
    }
  }, [activeCategoryId]);

  const category = dealsData?.category || DEAL_CATEGORIES.find(c => c.id === selectedCatId) || DEAL_CATEGORIES[0];
  const deals = dealsData?.deals || [];
  const totalDeals = deals.length;
  const isCurrentlyLoading = isLoading || isSwitching || !dealsData;

  const handleCategoryClick = async (catId) => {
    if (catId === selectedCatId) return;
    setSelectedCatId(catId);
    setIsSwitching(true);
    await onSelectCategory(catId);
    setIsSwitching(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6 text-left">
      {/* Top Navigation & Back Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 transition-all shadow-xs cursor-pointer active:scale-95"
            title="Back to All Categories"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{category.icon}</span>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                {category.name} Deals Today
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-[10px] font-black text-rose-700 flex items-center gap-1">
                <Flame className="w-3 h-3 fill-rose-600 text-rose-600" />
                <span>{totalDeals} Live Deals</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Verified steep discounts, lightning deals and minimum price drops scanned live across top merchants.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer self-start sm:self-auto"
        >
          <span>← Browse All Categories</span>
        </button>
      </div>

      {/* Quick Category Switcher Pills */}
      <div className="mb-6 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-2 min-w-max">
          {DEAL_CATEGORIES.map((cat) => {
            const isSelected = (cat.id === category.id) || (cat.id === selectedCatId);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryClick(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                    : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200/80"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 💡 Smart Live Note & Dynamic Deals Alert Banner */}
      <div className="mb-6 p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-500/25 flex items-start sm:items-center justify-between gap-3 text-xs text-amber-950 shadow-2xs">
        <div className="flex items-start sm:items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-700 shrink-0 mt-0.5 sm:mt-0">
            <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
          </div>
          <p className="leading-relaxed text-slate-700">
            <strong className="text-amber-950 font-black">⚡ Smart Deals Note: </strong>
            Flash deals, lightning price drops and bank card discounts update dynamically on merchant sites. Final checkout discounts & stock availability are verified at the store.
          </p>
        </div>

        <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/90 border border-amber-200/80 text-[10px] font-black text-amber-800 shadow-2xs shrink-0">
          <Sparkles className="w-3 h-3 text-amber-600" />
          <span>Live Flash Sync</span>
        </div>
      </div>

      {/* Loading Scanner Banner & Shimmer Skeletons State */}
      {isCurrentlyLoading ? (
        <div className="space-y-6">
          {/* Active Live Scanner Banner */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-violet-500/10 border border-amber-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20 shrink-0">
                <Flame className="w-5 h-5 fill-white animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                    Scanning Today&apos;s Steepest Deals in {category.name}...
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-rose-100 border border-rose-200 text-[10px] font-black text-rose-700 animate-pulse">
                    SCANNING LIVE
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  Querying Amazon.in, Flipkart, Myntra, Croma & Reliance Digital for genuine verified discounts...
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-white/80 px-3 py-1.5 rounded-xl border border-slate-200/80 shrink-0">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Checking 50+ Stores</span>
            </div>
          </motion.div>

          {/* 8 Shimmer Skeleton Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={`deal-skeleton-${idx}`}
                className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between animate-pulse min-h-[380px]"
              >
                {/* Top Badges */}
                <div className="flex items-center justify-between mb-3">
                  <div className="h-5 w-20 bg-rose-100/80 rounded-full" />
                  <div className="h-5 w-16 bg-slate-100 rounded-full" />
                </div>

                {/* Image Placeholder */}
                <div className="w-full h-44 sm:h-48 rounded-xl bg-slate-100 mb-3 flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-slate-300 animate-bounce" />
                </div>

                {/* Content Lines */}
                <div className="space-y-2 mb-3">
                  <div className="h-4 bg-slate-100 rounded-md w-full" />
                  <div className="h-4 bg-slate-100 rounded-md w-4/5" />
                  <div className="h-3 bg-slate-100 rounded-md w-1/2 mt-2" />
                </div>

                {/* Price & Savings Pill */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-baseline gap-2">
                    <div className="h-6 bg-slate-200 rounded-md w-1/3" />
                    <div className="h-4 bg-slate-100 rounded-md w-1/4" />
                  </div>
                  <div className="h-5 bg-emerald-50 rounded-md w-1/2" />
                  <div className="h-10 bg-slate-100 rounded-xl w-full mt-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Deals Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {deals.map((deal, idx) => (
              <motion.div
                key={deal.id || `deal-card-${idx}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.03 }}
                className="group p-4 rounded-2xl bg-white border border-slate-200 hover:border-violet-300 transition-all shadow-xs hover:shadow-lg flex flex-col justify-between relative overflow-hidden"
              >
                {/* Top Badges Row */}
                <div className="flex items-center justify-between gap-1 mb-2.5">
                  <span className="text-[10px] font-black text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-rose-600" />
                    <span>{deal.discountPercent}% OFF</span>
                  </span>

                  <span className="text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded-full truncate max-w-[120px]">
                    {deal.store}
                  </span>
                </div>

                {/* Product Image */}
                <div className="relative w-full h-44 sm:h-48 mb-3 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden p-2">
                  {deal.image ? (
                    <img
                      src={deal.image}
                      alt={deal.title}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                  )}

                  {/* Deal Tag Overlay */}
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-lg bg-slate-900/85 backdrop-blur-md text-[10px] font-bold text-white shadow-xs">
                    {deal.badge}
                  </div>
                </div>

                {/* Content & Specs */}
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-violet-900 transition-colors">
                      {deal.title}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1.5">
                      <div className="flex items-center text-amber-500">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="font-bold ml-1 text-slate-700">{deal.rating}</span>
                      </div>
                      <span>•</span>
                      <span>{deal.reviewsCount.toLocaleString()} reviews</span>
                    </div>
                  </div>

                  {/* Price & Savings Pill */}
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg sm:text-xl font-black text-slate-900 font-mono tracking-tight">
                        {deal.price}
                      </span>
                      <span className="text-xs text-slate-400 line-through font-mono">
                        {deal.originalPrice}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                      <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 rounded-lg px-2 py-0.5 inline-flex items-center gap-1">
                        <TrendingDown className="w-3 h-3" />
                        <span>Save {deal.savingsAmount} Today</span>
                      </div>

                      {deal.specialOffer && (
                        <div className="text-[10px] font-extrabold text-violet-700 bg-violet-50 border border-violet-200/80 rounded-lg px-2 py-0.5 inline-flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-violet-600" />
                          <span>{deal.specialOffer}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2 Action Buttons */}
                <div className="mt-3.5 pt-2.5 flex items-center gap-2">
                  <a
                    href={deal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-bold text-xs transition-all shadow-xs active:scale-95 cursor-pointer text-center"
                  >
                    <span>View Deal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={() => onCompareProduct(deal.title)}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-all cursor-pointer active:scale-95"
                    title="Compare price across other stores"
                  >
                    <Search className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {deals.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
              <p className="text-slate-500 text-sm font-medium">No live price drops detected for this category right now. Please explore another category.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
