"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Compass, Shield, Database, Search } from "lucide-react";

const STAGES = [
  { id: 1, text: "🧠 Analyzing query intent & specifications...", duration: 1800, icon: Compass },
  { id: 2, text: "🌐 Scanning inventories across major online stores...", duration: 2200, icon: Search },
  { id: 3, text: "📊 Evaluating historical price trends & seller ratings...", duration: 1800, icon: Database },
  { id: 4, text: "🎟️ Checking live verified coupon vouchers...", duration: 1800, icon: Shield }
];

const SHOPPING_TRIVIA = [
  "Checking verified coupon codes saves our users an average of 18% per checkout! 🎟️",
  "The Upstash Redis cache speeds up identical search requests to under 150ms! ⚡",
  "Our SerpApi search engine crawls live product listings from over 15 major online stores! 🌐",
  "ShopSmart's AI Intent Classifier bypasses scraping entirely for coupon-related searches! 🧠",
  "Did you know? The most searched shopping term on ShopSmart is 'Laptop under 50k'! 💻",
  "Outbound PDP direct link guards filter out 100% of malicious Google aggregator redirects! 🛡️"
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
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Stage transition and progress loader simulation
  useEffect(() => {
    let timers = [];
    let accumulatedTime = 0;
    const totalDuration = STAGES.reduce((acc, s) => acc + s.duration, 0);

    // Progress bar tick interval
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) {
          if (!apiLoadingRef.current) {
            clearInterval(progressInterval);
            return 100;
          }
          return 98; // Hold near 100 until API resolves
        }
        return prev + 1;
      });
    }, totalDuration / 98);

    STAGES.forEach((stage, index) => {
      // Timer to activate stage
      const activeTimer = setTimeout(() => {
        setCurrentStage(stage.id);
      }, accumulatedTime);
      timers.push(activeTimer);

      accumulatedTime += stage.duration;

      // Timer to complete stage
      const completeTimer = setTimeout(() => {
        setCompletedStages((prev) => [...prev, stage.id]);
        if (index === STAGES.length - 1) {
          // Last stage completed. Wait if API is still loading
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
    <div className="w-full max-w-xl mx-auto px-6 py-8 flex flex-col items-center justify-center min-h-[520px]">
      
      {/* Query Banner Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center w-full"
      >
        <span className="text-slate-500 text-[10px] font-black uppercase tracking-wider block mb-2 font-mono">
          Radar Target Query
        </span>
        <div className="inline-block px-5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-900 text-white font-mono text-xs max-w-full truncate shadow-inner">
          &ldquo;{query}&rdquo;
        </div>
      </motion.div>

      {/* Futuristic concentric radar visualizer */}
      <div className="relative w-48 h-48 mb-10 flex items-center justify-center">
        {/* Concentric rings */}
        <div className="absolute inset-0 rounded-full border border-slate-800/30 scale-100" />
        <div className="absolute inset-4 rounded-full border border-slate-800/50 scale-100" />
        <div className="absolute inset-8 rounded-full border border-slate-800/80 scale-100" />
        <div className="absolute inset-16 rounded-full border border-slate-900 scale-100" />

        {/* Sweep scanner line */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full pointer-events-none origin-center z-10"
          style={{
            background: "conic-gradient(from 0deg, transparent 50%, rgba(168, 85, 247, 0.15) 90%, rgba(99, 102, 241, 0.4) 100%)"
          }}
        />

        {/* Central glowing orb with active indicator icon */}
        <motion.div
          animate={{
            scale: [1, 1.06, 1],
            boxShadow: [
              "0 0 15px rgba(99, 102, 241, 0.3)",
              "0 0 35px rgba(168, 85, 247, 0.5)",
              "0 0 15px rgba(99, 102, 241, 0.3)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-20 h-20 rounded-full bg-gradient-to-tr from-brand-indigo via-brand-violet to-purple-600 flex items-center justify-center p-1 relative z-20 shadow-lg"
        >
          <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center border border-slate-900">
            <CurrentIcon className="w-8 h-8 text-brand-indigo animate-pulse" />
          </div>
        </motion.div>
      </div>

      {/* Checklist progress and stage indicators */}
      <div className="w-full space-y-3.5 mb-8">
        {STAGES.map((stage) => {
          const isActive = currentStage === stage.id;
          const isCompleted = completedStages.includes(stage.id);

          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0.2, x: -10 }}
              animate={{
                opacity: isActive ? 1 : isCompleted ? 0.7 : 0.25,
                scale: isActive ? 1.01 : 1
              }}
              className={`flex items-center gap-3.5 px-4.5 py-3 rounded-xl border transition-all duration-300 ${
                isActive
                  ? "border-brand-indigo/30 bg-brand-indigo/5 shadow-[0_0_15px_rgba(99,102,241,0.08)]"
                  : "border-transparent bg-slate-950/20"
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
                      className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-emerald-950 font-bold"
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
              <span className={`text-xs md:text-sm font-semibold tracking-wide ${isActive ? "text-white" : isCompleted ? "text-slate-300" : "text-slate-600"}`}>
                {stage.text}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Glowing Neon Progress Bar */}
      <div className="w-full bg-slate-950 border border-slate-900/60 rounded-full h-2.5 overflow-hidden mb-6 p-0.5 shadow-inner">
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-brand-indigo via-brand-violet to-purple-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
          style={{ width: "0%" }}
        />
      </div>

      {/* Shopping Trivia Rotating Banner */}
      <div className="w-full glass-panel border border-slate-900 rounded-xl p-4 min-h-[70px] flex items-center justify-center text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={triviaIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.4 }}
            className="text-[11px] md:text-xs font-semibold text-slate-400 leading-relaxed font-mono"
          >
            {SHOPPING_TRIVIA[triviaIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

    </div>
  );
}
