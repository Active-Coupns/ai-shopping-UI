"use client";

import React, { useState, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { Sparkles, Zap, Check, ShieldCheck, ArrowRight, Loader2, X, Shirt, Search, Globe, Clock, Layers } from "lucide-react";
import { DODO_PRODUCTS, COUNTRY_CONFIG } from "@/services/dodoService";

export default function DodoCheckoutModal({ 
  isOpen, 
  onClose, 
  selectedCountry = "IN", 
  initialCategory = "tryon"
}) {
  const { isSignedIn } = useUser();
  const clerk = useClerk();
  const [activeTab, setActiveTab] = useState(initialCategory || "tryon"); // "tryon" or "search"
  const [activeCountry, setActiveCountry] = useState(selectedCountry || "IN");
  const [selectedPlan, setSelectedPlan] = useState(initialCategory === "search" ? "search_medium" : "tryon_medium");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (selectedCountry) {
      setActiveCountry(selectedCountry);
    }
  }, [selectedCountry]);

  if (!isOpen) return null;

  const currentCountryConfig = COUNTRY_CONFIG[activeCountry] || COUNTRY_CONFIG.IN;
  const currencySymbol = currentCountryConfig.symbol;

  const handleCountrySwitch = (countryCode) => {
    const code = String(countryCode || "IN").toUpperCase();
    setActiveCountry(code);
    try {
      localStorage.setItem("user_selected_country", code);
      window.dispatchEvent(new CustomEvent("benefisto:switch_country", { detail: { country: code } }));
    } catch (_) {}
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setSelectedPlan(tab === "tryon" ? "tryon_medium" : "search_medium");
  };

  const handleCheckout = async (planKey) => {
    if (!isSignedIn) {
      if (clerk && typeof clerk.openSignIn === "function") {
        onClose();
        clerk.openSignIn();
      }
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const planToPay = planKey || selectedPlan;
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          planKey: planToPay,
          country: activeCountry,
          returnUrl: typeof window !== "undefined" ? `${window.location.origin}/?payment=success&plan=${planToPay}` : undefined
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create checkout session");
      }

      // Redirect user directly to Dodo Payments secure hosted checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err) {
      console.error("[Checkout Modal] Error starting payment:", err);
      setErrorMessage(err.message || "Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const tryonPlans = [
    { key: "tryon_medium", ...DODO_PRODUCTS.tryon_medium },
    { key: "tryon_large", ...DODO_PRODUCTS.tryon_large }
  ];

  const searchPlans = [
    { key: "search_medium", ...DODO_PRODUCTS.search_medium },
    { key: "search_large", ...DODO_PRODUCTS.search_large }
  ];

  const currentPlans = activeTab === "tryon" ? tryonPlans : searchPlans;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="relative px-6 pt-6 pb-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Clock className="w-3.5 h-3.5 text-emerald-300" />
              60 Days Validity
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <Layers className="w-3.5 h-3.5 text-amber-300" />
              Stackable Top-Up
            </span>

            {/* Quick Country Pill Switcher */}
            <div className="ml-auto mr-8 flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full text-xs text-slate-200">
              <Globe className="w-3 h-3 text-indigo-300" />
              <select
                value={activeCountry}
                onChange={(e) => handleCountrySwitch(e.target.value)}
                className="bg-transparent text-xs font-medium text-white focus:outline-none cursor-pointer"
              >
                <option value="IN" className="text-slate-900">🇮🇳 IN (₹)</option>
                <option value="US" className="text-slate-900">🇺🇸 US ($)</option>
                <option value="GB" className="text-slate-900">🇬🇧 UK (£)</option>
                <option value="CA" className="text-slate-900">🇨🇦 CA (C$)</option>
                <option value="AU" className="text-slate-900">🇦🇺 AU (A$)</option>
                <option value="AE" className="text-slate-900">🇦🇪 AE (AED)</option>
              </select>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Benefisto Credit Top-Up
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            Top up credits instantly. Credits add to your existing balance and remain valid for a full 60 days.
          </p>

          {/* Service Tabs */}
          <div className="mt-4 flex p-1 bg-white/10 rounded-2xl border border-white/15">
            <button
              type="button"
              onClick={() => handleTabSwitch("tryon")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "tryon"
                  ? "bg-white text-indigo-950 shadow-md"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Shirt className="w-4 h-4 text-indigo-600" />
              <span>Virtual Try-On</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabSwitch("search")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "search"
                  ? "bg-white text-indigo-950 shadow-md"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Search className="w-4 h-4 text-amber-600" />
              <span>AI Search & Deals</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="p-5 sm:p-6 space-y-3">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 gap-3">
            {currentPlans.map((plan) => {
              const isSelected = selectedPlan === plan.key;
              const price = plan.prices[activeCountry] || plan.prices.IN;
              const isLarge = plan.tier === "large";

              return (
                <div
                  key={plan.key}
                  onClick={() => setSelectedPlan(plan.key)}
                  className={`cursor-pointer relative p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50/60 shadow-md ring-2 ring-indigo-500/20"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  {isLarge && (
                    <span className="absolute -top-2.5 right-6 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm">
                      {plan.badge}
                    </span>
                  )}

                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl ${isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                      {activeTab === "tryon" ? <Shirt className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-base">{plan.name}</h3>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          isSelected ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-600"
                        }`}>
                          {plan.credits} {activeTab === "tryon" ? "Try-Ons" : "Searches"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                        <span>{plan.description}</span>
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                          <Check className="w-3 h-3" /> 60 Days Validity
                        </span>
                        <span>•</span>
                        <span>Stackable Top-Up</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right pl-3">
                    <div className="text-xl sm:text-2xl font-black text-slate-900 whitespace-nowrap">
                      {currencySymbol}{price}
                    </div>
                    <span className="block text-[11px] text-slate-400 font-medium">top-up</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Button */}
          <button
            onClick={() => handleCheckout(selectedPlan)}
            disabled={isLoading}
            className="w-full mt-4 py-3.5 px-6 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Redirecting to Secure Gateway...</span>
              </>
            ) : (
              <>
                <span>
                  Top Up {currentPlans.find(p => p.key === selectedPlan)?.credits} {activeTab === "tryon" ? "Try-Ons" : "Searches"} for {currencySymbol}{currentPlans.find(p => p.key === selectedPlan)?.prices[activeCountry]}
                </span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {/* Trust & Safe Rails */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="font-medium text-slate-600">256-bit Encrypted Checkout</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
              {activeCountry === "IN" ? (
                <span>UPI (GPay / PhonePe / Paytm) • RuPay • Cards</span>
              ) : (
                <span>Apple Pay • Google Pay • Cards</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
