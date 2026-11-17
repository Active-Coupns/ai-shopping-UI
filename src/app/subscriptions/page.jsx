"use client";

import React, { useState } from "react";
import SubscriptionsView from "@/components/SubscriptionsView";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SubscriptionsHubPage() {
  const [selectedCountry, setSelectedCountry] = useState("IN");

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/85 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-rose-500 flex items-center justify-center text-white font-black text-sm shadow-sm group-hover:scale-105 transition-transform">
              B
            </div>
            <div>
              <span className="font-black text-base tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                Benefisto
              </span>
              <span className="text-[10px] font-bold text-indigo-600 block -mt-1 tracking-wider uppercase">
                Subscriptions &amp; Software Hub
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {/* Country Selector */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold gap-1">
              {["IN", "US", "GB", "CA", "AU", "AE"].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedCountry(c)}
                  className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                    selectedCountry === c
                      ? "bg-white text-indigo-600 shadow-2xs font-black ring-1 ring-slate-200"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Subscriptions & Software Hub */}
      <main className="py-2">
        <SubscriptionsView
          selectedCountry={selectedCountry}
        />
      </main>
    </div>
  );
}
