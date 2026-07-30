"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Ticket } from "lucide-react";

export default function CouponBadge({ couponCode, discount }) {
  const [copied, setCopied] = useState(false);
  const [particles, setParticles] = useState([]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(couponCode);
      setCopied(true);

      // Create burst particles for premium copy effect
      const newParticles = Array.from({ length: 12 }).map((_, i) => ({
        id: Date.now() + i,
        angle: (i / 12) * 2 * Math.PI,
        distance: 30 + Math.random() * 40,
        color: i % 2 === 0 ? "#6366f1" : "#a855f7"
      }));
      setParticles(newParticles);

      // Reset copied state
      setTimeout(() => setCopied(false), 2000);
      // Clean up particles
      setTimeout(() => setParticles([]), 800);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="relative mt-4 p-3.5 rounded-xl bg-slate-950/50 border border-dashed border-slate-700/60 flex items-center justify-between gap-3 overflow-hidden group">
      {/* Background soft glow when copied */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-r from-brand-indigo to-brand-violet pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-brand-indigo/10 text-brand-indigo">
          <Ticket className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[10px] text-slate-500 font-semibold uppercase block tracking-wider leading-none mb-1">
            Available Coupon
          </span>
          <span className="text-xs text-brand-violet font-bold font-mono">
            {discount}
          </span>
        </div>
      </div>

      <div className="relative flex items-center gap-1.5">
        {/* Particle bursts */}
        <AnimatePresence>
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
              animate={{
                x: Math.cos(p.angle) * p.distance,
                y: Math.sin(p.angle) * p.distance,
                scale: 0,
                opacity: 0
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute w-1.5 h-1.5 rounded-full pointer-events-none z-10"
              style={{ backgroundColor: p.color }}
            />
          ))}
        </AnimatePresence>

        <div className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-bold font-mono text-slate-300 tracking-wider">
          {couponCode}
        </div>

        <button
          onClick={handleCopy}
          className={`flex items-center justify-center p-1.5 rounded-lg border transition-all duration-300 ${
            copied
              ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
              : "bg-slate-900 hover:bg-slate-800 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white"
          }`}
          title="Copy Code"
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Check className="w-3.5 h-3.5" />
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Copy className="w-3.5 h-3.5" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
}
