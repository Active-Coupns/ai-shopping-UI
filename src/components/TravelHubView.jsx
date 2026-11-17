"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  Compass,
  Lock,
  Eye
} from "lucide-react";
import { SUPPORTED_COUNTRIES } from "@/lib/countryConfig";
import { useUser, useClerk } from "@clerk/nextjs";
import { getTravelSlug } from "@/data/travelRegistry";

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
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const [selectedCountry, setSelectedCountry] = useState(country || "IN");
  const [activeTab, setActiveTab] = useState("flights"); // "flights" | "hotels" | "events"
  const [copiedCode, setCopiedCode] = useState(null);
  const [revealedDeals, setRevealedDeals] = useState({});
  const [dealTypeFilter, setDealTypeFilter] = useState("all");
  const [dealSearchQuery, setDealSearchQuery] = useState("");

  // Live Database Deals State with In-Memory Client Cache
  const [dbDeals, setDbDeals] = useState([]);
  const [dealsCache, setDealsCache] = useState({});
  const [isLoadingDeals, setIsLoadingDeals] = useState(false);

  useEffect(() => {
    setSelectedCountry(country || "IN");
  }, [country]);

  useEffect(() => {
    if (dealsCache[selectedCountry]) {
      setDbDeals(dealsCache[selectedCountry]);
      return;
    }
    let isMounted = true;
    setIsLoadingDeals(true);
    fetch(`/api/travel/deals?country=${selectedCountry}&category=all`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && Array.isArray(data.deals)) {
          setDealsCache((prev) => ({ ...prev, [selectedCountry]: data.deals }));
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
  }, [selectedCountry, dealsCache]);

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
    if (!isSignedIn) {
      if (typeof openSignIn === "function") {
        openSignIn();
      }
      return;
    }
    const cleanBrand = (brandQuery || "").trim();
    if (!cleanBrand || cleanBrand.length < 2) return;

    setIsOnDemandScanning(true);
    setOnDemandError(null);
    setScanStep("Initializing Benefisto Live Radar...");

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
      setOnDemandError("Travel partner network is momentarily busy. Please try scanning again in a moment.");
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
      setIsOnDemandScanning(false);
      setScanStep("");
    }
  };

  const isIN = selectedCountry === "IN";
  const isUS = selectedCountry === "US";
  const isUK = selectedCountry === "GB" || selectedCountry === "UK";
  const isCA = selectedCountry === "CA";
  const isAU = selectedCountry === "AU";
  const isAE = selectedCountry === "AE";

  const currencySymbol = isAE ? "AED " : isAU ? "A$" : isCA ? "C$" : isUK ? "£" : isUS ? "$" : "₹";
  const currentCountryMeta = SUPPORTED_COUNTRIES[selectedCountry] || SUPPORTED_COUNTRIES.IN;

  const handleCopy = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleRevealAndCopy = (deal) => {
    // 1. Reveal promo code immediately for the user
    setRevealedDeals((prev) => ({ ...prev, [deal.id]: true }));

    // 2. Copy code to clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(deal.promoCode);
    }
    setCopiedCode(deal.promoCode);
    setTimeout(() => setCopiedCode(null), 2500);

    // 3. Open merchant portal in new tab
    if (deal.directUrl && typeof window !== "undefined") {
      window.open(deal.directUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleOpenAdvisorSecurely = (category, query) => {
    if (!isSignedIn) {
      if (typeof openSignIn === "function") {
        openSignIn();
      }
      return;
    }
    if (typeof onOpenAdvisor === "function") {
      onOpenAdvisor(category, query);
    }
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

    const uniqueBrandsCount = new Set(deals.map(d => d.platformName || d.platformId)).size;

    return (
      <div className="space-y-4 pt-2">
        {/* Section Header with Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-2xs">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                {sectionTitle}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-black shrink-0">
                {uniqueBrandsCount} Brands • {deals.length} Active Deals
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
              placeholder="Search deals, coupons, or platforms..."
              className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 placeholder-slate-400"
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

        {/* Filter Pills - Modern Horizontal Ribbon with Badges */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1 px-1 scroll-smooth">
          {[
            { id: "all", icon: "✨", label: "All Deals", count: filterCounts.all },
            { id: "PROMO_CODE", icon: "🎟️", label: "Promo Codes", count: filterCounts.PROMO_CODE },
            { id: "BANK_OFFER", icon: "💳", label: "Bank Offers", count: filterCounts.BANK_OFFER },
            { id: "CATEGORY_PERK", icon: "🎓", label: "Student & Category", count: filterCounts.CATEGORY_PERK },
            { id: "APP_EXCLUSIVE", icon: "📱", label: "App Only", count: filterCounts.APP_EXCLUSIVE },
          ].map((pill) => {
            const isActive = dealTypeFilter === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => setDealTypeFilter(pill.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap active:scale-95 ${
                  isActive
                    ? "bg-slate-900 text-white shadow-sm ring-1 ring-slate-800"
                    : "bg-white text-slate-700 border border-slate-200/90 hover:bg-slate-50 hover:text-slate-900 shadow-2xs"
                }`}
              >
                <span className="text-xs sm:text-sm">{pill.icon}</span>
                <span>{pill.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-black leading-none ${
                    isActive
                      ? "bg-indigo-500 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {pill.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Deals Cards Grid (OTT Style Cards) */}
        {deals.length === 0 ? (
          isVerifyingEntity ? (
            /* Analyzing / Verifying Entity with Benefisto */
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-2xs flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
              <p className="text-xs font-bold text-slate-700">
                Analyzing platform &amp; verifying official channels with Benefisto...
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
                      Benefisto has verified the official portal for <strong>{verifiedEntity.canonicalName}</strong> ({verifiedEntity.domain}). Would you like Benefisto Live Radar to scan official channels to uncover active promo codes, baggage allowances, and bank card privileges?
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
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => handleTriggerOnDemand(verifiedEntity.canonicalName, category)}
                    className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white text-xs sm:text-sm font-black shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 group text-center"
                  >
                    <Zap className="w-4 h-4 text-amber-300 animate-pulse group-hover:scale-110 transition-transform" />
                    <span>⚡ Yes, Scan Live Deals for &ldquo;{verifiedEntity.canonicalName}&rdquo;</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setDealSearchQuery(""); setDealTypeFilter("all"); }}
                    className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs sm:text-sm font-bold border border-white/10 transition-colors cursor-pointer text-center justify-center flex items-center"
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
        ) : isLoadingDeals ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 items-start">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={`travel-skeleton-${i}`}
                className="rounded-3xl bg-white border border-slate-200 shadow-2xs overflow-hidden flex flex-col animate-pulse"
              >
                <div className="p-3.5 bg-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-slate-300" />
                    <div className="space-y-1">
                      <div className="h-4 w-28 bg-slate-300 rounded" />
                      <div className="h-2.5 w-16 bg-slate-300/70 rounded" />
                    </div>
                  </div>
                  <div className="h-4 w-14 bg-slate-300 rounded-full" />
                </div>
                <div className="p-4 space-y-3">
                  <div className="h-14 bg-slate-100 rounded-2xl" />
                  <div className="space-y-1.5">
                    <div className="h-3 w-full bg-slate-100 rounded" />
                    <div className="h-3 w-3/4 bg-slate-100 rounded" />
                  </div>
                  <div className="h-10 bg-slate-200 rounded-2xl w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 items-start">
            {deals.map((deal) => {
              const isCopied = copiedCode === deal.promoCode;
              const isRevealed = !!revealedDeals[deal.id];
              const brandSlug = getTravelSlug(deal.platformId, deal.platformName);
              const isEvents = deal.category === "events" || activeTab === "events";
              const brandPageHref = isEvents ? `/events/${brandSlug}` : `/travel/${brandSlug}`;

              return (
                <div
                  key={deal.id}
                  className="rounded-3xl bg-white border border-slate-200 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col group h-fit"
                >
                  {/* Card Header (OTT Style) */}
                  <div className={`p-3.5 bg-gradient-to-r ${deal.accentColor} text-white flex items-center justify-between`}>
                    <Link href={brandPageHref} className="flex items-center gap-2.5 min-w-0 group/brand cursor-pointer">
                      <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-[11px] tracking-wider border border-white/30 shrink-0 shadow-inner group-hover/brand:scale-105 transition-transform">
                        {getBrandInitials(deal.platformId, deal.platformName)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-sm leading-tight truncate text-white group-hover/brand:underline">{deal.platformName}</h4>
                        <div className="flex items-center gap-1 text-[10px] text-white/80 font-semibold">
                          <span>✓ {deal.verifiedScore}% Success</span>
                          <span>•</span>
                          <span>{deal.verifiedDate}</span>
                        </div>
                      </div>
                    </Link>
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

                    {/* Dedicated Brand Page CTA Button */}
                    <Link
                      href={brandPageHref}
                      className="w-full py-2.5 px-3 min-h-[42px] rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
                    >
                      <span>View {deal.platformName} Blueprint &amp; Codes</span>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                    </Link>

                    {/* Promo Code Reveal & Copy Gate */}
                    <div data-nosnippet="true" className="p-2.5 px-3 bg-indigo-50/70 rounded-2xl border border-indigo-100 flex items-center justify-between gap-2">
                      <div data-nosnippet="true" className="min-w-0">
                        <span className="text-[9px] font-extrabold text-indigo-500 uppercase tracking-wider block">Promo Code</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {isRevealed ? (
                            <span className="font-mono font-black text-xs sm:text-sm text-indigo-950 tracking-wider">
                              {deal.promoCode}
                            </span>
                          ) : (
                            <span className="font-mono font-black text-xs sm:text-sm text-slate-400 tracking-widest select-none">
                              ••••••••
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        data-nosnippet="true"
                        onClick={() => handleRevealAndCopy(deal)}
                        className={`px-3 py-2 min-h-[40px] rounded-xl text-[10px] font-extrabold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 shadow-xs active:scale-95 ${
                          isCopied
                            ? "bg-emerald-600 text-white"
                            : isRevealed
                            ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                            : "bg-slate-900 hover:bg-slate-800 text-white"
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-white" />
                            <span>COPIED!</span>
                          </>
                        ) : isRevealed ? (
                          <>
                            <Copy className="w-3 h-3 text-white" />
                            <span>COPY AGAIN</span>
                          </>
                        ) : (
                          <>
                            <Tag className="w-3 h-3 text-amber-300" />
                            <span>REVEAL &amp; OPEN</span>
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
                        onClick={() => handleOpenAdvisorSecurely(category, `How do I claim the ${deal.promoCode} deal on ${deal.platformName}?`)}
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
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-6 sm:space-y-8 animate-fade-in pb-28 sm:pb-10">
      
      {/* 1. HERO HEADER: Transparency & Strategy Value Proposition */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-4 sm:p-8 md:p-10 border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-3 sm:space-y-4">
          {/* Status Pill & Country Switcher Row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-[11px] sm:text-xs font-bold text-indigo-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0" />
              <span>AI Booking Strategy &amp; Smart Savings Hub</span>
            </div>

            <div className="flex items-center p-1 bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700/80 text-xs font-bold gap-1 shadow-inner max-w-full overflow-x-auto no-scrollbar">
              {[
                { code: "IN", label: "India", flag: "🇮🇳" },
                { code: "US", label: "USA", flag: "🇺🇸" },
                { code: "GB", label: "UK", flag: "🇬🇧" },
                { code: "AU", label: "Australia", flag: "🇦🇺" },
                { code: "CA", label: "Canada", flag: "🇨🇦" },
                { code: "AE", label: "UAE", flag: "🇦🇪" },
              ].map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => setSelectedCountry(c.code)}
                  className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-[11px] ${
                    selectedCountry === c.code
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md font-black ring-1 ring-blue-400/40"
                      : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                  }`}
                >
                  <span>{c.flag}</span>
                  <span className="hidden sm:inline">{c.label}</span>
                  <span className="sm:hidden">{c.code}</span>
                </button>
              ))}
            </div>
          </div>

          <h1 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
            Smart Travel, Flights &amp; Hotel Intelligence
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Uncover hidden airline fare rules, free luggage hacks, and member-only hotel rates before you book across trusted booking portals.
          </p>

          {/* Quick AI Advisor Launch Action */}
          <div className="pt-1 flex flex-col sm:flex-row sm:items-center gap-2.5">
            <button
              type="button"
              onClick={() => handleOpenAdvisorSecurely(activeTab)}
              className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white text-xs sm:text-sm font-black shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 group shrink-0"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
              <span>Talk to AI Booking Strategy Advisor</span>
              <ArrowRight className="w-4 h-4 text-indigo-200 group-hover:translate-x-1 transition-transform shrink-0" />
            </button>
            <span className="text-[11px] text-slate-400 font-medium text-center sm:text-left">
              Share your route or stay • AI generates instant savings strategies
            </span>
          </div>

          {/* Quick Universal Prompt Chips */}
          <div className="pt-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-[11px]">
            <span className="text-slate-400 font-bold shrink-0">Try asking:</span>
            <button
              type="button"
              onClick={() => handleOpenAdvisorSecurely("flights", "How to avoid luggage fees and get seat selection discount?")}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
            >
              🛫 Baggage fee &amp; seat hacks?
            </button>
            <button
              type="button"
              onClick={() => handleOpenAdvisorSecurely("hotels", "How to get member rates and secret mobile discounts on hotels?")}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
            >
              🏨 Secret hotel app discounts?
            </button>
            <button
              type="button"
              onClick={() => handleOpenAdvisorSecurely("events", "Credit card perks and early bird booking discounts?")}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
            >
              🎟️ Card booking perks?
            </button>
          </div>
        </div>
      </div>

      {/* 2. THREE-PILLAR SUB-NAVIGATION (Flights | Hotels | Events) */}
      <div className="flex items-center justify-center w-full">
        <div className="w-full sm:w-auto flex items-center p-1 sm:p-1.5 bg-slate-100 rounded-2xl border border-slate-200/80 shadow-inner overflow-x-auto no-scrollbar gap-1 sm:gap-1.5">
          <button
            type="button"
            onClick={() => handleTabSwitch("flights")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2.5 min-h-[44px] rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
              activeTab === "flights"
                ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-500/30 ring-2 ring-indigo-400/40"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
            }`}
          >
            <Plane className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${activeTab === "flights" ? "text-white" : "text-slate-400"}`} />
            <span className="sm:hidden">Flights</span>
            <span className="hidden sm:inline">Flights Strategy (6 Brands)</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabSwitch("hotels")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2.5 min-h-[44px] rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
              activeTab === "hotels"
                ? "bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-500/30 ring-2 ring-emerald-400/40"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
            }`}
          >
            <Hotel className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${activeTab === "hotels" ? "text-white" : "text-slate-400"}`} />
            <span className="sm:hidden">Hotels</span>
            <span className="hidden sm:inline">Hotels &amp; Stays (8 Brands)</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabSwitch("events")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2.5 min-h-[44px] rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
              activeTab === "events"
                ? "bg-gradient-to-r from-purple-600 to-fuchsia-700 text-white shadow-md shadow-purple-500/30 ring-2 ring-purple-400/40"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
            }`}
          >
            <Ticket className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${activeTab === "events" ? "text-white" : "text-slate-400"}`} />
            <span className="sm:hidden">Events</span>
            <span className="hidden sm:inline">Events &amp; Movies (4 Brands)</span>
          </button>
        </div>
      </div>

      {/* Dedicated Hubs Quick Navigation Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <Link
          href="/travel"
          className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-blue-900/90 via-indigo-900/90 to-slate-900 text-white border border-blue-500/30 hover:border-blue-400 hover:shadow-lg transition-all flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-300 font-bold border border-blue-400/30 group-hover:scale-105 transition-transform">
              <Plane className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <span className="font-black text-xs sm:text-sm block group-hover:text-sky-300 transition-colors">
                Dedicated Flights &amp; Hotels Hub →
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-300 font-medium">
                Browse 76 Global Airlines &amp; Hotels with Verified Blueprints
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-sky-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/events"
          className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-purple-900/90 via-fuchsia-900/90 to-slate-900 text-white border border-purple-500/30 hover:border-purple-400 hover:shadow-lg transition-all flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-300 font-bold border border-purple-400/30 group-hover:scale-105 transition-transform">
              <Ticket className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <span className="font-black text-xs sm:text-sm block group-hover:text-purple-300 transition-colors">
                Dedicated Concerts &amp; Events Hub →
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-300 font-medium">
                Browse 47 Platforms with BOGO Credit Card Hacks
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
        </Link>
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
            {/* Upcoming 1-Click Direct Booking Service Spotlight Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white border border-indigo-500/25 shadow-md relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />
              
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2 max-w-xl">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-[11px] font-extrabold text-amber-300">
                    <Clock className="w-3.5 h-3.5 animate-pulse text-amber-300" />
                    <span>Upcoming Feature • Direct 1-Click Booking</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    Direct Wholesale Flight &amp; Stay Bookings Coming Soon
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    We are actively building 1-click direct booking with wholesale net fares and zero hidden markups right inside this platform. In the meantime, explore active verified deals below or consult our AI Strategy Advisor for instant itinerary savings.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenAdvisorSecurely(activeTab)}
                  className="shrink-0 w-full sm:w-auto justify-center px-4 sm:px-5 py-2.5 rounded-xl bg-white text-indigo-950 hover:bg-slate-100 font-extrabold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>Consult AI Advisor</span>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-900" />
                </button>
              </div>
            </div>

            {/* VERIFIED DEALS & PROMO CODES SECTION */}
            {renderDealsSection("flights", "Verified Flights Deals & Official Promo Codes", "Direct verified discounts, baggage waivers, and student perks across official airlines")}

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
                    <div className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all space-y-2 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-sm text-slate-900">IndiGo (6E)</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">6% Off + 25kg Bag</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium mt-1">
                          Student Scheme: Flat 6% discount on base fare + 10kg additional baggage allowance on domestic flights.
                        </p>
                      </div>
                      <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                        <Link 
                          href="/travel/indigo-airlines"
                          className="inline-flex items-center gap-1 text-xs font-black text-indigo-600 hover:text-indigo-800 cursor-pointer"
                        >
                          <span>View IndiGo Blueprints</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <a 
                          href="https://www.goindigo.in" 
                          target="_blank" 
                          rel="noopener noreferrer nofollow"
                          className="text-[11px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-0.5"
                        >
                          <span>Official Portal</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all space-y-2 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-sm text-slate-900">Air India</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700">50% Defense Concession</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium mt-1">
                          Armed forces 50% concession on basic fare. Star Alliance points and 25kg checked baggage included.
                        </p>
                      </div>
                      <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                        <Link 
                          href="/travel/air-india"
                          className="inline-flex items-center gap-1 text-xs font-black text-indigo-600 hover:text-indigo-800 cursor-pointer"
                        >
                          <span>View Air India Blueprints</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <a 
                          href="https://www.airindia.com" 
                          target="_blank" 
                          rel="noopener noreferrer nofollow"
                          className="text-[11px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-0.5"
                        >
                          <span>Official Portal</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all space-y-2 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-sm text-slate-900">Akasa Air</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700">Cafe Akasa Meal Perks</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium mt-1">
                          Competitive non-stop domestic routes with USB charging ports at every seat. Student and defense special booking tags.
                        </p>
                      </div>
                      <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                        <Link 
                          href="/travel/akasa-air"
                          className="inline-flex items-center gap-1 text-xs font-black text-indigo-600 hover:text-indigo-800 cursor-pointer"
                        >
                          <span>View Akasa Blueprints</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <a 
                          href="https://www.akasaair.com" 
                          target="_blank" 
                          rel="noopener noreferrer nofollow"
                          className="text-[11px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-0.5"
                        >
                          <span>Official Portal</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all space-y-2 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-sm text-slate-900">Emirates</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-50 text-red-700">Student 10% + 10kg</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium mt-1">
                          Student Club members get 10% off Economy, 5% off Business, 10kg extra baggage, and flexible date changes.
                        </p>
                      </div>
                      <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                        <Link 
                          href="/travel/emirates"
                          className="inline-flex items-center gap-1 text-xs font-black text-indigo-600 hover:text-indigo-800 cursor-pointer"
                        >
                          <span>View Emirates Blueprints</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <a 
                          href="https://www.emirates.com" 
                          target="_blank" 
                          rel="noopener noreferrer nofollow"
                          className="text-[11px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-0.5"
                        >
                          <span>Official Portal</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all space-y-2 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-sm text-slate-900">British Airways</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">Avios Rewards</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium mt-1">
                          Executive Club members earn Avios on all Oneworld alliance flights. Free seat selection 24 hours prior to flight.
                        </p>
                      </div>
                      <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                        <Link 
                          href="/travel/british-airways"
                          className="inline-flex items-center gap-1 text-xs font-black text-indigo-600 hover:text-indigo-800 cursor-pointer"
                        >
                          <span>View BA Blueprints</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <a 
                          href="https://www.britishairways.com" 
                          target="_blank" 
                          rel="noopener noreferrer nofollow"
                          className="text-[11px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-0.5"
                        >
                          <span>Official Portal</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all space-y-2 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-sm text-slate-900">Virgin Atlantic</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700">Virgin Points</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium mt-1">
                          Flying Club integration with Delta Air Lines. Premium Economy upgrade bids available 72 hours prior to departure.
                        </p>
                      </div>
                      <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                        <Link 
                          href="/travel/virgin-atlantic-uk"
                          className="inline-flex items-center gap-1 text-xs font-black text-indigo-600 hover:text-indigo-800 cursor-pointer"
                        >
                          <span>View Virgin Blueprints</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <a 
                          href="https://www.virginatlantic.com" 
                          target="_blank" 
                          rel="noopener noreferrer nofollow"
                          className="text-[11px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-0.5"
                        >
                          <span>Official Portal</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
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
            {/* Upcoming 1-Click Direct Hotel Booking Spotlight Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-900 text-white border border-emerald-500/25 shadow-md relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
              
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2 max-w-xl">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/15 border border-emerald-400/30 text-[11px] font-extrabold text-emerald-300">
                    <Clock className="w-3.5 h-3.5 animate-pulse text-emerald-300" />
                    <span>Upcoming Feature • Direct 1-Click Booking</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    Direct Wholesale Hotel &amp; Stay Bookings Coming Soon
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    We are actively building 1-click direct hotel booking with wholesale member rates, complimentary upgrades, and zero middleman markups. In the meantime, explore verified deals below or consult our AI Strategy Advisor for instant stay savings.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenAdvisorSecurely("hotels")}
                  className="shrink-0 w-full sm:w-auto justify-center px-4 sm:px-5 py-2.5 rounded-xl bg-white text-emerald-950 hover:bg-slate-100 font-extrabold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                  <span>Consult AI Advisor</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-900" />
                </button>
              </div>
            </div>

            {/* VERIFIED HOTEL DEALS & MOBILE SAVING STRATEGIES */}
            {renderDealsSection("hotels", "Verified Hotel Deals & Mobile Saving Strategies", "Direct verified room discounts, free breakfast perks, and secret mobile rates")}

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
                <div className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-slate-900">Booking.com</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">Genius 10-15% Off</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-1">
                      Worldwide coverage with Pay-at-Hotel and free cancellation on most rooms. Verified guest ratings.
                    </p>
                  </div>
                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <Link 
                      href="/travel/booking-com"
                      className="inline-flex items-center gap-1 text-xs font-black text-indigo-600 hover:text-indigo-800 cursor-pointer"
                    >
                      <span>View Blueprints</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <a 
                      href="https://www.booking.com" 
                      target="_blank" 
                      rel="noopener noreferrer nofollow"
                      className="text-[11px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-0.5"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-slate-900">Agoda</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">VIP Mobile Deals</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-1">
                      Deep discounts across Asia, UAE, and major metropolitan destinations with Agoda Cash rewards.
                    </p>
                  </div>
                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <Link 
                      href="/travel/agoda"
                      className="inline-flex items-center gap-1 text-xs font-black text-indigo-600 hover:text-indigo-800 cursor-pointer"
                    >
                      <span>View Blueprints</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <a 
                      href="https://www.agoda.com" 
                      target="_blank" 
                      rel="noopener noreferrer nofollow"
                      className="text-[11px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-0.5"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-slate-900">{isIN ? "MakeMyTrip" : "Hotels.com"}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700">Bank Card Discounts</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-1">
                      {isIN 
                        ? "Instant bank card discounts (HDFC, ICICI, SBI) and MMT Black member loyalty rewards." 
                        : "One Key rewards integration across Hotels.com, Expedia, and Vrbo vacation rentals."}
                    </p>
                  </div>
                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <Link 
                      href={isIN ? "/travel/makemytrip-stays" : "/travel/hotels-com"}
                      className="inline-flex items-center gap-1 text-xs font-black text-indigo-600 hover:text-indigo-800 cursor-pointer"
                    >
                      <span>View Blueprints</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <a 
                      href={isIN ? "https://www.makemytrip.com/hotels" : "https://www.hotels.com"} 
                      target="_blank" 
                      rel="noopener noreferrer nofollow"
                      className="text-[11px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-0.5"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
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
            {/* Upcoming 1-Click Direct Event Booking Spotlight Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-purple-950 to-slate-900 text-white border border-purple-500/25 shadow-md relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-purple-500/15 rounded-full blur-2xl pointer-events-none" />
              
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2 max-w-xl">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-400/15 border border-purple-400/30 text-[11px] font-extrabold text-purple-300">
                    <Clock className="w-3.5 h-3.5 animate-pulse text-purple-300" />
                    <span>Upcoming Feature • Direct 1-Click Booking</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    Direct Face-Value Event &amp; Concert Passes Coming Soon
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    We are actively building direct event, concert, and movie ticketing integrations with verified card discounts and zero handling fee markups. In the meantime, explore verified offers below or consult our AI Strategy Advisor for instant booking perks.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenAdvisorSecurely("events")}
                  className="shrink-0 w-full sm:w-auto justify-center px-4 sm:px-5 py-2.5 rounded-xl bg-white text-purple-950 hover:bg-slate-100 font-extrabold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-600 fill-purple-600" />
                  <span>Consult AI Advisor</span>
                  <ArrowRight className="w-3.5 h-3.5 text-purple-900" />
                </button>
              </div>
            </div>

            {/* VERIFIED EVENTS & MOVIES DEALS SECTION */}
            {renderDealsSection("events", "Verified Event, Concert & Movie BOGO Passes", "Cardholder 1+1 offers, early bird festival passes, and verified entertainment perks")}

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
                <div className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-slate-900">{isIN ? "BookMyShow" : "Ticketmaster"}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">Bank BOGO Perks</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-1">
                      {isIN 
                        ? "India's largest movie and live entertainment hub with ICICI, Axis, Kotak, and SBI card offers." 
                        : "Official primary ticket distributor for global arena tours, NFL, Premier League, and Broadway."}
                    </p>
                  </div>
                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <Link 
                      href={isIN ? "/events/bookmyshow" : "/events/ticketmaster"}
                      className="inline-flex items-center gap-1 text-xs font-black text-indigo-600 hover:text-indigo-800 cursor-pointer"
                    >
                      <span>View Blueprints</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <a 
                      href={isIN ? "https://in.bookmyshow.com" : "https://www.ticketmaster.com"} 
                      target="_blank" 
                      rel="noopener noreferrer nofollow"
                      className="text-[11px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-0.5"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-slate-900">{isIN ? "District by Zomato" : "Eventbrite"}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700">Live Experiences</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-1">
                      {isIN 
                        ? "Live comedy festivals, music concerts, and dining event passes across metro cities." 
                        : "Community events, local festivals, conferences, and niche independent music gigs."}
                    </p>
                  </div>
                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <Link 
                      href={isIN ? "/events/zomato-live-district" : "/events/stubhub"}
                      className="inline-flex items-center gap-1 text-xs font-black text-indigo-600 hover:text-indigo-800 cursor-pointer"
                    >
                      <span>View Blueprints</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <a 
                      href={isIN ? "https://www.zomato.com/live" : "https://www.eventbrite.com"} 
                      target="_blank" 
                      rel="noopener noreferrer nofollow"
                      className="text-[11px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-0.5"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-slate-900">{isIN ? "Paytm Insider" : "Live Nation"}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700">Early-Bird Access</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-1">
                      {isIN 
                        ? "Curated sports tournaments (ISL, Cricket), music fests, and theater productions." 
                        : "Global concert promoter with verified fan presales and VIP backstage experience packages."}
                    </p>
                  </div>
                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <Link 
                      href={isIN ? "/events/paytm-insider" : "/events/live-nation"}
                      className="inline-flex items-center gap-1 text-xs font-black text-indigo-600 hover:text-indigo-800 cursor-pointer"
                    >
                      <span>View Blueprints</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <a 
                      href={isIN ? "https://insider.in" : "https://www.livenation.com"} 
                      target="_blank" 
                      rel="noopener noreferrer nofollow"
                      className="text-[11px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-0.5"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. FOOTER ADVISORY NOTE */}
      <div className="text-center py-4 border-t border-slate-200/80">
        <p className="text-[11px] text-slate-400 font-medium">
          Benefisto provides strategic booking intelligence, fare rule analysis, and verified partner channels. Always inspect final ticket fares on official booking portals prior to payment.
        </p>
      </div>

    </div>
  );
}
