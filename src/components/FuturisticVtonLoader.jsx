"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";

/**
 * OrganicAtelierLoader - Minimalist, Consumer-Friendly Virtual Fitting Experience
 * 
 * Design:
 * - Clean, non-technical, human-friendly fashion messaging (0 technical API/backend jargon)
 * - Dynamic rotating stages: Preparing -> Fitting -> Styling -> Ready
 * - Organic breathing studio model background with warm champagne starlight bokeh (60 FPS Canvas)
 * - Zero artificial boxes, zero cardboard polygons, zero wireframes
 */
export default function FuturisticVtonLoader({
  elapsed = 0,
  modelImage = "/models/ai_model_men.jpg",
  gender = "men",
  garmentTitle = "Tailored Look",
}) {
  const canvasRef = useRef(null);

  // Friendly, simple consumer messages that rotate naturally as time progresses
  const stages = [
    {
      title: "Preparing Your Look",
      desc: "Setting up your selected outfit for the perfect fit...",
      badge: "Step 1 of 4",
    },
    {
      title: "Fitting to Your Frame",
      desc: "Adjusting shoulders, sleeves, and natural drape...",
      badge: "Step 2 of 4",
    },
    {
      title: "Perfecting the Styling",
      desc: "Polishing natural fabric folds, lighting, and colors...",
      badge: "Step 3 of 4",
    },
    {
      title: "Almost Ready!",
      desc: "Putting the final touches on your tailored look...",
      badge: "Final Step",
    },
  ];

  const currentStageIndex =
    elapsed < 7 ? 0 : elapsed < 16 ? 1 : elapsed < 26 ? 2 : 3;
  const currentStage = stages[currentStageIndex];

  // Dynamic Progress Calculation (smooth easing curve up to 98%)
  const progress = Math.min(
    98,
    elapsed < 6
      ? (elapsed / 6) * 25
      : elapsed < 16
      ? 25 + ((elapsed - 6) / 10) * 35
      : elapsed < 26
      ? 60 + ((elapsed - 16) / 10) * 28
      : 88 + Math.min(10, (elapsed - 26) * 0.8)
  );

  // 60 FPS Floating Champagne Dust Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 360);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 520);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    // Warm, out-of-focus soft champagne bokeh particles
    const bokeh = [];
    const count = 35;
    for (let i = 0; i < count; i++) {
      bokeh.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2.8 + 1,
        vy: -(Math.random() * 0.45 + 0.15),
        vx: (Math.random() - 0.5) * 0.25,
        alpha: Math.random() * 0.6 + 0.2,
        pulseSpeed: Math.random() * 0.04 + 0.015,
        phase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.4 ? "251, 191, 36" : "253, 230, 138",
      });
    }

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // Render drifting bokeh
      for (let i = 0; i < bokeh.length; i++) {
        const b = bokeh[i];
        b.y += b.vy;
        b.x += b.vx;
        b.phase += b.pulseSpeed;

        if (b.y < -10) {
          b.y = height + 10;
          b.x = Math.random() * width;
        }

        const dynamicAlpha = b.alpha * (0.6 + 0.4 * Math.sin(b.phase));
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${b.color}, ${dynamicAlpha})`;
        ctx.shadowColor = `rgba(${b.color}, 0.8)`;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-30 overflow-hidden flex flex-col justify-between p-5 pointer-events-none select-none bg-slate-950/85 backdrop-blur-md">
      {/* 1. CINEMATIC BACKGROUND: Model Photo with Slow Breathing Scale & Warm Atmosphere */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Image
          src={modelImage}
          alt="Studio Model Avatar"
          fill
          unoptimized
          priority
          className="object-cover object-top filter brightness-[0.6] contrast-[1.15] scale-[1.02] animate-[subtleBreathe_8s_ease-in-out_infinite]"
        />

        {/* Soft Organic Vignette & Studio Light Halos */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/70"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(245,158,11,0.12),transparent_70%)]"></div>

        {/* Organic Light Bloom in the Center (Breathes like living silk) */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-tr from-amber-400/20 via-rose-500/15 to-transparent rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* 60 FPS Floating Champagne Bokeh Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10" />

      {/* TOP HEADER: Clean Minimalist Brand Pill */}
      <div className="relative z-20 w-full flex items-center justify-between pt-1 px-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-white/10 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
          <span className="text-[10px] tracking-[0.2em] uppercase font-serif font-semibold text-amber-200">
            BENEFISTO STUDIO
          </span>
        </div>
        <span className="text-[10px] font-mono tracking-wider px-2.5 py-1 rounded-full bg-black/60 border border-white/10 text-amber-300 font-bold backdrop-blur-md">
          {elapsed}s · {Math.round(progress)}%
        </span>
      </div>

      {/* 2. CENTER: ORGANIC SILK PULSE & ELEGANT CENTRAL RING */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center my-auto w-full max-w-[280px] mx-auto text-center">
        {/* Soft Organic Aura Ring */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          {/* Subtle Outer Halo Rings */}
          <div className="absolute inset-0 rounded-full border border-amber-300/30 animate-[spin_24s_linear_infinite]"></div>
          <div className="absolute -inset-3 rounded-full border border-dashed border-white/20 animate-[spin_32s_linear_infinite_reverse]"></div>
          <div className="absolute -inset-6 rounded-full bg-gradient-to-tr from-amber-400/15 via-rose-400/10 to-transparent blur-xl animate-pulse"></div>

          {/* Central Atelier Glass Orb */}
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-b from-white/15 to-white/5 backdrop-blur-xl border border-white/25 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex items-center justify-center">
            <span className="text-2xl animate-pulse">✨</span>
          </div>
        </div>

        {/* Dynamic Friendly Consumer Narrative */}
        <div className="mt-6 space-y-1.5 max-w-[260px]">
          <span className="inline-block text-[9px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 font-bold">
            {currentStage.badge}
          </span>
          <h3 className="text-xs font-serif tracking-wide text-white font-semibold drop-shadow-sm">
            {currentStage.title}
          </h3>
          <p className="text-[11px] text-slate-300 font-light leading-snug">
            {currentStage.desc}
          </p>
        </div>
      </div>

      {/* 3. BOTTOM: ULTRA-CLEAN SILK PROGRESS BAR & 4 STAGE BULLETS */}
      <div className="relative z-20 w-full max-w-[300px] mx-auto pb-1 space-y-2">
        {/* Sleek Golden Silk Progress Bar */}
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-amber-300 to-rose-300 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(245,158,11,0.6)]"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Micro Consumer Stage Labels */}
        <div className="flex items-center justify-between text-[8px] tracking-widest font-mono text-slate-400 px-0.5">
          <span className={elapsed >= 0 ? "text-amber-200 font-semibold" : ""}>PREPARING</span>
          <span className={elapsed >= 7 ? "text-amber-200 font-semibold" : ""}>FITTING</span>
          <span className={elapsed >= 16 ? "text-amber-200 font-semibold" : ""}>STYLING</span>
          <span className={elapsed >= 26 ? "text-amber-200 font-semibold" : ""}>READY</span>
        </div>
      </div>

      {/* Keyframe for subtle model photo breathe */}
      <style jsx>{`
        @keyframes subtleBreathe {
          0%, 100% {
            transform: scale(1.02);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
}
