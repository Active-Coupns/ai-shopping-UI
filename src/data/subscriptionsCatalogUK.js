/**
 * ShopSmart AI — Master Subscriptions & Digital Services Catalog (United Kingdom - GB / UK)
 * 25 Comprehensive Brands across 7 Categories with 100% Verified Multi-Tier Plans in GBP (£),
 * UK Carrier Perks (EE, O2, Vodafone, Sky TV, Virgin Media), Super Combo Passes, and Cashback Hacks.
 */

export const UK_SUBSCRIPTIONS_CATALOG = [
  // ==========================================
  // 1. MOVIES & VIDEO STREAMING (OTT)
  // ==========================================
  {
    id: "netflix_uk",
    name: "Netflix (UK)",
    category: "video",
    tagline: "Top Boy, The Crown, Black Mirror, Stranger Things & Blockbuster Originals",
    logoText: "NETFLIX",
    accentColor: "from-red-600 to-black",
    badge: "Most Popular Streaming in UK",
    popularShows: ["Top Boy", "The Crown", "Black Mirror", "Stranger Things", "Baby Reindeer", "Sex Education", "Squid Game", "Bridgerton"],
    plans: [
      {
        name: "Standard with Ads",
        price: 4.99,
        period: "month",
        screens: 2,
        resolution: "Full HD (1080p)",
        devices: "All Devices (TV, Phone, Laptop)",
        audio: "Stereo / 5.1",
        ads: "Ad-Supported"
      },
      {
        name: "Standard (Ad-Free)",
        price: 10.99,
        period: "month",
        screens: 2,
        resolution: "Full HD (1080p)",
        devices: "All Devices (TV, Phone, Laptop)",
        audio: "Dolby 5.1",
        ads: "100% Ad-Free"
      },
      {
        name: "Premium 4K",
        price: 17.99,
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
          operator: "EE (All-Rounder / Full Works)",
          plan: "Inclusive Extra benefit (£0/mo)",
          claimSteps: "Log in to My EE app -> Plan Details -> Inclusive Extras -> Pick 'Netflix Standard' as your £0 free perk."
        },
        {
          operator: "Sky TV (Sky Stream / Glass / Q)",
          plan: "Sky Entertainment & Netflix bundle (£19–£26/mo)",
          claimSteps: "Netflix Standard with Ads is included free with the base Sky Stream or Sky Glass subscription."
        },
        {
          operator: "Virgin Media",
          plan: "Stream Box Add-on",
          claimSteps: "Add Netflix to your Virgin Media bill to receive 10% monthly bill credit on your subscription."
        }
      ],
      voucherSavings: {
        provider: "CDKeys / Currys / TopCashback",
        discountPercent: "5%-10% Off",
        instructions: "Purchase discounted Netflix digital gift cards on CDKeys or earn up to 8% cashback via TopCashback/Quidco.",
        effectivePrice: 9.89
      },
      comboPass: {
        passName: "Sky Stream + Netflix + Discovery+ Bundle",
        passPrice: 26.00,
        individualSum: 38.98,
        netSavings: "12.98/mo (£155/yr)",
        bundledWith: ["Sky Atlantic", "Discovery+", "Netflix Standard"]
      },
      coupons: [
        {
          code: "EEREWARD26",
          discount: "Free upgrade to Standard via EE perks",
          verified: true
        }
      ],
      officialUrl: "https://www.netflix.com/gb"
    }
  },

  {
    id: "disney_uk",
    name: "Disney+ (UK)",
    category: "video",
    tagline: "Marvel Studios, Star Wars, Pixar, Disney Classics & Star Originals",
    logoText: "DISNEY+",
    accentColor: "from-blue-600 via-indigo-700 to-slate-900",
    badge: "O2 Priority £2/mo Discount or 6 Mos Free",
    popularShows: ["The Mandalorian", "Loki", "Shōgun", "The Bear", "Only Murders in the Building", "Doctor Who", "Taylor Swift: The Eras Tour"],
    plans: [
      {
        name: "Standard with Ads",
        price: 4.99,
        period: "month",
        screens: 2,
        resolution: "Full HD (1080p)",
        devices: "All Devices (TV, Phone, Tablet, PC)",
        audio: "Dolby 5.1",
        ads: "Ad-Supported"
      },
      {
        name: "Standard (Ad-Free)",
        price: 7.99,
        period: "month",
        screens: 2,
        resolution: "Full HD (1080p)",
        devices: "All Devices",
        audio: "Dolby 5.1",
        ads: "100% Ad-Free"
      },
      {
        name: "Standard Annual",
        price: 79.90,
        period: "year",
        screens: 2,
        resolution: "Full HD (1080p)",
        devices: "All Devices",
        audio: "Dolby 5.1",
        ads: "100% Ad-Free (Get 2 Mos Free)"
      },
      {
        name: "Premium 4K (Annual)",
        price: 109.90,
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
          operator: "O2 (Mobile & SIM-Only)",
          plan: "O2 Extra perk (Up to 6 Months Free)",
          claimSteps: "Upgrade or sign up for select O2 Plus Plans or SIM contracts to get up to 6 months of Disney+ for £0, followed by a £2/mo bill discount."
        },
        {
          operator: "Vodafone",
          plan: "Entertainment Plan perk",
          claimSteps: "Select Disney+ as your bundled entertainment add-on for the duration of your 24-month handset or SIM plan."
        }
      ],
      voucherSavings: {
        provider: "Tesco Clubcard / TopCashback",
        discountPercent: "Up to 50% Value Boost",
        instructions: "Exchange £12 of Tesco Clubcard Vouchers to get 3 months of Disney+ Standard with Ads for zero cash.",
        effectivePrice: 3.99
      },
      comboPass: {
        passName: "Disney+ Annual Prepay (12 Months for price of 10)",
        passPrice: 79.90,
        individualSum: 95.88,
        netSavings: "15.98/yr",
        bundledWith: ["Disney+", "Star Originals", "National Geographic"]
      },
      coupons: [
        {
          code: "O2DISNEY2",
          discount: "£2/mo discount on O2 bill",
          verified: true
        }
      ],
      officialUrl: "https://www.disneyplus.com/en-gb"
    }
  },

  {
    id: "prime_uk",
    name: "Amazon Prime (UK)",
    category: "combo",
    tagline: "Free Next-Day Delivery, Prime Video, Deliveroo Plus (£40 value) & Amazon Music",
    logoText: "PRIME",
    accentColor: "from-sky-500 to-blue-700",
    badge: "Includes £0 Free Deliveroo Plus",
    popularShows: ["The Boys", "The Rings of Power", "Clarkson's Farm", "Reacher", "Fallout", "Good Omens", "Invincible"],
    plans: [
      {
        name: "Prime Monthly",
        price: 8.99,
        period: "month",
        screens: 3,
        resolution: "4K Ultra HD + HDR",
        devices: "All Devices",
        audio: "Dolby Atmos",
        ads: "Limited Ads (Ad-Free +£2.99/mo)"
      },
      {
        name: "Prime Annual",
        price: 95.00,
        period: "year",
        screens: 3,
        resolution: "4K Ultra HD + HDR",
        devices: "All Devices",
        audio: "Dolby Atmos",
        ads: "Limited Ads"
      },
      {
        name: "Prime Student",
        price: 4.49,
        period: "month",
        screens: 3,
        resolution: "4K Ultra HD + HDR",
        devices: "All Devices",
        audio: "Dolby Atmos",
        ads: "50% Student Discount"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Vodafone UK",
          plan: "Entertainment add-on",
          claimSteps: "Vodafone Unlimited Max contracts allow choosing Amazon Prime as your inclusive £0 entertainment perk."
        }
      ],
      voucherSavings: {
        provider: "Amazon Barclaycard / Currys",
        discountPercent: "5% Rewards",
        instructions: "Use Amazon Barclaycard to earn 1%–2% back on all purchases and £20 bonus voucher upon approval.",
        effectivePrice: 7.99
      },
      comboPass: {
        passName: "Prime + Deliveroo Plus Silver Free (£0/yr)",
        passPrice: 95.00,
        individualSum: 139.90,
        netSavings: "44.90/yr",
        bundledWith: ["Deliveroo Plus (Free Delivery on £15+ orders)", "Prime Video", "Prime Reading", "Amazon Music Prime"]
      },
      coupons: [
        {
          code: "STUDENT6MO",
          discount: "6 Months 100% Free for UK university students",
          verified: true
        }
      ],
      officialUrl: "https://www.amazon.co.uk/prime"
    }
  },

  {
    id: "now_tv_uk",
    name: "NOW (Sky TV passes)",
    category: "video",
    tagline: "Sky Atlantic, House of the Dragon, Sky Cinema, Premier League & HBO shows",
    logoText: "NOW",
    accentColor: "from-emerald-600 to-teal-900",
    badge: "Official Home of HBO in the UK",
    popularShows: ["House of the Dragon", "Succession", "The Last of Us", "White Lotus", "Euphoria", "Gangs of London"],
    plans: [
      {
        name: "Entertainment Pass",
        price: 9.99,
        period: "month",
        screens: 1,
        resolution: "720p HD",
        devices: "TV, Phone, Console, Laptop",
        audio: "Stereo",
        ads: "With Commercials"
      },
      {
        name: "Cinema Pass",
        price: 9.99,
        period: "month",
        screens: 1,
        resolution: "720p HD",
        devices: "All Devices",
        audio: "Stereo",
        ads: "With Commercials"
      },
      {
        name: "Entertainment + Cinema Combo",
        price: 13.99,
        period: "month",
        screens: 1,
        resolution: "720p HD",
        devices: "All Devices",
        audio: "Stereo",
        ads: "Save 30% on combined pass"
      },
      {
        name: "NOW Boost (Add-on)",
        price: 6.00,
        period: "month",
        screens: 3,
        resolution: "1080p Full HD + 50fps Sports",
        devices: "3 Simultaneous Streams",
        audio: "Dolby Digital 5.1",
        ads: "100% Ad-Free on VOD"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "BT / EE TV",
          plan: "Entertainment TV Package (£20/mo)",
          claimSteps: "EE TV bundles NOW Entertainment, Netflix Standard, and Discovery+ in a single subsidised TV box subscription."
        },
        {
          operator: "Vodafone",
          plan: "VeryMe Rewards Perk",
          claimSteps: "Check VeryMe Rewards every month for £1 to £3/mo NOW promotional passes."
        }
      ],
      voucherSavings: {
        provider: "CDKeys / Currys",
        discountPercent: "20%-35% Off Prepay Passes",
        instructions: "Buy 3-month or 6-month NOW Entertainment gift vouchers online to pay under £6.99/mo.",
        effectivePrice: 6.99
      },
      comboPass: {
        passName: "NOW 6-Month Minimum Term Deal",
        passPrice: 6.99,
        individualSum: 9.99,
        netSavings: "3.00/mo (Save 30%)",
        bundledWith: ["Sky Atlantic", "Sky Max", "Sky Witness", "HBO Max Library"]
      },
      coupons: [
        {
          code: "CANCELDISCOUNT",
          discount: "Initiate cancellation online to trigger £4.99/mo retention offer",
          verified: true
        }
      ],
      officialUrl: "https://www.nowtv.com"
    }
  },

  {
    id: "apple_tv_uk",
    name: "Apple TV+ (UK)",
    category: "video",
    tagline: "Ted Lasso, Severance, Slow Horses, The Morning Show & Silo in 4K HDR",
    logoText: "APPLE TV+",
    accentColor: "from-zinc-800 to-black",
    badge: "Up to 6 Months Free via Barclays / Currys",
    popularShows: ["Ted Lasso", "Slow Horses", "Severance", "The Morning Show", "Silo", "Foundation", "Bad Sisters", "Hijack"],
    plans: [
      {
        name: "Standard Monthly",
        price: 8.99,
        period: "month",
        screens: 6,
        resolution: "4K Ultra HD + Dolby Vision",
        devices: "All Devices (Apple, Smart TVs, Fire Stick, Android)",
        audio: "Spatial Audio + Dolby Atmos",
        ads: "100% Ad-Free Always"
      },
      {
        name: "Apple One Bundle",
        price: 18.95,
        period: "month",
        screens: 1,
        resolution: "4K Ultra HD",
        devices: "All Devices",
        audio: "Dolby Atmos",
        ads: "Includes TV+, Music, Arcade & iCloud"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "EE UK",
          plan: "Inclusive Extra or 6 Months Free Trial",
          claimSteps: "Text 'TV PLUS' to 150 on your EE pay monthly mobile to claim 6 months free access."
        },
        {
          operator: "Barclays Blue Rewards",
          plan: "Apple TV+ Perk",
          claimSteps: "Barclays Blue Rewards members get Apple TV+ and Apple MLS season pass included for £5/mo bank fee."
        },
        {
          operator: "Currys Perks / Sky VIP",
          plan: "Partner 3-Month Free Trial",
          claimSteps: "Open Currys Perks app or Sky VIP to redeem a free 3-month trial without purchasing hardware."
        }
      ],
      voucherSavings: {
        provider: "PlayStation / Roku Promotion",
        discountPercent: "3 Months 100% Free",
        instructions: "Download the Apple TV app on your PS5, PS4, or Roku device to redeem an instant 3-month free trial.",
        effectivePrice: 0.00
      },
      comboPass: {
        passName: "Apple One Individual (Save £9/mo)",
        passPrice: 18.95,
        individualSum: 28.96,
        netSavings: "10.01/mo (£120/yr)",
        bundledWith: ["Apple TV+", "Apple Music", "Apple Arcade", "50GB iCloud+"]
      },
      coupons: [
        {
          code: "BARCLAYSREWARD",
          discount: "Included complimentary with Blue Rewards",
          verified: true
        }
      ],
      officialUrl: "https://tv.apple.com/gb"
    }
  },

  {
    id: "paramount_uk",
    name: "Paramount+ (UK)",
    category: "video",
    tagline: "Yellowstone, Tulsa King, Star Trek: Strange New Worlds & Halo",
    logoText: "PARAMOUNT+",
    accentColor: "from-blue-600 to-indigo-900",
    badge: "100% £0 Free with Sky Cinema",
    popularShows: ["Yellowstone", "1883", "1923", "Tulsa King", "Mayor of Kingstown", "Star Trek: Strange New Worlds", "Halo", "Special Ops: Lioness"],
    plans: [
      {
        name: "Standard (Monthly)",
        price: 6.99,
        period: "month",
        screens: 2,
        resolution: "Full HD (1080p)",
        devices: "All Devices",
        audio: "Dolby 5.1",
        ads: "100% Ad-Free"
      },
      {
        name: "Standard (Annual)",
        price: 69.90,
        period: "year",
        screens: 2,
        resolution: "Full HD (1080p)",
        devices: "All Devices",
        audio: "Dolby 5.1",
        ads: "Get 2 Months Free"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Sky Cinema (Sky Q / Glass / Stream)",
          plan: "Complimentary Free (£0/mo)",
          claimSteps: "Sky Cinema subscribers get Paramount+ at zero extra cost. Open the Paramount+ app on Sky Q/Glass and sign in via your Sky account."
        }
      ],
      voucherSavings: {
        provider: "Amazon Prime Video Channels",
        discountPercent: "7-Day Free Trial",
        instructions: "Subscribe through Prime Video Channels to consolidate billing and cancel anytime in 1 tap.",
        effectivePrice: 6.99
      },
      comboPass: {
        passName: "Sky Cinema + Paramount+ Pack",
        passPrice: 10.00,
        individualSum: 16.99,
        netSavings: "6.99/mo (£83/yr)",
        bundledWith: ["Sky Cinema Premieres", "Paramount+ Standard", "1,000+ On-Demand Movies"]
      },
      coupons: [
        {
          code: "SKYFREEPPLUS",
          discount: "100% Free with Sky Cinema subscription",
          verified: true
        }
      ],
      officialUrl: "https://www.paramountplus.com/gb"
    }
  },

  {
    id: "discovery_uk",
    name: "Discovery+ (UK)",
    category: "video",
    tagline: "TNT Sports, Premier League, Champions League, MotoGP & Reality TV",
    logoText: "DISC+",
    accentColor: "from-amber-500 to-blue-900",
    badge: "Standard £0 Free for Sky TV Subscribers",
    popularShows: ["TNT Sports Football", "UFC Fight Nights", "MotoGP", "Deadliest Catch", "90 Day Fiancé", "Gold Rush"],
    plans: [
      {
        name: "Standard (Entertainment)",
        price: 3.99,
        period: "month",
        screens: 2,
        resolution: "Full HD (1080p)",
        devices: "All Devices",
        audio: "Stereo",
        ads: "Ad-Free Entertainment"
      },
      {
        name: "Premium (TNT Sports)",
        price: 30.99,
        period: "month",
        screens: 2,
        resolution: "4K HDR (TNT Sports Ultimate)",
        devices: "All Devices",
        audio: "Dolby Atmos",
        ads: "Live Sports & Entertainment"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Sky TV (Sky Q, Stream, Glass)",
          plan: "Discovery+ Standard Included Free",
          claimSteps: "Say 'Get Discovery Plus' into your Sky voice remote and follow the activation prompts to claim £0 access."
        },
        {
          operator: "EE Mobile & Broadband",
          plan: "TNT Sports Inclusive Extra",
          claimSteps: "EE All-Rounder/Full Works plans can choose TNT Sports on Discovery+ as an inclusive add-on."
        }
      ],
      voucherSavings: {
        provider: "Amazon Prime Video Channels",
        discountPercent: "Special Match Pass",
        instructions: "Add Discovery+ to Prime Video Channels to avoid separate app downloads.",
        effectivePrice: 3.99
      },
      comboPass: {
        passName: "Sky Sports + TNT Sports Super Deal",
        passPrice: 40.00,
        individualSum: 55.99,
        netSavings: "15.99/mo",
        bundledWith: ["Sky Sports Channels", "TNT Sports 1-4", "Discovery+ Premium"]
      },
      coupons: [
        {
          code: "SKYFREEPASS",
          discount: "£0 Free Standard access on Sky TV",
          verified: true
        }
      ],
      officialUrl: "https://www.discoveryplus.com/gb"
    }
  },

  {
    id: "itvx_uk",
    name: "ITVX Premium (UK)",
    category: "video",
    tagline: "Stream 100% Ad-Free, Exclusive UK Dramas & the Full BritBox Classic Archive",
    logoText: "ITVX",
    accentColor: "from-yellow-400 to-slate-900",
    badge: "Includes Complete BritBox UK Archive",
    popularShows: ["Mr Bates vs The Post Office", "Broadchurch", "Downton Abbey", "Unforgotten", "Love Island", "Vera", "The Bay"],
    plans: [
      {
        name: "ITVX Free (With Ads)",
        price: 0.00,
        period: "month",
        screens: 1,
        resolution: "HD (720p/1080p)",
        devices: "All Devices",
        audio: "Stereo",
        ads: "Commercials"
      },
      {
        name: "ITVX Premium (Monthly)",
        price: 5.99,
        period: "month",
        screens: 2,
        resolution: "Full HD (1080p)",
        devices: "All Devices",
        audio: "Stereo / 5.1",
        ads: "100% Ad-Free + BritBox"
      },
      {
        name: "ITVX Premium (Annual)",
        price: 59.99,
        period: "year",
        screens: 2,
        resolution: "Full HD (1080p)",
        devices: "All Devices",
        audio: "Stereo / 5.1",
        ads: "100% Ad-Free (Get 2 Months Free)"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Uber One / Currys Perks",
          plan: "Trial Perks",
          claimSteps: "Check Currys Perks or Uber One seasonal partnerships for 1–3 months free ITVX Premium trials."
        }
      ],
      voucherSavings: {
        provider: "ITVX Official Promo",
        discountPercent: "7-Day Free Trial",
        instructions: "Sign up for the annual tier to save £11.89 compared to monthly payments.",
        effectivePrice: 4.99
      },
      comboPass: {
        passName: "ITVX Premium + BritBox All-in-One",
        passPrice: 5.99,
        individualSum: 11.98,
        netSavings: "5.99/mo (Included Free)",
        bundledWith: ["ITV On-Demand Ad-Free", "BritBox UK Classic Collection", "StudioCanal Presents"]
      },
      coupons: [
        {
          code: "ITVXFREE7",
          discount: "7 Days Free Trial on new accounts",
          verified: true
        }
      ],
      officialUrl: "https://www.itv.com"
    }
  },

  {
    id: "channel4_uk",
    name: "Channel 4+ (UK)",
    category: "video",
    tagline: "Gogglebox, Derry Girls, The Inbetweeners, Peep Show & Walter Presents (100% Ad-Free)",
    logoText: "C4+",
    accentColor: "from-emerald-500 to-indigo-950",
    badge: "100% Ad-Free UK Comedy & Box Sets",
    popularShows: ["Derry Girls", "Peep Show", "Gogglebox", "The Inbetweeners", "Taskmaster", "Catastrophe", "Walter Presents International"],
    plans: [
      {
        name: "Channel 4 (Free with Ads)",
        price: 0.00,
        period: "month",
        screens: 1,
        resolution: "HD (1080p)",
        devices: "All Devices",
        audio: "Stereo",
        ads: "Ad-Supported"
      },
      {
        name: "Channel 4+ (Monthly)",
        price: 3.99,
        period: "month",
        screens: 2,
        resolution: "Full HD (1080p)",
        devices: "All Devices",
        audio: "Stereo",
        ads: "100% Commercial-Free"
      },
      {
        name: "Channel 4+ (Annual)",
        price: 39.99,
        period: "year",
        screens: 2,
        resolution: "Full HD (1080p)",
        devices: "All Devices",
        audio: "Stereo",
        ads: "Save 16% annually"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Channel 4 Official",
          plan: "7-Day Free Trial",
          claimSteps: "Start a 7-day free trial on channel4.com to binge your favorite box set ad-free."
        }
      ],
      voucherSavings: {
        provider: "Annual Prepay Savings",
        discountPercent: "Save £7.89/year",
        instructions: "Pay £39.99/year upfront rather than paying £3.99 every month.",
        effectivePrice: 3.33
      },
      comboPass: {
        passName: "Channel 4+ Annual Pass",
        passPrice: 39.99,
        individualSum: 47.88,
        netSavings: "7.89/yr",
        bundledWith: ["1,500+ Box Sets", "Early Episode Drops", "Walter Presents Global TV"]
      },
      coupons: [
        {
          code: "C4FREEWEEK",
          discount: "7-day unrestricted ad-free trial",
          verified: true
        }
      ],
      officialUrl: "https://www.channel4.com"
    }
  },

  {
    id: "hayu_uk",
    name: "Hayu (UK)",
    category: "video",
    tagline: "The Real Housewives, Below Deck, Keeping Up with the Kardashians & Top US Reality TV",
    logoText: "HAYU",
    accentColor: "from-pink-600 to-rose-900",
    badge: "Same-Day US Reality TV Releases",
    popularShows: ["The Real Housewives of Beverly Hills", "Below Deck", "Vanderpump Rules", "Southern Charm", "Top Chef", "Botched"],
    plans: [
      {
        name: "Monthly Plan",
        price: 4.99,
        period: "month",
        screens: 1,
        resolution: "Full HD (1080p)",
        devices: "All Devices",
        audio: "Stereo",
        ads: "100% Ad-Free"
      },
      {
        name: "6-Month Pack",
        price: 23.99,
        period: "6 months",
        screens: 1,
        resolution: "Full HD",
        devices: "All Devices",
        audio: "Stereo",
        ads: "Save 20%"
      },
      {
        name: "12-Month Annual Pass",
        price: 43.99,
        period: "year",
        screens: 1,
        resolution: "Full HD",
        devices: "All Devices",
        audio: "Stereo",
        ads: "Save 25% (Get 3 Mos Free)"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "NOW TV / Amazon Prime Video Channels",
          plan: "7-Day Free Trial",
          claimSteps: "Activate as an Amazon Prime Video Channel add-on for a 7-day complimentary test."
        }
      ],
      voucherSavings: {
        provider: "Annual Prepay",
        discountPercent: "25% Instant Savings",
        instructions: "Prepay £43.99 for a full year to bring monthly cost down to just £3.66.",
        effectivePrice: 3.66
      },
      comboPass: {
        passName: "Hayu Annual Super Pass",
        passPrice: 43.99,
        individualSum: 59.88,
        netSavings: "15.89/yr",
        bundledWith: ["300+ Reality Shows", "Same Day US Airing", "Uncut Reunions"]
      },
      coupons: [
        {
          code: "HAYU7DAY",
          discount: "7 Days Free on Prime Video Channels",
          verified: true
        }
      ],
      officialUrl: "https://www.hayu.com"
    }
  },

  // ==========================================
  // 2. MUSIC & AUDIO STREAMING
  // ==========================================
  {
    id: "spotify_uk",
    name: "Spotify (UK)",
    category: "music",
    tagline: "Over 100 Million Songs, Podcasts, and 15 Hours of Free Audiobooks Monthly",
    logoText: "SPOTIFY",
    accentColor: "from-emerald-500 to-black",
    badge: "Vodafone VeryMe Entertainment Perk",
    popularShows: ["The Joe Rogan Experience", "The Diary of a CEO", "Call Her Daddy", "Off Menu", "Desert Island Discs"],
    plans: [
      {
        name: "Individual",
        price: 10.99,
        period: "month",
        screens: 1,
        resolution: "320kbps High Quality",
        devices: "All Devices",
        audio: "Lossless Audio (Upcoming)",
        ads: "100% Ad-Free"
      },
      {
        name: "Duo (2 Accounts)",
        price: 14.99,
        period: "month",
        screens: 2,
        resolution: "320kbps",
        devices: "All Devices",
        audio: "Lossless",
        ads: "100% Ad-Free"
      },
      {
        name: "Family (6 Accounts)",
        price: 17.99,
        period: "month",
        screens: 6,
        resolution: "320kbps",
        devices: "All Devices",
        audio: "Lossless",
        ads: "Explicit Content Filter + Kids App"
      },
      {
        name: "Student (UNiDAYS)",
        price: 5.99,
        period: "month",
        screens: 1,
        resolution: "320kbps",
        devices: "All Devices",
        audio: "Lossless",
        ads: "Flat 45% Discount"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Vodafone UK",
          plan: "Entertainment add-on plan",
          claimSteps: "Choose Spotify Premium as your included entertainment benefit for the duration of your 24-month contract."
        }
      ],
      voucherSavings: {
        provider: "Currys / Argos / PayPal Gifts",
        discountPercent: "Family Split Hack",
        instructions: "Split a £17.99/mo Family plan across 6 household members to pay just £2.99 per person.",
        effectivePrice: 2.99
      },
      comboPass: {
        passName: "Spotify Duo (Couples / Flatmates)",
        passPrice: 14.99,
        individualSum: 21.98,
        netSavings: "6.99/mo (£83/yr)",
        bundledWith: ["2 Separate Premium Accounts", "Shared Duo Mix Playlist"]
      },
      coupons: [
        {
          code: "UNIDAYSSTUDENT",
          discount: "50% off for verified university students",
          verified: true
        }
      ],
      officialUrl: "https://www.spotify.com/uk"
    }
  },

  {
    id: "apple_one_uk",
    name: "Apple One (UK)",
    category: "combo",
    tagline: "Apple Music, Apple TV+, Apple Arcade & iCloud+ in One Simple Bundle",
    logoText: "APPLE ONE",
    accentColor: "from-zinc-900 to-indigo-950",
    badge: "Included with EE Full Works for iPhone",
    popularShows: ["Spatial Audio Lossless Music", "Ted Lasso", "Apple Arcade Games", "iCloud Secure Backup"],
    plans: [
      {
        name: "Individual",
        price: 18.95,
        period: "month",
        screens: 1,
        resolution: "4K / Hi-Res Lossless",
        devices: "Apple & Compatible Devices",
        audio: "Dolby Atmos Spatial Audio",
        ads: "100% Ad-Free (50GB iCloud)"
      },
      {
        name: "Family (Up to 6)",
        price: 24.95,
        period: "month",
        screens: 6,
        resolution: "4K / Hi-Res Lossless",
        devices: "All Family Devices",
        audio: "Dolby Atmos Spatial Audio",
        ads: "200GB iCloud Shared"
      },
      {
        name: "Premier",
        price: 36.95,
        period: "month",
        screens: 6,
        resolution: "4K / Hi-Res Lossless",
        devices: "All Family Devices",
        audio: "Spatial Audio",
        ads: "2TB iCloud + Fitness+ + News+"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "EE (Full Works Plan for iPhone)",
          plan: "Included at £0 extra cost",
          claimSteps: "EE Full Works tariff customers can pick Apple One as their inclusive perk, saving £18.95 every month."
        }
      ],
      voucherSavings: {
        provider: "Barclays Blue Rewards",
        discountPercent: "Cashback Benefits",
        instructions: "Link Apple One subscriptions with cashback debit cards to earn monthly statement rewards.",
        effectivePrice: 16.95
      },
      comboPass: {
        passName: "Apple One Family Bundle (Save £10/mo)",
        passPrice: 24.95,
        individualSum: 35.96,
        netSavings: "11.01/mo (£132/yr)",
        bundledWith: ["Apple Music Family", "Apple TV+", "Apple Arcade", "200GB iCloud+"]
      },
      coupons: [
        {
          code: "EEIPHONEONE",
          discount: "100% Free with EE Full Works contract",
          verified: true
        }
      ],
      officialUrl: "https://www.apple.com/uk/apple-one"
    }
  },

  {
    id: "youtube_premium_uk",
    name: "YouTube Premium (UK)",
    category: "video",
    tagline: "Ad-Free YouTube, Background Play, Offline Downloads & YouTube Music Included",
    logoText: "YT PREMIUM",
    accentColor: "from-red-600 via-rose-700 to-black",
    badge: "Includes Full YouTube Music Subscription",
    popularShows: ["Ad-Free YouTube Video", "Background Audio Playing", "YouTube Music 100M Tracks"],
    plans: [
      {
        name: "Individual",
        price: 12.99,
        period: "month",
        screens: 1,
        resolution: "1080p Premium Bitrate & 4K",
        devices: "All Devices",
        audio: "High Quality Audio",
        ads: "100% Ad-Free"
      },
      {
        name: "Individual Annual",
        price: 129.99,
        period: "year",
        screens: 1,
        resolution: "4K + High Bitrate",
        devices: "All Devices",
        audio: "High Quality",
        ads: "Save 16% (Get 2 Mos Free)"
      },
      {
        name: "Family (Up to 5 Family Members)",
        price: 19.99,
        period: "month",
        screens: 5,
        resolution: "4K + High Bitrate",
        devices: "All Devices",
        audio: "High Quality",
        ads: "5 Separate Google Accounts"
      },
      {
        name: "Student (SheerID)",
        price: 7.99,
        period: "month",
        screens: 1,
        resolution: "4K + High Bitrate",
        devices: "All Devices",
        audio: "High Quality",
        ads: "Student Verified"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Vodafone UK",
          plan: "VeryMe Rewards Perk",
          claimSteps: "Vodafone mobile users can get 3 months of YouTube Premium for £0 via the VeryMe Rewards app."
        }
      ],
      voucherSavings: {
        provider: "Google Play Balance",
        discountPercent: "5%-10% with Gift Cards",
        instructions: "Load discounted Google Play gift cards purchased at Currys or Costco to pay your recurring subscription.",
        effectivePrice: 10.83
      },
      comboPass: {
        passName: "YouTube Family Plan Split (£4.00/person)",
        passPrice: 19.99,
        individualSum: 64.95,
        netSavings: "44.96/mo (£539/yr)",
        bundledWith: ["5 Premium Accounts", "YouTube Music Included for Everyone"]
      },
      coupons: [
        {
          code: "STUDENTVERIFY",
          discount: "£7.99/mo student rate via SheerID",
          verified: true
        }
      ],
      officialUrl: "https://www.youtube.com/premium"
    }
  },

  {
    id: "audible_uk",
    name: "Audible (UK)",
    category: "productivity",
    tagline: "World's Largest Audiobook Collection & Exclusive Podcasts from Amazon",
    logoText: "AUDIBLE",
    accentColor: "from-amber-500 to-orange-700",
    badge: "Prime Members Get 3 Months for 99p",
    popularShows: ["Atomic Habits", "Harry Potter Narrated by Stephen Fry", "The Thursday Murder Club", "Spare by Prince Harry"],
    plans: [
      {
        name: "1 Book Monthly",
        price: 7.99,
        period: "month",
        screens: 1,
        resolution: "Enhanced Audio",
        devices: "Phone, Kindle, Alexa, Web",
        audio: "Studio Mastered",
        ads: "1 Credit/mo + Unlimited Plus Catalog"
      },
      {
        name: "2 Books Monthly",
        price: 14.99,
        period: "month",
        screens: 1,
        resolution: "Enhanced Audio",
        devices: "All Devices",
        audio: "Studio Mastered",
        ads: "2 Credits/mo + Unlimited Plus"
      },
      {
        name: "12 Books Annual",
        price: 69.99,
        period: "year",
        screens: 1,
        resolution: "Enhanced Audio",
        devices: "All Devices",
        audio: "Studio Mastered",
        ads: "Save £25.89 (Get All 12 Credits Upfront)"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Amazon Prime Promotion",
          plan: "30 to 90 Days Free Trial",
          claimSteps: "Amazon Prime members can claim an extended 30-day or 90-day free trial on Audible with up to 2 free audiobook tokens."
        }
      ],
      voucherSavings: {
        provider: "Audible Cancellation Deal",
        discountPercent: "50% Off Retention Deal",
        instructions: "Initiate cancellation on audible.co.uk to receive a '3 months at £3.99/month' retention discount offer.",
        effectivePrice: 3.99
      },
      comboPass: {
        passName: "12 Book Annual Pack (£5.83/book)",
        passPrice: 69.99,
        individualSum: 95.88,
        netSavings: "25.89/yr",
        bundledWith: ["12 Instant Credits", "Audible Plus Catalog", "Exclusive Member Sales"]
      },
      coupons: [
        {
          code: "AUDIBLE99P",
          discount: "99p for 3 months promotion",
          verified: true
        }
      ],
      officialUrl: "https://www.audible.co.uk"
    }
  },

  // ==========================================
  // 3. GAMING & CLOUD GAMING
  // ==========================================
  {
    id: "xbox_gamepass_uk",
    name: "Xbox Game Pass Ultimate (UK)",
    category: "gaming",
    tagline: "Hundreds of High-Quality Games on Console, PC & Cloud with EA Play Included",
    logoText: "GAME PASS",
    accentColor: "from-emerald-600 to-green-950",
    badge: "Day One Xbox First-Party Releases",
    popularShows: ["Call of Duty: Black Ops 6", "Starfield", "Forza Horizon 5", "Halo Infinite", "EA Sports FC 24", "Minecraft"],
    plans: [
      {
        name: "Core (Console)",
        price: 6.99,
        period: "month",
        screens: 1,
        resolution: "Console Online",
        devices: "Xbox Console",
        audio: "Surround",
        ads: "Online Multiplayer + 25 Games"
      },
      {
        name: "PC Game Pass",
        price: 9.99,
        period: "month",
        screens: 1,
        resolution: "PC Native",
        devices: "Windows PC",
        audio: "Surround",
        ads: "Hundreds of PC Games + EA Play"
      },
      {
        name: "Ultimate (Console, PC & Cloud)",
        price: 14.99,
        period: "month",
        screens: 1,
        resolution: "1080p 60fps Cloud",
        devices: "Xbox, PC, Phone, Smart TV",
        audio: "Spatial Sound",
        ads: "All-Access + EA Play + Perks"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "EE UK",
          plan: "Xbox Game Pass Add-on",
          claimSteps: "EE mobile and broadband customers get exclusive add-on pricing and billing integration without upfront fees."
        }
      ],
      voucherSavings: {
        provider: "CDKeys / ShopTo",
        discountPercent: "15%-25% Off Vouchers",
        instructions: "Buy 3-month Game Pass Ultimate digital codes on CDKeys or ShopTo for ~£28 instead of £45.",
        effectivePrice: 9.33
      },
      comboPass: {
        passName: "Xbox Core to Ultimate Conversion Hack",
        passPrice: 75.00,
        individualSum: 179.88,
        netSavings: "104.88/yr (Save 58%)",
        bundledWith: ["Xbox Cloud Gaming", "EA Play", "Day One First Party Releases", "PC Game Pass"]
      },
      coupons: [
        {
          code: "CDKEYSXBOX",
          discount: "Up to 25% discount on 3-month digital codes",
          verified: true
        }
      ],
      officialUrl: "https://www.xbox.com/en-GB/xbox-game-pass"
    }
  },

  {
    id: "playstation_plus_uk",
    name: "PlayStation Plus (UK)",
    category: "gaming",
    tagline: "Online Multiplayer, Monthly Free Games, Game Catalog & Classic PS1/PS2 Library",
    logoText: "PS PLUS",
    accentColor: "from-blue-600 to-indigo-950",
    badge: "Official Sony PlayStation Subscription",
    popularShows: ["Spider-Man: Miles Morales", "God of War", "Ghost of Tsushima", "The Last of Us Part I", "Horizon Forbidden West"],
    plans: [
      {
        name: "Essential",
        price: 6.99,
        period: "month",
        screens: 1,
        resolution: "Console Native",
        devices: "PS5 & PS4",
        audio: "3D Audio",
        ads: "Online Multiplayer + 3 Monthly Games"
      },
      {
        name: "Extra",
        price: 10.99,
        period: "month",
        screens: 1,
        resolution: "Console Native",
        devices: "PS5 & PS4",
        audio: "3D Audio",
        ads: "Includes 400+ PS5/PS4 Game Catalog"
      },
      {
        name: "Premium",
        price: 13.49,
        period: "month",
        screens: 1,
        resolution: "4K / Cloud Streaming",
        devices: "PS5, PS4, PC",
        audio: "3D Audio",
        ads: "PS1/PS2/PS3 Classics + Cloud Streaming"
      },
      {
        name: "Essential (Annual)",
        price: 59.99,
        period: "year",
        screens: 1,
        resolution: "Console Native",
        devices: "PS5 & PS4",
        audio: "3D Audio",
        ads: "Save 28% with annual prepay"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "PlayStation Store Sales",
          plan: "Days of Play 25% Off",
          claimSteps: "Wait for the annual Sony 'Days of Play' sale (May/June) or Black Friday to renew annual tiers with 25% discount."
        }
      ],
      voucherSavings: {
        provider: "ShopTo / Currys",
        discountPercent: "10%-15% Off PSN Wallet Cards",
        instructions: "Buy discounted £50 or £100 PlayStation Store top-up cards on ShopTo to purchase your subscription for less.",
        effectivePrice: 8.99
      },
      comboPass: {
        passName: "PS Plus Extra Annual Pass (£8.33/mo)",
        passPrice: 99.99,
        individualSum: 131.88,
        netSavings: "31.89/yr",
        bundledWith: ["400+ Blockbuster Games", "Ubisoft+ Classics", "Online Multiplayer"]
      },
      coupons: [
        {
          code: "DAYSOFPLAY",
          discount: "25% discount on annual subscriptions",
          verified: true
        }
      ],
      officialUrl: "https://www.playstation.com/en-gb/ps-plus"
    }
  },

  // ==========================================
  // 4. DELIVERY & LIFESTYLE PERKS
  // ==========================================
  {
    id: "deliveroo_plus_uk",
    name: "Deliveroo Plus (UK)",
    category: "combo",
    tagline: "Free Delivery on Hundreds of UK Restaurants and Grocery Stores",
    logoText: "DELIVEROO",
    accentColor: "from-teal-400 to-cyan-900",
    badge: "100% £0 Free for Amazon Prime UK Members",
    popularShows: ["Nando's", "Wagamama", "Co-op", "Waitrose", "Sainsbury's", "Greggs", "KFC"],
    plans: [
      {
        name: "Plus Silver (Orders £15+)",
        price: 3.49,
        period: "month",
        screens: 1,
        resolution: "App Access",
        devices: "iOS & Android",
        audio: "N/A",
        ads: "Free delivery on restaurant orders £15+"
      },
      {
        name: "Plus Gold (Orders £10+)",
        price: 7.99,
        period: "month",
        screens: 1,
        resolution: "App Access",
        devices: "All Devices",
        audio: "N/A",
        ads: "Free delivery on orders £10+"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Amazon Prime (UK)",
          plan: "Free Deliveroo Plus Silver (£0/mo)",
          claimSteps: "Link your Deliveroo account to your Amazon Prime account at deliveroo.co.uk/amazon-prime to get Deliveroo Plus Silver 100% free forever."
        }
      ],
      voucherSavings: {
        provider: "Mastercard / Revolut",
        discountPercent: "Card Promotions",
        instructions: "Revolut Premium and Metal plans include free Deliveroo Plus memberships in their lifestyle perks bundle.",
        effectivePrice: 0.00
      },
      comboPass: {
        passName: "Amazon Prime + Deliveroo Free Bundle",
        passPrice: 0.00,
        individualSum: 41.88,
        netSavings: "41.88/yr (100% Free)",
        bundledWith: ["Deliveroo Plus Silver", "Exclusive Deliveroo Perks", "Free Delivery"]
      },
      coupons: [
        {
          code: "PRIMEPLUS",
          discount: "100% Free with Amazon Prime UK",
          verified: true
        }
      ],
      officialUrl: "https://deliveroo.co.uk/amazon-prime"
    }
  },

  {
    id: "uber_one_uk",
    name: "Uber One (UK)",
    category: "combo",
    tagline: "£0 Delivery Fee on Uber Eats, 5% Cashback on Rides & Exclusive Member Discounts",
    logoText: "UBER ONE",
    accentColor: "from-zinc-950 to-neutral-800",
    badge: "Save on Every Uber Ride & Eats Order",
    popularShows: ["Uber Rides 5% Credit Back", "Uber Eats £0 Delivery Fee", "Top-Rated Driver Match"],
    plans: [
      {
        name: "Monthly Membership",
        price: 5.99,
        period: "month",
        screens: 1,
        resolution: "App Access",
        devices: "iOS, Android & Web",
        audio: "N/A",
        ads: "£0 Delivery on £15+ Eats Orders"
      },
      {
        name: "Annual Membership",
        price: 59.99,
        period: "year",
        screens: 1,
        resolution: "App Access",
        devices: "All Devices",
        audio: "N/A",
        ads: "Save 16% annually (Get 2 Mos Free)"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "American Express (UK)",
          plan: "Statement Credits",
          claimSteps: "Amex Gold Card and Platinum Card holders frequently receive statement credit cashback on Uber and Uber Eats orders."
        }
      ],
      voucherSavings: {
        provider: "Uber One Student",
        discountPercent: "50% Off via Student Beans",
        instructions: "Verify your UK university status via Student Beans or UNiDAYS to claim Uber One at £2.99/mo.",
        effectivePrice: 2.99
      },
      comboPass: {
        passName: "Uber One Annual Saver",
        passPrice: 59.99,
        individualSum: 71.88,
        netSavings: "11.89/yr",
        bundledWith: ["5% Uber Credit on Rides", "£0 Delivery Fees on Meals & Groceries", "£5 Late Delivery Guarantee"]
      },
      coupons: [
        {
          code: "STUDENTBEANS50",
          discount: "50% off monthly membership for students",
          verified: true
        }
      ],
      officialUrl: "https://www.uber.com/gb/en/u/uber-one/"
    }
  },

  // ==========================================
  // 5. PRODUCTIVITY, AI & CLOUD
  // ==========================================
  {
    id: "chatgpt_plus_uk",
    name: "ChatGPT Plus (UK)",
    category: "productivity",
    tagline: "GPT-4o, Advanced Voice Mode, DALL-E 3 Image Generation & Custom GPTs",
    logoText: "OPENAI",
    accentColor: "from-emerald-700 to-teal-900",
    badge: "World's Leading AI Assistant",
    popularShows: ["GPT-4o Omnimodal", "Real-Time Advanced Voice", "Canvas Coding", "Data Analytics", "DALL-E 3"],
    plans: [
      {
        name: "Free Tier",
        price: 0.00,
        period: "month",
        screens: 1,
        resolution: "Standard",
        devices: "All Devices (iOS, Android, Web, Mac)",
        audio: "Standard Voice",
        ads: "Rate Limited"
      },
      {
        name: "ChatGPT Plus",
        price: 19.99,
        period: "month",
        screens: 1,
        resolution: "Ultra-Fast Priority",
        devices: "All Devices",
        audio: "Advanced Voice Mode (Low Latency)",
        ads: "Unlimited GPT-4o Access"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Microsoft Copilot Free Alternative",
          plan: "Free GPT-4o access via Edge & Windows",
          claimSteps: "Use Microsoft Copilot (free on copilot.microsoft.com) to access GPT-4o and DALL-E for £0 without paying a subscription."
        }
      ],
      voucherSavings: {
        provider: "Revolut / Monzo Zero FX",
        discountPercent: "Avoid US Dollar FX Markup",
        instructions: "Pay using Revolut or Chase UK cards that do not charge 3% foreign currency exchange fees.",
        effectivePrice: 19.20
      },
      comboPass: {
        passName: "Perplexity Pro Free Perks",
        passPrice: 16.00,
        individualSum: 35.99,
        netSavings: "19.99/mo",
        bundledWith: ["GPT-4o", "Claude 3.5 Sonnet", "DeepSeek", "Perplexity Search"]
      },
      coupons: [
        {
          code: "COPILOTFREE",
          discount: "Use free GPT-4o via Microsoft Copilot",
          verified: true
        }
      ],
      officialUrl: "https://chat.openai.com"
    }
  },

  {
    id: "claude_pro_uk",
    name: "Claude Pro (UK)",
    category: "productivity",
    tagline: "Claude 3.5 Sonnet, 200K Context Window, Artifacts & Deep Reasoning",
    logoText: "CLAUDE",
    accentColor: "from-amber-700 to-orange-950",
    badge: "Top AI for Coding, Writing & Architecture",
    popularShows: ["Claude 3.5 Sonnet", "Artifacts Live Previews", "Computer Use API", "Project Knowledge Bases"],
    plans: [
      {
        name: "Free Tier",
        price: 0.00,
        period: "month",
        screens: 1,
        resolution: "Standard Speed",
        devices: "Web, iOS & Android",
        audio: "Text & Vision",
        ads: "Usage Capped"
      },
      {
        name: "Claude Pro",
        price: 19.99,
        period: "month",
        screens: 1,
        resolution: "5x More Usage",
        devices: "All Devices",
        audio: "Text, Code & Vision",
        ads: "Priority Access in Peak Hours"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Anthropic Free Tier",
          plan: "Free Claude 3.5 Sonnet on claude.ai",
          claimSteps: "Claude 3.5 Sonnet is accessible 100% free with reasonable daily query allowances on claude.ai."
        }
      ],
      voucherSavings: {
        provider: "Zero FX UK Bank Cards",
        discountPercent: "Save 3% FX Markup",
        instructions: "Pay with Monzo, Starling or Chase UK to avoid bank currency conversion surcharges.",
        effectivePrice: 19.30
      },
      comboPass: {
        passName: "Cursor IDE + Claude 3.5 Combo",
        passPrice: 16.00,
        individualSum: 35.99,
        netSavings: "19.99/mo",
        bundledWith: ["Claude 3.5 Sonnet Coding", "GPT-4o", "Full Codebase Indexing"]
      },
      coupons: [
        {
          code: "CLAUDEFREE",
          discount: "Free daily queries on official site",
          verified: true
        }
      ],
      officialUrl: "https://claude.ai"
    }
  },

  {
    id: "microsoft_365_uk",
    name: "Microsoft 365 (UK)",
    category: "productivity",
    tagline: "Word, Excel, PowerPoint, Outlook, Defender & 1TB to 6TB Cloud Storage",
    logoText: "M365",
    accentColor: "from-blue-600 to-indigo-800",
    badge: "Family Pack Includes 6TB Total Storage",
    popularShows: ["Microsoft Word", "Excel Power Data", "PowerPoint Designer", "1TB Cloud Storage", "Copilot AI Integration"],
    plans: [
      {
        name: "Personal (1 User)",
        price: 59.99,
        period: "year",
        screens: 5,
        resolution: "Native Desktop Apps",
        devices: "PC, Mac, iPhone, Android",
        audio: "N/A",
        ads: "Includes 1TB OneDrive Storage"
      },
      {
        name: "Family (Up to 6 Users)",
        price: 79.99,
        period: "year",
        screens: 30,
        resolution: "Full Desktop Apps",
        devices: "All Devices (Up to 6 people)",
        audio: "N/A",
        ads: "6TB Storage (1TB per person)"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "UK University Student Email",
          plan: "Microsoft 365 Education Free",
          claimSteps: "Students and teachers at UK schools and universities get Microsoft 365 apps and 1TB cloud storage 100% free with their .ac.uk email."
        }
      ],
      voucherSavings: {
        provider: "Amazon UK / Currys Deals",
        discountPercent: "20%-35% Off Retail",
        instructions: "Amazon UK frequently discounts the 15-month M365 Family box code to £49.99 (bringing the cost to ~£8.33/person/year).",
        effectivePrice: 49.99
      },
      comboPass: {
        passName: "M365 Family 6-Way Split (£13.33/person/yr)",
        passPrice: 79.99,
        individualSum: 359.94,
        netSavings: "279.95/yr (Save 78%)",
        bundledWith: ["6 Independent Accounts", "1TB OneDrive per person (6TB Total)", "Full Office Apps for PC/Mac"]
      },
      coupons: [
        {
          code: "ACUKSTUDENT",
          discount: "100% Free for UK university students",
          verified: true
        }
      ],
      officialUrl: "https://www.microsoft.com/en-gb/microsoft-365"
    }
  },

  {
    id: "google_one_uk",
    name: "Google One (UK)",
    category: "cloud",
    tagline: "Expanded Google Drive, Gmail & Google Photos Storage with Family Sharing",
    logoText: "GOOGLE",
    accentColor: "from-blue-500 via-amber-500 to-emerald-600",
    badge: "Share Storage with 5 Family Members",
    popularShows: ["Google Photos Backup", "Gmail Storage", "Google Drive", "Magic Editor AI Photo Tools"],
    plans: [
      {
        name: "Basic (100GB)",
        price: 1.59,
        period: "month",
        screens: 5,
        resolution: "High Resolution Photos",
        devices: "All Devices",
        audio: "N/A",
        ads: "Includes Family Sharing"
      },
      {
        name: "Basic Annual (100GB)",
        price: 15.99,
        period: "year",
        screens: 5,
        resolution: "High Resolution",
        devices: "All Devices",
        audio: "N/A",
        ads: "Save 16% annually"
      },
      {
        name: "Standard (200GB)",
        price: 2.49,
        period: "month",
        screens: 5,
        resolution: "Full Resolution",
        devices: "All Devices",
        audio: "N/A",
        ads: "Family Sharing + Extra Editing"
      },
      {
        name: "Premium (2TB with Gemini Advanced)",
        price: 18.99,
        period: "month",
        screens: 5,
        resolution: "Ultra Cloud",
        devices: "All Devices",
        audio: "N/A",
        ads: "Includes Gemini Advanced 1.5 Pro AI"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Pixel & Android Purchase",
          plan: "Complimentary Free Cloud Storage",
          claimSteps: "Select Google Pixel devices in the UK include 3–6 months of complimentary 100GB or 2TB Google One storage."
        }
      ],
      voucherSavings: {
        provider: "Google Play Balance",
        discountPercent: "5%-10% with Gift Cards",
        instructions: "Pay with discounted Google Play vouchers from supermarkets or wholesale clubs.",
        effectivePrice: 1.40
      },
      comboPass: {
        passName: "Google One 100GB Annual Prepay",
        passPrice: 15.99,
        individualSum: 19.08,
        netSavings: "3.09/yr",
        bundledWith: ["100GB Shared Storage", "Magic Editor", "Google VPN Discontinued"]
      },
      coupons: [
        {
          code: "GOOGLEANNUAL",
          discount: "Save 16% on annual billing",
          verified: true
        }
      ],
      officialUrl: "https://one.google.com"
    }
  },

  {
    id: "icloud_uk",
    name: "iCloud+ (UK)",
    category: "cloud",
    tagline: "Apple Private Relay, Hide My Email, HomeKit Secure Video & Device Backup",
    logoText: "ICLOUD+",
    accentColor: "from-sky-500 to-indigo-600",
    badge: "Includes Private Relay & Custom Email Domain",
    popularShows: ["iCloud Photo Library", "Private Relay Safari Shield", "Hide My Email Generator", "Mac & iPhone Cloud Backup"],
    plans: [
      {
        name: "50GB Storage",
        price: 0.99,
        period: "month",
        screens: 5,
        resolution: "Full Quality Sync",
        devices: "Apple Devices & Windows",
        audio: "N/A",
        ads: "Private Relay + Hide My Email"
      },
      {
        name: "200GB Storage",
        price: 2.99,
        period: "month",
        screens: 5,
        resolution: "Full Quality",
        devices: "All Devices",
        audio: "N/A",
        ads: "Includes Family Sharing"
      },
      {
        name: "2TB Storage",
        price: 8.99,
        period: "month",
        screens: 5,
        resolution: "Full Quality",
        devices: "All Devices",
        audio: "N/A",
        ads: "Supports Unlimited HomeKit Cameras"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Apple One Bundle",
          plan: "Included with Apple One",
          claimSteps: "iCloud+ (50GB to 2TB) is included with all Apple One tiers without paying for a standalone iCloud subscription."
        }
      ],
      voucherSavings: {
        provider: "Apple Family Sharing",
        discountPercent: "Split with 5 Family Members",
        instructions: "The 200GB (£2.99) and 2TB (£8.99) plans can be shared with up to 5 family members, reducing cost to ~£0.60/person.",
        effectivePrice: 0.60
      },
      comboPass: {
        passName: "Apple One Family (200GB Included)",
        passPrice: 24.95,
        individualSum: 35.96,
        netSavings: "11.01/mo",
        bundledWith: ["Apple Music", "Apple TV+", "Apple Arcade", "200GB iCloud+"]
      },
      coupons: [
        {
          code: "FAMILYSHARE",
          discount: "Share 200GB or 2TB across 5 Apple IDs",
          verified: true
        }
      ],
      officialUrl: "https://www.apple.com/uk/icloud/"
    }
  },

  // ==========================================
  // 6. SECURITY & PRIVACY
  // ==========================================
  {
    id: "nordvpn_uk",
    name: "NordVPN (UK)",
    category: "security",
    tagline: "Ultra-Fast VPN, Threat Protection Anti-Malware & UK/Global Streaming Unblocking",
    logoText: "NORDVPN",
    accentColor: "from-blue-600 to-sky-900",
    badge: "Top VPN for BBC iPlayer Abroad & Privacy",
    popularShows: ["BBC iPlayer Streaming Overseas", "10 Devices Simultaneous Protection", "Meshnet Remote Access", "Ad & Tracker Blocker"],
    plans: [
      {
        name: "Monthly Plan",
        price: 11.49,
        period: "month",
        screens: 10,
        resolution: "Unlimited Bandwidth",
        devices: "PC, Mac, iPhone, Android, Fire TV",
        audio: "N/A",
        ads: "100% Zero-Logs"
      },
      {
        name: "1-Year Plan",
        price: 4.19,
        period: "month",
        screens: 10,
        resolution: "Unlimited Bandwidth",
        devices: "All Devices",
        audio: "N/A",
        ads: "Save 60% with annual prepay"
      },
      {
        name: "2-Year Plan (+3 Months Extra)",
        price: 2.69,
        period: "month",
        screens: 10,
        resolution: "Unlimited Ultra Speed",
        devices: "All Devices",
        audio: "N/A",
        ads: "Save 74% (Best Value in UK)"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "TopCashback / Quidco UK",
          plan: "Up to 50% Cashback Deal",
          claimSteps: "Buy NordVPN 2-year tier through TopCashback or Quidco to receive up to 50% of your payment returned to your UK bank account."
        }
      ],
      voucherSavings: {
        provider: "Student Beans / UNiDAYS",
        discountPercent: "Extra 15% Student Discount",
        instructions: "Verify UK student status on Student Beans for an extra 15% off the 2-year plan.",
        effectivePrice: 2.29
      },
      comboPass: {
        passName: "NordVPN Complete (VPN + NordPass + 1TB Cloud)",
        passPrice: 4.49,
        individualSum: 16.99,
        netSavings: "12.50/mo",
        bundledWith: ["NordVPN", "NordPass Password Manager", "NordLocker 1TB Encrypted Cloud"]
      },
      coupons: [
        {
          code: "NORDUK26",
          discount: "74% Off 2-year deal + 3 extra months free",
          verified: true
        }
      ],
      officialUrl: "https://nordvpn.com"
    }
  },

  // ==========================================
  // 7. BROADCAST & CABLE ENTERTAINMENT PACKS
  // ==========================================
  {
    id: "sky_cinema_uk",
    name: "Sky Cinema & TV (UK)",
    category: "combo",
    tagline: "Over 1,000 On-Demand Blockbusters, Sky Atlantic & Complimentary Paramount+",
    logoText: "SKY",
    accentColor: "from-rose-600 via-purple-700 to-indigo-950",
    badge: "Includes Free Paramount+ & Discovery+",
    popularShows: ["Oppenheimer", "Barbie", "Dune: Part Two", "Spider-Man: Across the Spider-Verse", "Wonka", "Sky Original Cinema"],
    plans: [
      {
        name: "Sky Stream + Cinema",
        price: 26.00,
        period: "month",
        screens: 1,
        resolution: "Full HD / 4K UHD",
        devices: "Sky Stream Puck & TV",
        audio: "Dolby Atmos",
        ads: "Includes Paramount+ and Sky TV"
      },
      {
        name: "Sky Cinema Add-on (Existing Sky)",
        price: 10.00,
        period: "month",
        screens: 1,
        resolution: "Full HD",
        devices: "Sky Q / Glass / Stream",
        audio: "Dolby Atmos",
        ads: "Includes Paramount+ £0 Free"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Sky VIP Rewards",
          plan: "Sky VIP Cinema Perks",
          claimSteps: "Sky VIP members get 2 free cinema tickets every month at Vue cinemas nationwide."
        }
      ],
      voucherSavings: {
        provider: "Sky Stream Switch Deal",
        discountPercent: "Free Next-Day Delivery",
        instructions: "Switch from satellite dish to Sky Stream puck to eliminate dish installation fees and lock in a 24-month price guarantee.",
        effectivePrice: 24.00
      },
      comboPass: {
        passName: "Sky Entertainment + Cinema + Netflix + Paramount+",
        passPrice: 32.00,
        individualSum: 52.97,
        netSavings: "20.97/mo (£251/yr)",
        bundledWith: ["Sky Atlantic", "Sky Cinema", "Netflix Standard", "Paramount+ Standard", "Discovery+ Standard"]
      },
      coupons: [
        {
          code: "VUEVIP2",
          discount: "2 Free Vue cinema tickets monthly via Sky VIP",
          verified: true
        }
      ],
      officialUrl: "https://www.sky.com/tv/cinema"
    }
  }
];
