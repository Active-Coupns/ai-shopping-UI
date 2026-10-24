import { AU_SUBSCRIPTIONS_CATALOG } from "./subscriptionsCatalogAU";
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
 * for all 25 Australian (AU) Subscription Brands.
 */
export const SUBSCRIPTIONS_SEO_MAP_AU = {
  stan_au: {
    slug: "stan-australia",
    aliases: ["stan", "stan-au", "stan-tv"],
    catchyH1: "Stan Australia Plans 2026: Pricing, Yellowstone 4K, Stan Sport & Optus SubHub Discounts",
    seoKeywords: [
      "Stan Australia plans pricing 2026",
      "Stan free trial 30 days Australia",
      "Stan Sport price add-on",
      "Stan Optus SubHub discount",
      "How to watch Yellowstone Australia",
      "Stan premium 4k cost"
    ],
    faqs: [
      {
        question: "How can I get Stan at a discount in Australia?",
        answer: "Optus customers can bundle Stan into Optus SubHub with 2 other eligible subscriptions to receive an automatic 10% discount on every billing cycle. Stan also offers a 30-day free trial for new Australian accounts."
      },
      {
        question: "Does Stan include Stan Sport in the base plan?",
        answer: "No, Stan Sport is an optional $15/month add-on that can be attached to any active Stan plan (Basic, Standard, or Premium), giving you live UEFA Champions League, Grand Slam tennis, and rugby."
      },
      {
        question: "What is the difference between Stan Standard and Premium 4K?",
        answer: "Standard ($16.00/mo) offers Full HD 1080p on 3 screens. Premium ($21.00/mo) unlocks 4K Ultra HD resolution, Dolby Atmos sound, and 4 concurrent streams."
      },
      {
        question: "Where can I watch Yellowstone in Australia?",
        answer: "Stan is the exclusive Australian streaming home for all seasons of Yellowstone and select Taylor Sheridan spin-offs."
      }
    ]
  },

  binge_au: {
    slug: "binge-australia",
    aliases: ["binge", "binge-au"],
    catchyH1: "BINGE Australia Plans 2026: Pricing, House of the Dragon, Telstra $10 Credit & Hubbl Deals",
    seoKeywords: [
      "BINGE Australia price 2026",
      "BINGE free with Telstra",
      "BINGE basic with ads vs standard",
      "How to watch House of the Dragon Australia",
      "BINGE promo code 2026",
      "BINGE Hubbl stack and save"
    ],
    faqs: [
      {
        question: "How can I get BINGE for free or discounted via Telstra?",
        answer: "Telstra wireless and home broadband customers can redeem Telstra Plus points for up to 12 months of BINGE bill credits (saving $10-$14/month)."
      },
      {
        question: "Does BINGE have all HBO shows in Australia?",
        answer: "Yes, BINGE holds the Australian streaming rights to the complete HBO library, including House of the Dragon, The Last of Us, Succession, The White Lotus, Euphoria, and Game of Thrones."
      },
      {
        question: "How much does BINGE cost in Australia?",
        answer: "Basic with Ads is $10.00/month (1 stream, HD 1080p), Standard Ad-Free is $18.00/month (2 streams, HD), and Premium is $22.00/month (4 streams, 4K Ultra HD)."
      },
      {
        question: "What is Hubbl Stack & Save for BINGE?",
        answer: "Stacking BINGE with Kayo Sports, Netflix, or LifeStyle on a single Hubbl account saves up to $15/month automatically on your entertainment bill."
      }
    ]
  },

  kayo_sports_au: {
    slug: "kayo-sports-australia",
    aliases: ["kayo", "kayo-au", "kayo-sports"],
    catchyH1: "Kayo Sports Australia Plans 2026: Pricing, AFL 4K, NRL, F1 & The $160 AFL Club Hack",
    seoKeywords: [
      "Kayo Sports price Australia 2026",
      "Kayo discount Telstra",
      "Kayo AFL club membership trick",
      "How to watch Formula 1 live Australia",
      "Kayo One vs Basic 4K",
      "Kayo Sports promo code"
    ],
    faqs: [
      {
        question: "What is the secret AFL club membership hack for Kayo Sports?",
        answer: "Purchasing a digital club membership through an AFL or NRL club (e.g. Richmond, Collingwood, Broncos) includes 12 months of Kayo Basic for roughly $240-$260/year, saving you over $160 compared to paying $35/month."
      },
      {
        question: "Does Telstra offer a discount on Kayo Sports?",
        answer: "Yes, Telstra postpaid customers can add Kayo to their monthly bill for an exclusive $10 to $12.50/month bill credit for the first 12 months."
      },
      {
        question: "What sports are streamed live on Kayo Sports in Australia?",
        answer: "Over 50 sports, including every match of the AFL and NRL live and ad-break free during play, all Australian international cricket and BBL, Formula 1, Supercars, NBA, and UFC Fight Nights."
      },
      {
        question: "How much does Kayo Sports cost in Australia?",
        answer: "Kayo One costs $25.00/month (1 HD stream). Kayo Basic costs $35.00/month (2 concurrent streams in 4K Ultra HD with SplitView multi-screening)."
      }
    ]
  },

  netflix_au: {
    slug: "netflix-australia",
    aliases: ["netflix-au", "netflix-aud"],
    catchyH1: "Netflix Australia Plans 2026: Pricing, 4K Screens & Optus SubHub 10% Stacking Hack",
    seoKeywords: [
      "Netflix Australia price 2026",
      "Netflix Optus SubHub 10% discount",
      "Netflix standard with ads cost Australia",
      "Netflix Australia cheap subscription",
      "How to get Netflix cheaper in Australia",
      "Netflix premium 4k price Australia"
    ],
    faqs: [
      {
        question: "How can I get 10% off Netflix every month in Australia?",
        answer: "Optus customers can link their existing Netflix account to Optus SubHub alongside 2 other subscriptions to get an automatic 10% monthly discount without losing viewing profiles."
      },
      {
        question: "How much does Netflix cost in Australia in 2026?",
        answer: "Standard with Ads is $7.99/mo (1080p, 2 streams), Standard Ad-Free is $18.99/mo (1080p, 2 streams), and Premium 4K is $25.99/mo (4K HDR, 4 streams, spatial audio)."
      },
      {
        question: "Can I earn Woolworths Everyday Rewards points on Netflix?",
        answer: "Yes, purchasing Netflix gift cards during Woolworths 20x Everyday Rewards points promotions gives you approximately 10% value back in supermarket groceries."
      },
      {
        question: "Does Netflix Australia charge for password sharing outside households?",
        answer: "Netflix Australia charges $7.99/month for an 'Extra Member' slot outside your primary household on Standard and Premium plans."
      }
    ]
  },

  disney_au: {
    slug: "disney-plus-australia",
    aliases: ["disney-plus-au", "disney-au"],
    catchyH1: "Disney+ Australia Plans 2026: Pricing, Bluey, Star FX & The OnePass $18.99 Bundle",
    seoKeywords: [
      "Disney plus Australia price 2026",
      "Disney plus OnePass bundle Australia",
      "Disney plus annual plan discount Australia",
      "How to watch Bluey Disney plus",
      "Disney plus student discount Australia"
    ],
    faqs: [
      {
        question: "What is the OnePass + Disney+ bundle in Australia?",
        answer: "Subscribers can bundle Disney+ Standard with a OnePass retail membership for just $18.99/month, saving 25% while getting free delivery and 5x Flybuys points across Kmart, Target, Catch, and Bunnings."
      },
      {
        question: "Does Disney+ Australia have Hulu and FX content?",
        answer: "Yes, in Australia, all Hulu and FX originals (such as Shōgun, The Bear, and Only Murders in the Building) stream under the Star brand tile inside Disney+."
      },
      {
        question: "How much do you save with the Disney+ Annual Plan in Australia?",
        answer: "The Standard Annual plan costs $139.99/year instead of $167.88 paid monthly, giving you 2 full months completely free."
      },
      {
        question: "Are all seasons of Bluey on Disney+ in Australia?",
        answer: "Yes, all seasons and special extended episodes of Bluey are available on Disney+ Australia in addition to ABC iview."
      }
    ]
  },

  prime_au: {
    slug: "amazon-prime-australia",
    aliases: ["prime-australia", "prime-video-au", "amazon-prime-au"],
    catchyH1: "Amazon Prime Australia 2026: Pricing, The Boys 4K, Free Expedited Delivery & Annual $79 Hack",
    seoKeywords: [
      "Amazon Prime Australia price 2026",
      "Amazon Prime annual plan $79",
      "Prime Video free trial Australia",
      "Amazon Prime student discount Australia",
      "Optus SubHub Prime discount"
    ],
    faqs: [
      {
        question: "How much does Amazon Prime cost in Australia?",
        answer: "Amazon Prime costs $9.99/month or $79.00/year (which works out to only $6.58/month, saving you over $40 every year)."
      },
      {
        question: "Can I get Amazon Prime cheaper through Optus SubHub?",
        answer: "Yes, adding Prime to Optus SubHub alongside 2 other services knocks 10% off the monthly rate, bringing it down to $8.99/month."
      },
      {
        question: "What is included with an Australian Amazon Prime membership?",
        answer: "Unlimited free fast delivery on millions of items, Prime Video in 4K UHD, Amazon Music Prime, Prime Gaming free PC titles, and Prime Reading eBooks."
      },
      {
        question: "Is there a free trial for Amazon Prime in Australia?",
        answer: "Yes, new Australian customers receive a full 30-day free trial."
      }
    ]
  },

  apple_tv_au: {
    slug: "apple-tv-plus-australia",
    aliases: ["apple-tv-au", "appletv-australia"],
    catchyH1: "Apple TV+ Australia 2026: Pricing, Ted Lasso 4K & JB Hi-Fi 3-Month Free Trick",
    seoKeywords: [
      "Apple TV plus Australia price 2026",
      "Apple TV plus free trial Australia",
      "Apple TV JB Hi-Fi perks code",
      "Apple One bundle Australia cost",
      "Ted Lasso Slow Horses streaming Australia"
    ],
    faqs: [
      {
        question: "How to get 3 months of Apple TV+ completely free in Australia?",
        answer: "JB Hi-Fi Perks members frequently receive 3-month free trial vouchers for Apple TV+ without hardware purchases. Buying any new Apple device also unlocks 3 free months."
      },
      {
        question: "How much does Apple TV+ cost monthly in Australia?",
        answer: "Apple TV+ costs $12.99/month in Australia and supports 4K Dolby Vision, Dolby Atmos, and Family Sharing for up to 6 family members."
      },
      {
        question: "Is Apple TV+ included in the Australian Apple One bundle?",
        answer: "Yes, Apple One Individual ($24.95/mo) bundles Apple TV+, Apple Music, Apple Arcade, and 50GB iCloud storage, saving $13/month."
      },
      {
        question: "Can I watch Apple TV+ on smart TVs and Android devices?",
        answer: "Yes, the Apple TV app is available on Samsung, LG, Sony, Roku, Fire TV, PlayStation, Xbox, and via web browser at tv.apple.com."
      }
    ]
  },

  paramount_au: {
    slug: "paramount-plus-australia",
    aliases: ["paramount-plus-au", "paramount-au"],
    catchyH1: "Paramount+ Australia Plans 2026: Pricing, A-League Live, Australian Survivor & Optus Deals",
    seoKeywords: [
      "Paramount plus Australia price 2026",
      "Paramount plus A-League football stream",
      "Australian Survivor Paramount plus",
      "Paramount plus Optus SubHub discount",
      "Paramount plus annual plan Australia"
    ],
    faqs: [
      {
        question: "Can I watch live A-League football on Paramount+ in Australia?",
        answer: "Yes, Paramount+ is the official Australian streaming broadcaster for all Isuzu UTE A-League Men and Ninja A-League Women matches live."
      },
      {
        question: "What are the Paramount+ pricing tiers in Australia?",
        answer: "Basic with Ads is $6.99/mo (1080p, 1 stream), Standard Ad-Free is $10.99/mo (1080p, 2 streams), and Premium 4K is $13.99/mo (4K HDR, Dolby Atmos, 4 streams)."
      },
      {
        question: "Can I get Paramount+ cheaper through Optus SubHub?",
        answer: "Yes, bundling Paramount+ into Optus SubHub with other subscriptions earns you an automatic 10% monthly discount."
      },
      {
        question: "How much does the Paramount+ Australian annual plan save?",
        answer: "The Standard Annual plan costs $89.99/year instead of $131.88 paid monthly, saving roughly $42 per year."
      }
    ]
  },

  optus_sport_au: {
    slug: "optus-sport-australia",
    aliases: ["optus-sport", "optus-sport-au"],
    catchyH1: "Optus Sport Australia 2026: Pricing, Premier League Live & The $6.99 Customer Hack",
    seoKeywords: [
      "Optus Sport price Australia 2026",
      "How to watch Premier League live Australia",
      "Optus Sport $6.99 special rate",
      "Optus Sport prepaid SIM trick",
      "Optus Sport annual pass discount"
    ],
    faqs: [
      {
        question: "How do Optus customers get Optus Sport for only $6.99/month?",
        answer: "Active Optus mobile, prepaid, or home NBN broadband customers qualify for the discounted $6.99/month rate instead of the retail $24.99/month (saving $18/month or $216/year)."
      },
      {
        question: "What competitions are streamed on Optus Sport?",
        answer: "All 380 matches of the English Premier League live, Spain's LALIGA EA Sports, UEFA Nations League, and the Women's Super League."
      },
      {
        question: "Can non-Optus customers subscribe to Optus Sport?",
        answer: "Yes, non-Optus customers can subscribe directly for $24.99/month or purchase a $229/year annual pass (saving $70/year)."
      },
      {
        question: "What is the cheapest way for non-Optus users to get the $6.99 rate?",
        answer: "Keeping a cheap active Optus Prepaid SIM card links your Optus ID, unlocking the $6.99/month rate even if you use another primary mobile carrier."
      }
    ]
  },

  foxtel_now_au: {
    slug: "foxtel-now-australia",
    aliases: ["foxtel-now", "foxtel-now-au"],
    catchyH1: "Foxtel Now Australia 2026: Pricing, Live Channels & Why BINGE + Kayo Saves $19/Month",
    seoKeywords: [
      "Foxtel Now price Australia 2026",
      "Foxtel Now vs BINGE Kayo comparison",
      "Foxtel Now free trial 10 days",
      "How to watch Fox Sports online Australia",
      "Foxtel Now Telstra package"
    ],
    faqs: [
      {
        question: "Why is switching to BINGE + Kayo Sports cheaper than Foxtel Now?",
        answer: "Instead of paying $54/month for Foxtel Now Essentials + Sport, getting BINGE ($10) + Kayo Sports ($25) gives you the exact same HBO and Fox Sports content for $35/month, saving $19 every single month."
      },
      {
        question: "What is included in the Foxtel Now Essentials pack?",
        answer: "Essentials costs $25/month and includes 32 live streaming channels including Fox Showcase, Fox8, BBC First, and Sky News Australia."
      },
      {
        question: "Is there a free trial for Foxtel Now?",
        answer: "Yes, Foxtel Now offers a 10-day free trial on the Essentials package for new subscribers."
      },
      {
        question: "Do I need a cable box or satellite dish for Foxtel Now?",
        answer: "No, Foxtel Now is 100% digital and streams over broadband internet to Smart TVs, consoles, mobile, and web."
      }
    ]
  },

  britbox_au: {
    slug: "britbox-australia",
    aliases: ["britbox-au"],
    catchyH1: "BritBox Australia 2026: Pricing, Line of Duty, Classic Doctor Who & Annual Deals",
    seoKeywords: [
      "BritBox Australia price 2026",
      "BritBox free trial Australia",
      "BritBox annual plan discount",
      "How to watch Line of Duty Australia",
      "BritBox Prime Video channels"
    ],
    faqs: [
      {
        question: "What British shows are streaming on BritBox in Australia?",
        answer: "Line of Duty, Death in Paradise, classic and modern Doctor Who, Vera, Midsomer Murders, Call the Midwife, All Creatures Great and Small, and Agatha Christie mysteries."
      },
      {
        question: "How much does BritBox cost in Australia?",
        answer: "BritBox is $9.99/month or $99.99/year (which provides 12 months for the price of 10)."
      },
      {
        question: "Can I get BritBox through Amazon Prime Video Channels in Australia?",
        answer: "Yes, BritBox can be added as an Amazon Prime Video Channel with a 7-day free trial and unified billing."
      },
      {
        question: "Can multiple people watch BritBox at the same time?",
        answer: "Yes, BritBox supports up to 4 concurrent HD streams on a single account."
      }
    ]
  },

  hayu_au: {
    slug: "hayu-australia",
    aliases: ["hayu-au", "hayu-tv"],
    catchyH1: "Hayu Australia 2026: Pricing, Real Housewives, Below Deck & 25% Off Annual Pass",
    seoKeywords: [
      "Hayu Australia cost 2026",
      "Hayu free trial Australia",
      "Hayu annual plan discount",
      "How to watch Real Housewives Australia",
      "Hayu promo code Australia"
    ],
    faqs: [
      {
        question: "When are new episodes of Real Housewives added to Hayu in Australia?",
        answer: "New episodes stream on Hayu on the exact same day they air on US television, commercial-free."
      },
      {
        question: "What is the cost of Hayu in Australia?",
        answer: "Hayu costs $6.99/month, $33.99 for 6 months, or $61.99/year (saving 25% on annual billing)."
      },
      {
        question: "Can I get Hayu cheaper through Optus SubHub?",
        answer: "Yes, adding Hayu to Optus SubHub alongside other subscriptions reduces your monthly rate by 10% to $6.29/month."
      },
      {
        question: "Can I download episodes to watch offline on Hayu Australia?",
        answer: "Yes, the Hayu iOS and Android apps allow unlimited offline episode downloads for travel and commuting."
      }
    ]
  },

  spotify_au: {
    slug: "spotify-australia",
    aliases: ["spotify-au", "spotify-aud"],
    catchyH1: "Spotify Australia Plans 2026: Pricing, Family Split & Woolworths 20x Points Hack",
    seoKeywords: [
      "Spotify Australia price 2026",
      "Spotify student discount Australia",
      "Spotify Woolworths gift card points",
      "Spotify family plan Australia cost",
      "Spotify premium free trial Australia"
    ],
    faqs: [
      {
        question: "How can I get Spotify Premium cheaper in Australia?",
        answer: "Verified Australian university and TAFE students pay only $6.99/month (50% off). Purchasing gift cards during Woolworths 20x Everyday Rewards points promotions also yields ~10% grocery rebates."
      },
      {
        question: "How much does Spotify Family cost in Australia?",
        answer: "Spotify Family is $23.99/month and allows up to 6 individual accounts living at the same address, dropping the cost to less than $4 per user."
      },
      {
        question: "Does Spotify Premium include audiobooks in Australia?",
        answer: "Yes, Spotify Premium individual subscribers receive 15 hours of complimentary audiobook listening time every month."
      },
      {
        question: "Can I redeem Telstra Plus points for Spotify?",
        answer: "Yes, Telstra customers can redeem Telstra Plus points for Spotify e-gift cards in the Telstra Rewards store."
      }
    ]
  },

  apple_one_au: {
    slug: "apple-one-australia",
    aliases: ["apple-one-au", "appleone-australia"],
    catchyH1: "Apple One Australia 2026: Pricing, Family Bundle & Woolworths 20x Points Hack",
    seoKeywords: [
      "Apple One Australia price 2026",
      "Apple One family bundle Australia",
      "Apple One premier iCloud Australia",
      "Is Apple One worth it in Australia",
      "Apple One free trial Australia"
    ],
    faqs: [
      {
        question: "How much does Apple One cost in Australia?",
        answer: "Individual is $24.95/month, Family is $31.95/month (up to 6 members with 200GB iCloud), and Premier is $44.95/month (adds Apple News+, Apple Fitness+, and 2TB iCloud)."
      },
      {
        question: "How much money does Apple One save compared to separate services?",
        answer: "The Individual plan saves $13.01/month ($156/year) and the Family plan saves $30.95/month ($371/year) compared to paying for Apple Music, Apple TV+, and iCloud separately."
      },
      {
        question: "Can I use Woolworths Everyday Rewards points for Apple One?",
        answer: "Yes, buying Apple Gift Cards during Woolworths 20x points promotions gives you huge rebate points while paying your Apple One subscription."
      },
      {
        question: "Do family members see each other's files on Apple One Family?",
        answer: "No, each family member uses their own private Apple ID, private iCloud storage partition, and personalized Apple Music playlists."
      }
    ]
  },

  youtube_premium_au: {
    slug: "youtube-premium-australia",
    aliases: ["yt-premium-au", "youtube-premium-au"],
    catchyH1: "YouTube Premium Australia 2026: Pricing, Family Sharing & Student 40% Off Guide",
    seoKeywords: [
      "YouTube Premium Australia price 2026",
      "YouTube Premium student Australia",
      "YouTube family plan Australia cost",
      "How to get YouTube Premium cheap Australia",
      "YouTube Music free with Premium"
    ],
    faqs: [
      {
        question: "How much does YouTube Premium cost in Australia?",
        answer: "Individual is $16.99/month, Student is $10.49/month, and the Family plan is $32.99/month for up to 5 family members."
      },
      {
        question: "Is YouTube Music included in YouTube Premium Australia?",
        answer: "Yes, YouTube Premium includes the complete ad-free YouTube Music streaming service at zero extra charge."
      },
      {
        question: "How does the YouTube Family plan work in Australia?",
        answer: "Up to 5 family members aged 13+ can share the plan with their own private Google accounts, eliminating ads on all smart TVs and mobile devices."
      },
      {
        question: "Do Australian students get a discount on YouTube Premium?",
        answer: "Yes, Australian university and TAFE students save 40% ($10.49/mo) with annual SheerID student verification."
      }
    ]
  },

  audible_au: {
    slug: "audible-australia",
    aliases: ["audible-au"],
    catchyH1: "Audible Australia Plans 2026: Pricing, Free Prime Credits & Best-Seller Hacks",
    seoKeywords: [
      "Audible Australia price 2026",
      "Audible free trial Amazon Prime Australia",
      "Audible plus vs premium plus Australia",
      "How to cancel Audible Australia and keep books",
      "Audible annual plan Australia"
    ],
    faqs: [
      {
        question: "Do Amazon Prime Australia members get extra free Audible credits?",
        answer: "Yes, Australian Prime members receive an exclusive 30-day free trial with 2 free audiobook credits instead of the standard 1 credit."
      },
      {
        question: "What is the difference between Audible Plus and Premium Plus in Australia?",
        answer: "Audible Plus ($11.95/mo) offers unlimited listening to thousands of select audiobooks and podcasts. Premium Plus ($16.45/mo) includes the Plus catalog PLUS 1 credit per month to keep any best-seller permanently."
      },
      {
        question: "Do I keep my audiobooks if I cancel Audible Australia?",
        answer: "Yes, any audiobook purchased with credits or cash remains in your permanent Audible library forever, even after cancelling."
      },
      {
        question: "How much does the Audible Australia Annual Plan cost?",
        answer: "The 12-credit annual plan costs $164.50/year upfront, bringing the price down to roughly $13.70 per audiobook."
      }
    ]
  },

  game_pass_au: {
    slug: "xbox-game-pass-australia",
    aliases: ["game-pass-au", "xbox-game-pass-au"],
    catchyH1: "Xbox Game Pass Ultimate Australia 2026: Pricing, Day-One Releases & Core Conversion Hacks",
    seoKeywords: [
      "Xbox Game Pass Ultimate Australia price 2026",
      "Game Pass PC Australia cost",
      "Telstra Xbox All Access Australia",
      "Xbox Core to Ultimate conversion ratio",
      "Call of Duty Black Ops 6 Game Pass Australia"
    ],
    faqs: [
      {
        question: "What is the Xbox Core to Ultimate conversion hack in Australia?",
        answer: "Stacking prepaid Xbox Game Pass Core memberships and converting to Ultimate gives a 3:2 value advantage, saving over 35% compared to paying monthly retail."
      },
      {
        question: "What is Telstra Xbox All Access in Australia?",
        answer: "Telstra customers can bundle an Xbox Series X or Series S console with 24 months of Game Pass Ultimate on a monthly payment plan ($34-$46/month) with zero upfront cost."
      },
      {
        question: "How much does PC Game Pass cost in Australia?",
        answer: "PC Game Pass costs $11.95/month and includes full access to PC titles, EA Play for PC, and day-one Xbox Game Studios releases."
      },
      {
        question: "Can I play Game Pass games without an Xbox console in Australia?",
        answer: "Yes, with Game Pass Ultimate, you can stream games directly to Samsung TVs, iPads, Android phones, and laptops via Xbox Cloud Gaming."
      }
    ]
  },

  ps_plus_au: {
    slug: "playstation-plus-australia",
    aliases: ["ps-plus-au", "psplus-australia"],
    catchyH1: "PlayStation Plus Australia 2026: Pricing, Essential vs Extra & Days of Play Discounts",
    seoKeywords: [
      "PlayStation Plus Australia price 2026",
      "PS Plus Extra game catalog Australia",
      "Days of Play sale PS Plus discount",
      "PlayStation Plus free games monthly Australia",
      "Coles Woolworths PS Store gift card discount"
    ],
    faqs: [
      {
        question: "How can I save on PlayStation Plus in Australia?",
        answer: "Buy PlayStation Store gift cards during 20x points promotions at Coles or Woolies, then subscribe during Sony's annual Days of Play (May-June) or Black Friday sales to save up to 35% total."
      },
      {
        question: "What is the difference between PS Plus Essential, Extra, and Deluxe in Australia?",
        answer: "Essential ($11.95/mo) gives online multiplayer and 3 monthly free games. Extra ($18.95/mo) adds 400+ PS4/PS5 games. Deluxe ($21.95/mo) includes PS1/PS2/PSP classic games and game trials."
      },
      {
        question: "Is PS Plus required for free-to-play games on PS5 in Australia?",
        answer: "No, games like Fortnite, Warzone, Apex Legends, and Rocket League do NOT require a PlayStation Plus membership to play online."
      },
      {
        question: "Does PS Plus Extra include Ubisoft games?",
        answer: "Yes, Ubisoft+ Classics is bundled into both PS Plus Extra and Deluxe in Australia at no extra cost."
      }
    ]
  },

  doordash_au: {
    slug: "doordash-dashpass-australia",
    aliases: ["dashpass-au", "doordash-au"],
    catchyH1: "DoorDash DashPass Australia 2026: Pricing, $0 Delivery & Annual Plan Savings",
    seoKeywords: [
      "DoorDash DashPass Australia cost 2026",
      "DoorDash free trial Australia",
      "DoorDash student discount Australia",
      "Guzman y Gomez free delivery DoorDash",
      "Cashrewards DoorDash cashback"
    ],
    faqs: [
      {
        question: "What are the benefits of DoorDash DashPass in Australia?",
        answer: "$0 delivery fees on restaurant orders over $20 and grocery orders over $35, reduced service fees, and 5% back in DoorDash credit on eligible pickup orders."
      },
      {
        question: "How much does DashPass cost in Australia?",
        answer: "DashPass is $9.99/month or $96.00/year (working out to $8.00/month, saving $24/year). Students pay only $4.99/month."
      },
      {
        question: "Can I earn cashback on DoorDash in Australia?",
        answer: "Yes, launching DoorDash via Cashrewards or ShopBack AU earns up to 5%-10% cash rebates on food orders."
      },
      {
        question: "Is there a free trial for DashPass in Australia?",
        answer: "Yes, new Australian accounts receive a 30-day free trial."
      }
    ]
  },

  uber_one_au: {
    slug: "uber-one-australia",
    aliases: ["uberone-au", "uber-eats-pass-au"],
    catchyH1: "Uber One Australia 2026: Pricing, 5% Off Rides & Velocity Frequent Flyer Hacks",
    seoKeywords: [
      "Uber One Australia price 2026",
      "Uber One free trial Australia",
      "Velocity Frequent Flyer Uber points",
      "Is Uber One worth it Australia",
      "Uber Eats $0 delivery fee pass"
    ],
    faqs: [
      {
        question: "What are the core perks of Uber One in Australia?",
        answer: "$0 delivery fee on eligible Uber Eats food orders over $20 and groceries over $40, up to 10% off orders, 5% off eligible Uber rides, and top-rated drivers."
      },
      {
        question: "How much does Uber One cost in Australia?",
        answer: "Uber One costs $9.99/month or $99.99/year (saving $20/year compared to monthly)."
      },
      {
        question: "Can I earn Virgin Australia Velocity points with Uber?",
        answer: "Yes, linking your Velocity Frequent Flyer account to Uber earns points on all eligible airport rides and Uber Eats orders."
      },
      {
        question: "Does Uber One give you credit if your delivery is late?",
        answer: "Yes, Uber One members receive a $5 Uber Cash credit if the Latest Arrival estimate is missed on eligible food orders."
      }
    ]
  },

  menulog_au: {
    slug: "menulog-australia",
    aliases: ["menulog-au"],
    catchyH1: "Menulog Australia 2026: Did Somebody Say Free Delivery? Vodafone Perks & Local Deals",
    seoKeywords: [
      "Menulog promo codes 2026 Australia",
      "Menulog free delivery deals",
      "Vodafone VeryMe Menulog voucher",
      "Cashrewards Menulog cashback",
      "Local Aussie takeaway delivery"
    ],
    faqs: [
      {
        question: "Does Menulog have a monthly subscription fee?",
        answer: "No, Menulog is completely free to use with zero subscription fee."
      },
      {
        question: "Can I get free food delivery vouchers from Australian telecom?",
        answer: "Vodafone mobile users frequently receive $5 to $10 off Menulog promo vouchers in the My Vodafone rewards lounge."
      },
      {
        question: "Can I earn cashback on Menulog orders?",
        answer: "Yes, Cashrewards and ShopBack AU offer regular 5% to 10% cashback rebates on Menulog takeaway orders."
      },
      {
        question: "What restaurants are on Menulog?",
        answer: "Menulog features thousands of local Australian fish & chip shops, pizzerias, Thai, Indian, KFC, Hungry Jack's, and Oporto."
      }
    ]
  },

  chatgpt_plus_au: {
    slug: "chatgpt-plus-australia",
    aliases: ["chatgpt-au", "chatgpt-plus-au"],
    catchyH1: "ChatGPT Plus Australia 2026: Pricing, GPT-4o, Advanced Voice & Zero-FX Payment Hacks",
    seoKeywords: [
      "ChatGPT Plus price Australia 2026",
      "ChatGPT Plus AUD conversion cost",
      "ChatGPT Plus free alternatives Australia",
      "GPT-4o Advanced Voice Australia",
      "Zero foreign fee debit card ChatGPT"
    ],
    faqs: [
      {
        question: "How much does ChatGPT Plus cost in Australian Dollars (AUD)?",
        answer: "ChatGPT Plus is billed at $20.00 USD/month, which converts to approximately $30.00 - $31.50 AUD depending on currency exchange rates."
      },
      {
        question: "How to avoid foreign exchange fees on ChatGPT in Australia?",
        answer: "Pay using an Australian 0% foreign transaction fee card (such as Macquarie Bank Debit or Bankwest Platinum) to avoid the typical 3% bank currency conversion surcharge."
      },
      {
        question: "What features are included in ChatGPT Plus?",
        answer: "Priority access to GPT-4o with 5x message limits, Advanced Voice Mode, interactive Canvas coding workspace, DALL-E 3 image generation, and custom GPTs."
      },
      {
        question: "Can I use GPT-4 for free in Australia without subscribing?",
        answer: "Yes, Microsoft Copilot on Windows 11 and Edge browser offers free access to GPT-4 and DALL-E 3 with no monthly charge."
      }
    ]
  },

  claude_pro_au: {
    slug: "claude-pro-australia",
    aliases: ["claude-au", "claude-pro-au"],
    catchyH1: "Claude Pro Australia 2026: Pricing, Claude 3.5 Sonnet, Artifacts & Developer Hacks",
    seoKeywords: [
      "Claude Pro price Australia 2026",
      "Claude 3.5 Sonnet coding benchmarks",
      "Claude Pro vs ChatGPT Plus Australia",
      "Claude Artifacts projects Australia",
      "Claude AI free web tier Australia"
    ],
    faqs: [
      {
        question: "How much does Claude Pro cost in Australia?",
        answer: "Claude Pro is billed at $20.00 USD/month (~$31.00 AUD). Using a 0% foreign transaction fee card saves the 3% currency surcharge."
      },
      {
        question: "Why do software engineers in Australia prefer Claude Pro over ChatGPT?",
        answer: "Claude 3.5 Sonnet consistently outperforms other models on software engineering benchmarks, complex multi-file React/Python generation, and real-time interactive Artifact rendering."
      },
      {
        question: "What is included with Claude Pro?",
        answer: "5x higher message usage limits, priority bandwidth during peak hours, Projects knowledge bases, and early access to new Anthropic models."
      },
      {
        question: "Is there a free version of Claude available in Australia?",
        answer: "Yes, Australians can access Claude 3.5 Sonnet on claude.ai for free with standard rate limits."
      }
    ]
  },

  microsoft_365_au: {
    slug: "microsoft-365-australia",
    aliases: ["m365-au", "office-365-australia"],
    catchyH1: "Microsoft 365 Australia 2026: Pricing, 1TB OneDrive & Australian Student $0 Free Trick",
    seoKeywords: [
      "Microsoft 365 Australia price 2026",
      "Office 365 free for Australian students",
      "Microsoft 365 family split Australia",
      "1TB OneDrive storage Australia",
      "JB Hi-Fi Microsoft 365 discount"
    ],
    faqs: [
      {
        question: "Can Australian university and TAFE students get Microsoft 365 for free?",
        answer: "Yes! Students and faculty at UNSW, Sydney Uni, Monash, Melbourne Uni, and most Australian institutions can access Microsoft 365 Education for $0 completely free with their school email."
      },
      {
        question: "How much does Microsoft 365 cost in Australia directly?",
        answer: "Personal (1 user, 1TB cloud) is $99.00/year or $10.00/month. Family (up to 6 users, 6TB cloud total) is $129.00/year or $13.00/month."
      },
      {
        question: "How much can you save by splitting Microsoft 365 Family?",
        answer: "Splitting the $129/year Family plan among 6 people brings the cost down to just $21.50 per person per year ($1.79/month) for full desktop apps and 1TB cloud storage."
      },
      {
        question: "Does each family member get their own 1TB OneDrive storage?",
        answer: "Yes, every member in a Family plan gets their own private 1TB OneDrive cloud storage partition that cannot be seen by other family members."
      }
    ]
  },

  google_one_au: {
    slug: "google-one-australia",
    aliases: ["google-one-au", "google-storage-au"],
    catchyH1: "Google One Australia Plans 2026: Pricing, 100GB to 2TB Storage & Gemini Advanced AI",
    seoKeywords: [
      "Google One Australia price 2026",
      "Google One 100GB cost Australia",
      "Google One annual plan discount Australia",
      "Google Photos storage full Australia",
      "Gemini Advanced Google One Australia"
    ],
    faqs: [
      {
        question: "How much does Google One storage cost in Australia?",
        answer: "100GB is $2.49/mo ($24.99/yr), 200GB is $4.49/mo ($43.99/yr), 2TB is $12.49/mo ($124.99/yr), and 2TB with Gemini Advanced AI is $32.99/mo."
      },
      {
        question: "Can I share my Google One storage with my family in Australia?",
        answer: "Yes, all Google One plans can be shared with up to 5 family members, with each person maintaining complete privacy over their photos and files."
      },
      {
        question: "How much do I save with annual billing on Google One?",
        answer: "Switching to annual billing saves approximately 17% across all storage tiers."
      },
      {
        question: "Do Google Pixel phone activations in Australia include free Google One?",
        answer: "Yes, purchasing new Google Pixel devices through Telstra or Optus often includes promotional trials ranging from 3 to 6 months of Google One or 1 year of Gemini Advanced."
      }
    ]
  }
};

/**
 * Single-brand resolver for Australia (AU).
 * Checks the static catalog first, then queries Upstash Redis for on-demand generated brands.
 */
export async function getAUSubscriptionBySlug(slug) {
  if (!slug) return null;
  const cleanSlug = slug.toLowerCase().trim();

  const seoEntry = Object.entries(SUBSCRIPTIONS_SEO_MAP_AU).find(
    ([id, data]) => id === cleanSlug || data.slug === cleanSlug || (data.aliases && data.aliases.includes(cleanSlug))
  );

  const matchedId = seoEntry ? seoEntry[0] : cleanSlug;

  let catalogItem = AU_SUBSCRIPTIONS_CATALOG.find(
    (sub) => sub.id === matchedId || sub.id === cleanSlug
  );

  // Check Redis for on-demand generated Australian brands
  if (!catalogItem && redisClient) {
    try {
      const raw = await redisClient.get(`ondemand_sub_au_${cleanSlug}`);
      if (raw) {
        catalogItem = typeof raw === "string" ? JSON.parse(raw) : raw;
      }
    } catch {}
  }

  if (!catalogItem) return null;

  const seoData = seoEntry ? seoEntry[1] : (catalogItem.seo || {
    slug: catalogItem.id,
    catchyH1: `${catalogItem.name} Australia Subscription Plans 2026: Pricing, Discounts & Deals`,
    seoKeywords: [`${catalogItem.name} Australia plans`, `${catalogItem.name} discount`],
    faqs: [
      {
        question: `How to get ${catalogItem.name} at a discount in Australia?`,
        answer: `Check our verified 4-Level Savings Blueprint on this page to claim carrier perks from Optus/Telstra, gift card discounts, and bundle passes.`
      }
    ]
  });

  return {
    ...catalogItem,
    country: "AU",
    currencySymbol: "A$",
    seo: seoData
  };
}

export function getAllAUSubscriptionSlugs() {
  return AU_SUBSCRIPTIONS_CATALOG.map((sub) => {
    const seo = SUBSCRIPTIONS_SEO_MAP_AU[sub.id];
    return seo?.slug || sub.id;
  });
}
