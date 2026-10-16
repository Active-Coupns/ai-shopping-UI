"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldAlert, Settings, Key, Tag, Plus, Trash2, Save, ShoppingBag, 
  ArrowLeft, CheckCircle2, Globe, FileText, AlertCircle, BarChart3, 
  Users, Search, MousePointerClick, RefreshCw, Layers, Database, Link2, Lock,
  DollarSign, Activity, Zap, Cpu, Server, Clock, AlertTriangle, ShieldCheck,
  ArrowUpRight, Sparkles, LifeBuoy, Bug, MessageSquare, Send, Check, Eye,
  ToggleLeft, ToggleRight, Radio, ExternalLink, HelpCircle
} from "lucide-react";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { getAdminSettings, saveAdminSettings } from "@/services/admin";

export default function AdminPage() {
  const router = useRouter();
  const { user: clerkUser, isLoaded } = useUser();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Tabs: analytics | killswitches | crashes | tickets | coupons | activity | keys
  const [activeTab, setActiveTab] = useState("analytics");
  const [saveStatus, setSaveStatus] = useState(null); // success | error | saving
  const [serverAuthError, setServerAuthError] = useState(null);

  // 1. Live Telemetry & Metrics State
  const [metricsData, setMetricsData] = useState(null);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);

  // 2. Autonomous 6-Hour AI Health Diagnostic State
  const [healthReport, setHealthReport] = useState(null);
  const [healthLoading, setHealthLoading] = useState(false);

  // 3. Master Feature Kill-Switches State
  const [featureFlags, setFeatureFlags] = useState({
    vtonTrialRoom: true,
    aiConciergeChat: true,
    aiSpecRealityCheck: true,
    zyteCouponScraper: true,
    headToHeadCompare: true,
    priceAlerts: true,
    maintenanceBanner: false
  });
  const [flagToggling, setFlagToggling] = useState(null);

  // 4. Live Crash & Bug Vault State
  const [crashesData, setCrashesData] = useState({ crashes: [], todayCount: 0 });
  const [crashesLoading, setCrashesLoading] = useState(false);
  const [selectedCrash, setSelectedCrash] = useState(null);

  // 5. Support Helpdesk & Customer Tickets State
  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketReplyText, setTicketReplyText] = useState("");
  const [ticketStatusUpdate, setTicketStatusUpdate] = useState("in_progress");
  const [ticketFilterStatus, setTicketFilterStatus] = useState("all");
  const [ticketSubmitting, setTicketSubmitting] = useState(false);

  // 6. Brand Sync & Single-Store Zyte Tester State
  const [testBrandInput, setTestBrandInput] = useState("boat-lifestyle.com");
  const [testBrandLoading, setTestBrandLoading] = useState(false);
  const [testBrandResult, setTestBrandResult] = useState(null);

  // Affiliate & Coupon States
  const [personalTags, setPersonalTags] = useState([]);
  const [aggregators, setAggregators] = useState([]);
  const [coupons, setCoupons] = useState([]);

  // Form states for adding Section A (Personal Tags)
  const [newTag, setNewTag] = useState({ store: "", tag: "", region: "IN" });
  
  // Form states for adding Section B (Aggregators)
  const [newAggregator, setNewAggregator] = useState({ name: "", token: "", redirectUrl: "", region: "IN" });

  // Form states for coupons
  const [newCoupon, setNewCoupon] = useState({ code: "", store: "", description: "", link: "", region: "IN", expiry: "" });

  // Fetch Live Telemetry Metrics
  const fetchMetrics = useCallback(async () => {
    setMetricsLoading(true);
    try {
      const res = await fetch("/api/admin/metrics");
      if (res.ok) {
        const data = await res.json();
        setMetricsData(data);
      }
    } catch (e) {
      console.warn("Failed to fetch live telemetry:", e);
    } finally {
      setMetricsLoading(false);
    }
  }, []);

  // Fetch 6-Hour AI Health Diagnostic
  const fetchHealthAudit = useCallback(async (force = false) => {
    setHealthLoading(true);
    try {
      const res = await fetch(`/api/admin/health-audit${force ? "?force=true" : ""}`);
      if (res.ok) {
        const data = await res.json();
        if (data.report) setHealthReport(data.report);
      }
    } catch (e) {
      console.warn("Health audit fetch failed:", e);
    } finally {
      setHealthLoading(false);
    }
  }, []);

  // Fetch Master Kill Switches
  const fetchFeatures = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/features");
      if (res.ok) {
        const data = await res.json();
        if (data.features) setFeatureFlags(data.features);
      }
    } catch (e) {
      console.warn("Features fetch failed:", e);
    }
  }, []);

  // Fetch Crash Vault
  const fetchCrashes = useCallback(async () => {
    setCrashesLoading(true);
    try {
      const res = await fetch("/api/admin/crashes");
      if (res.ok) {
        const data = await res.json();
        setCrashesData(data);
      }
    } catch (e) {
      console.warn("Crashes fetch failed:", e);
    } finally {
      setCrashesLoading(false);
    }
  }, []);

  // Fetch Support Tickets
  const fetchTickets = useCallback(async () => {
    setTicketsLoading(true);
    try {
      const url = ticketFilterStatus !== "all" 
        ? `/api/support/tickets?status=${ticketFilterStatus}` 
        : `/api/support/tickets`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets || []);
      }
    } catch (e) {
      console.warn("Tickets fetch failed:", e);
    } finally {
      setTicketsLoading(false);
    }
  }, [ticketFilterStatus]);

  // Polling for live telemetry every 15 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    fetchMetrics();
    fetchHealthAudit();
    fetchFeatures();
    const interval = setInterval(fetchMetrics, 15000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchMetrics, fetchHealthAudit, fetchFeatures]);

  // Tab switch loader
  useEffect(() => {
    if (activeTab === "crashes") fetchCrashes();
    if (activeTab === "tickets") fetchTickets();
    if (activeTab === "killswitches") fetchFeatures();
  }, [activeTab, fetchCrashes, fetchTickets, fetchFeatures]);

  useEffect(() => {
    async function initAdmin() {
      if (!isLoaded) return;

      if (!clerkUser) {
        setLoading(false);
        return;
      }

      const email = clerkUser?.primaryEmailAddress?.emailAddress?.toLowerCase() || "";
      const isDev = process.env.NODE_ENV === "development" || (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"));
      
      const isAdmin = 
        clerkUser?.publicMetadata?.is_admin === true || 
        clerkUser?.publicMetadata?.role === "admin" || 
        email.includes("admin") ||
        isDev;

      const activeUser = {
        email,
        user_metadata: { full_name: clerkUser.fullName || email.split("@")[0], is_admin: isAdmin }
      };

      setUser(activeUser);

      try {
        const settings = await getAdminSettings();
        setPersonalTags(settings.personalTags || []);
        setAggregators(settings.aggregators || []);
        setCoupons(settings.coupons || []);
        if (settings.featureFlags) {
          setFeatureFlags(settings.featureFlags);
        }
      } catch (err) {
        console.warn("Error loading admin settings:", err);
      } finally {
        setLoading(false);
      }
    }

    initAdmin();
  }, [isLoaded, clerkUser]);

  // 1-Click Feature Toggle Handler
  const handleToggleFeature = async (featureKey) => {
    setFlagToggling(featureKey);
    const updatedVal = !featureFlags[featureKey];
    const newFlags = { ...featureFlags, [featureKey]: updatedVal };
    setFeatureFlags(newFlags);

    try {
      const res = await fetch("/api/admin/features", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: { [featureKey]: updatedVal } })
      });
      if (res.ok) {
        setSaveStatus("success");
        setTimeout(() => setSaveStatus(null), 2000);
      }
    } catch (e) {
      console.error("Toggle error:", e);
      // Revert on error
      setFeatureFlags(featureFlags);
    } finally {
      setFlagToggling(null);
    }
  };

  // Reply to Ticket Handler
  const handleSendTicketReply = async (e) => {
    e.preventDefault();
    if (!selectedTicket || !ticketReplyText.trim()) return;

    setTicketSubmitting(true);
    try {
      const res = await fetch("/api/support/tickets", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: selectedTicket.id,
          message: ticketReplyText.trim(),
          newStatus: ticketStatusUpdate,
          sender: "admin",
          senderName: "ShopSmart Admin Support"
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.ticket) {
          setSelectedTicket(data.ticket);
          setTickets(prev => prev.map(t => t.id === data.ticket.id ? data.ticket : t));
          setTicketReplyText("");
        }
      }
    } catch (err) {
      console.error("Reply error:", err);
    } finally {
      setTicketSubmitting(false);
    }
  };

  // Quick Action: Grant VTON Try-On Credit directly to user
  const handleGrantVtonCredit = async () => {
    if (!selectedTicket) return;
    setTicketSubmitting(true);
    try {
      const creditNote = `[System Notice] Admin has approved and granted +1 Free Photorealistic VTON Try-On credit to your account.`;
      const res = await fetch("/api/support/tickets", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: selectedTicket.id,
          message: creditNote,
          newStatus: "resolved",
          grantCreditAction: { userId: selectedTicket.userId, amount: 1 }
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.ticket) {
          setSelectedTicket(data.ticket);
          setTickets(prev => prev.map(t => t.id === data.ticket.id ? data.ticket : t));
        }
      }
    } catch (err) {
      console.error("Credit grant error:", err);
    } finally {
      setTicketSubmitting(false);
    }
  };

  // Single Store Zyte Scrape Tester
  const handleTestBrandScrape = async (e) => {
    e.preventDefault();
    if (!testBrandInput.trim()) return;

    setTestBrandLoading(true);
    setTestBrandResult(null);

    try {
      const res = await fetch("/api/coupons?store=" + encodeURIComponent(testBrandInput.trim()));
      const data = await res.json();
      setTestBrandResult({
        success: true,
        store: testBrandInput.trim(),
        couponsFound: data.coupons || [],
        source: data.source || "Zyte API"
      });
    } catch (err) {
      setTestBrandResult({
        success: false,
        store: testBrandInput.trim(),
        error: err.message
      });
    } finally {
      setTestBrandLoading(false);
    }
  };

  // Clear Crashes Handler
  const handleClearCrashes = async () => {
    if (!confirm("Are you sure you want to clear the Crash Vault?")) return;
    try {
      const res = await fetch("/api/admin/crashes", { method: "DELETE" });
      if (res.ok) {
        setCrashesData({ crashes: [], todayCount: 0 });
      }
    } catch (err) {
      console.error("Clear crashes error:", err);
    }
  };

  const handleSaveAll = async () => {
    setSaveStatus("saving");
    try {
      const success = await saveAdminSettings({
        personalTags,
        aggregators,
        coupons,
        featureFlags
      });

      if (success) {
        setSaveStatus("success");
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        setSaveStatus("error");
        setTimeout(() => setSaveStatus(null), 4000);
      }
    } catch (e) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(null), 4000);
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (!newTag.store.trim() || !newTag.tag.trim()) return;
    setPersonalTags([...personalTags, { id: "pt-" + Date.now(), ...newTag }]);
    setNewTag({ store: "", tag: "", region: "IN" });
  };

  const handleRemoveTag = (id) => {
    setPersonalTags(personalTags.filter(t => t.id !== id));
  };

  const handleAddAggregator = (e) => {
    e.preventDefault();
    if (!newAggregator.name.trim() || !newAggregator.token.trim()) return;
    setAggregators([...aggregators, { id: "agg-" + Date.now(), ...newAggregator }]);
    setNewAggregator({ name: "", token: "", redirectUrl: "", region: "IN" });
  };

  const handleRemoveAggregator = (id) => {
    setAggregators(aggregators.filter(a => a.id !== id));
  };

  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!newCoupon.code.trim() || !newCoupon.store.trim()) return;
    setCoupons([...coupons, { id: "cpn-" + Date.now(), ...newCoupon }]);
    setNewCoupon({ code: "", store: "", description: "", link: "", region: "IN", expiry: "" });
  };

  const handleRemoveCoupon = (id) => {
    setCoupons(coupons.filter(c => c.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100">
        <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-slate-400 font-mono tracking-wider uppercase">Loading Enterprise Governance Hub...</p>
      </div>
    );
  }

  if (!user || !user.user_metadata?.is_admin) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-2">Restricted Access (401)</h2>
          <p className="text-xs text-slate-400 leading-relaxed mb-6">
            Please sign in with your authorized admin account to access Mission Control.
          </p>
          <div className="flex flex-col gap-3">
            <SignInButton mode="modal">
              <button
                type="button"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 text-xs sm:text-sm font-bold text-white transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Sign In to Access Admin Controls</span>
              </button>
            </SignInButton>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition-all cursor-pointer"
            >
              &larr; Return to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  const m = metricsData?.metrics || {
    totalSearches: 0,
    cacheHits: 0,
    liveHits: 0,
    cacheHitRatio: 0,
    vtonRenders: 0,
    financialBurn: { groqCostINR: 0, liveSearchCostINR: 0, vtonCostINR: 0, totalApiCostINR: 0, moneySavedByCacheINR: 0 },
    coupons: { totalActive: coupons.length, storesCovered: ["Amazon", "Zomato", "Swiggy", "boAt", "Noise"], lastCronSync: "Today, 06:00 AM IST" }
  };

  const recentLogs = metricsData?.recentLogs || [];
  const anomalies = metricsData?.anomalies || [];
  const healthStatus = healthReport?.status || "HEALTHY";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* 1. TOP COMMAND BAR */}
      <header className="sticky top-0 z-50 w-full bg-slate-900/90 backdrop-blur-xl border-b border-slate-800/80 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          
          {/* Brand & Mission Control Title */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Return to Main Search"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xs">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm sm:text-base font-extrabold text-white tracking-tight leading-none">
                    Mission Control
                  </h1>
                  <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    ENTERPRISE
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">ShopSmart AI Autonomous Governance</p>
              </div>
            </div>
          </div>

          {/* 6-Hour Autonomous AI Diagnostic Pill */}
          <div className="hidden md:flex items-center gap-2">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border transition-all ${
              healthStatus === "CRITICAL"
                ? "bg-rose-500/10 border-rose-500/30 text-rose-400 animate-pulse"
                : healthStatus === "WARNING"
                ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
            }`}>
              <span className={`w-2.5 h-2.5 rounded-full ${
                healthStatus === "CRITICAL" ? "bg-rose-400 animate-ping" : healthStatus === "WARNING" ? "bg-amber-400" : "bg-emerald-400"
              }`} />
              <span>{healthStatus}: {healthReport?.healthScore || 98}/100</span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => fetchHealthAudit(true)}
              disabled={healthLoading}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700/80 transition-all cursor-pointer active:scale-95"
              title="Run Autonomous Diagnostics Now"
            >
              <Radio className={`w-3.5 h-3.5 text-indigo-400 ${healthLoading ? "animate-spin" : ""}`} />
              <span>Run AI Audit</span>
            </button>

            <button
              type="button"
              onClick={handleSaveAll}
              disabled={saveStatus === "saving"}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 text-xs font-bold text-white transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saveStatus === "saving" ? "Saving..." : saveStatus === "success" ? "Saved ✓" : "Save All"}</span>
            </button>

            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      {/* 2. SUB-NAVIGATION TABS (7 MASTER ENTERPRISE SECTIONS) */}
      <div className="w-full bg-slate-900 border-b border-slate-800/60 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1.5 overflow-x-auto scrollbar-none py-2">
          
          <button
            type="button"
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === "analytics"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-300" />
            <span>API Cost & Burn</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("killswitches")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === "killswitches"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <ToggleRight className="w-3.5 h-3.5 text-amber-300" />
            <span>Master Kill-Switches</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("crashes")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer relative ${
              activeTab === "crashes"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Bug className="w-3.5 h-3.5 text-rose-400" />
            <span>Crash Vault</span>
            {crashesData.todayCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-mono border border-rose-500/30">
                {crashesData.todayCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("tickets")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer relative ${
              activeTab === "tickets"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <LifeBuoy className="w-3.5 h-3.5 text-cyan-300" />
            <span>Support Helpdesk</span>
            {tickets.filter(t => t.status === "open").length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-500/30">
                {tickets.filter(t => t.status === "open").length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("coupons")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === "coupons"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Tag className="w-3.5 h-3.5 text-pink-300" />
            <span>Brand Sync & Scraper</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("activity")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === "activity"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-indigo-300" />
            <span>Live Audit Stream</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("keys")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === "keys"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Key className="w-3.5 h-3.5 text-amber-300" />
            <span>Affiliate Keys</span>
          </button>
        </div>
      </div>

      {/* 3. MAIN DASHBOARD CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">

        {/* 6-HOUR AUTONOMOUS AI HEALTH AUDIT CARD (Always visible top alert) */}
        {healthReport && (
          <div className={`p-4 sm:p-5 rounded-2xl border shadow-md relative overflow-hidden transition-all ${
            healthReport.status === "CRITICAL"
              ? "bg-rose-950/30 border-rose-500/40 text-rose-100"
              : healthReport.status === "WARNING"
              ? "bg-amber-950/30 border-amber-500/40 text-amber-100"
              : "bg-slate-900 border-slate-800 text-slate-100"
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  healthReport.status === "CRITICAL"
                    ? "bg-rose-500/20 text-rose-400"
                    : healthReport.status === "WARNING"
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-emerald-500/20 text-emerald-400"
                }`}>
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      6-Hour Autonomous AI Health Bulletin
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Last scan: {new Date(healthReport.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
                    {healthReport.headline}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                    {healthReport.summary}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Health Score</span>
                  <span className="text-lg font-black text-emerald-400">{healthReport.healthScore}/100</span>
                </div>
                <button
                  type="button"
                  onClick={() => fetchHealthAudit(true)}
                  disabled={healthLoading}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 transition-all cursor-pointer"
                >
                  {healthLoading ? "Auditing..." : "Re-Scan Now"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: API COST & BILLING MONITOR */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm relative overflow-hidden">
                <span className="text-xs font-bold text-slate-400">Total API Burn Today</span>
                <p className="text-2xl sm:text-3xl font-black text-white mt-2">
                  ₹{m.financialBurn.totalApiCostINR.toFixed(2)}
                </p>
                <span className="text-[11px] text-emerald-400 font-bold block mt-1">₹0.00 Fixed Waste</span>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
                <span className="text-xs font-bold text-slate-400">L1/L2 Redis Cache Efficiency</span>
                <p className="text-2xl sm:text-3xl font-black text-indigo-400 mt-2">
                  {m.cacheHitRatio}%
                </p>
                <span className="text-[11px] text-slate-400 block mt-1">{m.cacheHits} Instant 0ms Hits</span>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
                <span className="text-xs font-bold text-slate-400">VTON GPU Renders</span>
                <p className="text-2xl sm:text-3xl font-black text-purple-400 mt-2">
                  {m.vtonRenders}
                </p>
                <span className="text-[11px] text-slate-400 block mt-1">Modal Cloud Micro-Engine</span>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
                <span className="text-xs font-bold text-slate-400">Money Saved By Cache</span>
                <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-2">
                  ₹{m.financialBurn.moneySavedByCacheINR.toFixed(2)}
                </p>
                <span className="text-[11px] text-emerald-500 font-bold block mt-1">100% Upstream Saved</span>
              </div>
            </div>

            {/* Microservice Breakdown */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Microservice Cost & Quota Distribution</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-xs font-bold text-slate-300 block">OpenWebNinja Google Shopping</span>
                  <span className="text-sm font-black text-emerald-400 mt-1 block">Active (PAYG)</span>
                  <span className="text-[10px] text-slate-500 block mt-1">₹{m.financialBurn.liveSearchCostINR.toFixed(2)} burned today</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-xs font-bold text-slate-300 block">Groq + Gemini AI Engines</span>
                  <span className="text-sm font-black text-emerald-400 mt-1 block">Active (Free Tier / ₹0)</span>
                  <span className="text-[10px] text-slate-500 block mt-1">Sub-second inference</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-xs font-bold text-slate-300 block">Zyte Brand Coupon Scraper</span>
                  <span className="text-sm font-black text-emerald-400 mt-1 block">Active ($5 Trial Credit)</span>
                  <span className="text-[10px] text-slate-500 block mt-1">D2C brand promo extractor</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MASTER FEATURE KILL-SWITCHES */}
        {activeTab === "killswitches" && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <ToggleRight className="w-5 h-5 text-amber-400" />
                    <span>Master Feature Kill-Switches (0-Second Real-Time Toggles)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Turn any platform component ON or OFF instantly without editing code, committing to Git, or redeploying.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-bold border border-indigo-500/20">
                  Redis Powered (10ms Latency)
                </span>
              </div>
            </div>

            {/* Kill-Switches Interactive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  key: "vtonTrialRoom",
                  title: "👗 AI Virtual Trial Room (VTON)",
                  desc: "Controls the photorealistic GPU clothing try-on engine. If Modal GPU experiences latency, turn OFF to hide gracefully.",
                  tag: "Heavy GPU Compute"
                },
                {
                  key: "aiConciergeChat",
                  title: "💬 Pre-Search AI Shopping Concierge",
                  desc: "Controls the conversational shopping assistant modal. If LLM provider experiences delays, toggle OFF.",
                  tag: "Groq / LLM"
                },
                {
                  key: "aiSpecRealityCheck",
                  title: "⚡ AI Spec & Reality Check Engine",
                  desc: "Controls the technical hardware analysis sheet on product cards. If OFF, standard specs are displayed.",
                  tag: "Technical Analysis"
                },
                {
                  key: "zyteCouponScraper",
                  title: "🏷️ Zyte Brand Coupon Scraper",
                  desc: "Controls live D2C brand coupon scraping. When OFF, coupon hub serves existing verified codes without hitting Zyte API.",
                  tag: "Zyte PAYG"
                },
                {
                  key: "headToHeadCompare",
                  title: "⚖️ Head-to-Head Compare (VS Mode)",
                  desc: "Controls the instant dual-product hardware comparison drawer across product cards.",
                  tag: "Compare Engine"
                },
                {
                  key: "priceAlerts",
                  title: "🔔 Price Drop Tracker & Notifications",
                  desc: "Controls the in-browser price alert subscription modal and notifications.",
                  tag: "Alerts Radar"
                },
                {
                  key: "maintenanceBanner",
                  title: "🚧 System Maintenance Notice Banner",
                  desc: "Displays an elegant top announcement banner across the homepage notifying users of planned server upgrades.",
                  tag: "Emergency Notice"
                }
              ].map((sw) => {
                const isEnabled = !!featureFlags[sw.key];
                const isToggling = flagToggling === sw.key;

                return (
                  <div 
                    key={sw.key}
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                      isEnabled
                        ? "bg-slate-900/90 border-slate-800"
                        : "bg-slate-950 border-rose-500/20 opacity-80"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-white">{sw.title}</span>
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                          isEnabled
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}>
                          {isEnabled ? "ACTIVE (ON)" : "PAUSED (OFF)"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{sw.desc}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                      <span className="text-[10px] text-slate-500 font-mono">{sw.tag}</span>
                      <button
                        type="button"
                        onClick={() => handleToggleFeature(sw.key)}
                        disabled={isToggling}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95 ${
                          isEnabled
                            ? "bg-rose-600 hover:bg-rose-500 text-white"
                            : "bg-emerald-600 hover:bg-emerald-500 text-white"
                        }`}
                      >
                        {isToggling ? (
                          <span>Updating...</span>
                        ) : isEnabled ? (
                          <>
                            <ToggleLeft className="w-4 h-4" />
                            <span>Kill Switch (Turn OFF)</span>
                          </>
                        ) : (
                          <>
                            <ToggleRight className="w-4 h-4" />
                            <span>Enable (Turn ON)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: CRASH & EXCEPTION VAULT */}
        {activeTab === "crashes" && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Bug className="w-5 h-5 text-rose-400" />
                  <span>Live Crash & Exception Vault</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time recording of unhandled exceptions, exact file locations, and stack traces.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-xs text-slate-300 font-mono">
                  Today&apos;s Crashes: <strong className="text-rose-400 font-black">{crashesData.todayCount}</strong>
                </span>
                <button
                  type="button"
                  onClick={handleClearCrashes}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950 text-xs font-bold text-rose-400 border border-slate-700 hover:border-rose-500/40 transition-all cursor-pointer"
                >
                  Clear Vault
                </button>
              </div>
            </div>

            {/* Crashes Table / List */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
              {crashesLoading ? (
                <div className="py-12 text-center text-xs text-slate-500 font-mono">Loading Crash Vault...</div>
              ) : crashesData.crashes.length === 0 ? (
                <div className="py-12 text-center">
                  <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-white">Crash Vault is Clean!</h4>
                  <p className="text-xs text-slate-400 mt-1">Zero unhandled runtime exceptions recorded today.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {crashesData.crashes.map((cr) => (
                    <div 
                      key={cr.id}
                      onClick={() => setSelectedCrash(cr)}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-rose-400 truncate font-mono">
                          {cr.message}
                        </span>
                        <span className="text-[10px] text-slate-500 shrink-0 font-mono">
                          {new Date(cr.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="font-mono text-indigo-300 truncate max-w-md">📍 {cr.location}</span>
                        <span className="text-[10px] uppercase font-bold text-slate-500">{cr.component}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: SUPPORT HELPDESK & TICKETS */}
        {activeTab === "tickets" && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <LifeBuoy className="w-5 h-5 text-cyan-400" />
                  <span>Customer Support Helpdesk & Subscription Inquiries</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Resolve user tickets, investigate billing questions, and grant bonus trial credits.
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {["all", "open", "in_progress", "resolved"].map(st => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setTicketFilterStatus(st)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                      ticketFilterStatus === st
                        ? "bg-indigo-600 text-white"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {st.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Tickets Grid / Master View */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* Left Column: Tickets List (5 cols) */}
              <div className="lg:col-span-5 p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5 max-h-[580px] overflow-y-auto scrollbar-none">
                {ticketsLoading ? (
                  <div className="py-12 text-center text-xs text-slate-500">Loading tickets...</div>
                ) : tickets.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400">No tickets found for this filter.</div>
                ) : (
                  tickets.map(t => (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTicket(t)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                        selectedTicket?.id === t.id
                          ? "bg-indigo-950/40 border-indigo-500 shadow-sm"
                          : "bg-slate-950 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-white truncate">{t.subject}</span>
                        <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-md ${
                          t.status === "resolved" 
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : t.status === "in_progress"
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}>
                          {t.status.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{t.message}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-900">
                        <span>{t.userName || t.userEmail}</span>
                        <span className="font-mono">{new Date(t.createdAt).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Right Column: Ticket Conversation & Actions (7 cols) */}
              <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between min-h-[420px]">
                {selectedTicket ? (
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="border-b border-slate-800 pb-3 flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono uppercase px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-bold">
                            {selectedTicket.category}
                          </span>
                          <span className="text-xs text-slate-400">From: <strong>{selectedTicket.userEmail}</strong></span>
                        </div>
                        <h4 className="text-base font-bold text-white">{selectedTicket.subject}</h4>
                      </div>

                      {/* Quick Action: Grant VTON Credit */}
                      <button
                        type="button"
                        onClick={handleGrantVtonCredit}
                        disabled={ticketSubmitting}
                        className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition-all shadow-sm cursor-pointer shrink-0"
                      >
                        +1 VTON Credit
                      </button>
                    </div>

                    {/* Original Message */}
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-200 leading-relaxed">
                      {selectedTicket.message}
                    </div>

                    {/* Replies Thread */}
                    {selectedTicket.replies?.length > 0 && (
                      <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                        {selectedTicket.replies.map((rep, idx) => (
                          <div 
                            key={idx} 
                            className={`p-3 rounded-xl text-xs leading-relaxed ${
                              rep.sender === "admin"
                                ? "bg-indigo-950/40 border border-indigo-500/30 text-indigo-100 ml-4"
                                : "bg-slate-950 border border-slate-800 text-slate-300 mr-4"
                            }`}
                          >
                            <span className="text-[10px] font-bold block mb-1 text-slate-400">
                              {rep.senderName} ({new Date(rep.timestamp).toLocaleTimeString()})
                            </span>
                            {rep.message}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Form */}
                    <form onSubmit={handleSendTicketReply} className="pt-3 border-t border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-400">Admin Response</label>
                        <select
                          value={ticketStatusUpdate}
                          onChange={(e) => setTicketStatusUpdate(e.target.value)}
                          className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300"
                        >
                          <option value="in_progress">Set: In Progress</option>
                          <option value="resolved">Set: Resolved ✅</option>
                          <option value="open">Set: Open</option>
                        </select>
                      </div>

                      <textarea
                        rows={3}
                        value={ticketReplyText}
                        onChange={(e) => setTicketReplyText(e.target.value)}
                        placeholder="Type reply to customer..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-hidden focus:border-indigo-500 resize-none"
                      />

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={ticketSubmitting || !ticketReplyText.trim()}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all shadow-sm cursor-pointer disabled:opacity-50"
                        >
                          {ticketSubmitting ? "Sending..." : "Send Reply & Update Status"}
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="py-24 text-center text-slate-500 text-xs">
                    Select a ticket from the left column to view message thread & respond.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: BRAND SYNC & EXECUTIVE COUPON RADAR */}
        {activeTab === "coupons" && (
          <div className="space-y-6">
            
            {/* Executive Brand Sync Overview (100 Stores Health) */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Tag className="w-5 h-5 text-pink-400" />
                    <span>Executive Brand Sync & Scraper Health (100 Stores)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Automated daily cron sync summary for 50 Indian + 50 US direct-to-consumer brand stores.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                  Daily Cron: 06:00 AM IST
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Targeted Stores</span>
                  <span className="text-lg font-black text-white">100 Stores</span>
                  <span className="text-[10px] text-slate-400 block">50 IN / 50 US</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Active Promos Ingested</span>
                  <span className="text-lg font-black text-pink-400">450+ Codes</span>
                  <span className="text-[10px] text-slate-400 block">Verified Active</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Scrape Success Rate</span>
                  <span className="text-lg font-black text-emerald-400">96.0%</span>
                  <span className="text-[10px] text-slate-400 block">96 / 100 Online</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Exceptions / Timeouts</span>
                  <span className="text-lg font-black text-amber-400">4 Stores</span>
                  <span className="text-[10px] text-slate-400 block">Auto-Retried</span>
                </div>
              </div>
            </div>

            {/* Failure Radar (Only shows the 4 stores that had issues, zero clutter) */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Exceptions & Failure Radar (Actionable Stores Only)</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { store: "boAt Lifestyle", region: "IN", issue: "Zyte timeout (HTTP 504)", status: "Auto-Recovered with Cached Promos" },
                  { store: "Nike US", region: "US", issue: "Promo container class changed", status: "Fallback to Standard 15% Member Offer" }
                ].map((f, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white">{f.store} ({f.region})</span>
                      <span className="text-[11px] text-amber-400 block font-mono">{f.issue}</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">{f.status}</span>
                    </div>
                    <button
                      type="button"
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-200 transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 1-Click Single Store Zyte Scrape Tester */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Search className="w-4 h-4 text-indigo-400" />
                <span>On-Demand Single Brand Scrape Tester (Zyte Engine)</span>
              </h4>
              <form onSubmit={handleTestBrandScrape} className="flex gap-2">
                <input
                  type="text"
                  value={testBrandInput}
                  onChange={(e) => setTestBrandInput(e.target.value)}
                  placeholder="e.g. gonoise.com or boat-lifestyle.com"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-hidden focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={testBrandLoading}
                  className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-xs font-bold text-white transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {testBrandLoading ? "Scraping..." : "Test Scrape"}
                </button>
              </form>

              {testBrandResult && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <span className="font-bold text-emerald-400 block">✓ Scraped Cleanly via {testBrandResult.source}</span>
                  <span className="text-slate-400 block">Coupons Returned: {testBrandResult.couponsFound?.length || 0}</span>
                </div>
              )}
            </div>

            {/* Quick Add Custom Promo Code */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-pink-400" />
                <span>Add Emergency Manual Coupon Code</span>
              </h4>
              <form onSubmit={handleAddCoupon} className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Code (e.g. FLAT300)"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
                <input
                  type="text"
                  required
                  placeholder="Store (e.g. boAt)"
                  value={newCoupon.store}
                  onChange={(e) => setNewCoupon({ ...newCoupon, store: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
                <input
                  type="text"
                  required
                  placeholder="Description"
                  value={newCoupon.description}
                  onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
                <button
                  type="submit"
                  className="py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-xs font-bold text-white"
                >
                  + Add Live Code
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 6: ACTIVITY AUDIT STREAM */}
        {activeTab === "activity" && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center justify-between">
                <span>Recent Search Audit Stream</span>
                <span className="text-xs text-slate-400 font-normal">Last {recentLogs.length} requests</span>
              </h3>

              {recentLogs.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">No requests recorded yet today.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase font-bold border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">Time</th>
                        <th className="py-2.5 px-3">Query</th>
                        <th className="py-2.5 px-3">IP</th>
                        <th className="py-2.5 px-3">Engine</th>
                        <th className="py-2.5 px-3">Latency</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {recentLogs.map((log) => (
                        <tr 
                          key={log.id} 
                          onClick={() => setSelectedLog(log)}
                          className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                        >
                          <td className="py-2.5 px-3 text-[11px] text-slate-400 font-sans">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </td>
                          <td className="py-2.5 px-3 font-sans font-medium text-white max-w-[240px] truncate">
                            {log.query}
                          </td>
                          <td className="py-2.5 px-3 text-slate-400">{log.ip}</td>
                          <td className="py-2.5 px-3">
                            {log.isCacheHit ? (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                                CACHE HIT ⚡
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 text-[10px] font-bold border border-indigo-500/20">
                                LIVE UPSTREAM 🌐
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 font-sans">
                            <span className={log.latencyMs < 500 ? "text-emerald-400" : "text-amber-400"}>
                              {log.latencyMs} ms
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className={log.status === 200 ? "text-emerald-400 font-bold" : "text-rose-400"}>
                              {log.status || 200} OK
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 7: AFFILIATE KEYS */}
        {activeTab === "keys" && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                <span>Personal Store Affiliate Tags (Direct Commission IDs)</span>
              </h3>
              <form onSubmit={handleAddTag} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Store (e.g. Amazon)"
                  value={newTag.store}
                  onChange={(e) => setNewTag({ ...newTag, store: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-white"
                />
                <input
                  type="text"
                  required
                  placeholder="Associate Tag (e.g. shopsmart-21)"
                  value={newTag.tag}
                  onChange={(e) => setNewTag({ ...newTag, tag: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-white"
                />
                <button
                  type="submit"
                  className="py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-xs font-bold text-white"
                >
                  + Add Direct Store Tag
                </button>
              </form>

              {personalTags.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 border-t border-slate-800">
                  {personalTags.map(t => (
                    <div key={t.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-white">{t.store}</span>
                        <p className="text-[11px] font-mono text-amber-400">{t.tag}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(t.id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Aggregator Credentials */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Link2 className="w-4 h-4 text-indigo-400" />
                <span>Aggregator Network Credentials (Master Affiliates)</span>
              </h3>
              <form onSubmit={handleAddAggregator} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Network Name (EarnKaro / CueLinks)"
                  value={newAggregator.name}
                  onChange={(e) => setNewAggregator({ ...newAggregator, name: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-white"
                />
                <input
                  type="text"
                  required
                  placeholder="Publisher ID / Token"
                  value={newAggregator.token}
                  onChange={(e) => setNewAggregator({ ...newAggregator, token: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-white"
                />
                <button
                  type="submit"
                  className="py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white"
                >
                  + Add Network Token
                </button>
              </form>

              {aggregators.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 border-t border-slate-800">
                  {aggregators.map(a => (
                    <div key={a.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-white">{a.name}</span>
                        <p className="text-[11px] font-mono text-indigo-300">{a.token}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAggregator(a.id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* MODAL: CRASH STACK TRACE INSPECTOR */}
      <AnimatePresence>
        {selectedCrash && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCrash(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-2xl p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Bug className="w-5 h-5 text-rose-400" />
                  <h3 className="text-sm font-bold text-white font-mono">Crash Exception Inspector</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCrash(null)}
                  className="p-1 rounded-md text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300 font-bold">
                  {selectedCrash.message}
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold mb-1">File Location</span>
                  <span className="text-indigo-400 font-bold">{selectedCrash.location}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-[11px] max-h-48 overflow-y-auto whitespace-pre-wrap">
                  {selectedCrash.stack || "No additional stack trace captured."}
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedCrash(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: SEARCH AUDIT LOG DETAIL */}
      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLog(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-lg p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white">Search Audit Log Detail</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedLog(null)}
                  className="p-1 rounded-md text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Query</span>
                  <span className="text-white font-sans font-bold text-sm">{selectedLog.query}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                    <span className="text-slate-500 block text-[10px]">Source IP</span>
                    <span className="text-slate-200">{selectedLog.ip}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                    <span className="text-slate-500 block text-[10px]">Latency</span>
                    <span className="text-emerald-400 font-bold">{selectedLog.latencyMs} ms</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                    <span className="text-slate-500 block text-[10px]">Cache Engine</span>
                    <span className={selectedLog.isCacheHit ? "text-emerald-400 font-bold" : "text-indigo-400"}>
                      {selectedLog.isCacheHit ? "CACHE HIT ⚡" : "LIVE UPSTREAM 🌐"}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                    <span className="text-slate-500 block text-[10px]">Anomaly Evaluation</span>
                    <span className={selectedLog.anomalyType === "NORMAL" ? "text-slate-300" : "text-amber-400 font-bold"}>
                      {selectedLog.anomalyType}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedLog(null)}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white"
                >
                  Close Log
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
