import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";

export default function QuotaModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", duration: 0.4 }}
        className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 p-6 text-center shadow-2xl backdrop-blur-md z-10"
      >
        {/* Glow behind modal */}
        <div className="absolute -top-12 -left-12 w-24 h-24 bg-brand-violet/25 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="w-12 h-12 bg-brand-violet/10 border border-brand-violet/20 text-brand-violet rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>

        {/* Content */}
        <h3 className="text-lg font-bold text-white mb-2">Daily AI Limit Reached (10/10)</h3>
        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          You&apos;ve used all 10 free AI operations for today. Your daily allowance resets automatically every midnight (every 24 hours).
        </p>
        <div className="p-3 mb-6 rounded-xl bg-slate-800/60 border border-slate-700/50 text-left">
          <p className="text-[11px] font-semibold text-brand-violet mb-1">🏷️ 100% Free &amp; Unlimited Access</p>
          <p className="text-[11px] text-slate-400 leading-snug">
            You can continue exploring verified store coupons, trending price drops, and your saved wishlist with zero credits required.
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-indigo to-brand-violet text-xs font-semibold text-white transition-all shadow-md active:scale-95 cursor-pointer hover:from-brand-indigo/90 hover:to-brand-violet/90"
        >
          Got It, Explore Free Deals
        </button>
      </motion.div>
    </div>
  );
}
