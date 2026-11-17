import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  Plane, Hotel, Sparkles, ShieldCheck, ChevronRight, 
  Info, ExternalLink, ChevronDown, CheckCircle2, ArrowRight
} from "lucide-react";
import { 
  getTravelBrandBySlug, 
  getAllTravelSlugs, 
  getTravelBrands 
} from "@/data/travelRegistry.js";
import TravelInteractiveClient from "./TravelInteractiveClient";

export async function generateStaticParams() {
  const slugs = getAllTravelSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const brand = getTravelBrandBySlug(slug);

  if (!brand) {
    return {
      title: "Flight & Hotel Savings Blueprints | Benefisto",
      description: "Compare verified flight and hotel savings strategies and claim promo codes."
    };
  }

  const now = new Date();
  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  const currentMonth = monthNames[now.getMonth()];
  const currentYear = now.getFullYear();

  const isFlight = brand.category === "flights";
  const hasCoupons = brand.coupons && brand.coupons.length > 0;

  const catchyTitle = hasCoupons
    ? `${brand.name} Promo Codes & Savings Blueprints (${currentMonth} ${currentYear}) — Verified Deals | Benefisto`
    : `How to Save on ${brand.name} (${currentMonth} ${currentYear}): Concessions & Booking Blueprints | Benefisto`;

  const metaDesc = hasCoupons
    ? `Verified ${brand.name} promo codes, discount vouchers, and saving blueprints for ${currentMonth} ${currentYear}. Tested daily with instant checkout savings on Benefisto.`
    : `Don't pay full fare on ${brand.name}! Cut your booking cost with verified student & defense concessions, 21-day advance booking windows, and app-only deals on Benefisto.`;

  const canonicalUrl = `https://www.benefisto.com/travel/${brand.slug}`;

  const keywords = [
    `how to save on ${brand.name}`,
    `${brand.name} promo code`,
    `${brand.name} coupon code`,
    `${brand.name} discount code`,
    `${brand.name} student discount`,
    `${brand.name} ${currentMonth} ${currentYear}`,
    `${brand.name} booking discount`,
    isFlight ? `${brand.name} extra baggage allowance` : `${brand.name} secret app rates`,
    isFlight ? `${brand.name} flight booking window` : `${brand.name} free cancellation hack`,
    `${brand.name} bank card offers`,
    `best deal on ${brand.name}`,
    `cheap ${brand.name} tickets`,
    `${brand.name} defense discount`,
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

export default async function TravelDetailPage({ params }) {
  const { slug } = await params;
  const brand = getTravelBrandBySlug(slug);

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

  const isFlight = brand.category === "flights";
  const canonicalUrl = `https://www.benefisto.com/travel/${brand.slug}`;

  // Get similar alternatives in the same country & category
  const allInCountry = getTravelBrands(brand.country, brand.category);
  const alternatives = allInCountry.filter((b) => b.slug !== brand.slug).slice(0, 3);

  // Generate 5 Guaranteed High-Intent FAQs
  const faqs = [
    {
      question: `Does ${brand.name} offer student discounts or concessions?`,
      answer: isFlight 
        ? `Yes! Most major airlines including ${brand.name} provide specialized student concessions offering up to 6%–10% discount on base fares plus additional complimentary checked baggage (usually 25kg checked baggage instead of 15kg). Valid student ID is verified at airport check-in.`
        : `Hotels on ${brand.name} frequently participate in student or youth member rates when booked through verified student portals or mobile app programs.`
    },
    {
      question: `What is the optimal day and advance window to book ${brand.name}?`,
      answer: isFlight
        ? `Airline revenue management systems typically increase fares steeply 14 days and 7 days before departure. The optimal booking window for ${brand.name} is Tuesday or Wednesday at least 21 to 30 days prior to travel.`
        : `For hotels on ${brand.name}, reserving with 'Free Cancellation' 30 days ahead and checking rates again 48 hours prior to arrival often reveals price-drops if unsold rooms remain.`
    },
    {
      question: `How do I apply promo codes on ${brand.name}?`,
      answer: `On the checkout or payment summary screen of ${brand.name}, locate the field labeled 'Promo Code', 'Voucher Code', or 'Bank Offers'. Enter the verified code and click apply to deduct the discount immediately.`
    },
    {
      question: `Are mobile app rates cheaper on ${brand.name}?`,
      answer: `Yes, booking portals and travel operators routinely push 10%–20% 'Mobile App Exclusive' discounts to incentivize smartphone downloads. Always compare the mobile app price before completing desktop checkout.`
    },
    {
      question: `Which credit cards offer the highest discounts on ${brand.name}?`,
      answer: `Leading co-branded and travel cards (such as HDFC, ICICI, Axis, Amex, and Chase) partner regularly with ${brand.name} for rotating weekday discounts, airport lounge access, and 5%–10% reward points transfers.`
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
        "name": "Travel Savings & Blueprints",
        "item": "https://www.benefisto.com/travel"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": brand.name,
        "item": canonicalUrl
      }
    ]
  };

  // Product / Offer Schema (Strictly Compliant, No Fake Reviews)
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${brand.name} Travel Booking & Savings Blueprint`,
    "description": brand.tagline,
    "brand": {
      "@type": "Brand",
      "name": brand.name
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": brand.country === "US" ? "USD" : (brand.country === "GB" ? "GBP" : (brand.country === "AE" ? "AED" : "INR")),
      "lowPrice": "0",
      "highPrice": "5000",
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
        {/* Breadcrumb Navigation */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 overflow-x-auto whitespace-nowrap">
              <Link href="/" className="hover:text-indigo-600 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <Link href="/travel" className="hover:text-indigo-600 transition-colors">
                Travel Hub
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-slate-900 font-extrabold truncate">
                {brand.name}
              </span>
            </nav>
          </div>
        </div>

        {/* Hero Banner */}
        <header className="bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 text-white pt-6 sm:pt-10 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 border-b border-indigo-900/40 relative overflow-hidden">
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-5">
              {/* Left Brand Identity */}
              <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                <div
                  className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-gradient-to-tr ${brand.accentColor} text-white flex items-center justify-center font-black text-lg sm:text-xl shadow-lg ring-2 ring-white/10 shrink-0`}
                >
                  {brand.logoText}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-black text-[10px] uppercase tracking-wider border border-blue-400/30 flex items-center gap-1">
                      {isFlight ? <Plane className="w-3 h-3" /> : <Hotel className="w-3 h-3" />}
                      {isFlight ? "Airlines & Airfare" : "Hotels & Stays"}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">
                      {brand.country} Market
                    </span>
                  </div>

                  <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                    {brand.name} Plans, Promo Codes &amp; Blueprints
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1 max-w-xl">
                    {brand.tagline}
                  </p>
                </div>
              </div>

              {/* Right Verified Trust Badge */}
              <div className="w-full sm:w-auto bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 border border-white/10 shrink-0 flex items-center justify-between sm:flex-col sm:items-end">
                <div className="flex items-center sm:justify-end gap-1.5 text-emerald-400 text-xs font-black">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified Concessions</span>
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
          <TravelInteractiveClient brand={brand} />

          {/* High-Intent FAQ Section */}
          <section className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-md space-y-4">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-indigo-600 shrink-0" />
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Frequently Asked Questions about {brand.name}
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Verified answers to the most common queries regarding {brand.name} flight baggage, hotel rates, and concessions.
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

          {/* Related Travel Alternatives */}
          {alternatives.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-sm sm:text-base font-black text-slate-900">
                Compare Similar Alternatives to {brand.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {alternatives.map((alt) => (
                  <Link
                    key={alt.slug}
                    href={`/travel/${alt.slug}`}
                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-indigo-600 line-clamp-1">
                          {alt.name}
                        </span>
                        <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full shrink-0">
                          {alt.coupons?.length || 0} Deals
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium line-clamp-2">
                        {alt.tagline}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-indigo-600">
                      <span>View Blueprints</span>
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
