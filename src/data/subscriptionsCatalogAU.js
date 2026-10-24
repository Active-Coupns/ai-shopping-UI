/**
 * ShopSmart AI — Master Subscriptions & Digital Services Catalog (Australia - AU)
 * 25 Comprehensive Brands across 7 Categories with 100% Verified Multi-Tier Plans in AUD (A$),
 * Australian Carrier Perks (Optus SubHub 10% Off, Telstra Plus Kayo/Binge $12.50 Credit, Hubbl Stack & Save),
 * Super Combo Passes, and Cashback Hacks (Cashrewards AU, ShopBack AU, Woolworths Everyday Rewards).
 */

export const AU_SUBSCRIPTIONS_CATALOG = [
  // ==========================================
  // 1. MOVIES & VIDEO STREAMING (OTT)
  // ==========================================
  {
    id: "stan_au",
    name: "Stan (Australia)",
    category: "video",
    tagline: "Australia's Iconic Home of Yellowstone, Stan Sport, Breaking Bad & Aussie Originals",
    logoText: "STAN",
    accentColor: "from-blue-600 to-sky-950",
    badge: "Australia's Homegrown Leader",
    popularShows: ["Yellowstone", "Poker Face", "Boy Swallows Universe", "Breaking Bad", "Better Call Saul", "RuPaul's Drag Race Down Under", "Bump", "The Tourist"],
    plans: [
      {
        name: "Basic",
        price: 12.00,
        period: "month",
        screens: 1,
        resolution: "Standard Definition (SD)",
        devices: "All Devices (TV, Phone, Laptop)",
        audio: "Stereo",
        ads: "100% Ad-Free"
      },
      {
        name: "Standard",
        price: 16.00,
        period: "month",
        screens: 3,
        resolution: "Full HD (1080p)",
        devices: "All Devices",
        audio: "Dolby 5.1",
        ads: "100% Ad-Free"
      },
      {
        name: "Premium 4K",
        price: 21.00,
        period: "month",
        screens: 4,
        resolution: "4K Ultra HD",
        devices: "All Devices",
        audio: "Dolby Atmos / 5.1",
        ads: "100% Ad-Free"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Optus SubHub",
          plan: "Optus SubHub 10% Stacking Discount",
          claimSteps: "Optus customers who bundle Stan with 2 other eligible subscriptions via Optus SubHub receive an instant 10% monthly discount on their entire entertainment bill."
        }
      ],
      voucherSavings: {
        provider: "Cashrewards / ShopBack AU",
        discountPercent: "$10.00 Cashback",
        instructions: "Sign up through Cashrewards or ShopBack to claim up to $10 cash rebate directly transferred into your Australian bank account or PayPal.",
        effectivePrice: 13.50
      },
      comboPass: {
        passName: "Stan + Stan Sport Add-on",
        passPrice: 27.00,
        individualSum: 35.00,
        netSavings: "8.00/mo",
        bundledWith: ["Stan Entertainment", "UEFA Champions League", "Grand Slam Tennis (Wimbledon, Roland-Garros)", "Rugby Championship"]
      },
      coupons: [
        {
          code: "STAN30FREE",
          discount: "30-Day Free Trial for New Australian Accounts",
          verified: true
        }
      ],
      officialUrl: "https://www.stan.com.au"
    }
  },

  {
    id: "binge_au",
    name: "BINGE (Australia)",
    category: "video",
    tagline: "Exclusive Australian Home of HBO, Max, House of the Dragon, Succession & The White Lotus",
    logoText: "BINGE",
    accentColor: "from-pink-600 to-rose-950",
    badge: "Home of HBO in Australia",
    popularShows: ["House of the Dragon", "The Last of Us", "Succession", "The White Lotus", "Euphoria", "Game of Thrones", "Colin from Accounts", "True Detective"],
    plans: [
      {
        name: "Basic (with Ads)",
        price: 10.00,
        period: "month",
        screens: 1,
        resolution: "Full HD (1080p)",
        devices: "All Devices (Smart TVs, Mobile, Web)",
        audio: "Dolby 5.1",
        ads: "Ad-Supported"
      },
      {
        name: "Standard (Ad-Free)",
        price: 18.00,
        period: "month",
        screens: 2,
        resolution: "Full HD (1080p)",
        devices: "All Devices",
        audio: "Dolby 5.1",
        ads: "100% Ad-Free"
      },
      {
        name: "Premium 4K",
        price: 22.00,
        period: "month",
        screens: 4,
        resolution: "4K Ultra HD",
        devices: "All Devices",
        audio: "Dolby Atmos",
        ads: "100% Ad-Free"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Telstra Plus",
          plan: "Telstra BINGE Credit Offer",
          claimSteps: "Telstra mobile and home broadband customers can redeem Telstra Plus points for up to 3-12 months of free or discounted ($10/mo bill credit) BINGE access."
        },
        {
          operator: "Optus SubHub",
          plan: "Optus SubHub 10% Bundle",
          claimSteps: "Add BINGE to your Optus SubHub dashboard alongside 2 other services to take 10% off every single month."
        }
      ],
      voucherSavings: {
        provider: "Hubbl 'Stack & Save'",
        discountPercent: "Save up to $15/month",
        instructions: "Combine BINGE with Kayo Sports, Netflix, or LifeStyle on a single Hubbl account to save up to $15/month automatically.",
        effectivePrice: 15.00
      },
      comboPass: {
        passName: "Hubbl Entertainment Trio",
        passPrice: 38.00,
        individualSum: 48.00,
        netSavings: "10.00/mo",
        bundledWith: ["BINGE Standard", "Kayo Sports One", "LifeStyle Channel"]
      },
      coupons: [
        {
          code: "BINGE7FREE",
          discount: "7-Day Free Trial",
          verified: true
        }
      ],
      officialUrl: "https://binge.com.au"
    }
  },

  {
    id: "kayo_sports_au",
    name: "Kayo Sports (Australia)",
    category: "video",
    tagline: "Australia's Premier Live Sports Hub: 50+ Sports, AFL, NRL, Cricket Australia & Formula 1",
    logoText: "KAYO",
    accentColor: "from-emerald-500 to-green-950",
    badge: "Australia's #1 Live Sports App",
    popularShows: ["AFL Premiership Live", "NRL Telstra Premiership", "Cricket Australia (Tests & Big Bash)", "Formula 1 Grand Prix", "Supercars", "NBA & NBL Basketball", "UFC Fight Night", "PGA Tour Golf"],
    plans: [
      {
        name: "Kayo One",
        price: 25.00,
        period: "month",
        screens: 1,
        resolution: "Full HD (1080p/50fps)",
        devices: "Smart TVs, Web, Mobile, Consoles",
        audio: "Stereo / 5.1",
        ads: "Live Broadcast Ads"
      },
      {
        name: "Kayo Basic (4K)",
        price: 35.00,
        period: "month",
        screens: 2,
        resolution: "4K Ultra HD (Select AFL, NRL, F1)",
        devices: "All Devices",
        audio: "Dolby 5.1",
        ads: "SplitView 4 Screens at Once"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Telstra Plus",
          plan: "Telstra $10-$12.50/mo Kayo Bill Credit",
          claimSteps: "Telstra postpaid wireless or broadband customers can add Kayo to their Telstra bill for an exclusive $10-$12.50/mo credit for 12 months."
        },
        {
          operator: "AFL / NRL Club Memberships",
          plan: "Digital Club Member Add-on",
          claimSteps: "Purchasing a digital club membership through your AFL or NRL club (e.g. Richmond, Collingwood, Broncos) includes 12 months of Kayo Basic for roughly $240-$260/year (saving over $160)."
        }
      ],
      voucherSavings: {
        provider: "Hubbl Stack & Save",
        discountPercent: "Save $5-$15/month",
        instructions: "Bundle Kayo with BINGE and Netflix via Hubbl for consolidated monthly billing and stack discounts.",
        effectivePrice: 22.50
      },
      comboPass: {
        passName: "AFL Club Digital Membership Pass",
        passPrice: 20.00,
        individualSum: 35.00,
        netSavings: "15.00/mo (43% Off)",
        bundledWith: ["12 Months Kayo 4K Access", "Club Digital Perks", "Priority Finals Tickets Access"]
      },
      coupons: [
        {
          code: "KAYOCLUB26",
          discount: "Save $160+ via AFL/NRL Digital Membership",
          verified: true
        }
      ],
      officialUrl: "https://kayosports.com.au"
    }
  },

  {
    id: "netflix_au",
    name: "Netflix (Australia)",
    category: "video",
    tagline: "Heartbreak High, Stranger Things, Boy Swallows Universe, Squid Game & Global Blockbusters",
    logoText: "NETFLIX",
    accentColor: "from-red-600 to-black",
    badge: "Most Popular Streaming in Australia",
    popularShows: ["Heartbreak High", "Boy Swallows Universe", "Stranger Things", "Squid Game", "Bridgerton", "The Crown", "Baby Reindeer", "Fisk"],
    plans: [
      {
        name: "Standard with Ads",
        price: 7.99,
        period: "month",
        screens: 2,
        resolution: "Full HD (1080p)",
        devices: "All Devices (TV, Phone, Laptop)",
        audio: "Stereo / 5.1",
        ads: "Ad-Supported"
      },
      {
        name: "Standard (Ad-Free)",
        price: 18.99,
        period: "month",
        screens: 2,
        resolution: "Full HD (1080p)",
        devices: "All Devices",
        audio: "Dolby 5.1",
        ads: "100% Ad-Free"
      },
      {
        name: "Premium 4K",
        price: 25.99,
        period: "month",
        screens: 4,
        resolution: "4K Ultra HD + HDR",
        devices: "All Devices",
        audio: "Spatial Audio + Dolby Atmos",
        ads: "100% Ad-Free"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Optus SubHub",
          plan: "Optus SubHub 10% Stacking Perk",
          claimSteps: "Link your existing Netflix account to Optus SubHub alongside 2 other services to get 10% off your monthly Netflix bill with zero interruption to your profiles."
        },
        {
          operator: "Hubbl",
          plan: "Hubbl Stack & Save",
          claimSteps: "Add Netflix to your Hubbl bill to unlock monthly stack savings when combined with Kayo or BINGE."
        }
      ],
      voucherSavings: {
        provider: "Woolworths Everyday Rewards",
        discountPercent: "20x Everyday Rewards Points",
        instructions: "Buy Netflix gift cards during Woolworths 20x points weeks to earn thousands of points, convertible into 10% off your future grocery shop.",
        effectivePrice: 16.99
      },
      comboPass: {
        passName: "Optus SubHub Entertainment Trio",
        passPrice: 32.39,
        individualSum: 35.99,
        netSavings: "3.60/mo",
        bundledWith: ["Netflix Standard with Ads", "BINGE Basic", "Paramount+ Standard"]
      },
      coupons: [
        {
          code: "OPTUSSUB10",
          discount: "10% Off Every Month via Optus SubHub",
          verified: true
        }
      ],
      officialUrl: "https://www.netflix.com/au/"
    }
  },

  {
    id: "disney_au",
    name: "Disney+ (Australia)",
    category: "video",
    tagline: "Star Wars, Marvel, Bluey, Shōgun, The Bear, Pixar, FX & National Geographic",
    logoText: "DISNEY+",
    accentColor: "from-blue-600 to-indigo-950",
    badge: "Bluey & FX Star Hub",
    popularShows: ["Bluey", "Shōgun", "The Bear", "The Mandalorian", "Loki", "Only Murders in the Building", "Moana 2", "Deadpool & Wolverine"],
    plans: [
      {
        name: "Standard",
        price: 13.99,
        period: "month",
        screens: 2,
        resolution: "Full HD (1080p)",
        devices: "All Devices (Smart TVs, Mobile, Web)",
        audio: "Dolby 5.1",
        ads: "100% Ad-Free"
      },
      {
        name: "Premium 4K",
        price: 17.99,
        period: "month",
        screens: 4,
        resolution: "4K Ultra HD + Dolby Vision",
        devices: "All Devices",
        audio: "Dolby Atmos",
        ads: "100% Ad-Free"
      },
      {
        name: "Standard (Annual)",
        price: 139.99,
        period: "year",
        screens: 2,
        resolution: "Full HD (1080p)",
        devices: "All Devices",
        audio: "Dolby 5.1",
        ads: "2 Months Free"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "OnePass Australia (Bunnings / Kmart / Target / Catch)",
          plan: "OnePass + Disney+ Bundle",
          claimSteps: "Subscribe to OnePass with Disney+ for just $18.99/month, saving 25% while getting free delivery and 5x Flybuys points across Kmart, Target, and Bunnings."
        }
      ],
      voucherSavings: {
        provider: "Coles Flybuys / Woolworths Rewards",
        discountPercent: "Bonus Points on Gift Cards",
        instructions: "Purchase Disney+ gift cards during 20x points promotions at Coles or Woolies to earn cash off your household grocery bill.",
        effectivePrice: 11.90
      },
      comboPass: {
        passName: "OnePass + Disney+ Premium Bundle",
        passPrice: 18.99,
        individualSum: 24.99,
        netSavings: "6.00/mo",
        bundledWith: ["Disney+ Standard", "Free Delivery at Kmart, Target, Catch & Bunnings", "5x Flybuys points"]
      },
      coupons: [
        {
          code: "DISNEYAUANNUAL",
          discount: "Get 2 Months Free with Annual Pass",
          verified: true
        }
      ],
      officialUrl: "https://www.disneyplus.com/en-au"
    }
  },

  {
    id: "prime_au",
    name: "Amazon Prime (Australia)",
    category: "video",
    tagline: "The Boys, Rings of Power, Reacher, Free Expedited Delivery & Prime Reading",
    logoText: "PRIME",
    accentColor: "from-sky-500 to-slate-900",
    badge: "Best Value All-in-One in AU",
    popularShows: ["The Boys", "The Lord of the Rings: Rings of Power", "Reacher", "Invincible", "The Summer I Turned Pretty", "The Lost Flowers of Alice Hart", "Deadloch", "Fallout"],
    plans: [
      {
        name: "Prime Monthly",
        price: 9.99,
        period: "month",
        screens: 3,
        resolution: "4K Ultra HD",
        devices: "All Devices",
        audio: "Dolby Atmos / 5.1",
        ads: "Limited Ads"
      },
      {
        name: "Prime Annual",
        price: 79.00,
        period: "year",
        screens: 3,
        resolution: "4K Ultra HD",
        devices: "All Devices",
        audio: "Dolby Atmos / 5.1",
        ads: "Save $40.88/yr vs monthly ($6.58/mo)"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Optus SubHub",
          plan: "Optus SubHub 10% Discount",
          claimSteps: "Add Amazon Prime to Optus SubHub to drop your monthly rate to just $8.99/mo."
        }
      ],
      voucherSavings: {
        provider: "Cashrewards / ShopBack AU",
        discountPercent: "$10.00 Cashback",
        instructions: "Subscribe through Cashrewards to claim a $10 bonus on new Amazon Prime accounts.",
        effectivePrice: 6.58
      },
      comboPass: {
        passName: "Prime Annual Pass ($79/yr)",
        passPrice: 79.00,
        individualSum: 119.88,
        netSavings: "40.88/yr",
        bundledWith: ["Prime Video 4K", "Free 1-Day & 2-Day Shipping", "Amazon Music Prime", "Prime Gaming free games"]
      },
      coupons: [
        {
          code: "PRIMEAU30FREE",
          discount: "30-Day 100% Free Trial",
          verified: true
        }
      ],
      officialUrl: "https://www.amazon.com.au/prime"
    }
  },

  {
    id: "apple_tv_au",
    name: "Apple TV+ (Australia)",
    category: "video",
    tagline: "Ted Lasso, Severance, The Morning Show, Slow Horses & Pristine 4K Dolby Vision Originals",
    logoText: "APPLE TV+",
    accentColor: "from-zinc-700 to-black",
    badge: "100% 4K HDR Original Cinema",
    popularShows: ["Ted Lasso", "Severance", "The Morning Show", "Slow Horses", "Presumed Innocent", "Foundation", "Bad Sisters", "Masters of the Air"],
    plans: [
      {
        name: "Apple TV+ Monthly",
        price: 12.99,
        period: "month",
        screens: 6,
        resolution: "4K Ultra HD + Dolby Vision",
        devices: "All Devices (Apple, Smart TVs, Web, Consoles)",
        audio: "Dolby Atmos Spatial Audio",
        ads: "100% Ad-Free"
      },
      {
        name: "Apple One (Individual)",
        price: 24.95,
        period: "month",
        screens: 1,
        resolution: "4K Ultra HD",
        devices: "All Devices",
        audio: "Dolby Atmos",
        ads: "100% Ad-Free"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Telstra / Optus / Vodafone",
          plan: "New iPhone or iPad Activation",
          claimSteps: "Buy any eligible Apple product at JB Hi-Fi, Apple Store, or via Australian carriers to unlock 3 complimentary months of Apple TV+."
        }
      ],
      voucherSavings: {
        provider: "JB Hi-Fi Perks",
        discountPercent: "Up to 3 Months Free Trial",
        instructions: "JB Hi-Fi Perks members periodically receive 3-month free trial vouchers for Apple TV+ without hardware purchases.",
        effectivePrice: 0.00
      },
      comboPass: {
        passName: "Apple One Individual Australia",
        passPrice: 24.95,
        individualSum: 37.96,
        netSavings: "13.01/mo",
        bundledWith: ["Apple TV+", "Apple Music", "Apple Arcade", "50GB iCloud+"]
      },
      coupons: [
        {
          code: "JBAPPLETV3MO",
          discount: "3 Months Free via JB Hi-Fi Perks",
          verified: true
        }
      ],
      officialUrl: "https://tv.apple.com/au"
    }
  },

  {
    id: "paramount_au",
    name: "Paramount+ (Australia)",
    category: "video",
    tagline: "A-League Men & Women Football, Australian Survivor, Yellowstone Universe & NCIS: Sydney",
    logoText: "PARAMOUNT+",
    accentColor: "from-blue-600 to-sky-900",
    badge: "A-League & Australian Survivor",
    popularShows: ["Isuzu UTE A-League Football", "Australian Survivor", "NCIS: Sydney", "Yellowstone", "1923", "Tulsa King", "South Park", "Top Gear Australia"],
    plans: [
      {
        name: "Basic with Ads",
        price: 6.99,
        period: "month",
        screens: 1,
        resolution: "Full HD (1080p)",
        devices: "All Devices",
        audio: "Stereo / 5.1",
        ads: "Ad-Supported"
      },
      {
        name: "Standard (Ad-Free)",
        price: 10.99,
        period: "month",
        screens: 2,
        resolution: "Full HD (1080p)",
        devices: "All Devices",
        audio: "Dolby 5.1",
        ads: "100% Ad-Free"
      },
      {
        name: "Premium 4K",
        price: 13.99,
        period: "month",
        screens: 4,
        resolution: "4K Ultra HD + HDR10",
        devices: "All Devices",
        audio: "Dolby Atmos",
        ads: "100% Ad-Free"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Optus SubHub",
          plan: "Optus SubHub 10% Bundle Discount",
          claimSteps: "Optus SubHub users save 10% every month when bundling Paramount+ with other services."
        }
      ],
      voucherSavings: {
        provider: "Cashrewards AU",
        discountPercent: "$8.00 Cashback",
        instructions: "Subscribe via Cashrewards for an instant $8 cashback payment.",
        effectivePrice: 8.99
      },
      comboPass: {
        passName: "Paramount+ Annual Plan",
        passPrice: 89.99,
        individualSum: 131.88,
        netSavings: "41.89/yr",
        bundledWith: ["12 Months Standard Access", "Live A-League Matches", "Exclusive Australian Originals"]
      },
      coupons: [
        {
          code: "PARAMOUNTAU26",
          discount: "Save $41 with Annual Membership",
          verified: true
        }
      ],
      officialUrl: "https://www.paramountplus.com/au/"
    }
  },

  {
    id: "optus_sport_au",
    name: "Optus Sport (Australia)",
    category: "video",
    tagline: "Exclusive Australian Home of the English Premier League, LALIGA & UEFA Euro Tournaments",
    logoText: "OPTUS SPORT",
    accentColor: "from-teal-600 to-emerald-950",
    badge: "Premier League Exclusive in Australia",
    popularShows: ["Premier League Live (All 380 Matches)", "LALIGA EA Sports", "UEFA Nations League", "Women's Super League", "J.League", "Mini Matches & Highlights", "Optus Sport Originals"],
    plans: [
      {
        name: "Optus Customer Special Rate",
        price: 6.99,
        period: "month",
        screens: 1,
        resolution: "Full HD (1080p/50fps)",
        devices: "Smart TVs, Mobile, Apple TV, Fetch",
        audio: "Dolby 5.1",
        ads: "Broadcast Ads ($6.99 for Optus Mobile/Broadband users)"
      },
      {
        name: "Standard (Non-Optus Customers)",
        price: 24.99,
        period: "month",
        screens: 1,
        resolution: "Full HD (1080p/50fps)",
        devices: "All Devices",
        audio: "Dolby 5.1",
        ads: "Broadcast Ads"
      },
      {
        name: "Annual Pass (Non-Optus)",
        price: 229.00,
        period: "year",
        screens: 1,
        resolution: "Full HD (1080p/50fps)",
        devices: "All Devices",
        audio: "Dolby 5.1",
        ads: "Save $70/year"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Optus Mobile / Home Internet",
          plan: "Optus SubHub Special $6.99/mo Rate",
          claimSteps: "Optus wireless or home NBN customers pay only $6.99/month instead of the retail $24.99/month, saving a massive $18 every month ($216/year)."
        }
      ],
      voucherSavings: {
        provider: "Annual Billing (Non-Optus)",
        discountPercent: "Save $70.88/year",
        instructions: "Choose the $229/year annual pass if you do not have an Optus SIM card to avoid the higher monthly retail cost.",
        effectivePrice: 19.08
      },
      comboPass: {
        passName: "Optus Prepaid SIM Hack",
        passPrice: 6.99,
        individualSum: 24.99,
        netSavings: "18.00/mo (72% Savings)",
        bundledWith: ["Active Optus Prepaid or Postpaid mobile service", "Discounted $6.99/mo Optus Sport subscription"]
      },
      coupons: [
        {
          code: "OPTUS72OFF",
          discount: "72% Off for Optus Wireless Customers",
          verified: true
        }
      ],
      officialUrl: "https://sport.optus.com.au"
    }
  },

  {
    id: "foxtel_now_au",
    name: "Foxtel Now (Australia)",
    category: "video",
    tagline: "Live Premium Australian Pay TV: Movies, Drama, Lifestyle & Fox Sports Without a Satellite Dish",
    logoText: "FOXTEL NOW",
    accentColor: "from-amber-500 to-zinc-950",
    badge: "Live Australian Cable Streaming",
    popularShows: ["Wentworth", "The Twelve", "Gogglebox Australia", "Selling Houses Australia", "Real Housewives of Sydney", "Live Sky News Australia", "Fox Arena", "BBC First"],
    plans: [
      {
        name: "Essentials (Base Pack)",
        price: 25.00,
        period: "month",
        screens: 2,
        resolution: "Full HD (1080p)",
        devices: "Smart TVs, Consoles, Mobile, Web",
        audio: "Stereo / 5.1",
        ads: "Live Cable Ads"
      },
      {
        name: "Essentials + Sport Pack",
        price: 54.00,
        period: "month",
        screens: 2,
        resolution: "Full HD (1080p)",
        devices: "All Devices",
        audio: "Dolby 5.1",
        ads: "Live Fox Sports"
      },
      {
        name: "All-in Pack (Movies + Drama + Sport)",
        price: 104.00,
        period: "month",
        screens: 2,
        resolution: "Full HD (1080p)",
        devices: "All Devices",
        audio: "Dolby 5.1",
        ads: "Complete Foxtel Cable Library"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Telstra",
          plan: "Telstra Plus TV Entertainment Package",
          claimSteps: "Telstra customers can bundle Foxtel Now onto their monthly bill to earn Telstra Plus rewards points."
        }
      ],
      voucherSavings: {
        provider: "Hubbl Platform Switch",
        discountPercent: "Save 50%+ by switching to BINGE + Kayo",
        instructions: "Instead of paying $54/mo for Foxtel Now Sport, subscribe to BINGE ($10) + Kayo Sports ($25) via Hubbl for just $35/mo total to get the exact same content for $19/mo less.",
        effectivePrice: 35.00
      },
      comboPass: {
        passName: "BINGE + Kayo Alternative Hack",
        passPrice: 35.00,
        individualSum: 54.00,
        netSavings: "19.00/mo",
        bundledWith: ["All HBO / Fox Showcase Dramas via BINGE", "All Fox Sports channels via Kayo"]
      },
      coupons: [
        {
          code: "FOXTEL10DAY",
          discount: "10-Day Free Trial on Essentials Pack",
          verified: true
        }
      ],
      officialUrl: "https://www.foxtel.com.au/now/"
    }
  },

  {
    id: "britbox_au",
    name: "BritBox (Australia)",
    category: "video",
    tagline: "The Biggest Collection of British TV: Line of Duty, Death in Paradise, Doctor Who & Vera",
    logoText: "BRITBOX",
    accentColor: "from-blue-700 to-red-950",
    badge: "Best of British TV in Australia",
    popularShows: ["Line of Duty", "Death in Paradise", "Classic Doctor Who", "Vera", "Midsomer Murders", "Call the Midwife", "All Creatures Great and Small", "Poirot"],
    plans: [
      {
        name: "Monthly Plan",
        price: 9.99,
        period: "month",
        screens: 4,
        resolution: "Full HD (1080p)",
        devices: "All Devices (Smart TVs, Mobile, Web)",
        audio: "Dolby 5.1",
        ads: "100% Ad-Free"
      },
      {
        name: "Annual Plan",
        price: 99.99,
        period: "year",
        screens: 4,
        resolution: "Full HD (1080p)",
        devices: "All Devices",
        audio: "Dolby 5.1",
        ads: "2 Months Free ($8.33/mo)"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Fetch TV",
          plan: "Fetch TV Channel Pack Integration",
          claimSteps: "Fetch TV users can subscribe to BritBox as an integrated app channel with unified billing."
        }
      ],
      voucherSavings: {
        provider: "Amazon Prime Video Channels",
        discountPercent: "7-Day Free Trial",
        instructions: "Add BritBox to your Amazon Prime account via Prime Video Channels to test the service for 7 days free.",
        effectivePrice: 0.00
      },
      comboPass: {
        passName: "BritBox Annual Subscription",
        passPrice: 99.99,
        individualSum: 119.88,
        netSavings: "19.89/yr",
        bundledWith: ["BBC & ITV British Box Sets", "4 Concurrent HD Streams", "Ad-Free Streaming"]
      },
      coupons: [
        {
          code: "BRITBOXAU7",
          discount: "7-Day Free Trial",
          verified: true
        }
      ],
      officialUrl: "https://www.britbox.com/au/"
    }
  },

  {
    id: "hayu_au",
    name: "Hayu (Australia)",
    category: "video",
    tagline: "Same-Day Reality TV: The Real Housewives, Below Deck, Vanderpump Rules & Top Chef",
    logoText: "HAYU",
    accentColor: "from-pink-600 to-rose-950",
    badge: "Ultimate Reality Hub",
    popularShows: ["The Real Housewives of Beverly Hills", "Below Deck", "Vanderpump Rules", "The Real Housewives of Salt Lake City", "Southern Charm", "Top Chef", "Summer House", "Million Dollar Listing"],
    plans: [
      {
        name: "Monthly Plan",
        price: 6.99,
        period: "month",
        screens: 1,
        resolution: "Full HD (1080p)",
        devices: "TV, Phone, Web, Tablet",
        audio: "Stereo",
        ads: "100% Ad-Free"
      },
      {
        name: "6-Month Plan",
        price: 33.99,
        period: "6 months",
        screens: 1,
        resolution: "Full HD (1080p)",
        devices: "All Devices",
        audio: "Stereo",
        ads: "100% Ad-Free"
      },
      {
        name: "12-Month Plan",
        price: 61.99,
        period: "year",
        screens: 1,
        resolution: "Full HD (1080p)",
        devices: "All Devices",
        audio: "Stereo",
        ads: "100% Ad-Free (25% Savings)"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Optus SubHub",
          plan: "Optus SubHub 10% Discount",
          claimSteps: "Bundle Hayu onto Optus SubHub to drop your monthly rate to $6.29/month."
        }
      ],
      voucherSavings: {
        provider: "Prime Video Channels",
        discountPercent: "7-Day Free Trial",
        instructions: "Subscribe via Prime Video Channels to test 9,000+ reality episodes with instant cancellation.",
        effectivePrice: 0.00
      },
      comboPass: {
        passName: "Hayu Annual Pass",
        passPrice: 61.99,
        individualSum: 83.88,
        netSavings: "21.89/yr",
        bundledWith: ["350+ Reality TV Shows", "Same day as US TV", "Full Offline Downloads"]
      },
      coupons: [
        {
          code: "HAYUAU25",
          discount: "Save 25% on 12-Month Membership",
          verified: true
        }
      ],
      officialUrl: "https://www.hayu.com/au"
    }
  },

  // ==========================================
  // 2. MUSIC & AUDIO STREAMING
  // ==========================================
  {
    id: "spotify_au",
    name: "Spotify (Australia)",
    category: "music",
    tagline: "Over 100 Million Songs: The Kid LAROI, Tame Impala, Troye Sivan, Podcasts & Audiobooks",
    logoText: "SPOTIFY",
    accentColor: "from-emerald-500 to-black",
    badge: "World's #1 Music App",
    popularShows: ["The Joe Rogan Experience", "Call Her Daddy", "Hot Hits Australia", "Top 50 Australia", "Aussie Indie", "Today's Top Hits"],
    plans: [
      {
        name: "Individual",
        price: 13.99,
        period: "month",
        screens: 1,
        resolution: "320kbps High Quality Audio",
        devices: "All Devices (Smart Speakers, Phone, Car)",
        audio: "Extreme 320kbps",
        ads: "100% Ad-Free"
      },
      {
        name: "Student (50% Off)",
        price: 6.99,
        period: "month",
        screens: 1,
        resolution: "320kbps",
        devices: "All Devices",
        audio: "Extreme 320kbps",
        ads: "100% Ad-Free"
      },
      {
        name: "Duo (2 Accounts)",
        price: 18.99,
        period: "month",
        screens: 2,
        resolution: "320kbps",
        devices: "All Devices",
        audio: "Extreme 320kbps",
        ads: "100% Ad-Free"
      },
      {
        name: "Family (6 Accounts)",
        price: 23.99,
        period: "month",
        screens: 6,
        resolution: "320kbps",
        devices: "All Devices",
        audio: "Extreme 320kbps",
        ads: "100% Ad-Free"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Telstra Plus",
          plan: "Telstra Plus Points Redemption",
          claimSteps: "Telstra customers can redeem Telstra Plus points for Spotify Premium e-gift vouchers in the Telstra Rewards store."
        }
      ],
      voucherSavings: {
        provider: "Woolworths Everyday Rewards",
        discountPercent: "20x Points Promotion",
        instructions: "Buy Spotify gift cards during 20x Everyday Rewards points specials at Woolworths to get 10% back in supermarket grocery discounts.",
        effectivePrice: 12.59
      },
      comboPass: {
        passName: "Spotify Family Plan Split",
        passPrice: 23.99,
        individualSum: 83.94,
        netSavings: "59.95/mo",
        bundledWith: ["6 Separate Premium Accounts", "Spotify Kids", "Family Mix Playlist"]
      },
      coupons: [
        {
          code: "SPTAUSTUDENT",
          discount: "50% Off for Australian University & TAFE Students",
          verified: true
        }
      ],
      officialUrl: "https://www.spotify.com/au/"
    }
  },

  {
    id: "apple_one_au",
    name: "Apple One (Australia)",
    category: "music",
    tagline: "Apple Music, Apple TV+, Apple Arcade & iCloud Storage in One Powerful Australian Bundle",
    logoText: "APPLE ONE",
    accentColor: "from-zinc-700 to-black",
    badge: "Ultimate Apple Ecosystem Pass",
    popularShows: ["Apple Music Spatial Audio", "Apple TV+ Originals", "Apple Arcade 200+ Games", "iCloud+ Private Relay", "Lossless Hi-Res Audio"],
    plans: [
      {
        name: "Individual",
        price: 24.95,
        period: "month",
        screens: 1,
        resolution: "Lossless Audio + 4K HDR",
        devices: "All Apple Devices, Web, Android",
        audio: "Spatial Audio with Dolby Atmos",
        ads: "100% Ad-Free"
      },
      {
        name: "Family (6 Members)",
        price: 31.95,
        period: "month",
        screens: 6,
        resolution: "Lossless Audio + 4K HDR",
        devices: "Up to 6 family members with own Apple IDs",
        audio: "Dolby Atmos",
        ads: "100% Ad-Free + 200GB iCloud"
      },
      {
        name: "Premier",
        price: 44.95,
        period: "month",
        screens: 6,
        resolution: "Lossless Audio + 4K HDR",
        devices: "All Devices",
        audio: "Dolby Atmos",
        ads: "Includes Apple News+ & Apple Fitness+ with 2TB iCloud"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Telstra / Optus",
          plan: "Mobile Postpaid Promotional Add-ons",
          claimSteps: "Look for seasonal carrier promotions bundling 3 to 6 months of Apple Music or Apple TV+."
        }
      ],
      voucherSavings: {
        provider: "Woolworths 20x Everyday Rewards",
        discountPercent: "20x Points on Apple Gift Cards",
        instructions: "Purchase Apple Gift Cards during Woolworths 20x points promotions and apply to your Apple ID balance to pay for Apple One.",
        effectivePrice: 21.95
      },
      comboPass: {
        passName: "Apple One Family Plan",
        passPrice: 31.95,
        individualSum: 62.90,
        netSavings: "30.95/mo",
        bundledWith: ["Apple Music Family", "Apple TV+", "Apple Arcade", "200GB iCloud Storage for 6"]
      },
      coupons: [
        {
          code: "APPLEONE1MO",
          discount: "1 Month 100% Free Trial",
          verified: true
        }
      ],
      officialUrl: "https://www.apple.com/au/apple-one/"
    }
  },

  {
    id: "youtube_premium_au",
    name: "YouTube Premium (Australia)",
    category: "music",
    tagline: "Zero Ads on All YouTube Videos, Background Play, Offline Downloads & YouTube Music Included",
    logoText: "YT PREMIUM",
    accentColor: "from-red-600 to-black",
    badge: "Ad-Free Video & Music",
    popularShows: ["Zero Video Ads", "YouTube Music 100M+ Songs", "Offline Download in 1080p", "Background Audio Playback", "Smart TV Ad-Free"],
    plans: [
      {
        name: "Individual",
        price: 16.99,
        period: "month",
        screens: 1,
        resolution: "1080p Premium Bitrate",
        devices: "All Devices (Smart TV, Mobile, Console)",
        audio: "High Quality 256kbps",
        ads: "100% Ad-Free"
      },
      {
        name: "Student (40% Off)",
        price: 10.49,
        period: "month",
        screens: 1,
        resolution: "1080p Premium Bitrate",
        devices: "All Devices",
        audio: "High Quality",
        ads: "100% Ad-Free"
      },
      {
        name: "Family (Up to 5 Family Members)",
        price: 32.99,
        period: "month",
        screens: 5,
        resolution: "1080p Premium Bitrate",
        devices: "Up to 5 separate Google accounts",
        audio: "High Quality",
        ads: "100% Ad-Free"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Google Pixel / Samsung Galaxy (Australia)",
          plan: "New Device Purchase with Telstra/Optus/Vodafone",
          claimSteps: "Australian Pixel and Galaxy phone activations unlock 3 months of complimentary YouTube Premium via the YouTube app profile banner."
        }
      ],
      voucherSavings: {
        provider: "Coles Flybuys / Woolworths Rewards",
        discountPercent: "5%-10% Points Value on Google Play Gift Cards",
        instructions: "Buy Google Play gift cards during supermarket points promotions to credit your YouTube billing account.",
        effectivePrice: 15.29
      },
      comboPass: {
        passName: "YouTube Family Plan Split",
        passPrice: 32.99,
        individualSum: 84.95,
        netSavings: "51.96/mo",
        bundledWith: ["5 Family Members", "Ad-Free YouTube for Living Room TV", "YouTube Music for each member"]
      },
      coupons: [
        {
          code: "YTAUSTUDENT",
          discount: "Save 40% with SheerID Australian Student Verification",
          verified: true
        }
      ],
      officialUrl: "https://www.youtube.com/premium"
    }
  },

  {
    id: "audible_au",
    name: "Audible Australia",
    category: "music",
    tagline: "World's Largest Spoken-Word Library: Audiobooks, Australian Best-Sellers & Exclusive Podcasts",
    logoText: "AUDIBLE",
    accentColor: "from-amber-500 to-slate-900",
    badge: "Audiobooks & Best-Sellers",
    popularShows: ["Boy Swallows Universe", "Atomic Habits", "The Barefoot Investor", "Phosphorescence", "Fourth Wing", "Harry Potter (Stephen Fry)"],
    plans: [
      {
        name: "Audible Plus",
        price: 11.95,
        period: "month",
        screens: 1,
        resolution: "Enhanced Audio Quality",
        devices: "Phone, Tablet, Kindle, Echo, Watch",
        audio: "Enhanced Narration",
        ads: "100% Ad-Free Unlimited Plus Catalog"
      },
      {
        name: "Audible Premium Plus",
        price: 16.45,
        period: "month",
        screens: 1,
        resolution: "Enhanced Audio Quality",
        devices: "All Devices",
        audio: "Enhanced Narration",
        ads: "1 Credit per Month for Any Title + Unlimited Plus"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Amazon Prime Australia",
          plan: "Amazon.com.au Prime Member Benefit",
          claimSteps: "Australian Prime members get an extended 2-credit 30-day trial instead of the standard 1 credit trial when joining Audible."
        }
      ],
      voucherSavings: {
        provider: "Audible Annual Plan",
        discountPercent: "Save $32/year",
        instructions: "Choose the $164.50/year upfront plan to get 12 credits immediately at roughly $13.70 per audiobook.",
        effectivePrice: 13.70
      },
      comboPass: {
        passName: "Audible Premium Plus 12-Credit Pack",
        passPrice: 164.50,
        individualSum: 197.40,
        netSavings: "32.90/yr",
        bundledWith: ["12 Audiobook Credits", "Unlimited Streaming of Plus Catalog", "30% Off Extra Audiobooks"]
      },
      coupons: [
        {
          code: "AUDIBLEAU30",
          discount: "30-Day Free Trial + 1 Free Book (2 for Prime Members)",
          verified: true
        }
      ],
      officialUrl: "https://www.audible.com.au"
    }
  },

  // ==========================================
  // 3. GAMING SUBSCRIPTIONS
  // ==========================================
  {
    id: "game_pass_au",
    name: "Xbox Game Pass Ultimate (Australia)",
    category: "gaming",
    tagline: "400+ Blockbuster Games, Day-One Releases, EA Play & Cloud Gaming on Console & PC",
    logoText: "GAME PASS",
    accentColor: "from-green-600 to-zinc-950",
    badge: "The Best Deal in Gaming",
    popularShows: ["Call of Duty: Black Ops 6", "Starfield", "Halo Infinite", "Forza Horizon 5", "EA FC 24", "Minecraft", "Sea of Thieves", "Fallout 4"],
    plans: [
      {
        name: "Core (Console)",
        price: 10.95,
        period: "month",
        screens: 1,
        resolution: "Up to 4K 120fps",
        devices: "Xbox Series X|S & Xbox One",
        audio: "Dolby Atmos / 3D Spatial",
        ads: "100% Ad-Free (25+ Curated Games)"
      },
      {
        name: "PC Game Pass",
        price: 11.95,
        period: "month",
        screens: 1,
        resolution: "Full PC Performance",
        devices: "Windows PC",
        audio: "Spatial Audio",
        ads: "100% Ad-Free (Day-One Releases + EA Play)"
      },
      {
        name: "Ultimate",
        price: 22.95,
        period: "month",
        screens: 2,
        resolution: "Console, PC & Cloud Gaming",
        devices: "Xbox, PC, Mobile, Smart TV Cloud",
        audio: "Dolby Atmos",
        ads: "All 400+ Games + EA Play + Cloud Gaming"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Telstra",
          plan: "Telstra Xbox All Access",
          claimSteps: "Telstra customers can bundle Xbox Series X/S console with 24 months of Game Pass Ultimate for $34-$46/mo with zero upfront cost."
        }
      ],
      voucherSavings: {
        provider: "Amazon.com.au / Target Australia",
        discountPercent: "15%-20% Off 3-Month Cards",
        instructions: "Look for Prime Day and Black Friday specials on 3-month digital subscription codes.",
        effectivePrice: 18.50
      },
      comboPass: {
        passName: "Core to Ultimate Conversion Trick",
        passPrice: 10.95,
        individualSum: 22.95,
        netSavings: "3:2 Conversion Ratio Savings",
        bundledWith: ["Day-One Xbox Releases", "EA Play Membership", "Cloud Gaming without Console", "Free In-Game Perks"]
      },
      coupons: [
        {
          code: "XBOXAU1TRIAL",
          discount: "$1 for First 14 Days on PC Game Pass",
          verified: true
        }
      ],
      officialUrl: "https://www.xbox.com/en-AU/xbox-game-pass"
    }
  },

  {
    id: "ps_plus_au",
    name: "PlayStation Plus (Australia)",
    category: "gaming",
    tagline: "Online Multiplayer, 3 Free Monthly Games, Game Catalog & Classic PS1/PS2/PS3 Titles",
    logoText: "PS PLUS",
    accentColor: "from-blue-700 to-indigo-950",
    badge: "Official PlayStation Membership",
    popularShows: ["Spider-Man: Miles Morales", "God of War", "The Last of Us Part I", "Ghost of Tsushima", "Demon's Souls", "Horizon Forbidden West", "Grand Theft Auto V"],
    plans: [
      {
        name: "Essential",
        price: 11.95,
        period: "month",
        screens: 1,
        resolution: "Up to 4K 120fps",
        devices: "PS5 & PS4 Consoles",
        audio: "Tempest 3D Audio",
        ads: "Online Multiplayer + 3 Free Games Monthly"
      },
      {
        name: "Extra",
        price: 18.95,
        period: "month",
        screens: 1,
        resolution: "Up to 4K 120fps",
        devices: "PS5 & PS4",
        audio: "Tempest 3D Audio",
        ads: "Essential + 400+ PS4 & PS5 Game Catalog"
      },
      {
        name: "Deluxe",
        price: 21.95,
        period: "month",
        screens: 1,
        resolution: "PS5 & PS4",
        devices: "PS5 & PS4",
        audio: "Tempest 3D Audio",
        ads: "Extra + Classic Catalog (PS1, PS2, PSP) + Game Trials"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "PlayStation Days of Play Annual Sale",
          plan: "Sony Days of Play Promotion",
          claimSteps: "Purchase annual passes during the annual 'Days of Play' (May-June) or Black Friday sales on the Australian PS Store where annual subscriptions are discounted 25%-30%."
        }
      ],
      voucherSavings: {
        provider: "Woolworths / Coles Gift Cards",
        discountPercent: "10%-15% Points Value",
        instructions: "Buy PlayStation Store gift cards during 20x points weeks at Coles or Woolies to apply to your wallet balance.",
        effectivePrice: 16.50
      },
      comboPass: {
        passName: "PS Plus Extra Annual Plan",
        passPrice: 189.95,
        individualSum: 227.40,
        netSavings: "37.45/yr",
        bundledWith: ["400+ PS5/PS4 Blockbusters", "Ubisoft+ Classics", "Online Multiplayer", "Cloud Storage"]
      },
      coupons: [
        {
          code: "PSAUANNUAL",
          discount: "Save $37 on Annual Extra Pass",
          verified: true
        }
      ],
      officialUrl: "https://www.playstation.com/en-au/ps-plus/"
    }
  },

  // ==========================================
  // 4. FOOD DELIVERY & LIFESTYLE
  // ==========================================
  {
    id: "doordash_au",
    name: "DoorDash DashPass (Australia)",
    category: "delivery",
    tagline: "$0 Delivery Fees, Reduced Service Fees & 5% Back on Pickup Orders across Australia",
    logoText: "DASHPASS",
    accentColor: "from-red-600 to-amber-700",
    badge: "$0 Food & Grocery Delivery",
    popularShows: ["$0 Delivery Fees over $20", "Reduced Service Fees", "5% Credit Back on Pickups", "Guzman y Gomez, McDonald's, Grill'd, Coles", "Exclusive Member Deals"],
    plans: [
      {
        name: "DashPass Monthly",
        price: 9.99,
        period: "month",
        screens: 1,
        resolution: "Fastest Delivery Routing",
        devices: "iOS, Android, Web",
        audio: "In-App Tracker",
        ads: "100% Ad-Free"
      },
      {
        name: "DashPass Annual",
        price: 96.00,
        period: "year",
        screens: 1,
        resolution: "Fastest Delivery Routing",
        devices: "All Devices",
        audio: "In-App Tracker",
        ads: "Save $23.88/yr ($8.00/mo effective)"
      },
      {
        name: "DashPass Student",
        price: 4.99,
        period: "month",
        screens: 1,
        resolution: "Fastest Delivery Routing",
        devices: "All Devices",
        audio: "In-App Tracker",
        ads: "100% Ad-Free"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Amazon Prime Australia / MasterCards",
          plan: "Promotional Partner Benefits",
          claimSteps: "Look out for limited-time DoorDash trial promotions offering 3 to 6 months of free DashPass with eligible Australian financial partners."
        }
      ],
      voucherSavings: {
        provider: "Cashrewards / ShopBack AU",
        discountPercent: "5%-10% Cashback on Orders",
        instructions: "Launch DoorDash through Cashrewards or ShopBack to earn cash rebates on every food delivery order.",
        effectivePrice: 8.99
      },
      comboPass: {
        passName: "DashPass Annual Subscription",
        passPrice: 96.00,
        individualSum: 119.88,
        netSavings: "23.88/yr",
        bundledWith: ["$0 Delivery Fees on Orders > $20", "Reduced Service Fees at Guzman y Gomez, Coles & Schnitz", "5% Pickup Credit"]
      },
      coupons: [
        {
          code: "DASHPASSAU1",
          discount: "30-Day Free Trial for New Australian Users",
          verified: true
        }
      ],
      officialUrl: "https://www.doordash.com/en-AU/dashpass"
    }
  },

  {
    id: "uber_one_au",
    name: "Uber One (Australia)",
    category: "delivery",
    tagline: "$0 Delivery Fee on Uber Eats, 5% Off Eligible Uber Rides & Member-Only Perks",
    logoText: "UBER ONE",
    accentColor: "from-zinc-800 to-black",
    badge: "Food & Rides Combo",
    popularShows: ["$0 Delivery Fee on Uber Eats", "Up to 10% Off Orders", "5% Off Uber Rides", "Top-rated Drivers", "$5 Credit if Delivery is Late"],
    plans: [
      {
        name: "Monthly Membership",
        price: 9.99,
        period: "month",
        screens: 1,
        resolution: "Priority Driver Matching",
        devices: "iOS, Android, Web",
        audio: "Live GPS Tracking",
        ads: "Member-Only Promotions"
      },
      {
        name: "Annual Membership",
        price: 99.99,
        period: "year",
        screens: 1,
        resolution: "Priority Driver Matching",
        devices: "All Devices",
        audio: "Live GPS Tracking",
        ads: "Save $20/year vs monthly"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "ANZ / CommBank / Virgin Australia Velocity",
          plan: "Velocity Frequent Flyer Points",
          claimSteps: "Link your Velocity Frequent Flyer account to earn Velocity points on every Uber ride and Uber Eats delivery."
        }
      ],
      voucherSavings: {
        provider: "Cashrewards AU",
        discountPercent: "Cashback on Uber Rides & Eats",
        instructions: "Activate Cashrewards before booking or ordering to earn instant statement cashback.",
        effectivePrice: 8.99
      },
      comboPass: {
        passName: "Uber One Annual Plan",
        passPrice: 99.99,
        individualSum: 119.88,
        netSavings: "19.89/yr",
        bundledWith: ["5% Off All Uber Rides", "$0 Delivery on Uber Eats", "Priority Customer Support"]
      },
      coupons: [
        {
          code: "UBERONEAU1",
          discount: "1-Month Free Trial for New Australian Accounts",
          verified: true
        }
      ],
      officialUrl: "https://www.uber.com/au/en/u/uber-one/"
    }
  },

  {
    id: "menulog_au",
    name: "Menulog (Australia)",
    category: "delivery",
    tagline: "Australia's Iconic Homegrown Delivery Network: Local Takeaways, Free Delivery & Loyalty Discounts",
    logoText: "MENULOG",
    accentColor: "from-orange-500 to-amber-700",
    badge: "Did Somebody Say Menulog?",
    popularShows: ["Local Aussie Fish & Chip Shops", "Thai, Indian, Italian & Pizza", "KFC, Oporto, Hungry Jack's", "Menulog Rewards & Promo Codes"],
    plans: [
      {
        name: "Menulog Standard (Free App)",
        price: 0.00,
        period: "month",
        screens: 1,
        resolution: "Live Order Tracking",
        devices: "iOS, Android, Web",
        audio: "Live Courier Tracking",
        ads: "Free to Browse & Order"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Vodafone Australia",
          plan: "VeryMe Rewards AU",
          claimSteps: "Vodafone mobile users can access weekly $5 to $10 off Menulog promo codes in the My Vodafone rewards lounge."
        }
      ],
      voucherSavings: {
        provider: "Cashrewards / ShopBack AU",
        discountPercent: "Up to 5%-10% Cashback",
        instructions: "Launch Menulog through Cashrewards or ShopBack to earn cash rebates on every takeaway meal.",
        effectivePrice: 0.00
      },
      comboPass: {
        passName: "Local Restaurant Loyalty Discounts",
        passPrice: 0.00,
        individualSum: 25.00,
        netSavings: "Stamp Card Deals",
        bundledWith: ["Free delivery offers", "10%-15% off first restaurant orders"]
      },
      coupons: [
        {
          code: "MENULOGAU5",
          discount: "$5 Off First Delivery Order",
          verified: true
        }
      ],
      officialUrl: "https://www.menulog.com.au"
    }
  },

  // ==========================================
  // 5. PRODUCTIVITY, AI & CLOUD
  // ==========================================
  {
    id: "chatgpt_plus_au",
    name: "ChatGPT Plus (Australia)",
    category: "productivity",
    tagline: "GPT-4o, Advanced Voice Mode, Canvas, DALL-E 3 Image Generation & Custom GPTs",
    logoText: "CHATGPT",
    accentColor: "from-emerald-600 to-teal-950",
    badge: "Top AI Work Assistant",
    popularShows: ["GPT-4o Omnimodal Reasoning", "Advanced Voice Conversations", "Interactive Canvas Coding", "DALL-E 3 Image Generator", "Data Analysis & Charting", "Custom GPTs Store"],
    plans: [
      {
        name: "ChatGPT Free",
        price: 0.00,
        period: "month",
        screens: 1,
        resolution: "Standard AI compute",
        devices: "Web, Mac, Windows, iOS, Android",
        audio: "Standard Voice",
        ads: "100% Ad-Free (Standard rate limits)"
      },
      {
        name: "ChatGPT Plus",
        price: 31.00,
        period: "month",
        screens: 2,
        resolution: "5x Priority GPT-4o compute",
        devices: "All Devices",
        audio: "Real-time Advanced Voice Mode",
        ads: "100% Ad-Free (Billed $20 USD / ~A$31.00)"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Microsoft Copilot (Free Alternate)",
          plan: "Windows 11 / Edge Copilot",
          claimSteps: "Australian users can access GPT-4 and DALL-E 3 for $0 completely free via Microsoft Copilot on Windows or Edge browser without subscribing to ChatGPT Plus."
        }
      ],
      voucherSavings: {
        provider: "Australian FX-Free Debit / Credit Cards",
        discountPercent: "Save 3% Currency Conversion Fee",
        instructions: "Pay with a 0% foreign transaction fee card (e.g. Macquarie Bank Debit or Bankwest Platinum) to avoid the typical 3% bank currency markup on the $20 USD billing.",
        effectivePrice: 30.00
      },
      comboPass: {
        passName: "ChatGPT Team Plan",
        passPrice: 38.00,
        individualSum: 60.00,
        netSavings: "Higher Message Caps & Data Privacy",
        bundledWith: ["Higher message limits", "Admin console", "Zero model training on business data"]
      },
      coupons: [
        {
          code: "OPENAIAUFREE",
          discount: "Use Free Web Tier with GPT-4o Mini",
          verified: true
        }
      ],
      officialUrl: "https://chatgpt.com"
    }
  },

  {
    id: "claude_pro_au",
    name: "Claude Pro (Australia)",
    category: "productivity",
    tagline: "Claude 3.5 Sonnet, 5x Higher Message Limits, Artifacts & In-Depth Code Synthesis",
    logoText: "CLAUDE",
    accentColor: "from-amber-600 to-amber-950",
    badge: "Best AI for Coding & Analysis",
    popularShows: ["Claude 3.5 Sonnet", "Interactive Artifacts", "200k Token Context Window", "Projects Knowledge Hub", "Long-form Document Analysis", "Python & React Coding"],
    plans: [
      {
        name: "Claude Free",
        price: 0.00,
        period: "month",
        screens: 1,
        resolution: "Standard compute",
        devices: "Web, iOS, Android",
        audio: "Text & Vision only",
        ads: "100% Ad-Free"
      },
      {
        name: "Claude Pro",
        price: 31.00,
        period: "month",
        screens: 2,
        resolution: "5x Priority Claude 3.5 Sonnet",
        devices: "Web, iOS, Android",
        audio: "Text, Code & Document Vision",
        ads: "100% Ad-Free (Billed $20 USD / ~A$31.00)"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Anthropic Free Tier",
          plan: "claude.ai Free Web Tier",
          claimSteps: "Claude 3.5 Sonnet is accessible on the free web tier for short coding questions and artifact generation with zero payment."
        }
      ],
      voucherSavings: {
        provider: "Macquarie Bank FX-Free Card",
        discountPercent: "0% Currency Fee",
        instructions: "Pay with an Australian zero-FX card to avoid foreign exchange surcharges.",
        effectivePrice: 30.50
      },
      comboPass: {
        passName: "Claude Team Membership",
        passPrice: 46.00,
        individualSum: 65.00,
        netSavings: "Collaborative Projects",
        bundledWith: ["Early access to new models", "Higher message limits", "Team project spaces"]
      },
      coupons: [
        {
          code: "CLAUDEAUFREE",
          discount: "Free Web Tier with Claude 3.5 Sonnet",
          verified: true
        }
      ],
      officialUrl: "https://claude.ai"
    }
  },

  {
    id: "microsoft_365_au",
    name: "Microsoft 365 (Australia)",
    category: "productivity",
    tagline: "Word, Excel, PowerPoint, Outlook, 1TB Secure OneDrive Cloud Storage & Microsoft Defender",
    logoText: "M365",
    accentColor: "from-blue-600 to-slate-900",
    badge: "Australia's Premier Office Suite",
    popularShows: ["Microsoft Word", "Excel Advanced Formulas", "PowerPoint Designer", "1TB OneDrive Cloud Storage", "Outlook Ad-Free", "Microsoft Defender Security"],
    plans: [
      {
        name: "Personal (1 User)",
        price: 10.00,
        period: "month",
        screens: 5,
        resolution: "Full Desktop & Cloud Suite",
        devices: "PC, Mac, iPad, iPhone, Android",
        audio: "Office Copilot ready",
        ads: "100% Ad-Free (or $99.00/year)"
      },
      {
        name: "Family (Up to 6 Users)",
        price: 13.00,
        period: "month",
        screens: 30,
        resolution: "Full Desktop & Cloud Suite",
        devices: "Up to 6 people (5 devices each)",
        audio: "Office Copilot ready",
        ads: "100% Ad-Free (6TB Total / or $129.00/yr)"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Australian Universities & TAFE",
          plan: "Office 365 Education Free",
          claimSteps: "Australian students and faculty members (UNSW, Sydney Uni, Monash, Melbourne Uni, etc.) receive full Microsoft 365 for $0 completely free with their institutional .edu.au email."
        }
      ],
      voucherSavings: {
        provider: "Amazon.com.au / JB Hi-Fi",
        discountPercent: "Save $30 on Annual Family License",
        instructions: "Look for annual digital activation keys on Amazon.com.au or JB Hi-Fi during sales events.",
        effectivePrice: 8.50
      },
      comboPass: {
        passName: "Microsoft 365 Family Plan Split",
        passPrice: 13.00,
        individualSum: 60.00,
        netSavings: "47.00/mo",
        bundledWith: ["6 Independent Accounts", "1TB OneDrive Cloud for Each Member (6TB Total)", "All Word, Excel, PowerPoint desktop apps"]
      },
      coupons: [
        {
          code: "M365STUDENTAU",
          discount: "100% Free for Eligible Australian Students",
          verified: true
        }
      ],
      officialUrl: "https://www.microsoft.com/en-au/microsoft-365"
    }
  },

  {
    id: "google_one_au",
    name: "Google One (Australia)",
    category: "cloud",
    tagline: "Expanded Cloud Storage across Google Drive, Gmail & Google Photos with AI Features",
    logoText: "GOOGLE 1",
    accentColor: "from-blue-500 to-amber-600",
    badge: "Cloud Backup & AI",
    popularShows: ["Expanded Drive Storage", "Original Quality Google Photos Backup", "Magic Eraser & Photo Editing", "Gemini Advanced 1.5 Pro AI", "Automatic Phone Backup"],
    plans: [
      {
        name: "Basic (100GB)",
        price: 2.49,
        period: "month",
        screens: 5,
        resolution: "Full Cloud Backup",
        devices: "All Devices (Android, iOS, Web)",
        audio: "High Bandwidth",
        ads: "100% Ad-Free (or $24.99/year)"
      },
      {
        name: "Standard (200GB)",
        price: 4.49,
        period: "month",
        screens: 5,
        resolution: "Full Cloud Backup",
        devices: "Share with up to 5 family members",
        audio: "High Bandwidth",
        ads: "100% Ad-Free (or $43.99/year)"
      },
      {
        name: "Premium (2TB)",
        price: 12.49,
        period: "month",
        screens: 5,
        resolution: "Full Cloud Backup + Google Workspace Perks",
        devices: "All Devices",
        audio: "High Bandwidth",
        ads: "100% Ad-Free (or $124.99/year)"
      },
      {
        name: "AI Premium (2TB + Gemini Advanced)",
        price: 32.99,
        period: "month",
        screens: 5,
        resolution: "2TB + Gemini 1.5 Pro AI Integration in Docs & Gmail",
        devices: "All Devices",
        audio: "High Bandwidth",
        ads: "100% Ad-Free"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Google Pixel / Android Australia",
          plan: "Pixel 8 / Pixel 9 Activation via Telstra/Optus",
          claimSteps: "Purchasing a new Google Pixel through Telstra or Optus includes up to 6 months of Google One or 1 year of Gemini Advanced free."
        }
      ],
      voucherSavings: {
        provider: "Google One Annual Billing",
        discountPercent: "Save 17% Instantly",
        instructions: "Switching from monthly to annual billing on the 100GB plan reduces cost from $29.88 to $24.99/year.",
        effectivePrice: 2.08
      },
      comboPass: {
        passName: "Google One Family Sharing",
        passPrice: 4.49,
        individualSum: 14.95,
        netSavings: "10.46/mo",
        bundledWith: ["Share 200GB among 5 family members", "Private individual drive spaces", "Google Photos editing perks"]
      },
      coupons: [
        {
          code: "GOOGLE1ANNUALAU",
          discount: "17% Off with Annual Payment",
          verified: true
        }
      ],
      officialUrl: "https://one.google.com/about"
    }
  }
];
