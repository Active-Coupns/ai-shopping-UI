import Link from "next/link";
import { 
  ShoppingBag, 
  ArrowLeft, 
  ShieldCheck, 
  Lock, 
  Eye, 
  Database, 
  Globe, 
  UserCheck, 
  RefreshCw, 
  Server, 
  Cpu, 
  Key, 
  AlertCircle, 
  Trash2, 
  ShieldAlert, 
  Scale, 
  CreditCard,
  Mail 
} from "lucide-react";

export const metadata = {
  title: "Privacy Policy & Data Protection — Benefisto AI",
  description: "Official, comprehensive Privacy Policy of Benefisto AI. Details our zero-password philosophy, ephemeral Virtual Try-On RAM processing, regional data residency partitioning, infrastructure disclosures, and compliance with the Indian DPDP Act 2023, EU/UK GDPR, and California CCPA/CPRA.",
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
          <span>Institutional Privacy & Data Governance</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
          Privacy Policy & Data Protection
        </h1>
        <p className="text-sm text-slate-400 mb-8">
          Last Updated: November 2026 • Compliant with Indian DPDP Act 2023, EU/UK GDPR, California CCPA/CPRA, and Global Standards
        </p>

        {/* Core Privacy Promise Callout */}
        <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 mb-8 text-xs text-indigo-200/90 leading-relaxed">
          <strong className="text-white font-semibold block mb-1">Our Universal Privacy Commitment:</strong>
          Benefisto AI is built on the engineering doctrine of &quot;Privacy by Design&quot;. We strictly collect only the absolute minimum data required to deliver shopping search results and synchronize bookmarks. We do not store passwords, we do not record your screen, we never sell your personal data, and any image uploaded for Virtual Try-On is processed strictly in volatile RAM and immediately wiped.
        </div>

        <div className="space-y-8 text-slate-300 text-sm leading-relaxed">
          {/* Section 1: Scope & Controller Identity */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <h2>1. Scope, Controller Identity & Privacy by Design Philosophy</h2>
            </div>
            <p className="mb-3">
              This Privacy Policy applies to personal data collected or processed through Benefisto (<strong>https://www.benefisto.com</strong>, including all associated subdomains, web applications, and digital services).
            </p>
            <p className="mb-3">
              For the purposes of applicable data protection legislation—including the Indian Digital Personal Data Protection Act, 2023 (DPDP Act), the European Union General Data Protection Regulation (Regulation (EU) 2016/679, &quot;GDPR&quot;), and the UK Data Protection Act 2018—the <strong>Data Fiduciary</strong> / <strong>Data Controller</strong> is Benefisto AI (&quot;Benefisto&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
            </p>
            <p>
              We firmly hold that consumer privacy is a fundamental human right. Our architecture is deliberately engineered to eliminate systemic data liability: <em>the most secure consumer data is the data that is never gathered in the first place</em>.
            </p>
          </section>

          {/* Section 2: Categories of Data We Collect */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <Database className="w-5 h-5 text-blue-400" />
              <h2>2. Information We Collect & What We Strictly NEVER Collect</h2>
            </div>
            <p className="mb-3">
              To operate our price discovery engine and provide user session features, we process only the following narrowly defined categories:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-400 mb-4 ml-2">
              <li><strong>User Identity Data:</strong> When you authenticate via our passwordless email verification, we receive your verified email address and public display name. This identifier is used exclusively to associate your cross-device bookmarks, price alerts, and daily quota.</li>
              <li><strong>Search & Preference Data:</strong> Anonymous search terms, category filters, and selected shopping country (e.g., India, US, UK) stored locally in browser storage or cached temporarily to deliver tailored pricing results.</li>
              <li><strong>Technical Telemetry:</strong> Anonymized HTTP request headers, IP address (truncated and masked for geolocation and DDoS protection), browser type, and operating system version strictly for traffic routing and platform defense.</li>
              <li><strong>Ephemeral Visual Media:</strong> Photographs voluntarily submitted for Virtual Try-On previews.</li>
            </ul>
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-red-400 font-bold block mb-1">What We Strictly NEVER Collect or Store:</span>
              <p className="text-xs text-slate-400 leading-relaxed">
                We NEVER collect, solicit, or store static passwords, government-issued identification numbers (such as Aadhaar, Social Security Numbers, National Insurance numbers, or passport copies), credit card or debit card numbers, CVVs, bank credentials, biometrics for identity verification, or private messaging content.
              </p>
            </div>
          </section>

          {/* Section 3: Virtual Try-On (VTON) Biometric & Ephemeral Visual Processing */}
          <section className="p-6 rounded-2xl bg-indigo-950/30 border border-indigo-500/30">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <Eye className="w-5 h-5 text-indigo-400" />
              <h2>3. Virtual Try-On (VTON) Ephemeral Image Processing Standard</h2>
            </div>
            <p className="mb-3">
              Benefisto&apos;s Virtual Trial Room enables consumers to preview apparel fits using simulated visual rendering. If you choose to upload a personal photo rather than utilizing our pre-rendered model personas:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-emerald-400 font-bold text-xs block mb-1">0% Disk Storage</span>
                <span className="text-xs text-slate-400">Uploaded images are received into volatile Random Access Memory (RAM) solely for the immediate rendering compute pass and are never written to permanent disk storage.</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-emerald-400 font-bold text-xs block mb-1">Zero Machine Learning Training</span>
                <span className="text-xs text-slate-400">Your photographs and likeness are NEVER used to train, retrain, fine-tune, or benchmark public or proprietary artificial intelligence models.</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-emerald-400 font-bold text-xs block mb-1">No Data Broker Sharing</span>
                <span className="text-xs text-slate-400">We do not sell, license, share, or monetize user images or facial representations with advertising networks, third-party brokers, or commercial vendors.</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-emerald-400 font-bold text-xs block mb-1">Instant Session Purge</span>
                <span className="text-xs text-slate-400">Upon generation of the preview or termination of your active browser session, temporary memory buffers are completely wiped.</span>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              * In strict compliance with global biometric protection standards (including the Illinois Biometric Information Privacy Act (BIPA), GDPR Article 9, and Indian DPDP Act 2023), image processing requires your explicit, affirmative, interactive opt-in consent prior to rendering.
            </p>
          </section>

          {/* Section 4: Lawful Grounds for Processing */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <Scale className="w-5 h-5 text-purple-400" />
              <h2>4. Lawful Grounds for Processing (GDPR Art. 6 & Indian DPDP Act)</h2>
            </div>
            <p className="mb-3">
              We process personal data only when substantiated by valid legal bases recognized under international data protection law:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-400 mb-3 ml-2">
              <li><strong>Performance of a Contract (GDPR Art. 6(1)(b)):</strong> Delivering our shopping discovery utility, authenticating your session, synchronizing your saved deal bookmarks across your devices, and maintaining your query quota.</li>
              <li><strong>Legitimate Interests (GDPR Art. 6(1)(f)):</strong> Maintaining cybersecurity perimeters, mitigating malicious automated scraping, preventing denial-of-service abuse, and debugging fatal application runtime errors.</li>
              <li><strong>Explicit Consent (GDPR Art. 6(1)(a) & DPDP Act Sec. 6):</strong> Processing voluntarily uploaded photographs in the Virtual Trial Room, or delivering transactional price-drop alert notifications that you affirmatively subscribe to receive.</li>
              <li><strong>Legal Compliance (GDPR Art. 6(1)(c)):</strong> Complying with statutory notice requirements, valid judicial warrants, or lawful requests by designated law enforcement authorities.</li>
            </ul>
          </section>

          {/* Section 5: Payment Data Security & Merchant of Record Processing */}
          <section className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900/80 to-slate-900/90 border border-indigo-500/30 shadow-xl">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <CreditCard className="w-5 h-5 text-indigo-400" />
              <h2>5. Payment Data Security & Merchant of Record Processing (Dodo Payments Inc.)</h2>
            </div>
            <p className="mb-3">
              When you voluntarily purchase consumable digital software credit packs (for AI Virtual Try-On or AI Deep Search), financial checkout transactions and billing data are processed exclusively through our authorized global Merchant of Record, <strong>Dodo Payments Inc.</strong>
            </p>
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 mb-3 text-xs leading-relaxed space-y-2">
              <p>
                <strong>PCI-DSS Level 1 Security:</strong> All credit/debit card numbers, UPI handles, Apple Pay credentials, Net Banking authentications, and billing addresses are captured and tokenized directly by Dodo Payments pursuant to the highest PCI-DSS Level 1 compliance standards and end-to-end TLS encryption.
              </p>
              <p>
                <strong>Zero Benefisto Raw Card Storage:</strong> <strong>Benefisto AI does NOT capture, collect, handle, log, or store your raw card numbers, CVV codes, bank PINs, or netbanking passwords on any of our servers</strong>. We never have access to your sensitive financial instruments.
              </p>
              <p>
                <strong>Webhook Reconciliation Data:</strong> Benefisto receives solely an encrypted server-to-server webhook confirmation from Dodo Payments containing an opaque transaction reference ID, your authenticated email/user ID, payment status, currency, and purchased credit bundle size for the sole purpose of provisioning your credits.
              </p>
            </div>
            <p className="text-xs text-slate-400">
              For billing questions, invoice copies, or payment reconciliation inquiries, contact our billing desk at <strong>support@benefisto.com</strong>.
            </p>
          </section>

          {/* Section 6: Cloud Infrastructure & Subprocessors */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <Server className="w-5 h-5 text-emerald-400" />
              <h2>6. Cloud Infrastructure, Hosting & Subprocessors</h2>
            </div>
            <p className="mb-3">
              Benefisto partners with premier, SOC2 Type II, ISO 27001, and PCI-DSS certified cloud infrastructure providers to host and secure our platform. We categorize our third-party subprocessors by operational function:
            </p>
            <div className="space-y-3 mb-3">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-white font-semibold text-xs block mb-1">Global Edge Network & DDoS Mitigation</span>
                <p className="text-xs text-slate-400">Enterprise edge caching, DNS routing, TLS encryption termination, Web Application Firewall (WAF), and automated bot challenge resolution.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-white font-semibold text-xs block mb-1">Merchant of Record & Payment Rail Processing</span>
                <p className="text-xs text-slate-400">PCI-DSS Level 1 compliant digital software billing, merchant of record processing, regional tax compliance, and automated fraud prevention (Dodo Payments Inc.).</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-white font-semibold text-xs block mb-1">Secure Authentication & Identity Federation</span>
                <p className="text-xs text-slate-400">Cryptographically signed JSON Web Token (JWT) verification, one-time passcode delivery, and multi-factor identity infrastructure.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-white font-semibold text-xs block mb-1">Serverless Compute & Ephemeral Caching</span>
                <p className="text-xs text-slate-400">Isolated, ephemeral microVM execution environments and in-memory high-throughput key-value caches for rate-limit coordination.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-white font-semibold text-xs block mb-1">Transactional Communication Gateways</span>
                <p className="text-xs text-slate-400">Dedicated transactional relay infrastructure strictly for dispatching requested one-time login passcodes and opted-in price alert digests.</p>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              All subprocessors are bound by rigorous Data Processing Agreements (DPAs) requiring adherence to strict confidentiality, technical and organizational security measures, and the prohibition of data repurposing.
            </p>
          </section>

          {/* Section 7: Cross-Border Transfers & Regional Data Localization */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <Globe className="w-5 h-5 text-cyan-400" />
              <h2>7. Cross-Border Data Transfers & Regional Data Partitioning</h2>
            </div>
            <p className="mb-3">
              Benefisto operates across multiple international consumer retail markets (including India, the United States, the United Kingdom, Canada, the European Union, the United Arab Emirates, and Australia).
            </p>
            <p className="mb-3">
              <strong>Regional Data Residency:</strong> Where required by local statutory mandates (such as Section 16 of the Indian DPDP Act 2023 or EU data residency directives), non-sensitive user telemetry, shopping country selections, and price alert configurations are routed to and partitioned within designated <strong>regional cloud nodes and geographic database partitions</strong>.
            </p>
            <p>
              <strong>International Transfer Mechanisms:</strong> Any cross-border transfer of personal data originating from the European Economic Area (EEA) or UK to servers in other jurisdictions is executed pursuant to the European Commission&apos;s Standard Contractual Clauses (SCCs) or UK International Data Transfer Addendum, supplemented by technical safeguards including robust encryption.
            </p>
          </section>

          {/* Section 8: Cookies, LocalStorage & Session State */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <Key className="w-5 h-5 text-amber-400" />
              <h2>8. Cookies & Local Browser Storage</h2>
            </div>
            <p className="mb-3">
              Benefisto deploys minimal, strictly necessary cookies and HTML5 LocalStorage entries designed exclusively to support essential platform operations:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-400 mb-3 ml-2">
              <li><strong>Session State Token:</strong> Secure, HTTP-only, encrypted authentication tokens to maintain your verified session.</li>
              <li><strong>Marketplace Configuration:</strong> LocalStorage keys storing your selected shopping market (e.g., India vs. United States), chosen currency symbol, and dark theme state.</li>
              <li><strong>Local Deal Stash:</strong> Client-side caching of your locally saved deal bookmarks to ensure instant offline availability.</li>
            </ul>
            <p className="text-xs text-slate-400">
              <strong>Strictly Zero Invasive Cross-Site Ad Trackers:</strong> We do NOT deploy third-party advertising tracking pixels, cross-domain fingerprinting beacons, or behavioral monitoring scripts designed to profile your web activity across external websites.
            </p>
          </section>

          {/* Section 9: Telemetry, Error Logs & Zero Session Replay */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <ShieldAlert className="w-5 h-5 text-red-400" />
              <h2>9. Error Logging & Strict Zero Session Replay Guarantee</h2>
            </div>
            <p className="mb-3">
              To guarantee the operational stability and security of our search systems, we maintain an automated error telemetry pipeline:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-400 mb-3 ml-2">
              <li><strong>Crash Diagnostics:</strong> When an unhandled runtime error occurs, our system logs only the anonymized code stack trace, browser user-agent string, and timestamp to our private error log.</li>
              <li><strong>STRICT ZERO SESSION REPLAY:</strong> Benefisto maintains a strict zero-tolerance policy against invasive session replay software. <strong>We do NOT install, run, or permit session recording software (such as Hotjar, FullStory, Microsoft Clarity, or rrweb)</strong>. We never record your screen, mouse movements, keystrokes, or scrolling behavior.</li>
            </ul>
          </section>

          {/* Section 10: Data Retention & Automated Erasure */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <Trash2 className="w-5 h-5 text-pink-400" />
              <h2>10. Data Retention & Automated Erasure Schedules</h2>
            </div>
            <p className="mb-3">
              We adhere strictly to the principle of storage limitation:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-400 mb-3 ml-2">
              <li><strong>Virtual Try-On Buffers:</strong> Ephemeral in-memory image buffers are purged immediately upon generation or browser exit (zero persistent retention).</li>
              <li><strong>Daily Search Quota Logs:</strong> IP-rate counters and hourly quota tallies automatically reset on a rolling 24-hour cycle.</li>
              <li><strong>Account Identifiers & Bookmarks:</strong> Maintained for the lifetime of your active registered account, or until you submit a deletion request.</li>
              <li><strong>Account Deletion Purge:</strong> When an account deletion is requested, all associated email records, saved items, and active alert subscriptions are permanently wiped within thirty (30) calendar days.</li>
            </ul>
          </section>

          {/* Section 11: Technical & Organizational Security Measures */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <Lock className="w-5 h-5 text-emerald-400" />
              <h2>11. Technical & Organizational Security Measures (TOMs)</h2>
            </div>
            <p className="mb-3">
              Benefisto implements robust, multi-layered cybersecurity safeguards to protect against unauthorized access, alteration, disclosure, or destruction of data:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-400 mb-3 ml-2">
              <li><strong>Encryption in Transit:</strong> 100% of network communications are encrypted utilizing modern Transport Layer Security protocols (TLS 1.3 / TLS 1.2) with strict HSTS enforcement.</li>
              <li><strong>Encryption at Rest:</strong> Internal databases and configuration vaults are encrypted using military-grade Advanced Encryption Standard (AES-256).</li>
              <li><strong>Zero-Trust Architecture:</strong> Administrative access to cloud configuration dashboards is restricted via multi-factor authentication, cryptographic passkeys, and strict Role-Based Access Control (RBAC).</li>
              <li><strong>Automated Edge Mitigation:</strong> Continuous real-time mitigation against SQL injection, cross-site scripting (XSS), credential stuffing, and volumetric network assaults.</li>
            </ul>
          </section>

          {/* Section 12: Global Data Subject Rights */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <UserCheck className="w-5 h-5 text-indigo-400" />
              <h2>12. Your Global Legal Rights (GDPR, DPDP Act 2023, CCPA)</h2>
            </div>
            <p className="mb-3">
              Regardless of your geographic location, Benefisto respects and enforces your statutory data privacy rights:
            </p>
            <div className="space-y-2 text-slate-300 text-xs mb-3">
              <p>• <strong>Right of Access & Confirmation:</strong> You have the right to request confirmation of whether we process your personal data and obtain a summary copy.</p>
              <p>• <strong>Right to Rectification & Correction:</strong> You may request the prompt correction or updating of any inaccurate or incomplete personal records.</p>
              <p>• <strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> You may request the permanent deletion of your account and associated personal data.</p>
              <p>• <strong>Right to Restrict Processing & Withdraw Consent:</strong> You may revoke consent for optional features (such as price alert emails) at any time without penalty.</p>
              <p>• <strong>Right to Data Portability:</strong> You may receive your saved account preferences and bookmarked items in a structured, machine-readable format.</p>
              <p>• <strong>Right to Grievance Redressal (DPDP Act):</strong> Indian data principals have the right to access an effective grievance redressal mechanism and nominate an individual to act on their behalf in the event of death or incapacity.</p>
            </div>
            <p className="text-xs text-slate-400">
              To exercise any of these rights, contact our Data Protection Desk at <strong>support@benefisto.com</strong>.
            </p>
          </section>

          {/* Section 13: California Consumer Privacy Act Disclosures */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <ShieldCheck className="w-5 h-5 text-purple-400" />
              <h2>13. California Consumer Privacy Act (CCPA / CPRA) Disclosures</h2>
            </div>
            <p className="mb-3">
              This section supplements our policy for residents of California pursuant to the California Consumer Privacy Act of 2018 as amended by the California Privacy Rights Act of 2020 (collectively, &quot;CCPA&quot;):
            </p>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 mb-3">
              <strong className="text-emerald-400 block mb-1 text-xs uppercase tracking-wider font-bold">&quot;DO NOT SELL OR SHARE MY PERSONAL INFORMATION&quot; GUARANTEE:</strong>
              <p className="text-xs text-slate-300">
                Benefisto has NEVER sold personal information to third parties, has NEVER shared personal information for cross-context behavioral advertising, and will NEVER do so. We do not sell consumer data for monetary or other valuable consideration.
              </p>
            </div>
            <p className="text-xs text-slate-400">
              California residents possess the right to request disclosure of categories of data collected, the right to deletion, the right to correct inaccurate data, and the right not to receive discriminatory treatment for exercising their CCPA rights.
            </p>
          </section>

          {/* Section 14: Protection of Minors & COPPA */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              <h2>14. Protection of Minors (COPPA & Global Safeguards)</h2>
            </div>
            <p className="mb-3">
              Benefisto is a universal shopping guide intended solely for general adult audiences and individuals with legal shopping capacity. The Platform is not structured or directed toward children under the age of 18 (or under 13 for purposes of the US Children&apos;s Online Privacy Protection Act, &quot;COPPA&quot;; or under 16 for purposes of the EU GDPR).
            </p>
            <p>
              We do not knowingly collect, solicit, or maintain personal information or photographs from children. If we discover that personal information of a minor has been submitted without verifiable parental consent, we will take immediate measures to permanently delete that information from our records.
            </p>
          </section>

          {/* Section 15: Data Protection Officer, Grievance Desk & Updates */}
          <section className="p-6 rounded-2xl bg-indigo-950/40 border border-indigo-500/20">
            <div className="flex items-center gap-2.5 mb-2 text-white font-bold text-base">
              <Mail className="w-4 h-4 text-indigo-400" />
              <h2>15. Data Protection Officer & Grievance Redressal Desk</h2>
            </div>
            <p className="mb-3 text-slate-300">
              For any questions, privacy inquiries, data subject access requests, or grievance complaints under the Indian DPDP Act 2023 or GDPR, please contact our dedicated Data Protection and Grievance Officer:
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs text-indigo-300 mb-3">
              <span>support@benefisto.com</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong>Response Timelines:</strong> Inquiries and rights requests are acknowledged within 24 to 48 hours and fulfilled within thirty (30) calendar days (or within fifteen (15) days where mandated by applicable law).
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
