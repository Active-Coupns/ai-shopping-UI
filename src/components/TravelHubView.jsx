"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plane, 
  Hotel, 
  Ticket, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  ArrowLeftRight, 
  Copy, 
  Check, 
  ExternalLink, 
  AlertCircle, 
  Luggage, 
  CreditCard, 
  Smartphone, 
  Percent, 
  Calendar, 
  CheckCircle2, 
  ChevronRight,
  Info,
  HelpCircle,
  Award,
  Search,
  Tag,
  Filter,
  Loader2,
  Zap,
  Compass
} from "lucide-react";
import { SUPPORTED_COUNTRIES } from "@/lib/countryConfig";

function getBrandInitials(platformId, platformName) {
  if (platformId === "indigo") return "6E";
  if (platformId === "airindia") return "AI";
  if (platformId?.includes("mmt")) return "MMT";
  if (platformId === "easemytrip") return "EMT";
  if (platformId === "akasa") return "AK";
  if (platformId === "spicejet") return "SG";
  if (platformId?.includes("booking")) return "BK";
  if (platformId === "agoda") return "AG";
  if (platformId?.includes("taj")) return "TAJ";
  if (platformId === "oyo") return "OYO";
  if (platformId === "marriott") return "MAR";
  if (platformId === "treebo") return "TRB";
  if (platformId === "bookmyshow") return "BMS";
  if (platformId === "district") return "DIS";
  if (platformId === "paytm_insider") return "INS";
  if (platformId === "pvr_inox") return "PVR";
  if (platformId === "delta") return "DL";
  if (platformId === "united") return "UA";
  if (platformId === "american") return "AA";
  if (platformId === "southwest") return "WN";
  if (platformId?.includes("expedia")) return "EXP";
  if (platformId === "ba") return "BA";
  if (platformId?.includes("easyjet")) return "EZY";
  if (platformId?.includes("premierinn")) return "PI";
  if (platformId?.includes("travelodge")) return "TL";
  if (platformId?.includes("ticketmaster")) return "TM";
  if (platformId?.includes("aircanada")) return "AC";
  if (platformId?.includes("qantas")) return "QF";
  if (platformId?.includes("emirates")) return "EK";
  return (platformName || "DEAL").slice(0, 3).toUpperCase();
}

export default function TravelHubView({
  country = "IN",
  onOpenAdvisor
}) {
  const [activeTab, setActiveTab] = useState("flights"); // "flights" | "hotels" | "events"
  const [copiedCode, setCopiedCode] = useState(null);
  const [dealTypeFilter, setDealTypeFilter] = useState("all");
  const [dealSearchQuery, setDealSearchQuery] = useState("");

  // Live Database Deals State with In-Memory Client Cache
  const [dbDeals, setDbDeals] = useState([]);
  const [dealsCache, setDealsCache] = useState({});
  const [isLoadingDeals, setIsLoadingDeals] = useState(false);

  useEffect(() => {
    if (dealsCache[country]) {
      setDbDeals(dealsCache[country]);
      return;
    }
    let isMounted = true;
    setIsLoadingDeals(true);
    fetch(`/api/travel/deals?country=${country}&category=all`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && Array.isArray(data.deals)) {
          setDealsCache((prev) => ({ ...prev, [country]: data.deals }));
          setDbDeals(data.deals);
        }
      })
      .catch((err) => console.error("Error fetching travel deals:", err))
      .finally(() => {
        if (isMounted) setIsLoadingDeals(false);
      });
    return () => {
      isMounted = false;
    };
  }, [country]);

  // On-demand discovery states
  const [onDemandDeals, setOnDemandDeals] = useState([]);
  const [isOnDemandScanning, setIsOnDemandScanning] = useState(false);
  const [scanStep, setScanStep] = useState("");
  const [onDemandError, setOnDemandError] = useState(null);

  // Entity Gatekeeper & Debounce states
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [verifiedEntity, setVerifiedEntity] = useState(null);
  const [isVerifyingEntity, setIsVerifyingEntity] = useState(false);

  // 450ms debounce on search input to prevent keystroke spamming
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(dealSearchQuery.trim());
    }, 450);
    return () => clearTimeout(timer);
  }, [dealSearchQuery]);

  // Entity verification trigger when debounced query pauses and has no local match
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 3) {
      setVerifiedEntity(null);
      setIsVerifyingEntity(false);
      return;
    }

    const localDeals = dbDeals.filter((d) => activeTab === "all" || d.category === activeTab);
    const exactLocalMatch = localDeals.some(
      (d) =>
        d.platformName.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        d.title.toLowerCase().includes(debouncedQuery.toLowerCase())
    );

    if (exactLocalMatch) {
      setVerifiedEntity(null);
      setIsVerifyingEntity(false);
      return;
    }

    let cancelled = false;
    setIsVerifyingEntity(true);

    fetch("/api/travel/verify-entity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: debouncedQuery,
        category: activeTab,
        country
      })
    })
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && data.success) {
          setVerifiedEntity(data);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsVerifyingEntity(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, activeTab, country]);

  // Auto-reset filters and search when country or tab changes to prevent empty states
  useEffect(() => {
    setDealTypeFilter("all");
    setDealSearchQuery("");
    setOnDemandError(null);
    setVerifiedEntity(null);
  }, [country, activeTab]);

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setDealTypeFilter("all");
    setDealSearchQuery("");
    setOnDemandError(null);
    setVerifiedEntity(null);
  };

  const handleTriggerOnDemand = async (brandQuery, targetCategory) => {
    const cleanBrand = (brandQuery || "").trim();
    if (!cleanBrand || cleanBrand.length < 2) return;

    setIsOnDemandScanning(true);
    setOnDemandError(null);
    setScanStep("Initializing ShopSmart AI Live Radar...");

    const t1 = setTimeout(() => {
      setScanStep(`Scanning official ${cleanBrand} booking channels...`);
    }, 1200);

    const t2 = setTimeout(() => {
      setScanStep("Analyzing verified promo codes & bank privileges...");
    }, 2800);

    try {
      const res = await fetch("/api/travel/on-demand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName: cleanBrand,
          category: targetCategory || activeTab,
          country
        })
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.deals) && data.deals.length > 0) {
        const tagged = data.deals.map(d => ({ ...d, country }));
        setOnDemandDeals(prev => [
          ...tagged,
          ...prev.filter(p => p.platformName.toLowerCase() !== cleanBrand.toLowerCase())
        ]);
      } else {
        setOnDemandError(data.error || "No active promo codes found right now.");
      }
    } catch (err) {
      setOnDemandError("Connection timed out. Please try again.");
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
      setIsOnDemandScanning(false);
      setScanStep("");
    }
  };

  const isIN = country === "IN";
  const isUS = country === "US";
  const isUK = country === "GB" || country === "UK";
  const isCA = country === "CA";
  const isAU = country === "AU";
  const isAE = country === "AE";

  const currencySymbol = isAE ? "AED " : isAU ? "A$" : isCA ? "C$" : isUK ? "£" : isUS ? "$" : "₹";
  const currentCountryMeta = SUPPORTED_COUNTRIES[country] || SUPPORTED_COUNTRIES.IN;

  const handleCopy = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const renderDealsSection = (category, sectionTitle, sectionSubtitle) => {
    const localDeals = dbDeals.filter((d) => category === "all" || d.category === category);
    const categoryOnDemand = onDemandDeals.filter(
      (d) => d.category === category && (!d.country || d.country === country)
    );
    const allCategoryDeals = [...categoryOnDemand, ...localDeals];

    const filteredBase = dealTypeFilter === "all"
      ? allCategoryDeals
      : allCategoryDeals.filter(d => d.dealType === dealTypeFilter);

    const deals = filteredBase.filter((deal) => {
      return !dealSearchQuery || 
        deal.title.toLowerCase().includes(dealSearchQuery.toLowerCase()) ||
        deal.platformName.toLowerCase().includes(dealSearchQuery.toLowerCase()) ||
        deal.promoCode.toLowerCase().includes(dealSearchQuery.toLowerCase()) ||
        deal.badge.toLowerCase().includes(dealSearchQuery.toLowerCase());
    });

    const filterCounts = {
      all: allCategoryDeals.length,
      PROMO_CODE: allCategoryDeals.filter(d => d.dealType === "PROMO_CODE").length,
      BANK_OFFER: allCategoryDeals.filter(d => d.dealType === "BANK_OFFER").length,
      CATEGORY_PERK: allCategoryDeals.filter(d => d.dealType === "CATEGORY_PERK").length,
      APP_EXCLUSIVE: allCategoryDeals.filter(d => d.dealType === "APP_EXCLUSIVE").length,
    };

    return (
      <div className="space-y-4 pt-2">
        {/* Section Header with Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                {sectionTitle}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-black shrink-0">
                {deals.length} Active
              </span>
              {categoryOnDemand.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-black shrink-0">
                  ⚡ {categoryOnDemand.length} On-Demand Added
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {sectionSubtitle}
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={dealSearchQuery}
              onChange={(e) => setDealSearchQuery(e.target.value)}
              placeholder="Search or type brand (e.g. Air India, Hyatt)..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 placeholder-slate-400"
            />
            {dealSearchQuery && (
              <button
                type="button"
                onClick={() => setDealSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills (OTT Category Style) */}
        <div className="flex flex-wrap items-center gap-1.5 px-1">
          {[
            { id: "all", label: `All Deals (${filterCounts.all})` },
            { id: "PROMO_CODE", label: `🎟️ Promo Codes (${filterCounts.PROMO_CODE})` },
            { id: "BANK_OFFER", label: `💳 Bank Offers (${filterCounts.BANK_OFFER})` },
            { id: "CATEGORY_PERK", label: `🎓 Student & Category (${filterCounts.CATEGORY_PERK})` },
            { id: "APP_EXCLUSIVE", label: `📱 App Only (${filterCounts.APP_EXCLUSIVE})` },
          ].map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => setDealTypeFilter(pill.id)}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                dealTypeFilter === pill.id
                  ? "bg-slate-900 text-white shadow-2xs font-extrabold"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Deals Cards Grid (OTT Style Cards) */}
        {deals.length === 0 ? (
          isVerifyingEntity ? (
            /* Analyzing / Verifying Entity with ShopSmart AI */
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-2xs flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
              <p className="text-xs font-bold text-slate-700">
                Analyzing platform &amp; verifying official channels with ShopSmart AI...
              </p>
              <p className="text-[11px] text-slate-400">
                Checking brand legitimacy and category match for &ldquo;{debouncedQuery || dealSearchQuery}&rdquo;
              </p>
            </div>
          ) : verifiedEntity?.action === "CATALOG_TYPO_MATCH" ? (
            /* =================================================== */
            /* 1. CATALOG TYPO MATCH ("Did you mean...?")          */
            /* =================================================== */
            <div className="p-6 sm:p-7 rounded-3xl bg-indigo-50/90 border border-indigo-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2.5 text-indigo-950 font-black text-sm sm:text-base">
                <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse shrink-0" />
                <span>Did you mean &ldquo;{verifiedEntity.canonicalName}&rdquo;?</span>
              </div>
              <p className="text-xs text-indigo-800 font-medium leading-relaxed max-w-xl">
                We detected a possible spelling variation for &ldquo;{dealSearchQuery.trim()}&rdquo;. We have active verified deals and fee waivers available for <strong>{verifiedEntity.canonicalName}</strong>.
              </p>
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setDealSearchQuery(verifiedEntity.canonicalName)}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-xs cursor-pointer transition-colors"
                >
                  Show Deals for {verifiedEntity.canonicalName}
                </button>
                <button
                  type="button"
                  onClick={() => { setDealSearchQuery(""); setDealTypeFilter("all"); }}
                  className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition-colors cursor-pointer"
                >
                  Clear Search
                </button>
              </div>
            </div>
          ) : verifiedEntity?.action === "CATEGORY_MISMATCH" ? (
            /* =================================================== */
            /* 2. CATEGORY MISMATCH (e.g. Kuku FM in Flights)       */
            /* =================================================== */
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 text-white shadow-xl space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-amber-300 shrink-0 shadow-inner">
                  <Compass className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-400/30">
                      Category Guidance
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">• {verifiedEntity.crossCategoryTitle || "Subscriptions"}</span>
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-white">
                    Looking for active deals for &ldquo;{verifiedEntity.canonicalName}&rdquo;?
                  </h4>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed max-w-xl">
                    &ldquo;{verifiedEntity.canonicalName}&rdquo; is a {verifiedEntity.description || "digital streaming platform"}, not an airline or flight booking carrier. Would you like to check active deals in our Subscriptions &amp; Entertainment Hub?
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = `/?tab=subscriptions`;
                  }}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <span>↗ Explore Subscriptions Deals for {verifiedEntity.canonicalName}</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setDealSearchQuery(""); setDealTypeFilter("all"); }}
                  className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-bold border border-white/10 transition-colors cursor-pointer"
                >
                  Back to All Flights Deals
                </button>
              </div>
            </div>
          ) : verifiedEntity?.action === "TRAVEL_ENTITY_VERIFIED" ? (
            /* =================================================== */
            /* 3. VERIFIED REAL TRAVEL BRAND (Singapore Air, Hyatt)*/
            /* =================================================== */
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/30 text-white shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0 text-indigo-300 shadow-inner">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-400/30">
                        Official Entity Verified
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">• {verifiedEntity.domain}</span>
                    </div>
                    <h4 className="text-base sm:text-lg font-black text-white">
                      Scan live verified deals for &ldquo;{verifiedEntity.canonicalName}&rdquo;?
                    </h4>
                    <p className="text-xs text-slate-300 font-medium max-w-xl leading-relaxed">
                      ShopSmart AI has verified the official portal for <strong>{verifiedEntity.canonicalName}</strong> ({verifiedEntity.domain}). Would you like ShopSmart AI Live Radar to scan official channels to uncover active promo codes, baggage allowances, and bank card privileges?
                    </p>
                  </div>
                </div>
              </div>

              {/* Status / Loading State */}
              {isOnDemandScanning ? (
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
                  <div className="flex items-center gap-2.5 text-xs font-bold text-indigo-200">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                    <span>{scanStep || "Running live radar scan..."}</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 w-3/4 animate-pulse rounded-full" />
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Analyzing direct portal data, baggage waivers, and partner card discounts...
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => handleTriggerOnDemand(verifiedEntity.canonicalName, category)}
                    className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white text-xs sm:text-sm font-black shadow-lg shadow-indigo-500/25 flex items-center gap-2 cursor-pointer transition-all active:scale-95 group"
                  >
                    <Zap className="w-4 h-4 text-amber-300 animate-pulse group-hover:scale-110 transition-transform" />
                    <span>⚡ Yes, Scan Live Deals for &ldquo;{verifiedEntity.canonicalName}&rdquo;</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setDealSearchQuery(""); setDealTypeFilter("all"); }}
                    className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs sm:text-sm font-bold border border-white/10 transition-colors cursor-pointer"
                  >
                    No, Show All Pre-Verified Deals
                  </button>
                </div>
              )}

              {onDemandError && (
                <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-300" />
                  <span>{onDemandError}</span>
                </div>
              )}
            </div>
          ) : (
            /* =================================================== */
            /* 4. PLATFORM NOT AVAILABLE IN DIRECTORY CARD         */
            /* =================================================== */
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0 shadow-inner">
                  <Compass className="w-6 h-6" />
                </div>
                <div className="space-y-1.5 text-center sm:text-left">
                  <h4 className="text-base font-extrabold text-slate-900">
                    Platform Not Available in Our Directory
                  </h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xl">
                    We currently do not have verified coupons or saving strategies available for this platform in our database.
                  </p>
                </div>
              </div>

              {/* Suggestions / Clear */}
              <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setDealTypeFilter("all"); setDealSearchQuery(""); setVerifiedEntity(null); }}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors cursor-pointer"
                >
                  Clear Search
                </button>
                <span className="font-semibold text-slate-400 pl-1">Or explore verified platforms:</span>
                {["Singapore Airlines", "Hyatt", "Lufthansa", "StubHub"].map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => setDealSearchQuery(sug)}
                    className="px-2.5 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[10px] transition-colors cursor-pointer"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 items-start">
            {deals.map((deal) => {
              const isCopied = copiedCode === deal.promoCode;
              return (
                <div
                  key={deal.id}
                  className="rounded-3xl bg-white border border-slate-200 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col group h-fit"
                >
                  {/* Card Header (OTT Style) */}
                  <div className={`p-3.5 bg-gradient-to-r ${deal.accentColor} text-white flex items-center justify-between`}>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-[11px] tracking-wider border border-white/30 shrink-0 shadow-inner">
                        {getBrandInitials(deal.platformId, deal.platformName)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-sm leading-tight truncate text-white">{deal.platformName}</h4>
                        <div className="flex items-center gap-1 text-[10px] text-white/80 font-semibold">
                          <span>✓ {deal.verifiedScore}% Success</span>
                          <span>•</span>
                          <span>{deal.verifiedDate}</span>
                        </div>
                      </div>
                    </div>
                    {deal.badge && (
                      <span className="px-2 py-0.5 rounded-full bg-white/20 text-[9px] font-black tracking-wide border border-white/20 whitespace-nowrap shrink-0 ml-2">
                        {deal.badge}
                      </span>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-3">
                    {/* Discount & Savings Box */}
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                      <div className="flex items-baseline justify-between gap-1">
                        <span className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                          {deal.discountValue}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-extrabold text-[10px] shrink-0">
                          {deal.estimatedSavings} Saved
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {deal.minSpend} • {deal.expiryNote}
                      </p>
                    </div>

                    {/* Deal Title & Tagline */}
                    <div>
                      <h5 className="font-extrabold text-xs text-slate-900 leading-snug">
                        {deal.title}
                      </h5>
                      <p className="text-[11px] text-slate-600 font-medium leading-relaxed mt-1">
                        {deal.tagline}
                      </p>
                    </div>

                    {/* Promo Code Copy Bar */}
                    <div className="p-2.5 px-3 bg-indigo-50/60 rounded-xl border border-indigo-100/90 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[9px] font-extrabold text-indigo-400 uppercase tracking-wider block">Promo Code</span>
                        <span className="font-mono font-black text-xs sm:text-sm text-indigo-950 tracking-wider">
                          {deal.promoCode}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(deal.promoCode)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                          isCopied
                            ? "bg-emerald-600 text-white shadow-2xs"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs active:scale-95"
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>COPIED!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>COPY CODE</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Action Footer: Visit Portal & AI Strategy */}
                    <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                      <a
                        href={deal.directUrl}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="text-[11px] font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <span>Visit Official Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      <button
                        type="button"
                        onClick={() => onOpenAdvisor && onOpenAdvisor(category, `How do I claim the ${deal.promoCode} deal on ${deal.platformName}?`)}
                        className="text-[11px] font-extrabold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
                        <span>Ask AI Strategy</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-6 sm:space-y-8 animate-fade-in">
      
      {/* 1. HERO HEADER: Transparency & Strategy Value Proposition */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-10 border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          {/* Status & Credibility Pill */}
          <div className="inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-[11px] font-bold text-indigo-200">
            <span className="flex items-center gap-1.5 text-amber-300 font-extrabold">
              <Clock className="w-3.5 h-3.5 animate-pulse text-amber-400" />
              1-Click Direct Booking Services: Coming Soon in 2026
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-emerald-300 flex items-center gap-1 font-extrabold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Live Now: Smart Savings Advisor &amp; Strategy Engine
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Smart Travel, Hotels &amp; Events Strategy Hub
          </h1>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2 text-xs sm:text-[13px] leading-relaxed text-slate-200">
            <p className="font-semibold text-white">
              🚀 <span className="text-amber-300 font-bold">Upcoming Service:</span> We are actively building 1-Click direct flight, hotel, and event booking directly inside this platform (Coming Soon in 2026).
            </p>
            <p className="text-slate-300">
              💡 <span className="text-emerald-300 font-bold">Active Right Now:</span> Consult our AI Booking Strategy Advisor before you purchase. Share your itinerary to uncover verified fare rules, free luggage entitlements, and fee-waiver strategies to maximize your savings.
            </p>
          </div>

          {/* Quick AI Advisor Launch Action */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
            <button
              type="button"
              onClick={() => onOpenAdvisor && onOpenAdvisor(activeTab)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white text-xs sm:text-sm font-black shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 group"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
              <span>Talk to AI Booking Strategy Advisor</span>
              <ArrowRight className="w-4 h-4 text-indigo-200 group-hover:translate-x-1 transition-transform shrink-0" />
            </button>
            <span className="text-[11px] text-slate-400 font-medium text-center sm:text-left">
              Describe your journey or booking plan • AI builds your savings blueprint in seconds
            </span>
          </div>

          {/* Quick Example Prompt Chips */}
          <div className="pt-1 flex flex-wrap items-center gap-2 text-[11px]">
            <span className="text-slate-400 font-bold">Try asking:</span>
            <button
              type="button"
              onClick={() => onOpenAdvisor && onOpenAdvisor("flights", "Delhi to Goa flight with luggage, how to save money?")}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 transition-colors cursor-pointer"
            >
              🛫 Delhi to Goa flight with luggage?
            </button>
            <button
              type="button"
              onClick={() => onOpenAdvisor && onOpenAdvisor("hotels", "Booking London hotel, how to unlock mobile app discount?")}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 transition-colors cursor-pointer"
            >
              🏨 Hotel mobile discount strategy?
            </button>
            <button
              type="button"
              onClick={() => onOpenAdvisor && onOpenAdvisor("events", "BookMyShow movie ticket with ICICI card, how to claim BOGO?")}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 transition-colors cursor-pointer"
            >
              🎟️ Movie BOGO quota timing?
            </button>
          </div>
        </div>
      </div>

      {/* 2. THREE-PILLAR SUB-NAVIGATION (Flights | Hotels | Events) */}
      <div className="flex items-center justify-center">
        <div className="inline-flex p-1.5 bg-slate-100 rounded-2xl border border-slate-200/80 shadow-inner">
          <button
            type="button"
            onClick={() => handleTabSwitch("flights")}
            className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === "flights"
                ? "bg-white text-slate-950 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Plane className={`w-4 h-4 ${activeTab === "flights" ? "text-indigo-600" : "text-slate-400"}`} />
            <span>Flights Strategy</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabSwitch("hotels")}
            className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === "hotels"
                ? "bg-white text-slate-950 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Hotel className={`w-4 h-4 ${activeTab === "hotels" ? "text-emerald-600" : "text-slate-400"}`} />
            <span>Hotels &amp; Stays</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabSwitch("events")}
            className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === "events"
                ? "bg-white text-slate-950 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Ticket className={`w-4 h-4 ${activeTab === "events" ? "text-purple-600" : "text-slate-400"}`} />
            <span>Events &amp; Movies</span>
          </button>
        </div>
      </div>

      {/* 3. DYNAMIC CONTENT SECTION BY ACTIVE TAB */}
      <AnimatePresence mode="wait">
        
        {/* ======================================================== */}
        {/* TAB 1: FLIGHTS SAVINGS & FARE RULES STRATEGY */}
        {/* ======================================================== */}
        {activeTab === "flights" && (
          <motion.div
            key="flights-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Strategy Grid: Practical Real-World Rules */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Card 1: Two-Way Split Independence */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <ArrowLeftRight className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  Smart Two-Way Carrier Split
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Instead of locking into a single airline for round-trip, mix carriers based on flight departure timing (e.g. morning outbound with Airline A, evening return with Airline B). Gives better schedules and balances blended fares.
                </p>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-bold text-indigo-700">
                  ✓ Verified: Up to {currencySymbol}{isIN ? "1,400" : "60"} saved on domestic routes
                </div>
              </div>

              {/* Card 2: Student & Senior Statutory Baggage Entitlements */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <Luggage className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  Official Special Category Fares
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Airlines offer statutory category discounts that travelers miss. Students get 6%–10% base fare discount + <strong>10kg to 25kg free baggage</strong>. Senior citizens (60+) receive statutory base concessions.
                </p>
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-[11px] font-bold text-emerald-800">
                  ✓ Zero counter baggage penalty ({currencySymbol}{isIN ? "2,500" : "75"} value)
                </div>
              </div>

              {/* Card 3: Pre-Ticked Fee Shaver */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  Checkout Add-On Fee Audit
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Always inspect the checkout summary before paying: uncheck auto-selected travel insurance and luggage loss protection if your credit card already includes travel coverage. Save seat selection fees until web check-in.
                </p>
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100 text-[11px] font-bold text-amber-800">
                  ✓ Eliminates {currencySymbol}{isIN ? "350–600" : "15–30"} in pre-ticked extras
                </div>
              </div>
            </div>

            {/* VERIFIED DEALS & PROMO CODES SECTION */}
            {renderDealsSection("flights", "Verified Flights Deals & Official Promo Codes", "Direct verified discounts across IndiGo, Air India, MakeMyTrip & EaseMyTrip")}

            {/* Verified Major Airlines Portal Hub */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Verified Airlines &amp; Official Booking Channels ({currentCountryMeta.name})
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Direct access to official carrier booking portals to claim student fares, bank waivers, and earn flyer miles.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
                  Official Channels
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {isIN ? (
                  <>
                    <div className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-slate-900">IndiGo (6E)</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">6% Off + 25kg Bag</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Student Scheme: Flat 6% discount on base fare + 10kg additional baggage allowance on domestic flights.
                      </p>
                      <a 
                        href="https://www.goindigo.in" 
                        target="_blank" 
                        rel="noopener noreferrer nofollow"
                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 pt-1"
                      >
                        <span>Visit IndiGo Official Portal</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-slate-900">Air India</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700">50% Senior Citizen</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Senior citizens (60+) receive 50% concession on base fare. Complimentary meals and 15kg checked baggage included.
                      </p>
                      <a 
                        href="https://www.airindia.com" 
                        target="_blank" 
                        rel="noopener noreferrer nofollow"
                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 pt-1"
                      >
                        <span>Visit Air India Official Portal</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-slate-900">Akasa Air</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700">Cafe Akasa Meal Perks</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Competitive non-stop domestic routes with USB charging ports at every seat. Student and defense special booking tags.
                      </p>
                      <a 
                        href="https://www.akasaair.com" 
                        target="_blank" 
                        rel="noopener noreferrer nofollow"
                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 pt-1"
                      >
                        <span>Visit Akasa Air Official Portal</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-slate-900">Emirates</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-50 text-red-700">Student 10% + 10kg</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Student Club members get 10% off Economy, 5% off Business, 10kg extra baggage, and flexible date changes.
                      </p>
                      <a 
                        href="https://www.emirates.com" 
                        target="_blank" 
                        rel="noopener noreferrer nofollow"
                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 pt-1"
                      >
                        <span>Visit Emirates Official Portal</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-slate-900">British Airways</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">Avios Rewards</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Executive Club members earn Avios on all Oneworld alliance flights. Free seat selection 24 hours prior to flight.
                      </p>
                      <a 
                        href="https://www.britishairways.com" 
                        target="_blank" 
                        rel="noopener noreferrer nofollow"
                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 pt-1"
                      >
                        <span>Visit BA Official Portal</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-slate-900">Virgin Atlantic</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700">Virgin Points</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Flying Club integration with Delta Air Lines. Premium Economy upgrade bids available 72 hours prior to departure.
                      </p>
                      <a 
                        href="https://www.virginatlantic.com" 
                        target="_blank" 
                        rel="noopener noreferrer nofollow"
                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 pt-1"
                      >
                        <span>Visit Virgin Atlantic Portal</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: HOTELS & STAYS SMART STRATEGY */}
        {/* ======================================================== */}
        {activeTab === "hotels" && (
          <motion.div
            key="hotels-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Strategy Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Card 1: Mobile App Exclusive Rate Advantage */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  Mobile App Exclusive Deals
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Booking.com and Agoda offer official <strong>10% to 15% Mobile Only Discounts</strong> on thousands of partner properties. If you find a hotel on laptop, complete the booking via their mobile app to unlock the lower rate.
                </p>
                <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100 text-[11px] font-bold text-indigo-700">
                  ✓ Save 10%–15% instantly via official mobile apps
                </div>
              </div>

              {/* Card 2: Genius & VIP Loyalty Unlocking */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  Official Loyalty Tiers (Genius &amp; VIP)
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Booking.com Genius and Agoda VIP are 100% free lifetime membership programs. Level 1 unlocks 10% room discount, and Level 2 unlocks free complimentary breakfast and room category upgrades at participating properties.
                </p>
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-[11px] font-bold text-emerald-800">
                  ✓ Free breakfast + room upgrade perks
                </div>
              </div>

              {/* Card 3: Free Cancellation Price Lock */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  Free Cancellation Price Shield
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Avoid non-refundable rates to save nominal amounts. Always choose "Free Cancellation". If the hotel drops rates or issues a promo code 48 hours before your arrival to fill vacancy, rebook and cancel the prior reservation.
                </p>
                <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-100 text-[11px] font-bold text-purple-800">
                  ✓ Zero risk flexibility + re-booking arbitrage
                </div>
              </div>
            </div>

            {/* VERIFIED HOTEL DEALS & MOBILE SAVING STRATEGIES */}
            {renderDealsSection("hotels", "Verified Hotel Deals & Mobile Saving Strategies", "Direct verified discounts across Booking.com, Agoda, MakeMyTrip Hotels, Taj & OYO")}

            {/* Verified Major Hotel Booking Channels */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Verified Hotel Booking Platforms ({currentCountryMeta.name})
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Trusted global and regional portals offering transparent cancellation and verified guest reviews.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
                  Verified Portals
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900">Booking.com</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">Genius 10-15% Off</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Worldwide coverage with Pay-at-Hotel and free cancellation on most rooms. Verified guest ratings.
                  </p>
                  <a 
                    href="https://www.booking.com" 
                    target="_blank" 
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 pt-1"
                  >
                    <span>Visit Booking.com Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900">Agoda</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">VIP Mobile Deals</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Deep discounts across Asia, UAE, and major metropolitan destinations with Agoda Cash rewards.
                  </p>
                  <a 
                    href="https://www.agoda.com" 
                    target="_blank" 
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 pt-1"
                  >
                    <span>Visit Agoda Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900">{isIN ? "MakeMyTrip" : "Hotels.com"}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700">Bank Card Discounts</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {isIN 
                      ? "Instant bank card discounts (HDFC, ICICI, SBI) and MMT Black member loyalty rewards." 
                      : "One Key rewards integration across Hotels.com, Expedia, and Vrbo vacation rentals."}
                  </p>
                  <a 
                    href={isIN ? "https://www.makemytrip.com/hotels" : "https://www.hotels.com"} 
                    target="_blank" 
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 pt-1"
                  >
                    <span>Visit {isIN ? "MakeMyTrip" : "Hotels.com"}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: EVENTS, CONCERTS & ENTERTAINMENT STRATEGY */}
        {/* ======================================================== */}
        {activeTab === "events" && (
          <motion.div
            key="events-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Strategy Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Card 1: Bank Card BOGO Quota Timing */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  Bank Card BOGO (Buy 1 Get 1) Quota
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Major credit/debit cards offer 1 free movie or event ticket monthly. Because daily bank quotas fill up quickly by evening, book right when the bank daily quota resets at <strong>12:00 Midnight or 11:00 AM</strong> to secure your complimentary ticket.
                </p>
                <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100 text-[11px] font-bold text-indigo-700">
                  ✓ Save up to {currencySymbol}{isIN ? "500" : "15"} per movie booking
                </div>
              </div>

              {/* Card 2: Official Concert Presale Windows */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  Priority Presale Booking Access
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  For high-demand stadium concerts and arena tours, official organizers offer 24–48 hour exclusive presales for specific cardholders (e.g. Kotak/HSBC in India, Chase/Amex in US, Mastercard in UK). Secures face-value tickets before general sellouts.
                </p>
                <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-100 text-[11px] font-bold text-purple-800">
                  ✓ Face-value tickets (Avoids 3x secondary markups)
                </div>
              </div>

              {/* Card 3: Convenience Fee Mitigation */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                  <Percent className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  Convenience &amp; Booking Fee Offset
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ticketing portals add Internet Handling Fees per ticket. Using qualifying bank card promotions, digital loyalty points (e.g. Tata Neu coins, Payback), or partner gift vouchers absorbs or offsets these booking charges entirely.
                </p>
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100 text-[11px] font-bold text-amber-800">
                  ✓ 100% fee absorption via bank tie-ups
                </div>
              </div>
            </div>

            {/* VERIFIED EVENTS & MOVIES DEALS SECTION */}
            {renderDealsSection("events", "Verified Event, Concert & Movie BOGO Passes", "Bank 1+1 offers, early bird festival passes across BookMyShow, District & Paytm Insider")}

            {/* Verified Major Event Booking Channels */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Verified Entertainment &amp; Ticketing Platforms ({currentCountryMeta.name})
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Authorized primary ticketing portals for live music, stand-up comedy, sports, and cinema.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
                  Authorized Portals
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900">{isIN ? "BookMyShow" : "Ticketmaster"}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">Bank BOGO Perks</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {isIN 
                      ? "India's largest movie and live entertainment hub with ICICI, Axis, Kotak, and SBI card offers." 
                      : "Official primary ticket distributor for global arena tours, NFL, Premier League, and Broadway."}
                  </p>
                  <a 
                    href={isIN ? "https://in.bookmyshow.com" : "https://www.ticketmaster.com"} 
                    target="_blank" 
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 pt-1"
                  >
                    <span>Visit {isIN ? "BookMyShow" : "Ticketmaster"}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900">{isIN ? "District by Zomato" : "Eventbrite"}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700">Live Experiences</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {isIN 
                      ? "Live comedy festivals, music concerts, and dining event passes across metro cities." 
                      : "Community events, local festivals, conferences, and niche independent music gigs."}
                  </p>
                  <a 
                    href={isIN ? "https://www.zomato.com/live" : "https://www.eventbrite.com"} 
                    target="_blank" 
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 pt-1"
                  >
                    <span>Visit {isIN ? "District / Zomato Live" : "Eventbrite"}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900">{isIN ? "Paytm Insider" : "Live Nation"}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700">Early-Bird Access</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {isIN 
                      ? "Curated sports tournaments (ISL, Cricket), music fests, and theater productions." 
                      : "Global concert promoter with verified fan presales and VIP backstage experience packages."}
                  </p>
                  <a 
                    href={isIN ? "https://insider.in" : "https://www.livenation.com"} 
                    target="_blank" 
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 pt-1"
                  >
                    <span>Visit {isIN ? "Paytm Insider" : "Live Nation"}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. FOOTER ADVISORY NOTE */}
      <div className="text-center py-4 border-t border-slate-200/80">
        <p className="text-[11px] text-slate-400 font-medium">
          ShopSmart AI provides strategic booking intelligence, fare rule analysis, and verified partner channels. Always inspect final ticket fares on official booking portals prior to payment.
        </p>
      </div>

    </div>
  );
}
