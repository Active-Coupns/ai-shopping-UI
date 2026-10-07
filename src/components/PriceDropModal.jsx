"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, Check, ShieldCheck, TrendingDown, Sparkles } from "lucide-react";

const formatPrice = (val, currency) => {
  if (val === undefined || val === null || val === "" || String(val).toLowerCase().includes("nan")) return "N/A";
  const isUSD = currency === "USD" || currency === "$";
  let num = val;
  if (typeof val === "string") {
    num = parseFloat(val.replace(/[$₹\s,]/g, ""));
  }
  if (typeof num !== "number" || isNaN(num) || num <= 0) return "N/A";
  return new Intl.NumberFormat(isUSD ? "en-US" : "en-IN", {
    style: "currency",
    currency: isUSD ? "USD" : "INR",
    maximumFractionDigits: 0,
  }).format(num);
};

export default function PriceDropModal({
  isOpen,
  onClose,
  product,
  onSaveAlert
}) {
  if (!isOpen || !product) return null;

  const currentPrice = typeof product.price === "number" 
    ? product.price 
    : parseFloat(String(product.price || "").replace(/[^0-9.]/g, "")) || 0;

  const defaultTarget = Math.round(currentPrice * 0.95 / 50) * 50;
  const [targetPrice, setTargetPrice] = useState(defaultTarget || currentPrice);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleActivate = async () => {
    // Request Native Web Push permission if supported (No email needed!)
    if (typeof window !== "undefined" && "Notification" in window) {
      try {
        if (Notification.permission === "default") {
          await Notification.requestPermission();
        }
      } catch (e) {}
    }

    const alertItem = {
      id: product.id || product.product_id || product.title,
      title: product.title,
      image: product.image,
      store: product.store_name || product.store || "Online Store",
      currentPrice: currentPrice,
      targetPrice: targetPrice,
      currency: product.currency || "INR",
      deal_link: product.affiliateUrl || product.deal_link || product.link || "#",
      createdAt: new Date().toISOString()
    };

    if (onSaveAlert) {
      onSaveAlert(alertItem);
    }

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2200);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 15 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 15 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md rounded-3xl p-6 shadow-2xl relative border border-slate-200 bg-white text-slate-900"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4.5 right-4.5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {isSubmitted ? (
            <div className="py-8 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <Check className="w-7 h-7 stroke-[3]" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-1">
                Price Drop Alert Activated!
              </h3>
              <p className="text-xs text-slate-600 max-w-xs leading-relaxed">
                We will notify your browser as soon as {product.title.slice(0, 30)}... drops below {formatPrice(targetPrice, product.currency)}.
              </p>
            </div>
          ) : (
            <div>
              {/* Header */}
              <div className="flex items-center gap-2.5 mb-4">
                <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Track Price Drop
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Zero email liability • Private browser alert
                  </p>
                </div>
              </div>

              {/* Product Preview */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 mb-5 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white p-1 border border-slate-100 shrink-0 flex items-center justify-center overflow-hidden">
                  <img
                    src={product.image || "/laptop.jpg"}
                    alt={product.title}
                    className="object-contain max-h-full max-w-full"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {product.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-bold text-slate-500">Current:</span>
                    <span className="text-sm font-black text-slate-900">
                      {formatPrice(currentPrice, product.currency)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Target Price Configuration */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Alert me when price drops below:
                </label>
                
                {/* Quick Presets */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setTargetPrice(Math.round(currentPrice * 0.95 / 50) * 50)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      targetPrice === Math.round(currentPrice * 0.95 / 50) * 50
                        ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <span>-5% (Save ₹{Math.round(currentPrice * 0.05).toLocaleString("en-IN")})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetPrice(Math.round(currentPrice * 0.90 / 50) * 50)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      targetPrice === Math.round(currentPrice * 0.90 / 50) * 50
                        ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <span>-10% (Save ₹{Math.round(currentPrice * 0.10).toLocaleString("en-IN")})</span>
                  </button>
                </div>

                {/* Input for custom price */}
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-900 focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/10"
                  />
                </div>
              </div>

              {/* Privacy Reassurance Note */}
              <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-[11px] text-indigo-900 mb-5 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>
                  <strong>100% Privacy-First:</strong> We do not ask for or store your personal email. Notifications are delivered anonymously to this browser.
                </span>
              </div>

              {/* Submit CTA */}
              <button
                type="button"
                onClick={handleActivate}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Bell className="w-4 h-4" />
                <span>Set Price Drop Alert</span>
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
