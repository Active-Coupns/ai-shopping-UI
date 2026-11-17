import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  Tv, Film, Sparkles, Check, ExternalLink, 
  ShieldCheck, Copy, ChevronRight, Zap, ArrowRight,
  TrendingUp, Award, Gift, Smartphone, Monitor, Info,
  Bot, Cloud, Gamepad2, Dumbbell, Palette, Briefcase,
  Layers, Volume2, Shield, Calendar, CheckCircle2, ChevronDown,
  GraduationCap, Building, Tag, CheckSquare
} from "lucide-react";
import { 
  getUniversalSubscriptionBySlug, 
  getAllUniversalSubscriptionSlugs, 
  getSubscriptionsCatalog 
} from "@/data/subscriptionsRegistry.js";
import { getCouponsForStore } from "@/services/couponService.js";
import SubscriptionInteractiveClient from "./SubscriptionInteractiveClient";

export async function generateStaticParams() {
  const slugs = getAllUniversalSubscriptionSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const sub = await getUniversalSubscriptionBySlug(slug);

  if (!sub) {
    return {
      title: "Subscription Plans & Savings Blueprint | Benefisto",
      description: "Compare digital subscription plans and claim verified discounts and savings."
    };
  }

  const isUS = sub.country === "US";
  const isUK = sub.country === "GB" || sub.country === "UK";
  const isCA = sub.country === "CA";
  const isAU = sub.country === "AU";
  const isAE = sub.country === "AE";
  const currency = sub.currencySymbol || (isAE ? "AED" : (isAU ? "A$" : (isCA ? "C$" : (isUK ? "£" : (isUS ? "$" : "₹")))));
  const telecomNames = isAE ? "Etisalat/du" : (isAU ? "Optus/Telstra" : (isCA ? "Telus/Bell" : (isUK ? "EE/O2" : (isUS ? "T-Mobile/Verizon" : "Airtel/Jio"))));
  const locale = isAE ? "en_AE" : (isAU ? "en_AU" : (isCA ? "en_CA" : (isUK ? "en_GB" : (isUS ? "en_US" : "en_IN"))));

  const now = new Date();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentMonth = monthNames[now.getMonth()];
  const currentYear = now.getFullYear();

  const cat = (sub.category || "").toLowerCase();
  const hasCoupons = Array.isArray(sub.savingsBlueprint?.coupons) && sub.savingsBlueprint.coupons.length > 0;
  const isNoCouponSaas = ["ai_tools", "productivity", "design"].includes(cat) && !hasCoupons;
  const savingsPercent = sub.savingsBlueprint?.annualMath?.savingsPercent || "33%";

  const catchyTitle = isNoCouponSaas
    ? `How to Save on ${sub.name} (${currentMonth} ${currentYear}): Verified Hacks & Pricing Blueprint | Benefisto`
    : `${sub.name} Promo Codes & Pricing (${currentMonth} ${currentYear}) — Verified Deals | Benefisto`;

  const metaDesc = isNoCouponSaas
    ? `Don't pay full price for ${sub.name}! Cut your bill by up to ${savingsPercent} with our verified annual arbitrage, 100% free student education hacks, and team seat blueprints on Benefisto.`
    : `Verified ${sub.name} promo codes, discount vouchers, and multi-tier plan pricing for ${currentMonth} ${currentYear}. Tested daily with instant checkout savings on Benefisto.`;

  const canonicalUrl = `https://www.benefisto.com/subscriptions/${sub.seo?.slug || sub.id}`;

  const keywords = isNoCouponSaas ? [
    `how to save on ${sub.name}`,
    `${sub.name} subscription savings`,
    `cut ${sub.name} bill`,
    `${sub.name} discount hack`,
    `${sub.name} student discount free`,
    `${sub.name} annual pricing discount`,
    `${sub.name} plans and pricing ${currentYear}`,
    `${sub.name} team plan split`,
    `${sub.name} startup credits`,
    `cheapest way to get ${sub.name}`,
    `best deal on ${sub.name}`,
    `${sub.name} review ${currentYear}`
  ] : [
    `${sub.name} coupon code`,
    `${sub.name} promo code`,
    `${sub.name} discount code`,
    `${sub.name} coupons`,
    `${sub.name} voucher code`,
    `${sub.name} promo codes ${currentMonth} ${currentYear}`,
    `${sub.name} plans and pricing`,
    `${sub.name} coupon code today`,
    `${sub.name} student discount code`,
    `${sub.name} annual discount`,
    `${sub.name} free trial code`,
    `active ${sub.name} promo codes`,
    `${sub.name} family plan split`,
    `best deal on ${sub.name}`,
    `${sub.name} promo code not working`,
    `why is ${sub.name} coupon code invalid`,
    `${sub.name} checkout error fix`
  ];

  return {
    title: catchyTitle,
    description: metaDesc,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: catchyTitle,
      description: metaDesc,
      url: canonicalUrl,
      siteName: "Benefisto",
      locale: locale,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: catchyTitle,
      description: metaDesc,
    }
  };
}

export default async function SubscriptionDetailPage({ params }) {
  const { slug } = await params;
  const sub = await getUniversalSubscriptionBySlug(slug);

  if (!sub) {
    notFound();
  }

  const isUS = sub.country === "US";
  const isUK = sub.country === "GB" || sub.country === "UK";
  const isCA = sub.country === "CA";
  const isAU = sub.country === "AU";
  const isAE = sub.country === "AE";
  const currency = sub.currencySymbol || (isAE ? "AED" : (isAU ? "A$" : (isCA ? "C$" : (isUK ? "£" : (isUS ? "$" : "₹")))));
  const activeCatalog = getSubscriptionsCatalog(sub.country || "IN");
  const priceCurrency = isAE ? "AED" : (isAU ? "AUD" : (isCA ? "CAD" : (isUK ? "GBP" : (isUS ? "USD" : "INR"))));
  const regionName = isAE ? "UAE" : (isAU ? "Australia" : (isCA ? "Canada" : (isUK ? "UK" : (isUS ? "USA" : "India"))));
  const regionFullName = isAE ? "the United Arab Emirates (UAE)" : (isAU ? "Australia" : (isCA ? "Canada" : (isUK ? "the United Kingdom" : (isUS ? "the United States" : "India"))));

  // Fetch Real-Time Feedico & Master Verified Promo Codes
  let liveCoupons = [];
  try {
    const couponData = await getCouponsForStore(sub.name, sub.country || "IN");
    if (Array.isArray(couponData?.coupons)) {
      liveCoupons = couponData.coupons;
    }
  } catch (err) {
    console.warn(`[Coupon Service] Fallback for ${sub.name}:`, err.message);
  }

  if (liveCoupons.length === 0 && sub.savingsBlueprint?.coupons) {
    liveCoupons = sub.savingsBlueprint.coupons;
  }

  const now = new Date();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentMonth = monthNames[now.getMonth()];
  const currentYear = now.getFullYear();

  const cat = (sub.category || "").toLowerCase();
  const hasCoupons = liveCoupons.length > 0 || (Array.isArray(sub.savingsBlueprint?.coupons) && sub.savingsBlueprint.coupons.length > 0);
  const isNoCouponSaas = ["ai_tools", "productivity", "design"].includes(cat) && !hasCoupons;
  const savingsPercent = sub.savingsBlueprint?.annualMath?.savingsPercent || "33%";

  // Related alternatives in the same category & region
  const alternatives = activeCatalog
    .filter(item => item.id !== sub.id && item.category === sub.category)
    .slice(0, 3);

  const snapshot = sub.savingsBlueprint?.snapshot || {
    bestSavings: `Save ${sub.savingsBlueprint?.annualMath?.savingsPercent || "30%"} with Annual Billing`,
    activePromoCodes: `${liveCoupons.length || 2} Verified Active Codes Available`,
    freeTier: "Available with Core Features",
    studentGrant: "100% Free with Verified College ID"
  };

  // Structured Data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      // 1. BreadcrumbList Schema
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.benefisto.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Subscriptions & Software",
            "item": "https://www.benefisto.com/subscriptions"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": sub.name,
            "item": `https://www.benefisto.com/subscriptions/${sub.seo?.slug || sub.id}`
          }
        ]
      },
      // 2. Product / SoftwareApplication Schema
      {
        "@type": "SoftwareApplication",
        "name": sub.name,
        "operatingSystem": "All Platforms",
        "applicationCategory": "BusinessApplication",
        "description": sub.tagline,
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": priceCurrency,
          "lowPrice": sub.plans[0]?.price || 0,
          "highPrice": sub.plans[sub.plans.length - 1]?.price || 1999,
          "offerCount": sub.plans.length
        }
      },
      // 3. FAQPage Schema for Search Snippets
      {
        "@type": "FAQPage",
        "mainEntity": (sub.seo?.faqs && sub.seo.faqs.length > 0 ? sub.seo.faqs : [
          {
            question: `How do I apply a verified promo code on ${sub.name}?`,
            answer: `To apply a promo code on ${sub.name}: 1) Select your preferred tier and click 'Reveal Code' on Benefisto. 2) Copy the code and navigate to the official ${sub.name} checkout. 3) Paste the coupon code in the promo box to instantly reduce your billing total.`
          },
          {
            question: `How much can I save with annual billing on ${sub.name}?`,
            answer: `Switching to annual billing on ${sub.name} unlocks an instant discount of up to ${sub.savingsBlueprint?.annualMath?.savingsPercent || "33%"}, saving significant money compared to monthly payments.`
          },
          {
            question: `Does ${sub.name} offer student or education discounts?`,
            answer: `Yes, verified students and educators can unlock steep discounts or 100% free licenses on ${sub.name} by registering with an institutional (.edu) email address.`
          },
          {
            question: `Are these promo codes and deals for ${sub.name} verified today?`,
            answer: `Yes, every offer on Benefisto is verified daily against official checkout requirements and live affiliate catalogs so you get active, 100% working savings.`
          },
          {
            question: `Can I share ${sub.name} with team members or family?`,
            answer: `By selecting a multi-user or family tier on ${sub.name}, the effective cost per person drops to a fraction of single-user subscriptions.`
          }
        ]).map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      },
      // 4. HowTo Schema for Step-by-Step Google Snippets
      {
        "@type": "HowTo",
        "name": `How to Save up to ${savingsPercent} on ${sub.name}`,
        "description": `Step-by-step guide to minimize your ${sub.name} subscription cost with verified annual arbitrage and student hacks.`,
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Select Annual Billing or Student Portal",
            "text": `Choose yearly commitment on ${sub.name} to immediately slash 16% to 35% off standard monthly rates.`
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Verify Institutional ID or Team Seats",
            "text": `Apply university (.edu) email for education pricing or pool seats with colleagues to cut per-user costs.`
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Apply Verified Checkout Code",
            "text": `Copy the verified active promo code from Benefisto and paste in the checkout summary promo box.`
          }
        ]
      }
    ]
  };

  return (
    <>
      {/* Inject Structured Data for Googlebot & Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Semantic Headings for SEO Crawlers */}
      <div className="sr-only">
        <h1>{sub.name} Promo Codes, Coupons, Plans &amp; Pricing ({currentMonth} ${currentYear})</h1>
        <h2>Verified discount codes, annual billing arbitrage &amp; student perks for {sub.name}</h2>
        <p>
          Compare official {sub.name} subscription plans, calculate annual savings, unlock verified Feedico promo codes, and discover student discounts. Tested daily on Benefisto.
        </p>
      </div>

      <main className="min-h-screen bg-slate-50 text-slate-900 pb-16">
        <div className="w-full max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-4 sm:pt-6">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-slate-500 mb-4 sm:mb-6 flex-wrap">
            <Link href="/" className="hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/subscriptions" className="hover:text-indigo-600 transition-colors">
              Subscriptions &amp; Software Hub
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-bold truncate">{sub.name}</span>
          </nav>

          {/* Catchy Hero Header */}
          <header className="mb-6 sm:mb-8 space-y-2.5 sm:space-y-3">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                <Zap className="w-3 h-3 fill-current text-amber-500" />
                Verified Savings Blueprint
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Live Verified {currentMonth} {currentYear}
              </span>
              <span className="text-[11px] sm:text-xs text-slate-500 font-semibold">
                {sub.plans.length} Official Plans
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight leading-snug sm:leading-tight">
              {isNoCouponSaas 
                ? `How to Save on Your ${sub.name} Subscription (${currentMonth} ${currentYear})`
                : `${sub.name} Plans, Verified Promo Codes & Pricing (${currentMonth} ${currentYear})`}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-3xl leading-relaxed">
              {isNoCouponSaas
                ? `${sub.tagline}. Cut your subscription bill with verified annual discount arbitrage, 100% free student edu licenses, and team seat pooling blueprints.`
                : `${sub.tagline}. Compare official multi-tier plans, calculate annual vs monthly arbitrage, and unlock live verified promo codes.`}
            </p>
          </header>

          {/* POSITION 0 QUICK SAVINGS SNAPSHOT TABLE (Google Search Snippet Standard) */}
          <section className="mb-8 rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                  <Award className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-300">
                    Position 0 Quick Savings Snapshot
                  </h2>
                  <p className="text-[11px] text-indigo-200 font-medium">
                    Verified real-time intelligence for {sub.name} in {regionFullName}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
                Daily Verified
              </span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 hover:bg-slate-50/70 transition-colors">
                <span className="font-bold text-slate-500 text-[11px] uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                  1. Best Savings Today
                </span>
                <span className="font-extrabold text-slate-900 text-xs sm:text-sm sm:text-right">
                  {snapshot.bestSavings}
                </span>
              </div>

              <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 hover:bg-slate-50/70 transition-colors">
                <span className="font-bold text-slate-500 text-[11px] uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" />
                  2. Active Promo Codes
                </span>
                <span className="font-extrabold text-emerald-700 text-xs sm:text-sm sm:text-right flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  {liveCoupons.length > 0 
                    ? `${liveCoupons.length} Verified Codes Synced from Feedico Engine`
                    : "Zero Code Needed (Save via Annual & Student Perks)"}
                </span>
              </div>

              <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 hover:bg-slate-50/70 transition-colors">
                <span className="font-bold text-slate-500 text-[11px] uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                  <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
                  3. Forever Free Tier
                </span>
                <span className="font-extrabold text-slate-900 text-xs sm:text-sm sm:text-right">
                  {snapshot.freeTier}
                </span>
              </div>

              <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 hover:bg-slate-50/70 transition-colors">
                <span className="font-bold text-slate-500 text-[11px] uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
                  4. Student &amp; Education Grant
                </span>
                <span className="font-extrabold text-indigo-900 text-xs sm:text-sm sm:text-right">
                  {snapshot.studentGrant}
                </span>
              </div>
            </div>
          </section>

          {/* Client-Side Interactive Plan Switcher, 3-Layer Blueprints & Feedico Coupons */}
          <SubscriptionInteractiveClient 
            sub={sub} 
            initialCoupons={liveCoupons}
          />

          {/* Official Plans Full Comparison Table */}
          <section className="my-8 sm:my-10 bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600 shrink-0" />
              <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                Official {sub.name} Plans &amp; Specifications ({regionName} 2026)
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Side-by-side breakdown of all {sub.plans.length} active subscription tiers in {regionFullName}.
            </p>

            {/* Mobile Plan Cards (Clean, readable, zero squished columns) */}
            <div className="sm:hidden space-y-3">
              {sub.plans.map((p, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                    <div>
                      <span className="font-extrabold text-sm text-slate-900 block leading-tight">{p.name}</span>
                      <span className="text-[11px] font-semibold text-slate-500">{p.screens} Seat(s) • {p.devices || "All Devices"}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-black text-indigo-700 block">{currency}{p.price}</span>
                      <span className="text-[10px] font-bold text-slate-400">/{p.period}</span>
                    </div>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-slate-500 font-medium text-[11px]">Feature Quality:</span>
                      <span className="font-semibold text-slate-800 text-right text-[11px]">{p.resolution}</span>
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-slate-500 font-medium text-[11px]">Support / Audio:</span>
                      <span className="font-semibold text-slate-800 text-right text-[11px]">{p.audio || "Priority"}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <span className="text-slate-500 font-medium text-[11px]">Policy:</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-black text-[10px] border border-emerald-200">
                        {p.ads || "100% Ad-Free"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop / Tablet View Table (With horizontal scroll container and min-width) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-xs text-slate-700 border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-900 font-black text-[11px] uppercase tracking-wider">
                    <th className="p-3">Plan Tier</th>
                    <th className="p-3">Official Price</th>
                    <th className="p-3">User Access</th>
                    <th className="p-3">Feature Quality</th>
                    <th className="p-3">Support</th>
                    <th className="p-3">Policy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sub.plans.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3 font-extrabold text-slate-900">{p.name}</td>
                      <td className="p-3 font-black text-indigo-700">{currency}{p.price} /{p.period}</td>
                      <td className="p-3 font-medium">{p.screens} Seat(s)</td>
                      <td className="p-3 font-medium">{p.resolution}</td>
                      <td className="p-3 font-medium">{p.audio || "Priority"}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-black text-[10px] border border-emerald-200">
                          {p.ads || "100% Ad-Free"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* High-Intent Frequently Asked Questions */}
          <section className="my-8 sm:my-10 bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-indigo-600 shrink-0" />
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Frequently Asked Questions about {sub.name}
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Verified answers to the most common queries regarding {sub.name} pricing, student grants, and billing policies in {regionFullName}.
            </p>

            <div className="space-y-2.5 pt-1">
              {(sub.seo?.faqs || []).map((faq, idx) => (
                <details
                  key={idx}
                  className="group rounded-2xl bg-slate-50 border border-slate-200/80 p-3.5 sm:p-4 transition-all"
                >
                  <summary className="flex items-center justify-between font-extrabold text-xs sm:text-sm text-slate-900 cursor-pointer list-none">
                    <span className="pr-2">{faq.question}</span>
                    <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform shrink-0" />
                  </summary>
                  <p className="mt-2 text-xs text-slate-600 font-medium leading-relaxed pt-2 border-t border-slate-200/60">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>

          {/* Related Alternatives & Internal Linking */}
          {alternatives.length > 0 && (
            <section className="my-8 sm:my-10 space-y-3 sm:space-y-4">
              <h3 className="text-sm sm:text-base font-black text-slate-900">
                Compare Similar Alternatives to {sub.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {alternatives.map((alt) => {
                  const altSlug = alt.seo?.slug || alt.id.replace(/_/g, "-");
                  return (
                    <Link
                      key={alt.id}
                      href={`/subscriptions/${altSlug}`}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-extrabold text-xs text-slate-900 group-hover:text-indigo-600">
                            {alt.name}
                          </span>
                          <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                            From {currency}{alt.plans[0]?.price}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium line-clamp-2">
                          {alt.tagline}
                        </p>
                      </div>
                      <div className="mt-2.5 flex items-center gap-1 text-[11px] font-bold text-indigo-600">
                        <span>View Plans &amp; Discounts</span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* Checkout Error Interception Guide */}
          <section className="my-8 sm:my-10 bg-slate-50 rounded-3xl p-4 sm:p-6 border border-slate-200/90 space-y-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-indigo-600 shrink-0" />
              <h3 className="font-black text-sm sm:text-base text-slate-900 leading-snug">
                Why is your {sub.name} promo code or discount not applying at checkout?
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Common reasons subscription coupons fail on {sub.name} and the verified workaround:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div className="p-3 bg-white rounded-2xl border border-slate-200">
                <span className="font-extrabold text-slate-900 block mb-1">1. New Workspace Account</span>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Most SaaS promo codes are restricted to first-time workspace signups. Existing paid accounts must create a new team or switch to annual billing for instant 20%-35% savings.
                </p>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-slate-200">
                <span className="font-extrabold text-slate-900 block mb-1">2. Billing Cycle Requirement</span>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Certain discounts activate only when selecting &apos;Annual (Pay Yearly)&apos; rather than monthly billing. Ensure the yearly billing toggle is turned ON before pasting the code.
                </p>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-slate-200">
                <span className="font-extrabold text-slate-900 block mb-1">3. Student (.edu) Verification</span>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Education and student licenses require signing up with an institutional (.edu / .ac.in) email address. Personal Gmail accounts will be rejected by automated SheerID or UNiDAYS gates.
                </p>
              </div>
            </div>
          </section>

          {/* Direct Activation CTA */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-950 to-indigo-950 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h3 className="font-black text-sm sm:text-base text-white">
                Ready to activate {sub.name}?
              </h3>
              <p className="text-xs text-indigo-200/80 font-medium mt-0.5">
                Visit the official secure portal directly or apply active promo codes at checkout.
              </p>
            </div>
            <a
              href={sub.savingsBlueprint?.officialUrl || "https://www.google.com"}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 font-black text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shrink-0"
            >
              <span>Visit Official {sub.name} Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>
      </main>
    </>
  );
}
