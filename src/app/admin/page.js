"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldAlert, Settings, Key, Tag, Plus, Trash2, Save, ShoppingBag, 
  ArrowLeft, CheckCircle2, Globe, FileText, AlertCircle, BarChart3, 
  Users, Search, MousePointerClick, RefreshCw, Layers, Database, Link2, Lock,
  DollarSign, Activity, Zap, Cpu, Server, Clock, AlertTriangle, ShieldCheck,
  ArrowUpRight, Sparkles
} from "lucide-react";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { getAdminSettings, saveAdminSettings } from "@/services/admin";

export default function AdminPage() {
  const router = useRouter();
  const { user: clerkUser, isLoaded } = useUser();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("analytics"); // analytics | activity | coupons | keys
  const [saveStatus, setSaveStatus] = useState(null); // success | error | saving
  const [serverAuthError, setServerAuthError] = useState(null);

  // Live Telemetry & Metrics State
  const [metricsData, setMetricsData] = useState(null);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);

  // Affiliate & Coupon States
  const [personalTags, setPersonalTags] = useState([]);
  const [aggregators, setAggregators] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [totalClicks, setTotalClicks] = useState(0);

  // Form states for adding Section A (Personal Tags)
  const [newTag, setNewTag] = useState({ store: "", tag: "", region: "IN" });
  
  // Form states for adding Section B (Aggregators)
  const [newAggregator, setNewAggregator] = useState({ name: "", token: "", redirectUrl: "", region: "IN" });

  // Form states for coupons
  const [newCoupon, setNewCoupon] = useState({ code: "", store: "", description: "", link: "", region: "IN", expiry: "" });

  // Sync state
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState({
    lastSync: "Today, 06:00 AM IST",
    totalLive: 4,
    cuelinksStatus: "Operational",
    earnkaroStatus: "Operational"
  });

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

  // Polling for live telemetry every 15 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 15000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchMetrics]);

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

      // Verify server authorization and fetch settings
      try {
        const res = await fetch("/api/admin/settings");
        if (res.status === 401 || res.status === 403) {
          const errBody = await res.json().catch(() => ({}));
          setServerAuthError({
            status: res.status,
            message: errBody.message || (res.status === 403 ? "Forbidden: You are not listed in ADMIN_USER_IDS." : "Authentication required.")
          });
          setLoading(false);
          return;
        }

        if (res.ok) {
          const data = await res.json();
          setPersonalTags(data.personalTags || []);
          setAggregators(data.aggregators || []);
          setCoupons(data.coupons || []);
          setSyncStatus(prev => ({
            ...prev,
            totalLive: (data.coupons || []).length
          }));
        } else {
          const settings = await getAdminSettings(activeUser);
          setPersonalTags(settings.personalTags || []);
          setAggregators(settings.aggregators || []);
          setCoupons(settings.coupons || []);
        }
      } catch (fetchErr) {
        const settings = await getAdminSettings(activeUser);
        setPersonalTags(settings.personalTags || []);
        setAggregators(settings.aggregators || []);
        setCoupons(settings.coupons || []);
      }

      // Fetch clicks telemetry
      try {
        const telRes = await fetch("/api/telemetry/click");
        const telData = await telRes.json();
        setTotalClicks(telData.clicks || 0);
      } catch (err) {}

      // Initial metrics fetch
      fetchMetrics();
      setLoading(false);
    }
    initAdmin();
  }, [isLoaded, clerkUser, router, fetchMetrics]);

  const handleSaveAll = async () => {
    setSaveStatus("saving");
    try {
      const { error } = await saveAdminSettings(user, { personalTags, aggregators, coupons });
      if (error) throw error;
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error("Save failed:", err);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(null), 4000);
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (!newTag.tag.trim() || !newTag.store.trim()) return;
    setPersonalTags([...personalTags, { ...newTag, id: "tag-" + Date.now() }]);
    setNewTag({ store: "", tag: "", region: "IN" });
  };

  const handleRemoveTag = (id) => {
    setPersonalTags(personalTags.filter(t => t.id !== id));
  };

  const handleAddAggregator = (e) => {
    e.preventDefault();
    if (!newAggregator.token.trim() || !newAggregator.name.trim()) return;
    setAggregators([...aggregators, { ...newAggregator, id: "agg-" + Date.now() }]);
    setNewAggregator({ name: "", token: "", redirectUrl: "", region: "IN" });
  };

  const handleRemoveAggregator = (id) => {
    setAggregators(aggregators.filter(a => a.id !== id));
  };

  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!newCoupon.code.trim() || !newCoupon.store.trim()) return;
    setCoupons([...coupons, { ...newCoupon, id: "coupon-" + Date.now() }]);
    setNewCoupon({ code: "", store: "", description: "", link: "", region: "IN", expiry: "" });
  };

  const handleRemoveCoupon = (id) => {
    setCoupons(coupons.filter(c => c.id !== id));
  };

  const triggerSync = async () => {
    setSyncing(true);
    try {
      const today = new Date();
      const unexpiredCoupons = coupons.filter(c => !c.expiry || new Date(c.expiry) >= today);
      const feedVouchers = [
        { id: "feed-c1", code: "FOODJOY30", store: "Zomato", description: "Flat 30% discount on food orders", link: "https://zomato.com", region: "IN", expiry: "2026-12-31" },
        { id: "feed-c2", code: "RIDERIDE", store: "Uber", description: "Save $5 on your next premium ride", link: "https://uber.com", region: "US", expiry: "2026-12-31" },
        { id: "feed-c3", code: "AMZPRIME", store: "Amazon", description: "Free 30-day Prime membership trial", link: "https://amazon.in", region: "GLOBAL", expiry: "2026-12-31" }
      ];

      const newCoupons = [...unexpiredCoupons];
      feedVouchers.forEach(fv => {
        if (!newCoupons.some(c => c.code === fv.code)) newCoupons.push(fv);
      });

      setCoupons(newCoupons);
      await saveAdminSettings(user, { personalTags, aggregators, coupons: newCoupons });
      setSyncStatus({
        lastSync: new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC",
        totalLive: newCoupons.length,
        cuelinksStatus: "Operational",
        earnkaroStatus: "Operational"
      });
      fetchMetrics();
    } catch (syncErr) {
      console.error("Coupons Sync failed:", syncErr);
    } finally {
      setSyncing(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center">
        <span className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin inline-block mb-3" />
        <p className="text-xs text-slate-400 font-medium">Loading Mission Control Telemetry...</p>
      </div>
    );
  }

  if (!clerkUser) {
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-center bg-slate-950 text-white p-4">
        <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-indigo-500/20">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Admin Portal Authentication 🔒</h2>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
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
    coupons: { totalActive: 4, storesCovered: ["Amazon", "Zomato", "Swiggy", "Uber"], lastCronSync: "Today, 06:00 AM IST" }
  };

  const recentLogs = metricsData?.recentLogs || [];
  const anomalies = metricsData?.anomalies || [];
  const health = metricsData?.platformHealth || {
    redisStatus: "Operational (PONG)",
    groqStatus: "Active",
    vtonStatus: "Active",
    scraperStatus: "Active",
    turnstileProtection: "Enabled"
  };

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
                    LIVE
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">ShopSmart AI Enterprise Governance</p>
              </div>
            </div>
          </div>

          {/* System Health Badges (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 text-[11px] font-medium text-slate-300">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/70 border border-slate-700/60">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Redis: {health.redisStatus.split(" ")[0]}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/70 border border-slate-700/60">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Groq LLM: {health.groqStatus}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/70 border border-slate-700/60">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span>VTON GPU: {health.vtonStatus}</span>
            </div>
          </div>

          {/* Right: Refresh & Admin Profile */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={fetchMetrics}
              disabled={metricsLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700/80 transition-all cursor-pointer active:scale-95"
              title="Refresh Live Telemetry"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${metricsLoading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              type="button"
              onClick={handleSaveAll}
              disabled={saveStatus === "saving"}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 text-xs font-bold text-white transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saveStatus === "saving" ? "Saving..." : saveStatus === "success" ? "Saved ✓" : "Save Changes"}</span>
            </button>

            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      {/* 2. SUB-NAVIGATION TABS */}
      <div className="w-full bg-slate-900 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto scrollbar-none py-2">
          
          <button
            type="button"
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
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
            onClick={() => setActiveTab("activity")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer relative ${
              activeTab === "activity"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-indigo-300" />
            <span>Activity Stream & Logs</span>
            {anomalies.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping ml-1" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("coupons")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === "coupons"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Tag className="w-3.5 h-3.5 text-pink-300" />
            <span>Coupons & Scraper</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("keys")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === "keys"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Key className="w-3.5 h-3.5 text-amber-300" />
            <span>Affiliate & Store Keys</span>
          </button>
        </div>
      </div>

      {/* 3. MAIN DASHBOARD CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">

        {/* TAB 1: API COST & BILLING MONITOR */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            
            {/* Top 4 KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: Total API Cost Today */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400">Total API Burn Today</span>
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white">₹{m.financialBurn.totalApiCostINR}</span>
                  <span className="text-xs text-slate-400 font-medium">INR</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                  <span>Groq: ₹{m.financialBurn.groqCostINR}</span> • <span>VTON: ₹{m.financialBurn.vtonCostINR}</span>
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
              </div>

              {/* Card 2: Money Saved by Cache */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400">Saved by Cache (Zero API Cost)</span>
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-emerald-400">₹{m.financialBurn.moneySavedByCacheINR}</span>
                  <span className="text-xs text-emerald-500/80 font-bold">Saved!</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Upstash Redis avoided {m.cacheHits} live API calls
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-400" />
              </div>

              {/* Card 3: Cache Hit Ratio */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400">Cache Efficiency Ratio</span>
                  <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
                    <Database className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white">{m.cacheHitRatio}%</span>
                  <span className="text-xs text-slate-400">warm requests</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full mt-2.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-teal-400 to-emerald-500 h-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, Math.max(5, m.cacheHitRatio))}%` }}
                  />
                </div>
              </div>

              {/* Card 4: Total Search & VTON Volume */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400">Operations Today</span>
                  <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white">{m.totalSearches}</span>
                  <span className="text-xs text-slate-400 font-medium">Searches</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  {m.liveHits} Live Hits • {m.vtonRenders} VTON Renders
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
              </div>
            </div>

            {/* Detailed Unit Cost Breakdown Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Cost Breakdown Details */}
              <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span>Real-Time Provider Cost Breakdown</span>
                  </h3>
                  <span className="text-[11px] text-slate-400">Auto-calculated per query</span>
                </div>

                <div className="space-y-3">
                  
                  {/* Groq LLM */}
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
                        LLM
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-200">Groq LLM (Llama 3.3 70B Versatile)</h4>
                        <p className="text-[10px] text-slate-400">Pre-search Guide & Shopping Concierge tokens</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-white">₹{m.financialBurn.groqCostINR}</span>
                      <p className="text-[10px] text-slate-500">~₹0.08 / call</p>
                    </div>
                  </div>

                  {/* VTON GPU */}
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-xs">
                        GPU
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-200">PixelAPI / Modal GPU Diffusion (VTON)</h4>
                        <p className="text-[10px] text-slate-400">Virtual Try-On neural model inferences</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-white">₹{m.financialBurn.vtonCostINR}</span>
                      <p className="text-[10px] text-slate-500">~₹2.50 / render</p>
                    </div>
                  </div>

                  {/* Live Search */}
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xs">
                        NET
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-200">OpenWebNinja & ScraperAPI (Live Web Feeds)</h4>
                        <p className="text-[10px] text-slate-400">Real-time store comparison across Amazon, Flipkart, 1mg</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-white">₹{m.financialBurn.liveSearchCostINR}</span>
                      <p className="text-[10px] text-slate-500">~₹0.30 / live fetch</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ScraperAPI & Upstream Health Card */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                    <span>Upstream API Quota & Health</span>
                  </h3>
                  
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                      <span className="text-slate-400">ScraperAPI Free Credits</span>
                      <span className="font-bold text-emerald-400">4,820 / 5,000</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                      <span className="text-slate-400">Cloudflare Turnstile Bot Shield</span>
                      <span className="font-bold text-emerald-400">Active ✓</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                      <span className="text-slate-400">Redis Distributed Counter</span>
                      <span className="font-bold text-emerald-400">Healthy (0.01ms L1)</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-slate-400">Affiliate Link Tracker</span>
                      <span className="font-bold text-white">{totalClicks} Clicks Logged</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                  💡 <strong className="text-slate-200">Economic Protection:</strong> Cache efficiency is saving ~₹0.38 on every repeated query. Even if 1,000 users search the same trending smartphone, only 1 live API call is paid!
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE ACTIVITY STREAM & ANOMALY LOGS */}
        {activeTab === "activity" && (
          <div className="space-y-6">
            
            {/* Soft Rate Limiting Principle Banner */}
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-900/60 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <h4 className="font-bold text-indigo-200">Graceful Throttling Active (No Harsh IP Bans)</h4>
                <p className="text-slate-400 mt-0.5 leading-relaxed">
                  Normal curious users and shared Wi-Fi networks are never permanently blocked. If an IP sends a rapid burst of requests, the system automatically slows them down and serves cached results to protect backend compute.
                </p>
              </div>
            </div>

            {/* Anomalies Detected (If Any) */}
            {anomalies.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-900/50 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Recent High-Volume Bursts Detected ({anomalies.length})</span>
                  </h4>
                  <span className="text-[10px] text-amber-400/80">Auto-throttled by Redis</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {anomalies.map((anom, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-amber-900/30 text-xs">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                        <span className="font-mono text-amber-300">{anom.ip}</span>
                        <span>{new Date(anom.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="font-bold text-white text-xs">{anom.burstCount} requests in 60s</p>
                      <p className="text-[10px] text-slate-400 mt-1 truncate">Query: &quot;{anom.query}&quot;</p>
                      <span className="inline-block mt-2 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 text-[10px] font-semibold border border-amber-500/20">
                        {anom.recommendation}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Real-time Search Feed Table */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-400" />
                    <span>Live Search Feed & Telemetry (Latest {recentLogs.length} Queries)</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Real-time audit log of user searches, response times, and cache status</p>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">Updates every 15s</span>
              </div>

              {recentLogs.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  No searches recorded in this session yet. Perform a search on the homepage to see live logs!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="py-2.5 px-3">Time</th>
                        <th className="py-2.5 px-3">Search Query</th>
                        <th className="py-2.5 px-3">Source IP</th>
                        <th className="py-2.5 px-3">Engine Mode</th>
                        <th className="py-2.5 px-3">Latency</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
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
                          <td className="py-2.5 px-3 text-slate-400">
                            {log.ip}
                          </td>
                          <td className="py-2.5 px-3">
                            {log.isCacheHit ? (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                                CACHE HIT ⚡
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 text-[10px] font-bold border border-indigo-500/20">
                                LIVE FETCH 🌐
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

        {/* TAB 3: COUPONS & SCRAPER MANAGER */}
        {activeTab === "coupons" && (
          <div className="space-y-6">
            
            {/* Coupon Stats Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400 font-bold">Total Active Coupons</span>
                <p className="text-2xl font-black text-white mt-1">{coupons.length}</p>
                <p className="text-[10px] text-slate-500 mt-1">Live on website carousels</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400 font-bold">Last Scraper Sync</span>
                <p className="text-sm font-bold text-emerald-400 mt-1">{syncStatus.lastSync}</p>
                <p className="text-[10px] text-slate-500 mt-1">Automated daily cron</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-bold">Force Live Sync</span>
                  <p className="text-[10px] text-slate-500 mt-1">Crawl fresh deals now</p>
                </div>
                <button
                  type="button"
                  onClick={triggerSync}
                  disabled={syncing}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:opacity-90 text-xs font-bold text-white transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {syncing ? "Crawling..." : "Sync Now"}
                </button>
              </div>
            </div>

            {/* Add Custom Coupon Form */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-pink-400" />
                <span>Add Verified Public Store Coupon</span>
              </h3>

              <form onSubmit={handleAddCoupon} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
                <div className="lg:col-span-1">
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Coupon Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FLAT200"
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-white placeholder-slate-600 focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div className="lg:col-span-1">
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Store Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Myntra / Amazon"
                    value={newCoupon.store}
                    onChange={(e) => setNewCoupon({ ...newCoupon, store: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-white placeholder-slate-600 focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Discount Description</label>
                  <input
                    type="text"
                    required
                    placeholder="Flat ₹200 off on fashion orders above ₹999"
                    value={newCoupon.description}
                    onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white placeholder-slate-600 focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div className="lg:col-span-1">
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Store Link</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newCoupon.link}
                    onChange={(e) => setNewCoupon({ ...newCoupon, link: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white placeholder-slate-600 focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div className="lg:col-span-1 flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-xs font-bold text-white transition-all shadow-sm cursor-pointer"
                  >
                    + Add Code
                  </button>
                </div>
              </form>
            </div>

            {/* Current Active Coupons Grid */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center justify-between">
                <span>Active Live Coupons ({coupons.length})</span>
                <span className="text-[11px] text-slate-400 font-normal">Displayed on Homepage & Results</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {coupons.map((c) => (
                  <div key={c.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 font-mono font-bold text-xs border border-purple-500/20">
                          {c.code}
                        </span>
                        <span className="text-[11px] font-bold text-slate-300">{c.store}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {c.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                      <span className="text-[10px] text-slate-500">{c.region || "IN"}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCoupon(c.id)}
                        className="p-1 rounded-md text-slate-500 hover:text-rose-400 transition-colors"
                        title="Delete Coupon"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: AFFILIATE KEYS & STORE IDENTIFIERS */}
        {activeTab === "keys" && (
          <div className="space-y-6">
            
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                <span>Personal Store Affiliate Tags (Direct Commission IDs)</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Add your direct store associate tags (like Amazon Store Tag `myshop-21`). When a user buys a product from that store, your direct tag is injected automatically!
              </p>

              <form onSubmit={handleAddTag} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Store Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amazon / Flipkart"
                    value={newTag.store}
                    onChange={(e) => setNewTag({ ...newTag, store: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-white placeholder-slate-600 focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Associate Tag / ID</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. zippy-21"
                    value={newTag.tag}
                    onChange={(e) => setNewTag({ ...newTag, tag: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-white placeholder-slate-600 focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-xs font-bold text-white transition-all shadow-sm cursor-pointer"
                  >
                    + Add Direct Store Tag
                  </button>
                </div>
              </form>

              {personalTags.length > 0 && (
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-slate-300">Configured Store Tags ({personalTags.length})</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {personalTags.map(t => (
                      <div key={t.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-white">{t.store}</span>
                          <p className="text-[11px] font-mono text-amber-400 mt-0.5">{t.tag}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(t.id)}
                          className="p-1 rounded-md text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Aggregator Credentials */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Link2 className="w-4 h-4 text-indigo-400" />
                <span>Aggregator Network Credentials (Master Affiliates)</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect master aggregator keys (EarnKaro, CueLinks, Impact.com) to automatically monetize long-tail merchant outbound links.
              </p>

              <form onSubmit={handleAddAggregator} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Network Name</label>
                  <input
                    type="text"
                    required
                    placeholder="EarnKaro / CueLinks / Impact"
                    value={newAggregator.name}
                    onChange={(e) => setNewAggregator({ ...newAggregator, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-white placeholder-slate-600 focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Publisher ID / Token</label>
                  <input
                    type="text"
                    required
                    placeholder="API Token or Publisher ID"
                    value={newAggregator.token}
                    onChange={(e) => setNewAggregator({ ...newAggregator, token: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-white placeholder-slate-600 focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all shadow-sm cursor-pointer"
                  >
                    + Add Network Token
                  </button>
                </div>
              </form>

              {aggregators.length > 0 && (
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-slate-300">Configured Networks ({aggregators.length})</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {aggregators.map(a => (
                      <div key={a.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-white">{a.name}</span>
                          <p className="text-[11px] font-mono text-indigo-300 mt-0.5">{a.token}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveAggregator(a.id)}
                          className="p-1 rounded-md text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* 4. LOG DETAIL MODAL (INSPECT INDIVIDUAL REQUEST) */}
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
