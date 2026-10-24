import { CA_SUBSCRIPTIONS_CATALOG } from "./subscriptionsCatalogCA";
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
 * for all 25 Canadian (CA) Subscription Brands.
 */
export const SUBSCRIPTIONS_SEO_MAP_CA = {
  crave_ca: {
    slug: "crave-canada",
    aliases: ["crave", "crave-ca", "crave-tv"],
    catchyH1: "Crave Canada Plans 2026: Pricing, HBO Max Originals, 4K & Bell Fibe Discounts",
    seoKeywords: [
      "Crave Canada plans pricing 2026",
      "Crave free with Bell Fibe TV",
      "Crave basic with ads vs premium cost",
      "How to watch House of the Dragon Canada",
      "Crave subscription student discount",
      "Crave promo code Canada"
    ],
    faqs: [
      {
        question: "How can I get Crave for cheap or free in Canada?",
        answer: "Bell Fibe TV and Bell Mobility customers frequently receive Crave bundled into their entertainment packs or as a promotional monthly bill credit. Virgin Plus members also get exclusive lounge discounts via the Virgin Plus app."
      },
      {
        question: "Does Crave include all HBO and Max content in Canada?",
        answer: "Yes, Crave holds exclusive Canadian streaming rights for all HBO series (House of the Dragon, The Last of Us, White Lotus, Succession) and Max Originals, alongside Starz add-ons and Canadian hits like Letterkenny."
      },
      {
        question: "What is the difference between Crave Basic with Ads and Premium?",
        answer: "Crave Basic with Ads ($9.99/mo) is restricted to mobile and web browsers only in 720p. Premium ($22.00/mo) unlocks 4K Ultra HD on living room smart TVs, Apple TV, 4 concurrent streams, and 100% ad-free offline downloads."
      },
      {
        question: "Can I save money on Crave by paying annually?",
        answer: "Yes, choosing Crave's annual plan saves up to 25% compared to paying monthly over 12 months."
      }
    ]
  },

  netflix_ca: {
    slug: "netflix-canada",
    aliases: ["netflix-ca", "netflix-cad"],
    catchyH1: "Netflix Canada Plans 2026: Pricing, 4K Screens & The Legal Telus Stream+ $20 Bundle Trick",
    seoKeywords: [
      "Netflix Canada price 2026",
      "Netflix free with Telus Stream+",
      "Netflix standard with ads cost Canada",
      "Netflix Canada cheap subscription",
      "How to get Netflix cheaper in Canada",
      "Netflix premium 4k price Canada"
    ],
    faqs: [
      {
        question: "How can I save up to 40% on Netflix in Canada?",
        answer: "Telus customers can bundle Netflix Standard with Ads, Disney+, and Amazon Prime Video together through Telus Stream+ for just $20/month total, saving approximately $18 every single month."
      },
      {
        question: "How much does Netflix cost in Canada in 2026?",
        answer: "Standard with Ads costs $5.99/mo (Full HD 1080p, 2 streams), Standard Ad-Free costs $16.49/mo, and Premium 4K costs $20.99/mo (4K HDR, 4 streams, spatial audio)."
      },
      {
        question: "Can I use PC Optimum points to pay for Netflix Canada?",
        answer: "Yes, buying Netflix gift cards during Shoppers Drug Mart 20x PC Optimum points promotions gives you 30% back in points value towards groceries and pharmacy essentials."
      },
      {
        question: "Does Netflix Canada allow password sharing outside households?",
        answer: "Netflix Canada charges an extra $7.99/month for an 'Extra Member' slot outside your primary household on Standard and Premium plans."
      }
    ]
  },

  disney_ca: {
    slug: "disney-plus-canada",
    aliases: ["disney-plus-ca", "disney-ca"],
    catchyH1: "Disney+ Canada Plans 2026: Pricing, Shōgun 4K & Rogers Ignite Bundle Deals",
    seoKeywords: [
      "Disney plus Canada price 2026",
      "Disney plus free with Rogers",
      "Disney plus Telus stream bundle",
      "Disney plus Canada student discount",
      "How to get Disney plus cheap Canada",
      "Disney plus annual plan Canada"
    ],
    faqs: [
      {
        question: "How to get Disney+ included free with Canadian telecom?",
        answer: "Rogers Wireless customers on select 5G+ Infinite tiers can activate complimentary 6-month Disney+ trials. Telus subscribers can bundle it into Telus Stream+ for deeply discounted monthly rates."
      },
      {
        question: "Does Disney+ Canada include Hulu shows?",
        answer: "Yes, in Canada, Hulu content is integrated directly into the 'Star' brand tile inside Disney+, giving subscribers access to Shōgun, The Bear, Only Murders in the Building, and FX dramas."
      },
      {
        question: "What is the cheapest Disney+ plan in Canada?",
        answer: "The Standard with Ads tier is $7.99/month for Full HD 1080p streaming on 2 devices with limited commercial breaks."
      },
      {
        question: "How much do you save with the Disney+ Canadian annual subscription?",
        answer: "The Premium Annual plan costs $149.99/year instead of $179.88 paid monthly, providing 2 full months completely free."
      }
    ]
  },

  prime_ca: {
    slug: "amazon-prime-canada",
    aliases: ["prime-canada", "prime-video-ca", "amazon-prime-ca"],
    catchyH1: "Amazon Prime Canada 2026: Pricing, The Boys, 1-Day Delivery & Free DoorDash DashPass",
    seoKeywords: [
      "Amazon Prime Canada price 2026",
      "Amazon Prime free DoorDash DashPass",
      "Prime Video student discount Canada",
      "Amazon Prime annual plan Canada",
      "How to get free Prime Canada",
      "Prime Video channels Canada"
    ],
    faqs: [
      {
        question: "Does Amazon Prime Canada include free DoorDash DashPass?",
        answer: "Yes! Every Amazon Prime member in Canada is eligible for 1 full year of DoorDash DashPass for $0 completely free ($120 CAD annual value), saving on food delivery service fees."
      },
      {
        question: "How much does Amazon Prime cost in Canada?",
        answer: "Prime is $9.99/month or $99.00/year (which works out to $8.25/month). Students receive a 6-month free trial, then pay just $4.99/month."
      },
      {
        question: "What benefits come with Amazon Prime Canada?",
        answer: "Unlimited fast free 1-Day & 2-Day delivery, Prime Video, Amazon Music Prime, Prime Gaming free PC games, Amazon Photos unlimited storage, and 1-year free DashPass."
      },
      {
        question: "Can I share my Amazon Prime Canada membership with family?",
        answer: "Yes, you can share digital delivery and video perks with another adult in your Amazon Household."
      }
    ]
  },

  apple_tv_ca: {
    slug: "apple-tv-plus-canada",
    aliases: ["apple-tv-ca", "appletv-canada"],
    catchyH1: "Apple TV+ Canada 2026: Pricing, Ted Lasso 4K & Best Buy 3-Month Free Trick",
    seoKeywords: [
      "Apple TV plus Canada price 2026",
      "Apple TV plus free trial Canada",
      "Apple TV Best Buy Canada free code",
      "Apple One bundle Canada price",
      "Ted Lasso Slow Horses streaming Canada"
    ],
    faqs: [
      {
        question: "How to get 3 months of Apple TV+ completely free in Canada?",
        answer: "My Best Buy Canada members can claim a 3-month free trial code on BestBuy.ca without buying any hardware. New Apple hardware purchases also include 3 free months."
      },
      {
        question: "How much does Apple TV+ cost monthly in Canada?",
        answer: "Apple TV+ costs $12.99/month in Canada and supports 4K Dolby Vision, Dolby Atmos, and Family Sharing for up to 6 family members."
      },
      {
        question: "Is Apple TV+ included in the Canadian Apple One bundle?",
        answer: "Yes, Apple One Individual ($22.95/mo) bundles Apple TV+, Apple Music, Apple Arcade, and 50GB iCloud storage, saving $12/month."
      },
      {
        question: "Can I watch Apple TV+ on smart TVs and Android devices?",
        answer: "Yes, the Apple TV app is available on Samsung, LG, Sony, Roku, Fire TV, PlayStation, Xbox, and via web browser at tv.apple.com."
      }
    ]
  },

  paramount_ca: {
    slug: "paramount-plus-canada",
    aliases: ["paramount-plus-ca", "paramount-ca"],
    catchyH1: "Paramount+ Canada Plans 2026: Pricing, Yellowstone, Star Trek & Prime Channels Guide",
    seoKeywords: [
      "Paramount plus Canada price 2026",
      "Paramount plus Yellowstone Canada",
      "Paramount plus Canada promo code",
      "Paramount plus Prime Video channels",
      "Paramount plus basic with ads Canada"
    ],
    faqs: [
      {
        question: "Where can I stream Yellowstone and 1923 in Canada?",
        answer: "Paramount+ is the exclusive Canadian streaming home for the entire Taylor Sheridan Yellowstone universe (Yellowstone, 1923, 1883, Mayor of Kingstown, Tulsa King)."
      },
      {
        question: "What are the Paramount+ pricing tiers in Canada?",
        answer: "Basic with Ads is $6.99/mo (1080p, 1 stream), Standard Ad-Free is $10.99/mo (1080p, 2 streams), and Premium 4K is $13.99/mo (4K HDR, Dolby Atmos, 4 streams)."
      },
      {
        question: "Can I subscribe to Paramount+ through Amazon Prime Video in Canada?",
        answer: "Yes, you can add Paramount+ as an Amazon Prime Video Channel for $10.99/month for consolidated Canadian billing."
      },
      {
        question: "Are live sports included on Paramount+ Canada?",
        answer: "Paramount+ Canada streams UEFA Champions League and Europa League soccer matches live alongside CBS content."
      }
    ]
  },

  cbc_gem_ca: {
    slug: "cbc-gem-canada",
    aliases: ["cbc-gem", "cbcgem-ca", "cbc-canada"],
    catchyH1: "CBC Gem Premium Plans 2026: Pricing, Heartland, Schitt's Creek & Legal $0 Free Stream",
    seoKeywords: [
      "CBC Gem Canada cost 2026",
      "CBC Gem free tier vs premium",
      "How to watch Heartland free Canada",
      "CBC News Network live stream",
      "CBC Gem promo code Canada"
    ],
    faqs: [
      {
        question: "Is CBC Gem really 100% free for Canadians?",
        answer: "Yes, CBC Gem provides an extensive free tier with thousands of hours of Canadian programming, Heartland, Schitt's Creek, and local news with commercial breaks."
      },
      {
        question: "What does CBC Gem Premium offer for $5.99/month?",
        answer: "Premium removes all on-demand advertisements, provides 24/7 live streaming of the CBC News Network, and unlocks early access to French Radio-Canada series."
      },
      {
        question: "Can I watch live Olympic Games on CBC Gem?",
        answer: "Yes, CBC Gem is Canada's official Olympic digital broadcaster, streaming all medal events live with no paywall required."
      },
      {
        question: "Is there a free trial for CBC Gem Premium?",
        answer: "Yes, new subscribers get a 30-day free trial of CBC Gem Premium."
      }
    ]
  },

  sportsnet_plus_ca: {
    slug: "sportsnet-plus-canada",
    aliases: ["sportsnet-ca", "sn-now-canada", "sportsnet-plus"],
    catchyH1: "Sportsnet+ Canada Plans 2026: Pricing, NHL Hockey, Blue Jays MLB & Rogers TV Logins",
    seoKeywords: [
      "Sportsnet plus Canada price 2026",
      "Sportsnet plus NHL hockey stream",
      "Sportsnet free with Rogers Ignite",
      "Sportsnet plus standard vs premium",
      "How to watch Toronto Blue Jays live"
    ],
    faqs: [
      {
        question: "How can I get Sportsnet+ for $0 with my cable plan?",
        answer: "If you subscribe to Sportsnet on Rogers Ignite TV, Bell Fibe, or Telus Optik TV, you can log in to Sportsnet+ at $0 additional cost using your TV service credentials."
      },
      {
        question: "What is the difference between Sportsnet+ Standard and Premium?",
        answer: "Standard ($19.99/mo) covers in-market regional NHL games and all Blue Jays MLB games. Premium ($34.99/mo) includes over 1,000 out-of-market NHL games and the entire WWE Network."
      },
      {
        question: "How much does the Sportsnet+ Annual Pass save?",
        answer: "The Premium Annual Pass costs $249.99/year, saving approximately $170 compared to paying $34.99 each month over a full 12-month sports calendar."
      },
      {
        question: "Can I watch WWE live events on Sportsnet+?",
        answer: "Yes, the WWE Network (WrestleMania, Royal Rumble, Raw, SmackDown) is bundled directly inside Sportsnet+ Premium in Canada."
      }
    ]
  },

  tsn_plus_ca: {
    slug: "tsn-plus-canada",
    aliases: ["tsn-ca", "tsn-direct", "tsn-plus"],
    catchyH1: "TSN+ & TSN Direct Canada 2026: Pricing, NFL, CFL Grey Cup & Bell Fibe Perks",
    seoKeywords: [
      "TSN direct Canada cost 2026",
      "TSN plus free with Bell TV",
      "How to watch NFL RedZone Canada",
      "TSN annual pass discount",
      "CFL Grey Cup live stream TSN"
    ],
    faqs: [
      {
        question: "Can I watch TSN online free if I have Bell Fibe TV?",
        answer: "Yes, Bell TV and Rogers TV subscribers who have TSN in their television channel lineup can stream all 5 TSN feeds online for free by logging in with their provider account."
      },
      {
        question: "What sports are broadcast on TSN in Canada?",
        answer: "TSN is Canada's home for the NFL (including Sunday Ticket & RedZone feeds), CFL Grey Cup, FIFA World Cup, MLS, Formula 1, tennis grand slams (Wimbledon, US Open), and IIHF World Juniors."
      },
      {
        question: "What is the cost of TSN Direct in Canada?",
        answer: "TSN Direct is $19.99/month or $199.90/year (which gives you 12 months for the price of 10)."
      },
      {
        question: "What is TSN+ standalone add-on?",
        answer: "TSN+ is an $8.00/month digital add-on providing augmented camera angles, live telemetry data, and exclusive sports feeds not broadcast on linear television."
      }
    ]
  },

  stacktv_ca: {
    slug: "stacktv-canada",
    aliases: ["stacktv-ca", "stack-tv"],
    catchyH1: "STACKTV Canada 2026: Pricing, 16 Networks Bundle & Amazon Prime Channels Free Trial",
    seoKeywords: [
      "STACKTV Canada price 2026",
      "STACKTV 14-day free trial Prime",
      "STACKTV channels list Canada",
      "How to watch Global TV HGTV online",
      "STACKTV discount promo code"
    ],
    faqs: [
      {
        question: "What channels are included in STACKTV Canada?",
        answer: "STACKTV bundles 16 top Canadian networks: Global TV, HGTV Canada, Food Network, W Network, Showcase, Slice, Adult Swim, National Geographic, Lifetime, History, and more."
      },
      {
        question: "How much does STACKTV cost per month?",
        answer: "STACKTV is $12.99/month, typically added through Amazon Prime Video Channels or FuboTV Canada."
      },
      {
        question: "Can I get a free trial of STACKTV?",
        answer: "Yes, Amazon Prime Video Channels offers a 14-day completely free trial for all new Canadian STACKTV subscribers."
      },
      {
        question: "Can I watch live broadcast TV on STACKTV?",
        answer: "Yes, STACKTV features live broadcast streams of all 16 channels in addition to thousands of hours of on-demand box sets."
      }
    ]
  },

  discovery_ca: {
    slug: "discovery-plus-canada",
    aliases: ["discovery-ca", "discoveryplus-ca"],
    catchyH1: "Discovery+ Canada Plans 2026: Pricing, Shark Week 4K & Ad-Free Discounts",
    seoKeywords: [
      "Discovery plus Canada price 2026",
      "Discovery plus free trial Canada",
      "Discovery plus ad-free cost Canada",
      "How to watch Shark Week Canada",
      "Discovery plus Prime Video channels"
    ],
    faqs: [
      {
        question: "How much does Discovery+ cost in Canada?",
        answer: "Discovery+ Ad-Lite is $5.99/month with limited ads, while the 100% Ad-Free tier is $8.99/month."
      },
      {
        question: "What content is available on Discovery+ Canada?",
        answer: "Over 70,000 episodes from Discovery Channel, TLC, Animal Planet, Investigation Discovery (ID), HGTV, Food Network, and Magnolia Network."
      },
      {
        question: "Is there a free trial for Discovery+ in Canada?",
        answer: "Yes, both direct signup and Amazon Prime Video Channels offer a 7-day free trial."
      },
      {
        question: "Does Discovery+ support 4K streaming in Canada?",
        answer: "Yes, premier nature documentaries like Planet Earth and select natural history specials stream in full 4K Ultra HD on the Ad-Free tier."
      }
    ]
  },

  hayu_ca: {
    slug: "hayu-canada",
    aliases: ["hayu-ca", "hayu-tv"],
    catchyH1: "Hayu Canada 2026: Pricing, Real Housewives, Below Deck & 25% Off Annual Pass",
    seoKeywords: [
      "Hayu Canada cost 2026",
      "Hayu free trial Canada",
      "Hayu annual plan discount",
      "How to watch Real Housewives Canada",
      "Hayu promo code Canada"
    ],
    faqs: [
      {
        question: "When are new episodes of Real Housewives added to Hayu in Canada?",
        answer: "New episodes are added to Hayu on the exact same day they air on US television, commercial-free."
      },
      {
        question: "What is the cost of Hayu in Canada?",
        answer: "Hayu costs $6.99/month, $33.99 for 6 months, or $61.99/year (saving 25% on annual billing)."
      },
      {
        question: "Can I download episodes to watch offline on Hayu Canada?",
        answer: "Yes, the Hayu iOS and Android apps allow unlimited offline episode downloads for travel and commuting."
      },
      {
        question: "Can I get Hayu through Amazon Prime Video Channels?",
        answer: "Yes, Hayu can be added as a Prime Video Channel for $6.99/month with a 7-day free trial."
      }
    ]
  },

  spotify_ca: {
    slug: "spotify-canada",
    aliases: ["spotify-ca", "spotify-cad"],
    catchyH1: "Spotify Canada Plans 2026: Pricing, Family Split & Costco $99 Annual Gift Card Hack",
    seoKeywords: [
      "Spotify Canada price 2026",
      "Spotify student discount Canada",
      "Spotify Costco gift card Canada",
      "Spotify family plan Canada cost",
      "Spotify premium free trial Canada"
    ],
    faqs: [
      {
        question: "How can I get Spotify Premium cheaper in Canada?",
        answer: "Buying an annual Spotify gift card at Costco Canada wholesale costs $99/year, saving approximately $33 compared to paying $10.99 monthly. Students pay only $5.99/month."
      },
      {
        question: "How much does Spotify Family cost in Canada?",
        answer: "Spotify Family is $16.99/month and allows up to 6 individual accounts living at the same address, dropping the cost to less than $2.85 per user."
      },
      {
        question: "Does Spotify Student include anything else in Canada?",
        answer: "Spotify Student offers a 50% discount at $5.99/month for verified Canadian college and university students via SheerID."
      },
      {
        question: "Does Spotify Premium include audiobooks in Canada?",
        answer: "Yes, Spotify Premium individual subscribers receive 15 hours of complimentary audiobook listening time every month."
      }
    ]
  },

  apple_one_ca: {
    slug: "apple-one-canada",
    aliases: ["apple-one-ca", "appleone-canada"],
    catchyH1: "Apple One Canada 2026: Pricing, Family Plan & Shoppers 20x Points Hack",
    seoKeywords: [
      "Apple One Canada price 2026",
      "Apple One family bundle Canada",
      "Apple One premier iCloud Canada",
      "Is Apple One worth it in Canada",
      "Apple One free trial Canada"
    ],
    faqs: [
      {
        question: "How much does Apple One cost in Canada?",
        answer: "Individual is $22.95/month, Family is $28.95/month (up to 6 members with 200GB iCloud), and Premier is $37.95/month (adds Apple News+, Apple Fitness+, and 2TB iCloud)."
      },
      {
        question: "How much money does Apple One save compared to separate services?",
        answer: "The Individual plan saves $12.01/month ($144/year) and the Family plan saves $26.95/month ($323/year) compared to paying for Apple Music, Apple TV+, and iCloud separately."
      },
      {
        question: "Can I use PC Optimum points for Apple One in Canada?",
        answer: "Yes, buying Apple Gift Cards during Shoppers Drug Mart 20x points promotions gives you huge rebate points while paying your Apple One subscription."
      },
      {
        question: "Do family members see each other's files on Apple One Family?",
        answer: "No, each family member uses their own private Apple ID, private iCloud storage partition, and personalized Apple Music playlists."
      }
    ]
  },

  youtube_premium_ca: {
    slug: "youtube-premium-canada",
    aliases: ["yt-premium-ca", "youtube-premium-ca"],
    catchyH1: "YouTube Premium Canada 2026: Pricing, Family Sharing & Student 40% Off Guide",
    seoKeywords: [
      "YouTube Premium Canada price 2026",
      "YouTube Premium student Canada",
      "YouTube family plan Canada cost",
      "How to get YouTube Premium cheap Canada",
      "YouTube Music free with Premium"
    ],
    faqs: [
      {
        question: "How much does YouTube Premium cost in Canada?",
        answer: "Individual is $12.99/month, Student is $7.99/month, and the Family plan is $22.99/month for up to 5 family members."
      },
      {
        question: "Is YouTube Music included in YouTube Premium Canada?",
        answer: "Yes, YouTube Premium includes the complete ad-free YouTube Music streaming service at zero extra charge."
      },
      {
        question: "How does the YouTube Family plan work in Canada?",
        answer: "Up to 5 family members aged 13+ can share the plan with their own private Google accounts, eliminating ads on all smart TVs and mobile devices."
      },
      {
        question: "Do Canadian students get a discount on YouTube Premium?",
        answer: "Yes, Canadian university and college students save 40% ($7.99/mo) with annual SheerID student verification."
      }
    ]
  },

  audible_ca: {
    slug: "audible-canada",
    aliases: ["audible-ca"],
    catchyH1: "Audible Canada Plans 2026: Pricing, Free Prime Credits & Best-Seller Hacks",
    seoKeywords: [
      "Audible Canada price 2026",
      "Audible free trial Amazon Prime Canada",
      "Audible plus vs premium plus Canada",
      "How to cancel Audible Canada and keep books",
      "Audible annual plan Canada"
    ],
    faqs: [
      {
        question: "Do Amazon Prime Canada members get extra free Audible credits?",
        answer: "Yes, Canadian Prime members receive an exclusive 30-day free trial with 2 free audiobook credits instead of the standard 1 credit."
      },
      {
        question: "What is the difference between Audible Plus and Premium Plus in Canada?",
        answer: "Audible Plus ($10.95/mo) offers unlimited listening to thousands of select audiobooks and podcasts. Premium Plus ($14.95/mo) includes the Plus catalog PLUS 1 credit per month to keep any best-seller permanently."
      },
      {
        question: "Do I keep my audiobooks if I cancel Audible Canada?",
        answer: "Yes, any audiobook purchased with credits or cash remains in your permanent Audible library forever, even after cancelling."
      },
      {
        question: "How can I buy extra credits for cheaper on Audible Canada?",
        answer: "Audible members who have run out of credits can purchase discounted 3-credit packs for roughly $13 per audiobook."
      }
    ]
  },

  game_pass_ca: {
    slug: "xbox-game-pass-canada",
    aliases: ["game-pass-ca", "xbox-game-pass-ca"],
    catchyH1: "Xbox Game Pass Ultimate Canada 2026: Pricing, Day-One Releases & Costco Voucher Hacks",
    seoKeywords: [
      "Xbox Game Pass Ultimate Canada price 2026",
      "Game Pass PC Canada cost",
      "Costco Game Pass discount Canada",
      "Xbox Core to Ultimate conversion ratio",
      "Call of Duty Black Ops 6 Game Pass Canada"
    ],
    faqs: [
      {
        question: "How can I get Xbox Game Pass Ultimate cheaper in Canada?",
        answer: "Costco Canada sells 3-month Game Pass Ultimate cards for $54.99 (saving $14 compared to monthly retail). Alternatively, converting Xbox Game Pass Core to Ultimate gives a 3:2 value advantage."
      },
      {
        question: "What is included with Xbox Game Pass Ultimate in Canada?",
        answer: "Over 400 games across Xbox console, PC, EA Play membership, Xbox Cloud Gaming on phones/smart TVs, and day-one releases like Call of Duty."
      },
      {
        question: "How much does PC Game Pass cost in Canada?",
        answer: "PC Game Pass costs $11.99/month and includes full access to PC titles, EA Play for PC, and day-one Xbox Game Studios releases."
      },
      {
        question: "Can I play Game Pass games without an Xbox console in Canada?",
        answer: "Yes, with Game Pass Ultimate, you can stream games directly to Samsung TVs, iPads, Android phones, and laptops via Xbox Cloud Gaming."
      }
    ]
  },

  ps_plus_ca: {
    slug: "playstation-plus-canada",
    aliases: ["ps-plus-ca", "psplus-canada"],
    catchyH1: "PlayStation Plus Canada 2026: Pricing, Essential vs Extra & Days of Play Discounts",
    seoKeywords: [
      "PlayStation Plus Canada price 2026",
      "PS Plus Extra game catalog Canada",
      "Costco Canada PS Store gift card discount",
      "Days of Play sale PS Plus discount",
      "PlayStation Plus free games monthly"
    ],
    faqs: [
      {
        question: "How can I save on PlayStation Plus in Canada?",
        answer: "Costco Canada sells $100 PlayStation Store gift cards for $89.99 (10% instant discount). Applying these during Sony's annual Days of Play or Black Friday sales yields total savings of up to 35%."
      },
      {
        question: "What is the difference between PS Plus Essential, Extra, and Premium in Canada?",
        answer: "Essential ($11.99/mo) gives online multiplayer and 3 monthly free games. Extra ($17.99/mo) adds 400+ PS4/PS5 games. Premium ($21.99/mo) includes PS1/PS2/PS3 classic games and cloud streaming."
      },
      {
        question: "Is PS Plus required for free-to-play games on PS5 in Canada?",
        answer: "No, games like Fortnite, Warzone, Apex Legends, and Rocket League do NOT require a PlayStation Plus membership to play online."
      },
      {
        question: "Does PS Plus Extra include Ubisoft games?",
        answer: "Yes, Ubisoft+ Classics is bundled into both PS Plus Extra and Premium in Canada at no extra cost."
      }
    ]
  },

  doordash_ca: {
    slug: "doordash-dashpass-canada",
    aliases: ["dashpass-ca", "doordash-ca"],
    catchyH1: "DoorDash DashPass Canada 2026: Pricing, $0 Delivery & 12 Months Free via RBC & Amazon Prime",
    seoKeywords: [
      "DoorDash DashPass Canada cost 2026",
      "DoorDash free with Amazon Prime Canada",
      "RBC credit card free DashPass Canada",
      "DoorDash student discount Canada",
      "Costco DoorDash gift card 20% discount"
    ],
    faqs: [
      {
        question: "How can I get DoorDash DashPass 100% free for 1 year in Canada?",
        answer: "Amazon Prime Canada members can link their accounts to claim 12 months of free DashPass ($120 CAD value). Eligible RBC Avion and Rewards credit cardholders also get up to 12 months free."
      },
      {
        question: "What are the benefits of DoorDash DashPass in Canada?",
        answer: "$0 delivery fees on restaurant orders over $15 and grocery orders over $35, reduced service fees, and 5% back in DoorDash credit on eligible pickup orders."
      },
      {
        question: "How can I save an extra 20% on all DoorDash orders?",
        answer: "Costco Canada sells $100 DoorDash digital voucher bundles for $79.99, saving an instant 20% on food and grocery delivery."
      },
      {
        question: "Is there a student discount for DashPass in Canada?",
        answer: "Yes, Canadian students can subscribe to DashPass Student for just $4.99/month."
      }
    ]
  },

  uber_one_ca: {
    slug: "uber-one-canada",
    aliases: ["uberone-ca", "uber-eats-pass-ca"],
    catchyH1: "Uber One Canada 2026: Pricing, 5% Off Rides & Costco 20% Gift Card Hack",
    seoKeywords: [
      "Uber One Canada price 2026",
      "Uber One free trial Canada",
      "Costco Uber gift card discount Canada",
      "Is Uber One worth it Canada",
      "Uber Eats $0 delivery fee pass"
    ],
    faqs: [
      {
        question: "What are the core perks of Uber One in Canada?",
        answer: "$0 delivery fee on eligible Uber Eats food orders over $15 and groceries over $40, up to 10% off orders, 5% off Uber rides, and top-rated drivers."
      },
      {
        question: "How much does Uber One cost in Canada?",
        answer: "Uber One costs $9.99/month or $99.99/year (saving $20/year compared to monthly)."
      },
      {
        question: "How can I save 20% on all Uber rides and Uber Eats orders?",
        answer: "Costco Canada sells $100 in Uber digital gift cards (two $50 cards) for $79.99, providing an automatic 20% discount on every trip and meal."
      },
      {
        question: "Does Uber One give you credit if your delivery is late?",
        answer: "Yes, Uber One members receive a $5 Uber Cash credit if the Latest Arrival estimate is missed on eligible food orders."
      }
    ]
  },

  skipthedishes_ca: {
    slug: "skipthedishes-canada",
    aliases: ["skip-the-dishes-ca", "skip-rewards-ca"],
    catchyH1: "SkipTheDishes Canada 2026: Skip Rewards, Free Delivery Hacks & Virgin Plus Deals",
    seoKeywords: [
      "SkipTheDishes rewards program Canada",
      "SkipTheDishes promo codes 2026",
      "Virgin Plus SkipTheDishes voucher",
      "SkipTheDishes free delivery trick",
      "Tim Hortons delivery SkipTheDishes"
    ],
    faqs: [
      {
        question: "How does the Skip Rewards program work in Canada?",
        answer: "Every order on SkipTheDishes earns points (up to 10 points per dollar spent) that can be redeemed for $2.50 to $15 off future restaurant deliveries."
      },
      {
        question: "Can I get free food delivery vouchers from Canadian telecom?",
        answer: "Virgin Plus members frequently receive $5 to $10 off SkipTheDishes vouchers in their Member Lounge benefits portal."
      },
      {
        question: "Does SkipTheDishes deliver Tim Hortons and local Canadian chains?",
        answer: "Yes, SkipTheDishes has the deepest Canadian local restaurant coverage, including Tim Hortons, Harvey's, Boston Pizza, and local poutineries."
      },
      {
        question: "Is there a monthly subscription fee for SkipTheDishes?",
        answer: "No, Skip Rewards is completely free to join with zero subscription cost."
      }
    ]
  },

  chatgpt_plus_ca: {
    slug: "chatgpt-plus-canada",
    aliases: ["chatgpt-ca", "chatgpt-plus-ca"],
    catchyH1: "ChatGPT Plus Canada 2026: Pricing, GPT-4o, Advanced Voice & Zero-FX Payment Hacks",
    seoKeywords: [
      "ChatGPT Plus price Canada 2026",
      "ChatGPT Plus CAD conversion cost",
      "ChatGPT Plus free alternatives Canada",
      "GPT-4o Advanced Voice Canada",
      "No foreign fee credit card ChatGPT"
    ],
    faqs: [
      {
        question: "How much does ChatGPT Plus cost in Canadian Dollars (CAD)?",
        answer: "ChatGPT Plus is billed at $20.00 USD/month, which converts to approximately $27.00 - $28.00 CAD depending on current foreign exchange rates."
      },
      {
        question: "How to avoid foreign exchange surcharges on ChatGPT in Canada?",
        answer: "Pay using a no-foreign-transaction-fee Canadian credit card (such as Scotiabank Passport Visa Infinite or Wealthsimple Cash) to avoid the typical 2.5% bank FX conversion fee."
      },
      {
        question: "What features are included in ChatGPT Plus?",
        answer: "Priority access to GPT-4o with 5x message limits, Advanced Voice Mode, interactive Canvas coding workspace, DALL-E 3 image generation, and custom GPTs."
      },
      {
        question: "Can I use GPT-4 for free in Canada without subscribing?",
        answer: "Yes, Microsoft Copilot on Windows 11 and Edge browser offers free access to GPT-4 and DALL-E 3 with no monthly charge."
      }
    ]
  },

  claude_pro_ca: {
    slug: "claude-pro-canada",
    aliases: ["claude-ca", "claude-pro-ca"],
    catchyH1: "Claude Pro Canada 2026: Pricing, Claude 3.5 Sonnet, Artifacts & Developer Hacks",
    seoKeywords: [
      "Claude Pro price Canada 2026",
      "Claude 3.5 Sonnet coding benchmarks",
      "Claude Pro vs ChatGPT Plus Canada",
      "Claude Artifacts projects Canada",
      "Claude AI free web tier Canada"
    ],
    faqs: [
      {
        question: "How much does Claude Pro cost in Canada?",
        answer: "Claude Pro is billed at $20.00 USD/month (~$27.50 CAD). Using a 0% foreign transaction fee card saves the 2.5% currency surcharge."
      },
      {
        question: "Why do software engineers in Canada prefer Claude Pro over ChatGPT?",
        answer: "Claude 3.5 Sonnet consistently outperforms other models on software engineering benchmarks, complex multi-file React/Python generation, and real-time interactive Artifact rendering."
      },
      {
        question: "What is included with Claude Pro?",
        answer: "5x higher message usage limits, priority bandwidth during peak hours, Projects knowledge bases, and early access to new Anthropic models."
      },
      {
        question: "Is there a free version of Claude available in Canada?",
        answer: "Yes, Canadians can access Claude 3.5 Sonnet on claude.ai for free with standard rate limits."
      }
    ]
  },

  microsoft_365_ca: {
    slug: "microsoft-365-canada",
    aliases: ["m365-ca", "office-365-canada"],
    catchyH1: "Microsoft 365 Canada 2026: Pricing, 1TB OneDrive & Canadian Student $0 Free Trick",
    seoKeywords: [
      "Microsoft 365 Canada price 2026",
      "Office 365 free for Canadian students",
      "Costco Microsoft 365 15-month deal",
      "Microsoft 365 family split Canada",
      "1TB OneDrive storage Canada"
    ],
    faqs: [
      {
        question: "Can Canadian university and college students get Microsoft 365 for free?",
        answer: "Yes! Students and faculty at U of T, UBC, McGill, Waterloo, and most Canadian post-secondary institutions can access Microsoft 365 Education for $0 completely free with their school email."
      },
      {
        question: "What is the Costco Canada 15-Month Microsoft 365 deal?",
        answer: "Costco Canada sells a 15-month Microsoft 365 Family digital license for $99.99 (giving you 3 bonus months free, working out to just $6.66/month for 6 users)."
      },
      {
        question: "How much does Microsoft 365 cost in Canada directly?",
        answer: "Personal (1 user, 1TB cloud) is $79.00/year or $7.90/month. Family (up to 6 users, 6TB cloud total) is $109.00/year or $10.90/month."
      },
      {
        question: "Does each family member get their own 1TB OneDrive storage?",
        answer: "Yes, every member in a Family plan gets their own private 1TB OneDrive cloud storage partition that cannot be seen by other family members."
      }
    ]
  },

  google_one_ca: {
    slug: "google-one-canada",
    aliases: ["google-one-ca", "google-storage-ca"],
    catchyH1: "Google One Canada Plans 2026: Pricing, 100GB to 2TB Storage & Gemini Advanced AI",
    seoKeywords: [
      "Google One Canada price 2026",
      "Google One 100GB cost Canada",
      "Google One annual plan discount",
      "Google Photos storage full Canada",
      "Gemini Advanced Google One Canada"
    ],
    faqs: [
      {
        question: "How much does Google One storage cost in Canada?",
        answer: "100GB is $2.79/mo ($27.99/yr), 200GB is $3.99/mo ($39.99/yr), 2TB is $13.99/mo ($139.99/yr), and 2TB with Gemini Advanced AI is $26.99/mo."
      },
      {
        question: "Can I share my Google One storage with my family in Canada?",
        answer: "Yes, all Google One plans can be shared with up to 5 family members, with each person maintaining complete privacy over their photos and files."
      },
      {
        question: "How much do I save with annual billing on Google One?",
        answer: "Switching to annual billing saves approximately 16% across all storage tiers."
      },
      {
        question: "Do Google Pixel phone activations in Canada include free Google One?",
        answer: "Yes, purchasing new Google Pixel devices through Canadian carriers often includes promotional trials ranging from 3 to 6 months of Google One or 1 year of Gemini Advanced."
      }
    ]
  }
};

/**
 * Single-brand resolver for Canada (CA).
 * Checks the static catalog first, then queries Upstash Redis for on-demand generated brands.
 */
export async function getCASubscriptionBySlug(slug) {
  if (!slug) return null;
  const cleanSlug = slug.toLowerCase().trim();

  const seoEntry = Object.entries(SUBSCRIPTIONS_SEO_MAP_CA).find(
    ([id, data]) => id === cleanSlug || data.slug === cleanSlug || (data.aliases && data.aliases.includes(cleanSlug))
  );

  const matchedId = seoEntry ? seoEntry[0] : cleanSlug;

  let catalogItem = CA_SUBSCRIPTIONS_CATALOG.find(
    (sub) => sub.id === matchedId || sub.id === cleanSlug
  );

  // Check Redis for on-demand generated Canadian brands
  if (!catalogItem && redisClient) {
    try {
      const raw = await redisClient.get(`ondemand_sub_ca_${cleanSlug}`);
      if (raw) {
        catalogItem = typeof raw === "string" ? JSON.parse(raw) : raw;
      }
    } catch {}
  }

  if (!catalogItem) return null;

  const seoData = seoEntry ? seoEntry[1] : (catalogItem.seo || {
    slug: catalogItem.id,
    catchyH1: `${catalogItem.name} Canada Subscription Plans 2026: Pricing, Discounts & Deals`,
    seoKeywords: [`${catalogItem.name} Canada plans`, `${catalogItem.name} discount`],
    faqs: [
      {
        question: `How to get ${catalogItem.name} at a discount in Canada?`,
        answer: `Check our verified 4-Level Savings Blueprint on this page to claim carrier perks from Telus/Bell/Rogers, gift card discounts, and bundle passes.`
      }
    ]
  });

  return {
    ...catalogItem,
    country: "CA",
    currencySymbol: "C$",
    seo: seoData
  };
}

export function getAllCASubscriptionSlugs() {
  return CA_SUBSCRIPTIONS_CATALOG.map((sub) => {
    const seo = SUBSCRIPTIONS_SEO_MAP_CA[sub.id];
    return seo?.slug || sub.id;
  });
}
