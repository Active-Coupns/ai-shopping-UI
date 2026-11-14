import Link from "next/link";
import { 
  ShoppingBag, 
  ArrowLeft, 
  ShieldCheck, 
  AlertCircle, 
  ExternalLink, 
  HelpCircle, 
  Scale, 
  DollarSign, 
  Clock, 
  Cpu, 
  HeartPulse, 
  Tag, 
  Mail 
} from "lucide-react";

export const metadata = {
  title: "Disclaimer & Affiliate Disclosures — Benefisto AI",
  description: "Official legal disclaimer, Amazon Associates disclosure, FTC affiliate marketing relationship disclosures, real-time price volatility notices, and non-professional advice disclaimers for Benefisto AI.",
};

export default function DisclaimerPage() {
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
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Statutory Consumer & Affiliate Disclosures</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
          Disclaimer & Legal Disclosures
        </h1>
        <p className="text-sm text-slate-400 mb-8">
          Last Updated: November 2026 • Effective Across All 6 Supported Retail Jurisdictions
        </p>

        {/* Highlighted Compliance Notice */}
        <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 mb-8 text-xs text-indigo-200/90 leading-relaxed">
          <strong className="text-white font-semibold block mb-1">Clear Consumer Notice:</strong>
          Benefisto AI is a free shopping decision engine, deal aggregator, and virtual style preview tool. We are not an online retailer or merchant. When you click on product links on our platform, you will be redirected to the respective third-party merchant&apos;s website. Benefisto participates in affiliate advertising programs and may earn a commission on qualifying purchases at zero additional cost to you.
        </div>

        <div className="space-y-8 text-slate-300 text-sm leading-relaxed">
          {/* Section 1: Independent Shopping Guide */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <Scale className="w-5 h-5 text-indigo-400" />
              <h2>1. Independent Shopping Guide (We Are Not a Merchant or Seller)</h2>
            </div>
            <p className="mb-3">
              Benefisto (<strong>https://www.benefisto.com</strong>) operates strictly as an independent technological intermediary, consumer shopping decision engine, and retail price discovery guide.
            </p>
            <p className="mb-3">
              <strong>We do not sell, warehouse, inventory, ship, deliver, or invoice any goods or services.</strong> We do not operate an e-commerce marketplace, nor do we act as an authorized reseller, manufacturer, or logistics distributor for any brand or merchant displayed on our platform.
            </p>
            <p className="mb-3">
              Any commercial transaction—including payment execution, credit/debit card processing, order confirmation, shipping logistics, physical packaging, product warranties, return requests, and customer service issues—takes place <strong>exclusively and directly on the external merchant&apos;s official website</strong> (such as Amazon, Walmart, Best Buy, Target, Currys, Argos, Flipkart, Croma, or official brand storefronts).
            </p>
            <p className="text-xs text-slate-400">
              * Pursuant to Section 79 of the Indian Information Technology Act, 2000, Section 230 of the United States Communications Decency Act, and the EU e-Commerce Directive, Benefisto disclaims direct liability for merchant transactions, product defects, or third-party retailer conduct.
            </p>
          </section>

          {/* Section 2: Amazon Associates & Global Affiliate Disclosure */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <h2>2. Amazon Associates & Retail Affiliate Marketing Disclosures</h2>
            </div>
            <p className="mb-3">
              In full compliance with the Federal Trade Commission (FTC) Guides Concerning the Use of Endorsements and Testimonials in Advertising (16 CFR Part 255), the UK Advertising Standards Authority (ASA) CAP Code, and the Indian Consumer Protection (E-Commerce) Rules, 2020:
            </p>
            
            {/* Amazon Associates Official Required Clause */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 mb-4">
              <span className="text-amber-400 font-bold block mb-1 text-xs uppercase tracking-wider">Official Amazon Operating Agreement Disclosure:</span>
              <p className="text-sm font-semibold text-white italic">
                &quot;As an Amazon Associate, Benefisto earns from qualifying purchases.&quot;
              </p>
            </div>

            <p className="mb-3">
              <strong>Affiliate Relationship Disclosure:</strong> In addition to the Amazon Services LLC Associates Program, Benefisto participates in various verified retail affiliate marketing networks. When you click on product comparison links, deal buttons, or merchant banners on our Platform and complete a purchase on the merchant’s website, <strong>Benefisto may receive a small referral commission or advertising fee from the merchant at ABSOLUTELY ZERO ADDITIONAL COST TO YOU</strong>.
            </p>
            <p className="mb-3">
              You pay the exact same standard retail price (or lower, when utilizing verified coupons or store promotions) whether you click through our links or navigate directly to the merchant. These affiliate commissions fund our cloud infrastructure, allowing us to keep our search engine, Trust Sheets, and Virtual Trial Room 100% free and accessible to all consumers.
            </p>
            <p className="text-xs text-slate-400">
              Our editorial and algorithmic recommendations are mathematically derived from verified customer reviews and public technical specifications. We do not accept paid compensation to artificially inflate a product’s rating or promote inferior merchandise.
            </p>
          </section>

          {/* Section 3: Real-Time Price Volatility & Stock Availability */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <Clock className="w-5 h-5 text-amber-400" />
              <h2>3. Real-Time Price Volatility & Stock Availability Disclaimers</h2>
            </div>
            <p className="mb-3">
              Retail prices, discount vouchers, delivery surcharges, import taxes, and stock levels are dynamic and subject to frequent, instantaneous changes by third-party retailers without prior notice.
            </p>
            <p className="mb-3">
              While Benefisto strives to provide real-time, highly accurate pricing through automated resolution pipelines, <strong>all pricing, discounts, and inventory statuses are provided strictly on an &quot;AS-IS&quot; and &quot;AS-AVAILABLE&quot; informational basis</strong>. Due to merchant API limits or server cache windows, occasional pricing latency may occur between our guide and the merchant storefront.
            </p>
            <p className="mb-3">
              <strong>Final Checkout Price Is Binding:</strong> The definitive, binding purchase price is strictly the price displayed on the external merchant&apos;s checkout page at the exact moment of transaction completion. You are solely responsible for reviewing and confirming the total checkout price, applicable sales tax or GST, shipping fees, seller ratings, and return policies before making a payment.
            </p>
            <p className="text-xs text-slate-400">
              Benefisto accepts no responsibility or financial liability for any variance between the estimated prices shown on our guide and the actual amount charged at merchant checkout.
            </p>
          </section>

          {/* Section 4: AI Shopping Assistant & Algorithmic Neutrality */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <Cpu className="w-5 h-5 text-purple-400" />
              <h2>4. AI Shopping Assistant, Trust Sheets & Algorithmic Scoring</h2>
            </div>
            <p className="mb-3">
              Our AI Shopping Assistant, Product Trust Sheets, and Purchase Strategy metrics synthesize public technical specifications and thousands of verified consumer reviews into concise, structured shopping summaries.
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-400 mb-3 ml-2">
              <li><strong>Mathematical Neutrality:</strong> Scoring metrics and review sentiment syntheses are algorithmically generated without bias. Benefisto does not alter product scores in exchange for commercial sponsorships or advertising revenue.</li>
              <li><strong>Informational Guidance Only:</strong> AI summaries, feature highlights, and sentiment analyses are provided solely for general consumer shopping guidance. They reflect historical consumer patterns and publicly published specifications.</li>
              <li><strong>Independent Verification Recommended:</strong> Because manufacturers periodically update product revisions, firmware, and packaging without notice, consumers are encouraged to verify critical technical specifications directly with the manufacturer before purchase.</li>
            </ul>
          </section>

          {/* Section 5: Non-Professional Advice & Specialized Products Safe Harbor */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <HeartPulse className="w-5 h-5 text-red-400" />
              <h2>5. Non-Professional Advice & Health/Specialized Products Safe Harbor</h2>
            </div>
            <p className="mb-3">
              Content and AI guidance available on Benefisto do not constitute professional advice of any nature:
            </p>
            <div className="space-y-3 mb-3">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-red-400 font-bold text-xs block mb-1">Health, Supplements & Medical Devices:</span>
                <p className="text-xs text-slate-400">
                  Any product comparison or review involving nutritional supplements, vitamins, fitness equipment, over-the-counter wellness products, or medical apparatus is strictly for informational discovery. <strong>Benefisto does not provide medical, dietary, or healthcare advice.</strong> Always consult a qualified physician or healthcare professional before taking any supplement or using any health-related product, and carefully inspect manufacturer warning labels.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-blue-400 font-bold text-xs block mb-1">Financial & Legal Products:</span>
                <p className="text-xs text-slate-400">
                  Calculated price savings, discount estimations, or subscription cost comparisons do not constitute certified financial, tax, or legal advice.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-amber-400 font-bold text-xs block mb-1">Electrical, Automotive & Safety Machinery:</span>
                <p className="text-xs text-slate-400">
                  For consumer electronics, high-voltage appliances, automotive tools, or child safety products, consumers must observe all manufacturer safety instructions, certified ratings (e.g., UL, CE, ISI), and installation guidelines.
                </p>
              </div>
            </div>
          </section>

          {/* Section 6: Virtual Trial Room (VTON) Simulation Notice */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <HelpCircle className="w-5 h-5 text-indigo-400" />
              <h2>6. Virtual Trial Room (VTON) Simulation Notice</h2>
            </div>
            <p className="mb-3">
              The Benefisto Virtual Trial Room provides simulated 2D/3D visual approximations of how garments and apparel might look when worn.
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-400 mb-3 ml-2">
              <li><strong>Visual Guidance Simulation:</strong> Previews are generated using computational rendering and do not guarantee an exact physical match to the delivered garment.</li>
              <li><strong>Material & Fit Variations:</strong> Fabric elasticity, weave texture, stiffness, real-world drape, stitching tolerances, and screen color calibrations (RGB vs. physical dye) will naturally differ from digital screen simulations upon physical merchant delivery.</li>
              <li><strong>Merchant Sizing Charts:</strong> Always consult the merchant&apos;s specific size guide, waist/chest measurements, and customer sizing reviews before placing an apparel order.</li>
            </ul>
          </section>

          {/* Section 7: Nominative Fair Use of Trademarks */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <Tag className="w-5 h-5 text-cyan-400" />
              <h2>7. Nominative Fair Use of Brand Names & Trademarks</h2>
            </div>
            <p className="mb-3">
              All third-party brand names, company names, store logos, registered trademarks, and product designations (including but not limited to Amazon, Walmart, Best Buy, Target, Currys, Argos, Flipkart, Croma, Apple, Samsung, Sony, Nike, and adidas) referenced on Benefisto are the intellectual property of their respective trademark holders.
            </p>
            <p>
              Their inclusion on our platform is strictly for product identification, comparative price discovery, and factual descriptive reporting under the legal doctrine of <strong>Nominative Fair Use</strong>. Benefisto is an independent shopping utility; the display of third-party trademarks does not imply any direct corporate sponsorship, official partnership, or commercial endorsement of Benefisto by these brand owners, except where formally established via verified affiliate operating agreements.
            </p>
          </section>

          {/* Section 8: External Merchant Hyperlinks */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <ExternalLink className="w-5 h-5 text-emerald-400" />
              <h2>8. External Merchant Hyperlinks & Independent Domains</h2>
            </div>
            <p className="mb-3">
              Benefisto contains outgoing links directing consumers to independent third-party commercial storefronts. Once you click a link and navigate away from <code>benefisto.com</code>, you are operating within an external website governed entirely by that merchant’s own privacy policies, user agreements, and commercial checkout practices.
            </p>
            <p>
              Benefisto has no control over external server availability, checkout security, malicious third-party scripts on external domains, or merchant transaction processing. We recommend that you review the terms and privacy practices of any merchant website you visit.
            </p>
          </section>

          {/* Section 9: Compliance Contact & Inquiries */}
          <section className="p-6 rounded-2xl bg-indigo-950/40 border border-indigo-500/20">
            <div className="flex items-center gap-2.5 mb-2 text-white font-bold text-base">
              <Mail className="w-4 h-4 text-indigo-400" />
              <h2>Compliance & Disclosure Desk</h2>
            </div>
            <p className="mb-3 text-slate-300">
              For questions regarding our affiliate relationships, pricing resolution protocols, or statutory compliance disclosures, please contact our compliance desk:
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs text-indigo-300 mb-3">
              <span>support@benefisto.com</span>
            </div>
            <p className="text-xs text-slate-400">
              Benefisto AI • Universal Shopping Decision Engine & Price Discovery Guide
            </p>
          </section>
        </div>

        {/* Footer Navigation Across All 5 Legal Pages */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
          <Link href="/about" className="hover:text-slate-300 transition-colors">About Us</Link>
          <span>•</span>
          <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
          <span>•</span>
          <span className="text-indigo-400 font-semibold">Disclaimer</span>
          <span>•</span>
          <Link href="/contact" className="hover:text-slate-300 transition-colors">Contact Support</Link>
        </div>
      </main>
    </div>
  );
}
