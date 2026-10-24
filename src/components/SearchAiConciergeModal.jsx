"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  X, 
  Send, 
  ArrowRight, 
  ArrowUp, 
  CheckCircle, 
  Bot, 
  User, 
  RefreshCw, 
  Zap, 
  Search,
  MessageSquare,
  Plus,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { searchProducts } from "@/services/api";
import { userJourneyTracker } from "@/services/userJourneyTracker";

const STARTER_PROMPTS = [
  {
    icon: "🎬",
    title: "Mirzapur / Web Series: Where to Watch?",
    subtitle: "Streaming platform, ₹0 telecom perks & savings",
    query: "Mirzapur kaha dekhu aur sabse saste me kaise dekh sakta hu?"
  },
  {
    icon: "🍿",
    title: "Best OTT Subscription for Family / Sports",
    subtitle: "Hotstar vs Netflix vs Prime & Times Prime combos",
    query: "Entertainment ke liye konsa OTT subscription lena chahiye?"
  },
  {
    icon: "💻",
    title: "Coding Laptop under ₹50k",
    subtitle: "16GB RAM, battery reality & true daily cost",
    query: "I need a coding laptop under 50000 with 16GB RAM"
  },
  {
    icon: "🎧",
    title: "ANC Earbuds under ₹3,000",
    subtitle: "Real mic quality, ANC decibels & battery life",
    query: "Best noise cancelling earbuds under 3000"
  }
];

export default function SearchAiConciergeModal({
  isOpen,
  onClose,
  initialQuery = "",
  country = "IN",
  onConfirmSearch,
  onDirectSearch,
  onOpenPriceAlert,
  onOpenTrustSheet,
  onTryInStudio
}) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeSelections, setActiveSelections] = useState({});

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const prevIsOpenRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Execute 1 single call to our classic search backend
  const executeSearch = async (searchQuery, adviceNote = "") => {
    setIsLoading(true);

    try {
      const data = await searchProducts(searchQuery, country);
      const returnedProducts = Array.isArray(data) 
        ? data 
        : (Array.isArray(data?.results) ? data.results : (Array.isArray(data?.products) ? data.products : []));

      const assistantMsg = {
        id: Date.now() + 2,
        role: "assistant",
        type: "products",
        adviceNote: adviceNote || null,
        text: returnedProducts.length > 0 
          ? `I found ${returnedProducts.length} verified deals for "${searchQuery}". Here are the top vetted matches:`
          : `I searched live stores for "${searchQuery}" but couldn't find in-stock products right now. Would you like to adjust your budget or brand preference?`,
        products: returnedProducts,
        searchQuery,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error("[AiGuide] Search execution error:", err);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 2,
          role: "assistant",
          type: "error",
          text: "Search network connection timeout. Please try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Radio selection change in questionnaire
  const handleOptionChange = (msgId, questionId, optionText) => {
    setActiveSelections(prev => ({
      ...prev,
      [`${msgId}_${questionId}`]: optionText
    }));
  };

  // User submits the "Find my best [category]" questionnaire
  const handleSubmitQuestionnaire = async (msg) => {
    if (isLoading) return;
    setIsLoading(true);

    // Collect user selections
    const selections = {};
    (msg.questions || []).forEach((q, idx) => {
      const selected = activeSelections[`${msg.id}_${q.id}`] || q.options?.[q.defaultSelected ?? 0] || q.options?.[0];
      selections[q.id || `q${idx + 1}`] = selected;
    });

    try {
      const res = await fetch("/api/ai/studio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "finalize_query",
          message: msg.originalUserQuery || inputValue,
          selections,
          country
        })
      });

      const data = await res.json();
      if (data && data.success && data.searchQuery) {
        await executeSearch(data.searchQuery, data.adviceNote);
      } else {
        await executeSearch(msg.originalUserQuery || "laptop 16GB RAM");
      }
    } catch (err) {
      console.error("[AiGuide] Questionnaire submission error:", err);
      await executeSearch(msg.originalUserQuery || "laptop 16GB RAM");
    }
  };

  // Send message to Conversational Ask AI
  const handleSendMessage = async (customText = null) => {
    const textToSend = typeof customText === "string" ? customText : inputValue;
    const cleanText = textToSend.trim();
    if (!cleanText || isLoading) return;

    userJourneyTracker.recordSearch(cleanText);

    const userMsg = {
      id: Date.now(),
      role: "user",
      text: cleanText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputValue("");
    setIsLoading(true);

    // Check if there are products already displayed on screen
    const latestProducts = [...newMessages].reverse().find(m => m.type === "products" && Array.isArray(m.products) && m.products.length > 0)?.products || [];

    try {
      const historyPayload = newMessages.slice(-6).map(m => ({
        role: m.role,
        text: typeof m.text === "string" ? m.text : (m.reply || "")
      }));

      // Call API for ChatGPT-style questionnaire generation or follow-up chat
      const res = await fetch("/api/ai/studio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat",
          message: cleanText,
          history: historyPayload,
          country,
          displayedProducts: latestProducts
        })
      });

      const data = await res.json();

      if (data && data.success) {
        if (data.type === "questionnaire") {
          // Setup default radio selections
          const newDefaults = {};
          (data.questions || []).forEach((q, idx) => {
            const defIdx = q.defaultSelected !== undefined ? q.defaultSelected : 0;
            newDefaults[`${data.id || (Date.now() + 1)}_${q.id}`] = q.options[defIdx];
          });
          setActiveSelections(prev => ({ ...prev, ...newDefaults }));

          const assistantMsg = {
            id: Date.now() + 1,
            role: "assistant",
            type: "questionnaire",
            originalUserQuery: cleanText,
            introText: data.introText || "",
            title: data.title || "Let me narrow it down for you",
            buttonText: data.buttonText || "Find my best options",
            questions: Array.isArray(data.questions) ? data.questions : [],
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          };
          setMessages(prev => [...prev, assistantMsg]);
          setIsLoading(false);
        } else if (data.type === "chat_reply") {
          const assistantMsg = {
            id: Date.now() + 1,
            role: "assistant",
            type: "chat_reply",
            text: data.reply || "",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          };
          setMessages(prev => [...prev, assistantMsg]);
          setIsLoading(false);
        } else if (data.type === "execute_search") {
          await executeSearch(data.searchQuery, data.adviceNote);
        }
      } else {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            type: "error",
            text: data?.message || "I encountered a minor issue. Please try again.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          }
        ]);
        setIsLoading(false);
      }
    } catch (err) {
      console.error("[AiGuide] Send error:", err);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          type: "error",
          text: "Network connection timeout. Please check your connection and retry.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
      setIsLoading(false);
    }
  };

  // When modal opens: initialize with initialQuery if provided
  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      // Just opened
      if (initialQuery && initialQuery.trim()) {
        setMessages([]);
        setActiveSelections({});
        handleSendMessage(initialQuery.trim());
      } else if (messages.length === 0) {
        setMessages([]);
      }
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, initialQuery]);

  const handleReset = () => {
    setMessages([]);
    setInputValue("");
    setActiveSelections({});
    if (inputRef.current) inputRef.current.focus();
  };

  const handleBypassDirectSearch = (customQuery = null) => {
    const q = (typeof customQuery === "string" ? customQuery : (initialQuery || inputValue || "trending deals")).trim();
    if (onDirectSearch) onDirectSearch(q);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 30 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full sm:max-w-3xl bg-[#fcfcfd] border border-slate-200/90 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[94vh] sm:h-auto sm:max-h-[90vh] text-slate-900"
        >
          {/* Mobile Pull Handle */}
          <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mt-2.5 mb-1 sm:hidden" />

          {/* Clean Light Header */}
          <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200/80 bg-white/95 backdrop-blur-md flex items-center justify-between shrink-0 shadow-2xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-brand-indigo to-brand-violet flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-500/20">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-slate-900 tracking-tight truncate">
                    ShopSmart <span className="text-brand-indigo">Ask AI</span>
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-brand-indigo border border-indigo-200/80 whitespace-nowrap shrink-0">
                    AI GUIDE
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">
                  Ask advice, narrow down specs with 2 quick questions & discover verified deals
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-slate-700 border border-slate-200/80 transition-all cursor-pointer"
                  title="Start a fresh consultation"
                >
                  <Plus className="w-3 h-3 text-slate-500" />
                  <span>New Chat</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Close Ask AI"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body (Clean Light Canvas) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-300 bg-[#fcfcfd]">
            
            {/* Empty State / Welcome Screen */}
            {messages.length === 0 && (
              <div className="py-6 sm:py-10 flex flex-col items-center justify-center text-center max-w-xl mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-brand-indigo mb-3.5 shadow-sm">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mb-1.5">
                  What are you looking to buy today?
                </h2>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                  Tell me what you need, your budget, or choose a popular topic below. I will guide you to the best verified deals.
                </p>

                {/* Starter Suggestion Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full text-left">
                  {STARTER_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(prompt.query)}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-brand-indigo hover:shadow-md transition-all text-left group cursor-pointer"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="text-xl">{prompt.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 group-hover:text-brand-indigo transition-colors">
                            {prompt.title}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{prompt.subtitle}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Render Messages */}
            {messages.map((msg) => (
              <div key={msg.id} className="w-full">
                {/* USER MESSAGE */}
                {msg.role === "user" && (
                  <div className="flex items-start justify-end gap-2.5 w-full">
                    <div className="bg-slate-900 text-white rounded-2xl rounded-tr-xs px-4 py-2.5 max-w-[85%] text-xs sm:text-sm shadow-sm leading-relaxed">
                      {msg.text}
                    </div>
                    <div className="w-7 h-7 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  </div>
                )}

                {/* ASSISTANT MESSAGE */}
                {msg.role === "assistant" && (
                  <div className="flex items-start gap-2.5 w-full">
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-brand-indigo to-brand-violet flex items-center justify-center text-white shrink-0 mt-0.5 shadow-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>

                    <div className="flex-1 space-y-3.5 max-w-full">
                      {/* Regular Text or Follow-up Chat Reply */}
                      {(msg.text && msg.type !== "questionnaire" && msg.type !== "products") && (
                        <div className="bg-white border border-slate-200/90 rounded-2xl rounded-tl-xs px-4 py-3 text-xs sm:text-sm text-slate-800 shadow-2xs leading-relaxed whitespace-pre-wrap">
                          {msg.text}
                        </div>
                      )}

                      {/* CHAT REPLY (Follow-up advice bubble) */}
                      {msg.type === "chat_reply" && (
                        <div className="bg-white border border-indigo-200/80 rounded-2xl rounded-tl-xs px-4 py-3 text-xs sm:text-sm text-slate-800 shadow-2xs leading-relaxed whitespace-pre-wrap">
                          <div className="flex items-center gap-1.5 text-brand-indigo font-bold text-xs mb-1">
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>AI Advisor</span>
                          </div>
                          {msg.text}
                        </div>
                      )}

                      {/* 1. NATURAL INTRO ADVICE */}
                      {msg.introText && (
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                          {msg.introText}
                        </p>
                      )}

                      {/* 2. CHATGPT QUESTIONNAIRE CARD */}
                      {msg.type === "questionnaire" && (
                        <div className="w-full rounded-2xl bg-[#0f172a] text-white p-4 sm:p-5 shadow-xl border border-slate-800 space-y-4">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-amber-400" />
                              <h4 className="text-xs sm:text-sm font-bold tracking-tight text-white uppercase tracking-wider">
                                {msg.title || "Let me narrow it down for you"}
                              </h4>
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium">Quick 2-question filter</span>
                          </div>

                          {/* Question blocks */}
                          <div className="space-y-4">
                            {(msg.questions || []).map((q, qIdx) => {
                              const currentSelected = activeSelections[`${msg.id}_${q.id}`] || q.options?.[q.defaultSelected ?? 0] || q.options?.[0];

                              return (
                                <div key={q.id || qIdx} className="space-y-2">
                                  <p className="text-xs sm:text-sm font-bold text-slate-200">
                                    {qIdx + 1}. {q.text}
                                  </p>

                                  {/* Radio Options */}
                                  <div className="space-y-1.5 pl-1">
                                    {(q.options || []).map((opt, optIdx) => {
                                      const isChecked = currentSelected === opt;

                                      return (
                                        <label
                                          key={optIdx}
                                          onClick={() => handleOptionChange(msg.id, q.id, opt)}
                                          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer transition-all border ${
                                            isChecked
                                              ? "bg-slate-800/95 border-brand-indigo text-white shadow-xs"
                                              : "bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/50 hover:text-white"
                                          }`}
                                        >
                                          <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                                            isChecked ? "border-brand-indigo bg-brand-indigo" : "border-slate-600 bg-transparent"
                                          }`}>
                                            {isChecked && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                          </div>
                                          <span className="text-xs select-none">{opt}</span>
                                        </label>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Submit Questionnaire Button */}
                          <div className="pt-1.5">
                            <button
                              type="button"
                              onClick={() => handleSubmitQuestionnaire(msg)}
                              disabled={isLoading}
                              className="w-full py-3 px-5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2 group"
                            >
                              {isLoading ? (
                                <>
                                  <RefreshCw className="w-4 h-4 animate-spin text-slate-900" />
                                  <span>Searching live verified deals...</span>
                                </>
                              ) : (
                                <>
                                  <span>{msg.buttonText || "Find my best options"}</span>
                                  <ArrowRight className="w-4 h-4 text-slate-900 group-hover:translate-x-1 transition-transform" />
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* 3. ADVICE NOTE */}
                      {msg.adviceNote && (
                        <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200/80 text-xs text-slate-800 leading-relaxed font-medium">
                          <span className="font-bold text-brand-indigo">AI Buying Advice: </span>
                          {msg.adviceNote}
                        </div>
                      )}

                      {/* 4. EXACT PRODUCT CARDS */}
                      {Array.isArray(msg.products) && msg.products.length > 0 && (
                        <div className="space-y-3 pt-1">
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>Showing {msg.products.length} vetted deals</span>
                            <button
                              type="button"
                              onClick={() => handleBypassDirectSearch(msg.searchQuery)}
                              className="text-brand-indigo hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <span>View in main search grid</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            {msg.products.map((prod, pIdx) => (
                              <ProductCard
                                key={prod.id || pIdx}
                                product={prod}
                                searchQuery={msg.searchQuery || ""}
                                country={country}
                                onOpenPriceAlert={onOpenPriceAlert}
                                onOpenTrustSheet={onOpenTrustSheet}
                                onTryInStudio={onTryInStudio}
                                siblingProducts={msg.products}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-start gap-2.5 w-full">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-brand-indigo to-brand-violet flex items-center justify-center text-white shrink-0 mt-0.5 shadow-xs animate-pulse">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-xs px-3.5 py-2.5 text-xs text-slate-600 flex items-center gap-2 shadow-2xs">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-indigo" />
                  <span>Cross-checking live stores across Amazon, Flipkart & Croma...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Clean Light Footer Input Bar */}
          <div className="p-3 sm:p-4 border-t border-slate-200/80 bg-white shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-2xl px-3 py-1.5 focus-within:bg-white focus-within:border-brand-indigo focus-within:ring-2 focus-within:ring-brand-indigo/15 transition-all shadow-inner"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask follow-up advice... e.g. 'Inme se battery kiski best hai?'"
                disabled={isLoading}
                className="flex-1 bg-transparent py-1.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />

              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="p-2 rounded-xl bg-brand-indigo hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white transition-all cursor-pointer shrink-0 shadow-sm"
                title="Send Message"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>

            <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 px-1">
              <span>Press Enter to chat with Ask AI</span>
              <button
                type="button"
                onClick={() => handleBypassDirectSearch()}
                className="text-brand-indigo hover:text-indigo-800 underline cursor-pointer font-medium"
              >
                Skip chat & search main grid directly →
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
