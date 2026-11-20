"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { detectUserCountry } from "@/lib/countryDetector";
import { 
  ShoppingBag, 
  ArrowLeft, 
  Sparkles, 
  Check, 
  Clock, 
  Layers, 
  ShieldCheck, 
  Shirt, 
  Search, 
  Globe, 
  ArrowRight, 
  HelpCircle, 
  Zap, 
  Crown,
  Loader2
} from "lucide-react";
import { DODO_PRODUCTS, COUNTRY_CONFIG } from "@/services/dodoService";
import DodoCheckoutModal from "@/components/DodoCheckoutModal";

export default function PricingPage() {
  const { user: clerkUser, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState("tryon"); // "tryon" or "search"
  const [selectedCountry, setSelectedCountry] = useState("IN");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState("tryon_medium");
  const [loadingPlan, setLoadingPlan] = useState("");

  // Sync country from Clerk profile, localStorage, or real-time IP detection
  useEffect(() => {
    (async () => {
      try {
        // 1. User metadata from Clerk
        if (clerkUser?.unsafeMetadata?.country) {
          const c = String(clerkUser.unsafeMetadata.country).toUpperCase();
          if (COUNTRY_CONFIG[c]) {
            setSelectedCountry(c);
            return;
          }
        }

        // 2. Saved local storage preference
        const saved = localStorage.getItem("user_selected_country");
        if (saved && COUNTRY_CONFIG[saved.toUpperCase()]) {
          setSelectedCountry(saved.toUpperCase());
          return;
        }

        // 3. Fallback to real-time auto-detection
        const detected = await detectUserCountry();
        if (detected && COUNTRY_CONFIG[detected]) {
          setSelectedCountry(detected);
        }
      } catch (_) {}
    })();
  }, [clerkUser, isLoaded]);

  const handleCountryChange = (newCountry) => {
    const code = String(newCountry || "IN").toUpperCase();
    if (!COUNTRY_CONFIG[code]) return;
    setSelectedCountry(code);
    try {
      localStorage.setItem("user_selected_country", code);
      if (clerkUser?.id && typeof clerkUser.update === "function") {
        clerkUser.update({
          unsafeMetadata: {
            ...(clerkUser.unsafeMetadata || {}),
            country: code
          }
        }).catch(() => {});
      }
      window.dispatchEvent(new CustomEvent("benefisto:switch_country", { detail: { country: code } }));
    } catch (_) {}
  };

  const countryConfig = COUNTRY_CONFIG[selectedCountry] || COUNTRY_CONFIG.IN;
  const currencySymbol = countryConfig.symbol;

  const tryonPlans = [
    { key: "tryon_medium", ...DODO_PRODUCTS.tryon_medium },
    { key: "tryon_large", ...DODO_PRODUCTS.tryon_large }
  ];

  const searchPlans = [
    { key: "search_medium", ...DODO_PRODUCTS.search_medium },
    { key: "search_large", ...DODO_PRODUCTS.search_large }
  ];

  const currentPlans = activeTab === "tryon" ? tryonPlans : searchPlans;

  const handleDirectCheckout = async (planKey) => {
    setLoadingPlan(planKey);
    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planKey,
          country: selectedCountry,
          returnUrl: typeof window !== "undefined" ? `${window.location.origin}/?payment=success&plan=${planKey}` : undefined
        })
      });

      const data = await res.json();
      if (res.ok && data.success && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        // Fallback to modal
        setCheckoutPlan(planKey);
        setIsCheckoutOpen(true);
        setLoadingPlan("");
      }
    } catch {
      setCheckoutPlan(planKey);
      setIsCheckoutOpen(true);
      setLoadingPlan("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/20 selection:text-indigo-400">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/40 via-slate-950 to-slate-950 pointer-events-none" />

      {/* Top Header Navigation */}
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Benefisto</span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Country Selector */}
            <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-full text-xs text-slate-300">
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <select
                value={selectedCountry}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
              >
                <option value="IN" className="text-slate-900">🇮🇳 India (INR ₹)</option>
                <option value="US" className="text-slate-900">🇺🇸 United States (USD $)</option>
                <option value="GB" className="text-slate-900">🇬🇧 United Kingdom (GBP £)</option>
                <option value="CA" className="text-slate-900">🇨🇦 Canada (CAD C$)</option>
                <option value="AU" className="text-slate-900">🇦🇺 Australia (AUD A$)</option>
                <option value="AE" className="text-slate-900">🇦🇪 UAE (AED)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="text-base font-black tracking-tight text-white hidden sm:inline">
                Benefisto <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Pricing</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transparent, Fair &amp; Predictable Pricing</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
            Simple Top-Ups. <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              No Forced Subscriptions.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-light">
            Pay only when you need extra credits. Every top-up gives you a full <strong>60 days validity</strong> and stacks additively to your existing balance.
          </p>

          {/* Service Tabs */}
          <div className="mt-8 inline-flex p-1 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl">
            <button
              onClick={() => setActiveTab("tryon")}
              className={`py-2.5 px-5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "tryon"
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Shirt className="w-4 h-4" />
              <span>Virtual Try-On Packs</span>
            </button>
            <button
              onClick={() => setActiveTab("search")}
              className={`py-2.5 px-5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "search"
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Search className="w-4 h-4" />
              <span>AI Search &amp; Deals Packs</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
          {currentPlans.map((plan) => {
            const isLarge = plan.tier === "large";
            const price = plan.prices[selectedCountry] || plan.prices.IN;
            const isLoading = loadingPlan === plan.key;

            return (
              <div 
                key={plan.key}
                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-200 ${
                  isLarge 
                    ? "bg-gradient-to-b from-indigo-950/70 via-slate-900/90 to-slate-900 border-2 border-indigo-500/60 shadow-2xl shadow-indigo-900/20"
                    : "bg-slate-900/70 border border-slate-800 hover:border-slate-700 shadow-xl"
                }`}
              >
                {isLarge && (
                  <span className="absolute -top-3.5 right-8 px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md">
                    {plan.badge}
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2.5 rounded-xl ${isLarge ? "bg-indigo-600 text-white" : "bg-slate-800 text-indigo-400"}`}>
                        {activeTab === "tryon" ? <Shirt className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                        <span className="text-xs text-slate-400 font-medium">One-Time Top-Up</span>
                      </div>
                    </div>
                  </div>

                  {/* Price Block */}
                  <div className="mb-6 flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                      {currencySymbol}{price}
                    </span>
                    <span className="text-xs text-slate-400 font-medium ml-1">/ top-up</span>
                  </div>

                  {/* Key Features List */}
                  <ul className="space-y-3 mb-8 text-xs sm:text-sm text-slate-300">
                    <li className="flex items-center gap-2.5 font-semibold text-white">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span><strong>{plan.credits}</strong> {activeTab === "tryon" ? "Virtual Try-On Credits" : "Deep Search & Price Calls"}</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span><strong>60 Days</strong> Full Validity Window</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Layers className="w-4 h-4 text-amber-400 shrink-0" />
                      <span><strong>Stackable:</strong> Unused credits add up on future top-ups</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Dedicated GPU Inference Slot (Ultra-Fast)</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Zap className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>Zero Commitments: No recurring auto-debit</span>
                    </li>
                  </ul>
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={() => handleDirectCheckout(plan.key)}
                  disabled={isLoading}
                  className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98 ${
                    isLarge 
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-indigo-500/25"
                      : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Redirecting to Dodo Payments...</span>
                    </>
                  ) : (
                    <>
                      <span>Top Up {plan.credits} {activeTab === "tryon" ? "Try-Ons" : "Searches"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Free Tier Comparison Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 mb-16 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-2">
                Always Free Baseline
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white">Free Account Inclusions</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                Every Benefisto shopper gets <strong>3 Free Virtual Try-Ons</strong> on signup and <strong>10 Free Daily Searches</strong> every 24 hours. Cache hits cost <strong>₹0 / 0 credits</strong> forever.
              </p>
            </div>
            <Link
              href="/"
              className="py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors border border-slate-700 shrink-0"
            >
              Start Free Today
            </Link>
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto mb-12">
          <h2 className="text-xl sm:text-2xl font-black text-white text-center mb-8 flex items-center justify-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-400" />
            <span>Frequently Asked Questions</span>
          </h2>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80">
              <h4 className="text-sm font-bold text-white mb-1.5">What happens if I top up again before 60 days?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your credits stack additively! If you have 5 credits left and top up 14 credits, your new balance will be 19 credits, and the entire balance’s validity will extend to a full 60 days from the date of the latest top-up.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80">
              <h4 className="text-sm font-bold text-white mb-1.5">Do cached product searches consume my credits?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                No. If a product or deal is served from our high-speed cache, it costs exactly ₹0 and consumes 0 credits from your pool. Credits are only consumed when our AI runs a live external scrape or teardown call.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80">
              <h4 className="text-sm font-bold text-white mb-1.5">Which payment methods are accepted?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                We accept UPI (Google Pay, PhonePe, Paytm, BHIM), RuPay, Visa, Mastercard, NetBanking, and Apple Pay via our RBI-compliant global payment partner, Dodo Payments.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80">
              <h4 className="text-sm font-bold text-white mb-1.5">Are my photos stored after Virtual Try-On?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Never. Uploaded photos are stored strictly in short-lived ephemeral memory during GPU diffusion rendering. They are never saved to permanent database storage or shared with third parties.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Dodo Checkout Modal */}
      <DodoCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        selectedCountry={selectedCountry}
        initialCategory={activeTab}
        defaultPlan={checkoutPlan}
      />
    </div>
  );
}
