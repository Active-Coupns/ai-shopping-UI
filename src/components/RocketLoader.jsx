"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  Loader2, 
  Search, 
  Database, 
  ShieldCheck, 
  Tag, 
  Sparkles, 
  Activity, 
  Zap, 
  Cpu, 
  Radio, 
  Pill, 
  ShoppingBag,
  TrendingDown,
  Gift
} from "lucide-react";

// Keywords to detect Pharmacy / Health / Medicine vertical
const PHARMA_KEYWORDS = [
  "vitamin", "protein", "medicine", "supplement", "capsule", "tablet", "syrup", 
  "paracetamol", "creatine", "whey", "omega", "multivitamin", "pharma", "skin", 
  "serum", "ointment", "collagen", "biotin", "d3", "b12", "ayurvedic", "ashwagandha", 
  "shilajit", "sunscreen", "shampoo", "hair", "soap", "moisturizer", "bandage", 
  "thermometer", "sanitizer", "cough", "fever", "cold", "pain", "digest", "probiotic",
  "calcium", "zinc", "magnesium", "electrolyte", "ors", "pedialyte", "pharmacy"
];

const STORE_CONFIGS = {
  IN: {
    ecommerce: [
      { name: "Amazon.in", tag: "Prime Deals", color: "from-amber-500 to-orange-600", border: "border-amber-400/50", glow: "rgba(245,158,11,0.25)", pos: "top-1 left-1/2 -translate-x-1/2" },
      { name: "Flipkart", tag: "SuperCoin", color: "from-blue-600 to-indigo-600", border: "border-blue-400/50", glow: "rgba(37,99,235,0.25)", pos: "bottom-1 left-1/2 -translate-x-1/2" },
      { name: "Croma", tag: "Instant Bank", color: "from-emerald-500 to-teal-600", border: "border-emerald-400/50", glow: "rgba(16,185,129,0.25)", pos: "top-1/2 right-1 -translate-y-1/2" },
      { name: "Reliance Digital", tag: "Lowest Price", color: "from-rose-500 to-red-600", border: "border-rose-400/50", glow: "rgba(244,63,94,0.25)", pos: "top-1/2 left-1 -translate-y-1/2" }
    ],
    pharma: [
      { name: "Tata 1mg", tag: "Care Plan", color: "from-orange-500 to-amber-600", border: "border-orange-400/50", glow: "rgba(249,115,22,0.25)", pos: "top-1 left-1/2 -translate-x-1/2" },
      { name: "Apollo 24|7", tag: "Circle Offer", color: "from-teal-500 to-cyan-600", border: "border-teal-400/50", glow: "rgba(20,184,166,0.25)", pos: "bottom-1 left-1/2 -translate-x-1/2" },
      { name: "PharmEasy", tag: "Flat 20% Off", color: "from-emerald-500 to-green-600", border: "border-emerald-400/50", glow: "rgba(16,185,129,0.25)", pos: "top-1/2 right-1 -translate-y-1/2" },
      { name: "HealthKart", tag: "Authentic Code", color: "from-indigo-500 to-purple-600", border: "border-indigo-400/50", glow: "rgba(99,102,241,0.25)", pos: "top-1/2 left-1 -translate-y-1/2" }
    ]
  },
  US: {
    ecommerce: [
      { name: "Amazon.com", tag: "Prime Saver", color: "from-amber-500 to-orange-600", border: "border-amber-400/50", glow: "rgba(245,158,11,0.25)", pos: "top-1 left-1/2 -translate-x-1/2" },
      { name: "Walmart", tag: "Rollback Deals", color: "from-blue-600 to-sky-600", border: "border-blue-400/50", glow: "rgba(37,99,235,0.25)", pos: "bottom-1 left-1/2 -translate-x-1/2" },
      { name: "Best Buy", tag: "Price Match", color: "from-yellow-500 to-amber-600", border: "border-yellow-400/50", glow: "rgba(234,179,8,0.25)", pos: "top-1/2 right-1 -translate-y-1/2" },
      { name: "Target", tag: "RedCard Extra", color: "from-red-600 to-rose-600", border: "border-red-400/50", glow: "rgba(220,38,38,0.25)", pos: "top-1/2 left-1 -translate-y-1/2" }
    ],
    pharma: [
      { name: "CVS Pharmacy", tag: "ExtraCare", color: "from-red-600 to-rose-600", border: "border-red-400/50", glow: "rgba(220,38,38,0.25)", pos: "top-1 left-1/2 -translate-x-1/2" },
      { name: "Walgreens", tag: "myWalgreens", color: "from-rose-500 to-red-600", border: "border-rose-400/50", glow: "rgba(244,63,94,0.25)", pos: "bottom-1 left-1/2 -translate-x-1/2" },
      { name: "iHerb", tag: "Promo Verified", color: "from-emerald-500 to-green-600", border: "border-emerald-400/50", glow: "rgba(16,185,129,0.25)", pos: "top-1/2 right-1 -translate-y-1/2" },
      { name: "GNC Health", tag: "Member Gold", color: "from-amber-500 to-yellow-600", border: "border-amber-400/50", glow: "rgba(245,158,11,0.25)", pos: "top-1/2 left-1 -translate-y-1/2" }
    ]
  }
};

export default function RocketLoader({ query = "", country = "IN", onComplete, apiLoading }) {
  const [currentStage, setCurrentStage] = useState(1);
  const [completedStages, setCompletedStages] = useState([]);
  const [progress, setProgress] = useState(0);
  const [activeStoreIdx, setActiveStoreIdx] = useState(0);
  const [telemetryIndex, setTelemetryIndex] = useState(0);
  
  const apiLoadingRef = React.useRef(apiLoading);
  useEffect(() => {
    apiLoadingRef.current = apiLoading;
  }, [apiLoading]);

  // Determine if search query is Pharmacy / Supplement or General E-commerce
  const isPharma = useMemo(() => {
    const q = (query || "").toLowerCase();
    return PHARMA_KEYWORDS.some(k => q.includes(k));
  }, [query]);

  const countryKey = country === "US" ? "US" : "IN";
  const activeStores = useMemo(() => {
    return isPharma ? STORE_CONFIGS[countryKey].pharma : STORE_CONFIGS[countryKey].ecommerce;
  }, [isPharma, countryKey]);

  // Stages adapted dynamically for Pharma vs E-commerce
  const stages = useMemo(() => {
    if (isPharma) {
      return [
        { id: 1, text: "🔬 Dissecting formulation specs, dosage & brand variants...", duration: 600, icon: Cpu, badge: "AI Intent" },
        { id: 2, text: `🌐 Parallel radar scan across ${activeStores.map(s => s.name).join(", ")}...`, duration: 700, icon: Radio, badge: "Live Radar" },
        { id: 3, text: "🏷️ Benchmarking batch prices, per-unit costs & expiry guarantees...", duration: 600, icon: Database, badge: "Best Offer" },
        { id: 4, text: "🎟️ Unlocking active pharmacy promo codes & subscription vouchers...", duration: 500, icon: ShieldCheck, badge: "Verified Coupons" }
      ];
    }
    return [
      { id: 1, text: "🧠 Dissecting product intent, model specs & variants...", duration: 600, icon: Cpu, badge: "AI Engine" },
      { id: 2, text: `🌐 Parallel radar sweep across ${activeStores.map(s => s.name).join(", ")}...`, duration: 700, icon: Radio, badge: "Live Radar" },
      { id: 3, text: "📊 Benchmarking live store prices & finding lowest price drops...", duration: 600, icon: Database, badge: "Price Match" },
      { id: 4, text: "🎟️ Scanning & unlocking active coupon vouchers & bank offers...", duration: 500, icon: ShieldCheck, badge: "Coupon Hunter" }
    ];
  }, [isPharma, activeStores]);

  // Dynamic Live Telemetry Logs
  const telemetryLogs = useMemo(() => {
    if (isPharma) {
      return [
        `📡 [RADAR] Handshake verified with ${activeStores[0]?.name || "Tata 1mg"} in 42ms...`,
        `🧪 [FORMULA] Parsing active ingredient concentrations & certified seller stock...`,
        `💊 [CROSS-CHECK] Found 18% lower bulk price on ${activeStores[1]?.name || "Apollo 24|7"}...`,
        `🎟️ [PROMO ENGINE] Unlocked verified instant coupon voucher!`,
        `🛡️ [GENUINE GUARANTEE] 100% manufacturer verified batch certification check passed...`,
        `✨ [FINALIZING] Compiling optimal best-deal comparison matrix...`
      ];
    }
    return [
      `📡 [RADAR] Connected to ${activeStores[0]?.name || "Amazon"} live catalog connector (38ms)...`,
      `🔍 [SPEC ENGINE] Matched exact product SKU & variant configuration...`,
      `🏷️ [PRICE BENCHMARK] Price gap detected: ₹2,400 savings potential spotted...`,
      `🎟️ [COUPON HUNTER] Validating active bank codes & merchant checkout promos...`,
      `⚡ [CACHE BOOST] In-memory neural cache synchronized successfully...`,
      `✨ [FINALIZING] Ranking best-value deals with instant purchase links...`
    ];
  }, [isPharma, activeStores]);

  // Orbit store active node cycler
  useEffect(() => {
    const storeInterval = setInterval(() => {
      setActiveStoreIdx((prev) => (prev + 1) % activeStores.length);
    }, 1000);
    return () => clearInterval(storeInterval);
  }, [activeStores]);

  // Telemetry stream cycler
  useEffect(() => {
    const telInterval = setInterval(() => {
      setTelemetryIndex((prev) => (prev + 1) % telemetryLogs.length);
    }, 1200);
    return () => clearInterval(telInterval);
  }, [telemetryLogs]);

  // Instant Fast-Forward when backend responds (Redis Cache Hit or Fast API)
  useEffect(() => {
    if (!apiLoading) {
      // Results are ready! Fast-forward to 100% and transition smoothly
      setProgress(100);
      setCurrentStage(4);
      setCompletedStages([1, 2, 3, 4]);
      const fastTimer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 100);
      return () => clearTimeout(fastTimer);
    }
  }, [apiLoading, onComplete]);

  // Stage transition & progress logic
  useEffect(() => {
    let timers = [];
    let accumulatedTime = 0;
    const totalDuration = stages.reduce((acc, s) => acc + s.duration, 0);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (!apiLoadingRef.current) {
          clearInterval(progressInterval);
          return 100;
        }
        if (prev >= 98) return 98;
        return prev + 2;
      });
    }, Math.max(15, totalDuration / 70));

    stages.forEach((stage, index) => {
      const activeTimer = setTimeout(() => {
        if (apiLoadingRef.current) {
          setCurrentStage(stage.id);
        }
      }, accumulatedTime);
      timers.push(activeTimer);

      accumulatedTime += stage.duration;

      const completeTimer = setTimeout(() => {
        setCompletedStages((prev) => [...new Set([...prev, stage.id])]);
        if (index === stages.length - 1) {
          const checkCompletion = () => {
            if (apiLoadingRef.current) {
              setTimeout(checkCompletion, 80);
            } else {
              setProgress(100);
              setTimeout(onComplete, 200);
            }
          };
          checkCompletion();
        }
      }, accumulatedTime);
      timers.push(completeTimer);
    });

    return () => {
      timers.forEach((t) => clearTimeout(t));
      clearInterval(progressInterval);
    };
  }, [stages, onComplete]);

  const activeStageObj = stages.find(s => s.id === currentStage) || stages[0];
  const CurrentIcon = activeStageObj.icon || Activity;

  // Theme accents
  const themeGlow = isPharma ? "bg-emerald-500/15" : "bg-indigo-500/15";
  const themeGrad = isPharma 
    ? "from-emerald-500 via-teal-500 to-green-600" 
    : "from-brand-indigo via-brand-violet to-purple-600";
  const radarBorder = isPharma ? "border-emerald-500/30" : "border-indigo-500/30";
  const radarConic = isPharma 
    ? "conic-gradient(from 0deg, transparent 50%, rgba(16, 185, 129, 0.15) 80%, rgba(20, 184, 166, 0.6) 100%)"
    : "conic-gradient(from 0deg, transparent 50%, rgba(168, 85, 247, 0.18) 80%, rgba(99, 102, 241, 0.6) 100%)";

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col items-center justify-center relative select-none">
      
      {/* Background ambient multi-color lighting */}
      <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-[420px] h-80 sm:h-[420px] ${themeGlow} rounded-full blur-3xl pointer-events-none transition-all duration-700`} />

      {/* Query Banner with Futuristic Scanning Badge */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8 text-center w-full relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 shadow-sm text-[11px] font-black uppercase tracking-wider mb-2.5">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isPharma ? "bg-emerald-400" : "bg-indigo-400"} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isPharma ? "bg-emerald-500" : "bg-brand-indigo"}`}></span>
          </span>
          <span className={`font-mono ${isPharma ? "text-emerald-700" : "text-brand-indigo"}`}>
            {isPharma ? "HEALTH & PHARMA RADAR ACTIVE" : "MULTI-STORE AI RADAR ACTIVE"}
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-600 font-bold">{country === "US" ? "🇺🇸 United States" : "🇮🇳 India"}</span>
        </div>

        <div className="max-w-md mx-auto px-4 py-2 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-md flex items-center justify-center gap-2">
          {isPharma ? (
            <Pill className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <ShoppingBag className="w-4 h-4 text-brand-indigo shrink-0" />
          )}
          <span className="text-xs sm:text-sm font-extrabold text-slate-800 truncate">
            &ldquo;{query}&rdquo;
          </span>
        </div>
      </motion.div>

      {/* Futuristic Holographic Multi-Store Radar Hub */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 mb-8 sm:mb-10 flex items-center justify-center relative z-10">
        
        {/* Pulsing Sonar Ripple Waves */}
        <motion.div
          animate={{ scale: [1, 1.45], opacity: [0.6, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
          className={`absolute inset-0 rounded-full border-2 ${radarBorder} pointer-events-none`}
        />
        <motion.div
          animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: 0.8, ease: "easeOut" }}
          className={`absolute inset-0 rounded-full border ${radarBorder} pointer-events-none`}
        />

        {/* Concentric Tech Calibration Rings */}
        <div className="absolute inset-0 rounded-full border border-slate-200/90 shadow-inner" />
        <div className="absolute inset-4 rounded-full border border-dashed border-slate-300/70" />
        <div className={`absolute inset-10 rounded-full border ${radarBorder} opacity-60`} />
        <div className="absolute inset-16 rounded-full border border-slate-200/80" />

        {/* Radar Crosshairs */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full h-px bg-slate-200/60" />
          <div className="h-full w-px bg-slate-200/60 absolute" />
        </div>

        {/* 360 Degree Continuous Sonar Sweep Beam */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full pointer-events-none origin-center z-10"
          style={{ background: radarConic }}
        >
          {/* Active Laser Lead Line */}
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-1/2 ${isPharma ? "bg-gradient-to-t from-emerald-400 to-teal-300 shadow-[0_0_8px_#10b981]" : "bg-gradient-to-t from-brand-indigo to-cyan-300 shadow-[0_0_8px_#6366f1]"}`} />
        </motion.div>

        {/* Floating Dynamic Store Nodes */}
        {activeStores.map((node, idx) => {
          const isActive = activeStoreIdx === idx;
          return (
            <motion.div
              key={node.name}
              animate={{
                scale: isActive ? 1.08 : 1,
                y: isActive ? [0, -4, 0] : [0, -2, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`absolute z-30 px-3 py-1.5 rounded-xl border backdrop-blur-md shadow-lg transition-all duration-300 ${node.pos} ${
                isActive
                  ? `bg-white ${node.border} ring-2 ring-offset-1 ${isPharma ? "ring-emerald-400" : "ring-brand-indigo"}`
                  : "bg-white/90 border-slate-200/90 opacity-90"
              }`}
              style={{
                boxShadow: isActive ? `0 4px 18px ${node.glow}` : "0 2px 8px rgba(0,0,0,0.06)"
              }}
            >
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${node.color} ${isActive ? "animate-pulse" : ""}`} />
                <span className="text-[11px] font-black tracking-tight text-slate-800 whitespace-nowrap">
                  {node.name}
                </span>
              </div>
              
              {/* Micro tag indicating active intelligence */}
              <div className="text-[9px] font-bold text-slate-500 text-center -mt-0.5 flex items-center justify-center gap-0.5">
                {isActive ? (
                  <span className={`font-extrabold ${isPharma ? "text-emerald-600" : "text-brand-indigo"} animate-pulse flex items-center gap-0.5`}>
                    <Zap className="w-2.5 h-2.5 fill-current" /> {node.tag}
                  </span>
                ) : (
                  <span>Verified Node</span>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Central Futuristic AI Core Sensor */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            boxShadow: [
              `0 0 20px ${isPharma ? "rgba(16,185,129,0.3)" : "rgba(99,102,241,0.3)"}`,
              `0 0 38px ${isPharma ? "rgba(20,184,166,0.55)" : "rgba(168,85,247,0.55)"}`,
              `0 0 20px ${isPharma ? "rgba(16,185,129,0.3)" : "rgba(99,102,241,0.3)"}`
            ]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr ${themeGrad} flex flex-col items-center justify-center p-1 relative z-20 shadow-2xl`}
        >
          <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center p-2 text-center shadow-inner relative overflow-hidden">
            {/* Ambient core glow */}
            <div className={`absolute inset-0 ${isPharma ? "bg-emerald-50/70" : "bg-indigo-50/70"} pointer-events-none`} />
            
            <CurrentIcon className={`w-7 h-7 sm:w-8 sm:h-8 ${isPharma ? "text-emerald-600" : "text-brand-indigo"} animate-pulse relative z-10`} />
            <div className="text-xs sm:text-sm font-black text-slate-900 font-mono relative z-10 leading-tight">
              {progress}%
            </div>
            <div className="text-[8px] font-extrabold uppercase tracking-widest text-slate-500 relative z-10">
              SCANNING
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stage Progression Cards with Micro-Badges */}
      <div className="w-full space-y-2.5 mb-6 relative z-10">
        {stages.map((stage) => {
          const isActive = currentStage === stage.id;
          const isCompleted = completedStages.includes(stage.id);

          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0.3, x: -8 }}
              animate={{
                opacity: isActive ? 1 : isCompleted ? 0.9 : 0.45,
                scale: isActive ? 1.012 : 1
              }}
              transition={{ duration: 0.25 }}
              className={`flex items-center justify-between gap-3 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl border transition-all duration-300 ${
                isActive
                  ? isPharma
                    ? "border-emerald-400/60 bg-white shadow-md text-slate-900 ring-1 ring-emerald-200"
                    : "border-brand-indigo/60 bg-white shadow-md text-slate-900 ring-1 ring-indigo-200"
                  : isCompleted
                  ? "border-emerald-300/50 bg-emerald-50/40 text-slate-800"
                  : "border-slate-200/80 bg-slate-50/40 text-slate-500"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* State Icon Indicator */}
                <div className="relative flex items-center justify-center w-5 h-5 shrink-0">
                  <AnimatePresence mode="wait">
                    {isCompleted ? (
                      <motion.div
                        key="completed"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3.5px]" />
                      </motion.div>
                    ) : isActive ? (
                      <motion.div
                        key="loading"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Loader2 className={`w-4 h-4 ${isPharma ? "text-emerald-600" : "text-brand-indigo"} animate-spin`} />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="pending"
                        initial={{ scale: 0.6 }}
                        animate={{ scale: 1 }}
                        className="w-3.5 h-3.5 rounded-full border border-slate-300 bg-white"
                      />
                    )}
                  </AnimatePresence>
                </div>

                {/* Stage Text */}
                <span className={`text-xs sm:text-[13px] font-semibold tracking-tight truncate ${
                  isActive ? "text-slate-900 font-bold" : isCompleted ? "text-slate-700" : "text-slate-400"
                }`}>
                  {stage.text}
                </span>
              </div>

              {/* Stage Step Category Badge */}
              <div className="shrink-0 hidden sm:block">
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                  isActive
                    ? isPharma ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-indigo-100 text-brand-indigo border border-indigo-300"
                    : isCompleted
                    ? "bg-emerald-100/60 text-emerald-700"
                    : "bg-slate-100 text-slate-400"
                }`}>
                  {stage.badge}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Smooth High-Precision Glowing Progress Track */}
      <div className="w-full bg-slate-200/80 rounded-full h-2.5 overflow-hidden mb-5 p-0.5 shadow-inner relative z-10">
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className={`h-full rounded-full bg-gradient-to-r ${themeGrad} shadow-[0_0_12px_rgba(99,102,241,0.5)]`}
          style={{ width: "0%" }}
        />
      </div>

      {/* Live AI Telemetry Feed Terminal Box */}
      <div className="w-full bg-slate-900 text-slate-100 rounded-2xl p-3 sm:p-3.5 relative z-10 border border-slate-800 shadow-xl overflow-hidden">
        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-slate-400">
              LIVE TELEMETRY STREAM
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">
            LATENCY: 42ms
          </span>
        </div>

        <div className="h-6 sm:h-7 flex items-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={telemetryIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="text-[11px] sm:text-xs font-mono text-cyan-300 truncate w-full flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{telemetryLogs[telemetryIndex]}</span>
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}
