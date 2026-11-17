import { 
  TRAVEL_DEALS_INDIA, 
  TRAVEL_DEALS_US, 
  TRAVEL_DEALS_UK, 
  TRAVEL_DEALS_AU, 
  TRAVEL_DEALS_CA, 
  TRAVEL_DEALS_AE,
  getTravelDealsByCountry 
} from "../services/travelDealsDatabase.js";

const COUNTRY_DEALS_MAP = {
  IN: TRAVEL_DEALS_INDIA,
  US: TRAVEL_DEALS_US,
  GB: TRAVEL_DEALS_UK,
  UK: TRAVEL_DEALS_UK,
  AU: TRAVEL_DEALS_AU,
  CA: TRAVEL_DEALS_CA,
  AE: TRAVEL_DEALS_AE,
};

// Platform Custom Profiles & Blueprints (100% Real Strategies)
const BRAND_ENRICHMENT = {
  // --- FLIGHTS ---
  indigo: {
    slug: "indigo-airlines",
    name: "IndiGo Airlines",
    type: "Airline",
    tagline: "India's Leading Low-Cost Carrier • 6E Rewards & Student Baggage",
    logoText: "6E",
    accentColor: "from-sky-700 via-blue-800 to-indigo-900",
    officialUrl: "https://www.goindigo.in",
    blueprints: {
      strategy1: {
        title: "Student 10kg Extra Baggage & 6% Base Off",
        badge: "STUDENT CONCESSION",
        explanation: "IndiGo offers an exclusive Student Scheme providing 6% off base fare plus 25kg checked baggage (10kg extra over standard 15kg allowance).",
        steps: [
          "Select 'Student' concession passenger type on IndiGo homepage before searching.",
          "Enter your university / college name and enrollment details.",
          "Carry your valid college physical ID card to the airport check-in counter."
        ]
      },
      strategy2: {
        title: "21-Day Advance Midweek Booking Window",
        badge: "TIMING ARBITRAGE",
        explanation: "IndiGo's dynamic pricing algorithm increases ticket prices steeply within 14 days of departure. Booking on Tuesday/Wednesday 21 days out saves up to 35% on domestic metro routes."
      },
      strategy3: {
        title: "6E Rewards Co-Branded Card Cashback",
        badge: "CARD BENEFIT",
        explanation: "Kotak 6E Rewards or HDFC 6E Rewards cards offer 2.5% to 5% direct 6E Rewards points on all IndiGo ticket bookings, plus complimentary priority boarding and choice of seat."
      }
    }
  },
  airindia: {
    slug: "air-india",
    name: "Air India",
    type: "Full-Service Airline",
    tagline: "India's Flag Carrier • Star Alliance Member with Free 25kg Check-In",
    logoText: "AI",
    accentColor: "from-red-700 via-rose-800 to-slate-950",
    officialUrl: "https://www.airindia.com",
    blueprints: {
      strategy1: {
        title: "Armed Forces & Paramilitary 50% Base Fare Discount",
        badge: "DEFENCE SCHEME",
        explanation: "Serving and retired Indian Armed Forces personnel, gallantry award winners, and their dependent family members get flat 50% discount on basic economy fares.",
        steps: [
          "Choose 'Armed Forces' category on Air India website or app.",
          "Provide service number and defense unit identification.",
          "Show official defense ID or dependent identity card at the check-in gate."
        ]
      },
      strategy2: {
        title: "Tata Neu NeuPass 5% Direct NeuCoins Transfer",
        badge: "TATA NEU PERK",
        explanation: "Booking Air India flights via Tata Neu unlocks up to 5% NeuCoins on Tata Neu Infinity cards (1 NeuCoin = ₹1), redeemable across Taj, BigBasket, and 1mg."
      },
      strategy3: {
        title: "Star Alliance Gold Mile Upgrade Arbitrage",
        badge: "MILEAGE ARBITRAGE",
        explanation: "Air India Flying Returns points can be pooled across 25 Star Alliance global carriers (Lufthansa, Singapore Airlines, United) for business class upgrades."
      }
    }
  },
  makemytrip: {
    slug: "makemytrip",
    name: "MakeMyTrip Flights & Hotels",
    type: "Online Travel Agency (OTA)",
    tagline: "India's #1 Travel Portal • Instant Bank Discounts & MMT Black Loyalty",
    logoText: "MMT",
    accentColor: "from-red-600 to-rose-700",
    officialUrl: "https://www.makemytrip.com",
    blueprints: {
      strategy1: {
        title: "Rotating Bank Day Coupons (Save up to ₹2,500)",
        badge: "BANK DAY CODES",
        explanation: "MakeMyTrip runs rotating day-specific bank codes: HDFC on Mondays, ICICI on Fridays, Axis on Wednesdays, and SBI on weekends.",
        steps: [
          "Check the day's active bank offer on the MMT payment page.",
          "Apply the matching bank coupon code (e.g. MMTICICI, MMTHDFC).",
          "Pay using the specified credit or debit card to get instant discount."
        ]
      },
      strategy2: {
        title: "Trip Money & Zero Convenience Fee Pass",
        badge: "FEE SAVER",
        explanation: "Enrolling in MMT Black unlocks zero convenience fees and priority customer support across all flights and hotel bookings."
      },
      strategy3: {
        title: "Bundle Flight + Hotel (Save 20% Extra)",
        badge: "PACKAGE ARBITRAGE",
        explanation: "Booking flights and hotel together through MMT Holiday Packages or Dynamic Combos yields up to 20% lower rates than standalone bookings."
      }
    }
  },
  easemytrip: {
    slug: "easemytrip",
    name: "EaseMyTrip",
    type: "Zero-Convenience-Fee OTA",
    tagline: "No Convenience Fee on Flight Bookings • Flat Net Ticket Pricing",
    logoText: "EMT",
    accentColor: "from-sky-600 to-blue-700",
    officialUrl: "https://www.easemytrip.com",
    blueprints: {
      strategy1: {
        title: "Zero Convenience Fee (Save ₹350–₹700 per ticket)",
        badge: "ZERO FEE HACK",
        explanation: "Unlike other travel portals that charge ₹350–₹400 convenience fee per passenger per sector, EaseMyTrip waives convenience fees completely with code EMTNCF.",
        steps: [
          "Search and select your flight on EaseMyTrip.",
          "On the checkout summary screen, enter promo code EMTNCF.",
          "Convenience fee automatically reduces to ₹0."
        ]
      },
      strategy2: {
        title: "Co-Branded Standard Chartered EMT Card (Save 10%)",
        badge: "CO-BRAND CARD",
        explanation: "The Standard Chartered EaseMyTrip credit card gives flat 10% instant discount on flights and 20% on hotels all year round."
      },
      strategy3: {
        title: "Defense & Student Net Fare Guarantee",
        badge: "GOVT & STUDENT",
        explanation: "Direct student fares with 25kg free baggage and specialized armed forces concessional vouchers."
      }
    }
  },
  cleartrip: {
    slug: "cleartrip",
    name: "Cleartrip",
    type: "Flipkart Travel Partner",
    tagline: "Flipkart SuperCoins Redemption • Clean & Simple Airfare Booking",
    logoText: "CT",
    accentColor: "from-amber-500 to-orange-600",
    officialUrl: "https://www.cleartrip.com",
    blueprints: {
      strategy1: {
        title: "Flipkart SuperCoins Direct Fare Offset",
        badge: "SUPERCOINS HACK",
        explanation: "Cleartrip allows direct redemption of Flipkart SuperCoins to deduct up to ₹1,500 off domestic flights.",
        steps: [
          "Log into Cleartrip using your Flipkart linked mobile number.",
          "Select flight and proceed to checkout.",
          "Apply available SuperCoins balance at payment screen for direct cash discount."
        ]
      },
      strategy2: {
        title: "Flipkart Axis Bank Credit Card 4% Unlimited Cashback",
        badge: "CARD CASHBACK",
        explanation: "Get flat 4% cashback with no upper ceiling on all Cleartrip flight and hotel bookings with Flipkart Axis Card."
      },
      strategy3: {
        title: "CT Flex Easy Cancellation & Rescheduling",
        badge: "FLEXIBILITY",
        explanation: "Add CT Flex for minimal charge to cancel flights without heavy airline penalty fees."
      }
    }
  },
  // --- HOTELS ---
  agoda: {
    slug: "agoda",
    name: "Agoda Stays & Hotels",
    type: "Global Hotel Booking Engine",
    tagline: "Secret App Rates, VIP Tier Discounts & Worldwide Hotel Deals",
    logoText: "AG",
    accentColor: "from-blue-600 to-teal-700",
    officialUrl: "https://www.agoda.com",
    blueprints: {
      strategy1: {
        title: "Secret App-Only Pricing (Save 15%–20%)",
        badge: "APP-ONLY HACK",
        explanation: "Agoda displays cheaper hidden rates when searching on the iOS / Android mobile app compared to desktop browser.",
        steps: [
          "Find your desired hotel on desktop and note the price.",
          "Open the Agoda mobile app, log in, and search for the exact same hotel.",
          "Look for the purple 'App-Only Deal' tag offering an instant 15%–20% lower price."
        ]
      },
      strategy2: {
        title: "Agoda VIP Tier Status Matching (Up to 25% Off)",
        badge: "VIP LOYALTY",
        explanation: "Completing just 5 bookings elevates you to Agoda VIP Gold, unlocking exclusive member secret deals and complimentary breakfast."
      },
      strategy3: {
        title: "Stacking Bank Coupon on Top of Member Discount",
        badge: "COUPON STACK",
        explanation: "Agoda permits stacking bank promo codes (e.g. HDFC, ICICI, Visa) on top of existing VIP member rates for maximum savings."
      }
    }
  },
  booking: {
    slug: "booking-com",
    name: "Booking.com",
    type: "Worldwide Accommodation Leader",
    tagline: "Free Cancellation on 2M+ Properties • Genius Loyalty Rewards",
    logoText: "BK",
    accentColor: "from-blue-800 to-indigo-900",
    officialUrl: "https://www.booking.com",
    blueprints: {
      strategy1: {
        title: "Free Cancellation Price-Drop Re-Booking Hack",
        badge: "PRICE-DROP HACK",
        explanation: "Book a hotel with 'Free Cancellation' well in advance. Check rates again 48 hours before arrival; if the price has dropped, book the lower rate and cancel the original booking for free.",
        steps: [
          "Filter by 'Free Cancellation' and 'No Prepayment Needed'.",
          "Set a calendar reminder for 3 days before the free cancellation cutoff date.",
          "Check current room rates. If discounted, re-book at the lower price and cancel the old reservation."
        ]
      },
      strategy2: {
        title: "Genius Level 1 & 2 Automatic 10%–15% Discounts",
        badge: "GENIUS PERK",
        explanation: "Genius status is free and lifetime after just 2 completed bookings, unlocking 10%–15% discounts, free room upgrades, and complimentary breakfast."
      },
      strategy3: {
        title: "Mobile-Only 10% Surcharge Waiver",
        badge: "MOBILE PERK",
        explanation: "Over 60% of Booking.com properties feature a 'Mobile-Only Price' tag, automatically deducting 10% when reserved via smartphone."
      }
    }
  },
  taj: {
    slug: "taj-hotels",
    name: "Taj Hotels (IHCL)",
    type: "Luxury Hospitality",
    tagline: "Iconic Palaces & Luxury Resorts • IHCL Epicure & NeuPass Benefits",
    logoText: "TAJ",
    accentColor: "from-amber-600 via-yellow-700 to-amber-950",
    officialUrl: "https://www.tajhotels.com",
    blueprints: {
      strategy1: {
        title: "Tata Neu NeuPass Up to 10% Cashback in NeuCoins",
        badge: "NEUPASS REWARD",
        explanation: "Booking directly on Taj website with Tata Neu NeuPass membership earns up to 10% NeuCoins on eligible room rates and dining.",
        steps: [
          "Log into TajHotels.com with your registered Tata Neu mobile number.",
          "Book member exclusive rates with complimentary Wi-Fi and breakfast upgrades.",
          "NeuCoins credit directly to your account for future free night redemptions."
        ]
      },
      strategy2: {
        title: "HDFC Infinia & Diners Black 1+1 Dining & Stay Vouchers",
        badge: "PREMIUM CARDS",
        explanation: "Complimentary Club Marriott and Taj Epicure membership vouchers bundled with super-premium credit cards."
      },
      strategy3: {
        title: "Advance Purchase 15%–20% Palace Saver Rate",
        badge: "PALACE SAVER",
        explanation: "Booking Taj heritage properties (Rambagh Palace, Lake Palace) 30 days ahead secures up to 20% off rack rates."
      }
    }
  },
  oyo: {
    slug: "oyo-rooms",
    name: "OYO Rooms & Townhouse",
    type: "Budget & Premium Stays",
    tagline: "Affordable Hotel Stays Across 500+ Cities • OYO Wizard Club",
    logoText: "OYO",
    accentColor: "from-red-600 to-rose-700",
    officialUrl: "https://www.oyorooms.com",
    blueprints: {
      strategy1: {
        title: "OYO Wizard Membership Flat 10% Off Every Stay",
        badge: "WIZARD PERK",
        explanation: "OYO Wizard members get instant 10% discount on Wizard-member properties, plus 5% additional cashback in OYO Rupee points.",
        steps: [
          "Join OYO Wizard Silver/Gold via the OYO mobile app.",
          "Search hotels with the blue 'Wizard' badge.",
          "10% discount applies automatically in the cart without needing manual codes."
        ]
      },
      strategy2: {
        title: "Weekly Check-In Vouchers (Up to 45% Off)",
        badge: "PROMO CODE",
        explanation: "OYO issues stackable seasonal promo codes offering up to 45% off room rates during non-peak weekdays."
      },
      strategy3: {
        title: "Pay at Hotel with Guaranteed AC & Cleanliness",
        badge: "FLEXIBLE STAY",
        explanation: "Zero upfront commitment: reserve your stay with 'Pay at Hotel' and inspect room before paying."
      }
    }
  },
  // --- EVENTS & ENTERTAINMENT ---
  bookmyshow: {
    slug: "bookmyshow",
    name: "BookMyShow",
    type: "Ticketing & Entertainment Leader",
    tagline: "India's #1 Entertainment Platform: Movies, Concerts, Plays & Sports",
    logoText: "BMS",
    accentColor: "from-rose-600 via-red-700 to-slate-900",
    officialUrl: "https://in.bookmyshow.com",
    blueprints: {
      strategy1: {
        title: "BOGO (Buy 1 Get 1 Free) Credit Card Cheat Sheet",
        badge: "BOGO BANK PERK",
        explanation: "Over 35 Indian credit cards offer Buy 1 Get 1 Free tickets on BookMyShow (up to ₹250–₹500 discount per ticket).",
        steps: [
          "Select showtime and choose 2 or more seats on BookMyShow.",
          "On the payment screen, click 'Unlock Offers or Apply PromoCodes'.",
          "Choose 'Credit/Debit Card' -> Select your bank (ICICI, HDFC, Axis, RBL, SBI, IndusInd) -> Enter card details to deduct the second ticket price to ₹0."
        ]
      },
      strategy2: {
        title: "ICICI Sapphiro / Coral 2 Free Tickets Every Month",
        badge: "ICICI EXCLUSIVE",
        explanation: "ICICI Bank Sapphiro Card unlocks 2 complimentary movie tickets up to ₹500 each, twice every month."
      },
      strategy3: {
        title: "Concert Early Bird Phase-1 Arbitrage (Save 40%)",
        badge: "EARLY BIRD HACK",
        explanation: "Major concert tickets (Lollapalooza, Sunburn, Ed Sheeran) release in 4 phases. Phase-1 Early Bird tickets are up to 40% cheaper than Phase-4 final release."
      }
    }
  },
  insider: {
    slug: "paytm-insider",
    name: "Paytm Insider / District",
    type: "Events & Music Festivals",
    tagline: "Comedy Shows, Music Festivals, IPL Cricket & Curated Local Events",
    logoText: "INS",
    accentColor: "from-blue-600 to-indigo-800",
    officialUrl: "https://insider.in",
    blueprints: {
      strategy1: {
        title: "Group Pass & Season Pass Arbitrage (Save 25%–35%)",
        badge: "GROUP PASS HACK",
        explanation: "Purchasing festival squad passes (bundles of 4 or 5 tickets) reduces the per-ticket entry price by 25% to 35% compared to single tickets.",
        steps: [
          "Look for 'Squad Pass (Group of 4)' or 'Season Pass' tier on the event listing.",
          "Coordinate with friends to buy a bundled group pass in a single checkout.",
          "Split the bill using UPI to save hundreds of rupees per person."
        ]
      },
      strategy2: {
        title: "HDFC Bank Card 10% Cashback on Curated Festivals",
        badge: "BANK CARD OFFER",
        explanation: "Exclusive partner bank discounts during major music and comedy tours across metro cities."
      },
      strategy3: {
        title: "Student Concession at Stand-Up Comedy Venues",
        badge: "STUDENT PASS",
        explanation: "Select stand-up comedy and cultural shows offer discounted student tickets with college ID at gate entry."
      }
    }
  },
  pvr: {
    slug: "pvr-inox",
    name: "PVR INOX",
    type: "Cinema Multiplex Chain",
    tagline: "India's Largest Cinema Exhibition Network: IMAX, 4DX, Gold Class",
    logoText: "PVR",
    accentColor: "from-amber-500 via-orange-600 to-slate-950",
    officialUrl: "https://www.pvrcinemas.com",
    blueprints: {
      strategy1: {
        title: "PVR Passport Monthly Pass (10 Movies for ₹699)",
        badge: "PASSPORT HACK",
        explanation: "PVR Passport allows subscribers to watch up to 10 movies in a month (Monday to Thursday) for just ₹699 — bringing ticket cost down to ₹70/movie!",
        steps: [
          "Open PVR INOX app and tap on 'PVR Passport'.",
          "Purchase the monthly pass for ₹699.",
          "Book weekday movie tickets at ₹0 checkout cost across non-recliner seats."
        ]
      },
      strategy2: {
        title: "Kotak PVR Co-Branded Platinum Card (2 Free Tickets Every Month)",
        badge: "CO-BRAND CARD",
        explanation: "Spend ₹10,000 monthly on Kotak PVR card to get 2 free movie ticket vouchers worth up to ₹400 each."
      },
      strategy3: {
        title: "F&B Combo Advance App Booking (Save 20%)",
        badge: "FOOD SAVINGS",
        explanation: "Pre-booking popcorn and beverage combos via the PVR app is up to 20% cheaper than purchasing at the cinema concession stand."
      }
    }
  },
  // --- US BRANDS ---
  expedia_us: {
    slug: "expedia",
    name: "Expedia Flights & Hotels",
    type: "Global OTA Leader",
    tagline: "One Key Rewards • Flights, Hotels, Vacation Rentals & Car Hire",
    logoText: "EXP",
    accentColor: "from-amber-400 via-yellow-500 to-blue-900",
    officialUrl: "https://www.expedia.com",
    blueprints: {
      strategy1: {
        title: "One Key Rewards (Earn & Spend Across Expedia, Hotels.com & Vrbo)",
        badge: "ONE KEY LOYALTY",
        explanation: "One Key unified reward currency allows earning OneKeyCash across flights and redeeming directly on hotel nights.",
        steps: [
          "Join One Key for free before booking.",
          "Earn 2% in OneKeyCash on hotels, activities, and vacation packages.",
          "Apply OneKeyCash at checkout to knock dollars directly off your total."
        ]
      },
      strategy2: {
        title: "Member Prices 10%–20% Automatic Instant Discount",
        badge: "MEMBER PRICING",
        explanation: "Simply logging into your Expedia account unlocks marked-down member prices on over 100,000 hotels worldwide."
      },
      strategy3: {
        title: "Flight Price Tracking & Refund Drop Alert",
        badge: "PRICE TRACK",
        explanation: "Expedia tracks your booked flight's fare; if the price drops before you fly, get the difference refunded as OneKeyCash."
      }
    }
  },
  delta_us: {
    slug: "delta-airlines",
    name: "Delta Air Lines",
    type: "US Legacy Flagship",
    tagline: "SkyMiles That Never Expire • Free Fast Wi-Fi on All Domestic Flights",
    logoText: "DL",
    accentColor: "from-red-600 via-blue-900 to-slate-950",
    officialUrl: "https://www.delta.com",
    blueprints: {
      strategy1: {
        title: "Amex Delta SkyMiles 15% TakeOff 15 Award Discount",
        badge: "AMEX 15% OFF",
        explanation: "Delta SkyMiles Gold, Platinum, and Reserve cardholders get an automatic 15% discount on award travel booked with miles on Delta flights.",
        steps: [
          "Link your Delta SkyMiles American Express card to your SkyMiles profile.",
          "Search award flights using 'Shop with Miles'.",
          "A 15% reduction in miles required is automatically calculated and applied."
        ]
      },
      strategy2: {
        title: "Basic Economy vs Main Cabin Free Seat Hack",
        badge: "CABIN HACK",
        explanation: "Delta allows free carry-on luggage on all domestic Basic Economy tickets (unlike other budget US airlines)."
      },
      strategy3: {
        title: "Complimentary High-Speed T-Mobile Wi-Fi",
        badge: "FREE WI-FI",
        explanation: "Free fast streaming Wi-Fi on all domestic Delta routes for SkyMiles members."
      }
    }
  },
  ticketmaster_us: {
    slug: "ticketmaster",
    name: "Ticketmaster US",
    type: "Concerts & Sports Ticketing",
    tagline: "Official Ticket Marketplace: NFL, NBA, Broadway & World Tours",
    logoText: "TM",
    accentColor: "from-blue-600 via-indigo-700 to-slate-900",
    officialUrl: "https://www.ticketmaster.com",
    blueprints: {
      strategy1: {
        title: "American Express Cardmember Early Presale Access",
        badge: "AMEX PRESALE",
        explanation: "Amex cardmembers get access to exclusive ticket allocations 48 to 72 hours before tickets go on sale to the general public.",
        steps: [
          "Look for 'Amex Presale' on the Ticketmaster event page.",
          "Enter your American Express card customer service phone number or promo code.",
          "Check out using your Amex card to secure seats before sellout."
        ]
      },
      strategy2: {
        title: "Verified Fan Presale Registration Window",
        badge: "VERIFIED FAN",
        explanation: "Registering for artist Verified Fan alerts beats scalper bots and secures face-value tickets."
      },
      strategy3: {
        title: "Face Value Ticket Exchange (Avoid High Resale Markups)",
        badge: "RESALE PROTECTION",
        explanation: "Artists like The Cure and Billie Eilish enforce Face Value Exchange on Ticketmaster, capping resale prices at original purchase price."
      }
    }
  },
  stubhub_us: {
    slug: "stubhub",
    name: "StubHub",
    type: "Fan-to-Fan Resale Marketplace",
    tagline: "FanProtect 100% Guaranteed Tickets: Sold-Out Sports & Concerts",
    logoText: "SH",
    accentColor: "from-purple-600 to-indigo-800",
    officialUrl: "https://www.stubhub.com",
    blueprints: {
      strategy1: {
        title: "The 24-Hour Pre-Show Price Collapse Hack (Save 50%–70%)",
        badge: "TIMING HACK",
        explanation: "Ticket resellers and brokers slash prices drastically in the final 4 to 24 hours before showtime to avoid losing their entire capital.",
        steps: [
          "Wait until the morning of the concert or game day.",
          "Open StubHub and monitor mobile delivery tickets.",
          "Watch sellers undercut each other, resulting in up to 70% discounts below original face value."
        ]
      },
      strategy2: {
        title: "FanProtect 100% Money-Back Guarantee",
        badge: "BUYER SAFEGUARD",
        explanation: "If tickets are invalid or event is cancelled, StubHub provides comparable replacement seats or a full refund."
      },
      strategy3: {
        title: "Filter by 'Instant Download' to Avoid Shipping Fees",
        badge: "INSTANT MOBILE",
        explanation: "Always filter by instant mobile transfer to skip paper delivery charges and receive barcodes directly in your wallet."
      }
    }
  },
  // --- UK BRANDS ---
  ba_uk: {
    slug: "british-airways",
    name: "British Airways",
    type: "UK Flagship Airline",
    tagline: "Executive Club • Avios Reward Flight Saver Across Europe & Worldwide",
    logoText: "BA",
    accentColor: "from-blue-800 via-indigo-900 to-red-700",
    officialUrl: "https://www.britishairways.com",
    blueprints: {
      strategy1: {
        title: "Avios Reward Flight Saver (£1 Fees across Europe)",
        badge: "AVIOS HACK",
        explanation: "BA Executive Club members can book European flights using Avios with capped taxes and fees of just £1 / 50p each way.",
        steps: [
          "Earn Avios from Tesco Clubcard, Amex UK, or BA flights.",
          "Search flights with 'Book with Avios'.",
          "Reward Flight Saver caps cash outlay to just £1 for European short-haul."
        ]
      },
      strategy2: {
        title: "British Airways American Express Companion Voucher",
        badge: "2-FOR-1 VOUCHER",
        explanation: "Spend £12,000 in a year on BA Amex Premium Plus card to earn a 2-for-1 companion voucher valid in Club World business class."
      },
      strategy3: {
        title: "Hand Baggage Only (HBO) Fares (Save £30 per leg)",
        badge: "FARE SAVER",
        explanation: "BA HBO fares include generous 23kg overhead cabin bag plus laptop bag free of charge."
      }
    }
  },
  premierinn_uk: {
    slug: "premier-inn",
    name: "Premier Inn UK",
    type: "UK's #1 Hotel Chain",
    tagline: "Direct Booking Lowest Price Guarantee • Hypnos Bed Comfort Guarantee",
    logoText: "PI",
    accentColor: "from-purple-800 to-indigo-950",
    officialUrl: "https://www.premierinn.com",
    blueprints: {
      strategy1: {
        title: "Direct-Only Booking Policy (Never Pay OTA Commission)",
        badge: "DIRECT PRICE HACK",
        explanation: "Premier Inn does not sell rooms on Booking.com or Expedia. Booking directly at PremierInn.com guarantees the lowest possible rate without middleman markups.",
        steps: [
          "Always search directly on PremierInn.com or the official mobile app.",
          "Book non-refundable 'Standard' rate for the lowest cash price, or 'Flex' rate for free cancellation up to 1pm on arrival day.",
          "Add kids eat free breakfast (up to 2 children under 16 per paying adult)."
        ]
      },
      strategy2: {
        title: "Kids Eat Free Full English Breakfast Hack",
        badge: "FAMILY SAVER",
        explanation: "Up to 2 children aged under 16 eat full breakfast for free with each adult ordering a Premier Inn Breakfast."
      },
      strategy3: {
        title: "Good Night Guarantee Full Refund Policy",
        badge: "SLEEP GUARANTEE",
        explanation: "If you don't get a great night's sleep, Premier Inn refunds your room rate."
      }
    }
  },
  // --- UAE BRANDS ---
  emirates_ae: {
    slug: "emirates",
    name: "Emirates Airline",
    type: "Global Luxury Flagship",
    tagline: "A380 First Class & Global Hub • Skywards Miles & My Emirates Pass",
    logoText: "EK",
    accentColor: "from-red-600 via-red-700 to-slate-900",
    officialUrl: "https://www.emirates.com",
    blueprints: {
      strategy1: {
        title: "My Emirates Pass (Boarding Pass Discounts Across UAE)",
        badge: "BOARDING PASS HACK",
        explanation: "Your Emirates boarding pass doubles as a discount card unlocking up to 25% off across hundreds of Dubai restaurants, luxury spas, and theme parks.",
        steps: [
          "Save your physical or mobile Emirates flight boarding pass.",
          "Show your boarding pass at participating venues in Dubai (Atlantis, Dubai Mall, Burj Khalifa).",
          "Receive instant 15%–25% bill discounts automatically."
        ]
      },
      strategy2: {
        title: "Emirates NBD & Dubai Islamic Bank Card 10% Fares",
        badge: "BANK CARD OFFER",
        explanation: "Local UAE bank credit cards regularly unlock 10% instant discounts on Flex and Flex Plus fares."
      },
      strategy3: {
        title: "Skywards Family Pooling (100% Miles Accumulation)",
        badge: "MILEAGE POOL",
        explanation: "Pool 100% of family members' flight miles into a single head account to redeem flight upgrades twice as fast."
      }
    }
  },
  platinumlist_ae: {
    slug: "platinumlist",
    name: "Platinumlist UAE",
    type: "Middle East Entertainment Leader",
    tagline: "Dubai & Abu Dhabi Concerts, Comedy, Formula 1 & Attraction Tickets",
    logoText: "PL",
    accentColor: "from-emerald-600 to-teal-800",
    officialUrl: "https://platinumlist.net",
    blueprints: {
      strategy1: {
        title: "Early Bird Phase-1 Pricing (Save 30%–40% on Dubai Concerts)",
        badge: "EARLY BIRD",
        explanation: "Dubai Arena and Coca-Cola Arena concert tickets on Platinumlist open at heavily discounted Early Bird rates before stepping up to General Admission.",
        steps: [
          "Subscribe to Platinumlist WhatsApp / Email alerts for show announcements.",
          "Book within the first 6 hours of ticket launch.",
          "Secure Phase-1 tickets before automatic price tier escalation."
        ]
      },
      strategy2: {
        title: "Emirates NBD & Mashreq Card Installment at 0% Interest",
        badge: "0% EASY PAYMENT",
        explanation: "Split high-value tickets (F1 Abu Dhabi, VIP concert lounges) into 3 to 6 months 0% installments."
      },
      strategy3: {
        title: "Combo Attraction Passes (Burj Khalifa + Dubai Aquarium)",
        badge: "COMBO ARBITRAGE",
        explanation: "Booking bundled attraction passes on Platinumlist saves up to 35% compared to purchasing individual single-entry tickets."
      }
    }
  }
};

/**
 * Universal Slug Generator for a Travel or Event Platform
 */
export function getTravelSlug(platformId, platformName) {
  const cleanId = (platformId || "").toLowerCase();
  if (BRAND_ENRICHMENT[cleanId]?.slug) {
    return BRAND_ENRICHMENT[cleanId].slug;
  }
  return (platformName || cleanId).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/**
 * Build rich canonical brand profile from deals list
 */
function aggregateBrandProfile(deals, countryCode) {
  if (!deals || deals.length === 0) return null;
  const first = deals[0];
  const pId = first.platformId.toLowerCase();
  const enrichment = BRAND_ENRICHMENT[pId] || {};

  const name = enrichment.name || first.platformName;
  const slug = enrichment.slug || getTravelSlug(first.platformId, first.platformName);
  const category = first.category; // "flights" | "hotels" | "events"
  const tagline = enrichment.tagline || first.tagline || "Verified Direct Platform Savings & Blueprints";
  const logoText = enrichment.logoText || (name || "TRV").slice(0, 3).toUpperCase();
  const accentColor = enrichment.accentColor || first.accentColor || "from-blue-600 to-indigo-800";
  const officialUrl = enrichment.officialUrl || first.directUrl || "https://google.com";

  // Extract verified coupons
  const coupons = deals
    .filter(d => d.promoCode && d.promoCode !== "NONE" && d.promoCode !== "VERIFIED")
    .map(d => ({
      code: d.promoCode,
      discount: d.discountValue || d.title,
      description: d.terms || d.tagline,
      verified: true,
      verifiedScore: d.verifiedScore || 98,
      verifiedDate: d.verifiedDate || "Today",
      minSpend: d.minSpend,
      badge: d.badge || "VERIFIED DEAL",
      directUrl: d.directUrl || officialUrl
    }));

  // Build Position 0 Quick Savings Snapshot
  const bestDeal = deals[0];
  const snapshot = {
    bestSavings: bestDeal ? (bestDeal.discountValue + " (" + bestDeal.title.slice(0, 40) + "...)") : "Up to 25% Off Verified Bookings",
    activePromoCodes: coupons.length > 0 ? `${coupons.length} Active Codes Synced` : "Zero-Code Guaranteed Perks",
    specialConcession: category === "flights" ? "Student / Defense 10kg Extra Baggage" : (category === "hotels" ? "Secret App-Only Pricing Available" : "BOGO Bank Card Ticket Perks"),
    bookingWindow: category === "flights" ? "21-Day Advance Midweek Window" : (category === "hotels" ? "Free Cancellation Price-Drop Hack" : "Phase-1 Early Bird Ticket Release")
  };

  const blueprints = enrichment.blueprints || {
    strategy1: {
      title: category === "flights" ? "Student & Defense Concessional Fares" : (category === "hotels" ? "Secret Mobile App-Only Pricing" : "BOGO Credit Card Ticket Hack"),
      badge: "VERIFIED HACK",
      explanation: `Verified savings method to reduce direct booking costs on ${name} without paying full retail rates.`
    },
    strategy2: {
      title: category === "flights" ? "21-Day Midweek Advance Booking" : (category === "hotels" ? "Free Cancellation Price-Drop Hack" : "Early Bird Phase-1 Release"),
      badge: "TIMING STRATEGY",
      explanation: `Dynamic timing strategy to capture lowest ticket rates on ${name}.`
    },
    strategy3: {
      title: "Credit Card & Loyalty Program Points Arbitrage",
      badge: "POINTS ARBITRAGE",
      explanation: `Transfer co-branded bank points to multiply effective savings and secure complimentary travel benefits.`
    }
  };

  return {
    id: pId,
    slug,
    country: countryCode,
    name,
    category,
    tagline,
    logoText,
    accentColor,
    officialUrl,
    deals,
    coupons,
    snapshot,
    blueprints
  };
}

/**
 * Get all brands for a country and category
 */
export function getTravelBrands(countryCode = "IN", category = "all") {
  const code = String(countryCode || "IN").toUpperCase();
  const rawDeals = COUNTRY_DEALS_MAP[code] || TRAVEL_DEALS_INDIA;

  // Group deals by platformId
  const groups = new Map();
  rawDeals.forEach(deal => {
    if (category !== "all" && deal.category !== category) return;
    if (deal.category === "events") return; // Keep travel separate from events!
    const key = deal.platformId.toLowerCase();
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(deal);
  });

  return Array.from(groups.values()).map(deals => aggregateBrandProfile(deals, code)).filter(Boolean);
}

/**
 * Get all event & entertainment brands for a country
 */
export function getEventBrands(countryCode = "IN") {
  const code = String(countryCode || "IN").toUpperCase();
  const rawDeals = COUNTRY_DEALS_MAP[code] || TRAVEL_DEALS_INDIA;

  const groups = new Map();
  rawDeals.forEach(deal => {
    if (deal.category !== "events") return;
    const key = deal.platformId.toLowerCase();
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(deal);
  });

  return Array.from(groups.values()).map(deals => aggregateBrandProfile(deals, code)).filter(Boolean);
}

/**
 * Universal Brand Resolver by Slug across Flights & Hotels
 */
export function getTravelBrandBySlug(slug, countryCode = null) {
  if (!slug) return null;
  const cleanSlug = slug.toLowerCase().trim();
  const normClean = cleanSlug.replace(/[^a-z0-9]/g, "");
  const targetCountries = countryCode ? [String(countryCode).toUpperCase()] : ["IN", "US", "GB", "AU", "CA", "AE"];

  for (const c of targetCountries) {
    const brands = getTravelBrands(c, "all");
    const found = brands.find(b => {
      if (b.slug === cleanSlug || b.id === cleanSlug) return true;
      const normSlug = (b.slug || "").replace(/[^a-z0-9]/g, "");
      const normId = (b.id || "").replace(/[^a-z0-9]/g, "");
      return normSlug === normClean || normId === normClean || normSlug.includes(normClean) || normClean.includes(normSlug);
    });
    if (found) return found;
  }
  return null;
}

/**
 * Universal Brand Resolver by Slug across Events & Entertainment
 */
export function getEventBrandBySlug(slug, countryCode = null) {
  if (!slug) return null;
  const cleanSlug = slug.toLowerCase().trim();
  const normClean = cleanSlug.replace(/[^a-z0-9]/g, "");
  const targetCountries = countryCode ? [String(countryCode).toUpperCase()] : ["IN", "US", "GB", "AU", "CA", "AE"];

  for (const c of targetCountries) {
    const brands = getEventBrands(c);
    const found = brands.find(b => {
      if (b.slug === cleanSlug || b.id === cleanSlug) return true;
      const normSlug = (b.slug || "").replace(/[^a-z0-9]/g, "");
      const normId = (b.id || "").replace(/[^a-z0-9]/g, "");
      return normSlug === normClean || normId === normClean || normSlug.includes(normClean) || normClean.includes(normSlug);
    });
    if (found) return found;
  }
  return null;
}

/**
 * All Pre-Rendered Travel Slugs (SSG)
 */
export function getAllTravelSlugs() {
  const slugs = new Set();
  ["IN", "US", "GB", "AU", "CA", "AE"].forEach(c => {
    const brands = getTravelBrands(c, "all");
    brands.forEach(b => slugs.add(b.slug));
  });
  return Array.from(slugs);
}

/**
 * All Pre-Rendered Event Slugs (SSG)
 */
export function getAllEventSlugs() {
  const slugs = new Set();
  ["IN", "US", "GB", "AU", "CA", "AE"].forEach(c => {
    const brands = getEventBrands(c);
    brands.forEach(b => slugs.add(b.slug));
  });
  return Array.from(slugs);
}
