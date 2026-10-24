"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, 
  Sparkles, 
  X, 
  Send, 
  ArrowRight, 
  ExternalLink, 
  Tv, 
  RefreshCw, 
  Mic, 
  MicOff, 
  CheckCircle2, 
  Zap,
  ArrowUpRight,
  BookOpen
} from "lucide-react";

const STARTER_PROMPTS = [
  {
    icon: "🎬",
    label: "Mirzapur",
    query: "Mirzapur kaha dekhu aur sabse saste me kaise dekh sakta hu?"
  },
  {
    icon: "🍿",
    label: "K-Drama Hits",
    query: "Top Korean Dramas dekhne hain, konsa platform best hai?"
  },
  {
    icon: "💼",
    label: "Business Series",
    query: "Business aur startup related best Hindi web series konsi hai?"
  },
  {
    icon: "💥",
    label: "Stranger Things",
    query: "Stranger Things kis platform par aati hai?"
  },
  {
    icon: "🏏",
    label: "Cricket on TV",
    query: "Live cricket aur IPL TV par dekhne ke liye best pack konsa hai?"
  }
];

export default function SubscriptionAiChatModal({
  isOpen,
  onClose,
  onSelectPlatform,
  country = "IN"
}) {
  const [messages, setMessages] = useState([
    {
      id: "welcome-1",
      role: "assistant",
      summary: "Namaste! 👋 Main aapka AI Subscriptions & OTT Advisor hoon. Mujhse kisi bhi show, movie, ya genre ke baare me puchiye. Main aapko batayunga ki wo kis platform par hai aur aapke liye complete 4-Level Savings Blueprint on-demand generate karunga!",
      whereToWatch: null,
      isBlueprintUnlocked: false,
      savingSteps: [],
      clarifyingNote: "Mirzapur, Stranger Things, K-Dramas, ya Business shows me se kya dekhna chahenge?",
      platforms: [],
      seoSlug: null,
      followUps: [
        "👉 Mirzapur kaha dekhu aur sasta kaise padega?",
        "👉 Top K-Dramas ke liye konsa platform lu?",
        "👉 Business & Startup series suggest karo",
        "👉 Cricket & Sports ke liye TV pack batao"
      ]
    }
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const chatScrollRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll inside chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Auto-focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend = null) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    // Clean leading emoji arrow if user tapped a chip
    const cleanDisplayText = text.replace(/^[👉⚡💬\s]+/, "").trim();

    const userMsg = {
      id: `user-${Date.now()}`,
      role: "user",
      text: cleanDisplayText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputValue("");
    setIsLoading(true);

    try {
      const historyPayload = newHistory.map((m) => ({
        role: m.role,
        content: m.role === "user" ? m.text : (m.summary || m.text || "")
      }));

      const res = await fetch("/api/subscriptions/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: cleanDisplayText,
          history: historyPayload,
          country
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      const assistantMsg = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        summary: data.summary || "Aapke entertainment ke liye best verified plans:",
        whereToWatch: data.whereToWatch || null,
        isBlueprintUnlocked: !!data.isBlueprintUnlocked,
        savingSteps: Array.isArray(data.savingSteps) ? data.savingSteps : [],
        clarifyingNote: data.clarifyingNote || null,
        platforms: data.recommendedPlatforms || [],
        seoSlug: data.seoSlug || null,
        followUps: data.followUps || [],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error("[SubscriptionAiChatModal] Send error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-err-${Date.now()}`,
          role: "assistant",
          summary: "Mujhe connect karne me thodi samasya aayi. Kripya dobara puchiye!",
          whereToWatch: null,
          isBlueprintUnlocked: false,
          savingSteps: [],
          clarifyingNote: null,
          platforms: [],
          seoSlug: null,
          followUps: [
            "👉 Mirzapur kaha dekhu aur sasta kaise?",
            "👉 Stranger Things kis platform par hai?",
            "👉 Cricket ke liye best pack"
          ],
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoiceInput = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please type your message.");
      return;
    }

    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "hi-IN";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0]?.[0]?.transcript;
        if (transcript) {
          setInputValue(transcript);
          handleSendMessage(transcript);
        }
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
          />

          {/* Chat Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            className="relative w-full max-w-2xl h-[92vh] max-h-[780px] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col z-10"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-indigo-900/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
                  <Sparkles className="w-5 h-5 fill-slate-950" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                      ShopSmart AI OTT Concierge
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live AI Advisor
                    </span>
                  </div>
                  <p className="text-[11px] text-indigo-200/80 font-medium">
                    On-Demand Savings Blueprints • 25 Platforms • Telecom ₹0 Perks
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Starter Suggestion Pills */}
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200/70 overflow-x-auto no-scrollbar shrink-0 flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
                Quick Start:
              </span>
              {STARTER_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(prompt.query)}
                  className="px-3 py-1 rounded-xl bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-950 text-xs font-semibold whitespace-nowrap transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer shrink-0 active:scale-95"
                >
                  <span>{prompt.icon}</span>
                  <span>{prompt.label}</span>
                </button>
              ))}
            </div>

            {/* Chat Messages Body */}
            <div
              ref={chatScrollRef}
              className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-gradient-to-b from-slate-50/60 to-white"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  {/* USER MESSAGE BUBBLE */}
                  {msg.role === "user" ? (
                    <div className="max-w-[85%] sm:max-w-[78%] rounded-2xl p-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-br-2xs shadow-md font-semibold text-xs sm:text-sm leading-relaxed">
                      {msg.text}
                    </div>
                  ) : (
                    /* ASSISTANT STRUCTURED CARD CONTAINER */
                    <div className="max-w-[95%] sm:max-w-[90%] w-full rounded-3xl p-4 sm:p-5 bg-white rounded-bl-2xs border border-slate-200/90 shadow-md space-y-3.5">
                      {/* Assistant Header */}
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-2 text-indigo-600 font-extrabold text-xs">
                          <div className="w-5 h-5 rounded-lg bg-indigo-50 border border-indigo-200/60 flex items-center justify-center text-indigo-600">
                            <Bot className="w-3.5 h-3.5" />
                          </div>
                          <span>ShopSmart Streaming Concierge</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">
                          {msg.timestamp || "Just now"}
                        </span>
                      </div>

                      {/* Where to Watch Header Callout */}
                      {msg.whereToWatch && (
                        <div className="p-3 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Tv className="w-4 h-4 text-indigo-600 shrink-0" />
                            <span className="text-xs font-black text-slate-900">
                              Streams on: <span className="text-indigo-700 underline underline-offset-2">{msg.whereToWatch.platform}</span>
                            </span>
                          </div>
                          {msg.whereToWatch.cheapestRoute && (
                            <span className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white shadow-2xs">
                              {msg.whereToWatch.cheapestRoute}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Summary Text (High-contrast, 100% visible) */}
                      <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed whitespace-pre-line">
                        {msg.summary || msg.text}
                      </p>

                      {/* 4-Level Savings Blueprint Structured Step Cards (Rendered when Unlocked) */}
                      {msg.savingSteps && msg.savingSteps.length > 0 && (
                        <div className="space-y-2 pt-1">
                          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400">
                            <span className="flex items-center gap-1.5">
                              <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                              Personalized 4-Level Savings Blueprint:
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                              On-Demand Generated
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-2">
                            {msg.savingSteps.map((step, sIdx) => (
                              <div
                                key={sIdx}
                                className="p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50/40 border border-slate-200/80 transition-all flex items-start gap-3"
                              >
                                <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/90 flex items-center justify-center text-sm shadow-2xs shrink-0">
                                  {step.icon || "💰"}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-200">
                                      {step.level}
                                    </span>
                                    <h5 className="font-extrabold text-xs text-slate-900 truncate">
                                      {step.title}
                                    </h5>
                                  </div>
                                  <p className="text-[11px] font-medium text-slate-600 leading-normal">
                                    {step.detail}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Clarifying Pro Tip Note */}
                      {msg.clarifyingNote && (
                        <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-[11px] font-medium text-amber-950 flex items-start gap-2">
                          <span className="text-amber-600 font-extrabold shrink-0 text-xs">💡 Note:</span>
                          <span className="leading-snug">{msg.clarifyingNote}</span>
                        </div>
                      )}

                      {/* Dedicated SEO Deep-Dive Page Link (Connects to /subscriptions/[slug]) */}
                      {msg.seoSlug && (
                        <div className="pt-1">
                          <Link
                            href={msg.seoSlug}
                            onClick={onClose}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-[11px] font-black border border-indigo-200 transition-all group"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-indigo-600 group-hover:scale-110 transition-transform" />
                            <span>Read Full Dedicated Strategy & Operator Guide</span>
                            <ArrowUpRight className="w-3 h-3 text-indigo-500" />
                          </Link>
                        </div>
                      )}

                      {/* Interactive Recommended Platform Cards */}
                      {msg.platforms && msg.platforms.length > 0 && (
                        <div className="pt-2 border-t border-slate-100 space-y-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                            ⚡ Instant Actions:
                          </span>
                          {msg.platforms.map((sub) => (
                            <div
                              key={sub.id}
                              className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-indigo-300 transition-all"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div
                                  className={`w-9 h-9 rounded-xl bg-gradient-to-br ${
                                    sub.accentColor || "from-slate-700 to-slate-900"
                                  } text-white flex items-center justify-center font-black text-[10px] shadow-sm shrink-0`}
                                >
                                  {sub.logoText || sub.name.slice(0, 3).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <h4 className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5 truncate">
                                    {sub.name}
                                    {sub.badge && (
                                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-800 shrink-0">
                                        {sub.badge}
                                      </span>
                                    )}
                                  </h4>
                                  <p className="text-[11px] font-bold text-emerald-700">
                                    {sub.bestPlan || sub.startingPrice}
                                  </p>
                                  <p className="text-[10px] text-slate-500 font-medium truncate">
                                    💡 {sub.savingsTip}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                                {onSelectPlatform && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      onSelectPlatform(sub.id);
                                      onClose();
                                    }}
                                    className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                                  >
                                    <span>View on Page</span>
                                    <ArrowRight className="w-3 h-3" />
                                  </button>
                                )}
                                {sub.seoSlug ? (
                                  <Link
                                    href={sub.seoSlug}
                                    onClick={onClose}
                                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-slate-900 to-indigo-950 hover:from-slate-800 hover:to-indigo-900 text-white text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                                  >
                                    <Sparkles className="w-3 h-3 text-amber-400 fill-amber-400" />
                                    <span>Reveal Deals</span>
                                    <ArrowRight className="w-3 h-3 text-indigo-300" />
                                  </Link>
                                ) : (
                                  <a
                                    href={sub.officialUrl}
                                    target="_blank"
                                    rel="noopener noreferrer nofollow"
                                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                                  >
                                    <span>Official</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Dynamic Follow-Up User Action Chips */}
                  {msg.role === "assistant" && msg.followUps && msg.followUps.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[95%] sm:max-w-[90%]">
                      {msg.followUps.map((fu, fuIdx) => (
                        <button
                          key={fuIdx}
                          type="button"
                          onClick={() => handleSendMessage(fu)}
                          className="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-50 text-indigo-900 hover:text-indigo-950 text-[11px] font-bold border border-slate-200 hover:border-indigo-300 shadow-2xs transition-all cursor-pointer text-left active:scale-95 flex items-center gap-1"
                        >
                          <span>{fu}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing / Thinking Loader */}
              {isLoading && (
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-sm shrink-0">
                    <Sparkles className="w-4 h-4 fill-slate-950 animate-pulse" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-2 text-xs font-bold text-slate-600">
                    <RefreshCw className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                    <span>Analyzing platforms & generating savings dossier...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Input Area */}
            <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask anything... e.g. 'Mirzapur', 'Best K-Drama', or 'Business series'"
                    className="w-full px-4 py-3 pr-10 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={toggleVoiceInput}
                    title={isListening ? "Listening..." : "Click to speak"}
                    className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-xl transition-all cursor-pointer ${
                      isListening
                        ? "bg-rose-500 text-white animate-pulse"
                        : "text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
                    }`}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="px-4 sm:px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed shrink-0"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-medium px-1">
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                  On-Demand AI Savings Concierge • Verified 2026 Pricing
                </span>
                <span className="hidden sm:inline">Press Enter to send</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
