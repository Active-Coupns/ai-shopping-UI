"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Tag, 
  Copy, 
  Check, 
  ExternalLink, 
  ArrowLeft, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  AlertCircle,
  ShoppingBag,
  Store,
  Coins
} from "lucide-react";

export default function CouponResultView({
  resultData,
  isCartAnalysis = false,
  onReset
}) {
  const [copiedCode, setCopiedCode] = useState(null);
  const [particles, setParticles] = useState([]);

  const analysis = resultData?.analysis || null;
  const optimization = resultData?.optimization || null;
  const storeCoupons = resultData?.coupons || optimization?.allCoupons || [];
  const bestCoupon = optimization?.bestCoupon || null;
  const nextTier = optimization?.nextTierOpportunities || [];
  const storeName = resultData?.storeName || optimization?.storeName || analysis?.detectedStore || "Store";
  const logo = resultData?.logo || optimization?.logo || "🏷️";
  const cartTotal = analysis?.cartTotal || optimization?.cartTotal || 0;

  const handleCopyCode = async (code) => {
    if (!code) return;

    // Trigger celebratory particle burst
    const burst = Array.from({ length: 24 }).map((_, i) => ({
      id: `p-${i}-${Date.now()}`,
      x: (Math.random() - 0.5) * 150,
      y: -20 - Math.random() * 80,
      size: Math.random() * 4 + 2,
      color: Math.random() > 0.5 ? "#8b5cf6" : "#ec4899"
    }));
    setParticles(burst);
    setTimeout(() => setParticles([]), 1800);

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const temp = document.createElement("input");
        temp.value = code;
        temp.style.position = "absolute";
        temp.style.left = "-9999px";
        document.body.appendChild(temp);
        temp.select();
        document.execCommand("copy");
        document.body.removeChild(temp);
      }
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 3000);
    } catch (err) {
      console.warn("Copy failed:", err);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 md:py-8">
      {/* Confetti Particles Container */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: p.x, y: p.y, opacity: 0, scale: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="fixed rounded-full pointer-events-none z-50"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              left: "50%",
              top: "40%"
            }}
          />
        ))}
      </AnimatePresence>

      {/* Top Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onReset}
            className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 transition-all shadow-xs cursor-pointer active:scale-95"
            title="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{logo}</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {storeName} Promo Codes
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-700">
                100% Verified
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {isCartAnalysis
                ? `AI Cart Analyzed: Cart Total ₹${cartTotal} • Showing best matched coupons`
                : `Live verified daily discount codes & bank promotions`}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
        >
          <span>Search Another Store</span>
        </button>
      </div>

      {/* CART SCREENSHOT ANALYSIS HERO CARD (When Analyzed from Screenshot) */}
      {isCartAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-violet-900 via-indigo-900 to-slate-900 text-white shadow-xl shadow-indigo-950/20 border border-violet-500/30 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/30 text-[11px] font-bold text-violet-200">
                <Sparkles className="w-3.5 h-3.5 text-violet-300 animate-pulse" />
                <span>AI Cart Match Result</span>
              </div>
              <div className="text-xs font-medium text-slate-300 flex items-center gap-3">
                <span>Detected Store: <strong className="text-white">{storeName}</strong></span>
                <span>•</span>
                <span>Cart Bill: <strong className="text-amber-300 font-mono text-sm font-bold">₹{cartTotal}</strong></span>
              </div>
            </div>

            {bestCoupon ? (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/15">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-amber-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 fill-amber-400" />
                        Highest Savings Pick
                      </span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                        Save ₹{bestCoupon.savingsAmount} Instantly
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-white">
                      {bestCoupon.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      {bestCoupon.description}
                    </p>
                    <div className="flex items-center gap-4 text-[11px] text-slate-400 mt-2">
                      <span>Min Order: <strong>₹{bestCoupon.min_order}</strong></span>
                      <span>•</span>
                      <span>Payment: <strong>{bestCoupon.payment_method}</strong></span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopyCode(bestCoupon.code)}
                      className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer font-mono"
                    >
                      {copiedCode === bestCoupon.code ? (
                        <>
                          <Check className="w-4 h-4 text-slate-950 stroke-[3]" />
                          <span>COPIED! ✅</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-slate-950" />
                          <span>COPY &ldquo;{bestCoupon.code}&rdquo;</span>
                        </>
                      )}
                    </button>
                    {bestCoupon.link && (
                      <a
                        href={bestCoupon.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-violet-200 hover:text-white flex items-center gap-1 underline underline-offset-2 py-1"
                      >
                        <span>Open {storeName} App</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/10 rounded-2xl p-5 text-center text-slate-300 text-sm">
                No direct coupon matched cart value of ₹{cartTotal}. See below for codes with minimum cart tiers.
              </div>
            )}

            {/* Next Tier Upgrade Opportunity */}
            {nextTier.length > 0 && (
              <div className="mt-4 p-3.5 rounded-2xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-between gap-3 text-xs text-amber-200">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    💡 <strong>Pro Tip:</strong> Add just <strong>₹{nextTier[0].shortfall}</strong> more to your cart to unlock <strong>{nextTier[0].title}</strong> (Code: <code className="font-bold text-white bg-black/30 px-1.5 py-0.5 rounded">{nextTier[0].code}</code>)!
                  </span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ALL VERIFIED COUPONS GRID */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Tag className="w-4 h-4 text-violet-600" />
            <span>All Active Promo Codes ({storeCoupons.length})</span>
          </h3>
          <span className="text-xs text-slate-500">
            Updated today • Verified working
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {storeCoupons.map((coupon, idx) => {
            const isBest = isCartAnalysis && bestCoupon?.code === coupon.code;
            return (
              <motion.div
                key={coupon.id || `coupon-card-${idx}`}
                whileHover={{ y: -3 }}
                className={`p-5 rounded-2xl bg-white border transition-all shadow-sm flex flex-col justify-between h-56 relative overflow-hidden ${
                  isBest 
                    ? "border-violet-500 ring-2 ring-violet-500/20 shadow-violet-100" 
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {/* Top Badge */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold text-violet-700 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {coupon.badge || "PROMO CODE"}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      {coupon.verified_rate || "98% Success"}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                    {coupon.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {coupon.description}
                  </p>
                </div>

                {/* Bottom Section & Copy CTA */}
                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2.5">
                    <span>Min Order: <strong className="text-slate-700">₹{coupon.min_order}</strong></span>
                    <span>Max Save: <strong className="text-emerald-600 font-bold">₹{coupon.max_discount}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyCode(coupon.code)}
                      className={`flex-1 flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer font-mono text-xs font-bold active:scale-95 ${
                        copiedCode === coupon.code
                          ? "bg-emerald-500 text-white shadow-sm"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200/80"
                      }`}
                    >
                      <span className="tracking-wider">{coupon.code}</span>
                      {copiedCode === coupon.code ? (
                        <span className="text-[10px] flex items-center gap-1 font-sans">
                          <Check className="w-3 h-3 stroke-[3]" /> Copied
                        </span>
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" />
                      )}
                    </button>

                    {coupon.link && (
                      <a
                        href={coupon.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-all"
                        title="Open Store"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
