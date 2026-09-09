"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Compass, Shield, Database, Search, Zap, Sparkles } from "lucide-react";

const STAGES = [
  { id: 1, text: "🧠 Analyzing search intent & specs...", duration: 1600, icon: Compass },
  { id: 2, text: "🌐 Scanning merchant networks (Amazon, Flipkart, Croma)...", duration: 2000, icon: Search },
  { id: 3, text: "📊 Benchmarking live store prices & discount offers...", duration: 1600, icon: Database },
  { id: 4, text: "🎟️ Verifying active coupon vouchers...", duration: 1600, icon: Shield }
];

const SHOPPING_TRIVIA = [
  "Checking verified coupon codes saves our users an average of 18% per checkout! 🎟️",
  "In-memory database caching speeds up identical search requests to under 150ms! ⚡",
  "Our multi-store search connectors scan live product listings from over 15 major online stores! 🌐",
  "ShopSmart's proprietary intent classification AI bypasses scraping entirely for coupon-related searches! 🧠",
  "Did you know? The most searched shopping term on ShopSmart is 'Laptop under 50k'! 💻",
  "Outbound PDP direct link guards filter out 100% of malicious Google aggregator redirects! 🛡️"
];

const STORE_NODES = [
  { name: "Amazon.in", color: "bg-[#ff9900]/20 text-amber-300 border-[#ff9900]/40", pos: "top-0 left-1/2 -translate-x-1/2 -translate-y-4" },
  { name: "Flipkart", color: "bg-[#2874f0]/20 text-blue-300 border-[#2874f0]/40", pos: "bottom-0 left-1/2 -translate-x-1/2 translate-y-4" },
  { name: "Croma", color: "bg-[#00e6c3]/20 text-[#00e6c3] border-[#00e6c3]/40", pos: "top-1/2 right-0 translate-x-6 -translate-y-1/2" },
  { name: "Reliance", color: "bg-red-500/20 text-red-300 border-red-500/40", pos: "top-1/2 left-0 -translate-x-6 -translate-y-1/2" }
];

export default function RocketLoader({ query, onComplete, apiLoading }) {
  const [currentStage, setCurrentStage] = useState(1);
  const [completedStages, setCompletedStages] = useState([]);
  const [triviaIndex, setTriviaIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const apiLoadingRef = React.useRef(apiLoading);
  
  useEffect(() => {
    apiLoadingRef.current = apiLoading;
  }, [apiLoading]);

  // Trivia rotation interval
  useEffect(() => {
    const interval = setInterval(() => {
      setTriviaIndex((prev) => (prev + 1) % SHOPPING_TRIVIA.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  // Stage transition and progress loader simulation
  useEffect(() => {
    let timers = [];
    let accumulatedTime = 0;
    const totalDuration = STAGES.reduce((acc, s) => acc + s.duration, 0);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) {
          if (!apiLoadingRef.current) {
            clearInterval(progressInterval);
            return 100;
          }
          return 98;
        }
        return prev + 1;
      });
    }, totalDuration / 98);

    STAGES.forEach((stage, index) => {
      const activeTimer = setTimeout(() => {
        setCurrentStage(stage.id);
      }, accumulatedTime);
      timers.push(activeTimer);

      accumulatedTime += stage.duration;

      const completeTimer = setTimeout(() => {
        setCompletedStages((prev) => [...prev, stage.id]);
        if (index === STAGES.length - 1) {
          const checkCompletion = () => {
            if (apiLoadingRef.current) {
              setTimeout(checkCompletion, 100);
            } else {
              setProgress(100);
              setTimeout(onComplete, 400);
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
  }, [onComplete]);

  const activeIconIndex = STAGES.findIndex(s => s.id === currentStage);
  const CurrentIcon = STAGES[activeIconIndex >= 0 ? activeIconIndex : 0].icon;

  return (
    <div className="w-full max-w-xl mx-auto px-6 py-8 flex flex-col items-center justify-center min-h-[540px] relative">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-indigo/15 rounded-full blur-3xl pointer-events-none" />

      {/* Query Banner Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center w-full relative z-10"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-indigo/15 border border-brand-indigo/35 text-[10px] font-extrabold uppercase tracking-widest text-brand-indigo mb-2 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-brand-indigo animate-pulse" />
          <span>Radar Scan Target Query</span>
        </div>
        <div className="inline-block px-5 py-2.5 rounded-2xl glass-panel-accent text-white font-semibold text-xs max-w-full truncate shadow-xl border border-slate-800">
          &ldquo;<span className="text-brand-indigo font-bold">{query}</span>&rdquo;
        </div>
      </motion.div>

      {/* Holographic AI Radar Visualizer with Floating Store Nodes */}
      <div className="relative w-56 h-56 mb-10 flex items-center justify-center relative z-10">
        
        {/* Outer glowing halo */}
        <div className="absolute inset-0 rounded-full border border-brand-indigo/25 scale-100 animate-pulse" />
        <div className="absolute inset-4 rounded-full border border-slate-800/80 scale-100" />
        <div className="absolute inset-10 rounded-full border border-brand-violet/20 scale-100" />
        <div className="absolute inset-16 rounded-full border border-slate-900 scale-100" />

        {/* Floating Store Nodes */}
        {STORE_NODES.map((node, idx) => (
          <motion.div
            key={idx}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: idx * 0.4 }}
            className={`absolute z-30 px-2.5 py-1 rounded-full border text-[10px] font-extrabold tracking-wide uppercase shadow-lg backdrop-blur-md ${node.color} ${node.pos}`}
          >
            {node.name}
          </motion.div>
        ))}

        {/* 360 Sweep scanner radar line */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full pointer-events-none origin-center z-10"
          style={{
            background: "conic-gradient(from 0deg, transparent 50%, rgba(168, 85, 247, 0.25) 85%, rgba(99, 102, 241, 0.6) 100%)"
          }}
        />

        {/* Central glowing orb with active indicator icon & percentage */}
        <motion.div
          animate={{
            scale: [1, 1.06, 1],
            boxShadow: [
              "0 0 20px rgba(99, 102, 241, 0.4)",
              "0 0 45px rgba(168, 85, 247, 0.7)",
              "0 0 20px rgba(99, 102, 241, 0.4)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-24 h-24 rounded-full bg-gradient-to-tr from-brand-indigo via-brand-violet to-emerald-400 flex flex-col items-center justify-center p-1 relative z-20 shadow-2xl"
        >
          <div className="w-full h-full rounded-full bg-slate-950/95 flex flex-col items-center justify-center border border-brand-indigo/40 p-2 text-center">
            <CurrentIcon className="w-7 h-7 text-brand-indigo animate-pulse mb-0.5" />
            <span className="text-xs font-black text-white font-mono">{progress}%</span>
          </div>
        </motion.div>
      </div>

      {/* Checklist stage cards */}
      <div className="w-full space-y-3 mb-8 relative z-10">
        {STAGES.map((stage) => {
          const isActive = currentStage === stage.id;
          const isCompleted = completedStages.includes(stage.id);

          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0.2, x: -10 }}
              animate={{
                opacity: isActive ? 1 : isCompleted ? 0.8 : 0.3,
                scale: isActive ? 1.015 : 1
              }}
              className={`flex items-center gap-3.5 px-4.5 py-3 rounded-2xl border transition-all duration-300 ${
                isActive
                  ? "border-brand-indigo/40 bg-slate-900/90 shadow-[0_0_20px_rgba(99,102,241,0.15)]"
                  : isCompleted
                  ? "border-emerald-500/25 bg-slate-950/60"
                  : "border-slate-800/40 bg-slate-950/30"
              }`}
            >
              {/* Left indicator check icon */}
              <div className="relative flex items-center justify-center w-5 h-5 shrink-0">
                <AnimatePresence mode="wait">
                  {isCompleted ? (
                    <motion.div
                      key="completed"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 font-bold shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3px]" />
                    </motion.div>
                  ) : isActive ? (
                    <motion.div
                      key="loading"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Loader2 className="w-4 h-4 text-brand-indigo animate-spin" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="pending"
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      className="w-3.5 h-3.5 rounded-full border border-slate-800 bg-slate-950"
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Stage Description Text */}
              <span className={`text-xs md:text-sm font-semibold tracking-wide ${isActive ? "text-white font-bold" : isCompleted ? "text-slate-300" : "text-slate-600"}`}>
                {stage.text}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Glowing Progress Bar */}
      <div className="w-full bg-slate-950 border border-slate-800 rounded-full h-3 overflow-hidden mb-6 p-0.5 shadow-inner relative z-10">
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-brand-indigo via-brand-violet to-emerald-400 shadow-[0_0_15px_rgba(99,102,241,0.6)]"
          style={{ width: "0%" }}
        />
      </div>

      {/* Shopping Trivia Banner */}
      <div className="w-full glass-panel-accent rounded-2xl p-4 min-h-[65px] flex items-center justify-center text-center relative z-10 border border-slate-800">
        <AnimatePresence mode="wait">
          <motion.p
            key={triviaIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.4 }}
            className="text-[11px] md:text-xs font-semibold text-slate-300 leading-relaxed font-mono"
          >
            {SHOPPING_TRIVIA[triviaIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

    </div>
  );
}
