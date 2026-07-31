"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Star, CheckCircle, Sparkles, ChevronDown, ChevronUp, ShoppingBag } from "lucide-react";
import CouponBadge from "./CouponBadge";
import { revealCoupon } from "@/services/api";

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
    
    // Simulate redirection delay
    setTimeout(() => {
      setIsRedirecting(false);
      window.open(product.affiliateUrl, "_blank", "noopener,noreferrer");
    }, 1800);
  };

  // Setup badge style depending on store
  const getStoreBadge = () => {
    const storeName = product.store || "Online Store";
    const storeLower = storeName.toLowerCase();
    
    let bgClass = "bg-brand-indigo/10 border-brand-indigo/30 text-brand-indigo";
    let dotColor = "bg-brand-indigo";

    if (storeLower.includes("amazon")) {
      bgClass = "bg-[#131921] border-[#ff9900]/30 text-white";
      dotColor = "bg-[#ff9900]";
    } else if (storeLower.includes("flipkart")) {
      bgClass = "bg-[#2874f0] border-[#ffe11b]/30 text-white";
      dotColor = "bg-[#ffe11b]";
    } else if (storeLower.includes("croma")) {
      bgClass = "bg-[#121212] border-[#00e6c3]/30 text-[#00e6c3]";
      dotColor = "bg-[#00e6c3]";
    } else if (storeLower.includes("vijay") || storeLower.includes("vj")) {
      bgClass = "bg-red-600/10 border-red-500/30 text-red-500";
      dotColor = "bg-red-500";
    }

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold tracking-wide capitalize ${bgClass}`}>
        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${dotColor}`} />
        {storeName}
      </span>
    );
  };

  // The specifications list content
  const renderSpecs = () => (
    <div>
      <span className="text-xs font-bold uppercase text-slate-400 tracking-wider block mb-2">
        Specs & Analysis
      </span>
      <ul className="space-y-1.5">
        {product.specs.map((spec, idx) => (
          <li key={idx} className="flex items-start gap-2 text-xs md:text-sm text-slate-300">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
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
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.5 }}
        className="glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-between h-full relative overflow-hidden shadow-xl"
      >
        {/* Top Info Section */}
        <div>
          {/* Store Badge & Rating */}
          <div className="flex items-center justify-between gap-3 mb-4">
            {getStoreBadge()}
            
            <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span>{product.rating}</span>
              <span className="text-slate-500">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Image - ALWAYS visible */}
          <div className="relative w-full h-44 rounded-xl overflow-hidden mb-4 bg-slate-950/80 border border-slate-800 flex items-center justify-center">
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
                className="object-contain w-full h-full p-2.5 transform hover:scale-105 transition-transform duration-500 bg-slate-950/40"
              />
            )}
            {product.tag && (
              <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-brand-indigo to-brand-violet text-white shadow-lg">
                {product.tag}
              </span>
            )}
          </div>

          {/* Title & Price - ALWAYS visible */}
          <div className="mb-4">
            <h3 className="text-lg font-bold text-white line-clamp-2 leading-tight mb-2 hover:text-brand-indigo transition-colors">
              {product.title}
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">
                {formatPrice(product.price, product.currency)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-slate-500 line-through font-medium">
                  {formatPrice(product.originalPrice, product.currency)}
                </span>
              )}
              {product.discountPercent && (
                <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  {product.discountPercent}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Why This Fits You AI Badge - ALWAYS visible */}
          <div className="p-3.5 rounded-xl bg-brand-indigo/10 border border-brand-indigo/25 mb-4 shadow-[inset_0_1px_10px_rgba(99,102,241,0.05)]">
            <div className="flex items-center gap-1.5 text-xs font-bold text-brand-indigo mb-1.5">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>AI Matching Insight</span>
            </div>
            <p className="text-xs md:text-sm text-slate-200 leading-snug font-medium italic">
              &ldquo;{product.aiReason}&rdquo;
            </p>
          </div>

          {/* Collapsible Specs Header/Toggle Button - Mobile Only */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full md:hidden py-3 px-4 mb-3 text-xs font-bold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-xl flex items-center justify-between transition-all duration-300 active:scale-98 shadow-sm cursor-pointer"
          >
            <span>{isExpanded ? "Hide Specs" : "View Detailed Specs"}</span>
            {isExpanded ? (
              <ChevronUp className="w-4.5 h-4.5 text-brand-indigo" />
            ) : (
              <ChevronDown className="w-4.5 h-4.5 text-brand-indigo" />
            )}
          </button>

          {/* Specs List Container */}
          
          {/* 1. Desktop version: always visible */}
          <div className="hidden md:block mb-4">
            {renderSpecs()}
          </div>

          {/* 2. Mobile version: animated collapse */}
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

        {/* Bottom Section - ALWAYS visible (Coupon & Buy button) */}
        <div>


          {/* Buy Button */}
          <a
            href={product.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleBuyNow}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-brand-indigo to-brand-violet hover:from-brand-indigo/90 hover:to-brand-violet/90 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-[0_4px_20px_rgba(99,102,241,0.2)] hover:shadow-[0_4px_30px_rgba(168,85,247,0.4)] active:scale-98 text-sm group cursor-pointer text-center"
          >
            <span>Buy Now at {product.store}</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </motion.div>

      {/* Redirecting Modal Micro-interaction */}
      <AnimatePresence>
        {isRedirecting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md glass-panel rounded-2xl p-6 md:p-8 text-center shadow-2xl relative overflow-hidden border-brand-indigo/30"
            >
              {/* Spinning gradient glow */}
              <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-brand-indigo/20 blur-3xl" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-brand-violet/20 blur-3xl" />

              <div className="relative z-10 flex flex-col items-center">
                {/* Store Icon indicator */}
                <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 shadow-inner relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-t-2 border-brand-indigo border-r-2 border-transparent"
                  />
                  {product.store.toLowerCase() === "amazon" ? (
                    <span className="text-xl font-black text-[#ff9900]">a</span>
                  ) : (
                    <span className="text-xl font-black text-[#2874f0]">F</span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white mb-2">Redirecting to {product.store}</h3>
                <p className="text-sm text-slate-400 mb-6 max-w-xs">
                  We are linking your session to apply the coupon{" "}
                  <span className="text-brand-violet font-bold font-mono">{product.coupon?.code || "DEAL"}</span> for maximum savings.
                </p>

                {/* Progress bar loader */}
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800/80">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.6, ease: "easeInOut" }}
                    className="h-full bg-gradient-to-r from-brand-indigo to-brand-violet"
                  />
                </div>

                <div className="flex items-center gap-1.5 mt-4 text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-md">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Affiliate Deal Activated</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
