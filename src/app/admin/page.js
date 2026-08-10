"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ShieldAlert, Settings, Key, Tag, Plus, Trash2, Save, ShoppingBag, 
  ArrowLeft, CheckCircle2, Globe, FileText, AlertCircle 
} from "lucide-react";
import { auth, getSession } from "@/services/supabase";
import { getAdminSettings, saveAdminSettings } from "@/services/admin";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("keys"); // keys | coupons
  const [saveStatus, setSaveStatus] = useState(null); // success | error | saving

  // Settings state
  const [apiKeys, setApiKeys] = useState([]);
  const [coupons, setCoupons] = useState([]);

  // Form states for adding items
  const [newKey, setNewKey] = useState({ name: "", value: "", region: "GLOBAL" });
  const [newCoupon, setNewCoupon] = useState({ code: "", store: "", description: "", link: "", region: "GLOBAL" });

  useEffect(() => {
    async function initAdmin() {
      const { data: { session } } = await auth.getSession();
      if (!session?.user) {
        router.push("/");
        return;
      }

      const email = session.user.email || "";
      const isAdmin = email.includes("admin") || session.user.user_metadata?.is_admin === true;
      
      if (!isAdmin) {
        setUser(session.user);
        setLoading(false);
        return;
      }

      setUser(session.user);
      
      // Fetch settings
      const settings = await getAdminSettings(session.user);
      setApiKeys(settings.apiKeys || []);
      setCoupons(settings.coupons || []);
      setLoading(false);
    }
    initAdmin();
  }, [router]);

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
    if (!newKey.name.trim()) return;
    setApiKeys([...apiKeys, { ...newKey, id: "key-" + Date.now() }]);
    setNewKey({ name: "", value: "", region: "GLOBAL" });
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <span className="w-8 h-8 border-4 border-brand-indigo/30 border-t-brand-indigo rounded-full animate-spin inline-block mb-3" />
      </div>
    );
  }

  // Access Denied screen
  const email = user?.email || "";
  const isAdmin = email.includes("admin") || user?.user_metadata?.is_admin === true;
  if (!isAdmin) {
    return (
      <div className="min-h-screen relative flex flex-col justify-between overflow-hidden bg-[#020617] text-slate-300">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0"></div>
        <div className="relative z-10 flex-grow flex items-center justify-center p-4">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 p-6 md:p-8 text-center shadow-2xl backdrop-blur-md">
            <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Access Denied 🔒</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              You do not have permissions to access this page. Admin authorization required.
            </p>
            <button
              onClick={() => router.push("/")}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-indigo to-brand-violet text-xs font-semibold text-white transition-all shadow-md active:scale-95 cursor-pointer hover:from-brand-indigo/90 hover:to-brand-violet/90"
            >
              Back to Home
            </button>
          </div>
        </div>
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
              <span className="text-md md:text-lg font-bold text-white tracking-tight">
                ShopSmart Admin Controls
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
            onClick={() => setActiveTab("keys")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-xs font-bold transition-all cursor-pointer ${
              activeTab === "keys" 
                ? "bg-slate-900 border border-slate-800 text-white shadow-inner" 
                : "text-slate-400 hover:text-white hover:bg-slate-900/30"
            }`}
          >
            <Key className="w-4 h-4 text-brand-indigo" />
            <span>API Keys & Affiliate Tags</span>
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
            <span>Manual Store Coupons</span>
          </button>
        </aside>

        {/* Content Panel */}
        <div className="flex-grow glass-panel p-6 rounded-2xl border border-slate-800 min-h-[500px]">
          
          {/* TAB 1: API Keys & Affiliate Tags */}
          {activeTab === "keys" && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">API Credentials & Affiliate Tags</h3>
                <p className="text-xs text-slate-400">
                  Manage tokens and associate tags targeting different regions. Keep values secret.
                </p>
              </div>

              {/* Add form */}
              <form onSubmit={handleAddKey} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950/40 border border-slate-900">
                <div className="md:col-span-1 space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Credential Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cuelinks SubID"
                    value={newKey.name}
                    onChange={e => setNewKey({ ...newKey, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-brand-indigo text-white placeholder-slate-600"
                  />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Key Value / Token</label>
                  <input
                    type="text"
                    required
                    placeholder="Credential Secret Value"
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
                    No API keys active. Add a key above to get started.
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

          {/* TAB 2: Store Vouchers & Coupons */}
          {activeTab === "coupons" && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Manual Store Coupons</h3>
                <p className="text-xs text-slate-400">
                  Register active store vouchers. These are loaded directly when service queries or matched e-commerce products are processed.
                </p>
              </div>

              {/* Add form */}
              <form onSubmit={handleAddCoupon} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950/40 border border-slate-900">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Store Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Swiggy"
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
                    placeholder="e.g. SWIGGYIT"
                    value={newCoupon.code}
                    onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-brand-indigo text-white placeholder-slate-600 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Offer Description</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 50% discount on food orders"
                    value={newCoupon.description}
                    onChange={e => setNewCoupon({ ...newCoupon, description: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-brand-indigo text-white placeholder-slate-600"
                  />
                </div>
                <div className="space-y-1 flex items-end gap-2">
                  <div className="flex-grow">
                    <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Region</label>
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
                  <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Destination Redemption Link (Affiliate / Direct PDP URL)</label>
                  <input
                    type="url"
                    required
                    placeholder="https://store.com/redeem"
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
                    <span>Add Voucher</span>
                  </button>
                </div>
              </form>

              {/* Coupons List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Coupons list</h4>
                
                {coupons.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                    No active vouchers. Register a coupon above.
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
