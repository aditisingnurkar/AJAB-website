export interface CafeEvent {
  id: number;
  name: string;
  nameHi: string;
  nameMr: string;
  date: string;
  dateHi: string;
  dateMr: string;
  desc: string;
  descHi: string;
  descMr: string;
  img: string;
  imgAlt: string;
  tag: string;
  tagHi: string;
  tagMr: string;
  seatsLeft: number;
  price: number;
}

export const cafeEvents: CafeEvent[] = [
  {
    id: 1,
    name: "Sufi & Qawwali Candlelit Evening",
    nameHi: "सूफ़ी और कव्वाली संगीत संध्या",
    nameMr: "सुफी व कव्वाली संगीत संध्याकाळ",
    date: "Saturday, 14 Oct · 7:00 PM – 10:00 PM",
    dateHi: "शनिवार, 14 अक्टूबर · शाम 7:00 – रात 10:00",
    dateMr: "शनिवार, १४ ऑक्टोबर · संध्याकाळी ७:०० – १०:००",
    desc: "Soulful live ghazals, sitar, and sufi melodies under candlelit café ambience with unlimited hot spiced chai and samosas.",
    descHi: "मोमबत्तियों की रौशनी में ग़ज़लें, सितार और सूफ़ी धुनें, साथ में असीमित गरम मसाला चाय और समोसे।",
    descMr: "मेणबत्त्यांच्या प्रकाशात गझल, सतार आणि सुफी संगीत, सोबत अमर्याद गरमागरम चहा आणि समोसे.",
    img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=500&fit=crop&auto=format",
    imgAlt: "Acoustic musicians playing sitar and harmonium on an intimate candlelit stage",
    tag: "Live Music & Poetry",
    tagHi: "लाइव संगीत",
    tagMr: "थेट संगीत",
    seatsLeft: 8,
    price: 450,
  },
  {
    id: 2,
    name: "Chai & Canvas Watercolour Art Workshop",
    nameHi: "चाय और कैनवास वॉटरकलर कला कार्यशाला",
    nameMr: "चहा आणि कॅनव्हास चित्रकला कार्यशाळा",
    date: "Sunday, 22 Oct · 3:30 PM – 6:30 PM",
    dateHi: "रविवार, 22 अक्टूबर · दोपहर 3:30 – शाम 6:30",
    dateMr: "रविवार, २२ ऑक्टोबर · दुपारी ३:३० – संध्याकाळी ६:३०",
    desc: "Guided botanical painting workshop with professional artists. High-grade watercolor paper, brushes, and snacks included.",
    descHi: "वरिष्ठ कलाकारों के साथ वनस्पति चित्रकला कार्यशाला। सभी रंग, ब्रश, कागज़ और नाश्ता शामिल है।",
    descMr: "व्यावसायिक कलाकारांच्या मार्गदर्शनाखाली वॉटरकलर पेंटिंग कार्यशाळा. सर्व साहित्य आणि चहा-नाश्ता समाविष्ट.",
    img: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=500&fit=crop&auto=format",
    imgAlt: "Hands painting delicate flowers with watercolours on art paper with tea cups around",
    tag: "Creative Workshop",
    tagHi: "कला कार्यशाला",
    tagMr: "कला कार्यशाळा",
    seatsLeft: 5,
    price: 650,
  },
  {
    id: 3,
    name: "Indian Single-Origin Coffee & Spice Tasting",
    nameHi: "भारतीय कॉफ़ी और मसाला चखने की मास्टरक्लास",
    nameMr: "भारतीय कॉफी आणि मसाले आस्वाद मास्टरक्लास",
    date: "Saturday, 4 Nov · 11:00 AM – 1:30 PM",
    dateHi: "शनिवार, 4 नवंबर · सुबह 11:00 – दोपहर 1:30",
    dateMr: "शनिवार, ४ नोव्हेंबर · सकाळी ११:०० – दुपारी १:३०",
    desc: "Curated multi-course sensory tasting through Malabar pepper, Pampore saffron, and organic estate Arabica roasts.",
    descHi: "मालाबार काली मिर्च, कश्मीरी केसर और चिक्कमगलुरु की ऑर्गेनिक कॉफ़ी के स्वादों का विशेष अनुभव।",
    descMr: "मलबार मिरपूड, काश्मिरी केशर आणि सेंद्रिय कॉफीच्या विविध स्वादांचा संवेदी प्रवास.",
    img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=500&fit=crop&auto=format",
    imgAlt: "Rustic wooden tasting table with small bowls of vibrant spices and aromatic tea infusions",
    tag: "Culinary Tasting",
    tagHi: "स्वादिष्ट अनुभव",
    tagMr: "आस्वाद अनुभव",
    seatsLeft: 12,
    price: 550,
  },
];
