import { UK_SUBSCRIPTIONS_CATALOG } from "./subscriptionsCatalogUK";
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
 * for all 25 United Kingdom (UK / GB) Subscription Brands.
 */
export const SUBSCRIPTIONS_SEO_MAP_UK = {
  netflix_uk: {
    slug: "netflix-uk",
    aliases: ["netflix", "netflix-gb"],
    catchyH1: "Netflix UK Plans 2026: Pricing, 4K Screens & The Legal £0 Free EE & Sky TV Trick",
    seoKeywords: [
      "Netflix UK plans pricing 2026",
      "Netflix free with Sky TV EE",
      "Netflix standard with ads cost UK",
      "Netflix UK cheap subscription discount",
      "How to get Netflix free UK",
      "Netflix premium 4k price UK"
    ],
    faqs: [
      {
        question: "How can I get Netflix for £0 free in the United Kingdom?",
        answer: "EE customers on All-Rounder or Full Works mobile plans can choose Netflix Standard as their £0 Inclusive Extra perk. Furthermore, Sky Stream and Sky Glass packages include Netflix Standard with Ads complimentary in their base tier."
      },
      {
        question: "What is the difference between Netflix Standard with Ads and Ad-Free in the UK?",
        answer: "Standard with Ads costs £4.99/month and offers 1080p Full HD on 2 simultaneous screens with approximately 4-5 minutes of ads per hour. Standard Ad-Free costs £10.99/month and removes all advertisements plus enables 30 offline download slots."
      },
      {
        question: "How much does Netflix Premium 4K cost in the UK in 2026?",
        answer: "Netflix Premium is £17.99/month in the UK. It unlocks 4 concurrent streams, 4K Ultra HD resolution with HDR/Dolby Vision, and Spatial Audio with Dolby Atmos."
      },
      {
        question: "Can I save money on Netflix UK with digital gift cards?",
        answer: "Yes, CDKeys and ShopTo periodically offer 5% to 10% discounts on UK Netflix gift cards, and using cashback services like TopCashback or Quidco earns up to 8% statement rebates."
      }
    ]
  },

  disney_uk: {
    slug: "disney-plus-uk",
    aliases: ["disney-plus", "disney-uk"],
    catchyH1: "Disney+ UK Plans 2026: Pricing, Shōgun 4K & Up to 6 Months Free via O2 Priority",
    seoKeywords: [
      "Disney plus UK price 2026",
      "Disney plus free with O2 UK",
      "Disney plus UK student discount",
      "Disney plus Tesco clubcard voucher",
      "Disney plus standard with ads UK cost"
    ],
    faqs: [
      {
        question: "How can I get Disney+ for free on O2 in the UK?",
        answer: "O2 customers upgrading to select Plus Plans or SIM contracts can choose Disney+ as an 'O2 Extra' to get up to 6 months completely free. After the trial, O2 applies a £2/month credit to your airtime bill."
      },
      {
        question: "Can I use Tesco Clubcard vouchers for Disney+ UK?",
        answer: "Yes! Tesco Clubcard points can be doubled in value. Exchanging £12 worth of Clubcard points pays for a 3-month Disney+ subscription without paying cash."
      },
      {
        question: "How much is Disney+ Premium 4K in the UK?",
        answer: "Disney+ Premium is £10.99/month or £109.90/year (which gives you 12 months for the price of 10). It supports 4K UHD, Dolby Atmos, and 4 concurrent screens."
      },
      {
        question: "Does Disney+ UK offer an ad-supported plan?",
        answer: "Yes, Disney+ Standard with Ads is available for £4.99/month in the UK, streaming in 1080p Full HD across 2 screens."
      }
    ]
  },

  prime_uk: {
    slug: "amazon-prime-uk",
    aliases: ["prime", "prime-uk", "prime-video-uk"],
    catchyH1: "Amazon Prime UK 2026: Video, Free Next-Day Delivery & Free Deliveroo Plus Hack",
    seoKeywords: [
      "Amazon Prime UK annual price 2026",
      "Amazon Prime Deliveroo Plus free hack",
      "Amazon Prime student discount UK",
      "Prime video ad free £2.99 UK",
      "Amazon Prime Vodafone UK free"
    ],
    faqs: [
      {
        question: "How do I claim free Deliveroo Plus with Amazon Prime in the UK?",
        answer: "Go to deliveroo.co.uk/amazon-prime and sign in with your Prime credentials. Deliveroo Plus Silver (free delivery on orders over £15, valued at £41.88/year) will be activated for £0 free."
      },
      {
        question: "How much does Amazon Prime cost in the UK in 2026?",
        answer: "Amazon Prime UK costs £8.99/month or £95/year upfront (saving £12.88/year). UK university students get a 6-month free trial followed by a 50% discount at £4.49/month."
      },
      {
        question: "Why does Prime Video have ads now and how to remove them in the UK?",
        answer: "Prime Video includes limited commercials. You can remove all advertisements by adding the Ad-Free upgrade for £2.99/month in your Amazon account settings."
      },
      {
        question: "Can I get Amazon Prime free with my mobile network?",
        answer: "Vodafone UK offers Amazon Prime as an inclusive entertainment benefit on select 24-month Unlimited Max mobile phone and SIM-only plans."
      }
    ]
  },

  now_tv_uk: {
    slug: "now-tv-uk",
    aliases: ["now-tv", "now", "sky-now"],
    catchyH1: "NOW TV UK Passes 2026: Sky Atlantic, HBO House of the Dragon & £6.99 Retention Trick",
    seoKeywords: [
      "NOW TV Entertainment pass price 2026",
      "How to watch House of the Dragon UK cheap",
      "NOW TV cinema pass discount code",
      "NOW TV Boost price UK",
      "NOW TV cancel trick £4.99"
    ],
    faqs: [
      {
        question: "What is the cheapest way to watch Sky Atlantic and HBO in the UK?",
        answer: "The NOW Entertainment Membership (£9.99/month) is the most flexible contract-free way to stream Sky Atlantic, House of the Dragon, Succession, and The Last of Us without a satellite dish."
      },
      {
        question: "How does the NOW TV cancellation discount trick work?",
        answer: "If you subscribe to NOW and initiate a cancellation online through your account dashboard, NOW will consistently offer a retention discount of £4.99 to £6.99/month for 3 to 6 months to stay."
      },
      {
        question: "What is NOW Boost and is it necessary?",
        answer: "NOW Boost (£6/month extra) upgrades your stream from 720p with stereo sound and 1 screen to 1080p Full HD, Dolby Digital 5.1 surround sound, 3 simultaneous screens, and removes commercials from on-demand shows."
      },
      {
        question: "Does EE TV or BT include NOW TV?",
        answer: "Yes, EE TV packages bundle NOW Entertainment and Netflix Standard directly on their Apple TV 4K or EE TV Box Pro hardware."
      }
    ]
  },

  apple_tv_uk: {
    slug: "apple-tv-plus-uk",
    aliases: ["apple-tv", "apple-tv-uk"],
    catchyH1: "Apple TV+ UK 2026: Pricing, Ted Lasso 4K & How to Get 3–6 Months 100% Free",
    seoKeywords: [
      "Apple TV plus free 6 months UK",
      "Apple TV plus Barclays Blue rewards",
      "Apple TV plus Currys perks free",
      "Apple TV plus price UK 2026",
      "Ted Lasso Slow Horses where to watch UK"
    ],
    faqs: [
      {
        question: "How can I get Apple TV+ for free in the United Kingdom?",
        answer: "You can claim 3 to 6 months of Apple TV+ for free through Barclays Blue Rewards, Currys Perks, Sky VIP, or by texting 'TV PLUS' to 150 on an EE pay-monthly phone."
      },
      {
        question: "How much is Apple TV+ in the UK without an offer?",
        answer: "Apple TV+ is £8.99/month in the UK. It offers 4K Dolby Vision, Dolby Atmos spatial audio, and allows sharing with up to 5 family members via Apple Family Sharing."
      },
      {
        question: "Is Apple TV+ included in Apple One?",
        answer: "Yes, the Apple One Individual bundle (£18.95/month) includes Apple TV+, Apple Music, Apple Arcade, and 50GB iCloud+ storage, saving over £10/month compared to paying separately."
      },
      {
        question: "Can I watch Apple TV+ on non-Apple devices in the UK?",
        answer: "Yes, the Apple TV app is available on Samsung, LG, and Sony Smart TVs, Amazon Fire TV Sticks, Roku, PlayStation 5, Xbox, and online at tv.apple.com."
      }
    ]
  },

  paramount_uk: {
    slug: "paramount-plus-uk",
    aliases: ["paramount-plus", "paramount-uk"],
    catchyH1: "Paramount+ UK 2026: Yellowstone, 4K Movies & The Legal £0 Free Sky Cinema Trick",
    seoKeywords: [
      "Paramount plus free with Sky Cinema UK",
      "Paramount plus UK price 2026",
      "Where to watch Yellowstone in UK",
      "Paramount plus UK annual discount",
      "Paramount plus Prime Video channel UK"
    ],
    faqs: [
      {
        question: "How do I get Paramount+ for £0 free in the UK?",
        answer: "If you subscribe to Sky Cinema on Sky Q, Sky Glass, or Sky Stream, Paramount+ Standard is included completely free of charge. Simply open the app on your Sky box and sign in with your Sky ID."
      },
      {
        question: "How much is Paramount+ standalone in the UK?",
        answer: "Paramount+ costs £6.99/month or £69.90/year (which gives you 2 months free) in the UK."
      },
      {
        question: "Which popular shows stream on Paramount+ UK?",
        answer: "Paramount+ is the exclusive home to the Taylor Sheridan universe including Yellowstone, 1883, 1923, Tulsa King, Mayor of Kingstown, as well as Star Trek: Strange New Worlds and Halo."
      },
      {
        question: "Can I subscribe to Paramount+ through Amazon Prime Video Channels?",
        answer: "Yes, Paramount+ can be added as an Amazon Prime Video Channel for £6.99/month with a 7-day free trial, allowing single-app streaming inside Prime Video."
      }
    ]
  },

  discovery_uk: {
    slug: "discovery-plus-uk",
    aliases: ["discovery-plus", "discovery-uk", "tnt-sports"],
    catchyH1: "Discovery+ & TNT Sports UK 2026: Champions League, UFC & £0 Free Sky TV Access",
    seoKeywords: [
      "Discovery plus free Sky UK trick",
      "TNT sports Discovery plus price UK",
      "Champions League UFC streaming UK",
      "Discovery plus standard price UK 2026"
    ],
    faqs: [
      {
        question: "How can I get Discovery+ Standard for free in the UK?",
        answer: "Sky Q, Sky Glass, and Sky Stream customers receive Discovery+ Standard (Entertainment) for £0 free. Simply say 'Get Discovery Plus' into your Sky voice remote to activate."
      },
      {
        question: "How much does TNT Sports on Discovery+ cost?",
        answer: "Discovery+ Premium (which includes TNT Sports 1-4, Premier League, Champions League, UFC, and MotoGP) costs £30.99/month on a rolling monthly contract."
      },
      {
        question: "Can EE customers get TNT Sports discounted?",
        answer: "Yes, EE mobile customers with All-Rounder or Full Works plans can select TNT Sports on Discovery+ as their Inclusive Extra perk."
      },
      {
        question: "Does Discovery+ support 4K in the UK?",
        answer: "Yes, TNT Sports Ultimate on Discovery+ Premium broadcasts marquee Champions League and Premier League fixtures in 4K HDR with Dolby Atmos."
      }
    ]
  },

  itvx_uk: {
    slug: "itvx-premium-uk",
    aliases: ["itvx", "itvx-uk", "britbox-uk"],
    catchyH1: "ITVX Premium UK 2026: Ad-Free Box Sets, Love Island & Full BritBox Classic Archive",
    seoKeywords: [
      "ITVX Premium price UK 2026",
      "ITVX ad free cost",
      "BritBox included in ITVX",
      "ITVX student discount promo code",
      "Where to watch Mr Bates vs The Post Office"
    ],
    faqs: [
      {
        question: "What is included with ITVX Premium in the UK?",
        answer: "ITVX Premium (£5.99/month or £59.99/year) removes all advertisements across thousands of ITV box sets and includes the complete BritBox UK collection of BBC and ITV classics."
      },
      {
        question: "Is BritBox separate from ITVX in the UK?",
        answer: "No, BritBox UK has been merged into ITVX Premium. Subscribing to ITVX Premium gives you full access to all BritBox dramas like Broadchurch, Downton Abbey, and classic Doctor Who."
      },
      {
        question: "Does ITVX offer a free trial?",
        answer: "Yes, ITVX offers a 7-day free trial on its Premium tier for all new subscribers."
      },
      {
        question: "Can I download shows offline on ITVX Premium?",
        answer: "Yes, ITVX Premium allows unlimited offline downloads on mobile and tablet devices, which is not supported on the free ad-tier."
      }
    ]
  },

  channel4_uk: {
    slug: "channel-4-plus-uk",
    aliases: ["channel-4", "c4-plus", "all4"],
    catchyH1: "Channel 4+ UK 2026: 100% Ad-Free Gogglebox, Derry Girls & Walter Presents Box Sets",
    seoKeywords: [
      "Channel 4 plus price UK 2026",
      "Channel 4 ad free cost",
      "How to skip ads on Channel 4",
      "Derry Girls Inbetweeners ad free streaming",
      "Channel 4 annual discount"
    ],
    faqs: [
      {
        question: "How much is Channel 4+ (ad-free) in the UK?",
        answer: "Channel 4+ costs £3.99/month or £39.99/year (saving 16% annually). It removes all commercials from over 1,500 on-demand TV box sets."
      },
      {
        question: "Does Channel 4+ offer early access to shows?",
        answer: "Yes, Channel 4+ members often get exclusive early access to drop complete box sets before they air on terrestrial television."
      },
      {
        question: "Does Channel 4+ offer a free trial?",
        answer: "Yes, a 7-day free trial is available directly on channel4.com for all new registrations."
      },
      {
        question: "Are live Channel 4 TV broadcasts ad-free on Channel 4+?",
        answer: "No, live terrestrial simulcasts still carry broadcast commercials due to regulatory requirements, but all on-demand catch-up content is 100% commercial-free."
      }
    ]
  },

  hayu_uk: {
    slug: "hayu-uk",
    aliases: ["hayu", "hayu-streaming"],
    catchyH1: "Hayu UK 2026: The Real Housewives, Below Deck & Same-Day US Reality TV Drops",
    seoKeywords: [
      "Hayu UK price 2026",
      "Where to watch Real Housewives UK",
      "Hayu annual pass discount",
      "Hayu free trial Prime Video Channels",
      "Below Deck all seasons streaming UK"
    ],
    faqs: [
      {
        question: "What is Hayu and how much does it cost in the UK?",
        answer: "Hayu is the UK's premier all-reality TV streaming service. It costs £4.99/month, £23.99 for 6 months, or £43.99/year (which saves 25%)."
      },
      {
        question: "Do US reality shows stream on Hayu the same day in the UK?",
        answer: "Yes, major shows like The Real Housewives, Below Deck, and Vanderpump Rules drop on Hayu UK the very same day they broadcast in the US."
      },
      {
        question: "Can I get Hayu through Amazon Prime Video Channels?",
        answer: "Yes, Hayu can be added as a channel inside the Prime Video app for £4.99/month with a 7-day free trial."
      },
      {
        question: "Does Hayu have advertisements?",
        answer: "No, all on-demand episodes and reunion specials on Hayu UK are 100% ad-free."
      }
    ]
  },

  spotify_uk: {
    slug: "spotify-uk",
    aliases: ["spotify", "spotify-gb"],
    catchyH1: "Spotify UK Plans 2026: Pricing, Duo & Vodafone VeryMe Entertainment Perks",
    seoKeywords: [
      "Spotify UK price 2026",
      "Spotify student discount UNiDAYS UK",
      "Spotify family plan cost UK",
      "Spotify free with Vodafone UK",
      "Spotify duo price UK"
    ],
    faqs: [
      {
        question: "How much does Spotify Premium cost in the UK in 2026?",
        answer: "Spotify Individual is £10.99/month, Duo (2 people) is £14.99/month, Family (up to 6 accounts) is £17.99/month, and Student is £5.99/month."
      },
      {
        question: "How can I get Spotify Premium cheaper or free on Vodafone?",
        answer: "Vodafone UK offers Spotify Premium as an inclusive Entertainment add-on for the full 24 months of select pay-monthly mobile contracts."
      },
      {
        question: "What is the cheapest way to get Spotify for a household in the UK?",
        answer: "The Spotify Family plan (£17.99/month) allows 6 family members living at the same address to have independent Premium accounts, working out to just £2.99/person/month."
      },
      {
        question: "Are audiobooks included with Spotify Premium in the UK?",
        answer: "Yes, Spotify Premium UK subscribers receive 15 hours of free audiobook listening every month from a catalog of over 250,000 titles."
      }
    ]
  },

  apple_one_uk: {
    slug: "apple-one-uk",
    aliases: ["apple-one", "apple-one-bundle-uk"],
    catchyH1: "Apple One UK 2026: Save £10/Month on Apple Music, TV+, Arcade & Free EE Perk",
    seoKeywords: [
      "Apple One UK price 2026",
      "Apple One family plan UK save",
      "Apple One free with EE iPhone",
      "Apple Music TV Arcade iCloud bundle UK",
      "Apple One premier cost UK"
    ],
    faqs: [
      {
        question: "How much do I save with Apple One in the UK?",
        answer: "Apple One Individual (£18.95/month) saves £10/month compared to paying for Apple Music, Apple TV+, Apple Arcade, and 50GB iCloud+ separately. The Family plan (£24.95/month) saves £11/month."
      },
      {
        question: "How can I get Apple One for £0 free with EE?",
        answer: "EE customers on the 'Full Works for iPhone' mobile plan get Apple One included as a complimentary benefit with no additional monthly cost."
      },
      {
        question: "How much storage comes with Apple One Family in the UK?",
        answer: "Apple One Family includes 200GB of shared iCloud+ storage that can be split among up to 6 family members."
      },
      {
        question: "What does the Apple One Premier plan include?",
        answer: "Apple One Premier (£36.95/month) includes Apple Music, Apple TV+, Apple Arcade, Apple News+, Apple Fitness+, and 2TB of iCloud+ storage."
      }
    ]
  },

  youtube_premium_uk: {
    slug: "youtube-premium-uk",
    aliases: ["youtube-premium", "yt-premium-uk"],
    catchyH1: "YouTube Premium UK 2026: Pricing, Ad-Free 4K, YouTube Music & Family Split",
    seoKeywords: [
      "YouTube Premium UK price 2026",
      "YouTube Premium student discount UK",
      "YouTube Premium family plan UK split",
      "YouTube Music included in Premium UK",
      "How to avoid YouTube ads UK"
    ],
    faqs: [
      {
        question: "How much is YouTube Premium in the UK in 2026?",
        answer: "YouTube Premium Individual is £12.99/month or £129.99/year. The Family plan is £19.99/month for up to 5 family members, and the Student plan is £7.99/month."
      },
      {
        question: "Is YouTube Music included with YouTube Premium?",
        answer: "Yes, a full YouTube Music Premium subscription (normally £10.99/month) is included for free with every YouTube Premium membership."
      },
      {
        question: "Can I save money with the YouTube Premium Family plan?",
        answer: "Yes! Splitting the £19.99/month Family plan with 5 family members costs just £4.00 per person per month, saving over £100 per person each year."
      },
      {
        question: "Can I get a YouTube Premium trial in the UK?",
        answer: "Google regularly provides 1-month to 3-month free trials on new Google accounts, and Vodafone customers can often claim 3 months free via VeryMe Rewards."
      }
    ]
  },

  audible_uk: {
    slug: "audible-uk",
    aliases: ["audible", "audible-amazon-uk"],
    catchyH1: "Audible UK 2026: Pricing, 12-Book Annual Deal & The 99p Retention Secret",
    seoKeywords: [
      "Audible UK price 2026",
      "Audible 99p for 3 months deal",
      "Audible prime members free trial UK",
      "Audible cancel discount trick",
      "Cheapest way to buy audiobooks UK"
    ],
    faqs: [
      {
        question: "How much does an Audible subscription cost in the UK?",
        answer: "Audible UK costs £7.99/month for 1 audiobook credit plus unlimited listening to the Audible Plus Catalog. The 24-credit annual plan costs £109.99/year (working out to just £4.58 per book)."
      },
      {
        question: "Do Amazon Prime members get a special Audible deal in the UK?",
        answer: "Yes, Prime members signing up for Audible receive a 3-month trial for 99p or an extended 30-day trial with 2 free credits instead of 1."
      },
      {
        question: "How does the Audible cancellation retention offer work?",
        answer: "If you go to cancel your Audible membership online, Audible frequently presents an immediate retention offer to keep your subscription for £3.99/month for the next 3 months."
      },
      {
        question: "Do I keep my downloaded audiobooks if I cancel Audible?",
        answer: "Yes! Any audiobook purchased with credits or money is yours to keep forever in your Audible library, even after your membership ends."
      }
    ]
  },

  xbox_gamepass_uk: {
    slug: "xbox-game-pass-uk",
    aliases: ["xbox-game-pass", "game-pass-ultimate-uk"],
    catchyH1: "Xbox Game Pass Ultimate UK 2026: Black Ops 6, Cloud & The 58% Conversion Hack",
    seoKeywords: [
      "Xbox Game Pass Ultimate UK price 2026",
      "Game Pass Ultimate cheap CDKeys UK",
      "Call of Duty Black Ops 6 on Game Pass UK",
      "Xbox Core to Ultimate conversion ratio",
      "EE Xbox Game Pass add-on"
    ],
    faqs: [
      {
        question: "How much is Xbox Game Pass Ultimate in the UK in 2026?",
        answer: "Game Pass Ultimate costs £14.99/month in the UK. It includes day-one Xbox first-party titles, EA Play, online multiplayer, PC Game Pass, and Xbox Cloud Gaming."
      },
      {
        question: "What is the Xbox Game Pass Core to Ultimate conversion hack?",
        answer: "You can buy discounted Xbox Game Pass Core codes (via CDKeys or ShopTo for ~£35/year) and convert them to Ultimate at a 3:2 ratio, slashing the annual cost by over 50%."
      },
      {
        question: "Is Call of Duty: Black Ops 6 included in Game Pass UK?",
        answer: "Yes, Call of Duty: Black Ops 6 launched day one on Xbox Game Pass Ultimate and PC Game Pass with full campaign and multiplayer."
      },
      {
        question: "Can I get Game Pass Ultimate through EE in the UK?",
        answer: "Yes, EE offers Xbox Game Pass Ultimate as a monthly add-on with direct bill charging, frequently bundled with mobile gaming data passes."
      }
    ]
  },

  playstation_plus_uk: {
    slug: "playstation-plus-uk",
    aliases: ["ps-plus", "ps-plus-uk"],
    catchyH1: "PlayStation Plus UK 2026: Essential, Extra & The 15% ShopTo Wallet Top-Up Hack",
    seoKeywords: [
      "PlayStation Plus UK price 2026",
      "PS Plus Extra game catalog UK",
      "Cheapest way to buy PS Plus UK",
      "ShopTo PSN wallet cards discount",
      "Days of Play PS Plus sale 2026"
    ],
    faqs: [
      {
        question: "How much does PlayStation Plus cost in the UK in 2026?",
        answer: "PS Plus Essential is £6.99/month (£59.99/year), PS Plus Extra is £10.99/month (£99.99/year), and PS Plus Premium is £13.49/month (£119.99/year)."
      },
      {
        question: "What is the difference between PS Plus Essential and Extra?",
        answer: "Essential gives you online multiplayer and 3 monthly claimable games. Extra adds an on-demand Game Catalog with over 400 blockbuster PS4 and PS5 titles including God of War, Spider-Man, and Horizon."
      },
      {
        question: "How can I get PlayStation Plus cheaper in the UK?",
        answer: "Buy discounted PlayStation Network wallet top-up cards from retailers like ShopTo or Currys (saving 10%-15%), and renew during the annual 'Days of Play' or Black Friday sales when Sony offers 20%-25% off."
      },
      {
        question: "Does PS Plus Premium include PS1 and PS2 classics in the UK?",
        answer: "Yes, Premium includes the Classic Games Catalog, PS3 cloud streaming, and full-game time-limited trials for new releases."
      }
    ]
  },

  deliveroo_plus_uk: {
    slug: "deliveroo-plus-uk",
    aliases: ["deliveroo-plus", "deliveroo-prime-uk"],
    catchyH1: "Deliveroo Plus UK 2026: Pricing, Free Delivery & The 100% Free Amazon Prime Perk",
    seoKeywords: [
      "Deliveroo Plus free with Amazon Prime UK",
      "Deliveroo Plus price UK 2026",
      "Deliveroo Plus Silver vs Gold UK",
      "Deliveroo free delivery order minimum",
      "Revolut free Deliveroo Plus perk"
    ],
    faqs: [
      {
        question: "How do I get Deliveroo Plus completely free in the UK?",
        answer: "If you have an active Amazon Prime UK membership, you can link your Deliveroo account to get Deliveroo Plus Silver (free delivery on restaurant and grocery orders of £15+) 100% free for as long as you have Prime."
      },
      {
        question: "What is the difference between Deliveroo Plus Silver and Gold?",
        answer: "Silver costs £3.49/month (or free with Prime) and grants free delivery on orders over £15. Gold costs £7.99/month and lowers the free delivery threshold to £10."
      },
      {
        question: "Does Revolut offer Deliveroo Plus in the UK?",
        answer: "Yes, Revolut Premium and Metal subscription plans include complimentary Deliveroo Plus memberships as part of their lifestyle partnerships."
      },
      {
        question: "Can I use Deliveroo Plus for supermarket grocery deliveries?",
        answer: "Yes, Deliveroo Plus free delivery applies to partner grocery stores including Waitrose, Co-op, Sainsbury's, and Morrisons for orders meeting the minimum basket size."
      }
    ]
  },

  uber_one_uk: {
    slug: "uber-one-uk",
    aliases: ["uber-one", "uber-eats-pass-uk"],
    catchyH1: "Uber One UK 2026: 5% Ride Credit, £0 Eats Delivery & Student Beans 50% Off",
    seoKeywords: [
      "Uber One UK price 2026",
      "Uber One student discount UK",
      "Uber Eats free delivery membership UK",
      "Is Uber One worth it in London UK",
      "Amex statement credit Uber One UK"
    ],
    faqs: [
      {
        question: "How much does Uber One cost in the UK?",
        answer: "Uber One is £5.99/month or £59.99/year. Students can get a 50% discount via Student Beans or UNiDAYS, bringing the price down to £2.99/month."
      },
      {
        question: "What benefits does Uber One give on Uber rides?",
        answer: "Members earn 5% credit back on eligible rides (UberX, Comfort, Exec) to spend on future rides or food orders, and get matched with top-rated drivers."
      },
      {
        question: "What benefits does Uber One give on Uber Eats in the UK?",
        answer: "You receive £0 delivery fees on restaurant orders over £15 and grocery orders over £25, along with exclusive member-only promotions and a £5 credit if the delivery arrives past the latest arrival estimate."
      },
      {
        question: "Does American Express offer an Uber One perk in the UK?",
        answer: "American Express frequently offers targeted statement credits where cardmembers get 10%–20% cashback on Uber One subscriptions or rides."
      }
    ]
  },

  chatgpt_plus_uk: {
    slug: "chatgpt-plus-uk",
    aliases: ["chatgpt-plus", "chatgpt-uk"],
    catchyH1: "ChatGPT Plus UK 2026: GPT-4o, Advanced Voice, Canvas & Free FX Card Hacks",
    seoKeywords: [
      "ChatGPT Plus price UK 2026",
      "How to avoid USD FX fee ChatGPT Plus UK",
      "ChatGPT Plus worth it UK",
      "GPT-4o Advanced Voice mode UK",
      "Free alternative to ChatGPT Plus UK"
    ],
    faqs: [
      {
        question: "How much does ChatGPT Plus cost in the UK in 2026?",
        answer: "ChatGPT Plus is billed at $20/month plus UK VAT (approximately £19.20 to £19.99/month depending on foreign exchange rates and 20% VAT)."
      },
      {
        question: "How can I avoid bank foreign exchange fees on ChatGPT in the UK?",
        answer: "Pay using fee-free cards like Monzo, Starling, Revolut, or Chase UK. Traditional high street banks charge a 2.99% non-sterling transaction fee on top of the subscription."
      },
      {
        question: "Is there a free way to access GPT-4o in the UK?",
        answer: "Yes, Microsoft Copilot (built into Windows and Edge) provides free access to GPT-4o and DALL-E image generation with no monthly subscription."
      },
      {
        question: "What exclusive features does ChatGPT Plus unlock?",
        answer: "Subscribers get real-time Advanced Voice Mode with low latency, Canvas for coding and writing, file analysis, custom GPT creation, and 5x higher message limits on GPT-4o."
      }
    ]
  },

  claude_pro_uk: {
    slug: "claude-pro-uk",
    aliases: ["claude-pro", "claude-ai-uk"],
    catchyH1: "Claude Pro UK 2026: Claude 3.5 Sonnet, 5x Limits, Artifacts & Zero FX Hack",
    seoKeywords: [
      "Claude Pro UK price 2026",
      "Claude 3.5 Sonnet coding benchmark UK",
      "Claude Pro vs ChatGPT Plus UK",
      "How to get Claude Pro cheaper UK",
      "Claude Artifacts live code preview"
    ],
    faqs: [
      {
        question: "How much does Claude Pro cost in the UK?",
        answer: "Claude Pro is $20/month plus UK VAT (approximately £19.20 to £19.99/month). Pay with zero-FX cards like Monzo or Starling to prevent bank conversion fees."
      },
      {
        question: "What makes Claude Pro better than other AI assistants in the UK?",
        answer: "Claude 3.5 Sonnet is widely considered the best AI model for software development, technical writing, and complex logical reasoning. It features a 200,000-token context window and interactive 'Artifacts' that run live web apps and SVG graphics."
      },
      {
        question: "Does Claude offer a free tier in the UK?",
        answer: "Yes, Claude 3.5 Sonnet is completely free on claude.ai with daily usage limits that reset every few hours."
      },
      {
        question: "What is the difference between Claude Free and Claude Pro?",
        answer: "Claude Pro grants 5 times more usage, priority bandwidth during peak hours, and early access to newly released experimental models."
      }
    ]
  },

  microsoft_365_uk: {
    slug: "microsoft-365-uk",
    aliases: ["office-365-uk", "m365-uk"],
    catchyH1: "Microsoft 365 UK 2026: Word, Excel & The £13.33/Year Family 6-Way Storage Split",
    seoKeywords: [
      "Microsoft 365 Family UK price 2026",
      "Microsoft 365 student discount ac.uk",
      "Amazon UK Microsoft 365 box deal",
      "Cheapest way to get OneDrive 1TB UK",
      "Microsoft 365 Family split cost"
    ],
    faqs: [
      {
        question: "How much is Microsoft 365 in the UK in 2026?",
        answer: "Microsoft 365 Personal (1 person, 1TB) is £59.99/year. Microsoft 365 Family (up to 6 people, 6TB total) is £79.99/year."
      },
      {
        question: "How can I get Microsoft 365 for just £13.33/year in the UK?",
        answer: "Buy a Microsoft 365 Family subscription and share it with 5 family members or flatmates. Each person gets their own private account and 1TB OneDrive cloud storage, costing only £13.33 per person per year."
      },
      {
        question: "Can UK university students get Microsoft 365 for free?",
        answer: "Yes! Students and teachers at UK educational institutions with a valid .ac.uk email address get Microsoft 365 Education 100% free of charge."
      },
      {
        question: "Does Amazon UK sell discounted Microsoft 365 subscription cards?",
        answer: "Yes, during Amazon Prime Day and Black Friday, Amazon UK frequently sells 15-month Microsoft 365 Family subscription boxes for around £49.99."
      }
    ]
  },

  google_one_uk: {
    slug: "google-one-uk",
    aliases: ["google-one", "google-drive-uk"],
    catchyH1: "Google One UK 2026: 100GB to 2TB Storage, Magic Editor & Family Sharing",
    seoKeywords: [
      "Google One price UK 2026",
      "Google Photos storage full UK",
      "Google One 100GB annual price UK",
      "Gemini Advanced 2TB Google One UK",
      "Google One family share how many accounts"
    ],
    faqs: [
      {
        question: "How much does Google One storage cost in the UK?",
        answer: "Google One 100GB is £1.59/month (or £15.99/year), 200GB is £2.49/month (or £24.99/year), and 2TB is £7.99/month (or £79.99/year)."
      },
      {
        question: "Can I share Google One storage with my family in the UK?",
        answer: "Yes, any Google One plan can be shared with up to 5 additional family members at no extra charge. Everyone maintains private, separate Google accounts."
      },
      {
        question: "What is the Google One AI Premium plan?",
        answer: "The AI Premium plan (£18.99/month) includes 2TB cloud storage and access to Google's most capable AI model, Gemini Advanced 1.5 Pro, with integration into Docs and Gmail."
      },
      {
        question: "Does Google One offer a free trial in the UK?",
        answer: "Purchasing a Google Pixel smartphone or Chromebook in the UK typically comes with 3 to 6 months of complimentary Google One cloud storage."
      }
    ]
  },

  icloud_uk: {
    slug: "icloud-plus-uk",
    aliases: ["icloud-plus", "icloud-uk"],
    catchyH1: "iCloud+ UK 2026: 50GB to 2TB, Safari Private Relay & Hide My Email",
    seoKeywords: [
      "iCloud plus UK price 2026",
      "iCloud 50GB price UK",
      "Apple Private Relay UK",
      "iCloud 200GB family sharing price UK",
      "How to upgrade iCloud storage UK"
    ],
    faqs: [
      {
        question: "How much is iCloud+ in the UK in 2026?",
        answer: "iCloud+ 50GB is £0.99/month, 200GB is £2.99/month, and 2TB is £8.99/month. Higher tiers (6TB and 12TB) are available for power users."
      },
      {
        question: "What privacy features come with iCloud+ in the UK?",
        answer: "iCloud+ unlocks iCloud Private Relay (which encrypts your Safari DNS traffic like a lightweight VPN), Hide My Email (disposable aliases), and Custom Email Domains."
      },
      {
        question: "Can I share my iCloud storage with family in the UK?",
        answer: "Yes, the 200GB (£2.99) and 2TB (£8.99) plans can be shared with up to 5 family members via Apple Family Sharing without sharing private photos or messages."
      },
      {
        question: "Is it cheaper to get iCloud+ through Apple One?",
        answer: "Yes, if you already pay for Apple Music or Apple TV+, upgrading to Apple One (£18.95/mo Individual or £24.95/mo Family) bundles iCloud+ and saves over £10/month."
      }
    ]
  },

  nordvpn_uk: {
    slug: "nordvpn-uk",
    aliases: ["nordvpn", "nordvpn-gb"],
    catchyH1: "NordVPN UK 2026: Stream BBC iPlayer Abroad, 74% Off 2-Year Deal & Cashback",
    seoKeywords: [
      "NordVPN UK price 2026",
      "Watch BBC iPlayer outside UK VPN",
      "NordVPN Quidco TopCashback deal",
      "NordVPN 2 year plan discount code UK",
      "Best streaming VPN UK"
    ],
    faqs: [
      {
        question: "How much does NordVPN cost in the UK?",
        answer: "NordVPN's 2-year deal costs £2.69/month plus 3 extra months free, saving up to 74% compared to paying £11.49 month-to-month."
      },
      {
        question: "Can I use NordVPN to stream BBC iPlayer when traveling outside the UK?",
        answer: "Yes, NordVPN provides high-speed UK servers in London, Manchester, and Glasgow that unblock BBC iPlayer, ITVX, and Channel 4 from abroad in 4K."
      },
      {
        question: "How can I get extra cashback on NordVPN in the UK?",
        answer: "TopCashback and Quidco regularly offer 30% to 50% cashback on new NordVPN multi-year subscriptions, effectively reducing the net cost under £1.50/month."
      },
      {
        question: "How many devices can I use on one NordVPN account?",
        answer: "One NordVPN subscription protects up to 10 devices simultaneously, including Windows PCs, Macs, iPhones, Androids, and Fire TV Sticks."
      }
    ]
  },

  sky_cinema_uk: {
    slug: "sky-cinema-uk",
    aliases: ["sky-cinema", "sky-tv-uk"],
    catchyH1: "Sky Cinema & TV UK 2026: 1,000+ Blockbusters, Free Paramount+ & Vue Tickets",
    seoKeywords: [
      "Sky Cinema price UK 2026",
      "Sky Cinema free Paramount plus trick",
      "Sky VIP free Vue cinema tickets",
      "Sky Stream Cinema package deal",
      "Sky Cinema upgrade cost existing customer"
    ],
    faqs: [
      {
        question: "How much is Sky Cinema in the UK in 2026?",
        answer: "Sky Cinema can be added to an existing Sky subscription for £10/month, or purchased as a complete Sky Stream Entertainment & Cinema bundle for £26/month on a 24-month contract."
      },
      {
        question: "Does Sky Cinema include Paramount+ for free?",
        answer: "Yes! All Sky Cinema subscribers get full access to Paramount+ Standard (£6.99/month value) at £0 complimentary extra cost."
      },
      {
        question: "What is the Sky VIP Vue cinema ticket perk?",
        answer: "Sky VIP members with Sky Cinema get 2 free cinema tickets every month to use at Vue cinemas across the UK, worth up to £20 monthly."
      },
      {
        question: "Do movies premiere on Sky Cinema earlier than other platforms?",
        answer: "Yes, Sky Cinema features a new movie premiere every single day, with theatrical releases dropping on Sky months before competing streaming platforms."
      }
    ]
  }
};

/**
 * Helper to fetch a UK subscription by slug or alias, including Redis check
 */
export async function getUKSubscriptionBySlug(slug) {
  if (!slug) return null;
  const cleanSlug = slug.toLowerCase().trim();

  const seoEntry = Object.entries(SUBSCRIPTIONS_SEO_MAP_UK).find(
    ([id, data]) => id === cleanSlug || data.slug === cleanSlug || (data.aliases && data.aliases.includes(cleanSlug))
  );

  const matchedId = seoEntry ? seoEntry[0] : cleanSlug;

  let catalogItem = UK_SUBSCRIPTIONS_CATALOG.find(
    (sub) => sub.id === matchedId || sub.id === cleanSlug
  );

  // Check Redis for on-demand generated UK brands
  if (!catalogItem && redisClient) {
    try {
      const raw = await redisClient.get(`ondemand_sub_gb_${cleanSlug}`);
      if (raw) {
        catalogItem = typeof raw === "string" ? JSON.parse(raw) : raw;
      }
    } catch {}
  }

  if (!catalogItem) return null;

  const seoData = seoEntry ? seoEntry[1] : (catalogItem.seo || {
    slug: catalogItem.id,
    catchyH1: `${catalogItem.name} UK Subscription Plans 2026: Pricing, Discounts & Deals`,
    seoKeywords: [`${catalogItem.name} UK plans`, `${catalogItem.name} discount`],
    faqs: [
      {
        question: `How to get ${catalogItem.name} at a discount in the UK?`,
        answer: `Check our verified 4-Level Savings Blueprint on this page to claim carrier perks from EE/O2/Vodafone, gift card discounts, and bundle passes.`
      }
    ]
  });

  return {
    ...catalogItem,
    country: "GB",
    currencySymbol: "£",
    seo: seoData
  };
}

export function getAllUKSubscriptionSlugs() {
  return UK_SUBSCRIPTIONS_CATALOG.map((sub) => {
    const seo = SUBSCRIPTIONS_SEO_MAP_UK[sub.id];
    return seo?.slug || sub.id;
  });
}
