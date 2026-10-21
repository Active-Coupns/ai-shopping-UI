"use client";

import React, { useState, useEffect, useRef } from "react";
import { useUser, useClerk, SignInButton } from "@clerk/nextjs";
import { 
  User, LogOut, Globe, Sparkles, ShoppingBag, 
  Pill, Shirt, Check, ChevronRight, X, ShieldCheck, Zap,
  Trash2, AlertTriangle, Loader2, LifeBuoy, Heart
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { COUNTRIES_LIST } from "@/lib/countryConfig";

export default function UnifiedAccountModal({
  isOpen,
  onClose,
  selectedCountry = "IN",
  onCountryChange,
  searchesLeft = 10,
  appState = "idle",
  onNavigate,
  onOpenSupportTicket,
  savedDealsCount = 0,
  onOpenSavedDeals
}) {
  const { isSignedIn, user, isLoaded } = useUser();
  const { signOut, openSignIn } = useClerk();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
      const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch("/api/user/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        await signOut();
        onClose();
        if (typeof window !== "undefined") {
          window.location.href = "/";
        }
      } else {
        setDeleteError(data.message || "Failed to delete account. Please try again.");
      }
    } catch (err) {
      setDeleteError("Network error. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

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

            {/* 2.5 Saved Deals & Wishlist Bookmarks */}
            <button
              type="button"
              onClick={() => {
                if (onOpenSavedDeals) onOpenSavedDeals();
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-rose-50/80 via-white to-pink-50/40 border border-rose-200/80 hover:border-rose-300 hover:shadow-xs transition-all cursor-pointer text-left group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-100 text-rose-600 group-hover:scale-105 transition-transform">
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                    Saved Deals & Price Trackers
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {savedDealsCount > 0 ? `${savedDealsCount} deal${savedDealsCount > 1 ? 's' : ''} saved in your list` : "View your bookmarked products & offers"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {savedDealsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black shadow-xs">
                    {savedDealsCount}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-rose-500 group-hover:translate-x-0.5 transition-all" />
              </div>
            </button>

            {/* 3. Unified Country / Region Selector (USER REQUESTED - 6 TIER-1 GLOBAL MARKETS) */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <Globe className="w-4 h-4 text-brand-indigo" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Shopping Country & Currency
                </h4>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {COUNTRIES_LIST.map((c) => {
                  const isSelected = selectedCountry === c.code;
                  return (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => {
                        onCountryChange(c.code);
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all relative cursor-pointer ${
                        isSelected
                          ? "bg-indigo-50/70 border-brand-indigo ring-2 ring-brand-indigo/20 shadow-xs"
                          : "bg-white border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-brand-indigo text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                      <div className="text-2xl mb-1">{c.flag}</div>
                      <div className="text-xs font-extrabold text-slate-900 leading-tight">
                        {c.name}
                      </div>
                      <div className="text-[11px] font-bold text-brand-indigo mt-0.5">
                        {c.currency} ({c.symbol})
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium mt-1 line-clamp-1">
                        {c.popularStores}
                      </div>
                    </button>
                  );
                })}
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

            {/* Customer Support & Helpdesk */}
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenSupportTicket) onOpenSupportTicket();
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-blue-50/70 hover:bg-blue-100/70 text-blue-900 border border-blue-200/80 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <LifeBuoy className="w-4 h-4 text-blue-600" />
                  <div className="text-left">
                    <p className="text-xs font-bold">💬 Need Help? Support & Tickets</p>
                    <p className="text-[10px] text-blue-700">Report an issue, request features or claim VTON credits</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>
            </div>

            {/* 5. Sign Out Button if Signed In */}
            {isLoaded && isSignedIn && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={async () => {
                    await signOut();
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 text-xs font-bold transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-slate-500" />
                  <span>Sign Out of Account</span>
                </button>

                {/* Account Deletion & Right to Erasure (DPDP / GDPR) */}
                {!showDeleteConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 text-[11px] font-semibold transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Account & Wipe All Data</span>
                  </button>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-rose-50/90 border border-rose-200 space-y-3">
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-extrabold text-rose-900">Permanently Delete Account?</h4>
                        <p className="text-[11px] text-rose-700 mt-0.5 leading-relaxed">
                          This will immediately erase your profile, search logs, saved outfits, and all personal records under DPDP Act & GDPR rules. This cannot be undone.
                        </p>
                      </div>
                    </div>

                    {deleteError && (
                      <p className="text-[11px] text-rose-800 bg-rose-100 p-2 rounded-lg font-medium">
                        {deleteError}
                      </p>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={handleDeleteAccount}
                        className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-98 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {isDeleting ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Purging Data...</span>
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Yes, Delete Everything</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() => setShowDeleteConfirm(false)}
                        className="py-2 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
