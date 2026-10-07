"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Trash2, ArrowUpRight, ShoppingBag, ExternalLink } from "lucide-react";

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

export default function SavedDealsDrawer({
  isOpen,
  onClose,
  savedDeals = [],
  onRemoveDeal,
  onClearAll
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-end"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md h-full bg-white text-slate-900 shadow-2xl flex flex-col justify-between border-l border-slate-200"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-600">
                <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Saved Deals ({savedDeals.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Persisted locally in your browser
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List of Saved Deals */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {savedDeals.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <div className="w-16 h-16 rounded-3xl bg-rose-50 flex items-center justify-center text-rose-400 mb-3 border border-rose-100">
                  <Heart className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">No saved deals yet</h4>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                  Click the heart icon <Heart className="w-3.5 h-3.5 inline text-rose-500 fill-rose-500" /> on any product card to bookmark it for 3-4 days or longer.
                </p>
              </div>
            ) : (
              savedDeals.map((item, idx) => (
                <div
                  key={item.id || item.product_id || idx}
                  className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/90 hover:border-indigo-200 transition-all flex items-center gap-3 relative group"
                >
                  <div className="w-16 h-16 rounded-xl bg-white p-1 border border-slate-100 shrink-0 flex items-center justify-center overflow-hidden">
                    <img
                      src={item.image || "/laptop.jpg"}
                      alt={item.title}
                      className="object-contain max-h-full max-w-full"
                    />
                  </div>

                  <div className="flex-1 min-w-0 pr-6">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block truncate">
                      {item.store_name || item.store || "Online Store"}
                    </span>
                    <h5 className="text-xs font-bold text-slate-900 truncate mb-1">
                      {item.title}
                    </h5>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-black text-slate-900">
                        {formatPrice(item.price, item.currency)}
                      </span>
                      {item.deal_link && (
                        <a
                          href={item.deal_link || item.affiliateUrl || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-0.5 text-[10px] font-bold text-indigo-600 hover:text-indigo-800"
                        >
                          <span>Buy Deal</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => onRemoveDeal && onRemoveDeal(item.id || item.product_id || item.title)}
                    title="Remove from saved"
                    className="absolute top-2.5 right-2.5 p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {savedDeals.length > 0 && (
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <button
                type="button"
                onClick={onClearAll}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 transition-colors cursor-pointer flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All ({savedDeals.length})</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-xs hover:bg-slate-800 transition-all cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
