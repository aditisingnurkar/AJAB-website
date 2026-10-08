export type Lang = "en" | "hi" | "mr";

export interface TranslationDict {
  // Navigation
  home: string;
  menu: string;
  reserve: string;
  events: string;
  about: string;
  feedback: string;
  accessibility: string;
  cart: string;
  
  // Hero & Common
  heroTitle: string;
  heroSub: string;
  viewMenu: string;
  reserveTable: string;
  orderNow: string;
  checkSeats: string;
  todaySpecial: string;
  exploreDishes: string;
  
  // Menu Filters & Headings
  menuTitle: string;
  menuSub: string;
  searchPlaceholder: string;
  categoryLabel: string;
  cuisineLabel: string;
  dietLabel: string;
  allergenShieldTitle: string;
  allergenShieldSub: string;
  excludingTag: string;
  avoidTag: string;
  dietaryTitle: string;
  dietarySub: string;
  resetFilters: string;
  all: string;
  veg: string;
  nonVeg: string;
  details: string;
  addToCart: string;
  quickAdd: string;
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
  noDishesFound: string;
  clearFilters: string;
  
  // Seasonal Widget
  seasonalGardenTitle: string;
  seasonalGardenSub: string;
  summerTab: string;
  monsoonTab: string;
  winterTab: string;
  allSeasonTab: string;
  starPick: string;
  
  // Table Reservation & Floor Plan
  floorPlanTitle: string;
  floorPlanSub: string;
  resDate: string;
  resTime: string;
  resGuests: string;
  resAmbiance: string;
  allZones: string;
  indoorZone: string;
  outdoorZone: string;
  quietZone: string;
  barZone: string;
  available: string;
  reserved: string;
  occupied: string;
  selectedTableHeading: string;
  proceedToBooking: string;
  confirmBooking: string;
  guestName: string;
  guestPhone: string;
  specialNotes: string;
  bookingSuccess: string;
  bookingSuccessSub: string;
  backToHome: string;
  
  // Cart & Orders
  yourCart: string;
  cartEmpty: string;
  subtotal: string;
  gst: string;
  packaging: string;
  total: string;
  continueOrdering: string;
  placeOrder: string;
  orderSuccess: string;
  orderSuccessSub: string;
  prepTime: string;
  
  // Rural & Data Modes
  ruralBanner: string;
  returnToStandard: string;
  lowDataMode: string;
  lowDataOn: string;
  lowDataOff: string;
  offlineStatus: string;
  offlineSub: string;
  savedMenuAvailable: string;
  viewSavedMenu: string;
  retryConnection: string;
  saveMenuOffline: string;
  
  // Senior & VI Modes
  seniorBanner: string;
  viBanner: string;
  textSize: string;
  normal: string;
  large: string;
  extraLarge: string;
  highContrast: string;
  readAloud: string;
  imageDesc: string;
}

export const T: Record<Lang, TranslationDict> = {
  en: {
    home: "Home",
    menu: "Menu",
    reserve: "Reserve",
    events: "Events",
    about: "About",
    feedback: "Feedback",
    accessibility: "Accessibility",
    cart: "Cart",
    
    heroTitle: "Warmth in every cup and corner.",
    heroSub: "AJAB blends the unhurried rhythms of Indian chai and coffee culture with authentic regional delicacies. Designed with universal accessibility for all guests.",
    viewMenu: "View Artisanal Menu",
    reserveTable: "Reserve Table Floor Plan",
    orderNow: "Order Online",
    checkSeats: "Check Live Tables",
    todaySpecial: "Today's Highlight",
    exploreDishes: "Explore Dishes",
    
    menuTitle: "AJAB Artisanal Menu",
    menuSub: "Explore 44 handcrafted dishes spanning 20 authentic culinary traditions. Clear allergen safeguards & full macro nutrition.",
    searchPlaceholder: "Search dishes (e.g., Filter Coffee, Paneer Tikka, Biryani, Dosa, Tiramisu)...",
    categoryLabel: "Category:",
    cuisineLabel: "Cuisine:",
    dietLabel: "Dietary Lifestyle:",
    allergenShieldTitle: "Allergen Safety Shield (Exclude Allergens)",
    allergenShieldSub: "Tap any allergen to instantly hide all dishes containing it:",
    excludingTag: "Excluding",
    avoidTag: "Avoid",
    dietaryTitle: "Dietary Lifestyles & Nutrition",
    dietarySub: "Filter for specific nutritional goals or faith-based dietary preferences:",
    resetFilters: "Reset All Filters",
    all: "All",
    veg: "Pure Veg",
    nonVeg: "Non-Veg",
    details: "Details & Macros",
    addToCart: "Add to Cart",
    quickAdd: "+ Quick Add",
    calories: "Calories",
    protein: "Protein",
    carbs: "Carbs",
    fats: "Fats",
    noDishesFound: "No dishes found matching your selected filters.",
    clearFilters: "Clear all filters to view full menu",
    
    seasonalGardenTitle: "AJAB Seasonal Garden",
    seasonalGardenSub: "Handcrafted seasonal pairings crafted for the current weather.",
    summerTab: "☀️ Summer Coolers",
    monsoonTab: "🌧️ Monsoon Warmers",
    winterTab: "❄️ Winter Comforts",
    allSeasonTab: "🌿 All-Season Classics",
    starPick: "Chef's Star Pick",
    
    floorPlanTitle: "Reserve Your Table at AJAB",
    floorPlanSub: "Select your preferred date, arrival time, guest count, and choose an exact table from our visual floor plan.",
    resDate: "Reservation Date",
    resTime: "Arrival Time Slot",
    resGuests: "Number of Guests",
    resAmbiance: "Seating Ambiance",
    allZones: "All Restaurant Zones",
    indoorZone: "Indoor Dining Hall",
    outdoorZone: "Garden Patio & Pergola",
    quietZone: "Heritage Quiet Alcove",
    barZone: "Barista Coffee Bar",
    available: "Available",
    reserved: "Reserved",
    occupied: "Occupied",
    selectedTableHeading: "Selected Table Details",
    proceedToBooking: "Proceed to Guest Details →",
    confirmBooking: "Confirm Table Reservation",
    guestName: "Your Full Name",
    guestPhone: "Phone Number",
    specialNotes: "Special Notes or High Chair Request",
    bookingSuccess: "Table Reservation Confirmed!",
    bookingSuccessSub: "We have reserved your table. A confirmation SMS has been dispatched.",
    backToHome: "Back to Home",
    
    yourCart: "Your AJAB Order",
    cartEmpty: "Your cart is currently empty.",
    subtotal: "Subtotal",
    gst: "GST (5%)",
    packaging: "Packaging & Service",
    total: "Total Amount",
    continueOrdering: "← Continue Ordering",
    placeOrder: "Place Order Now",
    orderSuccess: "Order Received by Kitchen!",
    orderSuccessSub: "Your food is now being freshly prepared with care.",
    prepTime: "Estimated Prep Time: 15–20 minutes",
    
    ruralBanner: "🌐 Rural & Multilingual Mode — Low Data & Regional Languages",
    returnToStandard: "← Return to Standard Website",
    lowDataMode: "Low Data Mode",
    lowDataOn: "Low Data: ON (Photos Compressed)",
    lowDataOff: "Low Data: OFF",
    offlineStatus: "You're currently offline.",
    offlineSub: "Your saved menu and details are still available offline.",
    savedMenuAvailable: "Offline Saved Menu Ready",
    viewSavedMenu: "View Saved Offline Menu",
    retryConnection: "Retry Internet Connection",
    saveMenuOffline: "📥 Save Menu for Offline Use",
    
    seniorBanner: "👓 Senior Citizen Display — High Contrast & Large Touch Buttons",
    viBanner: "👁 Visually Impaired Mode — Ultra High Contrast Dark Theme & Screen Reader ARIA",
    textSize: "Text Size",
    normal: "Normal",
    large: "Large",
    extraLarge: "Extra Large",
    highContrast: "High Contrast",
    readAloud: "Read Aloud Audio",
    imageDesc: "Image Description",
  },
  
  hi: {
    home: "होम",
    menu: "मेनू",
    reserve: "टेबल बुकिंग",
    events: "कार्यक्रम",
    about: "हमारे बारे में",
    feedback: "प्रतिक्रिया",
    accessibility: "सुलभता",
    cart: "कार्ट",
    
    heroTitle: "हर कप में गर्माहट, हर कोने में अपनापन।",
    heroSub: "AJAB में भारतीय चाय-कॉफ़ी संस्कृति और प्रामाणिक क्षेत्रीय व्यंजनों का संगम है। सभी अतिथियों की सुविधा हेतु पूर्ण सुलभता के साथ तैयार।",
    viewMenu: "पूरा मेनू देखें",
    reserveTable: "टेबल लेआउट व बुकिंग",
    orderNow: "ऑनलाइन ऑर्डर करें",
    checkSeats: "लाइव टेबल स्थिति देखें",
    todaySpecial: "आज का विशेष व्यंजन",
    exploreDishes: "स्वादिष्ट व्यंजन खोजें",
    
    menuTitle: "AJAB पारंपरिक एवं आधुनिक मेनू",
    menuSub: "20 विभिन्न शैलियों के 44 स्वादिष्ट व्यंजन। स्पष्ट एलर्जी सुरक्षा और संपूर्ण पोषण विवरण।",
    searchPlaceholder: "व्यंजन खोजें (जैसे: फ़िल्टर कॉफ़ी, पनीर टिक्का, बिरयानी, डोसा, गुलाब जामुन)...",
    categoryLabel: "श्रेणी:",
    cuisineLabel: "खान-पान शैली:",
    dietLabel: "आहार प्रकार:",
    allergenShieldTitle: "एलर्जी सुरक्षा कवच (एलर्जी वाले खाद्य बाहर करें)",
    allergenShieldSub: "किसी भी एलर्जी तत्व पर टैप करें और उससे युक्त व्यंजन तुरंत हटाएं:",
    excludingTag: "हटाया गया",
    avoidTag: "बचाव",
    dietaryTitle: "आहार शैली व पोषण",
    dietarySub: "अपनी धार्मिक या स्वास्थ्य प्राथमिकताओं के अनुसार चुनें:",
    resetFilters: "सभी फ़िल्टर हटाएं",
    all: "सभी",
    veg: "शुद्ध शाकाहारी",
    nonVeg: "मांसाहारी",
    details: "विवरण व पोषण",
    addToCart: "कार्ट में जोड़ें",
    quickAdd: "+ जोड़ें",
    calories: "कैलोरी",
    protein: "प्रोटीन",
    carbs: "कार्ब्स",
    fats: "वसा (फैट)",
    noDishesFound: "आपके चुने गए फ़िल्टर के अनुसार कोई व्यंजन नहीं मिला।",
    clearFilters: "पूरा मेनू देखने के लिए फ़िल्टर हटाएं",
    
    seasonalGardenTitle: "AJAB मौसमी बहार",
    seasonalGardenSub: "मौसम के अनुसार ताज़े और स्फूर्तिदायक व्यंजन व पेय।",
    summerTab: "☀️ ग्रीष्मकालीन पेय",
    monsoonTab: "🌧️ मानसूनी गरमाहट",
    winterTab: "❄️ शीतकालीन व्यंजन",
    allSeasonTab: "🌿 सदाबहार पसंदीदा",
    starPick: "शेफ़ की पसंद",
    
    floorPlanTitle: "AJAB में टेबल आरक्षित करें",
    floorPlanSub: "अपनी तारीख, समय और अतिथियों की संख्या चुनकर नक्शे से मनपसंद टेबल चुनें।",
    resDate: "बुकिंग की तारीख",
    resTime: "पहुंचने का समय",
    resGuests: "अतिथियों की संख्या",
    resAmbiance: "बैठने का क्षेत्र",
    allZones: "सभी क्षेत्र",
    indoorZone: "मुख्य वातानुकूलित हॉल",
    outdoorZone: "बगीचा आँगन व लाउंज",
    quietZone: "हेरिटेज शांत कोना",
    barZone: "बरिस्ता कॉफ़ी बार",
    available: "उपलब्ध",
    reserved: "आरक्षित",
    occupied: "व्यस्त",
    selectedTableHeading: "चुनी गई टेबल का विवरण",
    proceedToBooking: "अतिथि विवरण भरें →",
    confirmBooking: "टेबल बुकिंग पक्की करें",
    guestName: "आपका पूरा नाम",
    guestPhone: "मोबाइल नंबर",
    specialNotes: "विशेष अनुरोध या बच्चों की कुर्सी",
    bookingSuccess: "टेबल बुकिंग सफलतापूर्वक संपन्न!",
    bookingSuccessSub: "आपकी टेबल आरक्षित कर दी गई है। पुष्टिकरण संदेश भेज दिया गया है।",
    backToHome: "होम पेज पर वापस जाएं",
    
    yourCart: "आपका ऑर्डर",
    cartEmpty: "आपकी कार्ट अभी खाली है।",
    subtotal: "उप-योग",
    gst: "जीएसटी (5%)",
    packaging: "पैकिंग व सेवा शुल्क",
    total: "कुल देय राशि",
    continueOrdering: "← खरीदारी जारी रखें",
    placeOrder: "अभी ऑर्डर दें",
    orderSuccess: "रसोई टीम को ऑर्डर प्राप्त हुआ!",
    orderSuccessSub: "आपका भोजन ताज़ा तैयार किया जा रहा है।",
    prepTime: "अनुमानित तैयारी समय: 15–20 मिनट",
    
    ruralBanner: "🌐 ग्रामीण एवं बहुभाषी मोड — कम डेटा खपत व हिंदी भाषा",
    returnToStandard: "← मुख्य वेबसाइट पर वापस जाएं",
    lowDataMode: "कम डेटा मोड",
    lowDataOn: "कम डेटा: चालू (तस्वीरें संपीड़ित)",
    lowDataOff: "कम डेटा: बंद",
    offlineStatus: "आप अभी ऑफलाइन हैं।",
    offlineSub: "आपका सेव किया हुआ मेनू ऑफलाइन भी देखा जा सकता है।",
    savedMenuAvailable: "ऑफलाइन मेनू तैयार है",
    viewSavedMenu: "सेव किया मेनू देखें",
    retryConnection: "इंटरनेट कनेक्शन दोबारा जांचें",
    saveMenuOffline: "📥 मेनू को ऑफलाइन सेव करें",
    
    seniorBanner: "👓 वरिष्ठ नागरिक मोड — बड़े अक्षर व स्पष्ट बटन",
    viBanner: "👁 दृष्टिबाधित सहायता मोड — उच्च कंट्रास्ट डार्क थीम व स्क्रीन रीडर",
    textSize: "अक्षरों का आकार",
    normal: "सामान्य",
    large: "बड़ा",
    extraLarge: "अति विशाल",
    highContrast: "उच्च कंट्रास्ट",
    readAloud: "आवाज़ में सुनें (ऑडियो)",
    imageDesc: "तस्वीर का विवरण",
  },
  
  mr: {
    home: "होम",
    menu: "मेनू",
    reserve: "टेबल बुकिंग",
    events: "कार्यक्रम",
    about: "आमच्याबद्दल",
    feedback: "प्रतिक्रिया",
    accessibility: "सुलभता",
    cart: "कार्ट",
    
    heroTitle: "प्रत्येक कपात आपुलकी, प्रत्येक कोपऱ्यात प्रसन्नता.",
    heroSub: "AJAB मध्ये अस्सल भारतीय चहा-कॉफी संस्कृती आणि रुचकर पदार्थांचा सुरेख संगम आहे. सर्वांसाठी सोपे आणि सुलभ डिझाइन.",
    viewMenu: "संपूर्ण मेनू पहा",
    reserveTable: "टेबल लेआउट व आरक्षण",
    orderNow: "ऑनलाईन ऑर्डर करा",
    checkSeats: "लाइव्ह टेबल स्थिती",
    todaySpecial: "आजचा विशेष पदार्थ",
    exploreDishes: "रुचकर मेनू शोधा",
    
    menuTitle: "AJAB कलात्मक मेनू",
    menuSub: "२० विविध पाककृतींचे ४४ अस्सल पदार्थ. स्पष्ट ॲलर्जी माहिती आणि संपूर्ण पोषण मूल्ये.",
    searchPlaceholder: "पदार्थ शोधा (उदा: फिल्टर कॉफी, वडा पाव, मिसळ, डोसा, बिर्याणी, गुलाब जामुन)...",
    categoryLabel: "प्रवर्ग:",
    cuisineLabel: "पाककृती शैली:",
    dietLabel: "आहार प्रकार:",
    allergenShieldTitle: "ॲलर्जी सुरक्षा कवच (ॲलर्जी असणारे पदार्थ वगळा)",
    allergenShieldSub: "कोणत्याही घटकावर टॅप करून ते पदार्थ मेनूमधून लगेच लपवा:",
    excludingTag: "वगळलेले",
    avoidTag: "टाळा",
    dietaryTitle: "आहार व पोषण शैली",
    dietarySub: "तुमच्या आवडीनुसार आणि आरोग्यानुसार निवडा:",
    resetFilters: "सर्व फिल्टर्स काढा",
    all: "सर्व",
    veg: "शुद्ध शाकाहारी",
    nonVeg: "मांसाहारी",
    details: "तपशील व पोषण",
    addToCart: "कार्टमध्ये टाका",
    quickAdd: "+ जोडा",
    calories: "कॅलरीज",
    protein: "प्रथिने (प्रोटीन)",
    carbs: "कार्ब्स",
    fats: "चरबी (फॅट्स)",
    noDishesFound: "निवडलेल्या फिल्टरनुसार कोणताही पदार्थ सापडला नाही.",
    clearFilters: "सर्व पदार्थ पाहण्यासाठी फिल्टर्स काढा",
    
    seasonalGardenTitle: "AJAB ऋतू बहार",
    seasonalGardenSub: "सध्याच्या हवामानानुसार ताजेतवाने आणि चवदार पेये व खाद्यपदार्थ.",
    summerTab: "☀️ उन्हाळी थंड पेये",
    monsoonTab: "🌧️ पावसाळी गरमागरम नाश्ता",
    winterTab: "❄️ हिवाळी खास पदार्थ",
    allSeasonTab: "🌿 सदाबहार आवडीचे",
    starPick: "शेफची खास निवड",
    
    floorPlanTitle: "AJAB मध्ये टेबल आरक्षित करा",
    floorPlanSub: "तारीख, वेळ आणि व्यक्तींची संख्या निवडून नकाशावरून स्वतःचे आवडते टेबल बुक करा.",
    resDate: "आरक्षणाची तारीख",
    resTime: "पोहोचण्याची वेळ",
    resGuests: "व्यक्तींची संख्या",
    resAmbiance: "बैठक व्यवस्था",
    allZones: "सर्व विभाग",
    indoorZone: "मुख्य वातानुकूलित हॉल",
    outdoorZone: "बाग व अंगण लाउंज",
    quietZone: "हेरिटेज शांत कोपरा",
    barZone: "बरिस्ता कॉफी बार",
    available: "उपलब्ध",
    reserved: "आरक्षित",
    occupied: "भरलेले",
    selectedTableHeading: "निवडलेल्या टेबलचा तपशील",
    proceedToBooking: "माहिती भरण्यासाठी पुढे जा →",
    confirmBooking: "टेबल आरक्षण पक्के करा",
    guestName: "तुमचे पूर्ण नाव",
    guestPhone: "मोबाईल क्रमांक",
    specialNotes: "विशेष सूचना किंवा लहान मुलांची खुर्ची",
    bookingSuccess: "टेबल आरक्षण यशस्वी झाले!",
    bookingSuccessSub: "तुमचे टेबल आरक्षित करण्यात आले आहे. मोबाईलवर संदेश पाठवला आहे.",
    backToHome: "मुख्य पानावर परत जा",
    
    yourCart: "तुमची ऑर्डर",
    cartEmpty: "तुमची कार्ट सध्या रिकामी आहे.",
    subtotal: "एकूण रक्कम",
    gst: "जीएसटी (५%)",
    packaging: "पॅकिंग व सेवा",
    total: "एकूण देय रक्कम",
    continueOrdering: "← आणखी पदार्थ निवडा",
    placeOrder: "ऑर्डर कन्फर्म करा",
    orderSuccess: "ऑर्डर स्वयंपाकघरात पोहोचली!",
    orderSuccessSub: "तुमचे जेवण ताजे तयार केले जात आहे.",
    prepTime: "अंदाजे वेळ: १५–२० मिनिटे",
    
    ruralBanner: "🌐 ग्रामीण व बहुभाषिक मोड — कमी डेटा व मराठी भाषा",
    returnToStandard: "← मुख्य वेबसाइटवर परत जा",
    lowDataMode: "कमी डेटा मोड",
    lowDataOn: "कमी डेटा: चालू (फोटो कॉम्प्रेस)",
    lowDataOff: "कमी डेटा: बंद",
    offlineStatus: "तुम्ही सध्या ऑफलाइन आहात.",
    offlineSub: "तुमचा सेव्ह केलेला मेनू ऑफलाइन देखील उपलब्ध आहे.",
    savedMenuAvailable: "ऑफलाइन मेनू उपलब्ध",
    viewSavedMenu: "सेव्ह केलेला मेनू पहा",
    retryConnection: "इंटरनेट कनेक्शन पुन्हा तपासा",
    saveMenuOffline: "📥 मेनू ऑफलाइन सेव्ह करा",
    
    seniorBanner: "👓 ज्येष्ठ नागरिक मोड — मोठी अक्षरे व सुलभ बटणे",
    viBanner: "👁 दृष्टिबाधित सहाय्यक मोड — उच्च कॉन्ट्रास्ट डार्क थीम व स्क्रीन रीडर",
    textSize: "अक्षरांचा आकार",
    normal: "सामान्य",
    large: "मोठा",
    extraLarge: "अति मोठा",
    highContrast: "हाय कॉन्ट्रास्ट",
    readAloud: "आवाजात ऐका (ऑडिओ)",
    imageDesc: "चित्राचे वर्णन",
  },
};
