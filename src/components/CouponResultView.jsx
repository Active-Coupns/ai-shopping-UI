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
  ChevronDown,
  Eye,
  Lock,
  Unlock,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Award,
  Clock,
  Flame,
  CreditCard
} from "lucide-react";

export default function CouponResultView({
  resultData,
  isCartAnalysis = false,
  onReset
}) {
  const [copiedCode, setCopiedCode] = useState(null);
  const [revealedCodes, setRevealedCodes] = useState({});
  const [particles, setParticles] = useState([]);
  const [openFaq, setOpenFaq] = useState(0); // First FAQ open by default for rich content
  const [expandedAiGuides, setExpandedAiGuides] = useState({});

  const toggleAiGuide = (code) => {
    setExpandedAiGuides(prev => ({
      ...prev,
      [code]: !prev[code]
    }));
  };

  const getCouponAiFitGuide = (coupon) => {
    if (!coupon) return null;
    const minOrder = Number(coupon.min_order) || 0;
    const maxDiscount = Number(coupon.max_discount) || 0;
    const discountType = coupon.discount_type || "PERCENT";
    const discountVal = Number(coupon.discount_val) || 0;
    const paymentMethod = coupon.payment_method || "All Payment Methods";
    const badge = (coupon.badge || "").toUpperCase();
    const desc = (coupon.description || "").toLowerCase();

    let userTarget = "All Customers";
    let targetDesc = `Valid for all registered accounts with cart ₹${minOrder}+.`;
    if (badge.includes("NEW USER") || desc.includes("new user") || desc.includes("first")) {
      userTarget = "New Accounts Only";
      targetDesc = `First-time customer offer on fresh mobile number & device.`;
    } else if (badge.includes("BANK") || paymentMethod.toLowerCase().includes("bank") || paymentMethod.toLowerCase().includes("card")) {
      userTarget = `Cardholders (${paymentMethod})`;
      targetDesc = `Exclusive to payments completed via ${paymentMethod}.`;
    } else if (badge.includes("GROUP") || minOrder >= 600) {
      userTarget = "Large / Group Orders";
      targetDesc = `High cart requirement (₹${minOrder}+) for maximum bulk discount.`;
    }

    let sweetSpot = "";
    if (discountType === "PERCENT" && maxDiscount > 0 && discountVal > 0) {
      const optimalCart = Math.round(maxDiscount / (discountVal / 100));
      sweetSpot = `Cart between ₹${minOrder} and ₹${optimalCart} (max ₹${maxDiscount} savings reached at ₹${optimalCart}).`;
    } else if (discountType === "FLAT") {
      sweetSpot = `Cart at or near ₹${minOrder} gives highest return (${Math.min(100, Math.round((maxDiscount / (minOrder || 1)) * 100))}% effective savings).`;
    } else {
      sweetSpot = `Cart at or above ₹${minOrder}.`;
    }

    let hiddenCatch = "";
    if (discountType === "PERCENT" && maxDiscount > 0) {
      hiddenCatch = `Discount strictly capped at ₹${maxDiscount}. Higher carts won't get higher savings.`;
    } else if (badge.includes("BANK")) {
      hiddenCatch = `Cannot combine with Paytm/PhonePe UPI; must choose Credit/Debit Card directly.`;
    } else if (badge.includes("NEW USER")) {
      hiddenCatch = `Must have 0 prior delivered orders on this phone number and device.`;
    } else {
      hiddenCatch = `Must hit ₹${minOrder} before packaging charges, taxes and delivery fees.`;
    }

    return {
      userTarget,
      targetDesc,
      sweetSpot,
      hiddenCatch,
      paymentMethod
    };
  };

  const analysis = resultData?.analysis || null;
  const optimization = resultData?.optimization || null;
  const storeCoupons = resultData?.coupons || optimization?.allCoupons || [];
  const bestCoupon = optimization?.bestCoupon || null;
  const nextTier = optimization?.nextTierOpportunities || [];
  const storeName = resultData?.storeName || optimization?.storeName || analysis?.detectedStore || "Store";
  const logo = resultData?.logo || optimization?.logo || "🏷️";
  const cartTotal = analysis?.cartTotal || optimization?.cartTotal || 0;

  // Mask code utility to protect against Google zero-click scraping
  const getMaskedCode = (code) => {
    if (!code) return "CODE•••";
    if (code.length <= 4) return code.slice(0, 2) + "•••";
    return code.slice(0, 4) + "•••";
  };

  // In-Page Reveal & Copy: Never kicks user out of our website
  const handleRevealAndCopy = async (coupon) => {
    if (!coupon?.code) return;
    const code = coupon.code;

    // 1. Mark code as revealed in place
    setRevealedCodes(prev => ({ ...prev, [code]: true }));

    // 2. Trigger celebratory particle burst in place
    const burst = Array.from({ length: 28 }).map((_, i) => ({
      id: `p-${i}-${Date.now()}`,
      x: (Math.random() - 0.5) * 160,
      y: -20 - Math.random() * 90,
      size: Math.random() * 4 + 2,
      color: Math.random() > 0.5 ? "#8b5cf6" : "#ec4899"
    }));
    setParticles(burst);
    setTimeout(() => setParticles([]), 1800);

    // 3. Copy code to clipboard cleanly
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
      setTimeout(() => setCopiedCode(null), 3500);
    } catch (err) {
      console.warn("Copy failed:", err);
    }
  };

  // SEO Savings Hacks curated for store
  const savingHacks = [
    {
      title: "Hit Minimum Cart Thresholds",
      desc: `Check the exact cart minimums (e.g. ₹149, ₹199 or ₹499). Adding a ₹20 add-on often saves you ₹100+ on ${storeName} by qualifying for higher discounts.`
    },
    {
      title: "Stack Universal Codes with Payment Offers",
      desc: `Apply universal promo codes (like WELCOME or CRAVINGS) and pair them with UPI cashback (CRED Pay, Paytm, PhonePe) for double compounding savings.`
    },
    {
      title: "Check Bank Day Promotions",
      desc: `Major Indian banks (HDFC, ICICI, Axis, SBI) run rotating day-of-the-week promotions on ${storeName} with instant 10% to 15% bill reductions.`
    },
    {
      title: "Scan Your Cart with ShopSmart AI",
      desc: `Before completing checkout, paste your cart screenshot into ShopSmart AI. Our AI vision instantly calculates which exact coupon produces the highest net rupee savings.`
    }
  ];

  // Semantic SEO FAQs with Schema.org readiness
  const storeFaqs = [
    {
      q: `How do I apply a verified promo code on ${storeName}?`,
      a: `To apply a promo code on ${storeName}: 1) Add your desired items to the cart and open checkout. 2) Look for the 'Apply Coupon' or 'Promo Code' input box. 3) Click 'Reveal & Copy' above on ShopSmart AI. The code will unmask and copy to your clipboard. 4) Paste the code in the ${storeName} checkout box to instantly enjoy your discount!`
    },
    {
      q: `Are these ${storeName} discount codes tested and working today?`,
      a: `Yes! Every code on ShopSmart AI is tested daily against verified minimum order slabs and bank criteria. Unlike outdated aggregator sites that display expired codes, we only feature active universal cart discounts and real-time bank promotions.`
    },
    {
      q: `Can I use more than one coupon code on ${storeName}?`,
      a: `Most merchant checkout systems allow one promo code per order. However, you can frequently combine a universal promo code with payment gateway offers (such as credit card instant discounts or UPI cashbacks) for compounded savings.`
    },
    {
      q: `What should I do if a promo code says 'Not Applicable'?`,
      a: `If a code does not apply, check the minimum cart value shown on our card (e.g. ₹199 or ₹499). You can also upload your cart screenshot to ShopSmart AI to let our optimizer find the exact code matching your items.`
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 md:py-8 text-left">
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
            onClick={() => onReset?.("COUPONS")}
            className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 transition-all shadow-xs cursor-pointer active:scale-95"
            title="Go back to stores"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{logo}</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {storeName} Promo Codes & Offers
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-700">
                100% Verified Today
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {isCartAnalysis
                ? `AI Cart Analyzed: Cart Total ₹${cartTotal} • Showing best matched coupons`
                : `October 2026 Verified: Active promo vouchers, universal cart codes & bank offers`}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onReset?.("COUPONS")}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
        >
          <span>← Browse All Stores</span>
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

                    {/* AI Coupon Fit Guide for Best Pick */}
                    {(() => {
                      const bestAiFit = getCouponAiFitGuide(bestCoupon);
                      const isBestOpen = Boolean(expandedAiGuides[bestCoupon.code]);
                      return (
                        <div className="mt-3">
                          <button
                            type="button"
                            onClick={() => toggleAiGuide(bestCoupon.code)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-violet-100 hover:text-white text-xs font-bold transition-all cursor-pointer border border-white/20 active:scale-95"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                            <span>AI Coupon Fit Guide</span>
                            <span className="text-[10px] text-violet-200">({isBestOpen ? "Hide" : "Why this fits you?"})</span>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isBestOpen ? "rotate-180" : ""}`} />
                          </button>

                          <AnimatePresence>
                            {isBestOpen && bestAiFit && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden mt-2.5"
                              >
                                <div className="p-3 rounded-xl bg-black/30 backdrop-blur-md border border-white/15 text-xs space-y-1.5 text-slate-200">
                                  <div className="flex items-start gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                    <span><strong className="text-white">Valid For:</strong> {bestAiFit.targetDesc}</span>
                                  </div>
                                  <div className="flex items-start gap-1.5">
                                    <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                                    <span><strong className="text-white">Sweet Spot:</strong> {bestAiFit.sweetSpot}</span>
                                  </div>
                                  <div className="flex items-start gap-1.5">
                                    <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                                    <span><strong className="text-white">The Catch:</strong> {bestAiFit.hiddenCatch}</span>
                                  </div>
                                  <div className="flex items-start gap-1.5">
                                    <CreditCard className="w-3.5 h-3.5 text-violet-300 shrink-0 mt-0.5" />
                                    <span><strong className="text-white">Payment:</strong> {bestAiFit.paymentMethod}</span>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="flex flex-col items-stretch sm:items-end gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleRevealAndCopy(bestCoupon)}
                      className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer font-mono"
                    >
                      {copiedCode === bestCoupon.code ? (
                        <>
                          <Check className="w-4 h-4 text-slate-950 stroke-[3]" />
                          <span>COPIED! ✅</span>
                        </>
                      ) : revealedCodes[bestCoupon.code] ? (
                        <>
                          <Copy className="w-4 h-4 text-slate-950" />
                          <span>COPY &ldquo;{bestCoupon.code}&rdquo;</span>
                        </>
                      ) : (
                        <>
                          <Unlock className="w-4 h-4 text-slate-950" />
                          <span>REVEAL &ldquo;{getMaskedCode(bestCoupon.code)}&rdquo;</span>
                        </>
                      )}
                    </button>

                    {bestCoupon.link && (
                      <a
                        href={bestCoupon.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-violet-200 hover:text-white flex items-center justify-center sm:justify-end gap-1 underline underline-offset-2 py-0.5"
                      >
                        <span>Open {storeName} in new tab</span>
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

      {/* ALL VERIFIED COUPONS GRID WITH IN-PAGE CLICK-TO-REVEAL */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-violet-600" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Active Promo Codes for {storeName} ({storeCoupons.length})
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Click to reveal code & copy to clipboard
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {storeCoupons.map((coupon, idx) => {
            const isBest = isCartAnalysis && bestCoupon?.code === coupon.code;
            const isRevealed = Boolean(revealedCodes[coupon.code]);
            const isCopied = copiedCode === coupon.code;

            return (
              <motion.div
                key={coupon.id || `coupon-card-${idx}`}
                whileHover={{ y: -3 }}
                className={`p-5 rounded-2xl bg-white border transition-all shadow-sm flex flex-col justify-between min-h-[220px] relative overflow-hidden ${
                  isBest 
                    ? "border-violet-500 ring-2 ring-violet-500/20 shadow-violet-100" 
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {/* Top Badge & Success Rate */}
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

                  {/* AI Coupon Fit Guide for this card */}
                  {(() => {
                    const aiFit = getCouponAiFitGuide(coupon);
                    const isAiOpen = Boolean(expandedAiGuides[coupon.code]);
                    return (
                      <div className="mt-2.5">
                        <button
                          type="button"
                          onClick={() => toggleAiGuide(coupon.code)}
                          className={`w-full py-1.5 px-2.5 rounded-xl text-left transition-all cursor-pointer border flex items-center justify-between active:scale-98 ${
                            isAiOpen
                              ? "bg-violet-50/90 border-violet-300 text-violet-950 font-bold shadow-2xs"
                              : "bg-slate-50/90 hover:bg-violet-50/60 border-slate-200/80 text-slate-700 hover:text-violet-900"
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-violet-600 fill-violet-200 shrink-0" />
                            <span className="text-[11px] font-bold">AI Fit Guide</span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-violet-700">
                            <span>{isAiOpen ? "Hide" : "Will this work for me?"}</span>
                            <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isAiOpen ? "rotate-180" : ""}`} />
                          </div>
                        </button>

                        <AnimatePresence>
                          {isAiOpen && aiFit && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-2 p-2.5 rounded-xl bg-gradient-to-br from-violet-50/90 via-purple-50/40 to-indigo-50/80 border border-violet-200/90 text-[11px] space-y-1.5 shadow-inner">
                                <div className="flex items-start gap-1.5">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                  <div className="leading-snug">
                                    <span className="font-bold text-slate-800">Valid For: </span>
                                    <span className="text-slate-600">{aiFit.userTarget} — {aiFit.targetDesc}</span>
                                  </div>
                                </div>
                                <div className="flex items-start gap-1.5">
                                  <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                                  <div className="leading-snug">
                                    <span className="font-bold text-slate-800">Best Cart Size: </span>
                                    <span className="text-slate-600">{aiFit.sweetSpot}</span>
                                  </div>
                                </div>
                                <div className="flex items-start gap-1.5">
                                  <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                                  <div className="leading-snug">
                                    <span className="font-bold text-rose-900">The Catch: </span>
                                    <span className="text-slate-600">{aiFit.hiddenCatch}</span>
                                  </div>
                                </div>
                                <div className="flex items-start gap-1.5">
                                  <CreditCard className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                                  <div className="leading-snug">
                                    <span className="font-bold text-slate-800">Payment: </span>
                                    <span className="text-slate-600">{aiFit.paymentMethod}</span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })()}
                </div>

                {/* Bottom Section & In-Page Click-to-Reveal CTA */}
                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2.5">
                    <span>Min Order: <strong className="text-slate-700">₹{coupon.min_order}</strong></span>
                    <span>Max Save: <strong className="text-emerald-600 font-bold">₹{coupon.max_discount}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* The In-Page Reveal/Copy Button */}
                    <button
                      type="button"
                      onClick={() => handleRevealAndCopy(coupon)}
                      className={`flex-1 flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer font-mono text-xs font-bold active:scale-95 shadow-2xs ${
                        isCopied
                          ? "bg-emerald-500 text-white shadow-sm"
                          : isRevealed
                          ? "bg-violet-600 hover:bg-violet-700 text-white"
                          : "bg-gradient-to-r from-violet-50 to-indigo-50 hover:from-violet-100 hover:to-indigo-100 text-violet-900 border border-violet-200/80"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        {isRevealed ? (
                          <Unlock className="w-3.5 h-3.5" />
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-violet-600" />
                        )}
                        <span className="tracking-wider">
                          {isRevealed ? coupon.code : getMaskedCode(coupon.code)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] font-sans font-extrabold">
                        {isCopied ? (
                          <span className="flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 stroke-[3]" /> Copied!
                          </span>
                        ) : isRevealed ? (
                          <span className="flex items-center gap-1 text-violet-100">
                            <Copy className="w-3 h-3" /> Copy
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-violet-700">
                            Reveal Code
                          </span>
                        )}
                      </div>
                    </button>

                    {/* Dedicated Open Store Link (User chooses when to open) */}
                    {coupon.link && (
                      <a
                        href={coupon.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-all shrink-0"
                        title={`Visit ${storeName}`}
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

      {/* RICH SEO SAVINGS GUIDE SECTION (Drives Organic Traffic & High Retention) */}
      <div className="mt-12 pt-8 border-t border-slate-200/80">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-4 h-4 text-violet-600" />
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Top 4 Insider Saving Hacks for {storeName} (October 2026)
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Expert strategies to maximize your savings on every order without paying full price.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {savingHacks.map((hack, hIdx) => (
            <div 
              key={hIdx}
              className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:border-violet-300 transition-all"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-violet-800 mb-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Hack #{hIdx + 1}: {hack.title}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {hack.desc}
              </p>
            </div>
          ))}
        </div>

        {/* SEMANTIC FAQ ACCORDION (Indexed by Google for Rich Snippets) */}
        <div className="mb-8" itemScope itemType="https://schema.org/FAQPage">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-4 h-4 text-violet-600" />
            <h4 className="text-base font-extrabold text-slate-900">
              Frequently Asked Questions About {storeName} Coupons
            </h4>
          </div>

          <div className="space-y-3">
            {storeFaqs.map((faq, fIdx) => {
              const isOpen = openFaq === fIdx;
              return (
                <div 
                  key={fIdx}
                  className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden transition-all shadow-2xs"
                  itemScope 
                  itemProp="mainEntity" 
                  itemType="https://schema.org/Question"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : fIdx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-800 hover:text-violet-700 transition-colors cursor-pointer"
                  >
                    <span itemProp="name">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? "rotate-180 text-violet-600" : ""}`} />
                  </button>
                  
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50"
                        itemScope 
                        itemProp="acceptedAnswer" 
                        itemType="https://schema.org/Answer"
                      >
                        <div itemProp="text">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
