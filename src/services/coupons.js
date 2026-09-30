/**
 * Smart Stackable Coupon & Bank Offer Engine
 * Provides active bank offers, store coupons, and Frosted Glass Gated Pro Offers.
 */

const POPULAR_BRAND_COUPONS = {
  amazon: [
    { code: "SBIINSTANT", title: "10% Instant Discount on SBI Credit Card", discount: "Up to ₹1,500 OFF", is_locked: false, badge: "BANK OFFER" },
    { code: "AMZPRO200", title: "Exclusive Pro Cashback Coupon", discount: "Flat ₹200 Cashback", is_locked: true, badge: "PRO EXCLUSIVE" }
  ],
  flipkart: [
    { code: "ICICIFEST", title: "10% Instant Savings on ICICI Bank Cards", discount: "Up to ₹1,250 OFF", is_locked: false, badge: "BANK OFFER" },
    { code: "FLIPPRO500", title: "VIP Buyer Stackable Coupon", discount: "Extra ₹500 Instant Discount", is_locked: true, badge: "PRO EXCLUSIVE" }
  ],
  zomato: [
    { code: "ZOMATO50", title: "50% OFF on First 3 Orders", discount: "Up to ₹120 OFF", is_locked: false, badge: "PUBLIC COUPON" },
    { code: "ZOMATOPRO", title: "Unlimited Free Delivery + Extra 15% OFF", discount: "15% OFF", is_locked: true, badge: "PRO EXCLUSIVE" }
  ],
  swiggy: [
    { code: "SWIGGYIT", title: "Free Delivery above ₹199", discount: "Free Shipping", is_locked: false, badge: "PUBLIC COUPON" },
    { code: "SWIGGYGOLD", title: "30% OFF on Top Gourmet Restaurants", discount: "Up to ₹150 OFF", is_locked: true, badge: "PRO EXCLUSIVE" }
  ],
  myntra: [
    { code: "MYNTRA200", title: "Flat ₹200 OFF for New Users", discount: "Flat ₹200 OFF", is_locked: false, badge: "PUBLIC COUPON" },
    { code: "MYNTRAPRO10", title: "Extra 10% Off on Premium Fashion Brands", discount: "10% OFF", is_locked: true, badge: "PRO EXCLUSIVE" }
  ]
};

const DEFAULT_COUPONS = [
  { code: "HDFC1500", title: "10% Instant Discount on HDFC Credit Cards", discount: "Up to ₹1,500 OFF", is_locked: false, badge: "BANK OFFER" },
  { code: "PROSTACK300", title: "Hidden Stackable Seller Coupon", discount: "Extra ₹300 OFF", is_locked: true, badge: "PRO EXCLUSIVE" }
];

export function getProductCoupons(storeName = "") {
  const lower = String(storeName).toLowerCase();
  for (const brand in POPULAR_BRAND_COUPONS) {
    if (lower.includes(brand)) {
      return POPULAR_BRAND_COUPONS[brand];
    }
  }
  return DEFAULT_COUPONS;
}
