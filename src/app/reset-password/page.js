"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Sparkles, ShoppingBag, Eye, EyeOff, ShieldAlert, CheckCircle2 } from "lucide-react";
import { auth, isMockAuthMode } from "@/services/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [loadingSession, setLoadingSession] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isMockAuthMode()) {
      setHasSession(true);
      setLoadingSession(false);
      return;
    }

    async function checkSession() {
      const { data: { session } } = await auth.getSession();
      if (session) {
        setHasSession(true);
        setLoadingSession(false);
      } else {
        // Listen to state change (email links auto-login on hash parse)
        const { data } = auth.onAuthStateChange((event, session) => {
          if (session) {
            setHasSession(true);
          }
          setLoadingSession(false);
        });

        // Fallback check after 2 seconds
        const timeout = setTimeout(async () => {
          const { data: { session: s } } = await auth.getSession();
          if (s) setHasSession(true);
          setLoadingSession(false);
        }, 2000);

        return () => {
          if (data?.subscription) {
            data.subscription.unsubscribe();
          }
          clearTimeout(timeout);
        };
      }
    }
    checkSession();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    try {
      if (isMockAuthMode()) {
        // Mock reset completion
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } else {
        const { error: updateError } = await auth.updateUser({ password });
        if (updateError) throw updateError;
      }
      setSuccess(true);
      setTimeout(() => {
        // Redirect to landing page to sign in
        router.push("/");
      }, 3000);
    } catch (err) {
      setError(err.message || "Failed to update password. Please request a new reset link.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between overflow-hidden bg-[#020617]">
      {/* Background Glows */}
      <div className="absolute top-0 inset-x-0 h-[500px] flex justify-between pointer-events-none z-0">
        <div className="w-[35%] h-full bg-brand-violet/10 bg-glow-purple rounded-full mix-blend-screen -translate-x-[20%] -translate-y-[20%]"></div>
        <div className="w-[35%] h-full bg-brand-indigo/10 bg-glow-blue rounded-full mix-blend-screen translate-x-[20%] -translate-y-[10%]"></div>
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0"></div>

      {/* Navbar Header */}
      <header className="relative z-10 w-full glass-panel border-x-0 border-t-0 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-tr from-brand-indigo to-brand-violet flex items-center justify-center text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-lg md:text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
              ShopSmart <span className="text-brand-indigo">AI</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow flex items-center justify-center py-16 px-4">
        {loadingSession ? (
          <div className="text-center">
            <span className="w-8 h-8 border-4 border-brand-indigo/30 border-t-brand-indigo rounded-full animate-spin inline-block mb-3" />
            <p className="text-sm text-slate-400">Verifying reset authorization link...</p>
          </div>
        ) : !hasSession ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 p-6 md:p-8 text-center shadow-2xl backdrop-blur-md animate-fade-in"
          >
            <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Invalid or Expired Reset Link 🔗</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              For security, password reset links expire quickly. Please request a new reset link from the Sign In menu.
            </p>
            <button
              onClick={() => router.push("/")}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-indigo to-brand-violet text-xs font-semibold text-white transition-all shadow-md active:scale-95 cursor-pointer hover:from-brand-indigo/90 hover:to-brand-violet/90"
            >
              Back to Home
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 p-6 md:p-8 shadow-2xl backdrop-blur-md"
          >
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-brand-indigo/25 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-brand-violet/25 rounded-full blur-3xl pointer-events-none" />

            <div className="text-center mb-6 relative">
              <div className="inline-flex w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-indigo to-brand-violet items-center justify-center text-white mb-3 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Reset Password 🔒</h2>
              <p className="text-xs text-slate-400 mt-1.5">
                Set a strong, new password for your ShopSmart AI account.
              </p>
            </div>

            {error && (
              <div className="mb-4 flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success ? (
              <div className="text-center py-4">
                <div className="inline-flex w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 items-center justify-center mb-4">
                  <CheckCircle2 className="w-6 h-6 animate-pulse" />
                </div>
                <h4 className="text-lg font-bold text-white mb-1">Password Reset Completed!</h4>
                <p className="text-xs text-slate-400">
                  Your password was updated successfully. Redirecting you to sign in...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 relative">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-indigo transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors cursor-pointer bg-transparent border-none outline-none"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-indigo transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 mt-2 rounded-xl bg-gradient-to-r from-brand-indigo to-brand-violet hover:from-brand-indigo/90 hover:to-brand-violet/90 text-sm font-semibold text-white transition-all shadow-lg active:scale-[0.98] cursor-pointer flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
            )}
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-8 text-center text-xs text-slate-500 border-t border-slate-900 glass-panel border-x-0 border-b-0">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-brand-indigo" />
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
