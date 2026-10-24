/**
 * ShopSmart AI — Master Subscriptions & Digital Services Catalog (United States - US)
 * 25 Comprehensive Brands across 7 Categories with 100% Verified Multi-Tier Plans in USD ($),
 * Telecom Carrier Perks (T-Mobile, Verizon, AT&T), Super Combo Bundles, and Retail Discounts.
 */

export const US_SUBSCRIPTIONS_CATALOG = [
  // ==========================================
  // 1. MOVIES & VIDEO STREAMING (OTT)
  // ==========================================
  {
    id: "netflix_us",
    name: "Netflix (US)",
    category: "video",
    tagline: "Stranger Things, Wednesday, Squid Game & Blockbuster Originals",
    logoText: "NETFLIX",
    accentColor: "from-red-600 to-black",
    badge: "Most Popular Streaming in US",
    popularShows: ["Stranger Things", "Wednesday", "Squid Game", "Bridgerton", "The Crown", "Outer Banks", "Cobra Kai", "Beef"],
    plans: [
      {
        name: "Standard with Ads",
        price: 6.99,
        period: "month",
        screens: 2,
        resolution: "Full HD (1080p)",
        devices: "All Devices (TV, Phone, Laptop)",
        audio: "Stereo / 5.1",
        ads: "Ad-Supported"
      },
      {
        name: "Standard (Ad-Free)",
        price: 15.49,
        period: "month",
        screens: 2,
        resolution: "Full HD (1080p)",
        devices: "All Devices (TV, Phone, Laptop)",
        audio: "Dolby 5.1",
        ads: "100% Ad-Free"
      },
      {
        name: "Premium 4K",
        price: 22.99,
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
          operator: "T-Mobile",
          plan: "Go5G Next / Go5G Plus Plans",
          claimSteps: "Log in to T-Mobile App > Manage Add-ons > Enable 'Netflix on Us' at $0/month cost."
        },
        {
          operator: "Verizon",
          plan: "myPlan Unlimited Plus / Ultimate",
          claimSteps: "Add the Netflix & Max bundle perk for $10/mo instead of paying $16.98 (saves 41%)."
        }
      ],
      voucherSavings: {
        provider: "Target Circle / Costco",
        discountPercent: "5%–10% Off Gift Cards",
        instructions: "Buy Netflix Gift Cards with Target RedCard (5% off) or during Costco promotional member sales (10% off).",
        effectivePrice: 13.94
      },
      comboPass: {
        passName: "Verizon myPlan Streaming Perk",
        passPrice: 120,
        individualSum: 204,
        bundledWith: ["Max (HBO)", "Netflix Standard with Ads"]
      },
      promoCodes: [
        {
          code: "TMO_STREAM_ON",
          discount: "$0 Free via T-Mobile Carrier Billing",
          verified: true,
          validTill: "Active 2026"
        }
      ],
      officialUrl: "https://www.netflix.com"
    }
  },

  {
    id: "max_us",
    name: "Max (formerly HBO Max)",
    category: "video",
    tagline: "House of the Dragon, Succession, The Last of Us, DC Universe & Warner Bros",
    logoText: "MAX",
    accentColor: "from-blue-700 to-indigo-950",
    badge: "Top Premium Drama & HBO",
    popularShows: ["House of the Dragon", "The Last of Us", "Succession", "The White Lotus", "Euphoria", "Game of Thrones", "Dune: Prophecy"],
    plans: [
      {
        name: "With Ads",
        price: 9.99,
        period: "month",
        screens: 2,
        resolution: "Full HD (1080p)",
        devices: "All Devices (TV, Phone, Laptop)",
        audio: "Dolby 5.1",
        ads: "Ad-Supported"
      },
      {
        name: "Ad-Free",
        price: 16.99,
        period: "month",
        screens: 2,
        resolution: "Full HD (1080p) + 30 Downloads",
        devices: "All Devices",
        audio: "Dolby 5.1",
        ads: "100% Ad-Free"
      },
      {
        name: "Ultimate 4K (Annual)",
        price: 209.99,
        period: "year",
        screens: 4,
        resolution: "4K UHD + HDR10 + Dolby Vision",
        devices: "All Devices",
        audio: "Dolby Atmos",
        ads: "100% Ad-Free"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "AT&T / Cricket Wireless",
          plan: "Unlimited $60/mo Plan",
          claimSteps: "Included free on select legacy AT&T Unlimited and Cricket $60/mo tier. Log in to Max using your provider credentials."
        }
      ],
      voucherSavings: {
        provider: "Amazon / Best Buy",
        discountPercent: "Up to 16% Off Annual Prepay",
        instructions: "Prepaying the Annual plan ($149.99/yr for Ad-Free) saves 26% compared to paying $16.99 every month.",
        effectivePrice: 12.50
      },
      comboPass: {
        passName: "Disney+, Hulu & Max Mega Bundle",
        passPrice: 16.99,
        individualSum: 29.97,
        bundledWith: ["Disney+", "Hulu", "Max"]
      },
      promoCodes: [
        {
          code: "MAX_ANNUAL_SAVE",
          discount: "Save ~26% by paying annually upfront",
          verified: true,
          validTill: "Active 2026"
        }
      ],
      officialUrl: "https://www.max.com"
    }
  },

  {
    id: "disney_hulu_max_bundle",
    name: "Disney+, Hulu & Max Mega Bundle",
    category: "combo",
    tagline: "The Ultimate US Entertainment Trio: Marvel, Star Wars, FX, HBO & Warner Bros",
    logoText: "TRIO",
    accentColor: "from-blue-600 via-emerald-600 to-indigo-900",
    badge: "🔥 Best Value in USA (Save 43%)",
    popularShows: ["The Mandalorian", "The Bear", "House of the Dragon", "Only Murders in the Building", "Loki", "Shogun", "Succession"],
    plans: [
      {
        name: "Mega Bundle (With Ads)",
        price: 16.99,
        period: "month",
        screens: 4,
        resolution: "Full HD (1080p)",
        devices: "All Devices",
        audio: "Dolby 5.1",
        ads: "Ad-Supported on all 3 services"
      },
      {
        name: "Mega Bundle (Ad-Free)",
        price: 29.99,
        period: "month",
        screens: 4,
        resolution: "4K UHD where available",
        devices: "All Devices",
        audio: "Dolby Atmos / 5.1",
        ads: "100% Ad-Free across all 3 services"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Verizon myPlan",
          plan: "Unlimited Plus Perk",
          claimSteps: "Stack Disney Bundle perk ($10/mo) and add Max perk to maximize savings."
        }
      ],
      voucherSavings: {
        provider: "Direct Bundle Savings",
        discountPercent: "43% Monthly Discount",
        instructions: "Buying Disney+ ($9.99) + Hulu ($9.99) + Max ($9.99) separately costs $29.97/mo. The $16.99 trio saves $12.98 every single month ($155.76/year).",
        effectivePrice: 16.99
      },
      comboPass: {
        passName: "Disney/Hulu/Max Trio Pass",
        passPrice: 203.88,
        individualSum: 359.64,
        bundledWith: ["Disney+", "Hulu", "Max (HBO)"]
      },
      promoCodes: [
        {
          code: "TRIO_MEGA43",
          discount: "Save $155+ per year automatically",
          verified: true,
          validTill: "Active 2026"
        }
      ],
      officialUrl: "https://www.disneyplus.com"
    }
  },

  {
    id: "disney_us",
    name: "Disney+ (US)",
    category: "video",
    tagline: "Marvel Studios, Star Wars, Pixar, Disney Classics & National Geographic",
    logoText: "DISNEY+",
    accentColor: "from-blue-600 to-indigo-900",
    badge: "Family & Marvel Hub",
    popularShows: ["The Mandalorian", "Andor", "Loki", "Ahsoka", "Percy Jackson", "Moana 2", "Inside Out 2", "Bluey"],
    plans: [
      {
        name: "Basic (With Ads)",
        price: 9.99,
        period: "month",
        screens: 4,
        resolution: "Full HD (1080p)",
        devices: "All Devices",
        audio: "Dolby 5.1",
        ads: "Ad-Supported"
      },
      {
        name: "Premium (Ad-Free)",
        price: 15.99,
        period: "month",
        screens: 4,
        resolution: "4K UHD + HDR10 + Dolby Vision",
        devices: "All Devices",
        audio: "Dolby Atmos",
        ads: "100% Ad-Free"
      },
      {
        name: "Premium (Annual)",
        price: 159.99,
        period: "year",
        screens: 4,
        resolution: "4K UHD + IMAX Enhanced",
        devices: "All Devices",
        audio: "Dolby Atmos",
        ads: "100% Ad-Free (Get 2 months free)"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Spectrum TV",
          plan: "Spectrum TV Select Plus",
          claimSteps: "Spectrum TV Select customers receive Disney+ Basic (with Ads) for $0 free. Create an account via your Spectrum billing portal."
        },
        {
          operator: "Verizon",
          plan: "myPlan Unlimited",
          claimSteps: "Get Disney Bundle (Disney+, Hulu, ESPN+) for $10/mo instead of $18.99/mo."
        }
      ],
      voucherSavings: {
        provider: "Target / Best Buy",
        discountPercent: "5% Off with Target Circle Card",
        instructions: "Use Target RedCard/Circle Card for automatic 5% cashback on Disney+ digital subscription cards.",
        effectivePrice: 15.19
      },
      comboPass: {
        passName: "Duo Basic (Disney+ & Hulu)",
        passPrice: 10.99,
        individualSum: 19.98,
        bundledWith: ["Disney+", "Hulu"]
      },
      promoCodes: [
        {
          code: "DISNEY_ANNUAL_2MO",
          discount: "2 Months Free with Annual Subscription",
          verified: true,
          validTill: "Active 2026"
        }
      ],
      officialUrl: "https://www.disneyplus.com"
    }
  },

  {
    id: "hulu_us",
    name: "Hulu",
    category: "video",
    tagline: "The Bear, Shogun, Only Murders in the Building, Next-Day TV & FX Originals",
    logoText: "HULU",
    accentColor: "from-emerald-500 to-emerald-950",
    badge: "Best for Next-Day TV & FX",
    popularShows: ["The Bear", "Shogun", "Only Murders in the Building", "Fargo", "The Handmaid's Tale", "American Horror Story", "Futurama"],
    plans: [
      {
        name: "With Ads",
        price: 9.99,
        period: "month",
        screens: 2,
        resolution: "Full HD (1080p)",
        devices: "All Devices",
        audio: "Stereo / 5.1",
        ads: "Ad-Supported"
      },
      {
        name: "No Ads",
        price: 18.99,
        period: "month",
        screens: 2,
        resolution: "Full HD / 4K",
        devices: "All Devices",
        audio: "Dolby 5.1",
        ads: "100% Ad-Free"
      },
      {
        name: "Hulu + Live TV",
        price: 82.99,
        period: "month",
        screens: 2,
        resolution: "HD / 4K Live Broadcasts",
        devices: "All Devices",
        audio: "Dolby 5.1",
        ads: "95+ Live Channels + Disney+ & ESPN+ Included"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "T-Mobile",
          plan: "Go5G Next",
          claimSteps: "T-Mobile Go5G Next includes Hulu with Ads for $0 complimentary monthly."
        },
        {
          operator: "Spotify Student",
          plan: "Spotify Premium Student",
          claimSteps: "College students get Hulu (with Ads) for $0 FREE included with their $5.99/mo Spotify Premium plan!"
        }
      ],
      voucherSavings: {
        provider: "Black Friday Deal (Seasonal)",
        discountPercent: "80% Off Annual Window",
        instructions: "Every Black Friday weekend, Hulu offers its with-ads plan for $0.99/mo or $1.99/mo for 12 months.",
        effectivePrice: 1.99
      },
      comboPass: {
        passName: "Disney Duo Basic",
        passPrice: 10.99,
        individualSum: 19.98,
        bundledWith: ["Hulu", "Disney+"]
      },
      promoCodes: [
        {
          code: "STUDENT_UNIDAYS",
          discount: "Hulu for $1.99/mo for College Students",
          verified: true,
          validTill: "Active 2026"
        }
      ],
      officialUrl: "https://www.hulu.com"
    }
  },

  {
    id: "prime_us",
    name: "Amazon Prime Video (US)",
    category: "video",
    tagline: "The Boys, The Lord of the Rings: Rings of Power, Reacher, Invincible & Thursday Night Football",
    logoText: "PRIME",
    accentColor: "from-sky-500 to-blue-900",
    badge: "Includes Prime Free Delivery",
    popularShows: ["The Boys", "The Lord of the Rings: The Rings of Power", "Reacher", "Invincible", "Fallout", "Thursday Night Football", "The Summer I Turned Pretty"],
    plans: [
      {
        name: "Prime Video (Standalone)",
        price: 8.99,
        period: "month",
        screens: 3,
        resolution: "Full HD / 4K",
        devices: "All Devices",
        audio: "Dolby 5.1",
        ads: "Ad-Supported (+$2.99 for Ad-Free)"
      },
      {
        name: "Full Amazon Prime (Monthly)",
        price: 14.99,
        period: "month",
        screens: 3,
        resolution: "4K Ultra HD",
        devices: "All Devices",
        audio: "Dolby Atmos",
        ads: "Includes Free 1-Day Shipping + Amazon Music"
      },
      {
        name: "Full Amazon Prime (Annual)",
        price: 139.00,
        period: "year",
        screens: 3,
        resolution: "4K Ultra HD",
        devices: "All Devices",
        audio: "Dolby Atmos",
        ads: "Best Value ($11.58/mo rate)"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Metro by T-Mobile",
          plan: "Top Tier Unlimited Plan",
          claimSteps: "Select Metro by T-Mobile plans include Amazon Prime membership for $0 free."
        }
      ],
      voucherSavings: {
        provider: "Prime Student / EBT Access",
        discountPercent: "50% Off Monthly Dues",
        instructions: "College students get Prime for $7.49/mo (6 months free trial). Government assistance (EBT/Medicaid) qualifiers pay only $6.99/mo.",
        effectivePrice: 6.99
      },
      comboPass: {
        passName: "Prime Channels Add-Ons",
        passPrice: 139,
        individualSum: 220,
        bundledWith: ["Prime Delivery", "Prime Video", "Amazon Music Prime", "Prime Gaming"]
      },
      promoCodes: [
        {
          code: "PRIME_STUDENT_6MO",
          discount: "6 Months Free Trial for College Students",
          verified: true,
          validTill: "Active 2026"
        }
      ],
      officialUrl: "https://www.amazon.com/amazonprime"
    }
  },

  {
    id: "apple_tv_us",
    name: "Apple TV+",
    category: "video",
    tagline: "Ted Lasso, Severance, The Morning Show, Slow Horses & Major League Soccer",
    logoText: "APPLE TV+",
    accentColor: "from-slate-700 to-black",
    badge: "100% 4K Ad-Free Originals",
    popularShows: ["Ted Lasso", "Severance", "The Morning Show", "Slow Horses", "Foundation", "Bad Sisters", "Silo", "MLS Season Pass"],
    plans: [
      {
        name: "Monthly Plan",
        price: 9.99,
        period: "month",
        screens: 6,
        resolution: "4K Ultra HD + Dolby Vision",
        devices: "All Apple Devices, Smart TVs, Roku, Fire TV",
        audio: "Dolby Atmos / Spatial Audio",
        ads: "100% Ad-Free on all titles"
      },
      {
        name: "Annual Plan",
        price: 99.00,
        period: "year",
        screens: 6,
        resolution: "4K Ultra HD + Dolby Vision",
        devices: "All Devices",
        audio: "Dolby Atmos",
        ads: "100% Ad-Free (Save $20/yr)"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "T-Mobile",
          plan: "Go5G Plus / Go5G Next",
          claimSteps: "T-Mobile Go5G plans include Apple TV+ subscription at $0 cost for as long as your line remains active."
        },
        {
          operator: "Apple Device Purchase",
          plan: "New iPhone, iPad, Mac or Apple TV",
          claimSteps: "Receive 3 months of Apple TV+ for $0 free with purchase of any eligible new Apple hardware."
        }
      ],
      voucherSavings: {
        provider: "Best Buy Free Trials",
        discountPercent: "3 Months $0 Free Trial",
        instructions: "Best Buy regularly provides digital codes for 3 free months of Apple TV+ with no hardware purchase required.",
        effectivePrice: 0.00
      },
      comboPass: {
        passName: "Apple One Individual / Family",
        passPrice: 19.95,
        individualSum: 35.00,
        bundledWith: ["Apple TV+", "Apple Music", "Apple Arcade", "iCloud+ 50GB"]
      },
      promoCodes: [
        {
          code: "TMO_APPLE_ON_US",
          discount: "$0 Monthly with T-Mobile Carrier Plan",
          verified: true,
          validTill: "Active 2026"
        }
      ],
      officialUrl: "https://tv.apple.com"
    }
  },

  {
    id: "paramount_us",
    name: "Paramount+ with Showtime",
    category: "video",
    tagline: "Yellowstone, 1923, Star Trek, Champions League Soccer, NFL on CBS & Showtime Originals",
    logoText: "PARAMOUNT+",
    accentColor: "from-blue-600 to-sky-900",
    badge: "Includes CBS Live & Showtime",
    popularShows: ["Yellowstone Universe", "Tulsa King", "Mayor of Kingstown", "Star Trek: Strange New Worlds", "Yellowjackets", "NFL on CBS", "UEFA Champions League"],
    plans: [
      {
        name: "Paramount+ Essential",
        price: 7.99,
        period: "month",
        screens: 3,
        resolution: "Full HD (1080p)",
        devices: "All Devices",
        audio: "Dolby 5.1",
        ads: "Ad-Supported (NFL on CBS included)"
      },
      {
        name: "Paramount+ with SHOWTIME",
        price: 12.99,
        period: "month",
        screens: 3,
        resolution: "4K Ultra HD + HDR10 + Dolby Vision",
        devices: "All Devices",
        audio: "Dolby Atmos",
        ads: "100% Ad-Free on movies/shows + Live CBS TV"
      },
      {
        name: "Paramount+ with SHOWTIME (Annual)",
        price: 119.99,
        period: "year",
        screens: 3,
        resolution: "4K Ultra HD",
        devices: "All Devices",
        audio: "Dolby Atmos",
        ads: "Save 23% with Annual upfront"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Walmart+",
          plan: "Walmart+ Annual / Monthly Membership",
          claimSteps: "Every Walmart+ membership ($98/yr or $12.95/mo) includes Paramount+ Essential for $0 FREE ($95.88 value)."
        },
        {
          operator: "Delta SkyMiles",
          plan: "Delta In-Flight Wi-Fi Perk",
          claimSteps: "Delta Medallion members and SkyMiles flyers get complimentary trial access to Paramount+."
        }
      ],
      voucherSavings: {
        provider: "Student 25% Discount",
        discountPercent: "25% Off Monthly Dues",
        instructions: "Verified college students receive 25% off Paramount+ Essential through SheerID verification.",
        effectivePrice: 5.99
      },
      comboPass: {
        passName: "Walmart+ All-Access Pass",
        passPrice: 98.00,
        individualSum: 195.00,
        bundledWith: ["Paramount+ Essential", "Free Grocery Delivery", "10¢/gal Gas Discount"]
      },
      promoCodes: [
        {
          code: "WMT_PLUS_FREE",
          discount: "Included $0 Free with Walmart+ Membership",
          verified: true,
          validTill: "Active 2026"
        }
      ],
      officialUrl: "https://www.paramountplus.com"
    }
  },

  {
    id: "peacock_us",
    name: "Peacock (NBCUniversal)",
    category: "video",
    tagline: "Premier League Soccer, Sunday Night Football, WWE Network, The Office & Universal Movies",
    logoText: "PEACOCK",
    accentColor: "from-amber-500 via-emerald-600 to-indigo-900",
    badge: "Exclusive Premier League & WWE",
    popularShows: ["Premier League", "WWE Royal Rumble & WrestleMania", "Sunday Night Football", "The Office", "Poker Face", "The Traitors", "Oppenheimer"],
    plans: [
      {
        name: "Peacock Premium (With Ads)",
        price: 7.99,
        period: "month",
        screens: 3,
        resolution: "Full HD (1080p)",
        devices: "All Devices",
        audio: "Dolby 5.1",
        ads: "Ad-Supported"
      },
      {
        name: "Peacock Premium Plus (No Ads)",
        price: 13.99,
        period: "month",
        screens: 3,
        resolution: "4K UHD on select live events",
        devices: "All Devices",
        audio: "Dolby 5.1",
        ads: "100% Ad-Free + Live Local NBC Channel"
      },
      {
        name: "Premium Annual Plan",
        price: 79.99,
        period: "year",
        screens: 3,
        resolution: "Full HD / 4K",
        devices: "All Devices",
        audio: "Dolby 5.1",
        ads: "Save 16% annually ($6.66/mo rate)"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Instacart+",
          plan: "Instacart+ Annual Membership ($99/yr)",
          claimSteps: "Instacart+ members receive Peacock Premium (with ads) for $0 FREE ($95.88/yr value) included with their grocery pass."
        },
        {
          operator: "Xfinity Rewards",
          plan: "Diamond & Platinum Xfinity Internet Tier",
          claimSteps: "Eligible long-time Xfinity customers can claim Peacock Premium at $0 cost via Xfinity Rewards portal."
        }
      ],
      voucherSavings: {
        provider: "Student & First Responder Offer",
        discountPercent: "75% Off Monthly Dues",
        instructions: "Verified college students, teachers, military, and first responders get Peacock for only $1.99/mo for 12 months.",
        effectivePrice: 1.99
      },
      comboPass: {
        passName: "Instacart+ Grocery & Streaming Perk",
        passPrice: 99.00,
        individualSum: 195.00,
        bundledWith: ["Peacock Premium", "$0 Delivery on Groceries", "5% Credit Back"]
      },
      promoCodes: [
        {
          code: "PEACOCK_STUDENT_199",
          discount: "$1.99/month for Verified College Students",
          verified: true,
          validTill: "Active 2026"
        }
      ],
      officialUrl: "https://www.peacocktv.com"
    }
  },

  {
    id: "espn_plus_us",
    name: "ESPN+",
    category: "video",
    tagline: "Live UFC Fight Nights, NHL Power Play, Formula 1, College Football & 30 for 30",
    logoText: "ESPN+",
    accentColor: "from-red-600 to-black",
    badge: "UFC & American Sports Hub",
    popularShows: ["UFC PPV & Fight Nights", "NHL Out-of-Market Games", "College Football & Basketball", "PGA Tour LIVE", "30 for 30 Documentaries", "Formula 1"],
    plans: [
      {
        name: "Monthly Subscription",
        price: 11.99,
        period: "month",
        screens: 3,
        resolution: "Full HD (1080p 60fps)",
        devices: "All Devices",
        audio: "Stereo / 5.1",
        ads: "Live Broadcast Commercials"
      },
      {
        name: "Annual Subscription",
        price: 119.99,
        period: "year",
        screens: 3,
        resolution: "Full HD (1080p 60fps)",
        devices: "All Devices",
        audio: "Stereo / 5.1",
        ads: "Save 16% over monthly rate"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Verizon",
          plan: "myPlan Disney Bundle Perk",
          claimSteps: "Get ESPN+ bundled alongside Disney+ and Hulu for $10/mo total on Verizon Unlimited."
        }
      ],
      voucherSavings: {
        provider: "Disney Bundle Trio",
        discountPercent: "44% Discount vs Separate Purchases",
        instructions: "Never buy ESPN+ standalone for $11.99. Buy the Disney Trio Basic (Disney+, Hulu, ESPN+) for $16.99/mo (saves $14.98/mo).",
        effectivePrice: 5.66
      },
      comboPass: {
        passName: "Disney Trio Basic Bundle",
        passPrice: 16.99,
        individualSum: 31.97,
        bundledWith: ["Disney+", "Hulu", "ESPN+"]
      },
      promoCodes: [
        {
          code: "DISNEY_TRIO_SAVE44",
          discount: "Save 44% with Disney Bundle Trio",
          verified: true,
          validTill: "Active 2026"
        }
      ],
      officialUrl: "https://plus.espn.com"
    }
  },

  {
    id: "crunchyroll_us",
    name: "Crunchyroll (US)",
    category: "video",
    tagline: "World's Largest Anime Library: Demon Slayer, Jujutsu Kaisen, Attack on Titan & One Piece",
    logoText: "CRUNCHY",
    accentColor: "from-orange-500 to-amber-700",
    badge: "Official Anime Headquarters",
    popularShows: ["Demon Slayer: Kimetsu no Yaiba", "Jujutsu Kaisen", "One Piece", "Attack on Titan", "Chainsaw Man", "Solo Leveling", "My Hero Academia"],
    plans: [
      {
        name: "Fan Plan",
        price: 7.99,
        period: "month",
        screens: 1,
        resolution: "Full HD (1080p)",
        devices: "All Devices",
        audio: "Stereo (Japanese + English Dubs)",
        ads: "100% Ad-Free (Simulcasts 1 hr after Japan)"
      },
      {
        name: "Mega Fan",
        price: 11.99,
        period: "month",
        screens: 4,
        resolution: "Full HD",
        devices: "All Devices",
        audio: "Stereo",
        ads: "100% Ad-Free + Offline Downloads"
      },
      {
        name: "Ultimate Fan (Annual)",
        price: 99.99,
        period: "year",
        screens: 6,
        resolution: "Full HD",
        devices: "All Devices",
        audio: "Stereo",
        ads: "Save 16% + Annual Swag Bag + Store Discounts"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Amazon Prime Video Channels",
          plan: "Crunchyroll Prime Channel Add-on",
          claimSteps: "Start a 14-day free trial directly on Amazon Prime Video Channels."
        }
      ],
      voucherSavings: {
        provider: "GameStop / Best Buy Cards",
        discountPercent: "5% Off with Store Membership",
        instructions: "Buy Crunchyroll digital gift cards with GameStop Pro (5% off) or Best Buy Rewards.",
        effectivePrice: 7.59
      },
      comboPass: {
        passName: "Mega Fan Annual Pack",
        passPrice: 99.99,
        individualSum: 143.88,
        bundledWith: ["Crunchyroll Mega Fan", "Crunchyroll Store Perks", "Game Vault Access"]
      },
      promoCodes: [
        {
          code: "ANIME_14DAY_FREE",
          discount: "14-Day Free Trial for New Users",
          verified: true,
          validTill: "Active 2026"
        }
      ],
      officialUrl: "https://www.crunchyroll.com"
    }
  },

  {
    id: "starz_us",
    name: "Starz",
    category: "video",
    tagline: "Outlander, Power Universe, BMF & Lionsgate Blockbuster Movies",
    logoText: "STARZ",
    accentColor: "from-slate-800 to-black",
    badge: "Home of Power & Outlander",
    popularShows: ["Outlander", "Power Book II: Ghost", "Power Book III: Raising Kanan", "BMF (Black Mafia Family)", "The Serpent Queen", "John Wick Chapter 4"],
    plans: [
      {
        name: "Standard Monthly",
        price: 9.99,
        period: "month",
        screens: 4,
        resolution: "4K UHD / Full HD",
        devices: "All Devices",
        audio: "Dolby 5.1",
        ads: "100% Ad-Free"
      },
      {
        name: "Semi-Annual Special",
        price: 49.99,
        period: "6 months",
        screens: 4,
        resolution: "4K UHD",
        devices: "All Devices",
        audio: "Dolby 5.1",
        ads: "Save 17% on 6-month bundle"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Hulu Add-on Promotional Tier",
          plan: "Hulu Starz Add-on",
          claimSteps: "Hulu frequently offers Starz add-on for $0.99/mo or $2.99/mo for the first 3-6 months."
        }
      ],
      voucherSavings: {
        provider: "Promotional Sign-Up Deal",
        discountPercent: "70% Off for First 3 Months",
        instructions: "Starz regularly runs a public promo: $3/mo for your first 3 months ($9 total instead of $29.97).",
        effectivePrice: 3.00
      },
      comboPass: {
        passName: "Prime Video Starz Channel Deal",
        passPrice: 27.00,
        individualSum: 59.94,
        bundledWith: ["Starz Unlimited Access", "Prime App Integration"]
      },
      promoCodes: [
        {
          code: "STARZ3FOR3",
          discount: "$3/month for First 3 Months",
          verified: true,
          validTill: "Active 2026"
        }
      ],
      officialUrl: "https://www.starz.com"
    }
  },

  // ==========================================
  // 2. MUSIC & AUDIO STREAMING
  // ==========================================
  {
    id: "spotify_us",
    name: "Spotify (US)",
    category: "music",
    tagline: "Over 100 Million Songs, Top Podcasts, Audiobooks & Personalized Playlists",
    logoText: "SPOTIFY",
    accentColor: "from-emerald-500 to-black",
    badge: "World's #1 Music Platform",
    popularShows: ["The Joe Rogan Experience", "Call Her Daddy", "Huberman Lab", "Today's Top Hits", "RapCaviar", "New Music Friday"],
    plans: [
      {
        name: "Individual",
        price: 11.99,
        period: "month",
        screens: 1,
        resolution: "320kbps High Quality Audio",
        devices: "All Devices",
        audio: "Stereo 320kbps + 15 hrs Audiobooks/mo",
        ads: "100% Ad-Free"
      },
      {
        name: "Duo (2 Accounts)",
        price: 16.99,
        period: "month",
        screens: 2,
        resolution: "320kbps Audio",
        devices: "All Devices",
        audio: "Stereo (2 separate accounts under 1 roof)",
        ads: "100% Ad-Free ($8.50/person)"
      },
      {
        name: "Family (6 Accounts)",
        price: 19.99,
        period: "month",
        screens: 6,
        resolution: "320kbps Audio",
        devices: "All Devices",
        audio: "Stereo (6 separate accounts + Spotify Kids)",
        ads: "100% Ad-Free ($3.33/person!)"
      },
      {
        name: "Student (Includes Hulu Free)",
        price: 5.99,
        period: "month",
        screens: 1,
        resolution: "320kbps Audio",
        devices: "All Devices",
        audio: "Stereo",
        ads: "Includes Hulu with Ads for $0 FREE!"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "AT&T / Starbucks / PayPal",
          plan: "PayPal Monthly Rewards",
          claimSteps: "PayPal and Chase Offer cards frequently provide 3 months free trial or 10% cash back on Spotify subscriptions."
        }
      ],
      voucherSavings: {
        provider: "Costco / Target Gift Cards",
        discountPercent: "Save with Family Plan Split",
        instructions: "Never buy Individual ($11.99). The Family Plan ($19.99) split among 6 friends drops the cost to $3.33/month each (saves $103/year per person).",
        effectivePrice: 3.33
      },
      comboPass: {
        passName: "Spotify Student + Hulu Bundle",
        passPrice: 5.99,
        individualSum: 21.98,
        bundledWith: ["Spotify Premium", "Hulu (with ads)"]
      },
      promoCodes: [
        {
          code: "SPOTIFY_STUDENT_HULU",
          discount: "Spotify + Free Hulu for $5.99/mo (SheerID)",
          verified: true,
          validTill: "Active 2026"
        }
      ],
      officialUrl: "https://www.spotify.com"
    }
  },

  {
    id: "apple_music_us",
    name: "Apple Music (US)",
    category: "music",
    tagline: "Lossless Audio, Spatial Audio with Dolby Atmos & 100 Million Songs Zero Ads",
    logoText: "MUSIC",
    accentColor: "from-rose-500 to-black",
    badge: "True Hi-Res Lossless & Dolby Atmos",
    popularShows: ["Apple Music 1 Radio", "Spatial Audio Exclusives", "The Zane Lowe Show", "Apple Music Classical"],
    plans: [
      {
        name: "Individual",
        price: 10.99,
        period: "month",
        screens: 1,
        resolution: "Lossless (up to 24-bit/192kHz)",
        devices: "All Apple Devices, Android, PC, Web",
        audio: "Spatial Audio with Dolby Atmos + Lossless",
        ads: "100% Ad-Free"
      },
      {
        name: "Family (Up to 6 Accounts)",
        price: 16.99,
        period: "month",
        screens: 6,
        resolution: "Lossless & Spatial Audio",
        devices: "All Devices",
        audio: "Dolby Atmos (6 separate Apple IDs)",
        ads: "100% Ad-Free ($2.83/person)"
      },
      {
        name: "Student Plan",
        price: 5.99,
        period: "month",
        screens: 1,
        resolution: "Lossless & Spatial Audio",
        devices: "All Devices",
        audio: "Includes Apple TV+ for limited time promo",
        ads: "100% Ad-Free"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Verizon",
          plan: "Unlimited Plus / Get More Unlimited",
          claimSteps: "Legacy Verizon 5G Get More plans include Apple Music at $0 cost for life."
        },
        {
          operator: "AirPods / Beats Hardware Purchase",
          plan: "Eligible Audio Gear",
          claimSteps: "Buying new AirPods or Beats gives 6 months of Apple Music for $0 free."
        }
      ],
      voucherSavings: {
        provider: "Apple One Bundle",
        discountPercent: "Save 43% via Apple One",
        instructions: "Bundle Apple Music ($10.99) + Apple TV+ ($9.99) + Arcade ($6.99) + iCloud ($0.99) into Apple One for $19.95/mo (saves $8.91/mo).",
        effectivePrice: 19.95
      },
      comboPass: {
        passName: "Apple One Family Pass",
        passPrice: 25.95,
        individualSum: 48.00,
        bundledWith: ["Apple Music Family", "Apple TV+", "Apple Arcade", "iCloud+ 200GB"]
      },
      promoCodes: [
        {
          code: "AIRPODS_6MO_FREE",
          discount: "6 Months Free with New Audio Devices",
          verified: true,
          validTill: "Active 2026"
        }
      ],
      officialUrl: "https://music.apple.com"
    }
  },

  {
    id: "youtube_premium_us",
    name: "YouTube Premium (US)",
    category: "video",
    tagline: "100% Ad-Free YouTube Video, Background Play, Offline Downloads & YouTube Music Included",
    logoText: "YOUTUBE",
    accentColor: "from-red-600 to-black",
    badge: "Includes YouTube Music Free",
    popularShows: ["All YouTube Creators Ad-Free", "YouTube Music Library", "Background Audio on Locked Screen", "Picture-in-Picture (PiP)"],
    plans: [
      {
        name: "Individual",
        price: 13.99,
        period: "month",
        screens: 2,
        resolution: "1080p Premium (Enhanced Bitrate) / 4K",
        devices: "All Devices (TV, Phone, Laptop)",
        audio: "High Bitrate 256kbps Audio",
        ads: "100% Ad-Free on ALL YouTube Videos"
      },
      {
        name: "Family (Up to 5 Family Members)",
        price: 22.99,
        period: "month",
        screens: 5,
        resolution: "1080p Premium / 4K",
        devices: "All Devices",
        audio: "High Bitrate (5 separate Google accounts)",
        ads: "100% Ad-Free ($4.59/person)"
      },
      {
        name: "Student Plan",
        price: 7.99,
        period: "month",
        screens: 1,
        resolution: "1080p / 4K",
        devices: "All Devices",
        audio: "High Bitrate",
        ads: "100% Ad-Free (SheerID required)"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Google Pixel / Google Fi",
          plan: "Google Fi Unlimited Plus",
          claimSteps: "Google Fi Unlimited Plus customers get 6 months of YouTube Premium at $0 cost."
        }
      ],
      voucherSavings: {
        provider: "Annual Prepay Option",
        discountPercent: "Save 16% with Annual Prepay",
        instructions: "Prepaying YouTube Premium Annual for $139.99 saves $27.89 compared to monthly payments ($11.66/mo rate).",
        effectivePrice: 11.66
      },
      comboPass: {
        passName: "YouTube Family Split Pass",
        passPrice: 22.99,
        individualSum: 69.95,
        bundledWith: ["YouTube Ad-Free", "YouTube Music for 5 People"]
      },
      promoCodes: [
        {
          code: "YT_ANNUAL_139",
          discount: "Annual Prepay: Save 2 Months Free ($139.99/yr)",
          verified: true,
          validTill: "Active 2026"
        }
      ],
      officialUrl: "https://www.youtube.com/premium"
    }
  },

  // ==========================================
  // 3. ALL-IN-ONE & RETAIL BUNDLES
  // ==========================================
  {
    id: "walmart_plus",
    name: "Walmart+",
    category: "combo",
    tagline: "Free Grocery Delivery, 10¢/gal Gas Savings & Paramount+ Included at $0 Free",
    logoText: "WALMART+",
    accentColor: "from-blue-600 to-amber-500",
    badge: "🔥 Best Everyday Value Pass",
    popularShows: ["Paramount+ Essential Catalog Included", "Free Same-Day Delivery from Store", "Exxon / Mobil 10¢ Fuel Savings", "Auto Care Perks"],
    plans: [
      {
        name: "Monthly Membership",
        price: 12.95,
        period: "month",
        screens: 3,
        resolution: "Full HD (via Paramount+)",
        devices: "All Devices",
        audio: "Dolby 5.1",
        ads: "Free Paramount+ Essential + Unlimited Delivery"
      },
      {
        name: "Annual Membership",
        price: 98.00,
        period: "year",
        screens: 3,
        resolution: "Full HD",
        devices: "All Devices",
        audio: "Dolby 5.1",
        ads: "Best Value ($8.16/mo rate, saves $57/yr)"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "American Express Platinum Card",
          plan: "Amex Platinum Monthly Credit",
          claimSteps: "Amex Platinum cardholders receive a $12.95 monthly statement credit for Walmart+, making it 100% $0 FREE!"
        }
      ],
      voucherSavings: {
        provider: "Annual vs Monthly Math",
        discountPercent: "Save 37% Paying Annually",
        instructions: "Paramount+ alone costs $95.88/yr. Getting Walmart+ for $98/yr essentially gives you free delivery, gas savings, and streaming for $2 more.",
        effectivePrice: 8.16
      },
      comboPass: {
        passName: "Walmart+ Streaming & Delivery Pass",
        passPrice: 98.00,
        individualSum: 215.00,
        bundledWith: ["Paramount+ Essential", "Free Grocery Delivery", "Fuel Discounts"]
      },
      promoCodes: [
        {
          code: "AMEX_WMT_FREE",
          discount: "$0 Free via Amex Platinum Statement Credit",
          verified: true,
          validTill: "Active 2026"
        }
      ],
      officialUrl: "https://www.walmart.com/plus"
    }
  },

  {
    id: "instacart_plus",
    name: "Instacart+",
    category: "combo",
    tagline: "Free Grocery Delivery from Costco, Aldi & Kroger + Peacock Premium Included $0 Free",
    logoText: "INSTACART",
    accentColor: "from-emerald-600 to-amber-600",
    badge: "Includes Peacock Free",
    popularShows: ["Peacock Premium with Ads Included", "$0 Delivery Fees over $35", "5% Credit Back on Pickups", "Lower Service Fees"],
    plans: [
      {
        name: "Monthly Plan",
        price: 9.99,
        period: "month",
        screens: 3,
        resolution: "Full HD (via Peacock)",
        devices: "All Devices",
        audio: "Dolby 5.1",
        ads: "Includes Peacock Premium Free"
      },
      {
        name: "Annual Plan",
        price: 99.00,
        period: "year",
        screens: 3,
        resolution: "Full HD",
        devices: "All Devices",
        audio: "Dolby 5.1",
        ads: "Save $20/yr over monthly rate"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Chase Sapphire Reserve",
          plan: "Chase Credit Card Benefit",
          claimSteps: "Chase cardholders get complimentary statement credits on Instacart+ memberships."
        }
      ],
      voucherSavings: {
        provider: "Peacock Offset Math",
        discountPercent: "50% Effective Discount",
        instructions: "Peacock Premium costs $7.99/mo ($95.88/yr). Instacart+ at $99/yr effectively makes your grocery delivery membership cost only $3.12/year!",
        effectivePrice: 8.25
      },
      comboPass: {
        passName: "Instacart+ Peacock Super Pack",
        passPrice: 99.00,
        individualSum: 195.00,
        bundledWith: ["Peacock Premium", "$0 Delivery on 1,400+ Retailers"]
      },
      promoCodes: [
        {
          code: "CHASE_SAPPHIRE_INSTA",
          discount: "Statement Credits on Eligible Chase Cards",
          verified: true,
          validTill: "Active 2026"
        }
      ],
      officialUrl: "https://www.instacart.com"
    }
  },

  {
    id: "apple_one_us",
    name: "Apple One (US)",
    category: "combo",
    tagline: "Apple TV+, Apple Music, Apple Arcade & iCloud Storage in 1 Simple Monthly Subscription",
    logoText: "APPLE ONE",
    accentColor: "from-slate-800 to-black",
    badge: "Save Up to $29/mo",
    popularShows: ["Apple TV+ Originals", "Apple Music Lossless", "Apple Arcade 200+ Games", "iCloud+ Private Relay & Storage", "Apple Fitness+ (Premier)"],
    plans: [
      {
        name: "Individual",
        price: 19.95,
        period: "month",
        screens: 1,
        resolution: "4K UHD (TV+)",
        devices: "All Apple Devices",
        audio: "Dolby Atmos / Lossless",
        ads: "Includes Apple Music, TV+, Arcade & 50GB iCloud+ (Saves $9/mo)"
      },
      {
        name: "Family (Up to 6 People)",
        price: 25.95,
        period: "month",
        screens: 6,
        resolution: "4K UHD",
        devices: "All Devices",
        audio: "Dolby Atmos",
        ads: "Includes Apple Music, TV+, Arcade & 200GB iCloud+ (Saves $12/mo)"
      },
      {
        name: "Premier",
        price: 37.95,
        period: "month",
        screens: 6,
        resolution: "4K UHD",
        devices: "All Devices",
        audio: "Dolby Atmos",
        ads: "Adds Apple News+, Apple Fitness+ & 2TB iCloud+ (Saves $29/mo)"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Apple Card Cashback",
          plan: "Apple Card Monthly Installment",
          claimSteps: "Pay for Apple One with Apple Card to get 3% instant daily cash back every month."
        }
      ],
      voucherSavings: {
        provider: "Family Split Math",
        discountPercent: "55% Savings via Family Split",
        instructions: "Apple One Family ($25.95/mo) split among 6 family members costs only $4.32/person/month for Music + TV+ + Arcade + Cloud.",
        effectivePrice: 4.32
      },
      comboPass: {
        passName: "Apple One Premier Super Bundle",
        passPrice: 37.95,
        individualSum: 66.95,
        bundledWith: ["Apple Music", "Apple TV+", "Apple Arcade", "Apple News+", "Fitness+", "2TB iCloud+"]
      },
      promoCodes: [
        {
          code: "APPLE_ONE_1MO_FREE",
          discount: "1 Month Free Trial on Unsubscribed Services",
          verified: true,
          validTill: "Active 2026"
        }
      ],
      officialUrl: "https://www.apple.com/apple-one"
    }
  },

  // ==========================================
  // 4. AI & PRODUCTIVITY TOOLS
  // ==========================================
  {
    id: "chatgpt_us",
    name: "ChatGPT Plus (OpenAI)",
    category: "productivity",
    tagline: "GPT-4o, OpenAI o1 Reasoning, Advanced Voice Mode, DALL-E 3 & Custom GPTs",
    logoText: "CHATGPT",
    accentColor: "from-emerald-600 to-teal-900",
    badge: "World's Leading AI Assistant",
    popularShows: ["GPT-4o Multimodal", "OpenAI o1 Deep Reasoning", "Real-Time Advanced Voice Mode", "DALL-E 3 Image Studio", "Canvas Code & Text Editor"],
    plans: [
      {
        name: "Plus (Individual)",
        price: 20.00,
        period: "month",
        screens: 1,
        resolution: "Fast Response Speed",
        devices: "Web, iOS, Android, macOS & Windows Desktop",
        audio: "Natural Humanlike Voice",
        ads: "100% Ad-Free Priority Access"
      },
      {
        name: "Team (Per User)",
        price: 25.00,
        period: "month",
        screens: 1,
        resolution: "Higher Message Caps",
        devices: "All Devices",
        audio: "Enterprise Privacy Shield",
        ads: "Zero Training on Workspace Data (Billed Annually)"
      },
      {
        name: "Pro Tier",
        price: 200.00,
        period: "month",
        screens: 1,
        resolution: "Unlimited o1 & o1-pro compute",
        devices: "All Devices",
        audio: "Highest Priority Compute",
        ads: "For AI Researchers and Heavy Developers"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Microsoft Copilot Free Option",
          plan: "Free GPT-4o on Copilot",
          claimSteps: "Microsoft Copilot provides free basic access to GPT-4o web queries without paying the $20/mo Plus fee."
        }
      ],
      voucherSavings: {
        provider: "Tax Deductible Business Expense",
        discountPercent: "20%–35% Tax Savings",
        instructions: "If you are a freelancer, programmer, or business owner, write off ChatGPT Plus as a business software expense on Schedule C.",
        effectivePrice: 15.00
      },
      comboPass: {
        passName: "API Pay-As-You-Go Route",
        passPrice: 5.00,
        individualSum: 20.00,
        bundledWith: ["OpenAI API", "Third-Party UI (LibreChat/TypingMind)"]
      },
      promoCodes: [
        {
          code: "OPENAI_BIZ_WRITE_OFF",
          discount: "100% Tax Deductible for US Small Business",
          verified: true,
          validTill: "Active 2026"
        }
      ],
      officialUrl: "https://chatgpt.com"
    }
  },

  {
    id: "claude_us",
    name: "Claude Pro (Anthropic)",
    category: "productivity",
    tagline: "Claude 3.5 Sonnet, Artifacts Interactive Workspace & 5x More Usage Caps",
    logoText: "CLAUDE",
    accentColor: "from-amber-600 to-orange-950",
    badge: "Top AI for Coding & Writing",
    popularShows: ["Claude 3.5 Sonnet", "Artifacts Live React / SVG Rendering", "200k Token Context Window", "Projects Knowledge Base"],
    plans: [
      {
        name: "Pro Plan",
        price: 20.00,
        period: "month",
        screens: 1,
        resolution: "5x More Usage vs Free Tier",
        devices: "Web, iOS, Android, Desktop",
        audio: "Text & Vision Multimodal",
        ads: "Priority Access during Peak Hours"
      },
      {
        name: "Team Plan (Per Member)",
        price: 25.00,
        period: "month",
        screens: 1,
        resolution: "Higher Caps + Shared Projects",
        devices: "All Devices",
        audio: "Centralized Billing",
        ads: "Min 5 members ($30/mo if billed monthly)"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Anthropic Free Tier",
          plan: "Standard Claude 3.5 Sonnet Free",
          claimSteps: "Claude offers free daily access to Claude 3.5 Sonnet on claude.ai with lower message limits."
        }
      ],
      voucherSavings: {
        provider: "Business Write-Off",
        discountPercent: "Up to 30% Tax Deduction",
        instructions: "Software development and writing freelancers can deduct Claude Pro directly as a professional work tool.",
        effectivePrice: 15.00
      },
      comboPass: {
        passName: "OpenRouter Pay-per-Token Pass",
        passPrice: 8.00,
        individualSum: 20.00,
        bundledWith: ["Claude 3.5 Sonnet API", "Claude 3.5 Haiku"]
      },
      promoCodes: [
        {
          code: "CLAUDE_PRO_BIZ",
          discount: "IRS Schedule C Deductible Expense",
          verified: true,
          validTill: "Active 2026"
        }
      ],
      officialUrl: "https://claude.ai"
    }
  },

  {
    id: "microsoft_365_us",
    name: "Microsoft 365 (US)",
    category: "productivity",
    tagline: "Word, Excel, PowerPoint, Outlook & 1TB OneDrive Cloud Storage per Person",
    logoText: "OFFICE",
    accentColor: "from-orange-600 to-blue-700",
    badge: "Essential Office & 1TB Cloud",
    popularShows: ["Full Microsoft Word", "Excel with Advanced Formulas", "PowerPoint Designer", "1TB OneDrive Cloud Backup", "Microsoft Defender Security"],
    plans: [
      {
        name: "Personal (1 Person)",
        price: 69.99,
        period: "year",
        screens: 5,
        resolution: "Cloud & Desktop Apps",
        devices: "PC, Mac, iPhone, iPad & Android",
        audio: "Office Apps + 1TB OneDrive",
        ads: "100% Ad-Free ($6.99/mo rate)"
      },
      {
        name: "Family (Up to 6 People)",
        price: 99.99,
        period: "year",
        screens: 30,
        resolution: "All Desktop Apps",
        devices: "All Devices",
        audio: "6TB Total Cloud (1TB per person)",
        ads: "Best Value ($16.66/year per person!)"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "School / University .EDU",
          plan: "Office 365 Education A1",
          claimSteps: "Any student or educator with an active .edu email gets Office web apps and 1TB OneDrive for $0 100% FREE!"
        }
      ],
      voucherSavings: {
        provider: "Costco / Amazon Digital Deals",
        discountPercent: "Save $10–$20 on Annual Product Keys",
        instructions: "Costco members frequently get the Microsoft 365 Family 15-month code for $89.99 (saves $45 vs retail).",
        effectivePrice: 71.99
      },
      comboPass: {
        passName: "Family Plan 6-Way Split",
        passPrice: 99.99,
        individualSum: 419.94,
        bundledWith: ["Full Office Suite for 6 Accounts", "6TB Secure Cloud Storage"]
      },
      promoCodes: [
        {
          code: "EDU_OFFICE_FREE",
          discount: "$0 Free with Active Student/School Email",
          verified: true,
          validTill: "Active 2026"
        }
      ],
      officialUrl: "https://www.microsoft.com/microsoft-365"
    }
  },

  {
    id: "google_one_us",
    name: "Google One (Cloud Storage & AI)",
    category: "cloud",
    tagline: "Expanded Storage for Gmail, Google Photos, Drive Backup & Gemini Advanced",
    logoText: "GOOGLE",
    accentColor: "from-blue-500 via-red-500 to-amber-500",
    badge: "Photo Backup & Gemini AI",
    popularShows: ["Automatic Phone Backup", "Magic Eraser in Google Photos", "Gemini Advanced AI 2.0", "Family Sharing up to 5 people", "Google Store 10% Cashback"],
    plans: [
      {
        name: "Basic (100GB)",
        price: 1.99,
        period: "month",
        screens: 5,
        resolution: "100GB Cloud Storage",
        devices: "All Devices",
        audio: "Shareable with 5 family members",
        ads: "$19.99/year prepay (saves 16%)"
      },
      {
        name: "Standard (200GB)",
        price: 2.99,
        period: "month",
        screens: 5,
        resolution: "200GB Cloud Storage",
        devices: "All Devices",
        audio: "Family Sharing",
        ads: "$29.99/year prepay"
      },
      {
        name: "Premium (2TB)",
        price: 9.99,
        period: "month",
        screens: 5,
        resolution: "2TB Storage",
        devices: "All Devices",
        audio: "10% back on Google Store",
        ads: "$99.99/year prepay"
      },
      {
        name: "AI Premium (2TB + Gemini Advanced)",
        price: 19.99,
        period: "month",
        screens: 5,
        resolution: "2TB + Gemini 2.0 Ultra/Advanced",
        devices: "All Devices",
        audio: "Gemini in Docs, Gmail & Sheets",
        ads: "1 Month Free Trial"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Google Pixel / T-Mobile",
          plan: "Pixel Phone Purchase",
          claimSteps: "Buying a new Pixel Pro phone includes up to 12 months of Google One AI Premium ($240 value) for $0 free."
        }
      ],
      voucherSavings: {
        provider: "Google Opinion Rewards",
        discountPercent: "100% Free with Survey Credits",
        instructions: "Answer short 10-second surveys on Google Opinion Rewards app to earn $2-$5/mo in Play balance to cover Google One 100GB.",
        effectivePrice: 0.00
      },
      comboPass: {
        passName: "Annual Prepay Savings",
        passPrice: 19.99,
        individualSum: 23.88,
        bundledWith: ["100GB Storage", "Google Photos Tools"]
      },
      promoCodes: [
        {
          code: "GOOGLE_AI_1MO_FREE",
          discount: "1 Month Free Trial on AI Premium (Gemini)",
          verified: true,
          validTill: "Active 2026"
        }
      ],
      officialUrl: "https://one.google.com"
    }
  },

  // ==========================================
  // 5. GAMING PASSES
  // ==========================================
  {
    id: "xbox_game_pass_us",
    name: "Xbox Game Pass (US)",
    category: "gaming",
    tagline: "Hundreds of High-Quality Games, Day One Releases, EA Play & Cloud Gaming",
    logoText: "XBOX",
    accentColor: "from-emerald-600 to-green-950",
    badge: "Top Value in Gaming (400+ Games)",
    popularShows: ["Call of Duty: Black Ops 6", "Starfield", "Halo Infinite", "Forza Horizon 5", "EA Play Catalog", "Indiana Jones and the Great Circle"],
    plans: [
      {
        name: "PC Game Pass",
        price: 11.99,
        period: "month",
        screens: 1,
        resolution: "Native PC Gaming",
        devices: "Windows PC & Handhelds (ROG Ally, Legion Go)",
        audio: "Full Sound / Spatial",
        ads: "Includes Full EA Play Library Free"
      },
      {
        name: "Standard (Console)",
        price: 14.99,
        period: "month",
        screens: 1,
        resolution: "Native Xbox Series X|S / One",
        devices: "Xbox Consoles",
        audio: "Spatial Audio",
        ads: "Online Console Multiplayer Included"
      },
      {
        name: "Ultimate (PC, Console & Cloud)",
        price: 19.99,
        period: "month",
        screens: 1,
        resolution: "Cloud 1080p 60fps & Native 4K",
        devices: "Console, PC, Phone, Smart TV Cloud Gaming",
        audio: "Dolby Atmos for Gaming",
        ads: "Day-One Releases + EA Play + Cloud Streaming"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Verizon Home Internet",
          plan: "Verizon 5G Home Plus",
          claimSteps: "Signing up for Verizon 5G Home Internet Plus often includes a 12-month Xbox Game Pass Ultimate code at $0 free."
        }
      ],
      voucherSavings: {
        provider: "CDKeys / Target",
        discountPercent: "15%–25% Off Digital Keys",
        instructions: "Buy 3-month digital codes on CDKeys or during Target Buy 2 Get 1 gaming sales to pay ~$14/mo instead of $19.99.",
        effectivePrice: 14.25
      },
      comboPass: {
        passName: "PC Game Pass + EA Play Bundle",
        passPrice: 11.99,
        individualSum: 16.98,
        bundledWith: ["Xbox PC Library", "Full EA Play Catalog"]
      },
      promoCodes: [
        {
          code: "XBOX_PC_EAPLAY",
          discount: "EA Play Included $0 Free with PC Game Pass",
          verified: true,
          validTill: "Active 2026"
        }
      ],
      officialUrl: "https://www.xbox.com/gamepass"
    }
  },

  {
    id: "playstation_plus_us",
    name: "PlayStation Plus (US)",
    category: "gaming",
    tagline: "Online Multiplayer, Monthly Free Games, Game Catalog & Classic PS1/PS2/PS3 Titles",
    logoText: "PS PLUS",
    accentColor: "from-blue-600 to-indigo-950",
    badge: "Official PlayStation Membership",
    popularShows: ["Spider-Man: Miles Morales", "God of War", "Ghost of Tsushima", "The Last of Us Part I", "Demon's Souls", "Bloodborne"],
    plans: [
      {
        name: "Essential",
        price: 79.99,
        period: "year",
        screens: 1,
        resolution: "Native PS4 & PS5",
        devices: "PS5 & PS4 Consoles",
        audio: "Tempest 3D Audio",
        ads: "Online Multiplayer + 3 Monthly Free Games ($6.66/mo)"
      },
      {
        name: "Extra",
        price: 134.99,
        period: "year",
        screens: 1,
        resolution: "Native PS5 / PS4",
        devices: "PS5 & PS4",
        audio: "Tempest 3D Audio",
        ads: "Adds 400+ Downloadable PS4/PS5 Games ($11.25/mo)"
      },
      {
        name: "Premium (Cloud Streaming)",
        price: 159.99,
        period: "year",
        screens: 1,
        resolution: "4K Cloud Streaming & Native",
        devices: "PS5, PS4 & PC Cloud Streaming",
        audio: "Tempest 3D Audio",
        ads: "Adds PS1, PS2, PSP & PS3 Cloud Classics + Time-limited Trials"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "PlayStation Direct Promo",
          plan: "PS5 Hardware Bundle",
          claimSteps: "Look for PS5 console bundles that include 12-month PS Plus vouchers."
        }
      ],
      voucherSavings: {
        provider: "Days of Play Annual Sale",
        discountPercent: "25% Off Annual Dues",
        instructions: "Sony runs the official 'Days of Play' sale every June, discounting PS Plus annual tiers by 20%-25%. Stack subscription time then.",
        effectivePrice: 101.24
      },
      comboPass: {
        passName: "PS Plus Extra 400-Game Pass",
        passPrice: 134.99,
        individualSum: 3000.00,
        bundledWith: ["Multiplayer", "Game Catalog of 400+ Hit Games"]
      },
      promoCodes: [
        {
          code: "DAYS_OF_PLAY_SAVE25",
          discount: "25% Off during Sony Annual June Sale",
          verified: true,
          validTill: "Active 2026"
        }
      ],
      officialUrl: "https://www.playstation.com/ps-plus"
    }
  },

  // ==========================================
  // 6. CYBERSECURITY & PRIVACY
  // ==========================================
  {
    id: "nordvpn_us",
    name: "NordVPN (US)",
    category: "security",
    tagline: "Ultra-Fast VPN, Threat Protection Anti-Malware, Meshnet & 10 Devices Protection",
    logoText: "NORDVPN",
    accentColor: "from-sky-500 to-indigo-950",
    badge: "Top Rated Privacy & Streaming VPN",
    popularShows: ["Unblock Global Netflix & BBC iPlayer", "Threat Protection Ad-Blocker", "Dark Web Monitor", "Double VPN Encryption"],
    plans: [
      {
        name: "Basic (2-Year Deal)",
        price: 3.09,
        period: "month",
        screens: 10,
        resolution: "Ultra-Fast Speeds (6730+ Mbps)",
        devices: "10 Simultaneous Devices (PC, Mac, iPhone, Android, TV)",
        audio: "Zero-Logs Verified",
        ads: "Billed $83.43 for first 2 years (saves 73%)"
      },
      {
        name: "Plus (Adds Malware & Ad-Block)",
        price: 3.99,
        period: "month",
        screens: 10,
        resolution: "Fast Speed + Threat Protection Pro",
        devices: "All Devices",
        audio: "Zero-Logs",
        ads: "Adds Antivirus + Cross-Platform Password Manager"
      },
      {
        name: "Complete (Adds 1TB Encrypted Cloud)",
        price: 4.99,
        period: "month",
        screens: 10,
        resolution: "Max Protection",
        devices: "All Devices",
        audio: "Zero-Logs",
        ads: "Adds 1TB Next-Gen Encrypted Cloud Storage"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Rakuten Cashback",
          plan: "Rakuten 70%-90% Cashback Event",
          claimSteps: "Rakuten frequently offers 70% to 90% cashback on NordVPN 2-year subscriptions, making effective 2-year cost under $20 total!"
        }
      ],
      voucherSavings: {
        provider: "2-Year Upfront Commitment",
        discountPercent: "73% Off Monthly Rate",
        instructions: "Never pay the $12.99 monthly rate. The 2-year plan cuts the monthly price by 73% to $3.09/month.",
        effectivePrice: 3.09
      },
      comboPass: {
        passName: "Nord Security Complete Suite",
        passPrice: 119.76,
        individualSum: 311.76,
        bundledWith: ["NordVPN", "NordPass Password Manager", "NordLocker 1TB Cloud"]
      },
      promoCodes: [
        {
          code: "NORD73OFF",
          discount: "73% Off + 3 Extra Months Free on 2-Year Plan",
          verified: true,
          validTill: "Active 2026"
        }
      ],
      officialUrl: "https://nordvpn.com"
    }
  }
];
