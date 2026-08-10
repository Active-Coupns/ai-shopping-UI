"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldAlert, Settings, Key, Tag, Plus, Trash2, Save, ShoppingBag, 
  ArrowLeft, CheckCircle2, Globe, FileText, AlertCircle, BarChart3, 
  Users, Search, MousePointerClick, RefreshCw, Layers, Database 
} from "lucide-react";
import { auth, getSession } from "@/services/supabase";
import { getAdminSettings, saveAdminSettings } from "@/services/admin";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("analytics"); // analytics | keys | coupons
  const [saveStatus, setSaveStatus] = useState(null); // success | error | saving

  // Settings state
  const [apiKeys, setApiKeys] = useState([]);
  const [coupons, setCoupons] = useState([]);

  // Form states for adding items
  const [newKey, setNewKey] = useState({ name: "Amazon Associate Tag", value: "", region: "GLOBAL" });
  const [newCoupon, setNewCoupon] = useState({ code: "", store: "", description: "", link: "", region: "GLOBAL" });

  // Sync / Automatic fetch status mock state
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState({
    lastSync: "2026-08-09 20:30:15 UTC",
    totalLive: 248,
    cuelinksStatus: "Operational",
    earnkaroStatus: "Operational"
  });

  // Mock analytics data
  const analyticsMetrics = [
    { label: "Total Active Users", value: "1,284", icon: Users, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
    { label: "Searches Today", value: "452", icon: Search, color: "text-brand-indigo bg-brand-indigo/10 border-brand-indigo/20" },
    { label: "Affiliate Clicks", value: "189", icon: MousePointerClick, color: "text-brand-violet bg-brand-violet/10 border-brand-violet/20" },
    { label: "Top Trending Keyword", value: "iPhone 16", icon: BarChart3, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" }
  ];

  const recentLogs = [
    { id: 1, email: "admin@example.com", query: "iPhone 16 Pro Max", region: "IN", time: "2 mins ago", ctr: "100%", status: "Success" },
    { id: 2, email: "user_in_82@gmail.com", query: "zomato coupon code", region: "IN", time: "15 mins ago", ctr: "100%", status: "Bypassed Scraper" },
    { id: 3, email: "guest_9381", query: "nike running shoes", region: "US", time: "30 mins ago", ctr: "0%", status: "Success" },
    { id: 4, email: "john_doe@outlook.com", query: "swiggy coupon code", region: "IN", time: "1 hour ago", ctr: "100%", status: "Bypassed Scraper" },
    { id: 5, email: "user_us_12@gmail.com", query: "cheap macbook air", region: "US", time: "3 hours ago", ctr: "50%", status: "Success" }
  ];

  useEffect(() => {
    async function initAdmin() {
      const { data: { session } } = await auth.getSession();
      
      // DEV BYPASS: Automatically grant admin access to any active session or default mock user in dev mode
      if (session?.user) {
        setUser(session.user);
      } else {
        // Fallback mock user if no session is active during dev preview
        setUser({
          email: "dev-admin@example.com",
          user_metadata: { full_name: "Developer Admin Bypass", is_admin: true }
        });
      }

      // Fetch settings
      const settings = await getAdminSettings(session?.user || null);
      setApiKeys(settings.apiKeys || []);
      setCoupons(settings.coupons || []);
      setLoading(false);
    }
    initAdmin();
  }, []);

  const handleSaveAll = async () => {
    setSaveStatus("saving");
    try {
      const { error } = await saveAdminSettings(user, { apiKeys, coupons });
      if (error) throw error;
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error("Save failed:", err);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(null), 4000);
    }
  };

  // API Key handlers
  const handleAddKey = (e) => {
    e.preventDefault();
    if (!newKey.value.trim()) return;
    setApiKeys([...apiKeys, { ...newKey, id: "key-" + Date.now() }]);
    setNewKey({ name: "Amazon Associate Tag", value: "", region: "GLOBAL" });
  };

  const handleRemoveKey = (id) => {
    setApiKeys(apiKeys.filter(k => k.id !== id));
  };

  // Coupon handlers
  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!newCoupon.code.trim() || !newCoupon.store.trim()) return;
    setCoupons([...coupons, { ...newCoupon, id: "coupon-" + Date.now() }]);
    setNewCoupon({ code: "", store: "", description: "", link: "", region: "GLOBAL" });
  };

  const handleRemoveCoupon = (id) => {
    setCoupons(coupons.filter(c => c.id !== id));
  };

  const triggerSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncStatus({
        lastSync: new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC",
        totalLive: 248 + Math.floor(Math.random() * 20),
        cuelinksStatus: "Operational",
        earnkaroStatus: "Operational"
      });
      setSyncing(false);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <span className="w-8 h-8 border-4 border-brand-indigo/30 border-t-brand-indigo rounded-full animate-spin inline-block" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col justify-between overflow-hidden bg-[#020617] text-slate-200">
      {/* Glow Effects */}
      <div className="absolute top-0 inset-x-0 h-[500px] flex justify-between pointer-events-none z-0">
        <div className="w-[35%] h-full bg-brand-violet/10 bg-glow-purple rounded-full mix-blend-screen -translate-x-[20%] -translate-y-[20%]"></div>
        <div className="w-[35%] h-full bg-brand-indigo/10 bg-glow-blue rounded-full mix-blend-screen translate-x-[20%] -translate-y-[10%]"></div>
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0"></div>

      {/* Header */}
      <header className="relative z-10 w-full glass-panel border-x-0 border-t-0 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="flex items-center justify-center p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-brand-indigo" />
              <span className="text-md md:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                ShopSmart Admin Controls
                <span className="text-[10px] font-extrabold uppercase bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full tracking-wide">
                  Dev Bypass Active ⚡
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {saveStatus === "saving" && (
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <span className="w-3 h-3 border-2 border-slate-400/30 border-t-slate-400 rounded-full animate-spin" />
                Saving...
              </span>
            )}
            {saveStatus === "success" && (
              <span className="text-xs text-emerald-400 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Settings Saved!
              </span>
            )}
            {saveStatus === "error" && (
              <span className="text-xs text-rose-400 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <AlertCircle className="w-3.5 h-3.5" />
                Save Failed
              </span>
            )}
            <button
              onClick={handleSaveAll}
              disabled={saveStatus === "saving"}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-indigo to-brand-violet hover:from-brand-indigo/90 hover:to-brand-violet/90 text-xs md:text-sm font-semibold text-white transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 shrink-0 flex flex-col gap-2">
          <button
            onClick={() => setActiveTab("analytics")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-xs font-bold transition-all cursor-pointer ${
              activeTab === "analytics" 
                ? "bg-slate-900 border border-slate-800 text-white shadow-inner" 
                : "text-slate-400 hover:text-white hover:bg-slate-900/30"
            }`}
          >
            <BarChart3 className="w-4 h-4 text-brand-indigo" />
            <span>📊 User Analytics Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab("keys")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-xs font-bold transition-all cursor-pointer ${
              activeTab === "keys" 
                ? "bg-slate-900 border border-slate-800 text-white shadow-inner" 
                : "text-slate-400 hover:text-white hover:bg-slate-900/30"
            }`}
          >
            <Key className="w-4 h-4 text-brand-indigo" />
            <span>🔗 Affiliate & Credentials Manager</span>
          </button>
          <button
            onClick={() => setActiveTab("coupons")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-xs font-bold transition-all cursor-pointer ${
              activeTab === "coupons" 
                ? "bg-slate-900 border border-slate-800 text-white shadow-inner" 
                : "text-slate-400 hover:text-white hover:bg-slate-900/30"
            }`}
          >
            <Tag className="w-4 h-4 text-brand-violet" />
            <span>🎟️ Coupon Management Center</span>
          </button>
        </aside>

        {/* Content Panel */}
        <div className="flex-grow glass-panel p-6 rounded-2xl border border-slate-800 min-h-[550px] overflow-hidden">
          
          {/* TAB 1: USER ANALYTICS DASHBOARD */}
          {activeTab === "analytics" && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">User Analytics Dashboard</h3>
                <p className="text-xs text-slate-400">
                  Real-time activity logs, click-through rates, and query telemetry.
                </p>
              </div>

              {/* Metric Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {analyticsMetrics.map((m, idx) => {
                  const Icon = m.icon;
                  return (
                    <div key={idx} className={`p-4 rounded-xl border flex items-center gap-4 ${m.color}`}>
                      <div className="p-3 rounded-lg bg-slate-950/40">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{m.label}</p>
                        <p className="text-xl font-black text-white">{m.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Logs Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Recent User Activity Logs</h4>
                <div className="border border-slate-900 rounded-xl overflow-hidden bg-slate-950/20 overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs min-w-[600px]">
                    <thead>
                      <tr className="bg-slate-950/60 border-b border-slate-900 text-slate-500 font-bold uppercase text-[10px]">
                        <th className="p-3">User Identity</th>
                        <th className="p-3">Search Query</th>
                        <th className="p-3 text-center">Region</th>
                        <th className="p-3">Trigger Time</th>
                        <th className="p-3 text-center">CTR</th>
                        <th className="p-3 text-right">Routing Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900/60">
                      {recentLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-900/10 transition-colors text-slate-300">
                          <td className="p-3 font-medium text-slate-400 font-mono">{log.email}</td>
                          <td className="p-3 font-semibold text-white">&ldquo;{log.query}&rdquo;</td>
                          <td className="p-3 text-center">
                            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-400">
                              {log.region}
                            </span>
                          </td>
                          <td className="p-3 text-slate-500">{log.time}</td>
                          <td className="p-3 text-center font-bold text-brand-indigo">{log.ctr}</td>
                          <td className="p-3 text-right">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              log.status.includes("Bypass") 
                                ? "bg-brand-violet/10 border border-brand-violet/20 text-brand-violet"
                                : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                            }`}>
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: API Keys & Affiliate Tags */}
          {activeTab === "keys" && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Affiliate & Credentials Manager</h3>
                <p className="text-xs text-slate-400">
                  Manage tokens, affiliate keys, and API credentials targeting different regions. Keep values secret.
                </p>
              </div>

              {/* Add form */}
              <form onSubmit={handleAddKey} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950/40 border border-slate-900">
                <div className="md:col-span-1 space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Credential/Tag Type</label>
                  <select
                    value={newKey.name}
                    onChange={e => setNewKey({ ...newKey, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-brand-indigo text-white appearance-none cursor-pointer"
                  >
                    <option value="Amazon Associate Tag">Amazon Associate Tag</option>
                    <option value="Cuelinks API Key">Cuelinks API Key</option>
                    <option value="EarnKaro API Key">EarnKaro Key</option>
                    <option value="Flipkart Affiliate ID">Flipkart Affiliate ID</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Key Value / SubID Token</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter Secret Key Value"
                    value={newKey.value}
                    onChange={e => setNewKey({ ...newKey, value: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-brand-indigo text-white placeholder-slate-600"
                  />
                </div>
                <div className="space-y-1 flex items-end gap-2">
                  <div className="flex-grow">
                    <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Region</label>
                    <select
                      value={newKey.region}
                      onChange={e => setNewKey({ ...newKey, region: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-brand-indigo text-white appearance-none cursor-pointer"
                    >
                      <option value="IN">IN (India)</option>
                      <option value="US">US (United States)</option>
                      <option value="GLOBAL">GLOBAL</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="p-2 rounded-lg bg-brand-indigo text-white hover:bg-brand-indigo/90 active:scale-95 transition-all cursor-pointer shadow-md"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </form>

              {/* Items List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Keys list</h4>
                
                {apiKeys.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                    No keys active. Register credentials above to display.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-900 border border-slate-900 rounded-xl overflow-hidden bg-slate-950/20">
                    {apiKeys.map((keyItem) => (
                      <div key={keyItem.id} className="flex items-center justify-between p-4 hover:bg-slate-900/30 transition-all">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="p-2 rounded-lg bg-brand-indigo/10 text-brand-indigo shrink-0">
                            <Key className="w-4 h-4" />
                          </div>
                          <div className="overflow-hidden">
                            <h5 className="text-xs font-bold text-white truncate">{keyItem.name}</h5>
                            <code className="text-[10px] text-slate-500 font-mono select-all truncate block max-w-[250px] md:max-w-[400px]">
                              {keyItem.value || "••••••••••••••••"}
                            </code>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-400">
                            <Globe className="w-3 h-3 text-slate-500" />
                            {keyItem.region}
                          </span>
                          <button
                            onClick={() => handleRemoveKey(keyItem.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Coupon Management Center */}
          {activeTab === "coupons" && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Coupon Management Center</h3>
                  <p className="text-xs text-slate-400">
                    Add physical store vouchers manually or track sync status of Cuelinks API auto-coupons.
                  </p>
                </div>
              </div>

              {/* Automatic Sync Dashboard */}
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-violet/5 rounded-full blur-2xl pointer-events-none" />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-brand-violet/10 text-brand-violet mt-0.5 shrink-0">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-2">
                        Automatic Voucher Feed Sync
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Cuelinks Status: <span className="text-emerald-400 font-bold">{syncStatus.cuelinksStatus}</span> | EarnKaro Status: <span className="text-emerald-400 font-bold">{syncStatus.earnkaroStatus}</span>
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500">
                        <span>Last Sync: {syncStatus.lastSync}</span>
                        <span>•</span>
                        <span>Total Live Vouchers: {syncStatus.totalLive}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={triggerSync}
                    disabled={syncing}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
                    <span>{syncing ? "Syncing..." : "Sync Coupons Now"}</span>
                  </button>
                </div>
              </div>

              {/* Add form */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Add Manual Store Voucher</h4>
                <form onSubmit={handleAddCoupon} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950/40 border border-slate-900">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Store Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Amazon, Zomato"
                      value={newCoupon.store}
                      onChange={e => setNewCoupon({ ...newCoupon, store: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-brand-indigo text-white placeholder-slate-600"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Coupon Code</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. AMZ150"
                      value={newCoupon.code}
                      onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-brand-indigo text-white placeholder-slate-600 font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Discount / Offer Description</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Flat Rs. 150 cashback"
                      value={newCoupon.description}
                      onChange={e => setNewCoupon({ ...newCoupon, description: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-brand-indigo text-white placeholder-slate-600"
                    />
                  </div>
                  <div className="space-y-1 flex items-end gap-2">
                    <div className="flex-grow">
                      <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Target Region</label>
                      <select
                        value={newCoupon.region}
                        onChange={e => setNewCoupon({ ...newCoupon, region: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-brand-indigo text-white appearance-none cursor-pointer"
                      >
                        <option value="IN">IN (India)</option>
                        <option value="US">US (United States)</option>
                        <option value="GLOBAL">GLOBAL</option>
                      </select>
                    </div>
                  </div>
                  <div className="md:col-span-3 space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Destination Redirection Link (Affiliate link / PDP URL)</label>
                    <input
                      type="url"
                      required
                      placeholder="https://amazon.in/redeem"
                      value={newCoupon.link}
                      onChange={e => setNewCoupon({ ...newCoupon, link: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-brand-indigo text-white placeholder-slate-600"
                    />
                  </div>
                  <div className="flex items-end justify-end">
                    <button
                      type="submit"
                      className="w-full md:w-auto px-5 py-2.5 rounded-lg bg-brand-violet text-white hover:bg-brand-violet/90 active:scale-95 transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 text-xs font-bold"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Coupon</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Coupons List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Manual Coupons list</h4>
                
                {coupons.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                    No manual coupons active. Register a coupon above.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {coupons.map((couponItem) => (
                      <div key={couponItem.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl bg-slate-950/20 border border-slate-900 hover:border-slate-800 transition-all gap-4">
                        <div className="flex items-start gap-3 overflow-hidden">
                          <div className="p-2.5 rounded-lg bg-brand-violet/10 text-brand-violet shrink-0">
                            <Tag className="w-4 h-4" />
                          </div>
                          <div className="overflow-hidden">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-extrabold text-white uppercase font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                                {couponItem.code}
                              </span>
                              <span className="text-xs text-slate-400 font-bold">{couponItem.store}</span>
                            </div>
                            <p className="text-xs text-slate-300 mt-1 truncate">{couponItem.description}</p>
                            <span className="text-[10px] text-slate-500 truncate block mt-0.5">{couponItem.link}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-400">
                            <Globe className="w-3 h-3 text-slate-500" />
                            {couponItem.region}
                          </span>
                          <button
                            onClick={() => handleRemoveCoupon(couponItem.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-8 text-center text-xs text-slate-500 border-t border-slate-900 glass-panel border-x-0 border-b-0">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            <ShoppingBag className="w-3.5 h-3.5 text-brand-indigo" />
            <span>AI powered shopping engine</span>
          </div>
          <div>
            <span>Powered by Next.js & Framer Motion. &copy; 2026 ShopSmart AI.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
