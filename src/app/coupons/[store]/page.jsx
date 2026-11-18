import React from "react";
import { notFound } from "next/navigation";
import { getCouponsForStore } from "@/services/couponService";
import { COUNTRY_TOP_BRANDS, findBrandInCatalog } from "@/data/countryBrandsCatalog";
import { getCountryMeta, getCountryDateDetails } from "@/lib/countryConfig";
import CouponStorePageClient from "./CouponStorePageClient";

export const dynamic = "force-dynamic";

/**
 * Helper to determine country and canonical brand data from slug
 */
function resolveBrandContext(storeSlug, queryCountry) {
  let resolvedCountry = (queryCountry || "").toUpperCase();
  let matchedBrand = null;

  // 1. Check if storeSlug is in countryBrandsCatalog
  if (resolvedCountry) {
    matchedBrand = findBrandInCatalog(storeSlug, resolvedCountry);
  }

  if (!matchedBrand) {
    for (const [code, list] of Object.entries(COUNTRY_TOP_BRANDS)) {
      const found = list.find(b => 
        b.id.toLowerCase() === storeSlug.toLowerCase() || 
        b.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === storeSlug.toLowerCase()
      );
      if (found) {
        matchedBrand = found;
        if (!resolvedCountry) resolvedCountry = code;
        break;
      }
    }
  }

  if (!resolvedCountry) {
    resolvedCountry = "IN";
  }

  const cleanName = matchedBrand?.name || storeSlug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  return {
    matchedBrand,
    country: resolvedCountry,
    cleanName
  };
}

/**
 * Dynamic High-Intent SEO Metadata Generation
 */
export async function generateMetadata({ params, searchParams }) {
  const { store } = await params;
  const sParams = await searchParams;
  const { matchedBrand, country, cleanName } = resolveBrandContext(store, sParams?.country);
  
  const meta = getCountryMeta(country);
  const dateDetails = getCountryDateDetails(country);
  const monthName = dateDetails.monthName;
  const year = dateDetails.year;

  const title = `${cleanName} Promo Codes & Coupons (${monthName} ${year}) — 100% Verified Deals | Benefisto`;
  const description = `Get 100% verified ${cleanName} discount codes, special app vouchers, and payment perks for ${monthName} ${year}. Zero expired codes. Tested daily with instant checkout savings guidance on Benefisto.`;
  const canonicalUrl = `https://www.benefisto.com/coupons/${store}`;
  
  // Real-world, high-volume search query clusters (Google Keyword Planner verified queries)
  const keywords = [
    `${cleanName} coupon code`,
    `${cleanName} promo code`,
    `${cleanName} discount code`,
    `${cleanName} coupons`,
    `${cleanName} voucher code`,
    `${cleanName} promo codes ${monthName} ${year}`,
    `${cleanName} coupon code today`,
    `${cleanName} first order coupon`,
    `${cleanName} new user promo code`,
    `${cleanName} student discount code`,
    `${cleanName} free delivery code`,
    `${cleanName} bank offers today`,
    `${cleanName} credit card discount`,
    `active ${cleanName} discount codes`,
    `${cleanName} promo code not working`,
    `why is ${cleanName} coupon code invalid`,
    `${cleanName} checkout promo error fix`
  ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en-IN": `${canonicalUrl}?country=IN`,
        "en-US": `${canonicalUrl}?country=US`,
        "en-GB": `${canonicalUrl}?country=GB`,
        "en-CA": `${canonicalUrl}?country=CA`,
        "en-AU": `${canonicalUrl}?country=AU`,
        "en-AE": `${canonicalUrl}?country=AE`,
        "x-default": canonicalUrl,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Benefisto",
      type: "website",
      locale: country === "IN" ? "en_IN" : (country === "GB" ? "en_GB" : "en_US"),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    }
  };
}

/**
 * Server-Side Rendered Brand Page with Rich SEO Schemas
 */
export default async function CouponStorePage({ params, searchParams }) {
  const { store } = await params;
  const sParams = await searchParams;
  const { matchedBrand, country, cleanName } = resolveBrandContext(store, sParams?.country);

  // Fetch verified coupons for store
  const couponResult = await getCouponsForStore(cleanName, country);
  if (!couponResult || !couponResult.success) {
    notFound();
  }

  const dateDetails = getCountryDateDetails(country);
  const monthName = dateDetails.monthName;
  const year = dateDetails.year;
  const currencySymbol = getCountryMeta(country)?.symbol || "$";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.benefisto.com";
  const canonicalUrl = `${baseUrl}/coupons/${store}`;

  // Structured Data (JSON-LD) for Google Rich Snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      // 1. Breadcrumb Schema
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": baseUrl
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Coupons & Store Deals",
            "item": `${baseUrl}/#coupons`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": cleanName,
            "item": canonicalUrl
          }
        ]
      },
      // 2. Organization / Store Entity Schema
      {
        "@type": "Store",
        "name": cleanName,
        "url": couponResult.storeData?.officialUrl || `https://${cleanName.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
        "description": `Verified discount coupons and real-time promo codes for ${cleanName}. Tested daily on Benefisto.`,
        "priceRange": `${currencySymbol} - ${currencySymbol}${currencySymbol}${currencySymbol}`
      },
      // 3. FAQPage Schema for Google Accordion Snippets
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": `How do I apply a verified promo code on ${cleanName}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `To apply a promo code on ${cleanName}: 1) Add items to your cart and navigate to checkout. 2) Look for the 'Apply Coupon' or 'Promo Code' box. 3) Click 'Reveal Code' on Benefisto to copy the code. 4) Paste the code in the ${cleanName} checkout box to apply your instant discount.`
            }
          },
          {
            "@type": "Question",
            "name": `Why do some ${cleanName} offers say "Discount Auto-Applied"?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Many major retailers do not require entering a manual code during special sales. Clicking 'Activate Deal' routes you through a verified partner link where the discount is automatically linked to your session at checkout.`
            }
          },
          {
            "@type": "Question",
            "name": `Are these ${cleanName} discount codes tested and working today?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Yes. Every offer on Benefisto is verified daily against minimum order values and active checkout requirements so you never waste time with expired codes.`
            }
          },
          {
            "@type": "Question",
            "name": `How do I get a discount on my first order at ${cleanName}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `First-time shoppers at ${cleanName} can unlock special welcome discounts by downloading the official mobile app or signing up for a fresh account. Check our active first-order promo offers above on Benefisto.`
            }
          },
          {
            "@type": "Question",
            "name": `Can I get guaranteed cash savings on ${cleanName}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Yes! If you prefer 100% zero-failure savings, you can purchase an instant digital gift card before checkout to secure cash savings on your total bill.`
            }
          }
        ]
      },
      // 4. HowTo Schema for Step-by-Step Rich Snippets
      {
        "@type": "HowTo",
        "name": `How to Apply Verified Promo Codes on ${cleanName}`,
        "description": `Step-by-step verified guide to apply checkout promo codes and unlock highest cash savings on ${cleanName}.`,
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Check Minimum Cart Value",
            "text": `Verify your ${cleanName} shopping bag meets the minimum order threshold required for the discount.`
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Copy Active Code on Benefisto",
            "text": `Click 'Reveal Code' on Benefisto to auto-copy the tested promo code and open the official ${cleanName} store.`
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Paste in Checkout Promo Box",
            "text": `Paste the copied code into the 'Apply Coupon' box on the checkout summary screen before payment.`
          }
        ]
      }
    ]
  };

  return (
    <>
      {/* Inject Google Rich Snippets JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Semantic Headings for SEO Crawlers */}
      <div className="sr-only">
        <h1>{cleanName} Promo Codes, Coupons &amp; Verified Deals ({monthName} {year})</h1>
        <h2>Save up to 50% on {cleanName} with tested discount codes and cart optimization</h2>
        <p>
          Find the best active coupons, first order welcome codes, and bank card offers for {cleanName}. Tested daily by Benefisto Shopping Assistant.
        </p>
      </div>

      {/* Interactive Client Component */}
      <CouponStorePageClient 
        initialData={couponResult}
        storeSlug={store}
        countryCode={country}
      />
    </>
  );
}
