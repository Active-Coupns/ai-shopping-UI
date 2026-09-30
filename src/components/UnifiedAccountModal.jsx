"use client";

import React, { useState, useEffect, useRef } from "react";
import { useUser, useClerk, SignInButton } from "@clerk/nextjs";
import { 
  User, LogOut, Globe, Sparkles, ShoppingBag, 
  Pill, Shirt, Check, ChevronRight, X, ShieldCheck, Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function UnifiedAccountModal({
  isOpen,
  onClose,
  selectedCountry = "IN",
  onCountryChange,
  searchesLeft = 10,
  appState = "idle",
  onNavigate
}) {
  const { isSignedIn, user, isLoaded } = useUser();
  const { signOut, openSignIn } = useClerk();

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const fullName = user?.fullName || user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] || "Shopper";
  const email = user?.emailAddresses?.[0]?.emailAddress || "";
  const imageUrl = user?.imageUrl;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        />

        {/* Modal / Sheet Container */}
        <motion.div
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 max-h-[90vh] flex flex-col"
        >
          {/* Top Drag Indicator (Mobile) & Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-indigo to-brand-violet flex items-center justify-center text-white shadow-sm">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 leading-tight">Account & Preferences</h3>
                <p className="text-[11px] font-medium text-slate-500">Region, Quota & Navigation Hub</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
            {/* 1. User Profile Status */}
            {isLoaded && isSignedIn ? (
              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-white border border-indigo-100 shadow-xs">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={fullName}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/20 shadow-xs"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-indigo to-brand-violet text-white font-black text-base flex items-center justify-center shadow-xs">
                    {fullName.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{fullName}</h4>
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{email}</p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
                <p className="text-xs font-semibold text-slate-700 mb-2.5">
                  Sign in to save your trial room photos, favorite deals & personal shopping stack.
                </p>
                <SignInButton mode="modal">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-indigo to-brand-violet text-white text-xs font-bold shadow-md hover:shadow-indigo-500/20 active:scale-98 transition-all"
                  >
                    Sign In with Clerk
                  </button>
                </SignInButton>
              </div>
            )}

            {/* 2. Daily Search Quota Pill */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-100/80 text-brand-indigo">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Daily AI Search Allowance</p>
                  <p className="text-[11px] text-slate-500">Resets automatically every 24 hours</p>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-black text-emerald-700">
                  {searchesLeft} / 10 Left
                </span>
              </div>
            </div>

            {/* 3. Unified Country / Region Selector (USER REQUESTED) */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <Globe className="w-4 h-4 text-brand-indigo" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Shopping Country & Currency
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {/* India Option */}
                <button
                  type="button"
                  onClick={() => {
                    onCountryChange("IN");
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all relative cursor-pointer ${
                    selectedCountry === "IN"
                      ? "bg-indigo-50/70 border-brand-indigo ring-2 ring-brand-indigo/20 shadow-xs"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {selectedCountry === "IN" && (
                    <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-brand-indigo text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                  <div className="text-2xl mb-1">🇮🇳</div>
                  <div className="text-xs font-extrabold text-slate-900">India (INR ₹)</div>
                  <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                    Amazon.in, Flipkart, Myntra, 1mg, Apollo
                  </div>
                </button>

                {/* United States Option */}
                <button
                  type="button"
                  onClick={() => {
                    onCountryChange("US");
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all relative cursor-pointer ${
                    selectedCountry === "US"
                      ? "bg-indigo-50/70 border-brand-indigo ring-2 ring-brand-indigo/20 shadow-xs"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {selectedCountry === "US" && (
                    <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-brand-indigo text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                  <div className="text-2xl mb-1">🇺🇸</div>
                  <div className="text-xs font-extrabold text-slate-900">United States (USD $)</div>
                  <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                    Amazon.com, Walmart, Best Buy, Target
                  </div>
                </button>
              </div>
            </div>

            {/* 4. Quick Vertical Jump Navigation */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                Explore Shopping Verticals
              </h4>

              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => {
                    onNavigate("idle", "ecommerce");
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                    appState !== "trial_room"
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag className="w-4 h-4 text-indigo-400" />
                    <div className="text-left">
                      <p className="text-xs font-bold">🛍️ E-Commerce & Tech Deals</p>
                      <p className={`text-[10px] ${appState !== "trial_room" ? "text-slate-300" : "text-slate-500"}`}>
                        Laptops, Phones, Shoes, Watches & Best Prices
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onNavigate("trial_room");
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                    appState === "trial_room"
                      ? "bg-gradient-to-r from-purple-700 to-indigo-700 text-white border-purple-700 shadow-sm"
                      : "bg-purple-50/60 hover:bg-purple-100/60 text-purple-900 border-purple-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Shirt className="w-4 h-4 text-pink-400" />
                    <div className="text-left">
                      <p className="text-xs font-bold">👗 AI Virtual Trial Room & Stylist</p>
                      <p className={`text-[10px] ${appState === "trial_room" ? "text-purple-200" : "text-purple-700"}`}>
                        Try 1,508+ outfits on your photo with 0-distortion fit
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </button>
              </div>
            </div>

            {/* 5. Sign Out Button if Signed In */}
            {isLoaded && isSignedIn && (
              <button
                type="button"
                onClick={async () => {
                  await signOut();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-bold transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Account</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
