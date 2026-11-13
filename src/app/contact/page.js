import Link from "next/link";
import { ShoppingBag, ArrowLeft, Mail, MessageSquare, LifeBuoy, Building2, ShieldAlert, Clock, CheckCircle } from "lucide-react";

export const metadata = {
  title: "Contact Us & Support — Benefisto AI",
  description: "Get in touch with Benefisto AI. Access our consumer support desk, retailer partnerships, and statutory grievance redressal officer under Indian IT Rules 2021.",
};

export default function ContactPage() {
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

      {/* Main Content Area */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
          <LifeBuoy className="w-3.5 h-3.5" />
          <span>Official Support & Inquiries</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
          Contact Us & Support Desk
        </h1>
        <p className="text-sm text-slate-400 mb-8 max-w-2xl leading-relaxed">
          Have a question, feedback on a price deal, or a partnership inquiry? We are here to help. Reach out directly to our dedicated teams below.
        </p>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
          {/* Card 1: Customer Support */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                <Mail className="w-5 h-5" />
              </div>
              <h2 className="text-white font-bold text-base mb-1">Consumer Help & Inquiries</h2>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Questions about search results, product comparisons, Trust Sheets, or Virtual Try-On styling.
              </p>
            </div>
            <div>
              <a 
                href="mailto:support@benefisto.com" 
                className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <span>support@benefisto.com</span>
              </a>
              <span className="block text-[11px] text-slate-500 mt-1">Typical reply within 24 hours</span>
            </div>
          </div>

          {/* Card 2: Merchant & Brand Partnerships */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <Building2 className="w-5 h-5" />
              </div>
              <h2 className="text-white font-bold text-base mb-1">Retailer & Affiliate Partnerships</h2>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                For verified e-commerce merchants, authorized distributors, and affiliate network integrations.
              </p>
            </div>
            <div>
              <a 
                href="mailto:support@benefisto.com?subject=Partnership%20Inquiry" 
                className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <span>support@benefisto.com</span>
              </a>
              <span className="block text-[11px] text-slate-500 mt-1">Subject: Partnership Inquiry</span>
            </div>
          </div>
        </div>

        {/* Statutory Grievance Redressal Desk (Mandatory under Indian IT Rules 2021) */}
        <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-slate-900/80 to-slate-900/90 border border-indigo-500/30 shadow-xl mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Statutory Grievance Redressal & Global Compliance Desk</h2>
              <p className="text-xs text-slate-400">Operating in accordance with international intermediary governance, Consumer Protection (E-Commerce) Rules, and Rule 3(2) of the Information Technology Rules, 2021</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
            If you have any grievance, legal inquiry, or consumer complaint regarding content, intellectual property, or data processing on Benefisto, you may contact our designated Grievance Officer:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs mb-6">
            <div>
              <span className="text-slate-500 block mb-1">Designation</span>
              <span className="text-slate-200 font-semibold">Grievance Redressal Officer</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-1">Official Grievance Email</span>
              <a href="mailto:support@benefisto.com?subject=Formal%20Grievance%20Notice" className="text-indigo-400 hover:underline font-mono">
                support@benefisto.com
              </a>
            </div>
            <div>
              <span className="text-slate-500 block mb-1">Jurisdiction & Location</span>
              <span className="text-slate-200">Maharashtra, Republic of India</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-1">Service Platform</span>
              <span className="text-slate-200">Benefisto AI (https://www.benefisto.com)</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400 border-t border-slate-800/80 pt-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>Acknowledgement:</strong> Within 24 hours of receipt</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>Resolution Timeline:</strong> Within 15 business days</span>
            </div>
          </div>
        </section>

        {/* Global Operations Card */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 leading-relaxed mb-10">
          <div className="flex items-center gap-2 text-white font-bold text-sm mb-2">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            <span>Digital-First Global Operations</span>
          </div>
          <p>
            Benefisto operates as an agile, digital-first technology platform serving consumers across India, the United States, the United Kingdom, Canada, the United Arab Emirates, and Australia. Our support systems are monitored continuously to ensure prompt, transparent assistance.
          </p>
        </div>

        {/* Footer Navigation Across All 5 Legal Pages */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
          <Link href="/about" className="hover:text-slate-300 transition-colors">About Us</Link>
          <span>•</span>
          <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
          <span>•</span>
          <Link href="/disclaimer" className="hover:text-slate-300 transition-colors">Disclaimer</Link>
          <span>•</span>
          <span className="text-indigo-400 font-semibold">Contact Support</span>
        </div>
      </main>
    </div>
  );
}
