"use client";

import React, { useState } from "react";
import { 
  Check, Copy, Zap, TrendingUp, Award, Gift, 
  Smartphone, Monitor, Volume2, Shield, Calendar, 
  ExternalLink, Eye, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SubscriptionInteractiveClient({ sub }) {
  const isUS = sub.country === "US";
  const isUK = sub.country === "GB" || sub.country === "UK";
  const isCA = sub.country === "CA";
  const isAU = sub.country === "AU";
  const isAE = sub.country === "AE";
  const currency = sub.currencySymbol || (isAE ? "AED" : (isAU ? "A$" : (isCA ? "C$" : (isUK ? "£" : (isUS ? "$" : "₹")))));
  const regionName = isAE ? "UAE" : (isAU ? "Australia" : (isCA ? "Canada" : (isUK ? "UK" : (isUS ? "USA" : "India"))));

  const [selectedPlanIdx, setSelectedPlanIdx] = useState(0);
  const [copiedCode, setCopiedCode] = useState(null);
  const [revealedCodes, setRevealedCodes] = useState({});
  const [selectedOperator, setSelectedOperator] = useState(isAE ? "etisalat" : (isAU ? "optus" : (isCA ? "telus" : (isUK ? "ee" : (isUS ? "t-mobile" : "jio")))));

  const activePlan = sub.plans[selectedPlanIdx] || sub.plans[0];

  const formatPrice = (amount) => {
    if (typeof amount !== "number" || isNaN(amount)) return amount;
    return (isUS || isUK || isCA || isAU || isAE) ? Number(amount.toFixed(2)) : Math.round(amount);
  };

  const getPlanProjections = (plan) => {
    const price = Number(plan?.price) || 0;
    const period = String(plan?.period || "").toLowerCase();

    if (period.includes("month") && !period.includes("3") && !period.includes("6")) {
      return {
        monthly: formatPrice(price),
        threeMonth: formatPrice(price * 3),
        annual: formatPrice(price * 12),
        annualPerMonth: formatPrice(price),
        badge: "Monthly Billing"
      };
    } else if (period.includes("3 month") || period.includes("quarter")) {
      return {
        monthly: formatPrice(price / 3),
        threeMonth: formatPrice(price),
        annual: formatPrice(price * 4),
        annualPerMonth: formatPrice(price / 3),
        badge: "Quarterly Pack"
      };
    } else if (period.includes("year") || period.includes("annual")) {
      return {
        monthly: formatPrice(price / 12),
        threeMonth: formatPrice(price / 4),
        annual: formatPrice(price),
        annualPerMonth: formatPrice(price / 12),
        badge: "Annual Pack"
      };
    } else {
      return {
        monthly: formatPrice(price),
        threeMonth: formatPrice(price * 3),
        annual: formatPrice(price * 12),
        annualPerMonth: formatPrice(price),
        badge: "Flexible"
      };
    }
  };

  const projections = getPlanProjections(activePlan);

  const handleCopyCode = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleRevealAndCopy = (code) => {
    setRevealedCodes(prev => ({ ...prev, [code]: true }));
    handleCopyCode(code);
  };

  const operatorList = isAE ? [
    { id: "etisalat", label: "Etisalat by e&" },
    { id: "du", label: "du (Power / Home)" },
    { id: "smiles", label: "Smiles by e&" },
    { id: "bank", label: "ENBD / ADCB Card" }
  ] : isAU ? [
    { id: "optus", label: "Optus (SubHub 10%)" },
    { id: "telstra", label: "Telstra (Plus)" },
    { id: "hubbl", label: "Hubbl (Stack & Save)" },
    { id: "student", label: "UNiDAYS 50% Off" }
  ] : isCA ? [
    { id: "telus", label: "Telus (Stream+)" },
    { id: "bell", label: "Bell (Fibe / Crave)" },
    { id: "rogers", label: "Rogers (Ignite)" },
    { id: "student", label: "SPC / Student 50%" }
  ] : isUK ? [
    { id: "ee", label: "EE (Full Works)" },
    { id: "o2", label: "O2 (Priority)" },
    { id: "sky", label: "Sky / Virgin" },
    { id: "student", label: "UNiDAYS 50% Off" }
  ] : isUS ? [
    { id: "t-mobile", label: "T-Mobile (On Us)" },
    { id: "verizon", label: "Verizon myPlan" },
    { id: "spectrum", label: "Spectrum / AT&T" },
    { id: "student", label: "Student / EBT 50%" }
  ] : [
    { id: "jio", label: "Jio (Fiber/SIM)" },
    { id: "airtel", label: "Airtel Thanks" },
    { id: "vi", label: "Vi (Vodafone)" },
    { id: "student", label: "Student 50% Off" }
  ];

  // Find telecom partner info matching selected operator
  const activeOperatorPerk = sub.savingsBlueprint?.telecomFree?.find(
    t => t.operator.toLowerCase().includes(selectedOperator.toLowerCase())
  ) || sub.savingsBlueprint?.telecomFree?.[0];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Interactive Plan Selector & Dynamic Specs Card */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider">
              1. Select a Plan Tier to Compare ({sub.plans.length} Options)
            </h2>
            <span className="text-[11px] sm:text-xs font-bold text-indigo-600">Click to switch</span>
          </div>

          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {sub.plans.map((p, pIdx) => {
              const isSelected = pIdx === selectedPlanIdx;
              return (
                <button
                  key={pIdx}
                  type="button"
                  onClick={() => setSelectedPlanIdx(pIdx)}
                  className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-2xs font-black ring-2 ring-indigo-300 scale-102"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {p.name} ({currency}{p.price})
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Plan Pricing Banner */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center sm:block justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black text-slate-900">{activePlan.name}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                  {activePlan.ads || "Ad-Free"}
                </span>
              </div>
              <div className="flex items-baseline gap-1 mt-0.5 sm:mt-1">
                <span className="text-2xl sm:text-3xl font-black text-slate-950">{currency}{activePlan.price}</span>
                <span className="text-xs font-semibold text-slate-500">/{activePlan.period}</span>
              </div>
            </div>
          </div>

          {/* Projections Matrix */}
          <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200/80 text-xs font-semibold text-slate-600 space-y-1">
            <div className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Cost Projection ({regionName}):
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-center sm:flex sm:items-center sm:gap-3 text-[11px] sm:text-xs">
              <div className="bg-slate-50 sm:bg-transparent p-1.5 sm:p-0 rounded-lg">
                <span className="text-[10px] text-slate-400 block sm:hidden">3-Month</span>
                <span className="hidden sm:inline">3-Month: </span>
                <b className="text-slate-900">{currency}{projections.threeMonth}</b>
              </div>
              <div className="bg-slate-50 sm:bg-transparent p-1.5 sm:p-0 rounded-lg">
                <span className="text-[10px] text-slate-400 block sm:hidden">1-Year</span>
                <span className="hidden sm:inline">1-Year: </span>
                <b className="text-indigo-700">{currency}{projections.annual}</b>
              </div>
              <div className="bg-indigo-50/60 sm:bg-transparent p-1.5 sm:p-0 rounded-lg">
                <span className="text-[10px] text-indigo-400 block sm:hidden">Rate</span>
                <b className="text-indigo-600 font-bold">{currency}{projections.monthly}/mo</b>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Specifications Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-xs font-semibold text-slate-700">
          <div className="p-2.5 sm:p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-0.5 sm:space-y-1 min-w-0">
            <div className="flex items-center gap-1.5 text-indigo-600">
              <Smartphone className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 truncate">Screens</span>
            </div>
            <p className="font-extrabold text-slate-900 text-xs truncate">{activePlan.screens} User Access</p>
            <p className="text-[10px] text-slate-500 truncate">{activePlan.devices}</p>
          </div>

          <div className="p-2.5 sm:p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-0.5 sm:space-y-1 min-w-0">
            <div className="flex items-center gap-1.5 text-indigo-600">
              <Monitor className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 truncate">Quality</span>
            </div>
            <p className="font-extrabold text-slate-900 text-xs truncate">{activePlan.resolution}</p>
            <p className="text-[10px] text-slate-500">High Clarity</p>
          </div>

          <div className="p-2.5 sm:p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-0.5 sm:space-y-1 min-w-0">
            <div className="flex items-center gap-1.5 text-indigo-600">
              <Volume2 className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 truncate">Audio</span>
            </div>
            <p className="font-extrabold text-slate-900 text-xs truncate">{activePlan.audio || "Dolby 5.1"}</p>
            <p className="text-[10px] text-slate-500">Surround</p>
          </div>

          <div className="p-2.5 sm:p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-0.5 sm:space-y-1 min-w-0">
            <div className="flex items-center gap-1.5 text-indigo-600">
              <Shield className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 truncate">Ads</span>
            </div>
            <p className="font-extrabold text-slate-900 text-xs truncate">{activePlan.ads}</p>
            <p className="text-[10px] text-slate-500">Streaming</p>
          </div>
        </div>
      </div>

      {/* 2. Interactive Operator / Student Free Eligibility Checker */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-4 sm:p-6 space-y-3.5 sm:space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />
            <h2 className="text-xs sm:text-base font-black text-slate-900 leading-tight">
              Check {currency}0 Free Access on Your {isUS ? "Carrier / Perks" : "SIM / Broadband"}
            </h2>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] sm:text-[10px] font-black shrink-0 ml-1">
            Zero-Cost
          </span>
        </div>
        <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
          Select your current telecom network or student status to see if you can claim {sub.name} for free without paying upfront:
        </p>

        {/* Operator Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
          {operatorList.map((op) => (
            <button
              key={op.id}
              type="button"
              onClick={() => setSelectedOperator(op.id)}
              className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer text-center border ${
                selectedOperator === op.id
                  ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {op.label}
            </button>
          ))}
        </div>

        {/* Operator Free Result Card */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 space-y-1.5 sm:space-y-2">
          {activeOperatorPerk ? (
            <>
              <div className="flex items-center justify-between flex-wrap gap-1">
                <span className="text-[11px] sm:text-xs font-black text-emerald-950 uppercase tracking-wider">
                  Eligible Perk: {activeOperatorPerk.operator}
                </span>
                <span className="text-[10px] sm:text-xs font-extrabold text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                  {activeOperatorPerk.plan}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-emerald-900 font-medium">
                <b>How to Claim:</b> {activeOperatorPerk.claimSteps}
              </p>
            </>
          ) : (
            <p className="text-[11px] sm:text-xs text-emerald-900 font-medium">
              If your current mobile pack doesn&apos;t include a free bundle, check Level 2 below for instant gift card savings.
            </p>
          )}
        </div>
      </div>

      {/* 3. PROTECTED 4-LEVEL SAVINGS BLUEPRINT (Shielded from Google AI with data-nosnippet) */}
      <div 
        data-nosnippet="true"
        className="rounded-3xl bg-gradient-to-r from-indigo-50/70 via-purple-50/50 to-amber-50/60 border border-indigo-200/80 shadow-md p-4 sm:p-6 space-y-4 sm:space-y-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0">
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-950 leading-tight">
                The ShopSmart 4-Level Savings Blueprint
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-500 font-semibold line-clamp-1">
                Protected Strategy Matrix: Legal discounts, vouchers & combo passes
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-indigo-600 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider shrink-0 ml-1">
            Verified
          </span>
        </div>

        {/* Level 1: Telecom ₹0 / Free Route */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-indigo-100 shadow-2xs space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-black text-[9px] sm:text-[10px]">
              LEVEL 1: Claim for {currency}0 (Free on Existing Pack)
            </span>
            <span className="text-emerald-600 font-black text-[11px] sm:text-xs">100% Free</span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-600 font-medium">
            {sub.savingsBlueprint?.telecomFree?.[0] ? (
              <>Included complimentary with <b>{sub.savingsBlueprint.telecomFree[0].operator}</b> ({sub.savingsBlueprint.telecomFree[0].plan}).</>
            ) : (
              "Students get a flat 50% discount upon verification on the official website."
            )}
          </p>
        </div>

        {/* Level 2: Voucher Route (Gyftr / Amazon Pay / Target Circle) */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-indigo-100 shadow-2xs space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-black text-[9px] sm:text-[10px]">
              LEVEL 2: Buy via Gift Voucher (Instant Savings)
            </span>
            <span className="text-amber-700 font-black text-[11px] sm:text-xs">
              {sub.savingsBlueprint?.voucherSavings?.discountPercent || "5%-15% Off"}
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-600 font-medium">
            {sub.savingsBlueprint?.voucherSavings?.instructions || (isAU ? "Purchase discounted gift cards during Woolworths 20x points promotions or earn cashback on Cashrewards/ShopBack." : (isCA ? "Purchase discounted digital vouchers via Costco Canada or earn cashback on Rakuten Canada." : (isUK ? "Purchase discounted digital vouchers via CDKeys or earn cashback on TopCashback/Quidco." : (isUS ? "Purchase discounted digital vouchers via Target Circle or Costco and redeem online." : "Purchase discounted digital vouchers on Amazon Pay or Gyftr and redeem on the official payment page."))))}
          </p>
          <div className="flex items-baseline gap-2 pt-0.5 text-xs">
            <span className="text-slate-500 font-semibold text-[11px]">Effective Price:</span>
            <span className="text-xs sm:text-sm font-black text-amber-700">
              {currency}{sub.savingsBlueprint?.voucherSavings?.effectivePrice || ((isUS || isUK || isCA || isAU) ? formatPrice(activePlan.price * 0.95) : Math.round(activePlan.price * 0.9))}
            </span>
          </div>
        </div>

        {/* Level 3: Super Combo Pass */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-indigo-100 shadow-2xs space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
            <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-900 font-black text-[9px] sm:text-[10px]">
              LEVEL 3: Super Combo Bundle Pass
            </span>
            <span className="text-sky-700 font-black text-[11px] sm:text-xs">
              Save {currency}{sub.savingsBlueprint?.comboPass?.netSavings || (isUS ? "10+/mo" : "1,200+")}
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-600 font-medium">
            Bundled in <b>{sub.savingsBlueprint?.comboPass?.passName || (isUS ? "Mega Entertainment Bundle" : "All-in-One Super Pass")}</b> along with other leading entertainment platforms.
          </p>
          <div className="flex flex-wrap gap-1 pt-0.5">
            {(sub.savingsBlueprint?.comboPass?.bundledWith || [sub.name]).map((b, i) => (
              <span key={i} className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 text-[10px] font-bold border border-sky-100">
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* Level 4: Click to Unlock Secret Promo Codes */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-indigo-100 shadow-2xs space-y-2.5 sm:space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
            <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-black text-[9px] sm:text-[10px]">
              LEVEL 4: Verified Working Promo Codes
            </span>
            <span className="text-purple-700 font-black text-[11px] sm:text-xs">100% Tested</span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-600 font-medium">
            Tap below to reveal and copy active discount coupon codes:
          </p>

          <div className="space-y-2">
            {(sub.savingsBlueprint?.coupons || [{ code: "STUDENTVIP", discount: "Special verification offer" }]).map((c, idx) => {
              const isRevealed = !!revealedCodes[c.code];
              const isCopied = copiedCode === c.code;

              return (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {isRevealed ? (
                        <code className="px-2.5 py-0.5 rounded bg-white border border-purple-300 font-black text-xs text-purple-900 font-mono tracking-wider">
                          {c.code}
                        </code>
                      ) : (
                        <div className="px-2.5 py-0.5 rounded bg-slate-200 text-slate-500 font-black text-xs font-mono tracking-widest select-none">
                          •••••••••
                        </div>
                      )}
                      <span className="text-[10px] font-bold text-emerald-600">✓ Tested Active</span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium mt-1 truncate">{c.discount}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRevealAndCopy(c.code)}
                    className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 shrink-0 shadow-2xs"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : isRevealed ? (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Reveal Code</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
