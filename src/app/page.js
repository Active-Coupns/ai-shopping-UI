"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ShoppingBag, ArrowLeft, RefreshCw, Layers, ShieldAlert, Coins, Tag, AlertCircle, Shirt } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser, useClerk } from "@clerk/nextjs";
import SearchHero from "@/components/SearchHero";
import RocketLoader from "@/components/RocketLoader";
import ProductCard from "@/components/ProductCard";
import ProfileMenu from "@/components/ProfileMenu";
import QuotaModal from "@/components/QuotaModal";
import CouponCard from "@/components/CouponCard";
import AiShoppingGuide from "@/components/AiShoppingGuide";
import FashionTrialRoom from "@/components/FashionTrialRoom";
import { searchProducts } from "@/services/api";

function detectCategory(query, title) {
  const text = (query + " " + title).toLowerCase();
  if (text.includes("laptop") || text.includes("notebook") || text.includes("computer") || text.includes("pc") || text.includes("macbook") || text.includes("chromebook")) {
    return "laptop";
  }
  if (text.includes("headphone") || text.includes("earphone") || text.includes("earbuds") || text.includes("audio") || text.includes("sound") || text.includes("pods") || text.includes("noise") || text.includes("anc") || text.includes("wireless ear")) {
    return "audio";
  }
  if (text.includes("shoe") || text.includes("sneaker") || text.includes("shirt") || text.includes("cotton") || text.includes("wear") || text.includes("clothing") || text.includes("jeans") || text.includes("tshirt") || text.includes("t-shirt") || text.includes("pant") || text.includes("boot")) {
    return "fashion";
  }
  return "general";
}

export function shouldBypassAiGuide(query = "") {
  const q = String(query).toLowerCase().trim();
  if (!q) return false;

  // 1. ALL MEDICINES & PHARMACEUTICAL PRODUCTS
  const medicineKeywords = [
    "dolo", "telma", "shelcal", "augmentin", "pantocid", "crocin", "paracetamol", 
    "azithromycin", "metformin", "glycomet", "atorvastatin", "amlodipine", "pantoprazole", 
    "amoxicillin", "combiflam", "allegra", "montair", "vicks", "benadryl", "strepsils", 
    "betadine", "limcee", "zincovit", "becosules", "supradyn", "liv 52", "digene", 
    "gelusil", "omez", "pan 40", "pan d", "rantac", "zinetac", "ciplox", "norflox", 
    "cifran", "taxim", "calpol", "sumo", "meftal", "disprin", "saridon", "cetrizine", 
    "levocetrizine", "okacet", "avil", "dexorange", "neurobion", "revital", "evion", 
    "folvite", "volini", "moov", "iodex", "aspirin", "ibuprofen"
  ];
  const hasMedicineName = medicineKeywords.some(m => q.includes(m));
  const hasMedicineForm = /\b(tablets?|capsules?|syrups?|injections?|drops?|ointment|gel|cream|suspension|inhaler|sachet|\d+\s*mg|\d+\s*ml|strip\s*of)\b/i.test(q);
  if (hasMedicineName || hasMedicineForm) return true;

  // 2. SPECIFIC SUPPLEMENT BRANDS / MODELS / PACK SIZES
  const supplementBrands = [
    "optimum nutrition", "gold standard", "muscleblaze", "biozyme", "nutrabay", 
    "myprotein", "as-it-is", "asitis", "nakpro", "gnc", "isopure", "cellucor", 
    "dymatize", "nitro-tech", "nitrotech", "rule 1", "avatar", "avvatar", 
    "fast & up", "fastandup", "the whole truth", "atom", "boniso", "muscletech", 
    "prostar", "ultimate nutrition", "labrada", "scitron"
  ];
  const hasSpecificBrand = supplementBrands.some(b => q.includes(b));
  const hasSpecificSize = /\b(\d+(\.\d+)?\s*(kg|lbs?|gm|g|capsules?|tabs?))\b/i.test(q);
  const isSpecificSupplement = hasSpecificBrand || (hasSpecificSize && /\b(whey|protein|creatine|bcaa|glutamine|multivitamin|mass gainer|fish oil)\b/i.test(q));
  if (isSpecificSupplement) return true;

  // 3. EXACT TECH / GADGET MODELS
  const isExactTech = /\b(iphone\s*\d+|galaxy\s*s\d+|macbook\s*(air|pro)\s*m\d+|wh-?1000xm\d+|rockerz\s*\d+|airwave\s*max\s*\d+|airpods\s*(pro|\d+)|oneplus\s*\d+[rt]?|tuf\s*[a-z]\d+|ideapad\s*slim\s*\d+|vivobook\s*\d+|nitro\s*\d+|predator\s*helios|rog\s*strix|legion\s*\d+|thinkpad|pavilion|inspiron|victus|bravia|qled|oled\s*\d+)\b/i.test(q);
  if (isExactTech) return true;

  return false;
}

export default function Home() {
  const { isSignedIn, user: clerkUser, isLoaded } = useUser();
  const { openSignIn } = useClerk();

  const [appState, setAppState] = useState("idle"); // idle | searching | results | guide | trial_room
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [creditsRemaining, setCreditsRemaining] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [isApiLoading, setIsApiLoading] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState("IN");
  const [searchesLeft, setSearchesLeft] = useState(10);
  const [isQuotaOpen, setIsQuotaOpen] = useState(false);
  const [searchIntent, setSearchIntent] = useState("E-COMMERCE");
  const [coupons, setCoupons] = useState([]);
  const [couponNotAvailable, setCouponNotAvailable] = useState(false);

  useEffect(() => {
    const handleUnhandledRejection = (event) => {
      const msg = String(event?.reason?.message || event?.reason || "");
      if (msg.includes("clerk") || msg.includes("Failed to fetch")) {
        event.preventDefault?.();
        console.warn("[ShopSmart Auth] Handled Clerk background sync hiccup:", msg);
      }
    };
    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    return () => window.removeEventListener("unhandledrejection", handleUnhandledRejection);
  }, []);

  const handleCountryChange = async (newCountry) => {
    const code = newCountry.toUpperCase();
    if (code === selectedCountry) return;

    setSelectedCountry(code);
    try {
      localStorage.setItem("user_selected_country", code);
    } catch (e) {}

    if (appState === "results" && searchQuery) {
      handleSearchSubmitForCountry(searchQuery, code);
    }
  };

  const handleSearchSubmitForCountry = async (query, targetCountry) => {
    setSearchQuery(query);
    setAppState("searching");
    setApiError(null);
    setIsApiLoading(true);
    setProducts([]);

    try {
      const response = await searchProducts(query, targetCountry);
      const fetchedProducts = response.results || [];
      setProducts(fetchedProducts);
      setSearchIntent(response.intent || "E-COMMERCE");
      setCoupons(response.coupons || []);
      setCouponNotAvailable(response.error === "NotAvailable");
      setSearchesLeft(response.searchesLeft !== undefined ? response.searchesLeft : 10);
      setApiError(null);
    } catch (err) {
      console.error("Local search API request failed:", err);
    } finally {
      setIsApiLoading(false);
    }
  };

  const handleSearchSubmit = async (query) => {
    if (!isSignedIn) {
      openSignIn();
      return;
    }

    if (shouldBypassAiGuide(query)) {
      handleDirectSearch(query);
      return;
    }

    setSearchQuery(query);
    setAppState("guide");
  };

  const handleDirectSearch = async (query) => {
    if (!isSignedIn) {
      openSignIn();
      return;
    }

    setSearchQuery(query);
    setAppState("searching");
    setApiError(null);
    setIsApiLoading(true);
    setProducts([]);

    try {
      const response = await searchProducts(query, selectedCountry);
      const fetchedProducts = response.results || [];

      if (fetchedProducts.length > 0) {
        try {
          const preloadPromises = fetchedProducts.map((p) => {
            return new Promise((resolve) => {
              if (!p.image) {
                resolve();
                return;
              }
              const img = new window.Image();
              img.src = p.image;
              img.onload = () => resolve();
              img.onerror = () => resolve();
            });
          });

          await Promise.race([
            Promise.all(preloadPromises),
            new Promise((resolve) => setTimeout(resolve, 800))
          ]);
        } catch (preloadErr) {
          console.error("Product image preloading error:", preloadErr);
        }
      }

      setProducts(fetchedProducts);
      setSearchIntent(response.intent || "E-COMMERCE");
      setCoupons(response.coupons || []);
      setCouponNotAvailable(response.error === "NotAvailable");
      setSearchesLeft(response.searchesLeft !== undefined ? response.searchesLeft : 10);
      setApiError(null);
    } catch (err) {
      console.error("Local search API request failed:", err);
      if (err.message?.includes("403") || err.message?.includes("QuotaReached")) {
        setSearchesLeft(0);
        setIsQuotaOpen(true);
      } else if (err.message?.includes("401") || err.message?.includes("Unauthorized")) {
        setApiError("Your session has expired. Please sign in again.");
        openSignIn();
      } else if (err.message?.includes("429") || err.message?.includes("busy") || err.message?.includes("Too Many Requests")) {
        setApiError("The server is currently busy processing other searches. Please wait a moment and try again.");
      } else {
        setApiError("No live deals found for this query. Try adjusting your search terms.");
      }
      setCreditsRemaining(null);
    } finally {
      setIsApiLoading(false);
    }
  };

  const handleLoaderComplete = () => {
    setAppState("results");
  };

  const handleReset = () => {
    setAppState("idle");
    setSearchQuery("");
    setApiError(null);
    setSearchIntent("E-COMMERCE");
    setCoupons([]);
    setCouponNotAvailable(false);
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between overflow-hidden">
      {/* Background Interactive Glow Effects */}
      <div className="absolute top-0 inset-x-0 h-[500px] flex justify-between pointer-events-none z-0">
        <div className="w-[35%] h-full bg-brand-indigo/10 rounded-full blur-3xl mix-blend-multiply -translate-x-[20%] -translate-y-[20%]"></div>
        <div className="w-[35%] h-full bg-brand-violet/10 rounded-full blur-3xl mix-blend-multiply translate-x-[20%] -translate-y-[10%]"></div>
      </div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0"></div>

      {/* Header / Navbar */}
      <header className="relative z-50 w-full glass-panel border-x-0 border-t-0 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0" onClick={handleReset}>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-brand-indigo to-brand-violet flex items-center justify-center text-white shadow-md shadow-brand-indigo/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-base sm:text-xl md:text-2xl font-black tracking-tight text-slate-900">
              ShopSmart <span className="bg-gradient-to-r from-brand-indigo to-brand-violet bg-clip-text text-transparent">AI</span>
            </span>
          </div>

          {/* Mode Switcher Pills (Search Deals vs Fashion Trial Room) */}
          <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 shadow-inner">
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setAppState("idle")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                appState !== "trial_room"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>🔍</span>
              <span className="hidden sm:inline">Search Deals</span>
            </button>
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setAppState("trial_room")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer relative ${
                appState === "trial_room"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20"
                  : "text-purple-700 hover:text-purple-900 hover:bg-white/60"
              }`}
            >
              <Shirt className="w-3.5 h-3.5 text-pink-500 animate-pulse" />
              <span>Trial Room</span>
              <span className="hidden md:inline px-1.5 py-0.2 rounded-full bg-pink-100 text-[9px] text-pink-700 font-black border border-pink-200">AI STUDIO</span>
            </button>
          </div>

          {/* Right Header: Region & Auth */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs md:text-sm shrink-0">
            {/* Region Switcher */}
            <div className="flex items-center gap-0.5 sm:gap-1 p-0.5 sm:p-1 rounded-xl bg-slate-100 border border-slate-200 shadow-inner">
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => handleCountryChange("IN")}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCountry === "IN"
                    ? "bg-white text-brand-indigo shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <span>🇮🇳</span>
                <span className="hidden sm:inline">IN (₹)</span>
              </button>
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => handleCountryChange("US")}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCountry === "US"
                    ? "bg-white text-brand-indigo shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <span>🇺🇸</span>
                <span className="hidden sm:inline">US ($)</span>
              </button>
            </div>

            {isLoaded ? (
              isSignedIn ? (
                <div className="flex items-center gap-2.5">
                  <span className="hidden md:inline-flex text-xs font-semibold text-brand-emerald bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    {searchesLeft} / 10 Searches
                  </span>
                  <UserButton showName={false} />
                </div>
              ) : (
                <SignInButton mode="modal">
                  <button
                    type="button"
                    suppressHydrationWarning
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-brand-indigo to-brand-violet hover:from-indigo-600 hover:to-purple-700 text-xs sm:text-sm font-semibold text-white transition-all shadow-md shadow-brand-indigo/20 active:scale-95 cursor-pointer"
                  >
                    Sign In
                  </button>
                </SignInButton>
              )
            ) : (
              <div className="w-16 h-8 rounded-xl bg-slate-200 animate-pulse" />
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow flex items-center justify-center py-6 md:py-8">
        <AnimatePresence mode="wait">
          
          {/* FASHION VIRTUAL TRIAL ROOM STUDIO */}
          {appState === "trial_room" && (
            <motion.div
              key="trial-room-state"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <FashionTrialRoom />
            </motion.div>
          )}

          {/* IDLE SEARCH HERO */}
          {appState === "idle" && (
            <motion.div
              key="idle-state"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <SearchHero
                country={selectedCountry}
                onSubmit={handleSearchSubmit}
              />
            </motion.div>
          )}

          {/* AI SHOPPING GUIDE */}
          {appState === "guide" && (
            <motion.div
              key="guide-state"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full px-4"
            >
              <AiShoppingGuide
                initialQuery={searchQuery}
                onExecuteSearch={handleDirectSearch}
                onBackToSearch={() => setAppState("idle")}
              />
            </motion.div>
          )}

          {/* SEARCHING LOADER */}
          {appState === "searching" && (
            <motion.div
              key="searching-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <RocketLoader query={searchQuery} onComplete={handleLoaderComplete} apiLoading={isApiLoading} />
            </motion.div>
          )}

          {/* SEARCH RESULTS VIEW */}
          {appState === "results" && (
            <motion.div
              key="results-state"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8"
            >
              {apiError && (
                <div className="mb-6">
                  <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs md:text-sm font-semibold shadow-[0_0_15px_rgba(245,158,11,0.05)]">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>{apiError}</span>
                  </div>
                </div>
              )}

              {/* Back Bar & Query Info */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleReset}
                    className="flex items-center justify-center p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 transition-all shadow-sm cursor-pointer active:scale-95"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div>
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                      AI Recommendations
                    </h2>
                    <p className="text-xs md:text-sm text-slate-500 font-medium">
                      Query matched best stores for &ldquo;<span className="text-brand-indigo font-bold">{searchQuery}</span>&rdquo;
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isSignedIn && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-xs font-bold text-brand-indigo shadow-sm">
                      <Coins className="w-4 h-4 text-brand-indigo animate-pulse" />
                      <span>{searchesLeft} / 10 Searches Left Today</span>
                    </div>
                  )}
                  <button
                    onClick={() => handleSearchSubmit(searchQuery)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-xs md:text-sm font-bold text-slate-700 hover:text-slate-900 transition-all cursor-pointer shadow-sm active:scale-95"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Re-analyze</span>
                  </button>
                </div>
              </div>

              {/* Intent-Aware Results Views */}
              {searchIntent === "SERVICE_COUPON" ? (
                couponNotAvailable ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md mx-auto text-center py-16 px-6 glass-panel rounded-2xl border-brand-indigo/20 shadow-lg mt-8"
                  >
                    <div className="w-16 h-16 bg-brand-violet/10 border border-brand-violet/20 text-brand-violet rounded-full flex items-center justify-center mx-auto mb-6">
                      <AlertCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Service Not Available</h3>
                    <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                      This service or coupon is currently not available on our platform.
                    </p>
                    <button
                      onClick={handleReset}
                      className="px-6 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs md:text-sm font-bold text-slate-800 transition-all cursor-pointer shadow-sm active:scale-95"
                    >
                      Go Back to Search
                    </button>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {coupons.map((coupon) => (
                      <CouponCard key={coupon.id} coupon={coupon} />
                    ))}
                  </div>
                )
              ) : (
                products.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md mx-auto text-center py-16 px-6 glass-panel rounded-2xl border-brand-indigo/20 shadow-lg mt-8"
                  >
                    <div className="w-16 h-16 bg-brand-indigo/10 border border-brand-indigo/20 text-brand-indigo rounded-full flex items-center justify-center mx-auto mb-6">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No Live Deals Found</h3>
                    <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                      {apiError ? apiError : "No live deals found for this query. Try adjusting your search terms."}
                    </p>
                    <button
                      onClick={handleReset}
                      className="px-6 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs md:text-sm font-bold text-slate-800 transition-all cursor-pointer shadow-sm active:scale-95"
                    >
                      Go Back to Search
                    </button>
                  </motion.div>
                ) : (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                      <AnimatePresence mode="popLayout">
                        {products.map((product, idx) => (
                          <ProductCard key={product.id || `product-${idx}-${product.title}`} product={product} searchQuery={searchQuery} />
                        ))}
                      </AnimatePresence>
                    </div>

                    {coupons.length > 0 && (
                      <div className="pt-8 border-t border-slate-200">
                        <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                          <Tag className="w-5 h-5 text-brand-violet animate-pulse" />
                          <span>Today's Verified Store Vouchers</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {coupons.map((coupon, idx) => (
                            <CouponCard key={coupon.id || `coupon-item-${idx}-${coupon.code || coupon.store}`} coupon={coupon} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-8 text-center text-xs text-slate-500 border-t border-slate-200 glass-panel border-x-0 border-b-0">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-brand-indigo" />
            <span>AI powered shopping & virtual trial engine</span>
          </div>
          <div>
            <span>Powered by Next.js & Framer Motion. &copy; 2026 ShopSmart AI.</span>
          </div>
        </div>
      </footer>

      <QuotaModal
        isOpen={isQuotaOpen}
        onClose={() => setIsQuotaOpen(false)}
      />
    </div>
  );
}
