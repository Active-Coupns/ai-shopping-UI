"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Search, 
  Pill, 
  Shirt, 
  Laptop, 
  ExternalLink, 
  RefreshCw, 
  AlertCircle, 
  Lightbulb, 
  ArrowRight,
  ShieldAlert
} from "lucide-react";

/**
 * Intelligent category detection for query intent
 */
function detectCategory(query = "") {
  const q = String(query).toLowerCase();
  
  if (/\b(tablet|tablets|capsule|capsules|syrup|ointment|injection|mg|mcg|ml|dolo|paracetamol|crocin|pharma|medicine|medicines|antibiotic|drops|inhaler|gel|creatinine|vitamin|zincovit|vicks)\b/i.test(q)) {
    return "medicine";
  }
  if (/\b(shirt|shirts|tshirt|t-shirt|jeans|kurta|kurti|saree|dress|shoes|sneakers|hoodie|jacket|blazer|trousers|pants|lehenga|watch|boots|sandals|top|bottom|wear|suit)\b/i.test(q)) {
    return "fashion";
  }
  if (/\b(phone|smartphone|mobile|laptop|earbuds|headphones|macbook|ipad|iphone|samsung|charger|tv|camera|monitor|smartwatch|tablet|gpu|ssd|processor|earphone|powerbank)\b/i.test(q)) {
    return "electronics";
  }
  if (/\b(whey|protein|creatine|peanut butter|oats|shampoo|soap|sunscreen|facewash|face wash|moisturizer|supplement)\b/i.test(q)) {
    return "fitness_personal";
  }
  return "general";
}

export default function ProductNotFoundState({
  searchQuery = "",
  apiError = null,
  onRetry,
  onConsultAi,
  onOpenTrialRoom,
  onSearchCategory,
  onReset
}) {
  const category = useMemo(() => detectCategory(searchQuery), [searchQuery]);
  const isHighTrafficError = Boolean(apiError && (apiError.includes("high shopping traffic") || apiError.includes("momentary") || apiError.includes("busy")));

  // Category-specific presets and advice
  const categoryConfig = useMemo(() => {
    switch (category) {
      case "medicine":
        return {
          icon: Pill,
          iconGradient: "from-emerald-500 to-teal-600 shadow-emerald-500/25",
          badgeText: "🏥 Healthcare & Medicine Advisory",
          badgeBg: "bg-emerald-50 border-emerald-200 text-emerald-800",
          title: `No Authorized Online Sellers Delivering “${searchQuery}”`,
          description: "Prescription drugs and healthcare items often have strict local delivery licensing. For urgent medication or prescription fulfillment, we advise checking with your nearest licensed local pharmacy or verified medical platforms.",
          externalNotice: "Local Pharmacy Recommendation: Always consult a licensed doctor or pharmacist before substituting prescription medicine.",
          externalLinks: [
            {
              name: "Check on Tata 1mg",
              url: `https://www.1mg.com/search/all?name=${encodeURIComponent(searchQuery)}`
            },
            {
              name: "Check on Apollo 24|7",
              url: `https://www.apollopharmacy.in/search-medicines/${encodeURIComponent(searchQuery)}`
            }
          ],
          alternativesTitle: "Common Everyday Healthcare Essentials:",
          alternatives: [
            { label: "💊 Dolo 650 (Strip of 15)", query: "Dolo 650 strip of 15 tabs" },
            { label: "✨ Zincovit Multivitamins", query: "Zincovit Multivitamin tablets" },
            { label: "⚡ Volini Pain Relief", query: "Volini Pain Relief Gel 50g" },
            { label: "🌿 Vicks Vaporub 50ml", query: "Vicks Vaporub 50ml" }
          ]
        };

      case "fashion":
        return {
          icon: Shirt,
          iconGradient: "from-purple-600 to-pink-500 shadow-purple-500/25",
          badgeText: "👗 Fashion Radar & AI Trial Room",
          badgeBg: "bg-purple-50 border-purple-200 text-purple-800",
          title: `No Direct Fashion Matches for “${searchQuery}”`,
          description: "We searched Amazon, Flipkart, Myntra, and partner stores, but this exact fashion item isn't listed in live stock right now. You can try our AI Virtual Trial Room to visualize trending styles on your own photo, or try simpler style keywords.",
          showTrialRoomButton: true,
          alternativesTitle: "Popular Trending Styles You Might Like:",
          alternatives: [
            { label: "👔 Pure Cotton Party Shirts", query: "Pure cotton party shirt" },
            { label: "✨ Men's Slim Fit Linen Shirts", query: "Men slim fit linen shirts" },
            { label: "🌸 Women's Floral Kurti", query: "Women floral cotton anarkali kurti" },
            { label: "👟 Trending White Sneakers", query: "Casual white sneakers for men women" }
          ]
        };

      case "electronics":
        return {
          icon: Laptop,
          iconGradient: "from-indigo-600 to-blue-600 shadow-indigo-500/25",
          badgeText: "⚡ Electronics & Gadgets Radar",
          badgeBg: "bg-indigo-50 border-indigo-200 text-indigo-800",
          title: `No Matching Tech Deals Found for “${searchQuery}”`,
          description: "This exact gadget model might be discontinued, out of stock, or listed under a slightly different model number across Amazon & Flipkart. Try searching by series name, budget, or key feature.",
          tips: [
            "Check for small model number typos (e.g. '15 Pro' vs 'iPhone 15 Pro')",
            "Try searching by budget (e.g. 'Laptop under 50000')",
            "Ask our AI Concierge to recommend best alternatives in this price bracket"
          ],
          alternativesTitle: "Top Tech Categories with Live Discounts:",
          alternatives: [
            { label: "💻 Laptops under ₹50,000", query: "Best laptop under ₹50,000" },
            { label: "📱 5G Phones under ₹20,000", query: "Best 5G smartphone under 20000" },
            { label: "🎧 ANC Wireless Earbuds", query: "Noise cancelling wireless earbuds" },
            { label: "⚡ 65W GaN Fast Chargers", query: "65W GaN fast charger type C" }
          ]
        };

      case "fitness_personal":
        return {
          icon: Sparkles,
          iconGradient: "from-amber-500 to-orange-500 shadow-amber-500/25",
          badgeText: "💪 Health & Fitness Inventory",
          badgeBg: "bg-amber-50 border-amber-200 text-amber-800",
          title: `No Verified Stock for “${searchQuery}”`,
          description: "We verify seller authenticity to protect you from fake supplements. Live stock for this specific supplement or personal care item was not confirmed by authorized dealers.",
          alternativesTitle: "Verified Top-Rated Health & Fitness Deals:",
          alternatives: [
            { label: "💪 ON Whey Gold Standard 2kg", query: "ON Gold Standard Whey 2kg" },
            { label: "⚡ MuscleBlaze Creatine 250g", query: "MuscleBlaze Creatine Monohydrate 250g" },
            { label: "🥜 Pintola Peanut Butter 1kg", query: "Pintola All Natural Peanut Butter 1kg" },
            { label: "🧴 Cetaphil Gentle Cleanser", query: "Cetaphil Gentle Skin Cleanser" }
          ]
        };

      default:
        return {
          icon: Search,
          iconGradient: "from-indigo-600 to-purple-600 shadow-indigo-500/25",
          badgeText: "🔍 Smart Price Radar",
          badgeBg: "bg-slate-100 border-slate-200 text-slate-800",
          title: `No Live Deals Found for “${searchQuery}”`,
          description: "We searched across Amazon, Flipkart, and leading shopping networks in India, but couldn't find live listings matching your exact query right now.",
          tips: [
            "Check for spelling errors or try more general keywords",
            "Remove brand-specific model codes or sizes to see broader options",
            "Ask our AI Shopping Concierge to locate the closest alternative"
          ],
          alternativesTitle: "Popular Categories with Active Discounts:",
          alternatives: [
            { label: "💻 Laptops under ₹50,000", query: "Best laptop under ₹50,000" },
            { label: "👔 Casual Cotton Shirts", query: "Pure cotton party shirt" },
            { label: "💊 Dolo 650 & Healthcare", query: "Dolo 650 strip of 15 tabs" },
            { label: "💪 Whey Protein Deals", query: "ON Gold Standard Whey 2kg" }
          ]
        };
    }
  }, [category, searchQuery]);

  const IconComponent = categoryConfig.icon;

  // 1. High-Traffic / Server Busy Exception Card
  if (isHighTrafficError) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl mx-auto text-center py-10 px-6 sm:px-8 glass-panel rounded-3xl border border-amber-200/80 shadow-xl mt-6 bg-white/95 backdrop-blur-md"
      >
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/25">
          <AlertCircle className="w-8 h-8 animate-pulse" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-3">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>High Shopping Traffic Notice</span>
        </div>

        <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-2">
          Merchant Networks are Temporarily Busy
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed max-w-md mx-auto">
          {apiError || "Zippy servers are experiencing extraordinarily high shopping traffic right now. To guarantee verified prices, please click retry or wait a few seconds."}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Search Now</span>
            </button>
          )}

          <button
            type="button"
            onClick={onReset}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 transition-all cursor-pointer shadow-2xs active:scale-95"
          >
            Clear & Reset
          </button>
        </div>
      </motion.div>
    );
  }

  // 2. Comprehensive Contextual "No Results Found" Card
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-xl mx-auto text-center py-10 px-5 sm:px-8 glass-panel rounded-3xl border border-slate-200 shadow-xl mt-6 bg-white/95 backdrop-blur-md"
    >
      {/* Icon Badge */}
      <div className="relative w-16 h-16 mx-auto mb-4">
        <div className="absolute inset-0 rounded-2xl bg-slate-200/50 animate-ping opacity-30" />
        <div className={`relative w-16 h-16 bg-gradient-to-tr ${categoryConfig.iconGradient} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
          <IconComponent className="w-8 h-8" />
        </div>
      </div>

      {/* Category Pill */}
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-extrabold mb-3 ${categoryConfig.badgeBg}`}>
        <span>{categoryConfig.badgeText}</span>
      </div>

      {/* Main Title */}
      <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-2 leading-snug">
        {categoryConfig.title}
      </h3>

      {/* Description */}
      <p className="text-xs sm:text-sm text-slate-600 mb-5 leading-relaxed max-w-lg mx-auto">
        {categoryConfig.description}
      </p>

      {/* Medicine External Store Fallbacks & Disclaimer */}
      {category === "medicine" && (
        <div className="mb-6 p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-left">
          <div className="flex items-start gap-2 mb-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] font-bold text-amber-900 leading-tight">
              {categoryConfig.externalNotice}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 pt-1 border-t border-amber-200/60">
            {categoryConfig.externalLinks?.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white hover:bg-amber-100/60 border border-amber-300 text-xs font-bold text-amber-900 transition-colors shadow-2xs"
              >
                <span>{link.name}</span>
                <ExternalLink className="w-3 h-3 text-amber-700" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Search Tips (if applicable) */}
      {categoryConfig.tips && (
        <div className="mb-6 p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-left space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Search Tips to Find Deals:</span>
          </div>
          <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
            {categoryConfig.tips.map((tip, idx) => (
              <li key={idx} className="leading-relaxed">{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Instant Alternative Chips */}
      {categoryConfig.alternatives && (
        <div className="bg-slate-50/90 border border-slate-200/80 rounded-2xl p-4 mb-6 text-left space-y-2.5">
          <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            💡 {categoryConfig.alternativesTitle}
          </p>
          <div className="flex flex-wrap gap-2">
            {categoryConfig.alternatives.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSearchCategory && onSearchCategory(item.query)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-xs font-semibold text-slate-700 hover:text-indigo-700 transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
        {/* Fashion Virtual Trial Room Shortcut */}
        {categoryConfig.showTrialRoomButton && onOpenTrialRoom && (
          <button
            type="button"
            onClick={onOpenTrialRoom}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-purple-600/20 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
          >
            <Shirt className="w-4 h-4 text-pink-200" />
            <span>Open AI Virtual Trial Room</span>
          </button>
        )}

        {/* AI Concierge Consultation */}
        <button
          type="button"
          onClick={() => onConsultAi && onConsultAi(searchQuery)}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Ask AI Guide for Suggestions</span>
        </button>

        {/* Reset Search */}
        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 transition-all cursor-pointer shadow-2xs active:scale-95"
        >
          Reset Search
        </button>
      </div>
    </motion.div>
  );
}
