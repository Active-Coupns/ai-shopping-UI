import Link from "next/link";
import { 
  ShoppingBag, 
  ArrowLeft, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Shield, 
  Scale, 
  Ban, 
  Lock, 
  Cpu, 
  ExternalLink, 
  HelpCircle, 
  Clock, 
  FileCode, 
  Globe, 
  Mail 
} from "lucide-react";

export const metadata = {
  title: "Terms of Service & User Agreement — Benefisto AI",
  description: "Official, comprehensive Terms of Service and legally binding User Agreement for Benefisto AI. Details our intermediary safe harbor status, acceptable use, limitation of liability, intellectual property, DMCA takedown procedures, and dispute resolution framework.",
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
          <span>Institutional Legal Framework</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
          Terms of Service & User Agreement
        </h1>
        <p className="text-sm text-slate-400 mb-8">
          Last Updated: November 2026 • Effective Immediately Upon Access, Account Creation, or Platform Use
        </p>

        {/* Executive Summary Callout */}
        <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 mb-8 text-xs text-indigo-200/90 leading-relaxed">
          <strong className="text-white font-semibold block mb-1">Executive Summary for Shoppers:</strong>
          Benefisto AI provides a zero-cost, software-driven retail price discovery engine, shopping assistant, and virtual preview utility. We are an informational intermediary and not an e-commerce seller or merchant. We do not process payments, stock inventory, or handle shipping. When you buy a product through links on Benefisto, you purchase directly from the third-party merchant on their own terms. Please read these Terms carefully as they govern your legal relationship with Benefisto AI.
        </div>

        <div className="space-y-8 text-slate-300 text-sm leading-relaxed">
          {/* Section 1: Agreement to Terms & Eligibility */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <CheckCircle className="w-5 h-5 text-indigo-400" />
              <h2>1. Agreement to Terms & Eligibility</h2>
            </div>
            <p className="mb-3">
              By accessing, browsing, searching, creating an account on, or otherwise utilizing Benefisto (accessible at <strong>https://www.benefisto.com</strong>, including all associated subdomains, web applications, APIs, widgets, and mobile or desktop digital touchpoints, collectively referred to as the &quot;Platform&quot; or &quot;Services&quot;), you enter into a legally binding contract with Benefisto AI (&quot;Benefisto&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
            </p>
            <p className="mb-3">
              If you do not unconditionally agree to all terms, covenants, and restrictions contained within these Terms of Service, you must immediately cease all access and use of the Platform.
            </p>
            <p>
              <strong>Eligibility Warranty:</strong> You represent, warrant, and covenant that: (a) you have reached the legal age of majority in your jurisdiction of residence (and are at least 18 years of age), or possess legal parental or guardian consent to use the Platform under their direct supervision; (b) you possess the full legal power and authority to enter into these Terms; and (c) your use of our Services does not violate any applicable local, state, national, or international statute, ordinance, or regulation.
            </p>
          </section>

          {/* Section 2: Platform Scope & Intermediary Safe Harbor */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <Shield className="w-5 h-5 text-emerald-400" />
              <h2>2. Scope of Services & Intermediary Safe Harbor Status</h2>
            </div>
            <p className="mb-3">
              Benefisto provides an automated, software-driven retail intelligence, price discovery, product specification comparison, and deal identification utility. 
            </p>
            <p className="mb-3">
              <strong>Strict Intermediary Classification:</strong> Benefisto operates exclusively as an independent technological intermediary, informational discovery platform, and affiliate publisher. <strong>Benefisto is not an online merchant, seller, retailer, distributor, auctioneer, or e-commerce store.</strong> Benefisto does not manufacture, warehouse, package, label, dispatch, deliver, invoice, inspect, or hold custody of any physical or digital goods listed or referenced on the Platform.
            </p>
            <p className="mb-3">
              <strong>Statutory Safe Harbor Protections:</strong> To the fullest extent recognized under applicable law, Benefisto claims full safe harbor immunity as an intermediary under:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-400 mb-3 ml-2">
              <li>Section 79 of the Indian Information Technology Act, 2000, and the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules;</li>
              <li>Section 230 of Title 47 of the United States Code (Communications Decency Act);</li>
              <li>Articles 12 to 15 of the European Union Directive 2000/31/EC (e-Commerce Directive) and Regulation (EU) 2022/2065 (Digital Services Act); and</li>
              <li>Equivalent statutory provisions providing intermediary safe harbor protection in any other applicable jurisdiction.</li>
            </ul>
            <p>
              Benefisto does not initiate third-party merchant transmissions, select the recipients of the transmissions, or modify the product representations established by external retailers.
            </p>
          </section>

          {/* Section 3: Third-Party Retailers & Independent Transactions */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <ExternalLink className="w-5 h-5 text-blue-400" />
              <h2>3. Third-Party Merchants & Independent Commercial Transactions</h2>
            </div>
            <p className="mb-3">
              When you select a product offer, deal button, or store link on Benefisto, you are redirected via outgoing hyperlink or affiliate tracking conduit to an independent third-party merchant website (such as Amazon, Walmart, Best Buy, Target, Currys, Argos, Flipkart, Croma, or official brand storefronts).
            </p>
            <p className="mb-3">
              <strong>Independent Contracts:</strong> Any commercial purchase, order placement, monetary payment, credit card transaction, shipping arrangement, product delivery, customer service request, warranty claim, replacement, return, or refund occurs <strong>exclusively and directly between you and the respective third-party merchant</strong>.
            </p>
            <p>
              Benefisto is not a party to, nor an agent, partner, joint venturer, or guarantor of, any transaction between you and any third-party merchant. We expressly disclaim any liability, warranty, or responsibility for merchant order non-fulfillment, billing errors, delayed shipments, defective merchandise, counterfeit inventory, or merchant contractual breaches.
            </p>
          </section>

          {/* Section 4: Retail Pricing Volatility & Inventory Latency */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <Clock className="w-5 h-5 text-amber-400" />
              <h2>4. Real-Time Price Volatility, Deal Expirations & Latency</h2>
            </div>
            <p className="mb-3">
              E-commerce merchant pricing, promotional coupon codes, shipping surcharges, import tariffs, and inventory levels are highly volatile and change dynamically based on retailer algorithms, flash sales, merchant supply constraints, and regional tax variations.
            </p>
            <p className="mb-3">
              While Benefisto utilizes automated resolution pipelines to display the most accurate pricing data possible, <strong>all pricing, inventory status, deal banners, and promotional terms are presented on an &quot;AS-IS&quot; and &quot;AS-AVAILABLE&quot; informational basis</strong>. There may occasionally be latency between the time a merchant modifies a price on their storefront and the time that price refreshes on our Platform.
            </p>
            <p>
              <strong>Final Checkout Price Prevails:</strong> You acknowledge that the binding, final purchase price is strictly the price displayed on the external merchant’s official checkout screen at the exact moment of payment execution. Benefisto shall not be liable for any discrepancy between prices indexed on our Platform and amounts billed by external merchants.
            </p>
          </section>

          {/* Section 5: User Accounts, Authentication & Passwordless Security */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <Lock className="w-5 h-5 text-emerald-400" />
              <h2>5. User Accounts, Passwordless Verification & Access Credentials</h2>
            </div>
            <p className="mb-3">
              Benefisto utilizes modern, secure, passwordless authentication architectures (including one-time passcodes delivered to your verified email address and cryptographic identity federation). We do not store or process static account passwords on our servers.
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-400 mb-3 ml-2">
              <li><strong>Account Confidentiality:</strong> You are solely responsible for maintaining control over the email inbox associated with your account and for all activities that occur under your session.</li>
              <li><strong>Accurate Information:</strong> You agree to provide a valid, authentic email address owned by you. Creating accounts using disposable, temporary, or bot-generated email inboxes designed to circumvent daily query limits is strictly prohibited.</li>
              <li><strong>Immediate Notification:</strong> You agree to immediately notify Benefisto at <code>support@benefisto.com</code> if you detect any unauthorized access, compromise, or security incident involving your account.</li>
            </ul>
            <p>
              Benefisto reserves the right, in its sole discretion, to suspend, throttle, or terminate accounts that exhibit fraudulent, automated, or abusive activity.
            </p>
          </section>

          {/* Section 6: Acceptable Use Policy & Anti-Scraping / Anti-Bot Prohibitions */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <Ban className="w-5 h-5 text-red-400" />
              <h2>6. Acceptable Use Policy & Platform Protection Covenants</h2>
            </div>
            <p className="mb-3">
              Benefisto is engineered and maintained for the personal, non-commercial use of individual human shoppers seeking genuine retail savings. You expressly agree that you shall NOT, directly or indirectly:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-400 mb-3 ml-2">
              <li><strong>Automated Extraction & Scraping:</strong> Deploy, operate, or utilize any automated scraping software, spider, crawler, bot, script, batch query, or algorithmic data harvester to systematically copy, extract, index, cache, or mirror our pricing databases, deal aggregations, or search result outputs without our prior written authorization.</li>
              <li><strong>Service Disruption & DDoS:</strong> Engage in any activity that imposes an unreasonable, disproportionate, or disruptive load on our computing infrastructure, networks, or caching layers, including distributed denial-of-service (DDoS) attacks or query flood scripts.</li>
              <li><strong>Circumvention of Access Controls:</strong> Bypass, disable, or tamper with our rate-limiting headers, daily search quotas (e.g., our 10-search daily quota), Cloudflare bot mitigation systems, IP reputation barriers, or security perimeters.</li>
              <li><strong>Reverse Engineering:</strong> Decompile, reverse engineer, disassemble, decipher, or otherwise attempt to derive source code, underlying neural network prompts, proprietary scoring formulas, or internal database architectures.</li>
              <li><strong>Commercial Exploitation:</strong> Frame, white-label, re-sell, license, sub-license, or commercially redistribute our search results, Trust Sheet data, or Virtual Trial Room outputs to third parties for commercial gain.</li>
              <li><strong>Malicious Code Injection:</strong> Transmit or upload any trojans, worms, logic bombs, spyware, keystroke loggers, or other payloads designed to interrupt, destroy, or limit software or hardware functionality.</li>
            </ul>
          </section>

          {/* Section 7: Virtual Try-On (VTON) & Ephemeral Visual Rendering License */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <Cpu className="w-5 h-5 text-purple-400" />
              <h2>7. Virtual Trial Room (VTON) & Ephemeral Visual Processing</h2>
            </div>
            <p className="mb-3">
              Our Virtual Trial Room allows consumers to generate simulated visual previews of apparel and garments, either by utilizing our pre-rendered model personas or by uploading a personal photograph.
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-400 mb-3 ml-2">
              <li><strong>User Image Warranties:</strong> If you upload a photograph, you warrant that you are the sole individual depicted in the image, or that you have obtained express, informed, written consent from the depicted individual. You strictly agree not to upload images depicting minors, non-consensual imagery, sexually explicit content, or copyrighted photographic works owned by third parties.</li>
              <li><strong>Ephemeral Processing License:</strong> You grant Benefisto a non-exclusive, worldwide, royalty-free, limited license to temporarily process and render your uploaded photograph solely within volatile computing memory (RAM) for the immediate generation of your visual preview. <strong>Benefisto does not permanently store, persist on disk, or train machine learning models on your uploaded images.</strong> Images are purged immediately upon session conclusion.</li>
              <li><strong>Simulation Disclaimer:</strong> Virtual styling outputs are algorithmic visual approximations intended for aesthetic guidance only. Fabric elasticity, exact physical drape, real-world color calibration, and tailoring fit may vary from digital previews upon physical delivery from the merchant.</li>
            </ul>
          </section>

          {/* Section 8: AI Shopping Assistant & Algorithmic Disclaimers */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <HelpCircle className="w-5 h-5 text-indigo-400" />
              <h2>8. AI Shopping Assistant, Trust Sheets & Reality Checks</h2>
            </div>
            <p className="mb-3">
              Benefisto utilizes artificial intelligence models and algorithmic heuristics to compile Product Trust Sheets, summarize customer review sentiments, generate purchase strategy recommendations, and deliver shopping guidance.
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-400 mb-3 ml-2">
              <li><strong>Algorithmic Independence:</strong> Our AI evaluations and Trust Sheets are mathematically computed from publicly available specifications, verified retail feedback, and price history metrics. We do not accept paid compensation to artificially inflate a product&apos;s score or suppress legitimate consumer warnings.</li>
              <li><strong>Advisory Nature Only:</strong> AI-generated outputs, summaries, and shopping suggestions are purely informational. <strong>They do not constitute certified engineering evaluations, professional financial advice, legal counsel, or medical / dietary guidance.</strong></li>
              <li><strong>Health, Dietary & Safety Products:</strong> For health supplements, medical equipment, child safety apparatus, or electrical machinery, you must read all manufacturer packaging, warnings, and certification labels prior to usage and consult qualified professionals where applicable.</li>
            </ul>
          </section>

          {/* Section 9: Intellectual Property Rights */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <Scale className="w-5 h-5 text-cyan-400" />
              <h2>9. Proprietary Intellectual Property Rights</h2>
            </div>
            <p className="mb-3">
              The Platform and its entire contents, features, and functionality—including but not limited to the &quot;Benefisto&quot; and &quot;Benefisto AI&quot; brand names, logos, software source code, user interface designs, visual layouts, editorial compilations, search indexing architectures, and proprietary heuristics—are the exclusive intellectual property of Benefisto AI and are protected by domestic and international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
            <p>
              Except for the limited, revocable, non-transferable, non-exclusive license granted to you to access the Platform for personal consumer decision-making, no right, title, or interest in or to our intellectual property is transferred or licensed to you.
            </p>
          </section>

          {/* Section 10: DMCA & Copyright Takedown Procedure */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <FileCode className="w-5 h-5 text-pink-400" />
              <h2>10. Digital Millennium Copyright Act (DMCA) Notice & Takedown Procedure</h2>
            </div>
            <p className="mb-3">
              Benefisto respects the intellectual property rights of copyright holders and complies with the notice-and-takedown provisions of Title 17, United States Code, Section 512(c) (the Digital Millennium Copyright Act, &quot;DMCA&quot;) and corresponding international copyright enforcement rules.
            </p>
            <p className="mb-3">
              If you are a copyright owner or an authorized agent and believe that any content, image, or link indexed on Benefisto infringes your copyrighted work, you may submit a formal notification to our Designated Copyright Agent at <strong>support@benefisto.com</strong> containing the following statutory details:
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-400 mb-3 ml-2">
              <li>A physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed;</li>
              <li>Identification of the copyrighted work claimed to have been infringed, or a representative list of such works;</li>
              <li>Identification of the specific URL, page, or material on Benefisto that is claimed to be infringing or to be the subject of infringing activity;</li>
              <li>Information reasonably sufficient to permit us to contact you (including your full legal name, physical address, telephone number, and valid email address);</li>
              <li>A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law; and</li>
              <li>A statement, under penalty of perjury, that the information in the notification is accurate, and that you are authorized to act on behalf of the owner.</li>
            </ol>
            <p className="text-xs text-slate-400">
              Upon receipt of a valid statutory notice, Benefisto will expeditiously review, disable access to, or remove the challenged material in accordance with applicable copyright laws.
            </p>
          </section>

          {/* Section 11: Third-Party Hyperlinks & External Services */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <Globe className="w-5 h-5 text-indigo-400" />
              <h2>11. External Hyperlinks & Third-Party Service Providers</h2>
            </div>
            <p className="mb-3">
              The Platform contains links to external websites, software applications, and services owned and operated by independent third parties. These links are provided solely for your convenience and retail price discovery.
            </p>
            <p>
              Benefisto exercises no control over, and assumes no responsibility for, the content, privacy policies, terms of service, checkout integrity, or business practices of any external website. You access third-party websites entirely at your own risk and subject to the terms and conditions established by those third parties.
            </p>
          </section>

          {/* Section 12: Disclaimer of Warranties */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h2>12. Comprehensive Disclaimer of Warranties</h2>
            </div>
            <p className="mb-3">
              TO THE MAXIMUM EXTENT PERMITTED UNDER APPLICABLE LAW, <strong>BENEFISTO AND ALL CONTENT, SOFTWARE, FUNCTIONS, AND INFORMATION MADE AVAILABLE THROUGH THE PLATFORM ARE PROVIDED STRICTLY ON AN &quot;AS-IS&quot; AND &quot;AS-AVAILABLE&quot; BASIS</strong>, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE.
            </p>
            <p className="mb-3">
              WITHOUT LIMITING THE GENERALITY OF THE FOREGOING, BENEFISTO EXPRESSLY DISCLAIMS ALL WARRANTIES OF: (A) MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT; (B) ACCURACY, RELIABILITY, COMPLETENESS, TIMELINESS, OR CONTINUOUS AVAILABILITY OF RETAIL PRICING DATA, INVENTORY STATUS, OR DEALS; (C) UNINTERRUPTED, SECURE, DEFECT-FREE, OR VIRUS-FREE OPERATION; AND (D) ANY WARRANTY ARISING OUT OF COURSE OF DEALING, USAGE, OR TRADE.
            </p>
            <p>
              YOU ASSUME TOTAL RESPONSIBILITY AND RISK FOR YOUR USE OF THE PLATFORM AND ANY DECISION TO ENGAGE IN TRANSACTIONS WITH THIRD-PARTY MERCHANTS.
            </p>
          </section>

          {/* Section 13: Limitation of Liability */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h2>13. Comprehensive Limitation of Liability (Zero Monetary Cap)</h2>
            </div>
            <p className="mb-3">
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL BENEFISTO AI, ITS FOUNDERS, OFFICERS, DIRECTORS, EMPLOYEES, AFFILIATES, AGENTS, CONTRACTORS, OR LICENSORS BE LIABLE TO YOU OR ANY THIRD PARTY FOR:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-400 mb-3 ml-2">
              <li>ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, PUNITIVE, OR EXEMPLARY DAMAGES;</li>
              <li>ANY LOSS OF PROFITS, REVENUE, DATA, GOODWILL, BUSINESS OPPORTUNITY, OR ANTICIPATED COST SAVINGS;</li>
              <li>ANY INACCURACIES IN THIRD-PARTY PRODUCT SPECIFICATIONS OR RETAIL PRICING LATENCY;</li>
              <li>ANY ORDER CANCELLATIONS, DEFECTS, FRAUD, OR TRANSACTION DISPUTES ARISING WITH EXTERNAL MERCHANTS; OR</li>
              <li>ANY SERVICE INTERRUPTIONS, SERVER DOWNTIME, OR HARDWARE MALFUNCTIONS.</li>
            </ul>
            <p className="mb-3">
              BECAUSE BENEFISTO IS PROVIDED TO CONSUMERS AS A COMPLIMENTARY, ZERO-COST INFORMATIONAL SERVICE, <strong>OUR TOTAL AGGREGATE LIABILITY ARISING OUT OF OR IN CONNECTION WITH THESE TERMS, THE PLATFORM, OR OUR SERVICES SHALL STRICTLY NOT EXCEED ZERO RUPEES (₹0 INR / $0.00 USD)</strong>.
            </p>
            <p className="text-xs text-slate-400">
              * Some jurisdictions do not allow the exclusion or limitation of certain warranties or liability for incidental or consequential damages; in such jurisdictions, our liability shall be limited to the maximum extent permitted by applicable law.
            </p>
          </section>

          {/* Section 14: Indemnification */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <Shield className="w-5 h-5 text-indigo-400" />
              <h2>14. User Indemnification Obligations</h2>
            </div>
            <p className="mb-3">
              You agree to defend, indemnify, and hold harmless Benefisto AI, its founders, officers, directors, employees, agents, and successors from and against any and all claims, demands, liabilities, damages, losses, costs, and expenses (including reasonable legal and attorneys&apos; fees) arising out of or directly related to:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-400 mb-3 ml-2">
              <li>Your breach or violation of any provision of these Terms of Service;</li>
              <li>Your violation of any applicable law, statute, or regulation;</li>
              <li>Your violation or infringement of any third-party intellectual property, privacy, or proprietary rights;</li>
              <li>Any visual content or personal photograph submitted by you to our Virtual Trial Room; or</li>
              <li>Your unauthorized, fraudulent, or automated misuse of the Platform.</li>
            </ul>
          </section>

          {/* Section 15: Mandatory Individual Arbitration & Class Action Waiver */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <Scale className="w-5 h-5 text-indigo-400" />
              <h2>15. Dispute Resolution, Mandatory Individual Arbitration & Class Action Waiver</h2>
            </div>
            <p className="mb-3">
              <strong>Informal Negotiation:</strong> In the event of any dispute, claim, or controversy arising out of or relating to these Terms or the Platform, you and Benefisto agree to first attempt in good faith to resolve the matter informally for at least thirty (30) days by submitting written notice to <code>support@benefisto.com</code>.
            </p>
            <p className="mb-3">
              <strong>Mandatory Binding Individual Arbitration:</strong> If the dispute is not resolved informally within 30 days, the dispute shall be resolved through binding individual arbitration administered by an established arbitration institution under its commercial rules, rather than in a court of law.
            </p>
            <p className="mb-3">
              <strong>CLASS ACTION AND REPRESENTATIVE PROCEEDING WAIVER:</strong> YOU AND BENEFISTO AGREE THAT EACH PARTY MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF, CLASS REPRESENTATIVE, OR CLASS MEMBER IN ANY PURPORTED CLASS, COLLECTIVE, CONSOLIDATED, OR REPRESENTATIVE PROCEEDING. NO ARBITRATOR OR COURT SHALL CONSOLIDATE MORE THAN ONE INDIVIDUAL&apos;S CLAIMS OR PRESIDE OVER ANY FORM OF REPRESENTATIVE OR CLASS PROCEEDING.
            </p>
          </section>

          {/* Section 16: Governing Law, Severability & Entire Agreement */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <Globe className="w-5 h-5 text-emerald-400" />
              <h2>16. Governing Law, Severability & Entire Agreement</h2>
            </div>
            <p className="mb-3">
              <strong>Governing Law:</strong> For users accessing the Platform from India, these Terms shall be governed by and construed in accordance with the substantive laws of India, with exclusive jurisdiction in the competent courts located in Maharashtra. For international users accessing from the United States, United Kingdom, European Union, Canada, United Arab Emirates, and Australia, claims shall be resolved pursuant to applicable international arbitration standards or mandatory local consumer protection statutes.
            </p>
            <p className="mb-3">
              <strong>Severability:</strong> If any provision of these Terms is determined by an arbitrator or court of competent jurisdiction to be unlawful, void, or unenforceable, that provision shall be enforced to the maximum extent permissible and deemed severed from the remaining provisions, which shall continue in full force and effect.
            </p>
            <p className="mb-3">
              <strong>Entire Agreement:</strong> These Terms of Service, together with our Privacy Policy and Disclaimer, constitute the sole and entire agreement between you and Benefisto AI regarding your use of the Platform, superseding all prior oral or written agreements, understandings, or representations.
            </p>
            <p>
              <strong>Modifications:</strong> We reserve the right to amend or update these Terms at any time by posting the revised version with an updated &quot;Last Updated&quot; date. Your continued access to or use of the Platform after any update constitutes your affirmative acceptance of the revised Terms.
            </p>
          </section>

          {/* Section 17: Official Service Contact */}
          <section className="p-6 rounded-2xl bg-indigo-950/40 border border-indigo-500/20">
            <div className="flex items-center gap-2.5 mb-2 text-white font-bold text-base">
              <Mail className="w-4 h-4 text-indigo-400" />
              <h2>Legal Notices & Inquiries</h2>
            </div>
            <p className="mb-3 text-slate-300">
              For formal legal notices, statutory inquiries, or copyright takedown requests, please contact our designated legal compliance desk:
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs text-indigo-300">
              <span>support@benefisto.com</span>
            </div>
            <p className="text-xs text-slate-400 mt-3">
              Benefisto AI • Universal Shopping Decision Engine & Price Discovery Platform
            </p>
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
