"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Sparkles, 
  Send, 
  Mic, 
  Bot, 
  User, 
  Plane, 
  Hotel, 
  Ticket, 
  ShieldCheck, 
  AlertCircle, 
  Copy, 
  Check, 
  ArrowRight, 
  ExternalLink,
  CreditCard,
  Luggage,
  Calendar,
  RotateCcw,
  Loader2,
  Zap
} from "lucide-react";
import { SUPPORTED_COUNTRIES } from "@/lib/countryConfig";

export default function TravelAiAdvisorModal({
  isOpen,
  onClose,
  initialCategory = "flights", // "flights" | "hotels" | "events"
  initialQuery = "",
  country = "IN"
}) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const [chatScanningBrand, setChatScanningBrand] = useState(null);

  const handleTriggerOnDemandInChat = async (brandName) => {
    if (!brandName) return;
    setChatScanningBrand(brandName);
    try {
      const res = await fetch("/api/travel/on-demand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName,
          category: initialCategory,
          country
        })
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.deals) && data.deals.length > 0) {
        setMessages(prev => [
          ...prev,
          {
            id: `assistant-ondemand-${Date.now()}`,
            role: "assistant",
            content: `ShopSmart AI Live Radar successfully discovered ${data.deals.length} active verified deals for ${brandName}:`,
            onDemandDiscoveredDeals: data.deals
          }
        ]);
      }
    } catch (err) {
      console.error("[Chat On-Demand Error]:", err);
    } finally {
      setChatScanningBrand(null);
    }
  };

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const currentCountryMeta = SUPPORTED_COUNTRIES[country] || SUPPORTED_COUNTRIES.IN;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Initial welcome message tailored to initial category
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeText = `Hello! I am your ShopSmart AI Smart Booking Strategy Advisor for ${currentCountryMeta.name} ${currentCountryMeta.flag}. 

I help you analyze verified fare rules, fee waivers, student/senior bag perks, and bank privileges across Flights, Hotels, and Live Events so you never overpay.

What are you planning to book today? Choose a quick option below or describe your journey:`;

      setMessages([
        {
          id: "welcome-1",
          role: "assistant",
          content: welcomeText,
          suggestedActions: [
            "🛫 Optimize Flight Booking (Route & Bag Perks)",
            "🏨 Smart Hotel Savings (Mobile Rates & Taxes)",
            "🎟️ Event & Movie BOGO Quota Perks"
          ]
        }
      ]);
    }
  }, [isOpen, messages.length, currentCountryMeta]);

  // Auto-trigger initialQuery if passed from prompt chip
  const hasTriggeredInitialQuery = useRef(false);
  useEffect(() => {
    if (isOpen && initialQuery && !hasTriggeredInitialQuery.current) {
      hasTriggeredInitialQuery.current = true;
      const timer = setTimeout(() => {
        handleSend(initialQuery);
      }, 400);
      return () => clearTimeout(timer);
    }
    if (!isOpen) {
      hasTriggeredInitialQuery.current = false;
    }
  }, [isOpen, initialQuery]);

  // Speech Recognition Setup
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = country === "IN" ? "en-IN" : "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          setInputValue(transcript);
        }
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.warn("Speech recognition error:", e);
      setIsListening(false);
    }
  };

  const handleSend = async (overrideText = null) => {
    const textToSend = (overrideText || inputValue).trim();
    if (!textToSend || isLoading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      role: "user",
      content: textToSend
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputValue("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/travel/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage: textToSend,
          history: newHistory.slice(-6).map(m => ({ role: m.role, content: m.content })),
          country: country,
          category: initialCategory
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.response) {
          setMessages(prev => [
            ...prev,
            {
              id: `assistant-${Date.now()}`,
              role: "assistant",
              content: data.response.message,
              strategyDossier: data.response.dossier || null,
              suggestedActions: data.response.suggestedActions || [],
              onDemandBrand: data.response.onDemandBrand || null
            }
          ]);
        }
      } else {
        throw new Error("Advisor response failed");
      }
    } catch (err) {
      console.error("[Travel AI Advisor Error]:", err);
      setMessages(prev => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: "I'm having a temporary connection issue. Please tell me your origin and destination or hotel city, and I will prepare your savings strategy."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleResetChat = () => {
    setMessages([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-3xl h-[90vh] max-h-[820px] rounded-3xl bg-white border border-slate-200 shadow-2xl flex flex-col overflow-hidden text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200/90 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-amber-300">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base leading-tight">
                  Smart Booking Strategy Advisor
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-black">
                  {currentCountryMeta.flag} {country}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium">
                Verified Fare Rules • Fee Waivers • Bag &amp; Bank Perks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleResetChat}
              title="Reset Conversation"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 bg-slate-50/60">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[92%] sm:max-w-[85%] ${
                msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                  msg.role === "user"
                    ? "bg-slate-900 text-white"
                    : "bg-indigo-600 text-white shadow-sm"
                }`}
              >
                {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className="space-y-3 min-w-0">
                <div
                  className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-[13px] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-slate-900 text-white font-medium rounded-tr-xs"
                      : "bg-white border border-slate-200/90 text-slate-800 shadow-2xs rounded-tl-xs whitespace-pre-wrap font-medium"
                  }`}
                >
                  {msg.content}
                </div>

                {/* Structured Strategy Dossier (Rendered as Crisp Value-Add Trick Cards) */}
                {msg.strategyDossier && (
                  <div className="space-y-3 pt-1">
                    
                    {/* Strategy 1 / Trick #1 */}
                    {msg.strategyDossier.routeTiming && (
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-white to-indigo-50/30 border border-indigo-200/80 shadow-xs space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white font-black text-[10px] tracking-wider uppercase flex items-center gap-1 shadow-2xs">
                            <Sparkles className="w-3 h-3 text-amber-300" />
                            First Saving Trick
                          </span>
                          {msg.strategyDossier.routeTiming.savingsNote && (
                            <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100/90 border border-emerald-300/70 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                              💰 {msg.strategyDossier.routeTiming.savingsNote}
                            </span>
                          )}
                        </div>
                        <h4 className="font-black text-xs sm:text-[13px] text-slate-900 leading-snug">
                          {msg.strategyDossier.routeTiming.title?.replace(/^(1\.\s*|First Saving Strategy:\s*|First Saving Trick:\s*)/i, "") || "Route & Booking Channel Strategy"}
                        </h4>
                        <p className="text-[11px] sm:text-xs text-slate-700 font-medium leading-relaxed">
                          {msg.strategyDossier.routeTiming.description}
                        </p>
                      </div>
                    )}

                    {/* Strategy 2 / Trick #2 */}
                    {msg.strategyDossier.feeWaivers && (
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/70 via-white to-amber-50/30 border border-amber-200/80 shadow-xs space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-600 text-white font-black text-[10px] tracking-wider uppercase flex items-center gap-1 shadow-2xs">
                            <ShieldCheck className="w-3 h-3 text-white" />
                            Second Saving Trick
                          </span>
                          {msg.strategyDossier.feeWaivers.savingsNote && (
                            <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100/90 border border-amber-300/70 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                              🛡️ {msg.strategyDossier.feeWaivers.savingsNote}
                            </span>
                          )}
                        </div>
                        <h4 className="font-black text-xs sm:text-[13px] text-slate-900 leading-snug">
                          {msg.strategyDossier.feeWaivers.title?.replace(/^(2\.\s*|Second Saving Strategy:\s*|Second Saving Trick:\s*)/i, "") || "Hidden Fees & Tax Shield"}
                        </h4>
                        <p className="text-[11px] sm:text-xs text-slate-700 font-medium leading-relaxed">
                          {msg.strategyDossier.feeWaivers.description}
                        </p>
                      </div>
                    )}

                    {/* Strategy 3 / Trick #3 */}
                    {msg.strategyDossier.entitlements && (
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/30 border border-emerald-200/80 shadow-xs space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-black text-[10px] tracking-wider uppercase flex items-center gap-1 shadow-2xs">
                            <CreditCard className="w-3 h-3 text-white" />
                            Third Saving Trick
                          </span>
                          {msg.strategyDossier.entitlements.savingsNote && (
                            <span className="text-[10px] font-extrabold text-emerald-900 bg-emerald-100/90 border border-emerald-300/70 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                              ⚡ {msg.strategyDossier.entitlements.savingsNote}
                            </span>
                          )}
                        </div>
                        <h4 className="font-black text-xs sm:text-[13px] text-slate-900 leading-snug">
                          {msg.strategyDossier.entitlements.title?.replace(/^(3\.\s*|Third Saving Strategy:\s*|Third Saving Trick:\s*)/i, "") || "VIP Perks & Entitlements"}
                        </h4>
                        <p className="text-[11px] sm:text-xs text-slate-700 font-medium leading-relaxed">
                          {msg.strategyDossier.entitlements.description}
                        </p>
                      </div>
                    )}

                    {/* Verified Official Links / Promo Codes */}
                    {Array.isArray(msg.strategyDossier.verifiedActions) && msg.strategyDossier.verifiedActions.length > 0 && (
                      <div className="p-3 rounded-2xl bg-slate-900 text-white space-y-2">
                        <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                          Verified Channels &amp; Codes:
                        </div>
                        <div className="space-y-1.5">
                          {msg.strategyDossier.verifiedActions.map((act, aIdx) => (
                            <div key={aIdx} className="flex items-center justify-between text-xs bg-white/10 p-2 rounded-xl">
                              <span className="font-extrabold truncate text-white">{act.label}</span>
                              {act.promoCode ? (
                                <button
                                  type="button"
                                  onClick={() => handleCopy(act.promoCode)}
                                  className="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-black text-[10px] flex items-center gap-1 hover:bg-amber-300 transition-colors"
                                >
                                  {copiedCode === act.promoCode ? <Check className="w-3 h-3 text-emerald-800" /> : <Copy className="w-3 h-3" />}
                                  <span>{copiedCode === act.promoCode ? "Copied!" : act.promoCode}</span>
                                </button>
                              ) : act.url ? (
                                <a
                                  href={act.url}
                                  target="_blank"
                                  rel="noopener noreferrer nofollow"
                                  className="px-2.5 py-1 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white font-extrabold text-[10px] flex items-center gap-1 transition-colors"
                                >
                                  <span>Open Channel</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                )}

                {/* On-Demand Confirmation Radar Pill */}
                {msg.onDemandBrand && (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 text-white space-y-2.5">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                      <span className="text-[11px] font-black text-indigo-200">
                        ShopSmart AI Live Radar
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                      Would you like ShopSmart AI to perform a real-time web scan across official booking channels to uncover live promo codes and bank deals for <strong>{msg.onDemandBrand}</strong>?
                    </p>
                    <button
                      type="button"
                      disabled={chatScanningBrand === msg.onDemandBrand}
                      onClick={() => handleTriggerOnDemandInChat(msg.onDemandBrand)}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-black text-[11px] flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95 disabled:opacity-50"
                    >
                      {chatScanningBrand === msg.onDemandBrand ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Scanning {msg.onDemandBrand}...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5 text-amber-300" />
                          <span>⚡ Yes, Scan Live Deals for {msg.onDemandBrand}</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* On-Demand Discovered Deals Results */}
                {Array.isArray(msg.onDemandDiscoveredDeals) && msg.onDemandDiscoveredDeals.length > 0 && (
                  <div className="space-y-2 pt-1">
                    {msg.onDemandDiscoveredDeals.map((deal) => {
                      const isCopied = copiedCode === deal.promoCode;
                      return (
                        <div key={deal.id} className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-xs text-slate-900">{deal.title}</span>
                            <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                              {deal.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 font-medium leading-snug">{deal.tagline}</p>
                          <div className="flex flex-wrap items-center justify-between pt-1 gap-2">
                            <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                              💰 {deal.estimatedSavings}
                            </span>
                            <div className="flex items-center gap-1.5">
                              {deal.directUrl && (
                                <a
                                  href={deal.directUrl}
                                  target="_blank"
                                  rel="noopener noreferrer nofollow"
                                  className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-[10px] flex items-center gap-1 transition-colors"
                                >
                                  <span>Visit Official Portal</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                              <button
                                type="button"
                                onClick={() => handleCopy(deal.promoCode)}
                                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                <span>{isCopied ? "COPIED!" : deal.promoCode}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Suggested Follow-up Quick Action Chips */}
                {Array.isArray(msg.suggestedActions) && msg.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.suggestedActions.map((action, actIdx) => (
                      <button
                        key={actIdx}
                        type="button"
                        onClick={() => handleSend(action)}
                        className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-2xs transition-all active:scale-95 cursor-pointer text-left"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 max-w-[85%] mr-auto">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs font-semibold text-slate-600 shadow-2xs flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                <span>Analyzing statutory fare rules, fee waivers &amp; bank privileges...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-200/90 bg-white shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 bg-slate-50 rounded-2xl border border-slate-200 p-1.5 px-3 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="e.g. Booking flights to Goa with luggage, or hotel in London..."
              maxLength={400}
              className="flex-1 bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden font-medium py-1"
            />

            <button
              type="button"
              onClick={toggleListening}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                isListening
                  ? "bg-rose-600 text-white animate-pulse"
                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
              }`}
              title={isListening ? "Listening..." : "Speak Query"}
            >
              <Mic className="w-4 h-4" />
            </button>

            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="p-2 sm:px-3.5 sm:py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-xs"
            >
              <span className="hidden sm:inline">Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium px-2 pt-1.5">
            <span>Market-verified fare strategies • Zero false pricing</span>
            <span>400 char limit</span>
          </div>
        </div>

      </div>
    </div>
  );
}
