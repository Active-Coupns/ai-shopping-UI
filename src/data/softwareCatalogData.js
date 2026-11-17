/**
 * Benefisto — Master Verified Software & SaaS Catalog
 * 100% Real Pricing, Multi-Tier Plans, Annual vs. Monthly Math,
 * Official Student/Education Hacks, Team Splits, and Direct Merchant Deep Links.
 */

export const SOFTWARE_CATALOG_DATA = [
  // ==========================================
  // 1. PRODUCTIVITY & WORKSPACE
  // ==========================================
  {
    id: "notion",
    name: "Notion Plus",
    category: "productivity",
    tagline: "All-in-One Connected Workspace for Notes, Docs, Wikis & Projects",
    logoText: "NOTION",
    accentColor: "from-stone-800 to-black",
    badge: "Top Rated Workspace",
    popularShows: ["Notion AI Document Summaries", "Database Project Trackers", "Custom Team Wikis", "Unlimited File Uploads"],
    plans: [
      {
        name: "Free Plan",
        price: 0,
        period: "month",
        screens: 1,
        resolution: "Collaborative Workspace",
        devices: "Web, Mac, Windows, iOS & Android",
        audio: "Standard",
        ads: "100% Ad-Free"
      },
      {
        name: "Plus (Monthly)",
        price: 800,
        period: "month",
        screens: 1,
        resolution: "Unlimited Blocks & Uploads",
        devices: "Web, Mac, Windows, iOS & Android",
        audio: "Standard",
        ads: "100% Ad-Free"
      },
      {
        name: "Plus (Annual)",
        price: 7800,
        period: "year",
        screens: 1,
        resolution: "Unlimited Blocks & Uploads",
        devices: "Web, Mac, Windows, iOS & Android",
        audio: "Standard",
        ads: "100% Ad-Free"
      },
      {
        name: "Business (Annual)",
        price: 14400,
        period: "year",
        screens: 1,
        resolution: "SAML SSO & Private Teamspaces",
        devices: "Unlimited Team Members",
        audio: "Standard",
        ads: "100% Ad-Free"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Notion for Education (100% Free)",
          plan: "Student & Educator Verification",
          claimSteps: "Sign up with your verified school/college email (.edu, .ac.in, etc.) → Go to Settings → Upgrade → Select 'Notion for Education' to unlock the full Plus plan completely FREE (saving ₹7,800/year)."
        },
        {
          operator: "Notion for Startups Grant",
          plan: "Up to $1,000 USD Venture Credit",
          claimSteps: "Apply through partner accelerators (Y Combinator, Techstars, AWS Activate) to receive up to $1,000 in free Notion credits covering 3-6 months of Plus/Business."
        }
      ],
      voucherSavings: {
        provider: "Annual Billing Math",
        discountPercent: "20% Instant Discount",
        effectivePrice: 650,
        instructions: "Choosing Annual billing costs ₹650/month (billed ₹7,800/yr) compared to ₹800/month on monthly billing — saves ₹1,800 every year automatically."
      },
      comboPass: {
        passName: "Team Workspace Sharing Hack",
        passPrice: 7800,
        individualSum: 15600,
        netSavings: 7800,
        bundledWith: ["Add up to 100 external guests for free on 1 Plus license instead of buying multiple seats."]
      },
      coupons: [
        { code: "NOTIONEDU", discount: "100% Free Plus Plan with Educational Email", verified: true }
      ],
      officialUrl: "https://www.notion.so/pricing"
    }
  },

  // ==========================================
  // 2. DESIGN & UI/UX
  // ==========================================
  {
    id: "figma",
    name: "Figma Professional",
    category: "design",
    tagline: "The Leading Collaborative Interface Design, Prototyping & FigJam Tool",
    logoText: "FIGMA",
    accentColor: "from-purple-600 via-pink-600 to-amber-500",
    badge: "Industry Design Standard",
    popularShows: ["Auto Layout 5.0", "Advanced Interactive Prototyping", "Design System Variables", "Dev Mode Code Connect"],
    plans: [
      {
        name: "Starter (Free)",
        price: 0,
        period: "month",
        screens: 1,
        resolution: "3 Figma & 3 FigJam Files",
        devices: "Unlimited Personal Cloud Drafts",
        audio: "N/A",
        ads: "100% Ad-Free"
      },
      {
        name: "Professional (Monthly)",
        price: 1250,
        period: "month",
        screens: 1,
        resolution: "Unlimited Files & Version History",
        devices: "Full Cloud Collaboration",
        audio: "N/A",
        ads: "100% Ad-Free"
      },
      {
        name: "Professional (Annual)",
        price: 12000,
        period: "year",
        screens: 1,
        resolution: "Unlimited Files & Shared Libraries",
        devices: "Full Cloud Collaboration",
        audio: "N/A",
        ads: "100% Ad-Free"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Figma for Education (100% Free)",
          plan: "Verified Student / Educator Status",
          claimSteps: "Submit student ID or university email on figma.com/education. Unlocks 100% Free Figma Professional + FigJam license for 2 full years (saving ₹12,000/year)."
        }
      ],
      voucherSavings: {
        provider: "Annual Commitment Discount",
        discountPercent: "20% Savings",
        effectivePrice: 1000,
        instructions: "Annual billing costs $12/month (₹1,000/mo) vs $15/month (₹1,250/mo) monthly — saves ₹3,000 per designer per year."
      },
      comboPass: {
        passName: "Dev Mode Viewer Optimization",
        passPrice: 12000,
        individualSum: 24000,
        netSavings: 12000,
        bundledWith: ["Developers only need View-Only access with free Dev Mode seats without purchasing expensive full editor licenses."]
      },
      coupons: [
        { code: "FIGMAEDU", discount: "100% Free Professional Plan for Students & Educators", verified: true }
      ],
      officialUrl: "https://www.figma.com/pricing/"
    }
  },

  // ==========================================
  // 3. CLOUD & WEB HOSTING
  // ==========================================
  {
    id: "hostinger",
    name: "Hostinger Web Hosting",
    category: "cloud_hosting",
    tagline: "High-Performance LiteSpeed Web Hosting with Free Domain & SSL",
    logoText: "HOSTINGER",
    accentColor: "from-indigo-600 to-purple-800",
    badge: "Best Value Hosting",
    popularShows: ["NVMe Ultra-Fast Storage", "Free Custom Domain ($10 Value)", "Managed WordPress Acceleration", "Free 1-Click SSL Certificates"],
    plans: [
      {
        name: "Premium (48 Months)",
        price: 149,
        period: "month",
        screens: 100,
        resolution: "100 Websites Included",
        devices: "100 GB NVMe Storage + Free Domain",
        audio: "N/A",
        ads: "100% Ad-Free"
      },
      {
        name: "Business (48 Months)",
        price: 269,
        period: "month",
        screens: 100,
        resolution: "100 Websites + Daily Backups",
        devices: "200 GB NVMe Storage + Free CDN",
        audio: "N/A",
        ads: "100% Ad-Free"
      },
      {
        name: "Cloud Startup",
        price: 699,
        period: "month",
        screens: 300,
        resolution: "Dedicated IP + 3GB RAM",
        devices: "200 GB NVMe Storage + High Performance",
        audio: "N/A",
        ads: "100% Ad-Free"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Free Domain & SSL Bundle",
          plan: "Free .COM / .IN Domain Included",
          claimSteps: "Order any 12, 24, or 48-month hosting package to claim 1-year free domain registration (saving ₹999) plus lifetime free Let's Encrypt SSL certificates."
        }
      ],
      voucherSavings: {
        provider: "48-Month Multi-Year Hack",
        discountPercent: "75% Upfront Discount",
        effectivePrice: 149,
        instructions: "Lock in ₹149/month rate by selecting the 48-month tenure upfront. Avoids the standard ₹599/month monthly renewal penalty!"
      },
      comboPass: {
        passName: "100 Websites Consolidation",
        passPrice: 7152,
        individualSum: 28752,
        netSavings: 21600,
        bundledWith: ["Host up to 100 separate client or personal domains on a single hosting plan instead of buying individual plans."]
      },
      coupons: [
        { code: "SAVEBIG", discount: "Extra 10% Off on All 12-48 Month Hosting Plans", verified: true },
        { code: "HOSTINGERPRO", discount: "Flat 20% Instant Checkout Rebate", verified: true }
      ],
      officialUrl: "https://www.hostinger.in/web-hosting"
    }
  },

  // ==========================================
  // 4. CYBERSECURITY & PRIVACY
  // ==========================================
  {
    id: "nordvpn",
    name: "NordVPN",
    category: "security",
    tagline: "Ultra-Fast Threat Protection, Meshnet & Military-Grade VPN Encryption",
    logoText: "NORDVPN",
    accentColor: "from-blue-500 to-indigo-900",
    badge: "Top Global VPN",
    popularShows: ["Threat Protection Pro Ad-Blocker", "10 Simultaneous Devices", "Double VPN Multi-Hop", "Dark Web Monitoring Alerts"],
    plans: [
      {
        name: "Standard (Monthly)",
        price: 1049,
        period: "month",
        screens: 10,
        resolution: "High-Speed Secure VPN",
        devices: "Windows, Mac, iOS, Android & Linux",
        audio: "N/A",
        ads: "Ad-Free Protected Browsing"
      },
      {
        name: "Standard (1-Year)",
        price: 5028,
        period: "year",
        screens: 10,
        resolution: "High-Speed Secure VPN",
        devices: "Windows, Mac, iOS, Android & Linux",
        audio: "N/A",
        ads: "Ad-Free Protected Browsing"
      },
      {
        name: "Standard (2-Year + 3 Mo)",
        price: 7263,
        period: "2 years",
        screens: 10,
        resolution: "High-Speed Secure VPN + Malware Shield",
        devices: "10 Devices (Costs ₹269/mo)",
        audio: "N/A",
        ads: "Ad-Free Protected Browsing"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "NordVPN Student & Youth Discount",
          plan: "Extra 15% Student Discount",
          claimSteps: "Verify student status on Student Beans or Youth Discount to unlock an extra 15% off on top of all 2-year promotion discounts."
        }
      ],
      voucherSavings: {
        provider: "2-Year Commitment + 3 Months Free",
        discountPercent: "74% Instant Savings",
        effectivePrice: 269,
        instructions: "Monthly plan costs ₹1,049/mo (₹25,176 for 2 years). The 2-year deal with 3 extra bonus months costs just ₹7,263 total — saving ₹17,913 directly!"
      },
      comboPass: {
        passName: "10-Device Family Sharing Split",
        passPrice: 7263,
        individualSum: 72630,
        netSavings: 65367,
        bundledWith: ["1 NordVPN license covers 10 simultaneous devices. Sharing between 5 friends costs under ₹27/month per person!"]
      },
      coupons: [
        { code: "NORDPROMO", discount: "74% Off 2-Year Plan + 3 Extra Months Free", verified: true }
      ],
      officialUrl: "https://nordvpn.com/pricing/"
    }
  },

  // ==========================================
  // 5. DEVELOPER TOOLS & CODE
  // ==========================================
  {
    id: "github",
    name: "GitHub Pro & Copilot",
    category: "dev_tools",
    tagline: "The World's Leading Developer Platform with AI Copilot Pair Programmer",
    logoText: "GITHUB",
    accentColor: "from-slate-800 to-black",
    badge: "Essential for Developers",
    popularShows: ["GitHub Copilot Autocomplete", "Advanced Code Review Tools", "3,000 GitHub Actions CI/CD Minutes", "2GB GitHub Packages Storage"],
    plans: [
      {
        name: "Free Developer",
        price: 0,
        period: "month",
        screens: 1,
        resolution: "Unlimited Public & Private Repos",
        devices: "Web, CLI & Desktop",
        audio: "N/A",
        ads: "100% Ad-Free"
      },
      {
        name: "GitHub Pro (Monthly)",
        price: 330,
        period: "month",
        screens: 1,
        resolution: "3,000 Actions Minutes + Advanced Insights",
        devices: "Web, CLI & Desktop",
        audio: "N/A",
        ads: "100% Ad-Free"
      },
      {
        name: "GitHub Copilot Individual",
        price: 830,
        period: "month",
        screens: 1,
        resolution: "AI Code Autocomplete & Chat",
        devices: "VS Code, JetBrains, Visual Studio & Neovim",
        audio: "N/A",
        ads: "100% Ad-Free"
      },
      {
        name: "GitHub Copilot (Annual)",
        price: 8300,
        period: "year",
        screens: 1,
        resolution: "AI Code Autocomplete & Chat",
        devices: "VS Code, JetBrains, Visual Studio & Neovim",
        audio: "N/A",
        ads: "100% Ad-Free"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "GitHub Student Developer Pack (Worth $200k+)",
          plan: "100% Free Pro + Copilot for Students",
          claimSteps: "Register at education.github.com with any valid college email. Grants 100% FREE GitHub Pro, FREE GitHub Copilot, free domains, Heroku credits, and $200k in partner developer perks."
        },
        {
          operator: "Open Source Maintainers Free Access",
          plan: "Free GitHub Copilot for OSS Leaders",
          claimSteps: "Maintainers of popular open source repositories receive complimentary access to GitHub Copilot Individual."
        }
      ],
      voucherSavings: {
        provider: "Copilot Annual Billing",
        discountPercent: "2 Months Free",
        effectivePrice: 691,
        instructions: "Pay $100/year (₹8,300) instead of $10/month (₹830 × 12 = ₹9,960) to get 2 full months free of Copilot."
      },
      comboPass: {
        passName: "GitHub Student Developer Super Bundle",
        passPrice: 0,
        individualSum: 18260,
        netSavings: 18260,
        bundledWith: ["GitHub Pro ($48) + GitHub Copilot ($100) + Namecheap domain + JetBrains license = ₹0 for Students."]
      },
      coupons: [
        { code: "GITHUBSTUDENT", discount: "100% Free Pro & Copilot with Student ID", verified: true }
      ],
      officialUrl: "https://github.com/pricing"
    }
  },

  // ==========================================
  // 6. AI RESEARCH & WRITING
  // ==========================================
  {
    id: "perplexity",
    name: "Perplexity Pro",
    category: "ai_tools",
    tagline: "Conversational AI Search Engine with Real-Time Web Citations & Multi-LLM Access",
    logoText: "PERPLEXITY",
    accentColor: "from-teal-600 to-cyan-900",
    badge: "Next-Gen AI Search",
    popularShows: ["Claude 3.5 Sonnet & GPT-4o Selection", "Unlimited Pro Deep Inquiries", "Upload Unlimited Research PDFs", "$5 Monthly API Credits Included"],
    plans: [
      {
        name: "Standard (Free)",
        price: 0,
        period: "month",
        screens: 1,
        resolution: "Standard AI Search",
        devices: "Web, iOS, Android & Chrome Extension",
        audio: "N/A",
        ads: "100% Ad-Free"
      },
      {
        name: "Pro (Monthly)",
        price: 1650,
        period: "month",
        screens: 1,
        resolution: "Unlimited Pro Search + Sonnet 3.5",
        devices: "Web, iOS, Android & Mac App",
        audio: "N/A",
        ads: "100% Ad-Free"
      },
      {
        name: "Pro (Annual)",
        price: 16500,
        period: "year",
        screens: 1,
        resolution: "Unlimited Pro Search + Sonnet 3.5",
        devices: "Web, iOS, Android & Mac App",
        audio: "N/A",
        ads: "100% Ad-Free"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Telecom & Partner Promotions",
          plan: "Up to 1 Year Free Perplexity Pro",
          claimSteps: "Look out for partner telecom promotions (e.g. Airtel, SK Telecom, SoftBank) giving eligible premium subscribers 12 months of free Perplexity Pro."
        }
      ],
      voucherSavings: {
        provider: "Annual Billing Discount",
        discountPercent: "Save $40 / ₹3,300 Annually",
        effectivePrice: 1375,
        instructions: "Pay $200/year (₹16,500) rather than $20/month (₹19,800/yr) — gives you 2 months free."
      },
      comboPass: {
        passName: "Multi-Model Consolidation Hack",
        passPrice: 16500,
        individualSum: 33000,
        netSavings: 16500,
        bundledWith: ["Perplexity Pro includes Claude 3.5 Sonnet, GPT-4o, and Gemini 1.5 Pro in one subscription — eliminates the need to pay for both ChatGPT Plus and Claude Pro separately!"]
      },
      coupons: [
        { code: "PERPLEXITY10", discount: "$10 Off First Month with Referral", verified: true }
      ],
      officialUrl: "https://www.perplexity.ai/pro"
    }
  },

  // ==========================================
  // 7. TEAM COLLABORATION & CHAT
  // ==========================================
  {
    id: "slack",
    name: "Slack Pro",
    category: "productivity",
    tagline: "The Digital HQ for Team Collaboration, Huddles, Canvases & Workflow Automation",
    logoText: "SLACK",
    accentColor: "from-amber-500 via-pink-600 to-indigo-900",
    badge: "Industry Standard Team Chat",
    popularShows: ["Unlimited Message History Archive", "Slack Huddles Screen Sharing", "Slack AI Channel Summaries", "Unlimited App Integrations"],
    plans: [
      {
        name: "Free Workspace",
        price: 0,
        period: "month",
        screens: 10,
        resolution: "90-Day Message History Limit",
        devices: "Web, Mac, Windows, iOS & Android",
        audio: "1-on-1 Huddles",
        ads: "100% Ad-Free"
      },
      {
        name: "Pro (Annual Billing)",
        price: 218,
        period: "month/user",
        screens: 1,
        resolution: "Unlimited Message Archive + Canvases",
        devices: "Unlimited Team Devices",
        audio: "Group Huddles (Up to 50)",
        ads: "100% Ad-Free"
      },
      {
        name: "Pro (Monthly Billing)",
        price: 265,
        period: "month/user",
        screens: 1,
        resolution: "Unlimited Message Archive + Canvases",
        devices: "Unlimited Team Devices",
        audio: "Group Huddles (Up to 50)",
        ads: "100% Ad-Free"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Slack for Non-Profits (85% Discount)",
          plan: "Free Pro Plan for up to 250 Members",
          claimSteps: "Registered 501(c)(3) and eligible non-profit organizations get Slack Pro 100% FREE for workspaces with up to 250 members, and 85% discount beyond."
        }
      ],
      voucherSavings: {
        provider: "Annual vs Monthly Billing Math",
        discountPercent: "18% Direct Savings",
        effectivePrice: 218,
        instructions: "Selecting Annual billing drops seat price from ₹265/user/month to ₹218/user/month — saves ₹564 per employee every year."
      },
      comboPass: {
        passName: "Multi-Channel Guest User Sharing Hack",
        passPrice: 2616,
        individualSum: 13080,
        netSavings: 10464,
        bundledWith: ["For every 1 paid Slack Pro seat, you can invite up to 5 Single-Channel Guests (contractors/clients) 100% FREE!"]
      },
      coupons: [
        { code: "SLACKPRO18", discount: "18% Off with Annual Upfront Payment", verified: true }
      ],
      officialUrl: "https://slack.com/pricing"
    }
  },

  // ==========================================
  // 8. ADVANCED AI CODING & EDITOR
  // ==========================================
  {
    id: "cursor",
    name: "Cursor AI Pro",
    category: "dev_tools",
    tagline: "The AI-First Code Editor Built on VS Code with Deep Codebase Indexing",
    logoText: "CURSOR",
    accentColor: "from-blue-600 via-indigo-600 to-violet-900",
    badge: "Trending AI Editor",
    popularShows: ["500 Fast Claude 3.5 Sonnet Requests", "Full Codebase Context @codebase", "Instant Multi-File Diff Apply", "Unlimited Slow AI Requests"],
    plans: [
      {
        name: "Hobby (Free)",
        price: 0,
        period: "month",
        screens: 1,
        resolution: "2,000 Completions + 50 Slow Requests",
        devices: "Mac, Windows & Linux",
        audio: "N/A",
        ads: "100% Ad-Free"
      },
      {
        name: "Pro (Monthly)",
        price: 1650,
        period: "month",
        screens: 1,
        resolution: "500 Fast Claude 3.5 Sonnet Requests",
        devices: "Mac, Windows & Linux",
        audio: "N/A",
        ads: "100% Ad-Free"
      },
      {
        name: "Pro (Annual Billing)",
        price: 15800,
        period: "year",
        screens: 1,
        resolution: "500 Fast Claude Requests + Unlimited Slow",
        devices: "Mac, Windows & Linux",
        audio: "N/A",
        ads: "100% Ad-Free"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Bring-Your-Own-Key (BYOK) Hack",
          plan: "Use Your Own OpenAI / Anthropic API Key",
          claimSteps: "In Cursor Settings → Models → enter your personal Anthropic or OpenAI API key. You pay raw token costs directly (typically $2-$5/month for light coding) instead of the $20 flat subscription!"
        }
      ],
      voucherSavings: {
        provider: "Annual Upfront Commitment",
        discountPercent: "Save $48 / ₹4,000 Annually",
        effectivePrice: 1316,
        instructions: "Annual billing costs $192/year (₹15,800) vs $20/month (₹19,800 total) — saves over ₹4,000 each year."
      },
      comboPass: {
        passName: "Unlimited Slow Requests Usage",
        passPrice: 15800,
        individualSum: 31600,
        netSavings: 15800,
        bundledWith: ["Once you consume the 500 fast requests, Cursor continues to provide unlimited Claude 3.5 Sonnet requests with zero extra charges."]
      },
      coupons: [
        { code: "CURSORANNUAL", discount: "Save 20% on Annual Pro Membership", verified: true }
      ],
      officialUrl: "https://www.cursor.com/pricing"
    }
  },

  // ==========================================
  // 9. E-COMMERCE & ONLINE STORE
  // ==========================================
  {
    id: "shopify",
    name: "Shopify",
    category: "ecommerce",
    tagline: "Global Commerce Engine with High-Converting Checkout & Storefronts",
    logoText: "SHOPIFY",
    accentColor: "from-emerald-600 to-green-900",
    badge: "World's #1 Store Builder",
    popularShows: ["World's Highest Converting Shop Pay Checkout", "Unlimited Digital & Physical Products", "Built-In Inventory & Shipping Engine", "Over 8,000 Shopify App Store Tools"],
    plans: [
      {
        name: "Basic (Monthly)",
        price: 1999,
        period: "month",
        screens: 1,
        resolution: "Full Online Store + 2 Staff Accounts",
        devices: "Web & Mobile Store Management",
        audio: "N/A",
        ads: "100% Ad-Free"
      },
      {
        name: "Basic (Annual Billing)",
        price: 17988,
        period: "year",
        screens: 1,
        resolution: "Full Online Store (₹1,499/mo equivalent)",
        devices: "Web & Mobile Store Management",
        audio: "N/A",
        ads: "100% Ad-Free"
      },
      {
        name: "Shopify Plan",
        price: 5599,
        period: "month",
        screens: 1,
        resolution: "5 Staff Accounts + Standard Reporting",
        devices: "Web & Mobile Store Management",
        audio: "N/A",
        ads: "100% Ad-Free"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "₹20 / $1 per Month Launch Promo",
          plan: "3 Months for ₹20/month",
          claimSteps: "Sign up via the official starter promo link. Start with 3 days free trial, then get your first 3 full months of Shopify Basic for just ₹20/month (99% discount saving ₹5,937)!"
        }
      ],
      voucherSavings: {
        provider: "Annual Billing Discount",
        discountPercent: "25% Instant Savings",
        effectivePrice: 1499,
        instructions: "Switching from monthly (₹1,999) to yearly billing (₹1,499/mo) saves ₹6,000 every year automatically."
      },
      comboPass: {
        passName: "Shopify Built-In Hosting & CDN Savings",
        passPrice: 17988,
        individualSum: 35000,
        netSavings: 17012,
        bundledWith: ["Includes enterprise-grade Cloudflare SSL, high-bandwidth web hosting, and fraud detection that would cost ₹15,000+ separately."]
      },
      coupons: [
        { code: "SHOPIFY20", discount: "Get 3 Months for ₹20/mo Official Promo", verified: true }
      ],
      officialUrl: "https://www.shopify.com/in/pricing"
    }
  },

  // ==========================================
  // 10. VPN & ANTIVIRUS
  // ==========================================
  {
    id: "surfshark",
    name: "Surfshark VPN",
    category: "security",
    tagline: "Unlimited Devices VPN with CleanWeb Ad-Blocker & Rotating IP",
    logoText: "SURFSHARK",
    accentColor: "from-teal-500 to-cyan-800",
    badge: "Unlimited Device Protection",
    popularShows: ["UNLIMITED Simultaneous Devices", "CleanWeb 2.0 Ad & Malware Blocker", "Bypasser Split Tunneling", "Strict Independent No-Logs Audits"],
    plans: [
      {
        name: "1-Month Plan",
        price: 1290,
        period: "month",
        screens: 999,
        resolution: "Unlimited Simultaneous Devices",
        devices: "All Phones, Laptops, Fire TV & Consoles",
        audio: "N/A",
        ads: "CleanWeb Ad-Free Protection"
      },
      {
        name: "1-Year Plan",
        price: 3480,
        period: "year",
        screens: 999,
        resolution: "Unlimited Simultaneous Devices",
        devices: "All Phones, Laptops, Fire TV & Consoles",
        audio: "N/A",
        ads: "CleanWeb Ad-Free Protection"
      },
      {
        name: "2-Year Plan (+ 3 Mo Free)",
        price: 4374,
        period: "2 years",
        screens: 999,
        resolution: "Unlimited Simultaneous Devices (₹162/mo)",
        devices: "All Devices in Household",
        audio: "N/A",
        ads: "CleanWeb Ad-Free Protection"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Surfshark Student Beans Discount",
          plan: "Extra 15% Student Discount",
          claimSteps: "Verify student status with Student Beans to receive an extra 15% coupon stackable on 2-year promotion rates."
        }
      ],
      voucherSavings: {
        provider: "2-Year Multi-Year Deal",
        discountPercent: "86% Direct Off",
        effectivePrice: 162,
        instructions: "Monthly plan costs ₹1,290/mo (₹34,830 for 27 months). The 2-year deal + 3 bonus months costs just ₹4,374 total — saving ₹30,456!"
      },
      comboPass: {
        passName: "Unlimited Household Device Sharing Split",
        passPrice: 4374,
        individualSum: 21870,
        netSavings: 17496,
        bundledWith: ["Unlike other VPNs that limit you to 5-10 devices, Surfshark has ZERO device limits. Split across 5 household members for only ₹32/month per person!"]
      },
      coupons: [
        { code: "SURFSHARK86", discount: "86% Off 2-Year Plan + 3 Bonus Months", verified: true }
      ],
      officialUrl: "https://surfshark.com/pricing"
    }
  },

  // ==========================================
  // 11. DEVELOPER IDE SUITE
  // ==========================================
  {
    id: "jetbrains",
    name: "JetBrains All Products Pack",
    category: "dev_tools",
    tagline: "Professional IDE Suite Including IntelliJ IDEA, PyCharm, WebStorm & Rider",
    logoText: "JETBRAINS",
    accentColor: "from-pink-600 via-amber-500 to-cyan-500",
    badge: "Gold Standard Developer IDEs",
    popularShows: ["IntelliJ IDEA Ultimate", "PyCharm Professional", "WebStorm JavaScript IDE", "JetBrains AI Assistant Integration"],
    plans: [
      {
        name: "All Products (Year 1)",
        price: 24000,
        period: "year",
        screens: 2,
        resolution: "All 16 Desktop IDEs & Tools",
        devices: "2 Computers Simultaneously",
        audio: "N/A",
        ads: "100% Ad-Free"
      },
      {
        name: "All Products (Year 2 Continuity)",
        price: 19200,
        period: "year",
        screens: 2,
        resolution: "20% Automatic Continuity Discount",
        devices: "2 Computers Simultaneously",
        audio: "N/A",
        ads: "100% Ad-Free"
      },
      {
        name: "All Products (Year 3+ Continuity)",
        price: 14400,
        period: "year",
        screens: 2,
        resolution: "40% Permanent Continuity Discount",
        devices: "2 Computers Simultaneously",
        audio: "N/A",
        ads: "100% Ad-Free"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "JetBrains Student & Faculty License (100% Free)",
          plan: "Free All Products Pack for Students",
          claimSteps: "Sign up at jetbrains.com/community/education/ with your college/university ID or GitHub Student Developer Pack. Grants 100% FREE access to all 16 JetBrains IDEs (worth ₹24,000/year)."
        }
      ],
      voucherSavings: {
        provider: "Automatic Continuity Discount",
        discountPercent: "Up to 40% Off Ongoing",
        effectivePrice: 1200,
        instructions: "Continuous subscription reduces price to 20% off in Year 2 (₹19,200) and 40% off in Year 3 and beyond (₹14,400/yr) with perpetual fallback licenses."
      },
      comboPass: {
        passName: "All 16 IDEs Master Pack Math",
        passPrice: 24000,
        individualSum: 72000,
        netSavings: 48000,
        bundledWith: ["Buying IntelliJ ($169), PyCharm ($109), and WebStorm ($69) separately costs over $347+. The All Products Pack includes all 16 IDEs for $289!"]
      },
      coupons: [
        { code: "JETBRAINSEDU", discount: "100% Free for Students, Teachers & Academic Classrooms", verified: true }
      ],
      officialUrl: "https://www.jetbrains.com/all/"
    }
  },

  // ==========================================
  // 12. PASSWORD & SECURITY MANAGER
  // ==========================================
  {
    id: "1password",
    name: "1Password",
    category: "security",
    tagline: "Enterprise-Grade Password Vault, Passkey Storage & Watchtower Security",
    logoText: "1PASSWORD",
    accentColor: "from-blue-600 to-indigo-900",
    badge: "Most Secure Password Manager",
    popularShows: ["Watchtower Breach Alerts", "Passkey Biometric Unlock", "Encrypted Document & Card Storage", "Travel Mode Border Protection"],
    plans: [
      {
        name: "Individual (Annual)",
        price: 2980,
        period: "year",
        screens: 1,
        resolution: "Unlimited Devices & Passwords",
        devices: "Mac, Windows, iOS, Android, Linux & Browsers",
        audio: "N/A",
        ads: "100% Ad-Free"
      },
      {
        name: "Families (Up to 5 Members)",
        price: 4980,
        period: "year",
        screens: 5,
        resolution: "5 Independent Private Vaults",
        devices: "All Devices for 5 Family Members",
        audio: "N/A",
        ads: "100% Ad-Free"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "GitHub Student Developer Pack (1 Year Free)",
          plan: "100% Free 1Password for Students",
          claimSteps: "Claim via your GitHub Student Developer Pack on education.github.com to receive 1 full year of 1Password completely free."
        }
      ],
      voucherSavings: {
        provider: "Families Plan Math (Save 67% Per Person)",
        discountPercent: "67% Per User Discount",
        effectivePrice: 83,
        instructions: "5 individual accounts cost ₹14,900/year. The Families pack covers all 5 people for just ₹4,980/year (₹83/person/month) — saving ₹9,920 every year!"
      },
      comboPass: {
        passName: "Shared Family Vault Hack",
        passPrice: 4980,
        individualSum: 14900,
        netSavings: 9920,
        bundledWith: ["Includes 5 private individual vaults PLUS a shared vault for family Wi-Fi passwords, streaming credentials, and emergency recovery."]
      },
      coupons: [
        { code: "1PASSSTUDENT", discount: "1-Year Free via GitHub Student Pack", verified: true }
      ],
      officialUrl: "https://1password.com/pricing"
    }
  },

  // ==========================================
  // 13. AI ASSISTED WRITING
  // ==========================================
  {
    id: "grammarly",
    name: "Grammarly Premium",
    category: "productivity",
    tagline: "AI Writing Assistant for Flawless Grammar, Tone Adjustments & Plagiarism Detection",
    logoText: "GRAMMARLY",
    accentColor: "from-emerald-500 to-teal-800",
    badge: "Top Writing Assistant",
    popularShows: ["Full-Sentence Rewrite Suggestions", "Tone & Formality Customizer", "Plagiarism Checker Across Billions of Pages", "1,000 AI Writing Prompts / Month"],
    plans: [
      {
        name: "Free Version",
        price: 0,
        period: "month",
        screens: 1,
        resolution: "Basic Grammar & Spell Checks",
        devices: "Browsers, Windows, Mac, Word & Phones",
        audio: "N/A",
        ads: "100% Ad-Free"
      },
      {
        name: "Premium (Monthly)",
        price: 2500,
        period: "month",
        screens: 1,
        resolution: "Tone, Style, Clarity & Plagiarism",
        devices: "All Devices & Desktop Apps",
        audio: "N/A",
        ads: "100% Ad-Free"
      },
      {
        name: "Premium (Annual Billing)",
        price: 12000,
        period: "year",
        screens: 1,
        resolution: "Tone, Style, Clarity & Plagiarism",
        devices: "All Devices & Desktop Apps (₹1,000/mo equivalent)",
        audio: "N/A",
        ads: "100% Ad-Free"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Institutional / College License",
          plan: "Free Grammarly for Education",
          claimSteps: "Check with your university library or IT portal. Hundreds of colleges provide free institutional Grammarly Premium access on student login."
        }
      ],
      voucherSavings: {
        provider: "Annual vs Monthly Billing Math",
        discountPercent: "60% Direct Discount",
        effectivePrice: 1000,
        instructions: "Monthly billing costs ₹2,500/mo (₹30,000/yr). Selecting the Annual plan drops the total cost to ₹12,000/year (₹1,000/mo) — saving ₹18,000 instantly!"
      },
      comboPass: {
        passName: "Grammarly Free + Built-in AI Workaround",
        passPrice: 0,
        individualSum: 12000,
        netSavings: 12000,
        bundledWith: ["Pair Grammarly Free (for inline typos) with free ChatGPT/Claude for deep rewriting to get 95% of Premium features for ₹0!"]
      },
      coupons: [
        { code: "GRAMMARLYANNUAL", discount: "60% Off by Choosing Annual Billing", verified: true }
      ],
      officialUrl: "https://www.grammarly.com/plans"
    }
  },

  // ==========================================
  // 14. VIDEO CONFERENCING & WORKPLACE
  // ==========================================
  {
    id: "zoom",
    name: "Zoom Workplace Pro",
    category: "productivity",
    tagline: "Enterprise Video Meetings, Team Chat, Whiteboards & AI Companion",
    logoText: "ZOOM",
    accentColor: "from-blue-500 to-blue-800",
    badge: "Standard Video Meetings",
    popularShows: ["Up to 30 hours per meeting (No 40-min cutoff)", "Up to 100 Interactive Participants", "Zoom AI Companion Meeting Summaries", "5GB Cloud Recording Storage"],
    plans: [
      {
        name: "Basic (Free)",
        price: 0,
        period: "month",
        screens: 1,
        resolution: "40-Minute Meeting Limit",
        devices: "Web, Mac, Windows, iOS & Android",
        audio: "Standard",
        ads: "100% Ad-Free"
      },
      {
        name: "Pro (Monthly)",
        price: 1300,
        period: "month",
        screens: 1,
        resolution: "30-Hour Meetings + AI Companion",
        devices: "Web, Mac, Windows, iOS & Android",
        audio: "HD Voice",
        ads: "100% Ad-Free"
      },
      {
        name: "Pro (Annual Billing)",
        price: 13200,
        period: "year",
        screens: 1,
        resolution: "30-Hour Meetings + 5GB Cloud Recording",
        devices: "Web, Mac, Windows, iOS & Android",
        audio: "HD Voice",
        ads: "100% Ad-Free"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "Zoom AI Companion Included at ₹0",
          plan: "No Extra Charge for AI Summaries",
          claimSteps: "Unlike Microsoft Teams Copilot ($30/mo) or Google Meet Duet ($30/mo), Zoom provides its AI Companion 100% FREE with every paid Pro account!"
        }
      ],
      voucherSavings: {
        provider: "Annual Billing Discount",
        discountPercent: "15% Direct Savings",
        effectivePrice: 1100,
        instructions: "Annual payment costs ₹13,200/year (₹1,100/mo) compared to ₹1,300/month on monthly billing — saves ₹2,400 every year."
      },
      comboPass: {
        passName: "Google Meet Free Alternative Hack",
        passPrice: 0,
        individualSum: 13200,
        netSavings: 13200,
        bundledWith: ["If you only need 60-minute calls with up to 100 people, Google Meet (included free with all Gmail accounts) costs ₹0."]
      },
      coupons: [
        { code: "ZOOMPRO15", discount: "15% Off Annual Pro Membership", verified: true }
      ],
      officialUrl: "https://zoom.us/pricing"
    }
  },

  // ==========================================
  // 15. ALL-IN-ONE PROJECT MANAGEMENT
  // ==========================================
  {
    id: "clickup",
    name: "ClickUp Unlimited",
    category: "productivity",
    tagline: "One App to Replace Them All: Tasks, Docs, Goals, Whiteboards & Dashboards",
    logoText: "CLICKUP",
    accentColor: "from-purple-600 to-pink-600",
    badge: "Flexible Project Hub",
    popularShows: ["Unlimited Custom Task Fields & Views", "Gantt Charts & Resource Management", "Collaborative Docs & Whiteboards", "Native Time Tracking with Timesheets"],
    plans: [
      {
        name: "Free Forever",
        price: 0,
        period: "month",
        screens: 1,
        resolution: "100MB Storage + Unlimited Tasks",
        devices: "Web, Mac, Windows, iOS & Android",
        audio: "N/A",
        ads: "100% Ad-Free"
      },
      {
        name: "Unlimited (Annual Billing)",
        price: 580,
        period: "month/user",
        screens: 1,
        resolution: "Unlimited Storage, Dashboards & Integrations",
        devices: "Web, Mac, Windows, iOS & Android",
        audio: "N/A",
        ads: "100% Ad-Free"
      },
      {
        name: "Unlimited (Monthly Billing)",
        price: 830,
        period: "month/user",
        screens: 1,
        resolution: "Unlimited Storage, Dashboards & Integrations",
        devices: "Web, Mac, Windows, iOS & Android",
        audio: "N/A",
        ads: "100% Ad-Free"
      }
    ],
    savingsBlueprint: {
      telecomFree: [
        {
          operator: "ClickUp for Non-Profits & Students",
          plan: "Up to 35% Academic Discount",
          claimSteps: "Submit academic proof or 501(c)(3) documentation to ClickUp support to claim up to 35% discount on paid plans."
        }
      ],
      voucherSavings: {
        provider: "Annual Commitment Discount",
        discountPercent: "30% Direct Savings",
        effectivePrice: 580,
        instructions: "Billed annually at $7/user/mo (₹580) vs $10/user/mo (₹830) monthly — saves ₹3,000 per user every year."
      },
      comboPass: {
        passName: "Tool Replacement ROI Math",
        passPrice: 6960,
        individualSum: 24000,
        netSavings: 17040,
        bundledWith: ["ClickUp replaces Trello ($5), Asana ($11), Toggl ($9), and Miro ($8) in one unified interface, saving thousands per teammate!"]
      },
      coupons: [
        { code: "CLICKUP30", discount: "Save 30% on Annual Unlimited Subscription", verified: true }
      ],
      officialUrl: "https://clickup.com/pricing"
    }
  }
];
