"use client";

import React, { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Tag, 
  Copy, 
  Check, 
  ExternalLink, 
  ArrowLeft, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  AlertCircle,
  ShoppingBag,
  Store,
  ChevronDown,
  Eye,
  Lock,
  Unlock,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Award,
  Clock,
  Flame,
  CreditCard,
  Calculator,
  X
} from "lucide-react";

// Dynamic Store Brand Theming Palette
const STORE_THEMES = {
  zomato: {
    primary: "from-rose-600 to-red-600",
    text: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-200",
    ring: "ring-rose-500",
    btn: "bg-red-600 hover:bg-red-700 text-white shadow-red-500/20",
    badge: "bg-rose-500/10 text-rose-700 border-rose-200",
    glow: "rgba(239, 68, 68, 0.12)"
  },
  swiggy: {
    primary: "from-orange-500 to-amber-600",
    text: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
    ring: "ring-orange-500",
    btn: "bg-orange-600 hover:bg-orange-700 text-white shadow-orange-500/20",
    badge: "bg-orange-500/10 text-orange-700 border-orange-200",
    glow: "rgba(249, 115, 22, 0.12)"
  },
  blinkit: {
    primary: "from-amber-500 to-yellow-500",
    text: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    ring: "ring-amber-500",
    btn: "bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20 font-bold",
    badge: "bg-amber-500/15 text-amber-900 border-amber-300",
    glow: "rgba(245, 158, 11, 0.15)"
  },
  zepto: {
    primary: "from-purple-600 to-violet-700",
    text: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    ring: "ring-purple-500",
    btn: "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/20",
    badge: "bg-purple-500/10 text-purple-700 border-purple-200",
    glow: "rgba(168, 85, 247, 0.12)"
  },
  domino: {
    primary: "from-blue-600 to-indigo-700",
    text: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    ring: "ring-blue-500",
    btn: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20",
    badge: "bg-blue-500/10 text-blue-700 border-blue-200",
    glow: "rgba(37, 99, 235, 0.12)"
  },
  myntra: {
    primary: "from-pink-600 to-rose-600",
    text: "text-pink-600",
    bg: "bg-pink-50",
    border: "border-pink-200",
    ring: "ring-pink-500",
    btn: "bg-gradient-to-r from-pink-600 to-rose-600 hover:opacity-95 text-white shadow-pink-500/20",
    badge: "bg-pink-500/10 text-pink-700 border-pink-200",
    glow: "rgba(236, 72, 153, 0.12)"
  },
  nykaa: {
    primary: "from-fuchsia-600 to-pink-600",
    text: "text-fuchsia-600",
    bg: "bg-fuchsia-50",
    border: "border-fuchsia-200",
    ring: "ring-fuchsia-500",
    btn: "bg-fuchsia-600 hover:bg-fuchsia-700 text-white shadow-fuchsia-500/20",
    badge: "bg-fuchsia-500/10 text-fuchsia-700 border-fuchsia-200",
    glow: "rgba(217, 70, 239, 0.12)"
  },
  ajio: {
    primary: "from-slate-800 to-indigo-900",
    text: "text-slate-900",
    bg: "bg-slate-100",
    border: "border-slate-300",
    ring: "ring-slate-800",
    btn: "bg-slate-900 hover:bg-black text-white shadow-slate-900/20",
    badge: "bg-slate-200 text-slate-800 border-slate-300",
    glow: "rgba(15, 23, 42, 0.12)"
  },
  croma: {
    primary: "from-teal-600 to-emerald-700",
    text: "text-teal-600",
    bg: "bg-teal-50",
    border: "border-teal-200",
    ring: "ring-teal-500",
    btn: "bg-teal-600 hover:bg-teal-700 text-white shadow-teal-500/20",
    badge: "bg-teal-500/10 text-teal-700 border-teal-200",
    glow: "rgba(20, 184, 166, 0.12)"
  },
  makemytrip: {
    primary: "from-red-600 to-rose-700",
    text: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    ring: "ring-red-500",
    btn: "bg-red-600 hover:bg-red-700 text-white shadow-red-500/20",
    badge: "bg-red-500/10 text-red-700 border-red-200",
    glow: "rgba(239, 68, 68, 0.12)"
  },
  uber: {
    primary: "from-slate-800 to-black",
    text: "text-slate-900",
    bg: "bg-slate-100",
    border: "border-slate-300",
    ring: "ring-slate-900",
    btn: "bg-slate-900 hover:bg-black text-white shadow-slate-900/20",
    badge: "bg-slate-200 text-slate-800 border-slate-300",
    glow: "rgba(15, 23, 42, 0.12)"
  }
};

const getStoreTheme = (name = "") => {
  const lower = (name || "").toLowerCase();
  for (const [key, theme] of Object.entries(STORE_THEMES)) {
    if (lower.includes(key)) return theme;
  }
  return {
    primary: "from-violet-600 to-indigo-600",
    text: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
    ring: "ring-violet-500",
    btn: "bg-violet-600 hover:bg-violet-700 text-white shadow-violet-500/20",
    badge: "bg-violet-500/10 text-violet-700 border-violet-200",
    glow: "rgba(139, 92, 246, 0.12)"
  };
};

export default function CouponResultView({
  resultData,
  isCartAnalysis = false,
  isLoading = false,
  onReset
}) {
  const [copiedCode, setCopiedCode] = useState(null);
  const [copiedCouponData, setCopiedCouponData] = useState(null);
  const [revealedCodes, setRevealedCodes] = useState({});
  const [particles, setParticles] = useState([]);
  const [openFaq, setOpenFaq] = useState(0); // First FAQ open by default for rich content
  const [expandedAiGuides, setExpandedAiGuides] = useState({});
  const [activeFilter, setActiveFilter] = useState("all");
  const [calculatorAmount, setCalculatorAmount] = useState("");
  const toastTimeoutRef = useRef(null);

  const toggleAiGuide = (code) => {
    setExpandedAiGuides(prev => ({
      ...prev,
      [code]: !prev[code]
    }));
  };

  const getCouponAiFitGuide = (coupon) => {
    if (!coupon) return null;
    const minOrder = Number(coupon.min_order) || 0;
    const maxDiscount = Number(coupon.max_discount) || 0;
    const discountType = coupon.discount_type || "PERCENT";
    const discountVal = Number(coupon.discount_val) || 0;
    const paymentMethod = coupon.payment_method || "All Payment Methods";
    const badge = (coupon.badge || "").toUpperCase();
    const desc = (coupon.description || "").toLowerCase();

    let userTarget = "All Customers";
    let targetDesc = `Valid for all registered accounts with cart ₹${minOrder}+.`;
    if (badge.includes("NEW USER") || desc.includes("new user") || desc.includes("first")) {
      userTarget = "New Accounts Only";
      targetDesc = `First-time customer offer on fresh mobile number & device.`;
    } else if (badge.includes("BANK") || paymentMethod.toLowerCase().includes("bank") || paymentMethod.toLowerCase().includes("card")) {
      userTarget = `Cardholders (${paymentMethod})`;
      targetDesc = `Exclusive to payments completed via ${paymentMethod}.`;
    } else if (badge.includes("GROUP") || minOrder >= 600) {
      userTarget = "Large / Group Orders";
      targetDesc = `High cart requirement (₹${minOrder}+) for maximum bulk discount.`;
    }

    let sweetSpot = "";
    if (discountType === "PERCENT" && maxDiscount > 0 && discountVal > 0) {
      const optimalCart = Math.round(maxDiscount / (discountVal / 100));
      sweetSpot = `Cart between ₹${minOrder} and ₹${optimalCart} (max ₹${maxDiscount} savings reached at ₹${optimalCart}).`;
    } else if (discountType === "FLAT") {
      sweetSpot = `Cart at or near ₹${minOrder} gives highest return (${Math.min(100, Math.round((maxDiscount / (minOrder || 1)) * 100))}% effective savings).`;
    } else {
      sweetSpot = `Cart at or above ₹${minOrder}.`;
    }

    let hiddenCatch = "";
    if (discountType === "PERCENT" && maxDiscount > 0) {
      hiddenCatch = `Discount strictly capped at ₹${maxDiscount}. Higher carts won't get higher savings.`;
    } else if (badge.includes("BANK")) {
      hiddenCatch = `Cannot combine with Paytm/PhonePe UPI; must choose Credit/Debit Card directly.`;
    } else if (badge.includes("NEW USER")) {
      hiddenCatch = `Must have 0 prior delivered orders on this phone number and device.`;
    } else {
      hiddenCatch = `Must hit ₹${minOrder} before packaging charges, taxes and delivery fees.`;
    }

    return {
      userTarget,
      targetDesc,
      sweetSpot,
      hiddenCatch,
      paymentMethod
    };
  };

  const analysis = resultData?.analysis || null;
  const optimization = resultData?.optimization || null;
  const storeCoupons = resultData?.coupons || optimization?.allCoupons || [];
  const bestCoupon = optimization?.bestCoupon || null;
  const nextTier = optimization?.nextTierOpportunities || [];
  const storeName = resultData?.storeName || optimization?.storeName || analysis?.detectedStore || "Store";
  const logo = resultData?.logo || optimization?.logo || "🏷️";
  const cartTotal = analysis?.cartTotal || optimization?.cartTotal || 0;

  // Mask code utility to protect against Google zero-click scraping
  const getMaskedCode = (code) => {
    if (!code) return "CODE•••";
    if (code.length <= 4) return code.slice(0, 2) + "•••";
    return code.slice(0, 4) + "•••";
  };

  // In-Page Reveal & Copy: Never kicks user out of our website
  const handleRevealAndCopy = async (coupon) => {
    if (!coupon?.code) return;
    const code = coupon.code;

    // 1. Mark code as revealed in place
    setRevealedCodes(prev => ({ ...prev, [code]: true }));

    // 2. Trigger celebratory particle burst in place
    const burst = Array.from({ length: 28 }).map((_, i) => ({
      id: `p-${i}-${Date.now()}`,
      x: (Math.random() - 0.5) * 160,
      y: -20 - Math.random() * 90,
      size: Math.random() * 4 + 2,
      color: Math.random() > 0.5 ? "#8b5cf6" : "#ec4899"
    }));
    setParticles(burst);
    setTimeout(() => setParticles([]), 1800);

    // 3. Copy code to clipboard cleanly
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const temp = document.createElement("input");
        temp.value = code;
        temp.style.position = "absolute";
        temp.style.left = "-9999px";
        document.body.appendChild(temp);
        temp.select();
        document.execCommand("copy");
        document.body.removeChild(temp);
      }
      setCopiedCode(code);
      setCopiedCouponData(coupon);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = setTimeout(() => {
        setCopiedCouponData(null);
      }, 5000);
      setTimeout(() => setCopiedCode(null), 3500);
    } catch (err) {
      console.warn("Copy failed:", err);
    }
  };

  // Dynamic Store Theme Colors
  const storeTheme = useMemo(() => getStoreTheme(storeName), [storeName]);

  // Compute Available Filter Tabs based on active store coupons
  const filterTabs = useMemo(() => {
    const counts = {
      all: storeCoupons.length,
      bank: 0,
      percent: 0,
      flat: 0,
      newUser: 0
    };

    storeCoupons.forEach(c => {
      const badge = (c.badge || "").toUpperCase();
      const desc = (c.description || "").toLowerCase();
      const title = (c.title || "").toLowerCase();
      const pay = (c.payment_method || "").toLowerCase();

      if (badge.includes("BANK") || pay.includes("bank") || pay.includes("card") || title.includes("hdfc") || title.includes("icici") || title.includes("axis") || title.includes("sbi")) {
        counts.bank++;
      }
      if (c.discount_type === "PERCENT" || title.includes("%") || desc.includes("%")) {
        counts.percent++;
      }
      if (c.discount_type === "FLAT" || title.includes("flat ₹") || title.includes("flat rs")) {
        counts.flat++;
      }
      if (badge.includes("NEW") || desc.includes("new user") || desc.includes("first order") || title.includes("first")) {
        counts.newUser++;
      }
    });

    const tabs = [
      { id: "all", label: "All Codes", count: counts.all, icon: Tag }
    ];
    if (counts.bank > 0) {
      tabs.push({ id: "bank", label: "Bank & Cards", count: counts.bank, icon: CreditCard });
    }
    if (counts.percent > 0) {
      tabs.push({ id: "percent", label: "% Discounts", count: counts.percent, icon: Flame });
    }
    if (counts.flat > 0) {
      tabs.push({ id: "flat", label: "Flat ₹ OFF", count: counts.flat, icon: Zap });
    }
    if (counts.newUser > 0) {
      tabs.push({ id: "newUser", label: "New Users", count: counts.newUser, icon: Sparkles });
    }

    return tabs;
  }, [storeCoupons]);

  // Mini Cart Savings Estimator Evaluation
  const evaluatedSavings = useMemo(() => {
    const num = Number(calculatorAmount);
    if (!num || isNaN(num) || num <= 0) return null;

    let highestDiscount = 0;
    let winningCode = null;
    const perCouponSavings = {};
    let minShortfall = Infinity;
    let closestCoupon = null;

    storeCoupons.forEach(c => {
      const minOrder = Number(c.min_order) || 0;
      const maxDiscount = Number(c.max_discount) || 999999;
      const discountVal = Number(c.discount_val) || 0;
      const discountType = c.discount_type || "PERCENT";

      if (num >= minOrder) {
        let save = 0;
        if (discountType === "PERCENT") {
          save = Math.min(maxDiscount, Math.round(num * (discountVal / 100)));
        } else {
          save = Number(c.max_discount) || discountVal || 0;
        }
        perCouponSavings[c.code] = { qualifies: true, amount: save };
        if (save > highestDiscount) {
          highestDiscount = save;
          winningCode = c.code;
        }
      } else {
        const shortfall = minOrder - num;
        perCouponSavings[c.code] = { qualifies: false, shortfall };
        if (shortfall < minShortfall) {
          minShortfall = shortfall;
          closestCoupon = c;
        }
      }
    });

    return {
      cartAmount: num,
      winningCode,
      highestDiscount,
      perCouponSavings,
      closestCoupon,
      minShortfall: minShortfall === Infinity ? 0 : minShortfall
    };
  }, [calculatorAmount, storeCoupons]);

  // Filtered & Prioritized Coupons
  const filteredCoupons = useMemo(() => {
    let list = storeCoupons;
    if (activeFilter === "bank") {
      list = list.filter(c => {
        const badge = (c.badge || "").toUpperCase();
        const title = (c.title || "").toLowerCase();
        const pay = (c.payment_method || "").toLowerCase();
        return badge.includes("BANK") || pay.includes("bank") || pay.includes("card") || title.includes("hdfc") || title.includes("icici") || title.includes("axis") || title.includes("sbi");
      });
    } else if (activeFilter === "percent") {
      list = list.filter(c => c.discount_type === "PERCENT" || (c.title || "").includes("%") || (c.description || "").includes("%"));
    } else if (activeFilter === "flat") {
      list = list.filter(c => c.discount_type === "FLAT" || (c.title || "").toLowerCase().includes("flat ₹") || (c.title || "").toLowerCase().includes("flat rs"));
    } else if (activeFilter === "newUser") {
      list = list.filter(c => {
        const badge = (c.badge || "").toUpperCase();
        const desc = (c.description || "").toLowerCase();
        const title = (c.title || "").toLowerCase();
        return badge.includes("NEW") || desc.includes("new user") || desc.includes("first order") || title.includes("first");
      });
    }

    // If calculator has a winning code, bump it to the front
    if (evaluatedSavings?.winningCode) {
      list = [...list].sort((a, b) => {
        if (a.code === evaluatedSavings.winningCode) return -1;
        if (b.code === evaluatedSavings.winningCode) return 1;
        return 0;
      });
    }

    return list;
  }, [storeCoupons, activeFilter, evaluatedSavings]);

  // SEO Savings Strategies curated for store
  const savingStrategies = [
    {
      title: "Hit Minimum Cart Thresholds",
      desc: `Check the exact cart minimums (e.g. ₹149, ₹199 or ₹499). Adding a ₹20 add-on often saves you ₹100+ on ${storeName} by qualifying for higher discounts.`
    },
    {
      title: "Stack Universal Codes with Payment Offers",
      desc: `Apply universal promo codes (like WELCOME or CRAVINGS) and pair them with UPI cashback (CRED Pay, Paytm, PhonePe) for double compounding savings.`
    },
    {
      title: "Check Bank Day Promotions",
      desc: `Major Indian banks (HDFC, ICICI, Axis, SBI) run rotating day-of-the-week promotions on ${storeName} with instant 10% to 15% bill reductions.`
    },
    {
      title: "Scan Your Cart with ShopSmart AI",
      desc: `Before completing checkout, paste your cart screenshot into ShopSmart AI. Our AI vision instantly calculates which exact coupon produces the highest net rupee savings.`
    }
  ];

  // Semantic SEO FAQs with Schema.org readiness
  const storeFaqs = [
    {
      q: `How do I apply a verified promo code on ${storeName}?`,
      a: `To apply a promo code on ${storeName}: 1) Add your desired items to the cart and open checkout. 2) Look for the 'Apply Coupon' or 'Promo Code' input box. 3) Click 'Reveal & Copy' above on ShopSmart AI. The code will unmask and copy to your clipboard. 4) Paste the code in the ${storeName} checkout box to instantly enjoy your discount!`
    },
    {
      q: `Are these ${storeName} discount codes tested and working today?`,
      a: `Yes! Every code on ShopSmart AI is tested daily against verified minimum order slabs and bank criteria. Unlike outdated aggregator sites that display expired codes, we only feature active universal cart discounts and real-time bank promotions.`
    },
    {
      q: `Can I use more than one coupon code on ${storeName}?`,
      a: `Most merchant checkout systems allow one promo code per order. However, you can frequently combine a universal promo code with payment gateway offers (such as credit card instant discounts or UPI cashbacks) for compounded savings.`
    },
    {
      q: `What should I do if a promo code says 'Not Applicable'?`,
      a: `If a code does not apply, check the minimum cart value shown on our card (e.g. ₹199 or ₹499). You can also upload your cart screenshot to ShopSmart AI to let our optimizer find the exact code matching your items.`
    }
  ];

  // SKELETON LOADING STATE: Shown while data is fetching from coupons API
  if (isLoading || !resultData) {
    return (
      <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6 text-left">
        {/* Top Header Shimmer */}
        <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-200" />
            <div className="space-y-1.5">
              <div className="h-5 w-40 bg-slate-200 rounded-md" />
              <div className="h-3 w-56 bg-slate-100 rounded-md" />
            </div>
          </div>
          <div className="h-8 w-24 bg-slate-100 rounded-xl" />
        </div>

        {/* Store Profile Card Shimmer */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-xs mb-6 animate-pulse">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-slate-200 shrink-0" />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-36 bg-slate-200 rounded-lg" />
                  <div className="h-5 w-20 bg-emerald-100 rounded-full" />
                </div>
                <div className="h-3.5 w-64 bg-slate-100 rounded-md" />
              </div>
            </div>
            <div className="h-10 w-32 bg-slate-100 rounded-2xl" />
          </div>
        </div>

        {/* Filter Pills Shimmer */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 animate-pulse">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-8 w-24 bg-slate-100 rounded-xl shrink-0" />
          ))}
        </div>

        {/* 6-Card Coupon Tickets Shimmer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div
              key={i}
              className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-3.5 animate-pulse min-h-[170px]"
            >
              <div className="flex items-center justify-between">
                <div className="h-5 w-24 bg-violet-100 rounded-full" />
                <div className="h-4 w-16 bg-slate-100 rounded-md" />
              </div>

              <div className="space-y-2">
                <div className="h-5 w-4/5 bg-slate-200 rounded-md" />
                <div className="h-3.5 w-full bg-slate-100 rounded-md" />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="h-9 w-28 bg-slate-100 rounded-xl" />
                <div className="h-9 w-32 bg-slate-200 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Polite Empty State if store not found or unverified
  if (resultData?.notFound || resultData?.success === false) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 py-12 text-center">
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 mx-auto shadow-inner">
            <Store className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-extrabold text-slate-900">
              {resultData?.isCategoryMismatch ? "Looking for this brand in another hub?" : "Store Not Available in Our Directory"}
            </h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-md mx-auto">
              {resultData?.error || "We currently do not have verified coupons or saving strategies available for this store in our database."}
            </p>
          </div>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-500 border-t border-slate-100">
            <button
              type="button"
              onClick={() => onReset?.("COUPONS")}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors cursor-pointer"
            >
              Browse Verified Stores
            </button>
            <span className="font-semibold text-slate-400 px-1">Or explore popular stores:</span>
            {["Zomato", "Swiggy", "Myntra", "Amazon", "Nykaa", "Ajio"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  window.location.href = `/?store=${encodeURIComponent(s.toLowerCase())}&tab=coupons`;
                }}
                className="px-2.5 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[10px] transition-colors cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-3.5 sm:px-4 pt-4 sm:pt-6 pb-24 sm:pb-12 text-left">
      {/* Confetti Particles Container */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: p.x, y: p.y, opacity: 0, scale: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="fixed rounded-full pointer-events-none z-50"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              left: "50%",
              top: "40%"
            }}
          />
        ))}
      </AnimatePresence>

      {/* Top Header with Dynamic Store Accent */}
      <div 
        className="mb-5 sm:mb-6 p-4 sm:p-5 rounded-3xl border transition-all relative overflow-hidden shadow-2xs"
        style={{
          background: `linear-gradient(135deg, ${storeTheme.glow} 0%, rgba(255,255,255,0.98) 100%)`,
          borderColor: "rgba(226, 232, 240, 0.9)"
        }}
      >
        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-start gap-2.5 sm:gap-3.5 min-w-0 flex-1">
            <button
              type="button"
              onClick={() => onReset?.("COUPONS")}
              className="p-2 sm:p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 transition-all shadow-xs cursor-pointer active:scale-95 shrink-0 mt-0.5"
              title="Go back to stores"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            
            <div className="min-w-0 flex-1">
              {/* Verified Badge & Status Row */}
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/90 text-[10px] sm:text-[11px] font-black text-emerald-700 uppercase tracking-wider shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>100% Verified Today</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Active &amp; Working</span>
                </span>
                <span className={`hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${storeTheme.badge}`}>
                  {storeName} Verified Deals
                </span>
              </div>

              {/* Store Logo & Title */}
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl shrink-0 leading-none">{logo}</span>
                <h1 className="text-base sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                  {storeName} Promo Codes &amp; Offers
                </h1>
              </div>

              {/* Subtitle */}
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                {isCartAnalysis
                  ? `AI Cart Analyzed: Cart Total ₹${cartTotal} • Showing best matched coupons`
                  : `Verified promo vouchers, universal cart discounts & exclusive bank perks`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onReset?.("COUPONS")}
            className="hidden sm:inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 text-xs font-bold transition-all cursor-pointer shrink-0 shadow-2xs"
          >
            <span>← All Stores</span>
          </button>
        </div>
      </div>

      {/* CART SCREENSHOT ANALYSIS HERO CARD (When Analyzed from Screenshot) */}
      {isCartAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-violet-900 via-indigo-900 to-slate-900 text-white shadow-xl shadow-indigo-950/20 border border-violet-500/30 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/30 text-[11px] font-bold text-violet-200">
                <Sparkles className="w-3.5 h-3.5 text-violet-300 animate-pulse" />
                <span>AI Cart Match Result</span>
              </div>
              <div className="text-xs font-medium text-slate-300 flex items-center gap-3">
                <span>Detected Store: <strong className="text-white">{storeName}</strong></span>
                <span>•</span>
                <span>Cart Bill: <strong className="text-amber-300 font-mono text-sm font-bold">₹{cartTotal}</strong></span>
              </div>
            </div>

            {bestCoupon ? (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/15">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-amber-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 fill-amber-400" />
                        Highest Savings Pick
                      </span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                        Save ₹{bestCoupon.savingsAmount} Instantly
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-white">
                      {bestCoupon.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      {bestCoupon.description}
                    </p>
                    <div className="flex items-center gap-4 text-[11px] text-slate-400 mt-2">
                      <span>Min Order: <strong>₹{bestCoupon.min_order}</strong></span>
                      <span>•</span>
                      <span>Payment: <strong>{bestCoupon.payment_method}</strong></span>
                    </div>

                    {/* AI Coupon Fit Guide for Best Pick */}
                    {(() => {
                      const bestAiFit = getCouponAiFitGuide(bestCoupon);
                      const isBestOpen = Boolean(expandedAiGuides[bestCoupon.code]);
                      return (
                        <div className="mt-3">
                          <button
                            type="button"
                            onClick={() => toggleAiGuide(bestCoupon.code)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-violet-100 hover:text-white text-xs font-bold transition-all cursor-pointer border border-white/20 active:scale-95"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                            <span>AI Coupon Fit Guide</span>
                            <span className="text-[10px] text-violet-200">({isBestOpen ? "Hide" : "Why this fits you?"})</span>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isBestOpen ? "rotate-180" : ""}`} />
                          </button>

                          <AnimatePresence>
                            {isBestOpen && bestAiFit && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden mt-2.5"
                              >
                                <div className="p-3 rounded-xl bg-black/30 backdrop-blur-md border border-white/15 text-xs space-y-1.5 text-slate-200">
                                  <div className="flex items-start gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                    <span><strong className="text-white">Valid For:</strong> {bestAiFit.targetDesc}</span>
                                  </div>
                                  <div className="flex items-start gap-1.5">
                                    <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                                    <span><strong className="text-white">Sweet Spot:</strong> {bestAiFit.sweetSpot}</span>
                                  </div>
                                  <div className="flex items-start gap-1.5">
                                    <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                                    <span><strong className="text-white">The Catch:</strong> {bestAiFit.hiddenCatch}</span>
                                  </div>
                                  <div className="flex items-start gap-1.5">
                                    <CreditCard className="w-3.5 h-3.5 text-violet-300 shrink-0 mt-0.5" />
                                    <span><strong className="text-white">Payment:</strong> {bestAiFit.paymentMethod}</span>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="flex flex-col items-stretch sm:items-end gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleRevealAndCopy(bestCoupon)}
                      className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer font-mono"
                    >
                      {copiedCode === bestCoupon.code ? (
                        <>
                          <Check className="w-4 h-4 text-slate-950 stroke-[3]" />
                          <span>COPIED! ✅</span>
                        </>
                      ) : revealedCodes[bestCoupon.code] ? (
                        <>
                          <Copy className="w-4 h-4 text-slate-950" />
                          <span>COPY &ldquo;{bestCoupon.code}&rdquo;</span>
                        </>
                      ) : (
                        <>
                          <Unlock className="w-4 h-4 text-slate-950" />
                          <span>REVEAL &ldquo;{getMaskedCode(bestCoupon.code)}&rdquo;</span>
                        </>
                      )}
                    </button>

                    {bestCoupon.link && (
                      <a
                        href={bestCoupon.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-violet-200 hover:text-white flex items-center justify-center sm:justify-end gap-1 underline underline-offset-2 py-0.5"
                      >
                        <span>Open {storeName} in new tab</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/10 rounded-2xl p-5 text-center text-slate-300 text-sm">
                No direct coupon matched cart value of ₹{cartTotal}. See below for codes with minimum cart tiers.
              </div>
            )}

            {/* Next Tier Upgrade Opportunity */}
            {nextTier.length > 0 && (
              <div className="mt-4 p-3.5 rounded-2xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-between gap-3 text-xs text-amber-200">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    💡 <strong>Pro Tip:</strong> Add just <strong>₹{nextTier[0].shortfall}</strong> more to your cart to unlock <strong>{nextTier[0].title}</strong> (Code: <code className="font-bold text-white bg-black/30 px-1.5 py-0.5 rounded">{nextTier[0].code}</code>)!
                  </span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* 1. MINI CART SAVINGS ESTIMATOR */}
      <div className="mb-6 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-slate-50 via-white to-slate-50 border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-600 shrink-0">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                Cart Savings Estimator
              </h4>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
                Enter your cart value to instantly discover the #1 highest saving coupon
              </p>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scrollbar-none">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-0.5">Quick:</span>
            {[249, 499, 999, 1499].map(preset => (
              <button
                key={preset}
                type="button"
                onClick={() => setCalculatorAmount(String(preset))}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition-all cursor-pointer shrink-0 ${
                  calculatorAmount === String(preset)
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/60"
                }`}
              >
                ₹{preset}
              </button>
            ))}
          </div>
        </div>

        {/* Input & Live Result */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">₹</span>
            <input
              type="number"
              min="1"
              step="1"
              value={calculatorAmount}
              onChange={(e) => setCalculatorAmount(e.target.value)}
              placeholder="Enter your cart total (e.g. 549)..."
              className="w-full pl-7 pr-8 py-2 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 shadow-2xs"
            />
            {calculatorAmount && (
              <button
                type="button"
                onClick={() => setCalculatorAmount("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Live Evaluated Output */}
        {evaluatedSavings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 text-xs"
          >
            {evaluatedSavings.winningCode ? (
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-[11px] sm:text-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>
                  Best Match: Use <strong className="font-mono text-emerald-900 bg-emerald-100 px-1.5 py-0.5 rounded">{evaluatedSavings.winningCode}</strong> to save <strong>₹{evaluatedSavings.highestDiscount}</strong> (Net Pay: ₹{evaluatedSavings.cartAmount - evaluatedSavings.highestDiscount})
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-amber-800 font-medium text-[11px]">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>
                  Add ₹{evaluatedSavings.minShortfall} more to cart to qualify for {evaluatedSavings.closestCoupon?.code} (saves up to ₹{evaluatedSavings.closestCoupon?.max_discount})
                </span>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* 2. QUICK COUPON FILTER CHIPS */}
      {filterTabs.length > 1 && (
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar scrollbar-none pb-2 mb-4">
          {filterTabs.map(tab => {
            const isTabActive = activeFilter === tab.id;
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 active:scale-95 ${
                  isTabActive
                    ? `${storeTheme.btn} shadow-sm`
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/70"
                }`}
              >
                <TabIcon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  isTabActive ? "bg-white/20 text-white" : "bg-white text-slate-700 border border-slate-200/80"
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* 3. ALL VERIFIED COUPONS GRID WITH IN-PAGE CLICK-TO-REVEAL */}
      <div className="mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 mb-3 sm:mb-4">
          <div className="flex items-center gap-2 min-w-0">
            <Tag className="w-4 h-4 text-violet-600 shrink-0" />
            <h3 className="text-sm sm:text-lg font-black text-slate-900 truncate">
              Active Promo Codes for {storeName} ({filteredCoupons.length})
            </h3>
          </div>
          <span className="text-[11px] sm:text-xs text-slate-500 shrink-0">
            Tap code to reveal &amp; copy instantly
          </span>
        </div>

        {filteredCoupons.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
            <p className="text-xs font-bold text-slate-600">
              No coupons found matching this filter category.
            </p>
            <button
              type="button"
              onClick={() => setActiveFilter("all")}
              className="px-3.5 py-1.5 rounded-xl bg-violet-600 text-white text-xs font-bold shadow-xs hover:bg-violet-700 transition-all cursor-pointer"
            >
              Show All Codes ({storeCoupons.length})
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
            {filteredCoupons.map((coupon, idx) => {
              const isBest = isCartAnalysis && bestCoupon?.code === coupon.code;
              const isCalculatorWinner = evaluatedSavings?.winningCode === coupon.code;
              const calcData = evaluatedSavings?.perCouponSavings?.[coupon.code];
              const isRevealed = Boolean(revealedCodes[coupon.code]);
              const isCopied = copiedCode === coupon.code;

              return (
                <motion.div
                  key={coupon.id || `coupon-card-${idx}`}
                  whileHover={{ y: -3 }}
                  className={`p-3.5 sm:p-5 rounded-2xl bg-white border transition-all shadow-sm flex flex-col justify-between min-h-[200px] sm:min-h-[220px] relative overflow-hidden ${
                    isCalculatorWinner
                      ? "border-amber-400 ring-2 ring-amber-400/40 shadow-md shadow-amber-500/10"
                      : isBest 
                      ? "border-violet-500 ring-2 ring-violet-500/20 shadow-violet-100" 
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {/* Calculator Winner Highlight Banner */}
                  {isCalculatorWinner && (
                    <div className="mb-2 py-1 px-2.5 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-900 font-black text-[10px] flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-600 fill-amber-500" />
                        <span>#1 Best for your ₹{evaluatedSavings.cartAmount} cart!</span>
                      </span>
                      <span className="text-emerald-700 font-bold">
                        Saves ₹{evaluatedSavings.highestDiscount}
                      </span>
                    </div>
                  )}

                  {/* Calculator Shortfall Alert */}
                  {calcData && !calcData.qualifies && (
                    <div className="mb-2 py-0.5 px-2 rounded-lg bg-slate-100 border border-slate-200/80 text-slate-500 text-[10px] flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-amber-500 shrink-0" />
                      <span>Add ₹{calcData.shortfall} more to cart to unlock</span>
                    </div>
                  )}

                  {/* Top Badge & Success Rate */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold text-violet-700 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {coupon.badge || "PROMO CODE"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{coupon.verified_rate || "98% Success"}</span>
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                      {coupon.title}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {coupon.description}
                    </p>

                    {/* AI Coupon Fit Guide for this card */}
                    {(() => {
                      const aiFit = getCouponAiFitGuide(coupon);
                      const isAiOpen = Boolean(expandedAiGuides[coupon.code]);
                      return (
                        <div className="mt-2.5">
                          <button
                            type="button"
                            onClick={() => toggleAiGuide(coupon.code)}
                            className={`w-full py-1.5 px-2.5 rounded-xl text-left transition-all cursor-pointer border flex items-center justify-between active:scale-98 ${
                              isAiOpen
                                ? "bg-violet-50/90 border-violet-300 text-violet-950 font-bold shadow-2xs"
                                : "bg-slate-50/90 hover:bg-violet-50/60 border-slate-200/80 text-slate-700 hover:text-violet-900"
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-violet-600 fill-violet-200 shrink-0" />
                              <span className="text-[11px] font-bold">AI Fit Guide</span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-violet-700">
                              <span>{isAiOpen ? "Hide" : "Will this work for me?"}</span>
                              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isAiOpen ? "rotate-180" : ""}`} />
                            </div>
                          </button>

                          <AnimatePresence>
                            {isAiOpen && aiFit && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="mt-2 p-2.5 rounded-xl bg-gradient-to-br from-violet-50/90 via-purple-50/40 to-indigo-50/80 border border-violet-200/90 text-[11px] space-y-1.5 shadow-inner">
                                  <div className="flex items-start gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                    <div className="leading-snug">
                                      <span className="font-bold text-slate-800">Valid For: </span>
                                      <span className="text-slate-600">{aiFit.userTarget} — {aiFit.targetDesc}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-1.5">
                                    <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                                    <div className="leading-snug">
                                      <span className="font-bold text-slate-800">Best Cart Size: </span>
                                      <span className="text-slate-600">{aiFit.sweetSpot}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-1.5">
                                    <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                                    <div className="leading-snug">
                                      <span className="font-bold text-rose-900">The Catch: </span>
                                      <span className="text-slate-600">{aiFit.hiddenCatch}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-1.5">
                                    <CreditCard className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                                    <div className="leading-snug">
                                      <span className="font-bold text-slate-800">Payment: </span>
                                      <span className="text-slate-600">{aiFit.paymentMethod}</span>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Bottom Section & In-Page Click-to-Reveal CTA */}
                  <div className="pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2.5">
                      <span>Min Order: <strong className="text-slate-700">₹{coupon.min_order}</strong></span>
                      <span>Max Save: <strong className="text-emerald-600 font-bold">₹{coupon.max_discount}</strong></span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* The In-Page Reveal/Copy Button */}
                      <button
                        type="button"
                        onClick={() => handleRevealAndCopy(coupon)}
                        className={`flex-1 flex items-center justify-between px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl transition-all cursor-pointer font-mono text-xs font-bold active:scale-95 shadow-2xs ${
                          isCopied
                            ? "bg-emerald-500 text-white shadow-sm"
                            : isRevealed
                            ? `${storeTheme.btn}`
                            : "bg-gradient-to-r from-violet-50 to-indigo-50 hover:from-violet-100 hover:to-indigo-100 text-violet-900 border border-violet-200/80"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          {isRevealed ? (
                            <Unlock className="w-3.5 h-3.5 shrink-0" />
                          ) : (
                            <Lock className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                          )}
                          <span className="tracking-wider truncate font-mono text-xs">
                            {isRevealed ? coupon.code : getMaskedCode(coupon.code)}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-sans font-extrabold shrink-0 ml-1">
                          {isCopied ? (
                            <span className="flex items-center gap-1 text-white">
                              <Check className="w-3.5 h-3.5 stroke-[3]" /> Copied!
                            </span>
                          ) : isRevealed ? (
                            <span className="flex items-center gap-1 text-white/90">
                              <Copy className="w-3 h-3" /> Copy
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-violet-700">
                              Reveal Code
                            </span>
                          )}
                        </div>
                      </button>

                      {/* Dedicated Open Store Link */}
                      {coupon.link && (
                        <a
                          href={coupon.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-all shrink-0 active:scale-95 flex items-center justify-center"
                          title={`Visit ${storeName}`}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* RICH SEO SAVINGS GUIDE SECTION (Drives Organic Traffic & High Retention) */}
      <div className="mt-12 pt-8 border-t border-slate-200/80">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-4 h-4 text-violet-600" />
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Top 4 Smart Saving Strategies for {storeName}
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Expert strategies to maximize your savings on every order without paying full price.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {savingStrategies.map((strategy, sIdx) => (
            <div 
              key={sIdx}
              className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:border-violet-300 transition-all"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-violet-800 mb-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Strategy #{sIdx + 1}: {strategy.title}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {strategy.desc}
              </p>
            </div>
          ))}
        </div>

        {/* SEMANTIC FAQ ACCORDION (Indexed by Google for Rich Snippets) */}
        <div className="mb-8" itemScope itemType="https://schema.org/FAQPage">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-4 h-4 text-violet-600" />
            <h4 className="text-base font-extrabold text-slate-900">
              Frequently Asked Questions About {storeName} Coupons
            </h4>
          </div>

          <div className="space-y-3">
            {storeFaqs.map((faq, fIdx) => {
              const isOpen = openFaq === fIdx;
              return (
                <div 
                  key={fIdx}
                  className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden transition-all shadow-2xs"
                  itemScope 
                  itemProp="mainEntity" 
                  itemType="https://schema.org/Question"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : fIdx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-800 hover:text-violet-700 transition-colors cursor-pointer"
                  >
                    <span itemProp="name">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? "rotate-180 text-violet-600" : ""}`} />
                  </button>
                  
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50"
                        itemScope 
                        itemProp="acceptedAnswer" 
                        itemType="https://schema.org/Answer"
                      >
                        <div itemProp="text">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. SMART FLOATING BOTTOM TOAST ON COPY */}
      <AnimatePresence>
        {copiedCouponData && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 450, damping: 30 }}
            className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md p-3 sm:p-3.5 rounded-2xl bg-slate-950/95 backdrop-blur-md text-white shadow-2xl border border-white/20 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-black text-xs sm:text-sm text-emerald-300">
                    {copiedCouponData.code}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Copied!
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 truncate">
                  Ready to paste on {storeName} checkout
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {copiedCouponData.link && (
                <a
                  href={copiedCouponData.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl ${storeTheme.btn} text-xs font-black transition-all active:scale-95 shadow-sm`}
                >
                  <span>Open {storeName}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              <button
                type="button"
                onClick={() => setCopiedCouponData(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
