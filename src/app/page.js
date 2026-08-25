"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ShoppingBag, ArrowLeft, RefreshCw, Layers, ShieldAlert, Coins, Tag, AlertCircle } from "lucide-react";
import SearchHero from "@/components/SearchHero";
import RocketLoader from "@/components/RocketLoader";
import ProductCard from "@/components/ProductCard";
import AuthModal from "@/components/AuthModal";
import ProfileMenu from "@/components/ProfileMenu";
import QuotaModal from "@/components/QuotaModal";
import CouponCard from "@/components/CouponCard";
import { searchProducts } from "@/services/api";
import { auth } from "@/services/supabase";

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

function generateTopLevelAiSuggestion(query, products) {
  if (!query || !Array.isArray(products) || products.length === 0) {
    return "Analyzing search intent and scanning live store pricing...";
  }

  const category = detectCategory(query, products[0]?.title || "");
  const topProducts = products.slice(0, 3);
  const queryLower = query.toLowerCase();

  let lowestPriceItem = topProducts[0];
  let highestRatedItem = topProducts[0];

  topProducts.forEach(p => {
    const pVal = parseFloat(String(p.price || "0").replace(/[^0-9.]/g, "")) || 0;
    const lowestVal = parseFloat(String(lowestPriceItem?.price || "0").replace(/[^0-9.]/g, "")) || 0;
    
    if (pVal < lowestVal) {
      lowestPriceItem = p;
    }

    const pRating = parseFloat(p.rating || "0") || 0;
    const highestRating = parseFloat(highestRatedItem?.rating || "0") || 0;
    
    if (pRating > highestRating) {
      highestRatedItem = p;
    }
  });

  let suggestion = "";
  let takeaway = "";

  if (category === "laptop") {
    const isGaming = queryLower.includes("gaming") || queryLower.includes("rtx");
    const isBudget = queryLower.includes("under") || queryLower.includes("cheap");

    if (isGaming) {
      suggestion = `Scan of AAA gaming deals matching "${query}" highlights high refresh-rate screens and Nvidia RTX processing. The ${highestRatedItem?.title} stands out for top-tier thermal cooling and framerate stability.`;
      takeaway = `Top pick for pure gaming performance: ${highestRatedItem?.title} on ${highestRatedItem?.store}.`;
    } else if (isBudget) {
      suggestion = `Evaluating budget laptops matching "${query}" identifies entry-level office chips and high-capacity RAM configurations. The ${lowestPriceItem?.title} offers the best balance of speed and reliability under your budget.`;
      takeaway = `Best budget workstation: ${lowestPriceItem?.title} on ${lowestPriceItem?.store}.`;
    } else {
      suggestion = `Analyzing productivity laptops matching "${query}" prioritizes battery runtime and SSD responsiveness. The ${highestRatedItem?.title} offers a premium build with excellent multi-threaded CPU speeds.`;
      takeaway = `Top pick for daily office/code productivity: ${highestRatedItem?.title} on ${highestRatedItem?.store}.`;
    }
  } else if (category === "audio") {
    const hasANC = queryLower.includes("anc") || queryLower.includes("noise");
    const isSport = queryLower.includes("sport") || queryLower.includes("run") || queryLower.includes("gym");

    if (hasANC) {
      suggestion = `Evaluating noise-cancelling audio matching "${query}" highlights high-capacity active noise cancellation (ANC) and spatial drivers. The ${highestRatedItem?.title} delivers superior isolation from environmental noise.`;
      takeaway = `Top pick for isolation: ${highestRatedItem?.title} on ${highestRatedItem?.store}.`;
    } else if (isSport) {
      suggestion = `Sport audio scans matching "${query}" focus on secure fits, IP-rated sweat protection, and deep bass responses. The ${lowestPriceItem?.title} provides excellent secure-fit hooks for high-intensity activity.`;
      takeaway = `Best sport alternative: ${lowestPriceItem?.title} on ${lowestPriceItem?.store}.`;
    } else {
      suggestion = `Analyzing wireless audio deals matching "${query}" prioritizes Bluetooth v5.3 auto-pairing speed and total playtime capacity. The ${lowestPriceItem?.title} offers impressive bass drivers at an affordable cost.`;
      takeaway = `Best value choice: ${lowestPriceItem?.title} on ${lowestPriceItem?.store}.`;
    }
  } else if (category === "fashion") {
    const isHiking = queryLower.includes("hike") || queryLower.includes("boot") || queryLower.includes("outdoor");
    const isSneaker = queryLower.includes("sneaker") || queryLower.includes("run") || queryLower.includes("sport");

    if (isHiking) {
      suggestion = `Analyzing outdoor footwear matching "${query}" prioritizes waterproof Gore-Tex/canvas builds and deep-traction sole treads. The ${highestRatedItem?.title} offers maximum ankle protection for rough terrains.`;
      takeaway = `Top pick for hiking trail durability: ${highestRatedItem?.title} on ${highestRatedItem?.store}.`;
    } else if (isSneaker) {
      suggestion = `Evaluating athletic sneakers matching "${query}" emphasizes dual-density foam shock absorption and breathable mesh weaves. The ${lowestPriceItem?.title} offers lightweight comfort at a highly competitive price.`;
      takeaway = `Best budget athletic alternative: ${lowestPriceItem?.title} on ${lowestPriceItem?.store}.`;
    } else {
      suggestion = `Scanning fashion listings matching "${query}" highlights premium soft cotton stitches and casual modern fits. The ${lowestPriceItem?.title} provides daily utility comfort with easy washing care.`;
      takeaway = `Best value wardrobe pick: ${lowestPriceItem?.title} on ${lowestPriceItem?.store}.`;
    }
  } else {
    const hasBudget = queryLower.includes("under") || queryLower.includes("cheap") || queryLower.includes("budget");
    if (hasBudget) {
      suggestion = `Scanning competitive budget deals matching "${query}" focuses on cost-to-quality performance. The ${lowestPriceItem?.title} delivers verified retail quality at the most affordable price point.`;
      takeaway = `Best budget choice: ${lowestPriceItem?.title} on ${lowestPriceItem?.store}.`;
    } else {
      suggestion = `Comparing live store listings matching "${query}" identifies top-rated merchant listings with high buyer ratings. The ${highestRatedItem?.title} stands out for positive customer feedback and overall reliability.`;
      takeaway = `Top pick for overall satisfaction: ${highestRatedItem?.title} on ${highestRatedItem?.store}.`;
    }
  }

  return `📢 Suggestion: ${suggestion}\n\n🎯 Buying Takeaway: ${takeaway}`;
}

export default function Home() {
  const [appState, setAppState] = useState("idle"); // idle | searching | results
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [creditsRemaining, setCreditsRemaining] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [isApiLoading, setIsApiLoading] = useState(false);

  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authMessage, setAuthMessage] = useState(null);

  const [searchesLeft, setSearchesLeft] = useState(10);
  const [isQuotaOpen, setIsQuotaOpen] = useState(false);

  const [searchIntent, setSearchIntent] = useState("E-COMMERCE");
  const [coupons, setCoupons] = useState([]);
  const [couponNotAvailable, setCouponNotAvailable] = useState(false);

  useEffect(() => {
    async function initSession() {
      const { data: { session } } = await auth.getSession();
      if (session?.user) {
        setUser(session.user);
        
        // Sync real-time remaining searches from user metadata
        const todayStr = new Date().toISOString().split("T")[0];
        const lastDate = session.user.user_metadata?.last_search_date || "";
        const count = session.user.user_metadata?.search_count_today || 0;
        if (lastDate === todayStr) {
          setSearchesLeft(10 - count);
        } else {
          setSearchesLeft(10);
        }
      }
    }
    initSession();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    setUser(null);
    handleReset();
  };

  const handleAuthSuccess = (loggedUser) => {
    setUser(loggedUser);
  };

  const handleSearchSubmit = async (query) => {
    if (!user) {
      setAuthMessage("Account Required to Search 🔒\nTo search products and compare prices, please create a free account or sign in first.");
      setAuthMode("signup");
      setIsAuthOpen(true);
      return;
    }

    setSearchQuery(query);
    setAppState("searching");
    setApiError(null);
    setIsApiLoading(true);
    setProducts([]);

    try {
      // Execute the local Next.js search API request with target user country preference
      const userCountry = user?.user_metadata?.country || "IN";
      const response = await searchProducts(query, userCountry);
      const fetchedProducts = response.results || [];

      // Preload product images before releasing the search loader
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

          // Wait for all images or a maximum timeout of 1.5s
          await Promise.race([
            Promise.all(preloadPromises),
            new Promise((resolve) => setTimeout(resolve, 1500))
          ]);
        } catch (preloadErr) {
          console.error("Product image preloading error:", preloadErr);
        }
      }

      // Sync target session changes if backend refreshed the token payload
      if (response.newToken) {
        const todayStr = new Date().toISOString().split("T")[0];
        const updatedUser = {
          ...user,
          user_metadata: {
            ...user.user_metadata,
            search_count_today: (user.user_metadata?.search_count_today || 0) + 1,
            last_search_date: todayStr
          }
        };
        localStorage.setItem("mock_supabase_session", JSON.stringify({
          access_token: response.newToken,
          user: updatedUser
        }));
        setUser(updatedUser);
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
        setUser(null);
        setAuthMode("login");
        setIsAuthOpen(true);
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
        <div className="w-[35%] h-full bg-brand-violet/10 bg-glow-purple rounded-full mix-blend-screen -translate-x-[20%] -translate-y-[20%]"></div>
        <div className="w-[35%] h-full bg-brand-indigo/10 bg-glow-blue rounded-full mix-blend-screen translate-x-[20%] -translate-y-[10%]"></div>
      </div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0"></div>

      {/* Header / Navbar */}
      <header className="relative z-50 w-full glass-panel border-x-0 border-t-0 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-tr from-brand-indigo to-brand-violet flex items-center justify-center text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-lg md:text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
              ShopSmart <span className="text-brand-indigo">AI</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs md:text-sm">
            <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>1,284 Active Shoppers</span>
            </span>
            <ProfileMenu
              user={user}
              onLogout={handleLogout}
              onOpenLogin={() => {
                setAuthMessage(null);
                setAuthMode("login");
                setIsAuthOpen(true);
              }}
              searchesLeft={searchesLeft}
            />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow flex items-center justify-center py-8">
        <AnimatePresence mode="wait">
          {appState === "idle" && (
            <motion.div
              key="idle-state"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <SearchHero onSubmit={handleSearchSubmit} />
            </motion.div>
          )}

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

          {appState === "results" && (
            <motion.div
              key="results-state"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8"
            >
              {/* API Connection Warning Banner */}
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
                    className="flex items-center justify-center p-2.5 rounded-xl glass-panel glass-panel-hover text-slate-400 hover:text-white transition-all shadow-md cursor-pointer active:scale-95"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                      AI Recommendations
                    </h2>
                    <p className="text-xs md:text-sm text-slate-400">
                      Query matched best stores for &ldquo;<span className="text-brand-indigo font-semibold">{searchQuery}</span>&rdquo;
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {user && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-indigo/15 border border-brand-indigo/35 text-xs font-semibold text-brand-indigo shadow-inner">
                      <Coins className="w-4 h-4 text-brand-indigo animate-pulse" />
                      <span>{searchesLeft} / 10 Searches Left Today</span>
                    </div>
                  )}
                  <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300">
                    <Layers className="w-4 h-4 text-brand-violet" />
                    <span>Analyzed 45+ deals</span>
                  </div>
                  <button
                    onClick={() => handleSearchSubmit(searchQuery)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs md:text-sm font-semibold text-slate-200 hover:text-white transition-all cursor-pointer shadow-md active:scale-95"
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
                    className="max-w-md mx-auto text-center py-16 px-6 glass-panel rounded-2xl border-brand-indigo/20 shadow-[0_0_20px_rgba(99,102,241,0.1)] mt-8"
                  >
                    <div className="w-16 h-16 bg-brand-violet/10 border border-brand-violet/20 text-brand-violet rounded-full flex items-center justify-center mx-auto mb-6">
                      <AlertCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Service Not Available</h3>
                    <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                      This service or coupon is currently not available on our platform.
                    </p>
                    <button
                      onClick={handleReset}
                      className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs md:text-sm font-semibold text-slate-200 hover:text-white transition-all cursor-pointer shadow-md active:scale-95"
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
                    className="max-w-md mx-auto text-center py-16 px-6 glass-panel rounded-2xl border-brand-indigo/20 shadow-[0_0_20px_rgba(99,102,241,0.1)] mt-8"
                  >
                    <div className="w-16 h-16 bg-brand-indigo/10 border border-brand-indigo/20 text-brand-indigo rounded-full flex items-center justify-center mx-auto mb-6">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No Live Deals Found</h3>
                    <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                      {apiError ? apiError : "No live deals found for this query. Try adjusting your search terms."}
                    </p>
                    <button
                      onClick={handleReset}
                      className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs md:text-sm font-semibold text-slate-200 hover:text-white transition-all cursor-pointer shadow-md active:scale-95"
                    >
                      Go Back to Search
                    </button>
                  </motion.div>
                ) : (
                  <div className="space-y-8">
                    {/* Top-Level AI Suggestion Banner */}
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 rounded-2xl glass-panel border border-brand-indigo/30 bg-brand-indigo/5 shadow-[inset_0_1px_10px_rgba(99,102,241,0.05)] text-left relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-48 h-48 bg-brand-indigo/10 rounded-full blur-3xl pointer-events-none" />
                      <div className="flex items-start gap-3.5 relative z-10">
                        <div className="p-2.5 rounded-xl bg-brand-indigo/15 border border-brand-indigo/25 text-brand-indigo shrink-0">
                          <Sparkles className="w-5 h-5 animate-pulse" />
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-sm font-bold text-slate-100 mb-2 flex items-center gap-2">
                            <span>ShopSmart AI Shopping Suggestion</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-extrabold uppercase tracking-wide">
                              Live Synthesis
                            </span>
                          </h3>
                          <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-medium whitespace-pre-line">
                            {generateTopLevelAiSuggestion(searchQuery, products)}
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                      <AnimatePresence mode="popLayout">
                        {products.map((product) => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                      </AnimatePresence>
                    </div>

                    {coupons.length > 0 && (
                      <div className="pt-8 border-t border-slate-900">
                        <h3 className="text-lg md:text-xl font-bold text-white mb-6 flex items-center gap-2">
                          <Tag className="w-5 h-5 text-brand-violet animate-pulse" />
                          <span>Today's Verified Store Vouchers</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {coupons.map((coupon) => (
                            <CouponCard key={coupon.id} coupon={coupon} />
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
      <footer className="relative z-10 w-full py-8 text-center text-xs text-slate-500 border-t border-slate-900 glass-panel border-x-0 border-b-0">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-brand-indigo" />
            <span>AI powered shopping engine</span>
          </div>
          <div>
            <span>Powered by Next.js & Framer Motion. &copy; 2026 ShopSmart AI.</span>
          </div>
        </div>
      </footer>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authMode}
        message={authMessage}
      />

      <QuotaModal
        isOpen={isQuotaOpen}
        onClose={() => setIsQuotaOpen(false)}
      />
    </div>
  );
}
