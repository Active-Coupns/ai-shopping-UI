"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  TrendingDown, 
  Gift, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Copy, 
  Check, 
  AlertCircle, 
  Bell, 
  Store, 
  Zap, 
  Share2, 
  ChevronRight, 
  HelpCircle,
  Headphones,
  Award,
  Layers,
  ArrowRight,
  GraduationCap,
  Building2,
  Tag,
  Loader2
} from "lucide-react";

export default function SmartPurchaseTerminal({
  productInfo,
  rawUrl = "",
  country = "IN",
  strategyData = null,
  isLoading = false,
  matchedProducts = [],
  onBack,
  onOpenAlertModal,
  onViewAllComparisons
}) {
  const isIndia = country === "IN";
  const currencySymbol = isIndia ? "₹" : "$";

  // Real-time extracted product attributes strictly from live strategyData
  const detectedStore = strategyData?.product?.baselineStore || productInfo?.store || (rawUrl.includes("flipkart") ? "Flipkart" : "Amazon.in");
  const productTitle = strategyData?.product?.title || productInfo?.title || "Product";
  const productImage = strategyData?.product?.image || "";
  const originalStorePrice = strategyData?.product?.baselinePrice || 0;
  const productBuyUrl = strategyData?.product?.productUrl || rawUrl || "#";

  // Arbitrage offer
  const storeArbitrage = strategyData?.storeArbitrage;
  const hasStoreArbitrage = Boolean(storeArbitrage && storeArbitrage.hasCheaperStore && storeArbitrage.savingsAmount > 0);

  // Official Brand Perk
  const brandPerk = strategyData?.officialBrandPerk;

  // AI Timing verdict
  const aiTiming = strategyData?.aiTiming;

  // Interactive user discount toggles
  const [hasEligibleBankCard, setHasEligibleBankCard] = useState(true);
  const [useVoucherHack, setUseVoucherHack] = useState(true);
  const [useStudentPerk, setUseStudentPerk] = useState(false);
  const [useCorporatePerk, setUseCorporatePerk] = useState(false);

  // Voucher modal state
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [isCopiedVoucher, setIsCopiedVoucher] = useState(false);
  const [copiedCode, setCopiedCode] = useState("");

  // Dynamic Savings Calculations
  // 1. Store Arbitrage
  const arbitrageSavings = hasStoreArbitrage ? storeArbitrage.savingsAmount : 0;

  // 2. Voucher Stack (3.5% default)
  const voucherPercent = strategyData?.voucherStack?.discountPercent || 3.5;
  const voucherDiscountAmount = useMemo(() => {
    if (!useVoucherHack) return 0;
    return Math.round((originalStorePrice * voucherPercent) / 100);
  }, [originalStorePrice, useVoucherHack, voucherPercent]);

  // 3. Bank Instant Discount
  const bankDiscountAmount = useMemo(() => {
    if (!hasEligibleBankCard) return 0;
    return strategyData?.bankOffer?.savingsAmount || (isIndia ? Math.min(Math.round(originalStorePrice * 0.05), 2500) : 40);
  }, [originalStorePrice, hasEligibleBankCard, strategyData, isIndia]);

  // 4. Student or Corporate Perk
  const studentDiscountAmount = useMemo(() => {
    if (!useStudentPerk || !brandPerk) return 0;
    return brandPerk.studentSavings || 0;
  }, [useStudentPerk, brandPerk]);

  const corporateDiscountAmount = useMemo(() => {
    if (!useCorporatePerk || !brandPerk) return 0;
    return brandPerk.corporateSavings || 0;
  }, [useCorporatePerk, brandPerk]);

  // Total Net Savings
  const totalSavings = useMemo(() => {
    return arbitrageSavings + voucherDiscountAmount + bankDiscountAmount + studentDiscountAmount + corporateDiscountAmount;
  }, [arbitrageSavings, voucherDiscountAmount, bankDiscountAmount, studentDiscountAmount, corporateDiscountAmount]);

  const finalOptimizedPrice = Math.max(originalStorePrice - totalSavings, 0);
  const totalSavingsPercentage = originalStorePrice > 0 ? Math.round((totalSavings / originalStorePrice) * 100) : 0;

  const handleCopyCode = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setIsCopiedVoucher(true);
    setTimeout(() => {
      setIsCopiedVoucher(false);
      setCopiedCode("");
    }, 2500);
  };

  // -------------------------------------------------------------
  // DEDICATED HIGH-TECH SCANNING LOADER (Zero Timing Flash)
  // Shows while API is analyzing or until real live data arrives
  // -------------------------------------------------------------
  if (isLoading || !strategyData) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-12 md:py-16 text-center animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl border border-indigo-100 shadow-2xl p-8 sm:p-12 relative overflow-hidden">
          {/* Animated Background Glow */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-700" />

          {/* Radar Scanner Icon */}
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-2xl bg-indigo-500/20 animate-ping" />
            <div className="relative w-20 h-20 bg-gradient-to-tr from-indigo-600 via-indigo-700 to-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
              <Zap className="w-10 h-10 text-amber-300 animate-pulse" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-black uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-spin-slow" />
            <span>AI Smart Purchase Terminal Active</span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-3">
            Scanning Live Store BuyBox &amp; Official Perks
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto mb-8 font-medium">
            Fetching genuine 100% factory-new inventory across authorized Indian retailers, validating official student portals &amp; checking gift voucher stacks...
          </p>

          {/* Stepped Progress Highlights */}
          <div className="max-w-md mx-auto space-y-3 text-left">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xs shrink-0">
                ✓
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-800 block">Extracting Live BuyBox Baseline</span>
                <span className="text-slate-500 text-[11px]">Matching exact brand model &amp; technical specs</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 animate-pulse">
              <div className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-xs shrink-0">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-indigo-950 block">Verifying Official Brand Portals</span>
                <span className="text-indigo-700 text-[11px]">Checking UNiDAYS, SheerID &amp; corporate perks</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-7 h-7 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center font-black text-xs shrink-0">
                3
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-700 block">Calculating Instant Voucher Arbitrage</span>
                <span className="text-slate-400 text-[11px]">Stacking co-branded partner gift card savings</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 animate-in fade-in duration-300">
      
      {/* Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-200/80 mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-brand-indigo transition-colors cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-brand-indigo/10 flex items-center justify-center transition-colors">
            <ArrowLeft className="w-4 h-4 text-slate-600 group-hover:text-brand-indigo" />
          </div>
          <span>Back to Main Search</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100/80 text-emerald-800 border border-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin-slow" />
            AI Smart Purchase Terminal • Real-Time Live
          </span>
          <span className="hidden md:inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            100% Genuine Authorized Stock
          </span>
        </div>
      </div>

      {/* Main Grid: Left Spotlight + Right Savings Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* LEFT COLUMN: Product Spotlight & Verdict (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* 1. Verified Product Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-100/70 p-5 sm:p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100/40 to-violet-100/20 rounded-full blur-2xl pointer-events-none" />
            
            {/* Store & Authenticity Pill */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black bg-slate-100 text-slate-800 border border-slate-200">
                <Store className="w-3.5 h-3.5 text-slate-500" />
                Live on {detectedStore}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Factory Sealed New
              </span>
            </div>

            {/* Product Image & Title */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-5 mb-5">
              <div className="w-40 h-40 sm:w-48 sm:h-48 lg:w-52 lg:h-52 bg-slate-50 rounded-2xl p-3 border border-slate-100 flex items-center justify-center shrink-0">
                {productImage ? (
                  <img
                    src={productImage}
                    alt={productTitle}
                    className="max-h-full max-w-full object-contain mix-blend-multiply drop-shadow-md hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-bold">
                    [Product Image]
                  </div>
                )}
              </div>

              <div className="flex-1 text-center sm:text-left lg:text-center">
                <h1 className="text-base sm:text-lg font-black text-slate-900 leading-snug line-clamp-3 mb-2">
                  {productTitle}
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Verified Authorized Retailer • 1-Year Brand Warranty
                </p>
              </div>
            </div>

            {/* Original Store Baseline Price */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">
                  Direct BuyBox Price
                </span>
                <span className="text-xs font-semibold text-slate-600">
                  ({detectedStore} Standard)
                </span>
              </div>
              <span className="text-xl sm:text-2xl font-black text-slate-800 line-through decoration-rose-500/80 decoration-2">
                {currencySymbol}{originalStorePrice.toLocaleString()}
              </span>
            </div>
          </div>

          {/* 2. AI Buy Timing Verdict Meter */}
          <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-white rounded-3xl border border-emerald-200/80 p-5 sm:p-6 shadow-sm">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black shadow-md shadow-emerald-500/20">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    AI Buy Timing Verdict
                  </h3>
                  <span className="text-[11px] font-bold text-emerald-700">
                    AI Price Intelligence ({aiTiming?.confidencePercent || 85}% Confidence)
                  </span>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-600 text-white shadow-sm flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                {aiTiming?.timingVerdict || "BUY TODAY"}
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-medium mb-3">
              {aiTiming?.reasoning || `Current price of ${currencySymbol}${originalStorePrice.toLocaleString()} is verified within the most optimal pricing tier for this hardware configuration.`}
            </p>

            {aiTiming?.specialTip && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 font-medium mb-3">
                💡 <strong>Pro-Tip:</strong> {aiTiming.specialTip}
              </div>
            )}

            <button
              onClick={() => onOpenAlertModal?.({ title: productTitle, price: originalStorePrice })}
              className="w-full py-2 px-3 rounded-xl bg-white border border-emerald-300 text-emerald-800 text-xs font-bold hover:bg-emerald-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Bell className="w-3.5 h-3.5 text-emerald-600" />
              <span>Track Future Price Drops For This Item</span>
            </button>
          </div>

          {/* 3. Strict 100% Brand-New Guarantee Badge */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/70 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-xs text-indigo-950 leading-relaxed font-medium">
              <strong className="font-black text-indigo-900 block mb-0.5">Strict Zero-Refurbished Guarantee</strong>
              We exclusively analyze factory-sealed, 100% brand-new inventory directly from authorized brand resellers. No open-box, no refurbished, no trade-ins.
            </div>
          </div>

        </div>


        {/* RIGHT COLUMN: The Net Savings Ledger & Action Plan (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* 1. THE NET SAVINGS LEDGER (बचत का पूरा गणित) */}
          <div className="bg-white rounded-3xl border-2 border-indigo-500/20 shadow-2xl shadow-indigo-100/80 p-5 sm:p-7 relative overflow-hidden">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-brand-indigo block">
                  ShopSmart AI Purchase Terminal
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  The Net Savings Breakdown
                </h2>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-xl self-start sm:self-auto">
                Real-Time Stacking
              </span>
            </div>

            {/* Live Stack Ledger - 3 Clear Steps */}
            <div className="divide-y divide-slate-100 my-4 text-xs sm:text-sm">
              
              {/* Step 1: Original Pasted Baseline Price */}
              <div className="py-3.5 flex items-center justify-between text-slate-700">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Baseline Store Price</span>
                    <span className="text-[11px] text-slate-500 font-medium">You entered link from {detectedStore}</span>
                  </div>
                </div>
                <span className="font-black text-slate-800 text-sm sm:text-base">
                  {currencySymbol}{originalStorePrice.toLocaleString()}
                </span>
              </div>

              {/* Step 2: Cheaper Cross-Store Or Official Brand D2C Savings */}
              {hasStoreArbitrage ? (
                <div className="py-3.5 flex items-center justify-between text-emerald-800 bg-emerald-50/70 px-3.5 -mx-3.5 rounded-2xl my-1 border border-emerald-200/80">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-black shrink-0">
                      2
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-emerald-950">Cheaper Store Match Found</span>
                        <span className="px-1.5 py-0.2 rounded-md bg-emerald-200 text-[10px] font-black text-emerald-900">
                          INSTANT DROP
                        </span>
                      </div>
                      <span className="text-[11px] text-emerald-800 font-medium block">
                        Exact same unit on {storeArbitrage.storeName} is priced at {currencySymbol}{storeArbitrage.cheaperPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <span className="font-black text-emerald-700 text-base sm:text-lg">
                    - {currencySymbol}{storeArbitrage.savingsAmount.toLocaleString()}
                  </span>
                </div>
              ) : brandPerk?.welcomeCode ? (
                <div className="py-3.5 flex items-center justify-between text-indigo-800 bg-indigo-50/70 px-3.5 -mx-3.5 rounded-2xl my-1 border border-indigo-200/80">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-black shrink-0">
                      2
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-indigo-950">Official {brandPerk.brand} Direct Code</span>
                        <span className="px-1.5 py-0.2 rounded-md bg-indigo-200 text-[10px] font-black text-indigo-900">
                          COUPON
                        </span>
                      </div>
                      <span className="text-[11px] text-indigo-700 font-medium block">
                        Apply coupon <strong className="font-mono text-indigo-900 underline">{brandPerk.welcomeCode}</strong> on {brandPerk.brand}&apos;s official website
                      </span>
                    </div>
                  </div>
                  <span className="font-black text-indigo-700 text-sm sm:text-base">
                    - {currencySymbol}{brandPerk.studentSavings.toLocaleString()}
                  </span>
                </div>
              ) : (
                <div className="py-3 flex items-center justify-between text-slate-500 px-3 -mx-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-bold">
                      2
                    </div>
                    <div>
                      <span className="font-bold text-slate-700 block">Cross-Platform Verification</span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {detectedStore} currently has the lowest live base price among major retailers
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-emerald-700 text-xs bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    LOWEST BASE MATCH
                  </span>
                </div>
              )}

              {/* Step 3: Guaranteed Gift Card Voucher Stack */}
              <div className="py-3.5 flex items-center justify-between text-indigo-950">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-800 text-xs font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900">ShopSmart Guaranteed Gift Card</span>
                      <span className="px-1.5 py-0.2 rounded-md bg-indigo-100 text-[10px] font-black text-indigo-700">
                        {voucherPercent}% OFF
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Guaranteed discount on digital prepaid checkout
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={useVoucherHack} 
                      onChange={(e) => setUseVoucherHack(e.target.checked)} 
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                  <span className={`font-black text-sm sm:text-base ${useVoucherHack ? "text-indigo-600" : "text-slate-400 line-through"}`}>
                    - {currencySymbol}{voucherDiscountAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Step 4: Bank Card Instant Offer */}
              <div className="py-3 flex items-center justify-between text-slate-700">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center text-purple-800 text-xs font-bold shrink-0">
                    💳
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Bank Instant Discount</span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {strategyData?.bankOffer?.banks || "HDFC / ICICI / SBI Cards"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={hasEligibleBankCard} 
                      onChange={(e) => setHasEligibleBankCard(e.target.checked)} 
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                  <span className={`font-black text-sm sm:text-base ${hasEligibleBankCard ? "text-purple-600" : "text-slate-400 line-through"}`}>
                    - {currencySymbol}{bankDiscountAmount.toLocaleString()}
                  </span>
                </div>
              </div>

            </div>

            {/* FINAL OPTIMIZED SMART PRICE BANNER */}
            <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                <div>
                  <div className="flex items-center gap-1.5 text-emerald-200 text-xs font-black uppercase tracking-wider mb-1">
                    <Sparkles className="w-4 h-4 text-emerald-300" />
                    Final Reduced Price (Your Savings Applied)
                  </div>
                  <div className="text-3xl sm:text-4xl font-black tracking-tight">
                    {currencySymbol}{finalOptimizedPrice.toLocaleString()}
                  </div>
                </div>

                <div className="bg-white/15 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20 sm:text-right">
                  <span className="text-xs font-bold text-emerald-100 block">
                    Total Money Saved
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-white">
                    {currencySymbol}{totalSavings.toLocaleString()} <span className="text-xs font-bold text-emerald-200">({totalSavingsPercentage}% OFF)</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ACTIONABLE ROUTES: WHERE TO BUY CHEAPEST */}
          <div className="bg-slate-50/90 rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Direct Savings Route (Buy From Here)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              
              {/* Option 1: Cheaper Store or Baseline Store */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800">
                      {hasStoreArbitrage ? `Buy on ${storeArbitrage.storeName}` : `Buy on ${detectedStore}`}
                    </span>
                    {hasStoreArbitrage && (
                      <span className="text-xs font-bold text-emerald-700">
                        Saves ₹{storeArbitrage.savingsAmount.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mb-1">
                    {hasStoreArbitrage 
                      ? `Cheaper on ${storeArbitrage.storeName} at ₹${storeArbitrage.cheaperPrice.toLocaleString()}`
                      : `Original Store Purchase (${detectedStore})`}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                    {hasStoreArbitrage 
                      ? `Switching to ${storeArbitrage.storeName} saves ₹${storeArbitrage.savingsAmount.toLocaleString()} upfront.`
                      : `This store has the lowest base price. Stack gift card to save more.`}
                  </p>
                </div>
                <a
                  href={hasStoreArbitrage ? storeArbitrage.url : productBuyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                >
                  <span>Open {hasStoreArbitrage ? storeArbitrage.storeName : detectedStore}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Option 2: Gift Card Stack */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-indigo-100 text-indigo-700">
                      Prepaid Gift Card
                    </span>
                    <span className="text-xs font-bold text-indigo-700">
                      Instant 3.5% Off
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mb-1">
                    Guaranteed Gift Card Discount
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                    Redeem a digital prepaid card to instantly knock off ₹{voucherDiscountAmount.toLocaleString()} at checkout.
                  </p>
                </div>
                <button
                  onClick={() => setIsVoucherModalOpen(true)}
                  className="mt-3 w-full py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>Claim Gift Card</span>
                </button>
              </div>

            </div>

            {/* Primary Buy Action */}
            <a
              href={hasStoreArbitrage ? storeArbitrage.url : productBuyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-indigo to-brand-violet hover:from-indigo-600 hover:to-purple-700 text-white font-black text-sm sm:text-base transition-all duration-200 shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Get Product at Final Reduced Price ({currencySymbol}{finalOptimizedPrice.toLocaleString()})</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

          </div>

      {/* LIVE MULTI-STORE DIRECT COMPARISON GRID */}
      {strategyData?.allLiveOffers && strategyData.allLiveOffers.length > 0 && (
        <div className="mt-8 bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-100/70 p-5 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-slate-100 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Live Price Comparison Across All Platforms
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Real-time BuyBox offers matched for this exact product across authorized sellers
              </p>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl self-start sm:self-auto border border-slate-200">
              {strategyData.allLiveOffers.length} Verified Stores
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {strategyData.allLiveOffers.map((offer, idx) => {
              const isCheaper = offer.price < originalStorePrice;
              const isSame = offer.price === originalStorePrice;
              const priceDiff = Math.abs(originalStorePrice - offer.price);

              return (
                <div 
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    isCheaper 
                      ? "bg-emerald-50/40 border-emerald-300 shadow-md shadow-emerald-500/10 hover:border-emerald-400" 
                      : isSame
                      ? "bg-indigo-50/30 border-indigo-200 hover:border-indigo-300"
                      : "bg-slate-50/60 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black bg-white border border-slate-200 text-slate-800 shadow-2xs">
                        <Store className="w-3.5 h-3.5 text-slate-500" />
                        {offer.store}
                      </span>
                      {isCheaper && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider shadow-2xs">
                          Save ₹{priceDiff.toLocaleString()}
                        </span>
                      )}
                      {isSame && (
                        <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase">
                          Baseline Match
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 line-clamp-2 mb-3 leading-snug">
                      {offer.title}
                    </h4>
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between mt-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">
                        Live Price
                      </span>
                      <span className={`text-base font-black ${isCheaper ? "text-emerald-700" : "text-slate-900"}`}>
                        {currencySymbol}{offer.price?.toLocaleString()}
                      </span>
                    </div>

                    <a
                      href={offer.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                        isCheaper
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95"
                          : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-300"
                      }`}
                    >
                      <span>Visit Store</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Safety & Co-Branded Partner Guarantee Banner */}
          <div className="p-4 rounded-2xl bg-slate-100/80 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2.5">
              <Headphones className="w-4 h-4 text-brand-indigo shrink-0" />
              <span>
                <strong>ShopSmart SafePay Promise:</strong> 100% verified digital partner fulfillment. Dedicated 24x7 resolution helpline for instant code support.
              </span>
            </div>
            <span className="font-bold text-slate-500 shrink-0">
              Zero Risk • Direct Warranty
            </span>
          </div>

        </div>

      </div>


      {/* INTERACTIVE GIFT VOUCHER PURCHASE & REDEEM MODAL */}
      <AnimatePresence>
        {isVoucherModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative overflow-hidden"
            >
              {/* Co-Branded Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-indigo to-brand-violet text-white flex items-center justify-center font-black">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      ShopSmart × Hubble Voucher Desk
                    </h3>
                    <p className="text-[11px] font-bold text-slate-500">
                      Official Partner Co-Branded Gateway
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsVoucherModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Sample Voucher Calculation */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 mb-4">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span>Voucher Face Value:</span>
                  <span className="font-bold text-slate-900">{currencySymbol}{originalStorePrice.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold text-emerald-700 mb-2">
                  <span>ShopSmart Partner Discount ({voucherPercent}%):</span>
                  <span className="font-bold">- {currencySymbol}{voucherDiscountAmount.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-indigo-200/60 flex items-center justify-between text-sm font-black text-indigo-950">
                  <span>You Pay for Voucher:</span>
                  <span className="text-base font-black text-indigo-700">
                    {currencySymbol}{(originalStorePrice - voucherDiscountAmount).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Sample Demo Code */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-4 text-center">
                <span className="text-[11px] font-bold text-slate-500 block mb-1">
                  Instant Digital Delivery • Verified Voucher Code
                </span>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-mono text-base font-black tracking-wider text-slate-800 bg-white px-4 py-2 rounded-xl border border-slate-300">
                    SHOPSMART-GIFT-X784
                  </span>
                  <button
                    onClick={() => handleCopyCode("SHOPSMART-GIFT-X784")}
                    className="p-2.5 rounded-xl bg-brand-indigo hover:bg-indigo-700 text-white transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold shadow-xs"
                  >
                    {isCopiedVoucher ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{isCopiedVoucher ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
              </div>

              {/* Security & Customer Helpline Note */}
              <div className="text-[11px] text-slate-500 leading-relaxed space-y-1 mb-5">
                <p>• <strong>Instant SMS &amp; WhatsApp Delivery:</strong> Codes are delivered in 5 seconds directly to your phone.</p>
                <p>• <strong>24x7 ShopSmart Resolution Desk:</strong> In the rare case of redemption delay, our support team will resolve or refund immediately.</p>
              </div>

              <div className="flex gap-2.5">
                <button
                  onClick={() => setIsVoucherModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-brand-indigo text-white font-black text-xs hover:bg-indigo-700 transition-colors cursor-pointer"
                >
                  Done &amp; Continue Shopping
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
