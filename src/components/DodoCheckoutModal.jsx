"use client";

import React, { useState } from "react";
import { Sparkles, Zap, Crown, Check, ShieldCheck, ArrowRight, Loader2, X } from "lucide-react";
import { DODO_PRODUCTS } from "@/services/dodoService";

export default function DodoCheckoutModal({ isOpen, onClose, selectedCountry = "IN", defaultPlan = "power" }) {
  const [selectedPlan, setSelectedPlan] = useState(defaultPlan);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const isIndia = selectedCountry === "IN";
  const currencySymbol = isIndia ? "₹" : "$";

  const handleCheckout = async (planKey) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          planKey: planKey || selectedPlan,
          country: selectedCountry,
          returnUrl: typeof window !== "undefined" ? `${window.location.origin}/?payment=success&plan=${planKey || selectedPlan}` : undefined
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

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="relative px-6 pt-6 pb-4 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Benefisto Sparks & Passes
            </span>
            <span className="text-xs text-slate-400">Zero Expiry Sparks</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Unlock Full AI Shopping & Trial Room Power
          </h2>
          <p className="mt-1 text-sm text-slate-300">
            Get instant sparks for Virtual Try-On, hardware teardown sheets, and secret deal alerts.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="p-6 space-y-3">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 gap-3">
            {/* 1. Starter Pack */}
            <div
              onClick={() => setSelectedPlan("starter")}
              className={`cursor-pointer relative p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                selectedPlan === "starter"
                  ? "border-indigo-600 bg-indigo-50/50 shadow-sm"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl ${selectedPlan === "starter" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-base">Starter Pack</h3>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      30 Sparks
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">10 Virtual Try-Ons or 30 Deep Searches</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-extrabold text-slate-900">
                  {currencySymbol}{isIndia ? DODO_PRODUCTS.starter.priceInr : DODO_PRODUCTS.starter.priceUsd}
                </span>
                <span className="block text-[11px] text-slate-400">one-time</span>
              </div>
            </div>

            {/* 2. Power Shopper Pack (Featured) */}
            <div
              onClick={() => setSelectedPlan("power")}
              className={`cursor-pointer relative p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                selectedPlan === "power"
                  ? "border-indigo-600 bg-indigo-50/60 shadow-md ring-2 ring-indigo-500/20"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <span className="absolute -top-2.5 right-6 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm">
                Most Popular • 50% Off
              </span>
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl ${selectedPlan === "power" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-base">Power Shopper</h3>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                      100 Sparks
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">33 Virtual Try-Ons or 100 Deep Searches</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-extrabold text-indigo-600">
                  {currencySymbol}{isIndia ? DODO_PRODUCTS.power.priceInr : DODO_PRODUCTS.power.priceUsd}
                </span>
                <span className="block text-[11px] text-slate-400">one-time</span>
              </div>
            </div>

            {/* 3. VIP Monthly Pass */}
            <div
              onClick={() => setSelectedPlan("vip")}
              className={`cursor-pointer relative p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                selectedPlan === "vip"
                  ? "border-amber-500 bg-amber-50/50 shadow-md"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl ${selectedPlan === "vip" ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-600"}`}>
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-base">VIP Monthly Pass</h3>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      AutoPay Pass
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Unlimited Searches + 25 Try-Ons Every Month</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-extrabold text-slate-900">
                  {currencySymbol}{isIndia ? DODO_PRODUCTS.vip.priceInr : DODO_PRODUCTS.vip.priceUsd}
                </span>
                <span className="block text-[11px] text-slate-400">/ month</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => handleCheckout(selectedPlan)}
            disabled={isLoading}
            className="w-full mt-4 py-3.5 px-6 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Opening Secure Checkout...</span>
              </>
            ) : (
              <>
                <span>Proceed to Pay</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {/* Supported Rails Badge */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Safe 256-bit Encrypted Checkout</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
              {isIndia ? (
                <span>UPI (GPay / PhonePe / Paytm) • Cards • AutoPay</span>
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
