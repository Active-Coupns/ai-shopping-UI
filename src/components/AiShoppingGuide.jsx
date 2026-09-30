"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Bot, User, CheckCircle, ArrowRight, Zap, RefreshCw, X, ShieldCheck, Tag, ArrowLeft } from "lucide-react";

export default function AiShoppingGuide({ initialQuery = "", onExecuteSearch, onBackToSearch }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [customInputActive, setCustomInputActive] = useState(null);
  const [customAnswerText, setCustomAnswerText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentBlueprint, setCurrentBlueprint] = useState(null);
  const [activeCategory, setActiveCategory] = useState("");
  const [quickSuggestions, setQuickSuggestions] = useState([]);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentQuestions, currentBlueprint]);

  // Reset and initialize when a new query is passed
  useEffect(() => {
    if (!initialQuery) return;

    setSelectedAnswers({});
    setCurrentBlueprint(null);
    setCurrentQuestions([]);
    setCustomInputActive(null);
    setCustomAnswerText("");
    setQuickSuggestions([]);

    const startGuide = async () => {
      setIsLoading(true);
      
      setMessages([
        { role: "user", text: initialQuery }
      ]);

      try {
        const res = await fetch("/api/ai/guide", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: initialQuery, queryContext: initialQuery })
        });
        const data = await res.json();

        setMessages([
          { role: "user", text: initialQuery },
          { 
            role: "assistant", 
            text: data.content, 
            intent: data.intent,
            action: data.action 
          }
        ]);

        if (data.questions && data.questions.length > 0) {
          setCurrentQuestions(data.questions);
          setActiveCategory(data.category || "");
        }

        if (data.quickSuggestions && data.quickSuggestions.length > 0) {
          setQuickSuggestions(data.quickSuggestions);
        }
      } catch (err) {
        console.error("AI Guide Init Error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    startGuide();
  }, [initialQuery]);

  const handleSelectOption = async (questionId, option) => {
    const updatedAnswers = { ...selectedAnswers, [questionId]: option };
    setSelectedAnswers(updatedAnswers);
    setCustomInputActive(null);
    setCustomAnswerText("");

    setIsLoading(true);
    try {
      const res = await fetch("/api/ai/guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: initialQuery,
          answers: updatedAnswers,
          queryContext: initialQuery,
          conversationHistory: messages
        })
      });
      const data = await res.json();

      if (data.blueprint) {
        setCurrentBlueprint(data.blueprint);
        setMessages(prev => [
          ...prev,
          { role: "assistant", text: data.content, blueprint: data.blueprint, action: data.action }
        ]);
        setCurrentQuestions([]);
        setQuickSuggestions([]);
      } else if (data.content && !data.questions) {
        setMessages(prev => [
          ...prev,
          { role: "assistant", text: data.content }
        ]);
      }
    } catch (err) {
      console.error("Failed sending answer to AI:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomSubmit = (questionId) => {
    if (!customAnswerText.trim()) return;
    handleSelectOption(questionId, customAnswerText.trim());
  };

  const submitText = async (textToSend) => {
    if (!textToSend.trim()) return;

    const userText = textToSend.trim();
    setInputValue("");
    setMessages(prev => [...prev, { role: "user", text: userText }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          queryContext: initialQuery,
          answers: selectedAnswers,
          conversationHistory: messages
        })
      });
      const data = await res.json();

      setMessages(prev => [
        ...prev,
        { role: "assistant", text: data.content, intent: data.intent, blueprint: data.blueprint, action: data.action }
      ]);

      if (data.blueprint) {
        setCurrentBlueprint(data.blueprint);
        setCurrentQuestions([]);
        setQuickSuggestions([]);
      } else if (data.questions && data.questions.length > 0) {
        setCurrentQuestions(data.questions);
        setSelectedAnswers({});
        setCurrentBlueprint(null);
        setActiveCategory(data.category || "");
        if (data.quickSuggestions) setQuickSuggestions(data.quickSuggestions);
      }
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    submitText(inputValue);
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-6 text-slate-900">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between mb-4 px-2">
        <button
          onClick={onBackToSearch}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Search</span>
        </button>

        <button
          onClick={() => onExecuteSearch && onExecuteSearch(initialQuery)}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline transition-colors cursor-pointer"
        >
          Skip Questions & Show Deals Directly →
        </button>
      </div>

      {/* Main Guide Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-white border border-slate-200/90 shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-6 py-4.5 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
              <Bot className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">AI Shopping Assistant</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-[10px] font-extrabold text-emerald-300">
                  {activeCategory || "Active"}
                </span>
              </div>
              <p className="text-[11px] text-slate-300">Target: &ldquo;{initialQuery}&rdquo;</p>
            </div>
          </div>
        </div>

        {/* Conversation Body */}
        <div className="p-6 max-h-[520px] overflow-y-auto space-y-4 bg-slate-50/40">
          {messages.map((m, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-2.5 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs ${
                m.role === "user" ? "bg-indigo-600 text-white" : "bg-slate-900 text-white"
              }`}>
                {m.role === "user" ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5 text-indigo-400" />}
              </div>

              <div className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                m.role === "user"
                  ? "bg-indigo-600 text-white rounded-tr-none font-medium"
                  : "bg-white border border-slate-200 text-slate-800 rounded-tl-none font-medium shadow-xs"
              }`}>
                <div className="whitespace-pre-line">{m.text}</div>

                {m.action && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100">
                    <button
                      onClick={() => onExecuteSearch && onExecuteSearch(m.action.query)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all cursor-pointer shadow-xs"
                    >
                      <span>{m.action.buttonText || "View Deals →"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {/* Quick Suggestions Chips */}
          {quickSuggestions && quickSuggestions.length > 0 && !currentBlueprint && (
            <div className="flex flex-wrap gap-1.5 pl-9">
              {quickSuggestions.map((sug, sIdx) => (
                <button
                  key={sIdx}
                  onClick={() => submitText(sug)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 border border-slate-200 shadow-2xs transition-all cursor-pointer"
                >
                  💡 {sug}
                </button>
              ))}
            </div>
          )}

          {/* Dynamic Interactive Question Cards */}
          {currentQuestions && currentQuestions.length > 0 && (
            <div className="space-y-3.5 pt-2">
              {currentQuestions.map((q, qIdx) => {
                const isAnswered = !!selectedAnswers[q.id];

                return (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4.5 rounded-2xl border transition-all ${
                      isAnswered
                        ? "bg-emerald-50/50 border-emerald-200"
                        : "bg-white border-slate-200 shadow-xs"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                        <span className="w-4.5 h-4.5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-extrabold">
                          {qIdx + 1}
                        </span>
                        {q.title}
                      </span>
                      {isAnswered && (
                        <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{selectedAnswers[q.id]}</span>
                        </span>
                      )}
                    </div>

                    {/* Options Pills */}
                    <div className="flex flex-wrap gap-2 pt-0.5">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = selectedAnswers[q.id] === opt;
                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleSelectOption(q.id, opt)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                              isSelected
                                ? "bg-indigo-600 text-white shadow-xs"
                                : "bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}

                      {/* Other Option */}
                      <button
                        onClick={() => setCustomInputActive(customInputActive === q.id ? null : q.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                          customInputActive === q.id
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-white hover:bg-slate-100 text-slate-600 border-dashed border-slate-300"
                        }`}
                      >
                        ✍️ Other
                      </button>
                    </div>

                    {/* Custom Input */}
                    {customInputActive === q.id && (
                      <div className="flex items-center gap-2 mt-2.5">
                        <input
                          type="text"
                          placeholder="Type your specific requirement..."
                          value={customAnswerText}
                          onChange={(e) => setCustomAnswerText(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleCustomSubmit(q.id)}
                          className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                          autoFocus
                        />
                        <button
                          onClick={() => handleCustomSubmit(q.id)}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 cursor-pointer"
                        >
                          Confirm
                        </button>
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {/* ⚡ Instant Final Search CTA Bar when 1 or more options are picked */}
              {Object.keys(selectedAnswers).length > 0 && !currentBlueprint && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-2"
                >
                  <button
                    type="button"
                    onClick={() => {
                      const refinedStr = `${initialQuery} ${Object.values(selectedAnswers).join(" ")}`.replace(/[^\w\s₹]/g, " ").trim();
                      onExecuteSearch && onExecuteSearch(refinedStr);
                    }}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs md:text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/20 transition-all cursor-pointer active:scale-98"
                  >
                    <Zap className="w-4 h-4 fill-white text-white animate-pulse" />
                    <span>Search Best Deals for Selected Preferences ({Object.keys(selectedAnswers).length} Selected) →</span>
                  </button>
                </motion.div>
              )}
            </div>
          )}

          {/* Shopper Blueprint Summary Card */}
          {currentBlueprint && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-indigo-400/25 space-y-3.5"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h4 className="font-bold text-xs tracking-wider text-white uppercase">
                    {currentBlueprint.title || "SHOPPER BLUEPRINT"}
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-300">
                  Requirements Matched
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(currentBlueprint.criteria || {}).map(([k, v], idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                    <span className="text-[10px] uppercase font-bold text-indigo-300 block">{k}</span>
                    <span className="text-white font-medium">{v}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onExecuteSearch && onExecuteSearch(currentBlueprint.refinedQuery || currentBlueprint.targetQuery)}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs md:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-slate-950 text-slate-950" />
                <span>Search Best Multi-Store Deals for this Blueprint</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-indigo-600 font-bold p-1">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>AI is preparing your personalized deals...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type anything (e.g. 'I need for beach party', 'prefer linen fabric')..."
            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
