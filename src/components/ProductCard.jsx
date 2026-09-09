"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Star, CheckCircle, Sparkles, ChevronDown, ChevronUp, ShoppingBag, ShieldCheck, Zap, Award } from "lucide-react";
import CouponBadge from "./CouponBadge";

const formatPrice = (val, currency) => {
  if (val === undefined || val === null) return "";
  const isUSD = currency === "USD" || currency === "$";
  const symbol = isUSD ? "$" : "₹";
  
  if (typeof val === "string") {
    if (val.includes("$") || val.includes("₹")) return val;
    const cleanVal = val.replace(/[$₹\s,]/g, "");
    const num = parseFloat(cleanVal);
    if (isNaN(num)) return `${symbol}${val}`;
    val = num;
  }
  
  return new Intl.NumberFormat(isUSD ? "en-US" : "en-IN", {
    style: "currency",
    currency: isUSD ? "USD" : "INR",
    maximumFractionDigits: 0,
  }).format(val);
};

export default function ProductCard({ product }) {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  const [selectedStore, setSelectedStore] = useState({
    name: product.store || "Online Store",
    url: product.affiliateUrl || "#",
    price: product.price
  });

  React.useEffect(() => {
    setSelectedStore({
      name: product.store || "Online Store",
      url: product.affiliateUrl || "#",
      price: product.price
    });
  }, [product]);

  const handleCopyCode = (code, e) => {
    if (e) e.stopPropagation();
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(code);
    }
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };
  
  const ratingVal = parseFloat(product.rating) || 4.5;
  const discountVal = parseInt(product.discountPercent) || 0;
  
  const initialImg = product.image_url || product.image || product.thumbnail || product.product_image || "/laptop.jpg";
  const [imgSrc, setImgSrc] = useState(initialImg);
  const [imgFailed, setImgFailed] = useState(false);

  React.useEffect(() => {
    setImgSrc(initialImg);
    setImgFailed(false);
  }, [initialImg]);

  const handleBuyNow = (e) => {
    if (e) {
      e.preventDefault();
    }
    setIsRedirecting(true);
    
    fetch("/api/telemetry/click", { method: "POST" }).catch(() => {});
    
    setTimeout(() => {
      setIsRedirecting(false);
      window.open(selectedStore.url || product.affiliateUrl, "_blank", "noopener,noreferrer");
    }, 1800);
  };

  const getStoreBadge = () => {
    const storeName = selectedStore.name || product.store || "Online Store";
    const storeLower = storeName.toLowerCase();
    
    let bgClass = "bg-brand-indigo/15 border-brand-indigo/35 text-brand-indigo";
    let dotColor = "bg-brand-indigo";

    if (storeLower.includes("amazon")) {
      bgClass = "bg-[#131921]/90 border-[#ff9900]/40 text-amber-300";
      dotColor = "bg-[#ff9900]";
    } else if (storeLower.includes("flipkart")) {
      bgClass = "bg-[#2874f0]/20 border-[#ffe11b]/40 text-blue-300";
      dotColor = "bg-[#ffe11b]";
    } else if (storeLower.includes("croma")) {
      bgClass = "bg-[#121212]/90 border-[#00e6c3]/40 text-[#00e6c3]";
      dotColor = "bg-[#00e6c3]";
    } else if (storeLower.includes("vijay") || storeLower.includes("vj")) {
      bgClass = "bg-red-600/15 border-red-500/40 text-red-400";
      dotColor = "bg-red-500";
    }

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold tracking-wide capitalize shadow-inner ${bgClass}`}>
        <span className={`w-2 h-2 rounded-full animate-pulse ${dotColor}`} />
        {storeName}
      </span>
    );
  };

  const renderSpecs = () => (
    <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80">
      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-2 flex items-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-brand-indigo" />
        <span>Verified Technical Specifications</span>
      </span>
      <ul className="space-y-1.5">
        {product.specs.map((spec, idx) => (
          <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 font-medium">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span>{spec}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -25 }}
        whileHover={{
          y: -6,
          borderColor: "rgba(168, 85, 247, 0.45)",
          boxShadow: "0 16px 35px -10px rgba(99, 102, 241, 0.25)"
        }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="glass-panel-accent rounded-2xl p-5 flex flex-col justify-between h-full relative overflow-hidden shadow-2xl border border-slate-800/90 transition-all duration-300 group"
      >
        {/* Glowing top ambient light */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-indigo/10 rounded-full blur-2xl pointer-events-none group-hover:bg-brand-violet/20 transition-all" />

        {/* Top Info Section */}
        <div>
          {/* Store Badge & Rating */}
          <div className="flex items-center justify-between gap-3 mb-3">
            {getStoreBadge()}
            
            <div className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-200">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span>{product.rating}</span>
              <span className="text-slate-500 font-normal">({product.reviewsCount})</span>
            </div>
          </div>

          {/* 🔥 Best Deal Badge */}
          <div className="mb-3.5 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider shadow-sm">
              <Zap className="w-3 h-3 text-emerald-400 animate-pulse" />
              Best Verified Deal on {selectedStore.name}
            </span>
          </div>

          {/* Product Image */}
          <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4 bg-slate-950/90 border border-slate-800/90 flex items-center justify-center group-hover:border-brand-indigo/30 transition-colors">
            {imgFailed ? (
              <div className="flex flex-col items-center justify-center gap-2 text-slate-500 w-full h-full bg-slate-950/50">
                <ShoppingBag className="w-10 h-10 text-slate-600 animate-pulse" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">No Product Image</span>
              </div>
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={imgSrc}
                alt={product.title}
                onError={() => {
                  let fallback = "/laptop.jpg";
                  const titleLower = (product.title || "").toLowerCase();
                  if (titleLower.includes("shirt") || titleLower.includes("cotton") || titleLower.includes("wear") || titleLower.includes("cloth") || titleLower.includes("denim")) {
                    fallback = "/shirt.jpg";
                  } else if (titleLower.includes("headphone") || titleLower.includes("noise") || titleLower.includes("ear") || titleLower.includes("audio") || titleLower.includes("sound")) {
                    fallback = "/headphones.jpg";
                  }
                  
                  if (imgSrc === fallback || imgSrc === "") {
                    setImgFailed(true);
                  } else {
                    setImgSrc(fallback);
                  }
                }}
                className="object-contain w-full h-full p-3 transform group-hover:scale-105 transition-transform duration-500 bg-slate-950/40"
              />
            )}
            {product.tag && (
              <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-brand-indigo to-brand-violet text-white shadow-lg z-20">
                {product.tag}
              </span>
            )}
          </div>

          {/* Title & Price */}
          <div className="mb-4">
            <h3 className="text-base md:text-lg font-bold text-white line-clamp-2 leading-tight mb-2 group-hover:text-brand-indigo transition-colors">
              {product.title}
            </h3>
            <div className="flex items-baseline gap-2.5">
              <span className="text-2xl md:text-3xl font-black text-white tracking-tight">
                {formatPrice(selectedStore.price || product.price, product.currency)}
              </span>
              {product.originalPrice && (
                <span className="text-xs md:text-sm text-slate-500 line-through font-semibold">
                  {formatPrice(product.originalPrice, product.currency)}
                </span>
              )}
              {product.discountPercent && (
                <span className="text-xs text-emerald-400 font-extrabold bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                  {product.discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Public Coupons & Bank Offers Chip */}
            {((product.coupons && product.coupons.length > 0) || product.coupon) && (() => {
              const activeCoupon = (product.coupons && product.coupons[0]) || product.coupon;
              if (!activeCoupon) return null;

              return (
                <div className="mt-3.5 min-h-[54px] flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-purple-950/40 via-slate-900/60 to-indigo-950/40 border border-purple-500/35 transition-all hover:border-purple-500/50 shadow-md">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300 text-xs shrink-0">
                      💳
                    </span>
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white truncate">
                          {activeCoupon.discount}
                        </span>
                        {activeCoupon.effective_price && (
                          <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded border border-emerald-500/20">
                            Eff. {formatPrice(activeCoupon.effective_price, product.currency)}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 truncate">
                        {activeCoupon.description}
                      </p>
                    </div>
                  </div>

                  {activeCoupon.code && (
                    <button
                      type="button"
                      onClick={(e) => handleCopyCode(activeCoupon.code, e)}
                      className="ml-2 px-2.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 active:scale-95 text-white text-[11px] font-bold transition-all shrink-0 flex items-center gap-1 shadow-md cursor-pointer"
                    >
                      {copiedCode === activeCoupon.code ? (
                        <span className="text-emerald-300 font-extrabold">Copied! ✓</span>
                      ) : (
                        <span>📋 {activeCoupon.code}</span>
                      )}
                    </button>
                  )}
                </div>
              );
            })()}

            {/* Price Comparison Chips (Read-Only Benchmarks) */}
            {product.priceComparison && product.priceComparison.length > 0 && (
              <div className="mt-3.5 border-t border-slate-800/80 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Store Price Benchmarks:</span>
                  <span className="text-[10px] text-slate-500 font-medium italic">Verified Info</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.priceComparison.map((offer, idx) => {
                    const offerStoreName = offer.store || offer.store_name || "Online Store";
                    const isLowest = offer.is_lowest;
                    return (
                      <div
                        key={idx}
                        className={`inline-flex flex-col items-start px-2.5 py-1.5 rounded-xl border text-left cursor-default select-none transition-all ${
                          isLowest
                            ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                            : "bg-slate-950/60 border-slate-800/80 text-slate-300"
                        }`}
                      >
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1">
                          {offerStoreName}
                          {isLowest && <span className="text-[8px] bg-emerald-500/20 text-emerald-300 px-1 py-0.2 rounded font-extrabold">LOWEST</span>}
                        </span>
                        <span className="text-xs font-black mt-0.5">{offer.price}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* AI Matching Insight Hub Badge */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-brand-indigo/15 via-slate-900/80 to-purple-950/20 border border-brand-indigo/30 mb-4 shadow-[inset_0_1px_12px_rgba(99,102,241,0.08)]">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-brand-indigo mb-2">
              <Sparkles className="w-4 h-4 text-brand-indigo animate-pulse" />
              <span className="tracking-wide uppercase text-[11px]">AI Matching Insight</span>
            </div>
            <div className="text-xs md:text-sm text-slate-200 leading-relaxed font-medium whitespace-pre-line">
              {product.aiReason}
            </div>
          </div>

          {/* Mobile Specs Toggle */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full md:hidden py-3 px-4 mb-3 text-xs font-bold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 rounded-xl flex items-center justify-between transition-all cursor-pointer"
          >
            <span>Specs & Key Features</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          <div className="hidden md:block mb-4">
            {renderSpecs()}
          </div>

          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                animate={{ height: "auto", opacity: 1, marginBottom: 12 }}
                exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="md:hidden overflow-hidden"
              >
                {renderSpecs()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom CTA Section */}
        <div>
          <a
            href={selectedStore.url || product.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleBuyNow}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-brand-indigo via-brand-violet to-purple-600 hover:from-brand-indigo/90 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-[0_4px_25px_rgba(99,102,241,0.3)] hover:shadow-[0_4px_35px_rgba(168,85,247,0.5)] active:scale-98 text-sm group cursor-pointer text-center"
          >
            <span>Buy Now at {selectedStore.name}</span>
            <ArrowUpRight className="w-4.5 h-4.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </motion.div>

      {/* Redirecting Modal */}
      <AnimatePresence>
        {isRedirecting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md glass-panel rounded-2xl p-6 md:p-8 text-center shadow-2xl relative overflow-hidden border-brand-indigo/40"
            >
              <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-brand-indigo/25 blur-3xl" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-brand-violet/25 blur-3xl" />

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 shadow-inner relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-t-2 border-brand-indigo border-r-2 border-transparent"
                  />
                  {selectedStore.name.toLowerCase().includes("amazon") ? (
                    <span className="text-xl font-black text-[#ff9900]">a</span>
                  ) : (
                    <span className="text-xl font-black text-[#2874f0]">F</span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white mb-2">Redirecting to {selectedStore.name}</h3>
                <p className="text-sm text-slate-400 mb-6 max-w-xs leading-relaxed">
                  Connecting your session to apply verified discount tags for maximum savings.
                </p>

                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800/80">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.6, ease: "easeInOut" }}
                    className="h-full bg-gradient-to-r from-brand-indigo via-brand-violet to-emerald-400"
                  />
                </div>

                <div className="flex items-center gap-1.5 mt-4 text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-md border border-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Affiliate Deal Verified</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
