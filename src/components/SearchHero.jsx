"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Search, 
  Sparkles, 
  X, 
  Pill, 
  ShoppingBag, 
  Tag, 
  HeartPulse, 
  UploadCloud, 
  Image as ImageIcon, 
  ArrowRight,
  Zap,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ECOM_QUERIES_IN = [
  "Best laptop under ₹50,000",
  "Sabse sasta 5G phone",
  "Noise cancelling headphones",
  "Pure cotton party shirt",
  "Top 4K vlog camera"
];

const HEALTH_QUERIES_IN = [
  "ON Gold Standard Whey 2kg",
  "Dolo 650 strip of 15 tabs",
  "MuscleBlaze Biozyme Whey",
  "Telma 40mg strip",
  "Creatine monohydrate 250g"
];

const COUPON_QUERIES_IN = [
  "Zomato food discount coupons",
  "Swiggy 50% OFF promo codes",
  "Myntra new user fashion coupon",
  "Blinkit ₹100 grocery voucher",
  "Domino's pizza deals today"
];

const QUICK_TRENDING_ECOM_IN = [
  { label: "⚡ Laptops under ₹50K", query: "Best laptop under ₹50,000 for coding & gaming" },
  { label: "🔥 Top 5G Phones", query: "Sabse sasta 5G mobile phone" },
  { label: "🎧 ANC Earbuds", query: "Noise-cancelling headphones for travel" },
  { label: "👔 Party Shirts", query: "Party cotton shirt under ₹3,000" },
  { label: "👟 Sneakers Deals", query: "Best white sneakers for men" }
];

const QUICK_TRENDING_HEALTH_IN = [
  { label: "💪 ON Whey 2kg", query: "ON Gold Standard 100% Whey 2kg" },
  { label: "💊 Dolo 650 (1mg vs Apollo)", query: "Dolo 650 Strip of 15 Tablets" },
  { label: "⚡ MB Creatine 250g", query: "MuscleBlaze Micronized Creatine 250g" },
  { label: "🩺 Telma 40 BP Care", query: "Telma 40mg Strip of 15 Tablets" },
  { label: "🌿 Shelcal 500", query: "Shelcal 500 Strip of 15 Tablets" }
];

const QUICK_TRENDING_COUPONS_IN = [
  { label: "🍕 Zomato", query: "Zomato" },
  { label: "🛵 Swiggy", query: "Swiggy" },
  { label: "🛍️ Myntra", query: "Myntra" },
  { label: "⚡ Zepto", query: "Zepto" },
  { label: "🛒 Blinkit", query: "Blinkit" },
  { label: "🍕 Domino's", query: "Domino's" },
  { label: "👗 Ajio", query: "Ajio" }
];

const ECOM_QUERIES_US = [
  "Best laptop under $600 for work & gaming",
  "Top 5G unlocked smartphone deals",
  "Sony noise cancelling headphones",
  "Men's slim fit oxford dress shirt",
  "4K streaming camera with AI autofocus"
];

const HEALTH_QUERIES_US = [
  "Optimum Nutrition Gold Standard 100% Whey 5lb",
  "Tylenol Extra Strength 500mg caplets 100 count",
  "Optimum Nutrition Micronized Creatine Powder 300g",
  "Advil Dual Action with Acetaminophen 144 caplets",
  "Centrum Men's Daily Multivitamin 200 tablets"
];

const COUPON_QUERIES_US = [
  "UberEats promo codes",
  "DoorDash discount coupons",
  "Target weekly promo codes",
  "Nike shoes discount code",
  "Amazon active vouchers"
];

const QUICK_TRENDING_ECOM_US = [
  { label: "⚡ Laptops under $600", query: "Best laptop under $600 for work & gaming" },
  { label: "🔥 Unlocked 5G Phones", query: "Top 5G unlocked smartphone deals" },
  { label: "🎧 Noise Cancelling Earbuds", query: "Sony noise cancelling headphones" },
  { label: "👔 Oxford Shirts", query: "Men's slim fit oxford dress shirt" },
  { label: "👟 Nike & Adidas Deals", query: "Men's running sneakers on sale" }
];

const QUICK_TRENDING_HEALTH_US = [
  { label: "💪 ON Gold Whey 5lb", query: "Optimum Nutrition Gold Standard 100% Whey 5lb" },
  { label: "💊 Tylenol Extra Strength", query: "Tylenol Extra Strength 500mg caplets 100 count" },
  { label: "⚡ ON Creatine 300g", query: "Optimum Nutrition Micronized Creatine Powder 300g" },
  { label: "🩺 Advil Dual Action", query: "Advil Dual Action with Acetaminophen 144 caplets" },
  { label: "🌿 Centrum Multivitamin", query: "Centrum Men's Daily Multivitamin 200 tablets" }
];

const QUICK_TRENDING_COUPONS_US = [
  { label: "🍔 UberEats", query: "UberEats" },
  { label: "🚗 DoorDash", query: "DoorDash" },
  { label: "👟 Nike", query: "Nike" },
  { label: "🛍️ Target", query: "Target" },
  { label: "📦 Amazon Deals", query: "Amazon" }
];

export default function SearchHero({ 
  country = "IN", 
  onSubmit,
  onCouponSearch,
  onAnalyzeCartScreenshot 
}) {
  const [activeTab, setActiveTab] = useState("ecommerce"); // "ecommerce" | "health" | "coupons"
  const [query, setQuery] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [queryIndex, setQueryIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Cart Screenshot Upload State
  const [cartImage, setCartImage] = useState(null);
  const [cartImagePreview, setCartImagePreview] = useState(null);
  const [isAnalyzingCart, setIsAnalyzingCart] = useState(false);
  const fileInputRef = useRef(null);

  const isUS = String(country).toUpperCase() === "US";
  const isHealth = activeTab === "health";
  const isCoupons = activeTab === "coupons";

  const exampleQueries = isCoupons
    ? (isUS ? COUPON_QUERIES_US : COUPON_QUERIES_IN)
    : isHealth
    ? (isUS ? HEALTH_QUERIES_US : HEALTH_QUERIES_IN)
    : (isUS ? ECOM_QUERIES_US : ECOM_QUERIES_IN);

  const trendingList = isCoupons
    ? (isUS ? QUICK_TRENDING_COUPONS_US : QUICK_TRENDING_COUPONS_IN)
    : isHealth
    ? (isUS ? QUICK_TRENDING_HEALTH_US : QUICK_TRENDING_HEALTH_IN)
    : (isUS ? QUICK_TRENDING_ECOM_US : QUICK_TRENDING_ECOM_IN);

  // Reset typewriter when tab or country changes
  useEffect(() => {
    setQueryIndex(0);
    setCharIndex(0);
    setIsDeleting(false);
    setPlaceholder("");
  }, [activeTab, country]);

  // Smooth Typewriter effect
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
        }, 50);
      } else {
        timer = setTimeout(() => setIsDeleting(true), 2600);
      }
    }

    return () => clearTimeout(timer);
  }, [placeholder, charIndex, isDeleting, queryIndex, activeTab, country]);

  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastSubmitTime < 1500) return;
    setLastSubmitTime(now);

    const finalQuery = query.trim() || exampleQueries[queryIndex];
    if (isCoupons && onCouponSearch) {
      onCouponSearch(finalQuery);
    } else {
      onSubmit(finalQuery);
    }
  };

  const handlePromptClick = (promptQuery) => {
    const now = Date.now();
    if (now - lastSubmitTime < 1500) return;
    setLastSubmitTime(now);

    setQuery(promptQuery);
    if (isCoupons && onCouponSearch) {
      onCouponSearch(promptQuery);
    } else {
      onSubmit(promptQuery);
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64 = uploadEvent.target?.result;
      setCartImage(base64);
      setCartImagePreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleCartAnalysisSubmit = async () => {
    if (!cartImage || !onAnalyzeCartScreenshot) return;
    setIsAnalyzingCart(true);
    try {
      await onAnalyzeCartScreenshot(cartImage);
    } finally {
      setIsAnalyzingCart(false);
    }
  };

  const clearCartImage = () => {
    setCartImage(null);
    setCartImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-4 sm:py-8 text-center flex flex-col justify-center items-center">
      
      {/* 1. Dynamic Catchy Brand Tag & Headline */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.25 }}
          className="mb-4 sm:mb-6 max-w-xl mx-auto"
        >
          {/* Top Badge with Dynamic Theme Coloring */}
          {isCoupons ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-[11px] font-bold text-violet-800 mb-2.5 shadow-2xs">
              <Tag className="w-3.5 h-3.5 text-violet-600 animate-pulse" />
              <span>{isUS ? "100% Verified Promo Codes & Cart Scanner" : "100% Verified Coupons & AI Cart Saver"}</span>
            </div>
          ) : isHealth ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-800 mb-2.5 shadow-2xs">
              <HeartPulse className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>{isUS ? "US Pharmacy & Verified Health Finder" : "100% Genuine Pharmacy & Supplements"}</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[11px] font-bold text-brand-indigo mb-2.5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-indigo animate-pulse" />
              <span>{isUS ? "US Smart Shopping Assistant" : "AI Deal & E-Commerce Finder"}</span>
            </div>
          )}

          {/* Dynamic Catchy Title with Mode-Specific Gradients */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            {isCoupons ? (
              <>
                Unlock Best Coupons, <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-fuchsia-600 to-amber-500">Max Savings.</span>
              </>
            ) : isHealth ? (
              <>
                Compare Medicine & <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">Health Stacks.</span>
              </>
            ) : (
              <>
                Find the Best Price, <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-indigo via-purple-600 to-pink-600">Instantly.</span>
              </>
            )}
          </h1>
          
          {/* Dynamic Subtitle */}
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5 leading-relaxed">
            {isCoupons
              ? (isUS
                  ? "Live verified promo codes across UberEats, DoorDash, Amazon, Target, Nike & 50+ stores."
                  : "Live verified promo codes across Zomato, Swiggy, Myntra, Blinkit, Zepto & 50+ stores.")
              : isHealth
              ? (isUS 
                  ? "Real-time prices across CVS, Walgreens, GNC, iHerb & Walmart Pharmacy." 
                  : "Real-time prices across Tata 1mg, Apollo 24|7, HealthKart & PharmEasy.")
              : (isUS 
                  ? "Real-time comparison across Amazon.com, Walmart, Best Buy & Target." 
                  : "Real-time comparison across Amazon, Flipkart, Myntra & Croma.")}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* 2. Interactive 3-Vertical Segmented Toggle */}
      <div className="flex items-center p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 mb-4 sm:mb-6 w-full max-w-sm shadow-inner">
        {/* Shopping Tab */}
        <button
          type="button"
          onClick={() => setActiveTab("ecommerce")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "ecommerce"
              ? "bg-white text-slate-900 shadow-sm border border-slate-200/60"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <ShoppingBag className={`w-3.5 h-3.5 ${activeTab === "ecommerce" ? "text-brand-indigo" : ""}`} />
          <span>Shopping</span>
        </button>

        {/* Pharmacy Tab */}
        <button
          type="button"
          onClick={() => setActiveTab("health")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "health"
              ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm shadow-emerald-500/20"
              : "text-slate-500 hover:text-emerald-700"
          }`}
        >
          <Pill className="w-3.5 h-3.5" />
          <span>Pharmacy</span>
        </button>

        {/* Coupons Tab */}
        <button
          type="button"
          onClick={() => setActiveTab("coupons")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "coupons"
              ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-sm shadow-violet-500/20"
              : "text-slate-500 hover:text-violet-700"
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Coupons</span>
        </button>
      </div>

      {/* 3. Sleek Modern Search Console with Dynamic Theme Glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="w-full max-w-xl mb-4 sm:mb-6"
      >
        <form 
          onSubmit={handleSubmit}
          className={`flex items-center gap-1.5 bg-white border rounded-2xl p-1.5 sm:p-2 shadow-lg shadow-slate-100/80 transition-all ${
            isCoupons
              ? "border-violet-200 hover:border-violet-300 focus-within:border-violet-500 focus-within:ring-4 focus-within:ring-violet-500/15"
              : isHealth
              ? "border-emerald-200/90 hover:border-emerald-300 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/15"
              : "border-slate-200 hover:border-slate-300 focus-within:border-brand-indigo focus-within:ring-4 focus-within:ring-indigo-500/10"
          }`}
        >
          <div className="pl-2.5 shrink-0">
            {isCoupons ? (
              <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-violet-600 animate-pulse" />
            ) : isHealth ? (
              <Pill className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 animate-pulse" />
            ) : (
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-brand-indigo" />
            )}
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              placeholder || 
              (isCoupons 
                ? "Search store (e.g. Zomato, Swiggy, Myntra)..." 
                : isHealth 
                ? "Search medicine, supplement or paste link..." 
                : "Search product or paste URL (Amazon, Flipkart)...")
            }
            className="w-full bg-transparent text-slate-800 text-xs sm:text-sm font-medium focus:outline-hidden px-1 placeholder:text-slate-400"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="submit"
            className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 cursor-pointer shrink-0 ${
              isCoupons
                ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-95 shadow-violet-500/20"
                : isHealth
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 shadow-emerald-500/20"
                : "bg-gradient-to-r from-brand-indigo to-brand-violet hover:opacity-95 shadow-indigo-500/20"
            }`}
          >
            {isCoupons ? "Find Codes" : "Search"}
          </button>
        </form>

        {/* Quick Trending Chips */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-3 sm:mt-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Trending:
          </span>
          {trendingList.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePromptClick(item.query)}
              className={`px-2.5 py-1 rounded-xl text-[11px] sm:text-xs font-semibold border transition-all cursor-pointer active:scale-95 shadow-2xs ${
                isCoupons
                  ? "bg-violet-50/70 hover:bg-violet-100/90 text-violet-800 border-violet-200/70"
                  : isHealth
                  ? "bg-emerald-50/70 hover:bg-emerald-100/90 text-emerald-800 border-emerald-200/70"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* 4. "SNAP & SAVE" AI CART SCREENSHOT DROPZONE (Exclusively in Coupons Mode) */}
      {isCoupons && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="w-full max-w-xl mt-2"
        >
          {/* OR Divider */}
          <div className="relative flex items-center justify-center my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative px-3 bg-white/80 text-[10px] sm:text-[11px] font-extrabold text-slate-400 uppercase tracking-widest backdrop-blur-xs">
              Or Snap Your Checkout Cart
            </span>
          </div>

          {/* Interactive Dropzone Box */}
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-b from-white to-violet-50/40 border-2 border-dashed border-violet-200 hover:border-violet-400 transition-all text-left shadow-sm relative overflow-hidden">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageFileChange}
              accept="image/png, image/jpeg, image/jpg, image/webp"
              className="hidden"
            />

            {!cartImagePreview ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col sm:flex-row items-center gap-3.5 cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-violet-600 group-hover:text-white transition-all shadow-xs">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-violet-700 transition-colors flex items-center justify-center sm:justify-start gap-1.5">
                    <span>Upload Cart or Checkout Screenshot</span>
                    <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    AI reads your cart amount & store from screenshot to match the #1 biggest discount coupon.
                  </p>
                </div>
                <button
                  type="button"
                  className="px-3.5 py-1.5 rounded-xl bg-violet-600 text-white text-xs font-bold shadow-xs hover:bg-violet-700 transition-all shrink-0 cursor-pointer pointer-events-none"
                >
                  Choose Image
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3.5">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-violet-200 shrink-0 bg-slate-100">
                    <img
                      src={cartImagePreview}
                      alt="Cart preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={clearCartImage}
                      className="absolute top-0.5 right-0.5 p-0.5 bg-black/60 text-white rounded-full hover:bg-black transition-colors"
                      title="Remove image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" /> Screenshot Ready
                    </span>
                    <h5 className="text-xs font-bold text-slate-800">
                      Ready for AI Analysis
                    </h5>
                    <p className="text-[10px] text-slate-500">
                      Click below to find the max saving code
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={clearCartImage}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-all cursor-pointer"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    disabled={isAnalyzingCart}
                    onClick={handleCartAnalysisSubmit}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-bold shadow-md shadow-violet-500/25 hover:opacity-95 transition-all cursor-pointer active:scale-95 disabled:opacity-60"
                  >
                    {isAnalyzingCart ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Analyzing Cart...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Find Best Coupon</span>
                        <ArrowRight className="w-3 h-3" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

    </div>
  );
}
