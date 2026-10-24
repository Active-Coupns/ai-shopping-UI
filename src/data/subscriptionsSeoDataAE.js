// src/data/subscriptionsSeoDataAE.js
// High-Converting SEO Metadata, PAA FAQs, and Catchy Keywords
// for all 25 United Arab Emirates (UAE / AE 🇦🇪) Subscription Brands.

import { AE_SUBSCRIPTIONS_CATALOG } from "./subscriptionsCatalogAE";
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

export const SUBSCRIPTIONS_SEO_MAP_AE = {
  osn_plus_ae: {
    slug: "osn-plus-uae",
    aliases: ["osn", "osn-plus", "osn-uae", "osnplus"],
    catchyH1: "OSN+ UAE Plans 2026: Pricing, House of the Dragon, Etisalat & du Free Perks",
    seoKeywords: [
      "OSN Plus UAE price 2026",
      "How to watch House of the Dragon UAE",
      "OSN+ free with Etisalat",
      "OSN Plus du offer",
      "OSN Plus 4K premium plan",
      "HBO Max shows UAE OSN"
    ],
    faqs: [
      {
        question: "How can I get OSN+ for free in the UAE?",
        answer: "Etisalat Freedom post-paid mobile and e& Home Fibre internet packages frequently include OSN+ at AED 0 for 12 months. du Home Wireless Plus and Power Postpaid 300+ customers can also select OSN+ as their complimentary streaming benefit."
      },
      {
        question: "Where can I watch HBO and Paramount+ shows in the UAE?",
        answer: "OSN+ is the official exclusive Middle East streaming home for HBO originals (House of the Dragon, The Last of Us, Succession), Warner Bros cinema, and Paramount+ series."
      },
      {
        question: "What is the difference between OSN+ Standard and Premium 4K?",
        answer: "Standard (AED 49/mo) offers Full HD 1080p on 2 screens ad-free. Premium (AED 69/mo) unlocks 4K Ultra HD resolution, Dolby Atmos audio, and 4 simultaneous streams."
      },
      {
        question: "Can I subscribe to OSN+ with an annual discount?",
        answer: "Yes, the OSN+ Annual Standard plan costs AED 479/year, saving you over 18% compared to monthly billing."
      }
    ]
  },

  shahid_vip_ae: {
    slug: "shahid-vip-uae",
    aliases: ["shahid", "shahid-vip", "shahid-uae"],
    catchyH1: "Shahid VIP UAE Plans 2026: Pricing, Ramadan Exclusives, Arabic Cinema & Sports Pass",
    seoKeywords: [
      "Shahid VIP UAE subscription price 2026",
      "Shahid VIP free with Etisalat",
      "Shahid VIP Ramadan offer UAE",
      "Shahid VIP Sports plan price",
      "Shahid annual subscription discount UAE"
    ],
    faqs: [
      {
        question: "How much does Shahid VIP cost in the UAE?",
        answer: "Shahid VIP starts at AED 24.99/mo (ad-supported) and AED 39.99/mo for 100% ad-free viewing. The Shahid VIP + Sports tier (featuring Roshn Saudi League) is AED 69.99/mo."
      },
      {
        question: "Can I get Shahid VIP free through telecom in the UAE?",
        answer: "du Home Ultimate Fibre plans include Shahid VIP at AED 0 for the contract duration. Etisalat post-paid subscribers can get 50% off their first 3 months using carrier billing via My Etisalat app."
      },
      {
        question: "Does Shahid VIP offer an annual discount?",
        answer: "Yes, the annual Shahid VIP pass is AED 349.99/year, giving you 12 months for the price of approximately 8.5 months."
      },
      {
        question: "What live sports stream on Shahid VIP?",
        answer: "The Shahid VIP + Sports plan includes live coverage of the Roshn Saudi League (featuring Cristiano Ronaldo and Neymar), WWE, and combat sports events."
      }
    ]
  },

  tod_tv_ae: {
    slug: "tod-tv-uae",
    aliases: ["tod", "tod-tv", "bein-tod", "tod-uae"],
    catchyH1: "TOD UAE Plans 2026: Pricing, Premier League, Champions League & beIN Sports Deals",
    seoKeywords: [
      "TOD TV UAE subscription price 2026",
      "How to watch Premier League in UAE",
      "TOD beIN Sports pass price",
      "TOD Total annual pass discount UAE",
      "Watch Champions League Dubai TOD"
    ],
    faqs: [
      {
        question: "Where can I legally stream the English Premier League in the UAE?",
        answer: "TOD (by beIN Media Group) is the official live streaming destination for all 380 English Premier League matches, UEFA Champions League, and Formula 1 in the UAE."
      },
      {
        question: "How much does TOD cost in the UAE?",
        answer: "TOD Entertainment is AED 36.99/mo. The TOD Total pass (all live beIN Sports + Entertainment) is AED 84.99/mo or AED 799/year (saving AED 220/year)."
      },
      {
        question: "Can I stream TOD on my Smart TV and mobile at the same time?",
        answer: "Yes, TOD Total permits streaming on up to 2 screens concurrently in Full HD or 4K Ultra HD on supported Smart TVs and streaming boxes."
      },
      {
        question: "Do Etisalat or du provide free TOD access?",
        answer: "Subscribers to eLife or du TV packages with beIN Sports add-ons receive complimentary digital TOD streaming credentials to watch matches anywhere on mobile and tablets."
      }
    ]
  },

  starzplay_ae: {
    slug: "starzplay-arabia-uae",
    aliases: ["starzplay", "starzplay-uae", "starzplay-arabia"],
    catchyH1: "Starzplay Arabia UAE Plans 2026: Pricing, Serie A, UFC Arabia & Etisalat eLife Perks",
    seoKeywords: [
      "Starzplay Arabia price UAE 2026",
      "Starzplay free with Etisalat eLife",
      "How to watch Serie A in UAE",
      "UFC Arabia streaming UAE",
      "Starzplay sports pack price"
    ],
    faqs: [
      {
        question: "Is Starzplay free with Etisalat in the UAE?",
        answer: "Yes, because e& (Etisalat) is a major shareholder in Starzplay, most eLife home fiber and Freedom postpaid plans include Starzplay at AED 0 for up to 24 months."
      },
      {
        question: "What live sports stream on Starzplay in the UAE?",
        answer: "Starzplay Sports broadcasts Italian Serie A football, UFC Arabia fight nights, international cricket tournaments on CricLife, and World Rugby."
      },
      {
        question: "How much does Starzplay cost in the UAE?",
        answer: "Starzplay Entertainment is AED 39.99/month, while Starzplay Sports is AED 59.99/month. The Ultimate Annual pass is AED 399.99/year."
      },
      {
        question: "Can I use Smiles points to pay for Starzplay?",
        answer: "Yes, the Smiles by e& app frequently offers 1-month and 3-month Starzplay vouchers at up to 25% discount using earned Smiles points."
      }
    ]
  },

  netflix_ae: {
    slug: "netflix-uae",
    aliases: ["netflix", "netflix-ae"],
    catchyH1: "Netflix UAE Plans 2026: Pricing, 4K Premium, Etisalat eLife Fusion & du Bundles",
    seoKeywords: [
      "Netflix UAE subscription price 2026",
      "Netflix UAE plans Basic Standard Premium",
      "Netflix free with Etisalat eLife",
      "Netflix du bundle offer UAE",
      "Dubai Bling Netflix UAE"
    ],
    faqs: [
      {
        question: "How much is Netflix per month in the UAE?",
        answer: "Netflix UAE plans are: Basic (AED 35/mo, 720p HD, 1 screen), Standard (AED 45/mo, 1080p Full HD, 2 screens), and Premium (AED 65/mo, 4K Ultra HD + Spatial Audio, 4 screens)."
      },
      {
        question: "Can I get Netflix for free through Etisalat or du in the UAE?",
        answer: "Yes, e& eLife Ultra Fusion bundles include Netflix Standard or Premium at AED 0. du Home Ultimate packages also offer complimentary Netflix access or recurring bill credits."
      },
      {
        question: "Does Netflix UAE offer an ad-supported plan?",
        answer: "No, unlike the US or UK, Netflix UAE does not offer an ad-supported tier. All plans in the UAE are 100% ad-free."
      },
      {
        question: "How can I save on my Netflix subscription in the UAE?",
        answer: "Purchase Netflix UAE gift cards from Carrefour or LuLu Hypermarket using cashback credit cards (like ENBD Duo or ADCB 365) to earn 5% statement cashback."
      }
    ]
  },

  disney_ae: {
    slug: "disney-plus-uae",
    aliases: ["disney", "disney-plus", "disney-uae", "disney-mena"],
    catchyH1: "Disney+ UAE Plans 2026: Pricing, Marvel, Star Wars & du Power Plan Free Perks",
    seoKeywords: [
      "Disney Plus UAE subscription price 2026",
      "Disney Plus free with du",
      "Disney Plus UAE annual plan discount",
      "How to watch Marvel Star Wars in Dubai",
      "Disney Plus Etisalat offer"
    ],
    faqs: [
      {
        question: "How much is Disney+ in the UAE?",
        answer: "Disney+ UAE costs AED 39.99/month, or AED 399.90/year (which gives you 12 months for the price of 10, saving AED 80/year)."
      },
      {
        question: "How can I get Disney+ for free in the UAE?",
        answer: "du Postpaid Power 300+ mobile contracts and du Home Wireless Plus customers can select Disney+ as their complimentary digital lifestyle perk for 12 months in the du App."
      },
      {
        question: "Does Disney+ UAE include adult content and Star?",
        answer: "Yes, Disney+ in the UAE includes Star, featuring mature hit shows like Shogun, The Bear, Grey's Anatomy, and Family Guy with robust PIN-protected parental controls."
      },
      {
        question: "How many screens can stream Disney+ at once in the UAE?",
        answer: "Disney+ UAE allows streaming on up to 2 devices simultaneously with Full HD 1080p and Dolby 5.1 surround sound."
      }
    ]
  },

  prime_ae: {
    slug: "amazon-prime-uae",
    aliases: ["prime", "amazon-prime", "prime-video-uae", "amazon-prime-uae"],
    catchyH1: "Amazon Prime UAE 2026: Pricing, Free Deliveroo Plus, Prime Video & du Perks",
    seoKeywords: [
      "Amazon Prime UAE price 2026",
      "Amazon Prime free Deliveroo Plus UAE",
      "Amazon Prime free with du postpaid",
      "Amazon Prime UAE annual cost",
      "Prime Video Arabic shows UAE"
    ],
    faqs: [
      {
        question: "How much does Amazon Prime cost in the UAE?",
        answer: "Amazon Prime UAE is AED 16/month, or AED 140/year (just AED 11.66/month equivalent, saving over 27%)."
      },
      {
        question: "Does Amazon Prime UAE include free food delivery on Deliveroo?",
        answer: "Yes! Amazon Prime UAE members get Deliveroo Plus Silver (worth AED 19/month) completely FREE, unlocking free food delivery on orders over AED 30 across the UAE."
      },
      {
        question: "Can I get Amazon Prime for free with my telecom plan in the UAE?",
        answer: "Yes, du Postpaid mobile plans starting from AED 150/mo include free Amazon Prime membership for 12 months via the du App."
      },
      {
        question: "Does Amazon Prime UAE offer a free trial?",
        answer: "Yes, all new Amazon.ae accounts can activate a 30-day full free trial of Amazon Prime including Prime Video and next-day shipping."
      }
    ]
  },

  apple_tv_ae: {
    slug: "apple-tv-plus-uae",
    aliases: ["apple-tv", "apple-tv-plus", "apple-tv-uae"],
    catchyH1: "Apple TV+ UAE Plans 2026: Pricing, Ted Lasso, 3 Months Free & Apple One Bundles",
    seoKeywords: [
      "Apple TV Plus UAE price 2026",
      "Apple TV Plus 3 months free UAE",
      "Apple TV Plus Family Sharing UAE",
      "How to watch Ted Lasso UAE",
      "Apple One bundle price Dubai"
    ],
    faqs: [
      {
        question: "How much is Apple TV+ per month in the UAE?",
        answer: "Apple TV+ costs AED 29.99/month in the UAE and includes 4K Ultra HD streaming and Dolby Atmos audio on up to 6 screens via Family Sharing."
      },
      {
        question: "How can I get 3 months of Apple TV+ for free in the UAE?",
        answer: "Purchase any new iPhone, iPad, Mac, or Apple TV in the UAE from an authorized retailer to claim 3 months of Apple TV+ for AED 0 inside the Apple TV app within 90 days."
      },
      {
        question: "Is Apple TV+ cheaper inside the Apple One bundle?",
        answer: "Yes! Subscribing to Apple One Individual (AED 49.95/mo) gives you Apple TV+, Apple Music, Apple Arcade, and 50GB iCloud+, saving AED 35/month compared to paying individually."
      },
      {
        question: "Can I watch Apple TV+ on Samsung or LG Smart TVs in the UAE?",
        answer: "Yes, the Apple TV app is pre-installed or downloadable on Samsung, LG, Sony Google TVs, PlayStation, Xbox, and Fire TV sticks."
      }
    ]
  },

  apple_one_ae: {
    slug: "apple-one-uae",
    aliases: ["apple-one", "appleone-uae"],
    catchyH1: "Apple One UAE Plans 2026: Pricing, Family 6-Member Split & 600 AED/Yr Savings",
    seoKeywords: [
      "Apple One UAE price 2026",
      "Apple One Family plan UAE",
      "Apple One savings Dubai",
      "Apple Music TV Arcade iCloud bundle UAE",
      "Apple Family Sharing UAE cost"
    ],
    faqs: [
      {
        question: "How much does Apple One cost in the UAE?",
        answer: "Apple One Individual is AED 49.95/month (saves AED 35/mo with 50GB iCloud+). Apple One Family is AED 64.95/month (saves AED 50/mo with 200GB iCloud+ for up to 6 members)."
      },
      {
        question: "How does the Apple One Family split hack work?",
        answer: "Subscribe to Apple One Family at AED 64.95/month and share across 6 family members using Apple Family Sharing. The effective cost drops to just AED 10.82/person per month for Music, TV+, Arcade, and iCloud!"
      },
      {
        question: "Is Apple Fitness+ or Apple News+ included in Apple One UAE?",
        answer: "No, Apple One Premier is not officially available in the UAE because Apple News+ and Fitness+ have limited regional support. The UAE offers Individual and Family plans."
      },
      {
        question: "Does Apple One have a free trial?",
        answer: "Apple One includes a 1-month free trial for any services that you do not already currently subscribe to."
      }
    ]
  },

  youtube_premium_ae: {
    slug: "youtube-premium-uae",
    aliases: ["youtube", "youtube-premium", "youtube-music-uae"],
    catchyH1: "YouTube Premium UAE Plans 2026: Pricing, Family 6-Account Split & Student Rates",
    seoKeywords: [
      "YouTube Premium UAE price 2026",
      "YouTube Premium Family plan UAE",
      "YouTube Premium student discount UAE",
      "YouTube Music Premium price Dubai",
      "Ad-free YouTube UAE hack"
    ],
    faqs: [
      {
        question: "How much does YouTube Premium cost in the UAE?",
        answer: "Individual is AED 27.99/mo, Family (up to 6 household members) is AED 41.99/mo, and verified Student is AED 15.99/mo."
      },
      {
        question: "How does the YouTube Family plan save money in the UAE?",
        answer: "At AED 41.99/month for 6 accounts, sharing with family members brings the cost down to just AED 7.00/person per month, saving over AED 1,500/year across the household."
      },
      {
        question: "Does YouTube Premium include YouTube Music?",
        answer: "Yes, YouTube Premium includes full ad-free YouTube Music Premium with offline downloads and background audio playback at no extra charge."
      },
      {
        question: "How can UAE university students get the discount?",
        answer: "Students accredited with UAE universities can verify their academic status via SheerID to unlock the AED 15.99/month student rate for up to 4 consecutive years."
      }
    ]
  },

  spotify_ae: {
    slug: "spotify-uae",
    aliases: ["spotify", "spotify-premium-uae", "spotify-ae"],
    catchyH1: "Spotify UAE Plans 2026: Pricing, Family 6-Person Deal & Student 50% Off",
    seoKeywords: [
      "Spotify UAE subscription price 2026",
      "Spotify Family plan UAE price",
      "Spotify student discount Dubai",
      "Spotify Duo price UAE",
      "Spotify free vs premium UAE"
    ],
    faqs: [
      {
        question: "How much is Spotify Premium in the UAE?",
        answer: "Individual is AED 23.99/mo, Duo (2 accounts) is AED 31.99/mo, Family (6 accounts) is AED 38.99/mo, and Student is AED 11.99/mo."
      },
      {
        question: "How can I get Spotify Family for AED 6.50/month in the UAE?",
        answer: "Subscribe to Spotify Family at AED 38.99/mo and add 6 members under one address. The per-person cost is just AED 6.50/month (saving AED 1,259/year)."
      },
      {
        question: "Can I pay for Spotify using my Etisalat or du mobile balance?",
        answer: "Yes, both Etisalat by e& and du support Direct Carrier Billing, allowing you to charge Spotify directly to your monthly telecom invoice."
      },
      {
        question: "Does Spotify offer free trials in the UAE?",
        answer: "Yes, Spotify regularly provides 1 to 3 months of Premium for AED 0 to brand-new accounts in the UAE."
      }
    ]
  },

  anghami_ae: {
    slug: "anghami-plus-uae",
    aliases: ["anghami", "anghami-plus", "anghami-uae"],
    catchyH1: "Anghami Plus UAE Plans 2026: Pricing, Amr Diab Exclusives, du & Smiles Deals",
    seoKeywords: [
      "Anghami Plus UAE price 2026",
      "Anghami Plus free with du",
      "Anghami Family plan price Dubai",
      "Anghami annual discount UAE",
      "Amr Diab songs Anghami UAE"
    ],
    faqs: [
      {
        question: "What is Anghami Plus and how much does it cost in the UAE?",
        answer: "Anghami is the leading Arabic music and podcast streaming service. Anghami Plus costs AED 19.99/month (or AED 199.99/year) and offers lossless audio, ad-free listening, and offline downloads."
      },
      {
        question: "Can I get Anghami Plus for free with du or Etisalat?",
        answer: "du offers promotional 3-month Anghami trials or discounted rates of AED 18/month on selected mobile plans. Smiles by e& also offers 20% discount vouchers redeemable with points."
      },
      {
        question: "How much does the Anghami Family plan cost in the UAE?",
        answer: "Anghami Plus Family is AED 29.99/month for up to 6 members, bringing the cost down to just AED 5.00/person per month."
      },
      {
        question: "Why choose Anghami over Spotify in the Middle East?",
        answer: "Anghami features exclusive contracts with top Arab superstars like Amr Diab, comprehensive Khaleeji and Levant libraries, Arabic live radio, and synchronized Arabic lyrics."
      }
    ]
  },

  talabat_pro_ae: {
    slug: "talabat-pro-uae",
    aliases: ["talabat", "talabat-pro", "talabat-uae"],
    catchyH1: "Talabat Pro UAE 2026: Pricing, Free Food Delivery, Mastercard Deals & Mart Perks",
    seoKeywords: [
      "Talabat Pro UAE price 2026",
      "Talabat Pro free with Mastercard",
      "Talabat Mart free delivery pass",
      "Talabat Pro 6-month discount",
      "Talabat promo codes Dubai"
    ],
    faqs: [
      {
        question: "How much is Talabat Pro per month in the UAE?",
        answer: "Talabat Pro costs AED 19.00/month, or AED 99.00 for a 6-month pass (AED 16.50/month equivalent)."
      },
      {
        question: "How do I get Talabat Pro for free in the UAE?",
        answer: "Holders of eligible UAE Mastercard World or World Elite credit cards receive 3 to 12 months of Talabat Pro at AED 0 when saving the card in their Talabat wallet."
      },
      {
        question: "What benefits are included in Talabat Pro?",
        answer: "Talabat Pro members get unlimited free delivery on food orders over AED 50 from participating restaurants, free delivery on Talabat Mart groceries, and 25% off dine-out."
      },
      {
        question: "How quickly does Talabat Pro pay for itself?",
        answer: "With standard delivery fees ranging from AED 5 to AED 10 per order, ordering food or groceries just 2 to 3 times per month pays for the entire subscription."
      }
    ]
  },

  careem_plus_ae: {
    slug: "careem-plus-uae",
    aliases: ["careem", "careem-plus", "careem-uae"],
    catchyH1: "Careem Plus UAE 2026: Pricing, 10% Hala Taxi Cashback, Free Delivery & ROI Hacks",
    seoKeywords: [
      "Careem Plus UAE price 2026",
      "Careem Plus 10% taxi cashback Dubai",
      "Careem Plus free food delivery pass",
      "Careem Plus free trial promo code",
      "Careem Plus vs Talabat Pro UAE"
    ],
    faqs: [
      {
        question: "What is Careem Plus and how much does it cost in the UAE?",
        answer: "Careem Plus is the UAE's ultimate super-app pass costing AED 19.00/month. The average active member in Dubai saves over AED 200/month."
      },
      {
        question: "What benefits come with Careem Plus in Dubai and Abu Dhabi?",
        answer: "Benefits include: 10% instant cashback on Hala Taxi and premium car rides, free food delivery on orders over AED 30, free Quik grocery deliveries, and 20% discounts on home cleaning and laundry."
      },
      {
        question: "How does the 10% ride cashback work?",
        answer: "Every time you take a Hala Taxi or Careem ride, 10% of your fare is credited back to your Careem Pay wallet immediately, which you can spend on food, groceries, or future rides."
      },
      {
        question: "Is there a free trial for Careem Plus?",
        answer: "Yes, Careem offers a 30-day free trial on your first signup to test all ride, food, and grocery benefits."
      }
    ]
  },

  noon_one_ae: {
    slug: "noon-one-uae",
    aliases: ["noon", "noon-one", "noon-vip", "noon-uae"],
    catchyH1: "Noon One UAE 2026: Pricing, Free Noon Express, Food Delivery & Mashreq VIP Perks",
    seoKeywords: [
      "Noon One UAE price 2026",
      "Noon One free with Mashreq credit card",
      "Noon One annual plan discount",
      "Noon Minutes free delivery pass",
      "Noon VIP subscription Dubai"
    ],
    faqs: [
      {
        question: "How much does Noon One cost in the UAE?",
        answer: "Noon One is AED 15.00/month, or AED 120.00/year (which equals just AED 10.00/month, saving 33%)."
      },
      {
        question: "How can I get Noon One for free in the UAE?",
        answer: "Holding the Mashreq Noon VIP Credit Card gives you complimentary Noon One membership at AED 0 alongside 3.5% unlimited cashback on all Noon purchases."
      },
      {
        question: "What does Noon One cover in the UAE?",
        answer: "Noon One provides unlimited free next-day delivery on Noon Express eCommerce items, free delivery on Noon Food orders over AED 30, and free delivery on 15-minute Noon Minutes groceries."
      },
      {
        question: "Can I try Noon One for free?",
        answer: "Yes, Noon offers a 14-day free trial on initial activation inside the Noon app."
      }
    ]
  },

  deliveroo_plus_ae: {
    slug: "deliveroo-plus-uae",
    aliases: ["deliveroo", "deliveroo-plus", "deliveroo-uae"],
    catchyH1: "Deliveroo Plus UAE 2026: Pricing, Free with Amazon Prime UAE & Mastercard Deals",
    seoKeywords: [
      "Deliveroo Plus UAE price 2026",
      "Deliveroo Plus free with Amazon Prime UAE",
      "Deliveroo Plus Silver vs Gold UAE",
      "Deliveroo promo code UAE",
      "Free food delivery Dubai Deliveroo"
    ],
    faqs: [
      {
        question: "How can I get Deliveroo Plus completely free in the UAE?",
        answer: "Link your Amazon.ae Prime account inside Deliveroo to claim Deliveroo Plus Silver for 100% FREE (saving AED 19/month or AED 228/year)!"
      },
      {
        question: "What is the difference between Deliveroo Plus Silver and Gold?",
        answer: "Silver (AED 19/mo or free with Prime) requires an AED 30 minimum order for free delivery. Gold (AED 29/mo) gives free delivery on orders over AED 50 and includes exclusive priority rider routing."
      },
      {
        question: "Does Deliveroo Plus apply to grocery deliveries in Dubai?",
        answer: "Yes, Deliveroo Plus free delivery applies to participating grocery and specialty retail partners like Waitrose, Choithrams, and Marks & Spencer."
      },
      {
        question: "Are there bank card promo codes for Deliveroo UAE?",
        answer: "Yes, Mastercard frequently runs promotions providing up to 20% discount on food orders for UAE cardholders."
      }
    ]
  },

  xbox_game_pass_ae: {
    slug: "xbox-game-pass-uae",
    aliases: ["xbox", "xbox-game-pass", "game-pass-uae"],
    catchyH1: "Xbox Game Pass Ultimate UAE Plans 2026: Pricing, EA Play & Cloud Gaming Deals",
    seoKeywords: [
      "Xbox Game Pass Ultimate UAE price 2026",
      "PC Game Pass price Dubai UAE",
      "Xbox Game Pass CDKeys UAE discount",
      "EA Play Xbox UAE included",
      "Xbox cloud gaming UAE"
    ],
    faqs: [
      {
        question: "How much is Xbox Game Pass Ultimate in the UAE?",
        answer: "Xbox Game Pass Ultimate costs AED 44.99/month in the UAE. PC Game Pass is AED 29.99/month."
      },
      {
        question: "What is included in Xbox Game Pass Ultimate in the UAE?",
        answer: "Ultimate includes over 100 high-quality console and PC games, day-one blockbuster releases (Call of Duty, Starfield), EA Play membership, and online multiplayer."
      },
      {
        question: "Can I buy discounted Xbox Game Pass vouchers in the UAE?",
        answer: "Yes, purchasing 3-month digital codes from CDKeys, Geekay Games, or Virgin Megastore during seasonal sales often drops the monthly cost to ~AED 38/month."
      },
      {
        question: "Is Xbox Cloud Gaming supported in the UAE?",
        answer: "Xbox Cloud Gaming is available via supported web browsers, Smart TVs, and mobile apps with an active Ultimate membership."
      }
    ]
  },

  ps_plus_ae: {
    slug: "playstation-plus-uae",
    aliases: ["ps-plus", "playstation-plus", "psn-uae"],
    catchyH1: "PlayStation Plus UAE Plans 2026: Pricing, Extra Game Catalog & Days of Play Deals",
    seoKeywords: [
      "PlayStation Plus UAE subscription price 2026",
      "PS Plus Extra vs Deluxe UAE price",
      "PS Plus Days of Play sale Dubai",
      "PSN wallet cards UAE discount",
      "PlayStation Plus Essential monthly games UAE"
    ],
    faqs: [
      {
        question: "How much does PlayStation Plus cost in the UAE?",
        answer: "Monthly rates: Essential is AED 34.99/mo, Extra is AED 52.99/mo, and Deluxe is AED 61.99/mo. The PS Plus Extra annual pass is AED 439.99/year (AED 36.66/month equivalent)."
      },
      {
        question: "When is the best time to buy PlayStation Plus in the UAE?",
        answer: "Every June during Sony's official 'Days of Play' sale and in late November during Black Friday, annual PS Plus subscriptions drop by up to 25%-30% on the UAE PS Store."
      },
      {
        question: "What is the difference between PS Plus Extra and Deluxe in the UAE?",
        answer: "Extra includes the 400+ PS4/PS5 Game Catalog. Deluxe adds classic retro PlayStation games (PS1, PS2, PSP) and time-limited trial access to brand-new blockbuster releases."
      },
      {
        question: "How can I get cashback on my PS Plus subscription in the UAE?",
        answer: "Buy PlayStation Network UAE wallet cards at Sharaf DG or Geekay Games using cashback credit cards (like ADCB 365 or ENBD Duo) to earn 5-10% value back."
      }
    ]
  },

  crunchyroll_ae: {
    slug: "crunchyroll-uae",
    aliases: ["crunchyroll", "crunchyroll-mena", "crunchyroll-dubai"],
    catchyH1: "Crunchyroll UAE Plans 2026: Pricing, Anime Simulcasts, Arabic Subs & Mega Fan Deals",
    seoKeywords: [
      "Crunchyroll UAE price 2026",
      "How to watch Demon Slayer Jujutsu Kaisen UAE",
      "Crunchyroll Mega Fan 4-screen split Dubai",
      "Crunchyroll annual discount UAE",
      "Anime streaming UAE Arabic subtitles"
    ],
    faqs: [
      {
        question: "How much does Crunchyroll cost in the UAE?",
        answer: "Fan tier is AED 19.00/month (1 screen). Mega Fan is AED 24.00/month (4 screens + offline downloads). The Mega Fan annual pass is AED 240.00/year (12 months for the price of 10)."
      },
      {
        question: "How can I stream Crunchyroll for AED 6/month in the UAE?",
        answer: "Subscribe to Crunchyroll Mega Fan at AED 24/mo and share across 4 concurrent screens with anime friends. The cost drops to just AED 6.00/person per month!"
      },
      {
        question: "Are anime episodes subtitled in Arabic on Crunchyroll UAE?",
        answer: "Yes, top hit series like Demon Slayer, Jujutsu Kaisen, Solo Leveling, and One Piece feature professional Arabic and English subtitles available 1 hour after Japanese broadcast."
      },
      {
        question: "Does Crunchyroll UAE offer a free trial?",
        answer: "Yes, Crunchyroll offers a 14-day free trial on all membership tiers for new accounts."
      }
    ]
  },

  chatgpt_plus_ae: {
    slug: "chatgpt-plus-uae",
    aliases: ["chatgpt", "chatgpt-plus", "openai-uae"],
    catchyH1: "ChatGPT Plus UAE 2026: Pricing, GPT-4o, Free-Zone Tax Write-Off & Voice Perks",
    seoKeywords: [
      "ChatGPT Plus UAE price 2026",
      "How to buy ChatGPT Plus Dubai",
      "ChatGPT business expense tax write-off UAE",
      "GPT-4o Advanced Voice UAE",
      "OpenAI subscription price AED"
    ],
    faqs: [
      {
        question: "How much does ChatGPT Plus cost in the UAE?",
        answer: "ChatGPT Plus is officially priced at USD 20/month, which bills at approximately AED 79.99/month depending on foreign transaction and bank conversion rates."
      },
      {
        question: "Can UAE companies and freelancers write off ChatGPT Plus?",
        answer: "Yes, UAE corporate entities, registered free-zone agencies, and freelance license holders can deduct ChatGPT Plus as an operational business software expense."
      },
      {
        question: "What features are unlocked in ChatGPT Plus?",
        answer: "Subscribers get priority access to GPT-4o, Advanced Voice Mode, Canvas writing & coding, DALL-E 3 image generation, and custom GPT creation."
      },
      {
        question: "Can I subscribe to ChatGPT Plus via Apple App Store in the UAE?",
        answer: "Yes, subscribing via iOS in-app billing lets you pay directly in AED using UAE bank cards or Apple ID gift balance."
      }
    ]
  },

  claude_pro_ae: {
    slug: "claude-pro-uae",
    aliases: ["claude", "claude-pro", "anthropic-uae"],
    catchyH1: "Claude Pro UAE 2026: Pricing, Claude 3.5 Sonnet, Artifacts & Developer Deals",
    seoKeywords: [
      "Claude Pro UAE price 2026",
      "Claude 3.5 Sonnet Dubai UAE",
      "Claude Pro subscription AED price",
      "Anthropic Claude UAE invoice",
      "Claude Artifacts coding assistant Dubai"
    ],
    faqs: [
      {
        question: "How much does Claude Pro cost in the UAE?",
        answer: "Claude Pro costs USD 20/month (approximately AED 79.99/month), giving you 5x more usage of Claude 3.5 Sonnet."
      },
      {
        question: "What are the key benefits of Claude Pro over the free version?",
        answer: "Pro members get high-volume access to Claude 3.5 Sonnet, the interactive Artifacts visual workspace, 200K token context window, and priority access during peak hours."
      },
      {
        question: "Can UAE companies claim business invoicing for Claude Pro?",
        answer: "Yes, Anthropic provides business invoices including company name and VAT details for corporate bookkeeping in the UAE."
      },
      {
        question: "Does Claude Pro support Arabic language prompts?",
        answer: "Yes, Claude 3.5 Sonnet excels at understanding, translating, and generating sophisticated Modern Standard Arabic as well as Gulf Arabic dialects."
      }
    ]
  },

  microsoft_365_ae: {
    slug: "microsoft-365-uae",
    aliases: ["m365", "microsoft-365", "office-365-uae"],
    catchyH1: "Microsoft 365 UAE Plans 2026: Pricing, Family 6-User 6TB Deal & Amazon Key Savings",
    seoKeywords: [
      "Microsoft 365 UAE price 2026",
      "Office 365 Family plan Dubai UAE",
      "Microsoft 365 Amazon UAE discount key",
      "1TB OneDrive storage price UAE",
      "Microsoft 365 free with Etisalat"
    ],
    faqs: [
      {
        question: "How much does Microsoft 365 cost in the UAE?",
        answer: "Personal (1 user, 1TB OneDrive) is AED 29.99/mo. Family (up to 6 users, 6TB OneDrive total) is AED 39.99/mo or AED 399.99/year (AED 33.33/mo equivalent)."
      },
      {
        question: "How does the Microsoft 365 Family split save money in the UAE?",
        answer: "At AED 399.99/year for 6 people, each user pays just AED 5.55/month for full Word, Excel, PowerPoint, and their own private 1TB OneDrive cloud storage (saving over AED 1,750/year collectively)!"
      },
      {
        question: "Where can I buy discounted Microsoft 365 product keys in the UAE?",
        answer: "Amazon.ae and Sharaf DG regularly sell official 12-month Microsoft 365 Family digital or retail activation keys for as low as AED 280 (saving AED 120/year)."
      },
      {
        question: "Do Etisalat or du provide Microsoft 365?",
        answer: "Selected e& eLife Business and home office broadband packages include 1 year of Microsoft 365 at AED 0."
      }
    ]
  },

  google_one_ae: {
    slug: "google-one-uae",
    aliases: ["google-one", "google-drive-uae", "google-storage-uae"],
    catchyH1: "Google One UAE Plans 2026: Pricing, Gemini Advanced, 100GB Storage & Family Sharing",
    seoKeywords: [
      "Google One UAE subscription price 2026",
      "Google Drive 100GB storage price Dubai",
      "Google Gemini Advanced AI price UAE",
      "Google One Family sharing plan UAE",
      "Google Photos storage full UAE fix"
    ],
    faqs: [
      {
        question: "How much does Google One storage cost in the UAE?",
        answer: "Basic (100GB) is AED 7.99/mo (or AED 79.99/yr), Standard (200GB) is AED 11.99/mo, Premium (2TB) is AED 36.99/mo, and AI Premium (2TB + Gemini Advanced) is AED 74.99/mo."
      },
      {
        question: "Can I share Google One storage with my family in the UAE?",
        answer: "Yes, all Google One plans can be shared with up to 5 additional family members at no extra cost, while keeping everyone's personal photos and files private."
      },
      {
        question: "What is included in the Google One AI Premium plan?",
        answer: "AI Premium includes 2TB of cloud storage plus Gemini Advanced (powered by Google's next-generation 1.5 Pro AI model) integrated directly into Gmail, Docs, and Slides."
      },
      {
        question: "Do Android phones in the UAE come with free Google One?",
        answer: "Selected Android flagship devices purchased in the UAE include up to 6 months of Google One 100GB or 2TB at AED 0."
      }
    ]
  },

  audible_ae: {
    slug: "audible-uae",
    aliases: ["audible", "audible-uae", "amazon-audible-uae"],
    catchyH1: "Audible UAE 2026: Pricing, 2 Free Credits with Amazon Prime & Audiobook Deals",
    seoKeywords: [
      "Audible UAE price 2026",
      "Audible free trial Amazon Prime UAE",
      "How to listen to audiobooks in Dubai",
      "Audible credit price UAE",
      "Arabic audiobooks Audible UAE"
    ],
    faqs: [
      {
        question: "How much does Audible cost in the UAE?",
        answer: "Audible Premium Plus costs USD 14.95/month (approximately AED 39.99/month), which includes 1 monthly audiobook credit and unlimited listening to thousands of Plus Catalog audiobooks."
      },
      {
        question: "Do Amazon Prime UAE members get a special Audible offer?",
        answer: "Yes, Amazon.ae Prime members signing up for Audible receive a 30-day free trial that includes 2 free audiobook credits instead of 1."
      },
      {
        question: "Do I keep my downloaded audiobooks if I cancel Audible?",
        answer: "Yes! Any audiobook purchased with credits or money is yours to keep permanently in your Audible library, even after your subscription ends."
      },
      {
        question: "Does Audible offer Arabic language audiobooks?",
        answer: "Yes, Audible has an expanding collection of best-selling Arabic fiction, personal development, and classics."
      }
    ]
  },

  spacetoon_go_ae: {
    slug: "spacetoon-go-uae",
    aliases: ["spacetoon", "spacetoon-go", "spacetoon-uae"],
    catchyH1: "Spacetoon Go UAE 2026: Pricing, Detective Conan Arabic Dub & Etisalat Perks",
    seoKeywords: [
      "Spacetoon Go UAE price 2026",
      "Detective Conan Arabic dub Spacetoon",
      "Spacetoon Go annual discount UAE",
      "Spacetoon free trial Dubai",
      "Arabic cartoon streaming app UAE"
    ],
    faqs: [
      {
        question: "What is Spacetoon Go and how much does it cost in the UAE?",
        answer: "Spacetoon Go is the premier Arabic anime and kids streaming platform. Monthly access is AED 18.99/mo, while the annual pass is AED 149.99/yr (AED 12.50/mo equivalent, saving 34%)."
      },
      {
        question: "What popular anime are available with Arabic dubbing?",
        answer: "Spacetoon Go is famous for official Arabic dubs of Detective Conan, Dragon Ball Super, Hunter x Hunter, Beyblade, and beloved Spacetoon generation classics."
      },
      {
        question: "Can I pay for Spacetoon Go with Etisalat in the UAE?",
        answer: "Yes, Etisalat by e& supports direct carrier billing for Spacetoon Go, allowing you to charge the subscription directly to your monthly phone bill."
      },
      {
        question: "Is Spacetoon Go safe for children?",
        answer: "Yes, Spacetoon Go features comprehensive parental controls, zero inappropriate ads, and curated content appropriate for family viewing."
      }
    ]
  }
};

/**
 * Single-brand resolver for United Arab Emirates (UAE / AE).
 * Checks the static catalog first, then queries Upstash Redis for on-demand generated brands.
 */
export async function getAESubscriptionBySlug(slug) {
  if (!slug) return null;
  const cleanSlug = slug.toLowerCase().trim();

  const seoEntry = Object.entries(SUBSCRIPTIONS_SEO_MAP_AE).find(
    ([id, data]) => id === cleanSlug || data.slug === cleanSlug || (data.aliases && data.aliases.includes(cleanSlug))
  );

  const matchedId = seoEntry ? seoEntry[0] : cleanSlug;

  let catalogItem = AE_SUBSCRIPTIONS_CATALOG.find(
    (sub) => sub.id === matchedId || sub.id === cleanSlug
  );

  // Check Redis for on-demand generated UAE brands
  if (!catalogItem && redisClient) {
    try {
      const raw = await redisClient.get(`ondemand_sub_ae_${cleanSlug}`);
      if (raw) {
        catalogItem = typeof raw === "string" ? JSON.parse(raw) : raw;
      }
    } catch {}
  }

  if (!catalogItem) return null;

  const seoData = seoEntry ? seoEntry[1] : (catalogItem.seo || {
    slug: catalogItem.id,
    catchyH1: `${catalogItem.name} UAE Subscription Plans 2026: Pricing, Discounts & Deals`,
    seoKeywords: [`${catalogItem.name} UAE plans`, `${catalogItem.name} discount`],
    faqs: [
      {
        question: `How to get ${catalogItem.name} at a discount in the UAE?`,
        answer: `Check our verified 4-Level Savings Blueprint on this page to claim carrier perks from Etisalat by e& or du, Smiles points, and bundle passes.`
      }
    ]
  });

  return {
    ...catalogItem,
    country: "AE",
    currencySymbol: "AED",
    seo: seoData
  };
}

export function getAllAESubscriptionSlugs() {
  return AE_SUBSCRIPTIONS_CATALOG.map((sub) => {
    const seo = SUBSCRIPTIONS_SEO_MAP_AE[sub.id];
    return seo?.slug || sub.id;
  });
}
