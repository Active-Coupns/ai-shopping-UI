// src/data/subscriptionsCatalogAE.js
// Master United Arab Emirates (UAE / AE 🇦🇪) Subscriptions & Entertainment Passes Catalog
// Verified March 2026 pricing in UAE Dirham (AED), featuring Etisalat by e&, du telecom perks,
// Smiles points, Careem Plus, and 4-Level Savings Blueprints.

export const AE_SUBSCRIPTIONS_CATALOG = [
  {
    id: "osn_plus_ae",
    name: "OSN+ (UAE)",
    category: "video",
    tagline: "The exclusive Middle East home of HBO, Max Originals, Paramount+, and Warner Bros.",
    logoText: "OSN+",
    accentColor: "from-red-600 to-rose-950",
    badge: "Official HBO & Paramount Home",
    popularShows: ["House of the Dragon", "The Last of Us", "Succession", "Yellowstone", "White Lotus", "Dune: Prophecy", "Euphoria"],
    plans: [
      {
        name: "Standard (with Ads)",
        price: 35.00,
        period: "month",
        screens: 2,
        resolution: "Full HD (1080p)",
        devices: "All Devices (TV, Phone, Laptop)",
        audio: "Dolby 5.1",
        ads: "Limited Ads"
      },
      {
        name: "Standard (Ad-Free)",
        price: 49.00,
        period: "month",
        screens: 2,
        resolution: "Full HD (1080p)",
        devices: "All Devices (TV, Phone, Laptop)",
        audio: "Dolby 5.1",
        ads: "100% Ad-Free"
      },
      {
        name: "Premium 4K",
        price: 69.00,
        period: "month",
        screens: 4,
        resolution: "4K Ultra HD + Dolby Atmos",
        devices: "All Devices (TV, Phone, Laptop)",
        audio: "Dolby Atmos",
        ads: "100% Ad-Free"
      },
      {
        name: "Annual Standard Pass",
        price: 479.00,
        period: "year",
        screens: 2,
        resolution: "Full HD (1080p)",
        devices: "All Devices (TV, Phone, Laptop)",
        audio: "Dolby 5.1",
        ads: "100% Ad-Free"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Etisalat by e&",
          plan: "e& Freedom Plan / e& Home Fibre",
          claimSteps: "Selected Etisalat Freedom mobile post-paid and e& Home Fibre internet plans include OSN+ on us for 12 months. Activate via My Etisalat UAE app under 'Value Added Add-ons'."
        },
        {
          operator: "du",
          plan: "du Home Wireless & Postpaid Power",
          claimSteps: "du Home Wireless Plus and Power Postpaid 300+ plans offer complimentary OSN+ streaming access. Link your du mobile account on the OSN+ activation page."
        }
      ],
      voucherSavings: {
        provider: "Smiles by e& / YouGotaGift",
        discountPercent: "15% Smiles Point Value",
        instructions: "Redeem accumulated Smiles points inside the Smiles app for OSN+ digital subscription gift codes or digital vouchers at YouGotaGift UAE.",
        effectivePrice: 29.75
      },
      comboPass: {
        passName: "e& Entertainment Multi-Pass",
        passPrice: 79.00,
        individualSum: 110.00,
        netSavings: "31.00/mo",
        bundledWith: ["OSN+", "Starzplay", "Shahid VIP"]
      },
      coupons: [
        { code: "OSNUAE20", discount: "20% off 3-month plans", verified: true },
        { code: "EANDSPECIAL", discount: "AED 10 monthly discount via Etisalat direct bill", verified: true }
      ],
      officialUrl: "https://www.osnplus.com"
    }
  },
  {
    id: "shahid_vip_ae",
    name: "Shahid VIP (UAE)",
    category: "video",
    tagline: "The world's leading Arabic streaming platform by MBC Group: Ramadan originals, Arabic cinema, and live TV.",
    logoText: "SHAHID",
    accentColor: "from-emerald-500 to-teal-900",
    badge: "#1 Arabic Streaming Platform",
    popularShows: ["The Board", "Al Thaman", "Rashash", "Salon Zahra", "Ramadan 2026 Exclusives", "MBC Live Channels"],
    plans: [
      {
        name: "Shahid VIP (with Ads)",
        price: 24.99,
        period: "month",
        screens: 2,
        resolution: "Full HD (1080p)",
        devices: "All Devices (TV, Phone, Tablet)",
        audio: "Stereo",
        ads: "Limited Ads"
      },
      {
        name: "Shahid VIP (Ad-Free)",
        price: 39.99,
        period: "month",
        screens: 3,
        resolution: "Full HD (1080p)",
        devices: "All Devices (TV, Phone, Tablet)",
        audio: "Dolby 5.1",
        ads: "100% Ad-Free"
      },
      {
        name: "Shahid VIP + Sports",
        price: 69.99,
        period: "month",
        screens: 3,
        resolution: "Full HD + Live Sports",
        devices: "All Devices (TV, Phone, Tablet)",
        audio: "Dolby 5.1",
        ads: "Ad-Free Shows + Live Sports"
      },
      {
        name: "Shahid VIP Annual Pass",
        price: 349.99,
        period: "year",
        screens: 3,
        resolution: "Full HD (1080p)",
        devices: "All Devices (TV, Phone, Tablet)",
        audio: "Dolby 5.1",
        ads: "100% Ad-Free"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Etisalat by e&",
          plan: "e& Smiles & Postpaid Add-on",
          claimSteps: "Subscribe to Shahid VIP using Etisalat Direct Carrier Billing to receive up to 50% discount on your first 3 months via My Etisalat UAE app."
        },
        {
          operator: "du",
          plan: "du Home Ultimate",
          claimSteps: "du Home Ultimate Fibre packages include Shahid VIP at AED 0 for the contract duration. Claim in du App under 'Entertain Me'."
        }
      ],
      voucherSavings: {
        provider: "Smiles by e& / Virgin Megastore UAE",
        discountPercent: "20% Promo Value",
        instructions: "Smiles app frequently offers 20% discount vouchers on Shahid VIP 3-month and 12-month codes. Also available at Virgin Megastore outlets across Dubai and Abu Dhabi.",
        effectivePrice: 19.99
      },
      comboPass: {
        passName: "Shahid VIP + Sports Combo",
        passPrice: 69.99,
        individualSum: 94.98,
        netSavings: "24.99/mo",
        bundledWith: ["Shahid VIP Entertainment", "Roshn Saudi League", "Fighting Sports"]
      },
      coupons: [
        { code: "RAMADAN26", discount: "Up to 40% off annual subscription", verified: true },
        { code: "SHAHIDUAE", discount: "1 month trial at AED 1", verified: true }
      ],
      officialUrl: "https://shahid.mbc.net"
    }
  },
  {
    id: "tod_tv_ae",
    name: "TOD (beIN Media Group UAE)",
    category: "video",
    tagline: "The definitive home of live sports in the MENA region: Premier League, UEFA Champions League, and beIN Entertainment.",
    logoText: "TOD",
    accentColor: "from-purple-600 to-indigo-950",
    badge: "Official beIN Sports Pass",
    popularShows: ["English Premier League", "UEFA Champions League", "LaLiga", "Formula 1", "NBA", "TOD Originals", "beIN Channels"],
    plans: [
      {
        name: "TOD Entertainment",
        price: 36.99,
        period: "month",
        screens: 2,
        resolution: "Full HD (1080p)",
        devices: "TV, Web, Mobile",
        audio: "Dolby 5.1",
        ads: "100% Ad-Free"
      },
      {
        name: "TOD Total (Sports + Entertainment)",
        price: 84.99,
        period: "month",
        screens: 2,
        resolution: "4K Ultra HD Live Streams",
        devices: "TV, Web, Mobile (2 streams concurrently)",
        audio: "Dolby 5.1",
        ads: "Ad-Free Movies + Live beIN Sports"
      },
      {
        name: "TOD Total Annual Pass",
        price: 799.00,
        period: "year",
        screens: 2,
        resolution: "4K Ultra HD Live Streams",
        devices: "TV, Web, Mobile",
        audio: "Dolby 5.1",
        ads: "Ad-Free Movies + Live beIN Sports"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Etisalat by e&",
          plan: "e& beIN Sports Fibre Add-on",
          claimSteps: "Etisalat eLife TV subscribers with beIN Sports add-ons receive complimentary TOD Total digital streaming credentials via eLife Connect."
        },
        {
          operator: "du",
          plan: "du beIN Sports Package",
          claimSteps: "du Home TV customers with beIN Sports tiers get complimentary digital TOD credentials to stream matches on mobile and tablets."
        }
      ],
      voucherSavings: {
        provider: "YouGotaGift UAE / Sharaf DG",
        discountPercent: "10% Cashback",
        instructions: "Buy TOD digital gift cards through YouGotaGift using ENBD or ADCB credit cards for up to 10% instant statement cashback.",
        effectivePrice: 76.49
      },
      comboPass: {
        passName: "TOD Total Annual Pass",
        passPrice: 66.58,
        individualSum: 84.99,
        netSavings: "18.41/mo (AED 220/yr savings)",
        bundledWith: ["Premier League", "Champions League", "beIN Entertainment"]
      },
      coupons: [
        { code: "TODKICKOFF", discount: "15% off first 3 months", verified: true },
        { code: "TODANNUAL", discount: "AED 220 discount on annual total", verified: true }
      ],
      officialUrl: "https://www.tod.tv"
    }
  },
  {
    id: "starzplay_ae",
    name: "Starzplay Arabia (UAE)",
    category: "video",
    tagline: "Hollywood blockbusters, Serie A football, UFC Arabia, and CricLife live cricket in the UAE.",
    logoText: "STARZ",
    accentColor: "from-amber-600 to-orange-950",
    badge: "Serie A & UFC Sports Hub",
    popularShows: ["Serie A Live Matches", "UFC Fight Nights", "Billions", "Power Book", "CricLife Live Cricket", "Starzplay Originals"],
    plans: [
      {
        name: "Starzplay Entertainment",
        price: 39.99,
        period: "month",
        screens: 2,
        resolution: "Full HD (1080p)",
        devices: "All Devices (TV, Phone, Laptop)",
        audio: "Dolby 5.1",
        ads: "100% Ad-Free"
      },
      {
        name: "Starzplay Sports (Serie A + UFC + Cricket)",
        price: 59.99,
        period: "month",
        screens: 2,
        resolution: "Full HD Live Sports",
        devices: "All Devices (TV, Phone, Laptop)",
        audio: "Dolby 5.1",
        ads: "Ad-Free Entertainment + Live Sports"
      },
      {
        name: "Starzplay Ultimate Annual",
        price: 399.99,
        period: "year",
        screens: 2,
        resolution: "Full HD + 4K Select Titles",
        devices: "All Devices (TV, Phone, Laptop)",
        audio: "Dolby 5.1",
        ads: "100% Ad-Free"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Etisalat by e&",
          plan: "e& Freedom & eLife Fiber",
          claimSteps: "Etisalat is a direct shareholder in Starzplay. Most eLife home internet and postpaid Freedom plans offer Starzplay at AED 0 for up to 24 months. Check My Etisalat app."
        },
        {
          operator: "du",
          plan: "du Postpaid Add-on",
          claimSteps: "du mobile customers can add Starzplay for a discounted AED 30/mo billed directly to their monthly mobile invoice."
        }
      ],
      voucherSavings: {
        provider: "Smiles by e& / Carrefour UAE",
        discountPercent: "25% Smiles Points Discount",
        instructions: "Smiles by e& lets you purchase 1-month and 3-month Starzplay vouchers at up to 25% discount using earned Smiles points.",
        effectivePrice: 29.99
      },
      comboPass: {
        passName: "Starzplay Annual Pass",
        passPrice: 33.33,
        individualSum: 39.99,
        netSavings: "6.66/mo (AED 80/yr savings)",
        bundledWith: ["Starzplay Entertainment", "Select Cricket Highlights"]
      },
      coupons: [
        { code: "STARZAE20", discount: "20% off 6-month pass", verified: true },
        { code: "ELIFEFREE", discount: "Free via Etisalat eLife bundle", verified: true }
      ],
      officialUrl: "https://www.starzplay.com"
    }
  },
  {
    id: "netflix_ae",
    name: "Netflix (UAE)",
    category: "video",
    tagline: "Global movies, binge-worthy series, Korean dramas, and Arabic hits.",
    logoText: "NETFLIX",
    accentColor: "from-red-600 to-black",
    badge: "World's #1 Streamer",
    popularShows: ["Stranger Things", "Squid Game", "Wednesday", "Dubai Bling", "Bridgerton", "AlRawabi School for Girls", "Money Heist"],
    plans: [
      {
        name: "Basic",
        price: 35.00,
        period: "month",
        screens: 1,
        resolution: "HD (720p)",
        devices: "Phone, Tablet, Laptop, TV",
        audio: "Stereo",
        ads: "100% Ad-Free"
      },
      {
        name: "Standard",
        price: 45.00,
        period: "month",
        screens: 2,
        resolution: "Full HD (1080p)",
        devices: "All Devices",
        audio: "Dolby 5.1",
        ads: "100% Ad-Free"
      },
      {
        name: "Premium",
        price: 65.00,
        period: "month",
        screens: 4,
        resolution: "4K Ultra HD + HDR",
        devices: "All Devices (Spatial Audio)",
        audio: "Dolby Atmos",
        ads: "100% Ad-Free"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Etisalat by e&",
          plan: "e& eLife Ultra & Freedom Bundles",
          claimSteps: "e& eLife Ultra Fusion and Entertainment packs include Netflix Standard or Premium at AED 0. Manage the integration directly via My Etisalat App."
        },
        {
          operator: "du",
          plan: "du Home Ultimate",
          claimSteps: "du Home Ultimate broadband packages offer complimentary Netflix access or bill credit integration."
        }
      ],
      voucherSavings: {
        provider: "Carrefour UAE / LuLu Hypermarket",
        discountPercent: "5%-10% Bank Cashback",
        instructions: "Buy Netflix UAE gift cards from Carrefour or LuLu Hypermarket using cashback credit cards (e.g. ENBD Duo or ADCB 365) to earn 5% real cashback.",
        effectivePrice: 40.50
      },
      comboPass: {
        passName: "eLife Ultra Fusion Bundle",
        passPrice: 420.00,
        individualSum: 510.00,
        netSavings: "90.00/mo",
        bundledWith: ["Netflix Premium", "eLife 500Mbps Fiber", "OSN+"]
      },
      coupons: [
        { code: "NETFLIXUAE", discount: "Gift card redemption only", verified: true }
      ],
      officialUrl: "https://www.netflix.com/ae"
    }
  },
  {
    id: "disney_ae",
    name: "Disney+ (UAE)",
    category: "video",
    tagline: "The exclusive streaming home of Disney, Pixar, Marvel, Star Wars, National Geographic, and Star.",
    logoText: "DISNEY+",
    accentColor: "from-blue-700 to-indigo-950",
    badge: "Marvel, Star Wars & Pixar",
    popularShows: ["The Mandalorian", "Loki", "Shogun", "The Bear", "Moana", "Percy Jackson", "Grey's Anatomy"],
    plans: [
      {
        name: "Standard Monthly",
        price: 39.99,
        period: "month",
        screens: 2,
        resolution: "Full HD (1080p)",
        devices: "All Devices",
        audio: "Dolby 5.1",
        ads: "100% Ad-Free"
      },
      {
        name: "Standard Annual",
        price: 399.90,
        period: "year",
        screens: 2,
        resolution: "Full HD (1080p)",
        devices: "All Devices",
        audio: "Dolby 5.1",
        ads: "100% Ad-Free (Get 12 months for the price of 10)"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "du",
          plan: "du Postpaid Power 300+ / du Home Wireless",
          claimSteps: "du Power Postpaid plans and Home Wireless Plus customers can choose Disney+ as their complimentary digital benefit for 12 months in the du App."
        },
        {
          operator: "Etisalat by e&",
          plan: "e& Freedom Plan Benefit",
          claimSteps: "Selected Etisalat Freedom post-paid mobile contracts offer 12 months of Disney+ at AED 0 via e& Smiles vouchers."
        }
      ],
      voucherSavings: {
        provider: "Virgin Megastore UAE / YouGotaGift",
        discountPercent: "Up to 10% Cashback",
        instructions: "Purchase Disney+ MENA digital codes via YouGotaGift using Liv. or ENBD cards for 10% statement credits.",
        effectivePrice: 35.99
      },
      comboPass: {
        passName: "Disney+ Annual Saver",
        passPrice: 33.32,
        individualSum: 39.99,
        netSavings: "6.67/mo (AED 80/yr savings)",
        bundledWith: ["Disney", "Marvel", "Star Wars", "National Geographic", "Star"]
      },
      coupons: [
        { code: "DISNEYAE10", discount: "AED 80 off annual billing", verified: true }
      ],
      officialUrl: "https://www.apps.disneyplus.com"
    }
  },
  {
    id: "prime_ae",
    name: "Amazon Prime (UAE)",
    category: "combo",
    tagline: "Free fast delivery, Prime Video, Deliveroo Plus free delivery, and Prime Gaming.",
    logoText: "PRIME",
    accentColor: "from-cyan-500 to-blue-900",
    badge: "Best Value Pass in UAE",
    popularShows: ["The Rings of Power", "The Boys", "Reacher", "Citadel", "Fallout", "Invincible", "LOL: Hawa Baghdad"],
    plans: [
      {
        name: "Prime Monthly",
        price: 16.00,
        period: "month",
        screens: 3,
        resolution: "4K Ultra HD",
        devices: "All Devices",
        audio: "Dolby Atmos",
        ads: "100% Ad-Free Video"
      },
      {
        name: "Prime Annual",
        price: 140.00,
        period: "year",
        screens: 3,
        resolution: "4K Ultra HD",
        devices: "All Devices",
        audio: "Dolby Atmos",
        ads: "100% Ad-Free (AED 11.66/month equivalent)"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "du",
          plan: "du Postpaid & Home Wireless",
          claimSteps: "du Postpaid mobile plans starting from AED 150/mo include free Amazon Prime membership for 12 months. Activate via du App under 'Manage Subscriptions'."
        },
        {
          operator: "Etisalat by e&",
          plan: "e& Freedom Plan Add-on",
          claimSteps: "Etisalat Freedom postpaid mobile lines offer complimentary Amazon Prime on selected data tiers."
        }
      ],
      voucherSavings: {
        provider: "Amazon Mastercard / FAB Credit Cards",
        discountPercent: "Free Deliveroo Plus Included",
        instructions: "Amazon Prime UAE members get Deliveroo Plus Silver (worth AED 19/month) completely FREE, giving free food delivery on orders over AED 30 across the UAE.",
        effectivePrice: 11.66
      },
      comboPass: {
        passName: "Prime + Deliveroo Plus Free Bundle",
        passPrice: 11.66,
        individualSum: 35.00,
        netSavings: "23.34/mo",
        bundledWith: ["Prime Video 4K", "Free Next-Day Delivery", "Deliveroo Plus Free Delivery", "Prime Gaming"]
      },
      coupons: [
        { code: "PRIME30DAY", discount: "30-day full free trial for all new accounts", verified: true }
      ],
      officialUrl: "https://www.amazon.ae/prime"
    }
  },
  {
    id: "apple_tv_ae",
    name: "Apple TV+ (UAE)",
    category: "video",
    tagline: "Apple Original dramas, sci-fi epics, and award-winning Hollywood cinema.",
    logoText: "APPLE TV+",
    accentColor: "from-zinc-800 to-black",
    badge: "Highest Bitrate 4K Streamer",
    popularShows: ["Ted Lasso", "Severance", "The Morning Show", "Slow Horses", "Foundation", "For All Mankind", "Hijack"],
    plans: [
      {
        name: "Apple TV+ Monthly",
        price: 29.99,
        period: "month",
        screens: 6,
        resolution: "4K Ultra HD + Dolby Vision",
        devices: "Apple Devices, Smart TVs, Consoles, Fire TV",
        audio: "Spatial Audio & Dolby Atmos",
        ads: "100% Ad-Free"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Apple Device Purchase",
          plan: "3 Months Complimentary",
          claimSteps: "Buy any eligible new iPhone, iPad, Apple TV, or Mac in the UAE to claim 3 months of Apple TV+ for AED 0 via the TV app within 90 days."
        }
      ],
      voucherSavings: {
        provider: "Apple One UAE",
        discountPercent: "Save AED 35/month in Apple One",
        instructions: "Instead of paying AED 29.99 for Apple TV+ standalone, subscribe to Apple One Individual (AED 49.95/mo) which bundles Apple Music, TV+, Arcade, and 50GB iCloud.",
        effectivePrice: 12.50
      },
      comboPass: {
        passName: "Apple One Individual Pass",
        passPrice: 49.95,
        individualSum: 84.96,
        netSavings: "35.01/mo",
        bundledWith: ["Apple TV+", "Apple Music", "Apple Arcade", "50GB iCloud+"]
      },
      coupons: [
        { code: "APPLE7DAY", discount: "7-day standard free trial for all accounts", verified: true }
      ],
      officialUrl: "https://tv.apple.com/ae"
    }
  },
  {
    id: "apple_one_ae",
    name: "Apple One (UAE)",
    category: "combo",
    tagline: "Apple Music, Apple TV+, Apple Arcade, and iCloud+ bundled into one simple monthly payment in the UAE.",
    logoText: "APPLE ONE",
    accentColor: "from-neutral-700 to-neutral-950",
    badge: "Ultimate Apple Ecosystem Bundle",
    popularShows: ["Apple TV+ Originals", "Apple Music Lossless", "Apple Arcade Games", "iCloud+ Storage"],
    plans: [
      {
        name: "Individual",
        price: 49.95,
        period: "month",
        screens: 1,
        resolution: "4K UHD (TV+)",
        devices: "All Apple & Supported Devices",
        audio: "Dolby Atmos & Spatial Audio",
        ads: "100% Ad-Free (50GB iCloud+)"
      },
      {
        name: "Family",
        price: 64.95,
        period: "month",
        screens: 6,
        resolution: "4K UHD (TV+)",
        devices: "Up to 6 family members with private accounts",
        audio: "Dolby Atmos & Spatial Audio",
        ads: "100% Ad-Free (200GB iCloud+)"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Family Sharing UAE",
          plan: "6-Member Family Split",
          claimSteps: "Subscribe to Apple One Family at AED 64.95/mo and share across 6 family members using Apple Family Sharing. Effective cost drops to just AED 10.82/person per month!"
        }
      ],
      voucherSavings: {
        provider: "Virgin Megastore UAE / Carrefour",
        discountPercent: "5% Gift Card Rebate",
        instructions: "Load your Apple ID balance using Apple Gift Cards purchased with cashback credit cards at Carrefour UAE to capture an effective 5% monthly discount.",
        effectivePrice: 47.45
      },
      comboPass: {
        passName: "Apple One Family Pass",
        passPrice: 64.95,
        individualSum: 114.94,
        netSavings: "49.99/mo (Save AED 600/year)",
        bundledWith: ["Apple TV+", "Apple Music Family", "Apple Arcade", "200GB iCloud+ Storage"]
      },
      coupons: [
        { code: "APPLE1MONTH", discount: "1 month free trial on unused services", verified: true }
      ],
      officialUrl: "https://www.apple.com/ae/apple-one"
    }
  },
  {
    id: "youtube_premium_ae",
    name: "YouTube Premium (UAE)",
    category: "video",
    tagline: "Ad-free YouTube, background audio playback, offline downloads, and YouTube Music Premium.",
    logoText: "YOUTUBE",
    accentColor: "from-red-600 to-rose-950",
    badge: "Ad-Free Video + YouTube Music",
    popularShows: ["YouTube Ad-Free", "YouTube Music Premium", "Background Play", "Offline 1080p Downloads"],
    plans: [
      {
        name: "Individual Monthly",
        price: 27.99,
        period: "month",
        screens: 1,
        resolution: "Full HD 1080p Premium Bitrate",
        devices: "All Devices",
        audio: "High Quality (256kbps AAC)",
        ads: "100% Ad-Free"
      },
      {
        name: "Family (6 Accounts)",
        price: 41.99,
        period: "month",
        screens: 6,
        resolution: "Full HD 1080p Premium Bitrate",
        devices: "Up to 5 additional household members (13+)",
        audio: "High Quality",
        ads: "100% Ad-Free"
      },
      {
        name: "Student Plan",
        price: 15.99,
        period: "month",
        screens: 1,
        resolution: "Full HD 1080p Premium Bitrate",
        devices: "All Devices (SheerID verification)",
        audio: "High Quality",
        ads: "100% Ad-Free"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Family Sharing Plan",
          plan: "6-Member Family Split",
          claimSteps: "Subscribe to the YouTube Family Plan at AED 41.99/mo. Split between 6 family members for an effective price of just AED 7.00/person per month!"
        }
      ],
      voucherSavings: {
        provider: "Google Play UAE Cards",
        discountPercent: "5%-8% Bank Cashback",
        instructions: "Pay using Google Play UAE digital balance loaded via cashback credit cards (e.g., Mashreq Cashback or ADCB Simplylife).",
        effectivePrice: 25.99
      },
      comboPass: {
        passName: "YouTube Family 6-User Pass",
        passPrice: 41.99,
        individualSum: 167.94,
        netSavings: "125.95/mo (Save AED 1,511/yr)",
        bundledWith: ["YouTube Ad-Free for 6 accounts", "YouTube Music Premium for 6 accounts"]
      },
      coupons: [
        { code: "YTUAESTUDENT", discount: "AED 15.99/mo for verified UAE university students", verified: true }
      ],
      officialUrl: "https://www.youtube.com/premium"
    }
  },
  {
    id: "spotify_ae",
    name: "Spotify (UAE)",
    category: "music",
    tagline: "Over 100 million songs, podcasts, and curated Khaleeji, Arabic, and International playlists.",
    logoText: "SPOTIFY",
    accentColor: "from-emerald-500 to-green-950",
    badge: "World's #1 Music Platform",
    popularShows: ["Top Arabic Pop", "Khaleeji Hits", "Global Top 50", "The Joe Rogan Experience", "Afnanetoo Podcast"],
    plans: [
      {
        name: "Individual",
        price: 23.99,
        period: "month",
        screens: 1,
        resolution: "320kbps Extreme Quality",
        devices: "All Devices",
        audio: "High Bitrate 320kbps",
        ads: "100% Ad-Free"
      },
      {
        name: "Duo (2 Accounts)",
        price: 31.99,
        period: "month",
        screens: 2,
        resolution: "320kbps Extreme Quality",
        devices: "2 accounts for couples under one roof",
        audio: "High Bitrate 320kbps",
        ads: "100% Ad-Free"
      },
      {
        name: "Family (6 Accounts)",
        price: 38.99,
        period: "month",
        screens: 6,
        resolution: "320kbps Extreme Quality",
        devices: "Up to 6 family accounts + Spotify Kids",
        audio: "High Bitrate 320kbps",
        ads: "100% Ad-Free"
      },
      {
        name: "Student",
        price: 11.99,
        period: "month",
        screens: 1,
        resolution: "320kbps Extreme Quality",
        devices: "All Devices (SheerID student verified)",
        audio: "High Bitrate 320kbps",
        ads: "100% Ad-Free"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Etisalat by e&",
          plan: "e& Mobile Direct Carrier Billing",
          claimSteps: "Pay via Etisalat direct carrier billing to receive occasional promo credits and trial periods via My Etisalat App."
        }
      ],
      voucherSavings: {
        provider: "Virgin Megastore / Carrefour UAE",
        discountPercent: "Family Split Hack",
        instructions: "Subscribe to Spotify Family at AED 38.99/mo for 6 members. The effective cost is just AED 6.50/person per month!",
        effectivePrice: 6.50
      },
      comboPass: {
        passName: "Spotify Family 6-Account Pass",
        passPrice: 38.99,
        individualSum: 143.94,
        netSavings: "104.95/mo (Save AED 1,259/yr)",
        bundledWith: ["6 Individual Premium Accounts", "Spotify Kids app access", "Duo Mix & Family Mix"]
      },
      coupons: [
        { code: "SPOTSTUDENT", discount: "50% off for UAE accredited students (AED 11.99/mo)", verified: true }
      ],
      officialUrl: "https://www.spotify.com/ae-en"
    }
  },
  {
    id: "anghami_ae",
    name: "Anghami Plus (UAE)",
    category: "music",
    tagline: "The premier Arabic music streaming platform: millions of Arabic and international tracks with offline downloads and live radio.",
    logoText: "ANGHAMI",
    accentColor: "from-purple-600 to-fuchsia-950",
    badge: "#1 Arabic Music Platform",
    popularShows: ["Amr Diab Exclusives", "Khaleeji Hits", "Levant Pop", "Arabic Live Radio", "Anghami Podcasts"],
    plans: [
      {
        name: "Anghami Plus Monthly",
        price: 19.99,
        period: "month",
        screens: 1,
        resolution: "Lossless / High Quality Audio",
        devices: "All Devices",
        audio: "Dolby Atmos / Lossless",
        ads: "100% Ad-Free"
      },
      {
        name: "Anghami Plus Family (6 Members)",
        price: 29.99,
        period: "month",
        screens: 6,
        resolution: "High Quality Audio",
        devices: "Up to 6 accounts",
        audio: "Dolby Atmos",
        ads: "100% Ad-Free"
      },
      {
        name: "Anghami Plus Annual",
        price: 199.99,
        period: "year",
        screens: 1,
        resolution: "Lossless / High Quality Audio",
        devices: "All Devices",
        audio: "Dolby Atmos / Lossless",
        ads: "100% Ad-Free (AED 16.66/month equivalent)"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "du",
          plan: "du Postpaid Add-on",
          claimSteps: "du prepaid and postpaid users can subscribe to Anghami Plus for AED 18/month or claim free 3-month trials on selected mobile data plans."
        },
        {
          operator: "Etisalat by e&",
          plan: "e& Freedom Benefit",
          claimSteps: "Etisalat allows direct carrier billing for Anghami Plus with promotional monthly discounts in My Etisalat App."
        }
      ],
      voucherSavings: {
        provider: "Smiles by e&",
        discountPercent: "20% Smiles Points Discount",
        instructions: "Redeem Smiles points inside the Smiles UAE app to get discounted Anghami Plus vouchers for 3 or 6 months.",
        effectivePrice: 15.99
      },
      comboPass: {
        passName: "Anghami Plus Family Pass",
        passPrice: 29.99,
        individualSum: 119.94,
        netSavings: "89.95/mo (Save AED 1,079/yr)",
        bundledWith: ["6 Independent Accounts", "Offline Downloads", "Lyrics Sync"]
      },
      coupons: [
        { code: "ANGHAMI20", discount: "20% off annual subscription", verified: true }
      ],
      officialUrl: "https://www.anghami.com"
    }
  },
  {
    id: "talabat_pro_ae",
    name: "Talabat Pro (UAE)",
    category: "delivery",
    tagline: "Free unlimited delivery on food and grocery orders across the UAE with exclusive restaurant discounts.",
    logoText: "TALABAT",
    accentColor: "from-orange-500 to-amber-950",
    badge: "Top Food Delivery Pass in UAE",
    popularShows: ["Free Delivery on 15,000+ Restaurants", "Talabat Mart Free Grocery", "Dine-in Buy 1 Get 1 Deals", "Double Reward Points"],
    plans: [
      {
        name: "Talabat Pro Monthly",
        price: 19.00,
        period: "month",
        screens: 1,
        resolution: "N/A",
        devices: "iOS & Android",
        audio: "N/A",
        ads: "Ad-Free Perks"
      },
      {
        name: "Talabat Pro 6-Month Pass",
        price: 99.00,
        period: "half-year",
        screens: 1,
        resolution: "N/A",
        devices: "iOS & Android",
        audio: "N/A",
        ads: "Ad-Free Perks (AED 16.50/month)"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Mastercard UAE",
          plan: "Free Talabat Pro with World Mastercard",
          claimSteps: "Holders of eligible UAE Mastercard World or World Elite credit cards receive 3 to 12 months of Talabat Pro at AED 0. Enter card in Talabat wallet."
        }
      ],
      voucherSavings: {
        provider: "ADCB / ENBD Credit Cards",
        discountPercent: "20% Food Checkout Discount",
        instructions: "Talabat Pro members frequently receive extra 20% off promo codes when paying with partnered bank cards (ADCB, Emirates NBD, FAB).",
        effectivePrice: 15.20
      },
      comboPass: {
        passName: "Talabat Pro 6-Month Pass",
        passPrice: 16.50,
        individualSum: 19.00,
        netSavings: "2.50/mo",
        bundledWith: ["Free Delivery on Orders AED 50+", "Talabat Mart Perks", "Dine-Out 25% Off"]
      },
      coupons: [
        { code: "TALABATFREE", discount: "1 month free trial on initial signup", verified: true }
      ],
      officialUrl: "https://www.talabat.com/uae"
    }
  },
  {
    id: "careem_plus_ae",
    name: "Careem Plus (UAE)",
    category: "delivery",
    tagline: "The UAE's Everything Super-App Pass: 10% instant cashback on rides, free food delivery, grocery savings, and home cleaning discounts.",
    logoText: "CAREEM",
    accentColor: "from-emerald-500 to-green-950",
    badge: "Dubai & UAE Super-App Pass",
    popularShows: ["10% Cashback on Hala Taxi & Rides", "Free Food Delivery on AED 30+", "Free Quik Grocery Delivery", "20% Off Home Cleaning"],
    plans: [
      {
        name: "Careem Plus Monthly",
        price: 19.00,
        period: "month",
        screens: 1,
        resolution: "N/A",
        devices: "iOS & Android",
        audio: "N/A",
        ads: "N/A"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Etisalat by e&",
          plan: "e& Smiles Partnership",
          claimSteps: "Look out for Smiles e& voucher codes providing 3-month free trial vouchers for Careem Plus subscribers."
        }
      ],
      voucherSavings: {
        provider: "Mashreq & FAB Credit Cards",
        discountPercent: "Average user saves AED 200/mo",
        instructions: "Careem Plus pays for itself with just 2 Hala taxi rides per month (10% cashback back to your Careem Pay wallet) plus free food deliveries.",
        effectivePrice: 0.00
      },
      comboPass: {
        passName: "Careem Super-App Pass",
        passPrice: 19.00,
        individualSum: 220.00,
        netSavings: "201.00/mo",
        bundledWith: ["Hala Taxi Cashback", "Free Food Delivery", "Free Quik Grocery", "Discounted Cleaning & Laundry"]
      },
      coupons: [
        { code: "PLUS30DAY", discount: "30-day free trial for new Careem Plus members", verified: true }
      ],
      officialUrl: "https://www.careem.com/en-AE/plus"
    }
  },
  {
    id: "noon_one_ae",
    name: "Noon One (UAE)",
    category: "delivery",
    tagline: "Unlimited free next-day delivery on Noon eCommerce, free 15-minute Noon Minutes, and free Noon Food delivery.",
    logoText: "NOON 1",
    accentColor: "from-yellow-400 to-amber-700",
    badge: "Top eCommerce & Food Pass",
    popularShows: ["Free Delivery on Noon Express", "Free Delivery on Noon Food (AED 30+)", "Free 15-min Noon Minutes Grocery", "VIP Customer Support"],
    plans: [
      {
        name: "Noon One Monthly",
        price: 15.00,
        period: "month",
        screens: 1,
        resolution: "N/A",
        devices: "Noon App & Web",
        audio: "N/A",
        ads: "N/A"
      },
      {
        name: "Noon One Annual",
        price: 120.00,
        period: "year",
        screens: 1,
        resolution: "N/A",
        devices: "Noon App & Web",
        audio: "N/A",
        ads: "N/A (AED 10.00/month equivalent)"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Mashreq Noon VIP Card",
          plan: "Complimentary Noon One + 3.5% Cashback",
          claimSteps: "Holding the Mashreq Noon VIP Credit Card gives you free Noon One membership and 3.5% unlimited cashback on all Noon orders."
        }
      ],
      voucherSavings: {
        provider: "Mashreq & ENBD Cards",
        discountPercent: "5% Additional Statement Cashback",
        instructions: "Pay with Mashreq or Emirates NBD cards during Noon Super Sale events to unlock extra 10-15% checkout discounts.",
        effectivePrice: 10.00
      },
      comboPass: {
        passName: "Noon One Annual Pass",
        passPrice: 10.00,
        individualSum: 15.00,
        netSavings: "5.00/mo (AED 60/yr savings)",
        bundledWith: ["Noon Express Shopping", "Noon Minutes Instant Grocery", "Noon Food Delivery"]
      },
      coupons: [
        { code: "NOONONE15", discount: "14-day free trial on initial activation", verified: true }
      ],
      officialUrl: "https://www.noon.com/uae-en/noon-one"
    }
  },
  {
    id: "deliveroo_plus_ae",
    name: "Deliveroo Plus (UAE)",
    category: "delivery",
    tagline: "Free delivery on your favorite UAE restaurants and grocery stores with Deliveroo Plus Gold and Silver.",
    logoText: "ROO+",
    accentColor: "from-teal-400 to-cyan-950",
    badge: "Free with Amazon Prime UAE",
    popularShows: ["Free Delivery on Orders AED 30+", "Exclusive Deliveroo Discounts", "Grocery from Waitrose & Choithrams", "Priority Delivery"],
    plans: [
      {
        name: "Silver (AED 30+ Orders)",
        price: 19.00,
        period: "month",
        screens: 1,
        resolution: "N/A",
        devices: "iOS, Android, Web",
        audio: "N/A",
        ads: "N/A"
      },
      {
        name: "Gold (AED 50+ Orders)",
        price: 29.00,
        period: "month",
        screens: 1,
        resolution: "N/A",
        devices: "iOS, Android, Web",
        audio: "N/A",
        ads: "N/A"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Amazon Prime UAE Perk",
          plan: "AED 0 with Amazon Prime Membership",
          claimSteps: "Link your Amazon.ae Prime account directly inside Deliveroo to claim Deliveroo Plus Silver for 100% FREE (saving AED 19/month or AED 228/year)!"
        }
      ],
      voucherSavings: {
        provider: "Mastercard UAE",
        discountPercent: "20% Monthly Promo Discount",
        instructions: "Mastercard cardholders in the UAE frequently receive 20% discount codes (e.g. MC20) on Deliveroo food orders.",
        effectivePrice: 0.00
      },
      comboPass: {
        passName: "Amazon Prime Free Deliveroo Perk",
        passPrice: 0.00,
        individualSum: 19.00,
        netSavings: "19.00/mo (AED 228/year)",
        bundledWith: ["Deliveroo Plus Silver", "Prime Video", "Free Amazon Next-Day Shipping"]
      },
      coupons: [
        { code: "PRIMEPLUS", discount: "Free Deliveroo Plus Silver with Amazon Prime", verified: true }
      ],
      officialUrl: "https://deliveroo.ae/plus"
    }
  },
  {
    id: "xbox_game_pass_ae",
    name: "Xbox Game Pass Ultimate (UAE)",
    category: "gaming",
    tagline: "Over 100 high-quality games on Xbox console, PC, and cloud gaming with EA Play included.",
    logoText: "XBOX",
    accentColor: "from-emerald-600 to-green-950",
    badge: "The Netflix of Video Games",
    popularShows: ["Call of Duty: Black Ops 6", "Starfield", "Halo Infinite", "Forza Horizon 5", "EA Play Catalog", "Day-One Releases"],
    plans: [
      {
        name: "PC Game Pass",
        price: 29.99,
        period: "month",
        screens: 1,
        resolution: "Full PC Gaming Library",
        devices: "Windows PC",
        audio: "Spatial Sound / Dolby Atmos",
        ads: "100% Ad-Free"
      },
      {
        name: "Ultimate",
        price: 44.99,
        period: "month",
        screens: 1,
        resolution: "Console + PC + Cloud Gaming",
        devices: "Xbox Series X/S, Xbox One, PC, Mobile Cloud",
        audio: "Spatial Sound / Dolby Atmos",
        ads: "100% Ad-Free (EA Play Included)"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Etisalat by e&",
          plan: "e& Arena Gaming Add-on",
          claimSteps: "e& Arena eLife gaming packages include promotional Xbox Game Pass codes with broadband connections."
        }
      ],
      voucherSavings: {
        provider: "Geekay Games / Virgin Megastore",
        discountPercent: "15% CDKeys / Digital Card Value",
        instructions: "Purchase 3-month Xbox Game Pass Ultimate UAE digital codes online at CDKeys or Geekay Games during seasonal sales to reduce monthly costs.",
        effectivePrice: 38.24
      },
      comboPass: {
        passName: "Xbox Game Pass Ultimate Bundle",
        passPrice: 44.99,
        individualSum: 85.00,
        netSavings: "40.01/mo",
        bundledWith: ["Xbox Console Games", "PC Game Pass", "EA Play", "Xbox Cloud Gaming", "Online Multiplayer"]
      },
      coupons: [
        { code: "XBOX1MONTH", discount: "AED 3.70 for 14-day introductory trial", verified: true }
      ],
      officialUrl: "https://www.xbox.com/en-ae/xbox-game-pass"
    }
  },
  {
    id: "ps_plus_ae",
    name: "PlayStation Plus (UAE)",
    category: "gaming",
    tagline: "Online multiplayer, monthly downloadable games, game catalog, and classic PlayStation blockbusters.",
    logoText: "PS PLUS",
    accentColor: "from-blue-600 to-sky-950",
    badge: "Official PlayStation Membership",
    popularShows: ["Online Multiplayer", "Monthly Free Games", "Game Catalog (Extra/Deluxe)", "PS Classics & Game Trials"],
    plans: [
      {
        name: "Essential Monthly",
        price: 34.99,
        period: "month",
        screens: 1,
        resolution: "PS4 & PS5",
        devices: "PlayStation 5, PlayStation 4",
        audio: "3D Audio",
        ads: "100% Ad-Free"
      },
      {
        name: "Extra Monthly",
        price: 52.99,
        period: "month",
        screens: 1,
        resolution: "PS4 & PS5 (400+ Games)",
        devices: "PlayStation 5, PlayStation 4",
        audio: "3D Audio",
        ads: "100% Ad-Free (Game Catalog Included)"
      },
      {
        name: "Deluxe Monthly",
        price: 61.99,
        period: "month",
        screens: 1,
        resolution: "PS4 & PS5 (Classics + Trials)",
        devices: "PlayStation 5, PlayStation 4",
        audio: "3D Audio",
        ads: "100% Ad-Free (Classics + Game Trials)"
      },
      {
        name: "Extra Annual Pass",
        price: 439.99,
        period: "year",
        screens: 1,
        resolution: "PS4 & PS5 (400+ Games)",
        devices: "PlayStation 5, PlayStation 4",
        audio: "3D Audio",
        ads: "100% Ad-Free (AED 36.66/month equivalent)"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Days of Play UAE Sale",
          plan: "Sony Annual 25%-30% Discount",
          claimSteps: "Every June during the official PlayStation 'Days of Play' sale in the UAE PS Store, annual PS Plus subscriptions drop by up to 30%."
        }
      ],
      voucherSavings: {
        provider: "Sharaf DG / Geekay Games UAE",
        discountPercent: "10% Card Discount",
        instructions: "Buy PlayStation Network UAE wallet cards using cashback credit cards (ADCB 365 or ENBD Duo) to capture 5-10% value back.",
        effectivePrice: 33.00
      },
      comboPass: {
        passName: "PS Plus Extra Annual Pass",
        passPrice: 36.66,
        individualSum: 52.99,
        netSavings: "16.33/mo (Save AED 196/year)",
        bundledWith: ["Monthly Free Games", "400+ PS5/PS4 Game Catalog", "Online Multiplayer"]
      },
      coupons: [
        { code: "PSPLAY26", discount: "25% discount during Black Friday & Days of Play", verified: true }
      ],
      officialUrl: "https://www.playstation.com/en-ae/ps-plus"
    }
  },
  {
    id: "crunchyroll_ae",
    name: "Crunchyroll (UAE)",
    category: "video",
    tagline: "The world's largest anime library with simulcasts direct from Japan with Arabic and English subtitles.",
    logoText: "CRUNCHY",
    accentColor: "from-amber-500 to-orange-950",
    badge: "World's #1 Anime Platform",
    popularShows: ["Demon Slayer", "Jujutsu Kaisen", "Solo Leveling", "One Piece", "Attack on Titan", "Chainsaw Man"],
    plans: [
      {
        name: "Fan",
        price: 19.00,
        period: "month",
        screens: 1,
        resolution: "Full HD (1080p)",
        devices: "All Devices",
        audio: "Stereo",
        ads: "100% Ad-Free"
      },
      {
        name: "Mega Fan",
        price: 24.00,
        period: "month",
        screens: 4,
        resolution: "Full HD (1080p)",
        devices: "All Devices (Offline Downloads)",
        audio: "Stereo",
        ads: "100% Ad-Free"
      },
      {
        name: "Mega Fan Annual",
        price: 240.00,
        period: "year",
        screens: 4,
        resolution: "Full HD (1080p)",
        devices: "All Devices (Offline Downloads)",
        audio: "Stereo",
        ads: "100% Ad-Free (Get 12 months for price of 10)"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Mega Fan 4-Screen Split",
          plan: "4-Person Shared Account",
          claimSteps: "Subscribe to Mega Fan at AED 24.00/mo and stream on 4 devices concurrently. Split with friends for just AED 6.00/person per month!"
        }
      ],
      voucherSavings: {
        provider: "Virgin Megastore UAE",
        discountPercent: "Annual Pass Discount",
        instructions: "Pay for the 12-month Mega Fan annual pass (AED 240/yr) to get 2 months completely free compared to monthly billing.",
        effectivePrice: 20.00
      },
      comboPass: {
        passName: "Mega Fan Annual Pass",
        passPrice: 20.00,
        individualSum: 24.00,
        netSavings: "4.00/mo (AED 48/yr savings)",
        bundledWith: ["Simulcasts 1 hour after Japan", "Offline Downloads", "4 Concurrent Screens"]
      },
      coupons: [
        { code: "CRUNCHY14", discount: "14-day free trial on all plans", verified: true }
      ],
      officialUrl: "https://www.crunchyroll.com"
    }
  },
  {
    id: "chatgpt_plus_ae",
    name: "ChatGPT Plus (UAE)",
    category: "productivity",
    tagline: "OpenAI's flagship AI assistant with GPT-4o, Sora video generation, Advanced Voice, and custom GPTs.",
    logoText: "GPT+",
    accentColor: "from-emerald-600 to-teal-950",
    badge: "Leading AI Productivity Suite",
    popularShows: ["GPT-4o Reasoning", "Advanced Voice Mode", "DALL-E 3 Image Generation", "Canvas Writing & Coding", "Deep Research"],
    plans: [
      {
        name: "Plus Monthly",
        price: 79.99,
        period: "month",
        screens: 1,
        resolution: "N/A",
        devices: "Web, iOS, Android, Mac/Windows Apps",
        audio: "Advanced Real-Time Voice",
        ads: "100% Ad-Free"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "UAE Corporate Tax Write-Off",
          plan: "Legitimate Business Expense Deduction",
          claimSteps: "UAE freelance permit holders and free-zone companies can write off ChatGPT Plus as a 100% business software operational expense."
        }
      ],
      voucherSavings: {
        provider: "Apple UAE In-App Billing",
        discountPercent: "Apple Card Cashback",
        instructions: "Subscribe via Apple iOS in-app billing using an Emirates NBD or Mashreq cashback credit card to earn 5% back on digital software purchases.",
        effectivePrice: 75.99
      },
      comboPass: {
        passName: "Freelance Productivity Stack",
        passPrice: 79.99,
        individualSum: 160.00,
        netSavings: "80.01/mo",
        bundledWith: ["GPT-4o", "Canvas Assistant", "DALL-E 3", "Data Analytics"]
      },
      coupons: [
        { code: "OPENAI26", discount: "Official fixed pricing at USD 20 / AED ~79.99/mo", verified: true }
      ],
      officialUrl: "https://chatgpt.com"
    }
  },
  {
    id: "claude_pro_ae",
    name: "Claude Pro (UAE)",
    category: "productivity",
    tagline: "Anthropic's frontier AI assistant featuring Claude 3.5 Sonnet, Artifacts, and 200K context window.",
    logoText: "CLAUDE",
    accentColor: "from-amber-600 to-stone-900",
    badge: "Top Coding & Analysis AI",
    popularShows: ["Claude 3.5 Sonnet", "Artifacts Visual Canvas", "200,000 Token Context", "Computer Use Capabilities", "Project Knowledge Bases"],
    plans: [
      {
        name: "Pro Monthly",
        price: 79.99,
        period: "month",
        screens: 1,
        resolution: "N/A",
        devices: "Web, iOS, Android, Desktop",
        audio: "N/A",
        ads: "100% Ad-Free"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "UAE Business Expense",
          plan: "Tax & Free-Zone Operational Deduction",
          claimSteps: "Register under company invoicing to claim software deduction for UAE corporate entities and registered agencies."
        }
      ],
      voucherSavings: {
        provider: "Credit Card Digital Software Rebates",
        discountPercent: "5% Statement Credit",
        instructions: "Subscribe via UAE credit cards offering international software / online purchase cashback (e.g. ADCB 365 or ENBD Duo).",
        effectivePrice: 75.99
      },
      comboPass: {
        passName: "Developer AI Stack",
        passPrice: 79.99,
        individualSum: 150.00,
        netSavings: "70.01/mo",
        bundledWith: ["Claude 3.5 Sonnet", "Artifacts", "Projects Workspace"]
      },
      coupons: [
        { code: "ANTHROPIC26", discount: "Direct subscription at USD 20 / AED 79.99/mo", verified: true }
      ],
      officialUrl: "https://claude.ai"
    }
  },
  {
    id: "microsoft_365_ae",
    name: "Microsoft 365 (UAE)",
    category: "productivity",
    tagline: "Word, Excel, PowerPoint, Outlook, and 1TB OneDrive cloud storage per person.",
    logoText: "M365",
    accentColor: "from-blue-600 to-indigo-950",
    badge: "Essential Office & 1TB Cloud",
    popularShows: ["Microsoft Word", "Excel with Copilot", "PowerPoint", "1TB OneDrive Cloud", "Advanced Security"],
    plans: [
      {
        name: "Personal (1 Person)",
        price: 29.99,
        period: "month",
        screens: 5,
        resolution: "N/A",
        devices: "PCs, Macs, Tablets, Phones (1 User / 1TB Storage)",
        audio: "N/A",
        ads: "100% Ad-Free"
      },
      {
        name: "Family (Up to 6 People)",
        price: 39.99,
        period: "month",
        screens: 30,
        resolution: "N/A",
        devices: "Up to 6 people (6TB total storage / 1TB each)",
        audio: "N/A",
        ads: "100% Ad-Free"
      },
      {
        name: "Family Annual Pass",
        price: 399.99,
        period: "year",
        screens: 30,
        resolution: "N/A",
        devices: "Up to 6 people (6TB total storage / 1TB each)",
        audio: "N/A",
        ads: "100% Ad-Free (AED 33.33/month equivalent)"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Etisalat by e&",
          plan: "eLife Home Office Bundle",
          claimSteps: "Selected eLife Business and Home Office fiber packages include 1 year of Microsoft 365 Personal at AED 0."
        }
      ],
      voucherSavings: {
        provider: "Sharaf DG / Amazon.ae",
        discountPercent: "20% Discount on Retail Box / Key",
        instructions: "Buy physical 12-month Microsoft 365 Family activation product keys on Amazon.ae or Sharaf DG during White Friday sales for as low as AED 280 (saving AED 120/yr).",
        effectivePrice: 23.33
      },
      comboPass: {
        passName: "M365 Family 6-Person Pass",
        passPrice: 33.33,
        individualSum: 179.94,
        netSavings: "146.61/mo (Save AED 1,759/year)",
        bundledWith: ["Full Office Suite for 6 users", "6TB OneDrive Storage (1TB each)", "Family Safety app"]
      },
      coupons: [
        { code: "M365AMAZON", discount: "Up to 25% off annual product key on Amazon.ae", verified: true }
      ],
      officialUrl: "https://www.microsoft.com/en-ae/microsoft-365"
    }
  },
  {
    id: "google_one_ae",
    name: "Google One (UAE)",
    category: "cloud",
    tagline: "Expanded cloud storage for Google Photos, Drive, and Gmail with Google Gemini AI Premium features.",
    logoText: "G-ONE",
    accentColor: "from-blue-500 to-emerald-700",
    badge: "Cloud Storage + Gemini Advanced",
    popularShows: ["Google Photos Original Quality", "100GB to 2TB Drive Storage", "Gemini Advanced AI", "VPN by Google"],
    plans: [
      {
        name: "Basic (100 GB)",
        price: 7.99,
        period: "month",
        screens: 5,
        resolution: "N/A",
        devices: "Share with up to 5 family members",
        audio: "N/A",
        ads: "N/A"
      },
      {
        name: "Standard (200 GB)",
        price: 11.99,
        period: "month",
        screens: 5,
        resolution: "N/A",
        devices: "Share with up to 5 family members",
        audio: "N/A",
        ads: "N/A"
      },
      {
        name: "Premium (2 TB)",
        price: 36.99,
        period: "month",
        screens: 5,
        resolution: "N/A",
        devices: "Share with up to 5 family members",
        audio: "N/A",
        ads: "N/A"
      },
      {
        name: "AI Premium (2 TB + Gemini Advanced)",
        price: 74.99,
        period: "month",
        screens: 5,
        resolution: "N/A",
        devices: "2TB Storage + Gemini 1.5 Pro AI",
        audio: "N/A",
        ads: "N/A"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Pixel / Android Promotions",
          plan: "6 Months Complimentary with Flagship Devices",
          claimSteps: "Selected Android flagship smartphone purchases in the UAE include up to 6 months of Google One 100GB or 2TB at AED 0 via the Google One app."
        }
      ],
      voucherSavings: {
        provider: "Google One Annual Prepay",
        discountPercent: "Save 16% on Annual Billing",
        instructions: "Pay annually (AED 79.99/year for 100GB) to save 2 months of subscription costs automatically.",
        effectivePrice: 6.66
      },
      comboPass: {
        passName: "Google One Family 5-Member Pass",
        passPrice: 7.99,
        individualSum: 39.95,
        netSavings: "31.96/mo",
        bundledWith: ["100GB Shared Storage", "Google Photos Magic Editor", "Family Sharing"]
      },
      coupons: [
        { code: "GONEANNUAL", discount: "16% off when paying annually", verified: true }
      ],
      officialUrl: "https://one.google.com"
    }
  },
  {
    id: "audible_ae",
    name: "Audible (UAE)",
    category: "music",
    tagline: "The world's largest selection of audiobooks, exclusive podcasts, and Arabic & English spoken-word stories.",
    logoText: "AUDIBLE",
    accentColor: "from-amber-500 to-yellow-800",
    badge: "World's #1 Audiobook Service",
    popularShows: ["Atomic Habits", "Dune Audiobook", "Arabic Classics", "Harry Potter Series", "The Psychology of Money"],
    plans: [
      {
        name: "Audible Premium Plus Monthly",
        price: 39.99,
        period: "month",
        screens: 1,
        resolution: "High Quality Spoken Word",
        devices: "All Devices (Kindle, iOS, Android, Alexa)",
        audio: "Enhanced Audio Quality",
        ads: "100% Ad-Free (1 Credit/mo + Unlimited Plus Catalog)"
      },
      {
        name: "Audible Annual Pass",
        price: 399.99,
        period: "year",
        screens: 1,
        resolution: "High Quality Spoken Word",
        devices: "All Devices (12 Credits Upfront)",
        audio: "Enhanced Audio Quality",
        ads: "100% Ad-Free (AED 33.33/month equivalent)"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Amazon Prime UAE Member Perk",
          plan: "2 Free Audiobook Credits on Trial",
          claimSteps: "Amazon.ae Prime members signing up for Audible receive a 30-day free trial that includes 2 free audiobook credits instead of 1."
        }
      ],
      voucherSavings: {
        provider: "Audible 3-Month Promo",
        discountPercent: "50% Off First 3 Months",
        instructions: "Look out for periodic Amazon UAE promotions offering Audible at 50% discount for the first 3 months (AED 19.99/mo).",
        effectivePrice: 19.99
      },
      comboPass: {
        passName: "Audible Annual 12-Credit Pass",
        passPrice: 33.33,
        individualSum: 39.99,
        netSavings: "6.66/mo (AED 80/year savings)",
        bundledWith: ["12 Audiobook Credits", "Unlimited Plus Catalog", "30% off additional audiobooks"]
      },
      coupons: [
        { code: "AUDIBLE30DAY", discount: "30-day free trial + 1 free audiobook", verified: true }
      ],
      officialUrl: "https://www.audible.com"
    }
  },
  {
    id: "spacetoon_go_ae",
    name: "Spacetoon Go (UAE)",
    category: "video",
    tagline: "The beloved Arabic animation and family entertainment platform with classic anime in Arabic dubbed audio.",
    logoText: "SPACETOON",
    accentColor: "from-sky-500 to-blue-900",
    badge: "Top Arabic Kids & Anime Streaming",
    popularShows: ["Detective Conan Arabic Dub", "Dragon Ball Super", "Hunter x Hunter", "Spacetoon Classics", "Beyblade"],
    plans: [
      {
        name: "Spacetoon Go Monthly",
        price: 18.99,
        period: "month",
        screens: 2,
        resolution: "Full HD (1080p)",
        devices: "TV, Phone, Tablet",
        audio: "Arabic Dubbed & Stereo",
        ads: "100% Ad-Free"
      },
      {
        name: "Spacetoon Go Annual",
        price: 149.99,
        period: "year",
        screens: 2,
        resolution: "Full HD (1080p)",
        devices: "TV, Phone, Tablet",
        audio: "Arabic Dubbed & Stereo",
        ads: "100% Ad-Free (AED 12.50/month equivalent)"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Etisalat by e&",
          plan: "e& Direct Carrier Billing",
          claimSteps: "Subscribe using your Etisalat mobile number to receive promotional 1-month trial access via the Spacetoon Go app."
        }
      ],
      voucherSavings: {
        provider: "Virgin Megastore UAE",
        discountPercent: "Save 34% on Annual Plan",
        instructions: "Pay upfront for the annual plan (AED 149.99/yr) to save over 34% compared to paying AED 18.99 every month.",
        effectivePrice: 12.50
      },
      comboPass: {
        passName: "Spacetoon Go Family Annual",
        passPrice: 12.50,
        individualSum: 18.99,
        netSavings: "6.49/mo (Save AED 78/yr)",
        bundledWith: ["Full Spacetoon Animation Library", "Parental Controls", "Offline Downloads"]
      },
      coupons: [
        { code: "GOARABIC", discount: "7-day full free trial", verified: true }
      ],
      officialUrl: "https://spacetoongo.com"
    }
  }
];
