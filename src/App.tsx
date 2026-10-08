import React, { useState, useEffect, useRef } from "react";
import ajabLogo from "./assets/ajab-logo.png";
import { menuItems, FoodItem } from "./data/menuData";
import { tables, TableInfo } from "./data/tableData";
import { cafeEvents, CafeEvent } from "./data/eventsData";
import { T, Lang } from "./data/translations";

/* ═══════════════════════════════════════════════════════════════════════
   TYPES & PALETTES (LUXURY DARK ESPRESSO & ARTISAN GOLD THEME)
═══════════════════════════════════════════════════════════════════════ */
type AppMode = "common" | "elderly" | "rural" | "vi";

type Screen =
  | "home" | "menu" | "food-details" | "cart"
  | "order-confirm" | "seats" | "reservation" | "reservation-confirm"
  | "events" | "about" | "feedback" | "accessibility";

interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  img: string;
}

interface ReservationDraft {
  date: string;
  time: string;
  guests: number;
  zone: "All" | "Indoor" | "Outdoor" | "Quiet Area" | "Bar Counter";
  preference: string;
  occasion: string;
  specialNotes: string;
  customerName: string;
  customerPhone: string;
}

interface VoiceFilterState {
  foodType: "All" | "Veg" | "Non-Veg";
  category: string;
  cuisine: string;
  diet: string;
  season: "All" | "summer" | "monsoon" | "winter";
  searchKeyword: string;
  badgeLabel?: string;
}

// ── Dark Espresso & Warm Amber Gold Palette (Default Overall Mode) ──
const C = {
  bg: "#120D0A",
  card: "#1C1510",
  cardHover: "#261D16",
  border: "#382A20",
  borderFocus: "#D4A359",
  text: "#FDF7F0",
  muted: "#B3A090",
  accent: "#E2A955",
  accentLight: "#F4C77D",
  cream: "#241B14",
  tag: "#2E2219",
};

const EC = {
  bg: "#18120D",
  card: "#261D15",
  border: "#855831",
  text: "#FFFDF8",
  muted: "#DBCAB6",
  accent: "#F4C77D",
  btn: "#D49B4B",
  btnText: "#120D0A",
  cream: "#1F1610",
};

const VI = {
  bg: "#0A0502",
  card: "#1A0E04",
  border: "#FFD166",
  text: "#FFFFFF",
  muted: "#FCE7B2",
  accent: "#FFD166",
  btn: "#FFD166",
  btnText: "#0A0502",
};

/* ═══════════════════════════════════════════════════════════════════════
   UI COMPONENTS
═══════════════════════════════════════════════════════════════════════ */
function AjabLogo({ size = 48, className = "" }: { size?: number; className?: string }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={`relative rounded-full overflow-hidden flex items-center justify-center shrink-0 transition-transform ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: "#1A120B",
        border: "2px solid #D4A359",
        boxShadow: "0 0 16px rgba(212,163,89,0.35)",
      }}
    >
      {!imgError ? (
        <img
          src={ajabLogo}
          alt="AJAB Logo"
          className="w-full h-full object-contain p-1"
          onError={() => setImgError(true)}
        />
      ) : (
        <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
          <circle cx="50" cy="50" r="46" stroke="#D4A359" strokeWidth="2.5" strokeDasharray="3,2" />
          <circle cx="50" cy="50" r="41" stroke="#D4A359" strokeWidth="1" />
          <text
            x="50"
            y="54"
            textAnchor="middle"
            fontFamily="'Playfair Display', Georgia, serif"
            fontSize="26"
            fontWeight="bold"
            fill="#FDF7F0"
            letterSpacing="2"
          >
            AJAB
          </text>
          <text
            x="50"
            y="70"
            textAnchor="middle"
            fontFamily="'DM Sans', sans-serif"
            fontSize="8"
            fontWeight="600"
            fill="#D4A359"
            letterSpacing="2.5"
          >
            CAFÉ
          </text>
        </svg>
      )}
    </div>
  );
}

function CBtn({
  label,
  onClick,
  variant = "primary",
  size = "md",
  full = false,
  disabled = false,
  icon,
}: {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "gold";
  size?: "sm" | "md" | "lg";
  full?: boolean;
  disabled?: boolean;
  icon?: string;
}) {
  const pad = size === "sm" ? "px-3.5 py-1.5 text-xs" : size === "lg" ? "px-6 py-3.5 text-base font-bold" : "px-5 py-2.5 text-sm";
  const bg =
    variant === "primary"
      ? {
          background: "linear-gradient(135deg, #E2A955 0%, #C48E38 100%)",
          color: "#120D0A",
          border: "none",
          boxShadow: "0 4px 16px rgba(226, 169, 85, 0.35)",
        }
      : variant === "gold"
      ? {
          background: "linear-gradient(135deg, #F4C77D 0%, #D49B4B 100%)",
          color: "#120D0A",
          border: "none",
          boxShadow: "0 4px 16px rgba(244, 199, 125, 0.35)",
        }
      : variant === "secondary"
      ? { backgroundColor: C.card, color: C.text, border: `1px solid ${C.border}` }
      : { backgroundColor: "transparent", color: C.accent, border: `1.5px solid ${C.accent}` };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`rounded-2xl font-bold cursor-pointer transition-all duration-150 inline-flex items-center justify-center gap-2 select-none hover:opacity-95 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${pad} ${full ? "w-full" : ""}`}
      style={bg}
    >
      {icon && <span>{icon}</span>}
      <span>{label}</span>
    </button>
  );
}

function CCard({ children, className = "", style = {}, onClick }: { children: React.ReactNode; className?: string; style?: React.CSSProperties; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-3xl p-6 transition-all ${onClick ? "cursor-pointer hover:shadow-xl hover:border-[#D4A359]/70 hover:-translate-y-0.5" : ""} ${className}`}
      style={{
        backgroundColor: C.card,
        border: `1px solid ${C.border}`,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function CTag({ label, color = "default" }: { label: string; color?: "default" | "green" | "red" | "gold" | "season" }) {
  const c =
    color === "green"
      ? { bg: "#14331E", text: "#4ADE80", border: "#1E542C" }
      : color === "red"
      ? { bg: "#3D1416", text: "#F87171", border: "#612225" }
      : color === "gold"
      ? { bg: "#36270E", text: "#FCD34D", border: "#5C4217" }
      : color === "season"
      ? { bg: "#3D1E0E", text: "#FB923C", border: "#693318" }
      : { bg: C.tag, text: C.text, border: C.border };

  return (
    <span
      className="text-xs font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 select-none border"
      style={{ backgroundColor: c.bg, color: c.text, borderColor: c.border }}
    >
      {label}
    </span>
  );
}

function StatusDot({ status }: { status: "available" | "reserved" | "occupied" }) {
  const map = {
    available: { bg: "#22C55E", text: "Available", light: "#102E1B", border: "#1E542C" },
    reserved: { bg: "#F59E0B", text: "Reserved", light: "#2E200C", border: "#5C4217" },
    occupied: { bg: "#EF4444", text: "Occupied", light: "#331214", border: "#612225" },
  };
  const cur = map[status] || map.available;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border" style={{ backgroundColor: cur.light, color: cur.bg, borderColor: cur.border }}>
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cur.bg }} />
      {cur.text}
    </span>
  );
}

function ReadAloudBtn({ text }: { text: string }) {
  const [speaking, setSpeaking] = useState(false);

  const speak = () => {
    if (!("speechSynthesis" in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={speak}
      aria-label="Read description aloud"
      title="Listen to description"
      className="rounded-full flex items-center justify-center p-2 cursor-pointer transition-all hover:scale-110 active:scale-95"
      style={{
        backgroundColor: speaking ? C.accent : C.cream,
        color: speaking ? "#120D0A" : C.accent,
        border: `1.5px solid ${C.accent}`,
      }}
    >
      <span className="text-sm">{speaking ? "⏹" : "🔊"}</span>
    </button>
  );
}

function FoodImage({
  src,
  alt,
  name,
  className = "w-full h-full object-cover",
}: {
  src: string;
  alt: string;
  name: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const emoji = /coffee|chai|kahwa|lassi|chaas|matcha|doodh|latte|brew/i.test(name)
    ? "☕"
    : /samosa|vada|kachori|dim sum|falafel|tikka|salad|soup|maki/i.test(name)
    ? "🥟"
    : /biryani|rice|dal|chicken|paneer|stew|curry|noodles|pasta|pizza|taco|burrito|naan|thepla|dosa/i.test(name)
    ? "🍽️"
    : /gulab|kulfi|tiramisu|sorbet|doi|halwa|churros|dessert/i.test(name)
    ? "🍮"
    : "🍴";

  if (failed) {
    return (
      <div
        role="img"
        aria-label={`${alt}. Image unavailable; showing a menu illustration instead.`}
        className={className + " flex flex-col items-center justify-center gap-2"}
        style={{ background: "linear-gradient(135deg, #241A13 0%, #17100B 100%)", color: C.accent, border: `1px solid ${C.border}` }}
      >
        <span className="text-5xl" aria-hidden="true">{emoji}</span>
        <span className="text-xs font-semibold text-center px-4" style={{ color: C.muted }}>{name}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   REALISTIC OUTSIDE SURROUNDINGS & NEIGHBORHOOD MAP (DARK CARTOGRAPHY)
═══════════════════════════════════════════════════════════════════════ */
function CafeSurroundingsMap() {
  const [activeTab, setActiveTab] = useState<"map" | "landmarks" | "transit">("map");

  return (
    <div className="rounded-3xl p-6 sm:p-8" style={{ backgroundColor: C.card, border: `2px solid ${C.border}` }}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#14331E] text-[#4ADE80] border border-[#1E542C] mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>🟢 Open Daily · 8:00 AM – 11:00 PM</span>
          </div>
          <h2 className="font-serif text-3xl font-bold" style={{ color: C.accent }}>
            Café Location &amp; Outside Surroundings
          </h2>
          <p className="text-sm mt-1" style={{ color: C.muted }}>
            12 Residency Road, Central Heritage District, Bangalore · Valet Parking Available
          </p>
        </div>

        <div className="flex rounded-2xl p-1 shrink-0" style={{ backgroundColor: C.cream, border: `1px solid ${C.border}` }}>
          {(["map", "landmarks", "transit"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-3.5 py-1.5 text-xs font-bold rounded-xl cursor-pointer transition-all capitalize"
              style={{
                backgroundColor: activeTab === tab ? C.accent : "transparent",
                color: activeTab === tab ? "#120D0A" : C.muted,
              }}
            >
              {tab === "map" ? "🗺️ Interactive Map" : tab === "landmarks" ? "🏛️ Landmarks" : "🚗 Transit &amp; Parking"}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "map" && (
        <div className="relative w-full rounded-2xl overflow-hidden shadow-inner border-2" style={{ height: 380, borderColor: C.border, backgroundColor: "#140E0A" }}>
          {/* Dark Luxury Map Canvas */}
          <svg className="w-full h-full" viewBox="0 0 900 450" preserveAspectRatio="none">
            {/* Parks / Green Areas */}
            <path d="M 0 0 L 260 0 L 240 180 L 0 140 Z" fill="#142B1A" opacity="0.9" stroke="#1E4426" strokeWidth="1" />
            <text x="50" y="70" fill="#4ADE80" fontSize="12" fontWeight="bold" fontFamily="sans-serif">🌳 CUBBON PARK (800m)</text>
            <path d="M 680 280 L 900 240 L 900 450 L 620 450 Z" fill="#142B1A" opacity="0.85" stroke="#1E4426" strokeWidth="1" />
            <text x="700" y="380" fill="#4ADE80" fontSize="11" fontWeight="bold" fontFamily="sans-serif">🌿 HERITAGE BOTANICAL VERANDAH</text>

            {/* Roads */}
            {/* MG Road Boulevard */}
            <line x1="0" y1="210" x2="900" y2="210" stroke="#2A1E16" strokeWidth="28" />
            <line x1="0" y1="210" x2="900" y2="210" stroke="#E2A955" strokeWidth="2" strokeDasharray="14,14" opacity="0.6" />
            <text x="40" y="205" fill="#E2A955" fontSize="11" fontWeight="bold" letterSpacing="2">MG ROAD BOULEVARD</text>

            {/* Residency Road */}
            <line x1="420" y1="0" x2="420" y2="450" stroke="#2A1E16" strokeWidth="34" />
            <line x1="420" y1="0" x2="420" y2="450" stroke="#E2A955" strokeWidth="2" strokeDasharray="14,14" opacity="0.6" />
            <text x="435" y="60" fill="#E2A955" fontSize="11" fontWeight="bold" letterSpacing="1.5">RESIDENCY ROAD</text>

            {/* Brigade Road */}
            <line x1="680" y1="0" x2="680" y2="450" stroke="#241912" strokeWidth="18" />
            <text x="692" y="100" fill="#A8927F" fontSize="10" fontWeight="bold">BRIGADE RD</text>

            {/* Richmond Circle Link */}
            <line x1="0" y1="360" x2="900" y2="360" stroke="#241912" strokeWidth="18" />
            <text x="80" y="354" fill="#A8927F" fontSize="10" fontWeight="bold">RICHMOND CIRCLE FLYOVER</text>

            {/* Surrounding Buildings Blocks */}
            <rect x="290" y="60" width="100" height="110" rx="8" fill="#201711" stroke="#38291F" strokeWidth="1.5" />
            <text x="305" y="120" fill="#B3A090" fontSize="10" fontWeight="bold">COMMERCIAL</text>
            <text x="305" y="135" fill="#8A7868" fontSize="9">PLAZA</text>

            <rect x="470" y="60" width="160" height="110" rx="8" fill="#201711" stroke="#38291F" strokeWidth="1.5" />
            <text x="485" y="120" fill="#B3A090" fontSize="10" fontWeight="bold">VICTORIA HERITAGE</text>
            <text x="485" y="135" fill="#8A7868" fontSize="9">MANSION</text>

            <rect x="180" y="250" width="180" height="80" rx="8" fill="#201711" stroke="#38291F" strokeWidth="1.5" />
            <text x="195" y="295" fill="#E2A955" fontSize="10" fontWeight="bold">METRO STATION (250m)</text>
            <text x="195" y="310" fill="#8A7868" fontSize="9">MG Road Purple Line</text>

            {/* AJAB CAFE PLOT (Glowing Dark Roast Highlight) */}
            <rect x="460" y="240" width="180" height="90" rx="14" fill="#3D200E" stroke="#E2A955" strokeWidth="2.5" />
            <text x="480" y="276" fill="#FDF7F0" fontSize="14" fontWeight="bold" fontFamily="serif" letterSpacing="1.5">AJAB CAFÉ</text>
            <text x="480" y="295" fill="#F4C77D" fontSize="10" fontWeight="bold">12 Residency Rd · Entrance</text>
            <text x="480" y="312" fill="#B3A090" fontSize="9">Valet Parking &amp; Ramp Access</text>

            {/* Radar Pulse on AJAB Pin */}
            <circle cx="440" cy="285" r="16" fill="#E2A955" opacity="0.35" className="animate-ping" />
            <circle cx="440" cy="285" r="8" fill="#E2A955" />
          </svg>

          {/* Floating Directions Card */}
          <div className="absolute bottom-4 left-4 p-3.5 rounded-2xl backdrop-blur-md border shadow-lg max-w-xs" style={{ backgroundColor: "rgba(28, 21, 16, 0.95)", borderColor: C.border }}>
            <p className="font-bold text-xs" style={{ color: C.accent }}>📍 How to reach AJAB:</p>
            <p className="text-[11px] mt-1 leading-relaxed" style={{ color: C.muted }}>
              • 3 min walk from MG Road Metro (Exit Gate 2)<br />
              • Complimentary Valet Parking at Café Gate 1<br />
              • 100% Step-free wheelchair accessible ramp
            </p>
          </div>
        </div>
      )}

      {activeTab === "landmarks" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in">
          <div className="p-4 rounded-2xl" style={{ backgroundColor: C.cream, border: `1px solid ${C.border}` }}>
            <span className="text-2xl mb-1 block">🚇</span>
            <h4 className="font-bold text-sm" style={{ color: C.accent }}>MG Road Metro Station</h4>
            <p className="text-xs mt-1" style={{ color: C.muted }}>250m walk (Purple Line). Direct connectivity to Indiranagar, Majestic, and Whitefield.</p>
          </div>
          <div className="p-4 rounded-2xl" style={{ backgroundColor: C.cream, border: `1px solid ${C.border}` }}>
            <span className="text-2xl mb-1 block">🌳</span>
            <h4 className="font-bold text-sm" style={{ color: C.accent }}>Cubbon Park &amp; Library</h4>
            <p className="text-xs mt-1" style={{ color: C.muted }}>800m away. Perfect for morning strolls followed by our South Indian Filter Coffee.</p>
          </div>
          <div className="p-4 rounded-2xl" style={{ backgroundColor: C.cream, border: `1px solid ${C.border}` }}>
            <span className="text-2xl mb-1 block">🏛️</span>
            <h4 className="font-bold text-sm" style={{ color: C.accent }}>Heritage Residency Arcade</h4>
            <p className="text-xs mt-1" style={{ color: C.muted }}>Historical 1920s architecture with boutique bookshops, art galleries, and antique stores.</p>
          </div>
        </div>
      )}

      {activeTab === "transit" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in">
          <div className="p-4 rounded-2xl" style={{ backgroundColor: C.cream, border: `1px solid ${C.border}` }}>
            <span className="text-2xl mb-1 block">🚗</span>
            <h4 className="font-bold text-sm" style={{ color: C.accent }}>Valet Parking</h4>
            <p className="text-xs mt-1" style={{ color: C.muted }}>Complimentary valet parking for up to 40 vehicles with EV charging stations.</p>
          </div>
          <div className="p-4 rounded-2xl" style={{ backgroundColor: C.cream, border: `1px solid ${C.border}` }}>
            <span className="text-2xl mb-1 block">♿</span>
            <h4 className="font-bold text-sm" style={{ color: C.accent }}>Universal Access Ramp</h4>
            <p className="text-xs mt-1" style={{ color: C.muted }}>Gentle 1:12 slope ramp from car drop-off directly into main dining hall and patio.</p>
          </div>
          <div className="p-4 rounded-2xl" style={{ backgroundColor: C.cream, border: `1px solid ${C.border}` }}>
            <span className="text-2xl mb-1 block">🚕</span>
            <h4 className="font-bold text-sm" style={{ color: C.accent }}>Cab &amp; Auto Stand</h4>
            <p className="text-xs mt-1" style={{ color: C.muted }}>Designated pickup and drop bay right outside our bougainvillea arch.</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   VOICE ASSISTANT (SMART QUERY & FILTER PROCESSOR)
═══════════════════════════════════════════════════════════════════════ */
function VoiceAssistantModal({
  navigate,
  onApplyVoiceFilter,
  onClearVoiceFilter,
  activeFilter,
}: {
  navigate: (s: Screen) => void;
  onApplyVoiceFilter: (vf: VoiceFilterState) => void;
  onClearVoiceFilter: () => void;
  activeFilter: VoiceFilterState | null;
}) {
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const recognitionRef = useRef<any>(null);

  const processQuery = (raw: string) => {
    const q = raw.trim();
    const cmd = q.toLowerCase();
    setTranscript(q);

    const vf: VoiceFilterState = {
      foodType: "All",
      category: "All",
      cuisine: "All",
      diet: "All",
      season: "All",
      searchKeyword: "",
    };

    let reply = "";

    if (cmd.includes("reserve") || cmd.includes("table") || cmd.includes("seat") || cmd.includes("book table")) {
      navigate("seats");
      reply = "Opening the live restaurant floor plan to choose your table 📅";
    } else if (cmd.includes("event") || cmd.includes("workshop") || cmd.includes("sufi") || cmd.includes("music")) {
      navigate("events");
      reply = "Opening upcoming café events and cultural workshops 🎉";
    } else if (cmd.includes("cart") || cmd.includes("checkout") || cmd.includes("my order")) {
      navigate("cart");
      reply = "Opening your dining cart 🛒";
    } else if (cmd.includes("about") || cmd.includes("contact") || cmd.includes("location") || cmd.includes("map")) {
      navigate("about");
      reply = "Here is AJAB's story, surroundings map, and contact details ℹ️";
    } else {
      navigate("menu");

      if (cmd.includes("summer") || cmd.includes("mango") || cmd.includes("lassi") || cmd.includes("ice") || cmd.includes("cold")) {
        vf.season = "summer";
        vf.badgeLabel = "Summer Specials ☀️";
        reply = "Showing summer specials including Alphonso Mango Lassi and Cold Brew ☀️";
      } else if (cmd.includes("monsoon") || cmd.includes("rain") || cmd.includes("chai") || cmd.includes("samosa") || cmd.includes("vada pav")) {
        vf.season = "monsoon";
        vf.badgeLabel = "Monsoon Warmers 🌧️";
        reply = "Showing monsoon warmers including Masala Chai and Samosas 🌧️";
      } else if (cmd.includes("winter") || cmd.includes("halwa") || cmd.includes("kahwa") || cmd.includes("dal makhani")) {
        vf.season = "winter";
        vf.badgeLabel = "Winter Warmers ❄️";
        reply = "Showing winter comfort foods including Saffron Kahwa and Gajar Halwa ❄️";
      }

      if (cmd.includes("jain")) {
        vf.diet = "Jain";
        vf.badgeLabel = "Jain-Friendly 🌱";
        reply = "Filtering for pure Jain-friendly dishes prepared without root vegetables 🌱";
      } else if (cmd.includes("vegan")) {
        vf.diet = "Vegan";
        vf.badgeLabel = "100% Vegan 🌿";
        reply = "Showing 100% plant-based vegan dishes 🌿";
      } else if (cmd.includes("gluten free") || cmd.includes("gluten-free") || cmd.includes("gluten")) {
        vf.diet = "Gluten-Free";
        vf.badgeLabel = "Gluten-Free 🌾";
        reply = "Showing certified gluten-free options 🌾";
      } else if (cmd.includes("protein") || cmd.includes("gym")) {
        vf.diet = "High Protein";
        vf.badgeLabel = "High Protein (15g+) 💪";
        reply = "Showing high-protein dishes with 15g+ protein 💪";
      }

      if (cmd.includes("non veg") || cmd.includes("non-veg") || cmd.includes("chicken") || cmd.includes("biryani")) {
        vf.foodType = "Non-Veg";
        if (!vf.badgeLabel) vf.badgeLabel = "Non-Vegetarian 🔴";
        if (!reply) reply = "Showing non-vegetarian dishes including Butter Chicken and Biryani 🔴";
      } else if (cmd.includes("pure veg") || cmd.includes("vegetarian") || cmd.includes("veg")) {
        if (!cmd.includes("non")) {
          vf.foodType = "Veg";
          if (!vf.badgeLabel) vf.badgeLabel = "Pure Vegetarian 🟢";
          if (!reply) reply = "Showing pure vegetarian dishes 🟢";
        }
      }

      const cleanKeywords = ["filter coffee", "masala chai", "cold brew", "kahwa", "mango lassi", "vada pav", "samosa", "paneer tikka", "dhokla", "dim sum", "falafel", "sushi", "kachori", "tacos", "burrito", "pad thai", "ramen", "biryani", "butter chicken", "dal makhani", "dosa", "pizza", "pasta", "tiramisu", "kulfi", "gulab jamun", "thepla", "halwa", "churros"];
      for (const kw of cleanKeywords) {
        if (cmd.includes(kw)) {
          vf.searchKeyword = kw;
          vf.badgeLabel = `Search: "${kw}"`;
          reply = `Found “${kw}” in our artisanal menu 🍽️`;
          break;
        }
      }

      if (!reply) {
        vf.searchKeyword = q.replace(/^(show|find|search|get|give me|filter for|dishes with)\s+/i, "").trim();
        vf.badgeLabel = `Search: "${vf.searchKeyword}"`;
        reply = `Searching menu for “${vf.searchKeyword}” 🔍`;
      }
    }

    setResponse(reply);
    onApplyVoiceFilter(vf);
  };

  const startListening = () => {
    setResponse("");
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setResponse("Speech recognition not supported in this browser. Please type or tap suggestions!");
      return;
    }
    try {
      const recognition = new SpeechRec();
      recognition.lang = "en-IN";
      recognition.interimResults = false;
      recognition.continuous = false;
      recognition.onstart = () => setListening(true);
      recognition.onresult = (e: any) => {
        const text = e.results[0][0].transcript;
        setTranscript(text);
        processQuery(text);
      };
      recognition.onerror = () => {
        setListening(false);
        setResponse("Couldn't catch that clearly. Please tap microphone or try again.");
      };
      recognition.onend = () => setListening(false);
      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setListening(false);
      setResponse("Microphone could not start. Please use text input.");
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open Voice Assistant"
        title="Voice Search & Assistant"
        className="fixed z-40 flex items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-95 shadow-xl"
        style={{
          bottom: 96,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #E2A955 0%, #C48E38 100%)",
          border: `2px solid #F4C77D`,
          color: "#120D0A",
          boxShadow: "0 8px 24px rgba(226, 169, 85, 0.4)",
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed z-50 rounded-3xl overflow-hidden shadow-2xl animate-fade-in"
          style={{
            bottom: 164,
            right: 20,
            width: 340,
            backgroundColor: C.card,
            border: `1.5px solid ${C.border}`,
          }}
        >
          <div className="px-5 py-3.5 flex items-center justify-between border-b" style={{ backgroundColor: "#261A12", color: C.text, borderColor: C.border }}>
            <div className="flex items-center gap-2">
              <span className="text-lg">🎙️</span>
              <div>
                <p className="font-serif font-bold text-sm" style={{ color: C.accent }}>AJAB Voice Assistant</p>
                <p className="text-[10px] opacity-80" style={{ color: C.muted }}>Speak or tap any prompt</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-base cursor-pointer opacity-70 hover:opacity-100">✕</button>
          </div>

          <div className="p-4 flex flex-col gap-3">
            <div className="text-center py-2">
              <button
                onClick={startListening}
                className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center cursor-pointer transition-transform ${listening ? "scale-110 animate-pulse bg-red-600 text-white" : "hover:scale-105"}`}
                style={{
                  backgroundColor: listening ? "#991B1B" : C.cream,
                  border: `2px solid ${C.accent}`,
                  color: listening ? "#FFF" : C.accent,
                }}
              >
                <span className="text-2xl">{listening ? "🔴" : "🎤"}</span>
              </button>
              <p className="text-xs font-semibold mt-2" style={{ color: C.text }}>
                {listening ? "Listening... Speak your filter or order..." : "Tap mic to speak"}
              </p>
            </div>

            {transcript && (
              <div className="p-2.5 rounded-xl text-xs border" style={{ backgroundColor: "#241A13", borderColor: C.border }}>
                <span className="font-bold text-[#E2A955]">Heard:</span> “{transcript}”
              </div>
            )}

            {response && (
              <div className="p-3 rounded-xl text-xs" style={{ backgroundColor: "#241A13", border: `1px solid ${C.border}` }}>
                <p className="font-semibold" style={{ color: C.text }}>{response}</p>
              </div>
            )}

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: C.muted }}>Quick Voice Suggestions:</p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Show summer specials",
                  "Show Jain food",
                  "Show Butter Chicken",
                  "Show vegetarian dishes",
                  "Reserve a table",
                ].map((p) => (
                  <button
                    key={p}
                    onClick={() => processQuery(p)}
                    className="text-[11px] font-semibold rounded-full px-2.5 py-1 cursor-pointer transition-colors"
                    style={{ backgroundColor: C.cream, border: `1px solid ${C.border}`, color: C.text }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {activeFilter && (
              <div className="pt-2 border-t flex justify-between items-center" style={{ borderColor: C.border }}>
                <span className="text-xs font-bold text-emerald-400">✓ Filter active: {activeFilter.badgeLabel}</span>
                <button onClick={onClearVoiceFilter} className="text-xs underline font-semibold cursor-pointer text-red-400">Clear</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function AccessibilityMenuModal({ setMode }: { setMode: (m: AppMode) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open Inclusive Display Modes"
        title="Accessibility Modes"
        className="fixed z-40 flex items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-95 shadow-xl"
        style={{
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: "50%",
          backgroundColor: C.card,
          border: `2px solid ${C.accent}`,
          color: C.accent,
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
        }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="4" r="2" />
          <path d="M9 9h6M12 9v9M9 21l3-3 3 3" />
        </svg>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed z-50 rounded-3xl overflow-hidden shadow-2xl animate-fade-in"
          style={{
            bottom: 90,
            right: 20,
            width: 320,
            backgroundColor: C.card,
            border: `1.5px solid ${C.border}`,
          }}
        >
          <div className="px-5 py-3.5 flex items-center justify-between border-b" style={{ borderColor: C.border, backgroundColor: "#261A12", color: C.text }}>
            <div className="flex items-center gap-2">
              <span className="text-lg">♿</span>
              <div>
                <p className="font-semibold text-sm" style={{ color: C.accent }}>Inclusive Display Modes</p>
                <p className="text-[11px]" style={{ color: C.muted }}>Choose a view tailored to you</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-base cursor-pointer opacity-70 hover:opacity-100">✕</button>
          </div>

          <div className="p-3 flex flex-col gap-2">
            <button
              onClick={() => { setMode("elderly"); setOpen(false); }}
              className="w-full text-left p-3 rounded-2xl cursor-pointer flex items-center gap-3 transition-colors hover:border-[#D4A359]"
              style={{ backgroundColor: C.cream, border: `1px solid ${C.border}` }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg" style={{ backgroundColor: "#3D1F00", color: "#FFFEF8" }}>
                Aa
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm" style={{ color: C.accent }}>Senior Citizen Mode</p>
                <p className="text-[11px]" style={{ color: C.muted }}>Big text, large touch buttons &amp; full menu</p>
              </div>
            </button>

            <button
              onClick={() => { setMode("rural"); setOpen(false); }}
              className="w-full text-left p-3 rounded-2xl cursor-pointer flex items-center gap-3 transition-colors hover:border-[#D4A359]"
              style={{ backgroundColor: C.cream, border: `1px solid ${C.border}` }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: "#203810", color: "#A7F3D0" }}>
                🌐
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm" style={{ color: "#4ADE80" }}>Rural / Multilingual</p>
                <p className="text-[11px]" style={{ color: C.muted }}>Full Hindi &amp; Marathi translation + offline mode</p>
              </div>
            </button>

            <button
              onClick={() => { setMode("vi"); setOpen(false); }}
              className="w-full text-left p-3 rounded-2xl cursor-pointer flex items-center gap-3 transition-colors hover:border-[#D4A359]"
              style={{ backgroundColor: C.cream, border: `1px solid ${C.border}` }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: "#0D0600", color: "#FFD166", border: "1px solid #C49A24" }}>
                👁
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm" style={{ color: C.accent }}>Visually Impaired Mode</p>
                <p className="text-[11px]" style={{ color: C.muted }}>High contrast dark theme &amp; spoken audio</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   COMMON NAVBAR (DARK ROAST)
═══════════════════════════════════════════════════════════════════════ */
function CNav({ navigate, active, cartCount }: { navigate: (s: Screen) => void; active: Screen; cartCount: number }) {
  const links: { label: string; screen: Screen; icon: string }[] = [
    { label: "Home", screen: "home", icon: "🏠" },
    { label: "Menu", screen: "menu", icon: "🍵" },
    { label: "Reserve", screen: "seats", icon: "📅" },
    { label: "Events", screen: "events", icon: "🎉" },
    { label: "About", screen: "about", icon: "ℹ️" },
    { label: "Accessibility", screen: "accessibility", icon: "♿" },
  ];

  return (
    <header style={{ backgroundColor: "rgba(18, 13, 10, 0.95)", borderBottom: `1px solid ${C.border}` }} className="sticky top-0 z-40 w-full backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        <button onClick={() => navigate("home")} className="cursor-pointer flex items-center gap-3 text-left" aria-label="AJAB Cafe & Restaurant">
          <AjabLogo size={46} />
          <div>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: C.accent, letterSpacing: 2, lineHeight: 1 }}>
              AJAB
            </span>
            <span style={{ display: "block", fontSize: 9, letterSpacing: 2.5, fontWeight: 600, color: C.muted, marginTop: 2 }}>
              CAFE &amp; RESTAURANT
            </span>
          </div>
        </button>

        <nav className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <button
              key={l.label}
              onClick={() => navigate(l.screen)}
              className="text-sm font-semibold cursor-pointer transition-colors relative py-1"
              style={{
                color: active === l.screen ? C.accent : C.muted,
                borderBottom: active === l.screen ? `2px solid ${C.accent}` : "2px solid transparent",
              }}
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("accessibility")}
            aria-label="Accessibility settings"
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full cursor-pointer"
            style={{ backgroundColor: C.card, color: C.accent, border: `1px solid ${C.border}` }}
          >
            ♿
          </button>
          <button
            onClick={() => navigate("cart")}
            aria-label={`Cart with ${cartCount} items`}
            className="relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold cursor-pointer transition-transform hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #E2A955 0%, #C48E38 100%)",
              color: "#120D0A",
            }}
          >
            <span>🛒</span>
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold bg-[#120D0A] text-[#FDF7F0]">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   FRONT PAGE (HOME)
═══════════════════════════════════════════════════════════════════════ */
function CHome({
  navigate,
  addToCart,
  setFood,
}: {
  navigate: (s: Screen) => void;
  addToCart: (f: FoodItem) => void;
  setFood: (f: FoodItem) => void;
}) {
  const featuredDishes = menuItems.filter((m) => [1, 5, 9, 11, 21, 39].includes(m.id));

  return (
    <div className="flex flex-col gap-14 pb-16 animate-fade-in">
      {/* ── 1. MAIN HERO BANNER ── */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden" style={{ backgroundColor: C.bg, borderBottom: `1px solid ${C.border}` }}>
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1600&h=1000&fit=crop&auto=format"
            alt="Warm AJAB café interior"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#120D0A] via-transparent to-[#120D0A]" />
        </div>
        <div className="relative z-10 flex flex-col items-center max-w-4xl">
          <AjabLogo size={104} className="mb-4" />
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: C.accent }}>Modern Indian Café · Est. 2024</p>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(36px,6vw,64px)", color: C.text, lineHeight: 1.1 }}>
            Warmth in every<br /><em style={{ color: C.accent }}>cup and corner.</em>
          </h1>
          <div className="mt-4 flex items-start gap-2 max-w-xl">
            <p className="text-base sm:text-lg flex-1" style={{ color: C.muted, lineHeight: 1.7 }}>
              AJAB blends the unhurried rhythms of Indian chai culture with a contemporary accessible café experience.
            </p>
            <ReadAloudBtn text="AJAB Cafe and Restaurant. Warmth in every cup and corner. Modern Indian Cafe established 2024. AJAB blends the unhurried rhythms of Indian chai culture with a contemporary cafe experience." />
          </div>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <CBtn label="View Menu" onClick={() => navigate("menu")} />
            <CBtn label="Order Now" onClick={() => navigate("menu")} variant="outline" />
            <CBtn label="Reserve a Table" onClick={() => navigate("seats")} variant="outline" />
          </div>
          <div className="mt-16 w-20 h-px" style={{ backgroundColor: C.border }} />
        </div>
      </section>

      {/* ── 2. FEATURED SIGNATURE FOOD PHOTOS SHOWCASE ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-[#36270E] text-[#FCD34D] border border-[#5C4217] mb-2">
              <span>👑 Chef's Highlights</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold" style={{ color: C.accent }}>
              Signature Delights
            </h2>
            <p className="text-sm mt-1" style={{ color: C.muted }}>
              Handcrafted filter coffees, fresh appetizers, and slow-cooked regional staples.
            </p>
          </div>
          <button
            onClick={() => navigate("menu")}
            className="font-bold text-sm underline cursor-pointer hover:opacity-80"
            style={{ color: C.accentLight }}
          >
            View Full 44-Dish Menu →
          </button>
        </div>

        {/* 6-Card Rich Food Photography Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredDishes.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl overflow-hidden flex flex-col justify-between transition-all hover:shadow-2xl hover:border-[#D4A359]/70 hover:-translate-y-1.5 group"
              style={{ backgroundColor: C.card, border: `1.5px solid ${C.border}` }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.img}
                  alt={item.imgAlt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span
                    className="text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm"
                    style={{
                      backgroundColor: item.foodType === "veg" ? "#166534" : "#991B1B",
                      color: "#FFF",
                    }}
                  >
                    {item.foodType === "veg" ? "● VEG" : "● NON-VEG"}
                  </span>
                  {item.seasonBadge && (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#B8860B] text-white shadow-sm">
                      {item.seasonBadge}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: C.muted }}>
                        {item.cuisine} · {item.category}
                      </p>
                      <h3 className="font-serif font-bold text-lg mt-0.5" style={{ color: C.text }}>
                        {item.name}
                      </h3>
                    </div>
                    <p className="font-bold text-lg shrink-0" style={{ color: C.accent }}>
                      ₹ {item.price}
                    </p>
                  </div>

                  <p className="text-xs line-clamp-2 mt-2 leading-relaxed" style={{ color: C.muted }}>
                    {item.desc}
                  </p>

                  <div className="flex items-center gap-3 mt-3 text-xs font-semibold" style={{ color: C.accentLight }}>
                    <span>🔥 {item.cal} kcal</span>
                    <span>💪 {item.protein}g protein</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t flex gap-2" style={{ borderColor: C.border }}>
                  <button
                    onClick={() => { setFood(item); navigate("food-details"); }}
                    className="flex-1 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors text-center"
                    style={{ backgroundColor: C.cream, color: C.accent, border: `1px solid ${C.border}` }}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => addToCart(item)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors text-center"
                    style={{
                      background: "linear-gradient(135deg, #E2A955 0%, #C48E38 100%)",
                      color: "#120D0A",
                    }}
                  >
                    + Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Heritage Pairing Combo Banner */}
        <div className="mt-8 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border" style={{ backgroundColor: "#24160C", borderColor: "#D4A359", color: "#FFFDF8" }}>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0 bg-white/10 border border-white/20">
              ☕🥟
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#FDE68A]">Special Heritage Combo</span>
              <h3 className="font-serif text-2xl font-bold mt-0.5">Filter Coffee &amp; Mumbai Vada Pav</h3>
              <p className="text-xs text-[#D4C8B4] mt-1">Frothy double-drip chicory coffee paired with hot batata vada &amp; spicy garlic chutney.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <span className="text-xs line-through text-[#8A7868]">₹ 205</span>
              <p className="text-2xl font-bold text-[#FDE68A]">₹ 175</p>
            </div>
            <button
              onClick={() => {
                const f1 = menuItems.find((m) => m.id === 1);
                const f2 = menuItems.find((m) => m.id === 9);
                if (f1) addToCart(f1);
                if (f2) addToCart(f2);
                navigate("cart");
              }}
              className="px-5 py-3 rounded-2xl font-bold text-sm cursor-pointer shadow-lg transition-transform hover:scale-105"
              style={{ backgroundColor: "#E2A955", color: "#120D0A" }}
            >
              Order Combo →
            </button>
          </div>
        </div>
      </section>

      {/* ── 3. REALISTIC MAP & OUTSIDE SURROUNDINGS ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <CafeSurroundingsMap />
      </section>

      {/* ── 4. LIVE TABLE FLOOR PLAN TEASER ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl p-8 shadow-sm" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
          <div className="lg:col-span-7 flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E2A955]">Live Seat Picker</span>
            <h2 className="font-serif text-3xl font-bold" style={{ color: C.accent }}>Architectural Floor Plan Reservation</h2>
            <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
              Choose your exact table across 4 distinct ambient zones: Indoor Main Hall, Garden Verandah Patio, Heritage Quiet Alcove, or the Barista Coffee Bar.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#14331E] text-[#4ADE80] border border-[#1E542C]">✓ 20 Distinct Tables</span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#14331E] text-[#4ADE80] border border-[#1E542C]">✓ Live Availability</span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#14331E] text-[#4ADE80] border border-[#1E542C]">✓ Wheelchair Accessible</span>
            </div>
            <div className="pt-2">
              <CBtn label="Open Table Reservation Floor Plan" onClick={() => navigate("seats")} size="lg" />
            </div>
          </div>

          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden shadow-md border-2" style={{ height: 220, borderColor: C.border, backgroundColor: "#150F0A" }}>
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
              <span className="text-3xl mb-2">🏛️</span>
              <p className="font-serif font-bold text-lg" style={{ color: C.accent }}>14 Tables Currently Available</p>
              <p className="text-xs mt-1" style={{ color: C.muted }}>Instant booking with zero reservation fees</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MENU WITH VIBRANT COLORFUL SEASONAL GARDEN WIDGET
═══════════════════════════════════════════════════════════════════════ */
function CMenu({
  navigate,
  setFood,
  addToCart,
  voiceFilter,
  onClearVoiceFilter,
}: {
  navigate: (s: Screen) => void;
  setFood: (f: FoodItem) => void;
  addToCart: (f: FoodItem) => void;
  voiceFilter: VoiceFilterState | null;
  onClearVoiceFilter: () => void;
}) {
  const [foodType, setFoodType] = useState<"All" | "Veg" | "Non-Veg">("All");
  const [selectedCuisine, setSelectedCuisine] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDiet, setSelectedDiet] = useState<string>("All");
  const [avoidAllergens, setAvoidAllergens] = useState<string[]>([]);
  const getCurrentSeason = () => {
    const month = new Date().getMonth() + 1;
    return month >= 3 && month <= 5 ? "summer" : month >= 6 && month <= 9 ? "monsoon" : "winter";
  };
  const [selectedSeason, setSelectedSeason] = useState<"All" | "summer" | "monsoon" | "winter">(getCurrentSeason());
  const [searchQuery, setSearchQuery] = useState("");
  const [nutritionModalItem, setNutritionModalItem] = useState<FoodItem | null>(null);

  useEffect(() => {
    if (!voiceFilter) return;
    if (voiceFilter.foodType) setFoodType(voiceFilter.foodType);
    if (voiceFilter.category && voiceFilter.category !== "All") setSelectedCategory(voiceFilter.category);
    if (voiceFilter.cuisine && voiceFilter.cuisine !== "All") setSelectedCuisine(voiceFilter.cuisine);
    if (voiceFilter.diet && voiceFilter.diet !== "All") setSelectedDiet(voiceFilter.diet);
    if (voiceFilter.season && voiceFilter.season !== "All") setSelectedSeason(voiceFilter.season);
    if (voiceFilter.searchKeyword) setSearchQuery(voiceFilter.searchKeyword);
  }, [voiceFilter]);

  const allCuisines = [
    "All", "Indian", "North Indian", "South Indian", "Maharashtrian", "Punjabi",
    "Gujarati", "Rajasthani", "Bengali", "Mughlai", "Kerala", "Indo-Chinese",
    "Italian", "Japanese", "Thai", "Mexican", "Mediterranean", "Continental", "American", "Kashmiri"
  ];

  const allCategories = [
    "All", "Beverages", "Starters", "Soups & Salads", "Main Course", "Rice & Biryani", "Breads", "Desserts"
  ];

  const allDiets = [
    { label: "🌱 Jain Friendly", value: "Jain" },
    { label: "🌿 100% Vegan", value: "Vegan" },
    { label: "🥑 Keto / Low Carb", value: "Keto" },
    { label: "💪 High Protein (15g+)", value: "High Protein" },
    { label: "🌾 Gluten-Free", value: "Gluten-Free" },
    { label: "🥗 Low Calorie (<300 kcal)", value: "Low Calorie" },
  ];

  const allergenList = [
    { name: "Dairy", icon: "🥛" },
    { name: "Gluten", icon: "🌾" },
    { name: "Nuts", icon: "🥜" },
    { name: "Soy", icon: "🫘" },
    { name: "Egg", icon: "🥚" },
    { name: "Shellfish", icon: "🦐" },
    { name: "Sesame", icon: "🌰" },
  ];

  const toggleAllergen = (a: string) => {
    setAvoidAllergens((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  };

  const resetFilters = () => {
    setFoodType("All");
    setSelectedCuisine("All");
    setSelectedCategory("All");
    setSelectedDiet("All");
    setAvoidAllergens([]);
    setSelectedSeason("All");
    setSearchQuery("");
    onClearVoiceFilter();
  };

  const filteredItems = menuItems.filter((item) => {
    const hay = `${item.name} ${item.desc} ${item.cuisine} ${item.category} ${item.ingredients.join(" ")} ${item.dietary.join(" ")}`.toLowerCase();
    const typeMatch = foodType === "All" || (foodType === "Veg" ? item.foodType === "veg" : item.foodType === "nonVeg");
    const cuisineMatch =
      selectedCuisine === "All"
        ? true
        : selectedCuisine === "Indian"
        ? ["North Indian", "South Indian", "Maharashtrian", "Punjabi", "Gujarati", "Rajasthani", "Bengali", "Mughlai", "Kerala", "Kashmiri"].includes(item.cuisine)
        : item.cuisine === selectedCuisine;
    const categoryMatch = selectedCategory === "All" || item.category === selectedCategory;
    const dietMatch = selectedDiet === "All" || item.dietary.includes(selectedDiet);
    const allergenMatch = avoidAllergens.every((a) => !item.allergens.includes(a));
    const seasonMatch = selectedSeason === "All" || item.season === selectedSeason || item.season === "all";
    const queryMatch = !searchQuery || hay.includes(searchQuery.toLowerCase());

    return typeMatch && cuisineMatch && categoryMatch && dietMatch && allergenMatch && seasonMatch && queryMatch;
  });

  // Seasonal configuration for the vibrant Garden widget
  const seasonConfig = {
    summer: {
      title: "☀️ Summer Garden Coolers",
      temp: "32°C Sunny Weather Active",
      bannerImg: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&h=400&fit=crop&auto=format",
      bgGradient: "linear-gradient(135deg, #B45309 0%, #78350F 100%)",
      accentBg: "#36270E",
      accentText: "#FCD34D",
    },
    monsoon: {
      title: "🌧️ Monsoon Rain Comforts",
      temp: "23°C Refreshing Petrichor",
      bannerImg: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&h=400&fit=crop&auto=format",
      bgGradient: "linear-gradient(135deg, #065F46 0%, #064E3B 100%)",
      accentBg: "#14331E",
      accentText: "#4ADE80",
    },
    winter: {
      title: "❄️ Winter Hearth Warmers",
      temp: "17°C Chilly Evening Warmth",
      bannerImg: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&h=400&fit=crop&auto=format",
      bgGradient: "linear-gradient(135deg, #881337 0%, #4C0519 100%)",
      accentBg: "#3D1416",
      accentText: "#F87171",
    },
    All: {
      title: "🌿 All-Season Classics",
      temp: "Signature Year-Round Menu",
      bannerImg: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&h=400&fit=crop&auto=format",
      bgGradient: "linear-gradient(135deg, #5C3D1E 0%, #261608 100%)",
      accentBg: "#241B14",
      accentText: "#E2A955",
    }
  };

  const curSeason = selectedSeason === "All" ? "summer" : selectedSeason;
  const curSeasonStyle = seasonConfig[curSeason];
  const seasonalPicks = menuItems.filter((m) => m.season === curSeason);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold" style={{ color: C.accent }}>
            AJAB Artisanal Menu
          </h1>
          <p className="text-sm mt-1" style={{ color: C.muted }}>
            Explore 44 handcrafted dishes across 20 authentic culinary traditions. Allergen safeguards &amp; full macro nutrition.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {voiceFilter && (
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#14331E] text-[#4ADE80] border border-[#1E542C]">
              🎙️ {voiceFilter.badgeLabel}
            </span>
          )}
          <button
            onClick={resetFilters}
            className="text-xs font-semibold underline cursor-pointer py-1.5 px-3 rounded-lg"
            style={{ color: C.accentLight, backgroundColor: C.card }}
          >
            Reset All Filters
          </button>
        </div>
      </div>

      {/* ── TOP SECTION: ALLERGEN SAFETY SHIELD & NUTRITION HUB ── */}
      <div className="rounded-3xl p-5 mb-8 shadow-sm" style={{ backgroundColor: "#1A130E", border: `1.5px solid ${C.border}` }}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-6 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-base">🛡️</span>
              <span className="font-serif font-bold text-sm" style={{ color: C.accent }}>Allergen Safety Shield (Exclude Allergens)</span>
            </div>
            <p className="text-xs" style={{ color: C.muted }}>Tap any allergen to instantly hide all dishes containing it:</p>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {allergenList.map((a) => {
                const active = avoidAllergens.includes(a.name);
                return (
                  <button
                    key={a.name}
                    onClick={() => toggleAllergen(a.name)}
                    className="rounded-full px-3 py-1.5 text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 select-none"
                    style={{
                      backgroundColor: active ? "#991B1B" : C.cream,
                      color: active ? "#FFFFFF" : C.text,
                      border: `1.5px solid ${active ? "#991B1B" : C.border}`,
                    }}
                  >
                    <span>{a.icon}</span>
                    <span>{active ? `Excluding ${a.name}` : `Avoid ${a.name}`}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col gap-2 border-t lg:border-t-0 lg:border-l pt-4 lg:pt-0 lg:pl-6" style={{ borderColor: C.border }}>
            <div className="flex items-center gap-2">
              <span className="text-base">🥗</span>
              <span className="font-serif font-bold text-sm" style={{ color: C.accent }}>Dietary Lifestyles &amp; Nutrition</span>
            </div>
            <p className="text-xs" style={{ color: C.muted }}>Filter for specific nutritional goals or faith-based preferences:</p>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {allDiets.map((d) => {
                const active = selectedDiet === d.value;
                return (
                  <button
                    key={d.value}
                    onClick={() => setSelectedDiet(active ? "All" : d.value)}
                    className="rounded-full px-3 py-1.5 text-xs font-semibold cursor-pointer transition-all select-none"
                    style={{
                      backgroundColor: active ? C.accent : C.cream,
                      color: active ? "#120D0A" : C.text,
                      border: `1.5px solid ${active ? C.accent : C.border}`,
                      fontWeight: active ? 700 : 600,
                    }}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── SEARCH & PRIMARY CATEGORY BAR ── */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-8 relative">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes (e.g., Filter Coffee, Samosa, Butter Chicken, Biryani, Tiramisu)..."
              className="w-full rounded-2xl px-11 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-[#D4A359]"
              style={{ backgroundColor: "#1F1712", border: `1px solid ${C.border}`, color: C.text }}
            />
            <span className="absolute left-4 top-3.5 text-base opacity-60">🔍</span>
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-4 top-3.5 text-xs font-bold opacity-60 cursor-pointer">✕</button>
            )}
          </div>

          <div className="md:col-span-4 flex rounded-2xl p-1" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
            {(["All", "Veg", "Non-Veg"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFoodType(t)}
                className="flex-1 py-2 text-xs font-bold rounded-xl cursor-pointer transition-all text-center flex items-center justify-center gap-1"
                style={{
                  backgroundColor: foodType === t ? (t === "Veg" ? "#166534" : t === "Non-Veg" ? "#991B1B" : C.accent) : "transparent",
                  color: foodType === t ? (t === "All" ? "#120D0A" : "#FFF") : C.muted,
                }}
              >
                {t === "Veg" && <span>🟢</span>}
                {t === "Non-Veg" && <span>🔴</span>}
                <span>{t}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-xs font-bold uppercase tracking-wider shrink-0 mr-1" style={{ color: C.muted }}>Category:</span>
          {allCategories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className="rounded-full px-3.5 py-1.5 text-xs font-semibold cursor-pointer shrink-0 transition-all select-none"
              style={{
                backgroundColor: selectedCategory === c ? C.accent : C.card,
                color: selectedCategory === c ? "#120D0A" : C.text,
                border: `1px solid ${selectedCategory === c ? C.accent : C.border}`,
                fontWeight: selectedCategory === c ? 700 : 500,
              }}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-xs font-bold uppercase tracking-wider shrink-0 mr-1" style={{ color: C.muted }}>Cuisine:</span>
          {allCuisines.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCuisine(c)}
              className="rounded-full px-3 py-1 text-xs font-semibold cursor-pointer shrink-0 transition-all select-none"
              style={{
                backgroundColor: selectedCuisine === c ? "#D49B4B" : C.cream,
                color: selectedCuisine === c ? "#120D0A" : C.muted,
                border: `1px solid ${selectedCuisine === c ? "#D49B4B" : C.border}`,
                fontWeight: selectedCuisine === c ? 700 : 500,
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* ── DISHES GRID & COLORFUL VIBRANT SEASONAL GARDEN WIDGET ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Dishes Grid (Col 1-8) */}
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: C.muted }}>
              Showing {filteredItems.length} of {menuItems.length} Handcrafted Dishes
            </p>
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-16 rounded-3xl p-8" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
              <p className="text-4xl mb-3">🍽️</p>
              <h3 className="font-serif text-xl font-bold" style={{ color: C.accent }}>No dishes match your active filters</h3>
              <p className="text-xs mt-1" style={{ color: C.muted }}>Try clearing allergens, broadening cuisine selection, or reset filters.</p>
              <div className="mt-4">
                <CBtn label="Reset All Filters" onClick={resetFilters} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl overflow-hidden flex flex-col justify-between transition-all hover:shadow-xl hover:border-[#D4A359]/70 hover:-translate-y-1 group"
                  style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}
                >
                  <div className="relative h-44 overflow-hidden">
                    <FoodImage
                      src={item.img}
                      alt={item.imgAlt}
                      name={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm"
                        style={{
                          backgroundColor: item.foodType === "veg" ? "#166534" : "#991B1B",
                          color: "#FFF",
                        }}
                      >
                        {item.foodType === "veg" ? "● VEG" : "● NON-VEG"}
                      </span>
                      {item.isChefSpecial && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#B8860B] text-white shadow-sm">
                          👑 Special
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => setNutritionModalItem(item)}
                      aria-label="View Nutrition & Allergen info"
                      className="absolute bottom-2.5 right-2.5 px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer backdrop-blur-md bg-black/70 text-white hover:bg-black/90 border border-white/20"
                    >
                      🛡️ Nutrition &amp; Allergens
                    </button>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: C.muted }}>
                            {item.cuisine} · {item.category}
                          </p>
                          <h3 className="font-serif font-bold text-base mt-0.5" style={{ color: C.text }}>
                            {item.name}
                          </h3>
                        </div>
                        <p className="font-bold text-base shrink-0" style={{ color: C.accent }}>
                          ₹ {item.price}
                        </p>
                      </div>

                      <p className="text-xs line-clamp-2 mt-1.5 leading-relaxed" style={{ color: C.muted }}>
                        {item.desc}
                      </p>

                      <div className="flex items-center gap-3 mt-3 text-[11px] font-semibold" style={{ color: C.accentLight }}>
                        <span>🔥 {item.cal} kcal</span>
                        <span>💪 {item.protein}g protein</span>
                        <span>🌾 {item.carbs}g carbs</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t flex gap-2" style={{ borderColor: C.border }}>
                      <button
                        onClick={() => { setFood(item); navigate("food-details"); }}
                        className="flex-1 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors text-center"
                        style={{ backgroundColor: C.cream, color: C.accent, border: `1px solid ${C.border}` }}
                      >
                        Details
                      </button>
                      <button
                        onClick={() => addToCart(item)}
                        className="flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors text-center"
                        style={{
                          background: "linear-gradient(135deg, #E2A955 0%, #C48E38 100%)",
                          color: "#120D0A",
                        }}
                      >
                        + Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── COLORFUL & RICH PHOTO SEASONAL GARDEN (Col 9-12) ── */}
        <div className="lg:col-span-4 flex flex-col gap-6 sticky top-24">
          <div className="rounded-3xl overflow-hidden shadow-xl border-2" style={{ borderColor: C.border }}>
            {/* Colorful Hero Photo Header */}
            <div className="relative h-32 overflow-hidden text-white p-4 flex flex-col justify-between" style={{ background: curSeasonStyle.bgGradient }}>
              <img
                src={curSeasonStyle.bannerImg}
                alt="Seasonal Garden Background"
                className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-overlay"
              />
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
                  🌱 AJAB Seasonal Garden
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md">
                  {curSeasonStyle.temp}
                </span>
              </div>
              <h3 className="relative z-10 font-serif text-xl font-bold">{curSeasonStyle.title}</h3>
            </div>

            <div className="p-4" style={{ backgroundColor: "#1A130E" }}>
              {/* Season Tabs */}
              <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl mb-4" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
                {(["summer", "monsoon", "winter"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSeason(s)}
                    className="py-1.5 text-xs font-bold rounded-xl cursor-pointer transition-all text-center capitalize"
                    style={{
                      backgroundColor: selectedSeason === s ? C.accent : "transparent",
                      color: selectedSeason === s ? "#120D0A" : C.muted,
                    }}
                  >
                    {s === "summer" ? "☀️ Summer" : s === "monsoon" ? "🌧️ Monsoon" : "❄️ Winter"}
                  </button>
                ))}
              </div>

              {/* Seasonal Dishes List */}
              <div className="flex flex-col gap-3">
                {seasonalPicks.slice(0, 4).map((pick) => (
                  <div key={pick.id} className="p-3 rounded-2xl flex gap-3 items-center shadow-sm" style={{ backgroundColor: C.cream, border: `1px solid ${C.border}` }}>
                    <FoodImage src={pick.img} alt={pick.imgAlt} name={pick.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-serif font-bold text-xs truncate" style={{ color: C.accent }}>{pick.name}</p>
                      <p className="text-[11px] font-semibold" style={{ color: C.muted }}>₹ {pick.price} · {pick.cal} kcal</p>
                    </div>
                    <button
                      onClick={() => addToCart(pick)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-transform hover:scale-105"
                      style={{
                        background: "linear-gradient(135deg, #E2A955 0%, #C48E38 100%)",
                        color: "#120D0A",
                      }}
                    >
                      + Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── NUTRITION & ALLERGEN MODAL ── */}
      {nutritionModalItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in"
          onClick={() => setNutritionModalItem(null)}
        >
          <div
            className="rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: C.card, border: `2px solid ${C.border}` }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <CTag label={nutritionModalItem.category} />
                <h3 className="font-serif text-xl font-bold mt-1" style={{ color: C.accent }}>{nutritionModalItem.name}</h3>
                <p className="text-xs font-semibold" style={{ color: C.muted }}>{nutritionModalItem.cuisine} Cuisine</p>
              </div>
              <button
                onClick={() => setNutritionModalItem(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm cursor-pointer"
                style={{ backgroundColor: C.cream, color: C.text }}
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center mb-4">
              {[
                { label: "Calories", val: `${nutritionModalItem.cal} kcal` },
                { label: "Protein", val: `${nutritionModalItem.protein}g` },
                { label: "Carbs", val: `${nutritionModalItem.carbs}g` },
                { label: "Fats", val: `${nutritionModalItem.fat}g` },
              ].map((m) => (
                <div key={m.label} className="rounded-xl p-2.5" style={{ backgroundColor: C.cream, border: `1px solid ${C.border}` }}>
                  <p className="text-[10px] font-bold uppercase" style={{ color: C.muted }}>{m.label}</p>
                  <p className="font-bold text-sm mt-0.5" style={{ color: C.accent }}>{m.val}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 text-xs mb-4">
              <div>
                <p className="font-bold uppercase tracking-wider text-[11px] mb-1" style={{ color: C.muted }}>Ingredients</p>
                <p style={{ color: C.text }}>{nutritionModalItem.ingredients.join(", ")}</p>
              </div>

              <div>
                <p className="font-bold uppercase tracking-wider text-[11px] mb-1" style={{ color: C.muted }}>Allergen Warning</p>
                {nutritionModalItem.allergens.length > 0 ? (
                  <p className="font-semibold text-amber-200 bg-amber-950/60 p-2.5 rounded-xl border border-amber-800">
                    ⚠️ Contains: {nutritionModalItem.allergens.join(", ")}. Please inform servers of severe allergies.
                  </p>
                ) : (
                  <p className="font-semibold text-emerald-200 bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-800">
                    ✓ No major allergens listed in base ingredients.
                  </p>
                )}
              </div>

              <div>
                <p className="font-bold uppercase tracking-wider text-[11px] mb-1" style={{ color: C.muted }}>Dietary Compatibility</p>
                <div className="flex flex-wrap gap-1.5">
                  {nutritionModalItem.dietary.map((d) => (
                    <span key={d} className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#14331E] text-[#4ADE80] border border-[#1E542C]">
                      ✓ {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-3 border-t" style={{ borderColor: C.border }}>
              <CBtn
                label="Add to Cart"
                onClick={() => {
                  addToCart(nutritionModalItem);
                  setNutritionModalItem(null);
                }}
                full
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CFoodDetails({ food, navigate, addToCart }: { food: FoodItem | null; navigate: (s: Screen) => void; addToCart: (f: FoodItem) => void }) {
  if (!food) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 animate-fade-in">
      <button onClick={() => navigate("menu")} className="text-sm font-semibold mb-6 cursor-pointer flex items-center gap-1.5" style={{ color: C.muted }}>
        ← Back to Menu
      </button>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="rounded-3xl overflow-hidden shadow-xl border" style={{ borderColor: C.border }}>
          <FoodImage src={food.img} alt={food.imgAlt} name={food.name} className="w-full h-80 object-cover" />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex gap-2 flex-wrap items-center">
            <CTag label={food.category} />
            <CTag label={food.cuisine} />
            <span
              className="text-[11px] font-bold rounded-full px-2.5 py-0.5 border"
              style={{
                backgroundColor: food.foodType === "veg" ? "#14331E" : "#3D1416",
                color: food.foodType === "veg" ? "#4ADE80" : "#F87171",
                borderColor: food.foodType === "veg" ? "#1E542C" : "#612225",
              }}
            >
              {food.foodType === "veg" ? "● VEG" : "● NON-VEG"}
            </span>
          </div>

          <div className="flex items-start justify-between gap-3">
            <h1 className="font-serif text-3xl font-bold" style={{ color: C.accent }}>{food.name}</h1>
            <ReadAloudBtn text={`${food.name}. ${food.desc}. Priced at ${food.price} rupees. Contains ${food.cal} calories and ${food.protein} grams of protein.`} />
          </div>

          <p className="text-base" style={{ color: C.muted, lineHeight: 1.7 }}>{food.desc}</p>
          <p className="text-2xl font-bold" style={{ color: C.accent }}>₹ {food.price}</p>

          <div className="grid grid-cols-4 gap-2">
            {[
              ["Calories", `${food.cal} kcal`],
              ["Protein", `${food.protein}g`],
              ["Carbs", `${food.carbs}g`],
              ["Fat", `${food.fat}g`],
            ].map(([k, v]) => (
              <CCard key={k} style={{ padding: "8px 10px", textAlign: "center", backgroundColor: C.cream }}>
                <p className="text-[10px] font-bold uppercase" style={{ color: C.muted }}>{k}</p>
                <p className="text-sm font-bold mt-0.5" style={{ color: C.text }}>{v}</p>
              </CCard>
            ))}
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: C.muted }}>Dietary Suitability</p>
            <div className="flex flex-wrap gap-1.5">
              {food.dietary.map((d) => (
                <span key={d} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#14331E] text-[#4ADE80] border border-[#1E542C]">
                  ✓ {d}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <CBtn label="Add to Cart" onClick={() => { addToCart(food); navigate("cart"); }} full size="lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

function CCart({ cart, navigate, updateQty }: { cart: CartItem[]; navigate: (s: Screen) => void; updateQty: (id: number, d: number) => void }) {
  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const gst = Math.round(subtotal * 0.05);
  const total = subtotal + gst;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 animate-fade-in">
      <h1 className="font-serif text-3xl font-bold mb-2" style={{ color: C.accent }}>Your AJAB Order</h1>
      <p className="text-sm mb-6" style={{ color: C.muted }}>Review your items before submitting directly to the kitchen.</p>

      {cart.length === 0 ? (
        <CCard className="text-center py-16">
          <p className="text-5xl mb-4">🛒</p>
          <p className="font-serif text-xl font-bold" style={{ color: C.accent }}>Your cart is empty</p>
          <p className="text-sm mt-1" style={{ color: C.muted }}>Explore our artisanal drinks, starters, and savory delights.</p>
          <div className="mt-6">
            <CBtn label="Browse Menu" onClick={() => navigate("menu")} />
          </div>
        </CCard>
      ) : (
        <div className="flex flex-col gap-4">
          {cart.map((item) => (
            <CCard key={item.id} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <FoodImage src={item.img} alt={item.name} name={item.name} className="w-14 h-14 rounded-xl object-cover" />
                <div>
                  <p className="font-bold text-sm" style={{ color: C.text }}>{item.name}</p>
                  <p className="text-xs" style={{ color: C.muted }}>₹ {item.price} each</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-xl p-1" style={{ backgroundColor: C.cream, border: `1px solid ${C.border}` }}>
                  <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 rounded-lg font-bold cursor-pointer hover:bg-white/10">−</button>
                  <span className="text-sm font-bold w-5 text-center">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 rounded-lg font-bold cursor-pointer hover:bg-white/10">+</button>
                </div>
                <p className="font-bold text-sm w-16 text-right" style={{ color: C.accent }}>₹ {item.price * item.qty}</p>
              </div>
            </CCard>
          ))}

          <CCard className="flex flex-col gap-2.5 mt-2">
            <div className="flex justify-between text-sm"><span style={{ color: C.muted }}>Subtotal</span><span>₹ {subtotal}</span></div>
            <div className="flex justify-between text-sm"><span style={{ color: C.muted }}>GST (5%)</span><span>₹ {gst}</span></div>
            <div className="flex justify-between text-sm"><span style={{ color: C.muted }}>Packaging &amp; Service</span><span className="text-emerald-400 font-bold">FREE</span></div>
            <div className="h-px my-1" style={{ backgroundColor: C.border }} />
            <div className="flex justify-between items-center font-bold text-base">
              <span>Total Amount</span>
              <span style={{ color: C.accent, fontSize: 18 }}>₹ {total}</span>
            </div>
          </CCard>

          <div className="flex gap-3 mt-4">
            <CBtn label="← Continue Ordering" onClick={() => navigate("menu")} variant="outline" />
            <CBtn label="Place Order Now" onClick={() => navigate("order-confirm")} full size="lg" />
          </div>
        </div>
      )}
    </div>
  );
}

function COrderConfirm({ navigate }: { navigate: (s: Screen) => void }) {
  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-16 text-center flex flex-col items-center gap-4 animate-fade-in">
      <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold bg-[#14331E] text-[#4ADE80] border-2 border-[#22C55E]">
        ✓
      </div>
      <h1 className="font-serif text-3xl font-bold" style={{ color: C.accent }}>Order Received!</h1>
      <p className="text-sm" style={{ color: C.muted }}>Your order is now being freshly prepared by our chefs.</p>
      <CCard className="w-full text-left flex flex-col gap-2 mt-2">
        <div className="flex justify-between text-sm font-semibold"><span>Order Number:</span><span style={{ color: C.accent }}>AJB-9482</span></div>
        <div className="flex justify-between text-sm font-semibold"><span>Estimated Prep Time:</span><span>15–20 minutes</span></div>
        <div className="flex justify-between text-sm font-semibold"><span>Status:</span><span className="text-amber-400 font-bold">Kitchen Preparing 🔥</span></div>
      </CCard>
      <div className="mt-4">
        <CBtn label="Back to Home" onClick={() => navigate("home")} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   ARCHITECTURAL TABLE FLOOR PLAN (RESERVE TAB)
═══════════════════════════════════════════════════════════════════════ */
function CSeats({
  navigate, selected, setSelected, draft, setDraft
}: {
  navigate: (s: Screen) => void;
  selected: string | null;
  setSelected: (t: string | null) => void;
  draft: ReservationDraft;
  setDraft: React.Dispatch<React.SetStateAction<ReservationDraft>>;
}) {
  const [activeZone, setActiveZone] = useState<"All" | "Indoor" | "Outdoor" | "Quiet Area" | "Bar Counter">("All");

  const filteredTables = tables.filter((t) => (activeZone === "All" ? true : t.zone === activeZone));
  const selectedTableObj = tables.find((t) => t.id === selected);
  const timeSlots = ["12:00 PM", "1:00 PM", "2:00 PM", "4:30 PM", "6:00 PM", "7:30 PM", "8:30 PM", "9:30 PM"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold" style={{ color: C.accent }}>
            Reserve Your Table at AJAB
          </h1>
          <p className="text-sm mt-1" style={{ color: C.muted }}>
            Select your preferred date, arrival time, guest count, and choose an exact table from our visual floor plan.
          </p>
        </div>
      </div>

      <CCard className="mb-8 p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: C.muted }}>
              📅 Reservation Date
            </label>
            <input
              type="date"
              value={draft.date || "2024-10-14"}
              onChange={(e) => setDraft({ ...draft, date: e.target.value })}
              className="w-full rounded-xl px-3.5 py-2.5 text-sm font-semibold outline-none"
              style={{ backgroundColor: C.cream, border: `1px solid ${C.border}`, color: C.text }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: C.muted }}>
              ⏰ Arrival Time Slot
            </label>
            <select
              value={draft.time || "7:30 PM"}
              onChange={(e) => setDraft({ ...draft, time: e.target.value })}
              className="w-full rounded-xl px-3.5 py-2.5 text-sm font-semibold outline-none cursor-pointer"
              style={{ backgroundColor: C.cream, border: `1px solid ${C.border}`, color: C.text }}
            >
              {timeSlots.map((ts) => (
                <option key={ts} value={ts}>{ts}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: C.muted }}>
              👥 Number of Guests
            </label>
            <div className="flex items-center rounded-xl p-1" style={{ backgroundColor: C.cream, border: `1px solid ${C.border}` }}>
              {[1, 2, 4, 6, 8].map((num) => (
                <button
                  key={num}
                  onClick={() => setDraft({ ...draft, guests: num })}
                  className="flex-1 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all"
                  style={{
                    backgroundColor: draft.guests === num ? C.accent : "transparent",
                    color: draft.guests === num ? "#120D0A" : C.text,
                  }}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: C.muted }}>
              🌿 Seating Ambiance
            </label>
            <select
              value={activeZone}
              onChange={(e) => {
                setActiveZone(e.target.value as any);
                setDraft({ ...draft, zone: e.target.value as any });
              }}
              className="w-full rounded-xl px-3.5 py-2.5 text-sm font-semibold outline-none cursor-pointer"
              style={{ backgroundColor: C.cream, border: `1px solid ${C.border}`, color: C.text }}
            >
              <option value="All">All Restaurant Zones</option>
              <option value="Indoor">Indoor Dining Hall</option>
              <option value="Outdoor">Garden Patio &amp; Pergola</option>
              <option value="Quiet Area">Heritage Quiet Alcove</option>
              <option value="Bar Counter">Barista Coffee Bar</option>
            </select>
          </div>
        </div>
      </CCard>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8">
          <CCard className="p-4 sm:p-6 overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b" style={{ borderColor: C.border }}>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-base" style={{ color: C.accent }}>Architectural Floor Plan</span>
                <span className="text-xs px-2 py-0.5 rounded bg-[#241A13] text-[#E2A955] font-semibold border border-[#382A20]">12 Residency Rd</span>
              </div>
              <div className="flex items-center gap-3">
                <StatusDot status="available" />
                <StatusDot status="reserved" />
                <StatusDot status="occupied" />
              </div>
            </div>

            <div
              className="relative w-full rounded-2xl overflow-hidden select-none shadow-inner"
              style={{
                height: 480,
                backgroundColor: "#140E0A",
                border: `2px solid ${C.border}`,
                backgroundImage: "radial-gradient(#2A1F18 1.5px, transparent 1.5px)",
                backgroundSize: "24px 24px",
              }}
            >
              <div className="absolute top-3 left-4 text-[11px] font-bold tracking-widest uppercase opacity-40 text-[#E2A955]">
                🏛️ INDOOR MAIN HALL
              </div>
              <div className="absolute top-3 right-4 text-[11px] font-bold tracking-widest uppercase opacity-40 text-[#E2A955]">
                🌿 GARDEN VERANDAH &amp; PATIO
              </div>
              <div className="absolute bottom-3 left-4 text-[11px] font-bold tracking-widest uppercase opacity-40 text-[#E2A955]">
                ☕ BARISTA ESPRESSO BAR
              </div>
              <div className="absolute bottom-3 right-4 text-[11px] font-bold tracking-widest uppercase opacity-40 text-[#E2A955]">
                📚 HERITAGE QUIET ALCOVE
              </div>

              <div className="absolute left-1/2 top-0 bottom-0 w-px border-r border-dashed border-[#382A20]" />
              <div className="absolute top-1/2 left-0 right-0 h-px border-b border-dashed border-[#382A20]" />

              {filteredTables.map((t) => {
                const isSelected = selected === t.id;
                const isAvail = t.status === "available";
                const isBigEnough = t.seats >= draft.guests;
                const canSelect = isAvail && isBigEnough;
                const isRound = t.shape === "round";
                const isBooth = t.shape === "booth";
                const isBar = t.shape === "bar";

                const w = isBooth ? 84 : isBar ? 44 : 64;
                const h = isBooth ? 54 : isBar ? 44 : 64;

                return (
                  <button
                    key={t.id}
                    disabled={!canSelect}
                    onClick={() => setSelected(isSelected ? null : t.id)}
                    className="absolute group transition-all duration-200 cursor-pointer flex flex-col items-center justify-center"
                    style={{
                      left: `${t.x}%`,
                      top: `${t.y}%`,
                      transform: `translate(-50%, -50%) ${isSelected ? "scale(1.15)" : "scale(1)"}`,
                      width: w,
                      height: h,
                      borderRadius: isRound || isBar ? "50%" : 16,
                      backgroundColor: isSelected
                        ? "#E2A955"
                        : t.status === "occupied"
                        ? "#221711"
                        : t.status === "reserved"
                        ? "#2E200C"
                        : "#122E1A",
                      color: isSelected
                        ? "#120D0A"
                        : t.status === "occupied"
                        ? "#665445"
                        : t.status === "reserved"
                        ? "#FCD34D"
                        : "#4ADE80",
                      border: isSelected
                        ? "3px solid #FFFDF8"
                        : t.status === "occupied"
                        ? "1.5px solid #3D2B1F"
                        : t.status === "reserved"
                        ? "1.5px solid #F59E0B"
                        : "2px solid #22C55E",
                      boxShadow: isSelected
                        ? "0 0 24px rgba(226, 169, 85, 0.6)"
                        : "0 2px 8px rgba(0,0,0,0.3)",
                      opacity: canSelect || isSelected ? 1 : 0.45,
                    }}
                  >
                    <span className="font-bold text-[11px] leading-none">{t.id}</span>
                    <span className="text-[9px] mt-0.5 opacity-90">{t.seats} Seats</span>
                  </button>
                );
              })}
            </div>
          </CCard>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-5">
          {selectedTableObj ? (
            <CCard className="p-6 flex flex-col gap-4 animate-fade-in shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#E2A955]">Selected Table</span>
                <StatusDot status={selectedTableObj.status} />
              </div>

              <h3 className="font-serif text-2xl font-bold" style={{ color: C.accent }}>{selectedTableObj.name}</h3>
              <p className="text-sm" style={{ color: C.muted }}>{selectedTableObj.desc}</p>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl" style={{ backgroundColor: C.cream, border: `1px solid ${C.border}` }}>
                  <p className="text-[10px] font-bold uppercase text-[#B3A090]">Capacity</p>
                  <p className="font-bold text-sm mt-0.5" style={{ color: C.text }}>{selectedTableObj.seats} Guests Max</p>
                </div>
                <div className="p-2.5 rounded-xl" style={{ backgroundColor: C.cream, border: `1px solid ${C.border}` }}>
                  <p className="text-[10px] font-bold uppercase text-[#B3A090]">Zone</p>
                  <p className="font-bold text-sm mt-0.5" style={{ color: C.text }}>{selectedTableObj.zone}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {selectedTableObj.amenities.map((a) => (
                  <span key={a} className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#14331E] text-[#4ADE80] border border-[#1E542C]">
                    ✓ {a}
                  </span>
                ))}
              </div>

              <div className="pt-2">
                <CBtn label="Proceed to Guest Details →" onClick={() => navigate("reservation")} full size="lg" />
              </div>
            </CCard>
          ) : (
            <CCard className="text-center py-12">
              <p className="text-4xl mb-3">📍</p>
              <h3 className="font-serif text-lg font-bold" style={{ color: C.accent }}>Select a Table on Floor Plan</h3>
              <p className="text-xs mt-1" style={{ color: C.muted }}>Tap any green available table to review its features and reserve.</p>
            </CCard>
          )}
        </div>
      </div>
    </div>
  );
}

function CReservation({ table, draft, setDraft, navigate }: { table: string | null; draft: ReservationDraft; setDraft: React.Dispatch<React.SetStateAction<ReservationDraft>>; navigate: (s: Screen) => void }) {
  const tableObj = tables.find((t) => t.id === table);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 animate-fade-in">
      <button onClick={() => navigate("seats")} className="text-sm font-semibold mb-6 cursor-pointer" style={{ color: C.muted }}>
        ← Change Table Selection
      </button>

      <h1 className="font-serif text-3xl font-bold mb-2" style={{ color: C.accent }}>Confirm Reservation Details</h1>
      <p className="text-sm mb-6" style={{ color: C.muted }}>Table: {tableObj?.name || "T1"} ({tableObj?.zone}) for {draft.guests} Guests at {draft.time}</p>

      <CCard className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: C.muted }}>Your Full Name</label>
          <input
            value={draft.customerName}
            onChange={(e) => setDraft({ ...draft, customerName: e.target.value })}
            placeholder="e.g. Aditi Sharma"
            className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
            style={{ backgroundColor: C.cream, border: `1px solid ${C.border}`, color: C.text }}
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: C.muted }}>Phone Number</label>
          <input
            value={draft.customerPhone}
            onChange={(e) => setDraft({ ...draft, customerPhone: e.target.value })}
            placeholder="e.g. +91 98765 43210"
            className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
            style={{ backgroundColor: C.cream, border: `1px solid ${C.border}`, color: C.text }}
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: C.muted }}>Special Notes or High Chair Request</label>
          <textarea
            value={draft.specialNotes}
            onChange={(e) => setDraft({ ...draft, specialNotes: e.target.value })}
            rows={3}
            placeholder="e.g. Anniversary celebration, baby high chair needed, wheelchair assistance..."
            className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
            style={{ backgroundColor: C.cream, border: `1px solid ${C.border}`, color: C.text }}
          />
        </div>

        <CBtn label="Confirm &amp; Book Table" onClick={() => navigate("reservation-confirm")} full size="lg" />
      </CCard>
    </div>
  );
}

function CResConfirm({ table, draft, navigate }: { table: string | null; draft: ReservationDraft; navigate: (s: Screen) => void }) {
  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-16 text-center flex flex-col items-center gap-4 animate-fade-in">
      <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold bg-[#14331E] text-[#4ADE80] border-2 border-[#22C55E]">
        ✓
      </div>
      <h1 className="font-serif text-3xl font-bold" style={{ color: C.accent }}>Reservation Confirmed!</h1>
      <p className="text-sm" style={{ color: C.muted }}>We look forward to welcoming you to AJAB.</p>
      <CCard className="w-full text-left flex flex-col gap-2 mt-2">
        <div className="flex justify-between text-sm font-semibold"><span>Booking ID:</span><span style={{ color: C.accent }}>RES-AJAB-8341</span></div>
        <div className="flex justify-between text-sm font-semibold"><span>Table:</span><span>{table || "T1"} ({tables.find((t) => t.id === table)?.zone || "Indoor"})</span></div>
        <div className="flex justify-between text-sm font-semibold"><span>Date &amp; Time:</span><span>{draft.date} at {draft.time}</span></div>
        <div className="flex justify-between text-sm font-semibold"><span>Guests:</span><span>{draft.guests} Persons</span></div>
      </CCard>
      <div className="mt-4">
        <CBtn label="Back to Home" onClick={() => navigate("home")} />
      </div>
    </div>
  );
}

function CEvents({ navigate }: { navigate: (s: Screen) => void }) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 animate-fade-in">
      <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-2" style={{ color: C.accent }}>Cultural Events &amp; Workshops</h1>
      <p className="text-sm mb-8" style={{ color: C.muted }}>Live Sufi evenings, botanical watercolor art, and single-origin coffee masterclasses.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cafeEvents.map((e) => (
          <div key={e.id} className="rounded-3xl overflow-hidden flex flex-col justify-between" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
            <img src={e.img} alt={e.imgAlt} className="w-full h-48 object-cover" />
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#36270E] text-[#FCD34D] border border-[#5C4217]">{e.tag}</span>
                <h3 className="font-serif text-xl font-bold mt-2" style={{ color: C.text }}>{e.name}</h3>
                <p className="text-xs font-bold mt-1" style={{ color: C.accent }}>📅 {e.date}</p>
                <p className="text-xs mt-2 leading-relaxed" style={{ color: C.muted }}>{e.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t flex items-center justify-between" style={{ borderColor: C.border }}>
                <span className="font-bold text-sm" style={{ color: C.accent }}>₹ {e.price} / person</span>
                <CBtn label="Book Seat" onClick={() => navigate("seats")} size="sm" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CAbout() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 animate-fade-in flex flex-col gap-10">
      <div>
        <h1 className="font-serif text-4xl font-bold mb-3" style={{ color: C.accent }}>About AJAB</h1>
        <p className="text-base leading-relaxed" style={{ color: C.muted }}>
          AJAB was born out of a desire to preserve the timeless warmth of Indian tea and coffee culture while welcoming every modern guest with universal inclusive design. We partner directly with family estates in Chikmagalur and Assam for shade-grown coffee and single-origin teas.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <CCard><h3 className="font-bold text-base mb-1" style={{ color: C.accent }}>🌱 Organic Sourcing</h3><p className="text-xs" style={{ color: C.muted }}>Estate coffee, pure A2 dairy, and organic herbs with zero artificial flavorings.</p></CCard>
        <CCard><h3 className="font-bold text-base mb-1" style={{ color: C.accent }}>♿ Universal Inclusion</h3><p className="text-xs" style={{ color: C.muted }}>Senior citizen typography, screen reader tags, low-data modes, and step-free wheelchair access.</p></CCard>
        <CCard><h3 className="font-bold text-base mb-1" style={{ color: C.accent }}>📍 Visit Us</h3><p className="text-xs" style={{ color: C.muted }}>12 Residency Road, Bangalore · Open Daily 8:00 AM – 11:00 PM</p></CCard>
      </div>

      {/* Surroundings Map */}
      <CafeSurroundingsMap />
    </div>
  );
}

function CFeedback() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-12 animate-fade-in">
      <h1 className="font-serif text-3xl font-bold mb-2" style={{ color: C.accent }}>Guest Feedback</h1>
      <p className="text-sm mb-6" style={{ color: C.muted }}>Help us make AJAB even more welcoming and delicious.</p>

      {submitted ? (
        <CCard className="text-center py-10">
          <p className="text-4xl mb-2">💌</p>
          <h3 className="font-serif text-xl font-bold" style={{ color: C.accent }}>Thank you for your thoughts!</h3>
          <p className="text-xs mt-1" style={{ color: C.muted }}>Our founding team reviews every piece of guest feedback personally.</p>
        </CCard>
      ) : (
        <CCard className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: C.muted }}>Your Experience Rating</label>
            <div className="flex gap-2 text-2xl">
              {["⭐", "⭐", "⭐", "⭐", "⭐"].map((s, i) => (
                <button key={i} className="cursor-pointer hover:scale-125 transition-transform">{s}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: C.muted }}>Comments or Suggestions</label>
            <textarea rows={4} className="w-full rounded-xl p-3 text-sm outline-none" style={{ backgroundColor: C.cream, border: `1px solid ${C.border}`, color: C.text }} placeholder="Tell us about the food, accessibility, or ambiance..." />
          </div>
          <CBtn label="Submit Feedback" onClick={() => setSubmitted(true)} full />
        </CCard>
      )}
    </div>
  );
}

function CAccessibility({ setMode }: { setMode: (m: AppMode) => void }) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 animate-fade-in flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl font-bold mb-2" style={{ color: C.accent }}>AJAB Accessibility Hub</h1>
        <p className="text-sm" style={{ color: C.muted }}>Choose an accessible mode designed specifically for your viewing and interaction needs.</p>
      </div>

      <CCard className="p-5">
        <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: C.muted }}>User Mode</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            ["Standard", "Regular AJAB website", () => setMode("common")],
            ["Senior Citizen", "Large text & touch targets", () => setMode("elderly")],
            ["Rural / Multilingual", "English, Hindi & Marathi", () => setMode("rural")],
            ["Visually Impaired", "High contrast & audio", () => setMode("vi")],
          ].map(([label, sub, action]) => (
            <button key={String(label)} onClick={action as () => void} className="rounded-2xl p-3 text-left cursor-pointer transition-all hover:-translate-y-0.5 hover:border-[#D4A359]" style={{ backgroundColor: C.cream, border: `1px solid ${C.border}` }}>
              <p className="font-bold text-xs" style={{ color: C.accent }}>{label}</p>
              <p className="text-[11px] mt-1 leading-snug" style={{ color: C.muted }}>{sub}</p>
            </button>
          ))}
        </div>
      </CCard>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <CCard onClick={() => setMode("elderly")} className="text-center">
          <div className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center font-bold text-xl mb-3" style={{ backgroundColor: "#3D1F00", color: "#FFF" }}>Aa</div>
          <h3 className="font-bold text-base" style={{ color: C.accent }}>Senior Citizen Mode</h3>
          <p className="text-xs mt-1" style={{ color: C.muted }}>Large touch buttons, high readability, spoken audio.</p>
        </CCard>

        <CCard onClick={() => setMode("rural")} className="text-center">
          <div className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-xl mb-3" style={{ backgroundColor: "#203810", color: "#A7F3D0" }}>🌐</div>
          <h3 className="font-bold text-base" style={{ color: "#4ADE80" }}>Rural / Multilingual</h3>
          <p className="text-xs mt-1" style={{ color: C.muted }}>English, हिंदी &amp; मराठी with full translation &amp; offline mode.</p>
        </CCard>

        <CCard onClick={() => setMode("vi")} className="text-center">
          <div className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-xl mb-3" style={{ backgroundColor: "#0D0600", color: "#FFD166", border: "1px solid #C49A24" }}>👁</div>
          <h3 className="font-bold text-base" style={{ color: C.accent }}>Visually Impaired</h3>
          <p className="text-xs mt-1" style={{ color: C.muted }}>Ultra-high contrast dark theme &amp; image descriptions.</p>
        </CCard>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SENIOR CITIZEN (ELDERLY) VERSION
═══════════════════════════════════════════════════════════════════════ */
function ElderlyApp({ setMode }: { setMode: (m: AppMode) => void }) {
  const [screen, setScreen] = useState<"e-home" | "e-menu" | "e-food-details" | "e-cart" | "e-seats" | "e-res-confirm" | "e-settings">("e-home");
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [selectedTable, setSelectedTable] = useState<string>("T1");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [textSize, setTextSize] = useState<"Large" | "Extra Large">("Large");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const addToCart = (f: FoodItem) => {
    setCart((prev) => {
      const exist = prev.find((c) => c.id === f.id);
      return exist ? prev.map((c) => (c.id === f.id ? { ...c, qty: c.qty + 1 } : c)) : [...prev, { id: f.id, name: f.name, price: f.price, qty: 1, img: f.img }];
    });
  };

  const updateQty = (id: number, d: number) => {
    setCart((prev) => prev.map((c) => (c.id === id ? { ...c, qty: c.qty + d } : c)).filter((c) => c.qty > 0));
  };

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const filteredElderlyItems = menuItems.filter((m) => selectedCategory === "All" || m.category === selectedCategory);

  return (
    <div style={{ minHeight: "100%", backgroundColor: EC.bg, color: EC.text, fontFamily: "'DM Sans',sans-serif", fontSize: textSize === "Extra Large" ? 20 : 17 }}>
      <div className="w-full py-2.5 px-6 flex items-center justify-between text-sm font-bold" style={{ backgroundColor: "#2A180E", color: EC.accent, borderBottom: `2px solid ${EC.border}` }}>
        <span>👓 Senior Citizen Display — High Contrast &amp; Large Buttons</span>
        <button onClick={() => setMode("common")} className="underline cursor-pointer text-xs font-semibold px-3 py-1 rounded bg-white/10 hover:bg-white/20" style={{ color: "#FFFDF8" }}>
          ← Return to Standard
        </button>
      </div>

      <header style={{ backgroundColor: EC.cream, borderBottom: `3px solid ${EC.border}` }} className="sticky top-0 z-40 w-full">
        <div className="max-w-5xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <button onClick={() => setScreen("e-home")} className="cursor-pointer flex items-center gap-3">
            <AjabLogo size={44} />
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700, color: EC.accent, letterSpacing: 2 }}>
              AJAB
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-2">
            {[
              { label: "🏠 HOME", s: "e-home" as const },
              { label: "🍵 MENU", s: "e-menu" as const },
              { label: "📅 RESERVE", s: "e-seats" as const },
              { label: "⚙ SETTINGS", s: "e-settings" as const },
            ].map((l) => (
              <button
                key={l.label}
                onClick={() => setScreen(l.s)}
                className="rounded-xl px-4 py-2 font-bold cursor-pointer"
                style={{
                  backgroundColor: screen === l.s ? EC.btn : EC.card,
                  color: screen === l.s ? EC.btnText : EC.text,
                  border: `2px solid ${screen === l.s ? EC.btn : EC.border}`,
                }}
              >
                {l.label}
              </button>
            ))}
          </nav>

          <button onClick={() => setScreen("e-cart")} className="rounded-xl px-4 py-2 font-bold cursor-pointer flex items-center gap-2" style={{ backgroundColor: EC.btn, color: EC.btnText }}>
            🛒 Cart ({cartCount})
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {screen === "e-home" && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div className="rounded-3xl p-6" style={{ backgroundColor: EC.card, border: `3px solid ${EC.border}` }}>
              <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 34, color: EC.accent, fontWeight: 700 }}>Welcome to AJAB Café</h1>
              <p style={{ color: EC.muted, fontSize: 19, marginTop: 8 }}>Hot filter coffee, soothing tea, fresh food, and comfortable seating.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button onClick={() => setScreen("e-menu")} className="rounded-2xl p-6 font-bold cursor-pointer text-left" style={{ backgroundColor: EC.card, border: `3px solid ${EC.border}`, fontSize: 20, color: EC.text }}>
                🍵  Browse All 44 Dishes
              </button>
              <button onClick={() => setScreen("e-seats")} className="rounded-2xl p-6 font-bold cursor-pointer text-left" style={{ backgroundColor: EC.card, border: `3px solid ${EC.border}`, fontSize: 20, color: EC.text }}>
                📅  Reserve a Dining Table
              </button>
            </div>
          </div>
        )}

        {screen === "e-menu" && (
          <div className="animate-fade-in flex flex-col gap-6">
            <div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, color: EC.accent, fontWeight: 700 }}>Our Food &amp; Drinks</h2>
              <p style={{ color: EC.muted, fontSize: 18, marginTop: 4 }}>Tap any category or dish to view details.</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {["All", "Beverages", "Starters", "Main Course", "Desserts"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="rounded-xl px-4 py-2 font-bold cursor-pointer"
                  style={{
                    backgroundColor: selectedCategory === cat ? EC.btn : EC.card,
                    color: selectedCategory === cat ? EC.btnText : EC.text,
                    border: `2px solid ${EC.border}`,
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {filteredElderlyItems.map((item) => (
                <div key={item.id} className="rounded-3xl p-5 flex flex-col justify-between" style={{ backgroundColor: EC.card, border: `3px solid ${EC.border}` }}>
                  <div className="flex gap-4 items-center">
                    <FoodImage src={item.img} alt={item.imgAlt} name={item.name} className="w-24 h-24 rounded-2xl object-cover shrink-0" />
                    <div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#14331E] text-[#4ADE80] border border-[#1E542C]">
                        {item.foodType === "veg" ? "● VEG" : "● NON-VEG"}
                      </span>
                      <h3 className="font-bold text-xl mt-1" style={{ color: EC.text }}>{item.name}</h3>
                      <p className="font-bold text-xl mt-1" style={{ color: EC.accent }}>₹ {item.price}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t flex gap-2" style={{ borderColor: EC.border }}>
                    <button
                      onClick={() => { setSelectedFood(item); setScreen("e-food-details"); }}
                      className="flex-1 py-3 rounded-xl font-bold text-center cursor-pointer"
                      style={{ backgroundColor: EC.cream, color: EC.accent, border: `2px solid ${EC.border}` }}
                    >
                      Details
                    </button>
                    <button
                      onClick={() => addToCart(item)}
                      className="flex-1 py-3 rounded-xl font-bold text-center cursor-pointer"
                      style={{ backgroundColor: EC.btn, color: EC.btnText }}
                    >
                      + Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {screen === "e-food-details" && selectedFood && (
          <div className="animate-fade-in flex flex-col gap-5">
            <button onClick={() => setScreen("e-menu")} className="font-bold text-base cursor-pointer" style={{ color: EC.muted }}>
              ← Back to Menu
            </button>
            <div className="rounded-3xl p-6" style={{ backgroundColor: EC.card, border: `3px solid ${EC.border}` }}>
              <FoodImage src={selectedFood.img} alt={selectedFood.imgAlt} name={selectedFood.name} className="w-full h-64 rounded-2xl object-cover" />
              <div className="flex items-center justify-between mt-4">
                <h2 className="font-serif text-3xl font-bold" style={{ color: EC.accent }}>{selectedFood.name}</h2>
                <ReadAloudBtn text={`${selectedFood.name}. ${selectedFood.desc}. Priced at ${selectedFood.price} rupees.`} />
              </div>
              <p className="text-lg mt-2" style={{ color: EC.muted, lineHeight: 1.6 }}>{selectedFood.desc}</p>
              <p className="text-3xl font-bold mt-3" style={{ color: EC.accent }}>₹ {selectedFood.price}</p>

              <div className="p-4 rounded-2xl my-4" style={{ backgroundColor: EC.cream, border: `2px solid ${EC.border}` }}>
                <p className="font-bold text-sm" style={{ color: EC.text }}>Key Ingredients:</p>
                <p className="text-base mt-1" style={{ color: EC.muted }}>{selectedFood.ingredients.join(", ")}</p>
                <p className="font-bold text-sm mt-3" style={{ color: EC.text }}>Allergen Notice:</p>
                <p className="text-base mt-1" style={{ color: EC.muted }}>{selectedFood.allergens.length ? `Contains: ${selectedFood.allergens.join(", ")}` : "No major allergens."}</p>
              </div>

              <button
                onClick={() => { addToCart(selectedFood); setScreen("e-cart"); }}
                className="w-full py-4 rounded-2xl font-bold text-xl cursor-pointer text-center"
                style={{ backgroundColor: EC.btn, color: EC.btnText }}
              >
                + Add to Cart (₹ {selectedFood.price})
              </button>
            </div>
          </div>
        )}

        {screen === "e-cart" && (
          <div className="animate-fade-in flex flex-col gap-6">
            <h2 className="font-serif text-3xl font-bold" style={{ color: EC.accent }}>Your Order Cart</h2>
            {cart.length === 0 ? (
              <div className="p-8 rounded-3xl text-center" style={{ backgroundColor: EC.card, border: `3px solid ${EC.border}` }}>
                <p className="text-3xl mb-2">🛒</p>
                <p className="text-xl font-bold" style={{ color: EC.text }}>Your cart is empty.</p>
                <button onClick={() => setScreen("e-menu")} className="mt-4 px-6 py-3 rounded-2xl font-bold text-base cursor-pointer" style={{ backgroundColor: EC.btn, color: EC.btnText }}>
                  Browse Food Menu
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {cart.map((item) => (
                  <div key={item.id} className="p-5 rounded-2xl flex items-center justify-between" style={{ backgroundColor: EC.card, border: `2px solid ${EC.border}` }}>
                    <div>
                      <p className="font-bold text-xl" style={{ color: EC.text }}>{item.name}</p>
                      <p className="text-lg" style={{ color: EC.accent }}>₹ {item.price} each</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => updateQty(item.id, -1)} className="w-10 h-10 rounded-xl font-bold text-xl bg-[#1F1610] text-[#FFF] border border-[#855831]">−</button>
                      <span className="font-bold text-xl w-6 text-center" style={{ color: EC.text }}>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="w-10 h-10 rounded-xl font-bold text-xl bg-[#1F1610] text-[#FFF] border border-[#855831]">+</button>
                    </div>
                  </div>
                ))}
                <div className="p-6 rounded-3xl mt-4" style={{ backgroundColor: EC.card, border: `3px solid ${EC.border}` }}>
                  <div className="flex justify-between text-2xl font-bold">
                    <span style={{ color: EC.text }}>Total Bill:</span>
                    <span style={{ color: EC.accent }}>₹ {cart.reduce((s, c) => s + c.price * c.qty, 0)}</span>
                  </div>
                  <button onClick={() => { alert("Order received!"); setCart([]); setScreen("e-home"); }} className="w-full py-4 rounded-2xl font-bold text-xl mt-4 cursor-pointer" style={{ backgroundColor: EC.btn, color: EC.btnText }}>
                    Confirm &amp; Place Order
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {screen === "e-seats" && (
          <div className="animate-fade-in flex flex-col gap-6">
            <h2 className="font-serif text-3xl font-bold" style={{ color: EC.accent }}>Select a Dining Table</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tables.map((t) => (
                <button
                  key={t.id}
                  disabled={t.status !== "available"}
                  onClick={() => setSelectedTable(t.id)}
                  className="rounded-3xl p-5 text-left cursor-pointer"
                  style={{
                    backgroundColor: selectedTable === t.id ? EC.btn : EC.card,
                    color: selectedTable === t.id ? EC.btnText : EC.text,
                    border: `3px solid ${EC.border}`,
                    opacity: t.status === "available" ? 1 : 0.4,
                  }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">{t.name}</span>
                    <StatusDot status={t.status} />
                  </div>
                  <p className="text-base mt-1" style={{ color: selectedTable === t.id ? EC.btnText : EC.muted }}>{t.zone} · {t.seats} Persons · {t.feature}</p>
                </button>
              ))}
            </div>

            {selectedTable && (
              <button onClick={() => setScreen("e-res-confirm")} className="w-full py-4 rounded-2xl font-bold text-xl cursor-pointer mt-4" style={{ backgroundColor: EC.btn, color: EC.btnText }}>
                Confirm Table {selectedTable} Booking
              </button>
            )}
          </div>
        )}

        {screen === "e-res-confirm" && (
          <div className="rounded-3xl p-8 text-center flex flex-col items-center gap-4 animate-fade-in" style={{ backgroundColor: EC.card, border: `3px solid ${EC.border}` }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold bg-[#14331E] text-[#4ADE80] border-2 border-[#22C55E]">
              ✓
            </div>
            <h2 className="font-serif text-3xl font-bold" style={{ color: EC.accent }}>Table Booked!</h2>
            <p className="text-lg" style={{ color: EC.muted }}>We have reserved Table {selectedTable} for your visit.</p>
            <button onClick={() => setScreen("e-home")} className="px-8 py-3.5 rounded-2xl font-bold text-lg cursor-pointer" style={{ backgroundColor: EC.btn, color: EC.btnText }}>
              Back to Home
            </button>
          </div>
        )}

        {screen === "e-settings" && (
          <div className="animate-fade-in flex flex-col gap-6">
            <h2 className="font-serif text-3xl font-bold" style={{ color: EC.accent }}>Settings</h2>
            <div className="rounded-3xl p-6 flex flex-col gap-4" style={{ backgroundColor: EC.card, border: `3px solid ${EC.border}` }}>
              <p className="font-bold text-lg" style={{ color: EC.text }}>Text Size:</p>
              <div className="grid grid-cols-2 gap-3">
                {(["Large", "Extra Large"] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setTextSize(sz)}
                    className="py-3 rounded-2xl font-bold text-lg"
                    style={{
                      backgroundColor: textSize === sz ? EC.btn : EC.cream,
                      color: textSize === sz ? EC.btnText : EC.text,
                      border: `2px solid ${EC.border}`,
                    }}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   RURAL / MULTILINGUAL VERSION (100% TRANSLATED)
═══════════════════════════════════════════════════════════════════════ */
function RuralApp({ setMode }: { setMode: (m: AppMode) => void }) {
  const [screen, setScreen] = useState<"r-home" | "r-menu" | "r-seats" | "r-cart">("r-home");
  const [lang, setLang] = useState<Lang>("hi");
  const [lowData, setLowData] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  const t = T[lang];
  const addToCart = (f: FoodItem) => {
    const localizedName = lang === "hi" ? f.nameHi : lang === "mr" ? f.nameMr : f.name;
    setCart((p) => [...p, { id: f.id, name: localizedName, price: f.price, qty: 1, img: f.img }]);
  };

  return (
    <div style={{ minHeight: "100%", backgroundColor: C.bg, color: C.text, fontFamily: "'DM Sans',sans-serif" }}>
      <div className="w-full py-2 px-6 flex items-center justify-between text-sm font-semibold" style={{ backgroundColor: "#203810", color: "#A7F3D0" }}>
        <span>{t.ruralBanner}</span>
        <button onClick={() => setMode("common")} className="underline cursor-pointer text-xs" style={{ color: "#D4E8C4" }}>
          {t.returnToStandard}
        </button>
      </div>

      <header style={{ backgroundColor: C.card, borderBottom: `1px solid ${C.border}` }} className="sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AjabLogo size={38} />
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: C.accent }}>AJAB</span>
          </div>

          <div className="flex items-center gap-2">
            {(["en", "hi", "mr"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className="rounded-xl px-3 py-1.5 text-xs font-bold cursor-pointer"
                style={{
                  backgroundColor: lang === l ? C.accent : C.cream,
                  color: lang === l ? "#120D0A" : C.text,
                  border: `1px solid ${C.border}`,
                }}
              >
                {l === "en" ? "EN" : l === "hi" ? "हिंदी" : "मराठी"}
              </button>
            ))}

            <button
              onClick={() => setLowData(!lowData)}
              className="rounded-xl px-2.5 py-1.5 text-xs font-semibold cursor-pointer"
              style={{ backgroundColor: lowData ? "#92400E" : C.cream, color: lowData ? "#FFF" : C.text, border: `1px solid ${C.border}` }}
            >
              {lowData ? t.lowDataOn : t.lowDataOff}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {screen === "r-home" && (
          <div className="flex flex-col gap-6">
            {!lowData && (
              <div className="w-full rounded-2xl overflow-hidden h-48 border" style={{ borderColor: C.border }}>
                <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=400&fit=crop&auto=format" alt="AJAB" className="w-full h-full object-cover" />
              </div>
            )}
            <CCard>
              <h1 className="font-serif text-2xl font-bold" style={{ color: C.accent }}>{t.heroTitle}</h1>
              <p className="text-sm mt-2" style={{ color: C.muted }}>{t.heroSub}</p>
            </CCard>

            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setScreen("r-menu")} className="rounded-2xl p-5 text-center font-bold text-lg cursor-pointer" style={{ backgroundColor: C.card, border: `1px solid ${C.border}`, color: C.text }}>
                🍵 {t.viewMenu}
              </button>
              <button onClick={() => setScreen("r-seats")} className="rounded-2xl p-5 text-center font-bold text-lg cursor-pointer" style={{ backgroundColor: C.card, border: `1px solid ${C.border}`, color: C.text }}>
                📅 {t.reserveTable}
              </button>
            </div>
          </div>
        )}

        {screen === "r-menu" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-2xl font-bold" style={{ color: C.accent }}>{t.menu}</h2>
              <button onClick={() => setScreen("r-home")} className="text-xs font-bold underline" style={{ color: C.accent }}>← {t.home}</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {menuItems.map((item) => {
                const name = lang === "hi" ? item.nameHi : lang === "mr" ? item.nameMr : item.name;
                const desc = lang === "hi" ? item.descHi : lang === "mr" ? item.descMr : item.desc;
                return (
                  <div key={item.id} className="rounded-2xl p-4 flex gap-3 items-center" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
                    {!lowData && <FoodImage src={item.img} alt={item.imgAlt} name={name} className="w-16 h-16 rounded-xl object-cover shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate" style={{ color: C.text }}>{name}</p>
                      <p className="text-xs line-clamp-1" style={{ color: C.muted }}>{desc}</p>
                      <p className="text-xs font-bold mt-1" style={{ color: C.accent }}>₹ {item.price}</p>
                    </div>
                    <button onClick={() => addToCart(item)} className="px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer" style={{ backgroundColor: C.accent, color: "#120D0A" }}>
                      + {t.addToCart}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {screen === "r-seats" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-2xl font-bold" style={{ color: C.accent }}>{t.floorPlanTitle}</h2>
              <button onClick={() => setScreen("r-home")} className="text-xs font-bold underline" style={{ color: C.accent }}>← {t.home}</button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {tables.map((t2) => {
                const name = lang === "hi" ? t2.nameHi : lang === "mr" ? t2.nameMr : t2.name;
                const zone = lang === "hi" ? t2.zoneHi : lang === "mr" ? t2.zoneMr : t2.zone;
                return (
                  <div key={t2.id} className="p-4 rounded-xl" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
                    <p className="font-bold text-base" style={{ color: C.text }}>{name}</p>
                    <p className="text-xs" style={{ color: C.muted }}>{zone} · {t2.seats} pax</p>
                    <div className="mt-2"><StatusDot status={t2.status} /></div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   VISUALLY IMPAIRED VERSION (ULTRA-HIGH CONTRAST DARK)
═══════════════════════════════════════════════════════════════════════ */
function VIApp({ setMode }: { setMode: (m: AppMode) => void }) {
  const [screen, setScreen] = useState<"vi-home" | "vi-menu" | "vi-seats">("vi-home");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showImgDesc, setShowImgDesc] = useState(true);

  const addToCart = (f: FoodItem) => setCart((p) => [...p, { id: f.id, name: f.name, price: f.price, qty: 1, img: f.img }]);

  return (
    <div style={{ minHeight: "100%", backgroundColor: VI.bg, color: VI.text, fontFamily: "'DM Sans',sans-serif", fontSize: 18 }}>
      <div className="w-full py-2 px-6 flex items-center justify-between text-sm font-bold" style={{ backgroundColor: "#1C1005", color: VI.accent, borderBottom: `2px solid ${VI.border}` }}>
        <span>👁 Visually Impaired Mode (Ultra-High Contrast Dark)</span>
        <button onClick={() => setMode("common")} className="underline cursor-pointer" style={{ color: VI.muted }}>
          ← Return to Standard
        </button>
      </div>

      <header style={{ backgroundColor: "#150A02", borderBottom: `2px solid ${VI.border}` }} className="sticky top-0 z-40 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={() => setScreen("vi-home")} className="font-serif text-2xl font-bold" style={{ color: VI.accent }}>
            AJAB CAFÉ
          </button>
          <div className="flex gap-3">
            <button onClick={() => setScreen("vi-home")} className="px-3 py-1.5 font-bold rounded-lg" style={{ color: VI.accent }}>Home</button>
            <button onClick={() => setScreen("vi-menu")} className="px-3 py-1.5 font-bold rounded-lg" style={{ color: VI.accent }}>Menu (44)</button>
            <button onClick={() => setScreen("vi-seats")} className="px-3 py-1.5 font-bold rounded-lg" style={{ color: VI.accent }}>Tables</button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 flex flex-col gap-6">
        {screen === "vi-home" && (
          <>
            <div className="p-6 rounded-2xl" style={{ backgroundColor: VI.card, border: `2px solid ${VI.border}` }}>
              <h1 className="font-serif text-3xl font-bold" style={{ color: VI.accent }}>Warmth in every cup and corner.</h1>
              <p className="mt-3 text-lg" style={{ color: VI.muted }}>
                AJAB blends the unhurried rhythms of Indian chai culture with an accessible contemporary café experience.
              </p>
              {showImgDesc && (
                <div className="mt-4 p-3 rounded-xl bg-black/80 border border-[#FFD166]">
                  <p className="text-xs font-bold text-[#FFD166]">📷 Image Description:</p>
                  <p className="text-sm mt-1">"Warm wooden chairs, glowing amber lamps, and brass davarah filter coffee tumblers."</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setScreen("vi-menu")} className="p-5 rounded-2xl font-bold text-xl cursor-pointer" style={{ backgroundColor: VI.btn, color: VI.btnText }}>
                Browse 44 Dishes
              </button>
              <button onClick={() => setScreen("vi-seats")} className="p-5 rounded-2xl font-bold text-xl cursor-pointer" style={{ backgroundColor: VI.card, color: VI.accent, border: `2px solid ${VI.border}` }}>
                Table Availability
              </button>
            </div>
          </>
        )}

        {screen === "vi-menu" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-3xl font-bold" style={{ color: VI.accent }}>Accessible Menu (44 Dishes)</h2>
              <button onClick={() => setShowImgDesc(!showImgDesc)} className="text-xs font-bold underline text-[#FFD166]">
                {showImgDesc ? "Hide Image Descriptions" : "Show Image Descriptions"}
              </button>
            </div>

            {menuItems.map((item) => (
              <div key={item.id} className="p-5 rounded-2xl flex flex-col gap-2" style={{ backgroundColor: VI.card, border: `2px solid ${VI.border}` }}>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-black text-[#FFD166] border border-[#FFD166]">
                      {item.foodType.toUpperCase()}
                    </span>
                    <h3 className="font-bold text-2xl mt-1" style={{ color: VI.text }}>{item.name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <ReadAloudBtn text={`${item.name}. ${item.desc}. ${item.price} rupees.`} />
                    <span className="font-bold text-2xl" style={{ color: VI.accent }}>₹ {item.price}</span>
                  </div>
                </div>

                <p style={{ color: VI.muted }}>{item.desc}</p>

                {showImgDesc && (
                  <p className="text-xs p-2 rounded bg-black/40 text-[#FFD166] border border-[#FFD166]/40">
                    📷 Photo: "{item.imgAlt}"
                  </p>
                )}

                <p className="text-sm font-semibold" style={{ color: VI.accent }}>
                  {item.cal} Calories · {item.protein}g Protein · {item.allergens.length ? `Contains ${item.allergens.join(", ")}` : "Allergen Free"}
                </p>

                <div className="mt-2">
                  <button onClick={() => addToCart(item)} className="px-5 py-2.5 rounded-xl font-bold text-base cursor-pointer" style={{ backgroundColor: VI.btn, color: VI.btnText }}>
                    + Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {screen === "vi-seats" && (
          <div className="flex flex-col gap-4">
            <h2 className="font-serif text-3xl font-bold" style={{ color: VI.accent }}>Live Table Availability</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tables.map((t) => (
                <div key={t.id} className="p-5 rounded-2xl flex flex-col gap-2" style={{ backgroundColor: VI.card, border: `2px solid ${VI.border}` }}>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-2xl" style={{ color: VI.text }}>{t.name}</span>
                    <span className="text-sm font-bold px-3 py-1 rounded bg-black text-[#FFD166] border border-[#FFD166]">
                      {t.status.toUpperCase()}
                    </span>
                  </div>
                  <p style={{ color: VI.muted }}>{t.zone} · {t.seats} Persons · {t.feature}</p>
                  <p className="text-sm" style={{ color: VI.text }}>{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN APP CONTROLLER & SCREEN ROUTING
═══════════════════════════════════════════════════════════════════════ */
function CommonApp({ setMode }: { setMode: (m: AppMode) => void }) {
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>("T1");
  const [voiceFilter, setVoiceFilter] = useState<VoiceFilterState | null>(null);
  const [reservation, setReservation] = useState<ReservationDraft>({
    date: "2024-10-14",
    time: "7:30 PM",
    guests: 2,
    zone: "All",
    preference: "Window View",
    occasion: "Casual Dining",
    specialNotes: "",
    customerName: "",
    customerPhone: "",
  });

  const navigate = (s: Screen) => {
    setScreen(s);
    window.scrollTo({ top: 0 });
  };

  const addToCart = (f: FoodItem) => {
    setCart((prev) => {
      const exist = prev.find((c) => c.id === f.id);
      return exist
        ? prev.map((c) => (c.id === f.id ? { ...c, qty: c.qty + 1 } : c))
        : [...prev, { id: f.id, name: f.name, price: f.price, qty: 1, img: f.img }];
    });
  };

  const updateQty = (id: number, d: number) => {
    setCart((prev) => prev.map((c) => (c.id === id ? { ...c, qty: c.qty + d } : c)).filter((c) => c.qty > 0));
  };

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  return (
    <div style={{ minHeight: "100%", backgroundColor: C.bg, color: C.text, fontFamily: "'DM Sans',sans-serif" }}>
      <CNav navigate={navigate} active={screen} cartCount={cartCount} />

      <VoiceAssistantModal
        navigate={navigate}
        onApplyVoiceFilter={(vf) => setVoiceFilter(vf)}
        onClearVoiceFilter={() => setVoiceFilter(null)}
        activeFilter={voiceFilter}
      />
      <AccessibilityMenuModal setMode={setMode} />

      <main>
        {screen === "home" && (
          <CHome
            navigate={navigate}
            addToCart={addToCart}
            setFood={setSelectedFood}
          />
        )}
        {screen === "menu" && (
          <CMenu
            navigate={navigate}
            setFood={setSelectedFood}
            addToCart={addToCart}
            voiceFilter={voiceFilter}
            onClearVoiceFilter={() => setVoiceFilter(null)}
          />
        )}
        {screen === "food-details" && <CFoodDetails food={selectedFood} navigate={navigate} addToCart={addToCart} />}
        {screen === "cart" && <CCart cart={cart} navigate={navigate} updateQty={updateQty} />}
        {screen === "order-confirm" && <COrderConfirm navigate={navigate} />}
        {screen === "seats" && (
          <CSeats
            navigate={navigate}
            selected={selectedTable}
            setSelected={setSelectedTable}
            draft={reservation}
            setDraft={setReservation}
          />
        )}
        {screen === "reservation" && (
          <CReservation
            navigate={navigate}
            table={selectedTable}
            draft={reservation}
            setDraft={setReservation}
          />
        )}
        {screen === "reservation-confirm" && (
          <CResConfirm
            navigate={navigate}
            table={selectedTable}
            draft={reservation}
          />
        )}
        {screen === "events" && <CEvents navigate={navigate} />}
        {screen === "about" && <CAbout />}
        {screen === "feedback" && <CFeedback />}
        {screen === "accessibility" && <CAccessibility setMode={setMode} />}
      </main>

      <footer className="mt-16 py-12 text-center text-xs border-t" style={{ backgroundColor: "#0D0907", borderColor: "#2B1E16", color: C.muted }}>
        <div className="max-w-5xl mx-auto px-6 flex flex-col items-center gap-3">
          <AjabLogo size={52} />
          <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: C.accent, letterSpacing: 2 }}>
            AJAB · CAFE &amp; RESTAURANT
          </p>
          <p className="max-w-md text-xs leading-relaxed" style={{ color: C.muted }}>
            Modern Indian Café · Sourcing estate chicory coffee, organic teas, and regional heritage delicacies. Designed with universal accessibility for all guests.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-3 font-semibold">
            <button onClick={() => navigate("home")} className="cursor-pointer hover:underline" style={{ color: C.text }}>Home</button>
            <button onClick={() => navigate("menu")} className="cursor-pointer hover:underline" style={{ color: C.text }}>Menu</button>
            <button onClick={() => navigate("seats")} className="cursor-pointer hover:underline" style={{ color: C.text }}>Table Floor Plan</button>
            <button onClick={() => navigate("events")} className="cursor-pointer hover:underline" style={{ color: C.text }}>Events</button>
            <button onClick={() => navigate("about")} className="cursor-pointer hover:underline" style={{ color: C.text }}>About Us</button>
            <button onClick={() => navigate("feedback")} className="cursor-pointer hover:underline" style={{ color: C.text }}>Feedback</button>
            <button onClick={() => navigate("accessibility")} className="cursor-pointer hover:underline" style={{ color: C.text }}>Accessibility</button>
          </div>
          <p className="text-[11px] mt-4 opacity-70">© 2024–2026 AJAB Café &amp; Restaurant. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  const [mode, setMode] = useState<AppMode>("common");

  if (mode === "elderly") return <ElderlyApp setMode={setMode} />;
  if (mode === "rural")   return <RuralApp   setMode={setMode} />;
  if (mode === "vi")      return <VIApp      setMode={setMode} />;
  return <CommonApp setMode={setMode} />;
}
