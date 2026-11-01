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
  Loader2,
  Mic,
  Camera,
  Flame,
  ShieldCheck,
  Tv,
  Plane
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { userJourneyTracker } from "@/services/userJourneyTracker";
import StoreCardCarousel from "@/components/StoreCardCarousel";
import CategoryDealsExplorer from "@/components/CategoryDealsExplorer";
import { getCountryMeta } from "@/lib/countryConfig";

const ECOM_QUERIES_IN = [
  "Search best smartphones & prices...",
  "Search laptops for work & gaming...",
  "Search wireless noise cancelling earbuds...",
  "Search smartwatches & fitness trackers...",
  "Search top rated running shoes..."
];

const HEALTH_QUERIES_IN = [
  "ON Gold Standard Whey 2kg",
  "Dolo 650 strip of 15 tabs",
  "MuscleBlaze Biozyme Whey",
  "Telma 40mg strip",
  "Creatine monohydrate 250g"
];

const UNIVERSAL_COUPON_QUERIES = [
  "Search food delivery discount coupons...",
  "Search fashion & apparel promo codes...",
  "Search grocery & supermarket vouchers...",
  "Search electronics & gadgets coupons...",
  "Search travel & ride discount codes..."
];

const COUPON_QUERIES_IN = UNIVERSAL_COUPON_QUERIES;

const DEALS_QUERIES_IN = [
  "Smartphone deals and offers",
  "Wireless earbuds discount sale",
  "Laptops special offer deals",
  "Running shoes price drop",
  "Smartwatch festival discounts"
];

const SMART_TERMINAL_QUERIES_IN = [
  "https://www.amazon.in/dp/B0CQ2889D7 (Samsung Galaxy S24)",
  "https://www.flipkart.com/apple-iphone-16-128-gb/p/itm43212abcd",
  "https://www.croma.com/sony-wh-1000xm5-headphones/p/251234",
  "Paste any product URL to calculate max savings"
];

const QUICK_TRENDING_TERMINAL_IN = [
  { label: "📱 Samsung Galaxy S24", query: "https://www.amazon.in/dp/B0CQ2889D7-Samsung-Galaxy-S24-5G" },
  { label: "🍎 iPhone 16 (128GB)", query: "https://www.amazon.in/dp/B0DJ2XYZ-Apple-iPhone-16-128GB" },
  { label: "🎧 Sony WH-1000XM5", query: "https://www.amazon.in/dp/B09XS7JWHH-Sony-WH-1000XM5-Wireless" },
  { label: "💻 MacBook Air M3", query: "https://www.amazon.in/dp/B0CX21C26G-Apple-MacBook-Air-M3" }
];

const UNIVERSAL_TRENDING_SHOPPING = [
  { label: "📱 Smartphones", query: "Best smartphone deals" },
  { label: "💻 Laptops", query: "Top rated laptops" },
  { label: "⌚ Smartwatches", query: "Smartwatches with fitness tracking" },
  { label: "🎧 Wireless Earbuds", query: "Noise cancelling wireless earbuds" },
  { label: "👟 Running Shoes", query: "Comfortable running shoes" }
];

const QUICK_TRENDING_ECOM_IN = UNIVERSAL_TRENDING_SHOPPING;

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
  "Search best smartphones & prices...",
  "Search laptops for work & gaming...",
  "Search wireless noise cancelling earbuds...",
  "Search smartwatches & fitness trackers...",
  "Search top rated running shoes..."
];

const HEALTH_QUERIES_US = [
  "Optimum Nutrition Gold Standard 100% Whey 5lb",
  "Tylenol Extra Strength 500mg caplets 100 count",
  "Optimum Nutrition Micronized Creatine Powder 300g",
  "Advil Dual Action with Acetaminophen 144 caplets",
  "Centrum Men's Daily Multivitamin 200 tablets"
];

const COUPON_QUERIES_US = UNIVERSAL_COUPON_QUERIES;

const QUICK_TRENDING_ECOM_US = UNIVERSAL_TRENDING_SHOPPING;

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

const DEALS_QUERIES_US = [
  "Unlocked 5G smartphone deals under $300",
  "Sony noise cancelling headphones 40% off",
  "Best laptop deals under $600",
  "Nike & Adidas running shoes sale",
  "Optimum Nutrition whey protein discount"
];

const SMART_TERMINAL_QUERIES_US = [
  "https://www.amazon.com/dp/B0CQ2889D7 (Samsung Galaxy S24)",
  "https://www.amazon.com/dp/B0DJ2XYZ (Apple iPhone 16)",
  "Paste any product link to calculate gift card & net savings"
];

const QUICK_TRENDING_TERMINAL_US = [
  { label: "📱 Samsung Galaxy S24", query: "https://www.amazon.com/dp/B0CQ2889D7-Samsung-Galaxy-S24-5G" },
  { label: "🍎 iPhone 16 (128GB)", query: "https://www.amazon.com/dp/B0DJ2XYZ-Apple-iPhone-16-128GB" },
  { label: "🎧 Sony WH-1000XM5", query: "https://www.amazon.com/dp/B09XS7JWHH-Sony-WH-1000XM5-Wireless" },
  { label: "💻 MacBook Air M3", query: "https://www.amazon.com/dp/B0CX21C26G-Apple-MacBook-Air-M3" }
];

export default function SearchHero({ 
  country = "IN", 
  initialTab = "ecommerce",
  onSubmit,
  onCouponSearch,
  onAnalyzeCartScreenshot,
  onOpenConcierge,
  onOpenTrustSheet,
  onSelectCategoryDeal,
  onOpenSubscriptions,
  onOpenTravel
}) {
  const [activeTab, setActiveTab] = useState(
    initialTab === "COUPONS" || initialTab === "coupons"
      ? "coupons"
      : initialTab === "TODAY_DEALS" || initialTab === "today_deals" || initialTab === "DEALS" || initialTab === "deals"
      ? "today_deals"
      : initialTab === "smart_terminal" || initialTab === "terminal"
      ? "smart_terminal"
      : initialTab || "ecommerce"
  );

  useEffect(() => {
    if (initialTab) {
      if (initialTab === "COUPONS" || initialTab === "coupons") {
        setActiveTab("coupons");
      } else if (initialTab === "TODAY_DEALS" || initialTab === "today_deals" || initialTab === "DEALS" || initialTab === "deals") {
        setActiveTab("today_deals");
      } else if (initialTab === "smart_terminal" || initialTab === "terminal") {
        setActiveTab("smart_terminal");
      } else {
        setActiveTab(initialTab);
      }
    }
  }, [initialTab]); // "ecommerce" | "health" | "coupons" | "today_deals" | "smart_terminal"
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

  // Voice Search State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const stopVoiceSearch = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
  };

  const toggleVoiceSearch = async () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice search is not supported in this browser. Please use Google Chrome, Safari, or Microsoft Edge.");
      return;
    }

    if (isListening) {
      stopVoiceSearch();
      return;
    }

    // Explicitly request microphone permission on mobile so native dialog appears
    try {
      if (navigator?.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
      }
    } catch (permErr) {
      console.warn("[Voice Search] Microphone permission rejected:", permErr);
      alert("Microphone permission was not granted. Please enable microphone access in your browser settings to search by voice.");
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      const meta = getCountryMeta(country);
      recognition.lang = meta?.locale || "en-US";
      recognition.interimResults = true;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const results = event.results;
        if (!results || results.length === 0) return;
        const latest = results[results.length - 1];
        const transcript = latest[0]?.transcript || "";
        if (transcript) {
          setQuery(transcript);
        }
        if (latest.isFinal) {
          setIsListening(false);
          const finalSpoken = transcript.trim();
          if (finalSpoken.length > 1) {
            setTimeout(() => {
              if (isCoupons && onCouponSearch) {
                onCouponSearch(finalSpoken);
              } else if (onSubmit) {
                onSubmit(finalSpoken);
              }
            }, 300);
          }
        }
      };

      recognition.onerror = (event) => {
        console.warn("[Voice Search] Recognition error:", event?.error);
        if (event?.error === "not-allowed" || event?.error === "service-not-allowed") {
          alert("Microphone access was blocked. Please enable microphone permission in your browser settings.");
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn("[Voice Search] Failed to start:", err);
      setIsListening(false);
    }
  };

  const isUS = String(country).toUpperCase() !== "IN";
  const isHealth = activeTab === "health";
  const isCoupons = activeTab === "coupons";
  const isDeals = activeTab === "today_deals" || activeTab === "deals";
  const isSmartTerminal = activeTab === "smart_terminal" || activeTab === "terminal";

  const exampleQueries = isSmartTerminal
    ? (isUS ? SMART_TERMINAL_QUERIES_US : SMART_TERMINAL_QUERIES_IN)
    : isDeals
    ? (isUS ? DEALS_QUERIES_US : DEALS_QUERIES_IN)
    : isCoupons
    ? (isUS ? COUPON_QUERIES_US : COUPON_QUERIES_IN)
    : isHealth
    ? (isUS ? HEALTH_QUERIES_US : HEALTH_QUERIES_IN)
    : (isUS ? ECOM_QUERIES_US : ECOM_QUERIES_IN);

  const trendingList = isSmartTerminal
    ? (isUS ? QUICK_TRENDING_TERMINAL_US : QUICK_TRENDING_TERMINAL_IN)
    : isCoupons
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

  const lastSubmitTimeRef = useRef(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastSubmitTimeRef.current < 1500) return;
    lastSubmitTimeRef.current = now;

    const trimmedInput = query.trim();
    if (!trimmedInput) {
      // Don't accidentally submit an unwanted placeholder example
      return;
    }
    const finalQuery = trimmedInput;
    const lower = finalQuery.toLowerCase();

    // Record non-intrusive search telemetry (Strict: never tampers with finalQuery)
    const activeSearchMode = isCoupons ? "coupons" : isHealth ? "medicine" : "shopping";
    userJourneyTracker.recordSearch(finalQuery, activeSearchMode);

    // Auto-Routing: If user searches OTT / subscription platforms
    const isOttIntent = /\b(netflix|hotstar|prime\s*video|disney\+?|sonyliv|zee5|jiocinema|spotify|youtube\s*premium|times\s*prime|tata\s*play\s*binge|subscriptions?|ott)\b/i.test(lower);
    if (isOttIntent && onOpenSubscriptions) {
      onOpenSubscriptions(finalQuery);
      return;
    }

        // Auto-Routing: If user searches food/store promo codes while in Shopping/Pharmacy tab:
    const isCouponIntent = /\b(zomato|swiggy|zepto|blinkit|domino'?s|ubereats|doordash|instamart|promo\s*codes?|coupons?|voucher|discount\s*codes?)\b/i.test(lower);
    if (!isCoupons && isCouponIntent && onCouponSearch) {
      setActiveTab("coupons");
      onCouponSearch(finalQuery);
      return;
    }

    if (isCoupons && onCouponSearch) {
      onCouponSearch(finalQuery);
    } else if (isSmartTerminal) {
      onSubmit(finalQuery, false, false, true);
    } else {
      onSubmit(finalQuery);
    }
  };

  const handlePromptClick = (promptQuery) => {
    const now = Date.now();
    if (now - lastSubmitTimeRef.current < 1500) return;
    lastSubmitTimeRef.current = now;

    setQuery(promptQuery);
    const activeSearchMode = isSmartTerminal ? "terminal" : isCoupons ? "coupons" : isHealth ? "medicine" : "shopping";
    userJourneyTracker.recordSearch(promptQuery, activeSearchMode);

    if (isCoupons && onCouponSearch) {
      onCouponSearch(promptQuery);
    } else if (isSmartTerminal) {
      onSubmit(promptQuery, false, false, true);
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
    <div className="w-full max-w-3xl mx-auto px-4 pt-24 pb-1 sm:py-8 text-center flex flex-col justify-center items-center">
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
          {isSmartTerminal ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-emerald-50 border border-emerald-300 text-[10px] sm:text-[11px] font-bold text-emerald-800 mb-2 shadow-2xs">
              <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 animate-pulse fill-emerald-600" />
              <span>Next-Gen AI Smart Purchase Terminal • Money-Saver Desk</span>
            </div>
          ) : isDeals ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-rose-50 border border-rose-200 text-[10px] sm:text-[11px] font-bold text-rose-800 mb-2 shadow-2xs">
              <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-600 animate-pulse fill-rose-600" />
              <span>Next-Gen Real-Time Deals Radar</span>
            </div>
          ) : isCoupons ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-violet-50 border border-violet-200 text-[10px] sm:text-[11px] font-bold text-violet-800 mb-2 shadow-2xs">
              <Tag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-violet-600 animate-pulse" />
              <span>Next-Gen AI Coupon & Cart Scanner</span>
            </div>
          ) : isHealth ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] sm:text-[11px] font-bold text-emerald-800 mb-2 shadow-2xs">
              <HeartPulse className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 animate-pulse" />
              <span>Next-Gen AI Pharmacy & Health Engine</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] sm:text-[11px] font-bold text-brand-indigo mb-2 shadow-2xs">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-indigo animate-pulse" />
              <span>Next-Gen AI Shopping Search Engine</span>
            </div>
          )}

          {/* Dynamic Catchy Title with Mode-Specific Gradients */}
          <h1 className="text-xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            {isSmartTerminal ? (
              <>
                Paste Product Link, <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600">Save Max Cash.</span>
              </>
            ) : isDeals ? (
              <>
                Today&apos;s Verified Deals, <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-rose-500 to-violet-600">Instantly.</span>
              </>
            ) : isCoupons ? (
              <>
                Unlock Best Coupons, <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-fuchsia-600 to-amber-500">Max Savings.</span>
              </>
            ) : isHealth ? (
              <>
                Compare Medicine & <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">Health Stacks.</span>
              </>
            ) : (
              <>
                The AI Search Engine for <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-indigo via-purple-600 to-pink-600">Smart Shopping.</span>
              </>
            )}
          </h1>
          
          {/* Dynamic Subtitle */}
          <p className="text-[11px] sm:text-sm text-slate-500 font-medium mt-1 leading-snug">
            {isSmartTerminal
              ? "Paste any product URL to calculate store arbitrage + instant voucher savings + bank card perks."
              : isDeals
              ? "Automated live price drops and steep discounts detected across trusted merchants."
              : isCoupons
              ? "Live verified promo codes, instant cashback intelligence, and automated cart savings."
              : isHealth
              ? "Clinical pharmacopoeia insights, verified active compositions, and authentic wellness prices."
              : "Intelligent product discovery, verified specifications, and real-time value analysis tailored to your exact needs."}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* 2. Interactive Segmented Toggle: Smooth Scrollable Ribbon on Mobile */}
      <div className="flex items-center p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 mb-3 sm:mb-5 w-full max-w-xl sm:max-w-2xl shadow-inner overflow-x-auto no-scrollbar gap-1.5 scroll-smooth" suppressHydrationWarning>
        {/* Shopping Tab */}
        <button
          type="button"
          suppressHydrationWarning
          onClick={() => setActiveTab("ecommerce")}
          className={`shrink-0 flex items-center justify-center gap-1 sm:gap-1.5 py-1.5 px-3 sm:px-3.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
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
          suppressHydrationWarning
          onClick={() => setActiveTab("health")}
          className={`shrink-0 flex items-center justify-center gap-1 sm:gap-1.5 py-1.5 px-3 sm:px-3.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
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
          suppressHydrationWarning
          onClick={() => setActiveTab("coupons")}
          className={`shrink-0 flex items-center justify-center gap-1 sm:gap-1.5 py-1.5 px-3 sm:px-3.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "coupons"
              ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-sm shadow-violet-500/20"
              : "text-slate-500 hover:text-violet-700"
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Coupons</span>
        </button>

        {/* 4. Today's Deals Tab */}
        <button
          type="button"
          suppressHydrationWarning
          onClick={() => setActiveTab("today_deals")}
          className={`shrink-0 flex items-center justify-center gap-1 sm:gap-1.5 py-1.5 px-3 sm:px-3.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "today_deals" || activeTab === "deals"
              ? "bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-sm shadow-amber-500/20"
              : "text-slate-500 hover:text-rose-600"
          }`}
        >
          <Flame className="w-3.5 h-3.5 fill-current" />
          <span className="hidden sm:inline">Today&apos;s Deals</span>
          <span className="sm:hidden">Deals</span>
        </button>

        {/* 5. OTT & Subscriptions Tab */}
        <button
          type="button"
          suppressHydrationWarning
          onClick={() => {
            if (onOpenSubscriptions) {
              onOpenSubscriptions();
            }
          }}
          className="shrink-0 flex items-center justify-center gap-1 sm:gap-1.5 py-1.5 px-3 sm:px-3.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50"
        >
          <Tv className="w-3.5 h-3.5 text-indigo-500" />
          <span className="hidden sm:inline">OTT &amp; Subs</span>
          <span className="sm:hidden">OTT</span>
        </button>

        {/* 6. Travel & Stays Tab */}
        <button
          type="button"
          suppressHydrationWarning
          onClick={() => {
            if (onOpenTravel) {
              onOpenTravel();
            }
          }}
          className="shrink-0 flex items-center justify-center gap-1 sm:gap-1.5 py-1.5 px-3 sm:px-3.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/50"
        >
          <Plane className="w-3.5 h-3.5 text-emerald-500" />
          <span className="hidden sm:inline">Travel &amp; Stays</span>
          <span className="sm:hidden">Travel</span>
        </button>
      </div>

      {/* 2.5. HERO SPOTLIGHT CARD: AI CART SCANNER (Placed Prominently at Top in Coupons Mode) */}
      {isCoupons && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-xl mb-4 px-1"
        >
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
              className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-violet-700 via-indigo-700 to-purple-800 text-white shadow-md shadow-violet-500/20 hover:shadow-lg transition-all cursor-pointer flex items-center justify-between gap-3 relative overflow-hidden group active:scale-[0.99] border border-violet-400/30"
            >
              <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-3 min-w-0">
                {/* Camera Icon */}
                <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <Camera className="w-5 h-5 text-amber-300" />
                </div>

                {/* Title & Subtitle */}
                <div className="text-left min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="text-xs sm:text-sm font-black text-white leading-tight">
                      Snap &amp; Save Cart Scanner
                    </h4>
                    <span className="px-1.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-300/40 text-[9px] font-black text-amber-300 tracking-wider shrink-0">
                      AI VISION
                    </span>
                  </div>
                  <p className="text-[11px] text-violet-200/90 font-medium leading-tight mt-1 line-clamp-1">
                    Upload checkout cart screenshot to auto-apply biggest code
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="shrink-0">
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white text-violet-950 text-xs font-black shadow-xs group-hover:bg-amber-300 group-hover:text-slate-950 transition-colors">
                  <span>Upload</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white border-2 border-violet-500 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-violet-200 shrink-0 bg-slate-100">
                  <img
                    src={cartImagePreview}
                    alt="Cart preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    suppressHydrationWarning
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
                  suppressHydrationWarning
                  onClick={clearCartImage}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-all cursor-pointer"
                >
                  Change
                </button>
                <button
                  type="button"
                  suppressHydrationWarning
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
        </motion.div>
      )}

      {/* OR Divider for manual store search */}
      {isCoupons && (
        <div className="relative flex items-center justify-center w-full max-w-xl mb-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <span className="relative px-3 bg-white/80 text-[10px] sm:text-[11px] font-extrabold text-slate-400 uppercase tracking-widest backdrop-blur-xs">
            Or Search Stores &amp; Promo Codes Directly
          </span>
        </div>
      )}

      {/* 3. Sleek Modern Search Console with Dynamic Theme Glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="w-full max-w-xl mb-4 sm:mb-6"
      >
        <form 
          onSubmit={handleSubmit}
          suppressHydrationWarning
          className={`flex items-center gap-1.5 bg-white border rounded-2xl p-1.5 sm:p-2 shadow-lg shadow-slate-100/80 transition-all ${
            isSmartTerminal
              ? "border-emerald-300 hover:border-emerald-400 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/15"
              : isCoupons
              ? "border-violet-200 hover:border-violet-300 focus-within:border-violet-500 focus-within:ring-4 focus-within:ring-violet-500/15"
              : isHealth
              ? "border-emerald-200/90 hover:border-emerald-300 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/15"
              : "border-slate-200 hover:border-slate-300 focus-within:border-brand-indigo focus-within:ring-4 focus-within:ring-indigo-500/10"
          }`}
        >
          <div className="pl-2.5 shrink-0">
            {isSmartTerminal ? (
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 animate-pulse fill-emerald-600" />
            ) : isCoupons ? (
              <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-violet-600 animate-pulse" />
            ) : isHealth ? (
              <Pill className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 animate-pulse" />
            ) : (
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-brand-indigo" />
            )}
          </div>

          <input
            type="text"
            suppressHydrationWarning
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              placeholder || 
              (isSmartTerminal
                ? "Paste any product link or URL..."
                : isDeals
                ? "Search deals across all categories..."
                : isCoupons 
                ? "Search any store, brand, or discount coupon..." 
                : isHealth 
                ? "Search medicine, supplement or paste link..." 
                : "Search product or paste any web link...")
            }
            className="w-full bg-transparent text-slate-800 text-xs sm:text-sm font-medium focus:outline-hidden px-1 placeholder:text-slate-400"
          />

          {query && (
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setQuery("")}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Voice Search Button */}
          <button
            type="button"
            suppressHydrationWarning
            onClick={toggleVoiceSearch}
            title={isListening ? "Listening... Click to stop" : "Search with Voice"}
            className={`p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0 ${
              isListening
                ? "bg-rose-600 text-white animate-pulse shadow-md shadow-rose-500/30 ring-2 ring-rose-300"
                : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Mic className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${isListening ? "animate-bounce text-white" : ""}`} />
          </button>

          {/* AI Guide Me Button (Pre-Search Concierge) */}
          {onOpenConcierge && !isCoupons && !isHealth && !isDeals && !isSmartTerminal && (
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => onOpenConcierge(query.trim())}
              title="Need advice? Chat with Ask AI before searching"
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-purple-500/20 transition-all active:scale-95 cursor-pointer shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span className="hidden sm:inline">Ask AI</span>
              <span className="sm:hidden">AI</span>
            </button>
          )}

          <button
            type="submit"
            suppressHydrationWarning
            className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 cursor-pointer shrink-0 ${
              isSmartTerminal
                ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:opacity-95 shadow-emerald-500/25 flex items-center gap-1.5"
                : isDeals
                ? "bg-gradient-to-r from-amber-500 to-rose-500 hover:opacity-95 shadow-amber-500/20"
                : isCoupons
                ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-95 shadow-violet-500/20"
                : isHealth
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 shadow-emerald-500/20"
                : "bg-gradient-to-r from-brand-indigo to-brand-violet hover:opacity-95 shadow-indigo-500/20"
            }`}
          >
            {isSmartTerminal ? (<><span className="hidden sm:inline">Calculate </span>Savings</>) : isDeals ? "Find Deals" : isCoupons ? "Find Codes" : "Search"}
          </button>
        </form>

        {/* Active Voice Listening Status Pill */}
        {isListening && (
          <div className="mt-2.5 flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold shadow-xs animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
            <span>Listening... बोलिए (Speak now)</span>
            <button
              type="button"
              onClick={stopVoiceSearch}
              className="ml-2 text-[10px] uppercase font-black text-rose-600 hover:text-rose-900 underline cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Quick Trending Chips: Sleek Universal Single-Row Bar */}
        <div className="w-full flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-0.5 justify-start sm:justify-center mt-2.5 sm:mt-3" suppressHydrationWarning>
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span>{isSmartTerminal ? "Samples:" : "Trending:"}</span>
          </span>
          {trendingList.map((item, idx) => (
            <button
              key={idx}
              type="button"
              suppressHydrationWarning
              onClick={() => handlePromptClick(item.query)}
              className="px-2.5 sm:px-3 py-1 rounded-xl text-[11px] sm:text-xs font-semibold border border-slate-200/90 bg-white/95 hover:bg-slate-50 text-slate-700 transition-all cursor-pointer active:scale-95 shadow-2xs shrink-0 whitespace-nowrap hover:border-slate-300"
            >
              {item.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* 3.5. CATEGORY DEALS EXPLORER (Deals Mode) */}
      {isDeals && (
        <div className="w-full mt-2">
          <CategoryDealsExplorer
            onSelectCategory={(catId) => {
              if (onSelectCategoryDeal) {
                onSelectCategoryDeal(catId);
              }
            }}
            onCustomDealSearch={(q) => handlePromptClick(q)}
          />
        </div>
      )}

      {/* 4. FEATURED STORES CAROUSEL (Coupons Mode) */}
      {isCoupons && (
        <div className="w-full flex flex-col items-center">
          {/* Interactive Store Cards Carousel */}
          <StoreCardCarousel
            onSelectStore={(storeName) => {
              if (onCouponSearch) {
                onCouponSearch(storeName);
              } else {
                handlePromptClick(storeName);
              }
            }}
          />
        </div>
      )}

    </div>
  );
}
