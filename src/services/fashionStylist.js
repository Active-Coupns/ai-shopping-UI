import { FASHION_CATALOG } from '../data/fashionCatalog.js';

// Skin tone to color harmony matrix
const COLOR_HARMONY_MATRIX = {
  fair: {
    day: ["Sky Blue", "Pastel Pink", "Mint Green", "Beige", "Lavender", "Emerald Green", "Navy"],
    night: ["Royal Blue", "Burgundy", "Emerald Green", "Black", "Wine Red", "Navy"]
  },
  wheatish: {
    day: ["Powder Blue", "Olive Green", "Beige", "Crisp White", "Mustard Yellow", "Sage Green", "Rust"],
    night: ["Navy Blue", "Maroon", "Charcoal Grey", "Black", "Royal Blue", "Deep Teal", "Burgundy"]
  },
  dusky: {
    day: ["Crisp White", "Mustard Yellow", "Warm Beige", "Olive Green", "Cobalt Blue", "Terracotta"],
    night: ["Emerald Green", "Royal Blue", "Crimson Red", "Gold & Black", "Navy", "Wine"]
  }
};

export function normalizeSkinTone(tone = "wheatish") {
  const t = String(tone).toLowerCase();
  if (t.includes("fair") || t.includes("light")) return "fair";
  if (t.includes("dusky") || t.includes("dark") || t.includes("deep")) return "dusky";
  return "wheatish";
}

export function filterWardrobe({ gender = "all", category = "all", color = "all", occasion = "all", query = "" }) {
  let list = [...FASHION_CATALOG];

  if (gender && gender !== "all") {
    list = list.filter(item => item.gender === gender);
  }

  if (category && category !== "all") {
    list = list.filter(item => item.category === category);
  }

  if (color && color !== "all") {
    const colLower = color.toLowerCase();
    list = list.filter(item => (item.color || "").toLowerCase().includes(colLower) || (item.title || "").toLowerCase().includes(colLower));
  }

  if (occasion && occasion !== "all") {
    const occLower = occasion.toLowerCase();
    list = list.filter(item => (item.occasion || "").toLowerCase().includes(occLower));
  }

  if (query && query.trim()) {
    const qLower = query.toLowerCase().trim();
    list = list.filter(item => 
      item.title.toLowerCase().includes(qLower) || 
      item.brand.toLowerCase().includes(qLower) || 
      item.category_label.toLowerCase().includes(qLower) ||
      (item.fabric || "").toLowerCase().includes(qLower)
    );
  }

  return list;
}

export async function consultFashionStylist({ userMessage = "", skinTone = "wheatish", gender = "men", isCustomPhoto = false, excludeProductIds = [] }) {
  const normalizedTone = normalizeSkinTone(skinTone);
  const effectiveGender = gender || "men";
  const rawQ = String(userMessage || "").trim();
  const q = rawQ.toLowerCase();

  // Language Detection: Pure Hindi (Devanagari), Hinglish (Roman Hindi), or English (Default)
  const isPureHindi = /[\u0900-\u097F]/.test(rawQ);
  const isHinglish = !isPureHindi && /\b(mujhe|mera|mere|meri|kya|kaun|kaunse|kaunsi|dikhao|dikhaye|chahiye|pehnu|pehnna|accha|achha|acche|achhe|acchi|achhi|batao|bataiye|kaisa|kaisi|shadi|shaadi|kurta|kurti|kapde|kapda|lagte|lagenge|lagega|hain|hoga|hogi|halke|wale|wali|karo|dekhna|batao|karein|aur|thoda|thode|dusre|naya|naye)\b/i.test(rawQ);

  // 1. Detect Occasion
  let detectedOccasion = "all";
  let occasionLabel = "Everyday & Versatile";
  let occasionMentioned = false;

  if (/office|formal|meeting|interview|corporate|kaam|work|job|ऑफिस|फॉर्मल|काम|इंटरव्यू/i.test(q)) {
    detectedOccasion = "office";
    occasionLabel = isPureHindi ? "ऑफिस और फॉर्मल मीटिंग्स" : "Office & Executive Formal";
    occasionMentioned = true;
  } else if (/wedding|shaadi|shadi|festive|haldi|sangeet|pooja|diwali|ethnic|kurta|traditional|tyohar|reception|शादी|त्योहार|हल्दी|पूजा|कुर्ता|ट्रेडिशनल|रिसेप्शन/i.test(q)) {
    detectedOccasion = "festive";
    occasionLabel = isPureHindi ? "शादी और फेस्टिव सेलिब्रेशन" : "Wedding & Festive Celebrations";
    occasionMentioned = true;
  } else if (/party|club|night|raat|pub|dinner|date|cocktail|clubbing|पार्टी|क्लब|रात|नाइट|डिनर|डेट/i.test(q)) {
    detectedOccasion = "party";
    occasionLabel = isPureHindi ? "नाइट पार्टी और सोशल इवनिंग" : "Night Party & Social Evening";
    occasionMentioned = true;
  } else if (/casual|weekend|college|daily|regular|outing|trip|beach|brunch|dost|outdoor|कॉलेज|कैजुअल|रोज|डेली|घूमने|आउटिंग/i.test(q)) {
    detectedOccasion = "casual";
    occasionLabel = isPureHindi ? "कैजुअल और वीकेंड आउटिंग" : "Casual & Weekend Outing";
    occasionMentioned = true;
  }

  // 2. Mutually Exclusive Category Flags & Classification
  const isTshirt = /\b(t-shirt|tshirt|tee|tees|t\s*shirt|oversized|drop\s*shoulder)\b|टी-शर्ट|टीशर्ट|टी\s*शर्ट/i.test(q);
  const isPolo = !isTshirt && /\bpolo\b|पोलो/i.test(q);
  const isCuban = /\b(cuban|resort|vacation\s*shirt|hawaiian)\b|क्यूबन|रिसॉर्ट/i.test(q);
  const isNehru = /\b(nehru|modi\s*jacket|waistcoat|vest)\b|नेहरू|वेस्टकोट/i.test(q);
  const isAnarkaliSharara = /\b(anarkali|sharara|garara)\b|अनारकली|शरारा|गरारा/i.test(q);
  const isCropCorset = /\b(crop|corset|bustier)\b|क्रॉप|कॉर्सेट/i.test(q);
  const isKurta = !isAnarkaliSharara && /\b(kurta|kurti|ethnic|lehenga|saree|sari)\b|कुर्ता|कुर्ती|साड़ी|साड़ी|लहंगा/i.test(q);
  const isBlazer = /\b(blazer|suit|coat|tuxedo)\b|कोट|ब्लेज़र|सूट/i.test(q);
  const isJacket = /\b(jacket|hoodie|bomber|sweatshirt)\b|जैकेट|हुडी/i.test(q);
  const isTrouser = /\b(trouser|pants|jeans|bottom|chino)\b|पैंट|ट्राउजर|जींस/i.test(q);
  const isDress = /\b(dress|dresses|maxi|frock)\b|ड्रेस|मैक्सी|फ्रॉक/i.test(q);

  // Strict shirt check: must NOT match t-shirt, polo, kurta, blazer, jacket, trouser, dress
  const isShirt = !isTshirt && !isPolo && !isKurta && !isBlazer && !isJacket && !isTrouser && !isDress && !isCuban && !isNehru && !isAnarkaliSharara && !isCropCorset && (
    /\b(shirt|shirts|linen|oxford|formal|casual\s*shirt|button\s*down)\b|शर्ट|शर्ट्स|लिनन|फॉर्मल/i.test(q) ||
    detectedOccasion === 'office'
  );

  let targetCategory = null;
  let targetKeyword = null;
  let garmentMentioned = "";

  if (isTshirt) {
    targetCategory = effectiveGender === "women" ? "women_tees" : effectiveGender === "kids" ? "boys_tees" : "drop_shoulder_tshirts";
    garmentMentioned = isPureHindi ? "ड्रॉप-शोल्डर टी-शर्ट्स" : "Drop-Shoulder Tees";
  } else if (isPolo) {
    targetCategory = effectiveGender === "kids" ? "boys_shirts" : "polos";
    garmentMentioned = isPureHindi ? "क्लासिक पोलो टी-शर्ट्स" : "Classic Polos";
  } else if (isCuban) {
    targetCategory = "men_cuban_shirts";
    garmentMentioned = isPureHindi ? "क्यूबन रिसॉर्ट शर्ट्स" : "Cuban Resort Shirts";
  } else if (isNehru) {
    targetCategory = "men_nehru_jackets";
    garmentMentioned = isPureHindi ? "नेहरू जैकेट्स & वेस्ट्स" : "Nehru Jackets & Vests";
  } else if (isAnarkaliSharara) {
    targetCategory = "women_anarkali_sharara";
    garmentMentioned = isPureHindi ? "अनारकली & शरारा सेट्स" : "Anarkali & Sharara Sets";
  } else if (isCropCorset) {
    targetCategory = "women_crop_corset";
    garmentMentioned = isPureHindi ? "क्रॉप & कॉर्सेट टॉप्स" : "Crop & Corset Tops";
  } else if (isKurta) {
    if (effectiveGender === "women") {
      targetCategory = /saree|साड़ी/i.test(q) ? "women_sarees" : /lehenga|लहंगा/i.test(q) ? "women_lehengas" : "women_kurtis";
      garmentMentioned = isPureHindi ? "कुर्ती और एथनिक वियर" : "Kurtis & Ethnic Wear";
    } else {
      targetCategory = effectiveGender === "kids" ? "boys_ethnic" : "ethnic_kurtas";
      garmentMentioned = isPureHindi ? "कुर्ता और एथनिक वियर" : "Ethnic Kurtas";
    }
  } else if (isBlazer) {
    targetCategory = effectiveGender === "women" ? "women_jackets" : effectiveGender === "kids" ? "boys_party_blazers" : "blazers_suits";
    garmentMentioned = isPureHindi ? "ब्लेज़र्स और सूट्स" : "Blazers & Suits";
  } else if (isJacket) {
    targetCategory = effectiveGender === "women" ? "women_jackets" : "jackets_hoodies";
    garmentMentioned = isPureHindi ? "जैकेट्स और हुडीज" : "Jackets & Hoodies";
  } else if (isDress && effectiveGender === "women") {
    targetCategory = "women_dresses";
    garmentMentioned = isPureHindi ? "मैक्सी ड्रेसेस" : "Maxi Dresses";
  } else if (isShirt) {
    if (/linen|लिनन/i.test(q)) {
      targetKeyword = "linen";
      targetCategory = effectiveGender === "women" ? "women_shirts" : effectiveGender === "kids" ? "boys_shirts" : "casual_shirts";
      garmentMentioned = isPureHindi ? "लिनन शर्ट्स" : "Linen Shirts";
    } else if (/formal.*shirt|oxford|spread.*collar|फॉर्मल.*शर्ट/i.test(q) || (detectedOccasion === "office" && /shirt|शर्ट/i.test(q))) {
      targetCategory = effectiveGender === "women" ? "women_shirts" : effectiveGender === "kids" ? "boys_shirts" : "formal_shirts";
      garmentMentioned = isPureHindi ? "फॉर्मल शर्ट्स" : "Formal Shirts";
    } else {
      targetCategory = effectiveGender === "women" ? "women_shirts" : effectiveGender === "kids" ? "boys_shirts" : "casual_shirts";
      garmentMentioned = isPureHindi ? "शर्ट्स" : "Shirts";
    }
  }

  // 3. Detect Style / Pattern Preferences
  let styleFilter = null;
  let styleLabel = "";
  if (/stylish|designer|trendy|cool|स्टाइलिश|ट्रेंडी|डिज़ाइनर/i.test(q)) {
    styleFilter = "stylish";
    styleLabel = isPureHindi ? "स्टाइलिश और मॉडर्न" : "Stylish & Modern";
  } else if (/check|checked|checks|चेक|चेक्स/i.test(q)) {
    styleFilter = "check";
    styleLabel = isPureHindi ? "चेक्ड पैटर्न" : "Checked Pattern";
  } else if (/print|printed|prints|प्रिंट|प्रिंटेड/i.test(q)) {
    styleFilter = "print";
    styleLabel = isPureHindi ? "प्रिंटेड कट्स" : "Printed Patterns";
  } else if (/stripe|striped|stripes|लाइन|स्ट्राइप्स/i.test(q)) {
    styleFilter = "stripe";
    styleLabel = isPureHindi ? "स्ट्राइप्ड स्टाइल" : "Striped Styling";
  } else if (/solid|plain|प्लेन|सॉलिड/i.test(q)) {
    styleFilter = "solid";
    styleLabel = isPureHindi ? "सॉलिड और मिनिमल" : "Solid & Minimal";
  }

  // 4. Detect Specific Color Request
  let specificColorRequest = null;
  let colorLabel = "";
  if (/black|dark|charcoal|kala|काले|डार्क|काला/i.test(q)) {
    specificColorRequest = "dark";
    colorLabel = isPureHindi ? "डार्क और इंटेंस शेड्स" : "Dark & Bold Shades";
  } else if (/white|safed|light|सफेद|हल्का|लाइट/i.test(q)) {
    specificColorRequest = "light";
    colorLabel = isPureHindi ? "लाइट और पेस्टल शेड्स" : "Light & Crisp Shades";
  } else if (/blue|navy|नीला|नेवी/i.test(q)) {
    specificColorRequest = "blue";
    colorLabel = isPureHindi ? "नेवी और रॉयल ब्लू" : "Navy & Royal Blue";
  } else if (/green|olive|हरा|ऑलिव/i.test(q)) {
    specificColorRequest = "green";
    colorLabel = isPureHindi ? "ऑलिव और सेज ग्रीन" : "Olive & Sage Green";
  } else if (/beige|cream|बेज|क्रीम/i.test(q)) {
    specificColorRequest = "beige";
    colorLabel = isPureHindi ? "बेज और वार्म न्यूट्रल्स" : "Beige & Warm Neutrals";
  } else if (/yellow|mustard|पीला|मस्टर्ड/i.test(q)) {
    specificColorRequest = "yellow";
    colorLabel = isPureHindi ? "मस्टर्ड और ब्राइट येलो" : "Mustard & Golden Yellow";
  } else if (/pink|gulabi|गुलाबी|पिंक/i.test(q)) {
    specificColorRequest = "pink";
    colorLabel = isPureHindi ? "पेस्टल और रोज़ पिंक" : "Pastel & Rose Pink";
  } else if (/maroon|red|wine|लाल|मरून/i.test(q)) {
    specificColorRequest = "maroon";
    colorLabel = isPureHindi ? "मरून और वाइन रेड" : "Maroon & Wine Red";
  }

  // 5. Color Harmony Matrix
  const isNight = /night|evening|dinner|party|cocktail|reception|raat|रात/i.test(q);
  const timeOfDay = isNight ? "night" : "day";
  const recommendedColors = COLOR_HARMONY_MATRIX[normalizedTone]?.[timeOfDay] || ["Olive Green", "Beige", "Navy Blue", "White"];
  const colorListStr = recommendedColors.slice(0, 3).join(", ");
  const toneHindi = normalizedTone === "fair" ? "फेयर (Fair)" : normalizedTone === "dusky" ? "डस्की (Dusky)" : "गेहुंआ / व्हीटिश (Wheatish)";
  const toneDisplay = normalizedTone.charAt(0).toUpperCase() + normalizedTone.slice(1);

  // 6. Filter & Rank Catalog Pool
  let matchingPool = FASHION_CATALOG.filter(item => item.gender === effectiveGender);

  // Strict category boundary isolation: Never mix T-shirts into Shirts or vice-versa
  if (isShirt) {
    matchingPool = matchingPool.filter(item => 
      item.category === 'formal_shirts' || 
      item.category === 'casual_shirts' || 
      item.category === 'women_shirts' || 
      item.category === 'boys_shirts'
    );
  } else if (isTshirt) {
    matchingPool = matchingPool.filter(item => 
      item.category === 'drop_shoulder_tshirts' || 
      item.category === 'women_tees' || 
      item.category === 'boys_tees'
    );
  } else if (isPolo) {
    matchingPool = matchingPool.filter(item => item.category === 'polos' || item.category === 'boys_shirts');
  } else if (isCuban) {
    matchingPool = matchingPool.filter(item => item.category === 'men_cuban_shirts');
  } else if (isNehru) {
    matchingPool = matchingPool.filter(item => item.category === 'men_nehru_jackets');
  } else if (isAnarkaliSharara) {
    matchingPool = matchingPool.filter(item => item.category === 'women_anarkali_sharara');
  } else if (isCropCorset) {
    matchingPool = matchingPool.filter(item => item.category === 'women_crop_corset');
  } else if (isKurta) {
    matchingPool = matchingPool.filter(item => 
      item.category === 'ethnic_kurtas' || 
      item.category === 'women_kurtis' || 
      item.category === 'women_sarees' || 
      item.category === 'women_lehengas' || 
      item.category === 'boys_ethnic' || 
      item.category === 'girls_ethnic'
    );
  } else if (isBlazer) {
    matchingPool = matchingPool.filter(item => item.category === 'blazers_suits' || item.category === 'women_jackets' || item.category === 'boys_party_blazers');
  } else if (isJacket) {
    matchingPool = matchingPool.filter(item => item.category === 'jackets_hoodies' || item.category === 'women_jackets');
  }

  // Refine by keyword within the category pool
  if (targetKeyword) {
    const kwMatches = matchingPool.filter(item => 
      `${item.title} ${item.fabric || ""} ${item.category} ${item.description || ""}`.toLowerCase().includes(targetKeyword)
    );
    if (kwMatches.length >= 2) matchingPool = kwMatches;
  } else if (targetCategory && !isShirt) {
    const catMatches = matchingPool.filter(item => item.category === targetCategory);
    if (catMatches.length >= 2) matchingPool = catMatches;
  } else if (isShirt && targetCategory) {
    const catMatches = matchingPool.filter(item => item.category === targetCategory);
    if (catMatches.length >= 2) matchingPool = catMatches;
  }

  // Filter by Occasion if relevant and matches exist
  if (detectedOccasion !== "all") {
    const occMatches = matchingPool.filter(item => 
      (item.occasion || "").toLowerCase().includes(detectedOccasion) ||
      (item.category_label || "").toLowerCase().includes(detectedOccasion)
    );
    if (occMatches.length >= 2) matchingPool = occMatches;
  }

  // Apply Style / Pattern Filter if present
  if (styleFilter) {
    if (styleFilter === "stylish") {
      // Prioritize stylish checked, printed, textured, spread collar pieces
      const stylishMatches = matchingPool.filter(item => 
        /check|stripe|print|pattern|spread|slim|textured|windowpane|gingham/i.test(`${item.title} ${item.description || ""}`)
      );
      if (stylishMatches.length >= 2) matchingPool = stylishMatches;
    } else if (styleFilter === "check") {
      const checkMatches = matchingPool.filter(item => /check|windowpane|gingham|tartan/i.test(`${item.title} ${item.description || ""}`));
      if (checkMatches.length >= 2) matchingPool = checkMatches;
    } else if (styleFilter === "print") {
      const printMatches = matchingPool.filter(item => /print|floral|geometric|motif/i.test(`${item.title} ${item.description || ""}`));
      if (printMatches.length >= 2) matchingPool = printMatches;
    } else if (styleFilter === "stripe") {
      const stripeMatches = matchingPool.filter(item => /stripe|striped|vertical/i.test(`${item.title} ${item.description || ""}`));
      if (stripeMatches.length >= 2) matchingPool = stripeMatches;
    } else if (styleFilter === "solid") {
      const solidMatches = matchingPool.filter(item => /solid|plain/i.test(`${item.title} ${item.description || ""}`));
      if (solidMatches.length >= 2) matchingPool = solidMatches;
    }
  }

  // Apply Specific Color Filter if requested
  if (specificColorRequest) {
    let colorMatches = [];
    if (specificColorRequest === "dark") {
      colorMatches = matchingPool.filter(item => /black|navy|charcoal|wine|maroon|dark|brown/i.test(`${item.color || ""} ${item.title}`));
    } else if (specificColorRequest === "light") {
      colorMatches = matchingPool.filter(item => /white|beige|cream|sky|light|pastel/i.test(`${item.color || ""} ${item.title}`));
    } else {
      colorMatches = matchingPool.filter(item => `${item.color || ""} ${item.title}`.toLowerCase().includes(specificColorRequest));
    }
    if (colorMatches.length >= 2) matchingPool = colorMatches;
  }

  // Exclude already shown product IDs for fresh rotation
  const unshownPool = matchingPool.filter(item => !excludeProductIds.includes(item.id));
  const finalPool = unshownPool.length >= 4 ? unshownPool : matchingPool;

  // Sort by Color Harmony & High Rating
  finalPool.sort((a, b) => {
    const aText = `${a.color || ""} ${a.title || ""}`.toLowerCase();
    const bText = `${b.color || ""} ${b.title || ""}`.toLowerCase();
    const aColorMatch = recommendedColors.some(c => aText.includes(c.toLowerCase()));
    const bColorMatch = recommendedColors.some(c => bText.includes(c.toLowerCase()));
    if (aColorMatch && !bColorMatch) return -1;
    if (!aColorMatch && bColorMatch) return 1;
    return (b.rating || 4) - (a.rating || 4);
  });

  const top4Picks = finalPool.slice(0, 4);

  // 1. Detect Broad vs Specific Query
  const isBroadQuery = !occasionMentioned && !styleFilter && !specificColorRequest && (
    /^(show|suggest|recommend|tell|dikhao|batao|chahiye|accha|achha|good|best|kuch|kuchh|kaisa|kya|mere liye|for me)/i.test(rawQ) ||
    /^(मुझे|कोई|एक|अच्छा|अच्छे|दिखाओ|बताओ|कपड़े|शर्ट)/i.test(rawQ) ||
    /^(mujhe\s+(kuch\s+)?(acche|achhe|accha|achha)\s+(shirt|kapde|kapda))/i.test(rawQ)
  ) && (!targetKeyword);

  let replyText = "";
  let followUpOptions = [];

  // 1. PURE HINDI (Devanagari Script)
  if (isPureHindi) {
    if (isBroadQuery) {
      replyText = "ज़रूर! आप किस फैब्रिक या ओकेजन के लिए शर्ट देखना पसंद करेंगे?";
      followUpOptions = [
        "🌴 लिनन शर्ट्स",
        "👔 100% कॉटन फॉर्मल्स",
        "💼 कैजुअल आउटिंग",
        "🌙 नाइट पार्टी वियर"
      ];
    } else if (styleFilter && garmentMentioned) {
      replyText = `ये रहे 4 स्टाइलिश ${garmentMentioned}। किसी पर भी क्लिक करके अपनी फोटो पर ट्राई करें!`;
      followUpOptions = [
        "✨ सॉलिड & मिनिमल",
        "🌴 लिनन कट्स",
        "👔 फॉर्मल लुक्स",
        "🎨 दूसरे कलर्स दिखाओ"
      ];
    } else if (garmentMentioned && !occasionMentioned) {
      replyText = `नीचे 4 बेस्ट ${garmentMentioned} तैयार हैं। आप यह किस ओकेजन के लिए ढूंढ रहे हैं?`;
      followUpOptions = [
        "🌴 कैजुअल / वीकेंड",
        "👔 ऑफिस / फॉर्मल",
        "✨ चेक्स & प्रिंट्स",
        "🎨 डार्क कलर्स दिखाओ"
      ];
    } else if (detectedOccasion === "office") {
      replyText = "ऑफिस और फॉर्मल मीटिंग्स के लिए ये 4 शार्प लुक्स तैयार हैं। आपको कैसा स्टाइल पसंद है?";
      followUpOptions = [
        "👔 क्लासिक फॉर्मल शर्ट्स",
        "🤵 सेमी-फॉर्मल ब्लेज़र्स",
        "🌴 लिनन वर्कवियर"
      ];
    } else if (detectedOccasion === "festive") {
      replyText = "फेस्टिव और शादी के लिए ये रिच एथनिक लुक्स तैयार हैं। डे-फंक्शन के लिए चाहिए या रिसेप्शन?";
      followUpOptions = [
        "☀️ डे-फंक्शन / हल्दी",
        "🌙 नाइट रिसेप्शन",
        "✨ सिल्क कुर्ता सेट्स"
      ];
    } else if (detectedOccasion === "party") {
      replyText = "पार्टी और नाइट-आउट के लिए ये ट्रेंडिंग लुक्स बिल्कुल परफेक्ट हैं। कौन-सा लुक ट्राई करना चाहेंगे?";
      followUpOptions = [
        "🔥 ड्रॉप-शोल्डर टीज",
        "🌴 पार्टी शर्ट्स",
        "🧥 बॉम्बर जैकेट्स"
      ];
    } else {
      replyText = "नमस्ते! आप किस ओकेजन के लिए कपड़े देखना चाहेंगे?";
      followUpOptions = [
        "👔 ऑफिस & फॉर्मल वियर",
        "✨ शादी & फेस्टिव कुर्ते",
        "🌴 लिनन & कैजुअल शर्ट्स",
        "🔥 नाइट पार्टी लुक्स"
      ];
    }
  } 
  // 2. HINGLISH (Roman Script Hindi)
  else if (isHinglish) {
    if (isBroadQuery) {
      replyText = "Zaroor! Aap kis occasion ya fabric mein shirts dekhna chahenge?";
      followUpOptions = [
        "🌴 Breathable Linen Shirts",
        "👔 100% Rich Cotton Formals",
        "💼 Casual Weekend Outing",
        "🌙 Party & Night Out"
      ];
    } else if (styleFilter && garmentMentioned) {
      replyText = `Ye rahe 4 stylish ${garmentMentioned} jo aapke frame par sharp lagenge. Click karke try-on karein!`;
      followUpOptions = [
        "✨ Solid & Minimal",
        "🌴 Textured Linen",
        "👔 Office Formals",
        "🎨 Show Darker Colors"
      ];
    } else if (garmentMentioned && !occasionMentioned) {
      replyText = `Neeche 4 best ${garmentMentioned} load kar diye hain. Aap ye kis occasion ke liye dhoondh rahe hain?`;
      followUpOptions = [
        "🌴 Casual Weekend Outing",
        "👔 Office / Semi-Formal",
        "✨ Stylish Prints & Checks",
        "🎨 Show Darker Colors"
      ];
    } else if (detectedOccasion === "office") {
      replyText = "Office & formals ke liye ye 4 crisp structured looks best rahenge. Kaunsa style pasand aaya?";
      followUpOptions = [
        "👔 Classic Formal Shirts",
        "🤵 Semi-Formal Blazers",
        "🌴 Breathable Linen Workwear"
      ];
    } else if (detectedOccasion === "festive") {
      replyText = "Wedding & festive events ke liye ye traditional looks ready hain. Day ceremony ke liye chahiye ya evening reception?";
      followUpOptions = [
        "☀️ Haldi / Daytime Kurta",
        "🌙 Night Reception Look",
        "✨ Silk Kurta Pajama Sets"
      ];
    } else if (detectedOccasion === "party") {
      replyText = "Party & night-out ke liye ye trending fits ready hain. Oversized tees pasand hain ya party shirts?";
      followUpOptions = [
        "🔥 Oversized Streetwear Tees",
        "🌴 Cuban Collar Party Shirts",
        "🧥 Bomber & Layered Jackets"
      ];
    } else {
      replyText = "Hello! Aap kis occasion ke liye outfits explore karna chahte hain?";
      followUpOptions = [
        "👔 Office & Workwear",
        "✨ Wedding & Festive Kurtas",
        "🌴 Linen & Casual Shirts",
        "🔥 Weekend Party Fits"
      ];
    }
  } 
  // 3. ENGLISH (Default / Primary Language)
  else {
    if (isBroadQuery) {
      replyText = "Sure! Which occasion or fabric are you looking for?";
      followUpOptions = [
        "🌴 Breathable Linen Shirts",
        "👔 100% Crisp Cotton Formals",
        "💼 Casual Weekend Outing",
        "🌙 Party & Night Out"
      ];
    } else if (styleFilter && garmentMentioned) {
      replyText = `Here are 4 stylish ${garmentMentioned} tailored for you. Click any look below to try it on!`;
      followUpOptions = [
        "✨ Minimal Solid",
        "🌴 Textured Linen",
        "👔 Office Formals",
        "🎨 Show Darker Colors"
      ];
    } else if (garmentMentioned && !occasionMentioned) {
      replyText = `I've loaded 4 top ${garmentMentioned} below. Which occasion are you planning to wear this for?`;
      followUpOptions = [
        "🌴 Casual Weekend Outing",
        "👔 Office / Semi-Formal",
        "✨ Stylish Checks & Prints",
        "🎨 Show Darker Colors"
      ];
    } else if (detectedOccasion === "office") {
      replyText = "Here are 4 sharp formal styles for work and meetings. Which cut do you prefer?";
      followUpOptions = [
        "👔 Classic Oxford Shirts",
        "🤵 Semi-Formal Blazers",
        "🌴 Breathable Linen Workwear"
      ];
    } else if (detectedOccasion === "festive") {
      replyText = "Here are 4 standout festive looks. Are you shopping for a daytime event or evening reception?";
      followUpOptions = [
        "☀️ Daytime Haldi / Puja",
        "🌙 Evening Reception",
        "✨ Rich Silk Kurta Sets"
      ];
    } else if (detectedOccasion === "party") {
      replyText = "Here are 4 trending night-out fits. Do you prefer streetwear tees or party shirts?";
      followUpOptions = [
        "🔥 Oversized Streetwear Tees",
        "🌴 Cuban Collar Party Shirts",
        "🧥 Bomber & Layered Jackets"
      ];
    } else {
      replyText = "Hello! What type of outfits would you like to explore today?";
      followUpOptions = [
        "👔 Office & Workwear Outfits",
        "✨ Traditional Indian Festive Kurtas",
        "🌴 Linen & Casual Shirts",
        "🔥 Weekend & Party Tees"
      ];
    }
  }

  return {
    intent: "CONSULTATIVE_ADVICE",
    assistantMessage: replyText,
    recommendedColors,
    skinTone: normalizedTone,
    targetCategory: targetCategory || (detectedOccasion === "office" ? "formal_shirts" : detectedOccasion === "festive" ? "ethnic_kurtas" : detectedOccasion === "party" ? "drop_shoulder_tshirts" : "casual_shirts"),
    recommendedProducts: top4Picks,
    suggestedQuestions: followUpOptions
  };
}
