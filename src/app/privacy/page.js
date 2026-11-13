import Link from "next/link";
import { ShoppingBag, ArrowLeft, ShieldCheck, Lock, Eye, Database, Globe, UserCheck, RefreshCw } from "lucide-react";

export const metadata = {
  title: "Privacy Policy & Data Protection — Benefisto AI",
  description: "Official privacy policy of Benefisto AI. Details our zero-password policy, ephemeral virtual try-on processing, regional cloud segmentation, and global compliance with DPDP Act and GDPR.",
};

export default function PrivacyPage() {
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
          <Lock className="w-3.5 h-3.5" />
          <span>Global Data Protection & Privacy Standard</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-400 mb-8">
          Last Updated: November 2026 • Compliant with Indian DPDP Act 2023, EU/UK GDPR, and California CCPA/CPRA
        </p>

        <div className="space-y-8 text-slate-300 text-sm leading-relaxed">
          {/* Section 1: Core Philosophy */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <h2>1. Privacy by Design & Zero Unnecessary Collection</h2>
            </div>
            <p className="mb-3">
              At Benefisto (<strong>https://www.benefisto.com</strong>), we believe consumer privacy is a fundamental human right. Our software architecture is intentionally engineered around a simple premise: <em>the most secure data is the data that is never collected in the first place</em>.
            </p>
            <p>
              Benefisto does not collect, demand, or store government identification numbers (Aadhaar, SSN), credit or debit card details, bank credentials, or private messaging content. We operate solely as an intelligent shopping decision co-pilot.
            </p>
          </section>

          {/* Section 2: Virtual Try-On (VTON) User Photo Processing */}
          <section className="p-6 rounded-2xl bg-indigo-950/30 border border-indigo-500/30">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <Eye className="w-5 h-5 text-indigo-400" />
              <h2>2. Virtual Try-On (VTON) Image & Visual Privacy Standard</h2>
            </div>
            <p className="mb-3">
              When using the Benefisto Virtual Trial Room or Style Studio, you may choose to upload a personal photo or utilize our pre-rendered model personas to visualize clothing items. We enforce the strictest global standards for visual processing:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-emerald-400 font-bold block mb-1">0% Permanent Storage</span>
                <span className="text-xs text-slate-400">Uploaded user images are processed strictly in ephemeral in-memory RAM solely for the requested styling preview and are never written to permanent disk storage.</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-emerald-400 font-bold block mb-1">Zero AI Model Training</span>
                <span className="text-xs text-slate-400">Your personal photos and facial or body representations are NEVER used to train, fine-tune, or calibrate public machine learning models.</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-emerald-400 font-bold block mb-1">No Third-Party Selling</span>
                <span className="text-xs text-slate-400">We never sell, rent, monetize, or distribute user images to advertisers, data brokers, or commercial third parties.</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-emerald-400 font-bold block mb-1">Instant Session Erasure</span>
                <span className="text-xs text-slate-400">Exiting the trial studio or ending your active browser session immediately wipes temporary rendering buffers.</span>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              * In compliance with biometric privacy frameworks (including Illinois BIPA, GDPR Article 9, and Indian DPDP Act 2023), image processing requires your explicit, interactive opt-in consent before visual generation begins.
            </p>
          </section>

          {/* Section 3: User Authentication & Email Usage */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <Lock className="w-5 h-5 text-emerald-400" />
              <h2>3. User Authentication & Zero-Password Liability</h2>
            </div>
            <p className="mb-3">
              Benefisto utilizes enterprise-grade authentication powered by <strong>secure, cryptographically verified identity frameworks (including Google OAuth)</strong>:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-3 text-slate-400">
              <li><strong>Zero Password Storage:</strong> Benefisto does not store or process passwords on our servers. Authentication is securely verified via cryptographically signed tokens (JWTs) and official OAuth providers.</li>
              <li><strong>Purpose-Bound Email Usage:</strong> When you sign in, we receive your verified email address and public display name strictly to:
                <ol className="list-decimal list-inside ml-5 mt-1 space-y-1 text-slate-300">
                  <li>Synchronize your daily 10-search quota across devices (mobile, laptop, tablet).</li>
                  <li>Persist your bookmarked deals and saved comparison items.</li>
                  <li>Deliver price-drop alerts that you explicitly opt in to receive.</li>
                </ol>
              </li>
              <li><strong>Zero Spam Guarantee:</strong> We do not send promotional marketing blasts, nor do we disclose your email to third-party marketing firms.</li>
            </ul>
          </section>

          {/* Section 4: Regional Data Segmentation & Data Residency */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <Globe className="w-5 h-5 text-indigo-400" />
              <h2>4. Global Data Residency & Country-Specific Server Partitioning</h2>
            </div>
            <p className="mb-3">
              To respect international data sovereignty and deliver ultra-low-latency service across our supported markets (United States, United Kingdom, Canada, European Union, United Arab Emirates, Australia, and India):
            </p>
            <p className="mb-3">
              <strong>Local Data Residency & Regional Partitioning:</strong> For jurisdictions and territories with specific data residency or sovereignty requirements, Benefisto assigns and processes non-sensitive user telemetry (such as search queries, category filters, and price alert preferences) within designated <strong>regional cloud nodes and country-specific data partitions</strong>. Your activity data remains localized within your country&apos;s regional server boundary wherever mandated by local data governance regulations.
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400 mb-3">
              <li><strong>Data in Transit:</strong> End-to-end encrypted using Transport Layer Security (TLS 1.3).</li>
              <li><strong>Data at Rest:</strong> Encrypted using military-grade Advanced Encryption Standard (AES-256).</li>
              <li><strong>International Governance:</strong> Fully compliant with EU/UK Standard Contractual Clauses (SCCs), California CCPA/CPRA, and Section 16 of the Indian Digital Personal Data Protection Act, 2023.</li>
            </ul>
          </section>

          {/* Section 5: Cookies, Local Storage & Session State */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <Database className="w-5 h-5 text-purple-400" />
              <h2>5. Cookies & Local Browser Storage</h2>
            </div>
            <p className="mb-3">
              Benefisto uses minimal, essential browser cookies and LocalStorage items strictly necessary for core functionality:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400 mb-3">
              <li><strong>Session Cookies:</strong> Keep you securely logged in as you browse products.</li>
              <li><strong>LocalStorage Preferences:</strong> Remember your selected shopping country (e.g., India vs. US), active theme, and locally saved deals.</li>
              <li><strong>Zero Invasive Cross-Site Trackers:</strong> We do not deploy invasive third-party tracking pixels to stalk your browsing habits across unrelated websites.</li>
            </ul>
          </section>

          {/* Section 6: User Rights (DPDP Act, GDPR, CCPA) */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <UserCheck className="w-5 h-5 text-amber-400" />
              <h2>6. Your Global Rights (Right to Erasure, Access & Correction)</h2>
            </div>
            <p className="mb-3">
              Under applicable data protection frameworks—including the Indian DPDP Act 2023, EU/UK GDPR, and California Consumer Privacy Act (CCPA/CPRA)—you retain full control over your information:
            </p>
            <div className="space-y-2 text-slate-400 mb-3">
              <p>• <strong>Right to Know & Access:</strong> You can request a summary of the personal data associated with your account.</p>
              <p>• <strong>Right to Erasure (Right to be Forgotten):</strong> You may request permanent deletion of your account, search history, and saved preferences at any time.</p>
              <p>• <strong>Right to Withdraw Consent:</strong> You can revoke consent for price drop notifications or session tracking without affecting your basic access to the platform.</p>
              <p>• <strong>&quot;Do Not Sell or Share My Information&quot;:</strong> Benefisto does not sell, trade, or share your personal data with third parties for monetary consideration.</p>
            </div>
          </section>

          {/* Section 7: Data Protection Contact & Inquiries */}
          <section className="p-6 rounded-2xl bg-indigo-950/40 border border-indigo-500/20">
            <div className="flex items-center gap-2 mb-2">
              <RefreshCw className="w-4 h-4 text-indigo-400" />
              <h2 className="text-white font-bold text-base">Data Protection Officer & Privacy Desk</h2>
            </div>
            <p className="mb-3 text-slate-300">
              To exercise your data privacy rights, request data deletion, or submit an inquiry regarding our data handling practices, please contact our official privacy team:
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs text-indigo-300">
              <span>support@benefisto.com</span>
            </div>
            <p className="text-xs text-slate-400 mt-3">
              Privacy requests are acknowledged within 24 hours and fulfilled within 15 business days.
            </p>
          </section>
        </div>

        {/* Footer Navigation Across All 5 Legal Pages */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
          <Link href="/about" className="hover:text-slate-300 transition-colors">About Us</Link>
          <span>•</span>
          <span className="text-indigo-400 font-semibold">Privacy Policy</span>
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
