import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  Ticket, Film, Music, CreditCard, Sparkles, ShieldCheck, 
  ChevronRight, Info, ExternalLink, ChevronDown, CheckCircle2, ArrowRight
} from "lucide-react";
import { 
  getEventBrandBySlug, 
  getAllEventSlugs, 
  getEventBrands 
} from "@/data/travelRegistry.js";
import EventInteractiveClient from "./EventInteractiveClient";

export async function generateStaticParams() {
  const slugs = getAllEventSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const brand = getEventBrandBySlug(slug);

  if (!brand) {
    return {
      title: "Event & Concert Savings Blueprints | Benefisto",
      description: "Compare verified event and cinema ticket savings strategies and claim promo codes."
    };
  }

  const now = new Date();
  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  const currentMonth = monthNames[now.getMonth()];
  const currentYear = now.getFullYear();

  const hasCoupons = brand.coupons && brand.coupons.length > 0;

  const catchyTitle = hasCoupons
    ? `${brand.name} Promo Codes & BOGO Deals (${currentMonth} ${currentYear}) — Verified Vouchers | Benefisto`
    : `How to Save on ${brand.name} Tickets (${currentMonth} ${currentYear}): BOGO Cards & Blueprints | Benefisto`;

  const metaDesc = hasCoupons
    ? `Verified ${brand.name} promo codes, Buy-1-Get-1 (BOGO) credit card passes, and event saving blueprints for ${currentMonth} ${currentYear}. Tested daily on Benefisto.`
    : `Don't pay full price for ${brand.name} tickets! Cut your bill with verified Buy-1-Get-1 bank card hacks (ICICI, HDFC, Axis, Amex), early bird arbitrage, and 24-hr resale drops on Benefisto.`;

  const canonicalUrl = `https://www.benefisto.com/events/${brand.slug}`;

  const keywords = [
    `how to save on ${brand.name}`,
    `${brand.name} promo code`,
    `${brand.name} coupon code`,
    `${brand.name} bogo offer`,
    `buy 1 get 1 free ${brand.name}`,
    `${brand.name} credit card offers`,
    `${brand.name} ${currentMonth} ${currentYear}`,
    `${brand.name} icici card discount`,
    `${brand.name} hdfc bank offer`,
    `${brand.name} presale code`,
    `cheap ${brand.name} tickets`,
    `best deal on ${brand.name}`,
    `${brand.name} movie ticket hack`,
    `active ${brand.name} coupons`
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
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: catchyTitle,
      description: metaDesc,
    }
  };
}

export default async function EventDetailPage({ params }) {
  const { slug } = await params;
  const brand = getEventBrandBySlug(slug);

  if (!brand) {
    notFound();
  }

  const now = new Date();
  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  const currentMonth = monthNames[now.getMonth()];
  const currentYear = now.getFullYear();

  const canonicalUrl = `https://www.benefisto.com/events/${brand.slug}`;

  // Get similar alternatives in the same country
  const allInCountry = getEventBrands(brand.country);
  const alternatives = allInCountry.filter((b) => b.slug !== brand.slug).slice(0, 3);

  // Generate 5 High-Intent FAQs
  const faqs = [
    {
      question: `How do I claim Buy 1 Get 1 Free (BOGO) tickets on ${brand.name}?`,
      answer: `On the payment or checkout screen of ${brand.name}, select 'Unlock Offers or Apply PromoCodes'. Choose your qualifying bank (such as ICICI Sapphiro/Coral, HDFC, Axis, RBL, or SBI) and enter your card number. The cost of the second ticket is automatically deducted up to the specified card cap.`
    },
    {
      question: `What is the best timing to get cheap concert or sports tickets on ${brand.name}?`,
      answer: `For primary ticketing tours, Phase-1 Early Bird releases are 35%–40% cheaper than final phase prices. For secondary resale marketplaces, ticket prices plunge during the final 4 to 24 hours before showtime as brokers slash rates to prevent total inventory loss.`
    },
    {
      question: `How can I bypass convenience fees on ${brand.name}?`,
      answer: `Certain credit cards (like Kotak PVR Platinum or Axis Bank Select) refund or waive internet booking convenience fees. Alternatively, subscribing to membership passes (like PVR Passport) enables fee-free ticket redemption.`
    },
    {
      question: `Are student discounts available on ${brand.name}?`,
      answer: `Yes, college students can access discounted tickets for select music festivals, college comedy tours, and weekday cinema screenings by showing valid university identification during booking or at the physical venue gate.`
    },
    {
      question: `What happens if an event booked on ${brand.name} is cancelled or rescheduled?`,
      answer: `Tickets booked through official partners on ${brand.name} come with 100% buyer protection guarantee. If an event is cancelled, a full refund of the base ticket amount is processed back to the original payment method.`
    }
  ];

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
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
        "name": "Events & Entertainment Savings",
        "item": "https://www.benefisto.com/events"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": brand.name,
        "item": canonicalUrl
      }
    ]
  };

  // Product / Offer Schema
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${brand.name} Ticket Booking & BOGO Savings Blueprint`,
    "description": brand.tagline,
    "brand": {
      "@type": "Brand",
      "name": brand.name
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": brand.country === "US" ? "USD" : (brand.country === "GB" ? "GBP" : (brand.country === "AE" ? "AED" : "INR")),
      "lowPrice": "0",
      "highPrice": "2500",
      "offerCount": brand.coupons?.length || 3
    }
  };

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="min-h-screen bg-slate-50 text-slate-900 pb-20">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 overflow-x-auto whitespace-nowrap">
              <Link href="/" className="hover:text-purple-600 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <Link href="/events" className="hover:text-purple-600 transition-colors">
                Events Hub
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-slate-900 font-extrabold truncate">
                {brand.name}
              </span>
            </nav>
          </div>
        </div>

        {/* Hero Banner */}
        <header className="bg-gradient-to-b from-purple-950 via-slate-900 to-slate-950 text-white pt-6 sm:pt-10 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 border-b border-purple-900/40 relative overflow-hidden">
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-5">
              {/* Brand Identity */}
              <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                <div
                  className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-gradient-to-tr ${brand.accentColor} text-white flex items-center justify-center font-black text-lg sm:text-xl shadow-lg ring-2 ring-white/10 shrink-0`}
                >
                  {brand.logoText}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-black text-[10px] uppercase tracking-wider border border-purple-400/30 flex items-center gap-1">
                      <Ticket className="w-3 h-3" />
                      Entertainment &amp; Ticketing
                    </span>
                    <span className="text-xs text-slate-400 font-bold">
                      {brand.country} Market
                    </span>
                  </div>

                  <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                    {brand.name} BOGO Offers, Promo Codes &amp; Blueprints
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1 max-w-xl">
                    {brand.tagline}
                  </p>
                </div>
              </div>

              {/* Verified Trust Badge */}
              <div className="w-full sm:w-auto bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 border border-white/10 shrink-0 flex items-center justify-between sm:flex-col sm:items-end">
                <div className="flex items-center sm:justify-end gap-1.5 text-purple-300 text-xs font-black">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>BOGO Verified</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Tested {currentMonth} {currentYear} • 98% Success
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8 -mt-5 sm:-mt-6 relative z-20 space-y-6 sm:space-y-8">
          {/* Interactive Client Component */}
          <EventInteractiveClient brand={brand} />

          {/* High-Intent FAQ Section */}
          <section className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-md space-y-4">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-purple-600 shrink-0" />
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Frequently Asked Questions about {brand.name}
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Verified answers to the most common queries regarding {brand.name} BOGO bank cards, presale tickets, and refunds.
            </p>

            <div className="space-y-3 pt-1">
              {faqs.map((faq, idx) => (
                <details
                  key={idx}
                  className="group rounded-2xl bg-slate-50 border border-slate-200/80 p-4 transition-all"
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

          {/* Related Event Alternatives */}
          {alternatives.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-sm sm:text-base font-black text-slate-900">
                Compare Similar Alternatives to {brand.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {alternatives.map((alt) => (
                  <Link
                    key={alt.slug}
                    href={`/events/${alt.slug}`}
                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-purple-600 line-clamp-1">
                          {alt.name}
                        </span>
                        <span className="text-[10px] font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full shrink-0">
                          {alt.coupons?.length || 0} Deals
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium line-clamp-2">
                        {alt.tagline}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-purple-600">
                      <span>View BOGO Blueprints</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
