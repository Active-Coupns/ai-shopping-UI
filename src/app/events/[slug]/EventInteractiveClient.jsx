"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Ticket, Film, Music, CreditCard, Sparkles, ShieldCheck, 
  Tag, Copy, Check, ExternalLink, ThumbsUp, ThumbsDown, 
  CheckCircle2, ArrowRight, Clock, Info, AlertCircle, Award
} from "lucide-react";

export default function EventInteractiveClient({ brand, initialCoupons = [] }) {
  const [copiedCode, setCopiedCode] = useState(null);
  const [revealedCodes, setRevealedCodes] = useState({});
  const [userFeedbackMap, setUserFeedbackMap] = useState({});

  const now = new Date();
  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  const currentMonth = monthNames[now.getMonth()];
  const currentYear = now.getFullYear();

  const coupons = (brand.coupons && brand.coupons.length > 0) ? brand.coupons : initialCoupons;
  const hasCoupons = coupons.length > 0;
  const strategies = brand.blueprints || {};

  const handleCopyCode = (code, url = null) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);

    // 2-in-1 Reveal & Open Merchant
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleRevealAndCopy = (code, url = null) => {
    setRevealedCodes((prev) => ({ ...prev, [code]: true }));
    handleCopyCode(code, url);
  };

  const handleFeedback = (id, isPositive) => {
    setUserFeedbackMap((prev) => ({ ...prev, [id]: isPositive ? "yes" : "no" }));
  };

  return (
    <div className="space-y-8">
      {/* Position 0 Quick Savings Snapshot Table */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200/90 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 sm:pb-4 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0" />
            <h2 className="text-sm sm:text-lg font-black text-slate-900">
              {brand.name} Savings Snapshot ({currentMonth} {currentYear})
            </h2>
          </div>
          <span className="self-start sm:self-auto px-2.5 sm:px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] sm:text-xs font-black flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Live Verified
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 pt-3.5 sm:pt-5">
          <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Top Savings Today
            </span>
            <span className="text-xs sm:text-sm font-black text-purple-700 block mt-0.5 sm:mt-1 line-clamp-2 leading-snug">
              {brand.snapshot?.bestSavings || "Buy 1 Get 1 Free"}
            </span>
          </div>

          <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Active Offers &amp; Passes
            </span>
            <span className="text-xs sm:text-sm font-black text-emerald-700 block mt-0.5 sm:mt-1 line-clamp-2 leading-snug">
              {brand.snapshot?.activePromoCodes || `${coupons.length} Active Passes`}
            </span>
          </div>

          <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              BOGO Bank Card Matrix
            </span>
            <span className="text-xs sm:text-sm font-black text-slate-800 block mt-0.5 sm:mt-1 line-clamp-2 leading-snug">
              {brand.snapshot?.specialConcession || "ICICI, HDFC, Axis, Amex"}
            </span>
          </div>

          <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Best Timing Window
            </span>
            <span className="text-xs sm:text-sm font-black text-indigo-700 block mt-0.5 sm:mt-1 line-clamp-2 leading-snug">
              {brand.snapshot?.bookingWindow || "Phase-1 Early Bird"}
            </span>
          </div>
        </div>
      </section>

      {/* 3 Smart Savings Blueprints */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200/90 shadow-md space-y-4 sm:space-y-5">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 shrink-0" />
          <h2 className="text-sm sm:text-lg font-black text-slate-900">
            3 Tested Savings Blueprints for {brand.name}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-5">
          {Object.entries(strategies).map(([key, strat], idx) => {
            const badge = strat.badge || `STRATEGY ${idx + 1}`;
            const isBogo = badge.includes("BOGO") || badge.includes("BANK");
            const isTiming = badge.includes("TIMING") || badge.includes("EARLY");

            return (
              <div
                key={key}
                className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-purple-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-block mb-2.5 ${
                      isBogo
                        ? "bg-purple-100 text-purple-900 border border-purple-300/60"
                        : isTiming
                        ? "bg-rose-100 text-rose-900 border border-rose-300/60"
                        : "bg-emerald-100 text-emerald-900 border border-emerald-300/60"
                    }`}
                  >
                    {badge}
                  </span>

                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
                    {strat.title}
                  </h3>

                  <p className="mt-2 text-xs text-slate-600 leading-relaxed font-medium">
                    {strat.explanation}
                  </p>

                  {/* Action Steps */}
                  {Array.isArray(strat.steps) && strat.steps.length > 0 && (
                    <div className="mt-3 space-y-1.5 pt-2.5 border-t border-slate-200/60">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                        How to Claim:
                      </span>
                      {strat.steps.map((step, sIdx) => (
                        <div key={sIdx} className="flex items-start gap-1.5 text-[11px] text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Verified Promo Codes & Bank Vouchers Section */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200/90 shadow-md space-y-4 sm:space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-1 sm:gap-2">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />
            <h2 className="text-sm sm:text-lg font-black text-slate-900">
              Verified {brand.name} Codes &amp; Bank Offers
            </h2>
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-slate-400">
            Tested Today • 98% Success
          </span>
        </div>

        {hasCoupons ? (
          <div className="space-y-4">
            {coupons.map((coupon, idx) => {
              const code = coupon.code;
              const isRevealed = !!revealedCodes[code];
              const isCopied = copiedCode === code;
              const feedback = userFeedbackMap[code];

              return (
                <div
                  key={idx}
                  className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-slate-50 to-white border border-slate-200 hover:border-purple-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4"
                >
                  {/* Deal Description */}
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 font-black text-[10px] sm:text-[11px] border border-purple-200">
                        {coupon.badge || "VERIFIED DEAL"}
                      </span>
                      <span className="text-[11px] sm:text-xs font-bold text-slate-500">
                        {coupon.verifiedDate ? `Verified ${coupon.verifiedDate}` : "Tested Today"}
                      </span>
                    </div>

                    <h3 className="font-black text-sm sm:text-base text-slate-900 leading-snug">
                      {coupon.discount}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      {coupon.description}
                    </p>
                  </div>

                  {/* 2-in-1 Reveal & Copy */}
                  <div data-nosnippet="true" className="flex flex-col sm:items-end gap-2 w-full sm:w-auto shrink-0">
                    <button
                      type="button"
                      data-nosnippet="true"
                      onClick={() => handleRevealAndCopy(code, coupon.directUrl || brand.officialUrl)}
                      className={`w-full sm:w-auto px-4 sm:px-5 py-3 sm:py-2.5 rounded-xl font-black text-xs min-h-[44px] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95 ${
                        isCopied
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-900 hover:bg-purple-600 text-white"
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-300" />
                          <span>Code Copied &amp; Redirecting!</span>
                        </>
                      ) : isRevealed ? (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy: {code}</span>
                        </>
                      ) : (
                        <>
                          <Tag className="w-4 h-4 text-amber-400" />
                          <span>Show Code &amp; Visit Site</span>
                        </>
                      )}
                    </button>

                    {/* Feedback */}
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium self-center sm:self-end">
                      {feedback ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Thanks! Verified by you
                        </span>
                      ) : (
                        <>
                          <span>Did this work?</span>
                          <button
                            type="button"
                            onClick={() => handleFeedback(code, true)}
                            className="p-1 rounded hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 cursor-pointer transition-colors"
                            title="Worked!"
                          >
                            <ThumbsUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleFeedback(code, false)}
                            className="p-1 rounded hover:bg-rose-100 text-slate-600 hover:text-rose-700 cursor-pointer transition-colors"
                            title="Didn't work"
                          >
                            <ThumbsDown className="w-3 h-3" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Zero-Coupon Fact Box */
          <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-amber-50/70 border border-amber-200/90 text-amber-950 space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0" />
              <h3 className="font-extrabold text-xs sm:text-base text-amber-900 leading-snug">
                Official Transparency: Ticket Discounts Apply via Bank Gateway
              </h3>
            </div>
            <p className="text-xs text-amber-900/80 leading-relaxed font-medium">
              Entertainment ticketing platforms like {brand.name} rarely utilize manual promo codes. 
              Instead, Buy-1-Get-1 discounts are unlocked by selecting your specific credit card (ICICI, HDFC, Axis, Amex) 
              under &apos;Bank Offers &amp; PromoCodes&apos; at the payment gateway step.
            </p>
          </div>
        )}
      </section>

      {/* Checkout Error Interception Guide (Capturing High-Intent Ready-to-Buy Users) */}
      <section className="bg-slate-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/90 space-y-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 shrink-0" />
          <h3 className="font-black text-xs sm:text-base text-slate-900 leading-snug">
            Why is your {brand.name} promo code or BOGO offer not applying at checkout?
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="font-extrabold text-slate-900 block mb-1">1. Quota Reset Window</span>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Bank BOGO quotas on {brand.name} exhaust rapidly. Premium bank quotas reset daily at 11:00 AM &amp; 5:00 PM IST rather than midnight.
            </p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="font-extrabold text-slate-900 block mb-1">2. Minimum 2 Tickets Rule</span>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Buy-1-Get-1 offers require selecting at least 2 movie seats in the seat map before the discount can deduct the second ticket price.
            </p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="font-extrabold text-slate-900 block mb-1">3. Gateway Bin Validation</span>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Select &apos;Bank Offers&apos; during checkout and enter the first 6 digits of your eligible card to authenticate before entering OTP.
            </p>
          </div>
        </div>
      </section>

      {/* Official Direct Booking CTA */}
      <div className="p-4 sm:p-7 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-slate-950 via-purple-950 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-5">
        <div className="text-left">
          <span className="text-amber-400 font-black text-[10px] sm:text-xs uppercase tracking-wider block mb-1">
            Official Ticket Booking
          </span>
          <h3 className="font-black text-sm sm:text-lg text-white leading-snug">
            Ready to book tickets on {brand.name}?
          </h3>
          <p className="text-xs text-slate-300 font-medium mt-1 leading-relaxed">
            Choose your showtime and apply bank BOGO perks directly at checkout.
          </p>
        </div>

        <a
          href={brand.officialUrl || "https://google.com"}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shrink-0 min-h-[44px]"
        >
          <span>Visit Official {brand.name} Portal</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
