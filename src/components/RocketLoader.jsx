"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";

const STEPS = [
  { id: 1, text: "🧠 Understanding query intent & constraints...", duration: 800 },
  { id: 2, text: "🔎 Searching Amazon, Flipkart, & major stores...", duration: 800 },
  { id: 3, text: "📊 AI comparing specs, prices & user reviews...", duration: 800 },
  { id: 4, text: "🎟️ Matching best affiliate deals & store coupons...", duration: 800 }
];

// Particle helper for rocket exhaust
const exhaustParticles = Array.from({ length: 15 }).map((_, i) => ({
  id: i,
  angle: (Math.random() - 0.5) * 20, // Spread angle
  speed: 40 + Math.random() * 60,
  delay: Math.random() * 0.5,
  size: 4 + Math.random() * 8,
}));

export default function RocketLoader({ query, onComplete, apiLoading }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  
  const apiLoadingRef = React.useRef(apiLoading);
  
  useEffect(() => {
    apiLoadingRef.current = apiLoading;
  }, [apiLoading]);

  useEffect(() => {
    let timers = [];
    let accumulatedTime = 0;

    STEPS.forEach((step, index) => {
      // Timer to set active step
      const activeTimer = setTimeout(() => {
        setCurrentStep(step.id);
      }, accumulatedTime);
      timers.push(activeTimer);

      // Timer to mark step as completed
      accumulatedTime += step.duration;
      const completeTimer = setTimeout(() => {
        setCompletedSteps((prev) => [...prev, step.id]);
        if (index === STEPS.length - 1) {
          // Last step completed. Wait if API is still loading
          const checkCompletion = () => {
            if (apiLoadingRef.current) {
              setTimeout(checkCompletion, 100);
            } else {
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
    };
  }, [onComplete]);

  return (
    <div className="w-full max-w-xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-[500px]">
      {/* Query Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider block mb-2">Analyzing Query</span>
        <div className="inline-block px-4 py-2 rounded-xl glass-panel text-white font-medium text-sm border-brand-indigo/30 shadow-[0_0_20px_rgba(99,102,241,0.15)] max-w-md truncate">
          &ldquo;{query}&rdquo;
        </div>
      </motion.div>

      {/* Rocket Flight Path Visualizer */}
      <div className="relative w-full h-48 flex items-center justify-center mb-16 overflow-hidden">
        {/* Glow behind flight path */}
        <div className="absolute w-24 h-48 bg-gradient-to-t from-brand-indigo/20 to-transparent blur-xl pointer-events-none"></div>

        {/* The Rocket and its fire trail */}
        <motion.div
          initial={{ y: 80, scale: 0.8, opacity: 0 }}
          animate={{
            y: [-40, -100, -200], // Fly upwards and out
            scale: [1, 1.05, 1.15],
            opacity: [0, 1, 1, 0] // Fade-out near top
          }}
          transition={{
            duration: 3.2,
            times: [0, 0.4, 0.8, 1],
            ease: "easeInOut"
          }}
          className="relative flex flex-col items-center"
        >
          {/* Flame particles */}
          <div className="absolute top-16 flex justify-center w-full">
            {exhaustParticles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                animate={{
                  opacity: 0,
                  scale: 0.1,
                  y: p.speed,
                  x: Math.sin(p.angle) * p.speed * 0.3
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: p.delay,
                  ease: "easeOut"
                }}
                className="absolute rounded-full bg-gradient-to-t from-red-500 via-orange-400 to-yellow-300 blur-[1px]"
                style={{ width: p.size, height: p.size }}
              />
            ))}
          </div>

          {/* SVG Rocket */}
          <svg
            className="w-16 h-16 drop-shadow-[0_0_20px_rgba(99,102,241,0.8)] text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Custom high-tech rocket SVG */}
            <path d="M4.5 16.5c-1.5 1.25-2.5 3.5-2.5 3.5s2.25-1 3.5-2.5M19.5 16.5c1.5 1.25 2.5 3.5 2.5 3.5s-2.25-1-3.5-2.5" />
            <path d="M12 2C7.5 2 4.5 6 4.5 12.5C4.5 15.5 6 18 6 18h12s1.5-2.5 1.5-5.5C19.5 6 16.5 2 12 2Z" fill="url(#rocketGrad)" />
            <circle cx="12" cy="10" r="2" fill="#090d16" />
            <path d="M9 18v3h6v-3" />
            
            <defs>
              <linearGradient id="rocketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </svg>

          {/* Thruster core glow */}
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 0.15 }}
            className="w-4 h-4 bg-yellow-400 rounded-full blur-[2px] mt-[-6px]"
          />
        </motion.div>

        {/* Launch sparkles/star particles floating down */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * 400 - 200,
                y: -50,
                opacity: 0,
                scale: 0.5
              }}
              animate={{
                y: 250,
                opacity: [0, 0.6, 0.6, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5 + Math.random() * 1.5,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
              className="absolute w-1.5 h-1.5 bg-brand-violet/50 rounded-full blur-[1px]"
            />
          ))}
        </div>
      </div>

      {/* Checklist status step indicators */}
      <div className="w-full flex flex-col gap-4">
        {STEPS.map((step) => {
          const isActive = currentStep === step.id;
          const isCompleted = completedSteps.includes(step.id);

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0.2, x: -10 }}
              animate={{
                opacity: isActive ? 1 : isCompleted ? 0.65 : 0.25,
                x: isActive ? 0 : 0,
                scale: isActive ? 1.02 : 1
              }}
              className={`flex items-center gap-4 px-5 py-4 rounded-xl glass-panel transition-all duration-300 ${
                isActive
                  ? "border-brand-indigo/40 bg-brand-indigo/5 shadow-[0_0_15px_rgba(99,102,241,0.1)]"
                  : "border-transparent"
              }`}
            >
              {/* Left icon indicators */}
              <div className="relative flex items-center justify-center w-6 h-6">
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
                      <Loader2 className="w-5 h-5 text-brand-indigo animate-spin" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="pending"
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      className="w-4 h-4 rounded-full border border-slate-700 bg-slate-900"
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Step Text */}
              <span
                className={`text-sm md:text-base font-medium transition-all duration-300 ${
                  isActive ? "text-white" : isCompleted ? "text-slate-300" : "text-slate-600"
                }`}
              >
                {step.text}
              </span>

              {/* Pulsing indicator when active */}
              {isActive && (
                <span className="ml-auto flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-indigo opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-indigo"></span>
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Dynamic spinner for Render API wakeups */}
      <AnimatePresence>
        {completedSteps.length === STEPS.length && apiLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full mt-6 flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl bg-brand-indigo/10 border border-brand-indigo/20 text-brand-indigo text-xs md:text-sm font-semibold shadow-inner"
          >
            <Loader2 className="w-4 h-4 animate-spin text-brand-indigo" />
            <span>AI Gateway is spinning up... this may take up to 30 seconds.</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
