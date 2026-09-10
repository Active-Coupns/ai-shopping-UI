"use client";

import React, { useState } from "react";
import { Check, Copy, ExternalLink, Tag, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CouponCard({ coupon }) {
  const [copied, setCopied] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [particles, setParticles] = useState([]);

  const handleRevealAndCopy = async () => {
    if (!isRevealed) {
      // 1. Silent cookie dropper injection via background iframe (only for valid external links)
      if (coupon.link && coupon.link.startsWith("http")) {
        try {
          const iframe = document.createElement("iframe");
          iframe.src = coupon.link;
          iframe.style.display = "none";
          document.body.appendChild(iframe);
          setTimeout(() => iframe.remove(), 4000);
        } catch (err) {
          console.warn("Failed to drop affiliate cookie iframe:", err);
        }
      }

      // 2. Spawn local confetti/particles burst
      const burst = Array.from({ length: 28 }).map((_, i) => ({
        id: `cpart-${i}-${Date.now()}`,
        x: (Math.random() - 0.5) * 160,
        y: -30 - Math.random() * 100, // burst upwards
        size: Math.random() * 5 + 2.5,
        color: Math.random() > 0.5 ? "#6366f1" : "#a855f7"
      }));
      setParticles(burst);
      setTimeout(() => setParticles([]), 2000);

      // 3. Increment Telemetry Click count
      fetch("/api/telemetry/click", { method: "POST" }).catch(() => {});

      // 4. Mark as revealed
      setIsRevealed(true);
    }

    // 5. Copy code to clipboard (with absolute compatibility fallback)
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(coupon.code);
      } else {
        const tempInput = document.createElement("input");
        tempInput.value = coupon.code;
        tempInput.style.position = "absolute";
        tempInput.style.left = "-9999px";
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.warn("Clipboard copy fallback failed:", err);
    }
  };

  return (
    <motion.div
      whileHover={{
        scale: 1.025,
        rotateY: 4,
        rotateX: -3,
        borderColor: "rgba(168, 85, 247, 0.4)",
        boxShadow: "0 10px 30px rgba(99, 102, 241, 0.15)"
      }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/95 p-5 md:p-6 backdrop-blur-md transition-all flex flex-col justify-between h-48 shadow-md group"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Confetti Particles Burst celebration */}
      <AnimatePresence>
        {particles.map(p => (
          <motion.div
            key={p.id}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: p.x, y: p.y, opacity: 0, scale: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute rounded-full pointer-events-none z-30"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              left: "50%",
              top: "50%",
            }}
          />
        ))}
      </AnimatePresence>

      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-violet/10 rounded-full blur-2xl pointer-events-none group-hover:bg-brand-violet/20 transition-all" />

      {/* Top section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-brand-violet uppercase tracking-wider flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" />
            {coupon.store}
          </span>
          <span className="text-[10px] text-slate-700 font-semibold bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
            {coupon.region}
          </span>
        </div>
        <h4 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">{coupon.description}</h4>
      </div>

      {/* Bottom section */}
      <div className="mt-4 flex gap-3 items-center">
        {/* Copy / Reveal trigger code */}
        <button
          onClick={handleRevealAndCopy}
          className={`flex-grow flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer font-mono text-xs active:scale-98 ${
            isRevealed 
              ? "bg-slate-50 border border-slate-200 text-slate-800 hover:border-slate-300 font-bold" 
              : "bg-gradient-to-r from-brand-indigo/15 to-brand-violet/15 border border-brand-indigo/30 text-indigo-900 hover:from-brand-indigo/25 hover:to-brand-violet/25 font-bold"
          }`}
        >
          <span className="font-bold uppercase tracking-wider flex items-center gap-2">
            {!isRevealed && <Eye className="w-3.5 h-3.5 text-brand-indigo" />}
            {isRevealed ? coupon.code : "REVEAL CODE"}
          </span>
          {copied ? (
            <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-sans font-extrabold">
              <Check className="w-3 h-3" />
              Copied! ✅
            </span>
          ) : (
            <Copy className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 font-normal" />
          )}
        </button>

        {/* Redeem CTA */}
        <a
          href={coupon.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            fetch("/api/telemetry/click", { method: "POST" }).catch(() => {});
          }}
          className="p-2.5 rounded-xl bg-gradient-to-r from-brand-indigo to-brand-violet text-white hover:opacity-90 active:scale-95 transition-all shadow-md flex items-center justify-center cursor-pointer shrink-0"
          title="Redeem Offer Directly"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  );
}
