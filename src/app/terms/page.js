import Link from "next/link";
import { ShoppingBag, ArrowLeft, FileText, CheckCircle, AlertTriangle, Shield, Scale, Ban } from "lucide-react";

export const metadata = {
  title: "Terms of Service & User Agreement — Benefisto AI",
  description: "Official terms of service and consumer user agreement for Benefisto AI. Details our intermediary status, fair-use policy, limitation of liability, and dispute resolution framework.",
};

export default function TermsPage() {
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
          <FileText className="w-3.5 h-3.5" />
          <span>Legally Binding User Agreement</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
          Terms of Service
        </h1>
        <p className="text-sm text-slate-400 mb-8">
          Last Updated: November 2026 • Effective Upon Account Creation or Platform Use
        </p>

        <div className="space-y-8 text-slate-300 text-sm leading-relaxed">
          {/* Section 1: Agreement to Terms */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <CheckCircle className="w-5 h-5 text-indigo-400" />
              <h2>1. Agreement to Terms & Eligibility</h2>
            </div>
            <p className="mb-3">
              By accessing, browsing, searching, or otherwise using Benefisto (<strong>https://www.benefisto.com</strong>, including all associated subdomains, web applications, and services), you enter into a legally binding agreement with Benefisto AI (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
            </p>
            <p>
              If you do not agree to these Terms of Service, you must immediately discontinue use of the platform. You represent and warrant that you are at least 18 years of age (or have attained the age of legal majority in your jurisdiction) or are accessing the platform under the active supervision of a parent or legal guardian.
            </p>
          </section>

          {/* Section 2: Platform Scope & Intermediary Status */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <Shield className="w-5 h-5 text-emerald-400" />
              <h2>2. Scope of Services & Intermediary Safe Harbor</h2>
            </div>
            <p className="mb-3">
              Benefisto provides an online, software-driven retail price discovery utility, shopping co-pilot, and deal comparison guide. 
            </p>
            <p className="mb-3">
              <strong>We are strictly an independent technological intermediary and not an online merchant or seller.</strong> Benefisto does not sell, endorse, manufacture, deliver, or handle custody of any products displayed on the platform. All product purchases, billing, payments, order fulfillments, shipping, warranties, returns, and customer service issues are governed strictly by the contracts and terms established by the respective third-party retailers (e.g., Amazon, Walmart, Best Buy, Target, Currys, Argos, Flipkart, Croma, and official brand stores).
            </p>
            <p>
              Under international intermediary safe harbor principles and Section 79 of the Indian Information Technology Act, 2000, Benefisto disclaims direct liability for third-party merchant actions, listing errors, or order cancellations.
            </p>
          </section>

          {/* Section 3: Balanced Fair-Use & Acceptable Use Policy */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <Ban className="w-5 h-5 text-amber-400" />
              <h2>3. Acceptable Use & Fair Consumer Access</h2>
            </div>
            <p className="mb-3">
              Benefisto is designed and maintained for the personal, non-commercial use of individual shoppers seeking transparent retail savings. While we champion open web interoperability:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-400 mb-3">
              <li><strong>Personal Use:</strong> You agree to use the search engine and tools solely for personal consumer decision-making.</li>
              <li><strong>Server & Rate Protection:</strong> Automated, high-frequency queries, bulk automated data extraction, or bot-driven traffic designed to replicate or commercially redistribute our aggregated datasets without prior agreement is not supported, as it degrades service quality for genuine consumers.</li>
              <li><strong>Platform Security:</strong> You agree not to probe, scan, or breach our security boundaries, tamper with user authentication, or inject malicious payloads into our systems.</li>
            </ul>
          </section>

          {/* Section 4: Virtual Try-On & User Submissions */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <Scale className="w-5 h-5 text-purple-400" />
              <h2>4. Virtual Try-On (VTON) & Visual Preview Usage</h2>
            </div>
            <p className="mb-3">
              The Virtual Trial Room provides simulated previews of garments and styling. By uploading an image or utilizing our virtual personas:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-400 mb-3">
              <li>You confirm that you possess the necessary rights or consent for any personal photograph uploaded.</li>
              <li>You acknowledge that virtual styling outputs are simulated approximations for visual guidance only; fabric textures, drape, and exact physical fit may vary upon actual merchant delivery.</li>
              <li>Uploaded photographs are processed ephemerally in volatile memory and wiped upon session completion, in accordance with our Privacy Policy.</li>
            </ul>
          </section>

          {/* Section 5: Limitation of Liability ($0 / ₹0 Cap) */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h2>5. Limitation of Liability & Disclaimer of Warranties</h2>
            </div>
            <p className="mb-3">
              To the fullest extent permitted by applicable law, <strong>Benefisto is provided on an &quot;AS-IS&quot; and &quot;AS-AVAILABLE&quot; basis</strong>. We expressly disclaim all warranties of any kind, whether express, implied, or statutory, including warranties of merchantability, fitness for a particular purpose, pricing accuracy, or continuous uptime.
            </p>
            <p className="mb-3">
              In no event shall Benefisto, its founders, officers, or affiliates be liable for any indirect, incidental, punitive, consequential, or special damages (including lost profits, missed deal savings, or transaction disputes with third-party retailers).
            </p>
            <p>
              Because Benefisto is provided to you as a complimentary, zero-cost consumer service, <strong>our aggregate liability for any claim arising out of or relating to these terms or your use of the platform shall strictly not exceed ZERO RUPEES (₹0 / $0 USD)</strong>.
            </p>
          </section>

          {/* Section 6: Class Action Waiver & Mandatory Arbitration */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <Scale className="w-5 h-5 text-indigo-400" />
              <h2>6. Dispute Resolution, Class Action Waiver & Governing Law</h2>
            </div>
            <p className="mb-3">
              <strong>Individual Dispute Resolution:</strong> You and Benefisto agree that any legal controversy or claim arising out of or relating to these terms shall be resolved on an individual basis through amicable negotiation or binding individual arbitration, and not as a plaintiff or class member in any class, collective, or representative proceeding.
            </p>
            <p>
              <strong>Multi-Jurisdictional Framework & Governing Law:</strong> These Terms are structured in accordance with global commercial standards. For users in India, governing jurisdiction resides in Maharashtra; for international users across the United States, United Kingdom, European Union, Canada, United Arab Emirates, and Australia, claims shall be resolved in accordance with relevant international arbitration frameworks or applicable local consumer protection mandates.
            </p>
          </section>

          {/* Section 7: Inquiries & Notices */}
          <section className="p-6 rounded-2xl bg-indigo-950/40 border border-indigo-500/20">
            <h2 className="text-white font-bold text-base mb-2">Legal Notices & Service Contact</h2>
            <p className="mb-3 text-slate-300">
              Official legal notices, formal service requests, or terms inquiries should be directed to our dedicated legal and support desk:
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs text-indigo-300">
              <span>support@benefisto.com</span>
            </div>
          </section>
        </div>

        {/* Footer Navigation Across All 5 Legal Pages */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
          <Link href="/about" className="hover:text-slate-300 transition-colors">About Us</Link>
          <span>•</span>
          <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
          <span>•</span>
          <span className="text-indigo-400 font-semibold">Terms of Service</span>
          <span>•</span>
          <Link href="/disclaimer" className="hover:text-slate-300 transition-colors">Disclaimer</Link>
          <span>•</span>
          <Link href="/contact" className="hover:text-slate-300 transition-colors">Contact Support</Link>
        </div>
      </main>
    </div>
  );
}
