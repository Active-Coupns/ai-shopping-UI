"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Send, 
  ArrowUp, 
  Plus, 
  ArrowRight, 
  ArrowLeft,
  RefreshCw, 
  Bot, 
  User, 
  Check, 
  ChevronRight,
  HelpCircle,
  ShoppingBag,
  MessageSquare
} from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { searchProducts } from "@/services/api";
import { userJourneyTracker } from "@/services/userJourneyTracker";

const STARTER_PROMPTS = [
  {
    icon: "💻",
    title: "Coding Laptop under ₹50k",
    subtitle: "16GB RAM, battery reality & true daily cost",
    query: "I need a coding laptop under 50000 with 16GB RAM"
  },
  {
    icon: "💊",
    title: "Paracetamol vs Dolo 650",
    subtitle: "Active salt info, pharmacy price & dosage warning",
    query: "Compare Paracetamol vs Dolo 650 and show prices"
  },
  {
    icon: "🎧",
    title: "ANC Earbuds under ₹3,000",
    subtitle: "Real mic quality, ANC decibels & battery life",
    query: "Best noise cancelling earbuds under 3000"
  },
  {
    icon: "🎟️",
    title: "Today's Top Deals & Coupons",
    subtitle: "Verified credit card offers & lowest market prices",
    query: "Show today's best electronics deals and bank offers"
  }
];

export default function ConversationalAiStudio({
  initialQuery = "",
  country = "IN",
  onOpenClassicSearch,
  onOpenPriceAlert,
  onOpenTrustSheet
}) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeSelections, setActiveSelections] = useState({});

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const hasAutoStartedRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle Radio selection change in questionnaire
  const handleOptionChange = (msgId, questionId, optionText) => {
    setActiveSelections(prev => ({
      ...prev,
      [`${msgId}_${questionId}`]: optionText
    }));
  };

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
      console.error("[AiStudio] Search execution error:", err);
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
      console.error("[AiStudio] Questionnaire submission error:", err);
      await executeSearch(msg.originalUserQuery || "laptop 16GB RAM");
    }
  };

  // Send message to Conversational AI Agent
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
      console.error("[AiStudio] Send error:", err);
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

  // Start fresh consultation
  const handleNewChat = () => {
    setMessages([]);
    setInputValue("");
    setActiveSelections({});
    hasAutoStartedRef.current = false;
    if (inputRef.current) inputRef.current.focus();
  };

  // Auto-run initialQuery on mount if provided
  useEffect(() => {
    if (initialQuery && initialQuery.trim() && !hasAutoStartedRef.current && messages.length === 0) {
      hasAutoStartedRef.current = true;
      handleSendMessage(initialQuery.trim());
    }
  }, [initialQuery]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full min-h-[calc(100vh-64px)] bg-[#fcfcfd]">
      
      {/* 1. Header Toolbar (Back to Search Engine + Title + New Chat) */}
      <div className="w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-2.5 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <button
          type="button"
          onClick={onOpenClassicSearch}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-all cursor-pointer border border-slate-200/60 shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
          <span>Back to Search Engine</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-r from-brand-indigo to-brand-violet flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
              ShopSmart <span className="text-brand-indigo">AI Assistant</span>
            </span>
            <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">
              Personalized Shopping Advisor • Google Shopping + Verified Deals
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleNewChat}
          className="flex items-center gap-1 text-xs font-bold text-brand-indigo hover:text-indigo-800 px-3 py-1.5 rounded-xl hover:bg-indigo-50 border border-indigo-200/70 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Chat</span>
        </button>
      </div>

      {/* 2. Messages & Conversation Canvas */}
      <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Empty State / Welcome Screen */}
        {messages.length === 0 && (
          <div className="py-10 sm:py-16 flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
            <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-brand-indigo to-brand-violet flex items-center justify-center text-white mb-5 shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-7 h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
              How can I assist your shopping today?
            </h1>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">
              Ask for personalized buying advice, compare specs, or find verified discounts across Amazon, Flipkart, Croma and top pharmacies.
            </p>

            {/* Starter Suggestion Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
              {STARTER_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(prompt.query)}
                  className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-brand-indigo hover:shadow-md transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{prompt.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-brand-indigo transition-colors flex items-center justify-between">
                        {prompt.title}
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-indigo group-hover:translate-x-0.5 transition-all" />
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{prompt.subtitle}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Render Conversation Turns */}
        {messages.map((msg) => (
          <div key={msg.id} className="w-full">
            {/* USER MESSAGE */}
            {msg.role === "user" && (
              <div className="flex items-start justify-end gap-3 w-full">
                <div className="bg-slate-900 text-white rounded-2xl rounded-tr-xs px-4 py-3 max-w-[85%] sm:max-w-[70%] text-sm shadow-sm leading-relaxed">
                  {msg.text}
                </div>
                <div className="w-8 h-8 rounded-xl bg-slate-200 flex items-center justify-center text-slate-700 shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              </div>
            )}

            {/* ASSISTANT MESSAGE */}
            {msg.role === "assistant" && (
              <div className="flex items-start gap-3 w-full">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-indigo to-brand-violet flex items-center justify-center text-white shrink-0 mt-1 shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>

                <div className="flex-1 space-y-4 max-w-full">
                  {/* Regular Text or Conversational Chat Reply */}
                  {(msg.text && msg.type !== "questionnaire" && msg.type !== "products") && (
                    <div className="bg-white border border-slate-200/90 rounded-2xl rounded-tl-xs px-4.5 py-3.5 text-sm text-slate-800 shadow-2xs leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </div>
                  )}

                  {/* CHAT REPLY (Follow-up advice bubble) */}
                  {msg.type === "chat_reply" && (
                    <div className="bg-white border border-slate-200/90 rounded-2xl rounded-tl-xs px-4.5 py-3.5 text-sm text-slate-800 shadow-2xs leading-relaxed whitespace-pre-wrap">
                      <div className="flex items-center gap-1.5 text-brand-indigo font-bold text-xs mb-1.5">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>AI Advisor</span>
                      </div>
                      {msg.text}
                    </div>
                  )}

                  {/* 1. NATURAL INTRO ADVICE (Honest buying guidance) */}
                  {msg.introText && (
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                      {msg.introText}
                    </p>
                  )}

                  {/* 2. CHATGPT QUESTIONNAIRE CARD */}
                  {msg.type === "questionnaire" && (
                    <div className="w-full rounded-3xl bg-[#0f172a] text-white p-5 sm:p-7 shadow-xl shadow-slate-900/10 border border-slate-800 space-y-5">
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          <h3 className="text-xs sm:text-sm font-bold tracking-tight text-white uppercase tracking-wider">
                            {msg.title || "Let me narrow it down for you"}
                          </h3>
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">Quick 2-question filter</span>
                      </div>

                      {/* Question blocks */}
                      <div className="space-y-5">
                        {(msg.questions || []).map((q, qIdx) => {
                          const currentSelected = activeSelections[`${msg.id}_${q.id}`] || q.options?.[q.defaultSelected ?? 0] || q.options?.[0];

                          return (
                            <div key={q.id || qIdx} className="space-y-2.5">
                              <p className="text-xs sm:text-sm font-bold text-slate-200">
                                {qIdx + 1}. {q.text}
                              </p>

                              {/* Realistic Option Radios */}
                              <div className="space-y-1.5 pl-1">
                                {(q.options || []).map((opt, optIdx) => {
                                  const isChecked = currentSelected === opt;

                                  return (
                                    <label
                                      key={optIdx}
                                      onClick={() => handleOptionChange(msg.id, q.id, opt)}
                                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer transition-all border ${
                                        isChecked
                                          ? "bg-slate-800/90 border-brand-indigo/60 text-white shadow-xs"
                                          : "bg-slate-900/50 border-slate-800/80 text-slate-300 hover:bg-slate-800/40 hover:text-white"
                                      }`}
                                    >
                                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                                        isChecked ? "border-brand-indigo bg-brand-indigo" : "border-slate-600 bg-transparent"
                                      }`}>
                                        {isChecked && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                      </div>
                                      <span className="text-xs sm:text-sm select-none">{opt}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Submit Questionnaire Button */}
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => handleSubmitQuestionnaire(msg)}
                          disabled={isLoading}
                          className="w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2 group"
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

                  {/* 3. ADVICE NOTE (Shown above products if available) */}
                  {msg.adviceNote && (
                    <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200/80 text-xs text-slate-800 font-medium leading-relaxed">
                      <span className="font-bold text-brand-indigo">AI Buying Advice: </span>
                      {msg.adviceNote}
                    </div>
                  )}

                  {/* 4. EXACT CLASSIC SEARCH PRODUCT CARDS (Proven Architecture) */}
                  {Array.isArray(msg.products) && msg.products.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      {msg.products.map((prod, pIdx) => (
                        <ProductCard
                          key={prod.id || pIdx}
                          product={prod}
                          searchQuery={msg.searchQuery || ""}
                          country={country}
                          onOpenPriceAlert={onOpenPriceAlert}
                          onOpenTrustSheet={onOpenTrustSheet}
                          siblingProducts={msg.products}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3 w-full">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-indigo to-brand-violet flex items-center justify-center text-white shrink-0 mt-1 shadow-xs animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-xs px-4 py-3 text-xs text-slate-600 flex items-center gap-2 shadow-2xs">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-indigo" />
              <span>Analyzing requirements & fetching live deals across Amazon, Flipkart & Croma...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Floating ChatGPT-Style Input Omnibar */}
      <div className="p-3 sm:p-4 bg-gradient-to-t from-white via-white/95 to-transparent sticky bottom-0 z-20">
        <div className="max-w-3xl mx-auto w-full">
          <div className="relative flex items-center rounded-2xl border border-slate-300 bg-white shadow-lg shadow-slate-200/60 focus-within:border-brand-indigo focus-within:ring-2 focus-within:ring-brand-indigo/15 transition-all">
            <textarea
              ref={inputRef}
              rows={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything or follow up... e.g. 'Inme se battery kiski best hai?'"
              className="w-full resize-none py-3.5 pl-4 pr-12 text-sm text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
            />
            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isLoading}
              className={`absolute right-2.5 p-2 rounded-xl transition-all cursor-pointer ${
                inputValue.trim() && !isLoading
                  ? "bg-brand-indigo text-white shadow-sm hover:bg-indigo-700"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
              title="Send Message"
            >
              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
            <span>ShopSmart AI cross-checks live prices across Amazon, Flipkart, Croma & verified pharmacies.</span>
            <button
              type="button"
              onClick={onOpenClassicSearch}
              className="text-slate-500 hover:text-brand-indigo transition-colors hidden sm:block font-medium cursor-pointer"
            >
              Switch to Search Engine →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
