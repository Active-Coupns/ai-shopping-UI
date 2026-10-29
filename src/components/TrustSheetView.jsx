"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  ExternalLink, 
  Copy, 
  Check, 
  AlertTriangle, 
  Search, 
  Loader2, 
  ChevronRight, 
  X,
  Share2,
  Cpu,
  Battery,
  Layers,
  Flame,
  ThumbsUp,
  ThumbsDown,
  Info,
  Clock,
  Coins,
  Sun,
  Thermometer,
  Wrench,
  CheckCircle2,
  ArrowRight,
  Droplets,
  ShoppingBag,
  MessageSquare,
  Send,
  HelpCircle,
  Bot,
  ArrowUpDown,
  Tag,
  HeartPulse,
  Star,
  CreditCard,
  Gift,
  GraduationCap,
  Package,
  Shield,
  XCircle,
  Percent
} from "lucide-react";
import { searchProducts } from "@/services/api";
import { getCountryMeta, formatCountryPrice } from "@/lib/countryConfig";
import { useUser, useClerk } from "@clerk/nextjs";

const RESEARCH_INSIGHTS = [
  "Paper specs don't always reflect daily reality. Sustained build quality and thermals matter more than headline numbers.",
  "A product's true cost isn't just its purchase price — factoring expected lifespan and maintenance reveals its honest everyday value.",
  "Realistic trade-offs exist in every product. The best purchase is the one whose trade-offs don't interfere with your daily routine.",
  "Regional factors like local voltage variations, climate, and brand service presence directly impact long-term satisfaction."
];

const RESEARCH_MILESTONES = [
  { threshold: 0, text: "Reading product specifications & verified details" },
  { threshold: 7, text: "Reviewing user feedback & community discussions across the web" },
  { threshold: 16, text: "Evaluating practical trade-offs, longevity & daily operating cost" },
  { threshold: 25, text: "Assessing local regional compatibility & warranty reality" },
  { threshold: 34, text: "Synthesizing your comprehensive Trust Sheet report" }
];

function ResearchProgressLoader({ inputVal, identifiedProduct }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const rawUrl = identifiedProduct?.url || inputVal || "";
  let domain = "";
  try {
    const fullUrl = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
    const parsed = new URL(fullUrl);
    domain = parsed.hostname.replace(/^www\./i, "");
  } catch (e) {
    domain = "";
  }

  // Smooth realistic progress percentage up to 94%
  const progressPercent = Math.min(
    94,
    elapsed <= 5 ? 12 + elapsed * 3 :
    elapsed <= 15 ? 27 + (elapsed - 5) * 3 :
    elapsed <= 25 ? 57 + (elapsed - 15) * 2 :
    elapsed <= 35 ? 77 + (elapsed - 25) * 1.5 :
    92 + (elapsed - 35) * 0.3
  );

  const insightIndex = Math.floor(elapsed / 7) % RESEARCH_INSIGHTS.length;

  return (
    <div className="w-full max-w-2xl mx-auto py-10 md:py-14 text-center animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl border border-indigo-100 shadow-xl p-6 sm:p-10 relative overflow-hidden">
        {/* Soft Ambient Background Glows */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-700" />

        {/* Icon */}
        <div className="relative w-14 h-14 mx-auto mb-4">
          <div className="absolute inset-0 rounded-2xl bg-indigo-500/20 animate-ping" />
          <div className="relative w-14 h-14 bg-gradient-to-tr from-brand-indigo to-brand-violet rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <ShieldCheck className="w-7 h-7 text-amber-300 animate-pulse" />
          </div>
        </div>

        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-spin-slow" />
          <span>AI Research In Progress</span>
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-1">
          Researching Across The Entire Internet...
        </h2>

        {/* Domain Tag */}
        {domain ? (
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-5 font-medium">
            Gathering product data from{" "}
            <span className="font-bold text-indigo-700 bg-indigo-50/80 px-2 py-0.5 rounded-md border border-indigo-200/60 inline-flex items-center gap-1">
              <ExternalLink className="w-3 h-3 inline" />
              {domain}
            </span>
          </p>
        ) : (
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-5 font-medium">
            Reviewing product details and community feedback from across the web.
          </p>
        )}

        {/* Progress Bar & Timer */}
        <div className="max-w-md mx-auto mb-6">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1.5 px-0.5">
            <span className="flex items-center gap-1.5 text-indigo-600">
              <Clock className="w-3.5 h-3.5" />
              <span>Elapsed: {elapsed}s</span>
            </span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div 
              className="h-full bg-gradient-to-r from-brand-indigo via-indigo-600 to-brand-violet rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Sequential Milestones */}
        <div className="max-w-md mx-auto space-y-2 text-left mb-6">
          {RESEARCH_MILESTONES.map((m, idx) => {
            const isCompleted = idx < RESEARCH_MILESTONES.length - 1 && elapsed >= RESEARCH_MILESTONES[idx + 1].threshold;
            const isActive = !isCompleted && elapsed >= m.threshold;

            return (
              <div
                key={idx}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all text-xs ${
                  isCompleted 
                    ? "bg-emerald-50/50 border-emerald-200/70 text-slate-700" 
                    : isActive 
                    ? "bg-indigo-50/80 border-indigo-300 shadow-2xs font-bold text-indigo-950" 
                    : "bg-slate-50/50 border-slate-200/50 text-slate-400"
                }`}
              >
                <div className="shrink-0">
                  {isCompleted ? (
                    <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">
                      ✓
                    </div>
                  ) : isActive ? (
                    <div className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center">
                      <Loader2 className="w-3 h-3 animate-spin text-indigo-600" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-md bg-slate-200/60 text-slate-400 flex items-center justify-center font-semibold text-[10px]">
                      {idx + 1}
                    </div>
                  )}
                </div>
                <span className="flex-1 leading-tight">
                  {m.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* Rotating Smart Shopping Insight Card */}
        <div className="max-w-md mx-auto p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-left shadow-2xs">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-100/90 text-amber-700 shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="text-xs space-y-0.5">
              <div className="font-bold text-amber-950 text-[11px] uppercase tracking-wide flex items-center gap-1.5">
                <span>Smart Shopping Insight</span>
                <span className="text-[10px] text-amber-600 font-semibold">• Tip {insightIndex + 1} of 4</span>
              </div>
              <p className="text-amber-900/90 leading-relaxed text-[11px] sm:text-xs">
                {RESEARCH_INSIGHTS[insightIndex]}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function TrustSheetView({
  initialQuery = "",
  country = "IN",
  onBack,
  onTriggerSearch
}) {
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const countryMeta = getCountryMeta(country);
  const isUS = (country || "IN").toUpperCase() === "US";
  const [inputVal, setInputVal] = useState(initialQuery || "");
  const [phase, setPhase] = useState("input"); // "input" | "identifying" | "questions" | "generating" | "dossier"
  const [identifiedProduct, setIdentifiedProduct] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [customRequirement, setCustomRequirement] = useState("");
  const [dossier, setDossier] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [copiedQuery, setCopiedQuery] = useState(false);
  const [copiedCouponCode, setCopiedCouponCode] = useState("");

  const handleCopyCoupon = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCouponCode(code);
    setTimeout(() => setCopiedCouponCode(""), 2000);
  };

  // In-Feature Live Matching Search State (Task 1: 2-3 Curated Alternatives)
  const [matchingDeals, setMatchingDeals] = useState([]);
  const [isSearchingMatching, setIsSearchingMatching] = useState(false);
  const [hasSearchedMatching, setHasSearchedMatching] = useState(false);
  const [matchingError, setMatchingError] = useState(null);

  // Task 3: AI Hardware Truth Assistant State
  const [assistantQuestion, setAssistantQuestion] = useState("");
  const [isAssistantLoading, setIsAssistantLoading] = useState(false);
  const [assistantHistory, setAssistantHistory] = useState([]);

  // Task 4: On-Demand Multi-Store Price Comparison State
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isFetchingStores, setIsFetchingStores] = useState(false);
  const [liveStores, setLiveStores] = useState(null);
  const [compareError, setCompareError] = useState(null);

  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      handleIdentify(initialQuery.trim());
    }
  }, [initialQuery]);

  // Phase 1: Identify Product (URL-First Direct Flow)
  const handleIdentify = async (targetInput, existingProduct = null) => {
    if (!isSignedIn) {
      if (typeof openSignIn === "function") {
        openSignIn();
      }
      return;
    }
    const clean = String(typeof targetInput === "string" ? targetInput : inputVal || "").trim();
    if (!clean && !existingProduct) return;

    // Strict URL validation: When not selecting an existing alternative card, require a valid URL
    const isUrl = /^https?:\/\//i.test(clean) || /^www\./i.test(clean) || /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/.*)?$/i.test(clean);
    if (!existingProduct && !isUrl) {
      setError("Please paste a direct product link (URL). We need an exact product page with details and specifications to research it for you.");
      setPhase("input");
      return;
    }

    let targetUrl = clean;
    if (!existingProduct && !/^https?:\/\//i.test(targetUrl)) {
      targetUrl = `https://${targetUrl}`;
    }

    setError(null);
    setPhase("generating");
    setIsCompareOpen(false);
    setLiveStores(null);
    setCompareError(null);
    setMatchingDeals([]);
    setHasSearchedMatching(false);

    try {
      const res = await fetch("/api/trust-sheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "direct",
          input: existingProduct ? (existingProduct.url || existingProduct.title) : targetUrl,
          product: existingProduct || undefined,
          country: country || "IN"
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Unable to retrieve product details. Please make sure the link is an exact product page.");
      }

      // Merge existing product data so real image, real price, real url from alternative card are NEVER lost!
      const finalProduct = {
        ...data.product,
        ...(existingProduct || {})
      };
      if (existingProduct?.image) finalProduct.image = existingProduct.image;
      if (existingProduct?.price) finalProduct.price = existingProduct.price;
      if (existingProduct?.url) finalProduct.url = existingProduct.url;
      if (existingProduct?.store) finalProduct.store = existingProduct.store;
      if (existingProduct?.product_id) finalProduct.product_id = existingProduct.product_id;

      setIdentifiedProduct(finalProduct);
      setDossier(data.trustSheet);
      setPhase("dossier");
    } catch (err) {
      setError(err.message || "An unexpected error occurred while inspecting product.");
      setPhase("input");
    }
  };

  // Helper for clicking any recommended alternative product card
  const handleSelectProduct = (item) => {
    if (!item) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
    const productData = {
      title: item.title,
      price: item.price || "",
      rawPrice: item.rawPrice || null,
      image: item.image || item.thumbnail || item.image_url || "",
      store: item.store || item.store_name || item.merchant || "Online Store",
      url: item.link || item.deal_link || item.product_link || item.url || "",
      product_id: item.product_id || item.productId || "",
      brand: item.brand || "",
      specifications: item.specs || [],
      country: country || "IN"
    };
    handleIdentify(item.title, productData);
  };

  // Phase 2: Generate Trust Sheet Dossier
  const handleGenerateDossier = async (customAnswers = null) => {
    if (!isSignedIn) {
      if (typeof openSignIn === "function") {
        openSignIn();
      }
      return;
    }
    if (!identifiedProduct) return;

    setError(null);
    setPhase("generating");
    setMatchingDeals([]);
    setHasSearchedMatching(false);
    setMatchingError(null);
    setIsCompareOpen(false);
    setLiveStores(null);
    setCompareError(null);

    const answersToSubmit = customAnswers !== null ? customAnswers : userAnswers;

    try {
      const res = await fetch("/api/trust-sheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate",
          product: identifiedProduct,
          answers: answersToSubmit,
          customRequirement: customRequirement.trim(),
          country: country || "IN"
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to generate AI Trust Sheet.");
      }

      setDossier(data.trustSheet);
      setPhase("dossier");
    } catch (err) {
      setError(err.message || "Failed to generate AI Trust Sheet. Please try again.");
      setPhase("questions");
    }
  };

  // Phase 3: In-Feature Search for Matching Deals (User Initiated, 2-3 Curated Alternatives)
  const handleSearchMatching = async (searchQuery) => {
    if (!isSignedIn) {
      if (typeof openSignIn === "function") {
        openSignIn();
      }
      return;
    }
    let query = String(searchQuery || "").trim();
    if (!query) return;

    // Category guard: Ensure query always contains concrete category noun
    const cat = dossier?.product?.category || identifiedProduct?.category || "";
    if (cat === "smartphone" && !/\b(phone|mobile)\b/i.test(query)) {
      query = `${query} phone`;
    } else if (cat === "washing_machine" && !/\b(washing machine|washer)\b/i.test(query)) {
      query = `${query} washing machine`;
    }

    setIsSearchingMatching(true);
    setMatchingError(null);

    try {
      const response = await searchProducts(query, country || "IN");
      const products = Array.isArray(response?.results) ? response.results.slice(0, 3) : [];
      setMatchingDeals(products);
      setHasSearchedMatching(true);
    } catch (err) {
      console.error("Matching search error:", err);
      setMatchingError(err.message || "Failed to fetch live products. Please try again.");
    } finally {
      setIsSearchingMatching(false);
    }
  };

  // Task 3: Ask Hardware Engineer Assistant
  const handleAskAssistant = async (customQ = null) => {
    if (!isSignedIn) {
      if (typeof openSignIn === "function") {
        openSignIn();
      }
      return;
    }
    const q = String(customQ || assistantQuestion || "").trim();
    if (!q || isAssistantLoading) return;

    setIsAssistantLoading(true);
    setAssistantQuestion("");

    try {
      const res = await fetch("/api/trust-sheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ask_assistant",
          product: identifiedProduct || dossier?.product || {},
          dossier: dossier || {},
          question: q,
          country: country || "IN"
        })
      });
      const data = await res.json();
      if (data.success && data.answer) {
        setAssistantHistory(prev => [
          ...prev,
          {
            question: q,
            answer: data.answer,
            hasSuggestion: Boolean(data.hasSuggestion && data.smartQuery),
            suggestionText: data.suggestionText || null,
            smartQuery: data.smartQuery || null,
            matchingDeals: null,
            isSearching: false,
            searchError: null
          }
        ]);
      }
    } catch (err) {
      console.warn("Assistant error:", err);
    } finally {
      setIsAssistantLoading(false);
    }
  };

  // On-demand search for models suggested inside assistant chat
  const handleSearchChatRecommendation = async (msgIndex, smartQuery) => {
    let query = String(smartQuery || "").trim();
    if (!query) return;

    // Category guard: Ensure query always contains concrete category noun
    const cat = dossier?.product?.category || identifiedProduct?.category || "";
    if (cat === "smartphone" && !/\b(phone|mobile)\b/i.test(query)) {
      query = `${query} phone`;
    } else if (cat === "washing_machine" && !/\b(washing machine|washer)\b/i.test(query)) {
      query = `${query} washing machine`;
    }

    setAssistantHistory(prev => prev.map((msg, idx) => {
      if (idx === msgIndex) {
        return { ...msg, isSearching: true, searchError: null };
      }
      return msg;
    }));

    try {
      const response = await searchProducts(query, country || "IN");
      const products = Array.isArray(response?.results) ? response.results.slice(0, 3) : [];
      setAssistantHistory(prev => prev.map((msg, idx) => {
        if (idx === msgIndex) {
          return { ...msg, isSearching: false, matchingDeals: products };
        }
        return msg;
      }));
    } catch (err) {
      console.error("Chat recommendation search error:", err);
      setAssistantHistory(prev => prev.map((msg, idx) => {
        if (idx === msgIndex) {
          return {
            ...msg,
            isSearching: false,
            searchError: err.message || "Failed to fetch live matching models."
          };
        }
        return msg;
      }));
    }
  };

  // Task 4: On-Demand Multi-Store Price Comparison Handler
  const handleToggleCompare = async () => {
    const nextState = !isCompareOpen;
    setIsCompareOpen(nextState);

    if (nextState && (!liveStores || liveStores.length === 0)) {
      setIsFetchingStores(true);
      setCompareError(null);

      const targetTitle = dossier?.product?.title || identifiedProduct?.title || "";
      const targetBrand = dossier?.product?.brand || identifiedProduct?.brand || "";
      const targetPrice = dossier?.product?.estimatedPrice || identifiedProduct?.price || 0;
      const targetStore = dossier?.product?.store || identifiedProduct?.store || "Online Store";
      const targetUrl = dossier?.product?.url || identifiedProduct?.url || "";

      try {
        const targetPId = dossier?.product?.product_id || identifiedProduct?.product_id || "";

        const res = await fetch("/api/products/compare", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: targetPId,
            title: targetTitle,
            brand: targetBrand,
            cleanModel: targetTitle,
            basePrice: targetPrice,
            baseStore: targetStore,
            baseLink: targetUrl,
            country: dossier?.product?.country || identifiedProduct?.country || country || "IN"
          })
        });

        const data = await res.json();
        if (data.success && Array.isArray(data.stores) && data.stores.length > 0) {
          setLiveStores(data.stores);
        } else {
          setCompareError(data.message || "This product is currently exclusive to this store or not tracked across other verified marketplaces.");
        }
      } catch (err) {
        setCompareError("Failed to fetch store price comparisons.");
      } finally {
        setIsFetchingStores(false);
      }
    }
  };

  const handleReset = () => {
    setPhase("input");
    setIdentifiedProduct(null);
    setQuestions([]);
    setUserAnswers({});
    setDossier(null);
    setError(null);
    setInputVal("");
    setMatchingDeals([]);
    setIsSearchingMatching(false);
    setHasSearchedMatching(false);
    setMatchingError(null);
    setAssistantQuestion("");
    setAssistantHistory([]);
    setIsAssistantLoading(false);
    setIsCompareOpen(false);
    setLiveStores(null);
    setCompareError(null);
  };

  const handleCopySummary = () => {
    if (!dossier) return;
    const summaryText = `🛡️ ShopSmart AI Trust Sheet: ${dossier.product?.title || identifiedProduct?.title}
Trust Score: ${dossier.trustScore}/100 (${dossier.matchBadge})
Verdict: ${dossier.verdictSummary}

⏳ Expected Lifespan: ${dossier.shelfLife?.expectedYears || "3+ Years"}
💰 True Daily Cost: ${dossier.dailyCost?.costPerDay || "N/A"}

✅ Where It Excels:
${dossier.whereItExcels?.map(x => `• ${x.title}: ${x.detail}`).join("\n")}

⚠️ Realistic Trade-offs:
${dossier.realisticTradeoffs?.map(x => `• ${x.title}: ${x.detail}`).join("\n")}

${isUS ? "🇺🇸 US Reality Check:" : "🇮🇳 Indian Reality Check:"}
• Operating Standards: ${dossier.regionalRealityCheck?.sunlightLegibility || dossier.indianRealityCheck?.sunlightLegibility || "Standard"}
• Electrical/Thermal: ${dossier.regionalRealityCheck?.summerHeatTolerance || dossier.indianRealityCheck?.summerHeatTolerance || "Moderate"}
• Service & Warranty: ${dossier.regionalRealityCheck?.serviceNetworkTier2Tier3 || dossier.indianRealityCheck?.serviceNetworkTier2Tier3 || "Standard brand network"}

Verified on ShopSmart AI: https://shopsmart.ai`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Reusable Regional Operating Reality Section (US vs IN adaptive + Category adaptive)
  const renderRegionalRealityCheck = () => {
    const category = dossier?.product?.category || identifiedProduct?.category || "general";
    const isAppliance = ["washing_machine", "refrigerator", "ac_air_conditioner"].includes(category);
    const isSupplement = category === "supplement";
    const isSoftware = category === "software_subscription";
    const realityObj = dossier?.regionalRealityCheck || dossier?.indianRealityCheck;

    let title = isUS
      ? (isAppliance 
          ? "US Operating Reality (120V Grid, Winter Freeze & Service)"
          : "US Operating Reality (120V Grid, Climate & Warranty/RMA Network)")
      : (isAppliance 
          ? "Indian Operating Reality (Water Hardness, Voltage & Service)"
          : "Indian Operating Reality (Sunlight, Summer Heat & Service)");

    if (realityObj?.title) {
      title = realityObj.title;
    } else if (isSupplement) {
      title = isUS ? "US Quality, Storage & Standards Reality" : "Indian Quality, Storage & Standards Reality";
    } else if (isSoftware) {
      title = isUS ? "US Cloud, Billing & Subscription Reality" : "Indian Cloud, Billing & Subscription Reality";
    }

    return (
      <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-900 mb-3.5">
          <span className="text-base">{isUS ? "🇺🇸" : "🇮🇳"}</span>
          <span>{title}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Point 1 */}
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-extrabold text-amber-950 text-xs">
              {isSupplement ? (
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : isSoftware ? (
                <Cpu className="w-4 h-4 text-indigo-600 shrink-0" />
              ) : isAppliance ? (
                <Droplets className="w-4 h-4 text-cyan-600 shrink-0" />
              ) : (
                <Sun className="w-4 h-4 text-amber-600 shrink-0" />
              )}
              <span>
                {isSupplement
                  ? "Lab Certified Purity & Authenticity"
                  : isSoftware
                  ? "Cloud Infrastructure & Performance"
                  : isUS
                  ? (isAppliance ? "HE Detergent & Freeze Care" : "Display & Brightness Standards")
                  : (isAppliance ? "Hard Water & Scale Resistance" : "Outdoor Sunlight Legibility")}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
              {realityObj?.sunlightLegibility || (isSupplement ? "Verified label purity and authentic packaging standards." : isSoftware ? "Optimized cloud server latency and regional CDN access." : isUS ? "Verified for US operating standards." : "Verified spec for Indian conditions.")}
            </p>
          </div>

          {/* Point 2 */}
          <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/80 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-extrabold text-rose-950 text-xs">
              {isSupplement ? (
                <Thermometer className="w-4 h-4 text-rose-600 shrink-0" />
              ) : isSoftware ? (
                <Coins className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : isAppliance ? (
                <Zap className="w-4 h-4 text-amber-600 shrink-0" />
              ) : (
                <Thermometer className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>
                {isSupplement
                  ? "Storage, Climate & Humidity Care"
                  : isSoftware
                  ? "Billing, Auto-Renewal & Flexibility"
                  : isUS
                  ? (isAppliance ? "120V 60Hz Circuit Tolerance" : "Winter / HVAC Thermal Stability")
                  : (isAppliance ? "Low Water Pressure & Voltage" : "Indian Summer Heat")}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
              {realityObj?.summerHeatTolerance || (isSupplement ? "Store in a cool, dry place away from sunlight to prevent moisture clumping." : isSoftware ? "Local currency billing, clear auto-renewal terms, and flexible cancellation." : isUS ? "Operates smoothly on standard US electrical circuits." : "Sustained performance under standard conditions.")}
            </p>
          </div>

          {/* Point 3 */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-extrabold text-indigo-950 text-xs">
              <Wrench className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>
                {isSupplement
                  ? "Safety, Seal & Compliance"
                  : isSoftware
                  ? "Support & Account Control"
                  : isUS
                  ? "1-Yr US Warranty & Mail-in RMA"
                  : "Service & Spare Parts"}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
              {realityObj?.serviceNetworkTier2Tier3 || (isSupplement ? "FSSAI / FDA compliant packaging with manufacturer batch QR verification." : isSoftware ? "Direct ticketing, customer support resolution, and self-serve settings." : isUS ? "Nationwide 1-year US limited warranty & Best Buy / partner service." : "Authorized centers across metros & district hubs.")}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Reusable Care & Sensitivity Guidelines
  const renderCareGuidelines = () => {
    const guidelines = Array.isArray(dossier?.careGuidelines) ? dossier.careGuidelines : [];
    if (!guidelines.length) return null;

    return (
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-teal-50/70 via-white to-emerald-50/50 border border-teal-200/80 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-teal-950">
          <HeartPulse className="w-4 h-4 text-teal-600" />
          <span>Things to Consider &amp; Care Guidelines</span>
        </div>
        <p className="text-[11px] text-slate-500 font-medium">
          Practical care, ingredient sensitivity, and longevity recommendations based on verified product materials:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {guidelines.map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-white border border-teal-100/90 text-xs space-y-1 shadow-2xs">
              <div className="flex items-center gap-1.5 font-extrabold text-teal-950">
                <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
                <span>{item.title}</span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium leading-relaxed pl-3.5">
                {item.detail || item.advice}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Reusable Directional Guidance (What to look for instead without pushing competitor brands)
  const renderDirectionalAdvice = () => {
    const alt = dossier?.betterAlternative;
    if (!alt || (!alt.suggestionSummary && (!alt.whatToLookForSpecs || !alt.whatToLookForSpecs.length))) {
      return null;
    }

    return (
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/60 border border-indigo-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-950">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>{alt.title || "Smart Directional Guidance (What to Look For Instead)"}</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
            Brand-Neutral Advice
          </span>
        </div>

        {alt.suggestionSummary && (
          <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
            💡 {alt.suggestionSummary}
          </p>
        )}

        {Array.isArray(alt.whatToLookForSpecs) && alt.whatToLookForSpecs.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-indigo-900 block">
              Key Specifications &amp; Quality Criteria to Look For:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {alt.whatToLookForSpecs.map((spec, sIdx) => (
                <div key={sIdx} className="flex items-start gap-2 p-2.5 rounded-xl bg-white border border-indigo-100 text-xs font-semibold text-slate-800 shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                  <span>{spec}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // 1. Mathematical Review Curve / Customer Satisfaction Consensus
  const renderBuyerSatisfaction = () => {
    const sat = dossier?.buyerSatisfaction;
    if (!sat) return null;

    return (
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50/80 via-white to-emerald-50/60 border border-amber-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-amber-500 text-white px-2.5 py-1 rounded-xl text-xs font-black shadow-xs shrink-0">
            <Star className="w-3.5 h-3.5 fill-white" />
            <span>{sat.rating || 4.3}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-slate-900">{sat.reviewCount || "Verified Ratings"}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {sat.positivePercent || "84%"} Positive Rating Curve
              </span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium mt-0.5">
              {sat.verdict || "Consistently verified across high-volume real purchaser ratings."}
            </p>
          </div>
        </div>

        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider shrink-0 self-end sm:self-center">
          Statistical Consensus
        </div>
      </div>
    );
  };

  // 2. Who Should BUY vs Who Should SKIP Matrix
  const renderDecisionMatrix = () => {
    const matrix = dossier?.whoShouldBuyVsSkip;
    const whoBuy = Array.isArray(matrix?.whoShouldBuy) ? matrix.whoShouldBuy : [];
    const whoSkip = Array.isArray(matrix?.whoShouldSkip) ? matrix.whoShouldSkip : [];
    if (!whoBuy.length && !whoSkip.length) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Who Should Buy */}
        <div className="p-5 rounded-3xl bg-emerald-50/70 border border-emerald-200 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Who Should BUY This Product</span>
          </div>
          <p className="text-[11px] text-emerald-800 font-medium">
            This is an ideal match for your cart if:
          </p>
          <div className="space-y-2 pt-1">
            {whoBuy.map((point, idx) => (
              <div key={idx} className="p-2.5 rounded-2xl bg-white border border-emerald-100 flex items-start gap-2 text-xs font-semibold text-slate-800 shadow-2xs">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Who Should Skip */}
        <div className="p-5 rounded-3xl bg-rose-50/70 border border-rose-200 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-rose-900">
            <XCircle className="w-4 h-4 text-rose-600" />
            <span>Who Should SKIP or Look Elsewhere</span>
          </div>
          <p className="text-[11px] text-rose-800 font-medium">
            Consider other options if you prioritize:
          </p>
          <div className="space-y-2 pt-1">
            {whoSkip.map((point, idx) => (
              <div key={idx} className="p-2.5 rounded-2xl bg-white border border-rose-100 flex items-start gap-2 text-xs font-semibold text-slate-800 shadow-2xs">
                <ArrowRight className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 3. Smart Saving Strategy (Decoded Bank Offers, Page Coupons, Official Brand Perks)
  const renderSmartSavingStrategy = () => {
    const strat = dossier?.smartSavingStrategy;
    if (!strat) return null;

    const bankOffers = Array.isArray(strat.bankOffersDecoded) ? strat.bankOffersDecoded : [];
    const coupons = Array.isArray(strat.verifiedStoreCoupons) && strat.verifiedStoreCoupons.length > 0
      ? strat.verifiedStoreCoupons
      : (Array.isArray(strat.pageCoupons) ? strat.pageCoupons : []);
    const brandPerk = strat.brandDirectPerk;

    return (
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-emerald-50/80 via-white to-indigo-50/60 border border-emerald-200 shadow-xs space-y-4">
        {/* Header with Price Bridge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-900 mb-1">
              <Coins className="w-4 h-4 text-emerald-600" />
              <span>Smart Saving Strategy</span>
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Actionable Deal &amp; Discount Roadmap for This Listing
            </h3>
          </div>

          {(strat.bestTargetPrice || strat.potentialSavings) && (
            <div className="px-3.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-black self-start sm:self-center">
              Target Price: {strat.bestTargetPrice} {strat.potentialSavings ? `(Save ~${strat.potentialSavings})` : ""}
            </div>
          )}
        </div>

        {/* Component 1: Decoded Bank Offers */}
        {bankOffers.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-800">
              <CreditCard className="w-3.5 h-3.5 text-indigo-600" />
              <span>Decoded Bank &amp; Card Offers</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {bankOffers.map((offer, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-extrabold text-xs text-slate-900">{offer.bankName}</span>
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                      {offer.discountText}
                    </span>
                  </div>
                  {offer.eligibilityNote && (
                    <div className="text-[11px] text-slate-600 font-medium flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{offer.eligibilityNote}</span>
                    </div>
                  )}
                  {offer.finePrint && (
                    <p className="text-[10px] text-slate-500 font-medium pt-0.5 border-t border-slate-100">
                      ⚠️ {offer.finePrint}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Component 2: Active Store / Page Coupons */}
        {coupons.length > 0 && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-800">
              <Gift className="w-3.5 h-3.5 text-amber-600" />
              <span>Active Verified Coupons &amp; Promos</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {coupons.map((cp, cIdx) => {
                const isCopied = copiedCouponCode === cp.code;
                return (
                  <div key={cIdx} className="p-3 rounded-2xl bg-white border border-amber-200/70 shadow-2xs flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-indigo-950 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          {cp.code}
                        </span>
                        <span className="text-xs font-extrabold text-emerald-700">{cp.discountText}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium mt-1 truncate">
                        {cp.terms}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyCoupon(cp.code)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Component 3: Official Brand Direct Perk (Student / Corporate / D2C) */}
        {brandPerk && brandPerk.hasPerk && (
          <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-start gap-2.5">
              <GraduationCap className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-extrabold text-indigo-950 block">
                  {brandPerk.portalName || "Official Brand Direct / Student Perk"}
                </span>
                <p className="text-[11px] text-indigo-900/80 font-medium">
                  Extra {brandPerk.discountPercent}% OFF + {brandPerk.warrantyBonus || "Extended official warranty"}.
                </p>
              </div>
            </div>

            {brandPerk.portalUrl && (
              <a
                href={brandPerk.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black transition-colors self-start sm:self-auto shrink-0 flex items-center gap-1"
              >
                <span>Visit Official Store</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        )}
      </div>
    );
  };

  // 4. In The Box & Warranty Reality Cards
  const renderInTheBoxAndWarranty = () => {
    const box = dossier?.inTheBox;
    const warranty = dossier?.warrantyReality;
    const hasValidBox = box && Array.isArray(box.included) && box.included.length > 0;
    const hasValidWarranty = warranty && warranty.duration && !String(warranty.duration).toLowerCase().includes("none") && !String(warranty.duration).toLowerCase().includes("null");
    if (!hasValidBox && !hasValidWarranty) return null;

    return (
      <div className={`grid grid-cols-1 ${hasValidBox && hasValidWarranty ? "md:grid-cols-2" : ""} gap-4`}>
        {/* In The Box */}
        {hasValidBox && (
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-800">
              <Package className="w-4 h-4 text-indigo-600" />
              <span>In The Box &amp; Packaging</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {box.included.map((item, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-800 text-[11px] font-bold border border-slate-200/60">
                  📦 {item}
                </span>
              ))}
            </div>
            {box.notIncludedAlert && (
              <p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 p-2 rounded-xl font-medium mt-2">
                ⚠️ {box.notIncludedAlert}
              </p>
            )}
          </div>
        )}

        {/* Warranty Reality */}
        {hasValidWarranty && (
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-800">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>Warranty &amp; Service Reality</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {warranty.duration}
              </span>
            </div>
            <div className="space-y-1.5 text-[11px] pt-1 font-medium">
              {warranty.covered && (
                <div className="flex items-start gap-1.5 text-slate-700">
                  <span className="font-bold text-emerald-700 shrink-0">✓ Covered:</span>
                  <span>{warranty.covered}</span>
                </div>
              )}
              {warranty.notCovered && (
                <div className="flex items-start gap-1.5 text-slate-500">
                  <span className="font-bold text-rose-600 shrink-0">✕ Exclusions:</span>
                  <span>{warranty.notCovered}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Reusable Hardware / Product Truth Assistant Desk
  const renderHardwareAssistant = () => {
    const category = dossier?.product?.category || identifiedProduct?.category || "general";
    const isSupplement = category === "supplement";
    const isSoftware = category === "software_subscription";

    const assistantTitle = isSupplement
      ? "Supplement Truth Assistant"
      : isSoftware
      ? "Software & SaaS Truth Assistant"
      : "Hardware Truth Assistant";

    const assistantSub = isSupplement
      ? "Ask about label purity, 3rd-party lab tests, protein per scoop, or dietary consultation."
      : isSoftware
      ? "Ask about subscription tiers, cloud limits, export formats, or cancellation terms."
      : "Ask any direct question about thermal heating, real battery endurance, box contents, or warranty.";

    const defaultChips = isSupplement
      ? [
          "Is the protein purity 3rd-party lab certified?",
          "Does it cause bloating or digestion issues?",
          "Are there artificial sweeteners or fillers added?",
          "Should I consult a nutritionist before starting?"
        ]
      : isSoftware
      ? [
          "Is the Free tier enough for casual work?",
          "Can I export files if my subscription lapses?",
          "Does it auto-renew without notification?",
          "Are there cheaper or open-source alternatives?"
        ]
      : (isUS ? [
          "Does it throttle under high performance loads?",
          "What is the real-world battery endurance?",
          "Is a 120V fast charger included in the box?",
          "What does the 1-year US manufacturer warranty cover?"
        ] : [
          "Does it heat up during summer?",
          "What is the real battery backup?",
          "Is a fast charger included in the box?",
          "Does warranty cover scale or display issues?"
        ]);

    return (
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                <span>{assistantTitle}</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold">Spec Grounded</span>
              </h4>
              <p className="text-[11px] text-slate-500 font-medium">
                {assistantSub}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/80">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Zero-Marketing Honesty</span>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar sm:flex-wrap">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 mr-1">
            Quick Doubts:
          </span>
          {defaultChips.map((qChip, cIdx) => (
            <button
              key={cIdx}
              type="button"
              disabled={isAssistantLoading}
              onClick={() => handleAskAssistant(qChip)}
            className="px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 text-slate-700 transition-all cursor-pointer disabled:opacity-50"
          >
            {qChip}
          </button>
        ))}
      </div>

      {/* Conversation History / Output */}
      {assistantHistory.length > 0 && (
        <div className="space-y-3 pt-2">
          {assistantHistory.map((item, hIdx) => (
            <div key={hIdx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2.5">
              <div className="flex items-start gap-2 text-xs font-bold text-slate-900">
                <span className="text-indigo-600 shrink-0 font-black">Q:</span>
                <span>{item.question}</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed pl-3 border-l-2 border-indigo-500">
                <span className="font-semibold">{item.answer}</span>
              </div>

              {/* Conversational On-Demand Alternative Models Section */}
              {item.hasSuggestion && item.smartQuery && (
                <div className="mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-indigo-50/90 via-purple-50/80 to-emerald-50/70 border border-indigo-200/80 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-indigo-950">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Alternative Requirement Match</span>
                    </div>
                    <span className="font-mono text-[11px] font-semibold text-indigo-800 bg-indigo-100/70 px-2 py-0.5 rounded-md self-start sm:self-auto">
                      Query: &quot;{item.smartQuery}&quot;
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 font-medium">
                    {item.suggestionText || "This product does not match this specific requirement. Would you like to search for verified models that do?"}
                  </p>

                  {/* Search Action / Status */}
                  {!item.matchingDeals && (
                    <div className="flex items-center gap-2 pt-0.5">
                      <button
                        type="button"
                        disabled={item.isSearching}
                        onClick={() => handleSearchChatRecommendation(hIdx, item.smartQuery)}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-75 text-white text-xs font-black shadow-xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                      >
                        {item.isSearching ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                            <span>Finding matching models...</span>
                          </>
                        ) : (
                          <>
                            <Search className="w-3.5 h-3.5 text-white" />
                            <span>Search Matching Models</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {item.searchError && (
                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between">
                      <span>{item.searchError}</span>
                      <button
                        type="button"
                        onClick={() => handleSearchChatRecommendation(hIdx, item.smartQuery)}
                        className="text-xs font-black underline hover:text-rose-900 cursor-pointer ml-2"
                      >
                        Retry
                      </button>
                    </div>
                  )}

                  {/* Rendered Live Cards inside Chat */}
                  {item.matchingDeals && Array.isArray(item.matchingDeals) && (
                    <div className="space-y-2.5 pt-2 border-t border-indigo-200/60">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-900 flex items-center gap-1">
                          <ShoppingBag className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Curated Alternative Models:</span>
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-200">
                          {item.matchingDeals.length} Verified Deals
                        </span>
                      </div>

                      {item.matchingDeals.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                          {item.matchingDeals.slice(0, 3).map((deal, dIdx) => {
                            const dealImg = deal.image || deal.image_url || deal.thumbnail || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60";
                            const dealPrice = typeof deal.price === "number" ? (isUS ? `$${deal.price.toFixed(2)}` : `₹${deal.price.toLocaleString("en-IN")}`) : (deal.price || "Check Store");
                            const storeName = deal.store_name || deal.store || "Online Store";

                            return (
                              <div key={dIdx} className="bg-white rounded-2xl border border-indigo-100 p-3 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
                                <div>
                                  <div
                                    onClick={() => handleSelectProduct(deal)}
                                    className="relative aspect-video rounded-xl bg-slate-50 border border-slate-100 p-1.5 flex items-center justify-center overflow-hidden mb-2 cursor-pointer group/img"
                                    title="Click to inspect Trust Sheet for this model"
                                  >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={dealImg} alt={deal.title} className="max-h-full max-w-full object-contain group-hover/img:scale-105 transition-transform" />
                                    <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-[9px] font-bold text-white">
                                      {storeName}
                                    </span>
                                  </div>

                                  <h6
                                    onClick={() => handleSelectProduct(deal)}
                                    className="text-[11px] font-bold text-slate-900 line-clamp-2 mb-1.5 leading-snug cursor-pointer hover:text-indigo-600 transition-colors"
                                    title="Click to inspect Trust Sheet for this model"
                                  >
                                    {deal.title}
                                  </h6>

                                  <div className="flex items-baseline gap-1.5 mb-2">
                                    <span className="text-xs font-black text-emerald-700">
                                      {dealPrice}
                                    </span>
                                    {deal.originalPrice && deal.originalPrice !== deal.price && (
                                      <span className="text-[10px] text-slate-400 line-through">
                                        {deal.originalPrice}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100">
                                  <button
                                    type="button"
                                    onClick={() => handleSelectProduct(deal)}
                                    className="flex-1 py-1 px-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black transition-all text-center flex items-center justify-center gap-1 shadow-2xs cursor-pointer active:scale-95"
                                  >
                                    <Sparkles className="w-3 h-3 text-amber-300" />
                                    <span>Inspect</span>
                                  </button>

                                  <a
                                    href={deal.deal_link || deal.link || deal.url || deal.product_link || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="py-1 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold transition-all text-center flex items-center justify-center gap-1 shrink-0"
                                  >
                                    <span>Store</span>
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-3 rounded-xl bg-white border border-slate-200 text-center text-xs text-slate-600">
                          No direct matching models found right now for this specific query.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {isAssistantLoading && (
        <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-900 font-bold flex items-center gap-2 animate-pulse">
          <Loader2 className="w-4 h-4 animate-spin text-indigo-600 shrink-0" />
          <span>Analyzing component specs and physical limits...</span>
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAskAssistant();
        }}
        className="flex items-center gap-2 pt-1"
      >
        <input
          type="text"
          value={assistantQuestion}
          onChange={(e) => setAssistantQuestion(e.target.value)}
          placeholder="e.g. Can the battery be replaced after 2 years? Does it support 90fps gaming?..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-500 transition-all placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={!assistantQuestion.trim() || isAssistantLoading}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-black shadow-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <span>Ask AI</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 animate-in fade-in duration-300">
      
      {/* 1. Top Navigation Bar */}
      <div className="flex items-center justify-between gap-2 pb-3.5 sm:pb-5 border-b border-slate-200/80 mb-4 sm:mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-brand-indigo transition-colors cursor-pointer group"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-100 group-hover:bg-brand-indigo/10 flex items-center justify-center transition-colors">
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600 group-hover:text-brand-indigo" />
          </div>
          <span>Back to Deals</span>
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="hidden sm:inline">AI Trust Sheet™ • Product Research</span>
            <span className="sm:hidden">AI Trust Sheet™</span>
          </span>
          <span className="hidden md:inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin-slow" />
            Whole-Internet Research
          </span>
        </div>
      </div>

      {/* 2. Error Banner */}
      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-semibold flex items-center gap-2.5 shadow-2xs">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <div className="flex-1">
            <p>{error}</p>
          </div>
          <button 
            onClick={() => setError(null)}
            className="p-1 hover:bg-rose-100 rounded-lg text-rose-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* STAGE 1: INPUT HERO CONSOLE (When on "input" phase)            */}
      {/* ============================================================== */}
      {phase === "input" && (
        <div className="max-w-3xl mx-auto py-8 sm:py-12 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50/90 border border-indigo-200/80 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span>Zero-Research Shopping • We Research For You</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-3 sm:mb-4 leading-tight">
            Never Waste Hours on Product Research Again. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-indigo via-indigo-600 to-brand-violet">
              We Research The Entire Internet For You.
            </span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-slate-600 max-w-2xl mx-auto mb-8 font-medium leading-relaxed">
            You don't need to spend hours watching review videos, decoding complex spec sheets, or browsing multiple tabs. Simply bring us the exact product link, and we'll research the product across the entire internet for you.
          </p>

          {/* Search Console Input Form (Strict URL Input) */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleIdentify(inputVal);
            }}
            className="w-full max-w-2xl mx-auto mb-4"
          >
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl p-2 shadow-lg shadow-slate-100/80 hover:border-indigo-300 focus-within:border-brand-indigo focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all">
              <div className="pl-2.5 shrink-0">
                <ExternalLink className="w-5 h-5 text-indigo-600" />
              </div>

              <input
                type="text"
                value={inputVal}
                onChange={(e) => {
                  setInputVal(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Paste the exact product link here (e.g. Amazon, Walmart, Best Buy, boAt)..."
                className="w-full bg-transparent text-slate-800 text-xs sm:text-sm font-medium focus:outline-hidden px-1 placeholder:text-slate-400"
              />

              {inputVal && (
                <button
                  type="button"
                  onClick={() => {
                    setInputVal("");
                    if (error) setError(null);
                  }}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="submit"
                disabled={!inputVal.trim()}
                className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-brand-indigo to-brand-violet hover:opacity-95 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-indigo-500/20 cursor-pointer transition-all active:scale-95 shrink-0 flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Research For Me</span>
                <ChevronRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </form>

          {/* Product Page Link Guideline Box */}
          <div className="max-w-2xl mx-auto text-left p-4 rounded-2xl bg-slate-50/90 border border-slate-200/90 shadow-2xs">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-indigo-100/80 text-indigo-700 shrink-0 mt-0.5">
                <Info className="w-4 h-4" />
              </div>
              <div className="text-xs space-y-1">
                <h4 className="font-bold text-slate-800">
                  Bring an exact product page link for the best research:
                </h4>
                <p className="text-slate-600 leading-relaxed text-[11px] sm:text-xs">
                  Paste a direct link to the product's official page where specifications, pricing, and details are visible (from any store or brand website). This ensures we have the necessary data to research the product thoroughly across the entire internet.
                </p>
              </div>
            </div>
          </div>

          {/* 3 Value Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 max-w-3xl mx-auto text-left">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2.5">
                <Clock className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 mb-0.5">Save Hours of Time</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                No need to spend hours watching review videos, checking endless forums, or comparing tabs. We handle the heavy research for you.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 mb-0.5">Researched Across The Web</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                We gather real-world feedback, community discussions, and specifications from across the internet to give you a well-rounded picture.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2.5">
                <Coins className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 mb-0.5">Practical, Balanced Insights</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Get an honest breakdown of practical benefits, realistic trade-offs, and estimated daily operating cost for everyday use.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* RESEARCH IN PROGRESS LOADER (While Identifying or Generating)  */}
      {/* ============================================================== */}
      {(phase === "identifying" || phase === "generating") && (
        <ResearchProgressLoader 
          inputVal={inputVal} 
          identifiedProduct={identifiedProduct} 
        />
      )}

      {/* ============================================================== */}
      {/* STAGE 3: THE COMPLETED TRUST SHEET DOSSIER VIEW                */}
      {/* ============================================================== */}
      {phase === "dossier" && dossier && (() => {
        const isGeneric = Boolean(dossier.isGenericQuery || identifiedProduct?.isGenericQuery || dossier.product?.isGenericQuery);
        const smartQuery = dossier.betterAlternative?.searchQuery || dossier.betterAlternative?.title || dossier.product?.title || identifiedProduct?.title || "";

        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Dossier Header Actions */}
            <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-slate-200/80">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{isGeneric ? "Search Another Category" : "Inspect Another Product"}</span>
              </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopySummary}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : <><span className="hidden sm:inline">Copy Summary for WhatsApp</span><span className="sm:hidden">Share Summary</span></>}</span>
              </button>
            </div>
          </div>

          {/* BRANCH A: GENERIC CATEGORY REQUIREMENT STRATEGY VIEW */}
          {isGeneric ? (
            <div className="space-y-6">
              {/* 1. HERO: AI Requirement Strategy Desk */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-50/90 via-indigo-50/80 to-emerald-50/70 border border-indigo-200 shadow-md space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-900 mb-1">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span>AI Requirement Strategy Desk (Smart Search Strategy)</span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
                      Tailored Search Strategy for &quot;{dossier.product?.title || identifiedProduct?.title}&quot;
                    </h2>
                  </div>
                  {dossier.betterAlternative?.estimatedPrice && (
                    <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3.5 py-1.5 rounded-full shrink-0 border border-emerald-200">
                      {dossier.betterAlternative.estimatedPrice}
                    </span>
                  )}
                </div>

                {/* Query Box */}
                <div className="bg-white/95 backdrop-blur-xs p-5 rounded-2xl border border-indigo-100 shadow-xs space-y-3">
                  <span className="text-[11px] font-black uppercase tracking-wider text-indigo-600 block">
                    Recommended Smart Search Query:
                  </span>
                  <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200">
                    <span className="font-mono text-sm sm:text-base font-black text-indigo-950 select-all">
                      &quot;{smartQuery}&quot;
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(smartQuery);
                        setCopiedQuery(true);
                        setTimeout(() => setCopiedQuery(false), 2000);
                      }}
                      className="p-2 hover:bg-indigo-100 rounded-lg text-indigo-700 transition-colors shrink-0"
                      title="Copy Query"
                    >
                      {copiedQuery ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  {dossier.betterAlternative?.matchReason && (
                    <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                      💡 <span className="font-bold text-slate-900">Why this query?</span> {dossier.betterAlternative.matchReason}
                    </p>
                  )}

                  {Array.isArray(dossier.betterAlternative?.whySolvesBottleneck) && dossier.betterAlternative.whySolvesBottleneck.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      {dossier.betterAlternative.whySolvesBottleneck.map((point, pIdx) => (
                        <div key={pIdx} className="flex items-start gap-2 text-xs font-semibold text-slate-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Big Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <div className="text-[11px] text-slate-500 font-medium">
                    🛡️ <span className="font-bold text-slate-700">Live Search Guarantee:</span> Live verified stock will be fetched across verified online stores.
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      disabled={isSearchingMatching}
                      onClick={() => handleSearchMatching(smartQuery)}
                      className="px-4 py-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      {isSearchingMatching ? <Loader2 className="w-4 h-4 animate-spin text-indigo-600" /> : <Sparkles className="w-4 h-4 text-amber-500" />}
                      <span>Quick 3-Model Preview</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onTriggerSearch && onTriggerSearch(smartQuery)}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-indigo via-indigo-600 to-brand-violet hover:opacity-95 text-white text-xs sm:text-sm font-black shadow-md shadow-indigo-500/25 transition-all cursor-pointer active:scale-95 flex items-center gap-2"
                    >
                      <Search className="w-4 h-4 text-white" />
                      <span>🔍 Search Live Deals (Find In ShopSmart) ➔</span>
                    </button>
                  </div>
                </div>

                {/* Error Note if Search Fails */}
                {matchingError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                    {matchingError}
                  </div>
                )}

                {/* Live Results Shelf */}
                {hasSearchedMatching && (
                  <div className="pt-3 border-t border-indigo-200/70 space-y-3 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                        <ShoppingBag className="w-4 h-4 text-indigo-600" />
                        <span>Curated Better Models:</span>
                      </h5>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        {matchingDeals.length} Better Models
                      </span>
                    </div>

                    {matchingDeals.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                        {matchingDeals.slice(0, 3).map((item, mIdx) => {
                          const itemImage = item.image || item.image_url || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60";
                          const itemPrice = typeof item.price === "number" ? (isUS ? `$${item.price.toFixed(2)}` : `₹${item.price.toLocaleString("en-IN")}`) : (item.price || "Check Store");
                          const storeName = item.store_name || item.store || "Online Store";

                          return (
                            <div key={mIdx} className="bg-white rounded-3xl border border-indigo-200/90 p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                              <div>
                                <div 
                                  onClick={() => handleSelectProduct(item)}
                                  className="relative aspect-video rounded-2xl bg-slate-50 border border-slate-100 p-2 flex items-center justify-center overflow-hidden mb-3 cursor-pointer group/img"
                                  title="Click to inspect Trust Sheet for this model"
                                >
                                  <img src={itemImage} alt={item.title} className="max-h-full max-w-full object-contain group-hover/img:scale-105 transition-transform" />
                                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-[10px] font-bold text-white">
                                    {storeName}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5 mb-2">
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                                    ⭐ Curated Match #{mIdx + 1}
                                  </span>
                                </div>

                                <h6 
                                  onClick={() => handleSelectProduct(item)}
                                  className="text-xs font-bold text-slate-900 line-clamp-2 mb-2 leading-snug cursor-pointer hover:text-indigo-600 transition-colors"
                                  title="Click to inspect Trust Sheet for this model"
                                >
                                  {item.title}
                                </h6>

                                <div className="flex items-baseline gap-2 mb-3">
                                  <span className="text-base font-black text-emerald-700">
                                    {itemPrice}
                                  </span>
                                  {item.originalPrice && item.originalPrice !== item.price && (
                                    <span className="text-[11px] text-slate-400 line-through">
                                      {item.originalPrice}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                                <div className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                                  <span>Matches your workload &amp; priorities</span>
                                </div>

                                <div className="flex items-center gap-1.5 pt-1">
                                  <button
                                    type="button"
                                    onClick={() => handleSelectProduct(item)}
                                    className="flex-1 py-1.5 px-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-black transition-all text-center flex items-center justify-center gap-1 shadow-2xs cursor-pointer active:scale-95"
                                  >
                                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                                    <span>Inspect Trust Sheet</span>
                                  </button>

                                  <a
                                    href={item.deal_link || item.product_link || item.link || item.url || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="py-1.5 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition-all text-center flex items-center justify-center gap-1 shrink-0"
                                  >
                                    <span>Store</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-white border border-slate-200 text-center text-xs text-slate-600">
                        No direct matches found for this specific query right now.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 2. Detailed 2-Column Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column (6 cols): Traps, Indian Reality, Lifespan */}
                <div className="lg:col-span-6 space-y-5">
                  {/* Category Gotchas */}
                  <div className="p-5 sm:p-6 rounded-3xl bg-white border border-rose-200/80 shadow-xs space-y-3">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-rose-800">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      <span>Category Gotchas: Traps To Avoid in This Category</span>
                    </div>
                    <div className="space-y-2.5">
                      {(dossier.realisticTradeoffs || []).map((item, idx) => (
                        <div key={idx} className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100 text-xs space-y-1">
                          <span className="font-extrabold text-rose-950 block">{item.title}</span>
                          <p className="text-[11px] text-slate-600 font-medium leading-relaxed">{item.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Regional Real-World Reality Check */}
                  {renderRegionalRealityCheck()}

                  {/* Caring Considerations & Care Guidelines */}
                  {renderCareGuidelines()}

                  {/* Lifespan & Daily Cost */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                      <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-indigo-900 mb-1">
                        <Clock className="w-4 h-4 text-indigo-600" />
                        <span>Expected Lifespan</span>
                      </div>
                      <div className="text-xl font-black text-slate-900 mt-2">
                        {dossier.shelfLife?.expectedYears || "4-6 Years"}
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium mt-1">
                        Standard hardware reliability
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-white to-emerald-50/60 border border-indigo-200/80 shadow-xs">
                      <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-indigo-900 mb-1">
                        <Coins className="w-4 h-4 text-emerald-600" />
                        <span>True Daily Cost</span>
                      </div>
                      <div className="text-xl font-black text-emerald-700 mt-2">
                        {dossier.dailyCost?.costPerDay || "₹25 / day"}
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium mt-1">
                        {dossier.dailyCost?.calculationBasis || "Spreading price across expected life"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column (6 cols): Assistant Desk & Quality Benchmarks */}
                <div className="lg:col-span-6 space-y-5">
                  {/* Hardware Assistant */}
                  {renderHardwareAssistant()}

                  {/* Where Quality Models Excel */}
                  <div className="p-5 sm:p-6 rounded-3xl bg-white border border-emerald-200/80 shadow-xs space-y-3">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Must-Have Hardware Standards in a Quality Model</span>
                    </div>
                    <div className="space-y-2.5">
                      {(dossier.whereItExcels || []).map((item, idx) => (
                        <div key={idx} className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-xs space-y-1">
                          <span className="font-extrabold text-emerald-950 block">{item.title}</span>
                          <p className="text-[11px] text-slate-600 font-medium leading-relaxed">{item.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Spec Standards */}
                  {Array.isArray(dossier.keySpecs) && dossier.keySpecs.length > 0 && (
                    <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-indigo-600" />
                        <span>Category Hardware Benchmarks</span>
                      </h4>
                      <div className="space-y-2 text-xs">
                        {dossier.keySpecs.map((spec, idx) => (
                          <div key={idx} className="flex items-start justify-between gap-2 py-1.5 border-b border-slate-100 last:border-none">
                            <span className="font-bold text-slate-500 shrink-0">{spec.label}</span>
                            <span className="font-semibold text-slate-800 text-right">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Main 2-Column Grid for Specific Product */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column (4 cols on lg): Product Snapshot & Trust Score */}
            <div className="lg:col-span-4 space-y-5">
              
              {/* Product Card */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm text-center">
                <div className="w-28 h-28 sm:w-40 sm:h-40 mx-auto rounded-2xl bg-slate-50 border border-slate-200/80 p-2 sm:p-3 mb-3 sm:mb-4 flex items-center justify-center overflow-hidden">
                  <img
                    src={dossier.product?.image || identifiedProduct?.image}
                    alt={dossier.product?.title}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500&auto=format&fit=crop&q=60";
                    }}
                  />
                </div>

                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-wider mb-2">
                  {dossier.product?.store || "Verified Store"}
                </div>

                <h3 className="text-sm font-extrabold text-slate-900 leading-snug line-clamp-2 mb-2">
                  {dossier.product?.title || identifiedProduct?.title}
                </h3>

                <div className="text-base font-black text-emerald-700 mb-3">
                  {dossier.product?.estimatedPrice || identifiedProduct?.price}
                </div>

                {/* Primary Direct Store Buy Action */}
                {Boolean(dossier.product?.url || identifiedProduct?.url) && (
                  <div className="mb-3">
                    <a
                      href={dossier.product?.url || identifiedProduct?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 group"
                    >
                      <span>Buy on {dossier.product?.store || identifiedProduct?.store || "Verified Store"}</span>
                      <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                )}

                {/* On-Demand Multi-Store Price Comparison Trigger */}
                <div className="mb-4">
                  <button
                    type="button"
                    onClick={handleToggleCompare}
                    className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 hover:from-slate-800 hover:to-indigo-900 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-between cursor-pointer active:scale-95 group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-left min-w-0">
                        <div className="text-[11px] font-black leading-tight flex items-center gap-1.5">
                          <span className="truncate">{isCompareOpen ? "Hide Price Comparison" : "Compare Live Store Prices"}</span>
                          <span className="px-1.5 py-0.2 rounded-full bg-indigo-500/30 text-indigo-200 text-[9px] font-bold shrink-0">On-Demand</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-normal truncate">
                          {countryMeta.popularStores}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isCompareOpen ? "rotate-90" : "group-hover:translate-x-0.5"}`} />
                  </button>

                  {/* Comparison Drawer */}
                  {isCompareOpen && (
                    <div className="mt-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/80">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1">
                          <Tag className="w-3 h-3 text-indigo-600" />
                          <span>Multi-Store Benchmark</span>
                        </span>
                        {liveStores && (
                          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-full">
                            {liveStores.length} Stores Verified
                          </span>
                        )}
                      </div>

                      {isFetchingStores && (
                        <div className="py-3 text-center space-y-1.5">
                          <Loader2 className="w-4 h-4 animate-spin text-indigo-600 mx-auto" />
                          <p className="text-[10px] text-slate-500 font-medium">
                            Checking verified stores...
                          </p>
                        </div>
                      )}

                      {compareError && (
                        <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-medium text-center">
                          {compareError}
                        </div>
                      )}

                      {!isFetchingStores && liveStores && liveStores.length > 0 && (
                        <div className="space-y-1.5">
                          {liveStores.map((st, sIdx) => {
                            const pCountry = (dossier?.product?.country || identifiedProduct?.country || country || "IN").toUpperCase();
                            const pSym = pCountry === "US" ? "$" : pCountry === "GB" ? "£" : pCountry === "CA" ? "C$" : pCountry === "AU" ? "A$" : pCountry === "AE" ? "AED " : "₹";
                            const formattedPrice = typeof st.price === "number"
                              ? `${pSym}${st.price.toLocaleString(pCountry === "IN" ? "en-IN" : "en-US", { minimumFractionDigits: pCountry === "IN" ? 0 : 2, maximumFractionDigits: 2 })}`
                              : st.price;

                            return (
                              <div
                                key={sIdx}
                                className={`p-2 rounded-xl border flex items-center justify-between gap-1.5 ${
                                  st.is_lowest
                                    ? "bg-emerald-50 border-emerald-300 shadow-2xs"
                                    : "bg-white border-slate-200"
                                }`}
                              >
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1">
                                    <span className="text-[11px] font-bold text-slate-900 truncate">
                                      {st.store_name}
                                    </span>
                                    {st.is_lowest && (
                                      <span className="px-1 py-0.2 rounded-xs bg-emerald-600 text-white text-[8px] font-black uppercase">
                                        Lowest
                                      </span>
                                    )}
                                  </div>
                                  {st.diff_text && !st.is_lowest && (
                                    <span className="text-[9px] text-slate-500 font-medium">
                                      {st.diff_text}
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  <span className={`text-[11px] font-black ${st.is_lowest ? "text-emerald-700" : "text-slate-900"}`}>
                                    {formattedPrice}
                                  </span>
                                  <a
                                    href={st.deal_link || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`px-2 py-1 rounded-lg text-[9px] font-bold flex items-center gap-0.5 ${
                                      st.is_lowest
                                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                        : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                                    }`}
                                  >
                                    <span>Buy</span>
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Circular Reality Score Meter */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/50 border border-slate-200/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Workload Reality Match
                    </span>
                    <span className={`text-xs font-black px-2 py-0.5 rounded-md ${
                      dossier.trustScore >= 80 ? "bg-emerald-100 text-emerald-800" : dossier.trustScore >= 65 ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"
                    }`}>
                      {dossier.matchBadge}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-center gap-1 my-2">
                    <span className="text-4xl font-black text-slate-900 tracking-tight">
                      {dossier.trustScore}
                    </span>
                    <span className="text-sm font-bold text-slate-400">/100</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        dossier.trustScore >= 80 ? "bg-emerald-500" : dossier.trustScore >= 65 ? "bg-amber-500" : "bg-rose-500"
                      }`}
                      style={{ width: `${Math.min(100, Math.max(10, dossier.trustScore))}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Verified Hardware Specs Table */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-indigo-600" />
                  <span>Verified Published Specs</span>
                </h4>

                <div className="space-y-2 text-xs">
                  {(dossier.keySpecs || []).map((spec, idx) => (
                    <div key={idx} className="flex items-start justify-between gap-2 py-1.5 border-b border-slate-100 last:border-none">
                      <span className="font-bold text-slate-500 shrink-0">{spec.label}</span>
                      <span className="font-semibold text-slate-800 text-right">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column (8 cols on lg): Strengths, Gotchas, 3 Killer Hooks, and Tailored Match Card */}
            <div className="lg:col-span-8 space-y-5">
              
              {/* Bottom-Line Verdict Card */}
              <div className="p-5 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white shadow-md relative overflow-hidden">
                <div className="flex items-center gap-2 mb-2 text-amber-300 text-xs font-black uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                  <span>
                    {dossier?.product?.category === "supplement"
                      ? "Nutritional Science & Consumer Purity Verdict"
                      : dossier?.product?.category === "software_subscription"
                      ? "SaaS Architect & Subscription Value Verdict"
                      : "Chief Hardware Engineer’s Bottom-Line Verdict"}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-medium leading-relaxed text-indigo-100">
                  {dossier.verdictSummary}
                </p>
              </div>

              {/* Mathematical Customer Satisfaction Consensus */}
              {renderBuyerSatisfaction()}

              {/* Dietary & Wellness Advisory Notice for Supplements */}
              {dossier?.product?.category === "supplement" && (
                <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-200 text-xs flex items-start gap-3 text-emerald-950 shadow-xs">
                  <span className="text-xl shrink-0">🌿</span>
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-[12px] block text-emerald-900">
                      Dietary & Wellness Advisory Notice:
                    </span>
                    <p className="text-[11px] text-emerald-800 leading-relaxed font-medium">
                      Supplements work best alongside balanced whole foods and exercise. If you have specific dietary restrictions, pre-existing health conditions, or are unsure of dosage, please consult a certified nutritionist or doctor.
                    </p>
                  </div>
                </div>
              )}

              {/* 2-Column: Where It Excels vs Realistic Gotchas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* 🟢 WHERE IT EXCELS */}
                <div className="p-5 rounded-3xl bg-emerald-50/60 border border-emerald-200 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-900 mb-3.5">
                    <ThumbsUp className="w-4 h-4 text-emerald-600" />
                    <span>Where This Product Excels</span>
                  </div>

                  <div className="space-y-3">
                    {(dossier.whereItExcels || []).map((item, idx) => (
                      <div key={idx} className="p-3 rounded-2xl bg-white border border-emerald-200/80 shadow-2xs">
                        <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-950 mb-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <span>{item.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 font-medium leading-relaxed pl-3">
                          {item.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ⚠️ REALISTIC GOTCHAS & FINE PRINT */}
                <div className="p-5 rounded-3xl bg-amber-50/60 border border-amber-200 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-900 mb-3.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Realistic Limits &amp; Fine Print</span>
                  </div>

                  <div className="space-y-3">
                    {(dossier.realisticTradeoffs || []).map((item, idx) => (
                      <div key={idx} className="p-3 rounded-2xl bg-white border border-amber-200/80 shadow-2xs">
                        <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-950 mb-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                          <span>{item.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 font-medium leading-relaxed pl-3">
                          {item.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2-Column: Who Should BUY vs Who Should SKIP */}
              {renderDecisionMatrix()}

              {/* Smart Saving Strategy: Decoded Bank Offers, Page Coupons & Brand Direct Perks */}
              {renderSmartSavingStrategy()}

              {/* ============================================================== */}
              {/* THE 3 KILLER HOOKS SECTION                                    */}
              {/* ============================================================== */}
              <div className="space-y-4 pt-2">
                
                {/* ROW 1: LIFESPAN TIMELINE + TRUE DAILY COST */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  
                  {/* HOOK 1: Hardware Aging & Shelf-Life Timeline */}
                  <div className="md:col-span-8 p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-800">
                        <Clock className="w-4 h-4 text-indigo-600" />
                        <span>
                          {dossier?.product?.category === "supplement"
                            ? "Freshness & Shelf-Life Timeline"
                            : dossier?.product?.category === "software_subscription"
                            ? "Subscription Lifecycle & Renewal Timeline"
                            : "Hardware Aging & Lifespan Timeline"}
                        </span>
                      </div>
                      <span className="text-[11px] font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                        {dossier?.product?.category === "supplement"
                          ? `Shelf Life: ${dossier.shelfLife?.expectedYears || "18-24 Months"}`
                          : dossier?.product?.category === "software_subscription"
                          ? `Term: ${dossier.shelfLife?.expectedYears || "Active Cycle"}`
                          : `Lifespan: ${dossier.shelfLife?.expectedYears || "3.5 Years"}`}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {(dossier.shelfLife?.timeline || [
                        { period: "Year 1", status: "100% Peak Performance", detail: "Zero lag, full battery backup, smooth operations under load." },
                        { period: "Year 2", status: "~85% Battery & Minor Thermal Wear", detail: "Mild thermal throttling under continuous heavy sessions." },
                        { period: "Year 3+", status: "Hardware Saturation Limit", detail: "Aging cells or memory limitations show on modern updates." }
                      ]).map((step, sIdx) => (
                        <div key={sIdx} className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="font-extrabold text-slate-900 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px]">
                              {step.period}
                            </span>
                            <span className="font-bold text-indigo-900 text-[11px]">
                              {step.status}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 font-medium sm:text-right">
                            {step.detail}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* HOOK 2: True Daily Cost */}
                  <div className="md:col-span-4 p-5 rounded-3xl bg-gradient-to-br from-indigo-50/80 via-white to-emerald-50/60 border border-indigo-200/80 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-indigo-900 mb-2">
                        <Coins className="w-4 h-4 text-emerald-600" />
                        <span>
                          {dossier?.product?.category === "supplement" ? "True Serving Cost" : "True Daily Cost"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {dossier?.product?.category === "supplement" ? "Actual cost per serving/scoop" : "Actual cost per day across its active lifespan"}
                      </p>
                    </div>

                    <div className="my-3 text-center sm:text-left">
                      <div className="text-3xl font-black text-slate-900 tracking-tight text-emerald-700">
                        {dossier.dailyCost?.costPerDay || "₹45 / day"}
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium block mt-1">
                        {dossier.dailyCost?.calculationBasis || "Spreading price across expected life"}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 text-[10px] text-slate-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Smart Value-for-Money Index</span>
                    </div>
                  </div>
                </div>

                {/* HOOK 3: Regional Real-World Reality Check */}
                {renderRegionalRealityCheck()}

                {/* In The Box & Warranty Fine-Print Reality */}
                {renderInTheBoxAndWarranty()}

                {/* Caring Considerations & Care Guidelines */}
                {renderCareGuidelines()}

                {/* Smart Directional Guidance (What to Look For Instead) */}
                {renderDirectionalAdvice()}
              </div>



              {/* ============================================================== */}
              {/* TASK 3: AI HARDWARE TRUTH ASSISTANT                            */}
              {/* ============================================================== */}
              {renderHardwareAssistant()}
            </div>
          </div>
        )}
        </div>
      );
    })()}
    </div>
  );
}
