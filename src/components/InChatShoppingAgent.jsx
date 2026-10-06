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
  MessageSquare
} from "lucide-react";

export default function InChatShoppingAgent({ products = [], searchQuery = "", onExecuteSearch }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeFollowUps, setActiveFollowUps] = useState([
    "Which one is the best value for money?",
    "Compare battery life & performance",
    "Is the most expensive one worth the extra cost?",
    "What if I need heavy gaming or 4K editing?"
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Initial welcome message from AI
  useEffect(() => {
    if (products && products.length > 0) {
      setMessages([
        {
          role: "assistant",
          text: `I've analyzed the ${products.length} live deals for "${searchQuery}". Ask me anything—I can compare their battery, performance, or advise if a different product fits your exact lifestyle better!`,
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
          products: (products || []).slice(0, 3).map(p => ({
            title: p.title,
            price: p.price,
            store_name: p.store_name || p.store,
            specs: p.specs || [],
            rating: p.rating
          })),
          searchQuery,
          conversationHistory: newHistory.slice(-6)
        })
      });

      const data = await res.json();

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          text: data.reply || "I analyzed your requirements against the current deals.",
          recommendedProductIndex: data.recommendedProductIndex,
          intentShiftDetected: data.intentShiftDetected,
          pivotSuggestion: data.pivotSuggestion,
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
                  const recProd = msg.recommendedProductIndex !== undefined && msg.recommendedProductIndex !== null
                    ? products[msg.recommendedProductIndex]
                    : null;

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

                        {/* Top Pick Highlight Card (if AI recommended a current product) */}
                        {recProd && !isUser && (
                          <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-950 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                              <div className="text-left">
                                <span className="text-[10px] uppercase font-extrabold text-emerald-700 tracking-wider block">
                                  AI Winner for Your Needs
                                </span>
                                <span className="font-bold text-xs line-clamp-1">{recProd.title}</span>
                              </div>
                            </div>
                            <span className="text-xs font-black shrink-0 px-2.5 py-1 rounded-lg bg-emerald-600 text-white">
                              {recProd.price}
                            </span>
                          </div>
                        )}

                        {/* ⚡ Intent Shift / Smart Pivot Card */}
                        {msg.intentShiftDetected && msg.pivotSuggestion && !isUser && (
                          <div className="mt-3.5 p-4 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 text-white border border-indigo-400/40 shadow-lg space-y-2.5">
                            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                              <Compass className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: "8s" }} />
                              <span>Smart Recommendation Update</span>
                            </div>
                            
                            <p className="text-xs text-slate-200 leading-normal">
                              {msg.pivotSuggestion.reason}
                            </p>

                            <button
                              type="button"
                              onClick={() => onExecuteSearch && onExecuteSearch(msg.pivotSuggestion.suggestedQuery)}
                              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs md:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-98"
                            >
                              <span>{msg.pivotSuggestion.buttonText || `Search "${msg.pivotSuggestion.suggestedQuery}" →`}</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
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
                  placeholder="Ask AI anything about these products (e.g. 'Which is best for coding?', 'Can I upgrade RAM?')..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs md:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                />
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
