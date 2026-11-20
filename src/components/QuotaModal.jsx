import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";

export default function QuotaModal({ isOpen, onClose, onOpenCheckout }) {
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
        <h3 className="text-lg font-bold text-white mb-2">Daily Free AI Limit Reached (10/10)</h3>
        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          You&apos;ve used all 10 free AI operations for today. Need instant access for Virtual Try-On or live product teardowns?
        </p>

        {/* Action CTAs */}
        <div className="space-y-2 mb-4">
          {onOpenCheckout && (
            <button
              onClick={() => {
                onClose();
                onOpenCheckout();
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>⚡ Top Up Sparks (from ₹19 / $0.99)</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-xs font-semibold text-slate-300 transition-all border border-slate-700 cursor-pointer"
          >
            Continue with Free Coupons (₹0)
          </button>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40 text-left">
          <p className="text-[10px] text-slate-400 leading-tight">
            💡 <strong className="text-slate-300">Instant Access:</strong> Supports UPI (GPay/PhonePe), RuPay, Cards &amp; Apple Pay via Dodo Payments.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
