"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import rabbitMascots from "@/data/rabbitMascots.json";

/**
 * 3D Pixar Rabbit Character Mascot ("Zippy")
 * Features:
 * - Real 3D 360-degree interactive Turntable Video (Drag to Rotate 360° with mouse/touch)
 * - Category-specific avatars & dynamic dialogue speech bubbles
 * - Animated walking entrance & gentle bobble
 * - Clickable interaction: waves and greets the user
 */
export default function ZippyInteractiveMascot({
  category = "ecommerce", // "ecommerce" | "health" | "coupons" | "today_deals" | "smart_terminal"
  onInteract = null
}) {
  const [isWaving, setIsWaving] = useState(false);
  const [animationKey, setAnimationKey] = useState(category);
  const [isUserDragging, setIsUserDragging] = useState(false);
  
  const videoRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startTimeRef = useRef(0);

  // 360 Drag-to-Rotate Mouse & Touch Listeners
  useEffect(() => {
    const handleMove = (clientX) => {
      if (!isDraggingRef.current || !videoRef.current) return;
      const deltaX = clientX - startXRef.current;
      const duration = videoRef.current.duration || 4.0;
      // 300px drag = 1 full 360° rotation
      const timeOffset = (deltaX / 280) * duration;
      let newTime = (startTimeRef.current + timeOffset) % duration;
      if (newTime < 0) newTime += duration;
      videoRef.current.currentTime = newTime;
    };

    const onMouseMove = (e) => handleMove(e.clientX);
    const onTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        handleMove(e.touches[0].clientX);
      }
    };

    const onEnd = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        setIsUserDragging(false);
        // Resume gentle auto-rotate after 1.5 seconds of releasing
        setTimeout(() => {
          if (!isDraggingRef.current && videoRef.current) {
            videoRef.current.play().catch(() => {});
          }
        }, 1500);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onEnd);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, []);

  const handleDragStart = (clientX) => {
    if (!videoRef.current) return;
    isDraggingRef.current = true;
    setIsUserDragging(true);
    startXRef.current = clientX;
    startTimeRef.current = videoRef.current.currentTime;
    videoRef.current.pause();
  };

  // Map Category to the exact 3D Rabbit Avatar & Costume
  const currentAvatar = React.useMemo(() => {
    switch (category) {
      case "health":
        return {
          img: rabbitMascots.health, // 3D Rabbit with White Doctor Coat & Stethoscope
          role: "Dr. Zippy (Pharmacy & Health)",
          badgeBg: "bg-teal-50 border-teal-200 text-teal-800",
          glow: "bg-teal-500/20",
          speech: "नमस्ते! 🩺 डॉक्टर कोट ऑन है। दवाओं के साल्ट और जेनेरिक बचत में मैं मदद करूँगा!"
        };
      case "coupons":
        return {
          img: rabbitMascots.fashion, // 3D Rabbit Stylist with Measuring tape & scissors
          role: "Deal Magician Zippy",
          badgeBg: "bg-purple-50 border-purple-200 text-purple-800",
          glow: "bg-purple-500/20",
          speech: "कूपन मैजिक ऑन! 🎟️ 1-क्लिक में सीक्रेट प्रोमो कोड अनलॉक करते हैं!"
        };
      case "today_deals":
        return {
          img: rabbitMascots.gym, // 3D Rabbit in Athletic Gym Suit & Dumbbell
          role: "Speed Hunter Zippy",
          badgeBg: "bg-rose-50 border-rose-200 text-rose-800",
          glow: "bg-rose-500/20",
          speech: "लाइव डील्स रडार एक्टिव! 🔥 60% तक के सबसे बड़े प्राइस ड्रॉप्स यहाँ हैं!"
        };
      case "smart_terminal":
        return {
          img: rabbitMascots.ecommerce, // 3D Rabbit with Mini Shopping Cart
          role: "Smart Terminal Advisor",
          badgeBg: "bg-emerald-50 border-emerald-200 text-emerald-800",
          glow: "bg-emerald-500/20",
          speech: "Smart Terminal Ready! ⚡ किसी भी Amazon या Flipkart लिंक का प्राइस ऑडिट करें!"
        };
      case "ecommerce":
      default:
        return {
          img: rabbitMascots.ecommerce, // 3D Rabbit with Mini Shopping Cart
          role: "Shopper Zippy",
          badgeBg: "bg-orange-50 border-orange-200 text-orange-800",
          glow: "bg-orange-500/20",
          speech: "चलो शॉपिंग पर चलते हैं! 🛒 मैं कार्ट खींचते हुए आपके लिए बेस्ट डील्स निकालता हूँ!"
        };
    }
  }, [category]);

  // Whenever category changes, re-trigger the walking entrance animation!
  useEffect(() => {
    setAnimationKey(category + "_" + Date.now());
    setIsWaving(true);
    const timer = setTimeout(() => setIsWaving(false), 3000);
    return () => clearTimeout(timer);
  }, [category]);

  return (
    <div 
      className="relative flex flex-col items-center select-none cursor-pointer group my-2"
      onClick={() => {
        setIsWaving(true);
        if (onInteract) onInteract();
      }}
    >
      {/* 1. FLOATING DIALOGUE SPEECH BUBBLE */}
      <AnimatePresence mode="wait">
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 15, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.35, type: "spring", stiffness: 350, damping: 25 }}
          className="relative mb-3 max-w-[300px] sm:max-w-md px-4 py-2 rounded-2xl bg-white/95 border border-slate-200 shadow-lg shadow-slate-200/50 backdrop-blur-md text-slate-800 text-xs sm:text-sm font-medium leading-snug text-center z-20"
        >
          {currentAvatar.speech}
          {/* Speech bubble pointer triangle */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-slate-200 rotate-45"></div>
        </motion.div>
      </AnimatePresence>

      {/* 2. THE 3D PIXAR RABBIT MASCOT WITH ANIMATED WALKING ENTRANCE */}
      <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center overflow-visible">
        
        {/* Soft Ambient Glow Behind Rabbit */}
        <div 
          className={`absolute inset-0 m-auto w-48 h-48 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${currentAvatar.glow}`}
        />

        {/* WALKING IN ANIMATION CONTAINER: 
            Enters by walking in from side (translateX) with a lively bouncing/stepping motion */}
        <AnimatePresence mode="wait">
          <motion.div
            key={animationKey}
            initial={{ x: -160, opacity: 0, scale: 0.85 }}
            animate={{ 
              x: 0, 
              opacity: 1, 
              scale: 1,
              transition: {
                x: { duration: 0.75, type: "spring", stiffness: 120, damping: 14 },
                opacity: { duration: 0.3 }
              }
            }}
            exit={{ x: 120, opacity: 0, scale: 0.85, transition: { duration: 0.25 } }}
            className="relative z-10 w-full h-full flex flex-col items-center justify-center"
          >
            {/* CONTINUOUS NATURAL GENTLE BOBBLE & BREATHING */}
            <motion.div
              animate={{
                y: [0, -7, 0],
                rotate: isWaving ? [-2, 2, -2] : [0, 0.5, 0]
              }}
              transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }}
              className="relative w-full h-full flex items-center justify-center"
            >
              {/* 3D INTERACTIVE MASCOT: 360 Interactive Turntable Video for General Shopping */}
              {category === "ecommerce" ? (
                <div 
                  className={`relative w-full h-full flex flex-col items-center justify-center select-none ${
                    isUserDragging ? "cursor-grabbing" : "cursor-grab"
                  }`}
                  onMouseDown={(e) => handleDragStart(e.clientX)}
                  onTouchStart={(e) => {
                    if (e.touches && e.touches[0]) handleDragStart(e.touches[0].clientX);
                  }}
                  title="360° घुमाने के लिए ड्रैग करें (Drag to Rotate 360°)"
                >
                  <video
                    ref={videoRef}
                    src="/zippy_3d_turntable_clean.mp4"
                    loop
                    muted
                    playsInline
                    autoPlay
                    className="w-full h-full object-contain rounded-2xl drop-shadow-[0_16px_32px_rgba(0,0,0,0.22)] select-none pointer-events-none"
                  />
                  
                  {/* Interactive Drag Hint Pill */}
                  <div className="absolute -bottom-2 px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-[10px] text-white font-medium flex items-center gap-1.5 shadow-md border border-white/10 pointer-events-none">
                    <span className="text-orange-400 font-bold">🔄</span> 
                    <span>Drag to Rotate 360°</span>
                  </div>
                </div>
              ) : (
                <img 
                  src={currentAvatar.img} 
                  alt="Zippy 3D Cartoon Rabbit Mascot" 
                  className="w-full h-full object-contain rounded-2xl drop-shadow-[0_12px_24px_rgba(0,0,0,0.18)] transition-all duration-300"
                />
              )}
            </motion.div>

            {/* SOFT GROUND SHADOW (Follows character's walk) */}
            <motion.div
              animate={{
                scaleX: [0.85, 1, 0.85],
                opacity: [0.35, 0.5, 0.35]
              }}
              transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }}
              className="absolute -bottom-1 w-36 h-4 rounded-full bg-slate-900/20 blur-xs -z-10"
            />
          </motion.div>
        </AnimatePresence>

      </div>

      {/* 3. ACTIVE ROLE BADGE (CLICKABLE WITH BOUNCE) */}
      <motion.div 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`mt-2 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border text-xs font-bold shadow-2xs transition-all ${currentAvatar.badgeBg}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
        <span>{currentAvatar.role}</span>
        <span className="text-[10px] opacity-60 ml-0.5">• Tap to wave 👋</span>
      </motion.div>
    </div>
  );
}
