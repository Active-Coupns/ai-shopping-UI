"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, MessageSquare, Send, CheckCircle2, AlertCircle, LifeBuoy, 
  Clock, ShieldAlert, Sparkles, ChevronRight, HelpCircle
} from "lucide-react";
import { useUser } from "@clerk/nextjs";

export default function SupportTicketModal({ isOpen, onClose }) {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("new"); // new | my_tickets
  const [category, setCategory] = useState("general");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [myTickets, setMyTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);

  useEffect(() => {
    if (user) {
      setUserEmail(user.primaryEmailAddress?.emailAddress || "");
      setUserName(user.fullName || user.firstName || "");
    }
  }, [user]);

  const fetchMyTickets = async () => {
    setLoadingTickets(true);
    try {
      let storedIds = [];
      try {
        const raw = localStorage.getItem("shopsmart_my_ticket_ids");
        if (raw) storedIds = JSON.parse(raw);
      } catch (e) {}

      const params = new URLSearchParams();
      params.set("mine", "true");
      if (userEmail) params.set("email", userEmail);
      if (storedIds.length > 0) params.set("ids", storedIds.join(","));

      const res = await fetch(`/api/support/tickets?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setMyTickets(data.tickets || []);
      }
    } catch (e) {
      console.warn("Failed to load tickets:", e);
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    if (isOpen && activeTab === "my_tickets") {
      fetchMyTickets();
    }
  }, [isOpen, activeTab, userEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      setErrorMsg("Please fill in both subject and message.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: userEmail || "guest@shopsmart.com",
          userName: userName || "Valued Shopper",
          category,
          subject,
          message
        })
      });

      const data = await res.json();
      if (data.success && data.ticket) {
        setSubmitSuccess(true);
        try {
          const raw = localStorage.getItem("shopsmart_my_ticket_ids");
          const existingIds = raw ? JSON.parse(raw) : [];
          if (!existingIds.includes(data.ticket.id)) {
            localStorage.setItem("shopsmart_my_ticket_ids", JSON.stringify([data.ticket.id, ...existingIds]));
          }
        } catch (e) {}
        setSubject("");
        setMessage("");
        setTimeout(() => {
          setSubmitSuccess(false);
          setActiveTab("my_tickets");
          fetchMyTickets();
        }, 1500);
      } else {
        setErrorMsg(data.error || "Failed to submit ticket.");
      }
    } catch (err) {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-2xl relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                <LifeBuoy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white leading-tight">Customer Support & Helpdesk</h3>
                <p className="text-xs text-slate-400">Raise issues, subscription questions, or report bugs</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sub Navigation */}
          <div className="flex gap-2 p-1 bg-slate-950 rounded-xl mb-5 border border-slate-800/80">
            <button
              type="button"
              onClick={() => setActiveTab("new")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === "new"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Raise New Ticket
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("my_tickets")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "my_tickets"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>My Past Tickets</span>
              {myTickets.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-indigo-500/30 text-indigo-300 text-[10px]">
                  {myTickets.length}
                </span>
              )}
            </button>
          </div>

          {/* TAB 1: RAISE TICKET FORM */}
          {activeTab === "new" && (
            <div>
              {submitSuccess ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-1">Ticket Submitted Successfully!</h4>
                  <p className="text-xs text-slate-400 max-w-xs">
                    Our support engineers have received your inquiry. You can track admin replies under &apos;My Past Tickets&apos;.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Category Selection */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Issue Category
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: "billing", label: "💳 Subscription", tag: "Billing" },
                        { id: "vton", label: "👗 VTON AI", tag: "Trial Room" },
                        { id: "coupons", label: "🏷️ Coupons", tag: "Discounts" },
                        { id: "technical", label: "🐛 Tech Bug", tag: "General" }
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategory(cat.id)}
                          className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                            category === cat.id
                              ? "bg-indigo-600/20 border-indigo-500 text-indigo-300"
                              : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                          }`}
                        >
                          <div className="truncate">{cat.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. VTON try-on failed or subscription inquiry"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-600 focus:outline-hidden focus:border-indigo-500"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Detailed Message
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please describe what happened, your order/trial ID, or question..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-600 focus:outline-hidden focus:border-indigo-500 resize-none"
                    />
                  </div>

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 text-xs font-bold text-white transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? "Submitting..." : "Submit Support Ticket"}</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: MY TICKETS LIST */}
          {activeTab === "my_tickets" && (
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 scrollbar-none">
              {loadingTickets ? (
                <div className="py-12 text-center text-xs text-slate-500">Loading your tickets...</div>
              ) : myTickets.length === 0 ? (
                <div className="py-12 text-center">
                  <HelpCircle className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">You haven&apos;t raised any support tickets yet.</p>
                </div>
              ) : (
                myTickets.map((t) => (
                  <div key={t.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-white truncate">{t.subject}</span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase shrink-0 ${
                        t.status === "resolved" 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : t.status === "in_progress"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        {t.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{t.message}</p>
                    
                    {/* Admin Replies */}
                    {t.replies?.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-800/80 space-y-1.5">
                        <span className="text-[10px] font-bold text-indigo-400 block">Support Team Response:</span>
                        {t.replies.map((r, rIdx) => (
                          <div key={rIdx} className="p-2 rounded-lg bg-indigo-950/40 border border-indigo-500/20 text-[11px] text-slate-200">
                            {r.message}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
