import React, { useState } from "react";
import { Check, Copy, ExternalLink, Tag, Eye } from "lucide-react";

export default function CouponCard({ coupon }) {
  const [copied, setCopied] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

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

      // 2. Increment Telemetry Click count
      fetch("/api/telemetry/click", { method: "POST" }).catch(() => {});

      // 3. Mark as revealed
      setIsRevealed(true);
    }

    // 4. Copy code to clipboard (with absolute compatibility fallback)
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
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 md:p-6 backdrop-blur-md hover:border-slate-700 transition-all flex flex-col justify-between h-48 shadow-lg group">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-violet/10 rounded-full blur-2xl pointer-events-none group-hover:bg-brand-violet/20 transition-all" />

      {/* Top section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-brand-violet uppercase tracking-wider flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" />
            {coupon.store}
          </span>
          <span className="text-[10px] text-slate-500 font-semibold bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800">
            {coupon.region}
          </span>
        </div>
        <h4 className="text-sm font-bold text-white line-clamp-2 leading-snug">{coupon.description}</h4>
      </div>

      {/* Bottom section */}
      <div className="mt-4 flex gap-3 items-center">
        {/* Copy / Reveal trigger code */}
        <button
          onClick={handleRevealAndCopy}
          className={`flex-grow flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer font-mono text-xs active:scale-98 ${
            isRevealed 
              ? "bg-slate-950/70 border border-slate-800 text-slate-300 hover:border-slate-700" 
              : "bg-gradient-to-r from-brand-indigo/20 to-brand-violet/20 border border-brand-indigo/35 text-white hover:from-brand-indigo/30 hover:to-brand-violet/30"
          }`}
        >
          <span className="font-bold uppercase tracking-wider flex items-center gap-2">
            {!isRevealed && <Eye className="w-3.5 h-3.5 text-brand-indigo" />}
            {isRevealed ? coupon.code : "REVEAL CODE"}
          </span>
          {copied ? (
            <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-sans">
              <Check className="w-3 h-3" />
              Copied! ✅
            </span>
          ) : (
            <Copy className="w-3.5 h-3.5 text-slate-500 hover:text-slate-300 font-normal" />
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
    </div>
  );
}
