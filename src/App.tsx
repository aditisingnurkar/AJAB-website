import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import ajabLogo from "./assets/ajab-logo.png";
import { menuItems, FoodItem } from "./data/menuData";
import { tables, TableInfo } from "./data/tableData";
import VirtualCafe3D from "./components/VirtualCafe3D";
import { cafeEvents, CafeEvent } from "./data/eventsData";
import { T, Lang } from "./data/translations";

/* ═══════════════════════════════════════════════════════════════════════
   TYPES & PALETTES (TONED-DOWN REFINED ESPRESSO & WARM CARAMEL THEME)
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

// ── Refined Dark Espresso & Roasted Warm Caramel Palette ──
const C = {
  bg: "#14100D",
  card: "#1E1813",
  cardHover: "#27201A",
  border: "#382C23",
  borderFocus: "#B87B4E",
  text: "#EDE4DB",
  muted: "#A08F81",
  accent: "#C4824E",
  accentLight: "#D9A073",
  cream: "#241D17",
  tag: "#2B221B",
};

const EC = {
  bg: "#18120D",
  card: "#261D15",
  border: "#855831",
  text: "#FFFDF8",
  muted: "#DBCAB6",
  accent: "#D9A073",
  btn: "#B87342",
  btnText: "#FFFDF8",
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
   CLEAN VECTOR GRAPHIC ICONS (HANDCRAFTED MINIMALIST SVGS)
═══════════════════════════════════════════════════════════════════════ */
const Icons = {
  Map: ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
      <line x1="8" y1="2" x2="8" y2="18"></line>
      <line x1="16" y1="6" x2="16" y2="22"></line>
    </svg>
  ),
  Home: ({ size = 16, className = "" }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  ),
  Menu: ({ size = 16, className = "" }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
  ),
  Calendar: ({ size = 16, className = "" }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
  ),
  Clock: ({ size = 16, className = "" }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  ),
  Users: ({ size = 16, className = "" }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  Sparkles: ({ size = 16, className = "" }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
  ),
  Info: ({ size = 16, className = "" }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
  ),
  Accessibility: ({ size = 16, className = "" }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="4" r="2"/><path d="M9 9h6M12 9v9M9 21l3-3 3 3"/></svg>
  ),
  Cart: ({ size = 16, className = "" }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
  ),
  Search: ({ size = 16, className = "" }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
  ),
  Mic: ({ size = 16, className = "" }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
  ),
  Shield: ({ size = 16, className = "" }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  ),
  Leaf: ({ size = 16, className = "" }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
  ),
  Sun: ({ size = 16, className = "" }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
  ),
  CloudRain: ({ size = 16, className = "" }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="16" y1="13" x2="16" y2="21"/><line x1="8" y1="13" x2="8" y2="21"/><line x1="12" y1="15" x2="12" y2="23"/><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/></svg>
  ),
  Snowflake: ({ size = 16, className = "" }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/><line x1="19.07" y1="4.93" x2="4.93" y2="19.07"/><polyline points="9 4 12 7 15 4"/><polyline points="9 20 12 17 15 20"/><polyline points="4 9 7 12 4 15"/><polyline points="20 9 17 12 20 15"/></svg>
  ),
  MapPin: ({ size = 16, className = "" }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
  ),
  Check: ({ size = 16, className = "" }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12"/></svg>
  ),
  Cross: ({ size = 16, className = "" }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  ),
  Coffee: ({ size = 16, className = "" }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
  ),
  Utensils: ({ size = 16, className = "" }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2"/><path d="M15 11v11"/><path d="M5 2v10a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V2"/><path d="M7 14v8"/></svg>
  ),
  Flame: ({ size = 16, className = "" }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
  ),
  Globe: ({ size = 16, className = "" }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
  ),
  Eye: ({ size = 16, className = "" }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
  ),
  Star: ({ size = 16, filled = false, className = "" }: { size?: number; filled?: boolean; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
  ),
  Mail: ({ size = 16, className = "" }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
  ),
  Car: ({ size = 16, className = "" }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
  ),
  Train: ({ size = 16, className = "" }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="4" y="3" width="16" height="16" rx="2"/><line x1="4" y1="11" x2="20" y2="11"/><circle cx="8" cy="15" r="1"/><circle cx="16" cy="15" r="1"/><path d="M6 19l-2 3M18 19l2 3"/></svg>
  ),
  Tree: ({ size = 16, className = "" }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 2L4 12h5v8h6v-8h5z"/></svg>
  ),
  Building: ({ size = 16, className = "" }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="22" x2="9" y2="18"/><line x1="15" y1="22" x2="15" y2="18"/><line x1="8" y1="6" x2="8.01" y2="6"/><line x1="16" y1="6" x2="16.01" y2="6"/><line x1="8" y1="10" x2="8.01" y2="10"/><line x1="16" y1="10" x2="16.01" y2="10"/><line x1="8" y1="14" x2="8.01" y2="14"/><line x1="16" y1="14" x2="16.01" y2="14"/></svg>
  ),
  // Clean Allergen Icons
  AllergenMilk: ({ size = 13 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 2h10l-1 5H8L7 2z"/><path d="M6 7h12v13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7z"/></svg>
  ),
  AllergenGluten: ({ size = 13 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 22 16 8"/><path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/></svg>
  ),
  AllergenNut: ({ size = 13 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a8 8 0 0 0-8 8c0 5 4 10 8 12 4-2 8-7 8-12a8 8 0 0 0-8-8z"/></svg>
  ),
  AllergenSoy: ({ size = 13 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="12" r="3"/><circle cx="16" cy="12" r="3"/><path d="M4 12a8 8 0 0 0 16 0"/></svg>
  ),
  AllergenEgg: ({ size = 13 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c4.97 0 9-4.03 9-9 0-4.97-4.03-11-9-11s-9 6.03-9 11c0 4.97 4.03 9 9 9z"/></svg>
  ),
  AllergenShellfish: ({ size = 13 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a9 9 0 0 0-9 9c0 4 3 7 7 8l2 2 2-2c4-1 7-4 7-8a9 9 0 0 0-9-9z"/></svg>
  ),
  AllergenSesame: ({ size = 13 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C8 6 6 10 6 14a6 6 0 0 0 12 0c0-4-2-8-6-12z"/></svg>
  ),
  Sliders: ({ size = 16, className = "" }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>
  ),
  ChevronDown: ({ size = 16, className = "" }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="6 9 12 15 18 9"/></svg>
  ),
  ChevronUp: ({ size = 16, className = "" }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="18 15 12 9 6 15"/></svg>
  ),
};

function FoodTypeBadge({ type }: { type: "veg" | "nonVeg" }) {
  const isVeg = type === "veg";
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold select-none border"
      style={{
        backgroundColor: isVeg ? "#122619" : "#2B1416",
        color: isVeg ? "#4ADE80" : "#F87171",
        borderColor: isVeg ? "#1E4729" : "#4E2125",
      }}
    >
      <span
        className="w-2.5 h-2.5 rounded-sm flex items-center justify-center border"
        style={{
          borderColor: isVeg ? "#4ADE80" : "#F87171",
          backgroundColor: isVeg ? "#122619" : "#2B1416",
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: isVeg ? "#4ADE80" : "#F87171" }}
        />
      </span>
      <span>{isVeg ? "VEG" : "NON-VEG"}</span>
    </span>
  );
}

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
        backgroundColor: "#1A130E",
        border: "2px solid #8C613E",
        boxShadow: "0 0 10px rgba(184, 115, 66, 0.18)",
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
          <circle cx="50" cy="50" r="46" stroke="#8C613E" strokeWidth="2.5" strokeDasharray="3,2" />
          <circle cx="50" cy="50" r="41" stroke="#8C613E" strokeWidth="1" />
          <text
            x="50"
            y="54"
            textAnchor="middle"
            fontFamily="'Playfair Display', Georgia, serif"
            fontSize="26"
            fontWeight="bold"
            fill="#EDE4DB"
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
            fill="#C4824E"
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
  disabled?: boolean; style?: React.CSSProperties;
  icon?: React.ReactNode;
}) {
  const pad = size === "sm" ? "px-3.5 py-1.5 text-xs" : size === "lg" ? "px-6 py-3.5 text-base font-bold" : "px-5 py-2.5 text-sm";
  const bg =
    variant === "primary"
      ? {
          background: "linear-gradient(135deg, #B87342 0%, #9C5E32 100%)",
          color: "#FFFDF8",
          border: "none",
          boxShadow: "0 4px 14px rgba(184, 115, 66, 0.25)",
        }
      : variant === "gold"
      ? {
          background: "linear-gradient(135deg, #C88554 0%, #A66838 100%)",
          color: "#FFFDF8",
          border: "none",
          boxShadow: "0 4px 14px rgba(200, 133, 84, 0.25)",
        }
      : variant === "secondary"
      ? { backgroundColor: C.card, color: C.text, border: `1px solid ${C.border}` }
      : { backgroundColor: "transparent", color: "#D49566", border: `1.5px solid #A66E43` };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`rounded-2xl font-bold cursor-pointer transition-all duration-150 inline-flex items-center justify-center gap-2 select-none hover:opacity-95 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${pad} ${full ? "w-full" : ""}`}
      style={bg}
    >
      {icon && <span>{icon}</span>}
      <span>{label as string}</span>
    </button>
  );
}

function CCard({ children, className = "", style = {}, onClick }: { children: React.ReactNode; className?: string; style?: React.CSSProperties; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-3xl p-6 transition-all ${onClick ? "cursor-pointer hover:shadow-xl hover:border-[#B87342]/60 hover:-translate-y-0.5" : ""} ${className}`}
      style={{
        backgroundColor: C.card,
        border: `1px solid ${C.border}`,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)",
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
      ? { bg: "#122619", text: "#4ADE80", border: "#1E4729" }
      : color === "red"
      ? { bg: "#2B1416", text: "#F87171", border: "#4E2125" }
      : color === "gold"
      ? { bg: "#291E15", text: "#D49566", border: "#4A3525" }
      : color === "season"
      ? { bg: "#2E1C12", text: "#E09362", border: "#52301D" }
      : { bg: C.tag, text: C.text, border: C.border };

  return (
    <span
      className="text-xs font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 select-none border"
      style={{ backgroundColor: c.bg, color: c.text, borderColor: c.border }}
    >
      {label as string}
    </span>
  );
}

function StatusDot({ status }: { status: "available" | "reserved" | "occupied" }) {
  const map = {
    available: { bg: "#4ADE80", text: "Available", light: "#122619", border: "#1E4729" },
    reserved: { bg: "#D49566", text: "Reserved", light: "#261D15", border: "#473424" },
    occupied: { bg: "#F87171", text: "Occupied", light: "#2B1416", border: "#4E2125" },
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
        color: speaking ? "#FFFDF8" : C.accent,
        border: `1.5px solid ${C.accent}`,
      }}
    >
      {speaking ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></svg>
      )}
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

  if (failed) {
    return (
      <div
        role="img"
        aria-label={`${alt}. Image awaiting upload.`}
        className={className + " flex flex-col items-center justify-center gap-1.5 p-4"}
        style={{ background: "linear-gradient(135deg, #241A13 0%, #17100B 100%)", color: C.accent, border: `1px dashed ${C.borderFocus}` }}
      >
        <span className="text-[10px] uppercase tracking-widest font-bold text-center px-2 py-1 rounded" style={{ backgroundColor: "#382C23", color: "#D9A073" }}>Awaiting Upload</span>
        <span className="text-xs font-semibold text-center px-4 mt-1 opacity-70" style={{ color: C.muted }}>{name}</span>
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
   REALISTIC OUTSIDE SURROUNDINGS & NEIGHBORHOOD MAP
═══════════════════════════════════════════════════════════════════════ */
function CafeSurroundingsMap() {
  const [activeTab, setActiveTab] = useState('directions'); // 'directions', 'landmarks', 'transit'

  // Map configuration
  const center = { lat: 51.5126, lng: -0.1337 }; // Soho, London
  const mapId = 'DEMO_MAP_ID'; // Special map ID provided by Google for testing Advanced Markers

  // Custom dark style for the map matching espresso theme
  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
    styles: [
      { elementType: "geometry", stylers: [{ color: "#241812" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#241812" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#D49566" }] },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#F5EBDD" }],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#F5EBDD" }],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#285C43" }],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#3C7A59" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#4B3023" }],
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#241812" }],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#B87543" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#744A31" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#4B3023" }],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#F5EBDD" }],
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#241812" }],
      },
      {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#D49566" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#1A110D" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#4B3023" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#1A110D" }],
      },
    ],
  };

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start my-12" id="cafe-location">
      {/* Left Column: Interactive Map */}
      <div 
        className="w-full lg:w-2/3 h-[500px] relative rounded-3xl overflow-hidden shadow-2xl group"
        style={{ backgroundColor: C.card, border: `1.5px solid ${C.border}` }}
      >
        {!apiKey ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-[#241812]">
            <Icons.Map size={48} className="text-[#991B1B] mb-4 opacity-70" />
            <h3 className="font-serif text-2xl text-[#D49566] mb-2">Map Unavailable</h3>
            <p className="text-[#F5EBDD] opacity-80 max-w-md mx-auto mb-4">
              Google Maps integration requires a valid API key. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file.
            </p>
          </div>
        ) : (
          <APIProvider apiKey={apiKey}>
            <Map
              defaultCenter={center}
              defaultZoom={15}
              mapId={mapId}
              {...mapOptions}
              className="w-full h-full"
            >
              <AdvancedMarker position={center} title="AJAB Café">
                <div className="w-10 h-10 bg-[#D49566] rounded-full border-2 border-[#241812] flex items-center justify-center shadow-lg transform transition-transform hover:scale-110">
                  <Icons.Coffee size={20} className="text-[#241812]" />
                </div>
              </AdvancedMarker>
              
              {activeTab === 'landmarks' && (
                <>
                  <AdvancedMarker position={{ lat: 51.5132, lng: -0.1345 }} title="Soho Square">
                    <Pin background={"#285C43"} borderColor={"#1A3D2D"} glyphColor={"#F5EBDD"} />
                  </AdvancedMarker>
                  <AdvancedMarker position={{ lat: 51.5118, lng: -0.1331 }} title="Piccadilly Theatre">
                    <Pin background={"#4B3023"} borderColor={"#241812"} glyphColor={"#F5EBDD"} />
                  </AdvancedMarker>
                </>
              )}
              
              {activeTab === 'transit' && (
                <>
                  <AdvancedMarker position={{ lat: 51.5113, lng: -0.1338 }} title="Piccadilly Circus Station">
                    <Pin background={"#1A4384"} borderColor={"#0F284F"} glyphColor={"#FFFFFF"} />
                  </AdvancedMarker>
                  <AdvancedMarker position={{ lat: 51.5140, lng: -0.1305 }} title="Tottenham Court Road Station">
                    <Pin background={"#1A4384"} borderColor={"#0F284F"} glyphColor={"#FFFFFF"} />
                  </AdvancedMarker>
                </>
              )}
            </Map>
          </APIProvider>
        )}
      </div>
      
      {/* Right Column: Directions & Details */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-3" style={{ color: C.accent }}>Find Us</h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: C.muted }}>
            Nestled in the heart of the city, AJAB Café is an urban sanctuary offering respite from the bustling streets. Look for our signature copper espresso bar through the heritage windows.
          </p>
          <div className="flex items-start gap-3 mt-4" style={{ color: C.text }}>
            <span style={{ color: C.accent }} className="shrink-0 mt-1"><Icons.Map size={20} /></span>
            <div>
              <p className="font-bold">142 Reserve St, Central District</p>
              <p className="text-sm mt-1" style={{ color: C.muted }}>London, W1D 3QU</p>
            </div>
          </div>
        </div>

        {/* Action Tabs */}
        <div className="flex p-1.5 rounded-2xl" style={{ backgroundColor: C.bg, border: `1.5px solid ${C.border}` }}>
          <button 
            onClick={() => setActiveTab('directions')}
            className={`flex-1 py-2 px-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors ${activeTab === 'directions' ? 'text-[#F5EBDD] shadow-md' : 'text-[#F5EBDD] opacity-60 hover:opacity-100'}`}
            style={{ backgroundColor: activeTab === 'directions' ? C.card : 'transparent', border: activeTab === 'directions' ? `1px solid ${C.border}` : '1px solid transparent' }}
          >
            Directions
          </button>
          <button 
            onClick={() => setActiveTab('transit')}
            className={`flex-1 py-2 px-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors ${activeTab === 'transit' ? 'text-[#F5EBDD] shadow-md' : 'text-[#F5EBDD] opacity-60 hover:opacity-100'}`}
            style={{ backgroundColor: activeTab === 'transit' ? C.card : 'transparent', border: activeTab === 'transit' ? `1px solid ${C.border}` : '1px solid transparent' }}
          >
            Transit
          </button>
          <button 
            onClick={() => setActiveTab('landmarks')}
            className={`flex-1 py-2 px-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors ${activeTab === 'landmarks' ? 'text-[#F5EBDD] shadow-md' : 'text-[#F5EBDD] opacity-60 hover:opacity-100'}`}
            style={{ backgroundColor: activeTab === 'landmarks' ? C.card : 'transparent', border: activeTab === 'landmarks' ? `1px solid ${C.border}` : '1px solid transparent' }}
          >
            Nearby
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 rounded-3xl" style={{ backgroundColor: C.card, border: `1.5px solid ${C.border}` }}>
          {activeTab === 'directions' && (
            <div className="animate-fade-in">
              <h3 className="font-serif text-xl mb-3" style={{ color: C.text }}>Getting Here</h3>
              <p className="text-sm mb-4" style={{ color: C.muted }}>
                We are located just off the main avenue. If you are driving, enter our address directly into Google Maps for the best route.
              </p>
              <a 
                href="https://maps.google.com/?q=51.5126,-0.1337" 
                target="_blank" 
                rel="noreferrer"
                className="w-full py-3 px-4 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors hover:opacity-90"
                style={{ backgroundColor: C.accent, color: C.bg }}
              >
                <Icons.Map size={18} /> Open in Google Maps
              </a>
            </div>
          )}

          {activeTab === 'transit' && (
            <div className="animate-fade-in">
              <h3 className="font-serif text-xl mb-3" style={{ color: C.text }}>Transit & Parking</h3>
              <ul className="text-sm space-y-3" style={{ color: C.muted }}>
                <li className="flex gap-2">
                  <strong style={{ color: C.accent }}>Tube:</strong> 3 min walk from Piccadilly Circus Station (Piccadilly & Bakerloo lines).
                </li>
                <li className="flex gap-2">
                  <strong style={{ color: C.accent }}>Bus:</strong> Routes 14, 19, 38 stop nearby.
                </li>
                <li className="flex gap-2">
                  <strong style={{ color: C.accent }}>Parking:</strong> Validated parking available at Q-Park Soho (5 min walk).
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'landmarks' && (
            <div className="animate-fade-in">
              <h3 className="font-serif text-xl mb-3" style={{ color: C.text }}>Around Us</h3>
              <ul className="text-sm space-y-3" style={{ color: C.muted }}>
                <li className="flex justify-between items-center border-b pb-2" style={{ borderColor: C.border }}>
                  <span>Soho Square Gardens</span>
                  <span className="text-xs" style={{ color: C.muted }}>2 min walk</span>
                </li>
                <li className="flex justify-between items-center border-b pb-2" style={{ borderColor: C.border }}>
                  <span>Piccadilly Theatre</span>
                  <span className="text-xs" style={{ color: C.muted }}>4 min walk</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>National Gallery</span>
                  <span className="text-xs" style={{ color: C.muted }}>10 min walk</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   VOICE ASSISTANT
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
      reply = "Opening the live restaurant floor plan to choose your table";
    } else if (cmd.includes("event") || cmd.includes("workshop") || cmd.includes("sufi") || cmd.includes("music")) {
      navigate("events");
      reply = "Opening upcoming café events and cultural workshops";
    } else if (cmd.includes("cart") || cmd.includes("checkout") || cmd.includes("my order")) {
      navigate("cart");
      reply = "Opening your dining cart";
    } else if (cmd.includes("about") || cmd.includes("contact") || cmd.includes("location") || cmd.includes("map")) {
      navigate("about");
      reply = "Here is AJAB's story, surroundings map, and contact details";
    } else {
      navigate("menu");

      if (cmd.includes("summer") || cmd.includes("mango") || cmd.includes("lassi") || cmd.includes("ice") || cmd.includes("cold")) {
        vf.season = "summer";
        vf.badgeLabel = "Summer Specials";
        reply = "Showing summer specials including Alphonso Mango Lassi and Cold Brew";
      } else if (cmd.includes("monsoon") || cmd.includes("rain") || cmd.includes("chai") || cmd.includes("samosa") || cmd.includes("vada pav")) {
        vf.season = "monsoon";
        vf.badgeLabel = "Monsoon Warmers";
        reply = "Showing monsoon warmers including Masala Chai and Samosas";
      } else if (cmd.includes("winter") || cmd.includes("halwa") || cmd.includes("kahwa") || cmd.includes("dal makhani")) {
        vf.season = "winter";
        vf.badgeLabel = "Winter Warmers";
        reply = "Showing winter comfort foods including Saffron Kahwa and Gajar Halwa";
      }

      if (cmd.includes("jain")) {
        vf.diet = "Jain";
        vf.badgeLabel = "Jain-Friendly";
        reply = "Filtering for pure Jain-friendly dishes prepared without root vegetables";
      } else if (cmd.includes("vegan")) {
        vf.diet = "Vegan";
        vf.badgeLabel = "100% Vegan";
        reply = "Showing 100% plant-based vegan dishes";
      } else if (cmd.includes("gluten free") || cmd.includes("gluten-free") || cmd.includes("gluten")) {
        vf.diet = "Gluten-Free";
        vf.badgeLabel = "Gluten-Free";
        reply = "Showing certified gluten-free options";
      } else if (cmd.includes("protein") || cmd.includes("gym")) {
        vf.diet = "High Protein";
        vf.badgeLabel = "High Protein (15g+)";
        reply = "Showing high-protein dishes with 15g+ protein";
      }

      if (cmd.includes("non veg") || cmd.includes("non-veg") || cmd.includes("chicken") || cmd.includes("biryani")) {
        vf.foodType = "Non-Veg";
        if (!vf.badgeLabel) vf.badgeLabel = "Non-Vegetarian";
        if (!reply) reply = "Showing non-vegetarian dishes including Butter Chicken and Biryani";
      } else if (cmd.includes("pure veg") || cmd.includes("vegetarian") || cmd.includes("veg")) {
        if (!cmd.includes("non")) {
          vf.foodType = "Veg";
          if (!vf.badgeLabel) vf.badgeLabel = "Pure Vegetarian";
          if (!reply) reply = "Showing pure vegetarian dishes";
        }
      }

      const cleanKeywords = ["filter coffee", "masala chai", "cold brew", "kahwa", "mango lassi", "vada pav", "samosa", "paneer tikka", "dhokla", "dim sum", "falafel", "sushi", "kachori", "tacos", "burrito", "pad thai", "ramen", "biryani", "butter chicken", "dal makhani", "dosa", "pizza", "pasta", "tiramisu", "kulfi", "gulab jamun", "thepla", "halwa", "churros"];
      for (const kw of cleanKeywords) {
        if (cmd.includes(kw)) {
          vf.searchKeyword = kw;
          vf.badgeLabel = `Search: "${kw}"`;
          reply = `Found “${kw}” in our artisanal menu`;
          break;
        }
      }

      if (!reply) {
        vf.searchKeyword = q.replace(/^(show|find|search|get|give me|filter for|dishes with)\s+/i, "").trim();
        vf.badgeLabel = `Search: "${vf.searchKeyword}"`;
        reply = `Searching menu for “${vf.searchKeyword}”`;
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
          background: "linear-gradient(135deg, #B87342 0%, #9C5E32 100%)",
          border: `2px solid #D9A073`,
          color: "#FFFDF8",
          boxShadow: "0 8px 24px rgba(184, 115, 66, 0.35)",
        }}
      >
        <Icons.Mic size={24} />
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
          <div className="px-5 py-3.5 flex items-center justify-between border-b" style={{ backgroundColor: "#241B14", color: C.text, borderColor: C.border }}>
            <div className="flex items-center gap-2">
              <Icons.Mic size={18} className="text-[#D49566]" />
              <div>
                <p className="font-serif font-bold text-sm" style={{ color: C.accent }}>AJAB Voice Assistant</p>
                <p className="text-[10px] opacity-80" style={{ color: C.muted }}>Speak or tap any prompt</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="cursor-pointer opacity-70 hover:opacity-100">
              <Icons.Cross size={16} />
            </button>
          </div>

          <div className="p-4 flex flex-col gap-3">
            <div className="text-center py-2">
              <button
                onClick={startListening}
                className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center cursor-pointer transition-transform ${listening ? "scale-110 animate-pulse bg-red-700 text-white" : "hover:scale-105"}`}
                style={{
                  backgroundColor: listening ? "#8B2326" : C.cream,
                  border: `2px solid ${C.accent}`,
                  color: listening ? "#FFF" : C.accent,
                }}
              >
                <Icons.Mic size={26} />
              </button>
              <p className="text-xs font-semibold mt-2" style={{ color: C.text }}>
                {listening ? "Listening... Speak your filter or order..." : "Tap mic to speak"}
              </p>
            </div>

            {transcript && (
              <div className="p-2.5 rounded-xl text-xs border" style={{ backgroundColor: "#241A13", borderColor: C.border }}>
                <span className="font-bold text-[#D49566]">Heard:</span> “{transcript}”
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
                <span className="text-xs font-bold text-emerald-400">Filter active: {activeFilter.badgeLabel}</span>
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
        <Icons.Accessibility size={24} />
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
          <div className="px-5 py-3.5 flex items-center justify-between border-b" style={{ borderColor: C.border, backgroundColor: "#241B14", color: C.text }}>
            <div className="flex items-center gap-2">
              <Icons.Accessibility size={18} className="text-[#D49566]" />
              <div>
                <p className="font-semibold text-sm" style={{ color: C.accent }}>Inclusive Display Modes</p>
                <p className="text-[11px]" style={{ color: C.muted }}>Choose a view tailored to you</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="cursor-pointer opacity-70 hover:opacity-100">
              <Icons.Cross size={16} />
            </button>
          </div>

          <div className="p-3 flex flex-col gap-2">
            <button
              onClick={() => { setMode("elderly"); setOpen(false); }}
              className="w-full text-left p-3 rounded-2xl cursor-pointer flex items-center gap-3 transition-colors hover:border-[#B87342]"
              style={{ backgroundColor: C.cream, border: `1px solid ${C.border}` }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base" style={{ backgroundColor: "#3D1F00", color: "#FFFEF8" }}>
                Aa
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm" style={{ color: C.accent }}>Senior Citizen Mode</p>
                <p className="text-[11px]" style={{ color: C.muted }}>Big text, large touch buttons &amp; full menu</p>
              </div>
            </button>

            <button
              onClick={() => { setMode("rural"); setOpen(false); }}
              className="w-full text-left p-3 rounded-2xl cursor-pointer flex items-center gap-3 transition-colors hover:border-[#B87342]"
              style={{ backgroundColor: C.cream, border: `1px solid ${C.border}` }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#203810", color: "#A7F3D0" }}>
                <Icons.Globe size={20} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm" style={{ color: "#4ADE80" }}>Rural / Multilingual</p>
                <p className="text-[11px]" style={{ color: C.muted }}>Full Hindi &amp; Marathi translation + offline mode</p>
              </div>
            </button>

            <button
              onClick={() => { setMode("vi"); setOpen(false); }}
              className="w-full text-left p-3 rounded-2xl cursor-pointer flex items-center gap-3 transition-colors hover:border-[#B87342]"
              style={{ backgroundColor: C.cream, border: `1px solid ${C.border}` }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#0D0600", color: "#FFD166", border: "1px solid #C49A24" }}>
                <Icons.Eye size={20} />
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
   COMMON NAVBAR
═══════════════════════════════════════════════════════════════════════ */
function CNav({ navigate, active, cartCount }: { navigate: (s: Screen) => void; active: Screen; cartCount: number }) {
  const links: { label: string; screen: Screen }[] = [
    { label: "Home", screen: "home" },
    { label: "Menu", screen: "menu" },
    { label: "Reserve", screen: "seats" },
    { label: "Events", screen: "events" },
    { label: "About", screen: "about" },
    { label: "Accessibility", screen: "accessibility" },
  ];

  return (
    <header style={{ backgroundColor: "#17100C", borderBottom: `1px solid ${C.border}` }} className="sticky top-0 z-40 w-full backdrop-blur-md">
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
                color: active === l.screen ? "#D49566" : C.muted,
                borderBottom: active === l.screen ? `2px solid #D49566` : "2px solid transparent",
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
            <Icons.Accessibility size={18} />
          </button>
          <button
            onClick={() => navigate("cart")}
            aria-label={`Cart with ${cartCount} items`}
            className="relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold cursor-pointer transition-transform hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #B87342 0%, #9C5E32 100%)",
              color: "#FFFDF8",
            }}
          >
            <Icons.Cart size={16} />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold bg-[#14100D] text-[#EDE4DB]">
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
  const featuredDishes = menuItems.filter((m) => [11, 18, 12, 21, 33, 7].includes(m.id));

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
          <div className="absolute inset-0 bg-gradient-to-t from-[#14100D] via-transparent to-[#14100D]" />
        </div>
        <div className="relative z-10 flex flex-col items-center max-w-4xl">
          <AjabLogo size={104} className="mb-4" />
          <p className="text-xs tracking-widest uppercase mb-4 font-semibold" style={{ color: C.accent }}>Modern Indian Café · Est. 2024</p>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(36px,6vw,64px)", color: C.text, lineHeight: 1.1 }}>
            Warmth in every<br /><em style={{ color: "#D49566" }}>cup and corner.</em>
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
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-[#261D15] text-[#D49566] border border-[#423122] mb-2">
              <Icons.Sparkles size={12} />
              <span>Chef's Highlights</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold" style={{ color: C.accent }}>
              Signature Delights
            </h2>
            <p className="text-sm mt-1" style={{ color: C.muted }}>
              Artisan pastries, specialty coffee, and European comfort food, handcrafted with care.
            </p>
          </div>
          <button
            onClick={() => navigate("menu")}
            className="font-bold text-sm underline cursor-pointer hover:opacity-80"
            style={{ color: C.accentLight }}
          >
            View Full Menu →
          </button>
        </div>

        {/* 6-Card Rich Food Photography Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredDishes.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl overflow-hidden flex flex-col justify-between transition-all hover:shadow-2xl group"
              style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}
            >
              <div 
                className="relative aspect-[4/3] overflow-hidden bg-[#14100D] cursor-pointer"
                onClick={(e) => { e.stopPropagation(); setFood(item); }}
              >
                <img
                  src={item.img}
                  alt={item.imgAlt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between" style={{ backgroundColor: C.card }}>
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="font-serif font-bold text-[22px] leading-tight" style={{ color: C.text }}>
                      {item.name}
                    </h3>
                    <p className="font-bold text-[18px] shrink-0" style={{ color: "#D49566" }}>
                      ₹{item.price}
                    </p>
                  </div>
                  
                  <p className="text-[13px] mb-5" style={{ color: C.muted }}>
                    {item.cal} kcal · {item.protein}g protein · {item.carbs}g carbs
                  </p>
                </div>

                <div className="pt-4 border-t flex gap-3" style={{ borderColor: C.border }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); setFood(item); }}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors text-center hover:bg-white/5"
                    style={{ color: C.text, border: `1px solid ${C.border}` }}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => addToCart(item)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all text-center hover:opacity-90 active:scale-95"
                    style={{
                      background: "linear-gradient(135deg, #B87342 0%, #9C5E32 100%)",
                      color: "#FFFDF8",
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
        <div className="mt-8 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border" style={{ backgroundColor: "#221811", borderColor: "#4A3525", color: "#EDE4DB" }}>
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-white/5 border border-white/10 text-[#D49566]">
              <Icons.Coffee size={26} />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#D49566]">Special Heritage Combo</span>
              <h3 className="font-serif text-2xl font-bold mt-0.5">Filter Coffee &amp; Mumbai Vada Pav</h3>
              <p className="text-xs text-[#A08F81] mt-1">Frothy double-drip chicory coffee paired with hot batata vada &amp; spicy garlic chutney.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <span className="text-xs line-through text-[#7A6A5E]">₹ 205</span>
              <p className="text-2xl font-bold text-[#E0AB82]">₹ 175</p>
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
              style={{ backgroundColor: "#B87342", color: "#FFFDF8" }}
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
            <span className="text-xs font-bold uppercase tracking-wider text-[#D49566]">Live Seat Picker</span>
            <h2 className="font-serif text-3xl font-bold" style={{ color: C.accent }}>Architectural Floor Plan Reservation</h2>
            <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
              Choose your exact table across 4 distinct ambient zones: Indoor Main Hall, Garden Verandah Patio, Heritage Quiet Alcove, or the Barista Coffee Bar.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#122619] text-[#4ADE80] border border-[#1E4729] inline-flex items-center gap-1.5"><Icons.Check size={13} className="text-[#4ADE80]" /> 20 Distinct Tables</span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#122619] text-[#4ADE80] border border-[#1E4729] inline-flex items-center gap-1.5"><Icons.Check size={13} className="text-[#4ADE80]" /> Live Availability</span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#122619] text-[#4ADE80] border border-[#1E4729] inline-flex items-center gap-1.5"><Icons.Check size={13} className="text-[#4ADE80]" /> Wheelchair Accessible</span>
            </div>
            <div className="pt-2">
              <CBtn label="Open Table Reservation Floor Plan" onClick={() => navigate("seats")} size="lg" />
            </div>
          </div>

          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden shadow-md border-2" style={{ height: 220, borderColor: C.border, backgroundColor: "#16110D" }}>
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
              <Icons.Building size={34} className="mb-2 text-[#D49566]" />
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
   MENU
═══════════════════════════════════════════════════════════════════════ */

function CategoryThumbnail({ src, alt, name }: { src: string; alt: string; name: string }) {
  const [error, setError] = useState(false);
  if (error) {
    return (
      <div className="w-9 h-9 rounded-xl bg-[#2A1E17] border border-[#8C613E] flex items-center justify-center text-[10px] font-bold text-[#D49566] shrink-0">
        {name.slice(0, 2).toUpperCase()}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className="w-9 h-9 rounded-xl object-cover shrink-0"
      onError={() => setError(true)}
    />
  );
}

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
  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState<boolean>(true);
  const getCurrentSeason = () => {
    const month = new Date().getMonth() + 1;
    return month >= 3 && month <= 5 ? "summer" : month >= 6 && month <= 9 ? "monsoon" : "winter";
  };
  const [selectedSeason, setSelectedSeason] = useState<"All" | "summer" | "monsoon" | "winter">(getCurrentSeason());
  const [searchQuery, setSearchQuery] = useState("");
  const [ingredientOverlayItem, setIngredientOverlayItem] = useState<FoodItem | null>(null);
  const [productModalItem, setProductModalItem] = useState<FoodItem | null>(null);

  useEffect(() => {
    if (!voiceFilter) return;
    if (voiceFilter.foodType) setFoodType(voiceFilter.foodType);
    if (voiceFilter.category && voiceFilter.category !== "All") setSelectedCategory(voiceFilter.category);
    if (voiceFilter.cuisine && voiceFilter.cuisine !== "All") setSelectedCuisine(voiceFilter.cuisine);
    if (voiceFilter.diet && voiceFilter.diet !== "All") setSelectedDiet(voiceFilter.diet);
    if (voiceFilter.season && voiceFilter.season !== "All") setSelectedSeason(voiceFilter.season);
    if (voiceFilter.searchKeyword) setSearchQuery(voiceFilter.searchKeyword);
  }, [voiceFilter]);

  const visualCategories = [
    { id: "All", label: "All", img: "/images/menu/coffee/cappuccino.png" },
    { id: "Coffee", label: "Coffee", img: "/images/menu/coffee/espresso.png" },
    { id: "German Bakery", label: "German Bakery", img: "/images/menu/german-bakery/bavarian-butter-pretzel.png" },
    { id: "Pastries", label: "Pastries", img: "/images/menu/german-bakery/apfelstrudel.png" },
    { id: "Small Plates", label: "Small Plates", img: "/images/menu/starters/wild-mushroom-tartine.png" },
    { id: "Soups & Salads", label: "Soups & Salads", img: "/images/menu/soups-salads/roasted-tomato-basil-soup.png" },
    { id: "Brunch", label: "Brunch", img: "/images/menu/brunch/rosti-benedict.png" },
    { id: "Mains", label: "Mains", img: "/images/menu/european-mains/kasespatzle.png" },
    { id: "Desserts", label: "Desserts", img: "/images/menu/desserts/basque-cheesecake.png" },
  ];

  const toggleDiet = (d: string) => {
    setSelectedDiets((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  };

  const toggleAllergen = (a: string) => {
    setAvoidAllergens((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  };

  const resetFilters = () => {
    setFoodType("All");
    setSelectedCuisine("All");
    setSelectedCategory("All");
    setSelectedDiet("All");
    setSelectedDiets([]);
    setAvoidAllergens([]);
    setSelectedSeason("All");
    setSearchQuery("");
    onClearVoiceFilter();
  };

  const activeFilterCount =
    (foodType !== "All" ? 1 : 0) +
    (selectedCategory !== "All" ? 1 : 0) +
    (selectedCuisine !== "All" ? 1 : 0) +
    selectedDiets.length +
    (selectedDiet !== "All" ? 1 : 0) +
    avoidAllergens.length +
    (searchQuery ? 1 : 0);

  const filteredItems = menuItems.filter((item) => {
    const hay = `${item.name} ${item.desc} ${item.cuisine} ${item.category} ${item.ingredients.join(" ")} ${item.dietary.join(" ")}`.toLowerCase();
    
    // Food type match
    const typeMatch = foodType === "All" || (foodType === "Veg" ? item.foodType === "veg" : item.foodType === "nonVeg");
    
    // Cuisine match
    const cuisineMatch =
      selectedCuisine === "All"
        ? true
        : selectedCuisine === "Indian"
        ? ["North Indian", "South Indian", "Maharashtrian", "Punjabi", "Gujarati", "Rajasthani", "Bengali", "Mughlai", "Kerala", "Kashmiri"].includes(item.cuisine)
        : item.cuisine === selectedCuisine;
    
    // Category match
    const categoryMatch = (() => {
      if (selectedCategory === "All") return true;
      if (selectedCategory === "Coffee") return item.category.includes("Coffee");
      if (selectedCategory === "German Bakery") return item.category === "German Bakery";
      if (selectedCategory === "Pastries") return item.category.includes("Croissants") || item.category.includes("Waffles") || item.category.includes("Viennoiserie");
      if (selectedCategory === "Small Plates") return item.category.includes("Small Plates") || item.category.includes("Starters");
      if (selectedCategory === "Soups & Salads") return item.category.includes("Soups") || item.category.includes("Salads");
      if (selectedCategory === "Brunch") return item.category.includes("Brunch") || item.category.includes("Dining");
      if (selectedCategory === "Mains") return item.category.includes("Mains");
      if (selectedCategory === "Desserts") return item.category.includes("Desserts") || item.category.includes("Cakes") || item.category.includes("Treats");
      return item.category === selectedCategory;
    })();

    // Dietary match
    const allActiveDiets = selectedDiet !== "All" ? [...selectedDiets, selectedDiet] : selectedDiets;
    const dietMatch = allActiveDiets.every((diet) => {
      if (diet === "Vegetarian") return item.foodType === "veg" || item.dietary.includes("Vegetarian");
      if (diet === "Vegan") return item.dietary.includes("Vegan") || item.dietary.includes("100% Vegan");
      if (diet === "Jain Friendly" || diet === "Jain") return item.dietary.includes("Jain") || item.dietary.includes("Jain Friendly");
      if (diet === "Gluten-Free") return item.dietary.includes("Gluten-Free");
      if (diet === "Keto / Low Carb" || diet === "Keto") return item.dietary.includes("Keto") || item.dietary.includes("Keto / Low Carb");
      if (diet === "High Protein (15g+)" || diet === "High Protein") return item.protein >= 15 || item.dietary.includes("High Protein");
      if (diet === "Low Calorie (<300 kcal)" || diet === "Low Calorie") return item.cal < 300 || item.dietary.includes("Low Calorie");
      return item.dietary.includes(diet);
    });

    // Allergen exclusion match
    const allergenMatch = avoidAllergens.every((a) => {
      const aLower = a.toLowerCase();
      const hasInAllergens = item.allergens.some((alg) => alg.toLowerCase().includes(aLower));
      const hasInIngredients = item.ingredients.some((ing) => ing.toLowerCase().includes(aLower));
      return !hasInAllergens && !hasInIngredients;
    });

    const seasonMatch = selectedSeason === "All" || item.season === selectedSeason || item.season === "all";
    const queryMatch = !searchQuery || hay.includes(searchQuery.toLowerCase());

    return typeMatch && cuisineMatch && categoryMatch && dietMatch && allergenMatch && seasonMatch && queryMatch;
  });

  const seasonConfig = {
    summer: {
      title: "Summer Garden Coolers",
      temp: "32°C Sunny Weather Active",
      bannerImg: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&h=400&fit=crop&auto=format",
      bgGradient: "linear-gradient(135deg, #7C3A16 0%, #4D1E08 100%)",
      accentBg: "#291E15",
      accentText: "#D49566",
    },
    monsoon: {
      title: "Monsoon Rain Comforts",
      temp: "23°C Refreshing Petrichor",
      bannerImg: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&h=400&fit=crop&auto=format",
      bgGradient: "linear-gradient(135deg, #064E3B 0%, #033628 100%)",
      accentBg: "#122619",
      accentText: "#4ADE80",
    },
    winter: {
      title: "Winter Hearth Warmers",
      temp: "17°C Chilly Evening Warmth",
      bannerImg: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&h=400&fit=crop&auto=format",
      bgGradient: "linear-gradient(135deg, #5C1D2A 0%, #3B1019 100%)",
      accentBg: "#2B1416",
      accentText: "#F87171",
    },
    All: {
      title: "All-Season Classics",
      temp: "Signature Year-Round Menu",
      bannerImg: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&h=400&fit=crop&auto=format",
      bgGradient: "linear-gradient(135deg, #4A2E1A 0%, #261608 100%)",
      accentBg: "#241D17",
      accentText: "#C4824E",
    }
  };

  const curSeason = selectedSeason === "All" ? "summer" : selectedSeason;
  const curSeasonStyle = seasonConfig[curSeason];
  const seasonalPicks = menuItems.filter((m) => m.season === curSeason);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      {/* ── PAGE HEADING ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold" style={{ color: C.accent }}>
            AJAB European Menu
          </h1>
          <p className="text-sm mt-1 max-w-2xl" style={{ color: C.muted }}>
            Discover artisan German bakery classics, European café favourites, specialty coffee, and handcrafted desserts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {voiceFilter && (
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#122619] text-[#4ADE80] border border-[#1E4729] flex items-center gap-1.5">
              <Icons.Mic size={12} />
              <span>{voiceFilter.badgeLabel}</span>
            </span>
          )}
          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-xs font-semibold underline cursor-pointer py-1.5 px-3 rounded-lg transition-colors"
              style={{ color: C.accentLight, backgroundColor: C.card }}
            >
              Reset All Filters
            </button>
          )}
        </div>
      </div>

      {/* ── 3. VISUAL CATEGORY NAVIGATION STRIP ── */}
      <div className="flex items-center gap-3 overflow-x-auto pb-3 mb-8 hide-scrollbar">
        {visualCategories.map((cat) => {
          const active = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-2xl cursor-pointer shrink-0 transition-all select-none"
              style={{
                backgroundColor: active ? "#2A1E17" : "#1E1813",
                color: active ? "#FFFDF8" : C.muted,
                border: `1.5px solid ${active ? "#D49566" : C.border}`,
                boxShadow: active ? "0 0 14px rgba(212, 149, 102, 0.25)" : "none",
                fontWeight: active ? 700 : 500,
              }}
            >
              <CategoryThumbnail
                src={cat.img}
                alt={cat.label}
                name={cat.label}
              />
              <span className="text-xs font-semibold whitespace-nowrap">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── 4. SEARCH AND FILTER TOOLBAR ── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-6">
        {/* Left: Search input */}
        <div className="flex-1 relative">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search menu (e.g. croissant, flammkuchen, latte...)"
            className="w-full rounded-xl px-11 py-2.5 text-xs sm:text-sm outline-none transition-all focus:ring-2 focus:ring-[#B87342]"
            style={{ backgroundColor: "#1E1813", border: `1px solid ${C.border}`, color: C.text }}
          />
          <span className="absolute left-3.5 top-3 text-sm opacity-60">
            <Icons.Search size={16} />
          </span>
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3.5 top-3 text-xs font-bold opacity-60 cursor-pointer">
              <Icons.Cross size={14} />
            </button>
          )}
        </div>

        {/* Centre: Dietary & allergens button */}
        <button
          onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all select-none shrink-0"
          style={{
            backgroundColor: isFilterPanelOpen ? "#2A1E17" : "#1E1813",
            borderColor: isFilterPanelOpen || activeFilterCount > 0 ? "#D49566" : C.border,
            color: isFilterPanelOpen || activeFilterCount > 0 ? "#D49566" : C.text,
          }}
        >
          <Icons.Sliders size={16} />
          <span>Dietary &amp; allergens</span>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#B87342] text-white flex items-center justify-center text-[10px] font-extrabold ml-1">
              {activeFilterCount}
            </span>
          )}
          {isFilterPanelOpen ? <Icons.ChevronUp size={14} /> : <Icons.ChevronDown size={14} />}
        </button>

        {/* Right: Dietary selector (Veg / Non-Veg / All) */}
        <div className="flex rounded-xl p-1 shrink-0" style={{ backgroundColor: "#1E1813", border: `1px solid ${C.border}` }}>
          {(["All", "Veg", "Non-Veg"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFoodType(t)}
              className="px-3.5 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all text-center flex items-center justify-center gap-1.5 select-none"
              style={{
                backgroundColor: foodType === t ? (t === "Veg" ? "#166534" : t === "Non-Veg" ? "#991B1B" : "#B87342") : "transparent",
                color: foodType === t ? "#FFFDF8" : C.muted,
              }}
            >
              {t === "Veg" && <span className="w-2 h-2 rounded-full bg-[#4ADE80]" />}
              {t === "Non-Veg" && <span className="w-2 h-2 rounded-full bg-[#F87171]" />}
              <span>{t}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 5 & 6. EXPANDABLE DIETARY & ALLERGENS PANEL ── */}
      <div className="rounded-2xl border mb-6 overflow-hidden transition-all duration-300" style={{ backgroundColor: "#1E1813", borderColor: C.border }}>
        {/* Panel Header */}
        <div 
          onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
          className="p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer select-none transition-colors hover:bg-white/5"
          style={{ borderBottom: isFilterPanelOpen ? `1px solid ${C.border}` : "none" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#2A1E17", color: "#D49566", border: `1px solid ${C.border}` }}>
              <Icons.Sliders size={18} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg" style={{ color: "#FFFDF8" }}>Dietary &amp; allergens</h3>
              <p className="text-xs" style={{ color: C.muted }}>Choose your preferences to see matching dishes</p>
            </div>
          </div>
          <div className="flex items-center gap-2" style={{ color: "#D49566" }}>
            {activeFilterCount > 0 && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#B87342] text-white">
                {activeFilterCount} Active
              </span>
            )}
            {isFilterPanelOpen ? <Icons.ChevronUp size={20} /> : <Icons.ChevronDown size={20} />}
          </div>
        </div>

        {/* Panel Body */}
        {isFilterPanelOpen && (
          <div className="p-4 sm:p-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Column A: Dietary Preferences */}
              <div className="flex flex-col gap-3">
                <p className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: "#D49566" }}>
                  <Icons.Leaf size={14} />
                  <span>Dietary Preferences</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Vegetarian",
                    "Vegan",
                    "Jain Friendly",
                    "Gluten-Free",
                    "Keto / Low Carb",
                    "High Protein (15g+)",
                    "Low Calorie (<300 kcal)"
                  ].map((diet) => {
                    const active = selectedDiets.includes(diet) || selectedDiet === diet;
                    return (
                      <button
                        key={diet}
                        onClick={() => {
                          toggleDiet(diet);
                          if (selectedDiet === diet) setSelectedDiet("All");
                        }}
                        className="px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all flex items-center gap-1.5 select-none"
                        style={{
                          backgroundColor: active ? "#B87342" : "#14100D",
                          color: active ? "#FFFDF8" : C.muted,
                          border: `1px solid ${active ? "#D49566" : C.border}`,
                          fontWeight: active ? 600 : 400
                        }}
                      >
                        <span className={`w-2 h-2 rounded-full ${active ? "bg-white" : "bg-transparent border border-neutral-500"}`} />
                        <span>{diet}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Column B: Allergens (Exclude) */}
              <div className="flex flex-col gap-3 md:border-l md:pl-6" style={{ borderColor: C.border }}>
                <p className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-rose-400">
                  <Icons.Shield size={14} />
                  <span>Allergens (Exclude)</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Dairy",
                    "Gluten",
                    "Nuts",
                    "Soy",
                    "Egg",
                    "Shellfish",
                    "Sesame"
                  ].map((alg) => {
                    const active = avoidAllergens.includes(alg);
                    return (
                      <button
                        key={alg}
                        onClick={() => toggleAllergen(alg)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all flex items-center gap-1.5 select-none"
                        style={{
                          backgroundColor: active ? "#8B2326" : "#14100D",
                          color: active ? "#FFFFFF" : C.muted,
                          border: `1px solid ${active ? "#F87171" : C.border}`,
                          fontWeight: active ? 600 : 400
                        }}
                      >
                        <span>{active ? "✕" : "🚫"}</span>
                        <span>{active ? `No ${alg}` : alg}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Column C: Cuisine */}
              <div className="flex flex-col gap-3 md:border-l md:pl-6" style={{ borderColor: C.border }}>
                <p className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: "#D49566" }}>
                  <Icons.Globe size={14} />
                  <span>Cuisine</span>
                </p>
                
                <select
                  value={selectedCuisine}
                  onChange={(e) => setSelectedCuisine(e.target.value)}
                  className="w-full rounded-xl px-3 py-2 text-xs font-medium outline-none cursor-pointer"
                  style={{ backgroundColor: "#14100D", border: `1px solid ${C.border}`, color: C.text }}
                >
                  {["All Cuisines", "German", "French", "Italian", "Austrian", "Swiss", "Scandinavian", "Belgian", "European Fusion"].map((c) => (
                    <option key={c} value={c === "All Cuisines" ? "All" : c}>{c}</option>
                  ))}
                </select>

                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {["German", "French", "Italian", "Austrian", "Swiss", "Scandinavian", "Belgian", "European Fusion"].map((c) => {
                    const active = selectedCuisine === c;
                    return (
                      <button
                        key={c}
                        onClick={() => setSelectedCuisine(active ? "All" : c)}
                        className="px-2.5 py-1 rounded-lg text-xs cursor-pointer transition-all select-none"
                        style={{
                          backgroundColor: active ? "#2A1E17" : "#14100D",
                          color: active ? "#D49566" : C.muted,
                          border: `1px solid ${active ? "#D49566" : C.border}`,
                          fontWeight: active ? 600 : 400
                        }}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* ── 7. PANEL ACTIONS ── */}
            <div className="mt-6 pt-4 border-t flex items-center justify-between" style={{ borderColor: C.border }}>
              <p className="text-xs" style={{ color: C.muted }}>
                Showing <span className="font-bold text-[#FFFDF8]">{filteredItems.length}</span> matching dishes
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer transition-colors"
                  style={{ backgroundColor: "#14100D", color: C.muted, border: `1px solid ${C.border}` }}
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsFilterPanelOpen(false)}
                  className="px-5 py-2 text-xs font-bold rounded-xl cursor-pointer transition-colors"
                  style={{ backgroundColor: "#B87342", color: "#FFFDF8" }}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── ACTIVE FILTER CHIPS ROW ── */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6 p-3 rounded-xl bg-[#1E1813] border border-[#382C23]">
          <span className="text-xs font-bold uppercase tracking-wider text-[#A08F81] mr-1">Active Filters:</span>
          
          {foodType !== "All" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#2A1E17] text-[#D49566] border border-[#D49566]">
              {foodType}
              <button onClick={() => setFoodType("All")} className="hover:text-white cursor-pointer ml-1 font-bold">✕</button>
            </span>
          )}

          {selectedCategory !== "All" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#2A1E17] text-[#D49566] border border-[#D49566]">
              Category: {selectedCategory}
              <button onClick={() => setSelectedCategory("All")} className="hover:text-white cursor-pointer ml-1 font-bold">✕</button>
            </span>
          )}

          {selectedCuisine !== "All" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#2A1E17] text-[#D49566] border border-[#D49566]">
              Cuisine: {selectedCuisine}
              <button onClick={() => setSelectedCuisine("All")} className="hover:text-white cursor-pointer ml-1 font-bold">✕</button>
            </span>
          )}

          {selectedDiets.map(d => (
            <span key={d} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#2A1E17] text-[#D49566] border border-[#D49566]">
              {d}
              <button onClick={() => toggleDiet(d)} className="hover:text-white cursor-pointer ml-1 font-bold">✕</button>
            </span>
          ))}

          {avoidAllergens.map(a => (
            <span key={a} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#3B1416] text-[#F87171] border border-[#8B2326]">
              No {a}
              <button onClick={() => toggleAllergen(a)} className="hover:text-white cursor-pointer ml-1 font-bold">✕</button>
            </span>
          ))}

          {searchQuery && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#2A1E17] text-[#D49566] border border-[#D49566]">
              Search: "{searchQuery}"
              <button onClick={() => setSearchQuery("")} className="hover:text-white cursor-pointer ml-1 font-bold">✕</button>
            </span>
          )}

          <button
            onClick={resetFilters}
            className="text-xs text-[#D9A073] underline ml-auto font-semibold cursor-pointer"
          >
            Reset All
          </button>
        </div>
      )}

      {/* ── DISHES GRID & COLORFUL SEASONAL GARDEN WIDGET ── */}
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
              <Icons.Utensils size={36} className="mx-auto mb-3 text-[#D49566]" />
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
                  className="rounded-3xl overflow-hidden flex flex-col justify-between transition-all hover:shadow-xl hover:border-[#B87342]/60 hover:-translate-y-1 group"
                  style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}
                >
                  <div 
                    className="relative aspect-[4/3] overflow-hidden cursor-pointer"
                    onClick={() => setIngredientOverlayItem(item)}
                  >
                    <FoodImage
                      src={item.img}
                      alt={item.imgAlt}
                      name={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-serif font-bold text-xl leading-tight" style={{ color: C.text }}>
                          {item.name}
                        </h3>
                        <p className="font-bold text-lg shrink-0" style={{ color: "#D49566" }}>
                          ₹{item.price}
                        </p>
                      </div>

                      <p className="text-[13px] font-medium mt-1.5" style={{ color: C.muted }}>
                        {item.cal} kcal · {item.protein}g protein · {item.carbs}g carbs
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t flex gap-2" style={{ borderColor: C.border }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); setProductModalItem(item); }}
                        className="flex-1 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors text-center"
                        style={{ backgroundColor: C.cream, color: C.text, border: `1px solid ${C.border}` }}
                      >
                        Details
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); addToCart(item); }}
                        className="flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors text-center"
                        style={{
                          background: "linear-gradient(135deg, #B87342 0%, #9C5E32 100%)",
                          color: "#FFFDF8",
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

        {/* ── SEASONAL GARDEN (Col 9-12) ── */}
        <div className="lg:col-span-4 flex flex-col gap-6 sticky top-24">
          <div className="rounded-3xl overflow-hidden shadow-xl border-2" style={{ borderColor: C.border }}>
            {/* Seasonal Photo Header */}
            <div className="relative h-32 overflow-hidden text-white p-4 flex flex-col justify-between" style={{ background: curSeasonStyle.bgGradient }}>
              <img
                src={curSeasonStyle.bannerImg}
                alt="Seasonal Garden Background"
                className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
              />
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md flex items-center gap-1">
                  <Icons.Leaf size={11} /> AJAB Seasonal Garden
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md">
                  {curSeasonStyle.temp}
                </span>
              </div>
              <h3 className="relative z-10 font-serif text-xl font-bold">{curSeasonStyle.title}</h3>
            </div>

            <div className="p-4" style={{ backgroundColor: "#1A140F" }}>
              {/* Season Tabs */}
              <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl mb-4" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
                {[
                  { id: "summer" as const, label: "Summer", icon: <Icons.Sun size={12} /> },
                  { id: "monsoon" as const, label: "Monsoon", icon: <Icons.CloudRain size={12} /> },
                  { id: "winter" as const, label: "Winter", icon: <Icons.Snowflake size={12} /> },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSeason(s.id)}
                    className="py-1.5 text-xs font-bold rounded-xl cursor-pointer transition-all text-center capitalize flex items-center justify-center gap-1"
                    style={{
                      backgroundColor: selectedSeason === s.id ? "#B87342" : "transparent",
                      color: selectedSeason === s.id ? "#FFFDF8" : C.muted,
                    }}
                  >
                    {s.icon}
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>

              {/* Seasonal Dishes List */}
              <div className="flex flex-col gap-3">
                {seasonalPicks.slice(0, 4).map((pick) => (
                  <div key={pick.id} className="p-3 rounded-2xl flex gap-3 items-center shadow-sm" style={{ backgroundColor: C.cream, border: `1px solid ${C.border}` }}>
                    <FoodImage src={pick.img} alt={pick.imgAlt} name={pick.name} className="w-14 h-14 rounded-xl object-contain shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-serif font-bold text-xs truncate" style={{ color: C.text }}>{pick.name}</p>
                      <p className="text-[11px] font-semibold" style={{ color: "#D49566" }}>₹ {pick.price} · {pick.cal} kcal</p>
                    </div>
                    <button
                      onClick={() => addToCart(pick)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-transform hover:scale-105"
                      style={{
                        background: "linear-gradient(135deg, #B87342 0%, #9C5E32 100%)",
                        color: "#FFFDF8",
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
      {/* ── INGREDIENT OVERLAY MODAL ── */}
      {productModalItem && ReactDOM.createPortal(<CProductModal item={productModalItem} onClose={() => setProductModalItem(null)} addToCart={addToCart} />, document.body)}

      {ingredientOverlayItem && ReactDOM.createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99998, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div 
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
            onClick={() => setIngredientOverlayItem(null)}
          />
          <div
            role="dialog"
            aria-modal="true"
            style={{ position: 'relative', zIndex: 99999, width: '90%', maxWidth: '384px', maxHeight: '90vh', backgroundColor: '#261D15', border: '1px solid #382C23', borderRadius: '1.5rem', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIngredientOverlayItem(null)}
              style={{ position: 'absolute', top: '12px', right: '12px', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px', lineHeight: 1, cursor: 'pointer', zIndex: 100000, backgroundColor: 'rgba(0,0,0,0.6)', color: '#FFFDF8', border: 'none' }}
              aria-label="Close"
            >
              ×
            </button>
            <div style={{ position: 'relative', height: '256px', flexShrink: 0, backgroundColor: '#1A130E' }}>
              <FoodImage
                src={ingredientOverlayItem.img}
                alt={ingredientOverlayItem.imgAlt}
                name={ingredientOverlayItem.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div style={{ padding: '24px', overflowY: 'auto' }}>
              <p style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#A08F81', margin: '0 0 6px 0' }}>{ingredientOverlayItem.category}</p>
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#FFFDF8', marginTop: 0 }}>
                {ingredientOverlayItem.name}
              </h3>
              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '17px', fontStyle: 'italic', marginBottom: '10px', color: '#C4824E', marginTop: 0 }}>Made with</p>
                {(!ingredientOverlayItem.ingredients || ingredientOverlayItem.ingredients.length === 0) ? (
                  <p style={{ fontSize: '14px', color: '#A08F81', fontStyle: 'italic', margin: 0 }}>
                    Ingredient information is being verified.
                  </p>
                ) : (
                  <ul style={{ listStyleType: 'none', paddingLeft: 0, margin: 0, color: '#EDE4DB' }}>
                    {ingredientOverlayItem.ingredients.map((ing: string, i: number) => (
                      <li key={i} style={{ fontSize: '14px', marginBottom: '6px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <span style={{ color: '#C4824E', lineHeight: '1.4' }}>•</span>
                        <span style={{ lineHeight: '1.4' }}>{ing}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {ingredientOverlayItem.ingredientVerificationStatus === 'unverified' && (
                <div style={{ marginTop: '12px', padding: '8px 12px', backgroundColor: 'rgba(217, 119, 6, 0.15)', border: '1px solid rgba(217, 119, 6, 0.3)', borderRadius: '8px', marginBottom: '12px' }}>
                  <p style={{ fontSize: '12px', color: '#FBBF24', margin: 0 }}>
                    ℹ Recipe details unverified — daily chef selection subject to variation.
                  </p>
                </div>
              )}

              {ingredientOverlayItem.allergens && ingredientOverlayItem.allergens.length > 0 ? (
                <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #382C23' }}>
                  <p style={{ fontSize: '12px', fontStyle: 'italic', color: '#E5C07B', margin: '0 0 4px 0' }}>
                    ⚠ Contains: {ingredientOverlayItem.allergens.join(', ')}
                  </p>
                  <p style={{ fontSize: '11px', color: '#8A7B70', margin: 0, fontStyle: 'italic' }}>
                    Cross-contact risk: Prepared in a kitchen environment handling gluten, milk, eggs, soy & nuts.
                  </p>
                </div>
              ) : (
                <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #382C23' }}>
                  <p style={{ fontSize: '11px', color: '#8A7B70', margin: 0, fontStyle: 'italic' }}>
                    Declared allergens: None declared in recipe. Cross-contact risks may exist in a shared kitchen.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

function CProductModal({ item, onClose, addToCart }: { item: FoodItem, onClose: () => void, addToCart: (f: FoodItem, q: number) => void }) {
  const [activeTab, setActiveTab] = useState<"overview" | "nutrition" | "ingredients" | "allergens">("overview");
  const [qty, setQty] = useState(1);

  // Close on Escape key
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99998, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
    >
      <div 
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />
      <div
        style={{ position: 'relative', zIndex: 99999, width: '100%', maxWidth: '42rem', maxHeight: '90vh', backgroundColor: "#261D15", border: `1px solid ${C.border}`, borderRadius: '1.5rem', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer', zIndex: 100000, backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', border: 'none' }}
          aria-label="Close modal"
        >
          ×
        </button>

        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row gap-6 p-6 border-b" style={{ borderColor: C.border }}>
          <div className="w-full sm:w-1/2 shrink-0 h-48 sm:h-auto rounded-xl overflow-hidden relative">
            <FoodImage src={item.img} alt={item.imgAlt} name={item.name} className="w-full h-full object-cover absolute inset-0" />
          </div>
          
          <div className="flex flex-col justify-between flex-1">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CTag label={item.category} />
                <CTag label={item.cuisine} />
              </div>
              <h2 className="font-serif text-3xl font-bold leading-tight" style={{ color: "#FFFDF8" }}>{item.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-2xl font-bold" style={{ color: "#D49566" }}>₹{item.price}</p>
                <FoodTypeBadge type={item.foodType} />
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center rounded-xl overflow-hidden" style={{ backgroundColor: "#1A130E", border: `1px solid ${C.border}` }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-2 font-bold cursor-pointer transition-colors hover:bg-white/5" style={{ color: "#D49566" }}>-</button>
                <span className="px-2 font-bold w-8 text-center" style={{ color: "#FFFDF8" }}>{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="px-4 py-2 font-bold cursor-pointer transition-colors hover:bg-white/5" style={{ color: "#D49566" }}>+</button>
              </div>
              <CBtn 
                label={`Add ${qty} to Cart`}
                onClick={() => { addToCart(item, qty); onClose(); }} 
                full 
                style={{ backgroundColor: "#B87342", color: "#FFFDF8" }}
              />
            </div>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex border-b overflow-x-auto hide-scrollbar" style={{ borderColor: C.border }}>
          {[
            { id: "overview", label: "Overview" },
            { id: "nutrition", label: "Nutrition" },
            { id: "ingredients", label: "Ingredients" },
            { id: "allergens", label: "Allergens" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="px-6 py-4 font-bold text-sm whitespace-nowrap border-b-2 transition-colors cursor-pointer"
              style={{
                borderColor: activeTab === tab.id ? "#D49566" : "transparent",
                color: activeTab === tab.id ? "#D49566" : "#A08F81"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENT */}
        <div className="p-6 overflow-y-auto flex-1 text-sm" style={{ color: "#FFFDF8" }}>
          {activeTab === "overview" && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-base" style={{ color: "#E0D7CD", lineHeight: 1.6 }}>{item.desc}</p>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 rounded-xl" style={{ backgroundColor: "#1A130E", border: `1px solid ${C.border}` }}>
                  <p className="text-xs uppercase font-bold tracking-wider mb-1" style={{ color: "#A08F81" }}>Dietary</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.dietary.map((d) => (
                      <span key={d} className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#122619] text-[#4ADE80] border border-[#1E4729]">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-4 rounded-xl flex flex-col justify-center" style={{ backgroundColor: "#1A130E", border: `1px solid ${C.border}` }}>
                  <p className="text-xs uppercase font-bold tracking-wider mb-1" style={{ color: "#A08F81" }}>Preparation</p>
                  <p className="font-bold text-[#E0D7CD]">Freshly prepared to order</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "nutrition" && (
            <div className="animate-fade-in">
              <p className="text-xs uppercase font-bold tracking-wider mb-4" style={{ color: "#A08F81" }}>Nutritional Information (Per Serving)</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Calories", val: `${item.cal} kcal` },
                  { label: "Protein", val: `${item.protein}g` },
                  { label: "Carbs", val: `${item.carbs}g` },
                  { label: "Total Fat", val: `${item.fat}g` },
                  { label: "Sat Fat", val: "N/A" },
                  { label: "Sugars", val: "N/A" },
                  { label: "Fibre", val: "N/A" },
                  { label: "Sodium", val: "N/A" }
                ].map((n, i) => (
                  <div key={i} className="p-3 rounded-xl text-center" style={{ backgroundColor: "#1A130E", border: `1px solid ${C.border}` }}>
                    <p className="text-[10px] uppercase font-bold" style={{ color: "#A08F81" }}>{n.label}</p>
                    <p className="font-bold text-sm mt-1" style={{ color: "#D49566" }}>{n.val}</p>
                  </div>
                ))}
              </div>
              <p className="text-[10px] italic mt-4" style={{ color: "#A08F81" }}>* Some exact values pending verification.</p>
            </div>
          )}

          {activeTab === "ingredients" && (
            <div className="animate-fade-in">
              <p className="text-xs uppercase font-bold tracking-wider mb-4" style={{ color: "#A08F81" }}>Base Ingredients</p>
              <ul className="list-disc pl-5 space-y-2">
                {item.ingredients.map((ing, i) => (
                  <li key={i} className="text-[#E0D7CD]">{ing}</li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "allergens" && (
            <div className="animate-fade-in space-y-4">
              <div>
                <p className="text-xs uppercase font-bold tracking-wider mb-2" style={{ color: "#A08F81" }}>Declared Allergens</p>
                {item.allergens.length > 0 ? (
                  <div className="p-4 rounded-xl border border-amber-800 bg-amber-950/30">
                    <p className="font-semibold text-amber-200">
                      Contains: {item.allergens.join(", ")}
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-emerald-800 bg-emerald-950/30">
                    <p className="font-semibold text-emerald-200">
                      No major allergens listed in base ingredients.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="p-4 rounded-xl" style={{ backgroundColor: "#1A130E", border: `1px solid ${C.border}` }}>
                <p className="text-xs uppercase font-bold tracking-wider mb-2" style={{ color: "#A08F81" }}>Cross-Contact Disclaimer</p>
                <p className="text-xs leading-relaxed" style={{ color: "#E0D7CD" }}>
                  Please be aware that our food may contain or come into contact with common allergens, such as dairy, eggs, wheat, soybeans, tree nuts, peanuts, fish, shellfish or wheat. While we take steps to minimize risk and safely handle the foods that contain potential allergens, please be advised that cross contamination may occur.
                </p>
              </div>
            </div>
          )}
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
          <Icons.Cart size={48} className="mx-auto mb-4 text-[#A08F81]" />
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
                <FoodImage src={item.img} alt={item.name} name={item.name} className="w-14 h-14 rounded-xl object-contain" />
                <div>
                  <p className="font-bold text-sm" style={{ color: C.text }}>{item.name}</p>
                  <p className="text-xs" style={{ color: C.muted }}>₹ {item.price} each</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-xl p-1" style={{ backgroundColor: C.cream, border: `1px solid ${C.border}` }}>
                  <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 rounded-lg font-bold cursor-pointer hover:bg-white/10 flex items-center justify-center">−</button>
                  <span className="text-sm font-bold w-5 text-center">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 rounded-lg font-bold cursor-pointer hover:bg-white/10 flex items-center justify-center">+</button>
                </div>
                <p className="font-bold text-sm w-16 text-right" style={{ color: "#D49566" }}>₹ {item.price * item.qty}</p>
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
              <span style={{ color: "#D49566", fontSize: 18 }}>₹ {total}</span>
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
      <div className="w-20 h-20 rounded-full flex items-center justify-center bg-[#122619] text-[#4ADE80] border-2 border-[#2E7D47]">
        <Icons.Check size={36} />
      </div>
      <h1 className="font-serif text-3xl font-bold" style={{ color: C.accent }}>Order Received!</h1>
      <p className="text-sm" style={{ color: C.muted }}>Your order is now being freshly prepared by our chefs.</p>
      <CCard className="w-full text-left flex flex-col gap-2 mt-2">
        <div className="flex justify-between text-sm font-semibold"><span>Order Number:</span><span style={{ color: C.accent }}>AJB-9482</span></div>
        <div className="flex justify-between text-sm font-semibold"><span>Estimated Prep Time:</span><span>15–20 minutes</span></div>
        <div className="flex justify-between text-sm font-semibold"><span>Status:</span><span className="text-amber-400 font-bold flex items-center gap-1"><Icons.Flame size={12} /> Kitchen Preparing</span></div>
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
  return (
    <div className="w-full h-[calc(100vh-85px)] animate-fade-in overflow-hidden">
      <VirtualCafe3D
        tables={tables}
        selectedTableId={selected}
        onSelectTable={setSelected}
        guestCount={draft.guests}
        reservationDate={draft.date || "Oct 24, 2026"}
        reservationTime={draft.time || "7:00 PM"}
        onUpdateDraft={(fields) => setDraft((prev) => ({ ...prev, ...fields }))}
        onProceedToReserve={() => navigate("reservation")}
        onBack={() => navigate("home")}
      />
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
      <div className="w-20 h-20 rounded-full flex items-center justify-center bg-[#122619] text-[#4ADE80] border-2 border-[#2E7D47]">
        <Icons.Check size={36} />
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
            <img src={e.img} alt={e.imgAlt} className="w-full h-48 object-contain" />
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#291E15] text-[#D49566] border border-[#4A3525]">{e.tag}</span>
                <h3 className="font-serif text-xl font-bold mt-2" style={{ color: C.text }}>{e.name}</h3>
                <p className="text-xs font-bold mt-1 flex items-center gap-1.5" style={{ color: C.accent }}>
                  <Icons.Calendar size={13} /> {e.date}
                </p>
                <p className="text-xs mt-2 leading-relaxed" style={{ color: C.muted }}>{e.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t flex items-center justify-between" style={{ borderColor: C.border }}>
                <span className="font-bold text-sm" style={{ color: "#D49566" }}>₹ {e.price} / person</span>
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
        <CCard>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: C.cream, color: "#4ADE80" }}>
            <Icons.Leaf size={18} />
          </div>
          <h3 className="font-bold text-base mb-1" style={{ color: C.accent }}>Organic Sourcing</h3>
          <p className="text-xs" style={{ color: C.muted }}>Estate coffee, pure A2 dairy, and organic herbs with zero artificial flavorings.</p>
        </CCard>
        <CCard>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: C.cream, color: C.accent }}>
            <Icons.Accessibility size={18} />
          </div>
          <h3 className="font-bold text-base mb-1" style={{ color: C.accent }}>Universal Inclusion</h3>
          <p className="text-xs" style={{ color: C.muted }}>Senior citizen typography, screen reader tags, low-data modes, and step-free wheelchair access.</p>
        </CCard>
        <CCard>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: C.cream, color: C.accent }}>
            <Icons.MapPin size={18} />
          </div>
          <h3 className="font-bold text-base mb-1" style={{ color: C.accent }}>Visit Us</h3>
          <p className="text-xs" style={{ color: C.muted }}>12 Residency Road, Bangalore · Open Daily 8:00 AM – 11:00 PM</p>
        </CCard>
      </div>

      {/* Surroundings Map */}
      <CafeSurroundingsMap />
    </div>
  );
}

function CFeedback() {
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState(5);

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-12 animate-fade-in">
      <h1 className="font-serif text-3xl font-bold mb-2" style={{ color: C.accent }}>Guest Feedback</h1>
      <p className="text-sm mb-6" style={{ color: C.muted }}>Help us make AJAB even more welcoming and delicious.</p>

      {submitted ? (
        <CCard className="text-center py-10">
          <Icons.Mail size={40} className="mx-auto mb-2 text-[#D49566]" />
          <h3 className="font-serif text-xl font-bold" style={{ color: C.accent }}>Thank you for your thoughts!</h3>
          <p className="text-xs mt-1" style={{ color: C.muted }}>Our founding team reviews every piece of guest feedback personally.</p>
        </CCard>
      ) : (
        <CCard className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: C.muted }}>Your Experience Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setRating(s)}
                  className="cursor-pointer hover:scale-110 transition-transform p-1"
                  style={{ color: s <= rating ? "#D49566" : "#4A3B30" }}
                >
                  <Icons.Star size={24} filled={s <= rating} />
                </button>
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
            <button key={String(label)} onClick={action as () => void} className="rounded-2xl p-3 text-left cursor-pointer transition-all hover:-translate-y-0.5 hover:border-[#B87342]" style={{ backgroundColor: C.cream, border: `1px solid ${C.border}` }}>
              <p className="font-bold text-xs" style={{ color: C.accent }}>{label as string}</p>
              <p className="text-[11px] mt-1 leading-snug" style={{ color: C.muted }}>{sub as string}</p>
            </button>
          ))}
        </div>
      </CCard>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <CCard onClick={() => setMode("elderly")} className="text-center">
          <div className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center font-bold text-lg mb-3" style={{ backgroundColor: "#3D1F00", color: "#FFF" }}>Aa</div>
          <h3 className="font-bold text-base" style={{ color: C.accent }}>Senior Citizen Mode</h3>
          <p className="text-xs mt-1" style={{ color: C.muted }}>Large touch buttons, high readability, spoken audio.</p>
        </CCard>

        <CCard onClick={() => setMode("rural")} className="text-center">
          <div className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center mb-3" style={{ backgroundColor: "#203810", color: "#A7F3D0" }}>
            <Icons.Globe size={22} />
          </div>
          <h3 className="font-bold text-base" style={{ color: "#4ADE80" }}>Rural / Multilingual</h3>
          <p className="text-xs mt-1" style={{ color: C.muted }}>English, हिंदी &amp; मराठी with full translation &amp; offline mode.</p>
        </CCard>

        <CCard onClick={() => setMode("vi")} className="text-center">
          <div className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center mb-3" style={{ backgroundColor: "#0D0600", color: "#FFD166" }}>
            <Icons.Eye size={22} />
          </div>
          <h3 className="font-bold text-base" style={{ color: "#FFD166" }}>Visually Impaired</h3>
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
        <span className="flex items-center gap-2">
          <Icons.Accessibility size={16} />
          <span>Senior Citizen Display — High Contrast &amp; Large Buttons</span>
        </span>
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
              { label: "HOME", s: "e-home" as const },
              { label: "MENU", s: "e-menu" as const },
              { label: "RESERVE", s: "e-seats" as const },
              { label: "SETTINGS", s: "e-settings" as const },
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
            <Icons.Cart size={18} />
            <span>Cart ({cartCount})</span>
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
              <button onClick={() => setScreen("e-menu")} className="rounded-2xl p-6 font-bold cursor-pointer text-left flex items-center gap-3" style={{ backgroundColor: EC.card, border: `3px solid ${EC.border}`, fontSize: 20, color: EC.text }}>
                <Icons.Utensils size={24} className="text-[#D49566]" />
                <span>Browse All 44 Dishes</span>
              </button>
              <button onClick={() => setScreen("e-seats")} className="rounded-2xl p-6 font-bold cursor-pointer text-left flex items-center gap-3" style={{ backgroundColor: EC.card, border: `3px solid ${EC.border}`, fontSize: 20, color: EC.text }}>
                <Icons.Calendar size={24} className="text-[#D49566]" />
                <span>Reserve a Dining Table</span>
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
                    <FoodImage src={item.img} alt={item.imgAlt} name={item.name} className="w-24 h-24 rounded-2xl object-contain shrink-0" />
                    <div>
                      <FoodTypeBadge type={item.foodType} />
                      <h3 className="font-bold text-xl mt-1" style={{ color: EC.text }}>{item.name}</h3>
                      <p className="font-bold text-xl mt-1" style={{ color: EC.accent }}>₹ {item.price}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t flex gap-2" style={{ borderColor: EC.border }}>
                    <button
                      onClick={() => { setSelectedFood(item); setScreen("e-food-details"); }}
                      className="flex-1 py-3 rounded-xl font-bold text-center cursor-pointer"
                      style={{ backgroundColor: EC.cream, color: EC.text, border: `2px solid ${EC.border}` }}
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
              <FoodImage src={selectedFood.img} alt={selectedFood.imgAlt} name={selectedFood.name} className="w-full h-64 rounded-2xl object-contain" />
              <div className="flex items-center justify-between mt-4">
                <h2 className="font-serif text-3xl font-bold" style={{ color: EC.accent }}>{selectedFood.name}</h2>
                <ReadAloudBtn text={`${selectedFood.name}. ${selectedFood.desc}. Priced at ${selectedFood.price} rupees.`} />
              </div>
              <p className="text-lg mt-2" style={{ color: EC.muted, lineHeight: 1.6 }}>{selectedFood.desc}</p>
              <p className="text-3xl font-bold mt-3" style={{ color: "#D49566" }}>₹ {selectedFood.price}</p>

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
                <Icons.Cart size={40} className="mx-auto mb-2 text-[#A08F81]" />
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
                      <p className="text-lg" style={{ color: "#D49566" }}>₹ {item.price} each</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => updateQty(item.id, -1)} className="w-10 h-10 rounded-xl font-bold text-xl bg-[#1F1610] text-[#FFF] border border-[#855831] flex items-center justify-center">−</button>
                      <span className="font-bold text-xl w-6 text-center" style={{ color: EC.text }}>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="w-10 h-10 rounded-xl font-bold text-xl bg-[#1F1610] text-[#FFF] border border-[#855831] flex items-center justify-center">+</button>
                    </div>
                  </div>
                ))}
                <div className="p-6 rounded-3xl mt-4" style={{ backgroundColor: EC.card, border: `3px solid ${EC.border}` }}>
                  <div className="flex justify-between text-2xl font-bold">
                    <span style={{ color: EC.text }}>Total Bill:</span>
                    <span style={{ color: "#D49566" }}>₹ {cart.reduce((s, c) => s + c.price * c.qty, 0)}</span>
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
            <div className="w-20 h-20 rounded-full flex items-center justify-center bg-[#122619] text-[#4ADE80] border-2 border-[#2E7D47]">
              <Icons.Check size={36} />
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
                    className="py-3 rounded-2xl font-bold text-lg cursor-pointer"
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
   RURAL / MULTILINGUAL VERSION
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
                  backgroundColor: lang === l ? "#B87342" : C.cream,
                  color: lang === l ? "#FFFDF8" : C.text,
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
              <button onClick={() => setScreen("r-menu")} className="rounded-2xl p-5 text-center font-bold text-lg cursor-pointer flex items-center justify-center gap-2" style={{ backgroundColor: C.card, border: `1px solid ${C.border}`, color: C.text }}>
                <Icons.Utensils size={18} />
                <span>{t.viewMenu}</span>
              </button>
              <button onClick={() => setScreen("r-seats")} className="rounded-2xl p-5 text-center font-bold text-lg cursor-pointer flex items-center justify-center gap-2" style={{ backgroundColor: C.card, border: `1px solid ${C.border}`, color: C.text }}>
                <Icons.Calendar size={18} />
                <span>{t.reserveTable}</span>
              </button>
            </div>
          </div>
        )}

        {screen === "r-menu" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-2xl font-bold" style={{ color: C.accent }}>{t.menu}</h2>
              <button onClick={() => setScreen("r-home")} className="text-xs font-bold underline" style={{ color: "#D49566" }}>← {t.home}</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {menuItems.map((item) => {
                const name = lang === "hi" ? item.nameHi : lang === "mr" ? item.nameMr : item.name;
                const desc = lang === "hi" ? item.descHi : lang === "mr" ? item.descMr : item.desc;
                return (
                  <div key={item.id} className="rounded-2xl p-4 flex gap-3 items-center" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
                    {!lowData && <FoodImage src={item.img} alt={item.imgAlt} name={name} className="w-16 h-16 rounded-xl object-contain shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate" style={{ color: C.text }}>{name}</p>
                      <p className="text-xs line-clamp-1" style={{ color: C.muted }}>{desc}</p>
                      <p className="text-xs font-bold mt-1" style={{ color: "#D49566" }}>₹ {item.price}</p>
                    </div>
                    <button onClick={() => addToCart(item)} className="px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer" style={{ backgroundColor: "#B87342", color: "#FFFDF8" }}>
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
              <button onClick={() => setScreen("r-home")} className="text-xs font-bold underline" style={{ color: "#D49566" }}>← {t.home}</button>
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
   VISUALLY IMPAIRED VERSION
═══════════════════════════════════════════════════════════════════════ */
function VIApp({ setMode }: { setMode: (m: AppMode) => void }) {
  const [screen, setScreen] = useState<"vi-home" | "vi-menu" | "vi-seats">("vi-home");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showImgDesc, setShowImgDesc] = useState(true);

  const addToCart = (f: FoodItem) => setCart((p) => [...p, { id: f.id, name: f.name, price: f.price, qty: 1, img: f.img }]);

  return (
    <div style={{ minHeight: "100%", backgroundColor: VI.bg, color: VI.text, fontFamily: "'DM Sans',sans-serif", fontSize: 18 }}>
      <div className="w-full py-2 px-6 flex items-center justify-between text-sm font-bold" style={{ backgroundColor: "#1C1005", color: VI.accent, borderBottom: `2px solid ${VI.border}` }}>
        <span className="flex items-center gap-2">
          <Icons.Eye size={18} />
          <span>Visually Impaired Mode (High Contrast Dark &amp; Gold)</span>
        </span>
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
            <button onClick={() => setScreen("vi-home")} className="px-3 py-1.5 font-bold rounded-lg cursor-pointer" style={{ color: VI.accent }}>Home</button>
            <button onClick={() => setScreen("vi-menu")} className="px-3 py-1.5 font-bold rounded-lg cursor-pointer" style={{ color: VI.accent }}>Menu (44)</button>
            <button onClick={() => setScreen("vi-seats")} className="px-3 py-1.5 font-bold rounded-lg cursor-pointer" style={{ color: VI.accent }}>Tables</button>
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
                  <p className="text-xs font-bold text-[#FFD166]">Image Description:</p>
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
              <button onClick={() => setShowImgDesc(!showImgDesc)} className="text-xs font-bold underline text-[#FFD166] cursor-pointer">
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
                    Photo: "{item.imgAlt}"
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
      {selectedFood && ReactDOM.createPortal(<CProductModal item={selectedFood} onClose={() => setSelectedFood(null)} addToCart={addToCart} />, document.body)}
      </main>

      <footer className="mt-16 py-12 text-center text-xs border-t" style={{ backgroundColor: "#0E0A08", borderColor: "#261C14", color: C.muted }}>
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
 