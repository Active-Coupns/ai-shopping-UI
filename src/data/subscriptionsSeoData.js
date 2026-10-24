import { INDIA_SUBSCRIPTIONS_CATALOG } from "./subscriptionsCatalog";
import { Redis } from "@upstash/redis";

const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL || "";
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || "";

let redisClient = null;
if (UPSTASH_REDIS_REST_URL && UPSTASH_REDIS_REST_TOKEN) {
  redisClient = new Redis({
    url: UPSTASH_REDIS_REST_URL,
    token: UPSTASH_REDIS_REST_TOKEN
  });
}

/**
 * High-Converting SEO Metadata, PAA FAQs, and Catchy Keywords
 * for all 25 Indian Subscription Brands.
 */
export const SUBSCRIPTIONS_SEO_MAP = {
  hotstar: {
    slug: "disney-plus-hotstar",
    aliases: ["hotstar", "disney-hotstar"],
    catchyH1: "Disney+ Hotstar Subscription Plans 2026: Claim ₹0 Free via Airtel & Save Up To 55%",
    seoKeywords: [
      "Hotstar free plans trick",
      "Hotstar save money discounted subscription",
      "Disney Hotstar free Airtel claim",
      "Hotstar cricket annual pass discount",
      "Hotstar ₹149 mobile recharge pack",
      "Hotstar working coupon codes 2026"
    ],
    faqs: [
      {
        question: "How can I get Disney+ Hotstar for ₹0 free in India?",
        answer: "You can get Disney+ Hotstar for ₹0 through Airtel prepaid recharges (₹839 & ₹999 packs), JioFiber broadband plans (₹999+ tiers), or Vi mobile bundles. Open your Airtel Thanks or MyJio app to claim your complimentary subscription without paying any extra fee."
      },
      {
        question: "What is the difference between Hotstar Super and Premium plans?",
        answer: "Hotstar Super (₹899/year) allows 2 concurrent screens at Full HD (1080p) quality with ad-supported content. Hotstar Premium (₹1,499/year or ₹299/month) unlocks 4 simultaneous 4K Ultra HD screens, Dolby Atmos sound, and is 100% ad-free on movies and series."
      },
      {
        question: "Can I watch live IPL or Cricket on Hotstar Mobile plan?",
        answer: "Yes, the Hotstar Mobile plan (₹149 for 3 months or ₹499/year) includes full access to all live cricket and sports tournaments. However, viewing is restricted to one mobile phone or tablet screen at 720p HD resolution."
      },
      {
        question: "How do I save money if I only want to watch 1 show on Hotstar?",
        answer: "Do not buy the ₹1,499 annual pack for a single show. Choose the ₹149 3-Month Mobile pack or check if your telecom operator already includes free Hotstar access. This saves you ₹1,350 immediately."
      }
    ]
  },

  netflix: {
    slug: "netflix",
    aliases: ["netflix-india"],
    catchyH1: "Netflix India Plans 2026: Mobile, 4K Pricing & The Legal ₹0 Free Telecom Trick",
    seoKeywords: [
      "Netflix free plans trick",
      "Netflix save money discounted subscription",
      "Netflix Airtel Jio free recharge bundle",
      "Netflix annual plan cost in India",
      "Netflix 4K family split strategy",
      "Netflix ₹149 mobile plan hack"
    ],
    faqs: [
      {
        question: "Does Netflix India offer an Annual discount plan?",
        answer: "Netflix does not sell an official annual prepaid plan directly on their website; they only bill monthly. However, with ShopSmart AI's annualized calculation, Mobile is ₹1,788/yr, Basic is ₹2,388/yr, Standard is ₹5,988/yr, and Premium 4K is ₹7,788/yr."
      },
      {
        question: "How do I get Netflix for ₹0 free in India legally?",
        answer: "You can claim complimentary Netflix Basic access via Jio Postpaid Plus plans (starting at ₹699/month) or Airtel Infinity Postpaid plans (₹1,199/month). The subscription is renewed every month free of charge as part of your telecom bill."
      },
      {
        question: "Can multiple people watch Netflix Premium on different screens?",
        answer: "Yes, the Netflix Premium plan (₹649/month) supports up to 4 concurrent screens simultaneously in 4K Ultra HD HDR with Spatial Audio and Dolby Atmos support."
      },
      {
        question: "Is Netflix password sharing banned in India?",
        answer: "Netflix enforces household device verification for TV devices. However, mobile and tablet streaming remains flexible across personal locations within your family network."
      }
    ]
  },

  prime: {
    slug: "amazon-prime-video",
    aliases: ["prime", "prime-video", "amazon-prime"],
    catchyH1: "Amazon Prime Video Plans 2026: Get 50% Youth Cashback & ₹0 Telecom Bundles",
    seoKeywords: [
      "Amazon Prime save money discounted subscription",
      "Prime Video free with Airtel Jio",
      "Prime Youth Offer 50% cashback trick",
      "Prime Video ₹399 shopping edition plan",
      "Amazon Prime coupon code today"
    ],
    faqs: [
      {
        question: "How does the Amazon Prime 50% Youth Offer work?",
        answer: "If you are between 18 and 24 years old, verify your age on the Amazon app using your Aadhaar or college ID. Upon subscribing to the ₹1,499 annual pack, Amazon immediately credits ₹750 cashback into your Amazon Pay wallet, making the effective cost only ₹749/year."
      },
      {
        question: "What is Prime Video Mobile Edition vs Full Prime?",
        answer: "The Mobile Edition (₹599/year) allows 1 mobile device streaming at HD resolution. The Full Access Prime plan (₹1,499/year) provides 4K streaming across 5 devices, free 1-day Amazon shopping deliveries, Prime Music, and Prime Gaming."
      },
      {
        question: "Which recharge plan gives free Amazon Prime in India?",
        answer: "Airtel ₹999 prepaid recharge gives you 84 days of free Amazon Prime membership. Jio also offers complimentary Prime Video Mobile edition with select prepaid and broadband packs."
      }
    ]
  },

  sonyliv: {
    slug: "sonyliv",
    aliases: ["sony-liv"],
    catchyH1: "SonyLIV Subscription Plans 2026: Secret Combo Passes & Up to 60% Savings",
    seoKeywords: [
      "SonyLIV save money discount subscription",
      "SonyLIV free recharge Airtel Jio",
      "SonyLIV coupon code today",
      "SonyLIV Times Prime free bundle",
      "SonyLIV UEFA Champions League pass"
    ],
    faqs: [
      {
        question: "How can I get SonyLIV for free in India?",
        answer: "SonyLIV is bundled for ₹0 inside Times Prime (₹1,199/year) along with Disney+ Hotstar and YouTube Premium. It is also included free in Airtel Xstream Fiber and Tata Play Binge packages."
      },
      {
        question: "What are the current SonyLIV subscription charges?",
        answer: "SonyLIV Premium costs ₹299 for 1 month, ₹699 for 6 months, and ₹999 for 1 year (or ₹1,499 for 2 concurrent screens). The Mobile-only plan is ₹599/year."
      }
    ]
  },

  zee5: {
    slug: "zee5",
    aliases: ["zee-5"],
    catchyH1: "ZEE5 Premium Plans 2026: 4K Regional Movies & Best Discount Voucher Hacks",
    seoKeywords: [
      "ZEE5 save money discount subscription",
      "ZEE5 free promo code",
      "ZEE5 annual pack offer",
      "ZEE5 Tata Play Binge bundle"
    ],
    faqs: [
      {
        question: "What is the price of ZEE5 Premium in India?",
        answer: "ZEE5 Premium HD costs ₹699/year (Full HD, 2 screens). The ZEE5 Premium 4K plan costs ₹899/year for 4 simultaneous screens with Dolby Atmos."
      },
      {
        question: "How to get ZEE5 subscription at discounted rates?",
        answer: "You can purchase ZEE5 gift vouchers on Amazon Pay or Gyftr for an instant 15% to 20% discount, or get it bundled free with JioFiber and Airtel broadband packs."
      }
    ]
  },

  jiocinema: {
    slug: "jiocinema",
    aliases: ["jio-cinema"],
    catchyH1: "JioCinema Premium Plans 2026: ₹29/mo HBO Pass & Family 4K Strategy",
    seoKeywords: [
      "JioCinema premium plans India",
      "JioCinema ₹29 plan details",
      "JioCinema save money family 4K plan",
      "JioCinema HBO Warner Bros pass"
    ],
    faqs: [
      {
        question: "What is the price of JioCinema Premium?",
        answer: "JioCinema Premium costs only ₹29/month for 1 screen (ad-free 4K HBO & Peacock content), or ₹89/month for the Family plan which supports up to 4 concurrent devices."
      },
      {
        question: "Are live IPL matches free on JioCinema?",
        answer: "Yes, regular domestic sports and live IPL matches remain free with ads for all users. The ₹29/month Premium pass is strictly for ad-free Hollywood HBO blockbusters and exclusive series."
      }
    ]
  },

  appletv: {
    slug: "apple-tv-plus",
    aliases: ["appletv", "apple-tv"],
    catchyH1: "Apple TV+ Plans 2026: 3 Months Free Hardware Perk & Apple One Bundle Hacks",
    seoKeywords: [
      "Apple TV plus free trial hack",
      "Apple TV plus save money Apple One bundle",
      "Apple TV plus plans India 2026"
    ],
    faqs: [
      {
        question: "How to get Apple TV+ for free in India?",
        answer: "When you purchase any new iPhone, iPad, Mac, or Apple TV device, Apple provides 3 months of Apple TV+ completely free. Claim it via the Apple TV app within 90 days of activating your new device."
      },
      {
        question: "What is the standalone monthly price of Apple TV+ in India?",
        answer: "Apple TV+ costs ₹99/month in India, supporting up to 6 family members via Apple Family Sharing in 4K Dolby Vision and Dolby Atmos."
      }
    ]
  },

  lionsgate: {
    slug: "lionsgate-play",
    aliases: ["lionsgate"],
    catchyH1: "Lionsgate Play India Plans: John Wick Hollywood Pass & 50% Off Voucher Routes",
    seoKeywords: ["Lionsgate Play plans India", "Lionsgate Play coupon code", "Lionsgate Play combo pass"],
    faqs: [
      {
        question: "What is Lionsgate Play's annual price?",
        answer: "Lionsgate Play costs ₹699/year or ₹149/month for Full HD streaming across 2 screens."
      }
    ]
  },

  spotify: {
    slug: "spotify",
    aliases: ["spotify-premium", "spotify-india"],
    catchyH1: "Spotify Premium India 2026: 50% Student Discount, Family Splits & ₹719 Annual Trick",
    seoKeywords: [
      "Spotify free plans trick",
      "Spotify save money discounted subscription",
      "Spotify student discount 50% off",
      "Spotify ₹719 annual prepaid pack",
      "Spotify family plan split cost"
    ],
    faqs: [
      {
        question: "How much does Spotify Premium cost in India?",
        answer: "Spotify Premium costs ₹119/month for Individual, ₹59/month for Students (50% off with college ID), ₹149/month for Duo (2 accounts), and ₹179/month for Family (6 separate accounts). The 1-Year prepaid pack is ₹719."
      },
      {
        question: "How do I save maximum money on Spotify?",
        answer: "The cheapest route is the Family Plan split: 6 friends pay ₹179/month total, which equals just ₹29.80 per person per month for ad-free 320kbps offline music."
      }
    ]
  },

  youtube_premium: {
    slug: "youtube-premium",
    aliases: ["youtube-music"],
    catchyH1: "YouTube Premium India Plans 2026: Student Rates, Family Splits & ₹1,290 Annual Pass",
    seoKeywords: [
      "YouTube Premium save money discount trick",
      "YouTube Premium student verification India",
      "YouTube Premium family plan cost",
      "YouTube Premium annual pack discount"
    ],
    faqs: [
      {
        question: "What are the updated YouTube Premium prices in India?",
        answer: "Following the recent price update, YouTube Premium Individual costs ₹149/month (or ₹1,290/year prepaid), Family costs ₹299/month for up to 5 members, and Student costs ₹79/month."
      },
      {
        question: "How do I get YouTube Premium for ₹0 free?",
        answer: "Times Prime members get 2 to 3 months of YouTube Premium for ₹0. Many Android phones and Samsung flagships also bundle 2 to 4 months of free YouTube Premium at launch."
      }
    ]
  },

  apple_music: {
    slug: "apple-music",
    aliases: ["apple-music-india"],
    catchyH1: "Apple Music Plans 2026: Lossless Hi-Fi Audio, Student ₹59 & Apple One Savings",
    seoKeywords: ["Apple Music student discount", "Apple Music Lossless HiFi price", "Apple One bundle India"],
    faqs: [
      {
        question: "Does Apple Music include Lossless Audio for free?",
        answer: "Yes, Apple Music includes full 24-bit/192kHz Hi-Res Lossless Audio and Spatial Audio with Dolby Atmos at no additional charge on all plans starting at ₹99/month (₹59 for students)."
      }
    ]
  },

  jiosaavn: {
    slug: "jiosaavn",
    aliases: ["jio-saavn"],
    catchyH1: "JioSaavn Pro Plans 2026: Unlimited JioTunes, Ad-Free Music & ₹399 Annual Offer",
    seoKeywords: ["JioSaavn Pro annual plan offer", "JioSaavn free with Jio recharge", "JioSaavn discount coupon"],
    faqs: [
      {
        question: "Is JioSaavn Pro free for Jio SIM users?",
        answer: "Jio SIM users get free basic music streaming with unlimited caller tunes. To remove audio ads and enable 320kbps offline downloads, JioSaavn Pro costs ₹399/year or ₹99/month."
      }
    ]
  },

  chatgpt_plus: {
    slug: "chatgpt-plus",
    aliases: ["chatgpt", "openai"],
    catchyH1: "ChatGPT Plus India Pricing 2026: GPT-4o Access, Tax Invoices & Cost Optimization",
    seoKeywords: [
      "ChatGPT Plus India price with GST",
      "ChatGPT Plus save money trick",
      "ChatGPT Plus discount coupon India"
    ],
    faqs: [
      {
        question: "What is the price of ChatGPT Plus in India?",
        answer: "ChatGPT Plus is priced at $20 USD/month (approx. ₹1,999/month inclusive of 18% Indian GST). It gives priority access to GPT-4o, canvas, advanced voice mode, and DALL-E image generation."
      },
      {
        question: "Can businesses claim GST input credit on ChatGPT Plus?",
        answer: "Yes, if you enter your 15-digit Indian GSTIN during checkout, OpenAI issues a tax invoice allowing you to claim back 18% GST input credit."
      }
    ]
  },

  canva_pro: {
    slug: "canva-pro",
    aliases: ["canva"],
    catchyH1: "Canva Pro India Plans 2026: 100% Free Education Route & ₹3,999 Annual Savings",
    seoKeywords: [
      "Canva Pro free education invite trick",
      "Canva Pro save money team plan",
      "Canva Pro discount coupon 2026"
    ],
    faqs: [
      {
        question: "How can students and teachers get Canva Pro for ₹0 free?",
        answer: "Canva for Education provides 100% free lifetime Canva Pro access to verified teachers and students. Submit your school/college ID or institutional .edu/.ac.in email address on canva.com/education."
      },
      {
        question: "What is the price of Canva Pro for individuals in India?",
        answer: "Canva Pro costs ₹499/month or ₹3,999/year (saving 33% compared to monthly payments)."
      }
    ]
  },

  adobe_cc: {
    slug: "adobe-creative-cloud",
    aliases: ["adobe", "photoshop"],
    catchyH1: "Adobe Creative Cloud India 2026: 60% Student Discount & Black Friday Tricks",
    seoKeywords: [
      "Adobe Photoshop student discount India",
      "Adobe Creative Cloud save money coupon",
      "Adobe CC 60% off student hack"
    ],
    faqs: [
      {
        question: "How do students get 60% off on Adobe Creative Cloud?",
        answer: "Students and educators can subscribe to the Adobe All Apps pack for ₹1,915/month instead of the regular ₹4,630/month by verifying their college enrollment during checkout."
      }
    ]
  },

  copilot_pro: {
    slug: "microsoft-copilot-pro",
    aliases: ["copilot"],
    catchyH1: "Microsoft Copilot Pro India: Office 365 AI Integration & Best Value Routes",
    seoKeywords: ["Microsoft Copilot Pro price India", "Copilot Pro discount coupon", "Copilot Pro Office 365"],
    faqs: [
      {
        question: "What is the cost of Microsoft Copilot Pro in India?",
        answer: "Copilot Pro costs ₹2,000/month per user, unlocking GPT-4o powered AI directly inside Microsoft Word, Excel, PowerPoint, and Outlook."
      }
    ]
  },

  google_one: {
    slug: "google-one",
    aliases: ["google-drive"],
    catchyH1: "Google One India Storage Plans 2026: 100GB to 2TB Pricing & Family Sharing Secrets",
    seoKeywords: [
      "Google One storage save money trick",
      "Google One 100GB ₹130 plan review",
      "Google One 2TB annual discount",
      "Google One family sharing 5 members"
    ],
    faqs: [
      {
        question: "How much does Google One cloud storage cost in India?",
        answer: "Basic 100GB costs ₹130/month (₹1,300/year), Standard 200GB costs ₹210/month (₹2,100/year), and Premium 2TB costs ₹650/month (₹6,500/year)."
      },
      {
        question: "Can I share 1 Google One subscription with family?",
        answer: "Yes, any Google One plan can be shared with up to 5 additional family members without sharing personal photos or files. Each member gets private storage from the shared pool."
      }
    ]
  },

  microsoft_365: {
    slug: "microsoft-365",
    aliases: ["office-365", "m365"],
    catchyH1: "Microsoft 365 Family Plan Split: Get 1TB OneDrive & Office for ₹1,033/Year",
    seoKeywords: [
      "Microsoft 365 save money family split",
      "Office 365 student free university account",
      "Microsoft 365 Personal vs Family price"
    ],
    faqs: [
      {
        question: "What is the cheapest way to buy Microsoft 365 in India?",
        answer: "The Family Plan split: buy Microsoft 365 Family for ₹6,199/year and share it with 5 friends or family members. Each person gets a completely private 1TB OneDrive storage pool plus Word, Excel, and PowerPoint for just ₹1,033 per year!"
      }
    ]
  },

  icloud: {
    slug: "apple-icloud",
    aliases: ["icloud", "icloud-plus"],
    catchyH1: "Apple iCloud+ India Plans 2026: 50GB to 2TB Pricing & Apple One Family Savings",
    seoKeywords: ["iCloud storage price India", "iCloud 50GB ₹75 plan", "iCloud family sharing 2TB"],
    faqs: [
      {
        question: "How much does Apple iCloud+ storage cost in India?",
        answer: "50GB is ₹75/month, 200GB is ₹219/month, and 2TB is ₹749/month. All plans include Private Relay, Hide My Email, and custom email domains."
      }
    ]
  },

  xbox_game_pass: {
    slug: "xbox-game-pass",
    aliases: ["game-pass", "pc-game-pass"],
    catchyH1: "Xbox PC Game Pass India: 400+ Games, EA Play Included & ₹349/mo Best Value",
    seoKeywords: [
      "Xbox Game Pass save money India",
      "PC Game Pass ₹349 monthly details",
      "Xbox Game Pass Ultimate cloud gaming"
    ],
    faqs: [
      {
        question: "What games are included with PC Game Pass in India?",
        answer: "PC Game Pass (₹349/month) includes 400+ high-end PC games, day-one releases from Xbox Game Studios and Bethesda, plus complete access to the entire EA Play library at no extra cost."
      }
    ]
  },

  ps_plus: {
    slug: "playstation-plus",
    aliases: ["ps-plus", "playstation"],
    catchyH1: "PlayStation Plus India 2026: Essential, Extra & Deluxe Annual Discount Hacks",
    seoKeywords: [
      "PlayStation Plus save money annual sale",
      "PS Plus Deluxe price India 2026",
      "PS Plus Days of Play 25% discount"
    ],
    faqs: [
      {
        question: "When does Sony offer discounts on PS Plus subscriptions?",
        answer: "Sony PlayStation offers 20% to 30% discounts on 12-month memberships during the annual Days of Play sale (June) and Black Friday (November)."
      }
    ]
  },

  cultfit: {
    slug: "cult-fit",
    aliases: ["cultfit", "cultpass"],
    catchyH1: "Cult.fit Cultpass Offers 2026: Elite vs Pro Gym Pricing & ₹1,500 Off Vouchers",
    seoKeywords: ["Cult fit promo code today", "Cultpass Elite discount voucher", "Cult fit corporate discount"],
    faqs: [
      {
        question: "How do I get discounts on Cult.fit gym memberships?",
        answer: "Use corporate tie-ups (saves up to 25%) or purchase Cult.fit vouchers through Gyftr/Amazon Pay for an instant 10% to 15% cashback on Cultpass Elite and Pro memberships."
      }
    ]
  },

  headspace: {
    slug: "headspace",
    aliases: ["headspace-meditation"],
    catchyH1: "Headspace India Plans 2026: 85% Student Discount & Mental Wellness Hacks",
    seoKeywords: ["Headspace student discount 85% off", "Headspace promo code India", "Headspace annual price"],
    faqs: [
      {
        question: "Does Headspace offer a student discount in India?",
        answer: "Yes, verified college students get Headspace for over 80% off via SheerID verification on headspace.com/student."
      }
    ]
  },

  timesprime: {
    slug: "times-prime",
    aliases: ["timesprime", "times-pass"],
    catchyH1: "Times Prime Super Pass 2026: ₹1,199 Pass with Hotstar, SonyLIV, YouTube & Swiggy One",
    seoKeywords: [
      "Times Prime coupon code 2026",
      "Times Prime free subscriptions list",
      "Times Prime save money combo pass",
      "Times Prime ₹1199 offer details"
    ],
    faqs: [
      {
        question: "Which subscriptions are included inside Times Prime?",
        answer: "Times Prime (₹1,199/year) includes Disney+ Hotstar (6 months), SonyLIV Premium (6 months), YouTube Premium (2 months), Swiggy One food delivery perks, and 15+ shopping vouchers worth over ₹3,600."
      }
    ]
  },

  tataplay_binge: {
    slug: "tata-play-binge",
    aliases: ["tataplay-binge", "tata-sky-binge"],
    catchyH1: "Tata Play Binge Plans 2026: 30+ OTT Apps (Hotstar, ZEE5, SonyLIV) in 1 Subscription",
    seoKeywords: [
      "Tata Play Binge 30 OTT apps list",
      "Tata Play Binge Mega pack price",
      "Tata Play Binge save money combo"
    ],
    faqs: [
      {
        question: "What is Tata Play Binge?",
        answer: "Tata Play Binge is an all-in-one aggregation service allowing you to access Disney+ Hotstar, SonyLIV, ZEE5, Lionsgate Play, and 25+ OTT apps through a single unified app starting at ₹299/month."
      }
    ]
  }
};

/**
 * Helper to find catalog item + SEO metadata by slug or alias
 */
export async function getSubscriptionBySlug(slug) {
  if (!slug) return null;
  const cleanSlug = slug.toLowerCase().trim();

  // Find SEO config
  const seoEntry = Object.entries(SUBSCRIPTIONS_SEO_MAP).find(
    ([id, meta]) => meta.slug === cleanSlug || meta.aliases.includes(cleanSlug) || id === cleanSlug
  );

  const matchedId = seoEntry ? seoEntry[0] : cleanSlug;
  let catalogItem = INDIA_SUBSCRIPTIONS_CATALOG.find(
    sub => sub.id === matchedId || sub.id === cleanSlug
  );

  // Check Redis for on-demand discovered brands if not in static catalog
  if (!catalogItem && redisClient) {
    try {
      const raw = await redisClient.get(`ondemand_sub_${cleanSlug}`);
      if (raw) {
        catalogItem = typeof raw === "string" ? JSON.parse(raw) : raw;
      }
    } catch {}
  }

  if (!catalogItem) return null;

  const seoData = seoEntry ? seoEntry[1] : (catalogItem.seo || {
    slug: catalogItem.id,
    catchyH1: `${catalogItem.name} Subscription Plans 2026: Pricing, Discounts & Free Claim Guide`,
    seoKeywords: [`${catalogItem.name} plans 2026`, `${catalogItem.name} save money`],
    faqs: [
      {
        question: `How to get ${catalogItem.name} at a discount in India?`,
        answer: `Check our verified 4-Level Savings Blueprint on this page to claim promo codes, telecom bundle perks, and gift card discounts.`
      }
    ]
  });

  return {
    ...catalogItem,
    seo: seoData
  };
}

/**
 * Helper to get all slugs for static site generation / sitemap
 */
export function getAllSubscriptionSlugs() {
  return INDIA_SUBSCRIPTIONS_CATALOG.map(sub => {
    const seo = SUBSCRIPTIONS_SEO_MAP[sub.id];
    return seo?.slug || sub.id;
  });
}
