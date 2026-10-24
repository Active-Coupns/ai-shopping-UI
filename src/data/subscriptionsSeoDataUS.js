import { US_SUBSCRIPTIONS_CATALOG } from "./subscriptionsCatalogUS";
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
 * for all 25 United States (US) Subscription Brands.
 */
export const SUBSCRIPTIONS_SEO_MAP_US = {
  netflix_us: {
    slug: "netflix-us",
    aliases: ["netflix", "netflix-usa"],
    catchyH1: "Netflix US Plans 2026: Pricing, 4K Screens & The Legal $0 Free T-Mobile Trick",
    seoKeywords: [
      "Netflix US free T-Mobile on us",
      "Netflix save money discount subscription US",
      "Netflix 4K plan price USA 2026",
      "Netflix standard with ads cost",
      "Netflix family plan price split US",
      "Netflix working promo code 2026"
    ],
    faqs: [
      {
        question: "How can I get Netflix for $0 free in the United States?",
        answer: "T-Mobile customers on Go5G Next and Go5G Plus plans get 'Netflix on Us' at $0 complimentary cost. You can also get Netflix bundled with Max on Verizon myPlan for just $10/month, saving 41%."
      },
      {
        question: "What is the difference between Netflix Standard with Ads and Ad-Free in the US?",
        answer: "Standard with Ads ($6.99/mo) provides 1080p Full HD on 2 simultaneous screens with approximately 4-5 minutes of ads per hour. Standard Ad-Free ($15.49/mo) removes all commercials and adds 30 offline download slots."
      },
      {
        question: "How much is Netflix Premium 4K in the US in 2026?",
        answer: "Netflix Premium is $22.99/month in the US. It unlocks 4 simultaneous screens, 4K Ultra HD resolution, Dolby Vision HDR, and Spatial Audio with Dolby Atmos."
      },
      {
        question: "Can I get a discount on Netflix gift cards?",
        answer: "Yes, Target Circle Card holders get an automatic 5% discount on Netflix digital gift cards, while Costco periodically offers 10% off multipacks during member sales events."
      }
    ]
  },

  max_us: {
    slug: "max-hbo-us",
    aliases: ["max", "hbo-max", "hbo"],
    catchyH1: "Max (HBO) Subscription Plans 2026: Pricing, House of the Dragon & 43% Bundle Hack",
    seoKeywords: [
      "Max HBO free with AT&T Cricket",
      "Max save money discount subscription",
      "Disney Hulu Max bundle $16.99 price",
      "Max Ultimate 4K annual cost",
      "How to watch House of the Dragon cheapest"
    ],
    faqs: [
      {
        question: "What is the cheapest way to subscribe to Max in the US?",
        answer: "Instead of paying $9.99/month for Max alone, buy the Disney+, Hulu & Max Mega Bundle for $16.99/month. This gives you all 3 premium streaming platforms for just $7 more (saving 43% vs buying separately)."
      },
      {
        question: "Can I get Max for free with my cell phone plan?",
        answer: "Cricket Wireless includes Max with Ads for $0 free on its top-tier $60/month unlimited plan. Select legacy AT&T Unlimited Elite customers also maintain complimentary Max access."
      },
      {
        question: "Does Max offer an annual discount in the US?",
        answer: "Yes, prepaying Max annually ($99.99/yr for With Ads or $149.99/yr for Ad-Free) saves over 16% compared to paying month-to-month."
      },
      {
        question: "Which Max plan includes 4K HDR and Dolby Atmos?",
        answer: "Only the Max Ultimate plan ($20.99/month or $209.99/year) supports 4K Ultra HD, Dolby Vision, Dolby Atmos sound, and 4 concurrent screens."
      }
    ]
  },

  disney_hulu_max_bundle: {
    slug: "disney-hulu-max-bundle",
    aliases: ["trio-bundle", "disney-max-hulu", "mega-bundle"],
    catchyH1: "Disney+, Hulu & Max Mega Bundle: Save 43% ($155/Year) on America's Top 3 Streamers",
    seoKeywords: [
      "Disney Hulu Max bundle discount 2026",
      "Disney Hulu Max $16.99 trio price",
      "Cheapest way to get Disney Hulu and HBO",
      "Disney Hulu Max ad free cost",
      "Disney bundle promo code 2026"
    ],
    faqs: [
      {
        question: "How much do I save with the Disney+, Hulu & Max bundle?",
        answer: "Purchased separately, the ad-supported tiers cost $29.97/month ($9.99 each). The Mega Bundle costs only $16.99/month, saving you $12.98 every month or $155.76 per year (a 43% discount)."
      },
      {
        question: "Is there an ad-free version of the Disney/Hulu/Max bundle?",
        answer: "Yes! The Ad-Free Mega Bundle costs $29.99/month and unlocks commercial-free viewing on Disney+, Hulu, and Max, including offline downloads."
      },
      {
        question: "Can I keep my existing watch history when bundling?",
        answer: "Yes. When subscribing to the bundle using your existing email address, your profiles, watch history, and playlists on Disney+, Hulu, and Max are seamlessly linked."
      },
      {
        question: "Does Verizon offer a discount on this mega bundle?",
        answer: "Verizon myPlan users can combine their $10/mo Disney Bundle perk with the $10/mo Netflix & Max perk to get an even larger multi-streamer discount on their carrier bill."
      }
    ]
  },

  disney_us: {
    slug: "disney-plus-us",
    aliases: ["disney-plus", "disney-us"],
    catchyH1: "Disney+ US Plans 2026: Pricing, 4K Marvel & Free Claim via Spectrum & Verizon",
    seoKeywords: [
      "Disney plus free with Spectrum TV",
      "Disney plus save money discount subscription US",
      "Disney+ basic vs premium 4K price",
      "Verizon myPlan Disney bundle claim",
      "Disney plus coupon code 2026"
    ],
    faqs: [
      {
        question: "How do I get Disney+ for $0 free through Spectrum?",
        answer: "All Spectrum TV Select cable customers receive Disney+ Basic (with Ads) for $0 free. Log in to your Spectrum account, activate the streaming perk, and create your Disney+ credentials."
      },
      {
        question: "What is the difference between Disney+ Basic and Premium?",
        answer: "Disney+ Basic ($9.99/mo) includes ads and does not allow downloads. Disney+ Premium ($15.99/mo or $159.99/yr) is 100% ad-free, unlocks 4K Ultra HD with IMAX Enhanced, Dolby Atmos, and allows unlimited downloads on up to 10 devices."
      },
      {
        question: "Does Disney+ offer an annual discount in America?",
        answer: "Yes, Disney+ Premium Annual ($159.99/yr) gives you 12 months of service for the price of 10 months, saving you $31.89 per year."
      },
      {
        question: "Can I share Disney+ with family outside my house?",
        answer: "Disney+ allows an 'Extra Member' add-on for $6.99/mo (with ads) or $9.99/mo (ad-free) to legally share your account with someone outside your household."
      }
    ]
  },

  hulu_us: {
    slug: "hulu-us",
    aliases: ["hulu", "hulu-streaming"],
    catchyH1: "Hulu US Plans 2026: The $1.99 Student Trick, Live TV & Secret Black Friday Deals",
    seoKeywords: [
      "Hulu student discount $1.99 Spotify",
      "Hulu save money discount subscription US",
      "Hulu free with T-Mobile Go5G",
      "Hulu with ads vs no ads price 2026",
      "Hulu live tv channel guide cost"
    ],
    faqs: [
      {
        question: "How do students get Hulu for free or $1.99 in the US?",
        answer: "College students who subscribe to Spotify Premium Student ($5.99/mo) get Hulu (with ads) included for $0 100% free! Alternatively, students can get Hulu standalone for just $1.99/mo through UNiDAYS/SheerID verification."
      },
      {
        question: "How can T-Mobile customers get Hulu for $0 free?",
        answer: "T-Mobile Go5G Next plan subscribers receive Hulu (With Ads) included at no additional charge as part of their 'Entertainment on Us' carrier perks."
      },
      {
        question: "What is the Black Friday Hulu promotion?",
        answer: "Every year during Black Friday and Cyber Monday, Hulu offers its With Ads tier for $0.99/mo or $1.99/mo for an entire 12-month period. This is the single biggest streaming deal in America."
      },
      {
        question: "What does Hulu + Live TV include?",
        answer: "Hulu + Live TV ($82.99/mo) replaces cable TV with 95+ live broadcast channels (ABC, CBS, FOX, NBC, ESPN), plus full access to Disney+, Hulu on-demand, and ESPN+ included in the price."
      }
    ]
  },

  prime_us: {
    slug: "amazon-prime-video-us",
    aliases: ["prime-video-us", "amazon-prime-us"],
    catchyH1: "Amazon Prime US 2026: 50% Student & EBT Discounts, Free Delivery & Video Savings",
    seoKeywords: [
      "Amazon Prime 50% discount EBT Medicaid",
      "Prime Video save money discount subscription US",
      "Prime student 6 months free trial",
      "Amazon Prime standalone video plan price",
      "Thursday Night Football streaming cost"
    ],
    faqs: [
      {
        question: "How do I get Amazon Prime for 50% off ($6.99/mo) in the US?",
        answer: "Recipients of qualifying government assistance (including SNAP EBT, Medicaid, WIC, and SSI) qualify for 'Prime Access' at $6.99/month (over 50% off the standard $14.99/mo fee)."
      },
      {
        question: "What are the perks for college students on Amazon Prime?",
        answer: "College students get a 6-month $0 free trial of Prime Student, followed by a discounted rate of just $7.49/month or $69/year (50% off)."
      },
      {
        question: "Can I subscribe to only Prime Video without full Amazon shopping Prime?",
        answer: "Yes, Amazon offers a standalone Prime Video plan for $8.99/month. However, for $11.58/mo (billed as $139/year), full Prime gives you free 1-day delivery, Amazon Music, and Prime Gaming."
      },
      {
        question: "Does Prime Video have ads now in America?",
        answer: "Yes, Prime Video includes limited ads by default. You can remove ads for an optional $2.99/month add-on fee."
      }
    ]
  },

  apple_tv_us: {
    slug: "apple-tv-plus-us",
    aliases: ["apple-tv-plus", "apple-tv-us"],
    catchyH1: "Apple TV+ US Plans 2026: 4K Ted Lasso, T-Mobile $0 Free Perk & Apple One Combos",
    seoKeywords: [
      "Apple TV plus free with T-Mobile",
      "Apple TV+ save money discount subscription US",
      "Apple TV plus free trial Best Buy",
      "Apple TV+ family sharing 6 screens",
      "Apple One bundle savings 2026"
    ],
    faqs: [
      {
        question: "How do I get Apple TV+ for $0 free with T-Mobile?",
        answer: "Customers on T-Mobile Go5G Plus and Go5G Next plans receive Apple TV+ for $0 complimentary monthly. Redeem it through your T-Mobile account dashboard."
      },
      {
        question: "Can I get Apple TV+ for free when buying new devices?",
        answer: "Yes, purchasing any eligible new iPhone, iPad, Mac, or Apple TV device comes with 3 months of Apple TV+ for $0 free."
      },
      {
        question: "How many family members can share one Apple TV+ subscription?",
        answer: "Up to 6 family members can stream Apple TV+ simultaneously on their own personal Apple ID accounts using Apple Family Sharing at no additional cost."
      },
      {
        question: "Does Apple TV+ have commercial breaks?",
        answer: "No! Apple TV+ is 100% ad-free on all movies and original series, streaming in pristine 4K Ultra HD with Dolby Vision and Dolby Atmos."
      }
    ]
  },

  paramount_us: {
    slug: "paramount-plus-us",
    aliases: ["paramount-plus", "paramount-us"],
    catchyH1: "Paramount+ US Plans 2026: Free with Walmart+, UEFA Champions League & Showtime",
    seoKeywords: [
      "Paramount plus free with Walmart plus",
      "Paramount+ save money discount subscription US",
      "Paramount plus student discount 25% off",
      "Watch UEFA Champions League cheapest in USA",
      "Paramount plus with Showtime annual deal"
    ],
    faqs: [
      {
        question: "How do I get Paramount+ for $0 free with Walmart+?",
        answer: "Every Walmart+ membership ($98/yr or $12.95/mo) includes Paramount+ Essential for $0 free (a $95.88/year value). Activate it under the 'Member Benefits' tab in your Walmart app."
      },
      {
        question: "What is the student discount on Paramount+ in America?",
        answer: "Verified college students receive an ongoing 25% discount on Paramount+ Essential, bringing the price down to $5.99/month."
      },
      {
        question: "Can I watch live NFL games on Paramount+?",
        answer: "Yes! Both the Essential plan ($7.99/mo) and Paramount+ with Showtime ($12.99/mo) include live NFL on CBS broadcasts every Sunday during football season."
      },
      {
        question: "How do I watch UEFA Champions League soccer on Paramount+?",
        answer: "Paramount+ is the exclusive English-language home of all UEFA Champions League, Europa League, and Serie A matches in the United States."
      }
    ]
  },

  peacock_us: {
    slug: "peacock-tv-us",
    aliases: ["peacock", "peacock-us"],
    catchyH1: "Peacock US Plans 2026: Free with Instacart+, $1.99 Student Deal & Premier League",
    seoKeywords: [
      "Peacock free with Instacart plus",
      "Peacock save money discount subscription US",
      "Peacock student deal $1.99 month",
      "Watch Premier League cheapest in USA",
      "Peacock WWE WrestleMania streaming price"
    ],
    faqs: [
      {
        question: "How do I get Peacock Premium for $0 free through Instacart+?",
        answer: "Instacart+ annual members ($99/yr) receive Peacock Premium (with ads) for $0 free included with their grocery pass (a $95.88/year value). Link your accounts on the Instacart perks page."
      },
      {
        question: "What is the Peacock $1.99 student, military, and teacher offer?",
        answer: "Verified college students, military personnel, first responders, and teachers can get Peacock Premium for just $1.99/month for 12 months through SheerID verification."
      },
      {
        question: "How do I stream Premier League soccer on Peacock in the US?",
        answer: "Peacock streams over 175 live Premier League matches each season that are not broadcast on USA Network, available on both the $7.99/mo and $13.99/mo plans."
      },
      {
        question: "Are WWE pay-per-views included on Peacock?",
        answer: "Yes! WWE WrestleMania, Royal Rumble, SummerSlam, and all premium live events are included on Peacock with no extra pay-per-view fees."
      }
    ]
  },

  walmart_plus: {
    slug: "walmart-plus-us",
    aliases: ["walmart-plus", "walmart-membership"],
    catchyH1: "Walmart+ Membership 2026: Free Grocery Delivery, Free Paramount+ & Amex Credit",
    seoKeywords: [
      "Walmart plus free with Amex Platinum",
      "Walmart+ save money discounted subscription",
      "Walmart plus free Paramount plus claim",
      "Walmart+ gas discount 10 cents gallon",
      "Walmart+ annual membership savings"
    ],
    faqs: [
      {
        question: "How can I get Walmart+ for $0 free with American Express?",
        answer: "The Platinum Card from American Express provides up to $12.95 monthly statement credits for Walmart+, covering the full monthly cost ($155 annual value)."
      },
      {
        question: "Does Walmart+ include Paramount+ for free?",
        answer: "Yes, Walmart+ includes Paramount+ Essential ($7.99/mo value) at no extra charge, giving you access to NFL on CBS, Champions League soccer, and hit series like Tulsa King."
      },
      {
        question: "How much does Walmart+ save on gas and delivery?",
        answer: "Members save up to 10¢ per gallon at 13,000+ Exxon, Mobil, Walmart, and Murphy fuel stations, plus get free same-day grocery delivery on orders over $35."
      },
      {
        question: "Is Walmart+ better than Amazon Prime?",
        answer: "At $98/year (vs $139 for Prime), Walmart+ is $41 cheaper, includes free fresh grocery delivery with no upcharges, and bundles free Paramount+ streaming."
      }
    ]
  },

  instacart_plus: {
    slug: "instacart-plus-us",
    aliases: ["instacart-plus", "instacart-membership"],
    catchyH1: "Instacart+ 2026: $0 Delivery on Costco & Free Peacock Premium Streaming Pass",
    seoKeywords: [
      "Instacart plus free Peacock claim",
      "Instacart+ save money discount subscription",
      "Instacart plus Chase Sapphire credit",
      "Instacart+ free Costco delivery",
      "Instacart plus promo code 2026"
    ],
    faqs: [
      {
        question: "How do I claim free Peacock Premium through Instacart+?",
        answer: "Annual Instacart+ subscribers ($99/year) can link their Peacock account directly through the Instacart app settings to activate Peacock Premium for $0/month."
      },
      {
        question: "Can I use Instacart+ at Costco without a Costco membership?",
        answer: "Yes! Instacart allows you to order from Costco without an executive membership, and Instacart+ waives the delivery fees on orders over $35."
      },
      {
        question: "Which credit cards offer free Instacart+ statement credits?",
        answer: "Chase Sapphire Reserve and select Chase credit cards offer complimentary statement credits and quarterly grocery credits on Instacart."
      },
      {
        question: "How much does Instacart+ save per order?",
        answer: "Members save an average of $7-$10 per order through waived delivery fees and a 5% credit back on eligible pickup orders."
      }
    ]
  },

  apple_one_us: {
    slug: "apple-one-us",
    aliases: ["apple-one", "apple-one-bundle"],
    catchyH1: "Apple One US Plans 2026: Apple Music, TV+, Arcade & iCloud Storage Savings",
    seoKeywords: [
      "Apple One bundle savings calculator 2026",
      "Apple One family plan split 6 people",
      "Apple One individual vs family price",
      "How to save money on Apple Music and iCloud",
      "Apple One premier 2TB cloud review"
    ],
    faqs: [
      {
        question: "How much money does Apple One save compared to separate services?",
        answer: "The Individual plan ($19.95/mo) saves $8.91/month, the Family plan ($25.95/mo) saves $12.00/month, and the Premier plan ($37.95/mo) saves $29.00/month compared to paying for Music, TV+, Arcade, News+, Fitness+, and iCloud separately."
      },
      {
        question: "How does the Apple One Family plan work with 6 people?",
        answer: "Apple One Family allows up to 6 people to share Apple Music, Apple TV+, Apple Arcade, and 200GB of iCloud storage using their own private Apple IDs for just $4.32/person/month."
      },
      {
        question: "Do family members see each other's photos or files on Apple One?",
        answer: "No. Each family member retains 100% privacy. Their personal photos, files, music playlists, and browsing data are strictly isolated to their own Apple ID."
      },
      {
        question: "Can I upgrade cloud storage beyond what Apple One includes?",
        answer: "Yes, you can purchase additional iCloud+ storage (e.g. 50GB, 200GB, or 2TB) on top of your Apple One allocation if you require extra backup room."
      }
    ]
  },

  spotify_us: {
    slug: "spotify-us",
    aliases: ["spotify", "spotify-music-us"],
    catchyH1: "Spotify US Plans 2026: Family 6-Way Split ($3.33/Mo) & Free Hulu Student Hack",
    seoKeywords: [
      "Spotify student plan free Hulu hack",
      "Spotify save money discount subscription US",
      "Spotify family plan cost split 6 people",
      "Spotify duo vs individual price 2026",
      "Spotify free trial promo code 2026"
    ],
    faqs: [
      {
        question: "How do I get free Hulu with Spotify Premium?",
        answer: "College students who sign up for Spotify Premium Student ($5.99/month) get a full Hulu (With Ads) subscription included for $0 free through SheerID verification."
      },
      {
        question: "How does the Spotify Family Plan save 72% per person?",
        answer: "Spotify Family costs $19.99/month for 6 separate accounts. When split among 6 friends or family members, each person pays only $3.33/month instead of $11.99 for Individual."
      },
      {
        question: "Does Spotify Premium include free audiobooks in the US?",
        answer: "Yes, Spotify Premium Individual, Duo, and Family plan managers receive 15 hours of audiobook listening time each month from a catalog of over 250,000 titles."
      },
      {
        question: "Can two people share Spotify Duo if they live together?",
        answer: "Yes, Spotify Duo ($16.99/month) is designed for couples or roommates, providing two separate ad-free accounts for $8.50/person/month."
      }
    ]
  },

  chatgpt_us: {
    slug: "chatgpt-plus-us",
    aliases: ["chatgpt", "chatgpt-plus", "openai"],
    catchyH1: "ChatGPT Plus US 2026: GPT-4o, OpenAI o1 Reasoning & Small Business Tax Write-Offs",
    seoKeywords: [
      "ChatGPT plus tax deductible business expense US",
      "ChatGPT save money discount subscription",
      "ChatGPT plus vs free tier difference 2026",
      "OpenAI o1 reasoning model price",
      "ChatGPT team plan vs plus cost"
    ],
    faqs: [
      {
        question: "Can I write off ChatGPT Plus on my US taxes?",
        answer: "Yes! If you use ChatGPT Plus for your business, freelance work, software engineering, or consulting, it is 100% tax-deductible as professional software on IRS Schedule C."
      },
      {
        question: "What is included with ChatGPT Plus for $20/month?",
        answer: "ChatGPT Plus unlocks priority access to GPT-4o, advanced OpenAI o1 reasoning models, real-time Voice Mode, DALL-E 3 image generation, and custom GPT workspace tools."
      },
      {
        question: "Is there a free alternative to ChatGPT Plus?",
        answer: "Microsoft Copilot provides free basic web access to GPT-4o, while Claude.ai offers free daily queries to Claude 3.5 Sonnet."
      },
      {
        question: "How does the ChatGPT Team plan differ from Plus?",
        answer: "ChatGPT Team ($25/user/month billed annually) provides higher message limits, shared team GPTs, and guarantees that your data is never used to train OpenAI models."
      }
    ]
  },

  xbox_game_pass_us: {
    slug: "xbox-game-pass-us",
    aliases: ["game-pass", "xbox-game-pass", "game-pass-ultimate"],
    catchyH1: "Xbox Game Pass US 2026: 400+ Games, Free EA Play & 25% CDKeys Discount Trick",
    seoKeywords: [
      "Xbox game pass ultimate discount codes 2026",
      "Xbox game pass save money subscription US",
      "How to get Game Pass cheaper CDKeys",
      "PC Game Pass with free EA Play price",
      "Xbox game pass cloud gaming review"
    ],
    faqs: [
      {
        question: "How do I get Xbox Game Pass Ultimate cheaper than $19.99/mo?",
        answer: "Buy 3-month digital subscription codes on CDKeys or during Target and Costco member sales to pay approximately $13-$14/month instead of the full $19.99 retail price."
      },
      {
        question: "Does PC Game Pass include EA Play for free?",
        answer: "Yes! PC Game Pass ($11.99/month) includes the complete EA Play catalog (FIFA/EA Sports FC, Madden, Star Wars, Battlefield) at zero extra cost."
      },
      {
        question: "Can I play Xbox Game Pass on my Smart TV without a console?",
        answer: "Yes, Xbox Game Pass Ultimate includes Xbox Cloud Gaming, allowing you to stream top games directly on Samsung TVs, LG TVs, Amazon Fire TV sticks, and phones with a Bluetooth controller."
      },
      {
        question: "Are day-one major game releases included?",
        answer: "Yes! Major Xbox first-party releases like Call of Duty, Indiana Jones, Avowed, and Starfield launch on Xbox Game Pass Ultimate on day one at no additional charge."
      }
    ]
  }
};

/**
 * Helper to get US subscription by slug with Redis dynamic fallback
 */
export async function getUSSubscriptionBySlug(slug) {
  if (!slug) return null;
  const cleanSlug = slug.toLowerCase().trim();

  // Find in US SEO config
  const seoEntry = Object.entries(SUBSCRIPTIONS_SEO_MAP_US).find(
    ([id, meta]) => meta.slug === cleanSlug || meta.aliases?.includes(cleanSlug) || id === cleanSlug
  );

  const matchedId = seoEntry ? seoEntry[0] : cleanSlug;
  let catalogItem = US_SUBSCRIPTIONS_CATALOG.find(
    (sub) => sub.id === matchedId || sub.id === cleanSlug
  );

  // Check Redis for on-demand generated US brands
  if (!catalogItem && redisClient) {
    try {
      const raw = await redisClient.get(`ondemand_sub_us_${cleanSlug}`);
      if (raw) {
        catalogItem = typeof raw === "string" ? JSON.parse(raw) : raw;
      }
    } catch {}
  }

  if (!catalogItem) return null;

  const seoData = seoEntry ? seoEntry[1] : (catalogItem.seo || {
    slug: catalogItem.id,
    catchyH1: `${catalogItem.name} Subscription Plans 2026: Pricing, Discounts & Deals`,
    seoKeywords: [`${catalogItem.name} US plans`, `${catalogItem.name} discount`],
    faqs: [
      {
        question: `How to get ${catalogItem.name} at a discount in the US?`,
        answer: `Check our verified 4-Level Savings Blueprint on this page to claim telecom perks, gift card discounts, and bundle hacks.`
      }
    ]
  });

  return {
    ...catalogItem,
    seo: seoData
  };
}

export function getAllUSSubscriptionSlugs() {
  return US_SUBSCRIPTIONS_CATALOG.map((sub) => {
    const seo = SUBSCRIPTIONS_SEO_MAP_US[sub.id];
    return seo?.slug || sub.id;
  });
}
