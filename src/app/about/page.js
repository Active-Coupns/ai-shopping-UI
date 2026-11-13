import Link from "next/link";
import { ShoppingBag, ArrowLeft, Sparkles, Target, ShieldCheck, HeartHandshake, Zap, Compass, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "About Us — The Benefisto AI Mission",
  description: "Learn about Benefisto AI. Discover our mission to bring radical price transparency, authentic merchant checkout links, unbiased AI trust sheets, and smart shopping co-piloting to global consumers.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/20 selection:text-indigo-400">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 pointer-events-none" />

      {/* Top Header Navigation */}
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Benefisto</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="text-base font-black tracking-tight text-white">
              Benefisto <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">AI</span>
            </span>
          </div>
        </div>
      </header>

      {/* Hero & Vision Section */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Future of Consumer Shopping</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
          Shopping should be honest, fast, and transparent.
        </h1>
        <p className="text-base sm:text-lg text-slate-300 mb-10 leading-relaxed font-light">
          Online shopping was supposed to save us time and money. Instead, it became an overwhelming labyrinth of inflated strike-through prices, fake discount timers, sponsored review manipulation, and 20 open browser tabs. We built Benefisto to fix that.
        </p>

        {/* Founding Philosophy Card */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-950/50 via-slate-900/80 to-slate-900/90 border border-indigo-500/30 shadow-xl mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/30">
              <Target className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-white">Our Founding Mission</h2>
          </div>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
            Benefisto is built on an unwavering commitment: <strong>to serve as the consumer’s uncompromising advocate</strong>. We do not sell products, we do not operate storefronts, and we never manipulate search results for advertiser favoritism.
          </p>
          <p className="text-slate-400 text-sm leading-relaxed">
            By combining high-speed price discovery across major verified retailers with conversational intelligence, review synthesis, and interactive trial rooms, we empower shoppers to make high-conviction decisions in seconds rather than hours.
          </p>
        </div>

        {/* 4 Pillars of Excellence */}
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-6 flex items-center gap-2.5">
          <Compass className="w-6 h-6 text-indigo-400" />
          <span>The Four Pillars of the Benefisto Experience</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-white font-bold text-base mb-2">1. Direct Authentic PDPs</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              We never drop you onto generic search result pages or spammy aggregator listings. Every store link navigates directly to the exact Product Detail Page (PDP) on the official retailer ready for checkout.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-white font-bold text-base mb-2">2. Real-Time Multi-Store Discovery</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Compare prices across Amazon, Flipkart, Croma, Reliance Digital, Walmart, Best Buy, and leading brands simultaneously. Discover the true lowest price with zero store hijacking.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-white font-bold text-base mb-2">3. AI Trust Sheet & Sentiment</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Stop reading 200 conflicting reviews. Our Trust Sheet synthesizes verified buyer sentiment, identifies genuine build-quality strengths and failure points, and gives you an unbiased reliability score.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-9 h-9 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-3">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-white font-bold text-base mb-2">4. Virtual Try-On Studio</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              For apparel and lifestyle, visualize how clothing looks on realistic models before buying. Sizing uncertainty and return friction are eliminated through visual intelligence.
            </p>
          </div>
        </div>

        {/* Algorithmic Neutrality Guarantee */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 mb-12">
          <h2 className="text-white font-bold text-base mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Our Algorithmic Neutrality Pledge</span>
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed mb-3">
            In traditional shopping engines, the top result is frequently whoever paid the highest advertising fee. At Benefisto, <strong>ranking and comparisons are purely mathematical and consumer-first</strong>:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-slate-400">
            <li>We do not accept pay-for-placement sponsorships that distort genuine price rankings.</li>
            <li>Store selections are strictly isolated—if you choose Store A, you go to Store A with zero competitor hijacking.</li>
            <li>We monetize via transparent affiliate partnerships that cost you ₹0 / $0 extra.</li>
          </ul>
        </div>

        {/* Global Reach */}
        <div className="p-6 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-center">
          <h2 className="text-white font-bold text-base mb-2">Serving Shoppers Across 6 Global Markets</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mb-4">
            Proudly delivering real-time pricing intelligence across India, the United States, the United Kingdom, Canada, the United Arab Emirates, and Australia.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-indigo-300">
            <span>support@benefisto.com</span>
          </div>
        </div>

        {/* Footer Navigation Across All 5 Legal Pages */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
          <span className="text-indigo-400 font-semibold">About Us</span>
          <span>•</span>
          <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
          <span>•</span>
          <Link href="/disclaimer" className="hover:text-slate-300 transition-colors">Disclaimer</Link>
          <span>•</span>
          <Link href="/contact" className="hover:text-slate-300 transition-colors">Contact Support</Link>
        </div>
      </main>
    </div>
  );
}
