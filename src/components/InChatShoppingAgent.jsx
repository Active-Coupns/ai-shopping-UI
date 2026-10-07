"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  ArrowRight, 
  RefreshCw, 
  HelpCircle, 
  CheckCircle, 
  Compass, 
  Zap, 
  ChevronDown, 
  ChevronUp,
  MessageSquare,
  ExternalLink,
  Check,
  X,
  ShoppingBag,
  Mic,
  MicOff
} from "lucide-react";

export default function InChatShoppingAgent({
  products = [],
  displayedProducts = [],
  searchQuery = "",
  aiSessionLedger = null,
  onExecuteSearch
}) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [dismissedConfirmations, setDismissedConfirmations] = useState({});
  const [activeFollowUps, setActiveFollowUps] = useState([
    "Which one is the best value for money?",
    "Compare battery life & performance",
    "Is the most expensive one worth the extra cost?",
    "What if I need heavy gaming or 4K editing?"
  ]);
  const messagesEndRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const effectiveDisplayed = displayedProducts && displayedProducts.length > 0 
    ? displayedProducts 
    : (products || []).slice(0, 3);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  useEffect(() => {
    scrollToBottom();
    const t1 = setTimeout(scrollToBottom, 150);
    const t2 = setTimeout(scrollToBottom, 400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [messages, isLoading, dismissedConfirmations]);

  const toggleVoiceInput = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice search is not supported in this browser. Please use Google Chrome or Edge.");
      return;
    }

    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-IN";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0]?.[0]?.transcript;
        if (transcript) {
          setInputValue(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn("Speech recognition error:", err);
      setIsListening(false);
    }
  };

  // Initial welcome message from AI
  useEffect(() => {
    if (products && products.length > 0) {
      setMessages([
        {
          role: "assistant",
          text: `I've analyzed all ${products.length} products found for "${searchQuery}". Ask me anything—I can compare the 3 on your screen, pull other hidden matches from our inventory, or advise on better alternatives!`,
          quickFollowUps: [
            "Which one is the best value for money?",
            "Compare battery life & performance",
            "Is the most expensive one worth the extra cost?",
            "What if I need heavy gaming or 4K editing?"
          ]
        }
      ]);
    }
  }, [searchQuery, products.length]);

  const handleSendMessage = async (textToSend) => {
    const queryText = (textToSend || inputValue).trim();
    if (!queryText || isLoading) return;

    setInputValue("");
    const newHistory = [...messages, { role: "user", text: queryText }];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage: queryText,
          displayedProducts: effectiveDisplayed.map(p => ({
            title: p.title,
            price: p.price,
            store_name: p.store_name || p.store,
            specs: p.specs || [],
            rating: p.rating
          })),
          allPoolProducts: (products || []).slice(0, 20).map(p => ({
            title: p.title,
            price: p.price,
            store_name: p.store_name || p.store,
            specs: p.specs || [],
            rating: p.rating,
            image: p.image || p.thumbnail,
            deal_link: p.deal_link || p.link || p.affiliateUrl
          })),
          searchQuery,
          sessionLedger: {
            viewedReviews: Object.values(aiSessionLedger?.viewedReviews || {}).map(r => ({
              title: r.productTitle,
              fitVerdict: r.fitVerdict,
              bestFor: r.bestFor,
              skipIf: r.skipIf,
              pros: (r.pros || []).slice(0, 2),
              cons: (r.cons || []).slice(0, 2)
            })),
            lastViewedProduct: aiSessionLedger?.lastViewedProduct || null
          },
          conversationHistory: newHistory.slice(-6)
        })
      });

      const data = await res.json();

      // Find full product object if suggestedPoolProduct was returned
      let matchedPoolProduct = null;
      if (data.suggestedPoolProduct) {
        matchedPoolProduct = (products || []).find(p => 
          (p.title || "").toLowerCase().includes((data.suggestedPoolProduct.title || "").toLowerCase().slice(0, 20)) ||
          (data.suggestedPoolProduct.title || "").toLowerCase().includes((p.title || "").toLowerCase().slice(0, 20))
        ) || data.suggestedPoolProduct;
      }

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          text: data.reply || "I analyzed your requirements against the current deals.",
          recommendedDisplayedIndex: data.recommendedDisplayedIndex,
          suggestedPoolProduct: matchedPoolProduct ? {
            ...matchedPoolProduct,
            whyRecommended: data.suggestedPoolProduct?.whyRecommended || matchedPoolProduct.whyRecommended
          } : null,
          intentShiftDetected: data.intentShiftDetected,
          intentShiftReconfirmation: data.intentShiftReconfirmation,
          quickFollowUps: data.quickFollowUps || []
        }
      ]);

      if (data.quickFollowUps && data.quickFollowUps.length > 0) {
        setActiveFollowUps(data.quickFollowUps);
      }
    } catch (err) {
      console.error("AI Shopping Agent error:", err);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          text: "I am ready to answer your questions about these products. Try asking about specific specs or how they compare for your use case!",
          quickFollowUps: ["Which has the best battery?", "Compare value for money"]
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const domVal = e.currentTarget?.querySelector("input")?.value;
    handleSendMessage(domVal || inputValue);
  };

  if (!products || products.length === 0) return null;

  return (
    <div id="in-chat-shopping-agent" className="w-full my-8">
      <div className="rounded-3xl border border-indigo-200/80 bg-gradient-to-b from-white via-indigo-50/20 to-white shadow-xl shadow-indigo-500/5 overflow-hidden">
        {/* Agent Header */}
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-6 py-4.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between cursor-pointer select-none transition-all hover:bg-slate-900/95"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shadow-inner">
              <Bot className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm md:text-base text-white tracking-tight">
                  Ask AI About These Products
                </h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-extrabold text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Advisor
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium">
                Compare these {products.length} options, test use-cases, or discover better alternatives
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-indigo-200 font-semibold hidden sm:inline">
              {isExpanded ? "Collapse" : "Open Chat"}
            </span>
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white/80">
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </div>

        {/* Collapsible Chat Body */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* Quick Prompts Bar */}
              {activeFollowUps.length > 0 && (
                <div className="px-6 pt-4 pb-2 border-b border-indigo-100/60 bg-white/70">
                  <div className="flex items-center gap-1.5 mb-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Suggested Questions:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeFollowUps.map((q, qIdx) => (
                      <button
                        key={qIdx}
                        onClick={() => handleSendMessage(q)}
                        disabled={isLoading}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-800 border border-slate-200/90 shadow-2xs hover:border-indigo-300 transition-all cursor-pointer text-left active:scale-98 disabled:opacity-50"
                      >
                        💬 {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Stream */}
              <div className="p-6 max-h-[480px] overflow-y-auto space-y-4 bg-slate-50/50">
                {messages.map((msg, mIdx) => {
                  const isUser = msg.role === "user";
                  const recDisplayedProd = (msg.recommendedDisplayedIndex !== undefined && msg.recommendedDisplayedIndex !== null)
                    ? effectiveDisplayed[msg.recommendedDisplayedIndex]
                    : null;
                  const poolProd = msg.suggestedPoolProduct;
                  const reconfirm = msg.intentShiftReconfirmation;
                  const isDismissed = !!dismissedConfirmations[mIdx];

                  return (
                    <motion.div
                      key={mIdx}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                    >
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs shadow-xs ${
                        isUser
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-900 text-white"
                      }`}>
                        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-indigo-300" />}
                      </div>

                      {/* Message Bubble */}
                      <div className={`max-w-[85%] rounded-2xl p-4 text-xs md:text-sm leading-relaxed shadow-xs ${
                        isUser
                          ? "bg-indigo-600 text-white rounded-tr-none font-medium"
                          : "bg-white border border-slate-200/90 text-slate-800 rounded-tl-none font-normal"
                      }`}>
                        <div className="whitespace-pre-line font-sans">
                          {msg.text}
                        </div>

                        {/* 1. Winner Among Currently Displayed 3 Cards */}
                        {recDisplayedProd && !isUser && (
                          <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-950 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                              <div className="text-left">
                                <span className="text-[10px] uppercase font-extrabold text-emerald-700 tracking-wider block">
                                  Top Pick From Screen Cards
                                </span>
                                <span className="font-bold text-xs line-clamp-1">{recDisplayedProd.title}</span>
                              </div>
                            </div>
                            <span className="text-xs font-black shrink-0 px-2.5 py-1 rounded-lg bg-emerald-600 text-white">
                              {recDisplayedProd.price}
                            </span>
                          </div>
                        )}

                        {/* 2. In-Chat Suggested Product (Discovered from 15-20 Inventory Pool) */}
                        {poolProd && !isUser && (
                          <div className="mt-3.5 p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-purple-50/40 to-white border border-indigo-200 shadow-sm text-left space-y-2.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-black tracking-wide">
                                <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
                                <span>Discovered in Search Inventory</span>
                              </span>
                              <span className="text-[11px] font-bold text-indigo-700">
                                {poolProd.store_name || poolProd.store || "Online Store"}
                              </span>
                            </div>

                            <div className="flex items-start gap-3">
                              {poolProd.image && (
                                <img 
                                  src={poolProd.image} 
                                  alt={poolProd.title} 
                                  className="w-14 h-14 object-contain rounded-xl bg-white border border-slate-200/70 p-1 shrink-0" 
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-xs md:text-sm text-slate-900 line-clamp-2 leading-tight">
                                  {poolProd.title}
                                </h4>
                                <div className="mt-1 flex items-baseline gap-2">
                                  <span className="text-sm md:text-base font-black text-emerald-700">
                                    {poolProd.price}
                                  </span>
                                  {poolProd.rating && (
                                    <span className="text-[11px] text-slate-500 font-semibold">
                                      ⭐ {poolProd.rating}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Why AI Recommended This Product */}
                            {poolProd.whyRecommended && (
                              <p className="text-[11px] text-slate-600 bg-white/80 p-2 rounded-lg border border-indigo-100/60 leading-snug">
                                <strong className="text-indigo-900">Why this fits you better:</strong> {poolProd.whyRecommended}
                              </p>
                            )}

                            {/* Key Specs Pills */}
                            {Array.isArray(poolProd.specs) && poolProd.specs.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {poolProd.specs.slice(0, 3).map((s, sIdx) => (
                                  <span key={sIdx} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-medium text-slate-700">
                                    {s}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Direct View Deal Link (Pure in-chat experience) */}
                            {(poolProd.deal_link || poolProd.link || poolProd.affiliateUrl) && (
                              <a
                                href={poolProd.deal_link || poolProd.link || poolProd.affiliateUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all active:scale-98 cursor-pointer mt-1"
                              >
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>View Deal at {poolProd.store_name || poolProd.store || "Store"}</span>
                                <ExternalLink className="w-3 h-3 ml-0.5" />
                              </a>
                            )}
                          </div>
                        )}

                        {/* 3. Intent Shift Re-Confirmation Card (Double-Check Before Firing API) */}
                        {msg.intentShiftDetected && reconfirm && !isUser && (
                          <div className="mt-3.5 p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-400/30 shadow-lg space-y-3">
                            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                              <Compass className="w-4 h-4 text-amber-400" />
                              <span>Search Suggestion & Shift</span>
                            </div>
                            
                            <p className="text-xs text-slate-200 leading-relaxed">
                              {reconfirm.understoodRequirement}
                            </p>

                            <p className="text-xs font-semibold text-indigo-200">
                              {reconfirm.confirmationQuestion || `Would you like me to search for "${reconfirm.suggestedQuery}"?`}
                            </p>

                            {!isDismissed ? (
                              <div className="pt-1 flex flex-col sm:flex-row gap-2">
                                <button
                                  type="button"
                                  onClick={() => onExecuteSearch && onExecuteSearch(reconfirm.suggestedQuery)}
                                  className="flex-1 py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer active:scale-98"
                                >
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  <span>Yes, Search "{reconfirm.suggestedQuery}"</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDismissedConfirmations(prev => ({ ...prev, [mIdx]: true }))}
                                  className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 font-semibold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>No, Keep Current Options</span>
                                </button>
                              </div>
                            ) : (
                              <div className="p-2 rounded-xl bg-white/10 text-emerald-300 text-[11px] font-semibold flex items-center gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Continuing with current options. Ask me anything else!</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex items-center gap-2.5 text-xs text-indigo-700 font-bold p-2 bg-indigo-50/60 rounded-xl border border-indigo-100 max-w-fit">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>AI Shopping Advisor is analyzing hardware specs...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Bar */}
              <form onSubmit={handleFormSubmit} className="p-3 bg-white border-t border-slate-200/80 flex items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={isListening ? "Listening... speak now in English or Hindi..." : "Ask AI anything about these products (e.g. 'Which is best for coding?', 'Can I upgrade RAM?')..."}
                  className={`flex-1 px-4 py-2.5 rounded-xl border text-xs md:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all ${
                    isListening
                      ? "bg-rose-50/80 border-rose-300 ring-2 ring-rose-400/20"
                      : "bg-slate-50 border-slate-200 focus:border-indigo-500 focus:bg-white"
                  }`}
                />
                
                {/* Voice Input Mic Button */}
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  title={isListening ? "Listening... Click to stop" : "Speak your question (Voice Input)"}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                    isListening
                      ? "bg-rose-600 text-white border-rose-700 animate-pulse shadow-md shadow-rose-500/30"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200/90 hover:text-slate-900"
                  }`}
                >
                  <Mic className={`w-4 h-4 ${isListening ? "animate-bounce text-white" : "text-slate-600"}`} />
                </button>

                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs md:text-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <span>Ask</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
