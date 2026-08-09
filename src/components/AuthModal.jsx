import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Globe, Sparkles } from "lucide-react";
import { auth } from "@/services/supabase";

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialMode = "login" }) {
  const [mode, setMode] = useState(initialMode); // login | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("IN");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "signup") {
        if (!fullName.trim()) {
          throw new Error("Full name is required");
        }
        const { data, error: signUpError } = await auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName.trim(),
              country: country
            }
          }
        });
        if (signUpError) throw signUpError;
        if (data?.user) {
          onAuthSuccess(data.user);
          onClose();
        }
      } else {
        const { data, error: signInError } = await auth.signInWithPassword({
          email,
          password
        });
        if (signInError) throw signInError;
        if (data?.user) {
          onAuthSuccess(data.user);
          onClose();
        }
      }
    } catch (err) {
      setError(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", duration: 0.4 }}
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 p-6 md:p-8 shadow-2xl backdrop-blur-md z-10"
      >
        {/* Glow behind modal */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-brand-indigo/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-brand-violet/25 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-indigo to-brand-violet items-center justify-center text-white mb-3 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {mode === "signup" ? "Create an Account" : "Welcome Back"}
          </h2>
          <p className="text-xs text-slate-400 mt-1.5">
            {mode === "signup"
              ? "Sign up to start tracking products and comparing prices"
              : "Sign in to access your personal AI shopping assistant"}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-indigo transition-colors"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-indigo transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-indigo transition-colors"
              />
            </div>
          </div>

          {mode === "signup" && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Preferred Country</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-brand-indigo transition-colors appearance-none"
                >
                  <option value="IN" className="bg-slate-900">India (IN)</option>
                  <option value="US" className="bg-slate-900">United States (US)</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-indigo to-brand-violet hover:from-brand-indigo/90 hover:to-brand-violet/90 text-sm font-semibold text-white transition-all shadow-lg active:scale-[0.98] cursor-pointer flex items-center justify-center"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : mode === "signup" ? (
              "Sign Up"
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="mt-5 text-center text-xs text-slate-400">
          {mode === "signup" ? (
            <span>
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-brand-indigo font-semibold hover:underline"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Don't have an account?{" "}
              <button
                onClick={() => setMode("signup")}
                className="text-brand-indigo font-semibold hover:underline"
              >
                Sign Up
              </button>
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
