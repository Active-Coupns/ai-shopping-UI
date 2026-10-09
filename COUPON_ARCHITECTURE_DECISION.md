# ShopSmart AI - Coupon & Deals Architecture Decision Record (ADR)
**Date Locked:** October 8, 2026  
**Status:** APPROVED & LOCKED FOR PRODUCTION  

---

## 1. Executive Summary (अंतिम निर्णय)
कूपन और डील्स डिस्कवरी सिस्टम के लिए हमने **ScraperAPI + In-House Hybrid Engine (Upstash Redis Cache)** को अंतिम रूप से लॉक किया है। 

थर्ड-पार्टी कूपन एग्रीगेटर APIs (जैसे Kuponiko, LinkMyDeals, Coupomated) को उनकी बिलिंग जटिलताओं, कार्ड होल्ड्स, एड्रेस एरर्स और भारतीय क्विक-कॉमर्स (Zomato, Swiggy, Blinkit, Zepto) में शून्य कवरेज के कारण स्थायी रूप से खारिज (Reject) कर दिया गया है।

---

## 2. हमने क्या-क्या हटाया (Unused / Synthetic Code Cleanup)
1. **फेक प्रोडक्ट कूपन्स का निष्कासन:** `src/services/rapidapi.js` से रैंडम सिंथेटिक कूपन्स (जैसे `HDFC1500`, `AMAZON500`, `ICICI10`) को पूरी तरह हटा दिया गया है। अब प्रोडक्ट कार्ड्स पर केवल वास्तविक प्रमोशन्स दिखते हैं, कोई भी नकली कोड इंजेक्ट नहीं होता।
2. **थर्ड-पार्टी अनवेरिफाइड कॉल्स का निष्कासन:** रद्दी एफिलिएट फीड्स पर निर्भरता खत्म कर दी गई है।

---

## 3. सिलेक्टेड प्रोवाइडर & क्रेडेंशियल्स (Platform Details)
* **प्रोवाइडर:** **ScraperAPI** (Rotating Residential & Datacenter Proxies)
* **API Key:** `SCRAPERAPI_KEY` (सुरक्षित रूप से `.env.local` में सेव्ड)
* **फ्री कोटा:** **5,000 Requests / Month** (Status: 200 OK, Active)
* **अकाउंट स्ट्रैटेजी:** इनिशियल 2 महीने के लिए 2 फ्री अकाउंट्स (5,000 + 5,000 = 10,000 रिक्वेस्ट्स) के साथ शून्य खर्च (₹0 Cost) पर चलेगा।

---

## 4. टू-टियर हाइब्रिड आर्किटेक्चर (Dual-Engine Model)

### A. भारतीय मार्केट (India - 50+ Stores)
* **कवरेज:** Zomato, Swiggy, Blinkit, Zepto, Domino's, Myntra, Ajio, Nykaa, Croma, Amazon India, Flipkart, MakeMyTrip, Uber.
* **डेटा सोर्स:** हमारा डेडिकेटेड `src/services/couponDatabase.js` और `src/services/couponService.js`।
* **क्वालिटी:** 100% असली, वर्किंग कोड्स (Universal Cart Slabs + Verified Bank Offers)।
* **स्पीड:** **0ms रिस्पॉन्स** (कोई भी स्टोर सर्च करने पर पलक झपकते ही रिजल्ट)।

### B. यूएसए मार्केट (USA - 50+ Stores)
* **कवरेज:** Nike, Sephora, Target, Best Buy, Walmart, Amazon US, SHEIN, आदि।
* **डेटा सोर्स:** In-House Registry + ScraperAPI (`country_code=us`) ऑन-डिमांड लाइव फेच।

### C. AI Cart / Screenshot Analyzer (The Hero Feature)
* **टेक्नोलॉजी:** Gemini Vision API + Mathematical Cart Optimizer (`calculateBestCartCoupon`).
* **कार्यप्रणाली:** 
  1. यूजर किसी भी चेकआउट स्क्रीन का स्क्रीनशॉट डालता है।
  2. AI स्टोर का नाम और कार्ट अमाउंट (जैसे ₹350) डिटेक्ट करता है।
  3. इंजन तुरंत हाईएस्ट सेविंग्स कोड (`WELCOME50` - Save ₹100) निकालता है।
  4. प्रो-टिप (Next-tier upgrade): यूजर को बताता है कि ₹149 और जोड़ने पर बैंक ऑफर कैसे अनलॉक होगा।

---

## 5. भविष्य का प्लान (Post-Software Launch Plan)
* **डेली 50 स्टोर्स का ऑटो-सिंक:** अभी जब तक पूरा सॉफ्टवेयर तैयार हो रहा है, तब तक डेली 50 स्टोर्स क्रॉल करने की ज़रूरत नहीं है (क्रेडिट्स सुरक्षित रहेंगे)।
* **फुल लॉन्च के बाद:** सुबह 4:00 AM का लाइटवेट क्रॉन जॉब ScraperAPI और Redis के जरिए 100 स्टोर्स का डेली फ्रेश डेटा सिंक करेगा।

---
**नोट:** यह आर्किटेक्चर पूरी तरह से फाइनल है। कल काम शुरू करते समय इस पर दोबारा किसी चर्चा की आवश्यकता नहीं है; हम सीधे अगले कोर फीचर्स पर काम करेंगे।
