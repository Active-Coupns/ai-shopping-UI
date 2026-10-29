/**
 * ShopSmart AI — Zyte Live Travel Deals & Promo Scraper Engine
 * Powered by Zyte API (ZYTE_API_KEY)
 * 
 * Extracts real-time promo codes, baggage perks, and bank discount offers
 * directly from official carrier and ticketing portals across US, UK, CA, AU, AE, and IN.
 */

import { fetchOfficialBrandPage, getZyteApiKey } from "@/services/zyteService";

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";

/**
 * Official Brand Deal Endpoints Directory
 */
export const OFFICIAL_PROMO_ENDPOINTS = {
  IN: [
    { platformId: "indigo", name: "IndiGo Airlines", category: "flights", url: "https://www.goindigo.in/special-offers.html" },
    { platformId: "airindia", name: "Air India", category: "flights", url: "https://www.airindia.com/in/en/book/special-offers.html" },
    { platformId: "makemytrip", name: "MakeMyTrip Flights & Hotels", category: "flights", url: "https://www.makemytrip.com/promos" },
    { platformId: "taj", name: "Taj Hotels", category: "hotels", url: "https://www.tajhotels.com/en-in/offers/" },
    { platformId: "oyo", name: "OYO Rooms", category: "hotels", url: "https://www.oyorooms.com/deals" },
    { platformId: "bookmyshow", name: "BookMyShow", category: "events", url: "https://in.bookmyshow.com/offers" },
    { platformId: "district", name: "District by Zomato", category: "events", url: "https://www.zomato.com/live" },
    { platformId: "pvr_inox", name: "PVR INOX Cinemas", category: "events", url: "https://www.pvrcinemas.com/offers" }
  ],
  US: [
    { platformId: "delta", name: "Delta Air Lines", category: "flights", url: "https://www.delta.com/us/en/flight-deals/current-flight-deals" },
    { platformId: "united", name: "United Airlines", category: "flights", url: "https://www.united.com/en/us/flight-deals" },
    { platformId: "american", name: "American Airlines", category: "flights", url: "https://www.aa.com/i18n/travel-info/flight-deals.jsp" },
    { platformId: "booking_us", name: "Booking.com US", category: "hotels", url: "https://www.booking.com/deals.html" },
    { platformId: "expedia_us", name: "Expedia US", category: "hotels", url: "https://www.expedia.com/deals" },
    { platformId: "ticketmaster_us", name: "Ticketmaster US", category: "events", url: "https://www.ticketmaster.com/deals" },
    { platformId: "livenation_us", name: "Live Nation US", category: "events", url: "https://www.livenation.com/ticket-deals" },
    { platformId: "seatgeek_us", name: "SeatGeek US", category: "events", url: "https://seatgeek.com/promotions" },
    { platformId: "amc_us", name: "AMC Theatres", category: "events", url: "https://www.amctheatres.com/discount-tuesdays" }
  ],
  GB: [
    { platformId: "ba", name: "British Airways", category: "flights", url: "https://www.britishairways.com/en-gb/flights-and-holidays/flights/offers" },
    { platformId: "easyjet", name: "easyJet UK", category: "flights", url: "https://www.easyjet.com/en/cheap-flights" },
    { platformId: "premierinn", name: "Premier Inn UK", category: "hotels", url: "https://www.premierinn.com/gb/en/deals.html" },
    { platformId: "travelodge", name: "Travelodge UK", category: "hotels", url: "https://www.travelodge.co.uk/deals/" },
    { platformId: "ticketmaster_uk", name: "Ticketmaster UK", category: "events", url: "https://www.ticketmaster.co.uk/special-offers" },
    { platformId: "londontheatre", name: "London Theatre Direct", category: "events", url: "https://www.londontheatredirect.com/special-offers" },
    { platformId: "atgtickets", name: "ATG Tickets West End", category: "events", url: "https://www.atgtickets.com/offers/" },
    { platformId: "odeon_uk", name: "ODEON Cinemas UK", category: "events", url: "https://www.odeon.co.uk/offers-membership/" },
    { platformId: "vue_uk", name: "Vue Cinemas UK", category: "events", url: "https://www.myvue.com/offers-promotions" }
  ],
  CA: [
    { platformId: "aircanada", name: "Air Canada", category: "flights", url: "https://www.aircanada.com/ca/en/aco/home/book/special-offers/flight-deals.html" },
    { platformId: "westjet", name: "WestJet", category: "flights", url: "https://www.westjet.com/en-ca/deals" },
    { platformId: "booking_ca", name: "Booking.com Canada", category: "hotels", url: "https://www.booking.com/deals.html" },
    { platformId: "ticketmaster_ca", name: "Ticketmaster Canada", category: "events", url: "https://www.ticketmaster.ca/deals" },
    { platformId: "cineplex_ca", name: "Cineplex Canada", category: "events", url: "https://www.cineplex.com/promos" },
    { platformId: "mirvish_ca", name: "Mirvish Theatres Toronto", category: "events", url: "https://www.mirvish.com/ticket-deals" }
  ],
  AU: [
    { platformId: "qantas", name: "Qantas", category: "flights", url: "https://www.qantas.com/au/en/flight-deals.html" },
    { platformId: "virginaustralia", name: "Virgin Australia", category: "flights", url: "https://www.virginaustralia.com/au/en/specials-offers/flight-specials/" },
    { platformId: "jetstar", name: "Jetstar Australia", category: "flights", url: "https://www.jetstar.com/au/en/deals" },
    { platformId: "booking_au", name: "Booking.com AU", category: "hotels", url: "https://www.booking.com/deals.html" },
    { platformId: "ticketmaster_au", name: "Ticketmaster Australia", category: "events", url: "https://www.ticketmaster.com.au/deals" },
    { platformId: "hoyts_au", name: "Hoyts Cinemas Australia", category: "events", url: "https://www.hoyts.com.au/offers" },
    { platformId: "eventcinemas_au", name: "Event Cinemas Australia", category: "events", url: "https://www.eventcinemas.com.au/promotions" }
  ],
  AE: [
    { platformId: "emirates", name: "Emirates", category: "flights", url: "https://www.emirates.com/ae/english/special-offers/" },
    { platformId: "flydubai", name: "flydubai", category: "flights", url: "https://www.flydubai.com/en/offers/" },
    { platformId: "booking_ae", name: "Booking.com UAE", category: "hotels", url: "https://www.booking.com/deals.html" },
    { platformId: "platinumlist_ae", name: "Platinumlist Dubai", category: "events", url: "https://dubai.platinumlist.net" },
    { platformId: "vox_ae", name: "VOX Cinemas UAE", category: "events", url: "https://uae.voxcinemas.com/ticket-offer" },
    { platformId: "dpr_ae", name: "Dubai Parks and Resorts", category: "events", url: "https://www.dubaiparksandresorts.com/en/offers" }
  ]
};

/**
 * Scrape a specific merchant promo page via Zyte API and extract active promo codes using AI parser
 */
export async function scrapeLiveBrandDeals(targetUrl, brandName, category, country) {
  const zyteKey = getZyteApiKey();
  if (!zyteKey) {
    console.warn("[Zyte Travel Engine] ZYTE_API_KEY is missing. Skipping live proxy scrape.");
    return null;
  }

  console.log(`[Zyte Travel Engine] Scraping official promo page for ${brandName} (${targetUrl})...`);
  const rawHtml = await fetchOfficialBrandPage(targetUrl, { country, browserHtml: false, timeoutMs: 25000 });

  if (!rawHtml || rawHtml.length < 200) {
    console.warn(`[Zyte Travel Engine] Empty or short HTML payload for ${brandName}`);
    return null;
  }

  // Sanitize and extract promo text tokens to feed into Groq AI
  const cleanText = rawHtml
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .slice(0, 15000);

  if (!GROQ_API_KEY) {
    return null;
  }

  try {
    const prompt = `Extract active promo codes, discounts, baggage perks, and bank card offers from this official ${brandName} (${country}) page text:
"""${cleanText.slice(0, 8000)}"""

OUTPUT AS JSON:
{
  "deals": [
    {
      "title": "Short punchy offer title",
      "promoCode": "CODE or N/A",
      "discountValue": "e.g. 15% Off or Free Checked Bag",
      "estimatedSavings": "e.g. $50 or £30",
      "dealType": "PROMO_CODE" | "BANK_OFFER" | "CATEGORY_PERK" | "APP_EXCLUSIVE",
      "badge": "e.g. LIVE VERIFIED"
    }
  ]
}`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
        response_format: { type: "json_object" }
      }),
      signal: AbortSignal.timeout(10000)
    });

    if (res.ok) {
      const json = await res.json();
      const content = json.choices?.[0]?.message?.content;
      if (content) {
        const parsed = JSON.parse(content);
        return parsed.deals || [];
      }
    }
  } catch (err) {
    console.warn(`[Zyte Travel Engine] AI deal extraction failed for ${brandName}:`, err.message);
  }

  return null;
}
