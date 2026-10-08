"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  X, 
  Send, 
  ArrowRight, 
  ArrowUpRight, 
  CheckCircle, 
  CornerDownLeft, 
  Bot, 
  User, 
  Edit3, 
  Loader2, 
  Zap, 
  Search 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { userJourneyTracker } from "@/services/userJourneyTracker";

export default function SearchAiConciergeModal({
  isOpen,
  onClose,
  initialQuery = "",
  country = "IN",
  onConfirmSearch,
  onDirectSearch
}) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeChips, setActiveChips] = useState([]);
  const [readySearchData, setReadySearchData] = useState(null);
  const [isEditingQuery, setIsEditingQuery] = useState(false);
  const [customQueryInput, setCustomQueryInput] = useState("");

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeChips, readySearchData, isLoading]);

  // Initial trigger when modal opens
  useEffect(() => {
    if (isOpen) {
      setMessages([]);
      setActiveChips([]);
      setReadySearchData(null);
      setIsEditingQuery(false);
      setInputText("");

      const startTopic = initialQuery.trim();
      sendInitialGreeting(startTopic);
    }
  }, [isOpen]);

  const sendInitialGreeting = async (topic) => {
    setIsLoading(true);
    const browsingCtx = {
      recentSearches: userJourneyTracker.getJourneyContext()?.searches?.slice(0, 3) || [],
      recentProducts: userJourneyTracker.getRecentViewedProducts()?.slice(0, 3) || []
    };

    try {
      const res = await fetch("/api/ai/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage: topic ? `I am looking for: ${topic}` : "Hi, please guide me to find the best deals.",
          conversationHistory: [],
          initialTopic: topic,
          country,
          browsingContext: browsingCtx
        })
      });

      const data = await res.json();
      if (data && data.reply) {
        setMessages([
          { role: "assistant", text: data.reply }
        ]);
        const chips = [...(data.suggestedChips || [])];
        if (data.isReadyToSearch && data.suggestedQuery) {
          setReadySearchData(data);
          setCustomQueryInput(data.suggestedQuery);
          const searchChip = `🚀 Search: "${data.suggestedQuery}"`;
          if (!chips.includes(searchChip)) chips.push(searchChip);
        }
        setActiveChips(chips);
      }
    } catch (err) {
      console.error("[Concierge Init Error]:", err);
      setMessages([
        { 
          role: "assistant", 
          text: topic 
            ? `Namaste! Aap ${topic} dekh rahe hain. Aapka lagbhag budget kitna hai aur main use-case kya rahega?` 
            : "Namaste! Main aapka AI Shopping Advisor hoon. Aap aaj kya kharidne ki soch rahe hain?" 
        }
      ]);
      setActiveChips(["Under ₹20,000", "Under ₹50,000", "Best Value Deals", "Top Rated"]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  };

  const handleSendMessage = async (userTextToSend) => {
    const text = (userTextToSend || inputText).trim();
    if (!text || isLoading) return;

    const newMessages = [...messages, { role: "user", text }];
    setMessages(newMessages);
    setInputText("");
    setActiveChips([]);
    setIsLoading(true);

    const browsingCtx = {
      recentSearches: userJourneyTracker.getJourneyContext()?.searches?.slice(0, 3) || [],
      recentProducts: userJourneyTracker.getRecentViewedProducts()?.slice(0, 3) || []
    };

    try {
      const res = await fetch("/api/ai/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage: text,
          conversationHistory: newMessages,
          initialTopic: initialQuery,
          country,
          browsingContext: browsingCtx
        })
      });

      const data = await res.json();
      if (data && data.reply) {
        setMessages(prev => [...prev, { role: "assistant", text: data.reply }]);
        const chips = [...(data.suggestedChips || [])];
        if (data.isReadyToSearch && data.suggestedQuery) {
          setReadySearchData(data);
          setCustomQueryInput(data.suggestedQuery);
          const searchChip = `🚀 Search: "${data.suggestedQuery}"`;
          if (!chips.includes(searchChip)) chips.push(searchChip);
        } else {
          setReadySearchData(null);
        }
        setActiveChips(chips);
      }
    } catch (err) {
      console.error("[Concierge Reply Error]:", err);
      setMessages(prev => [
        ...prev, 
        { role: "assistant", text: "Samajh gaya! Aap aur kya specific cheez dekh rahe hain?" }
      ]);
      setReadySearchData({
        suggestedQuery: initialQuery || text,
        userPersona: "Value Buyer",
        userRequirement: text
      });
      setCustomQueryInput(initialQuery || text);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  };

  const handleChipClick = (chipText) => {
    // If chip is an affirmative search trigger
    if (chipText.startsWith("🚀") || chipText.toLowerCase().includes("search:")) {
      executeConfirmedSearch();
      return;
    }
    handleSendMessage(chipText);
  };

  const executeConfirmedSearch = () => {
    const finalQuery = (customQueryInput || readySearchData?.suggestedQuery || initialQuery || inputText).trim();
    const sharedContext = {
      userPersona: readySearchData?.userPersona || "Custom Buyer Profile",
      userRequirement: readySearchData?.userRequirement || finalQuery,
      budgetLimit: readySearchData?.budgetLimit || null,
      conciergeSummary: readySearchData?.reply || "",
      suggestedQuery: finalQuery
    };
    // Sync into user journey telemetry ledger
    userJourneyTracker.recordGuideSync(sharedContext);

    onConfirmSearch(finalQuery, sharedContext);
    onClose();
  };

  const handleBypassDirectSearch = () => {
    const queryToSearch = (initialQuery || inputText || customQueryInput || "trending deals").trim();
    onDirectSearch(queryToSearch);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-100"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-800/80 bg-slate-900/90 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-white tracking-wide">
                    ShopSmart AI Guide
                  </h3>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Personal Advisor
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Ask advice freely &bull; We&rsquo;ll craft a clean 2-4 word query when you&rsquo;re ready
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Skip to direct search button */}
              <button
                type="button"
                onClick={handleBypassDirectSearch}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-slate-300 hover:text-white border border-slate-700/80 transition-all cursor-pointer"
                title="Search directly without AI conversation"
              >
                <Zap className="w-3 h-3 text-amber-400" />
                <span>Direct Search</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 scrollbar-thin scrollbar-thumb-slate-700">
            {messages.map((msg, idx) => {
              const isAi = msg.role === "assistant";
              return (
                <div
                  key={idx}
                  className={`flex items-start gap-2.5 ${isAi ? "justify-start" : "justify-end"}`}
                >
                  {isAi && (
                    <div className="w-7 h-7 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isAi
                        ? "bg-slate-800/90 text-slate-100 border border-slate-700/80 shadow-xs"
                        : "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium shadow-md shadow-indigo-600/20"
                    }`}
                  >
                    {msg.text}
                  </div>

                  {!isAi && (
                    <div className="w-7 h-7 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium pl-9">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>AI shopping concierge is thinking...</span>
              </div>
            )}

            {/* Quick Tap Chips */}
            {activeChips.length > 0 && !isLoading && (
              <div className="pl-9 pt-1 flex flex-wrap gap-1.5">
                {activeChips.map((chip, cIdx) => {
                  const isSearchChip = chip.startsWith("🚀");
                  return (
                    <button
                      key={cIdx}
                      type="button"
                      onClick={() => handleChipClick(chip)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5 ${
                        isSearchChip
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold shadow-md shadow-indigo-600/30 border border-indigo-400/40"
                          : "bg-slate-800/90 hover:bg-indigo-600/30 text-indigo-200 hover:text-white border border-indigo-500/30 hover:border-indigo-400"
                      }`}
                    >
                      <span>{chip}</span>
                      {isSearchChip && <ArrowRight className="w-3 h-3" />}
                    </button>
                  );
                })}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Bar */}
          <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-900/95 shrink-0">
            {/* Sleek Smart Query Pill Indicator (Non-intrusive) */}
            {readySearchData?.suggestedQuery && (
              <div className="mb-2.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-indigo-500/30 flex items-center justify-between gap-2 shadow-xs">
                <div className="flex items-center gap-1.5 text-xs overflow-hidden">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span className="text-slate-400 text-[11px] shrink-0 font-medium">Smart Query:</span>
                  <span className="font-bold text-amber-300 text-xs truncate">
                    &ldquo;{customQueryInput || readySearchData.suggestedQuery}&rdquo;
                  </span>
                </div>
                <button
                  type="button"
                  onClick={executeConfirmedSearch}
                  className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all active:scale-95 cursor-pointer shrink-0"
                >
                  <span>Search Deals</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask advice, requirements, or type budget..."
                disabled={isLoading}
                className="flex-1 bg-slate-800/90 border border-slate-700/80 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />

              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="p-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white transition-all cursor-pointer shrink-0 shadow-md shadow-indigo-600/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 px-1">
              <span>Press Enter to reply</span>
              <button
                type="button"
                onClick={handleBypassDirectSearch}
                className="hover:text-indigo-400 underline cursor-pointer"
              >
                Skip chat & search directly →
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
