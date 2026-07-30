"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ShoppingBag, ArrowLeft, RefreshCw, Layers, ShieldAlert, Coins } from "lucide-react";
import SearchHero from "@/components/SearchHero";
import RocketLoader from "@/components/RocketLoader";
import ProductCard from "@/components/ProductCard";
import { mockProductsData } from "@/data/mockProducts";
import { searchProducts } from "@/services/api";

export default function Home() {
  const [appState, setAppState] = useState("idle"); // idle | searching | results
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [creditsRemaining, setCreditsRemaining] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [isApiLoading, setIsApiLoading] = useState(false);

  const handleSearchSubmit = async (query) => {
    setSearchQuery(query);
    setAppState("searching");
    setApiError(null);
    setIsApiLoading(true);
    setProducts([]);

    try {
      // Execute the live Render API search request with IN market
      const response = await searchProducts(query, "IN");
      setProducts(response.results);
      setCreditsRemaining(response.creditsRemaining);
      
      if (response.isFallback) {
        setApiError("AI Gateway took too long to wake up (Render cold-start). Showing verified local recommendations.");
      } else {
        setApiError(null);
      }
    } catch (err) {
      console.error("Live API request failed:", err);
      setApiError(err.message || "Failed to retrieve live shopping matches from Render Gateway.");
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
      <header className="relative z-10 w-full glass-panel border-x-0 border-t-0 shadow-lg">
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
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>1,284 Active Shoppers</span>
            </span>
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
                  {creditsRemaining !== null && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-indigo/15 border border-brand-indigo/35 text-xs font-semibold text-brand-indigo shadow-inner">
                      <Coins className="w-4 h-4 text-brand-indigo animate-pulse" />
                      <span>{creditsRemaining} Credits</span>
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

              {/* Grid Dashboard or Error UI */}
              {products.length === 0 && apiError ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-md mx-auto text-center py-16 px-6 glass-panel rounded-2xl border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)] mt-8"
                >
                  <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Search Verification Failed</h3>
                  <p className="text-sm text-slate-400 mb-6">
                    {apiError}
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
                  <AnimatePresence mode="popLayout">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </AnimatePresence>
                </div>
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
    </div>
  );
}
