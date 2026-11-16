"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CouponResultView from "@/components/CouponResultView";
import { ArrowLeft, Sparkles, Search, Globe, ShieldCheck } from "lucide-react";
import { SUPPORTED_COUNTRIES } from "@/lib/countryConfig";

export default function CouponStorePageClient({ initialData, storeSlug, countryCode }) {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState(countryCode || "IN");
  const [searchQuery, setSearchQuery] = useState("");

  const handleCountryChange = (newCountry) => {
    setSelectedCountry(newCountry);
    router.push(`/coupons/${storeSlug}?country=${newCountry}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const clean = searchQuery.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
    if (clean) {
      router.push(`/coupons/${clean}?country=${selectedCountry}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 font-sans text-slate-900 antialiased selection:bg-violet-500 selection:text-white">
      {/* Top Universal Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Breadcrumb */}
          <div className="flex items-center gap-3">
            <Link 
              href="/"
              className="flex items-center gap-2 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-white font-black text-lg shadow-sm shadow-violet-500/25 group-hover:scale-105 transition-transform">
                B
              </div>
              <span className="text-lg font-black tracking-tight text-slate-950">
                Benefisto<span className="text-violet-600">.</span>
              </span>
            </Link>

            <span className="text-slate-300 hidden sm:inline">/</span>

            <Link 
              href="/"
              className="text-xs font-bold text-slate-500 hover:text-violet-700 hidden sm:inline-flex items-center gap-1 transition-colors"
            >
              <span>Coupons &amp; Deals</span>
            </Link>
          </div>

          {/* Quick Search & Country Selector */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-48 lg:w-64">
              <input
                type="text"
                placeholder="Search other store..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-slate-800 placeholder:text-slate-400 font-medium"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </form>

            {/* Country Selector */}
            <div className="relative">
              <select
                value={selectedCountry}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="appearance-none pl-7 pr-7 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20 cursor-pointer transition-all"
              >
                {Object.values(SUPPORTED_COUNTRIES).map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code}
                  </option>
                ))}
              </select>
              <Globe className="w-3.5 h-3.5 text-slate-500 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Back Home Button */}
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-xs font-bold text-slate-700 border border-slate-200 transition-all shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Coupon Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <CouponResultView 
          resultData={initialData}
          country={selectedCountry}
          onReset={() => router.push("/")}
        />
      </main>

      {/* Footer Disclaimer & Trust Signal */}
      <footer className="border-t border-slate-200/80 bg-white py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-3xl mx-auto space-y-2">
          <p className="font-semibold text-slate-700">
            Benefisto is an independent, AI-powered consumer shopping and savings platform.
          </p>
          <p>
            Merchant trademarks, logos, and brand names are the property of their respective owners. Their display does not imply official endorsement or direct sponsorship.
          </p>
          <div className="pt-4 flex items-center justify-center gap-4 text-slate-400">
            <Link href="/privacy" className="hover:text-slate-600 transition-colors">Privacy Policy</Link>
            <span>&bull;</span>
            <Link href="/terms" className="hover:text-slate-600 transition-colors">Terms of Service</Link>
            <span>&bull;</span>
            <Link href="/contact" className="hover:text-slate-600 transition-colors">Contact Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
