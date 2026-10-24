import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  Tv, Film, Sparkles, Check, ExternalLink, 
  ShieldCheck, Copy, ChevronRight, Zap, ArrowRight,
  TrendingUp, Award, Gift, Smartphone, Monitor, Info,
  Bot, Cloud, Gamepad2, Dumbbell, Palette, Briefcase,
  Layers, Volume2, Shield, Calendar, CheckCircle2, ChevronDown
} from "lucide-react";
import { 
  getUniversalSubscriptionBySlug, 
  getAllUniversalSubscriptionSlugs, 
  getSubscriptionsCatalog 
} from "@/data/subscriptionsRegistry";
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
      title: "Subscription Plans & Savings Blueprint | ShopSmart AI",
      description: "Compare digital subscription plans and claim free telecom bundle perks."
    };
  }

  const isUS = sub.country === "US";
  const isUK = sub.country === "GB" || sub.country === "UK";
  const isCA = sub.country === "CA";
  const isAU = sub.country === "AU";
  const isAE = sub.country === "AE";
  const currency = sub.currencySymbol || (isAE ? "AED" : (isAU ? "A$" : (isCA ? "C$" : (isUK ? "£" : (isUS ? "$" : "₹")))));
  const telecomNames = isAE ? "Etisalat/du" : (isAU ? "Optus/Telstra/Hubbl" : (isCA ? "Telus/Bell/Rogers" : (isUK ? "EE/O2/Sky" : (isUS ? "T-Mobile/Verizon" : "Jio/Airtel"))));
  const locale = isAE ? "en_AE" : (isAU ? "en_AU" : (isCA ? "en_CA" : (isUK ? "en_GB" : (isUS ? "en_US" : "en_IN"))));

  const catchyTitle = `${sub.seo.catchyH1} | ShopSmart AI`;
  const metaDesc = `Don't pay full price for ${sub.name}! Compare all ${sub.plans.length} tiers and unlock our verified 4-Level Savings Blueprint to get ${sub.name} for ${currency}0 via ${telecomNames} or up to 50% off with smart bundles.`;
  const canonicalUrl = `https://shopsmart-ai.com/subscriptions/${sub.seo.slug}`;

  return {
    title: catchyTitle,
    description: metaDesc,
    keywords: sub.seo.seoKeywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: catchyTitle,
      description: metaDesc,
      url: canonicalUrl,
      siteName: "ShopSmart AI",
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
  const telecomNames = isAE ? "Etisalat / du" : (isAU ? "Optus / Telstra / Hubbl" : (isCA ? "Telus / Bell / Rogers" : (isUK ? "EE / O2 / Sky" : (isUS ? "T-Mobile / Verizon" : "Airtel / Jio"))));

  // Related alternatives in the same category & region
  const alternatives = activeCatalog
    .filter(item => item.category === sub.category && item.id !== sub.id)
    .slice(0, 3);

  // Structured Data (JSON-LD) for Google Rich Snippets
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
            "item": "https://shopsmart-ai.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Digital Subscriptions",
            "item": "https://shopsmart-ai.com"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": sub.name,
            "item": `https://shopsmart-ai.com/subscriptions/${sub.seo.slug}`
          }
        ]
      },
      // 2. Product & AggregateOffer Schema
      {
        "@type": "Product",
        "name": `${sub.name} Subscription`,
        "description": sub.tagline,
        "brand": {
          "@type": "Brand",
          "name": sub.name
        },
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": priceCurrency,
          "lowPrice": sub.plans[0]?.price || (isUK ? 3.99 : (isUS ? 4.99 : 149)),
          "highPrice": sub.plans[sub.plans.length - 1]?.price || (isUK ? 26.00 : (isUS ? 29.99 : 1499)),
          "offerCount": sub.plans.length
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "1240"
        }
      },
      // 3. FAQPage Schema for Google Search Snippet Accordions
      {
        "@type": "FAQPage",
        "mainEntity": (sub.seo.faqs || []).map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
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

      <main className="min-h-screen bg-slate-50 text-slate-900 pb-16">
        <div className="w-full max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-4 sm:pt-6">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-slate-500 mb-4 sm:mb-6 flex-wrap">
            <Link href="/" className="hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/" className="hover:text-indigo-600 transition-colors">
              Subscriptions Hub
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
                Updated: April 2026
              </span>
              <span className="text-[11px] sm:text-xs text-slate-500 font-semibold">
                {sub.plans.length} Official Plans
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight leading-snug sm:leading-tight">
              {sub.seo.catchyH1}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-3xl leading-relaxed">
              {sub.tagline}. Compare all official tiers, examine 4K streaming & device limits, and unlock our legal 4-level blueprint to claim complimentary access or up to 50% discounts.
            </p>
          </header>

          {/* Client-Side Interactive Plan Switcher, Projections & Anti-AI Shield */}
          <SubscriptionInteractiveClient sub={sub} />

          {/* Official Plans Full Comparison (Responsive Table + Mobile Cards) */}
          <section className="my-8 sm:my-10 bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600 shrink-0" />
              <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                Official {sub.name} Plans & Specifications ({regionName} 2026)
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Comprehensive side-by-side comparison of all {sub.plans.length} active subscription tiers in {regionFullName}.
            </p>

            {/* Mobile View: Touch-Friendly Responsive Cards (sm:hidden) */}
            <div className="block sm:hidden space-y-2.5 pt-1">
              {sub.plans.map((p, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-slate-900">{p.name}</span>
                    <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                      {currency}{p.price} /{p.period}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-[11px] font-semibold text-slate-600 pt-1">
                    <div className="bg-white p-2 rounded-xl border border-slate-100 flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span className="truncate">{p.screens} Screen(s)</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-100 flex items-center gap-1.5">
                      <Monitor className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span className="truncate">{p.resolution}</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-100 flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span className="truncate">{p.audio || "Dolby 5.1"}</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-100 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span className="truncate font-bold text-emerald-700">{p.ads}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View: Full Table (hidden sm:block) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-900 font-black text-[11px] uppercase tracking-wider">
                    <th className="p-3">Plan Tier</th>
                    <th className="p-3">Official Price</th>
                    <th className="p-3">Screens</th>
                    <th className="p-3">Max Video Quality</th>
                    <th className="p-3">Audio Format</th>
                    <th className="p-3">Ads Policy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sub.plans.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3 font-extrabold text-slate-900">{p.name}</td>
                      <td className="p-3 font-black text-indigo-700">{currency}{p.price} /{p.period}</td>
                      <td className="p-3 font-medium">{p.screens} Screen(s)</td>
                      <td className="p-3 font-medium">{p.resolution}</td>
                      <td className="p-3 font-medium">{p.audio || "Dolby 5.1"}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-black text-[10px] border border-emerald-200">
                          {p.ads}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* High-Intent Frequently Asked Questions (Google PAA Accordions) */}
          <section className="my-8 sm:my-10 bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-indigo-600 shrink-0" />
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Frequently Asked Questions about {sub.name}
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Verified answers to the most common queries regarding {sub.name} pricing, carrier perks, and discount policies in {regionFullName}.
            </p>

            <div className="space-y-2.5 pt-1">
              {(sub.seo.faqs || []).map((faq, idx) => (
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

          {/* Related Alternatives & Internal Linking for SEO Authority */}
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
                        <span>View Plans & Discounts</span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* Direct Activation CTA */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-950 to-indigo-950 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h3 className="font-black text-sm sm:text-base text-white">
                Ready to activate {sub.name}?
              </h3>
              <p className="text-xs text-indigo-200/80 font-medium mt-0.5">
                Visit the official secure portal or check your {telecomNames} app for zero-cost perks.
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
