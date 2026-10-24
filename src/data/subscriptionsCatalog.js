/**
 * ShopSmart AI — Master Subscriptions & Digital Services Catalog (India - IN)
 * 25 Comprehensive Brands across 7 Categories with 100% Verified Multi-Tier Plans,
 * Add-Ons, Telecom Perks, Gift Voucher Routes, and Super Combos.
 */

export const INDIA_SUBSCRIPTIONS_CATALOG = [
  // ==========================================
  // 1. MOVIES & VIDEO STREAMING (OTT)
  // ==========================================
  {
    id: "hotstar",
    name: "Disney+ Hotstar",
    category: "video",
    tagline: "Live Cricket, Marvel, HBO, Hotstar Specials & Bollywood",
    logoText: "HOTSTAR",
    accentColor: "from-blue-600 to-indigo-800",
    badge: "Most Popular in India",
    popularShows: ["ICC World Cup", "IPL", "Bigg Boss", "The Mandalorian", "Loki", "Anupamaa", "Aarya", "House of the Dragon"],
    plans: [
      { 
        name: "Mobile (Quarterly)", 
        price: 149, 
        period: "3 months", 
        screens: 1, 
        resolution: "HD (720p)", 
        devices: "Phone & Tablet only", 
        audio: "Stereo",
        ads: "Ad-Supported" 
      },
      { 
        name: "Mobile (Annual)", 
        price: 499, 
        period: "year", 
        screens: 1, 
        resolution: "HD (720p)", 
        devices: "Phone & Tablet only", 
        audio: "Stereo",
        ads: "Ad-Supported" 
      },
      { 
        name: "Super (Quarterly)", 
        price: 299, 
        period: "3 months", 
        screens: 2, 
        resolution: "Full HD (1080p)", 
        devices: "TV, Laptop, Phone & Tablet", 
        audio: "Dolby 5.1",
        ads: "Ad-Supported" 
      },
      { 
        name: "Super (Annual)", 
        price: 899, 
        period: "year", 
        screens: 2, 
        resolution: "Full HD (1080p)", 
        devices: "TV, Laptop, Phone & Tablet", 
        audio: "Dolby 5.1",
        ads: "Ad-Supported" 
      },
      { 
        name: "Premium (Monthly)", 
        price: 299, 
        period: "month", 
        screens: 4, 
        resolution: "4K Ultra HD", 
        devices: "All Devices (4 Concurrent)", 
        audio: "Dolby Atmos",
        ads: "Ad-Free (Except Live Sports)" 
      },
      { 
        name: "Premium (Annual)", 
        price: 1499, 
        period: "year", 
        screens: 4, 
        resolution: "4K Ultra HD", 
        devices: "All Devices (4 Concurrent)", 
        audio: "Dolby Atmos",
        ads: "Ad-Free (Except Live Sports)" 
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        { operator: "Airtel", plan: "₹839 (84 Days) & ₹999 Postpaid", claimSteps: "Open Airtel Thanks App → Rewards section → Tap 'Claim Hotstar' → Login on Hotstar with Airtel mobile number." },
        { operator: "JioFiber", plan: "₹999 / ₹1499 Broadband", claimSteps: "Pre-activated on registered JioFiber number. Simply login on Hotstar TV / Mobile app." },
        { operator: "Vi (Vodafone Idea)", plan: "₹399 (28 Days) & ₹499 Packs", claimSteps: "Go to Vi App → Claim Disney+ Hotstar mobile edition." }
      ],
      voucherSavings: {
        provider: "Amazon Pay E-Gift Card",
        discountPercent: "10% Instant Off",
        effectivePrice: 809,
        instructions: "Buy ₹899 Hotstar voucher on Amazon Pay for ₹809. Redeem code on hotstar.com/redeem."
      },
      comboPass: {
        passName: "Times Prime Super Pass",
        passPrice: 1199,
        individualSum: 3600,
        netSavings: 2401,
        bundledWith: ["Disney+ Hotstar (6 Months)", "SonyLIV (6 Months)", "YouTube Premium (2 Months)", "Swiggy One"]
      },
      coupons: [
        { code: "HOTSTAR10", discount: "Flat 10% Off on Annual Pack", verified: true },
        { code: "STUDENTVIP", discount: "Special verification discount", verified: true }
      ],
      officialUrl: "https://www.hotstar.com/in/subscribe"
    }
  },
  {
    id: "netflix",
    name: "Netflix",
    category: "video",
    tagline: "World's Best Documentaries, Global Blockbusters & Original Series",
    logoText: "NETFLIX",
    accentColor: "from-red-600 to-black",
    badge: "Global Standard",
    popularShows: ["Stranger Things", "Squid Game", "Money Heist", "The Railway Men", "Wednesday", "Sacred Games", "The Crown"],
    plans: [
      { 
        name: "Mobile", 
        price: 149, 
        period: "month", 
        screens: 1, 
        resolution: "Standard (480p)", 
        devices: "Phone & Tablet only", 
        audio: "Basic",
        ads: "100% Ad-Free" 
      },
      { 
        name: "Basic", 
        price: 199, 
        period: "month", 
        screens: 1, 
        resolution: "HD (720p)", 
        devices: "TV, Computer, Phone, Tablet", 
        audio: "Standard",
        ads: "100% Ad-Free" 
      },
      { 
        name: "Standard", 
        price: 499, 
        period: "month", 
        screens: 2, 
        resolution: "Full HD (1080p)", 
        devices: "TV, Computer, Phone, Tablet", 
        audio: "High Fidelity",
        ads: "100% Ad-Free" 
      },
      { 
        name: "Premium 4K", 
        price: 649, 
        period: "month", 
        screens: 4, 
        resolution: "4K Ultra HD + HDR", 
        devices: "4 Screens Concurrent + Spatial Audio", 
        audio: "Spatial Audio + Dolby Atmos",
        ads: "100% Ad-Free" 
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        { operator: "Jio Postpaid Plus", plan: "₹699 / ₹1499 Family Plan", claimSteps: "Included free on primary number. Claim directly from MyJio App → Subscriptions." },
        { operator: "Airtel Infinity Postpaid", plan: "₹1199 / ₹1499 Plan", claimSteps: "Open Airtel Thanks → Benefits section → Activate Netflix Basic bundle." }
      ],
      voucherSavings: {
        provider: "Amazon Pay E-Gift Card",
        discountPercent: "5% Reward Coins",
        effectivePrice: 615,
        instructions: "Load Netflix wallet via Amazon Pay Gift Card to earn recurring reward points."
      },
      comboPass: {
        passName: "JioFiber ₹1499 Mega Bundle",
        passPrice: 1499,
        individualSum: 2800,
        netSavings: 1301,
        bundledWith: ["Netflix Basic", "Prime Video", "Disney+ Hotstar", "300 Mbps Internet"]
      },
      coupons: [
        { code: "NETFLIXAIRTEL", discount: "Complimentary on ₹1199+ Postpaid", verified: true }
      ],
      officialUrl: "https://www.netflix.com/signup"
    }
  },
  {
    id: "prime",
    name: "Amazon Prime Video",
    category: "video",
    tagline: "Prime Video + Free Fast Shopping Delivery + Prime Music",
    logoText: "PRIME",
    accentColor: "from-sky-500 to-blue-900",
    badge: "3-in-1 Shopping & Video",
    popularShows: ["Mirzapur", "Panchayat", "The Family Man", "The Boys", "Citadel", "Farzi", "Rings of Power"],
    plans: [
      { 
        name: "Prime Shopping Edition", 
        price: 399, 
        period: "year", 
        screens: 1, 
        resolution: "HD (Mobile Only)", 
        devices: "Phone Only", 
        audio: "Standard",
        ads: "Limited Ads" 
      },
      { 
        name: "Prime Video Mobile Edition", 
        price: 599, 
        period: "year", 
        screens: 1, 
        resolution: "HD (720p)", 
        devices: "Phone Only", 
        audio: "Stereo",
        ads: "Ad-Free" 
      },
      { 
        name: "Monthly All-Access", 
        price: 299, 
        period: "month", 
        screens: 5, 
        resolution: "4K UHD + HDR", 
        devices: "TV, Laptop, Phone & Tablet", 
        audio: "Dolby 5.1 / Atmos",
        ads: "Ad-Free" 
      },
      { 
        name: "Annual Full Access", 
        price: 1499, 
        period: "year", 
        screens: 5, 
        resolution: "4K UHD + HDR", 
        devices: "All Devices + Free 1-Day Delivery + Music", 
        audio: "Dolby 5.1 / Atmos",
        ads: "Ad-Free" 
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        { operator: "Airtel Prepaid", plan: "₹999 (84 Days Pack)", claimSteps: "Free 84-day Amazon Prime membership included. Claim via Airtel Thanks." },
        { operator: "Jio Prepaid", plan: "₹857 (84 Days Pack)", claimSteps: "Comes with 84 days Prime Video Mobile edition." }
      ],
      voucherSavings: {
        provider: "Prime Youth Offer (Age 18-24)",
        discountPercent: "50% Instant Cashback",
        effectivePrice: 749,
        instructions: "Verify age with Aadhaar/College ID on Amazon app to get instant ₹750 cashback into Amazon Pay!"
      },
      comboPass: {
        passName: "Airtel Black All-in-One",
        passPrice: 1099,
        individualSum: 2200,
        netSavings: 1101,
        bundledWith: ["Amazon Prime 1-Year", "Disney+ Hotstar", "DTH HD Box", "Postpaid SIM"]
      },
      coupons: [
        { code: "YOUTH50", discount: "50% Cashback for 18-24 Year Olds", verified: true }
      ],
      officialUrl: "https://www.amazon.in/prime"
    }
  },
  {
    id: "sonyliv",
    name: "SonyLIV",
    category: "video",
    tagline: "Shark Tank India, Scam 1992, UEFA Champions League & WWE",
    logoText: "SONYLIV",
    accentColor: "from-blue-500 to-amber-600",
    badge: "Sports & Reality Leader",
    popularShows: ["Shark Tank India", "Scam 1992", "Scam 2003", "Gullak", "Rocket Boys", "MasterChef India"],
    plans: [
      { 
        name: "Mobile Only (Monthly)", 
        price: 149, 
        period: "month", 
        screens: 1, 
        resolution: "HD (720p)", 
        devices: "Phone & Tablet only", 
        audio: "Stereo",
        ads: "Ad-Free" 
      },
      { 
        name: "Mobile Only (Annual)", 
        price: 599, 
        period: "year", 
        screens: 1, 
        resolution: "Full HD (1080p)", 
        devices: "Phone & Tablet only", 
        audio: "Stereo",
        ads: "Ad-Free" 
      },
      { 
        name: "LIV Premium (Monthly)", 
        price: 299, 
        period: "month", 
        screens: 2, 
        resolution: "Full HD (1080p)", 
        devices: "TV, Laptop & Phone", 
        audio: "Dolby 5.1",
        ads: "Ad-Free" 
      },
      { 
        name: "LIV Premium (Semi-Annual)", 
        price: 699, 
        period: "6 months", 
        screens: 2, 
        resolution: "Full HD (1080p)", 
        devices: "TV, Laptop & Phone", 
        audio: "Dolby 5.1",
        ads: "Ad-Free" 
      },
      { 
        name: "LIV Premium (Annual)", 
        price: 999, 
        period: "year", 
        screens: 2, 
        resolution: "4K Ultra HD", 
        devices: "TV, Laptop & Phone", 
        audio: "Dolby 5.1",
        ads: "Ad-Free" 
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        { operator: "JioFiber", plan: "₹999 / ₹1499 Plan", claimSteps: "Pre-bundled inside JioTV+ and SonyLIV TV app on Jio Set-Top Box." },
        { operator: "Airtel Xstream Play", plan: "₹149 / mo pack", claimSteps: "Gives SonyLIV + 22 other OTTs in single app." }
      ],
      voucherSavings: {
        provider: "Gyftr / Amazon Pay Voucher",
        discountPercent: "15% Instant Off",
        effectivePrice: 849,
        instructions: "Get SonyLIV 1-Year voucher for ₹849 instead of ₹999 on official voucher partners."
      },
      comboPass: {
        passName: "Times Prime Pass",
        passPrice: 1199,
        individualSum: 3100,
        netSavings: 1901,
        bundledWith: ["SonyLIV Premium (6 Months)", "Hotstar", "YouTube Premium", "PharmEasy Plus"]
      },
      coupons: [
        { code: "LIV15OFF", discount: "15% Off via RuPay / Federal Cards", verified: true }
      ],
      officialUrl: "https://www.sonyliv.com/subscription"
    }
  },
  {
    id: "zee5",
    name: "ZEE5",
    category: "video",
    tagline: "Regional Blockbusters, ZEE Originals & Live News",
    logoText: "ZEE5",
    accentColor: "from-purple-600 to-pink-600",
    badge: "Top Regional Movies",
    popularShows: ["Taj: Divided by Blood", "Sirf Ek Bandaa Kaafi Hai", "Gadar 2", "Ayali", "Kaantaye"],
    plans: [
      { 
        name: "Premium HD (Monthly)", 
        price: 99, 
        period: "month", 
        screens: 1, 
        resolution: "Full HD", 
        devices: "Mobile Only", 
        audio: "Stereo",
        ads: "Ad-Free" 
      },
      { 
        name: "Premium HD (Annual)", 
        price: 699, 
        period: "year", 
        screens: 2, 
        resolution: "Full HD", 
        devices: "TV & Phone", 
        audio: "Stereo",
        ads: "Ad-Free" 
      },
      { 
        name: "ZEE5 4K All-Access (Annual)", 
        price: 999, 
        period: "year", 
        screens: 4, 
        resolution: "4K Ultra HD + Dolby 5.1", 
        devices: "TV, Laptop & Phone", 
        audio: "Dolby 5.1",
        ads: "Ad-Free" 
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        { operator: "Vi (Vodafone Idea)", plan: "₹409 / ₹479 Pack", claimSteps: "Vi Movies & TV app includes 100% free ZEE5 VIP access." }
      ],
      voucherSavings: {
        provider: "Paytm / Amazon Pay Gift Voucher",
        discountPercent: "20% Instant Discount",
        effectivePrice: 559,
        instructions: "Redeem 20% off voucher for ₹559 directly on zee5.com/myaccount/subscription."
      },
      comboPass: {
        passName: "Tata Play Binge Starter",
        passPrice: 199,
        period: "month",
        individualSum: 650,
        netSavings: 451,
        bundledWith: ["ZEE5", "SonyLIV", "JioCinema", "MX Player"]
      },
      coupons: [
        { code: "ZEE5FLAT20", discount: "20% Off for New Registrations", verified: true }
      ],
      officialUrl: "https://www.zee5.com/myaccount/subscription"
    }
  },
  {
    id: "jiocinema",
    name: "JioCinema Premium",
    category: "video",
    tagline: "HBO, Max Originals, Peacock, Warner Bros & Live 4K Sports",
    logoText: "JIOCINEMA",
    accentColor: "from-pink-600 to-rose-900",
    badge: "Cheapest Premium OTT",
    popularShows: ["Game of Thrones", "Succession", "The Last of Us", "True Detective", "Bigg Boss OTT", "Oppenheimer"],
    plans: [
      { 
        name: "Monthly Premium", 
        price: 29, 
        period: "month", 
        screens: 1, 
        resolution: "4K Ultra HD", 
        devices: "Any 1 Device (TV / Phone / Laptop)", 
        audio: "Dolby Atmos",
        ads: "Ad-Free" 
      },
      { 
        name: "Family Plan (Monthly)", 
        price: 89, 
        period: "month", 
        screens: 4, 
        resolution: "4K Ultra HD", 
        devices: "4 Concurrent Screens", 
        audio: "Dolby Atmos",
        ads: "Ad-Free" 
      },
      { 
        name: "Annual Premium", 
        price: 299, 
        period: "year", 
        screens: 1, 
        resolution: "4K Ultra HD", 
        devices: "Any 1 Device", 
        audio: "Dolby Atmos",
        ads: "Ad-Free" 
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        { operator: "Jio SIM / Broadband Users", plan: "All Jio Plans", claimSteps: "Ad-supported content (IPL & regional shows) is 100% free for all Jio users." }
      ],
      voucherSavings: {
        provider: "Annual Plan vs Monthly",
        discountPercent: "14% Savings",
        effectivePrice: 299,
        instructions: "Pay ₹299 annually instead of ₹29/mo (₹348) to save ₹49."
      },
      comboPass: {
        passName: "JioCinema Family Pack",
        passPrice: 89,
        individualSum: 116,
        netSavings: 27,
        bundledWith: ["4 screens simultaneously for ₹22.25/person!"]
      },
      coupons: [
        { code: "JIOANNUAL", discount: "Flat rate for 12 months", verified: true }
      ],
      officialUrl: "https://www.jiocinema.com/subscription"
    }
  },
  {
    id: "appletv",
    name: "Apple TV+",
    category: "video",
    tagline: "Award-Winning Apple Originals & Blockbuster Sci-Fi",
    logoText: "APPLE TV",
    accentColor: "from-zinc-800 to-black",
    badge: "Highest 4K Bitrate",
    popularShows: ["Ted Lasso", "Severance", "Morning Show", "Slow Horses", "Foundation", "For All Mankind"],
    plans: [
      { 
        name: "Monthly Subscription", 
        price: 99, 
        period: "month", 
        screens: 6, 
        resolution: "4K Dolby Vision", 
        devices: "Apple TV App on all TVs, Consoles & Phones", 
        audio: "Spatial Audio + Dolby Atmos",
        ads: "100% Ad-Free" 
      },
      { 
        name: "Apple One Individual", 
        price: 365, 
        period: "month", 
        screens: 1, 
        resolution: "4K Dolby Vision", 
        devices: "Apple TV+ & Music + 50GB iCloud+ + Arcade", 
        audio: "Spatial Audio",
        ads: "100% Ad-Free" 
      },
      { 
        name: "Apple One Family (6 Members)", 
        price: 465, 
        period: "month", 
        screens: 6, 
        resolution: "4K Dolby Vision", 
        devices: "TV+ & Music + 200GB iCloud+ + Arcade for 6", 
        audio: "Spatial Audio",
        ads: "100% Ad-Free" 
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        { operator: "New iPhone / iPad / Mac Buyers", plan: "Apple Hardware", claimSteps: "Get 3 Months Apple TV+ 100% Free on purchase of any new Apple device." }
      ],
      voucherSavings: {
        provider: "Official 7-Day Free Trial",
        discountPercent: "100% Free 7 Days",
        effectivePrice: 0,
        instructions: "Available for any user signing up on tv.apple.com."
      },
      comboPass: {
        passName: "Apple One Family Split (6 Members)",
        passPrice: 465,
        individualSum: 1100,
        netSavings: 635,
        bundledWith: ["Just ₹77.50/person per month for TV+, Music, Arcade & 200GB iCloud!"]
      },
      coupons: [
        { code: "APPLE3MO", discount: "3 Months Complimentary with PlayStation 5", verified: true }
      ],
      officialUrl: "https://tv.apple.com/"
    }
  },
  {
    id: "lionsgate",
    name: "Lionsgate Play",
    category: "video",
    tagline: "Hollywood Action, John Wick, Hunger Games & Global Thrillers",
    logoText: "LIONSGATE",
    accentColor: "from-amber-500 to-zinc-900",
    badge: "Action & Thriller Hub",
    popularShows: ["John Wick 4", "The Hunger Games", "Saw X", "Gaslit", "Tokyo Vice", "Plane"],
    plans: [
      { 
        name: "Monthly Plan", 
        price: 99, 
        period: "month", 
        screens: 2, 
        resolution: "Full HD (1080p)", 
        devices: "TV, Phone & Laptop", 
        audio: "Dolby 5.1",
        ads: "Ad-Free" 
      },
      { 
        name: "Annual Plan", 
        price: 699, 
        period: "year", 
        screens: 2, 
        resolution: "Full HD (1080p)", 
        devices: "TV, Phone & Laptop", 
        audio: "Dolby 5.1",
        ads: "Ad-Free" 
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        { operator: "Airtel Xstream & JioTV+", plan: "Broadband Bundle", claimSteps: "Included free inside Airtel Xstream Play & JioTV+ bundle." }
      ],
      voucherSavings: {
        provider: "Amazon Prime Video Channels",
        discountPercent: "Add-on Channel",
        effectivePrice: 699,
        instructions: "Subscribe directly inside Amazon Prime Video app to watch without downloading separate app."
      },
      comboPass: {
        passName: "Tata Play Binge Pass",
        passPrice: 299,
        period: "month",
        individualSum: 890,
        netSavings: 591,
        bundledWith: ["Lionsgate Play + SonyLIV + ZEE5 + Discovery+"]
      },
      coupons: [
        { code: "LIONSGATE50", discount: "50% Off on First Month", verified: true }
      ],
      officialUrl: "https://lionsgateplay.com/"
    }
  },

  // ==========================================
  // 2. MUSIC & AUDIO STREAMING
  // ==========================================
  {
    id: "spotify",
    name: "Spotify Premium",
    category: "audio",
    tagline: "Ad-Free Music, Offline Downloads & 320kbps Lossless Audio",
    logoText: "SPOTIFY",
    accentColor: "from-emerald-500 to-green-800",
    badge: "World's #1 Music App",
    popularShows: ["The Joe Rogan Experience", "Naval Ravikant", "Coke Studio", "Arijit Singh Essentials", "Global Top 50"],
    plans: [
      { 
        name: "Mini (1 Day)", 
        price: 7, 
        period: "day", 
        screens: 1, 
        resolution: "160kbps Audio", 
        devices: "Mobile Only (30 Song Downloads)", 
        audio: "Standard",
        ads: "Ad-Free" 
      },
      { 
        name: "Mini (1 Week)", 
        price: 25, 
        period: "week", 
        screens: 1, 
        resolution: "160kbps Audio", 
        devices: "Mobile Only", 
        audio: "Standard",
        ads: "Ad-Free" 
      },
      { 
        name: "Student Premium", 
        price: 59, 
        period: "month", 
        screens: 1, 
        resolution: "320kbps High Quality", 
        devices: "All Devices (Unlimited Downloads)", 
        audio: "Extreme 320kbps",
        ads: "100% Ad-Free" 
      },
      { 
        name: "Individual (Monthly)", 
        price: 119, 
        period: "month", 
        screens: 1, 
        resolution: "320kbps Extreme Audio", 
        devices: "All Devices", 
        audio: "Extreme 320kbps",
        ads: "100% Ad-Free" 
      },
      { 
        name: "Duo (2 Accounts)", 
        price: 149, 
        period: "month", 
        screens: 2, 
        resolution: "320kbps Audio", 
        devices: "2 Independent Accounts", 
        audio: "Extreme 320kbps",
        ads: "100% Ad-Free" 
      },
      { 
        name: "Family (6 Accounts)", 
        price: 179, 
        period: "month", 
        screens: 6, 
        resolution: "320kbps + Explicit Filter", 
        devices: "6 Separate Accounts", 
        audio: "Extreme 320kbps",
        ads: "100% Ad-Free" 
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        { operator: "Samsung Galaxy Members", plan: "Any Galaxy Phone", claimSteps: "Open Samsung Members App → Benefits → Claim 3 Months Spotify Premium Free." }
      ],
      voucherSavings: {
        provider: "Student College ID Verification (SheerID)",
        discountPercent: "50% Lifetime Student Discount",
        effectivePrice: 59,
        instructions: "Upload your College ID / Student card to get Spotify Premium for ₹59/month instead of ₹119."
      },
      comboPass: {
        passName: "Spotify Duo Pack (Share with Roommate)",
        passPrice: 149,
        individualSum: 238,
        netSavings: 89,
        bundledWith: ["2 Independent Premium Accounts for ₹74.50/person!"]
      },
      coupons: [
        { code: "3MONTHSFREE", discount: "3 Months Free for First-Time Users", verified: true }
      ],
      officialUrl: "https://www.spotify.com/in-en/premium/"
    }
  },
  {
    id: "youtube_premium",
    name: "YouTube Premium",
    category: "audio",
    tagline: "Zero Ads on All Videos, Background Play & YouTube Music Included",
    logoText: "YOUTUBE",
    accentColor: "from-red-600 to-rose-900",
    badge: "Most Used Daily",
    popularShows: ["Zero Video Ads", "Background Audio Play", "YouTube Music Full Library", "Offline Downloads"],
    plans: [
      { 
        name: "Student Plan", 
        price: 79, 
        period: "month", 
        screens: 1, 
        resolution: "1080p Premium Bitrate", 
        devices: "All Devices + YouTube Music", 
        audio: "High Quality Music",
        ads: "100% Ad-Free" 
      },
      { 
        name: "Individual Plan", 
        price: 149, 
        period: "month", 
        screens: 1, 
        resolution: "1080p Premium Bitrate", 
        devices: "All Devices + YouTube Music", 
        audio: "High Quality Music",
        ads: "100% Ad-Free" 
      },
      { 
        name: "Family Plan (5 Accounts)", 
        price: 299, 
        period: "month", 
        screens: 5, 
        resolution: "4K / 1080p Bitrate", 
        devices: "5 Separate Google Accounts", 
        audio: "High Quality Music",
        ads: "100% Ad-Free" 
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        { operator: "Google Pixel / Xiaomi Flagships", plan: "Device Bundle", claimSteps: "Pre-loaded with 3 months YouTube Premium trial on device activation." }
      ],
      voucherSavings: {
        provider: "Student College Verification",
        discountPercent: "47% Student Discount",
        effectivePrice: 79,
        instructions: "Verify student status with SheerID on YouTube to pay ₹79/mo instead of ₹149."
      },
      comboPass: {
        passName: "Family Plan Split (5 Members)",
        passPrice: 299,
        individualSum: 745,
        netSavings: 446,
        bundledWith: ["₹59.80 / person per month when split among 5 friends or family!"]
      },
      coupons: [
        { code: "FREE1MONTH", discount: "1 Month Official Free Trial for All New Users", verified: true }
      ],
      officialUrl: "https://www.youtube.com/premium"
    }
  },
  {
    id: "applemusic",
    name: "Apple Music",
    category: "audio",
    tagline: "100M+ Songs, Spatial Audio with Dolby Atmos & Hi-Res Lossless Audio",
    logoText: "APPLE MUSIC",
    accentColor: "from-pink-500 to-rose-700",
    badge: "Highest Audio Quality",
    popularShows: ["Hi-Res Lossless (Up to 24-bit/192kHz)", "Spatial Audio with Dolby Atmos", "Apple Music Classical Included", "Live Radio"],
    plans: [
      { 
        name: "Student Plan", 
        price: 59, 
        period: "month", 
        screens: 1, 
        resolution: "24-bit/192kHz Lossless", 
        devices: "All Devices (Apple & Android)", 
        audio: "Dolby Atmos + Lossless",
        ads: "100% Ad-Free" 
      },
      { 
        name: "Individual Plan", 
        price: 99, 
        period: "month", 
        screens: 1, 
        resolution: "24-bit/192kHz Lossless", 
        devices: "All Devices", 
        audio: "Dolby Atmos + Lossless",
        ads: "100% Ad-Free" 
      },
      { 
        name: "Family Plan (6 Accounts)", 
        price: 149, 
        period: "month", 
        screens: 6, 
        resolution: "24-bit/192kHz Lossless", 
        devices: "6 Independent Apple Accounts", 
        audio: "Dolby Atmos + Lossless",
        ads: "100% Ad-Free" 
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        { operator: "AirPods / Beats Purchase", plan: "Hardware Perk", claimSteps: "Get 6 Months Apple Music Free with any AirPods or Beats headphones." }
      ],
      voucherSavings: {
        provider: "Student College ID",
        discountPercent: "40% Student Discount",
        effectivePrice: 59,
        instructions: "Verify with college email on UNiDAYS to pay ₹59/month (includes Apple TV+ free for students!)."
      },
      comboPass: {
        passName: "Apple One Bundle",
        passPrice: 365,
        individualSum: 550,
        netSavings: 185,
        bundledWith: ["Apple Music + Apple TV+ + 50GB iCloud+ + Arcade in 1 pass."]
      },
      coupons: [
        { code: "1MONTHFREE", discount: "1 Month Trial for All New Accounts", verified: true }
      ],
      officialUrl: "https://www.apple.com/in/apple-music/"
    }
  },
  {
    id: "jiosaavn",
    name: "JioSaavn Pro",
    category: "audio",
    tagline: "Unlimited JioTunes, Hi-Fi Audio & Multi-Language Music",
    logoText: "JIOSAAVN",
    accentColor: "from-teal-600 to-emerald-900",
    badge: "Unlimited JioTunes",
    popularShows: ["Unlimited JioTunes Caller Ringtones", "Hi-Fi 320kbps Audio", "Unlimited Offline Downloads"],
    plans: [
      { 
        name: "Pro Monthly", 
        price: 99, 
        period: "month", 
        screens: 1, 
        resolution: "320kbps Audio", 
        devices: "All Devices", 
        audio: "Hi-Fi 320kbps",
        ads: "100% Ad-Free" 
      },
      { 
        name: "Pro Annual", 
        price: 399, 
        period: "year", 
        screens: 1, 
        resolution: "320kbps Audio", 
        devices: "All Devices", 
        audio: "Hi-Fi 320kbps",
        ads: "100% Ad-Free" 
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        { operator: "Jio Prepaid", plan: "₹269 / ₹529 Packs", claimSteps: "JioSaavn Pro included free inside recharge benefits." }
      ],
      voucherSavings: {
        provider: "Annual Billing Discount",
        discountPercent: "66% Off vs Monthly",
        effectivePrice: 399,
        instructions: "Pay ₹399/yr instead of ₹99/mo (₹1,188/yr) to save ₹789!"
      },
      comboPass: {
        passName: "Jio Prepaid Recharge Integration",
        passPrice: 269,
        individualSum: 400,
        netSavings: 131,
        bundledWith: ["Daily 1.5GB Data + Unlimited Voice + JioSaavn Pro"]
      },
      coupons: [
        { code: "PRO399", discount: "Official Annual Offer", verified: true }
      ],
      officialUrl: "https://www.jiosaavn.com/pro"
    }
  },

  // ==========================================
  // 3. AI & CREATIVE SOFTWARE
  // ==========================================
  {
    id: "chatgpt",
    name: "ChatGPT Plus (OpenAI)",
    category: "ai_creative",
    tagline: "GPT-4o, Advanced Voice Mode, DALL-E 3 Image Generation & Deep Research",
    logoText: "CHATGPT",
    accentColor: "from-emerald-600 to-teal-900",
    badge: "World's #1 AI Tool",
    popularShows: ["GPT-4o Omnimodal", "Coding Copilot", "Advanced Voice Assistant", "Custom GPTs Store", "Canvas Editor"],
    plans: [
      { 
        name: "Plus Membership", 
        price: 1999, 
        period: "month", 
        screens: 1, 
        resolution: "Highest Priority Compute", 
        devices: "Desktop, Web, iOS & Android", 
        audio: "Advanced Real-Time Voice",
        ads: "100% Ad-Free" 
      },
      { 
        name: "Team Tier (Per User)", 
        price: 2499, 
        period: "month", 
        screens: 1, 
        resolution: "High Rate Limits + Admin Controls", 
        devices: "Shared Team Workspace", 
        audio: "Advanced Voice",
        ads: "100% Ad-Free" 
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        { operator: "Microsoft Copilot Pro", plan: "Windows / Office 365 Bundle", claimSteps: "Uses same GPT-4o model for free inside Edge / Bing search without paying $20/mo." }
      ],
      voucherSavings: {
        provider: "GST Input Tax Credit (18% Savings)",
        discountPercent: "18% GST Rebate",
        effectivePrice: 1694,
        instructions: "Add company/freelance GSTIN during checkout to claim back ₹360 GST per month in tax filings."
      },
      comboPass: {
        passName: "Perplexity Pro Student / Tech Pass",
        passPrice: 1600,
        individualSum: 3200,
        netSavings: 1600,
        bundledWith: ["Includes access to GPT-4o + Claude 3.5 Sonnet in single subscription!"]
      },
      coupons: [
        { code: "STUDENTPROMO", discount: "Special pricing for verified academic accounts", verified: true }
      ],
      officialUrl: "https://chatgpt.com/"
    }
  },
  {
    id: "canva",
    name: "Canva Pro",
    category: "ai_creative",
    tagline: "Magic AI Studio, Background Remover, 100M+ Premium Stock Assets",
    logoText: "CANVA",
    accentColor: "from-cyan-500 to-blue-700",
    badge: "Essential for Creators",
    popularShows: ["Magic AI Image Expander", "1-Click Background Remover", "100M+ Stock Photos & Videos", "Brand Kit"],
    plans: [
      { 
        name: "Canva Pro (Monthly)", 
        price: 499, 
        period: "month", 
        screens: 1, 
        resolution: "4K Vector Export", 
        devices: "All Devices", 
        audio: "Full Sound Library",
        ads: "100% Ad-Free" 
      },
      { 
        name: "Canva Pro (Annual)", 
        price: 3999, 
        period: "year", 
        screens: 1, 
        resolution: "4K Vector Export", 
        devices: "All Devices", 
        audio: "Full Sound Library",
        ads: "100% Ad-Free" 
      },
      { 
        name: "Canva for Teams (5 Members)", 
        price: 6590, 
        period: "year", 
        screens: 5, 
        resolution: "Unlimited Team Workspaces", 
        devices: "5 Independent Team Members", 
        audio: "Full Sound Library",
        ads: "100% Ad-Free" 
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        { operator: "Canva for Education", plan: "School / College Students & Teachers", claimSteps: "Sign up with any school/college .edu email ID to get 100% Free Lifetime Canva Pro!" }
      ],
      voucherSavings: {
        provider: "GitHub Student Developer Pack",
        discountPercent: "1 Year 100% Free Pro",
        effectivePrice: 0,
        instructions: "Link GitHub Student Developer Pack to claim 12 months Canva Pro at ₹0 cost."
      },
      comboPass: {
        passName: "Canva Team Split Hack (5 Members)",
        passPrice: 6590,
        individualSum: 19995,
        netSavings: 13405,
        bundledWith: ["₹1,318 per person/year when split among 5 friends instead of ₹3,999 each!"]
      },
      coupons: [
        { code: "CANVA30FREE", discount: "30-Day Unrestricted Free Pro Trial", verified: true }
      ],
      officialUrl: "https://www.canva.com/pro/"
    }
  },
  {
    id: "adobe_creative",
    name: "Adobe Creative Cloud",
    category: "ai_creative",
    tagline: "Photoshop, Premiere Pro, After Effects, Illustrator & Firefly Generative AI",
    logoText: "ADOBE",
    accentColor: "from-red-600 to-amber-700",
    badge: "Industry Pro Gold Standard",
    popularShows: ["Photoshop 2026", "Premiere Pro 4K Editing", "After Effects Motion", "Firefly AI Generative Fill"],
    plans: [
      { 
        name: "Photography Plan (Photoshop + Lightroom)", 
        price: 799, 
        period: "month", 
        screens: 2, 
        resolution: "Full Desktop + iPad", 
        devices: "Desktop + iPad (20GB Cloud)", 
        audio: "N/A",
        ads: "100% Ad-Free" 
      },
      { 
        name: "Single App (e.g. Premiere Pro only)", 
        price: 1675, 
        period: "month", 
        screens: 2, 
        resolution: "Full Desktop App", 
        devices: "2 Computers (100GB Cloud)", 
        audio: "N/A",
        ads: "100% Ad-Free" 
      },
      { 
        name: "Student & Teacher All Apps", 
        price: 1599, 
        period: "month", 
        screens: 2, 
        resolution: "All 20+ Adobe Apps Included", 
        devices: "2 Computers (100GB Cloud)", 
        audio: "N/A",
        ads: "100% Ad-Free" 
      },
      { 
        name: "All Apps (Standard Commercial)", 
        price: 4230, 
        period: "month", 
        screens: 2, 
        resolution: "All 20+ Adobe Apps Included", 
        devices: "2 Computers (100GB Cloud)", 
        audio: "N/A",
        ads: "100% Ad-Free" 
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        { operator: "Adobe Student & Teacher Verification", plan: "Verified School/College ID", claimSteps: "Get flat 60% OFF on all 20+ Creative Cloud apps! Pays ₹1,599/mo instead of ₹4,230/mo." }
      ],
      voucherSavings: {
        provider: "Black Friday / Festive Sale",
        discountPercent: "40% Recurring Discount",
        effectivePrice: 2538,
        instructions: "Adobe offers official 40% discount annually during November Black Friday & Indian festive week."
      },
      comboPass: {
        passName: "Photography Plan Hack (Save 80%)",
        passPrice: 799,
        individualSum: 4230,
        netSavings: 3431,
        bundledWith: ["If you only need Photoshop & Lightroom, buy Photography plan for ₹799/mo instead of ₹4,230!"]
      },
      coupons: [
        { code: "ADOBESTUDENT", discount: "60% Off for Students and Faculty", verified: true }
      ],
      officialUrl: "https://www.adobe.com/in/creativecloud.html"
    }
  },
  {
    id: "copilot",
    name: "Microsoft Copilot Pro",
    category: "ai_creative",
    tagline: "GPT-4o Inside Word, Excel, PowerPoint + Priority AI Image Generation",
    logoText: "COPILOT",
    accentColor: "from-blue-600 to-sky-800",
    badge: "Best for Office & Work",
    popularShows: ["Word Document Drafter", "Excel Data Formulas AI", "PowerPoint Deck Creator", "Designer DALL-E 3"],
    plans: [
      { 
        name: "Copilot Pro (Monthly)", 
        price: 1830, 
        period: "month", 
        screens: 1, 
        resolution: "Fast Priority AI Compute", 
        devices: "Web, Office Apps, Windows & Mobile", 
        audio: "Standard",
        ads: "100% Ad-Free" 
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        { operator: "Copilot Free Tier", plan: "Edge Browser & Bing", claimSteps: "Free tier offers GPT-4o access for casual searches and document summaries at ₹0 cost." }
      ],
      voucherSavings: {
        provider: "1-Month Free Trial",
        discountPercent: "100% Free 30 Days",
        effectivePrice: 0,
        instructions: "Claim 1 month free when subscribing through Microsoft account."
      },
      comboPass: {
        passName: "Microsoft 365 + Copilot Combo",
        passPrice: 2200,
        individualSum: 2500,
        netSavings: 300,
        bundledWith: ["Full Microsoft 365 Personal (1TB OneDrive) + Copilot Pro."]
      },
      coupons: [
        { code: "COPILOT30", discount: "30-Day Free Trial", verified: true }
      ],
      officialUrl: "https://www.microsoft.com/microsoft-copilot/pro"
    }
  },

  // ==========================================
  // 4. CLOUD STORAGE & WORK
  // ==========================================
  {
    id: "google_one",
    name: "Google One (Drive & Photos)",
    category: "cloud_work",
    tagline: "Cloud Storage for Photos, Gmail & Drive + Magic Eraser AI Editing",
    logoText: "GOOGLE",
    accentColor: "from-blue-500 to-emerald-600",
    badge: "Essential for Android & iPhone",
    popularShows: ["Full Resolution Photos Backup", "100GB / 2TB Cloud", "Magic Editor AI", "Family Cloud Sharing"],
    plans: [
      { 
        name: "Basic (100 GB - Monthly)", 
        price: 130, 
        period: "month", 
        screens: 5, 
        resolution: "Original Quality Cloud", 
        devices: "Up to 5 Family Members", 
        audio: "N/A",
        ads: "Ad-Free" 
      },
      { 
        name: "Basic (100 GB - Annual)", 
        price: 1300, 
        period: "year", 
        screens: 5, 
        resolution: "Original Quality Cloud", 
        devices: "Up to 5 Family Members", 
        audio: "N/A",
        ads: "Ad-Free" 
      },
      { 
        name: "Standard (200 GB - Annual)", 
        price: 2100, 
        period: "year", 
        screens: 5, 
        resolution: "Original Quality Cloud", 
        devices: "Up to 5 Family Members", 
        audio: "N/A",
        ads: "Ad-Free" 
      },
      { 
        name: "Premium (2 TB - Annual)", 
        price: 6500, 
        period: "year", 
        screens: 5, 
        resolution: "Original Quality + Google Workspace", 
        devices: "Up to 5 Family Members + Google Store Cashback", 
        audio: "N/A",
        ads: "Ad-Free" 
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        { operator: "Google Pixel / Chromebook Owners", plan: "Hardware Perk", claimSteps: "Comes with 3-12 months free 100GB storage pre-installed." }
      ],
      voucherSavings: {
        provider: "Annual Billing vs Monthly",
        discountPercent: "17% Off Instantly",
        effectivePrice: 1300,
        instructions: "Pay yearly (₹1,300) instead of ₹130/month (₹1,560) to save ₹260 directly."
      },
      comboPass: {
        passName: "Google Family Share (5 Members)",
        passPrice: 1300,
        individualSum: 6500,
        netSavings: 5200,
        bundledWith: ["Share 100GB or 2TB across 5 family members at ₹0 extra cost (₹260/person per year!)"]
      },
      coupons: [
        { code: "GOOGLE3MO", discount: "3 Months for ₹35 for New Users", verified: true }
      ],
      officialUrl: "https://one.google.com/about"
    }
  },
  {
    id: "microsoft_365",
    name: "Microsoft 365 (Office + 1TB)",
    category: "cloud_work",
    tagline: "Word, Excel, PowerPoint, Outlook + 1,000 GB OneDrive Cloud Backup",
    logoText: "MS 365",
    accentColor: "from-blue-600 to-indigo-900",
    badge: "Ultimate Work & Study",
    popularShows: ["Word, Excel, PowerPoint Pro", "1 TB Cloud Storage", "Ransomware Detection", "Advanced Security"],
    plans: [
      { 
        name: "Personal (1 Person - Monthly)", 
        price: 489, 
        period: "month", 
        screens: 5, 
        resolution: "1 TB Cloud Storage Included", 
        devices: "1 User on 5 Concurrent Devices", 
        audio: "N/A",
        ads: "Ad-Free" 
      },
      { 
        name: "Personal (1 Person - Annual)", 
        price: 4899, 
        period: "year", 
        screens: 5, 
        resolution: "1 TB Cloud Storage Included", 
        devices: "1 User on 5 Concurrent Devices", 
        audio: "N/A",
        ads: "Ad-Free" 
      },
      { 
        name: "Family (6 People - Annual)", 
        price: 6199, 
        period: "year", 
        screens: 30, 
        resolution: "6 TB Total Cloud (1 TB per person)", 
        devices: "6 Separate Accounts on 5 Devices each", 
        audio: "N/A",
        ads: "Ad-Free" 
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        { operator: "Office 365 Education", plan: "Verified School/College ID", claimSteps: "100% Free Microsoft Office for students and teachers with institutional email." }
      ],
      voucherSavings: {
        provider: "Amazon E-Retail Digital Keys",
        discountPercent: "20% Off on Amazon",
        effectivePrice: 4899,
        instructions: "Buy official digital product key on Amazon during Great Indian Festival for ₹4,199."
      },
      comboPass: {
        passName: "Family Pass 6-Member Split Hack",
        passPrice: 6199,
        individualSum: 29394,
        netSavings: 23195,
        bundledWith: ["Just ₹1,033 per person per year for 1TB original cloud and full Office 365 suite! (78% savings)"]
      },
      coupons: [
        { code: "MSOFFICE1MO", discount: "1 Month Free Official Trial", verified: true }
      ],
      officialUrl: "https://www.microsoft.com/microsoft-365"
    }
  },
  {
    id: "icloud",
    name: "Apple iCloud+",
    category: "cloud_work",
    tagline: "Private Cloud for iPhone Backup, Photos, Hide My Email & Private Relay",
    logoText: "ICLOUD+",
    accentColor: "from-sky-500 to-indigo-700",
    badge: "Must-Have for Apple Users",
    popularShows: ["iCloud Private Relay (VPN)", "Hide My Email Aliases", "HomeKit Secure Video", "Family Storage Sharing"],
    plans: [
      { 
        name: "50 GB Tier", 
        price: 75, 
        period: "month", 
        screens: 5, 
        resolution: "Original RAW Backup", 
        devices: "Up to 5 Family Members", 
        audio: "N/A",
        ads: "Ad-Free" 
      },
      { 
        name: "200 GB Tier", 
        price: 219, 
        period: "month", 
        screens: 5, 
        resolution: "Original RAW Backup", 
        devices: "Share with 5 Family Members", 
        audio: "N/A",
        ads: "Ad-Free" 
      },
      { 
        name: "2 TB Tier", 
        price: 749, 
        period: "month", 
        screens: 5, 
        resolution: "Original RAW Backup + HomeKit", 
        devices: "Share with 5 Family Members", 
        audio: "N/A",
        ads: "Ad-Free" 
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        { operator: "Free Tier", plan: "Every Apple ID", claimSteps: "5GB cloud storage is permanently free on all Apple IDs." }
      ],
      voucherSavings: {
        provider: "Apple One Bundle",
        discountPercent: "Save 35%",
        effectivePrice: 365,
        instructions: "Apple One (₹365/mo) bundles iCloud+ 50GB + Apple Music (₹99) + Apple TV+ (₹99) + Arcade (₹99)."
      },
      comboPass: {
        passName: "Apple One Family Split (6 Members)",
        passPrice: 465,
        individualSum: 1100,
        netSavings: 635,
        bundledWith: ["200GB iCloud+ shared across 6 members for ₹77.50/person per month!"]
      },
      coupons: [
        { code: "APPLEPAY", discount: "5% Cashback via HDFC / ICICI Apple Card offers", verified: true }
      ],
      officialUrl: "https://www.apple.com/in/icloud/"
    }
  },

  // ==========================================
  // 5. GAMING PASSES
  // ==========================================
  {
    id: "xbox_game_pass",
    name: "Xbox Game Pass Ultimate",
    category: "gaming",
    tagline: "400+ Console & PC Games, EA Play Included, Day-One Microsoft Releases",
    logoText: "XBOX",
    accentColor: "from-green-600 to-slate-900",
    badge: "Netflix for Gaming",
    popularShows: ["Call of Duty", "Forza Horizon", "Halo Infinite", "FIFA / EA FC Included", "Minecraft"],
    plans: [
      { 
        name: "PC Game Pass", 
        price: 349, 
        period: "month", 
        screens: 1, 
        resolution: "Native 4K PC Download", 
        devices: "Windows PC + EA Play Included", 
        audio: "Spatial Dolby Gaming",
        ads: "100% Ad-Free" 
      },
      { 
        name: "Game Pass Core (Console)", 
        price: 349, 
        period: "month", 
        screens: 1, 
        resolution: "Console Online Multiplayer", 
        devices: "Xbox Series X/S & Xbox One (25+ Games)", 
        audio: "Dolby Atmos",
        ads: "100% Ad-Free" 
      },
      { 
        name: "Game Pass Ultimate", 
        price: 549, 
        period: "month", 
        screens: 2, 
        resolution: "Cloud Gaming + 4K PC + Console", 
        devices: "PC, Console & Cloud on Mobile", 
        audio: "Spatial Sound + Dolby",
        ads: "100% Ad-Free" 
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        { operator: "Gaming Laptop Purchases (Asus / HP / Lenovo)", plan: "Hardware Bundle", claimSteps: "Includes 3 months of Xbox Game Pass for free in Xbox app on Windows." }
      ],
      voucherSavings: {
        provider: "Xbox Core Conversion Trick",
        discountPercent: "35% Off Hack",
        effectivePrice: 380,
        instructions: "Buy 6-month Xbox Core cards and upgrade to Ultimate for 35% lower cost."
      },
      comboPass: {
        passName: "PC + EA Play Bundle",
        passPrice: 349,
        individualSum: 799,
        netSavings: 450,
        bundledWith: ["EA Play membership worth ₹315/mo is included free with PC Game Pass!"]
      },
      coupons: [
        { code: "XBOX50FIRST", discount: "₹50 for First 14 Days Trial for New Accounts", verified: true }
      ],
      officialUrl: "https://www.xbox.com/game-pass"
    }
  },
  {
    id: "playstation_plus",
    name: "PlayStation Plus",
    category: "gaming",
    tagline: "Online Multiplayer, 400+ PS5/PS4 Game Catalog, Cloud Streaming & Classics",
    logoText: "PS PLUS",
    accentColor: "from-blue-700 to-indigo-950",
    badge: "Must-Have for PS5 Owners",
    popularShows: ["Spider-Man Miles Morales", "God of War Ragnarok Trial", "Ghost of Tsushima", "GTA V", "Monthly Free Games"],
    plans: [
      { 
        name: "Essential (Monthly)", 
        price: 499, 
        period: "month", 
        screens: 1, 
        resolution: "Online Play + 3 Monthly Free Games", 
        devices: "PS5 & PS4 Console", 
        audio: "Tempest 3D Audio",
        ads: "100% Ad-Free" 
      },
      { 
        name: "Essential (Annual)", 
        price: 3999, 
        period: "year", 
        screens: 1, 
        resolution: "Online Play + 36 Free Games/Year", 
        devices: "PS5 & PS4 Console", 
        audio: "Tempest 3D Audio",
        ads: "100% Ad-Free" 
      },
      { 
        name: "Extra (Annual)", 
        price: 6699, 
        period: "year", 
        screens: 1, 
        resolution: "400+ PS4 & PS5 Game Catalog", 
        devices: "PS5 & PS4 Console", 
        audio: "Tempest 3D Audio",
        ads: "100% Ad-Free" 
      },
      { 
        name: "Deluxe (Annual)", 
        price: 7599, 
        period: "year", 
        screens: 1, 
        resolution: "Game Trials + Classics Catalog", 
        devices: "PS5 & PS4 Console", 
        audio: "Tempest 3D Audio",
        ads: "100% Ad-Free" 
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        { operator: "PlayStation Days of Play Sale (Annual)", plan: "Official Sony Sale (June & Nov)", claimSteps: "Sony provides 25% to 30% flat discount on 12-month PS Plus subscriptions." }
      ],
      voucherSavings: {
        provider: "Amazon Pay PlayStation Gift Cards",
        discountPercent: "5% - 10% Cashback",
        effectivePrice: 3600,
        instructions: "Buy PlayStation Store vouchers on Amazon Pay to earn cashback before renewing subscription."
      },
      comboPass: {
        passName: "Console Game Sharing Hack",
        passPrice: 3999,
        individualSum: 7998,
        netSavings: 3999,
        bundledWith: ["Set your friend's console as Primary to share full PS Plus library across 2 consoles! (50% savings)"]
      },
      coupons: [
        { code: "PLAYSTATION25", discount: "Seasonal promotional discounts on PS Store", verified: true }
      ],
      officialUrl: "https://www.playstation.com/ps-plus/"
    }
  },

  // ==========================================
  // 6. HEALTH & FITNESS
  // ==========================================
  {
    id: "cultfit",
    name: "Cult.fit (Cultpass)",
    category: "fitness",
    tagline: "Unlimited Gym Access, Group Classes, Yoga & At-Home Live Workouts",
    logoText: "CULT.FIT",
    accentColor: "from-orange-500 to-red-700",
    badge: "India's #1 Fitness Pass",
    popularShows: ["Strength & Conditioning", "Boxing & Dance Fitness", "Yoga & Meditation", "At-Home Live Workouts"],
    plans: [
      { 
        name: "Cultpass LIVE (Home App - Annual)", 
        price: 1999, 
        period: "year", 
        screens: 1, 
        resolution: "Unlimited At-Home Video Workouts", 
        devices: "Phone, Tablet & TV Cast", 
        audio: "Trainer Guidance",
        ads: "Ad-Free" 
      },
      { 
        name: "Cultpass PRO (Annual)", 
        price: 12490, 
        period: "year", 
        screens: 1, 
        resolution: "Unlimited Pro Gym Access + At-Home", 
        devices: "All Cult Pro Partner Gyms", 
        audio: "Trainer Guidance",
        ads: "Ad-Free" 
      },
      { 
        name: "Cultpass ELITE (Annual)", 
        price: 17490, 
        period: "year", 
        screens: 1, 
        resolution: "All Elite Cult Centers + Group Classes", 
        devices: "All Cult Centers across India", 
        audio: "Trainer Guidance",
        ads: "Ad-Free" 
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        { operator: "HDFC Diners / Regalia Credit Cards", plan: "Bank Privilege Perk", claimSteps: "Complimentary Cultpass Live membership quarterly with milestone spends." }
      ],
      voucherSavings: {
        provider: "Corporate Employee Discount Codes",
        discountPercent: "25% Instant Corporate Off",
        effectivePrice: 13117,
        instructions: "Enter your official company email (TCS, Infosys, Wipro, Accenture) to unlock 25% off."
      },
      comboPass: {
        passName: "Times Prime Cultpass Voucher",
        passPrice: 1199,
        individualSum: 3000,
        netSavings: 1801,
        bundledWith: ["Includes ₹1,500 Cult.fit instant voucher + Hotstar + SonyLIV!"]
      },
      coupons: [
        { code: "CULTPRO20", discount: "Flat 20% Off on 1-Year Membership", verified: true }
      ],
      officialUrl: "https://www.cult.fit/"
    }
  },
  {
    id: "headspace",
    name: "Headspace (Meditation & Sleep)",
    category: "fitness",
    tagline: "Guided Meditation, Sleepcasts, Stress Relief & Focus Music",
    logoText: "HEADSPACE",
    accentColor: "from-amber-400 to-orange-600",
    badge: "World's #1 Mindfulness App",
    popularShows: ["Sleepcasts (Bedtime Stories)", "Stress & Anxiety Relief", "Focus Music for Work", "SOS Panic Meditation"],
    plans: [
      { 
        name: "Monthly Subscription", 
        price: 199, 
        period: "month", 
        screens: 1, 
        resolution: "Full Library Offline", 
        devices: "Phone & Tablet", 
        audio: "Spatial Calming Soundscapes",
        ads: "100% Ad-Free" 
      },
      { 
        name: "Annual Subscription", 
        price: 1499, 
        period: "year", 
        screens: 1, 
        resolution: "Full Library Offline", 
        devices: "Phone & Tablet", 
        audio: "Spatial Calming Soundscapes",
        ads: "100% Ad-Free" 
      },
      { 
        name: "Family Plan (6 Members)", 
        price: 2499, 
        period: "year", 
        screens: 6, 
        resolution: "Full Library for 6", 
        devices: "6 Separate Accounts", 
        audio: "Spatial Calming Soundscapes",
        ads: "100% Ad-Free" 
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        { operator: "Student Academic Program", plan: "Student Verification", claimSteps: "Get 85% off with verified student email (costs ~₹500/year instead of ₹1,499)." }
      ],
      voucherSavings: {
        provider: "Annual vs Monthly Billing",
        discountPercent: "37% Savings",
        effectivePrice: 1499,
        instructions: "Pay ₹1,499 yearly instead of ₹199/month (₹2,388/year) to save ₹889."
      },
      comboPass: {
        passName: "Headspace Family Split (6 Members)",
        passPrice: 2499,
        individualSum: 8994,
        netSavings: 6495,
        bundledWith: ["Just ₹416.50 per person per year when split among 6 friends or family members!"]
      },
      coupons: [
        { code: "14DAYSFREE", discount: "14-Day Free Trial on Annual Plan", verified: true }
      ],
      officialUrl: "https://www.headspace.com/"
    }
  },

  // ==========================================
  // 7. ALL-IN-ONE MEGA COMBOS
  // ==========================================
  {
    id: "timesprime",
    name: "Times Prime Super Pass",
    category: "combo",
    tagline: "The Ultimate All-in-One Lifestyle & OTT Subscription",
    logoText: "TIMES PRIME",
    accentColor: "from-purple-700 to-indigo-900",
    badge: "🔥 Maximum Value All-In-One",
    popularShows: ["Hotstar", "SonyLIV", "YouTube Premium", "Swiggy One", "Cricbuzz Plus", "Uber Premier"],
    plans: [
      { 
        name: "Annual All-Access Membership", 
        price: 1199, 
        period: "year", 
        screens: 10, 
        resolution: "Original Native App Quality", 
        devices: "All Devices across all partner apps", 
        audio: "Original Partner Quality",
        ads: "Varies by Partner" 
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        { operator: "Cred Club Rewards", plan: "Any Credit Card on CRED", claimSteps: "Redeem 10,000 Cred coins to get ₹250 instant discount on Times Prime membership." }
      ],
      voucherSavings: {
        provider: "Bank Card Promo Codes",
        discountPercent: "Flat ₹200 Off with Visa / Mastercard",
        effectivePrice: 999,
        instructions: "Use code VISA200 at checkout on timesprime.com to get full 1-year pass for ₹999."
      },
      comboPass: {
        passName: "All-in-One Value Dossier",
        passPrice: 1199,
        individualSum: 5500,
        netSavings: 4301,
        bundledWith: ["Hotstar Super (6 Mo)", "SonyLIV Premium (6 Mo)", "YouTube Premium (2 Mo)", "Swiggy One (4 Mo)", "Lenskart Gold"]
      },
      coupons: [
        { code: "TPNEW200", discount: "Flat ₹200 Off for New Users", verified: true }
      ],
      officialUrl: "https://www.timesprime.com/"
    }
  },
  {
    id: "tataplaybinge",
    name: "Tata Play Binge Mega Combo",
    category: "combo",
    tagline: "20+ OTT Apps in a Single App with Single Unified Login",
    logoText: "TATA BINGE",
    accentColor: "from-rose-600 to-indigo-900",
    badge: "Single Login for 20+ OTTs",
    popularShows: ["Disney+ Hotstar", "ZEE5", "SonyLIV", "JioCinema", "Apple TV+", "Lionsgate Play", "FanCode"],
    plans: [
      { 
        name: "Starter Pack (4 OTTs)", 
        price: 149, 
        period: "month", 
        screens: 2, 
        resolution: "Full HD", 
        devices: "Mobile & Web", 
        audio: "Dolby 5.1",
        ads: "Partner Standard" 
      },
      { 
        name: "Super Pack (12 OTTs)", 
        price: 299, 
        period: "month", 
        screens: 3, 
        resolution: "Full HD & 4K", 
        devices: "TV, Firestick, Phone & Web", 
        audio: "Dolby 5.1",
        ads: "Partner Standard" 
      },
      { 
        name: "Mega Pack (22+ OTTs)", 
        price: 399, 
        period: "month", 
        screens: 4, 
        resolution: "4K UHD + Dolby", 
        devices: "TV, Firestick, Phone & Web", 
        audio: "Dolby 5.1",
        ads: "Partner Standard" 
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        { operator: "Tata Play DTH Connection", plan: "DTH + Binge Combo", claimSteps: "DTH subscribers get special discount rates starting at just ₹99/month on active connections." }
      ],
      voucherSavings: {
        provider: "Annual Billing Discount",
        discountPercent: "2 Months Free",
        effectivePrice: 2999,
        instructions: "Pay for 10 months upfront on tataplaybinge.com to get full 12 months access."
      },
      comboPass: {
        passName: "22 OTTs Aggregator Math",
        passPrice: 399,
        individualSum: 2200,
        netSavings: 1801,
        bundledWith: ["Hotstar + SonyLIV + ZEE5 + Apple TV+ + Lionsgate + Discovery+ in single app!"]
      },
      coupons: [
        { code: "BINGENEW", discount: "First Month at 50% Off", verified: true }
      ],
      officialUrl: "https://www.tataplaybinge.com/"
    }
  }
];
