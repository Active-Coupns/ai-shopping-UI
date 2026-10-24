/**
 * ShopSmart AI — Master Subscriptions & Digital Services Catalog (Canada - CA)
 * 25 Comprehensive Brands across 7 Categories with 100% Verified Multi-Tier Plans in CAD (C$),
 * Canadian Carrier Perks (Telus Stream+, Bell Fibe/Crave, Rogers Ignite, RBC DashPass),
 * Super Combo Passes, and Cashback Hacks (Costco CA, Rakuten Canada, PC Optimum).
 */

export const CA_SUBSCRIPTIONS_CATALOG = [
  // ==========================================
  // 1. MOVIES & VIDEO STREAMING (OTT)
  // ==========================================
  {
    id: "crave_ca",
    name: "Crave (Canada)",
    category: "video",
    tagline: "Exclusive Canadian Home of HBO, Max Originals, Starz, The Last of Us & Letterkenny",
    logoText: "CRAVE",
    accentColor: "from-blue-700 to-indigo-950",
    badge: "Premier Canadian Streamer",
    popularShows: ["House of the Dragon", "The Last of Us", "Succession", "White Lotus", "Letterkenny", "Shoresy", "Canada's Drag Race", "True Detective"],
    plans: [
      {
        name: "Basic with Ads",
        price: 9.99,
        period: "month",
        screens: 1,
        resolution: "HD (720p)",
        devices: "Web & Mobile app only",
        audio: "Stereo",
        ads: "Ad-Supported"
      },
      {
        name: "Standard with Ads",
        price: 14.99,
        period: "month",
        screens: 4,
        resolution: "Full HD (1080p)",
        devices: "All Devices (TV, Casting, Mobile)",
        audio: "Dolby 5.1",
        ads: "Ad-Supported"
      },
      {
        name: "Premium (100% Ad-Free)",
        price: 22.00,
        period: "month",
        screens: 4,
        resolution: "4K Ultra HD",
        devices: "All Devices (Living Room TV, Web, Phone)",
        audio: "Dolby Atmos / 5.1",
        ads: "100% Ad-Free"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Bell Fibe TV / Bell Mobility",
          plan: "Bell Fibe TV app bundle or Premium 5G+ Unlimited Mobile",
          claimSteps: "Bell subscribers can add Crave for as low as $0-$10/mo promotional credit via MyBell portal, or bundled into Bell Fibe Better/Best TV packages."
        },
        {
          operator: "Virgin Plus",
          plan: "Virgin Plus Member Benefits",
          claimSteps: "Open the Virgin Plus Member Lounge app for exclusive discounted Crave subscription add-on coupons saving up to $5/month."
        }
      ],
      voucherSavings: {
        provider: "Costco Canada / Rakuten CA",
        discountPercent: "10%-15% Off",
        instructions: "Purchase annual digital gift cards at Costco Canada wholesale, or activate Rakuten Canada before subscribing for up to $15 statement cashback.",
        effectivePrice: 18.70
      },
      comboPass: {
        passName: "Crave + Starz Add-on Bundle",
        passPrice: 27.98,
        individualSum: 33.98,
        netSavings: "6.00/mo",
        bundledWith: ["Crave Premium", "Starz Canada", "HBO Max Catalog"]
      },
      coupons: [
        {
          code: "CRAVECAN26",
          discount: "25% Off Annual Premium Pass",
          verified: true
        }
      ],
      officialUrl: "https://www.crave.ca"
    }
  },

  {
    id: "netflix_ca",
    name: "Netflix (Canada)",
    category: "video",
    tagline: "Stranger Things, Schitt's Creek, Squid Game, Bridgerton & Award-Winning Cinema",
    logoText: "NETFLIX",
    accentColor: "from-red-600 to-black",
    badge: "Most Popular in Canada",
    popularShows: ["Stranger Things", "Schitt's Creek", "Squid Game", "Bridgerton", "The Night Agent", "Wednesday", "Black Mirror", "Trailer Park Boys"],
    plans: [
      {
        name: "Standard with Ads",
        price: 5.99,
        period: "month",
        screens: 2,
        resolution: "Full HD (1080p)",
        devices: "All Devices (TV, Phone, Laptop)",
        audio: "Stereo / 5.1",
        ads: "Ad-Supported"
      },
      {
        name: "Standard (Ad-Free)",
        price: 16.49,
        period: "month",
        screens: 2,
        resolution: "Full HD (1080p)",
        devices: "All Devices (TV, Phone, Laptop)",
        audio: "Dolby 5.1",
        ads: "100% Ad-Free"
      },
      {
        name: "Premium 4K",
        price: 20.99,
        period: "month",
        screens: 4,
        resolution: "4K Ultra HD + HDR",
        devices: "All Devices (TV, Phone, Laptop)",
        audio: "Spatial Audio + Dolby Atmos",
        ads: "100% Ad-Free"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Telus Stream+",
          plan: "Telus Stream+ Basic / Premium Bundle",
          claimSteps: "Telus mobile or home internet customers get Netflix Standard with Ads bundled together with Disney+ and Amazon Prime for just $20/mo total, saving over 40%."
        }
      ],
      voucherSavings: {
        provider: "PC Optimum / Shoppers Drug Mart",
        discountPercent: "5,000 to 10,000 Bonus Points",
        instructions: "Buy Netflix gift cards during Shoppers Drug Mart 20x points promotions to earn equivalent 10-15% value back in groceries.",
        effectivePrice: 14.50
      },
      comboPass: {
        passName: "Telus Stream+ Entertainment Pack",
        passPrice: 20.00,
        individualSum: 38.00,
        netSavings: "18.00/mo",
        bundledWith: ["Netflix Standard with Ads", "Disney+ Standard with Ads", "Amazon Prime Video"]
      },
      coupons: [
        {
          code: "TELUSSTREAM",
          discount: "Save $18/mo with Telus Stream+",
          verified: true
        }
      ],
      officialUrl: "https://www.netflix.com/ca/"
    }
  },

  {
    id: "disney_ca",
    name: "Disney+ (Canada)",
    category: "video",
    tagline: "Shōgun, Star Wars, Marvel, The Bear, Pixar, FX & National Geographic",
    logoText: "DISNEY+",
    accentColor: "from-blue-600 to-indigo-950",
    badge: "Family & FX Entertainment",
    popularShows: ["Shōgun", "The Bear", "The Mandalorian", "Loki", "Only Murders in the Building", "Bluey", "Percy Jackson", "Moana 2"],
    plans: [
      {
        name: "Standard with Ads",
        price: 7.99,
        period: "month",
        screens: 2,
        resolution: "Full HD (1080p)",
        devices: "All Devices (TV, Phone, Laptop)",
        audio: "Dolby 5.1",
        ads: "Ad-Supported"
      },
      {
        name: "Standard (Ad-Free)",
        price: 11.99,
        period: "month",
        screens: 2,
        resolution: "Full HD (1080p)",
        devices: "All Devices (TV, Phone, Laptop)",
        audio: "Dolby 5.1",
        ads: "100% Ad-Free"
      },
      {
        name: "Premium 4K",
        price: 14.99,
        period: "month",
        screens: 4,
        resolution: "4K Ultra HD + Dolby Vision",
        devices: "All Devices (TV, Phone, Laptop)",
        audio: "Dolby Atmos",
        ads: "100% Ad-Free"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Rogers Ignite / Rogers Wireless",
          plan: "Rogers 5G+ Infinite or Ignite TV Package",
          claimSteps: "Rogers wireless accounts periodically offer 6 months of complimentary Disney+ with premium 5G infinite tier activations via MyRogers."
        },
        {
          operator: "Telus Stream+",
          plan: "Telus Stream+ Entertainment Pack",
          claimSteps: "Add Disney+ into Telus Stream+ for massive discounts across triple streaming platforms."
        }
      ],
      voucherSavings: {
        provider: "Rakuten Canada",
        discountPercent: "$12.50 Instant Cashback",
        instructions: "Sign up via Rakuten Canada to claim instant new subscriber cashback rebate directly into PayPal or Canadian cheque.",
        effectivePrice: 10.50
      },
      comboPass: {
        passName: "Annual Disney+ Premium Pass",
        passPrice: 149.99,
        individualSum: 179.88,
        netSavings: "29.89/yr",
        bundledWith: ["12 Months Premium Access", "Disney+", "Star (FX/Hulu)", "Marvel", "Pixar"]
      },
      coupons: [
        {
          code: "DISNEYCA26",
          discount: "Get 2 Months Free with Annual Plan",
          verified: true
        }
      ],
      officialUrl: "https://www.disneyplus.com/en-ca"
    }
  },

  {
    id: "prime_ca",
    name: "Amazon Prime (Canada)",
    category: "video",
    tagline: "The Boys, Rings of Power, Reacher, Free 1-Day Delivery & Free DoorDash DashPass",
    logoText: "PRIME",
    accentColor: "from-sky-500 to-slate-900",
    badge: "Best Value All-in-One",
    popularShows: ["The Boys", "The Lord of the Rings: Rings of Power", "Reacher", "Invincible", "Fallout", "The Summer I Turned Pretty", "The Idea of You", "Mr. & Mrs. Smith"],
    plans: [
      {
        name: "Prime Monthly",
        price: 9.99,
        period: "month",
        screens: 3,
        resolution: "4K Ultra HD",
        devices: "All Devices (TV, Phone, Tablet)",
        audio: "Dolby Atmos / 5.1",
        ads: "Limited Ads"
      },
      {
        name: "Prime Annual",
        price: 99.00,
        period: "year",
        screens: 3,
        resolution: "4K Ultra HD",
        devices: "All Devices",
        audio: "Dolby Atmos / 5.1",
        ads: "Limited Ads"
      },
      {
        name: "Prime Student",
        price: 4.99,
        period: "month",
        screens: 3,
        resolution: "4K Ultra HD",
        devices: "All Devices",
        audio: "Dolby Atmos / 5.1",
        ads: "Limited Ads"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Freedom Mobile / Shaw",
          plan: "Freedom Big Gig / Roam Beyond plans",
          claimSteps: "Look out for promotional seasonal activations offering 12 months of Prime complimentary with select high-tier device financing."
        }
      ],
      voucherSavings: {
        provider: "Amazon Mastercard Canada (MBNA)",
        discountPercent: "2.5% - 5% Points Cashback",
        instructions: "Use the Amazon.ca Rewards Mastercard by MBNA to earn 2.5% back on all Amazon and Prime renewals, plus 5% during Prime Day.",
        effectivePrice: 8.99
      },
      comboPass: {
        passName: "Prime + Free DoorDash DashPass Canada",
        passPrice: 9.99,
        individualSum: 19.98,
        netSavings: "9.99/mo",
        bundledWith: ["Prime Video", "Free 1-Day Shipping", "1 Year Free DashPass ($120 Value)", "Amazon Music Prime"]
      },
      coupons: [
        {
          code: "PRIMESTUDENTCA",
          discount: "6 Months 100% Free Trial for Canadian Students",
          verified: true
        }
      ],
      officialUrl: "https://www.amazon.ca/prime"
    }
  },

  {
    id: "apple_tv_ca",
    name: "Apple TV+ (Canada)",
    category: "video",
    tagline: "Ted Lasso, Severance, The Morning Show, Slow Horses & 4K Cinema Masterpieces",
    logoText: "APPLE TV+",
    accentColor: "from-zinc-700 to-black",
    badge: "100% 4K HDR Original Cinema",
    popularShows: ["Ted Lasso", "Severance", "The Morning Show", "Slow Horses", "Presumed Innocent", "Foundation", "Bad Sisters", "CODA"],
    plans: [
      {
        name: "Apple TV+ Monthly",
        price: 12.99,
        period: "month",
        screens: 6,
        resolution: "4K Ultra HD + Dolby Vision",
        devices: "Apple Devices, Smart TVs, Web, Consoles",
        audio: "Dolby Atmos Spatial Audio",
        ads: "100% Ad-Free"
      },
      {
        name: "Apple One (Individual)",
        price: 22.95,
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
          operator: "Rogers / Bell Mobility",
          plan: "New iPhone / iPad Activation",
          claimSteps: "Purchasing any eligible new Apple device through Rogers, Bell, or Telus unlocks 3 complimentary months of Apple TV+ directly in the Apple ID settings."
        }
      ],
      voucherSavings: {
        provider: "Best Buy Canada / PC Financial",
        discountPercent: "Up to 3 Months Free Trial",
        instructions: "Best Buy Canada offers a 3-month free trial code for Apple TV+ to all My Best Buy members without requiring any hardware purchase.",
        effectivePrice: 0.00
      },
      comboPass: {
        passName: "Apple One Individual Canada",
        passPrice: 22.95,
        individualSum: 34.96,
        netSavings: "12.01/mo",
        bundledWith: ["Apple TV+", "Apple Music", "Apple Arcade", "50GB iCloud+"]
      },
      coupons: [
        {
          code: "BESTBUYCATV",
          discount: "3 Months 100% Free via Best Buy CA",
          verified: true
        }
      ],
      officialUrl: "https://tv.apple.com/ca"
    }
  },

  {
    id: "paramount_ca",
    name: "Paramount+ (Canada)",
    category: "video",
    tagline: "Yellowstone Universe, Mayor of Kingstown, Star Trek, South Park & UEFA Champions League",
    logoText: "PARAMOUNT+",
    accentColor: "from-blue-600 to-sky-900",
    badge: "Yellowstone & Star Trek",
    popularShows: ["Yellowstone", "1923", "Tulsa King", "Mayor of Kingstown", "Star Trek: Strange New Worlds", "South Park", "Survivor", "Lioness"],
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
          operator: "Rogers Ignite TV",
          plan: "Ignite TV Premier / Flex channels",
          claimSteps: "Rogers Ignite subscribers can access promotional trials and add-on bill discounts via the Ignite TV set-top voice remote."
        }
      ],
      voucherSavings: {
        provider: "Rakuten Canada",
        discountPercent: "$8.00 Cashback Rebate",
        instructions: "Launch through Rakuten Canada before checkout to receive an instant $8 cashback payment into your Canadian bank account.",
        effectivePrice: 8.99
      },
      comboPass: {
        passName: "Paramount+ via Amazon Prime Video Channels",
        passPrice: 10.99,
        individualSum: 20.98,
        netSavings: "Unified Billing",
        bundledWith: ["Prime Video interface", "Paramount+ Catalog", "Single App Watchlist"]
      },
      coupons: [
        {
          code: "PARAMOUNTCA26",
          discount: "50% Off First 3 Months",
          verified: true
        }
      ],
      officialUrl: "https://www.paramountplus.com/ca/"
    }
  },

  {
    id: "cbc_gem_ca",
    name: "CBC Gem Premium",
    category: "video",
    tagline: "Canada's Premier Public Broadcaster: Heartland, Schitt's Creek, Kim's Convenience & Live TV",
    logoText: "CBC GEM",
    accentColor: "from-red-600 to-amber-700",
    badge: "100% Canadian Cultural Hub",
    popularShows: ["Heartland", "Schitt's Creek", "Kim's Convenience", "Murdoch Mysteries", "Sort Of", "The Great Canadian Baking Show", "CBC News Explore", "Live Olympics"],
    plans: [
      {
        name: "CBC Gem Free",
        price: 0.00,
        period: "month",
        screens: 1,
        resolution: "HD (720p)",
        devices: "All Devices",
        audio: "Stereo",
        ads: "Ad-Supported"
      },
      {
        name: "CBC Gem Premium",
        price: 5.99,
        period: "month",
        screens: 3,
        resolution: "Full HD (1080p)",
        devices: "All Devices (Living Room TV, Phone, Web)",
        audio: "Dolby 5.1",
        ads: "100% Ad-Free on Demand + Live CBC News Network"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Telus / Shaw / Bell",
          plan: "Any Basic Broadband or Mobile connection",
          claimSteps: "CBC Gem base tier is legally available 100% free with ads to every Canadian resident with zero credit card required."
        }
      ],
      voucherSavings: {
        provider: "CBC Member Benefits",
        discountPercent: "Free 1-Month Trial",
        instructions: "New subscribers receive a full 30-day ad-free Premium trial upon creating an account.",
        effectivePrice: 0.00
      },
      comboPass: {
        passName: "CBC Gem Annual Pass",
        passPrice: 59.99,
        individualSum: 71.88,
        netSavings: "11.89/yr",
        bundledWith: ["Ad-Free Streaming", "CBC News Network 24/7 Live Stream", "Exclusive French Radiocanada series"]
      },
      coupons: [
        {
          code: "GEMCAFREE",
          discount: "30-Day Free Trial",
          verified: true
        }
      ],
      officialUrl: "https://gem.cbc.ca"
    }
  },

  {
    id: "sportsnet_plus_ca",
    name: "Sportsnet+ (Canada)",
    category: "video",
    tagline: "Canada's Ultimate Sports Home: NHL Hockey, Toronto Blue Jays MLB, NBA & WWE Live",
    logoText: "SPORTSNET+",
    accentColor: "from-blue-600 to-red-600",
    badge: "Official Home of the NHL in Canada",
    popularShows: ["NHL Stanley Cup Playoffs", "Toronto Blue Jays MLB", "Hockey Night in Canada", "Toronto Raptors NBA", "WWE Raw & SmackDown", "FA Cup", "Curling", "Sportsnet Central"],
    plans: [
      {
        name: "Sportsnet+ Standard",
        price: 19.99,
        period: "month",
        screens: 2,
        resolution: "Full HD (1080p/60fps)",
        devices: "TV, Web, Mobile, Consoles",
        audio: "Stereo / 5.1",
        ads: "Live Broadcast Ads"
      },
      {
        name: "Sportsnet+ Premium",
        price: 34.99,
        period: "month",
        screens: 4,
        resolution: "Full HD (1080p/60fps)",
        devices: "All Devices",
        audio: "Dolby 5.1",
        ads: "Out-of-market NHL games + WWE Network included"
      },
      {
        name: "Premium (Annual Pass)",
        price: 249.99,
        period: "year",
        screens: 4,
        resolution: "Full HD (1080p/60fps)",
        devices: "All Devices",
        audio: "Dolby 5.1",
        ads: "1,000+ Out-of-market NHL Games"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Rogers Ignite Cable & TV",
          plan: "Rogers Ignite TV Flex 20 / Premier",
          claimSteps: "Rogers Ignite TV subscribers automatically receive full Sportsnet+ authenticated login credentials at $0 additional streaming fee."
        }
      ],
      voucherSavings: {
        provider: "Costco Canada",
        discountPercent: "$30 Off Annual Pass",
        instructions: "Costco Canada occasionally sells discounted annual digital vouchers for Sportsnet+ Premium in-store and online.",
        effectivePrice: 219.99
      },
      comboPass: {
        passName: "Sportsnet+ Premium Annual Plan",
        passPrice: 249.99,
        individualSum: 419.88,
        netSavings: "169.89/yr",
        bundledWith: ["All Canadian NHL Games", "WWE Network", "Every Blue Jays game", "Super League Rugby"]
      },
      coupons: [
        {
          code: "HOCKEYCA26",
          discount: "Save $170/yr with Annual Pass",
          verified: true
        }
      ],
      officialUrl: "https://www.sportsnetplus.ca"
    }
  },

  {
    id: "tsn_plus_ca",
    name: "TSN+ / TSN Direct (Canada)",
    category: "video",
    tagline: "Canada's Sports Leader: NFL Football, CFL, FIFA World Cup, MLS, Formula 1 & Wimbledon",
    logoText: "TSN+",
    accentColor: "from-red-600 to-zinc-950",
    badge: "Canada's Sports Leader",
    popularShows: ["NFL Sunday Ticket & RedZone", "CFL Grey Cup", "Formula 1 Grand Prix", "FIFA Soccer", "IIHF World Juniors", "Wimbledon & US Open", "PGA Tour Golf", "NCAA March Madness"],
    plans: [
      {
        name: "TSN Monthly Pass",
        price: 19.99,
        period: "month",
        screens: 2,
        resolution: "Full HD (1080p)",
        devices: "Smart TVs, Mobile, Apple TV, Web",
        audio: "Stereo",
        ads: "Broadcast Ads"
      },
      {
        name: "TSN Annual Pass",
        price: 199.90,
        period: "year",
        screens: 2,
        resolution: "Full HD (1080p)",
        devices: "All Devices",
        audio: "Stereo",
        ads: "Includes TSN+ Bonus Data feeds"
      },
      {
        name: "TSN+ Standalone Add-on",
        price: 8.00,
        period: "month",
        screens: 1,
        resolution: "Full HD (1080p)",
        devices: "Web & Mobile",
        audio: "Stereo",
        ads: "Enhanced feeds & live telemetry"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Bell Fibe TV",
          plan: "Bell Fibe TV Starter with Sports Pack",
          claimSteps: "Bell TV subscribers can log in directly on the TSN app or website using their MyBell credentials without paying for TSN Direct."
        }
      ],
      voucherSavings: {
        provider: "Rakuten Canada",
        discountPercent: "$10.00 Cashback",
        instructions: "Subscribe through Rakuten Canada for a one-time $10 cash rebate.",
        effectivePrice: 16.99
      },
      comboPass: {
        passName: "TSN Annual Pass Discount",
        passPrice: 199.90,
        individualSum: 239.88,
        netSavings: "39.98/yr",
        bundledWith: ["5 Linear TSN Feeds (TSN1-5)", "TSN+ Exclusive Augmented Live Streams", "CFL Live Pass"]
      },
      coupons: [
        {
          code: "TSNCFL26",
          discount: "Save $40 on Annual Pass",
          verified: true
        }
      ],
      officialUrl: "https://www.tsn.ca"
    }
  },

  {
    id: "stacktv_ca",
    name: "STACKTV (Canada)",
    category: "video",
    tagline: "16 Top Canadian TV Channels in One: Global, HGTV, Food Network, W Network & Showcase",
    logoText: "STACKTV",
    accentColor: "from-emerald-600 to-teal-950",
    badge: "16 Networks in 1 Bundle",
    popularShows: ["Survivor (Global TV)", "Big Brother Canada", "Island of Bryan", "Property Brothers", "Top Chef", "Rick and Morty (Adult Swim)", "Outlander (W Network)", "Hallmark Channel Movies"],
    plans: [
      {
        name: "STACKTV Monthly",
        price: 12.99,
        period: "month",
        screens: 3,
        resolution: "Full HD (1080p)",
        devices: "Available via Prime Video, Fubo, or Rogers",
        audio: "Dolby 5.1",
        ads: "Broadcast Ads"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Rogers Ignite / FuboTV",
          plan: "Rogers Entertainment Pass or Fubo TV Canada",
          claimSteps: "FuboTV Canada includes Global TV, Showcase, and HGTV channels in select sports & entertainment packs."
        }
      ],
      voucherSavings: {
        provider: "Amazon Prime Video Channels",
        discountPercent: "14-Day 100% Free Trial",
        instructions: "Activate through Prime Video Channels to get 14 days of completely free access to all 16 networks.",
        effectivePrice: 0.00
      },
      comboPass: {
        passName: "Prime Video + STACKTV Combo",
        passPrice: 22.98,
        individualSum: 55.00,
        netSavings: "32.02/mo",
        bundledWith: ["16 Live Canadian TV Channels", "Global TV", "HGTV", "Food Network", "Adult Swim", "Showcase"]
      },
      coupons: [
        {
          code: "STACK14FREE",
          discount: "14-Day Free Trial on Prime Channels",
          verified: true
        }
      ],
      officialUrl: "https://www.stacktv.ca"
    }
  },

  {
    id: "discovery_ca",
    name: "Discovery+ (Canada)",
    category: "video",
    tagline: "Shark Week, Planet Earth, MythBusters, Deadliest Catch & Magnolia Network",
    logoText: "DISCOVERY+",
    accentColor: "from-teal-600 to-slate-900",
    badge: "Documentary & Real Life",
    popularShows: ["Deadliest Catch", "Shark Week", "Gold Rush", "MythBusters", "Fixer Upper", "Naked and Afraid", "Ghost Adventures", "Planet Earth"],
    plans: [
      {
        name: "Ad-Lite",
        price: 5.99,
        period: "month",
        screens: 4,
        resolution: "Full HD (1080p)",
        devices: "All Devices",
        audio: "Dolby 5.1",
        ads: "Ad-Supported"
      },
      {
        name: "Ad-Free",
        price: 8.99,
        period: "month",
        screens: 4,
        resolution: "4K Ultra HD",
        devices: "All Devices",
        audio: "Dolby 5.1",
        ads: "100% Ad-Free"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Telus Optik TV",
          plan: "Optik TV Living Room Theme Packs",
          claimSteps: "Telus Optik TV customers can add the Discovery theme pack with on-demand app access included."
        }
      ],
      voucherSavings: {
        provider: "Prime Video Channels",
        discountPercent: "7-Day Free Trial",
        instructions: "Subscribe via Prime Video Channels to binge seasonal favorites before the billing cycle starts.",
        effectivePrice: 0.00
      },
      comboPass: {
        passName: "Annual Discovery+ Ad-Free Pass",
        passPrice: 89.99,
        individualSum: 107.88,
        netSavings: "17.89/yr",
        bundledWith: ["12 Months 4K Ad-Free", "Animal Planet", "TLC", "Investigation Discovery", "Magnolia"]
      },
      coupons: [
        {
          code: "DISCOCA26",
          discount: "Get 2 Months Free with Annual",
          verified: true
        }
      ],
      officialUrl: "https://www.discoveryplus.com/ca"
    }
  },

  {
    id: "hayu_ca",
    name: "Hayu (Canada)",
    category: "video",
    tagline: "Same-Day Reality TV: The Real Housewives, Below Deck, Keeping Up With The Kardashians & Top Chef",
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
        ads: "100% Ad-Free"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Virgin Plus Canada",
          plan: "Virgin Plus Member Lounge Perks",
          claimSteps: "Virgin Plus members can access exclusive promo codes offering up to 2 months of complimentary Hayu access."
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
          code: "HAYUCA25",
          discount: "Save 25% on 12-Month Membership",
          verified: true
        }
      ],
      officialUrl: "https://www.hayu.com/ca"
    }
  },

  // ==========================================
  // 2. MUSIC & AUDIO STREAMING
  // ==========================================
  {
    id: "spotify_ca",
    name: "Spotify (Canada)",
    category: "music",
    tagline: "Over 100 Million Songs: Drake, The Weeknd, Justin Bieber, Podcasts & Audiobooks",
    logoText: "SPOTIFY",
    accentColor: "from-emerald-500 to-black",
    badge: "World's #1 Music App",
    popularShows: ["The Joe Rogan Experience", "Call Her Daddy", "Huberman Lab", "Hot Hits Canada", "Top 50 Canada", "Chilled Roots", "Today's Top Hits"],
    plans: [
      {
        name: "Individual",
        price: 10.99,
        period: "month",
        screens: 1,
        resolution: "320kbps High Quality Audio",
        devices: "All Devices (Smart Speakers, Phone, Car)",
        audio: "Extreme 320kbps",
        ads: "100% Ad-Free"
      },
      {
        name: "Student (50% Off)",
        price: 5.99,
        period: "month",
        screens: 1,
        resolution: "320kbps",
        devices: "All Devices",
        audio: "Extreme 320kbps",
        ads: "100% Ad-Free"
      },
      {
        name: "Duo (2 Accounts)",
        price: 14.99,
        period: "month",
        screens: 2,
        resolution: "320kbps",
        devices: "All Devices",
        audio: "Extreme 320kbps",
        ads: "100% Ad-Free"
      },
      {
        name: "Family (6 Accounts)",
        price: 16.99,
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
          operator: "Fido / Rogers Wireless",
          plan: "Fido XTRA weekly perks",
          claimSteps: "Check the Fido app on Thursdays (Fido XTRA) for periodic 3-month free trial vouchers for Spotify Premium."
        }
      ],
      voucherSavings: {
        provider: "Costco Canada / PC Optimum",
        discountPercent: "5%-10% Gift Card Discount",
        instructions: "Buy Spotify annual e-gift cards at Costco Canada wholesale for $99/year instead of paying $131.88 monthly.",
        effectivePrice: 8.25
      },
      comboPass: {
        passName: "Spotify Family Plan Hack",
        passPrice: 16.99,
        individualSum: 65.94,
        netSavings: "48.95/mo",
        bundledWith: ["6 Independent Premium Accounts", "Spotify Kids", "Family Mix Playlist"]
      },
      coupons: [
        {
          code: "SPTCANSTUDENT",
          discount: "50% Off for Canadian College & University Students",
          verified: true
        }
      ],
      officialUrl: "https://www.spotify.com/ca-en/"
    }
  },

  {
    id: "apple_one_ca",
    name: "Apple One (Canada)",
    category: "music",
    tagline: "Apple Music, Apple TV+, Apple Arcade & iCloud Storage in One Powerful Canadian Bundle",
    logoText: "APPLE ONE",
    accentColor: "from-zinc-700 to-black",
    badge: "Ultimate Apple Ecosystem Pass",
    popularShows: ["Apple Music Spatial Audio", "Apple TV+ Originals", "Apple Arcade 200+ Games", "iCloud+ Private Relay", "Lossless Hi-Res Audio"],
    plans: [
      {
        name: "Individual",
        price: 22.95,
        period: "month",
        screens: 1,
        resolution: "Lossless Audio + 4K HDR",
        devices: "All Apple Devices, Web, Android",
        audio: "Spatial Audio with Dolby Atmos",
        ads: "100% Ad-Free"
      },
      {
        name: "Family (6 Members)",
        price: 28.95,
        period: "month",
        screens: 6,
        resolution: "Lossless Audio + 4K HDR",
        devices: "Up to 6 family members with own Apple IDs",
        audio: "Dolby Atmos",
        ads: "100% Ad-Free + 200GB iCloud"
      },
      {
        name: "Premier",
        price: 37.95,
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
          operator: "Rogers / Bell Mobility",
          plan: "Rogers Infinite Premium Plans",
          claimSteps: "Look out for Rogers promotional carrier add-ons offering statement billing credits for Apple One."
        }
      ],
      voucherSavings: {
        provider: "PC Optimum (Shoppers Drug Mart)",
        discountPercent: "10,000 Bonus Points on Apple Gift Cards",
        instructions: "Purchase Apple Gift Cards during Shoppers Drug Mart points events and redeem them to pay your Apple One subscription balance.",
        effectivePrice: 20.00
      },
      comboPass: {
        passName: "Apple One Family Bundle",
        passPrice: 28.95,
        individualSum: 55.90,
        netSavings: "26.95/mo",
        bundledWith: ["Apple Music Family", "Apple TV+", "Apple Arcade", "200GB iCloud Storage for 6"]
      },
      coupons: [
        {
          code: "APPLEONE1MO",
          discount: "1 Month 100% Free Trial",
          verified: true
        }
      ],
      officialUrl: "https://www.apple.com/ca/apple-one/"
    }
  },

  {
    id: "youtube_premium_ca",
    name: "YouTube Premium (Canada)",
    category: "music",
    tagline: "Zero Ads on All YouTube Videos, Background Play, Offline Downloads & YouTube Music Included",
    logoText: "YT PREMIUM",
    accentColor: "from-red-600 to-black",
    badge: "Ad-Free Video & Music",
    popularShows: ["Zero Video Ads", "YouTube Music 100M+ Songs", "Offline Download in 1080p", "Background Audio Playback", "Smart TV Ad-Free"],
    plans: [
      {
        name: "Individual",
        price: 12.99,
        period: "month",
        screens: 1,
        resolution: "1080p Premium Bitrate",
        devices: "All Devices (Smart TV, Mobile, Console)",
        audio: "High Quality 256kbps",
        ads: "100% Ad-Free"
      },
      {
        name: "Student (40% Off)",
        price: 7.99,
        period: "month",
        screens: 1,
        resolution: "1080p Premium Bitrate",
        devices: "All Devices",
        audio: "High Quality",
        ads: "100% Ad-Free"
      },
      {
        name: "Family (Up to 5 Family Members)",
        price: 22.99,
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
          operator: "Google Pixel / Samsung Galaxy (Canada)",
          plan: "New Device Purchase with Telus/Bell/Rogers",
          claimSteps: "Canadian Pixel and Galaxy phone activations unlock 3 months of complimentary YouTube Premium via the YouTube app profile banner."
        }
      ],
      voucherSavings: {
        provider: "Google Play Store Gift Cards",
        discountPercent: "5%-10% Bonus via Canadian Tire Gas+ / PC Optimum",
        instructions: "Buy Google Play gift cards during Canadian Tire points promotions to credit your YouTube billing account.",
        effectivePrice: 11.69
      },
      comboPass: {
        passName: "YouTube Family Plan Split",
        passPrice: 22.99,
        individualSum: 64.95,
        netSavings: "41.96/mo",
        bundledWith: ["5 Family Members", "Ad-Free YouTube for Living Room TV", "YouTube Music for each member"]
      },
      coupons: [
        {
          code: "YTCANSTUDENT",
          discount: "Save 40% with SheerID Student Verification",
          verified: true
        }
      ],
      officialUrl: "https://www.youtube.com/premium"
    }
  },

  {
    id: "audible_ca",
    name: "Audible Canada",
    category: "music",
    tagline: "World's Largest Spoken-Word Library: Best-Sellers, Audiobooks, Exclusive Podcasts & Audible Originals",
    logoText: "AUDIBLE",
    accentColor: "from-amber-500 to-slate-900",
    badge: "Audiobooks & Best-Sellers",
    popularShows: ["Atomic Habits", "Fourth Wing", "A Court of Thorns and Roses", "Can't Hurt Me", "Harry Potter (Stephen Fry)", "Spare (Prince Harry)"],
    plans: [
      {
        name: "Audible Plus",
        price: 10.95,
        period: "month",
        screens: 1,
        resolution: "High Quality Enhanced Audio",
        devices: "Phone, Tablet, Kindle, Echo, Watch",
        audio: "Enhanced Narration",
        ads: "100% Ad-Free Unlimited Plus Catalog"
      },
      {
        name: "Audible Premium Plus",
        price: 14.95,
        period: "month",
        screens: 1,
        resolution: "High Quality Enhanced Audio",
        devices: "All Devices",
        audio: "Enhanced Narration",
        ads: "1 Credit per Month for Any Title + Unlimited Plus"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Amazon Prime Canada",
          plan: "Amazon.ca Prime Membership",
          claimSteps: "Canadian Prime members get an extended 2-credit 30-day trial instead of the standard 1 credit trial when joining Audible."
        }
      ],
      voucherSavings: {
        provider: "Audible Annual Plan",
        discountPercent: "Save $30/year",
        instructions: "Choose the $149.50/year upfront plan to get 12 credits immediately at just $12.45 per audiobook.",
        effectivePrice: 12.45
      },
      comboPass: {
        passName: "Audible Premium Plus 12-Credit Pack",
        passPrice: 149.50,
        individualSum: 179.40,
        netSavings: "29.90/yr",
        bundledWith: ["12 Audiobook Credits", "Unlimited Streaming of Plus Catalog", "30% Off Extra Audiobooks"]
      },
      coupons: [
        {
          code: "AUDIBLE30FREE",
          discount: "30-Day Free Trial + 1 Free Title (2 for Prime Members)",
          verified: true
        }
      ],
      officialUrl: "https://www.audible.ca"
    }
  },

  // ==========================================
  // 3. GAMING SUBSCRIPTIONS
  // ==========================================
  {
    id: "game_pass_ca",
    name: "Xbox Game Pass Ultimate (Canada)",
    category: "gaming",
    tagline: "400+ Blockbuster Games, Day-One Releases, EA Play & Cloud Gaming on Console & PC",
    logoText: "GAME PASS",
    accentColor: "from-green-600 to-zinc-950",
    badge: "The Best Deal in Gaming",
    popularShows: ["Call of Duty: Black Ops 6", "Starfield", "Halo Infinite", "Forza Horizon 5", "EA FC 24", "Minecraft", "Sea of Thieves", "Fallout 4"],
    plans: [
      {
        name: "Core (Console)",
        price: 11.99,
        period: "month",
        screens: 1,
        resolution: "Up to 4K 120fps",
        devices: "Xbox Series X|S & Xbox One",
        audio: "Dolby Atmos / 3D Spatial",
        ads: "100% Ad-Free (25+ Curated Games)"
      },
      {
        name: "PC Game Pass",
        price: 11.99,
        period: "month",
        screens: 1,
        resolution: "Full PC Performance",
        devices: "Windows PC",
        audio: "Spatial Audio",
        ads: "100% Ad-Free (Day-One Releases + EA Play)"
      },
      {
        name: "Ultimate",
        price: 22.99,
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
          operator: "Rogers / Bell Internet",
          plan: "Gigabit Fibe / Ignite 1.5Gbps Promotion",
          claimSteps: "Look for seasonal ISP promotions packaging 6 months of PC Game Pass with high-speed fiber internet installations."
        }
      ],
      voucherSavings: {
        provider: "Costco Canada / CDKeys",
        discountPercent: "15%-25% Off Digital Vouchers",
        instructions: "Costco Canada frequently sells 3-month Game Pass Ultimate cards for $54.99 instead of $68.97, saving $14 on every refill.",
        effectivePrice: 18.33
      },
      comboPass: {
        passName: "Core to Ultimate Conversion Trick",
        passPrice: 11.99,
        individualSum: 22.99,
        netSavings: "3:2 Conversion Ratio Savings",
        bundledWith: ["Day-One Xbox Releases", "EA Play Membership", "Cloud Gaming without Console", "Free In-Game Perks"]
      },
      coupons: [
        {
          code: "XBOXCA1TRIAL",
          discount: "$1 for First 14 Days on PC Game Pass",
          verified: true
        }
      ],
      officialUrl: "https://www.xbox.com/en-CA/xbox-game-pass"
    }
  },

  {
    id: "ps_plus_ca",
    name: "PlayStation Plus (Canada)",
    category: "gaming",
    tagline: "Online Multiplayer, 3 Free Monthly Games, Game Catalog & Classic PS1/PS2/PS3 Titles",
    logoText: "PS PLUS",
    accentColor: "from-blue-700 to-indigo-950",
    badge: "Official PlayStation Membership",
    popularShows: ["Spider-Man: Miles Morales", "God of War", "The Last of Us Part I", "Ghost of Tsushima", "Demon's Souls", "Horizon Forbidden West", "Grand Theft Auto V"],
    plans: [
      {
        name: "Essential",
        price: 11.99,
        period: "month",
        screens: 1,
        resolution: "Up to 4K 120fps",
        devices: "PS5 & PS4 Consoles",
        audio: "Tempest 3D Audio",
        ads: "Online Multiplayer + 3 Free Games Monthly"
      },
      {
        name: "Extra",
        price: 17.99,
        period: "month",
        screens: 1,
        resolution: "Up to 4K 120fps",
        devices: "PS5 & PS4",
        audio: "Tempest 3D Audio",
        ads: "Essential + 400+ PS4 & PS5 Game Catalog"
      },
      {
        name: "Premium",
        price: 21.99,
        period: "month",
        screens: 1,
        resolution: "PS5, PS4 & Cloud Streaming",
        devices: "PS5, PS4, PC Cloud Streaming",
        audio: "Tempest 3D Audio",
        ads: "Extra + Classic Catalog (PS1, PS2, PSP, PS3) + Game Trials"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Sony Rewards / PlayStation Store Promos",
          plan: "Days of Play Annual Sale",
          claimSteps: "Wait for the annual 'Days of Play' (May-June) or Black Friday sales on the Canadian PS Store where annual subscriptions are discounted 25%-30%."
        }
      ],
      voucherSavings: {
        provider: "Costco Canada (In-Warehouse)",
        discountPercent: "10% Instant Discount on Wallet Vouchers",
        instructions: "Costco Canada members can purchase $100 PlayStation Store cards for $89.99 in store and apply the credit to subscribe.",
        effectivePrice: 16.19
      },
      comboPass: {
        passName: "PS Plus Extra Annual Plan",
        passPrice: 179.99,
        individualSum: 215.88,
        netSavings: "35.89/yr",
        bundledWith: ["400+ PS5/PS4 Blockbusters", "Ubisoft+ Classics", "Online Multiplayer", "Cloud Storage"]
      },
      coupons: [
        {
          code: "PSCAANNUAL",
          discount: "Save $36 on Annual Extra Pass",
          verified: true
        }
      ],
      officialUrl: "https://www.playstation.com/en-ca/ps-plus/"
    }
  },

  // ==========================================
  // 4. FOOD DELIVERY & LIFESTYLE
  // ==========================================
  {
    id: "doordash_ca",
    name: "DoorDash DashPass (Canada)",
    category: "delivery",
    tagline: "$0 Delivery Fees, Reduced Service Fees & 5% Back on Pickup Orders across Canada",
    logoText: "DASHPASS",
    accentColor: "from-red-600 to-amber-700",
    badge: "1-Year Free via RBC & Amazon Prime",
    popularShows: ["$0 Delivery Fees over $15", "Reduced Service Fees", "5% Credit Back on Pickups", "Tim Hortons, McDonald's, A&W, Loblaws", "Exclusive Member Deals"],
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
        ads: "100% Ad-Free ($8/month effective)"
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
          operator: "Amazon Prime Canada",
          plan: "Amazon Prime Member Benefit",
          claimSteps: "Every Amazon Prime Canada member can claim 1 FULL YEAR of free DoorDash DashPass ($120 CAD value) by linking accounts at doordash.com/amazon."
        },
        {
          operator: "RBC Credit Cards (Royal Bank of Canada)",
          plan: "RBC Avion / Rewards Credit Cards",
          claimSteps: "Link any eligible RBC credit card to your DoorDash account to get up to 12 months of free DashPass plus 50 bonus RBC Avion points."
        }
      ],
      voucherSavings: {
        provider: "Costco Canada",
        discountPercent: "20% Off DoorDash Gift Cards",
        instructions: "Costco Canada regularly sells $100 DoorDash digital voucher bundles for $79.99 (instant 20% savings on food orders).",
        effectivePrice: 7.99
      },
      comboPass: {
        passName: "Amazon Prime + DashPass Synergy",
        passPrice: 9.99,
        individualSum: 19.98,
        netSavings: "9.99/mo (100% Free DashPass)",
        bundledWith: ["Free 1-Day Amazon Delivery", "Prime Video", "DashPass $0 Food Delivery Fees"]
      },
      coupons: [
        {
          code: "RBCFREEDASH",
          discount: "12 Months Free DashPass for RBC Cardholders",
          verified: true
        }
      ],
      officialUrl: "https://www.doordash.com/en-CA/dashpass"
    }
  },

  {
    id: "uber_one_ca",
    name: "Uber One (Canada)",
    category: "delivery",
    tagline: "$0 Delivery Fee on Uber Eats, 5% Off Eligible Rides & Member-Only Perks",
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
          operator: "CIBC Credit Cards / Aeroplan",
          plan: "CIBC Aeroplan Visa Infinite / Aventura",
          claimSteps: "Link eligible CIBC credit cards for periodic promotions offering up to 6 months of complimentary Uber One membership."
        }
      ],
      voucherSavings: {
        provider: "Costco Canada",
        discountPercent: "20% Off Uber & Uber Eats Vouchers",
        instructions: "Costco Canada sells two $50 Uber e-gift cards ($100 total) for just $79.99, stacking extra savings on rides and food orders.",
        effectivePrice: 7.99
      },
      comboPass: {
        passName: "Uber One Annual Plan",
        passPrice: 99.99,
        individualSum: 119.88,
        netSavings: "19.89/yr",
        bundledWith: ["5% Off All Uber Rides", "$0 Delivery on Uber Eats", "Special Discounts at Metro & Rexall"]
      },
      coupons: [
        {
          code: "UBERONECA1",
          discount: "1-Month Free Trial for New Canadian Accounts",
          verified: true
        }
      ],
      officialUrl: "https://www.uber.com/ca/en/u/uber-one/"
    }
  },

  {
    id: "skipthedishes_ca",
    name: "SkipTheDishes (Canada)",
    category: "delivery",
    tagline: "Canada's Homegrown Delivery App: Skip Rewards, Free Delivery Promotions & Local Canadian Eateries",
    logoText: "SKIP",
    accentColor: "from-orange-500 to-red-600",
    badge: "Canadian Homegrown Network",
    popularShows: ["Tim Hortons", "Boston Pizza", "Harvey's", "A&W Canada", "Mary Brown's Chicken", "Local Poutineries", "Skip Rewards Points Program"],
    plans: [
      {
        name: "Skip Rewards (Free Tier)",
        price: 0.00,
        period: "month",
        screens: 1,
        resolution: "Order Tracking",
        devices: "iOS, Android, Web",
        audio: "Live Driver Tracker",
        ads: "Earn Points on Every Order"
      },
      {
        name: "Skip+ Pass (Promotional)",
        price: 7.99,
        period: "month",
        screens: 1,
        resolution: "Priority Dispatch",
        devices: "All Devices",
        audio: "In-App Alerts",
        ads: "$0 Delivery on Orders over $15"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Virgin Plus Canada",
          plan: "Virgin Plus Member Lounge Weekly Deals",
          claimSteps: "Virgin Plus members frequently receive $5 to $10 off SkipTheDishes voucher vouchers in their perks portal."
        }
      ],
      voucherSavings: {
        provider: "Skip Points Redemptions",
        discountPercent: "Up to $15 Off Meals",
        instructions: "Accumulate Skip Rewards points to redeem $2.50, $5, $10, and $15 instant food vouchers directly at checkout.",
        effectivePrice: 0.00
      },
      comboPass: {
        passName: "Skip Rewards Tier Boost",
        passPrice: 0.00,
        individualSum: 30.00,
        netSavings: "Reward Points on Every Dollar",
        bundledWith: ["Earn 5-10 points per dollar", "Redeem for Tim Hortons & Local Diners"]
      },
      coupons: [
        {
          code: "SKIPCA5OFF",
          discount: "$5 Off First Canadian Order",
          verified: true
        }
      ],
      officialUrl: "https://www.skipthedishes.com"
    }
  },

  // ==========================================
  // 5. PRODUCTIVITY, AI & CLOUD
  // ==========================================
  {
    id: "chatgpt_plus_ca",
    name: "ChatGPT Plus (Canada)",
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
        price: 27.50,
        period: "month",
        screens: 2,
        resolution: "5x Priority GPT-4o compute",
        devices: "All Devices",
        audio: "Real-time Advanced Voice Mode",
        ads: "100% Ad-Free (Billed $20 USD / ~C$27.50)"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Microsoft Copilot (Free Alternate)",
          plan: "Windows 11 / Edge Copilot",
          claimSteps: "Canadian users can access GPT-4 and DALL-E 3 for $0 completely free via Microsoft Copilot on Windows or Edge browser without subscribing to ChatGPT Plus."
        }
      ],
      voucherSavings: {
        provider: "Canadian FX-Free Credit Cards",
        discountPercent: "2.5% FX Fee Savings",
        instructions: "Use a no-foreign-transaction-fee credit card (e.g. Scotiabank Passport Visa Infinite or Wealthsimple Cash) to avoid the 2.5% Canadian foreign exchange markup on the $20 USD charge.",
        effectivePrice: 26.80
      },
      comboPass: {
        passName: "ChatGPT Team Plan",
        passPrice: 34.00,
        individualSum: 55.00,
        netSavings: "Workspace Data Privacy",
        bundledWith: ["Higher message caps", "Zero model training on business data", "Admin console"]
      },
      coupons: [
        {
          code: "OPENAICAFREE",
          discount: "Use Free Tier with GPT-4o Mini",
          verified: true
        }
      ],
      officialUrl: "https://chatgpt.com"
    }
  },

  {
    id: "claude_pro_ca",
    name: "Claude Pro (Canada)",
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
        price: 27.50,
        period: "month",
        screens: 2,
        resolution: "5x Priority Claude 3.5 Sonnet",
        devices: "Web, iOS, Android",
        audio: "Text, Code & Document Vision",
        ads: "100% Ad-Free (Billed $20 USD / ~C$27.50)"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Anthropic Free Tier",
          plan: "claude.ai Free Tier",
          claimSteps: "Claude 3.5 Sonnet is accessible on the free web tier for short coding questions and artifact generation with zero payment."
        }
      ],
      voucherSavings: {
        provider: "Wealthsimple Cash Mastercard",
        discountPercent: "1% Cash Back + 0% FX Markup",
        instructions: "Pay with Wealthsimple Cash to earn 1% cashback on your subscription with zero USD foreign exchange conversion surcharge.",
        effectivePrice: 27.20
      },
      comboPass: {
        passName: "Claude Team Membership",
        passPrice: 41.00,
        individualSum: 60.00,
        netSavings: "Collaborative Projects",
        bundledWith: ["Early access to new models", "Higher message limits", "Team project spaces"]
      },
      coupons: [
        {
          code: "CLAUDECAFREE",
          discount: "Free Web Tier with Claude 3.5 Sonnet",
          verified: true
        }
      ],
      officialUrl: "https://claude.ai"
    }
  },

  {
    id: "microsoft_365_ca",
    name: "Microsoft 365 (Canada)",
    category: "productivity",
    tagline: "Word, Excel, PowerPoint, Outlook, 1TB Secure OneDrive Cloud Storage & Microsoft Defender",
    logoText: "M365",
    accentColor: "from-blue-600 to-slate-900",
    badge: "Canada's Premier Office Suite",
    popularShows: ["Microsoft Word", "Excel Advanced Formulas", "PowerPoint Designer", "1TB OneDrive Cloud Storage", "Outlook Ad-Free", "Microsoft Defender Security"],
    plans: [
      {
        name: "Personal (1 User)",
        price: 7.90,
        period: "month",
        screens: 5,
        resolution: "Full Desktop & Cloud Suite",
        devices: "PC, Mac, iPad, iPhone, Android",
        audio: "Office Copilot ready",
        ads: "100% Ad-Free (or $79.00/year)"
      },
      {
        name: "Family (Up to 6 Users)",
        price: 10.90,
        period: "month",
        screens: 30,
        resolution: "Full Desktop & Cloud Suite",
        devices: "Up to 6 people (5 devices each)",
        audio: "Office Copilot ready",
        ads: "100% Ad-Free (6TB Total / or $109.00/yr)"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Canadian Universities & Colleges",
          plan: "Office 365 Education Free",
          claimSteps: "Canadian students and faculty members (U of T, UBC, McGill, Ryerson, etc.) receive full Microsoft 365 for $0 completely free with their institutional .edu / .ca email."
        }
      ],
      voucherSavings: {
        provider: "Costco Canada",
        discountPercent: "Save $20 on 15-Month Family Subscription",
        instructions: "Costco Canada sells a special 15-month Microsoft 365 Family digital license for $99.99 (giving you 3 bonus months free).",
        effectivePrice: 6.66
      },
      comboPass: {
        passName: "Microsoft 365 Family Plan Split",
        passPrice: 10.90,
        individualSum: 47.40,
        netSavings: "36.50/mo",
        bundledWith: ["6 Independent Accounts", "1TB OneDrive Cloud for Each Member (6TB Total)", "All Word, Excel, PowerPoint desktop apps"]
      },
      coupons: [
        {
          code: "M365STUDENTCA",
          discount: "100% Free for Eligible Canadian Students",
          verified: true
        }
      ],
      officialUrl: "https://www.microsoft.com/en-ca/microsoft-365"
    }
  },

  {
    id: "google_one_ca",
    name: "Google One (Canada)",
    category: "cloud",
    tagline: "Expanded Cloud Storage across Google Drive, Gmail & Google Photos with AI Features",
    logoText: "GOOGLE 1",
    accentColor: "from-blue-500 to-amber-600",
    badge: "Cloud Backup & AI",
    popularShows: ["Expanded Drive Storage", "Original Quality Google Photos Backup", "Magic Eraser & Photo Editing", "Gemini Advanced 1.5 Pro AI", "Automatic Phone Backup"],
    plans: [
      {
        name: "Basic (100GB)",
        price: 2.79,
        period: "month",
        screens: 5,
        resolution: "Full Cloud Backup",
        devices: "All Devices (Android, iOS, Web)",
        audio: "High Bandwidth",
        ads: "100% Ad-Free (or $27.99/year)"
      },
      {
        name: "Standard (200GB)",
        price: 3.99,
        period: "month",
        screens: 5,
        resolution: "Full Cloud Backup",
        devices: "Share with up to 5 family members",
        audio: "High Bandwidth",
        ads: "100% Ad-Free (or $39.99/year)"
      },
      {
        name: "Premium (2TB)",
        price: 13.99,
        period: "month",
        screens: 5,
        resolution: "Full Cloud Backup + Google Workspace Perks",
        devices: "All Devices",
        audio: "High Bandwidth",
        ads: "100% Ad-Free (or $139.99/year)"
      },
      {
        name: "AI Premium (2TB + Gemini Advanced)",
        price: 26.99,
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
          operator: "Google Pixel / Android Canada",
          plan: "Pixel 8 / Pixel 9 Activation",
          claimSteps: "Purchasing a new Google Pixel through Telus, Rogers, or Bell often includes up to 6 months of Google One or 1 year of Gemini Advanced free."
        }
      ],
      voucherSavings: {
        provider: "Google One Annual Billing",
        discountPercent: "Save 16% Instantly",
        instructions: "Switching from monthly to annual billing on the 100GB plan reduces cost from $33.48 to $27.99/year.",
        effectivePrice: 2.33
      },
      comboPass: {
        passName: "Google One Family Sharing",
        passPrice: 3.99,
        individualSum: 13.95,
        netSavings: "9.96/mo",
        bundledWith: ["Share 200GB among 5 family members", "Private individual drive spaces", "Google Photos editing perks"]
      },
      coupons: [
        {
          code: "GOOGLE1ANNUAL",
          discount: "16% Off with Annual Payment",
          verified: true
        }
      ],
      officialUrl: "https://one.google.com/about"
    }
  }
];
