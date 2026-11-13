import Link from "next/link";
import { ShoppingBag, ArrowLeft, ShieldCheck, AlertCircle, ExternalLink, HelpCircle, Scale } from "lucide-react";

export const metadata = {
  title: "Disclaimer & Affiliate Disclosures — Benefisto AI",
  description: "Official legal disclaimer, affiliate relationship disclosures, price accuracy policy, and fair use notices for Benefisto AI.",
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
          <span>Official Consumer & Affiliate Disclosure</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
          Disclaimer & Legal Disclosures
        </h1>
        <p className="text-sm text-slate-400 mb-8">
          Last Updated: November 2026 • Effective Globally Across All Supported Markets
        </p>

        <div className="space-y-8 text-slate-300 text-sm leading-relaxed">
          {/* Section 1: Independent Shopping Guide */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <Scale className="w-5 h-5 text-indigo-400" />
              <h2>1. Independent Shopping Guide (We Are Not a Merchant or Seller)</h2>
            </div>
            <p className="mb-3">
              Benefisto (<strong>https://www.benefisto.com</strong>) operates solely as an independent, technology-driven shopping decision engine, price discovery platform, and consumer advisory utility.
            </p>
            <p className="mb-3">
              <strong>Benefisto does not sell, warehouse, ship, fulfill, or invoice any physical or digital products.</strong> We do not operate an e-commerce marketplace, nor do we act as an authorized reseller for any featured brand. Any commercial transaction—including payment processing, billing, order confirmation, shipping, delivery, returns, exchanges, warranties, and after-sales support—occurs exclusively on the third-party merchant’s official website (e.g., Amazon, Walmart, Best Buy, Target, Currys, Argos, Flipkart, Croma, and official brand stores).
            </p>
            <p>
              Under international intermediary safe harbor standards and Section 79 of the Indian Information Technology Act, 2000, Benefisto operates as an independent informational intermediary and price discovery facilitator.
            </p>
          </section>

          {/* Section 2: Affiliate Marketing Disclosure */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <ExternalLink className="w-5 h-5 text-emerald-400" />
              <h2>2. Affiliate Marketing Disclosure (FTC 16 CFR Part 255 & Indian E-Commerce Rules)</h2>
            </div>
            <p className="mb-3">
              In full compliance with the Federal Trade Commission (FTC) Guides Concerning the Use of Endorsements and Testimonials in Advertising (16 CFR Part 255) and the Consumer Protection (E-Commerce) Rules, 2020:
            </p>
            <p className="mb-3">
              Benefisto participates in retail affiliate marketing programs. When you click on product links, store comparison offers, or deal buttons on our platform and complete a qualifying purchase on a merchant website, <strong>Benefisto may earn a referral commission or advertising fee from the merchant at absolutely ZERO extra cost to you</strong>.
            </p>
            <p>
              You pay the exact same standard retail price (or lower, when utilizing verified coupons or store discounts) whether you purchase through our links or navigate directly to the merchant. These referral fees enable us to keep Benefisto’s AI comparison engine, Trust Sheet synthesizer, and Virtual Try-On studio 100% free and accessible to consumers worldwide.
            </p>
          </section>

          {/* Section 3: Real-Time Price Volatility & Stock Availability */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              <h2>3. Real-Time Price Volatility & Stock Availability Disclaimer</h2>
            </div>
            <p className="mb-3">
              E-commerce retail prices, promotional vouchers, delivery charges, and inventory levels are dynamic and change rapidly based on merchant algorithms, flash sales, regional taxes, and stock depletion.
            </p>
            <p className="mb-3">
              While Benefisto deploys real-time resolution protocols to provide the most current pricing available, <strong>all pricing, product availability, specifications, and deal terms are provided on an &quot;AS-IS&quot; and &quot;AS-AVAILABLE&quot; basis</strong> without warranties of any kind.
            </p>
            <p>
              Shoppers are solely responsible for reviewing and confirming the final checkout price, shipping conditions, seller ratings, and warranty details directly on the merchant’s official checkout page before making a payment. Benefisto shall not be liable for any discrepancy between prices displayed on our guide and the final checkout amount charged by the merchant.
            </p>
          </section>

          {/* Section 4: AI Co-Pilot & Trust Sheet Advisory Nature */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <HelpCircle className="w-5 h-5 text-purple-400" />
              <h2>4. AI Co-Pilot, Trust Sheet & Algorithmic Neutrality</h2>
            </div>
            <p className="mb-3">
              Our AI Shopping Co-Pilot, Product Trust Sheets, and Purchase Strategy Terminal synthesize public technical specifications and verified consumer feedback to assist in product evaluation.
            </p>
            <ul className="list-disc list-inside space-y-2 mb-3 text-slate-400">
              <li><strong>Algorithmic Neutrality:</strong> Recommendations are mathematically derived from verified public data. Benefisto does not accept paid placements to artificially inflate or disparage any product, manufacturer, or merchant.</li>
              <li><strong>Advisory Only:</strong> AI outputs are informational guides. They do not constitute certified medical, dietary (for nutritional supplements), financial, or legal advice.</li>
              <li><strong>Personal Assessment:</strong> Product suitability depends on individual consumer requirements. Users should exercise their own judgment or consult qualified professionals where applicable.</li>
            </ul>
          </section>

          {/* Section 5: Nominative Fair Use of Trademarks */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-base">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <h2>5. Nominative Fair Use of Trademarks & Brand Assets</h2>
            </div>
            <p className="mb-3">
              All third-party product names, brand names, retail store marks, logos, and registered trademarks (including but not limited to Amazon, Walmart, Best Buy, Target, Currys, Apple, Samsung, Nike, and others) displayed on this platform are the property of their respective trademark holders.
            </p>
            <p>
              Their inclusion on Benefisto is strictly for identification, consumer price comparison, and descriptive informational purposes under the doctrine of <strong>Nominative Fair Use</strong>. Benefisto is an independent entity and claims no official endorsement, direct sponsorship, or formal corporate affiliation with these trademark owners unless expressly stated.
            </p>
          </section>

          {/* Section 6: Contact & Questions */}
          <section className="p-6 rounded-2xl bg-indigo-950/40 border border-indigo-500/20">
            <h2 className="text-white font-bold text-base mb-2">Questions Regarding Our Disclosures?</h2>
            <p className="mb-3 text-slate-300">
              For questions, clarifications, or compliance inquiries concerning our affiliate relationships or disclaimers, please reach out to our official compliance desk:
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
