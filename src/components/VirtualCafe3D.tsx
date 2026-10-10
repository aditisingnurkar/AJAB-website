import React, { useState } from "react";
import { TableInfo } from "../data/tableData";

export interface VirtualCafe3DProps {
  tables: TableInfo[];
  selectedTableId: string | null;
  onSelectTable: (tableId: string) => void;
  guestCount: number;
  reservationDate: string;
  reservationTime: string;
  onUpdateDraft: (fields: { guests?: number; date?: string; time?: string }) => void;
  onProceedToReserve: () => void;
  onBack: () => void;
}

interface TableMarkerPos {
  id: string;
  x: number; // percentage X coordinate on image container
  y: number; // percentage Y coordinate on image container
  label: string;
  capacity: number;
}

// Normalized percentage coordinates calibrated to the background image
const OVERLAY_MARKERS: TableMarkerPos[] = [
  { id: "T1", x: 14, y: 72, label: "T1", capacity: 2 },
  { id: "T2", x: 30, y: 57, label: "T2", capacity: 4 },
  { id: "B2", x: 36, y: 65, label: "B2", capacity: 6 },
  { id: "B1", x: 42, y: 49, label: "B1", capacity: 4 },
  { id: "T3", x: 52, y: 48, label: "T3", capacity: 2 },
  { id: "T4", x: 59, y: 60, label: "T4", capacity: 4 },
  { id: "T5", x: 83, y: 70, label: "T5", capacity: 6 },
];

const TIME_SLOTS = [
  "12:00 PM", "1:00 PM", "2:00 PM", "4:30 PM", "6:00 PM", "7:00 PM", "7:30 PM", "8:30 PM", "9:30 PM"
];

const DATE_OPTIONS = [
  "Oct 24, 2026", "Oct 25, 2026", "Oct 26, 2026", "Oct 27, 2026", "Oct 28, 2026", "Oct 29, 2026"
];

// Clean monochrome SVG Line Icons (No emojis)
const SvgIcons = {
  Users: () => (
    <svg className="w-4 h-4 text-[#4B3023]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Chair: () => (
    <svg className="w-4 h-4 text-[#4B3023]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 19v2" />
      <path d="M18 19v2" />
      <path d="M5 11h14v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-4z" />
      <path d="M6 11V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v6" />
    </svg>
  ),
  Home: () => (
    <svg className="w-4 h-4 text-[#4B3023]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  Plug: () => (
    <svg className="w-4 h-4 text-[#4B3023]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22v-5" />
      <path d="M9 8V2" />
      <path d="M15 8V2" />
      <path d="M18 8H6a2 2 0 0 0-2 2v3a6 6 0 0 0 12 0v-3a2 2 0 0 0-2-2z" />
    </svg>
  ),
  Calendar: () => (
    <svg className="w-4 h-4 text-[#4B3023]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-4 h-4 text-[#4B3023]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  BookOpen: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  RotateCcw: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  ),
  Maximize: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
    </svg>
  ),
  ChevronDown: () => (
    <svg className="w-3.5 h-3.5 text-[#4B3023]/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  Close: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  ArrowLeft: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  ),
  Check: () => (
    <svg className="w-3.5 h-3.5 text-[#285C43]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Alert: () => (
    <svg className="w-4 h-4 text-amber-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
};

// Dynamic availability helper for date/time selection
function checkTableAvailability(tableId: string, date: string, time: string, tables: TableInfo[]): boolean {
  if (tableId === "T2" && (time === "7:00 PM" || time === "7:30 PM")) return false;
  if (tableId === "T4" && (time === "6:00 PM" || time === "7:00 PM")) return false;
  if (tableId === "T5" && date.includes("Oct 25") && time === "8:30 PM") return false;
  const baseTable = tables.find((t) => t.id === tableId);
  return baseTable ? baseTable.status === "available" : true;
}

export default function VirtualCafe3D({
  tables,
  selectedTableId,
  onSelectTable,
  guestCount,
  reservationDate,
  reservationTime,
  onUpdateDraft,
  onProceedToReserve,
  onBack,
}: VirtualCafe3DProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(2);
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [bookingRef, setBookingRef] = useState<string | null>(null);
  const [showMapModal, setShowMapModal] = useState(false);

  // Single source of truth table object
  const activeTableId = selectedTableId || "T1";
  const selectedTableObj = tables.find((t) => t.id === activeTableId) || tables[0];
  const isSelectedAvailable = checkTableAvailability(activeTableId, reservationDate, reservationTime, tables);
  const isCapacityMismatch = selectedTableObj ? guestCount > selectedTableObj.seats : false;

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const refId = "AJAB-RES-" + Math.floor(10000 + Math.random() * 90000);
    setBookingRef(refId);
    setCurrentStep(4);
  };

  const resetSelection = () => {
    onSelectTable("T1");
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-[#241812] text-[#E9E0D1] flex flex-col font-sans select-none overflow-hidden">
      {/* ── SECTION 2B: RESERVATION HEADING BAR (#281A13) ── */}
      <div className="w-full bg-[#281A13] border-b border-[#36251D] px-6 py-2.5 flex flex-wrap items-center justify-between gap-4 z-30 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#4B3023] hover:bg-[#B87543] text-[#F5EBDD] text-xs font-semibold transition-colors cursor-pointer border border-[#5A3A2B]"
          >
            <SvgIcons.ArrowLeft /> Back
          </button>
          <div className="hidden sm:block">
            <h2 className="font-serif font-bold text-sm text-[#F5EBDD]">Find Your Perfect Seat</h2>
            <p className="text-[11px] text-[#E9E0D1]/70">Explore our café and choose a table you love.</p>
          </div>
        </div>

        {/* Four-Step Progress Indicator (Copper & Cream) */}
        <div className="flex items-center gap-3 sm:gap-6 bg-[#17100C] px-5 py-2 rounded-full border border-[#36251D]">
          <button onClick={() => setCurrentStep(1)} className="flex items-center gap-2 cursor-pointer">
            <span className="w-5 h-5 rounded-full font-bold text-[11px] flex items-center justify-center bg-[#F5EBDD] text-[#241812]">
              1
            </span>
            <span className="text-xs font-semibold text-[#F5EBDD] hidden md:inline">Date &amp; Guests</span>
          </button>
          <div className="w-6 h-[1px] bg-[#36251D]" />

          <button onClick={() => setCurrentStep(2)} className="flex items-center gap-2 cursor-pointer">
            <span className="w-5 h-5 rounded-full font-bold text-[11px] flex items-center justify-center bg-[#B87543] text-white shadow-md">
              2
            </span>
            <span className="text-xs font-bold text-[#F5EBDD]">Select Table</span>
          </button>
          <div className="w-6 h-[1px] bg-[#36251D]" />

          <button
            onClick={() => setCurrentStep(3)}
            className="flex items-center gap-2 cursor-pointer opacity-60 hover:opacity-100"
          >
            <span className="w-5 h-5 rounded-full font-bold text-[11px] flex items-center justify-center border border-[#66493A] text-[#E9E0D1]">
              3
            </span>
            <span className="text-xs font-medium text-[#E9E0D1]/70 hidden md:inline">Review</span>
          </button>
          <div className="w-6 h-[1px] bg-[#36251D]" />

          <div className="flex items-center gap-2 opacity-40">
            <span className="w-5 h-5 rounded-full font-bold text-[11px] flex items-center justify-center border border-[#66493A] text-[#E9E0D1]">
              4
            </span>
            <span className="text-xs font-medium text-[#E9E0D1]/70 hidden md:inline">Confirm</span>
          </div>
        </div>
      </div>

      {/* ── SECTION 2C: TWO-COLUMN MAIN CONTENT (LEFT ~71%, RIGHT ~29%) ── */}
      {(currentStep === 1 || currentStep === 2) && (
        <div className="flex-1 w-full flex flex-col lg:flex-row gap-5 p-6 items-stretch overflow-hidden">
          {/* LEFT COLUMN: 71% WIDTH (Café Image + Markers + Bottom Controls) */}
          <div className="w-full lg:w-[71%] flex flex-col gap-4 relative">
            <div className="relative w-full h-[520px] md:h-[580px] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#4B3023] bg-[#17100C]">
              {/* Main café background image */}
              <img
                src="/images/cafe/3d_cafe_master.jpg"
                alt="AJAB Cafe Interior"
                className="w-full h-full object-cover object-center"
              />

              {/* ── SECTION 1 & 3: CALIBRATED 2D TABLE MARKERS OVERLAY ── */}
              <div className="absolute inset-0 z-20 pointer-events-auto">
                {OVERLAY_MARKERS.map((spot) => {
                  const tableObj = tables.find((t) => t.id === spot.id);
                  const capacity = tableObj ? tableObj.seats : spot.capacity;
                  const isSelected = activeTableId === spot.id;
                  const isAvailable = checkTableAvailability(spot.id, reservationDate, reservationTime, tables);

                  return (
                    <button
                      key={spot.id}
                      style={{
                        left: `${spot.x}%`,
                        top: `${spot.y}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                      onClick={() => {
                        onSelectTable(spot.id);
                        setCurrentStep(2);
                      }}
                      className={`absolute transition-transform duration-200 cursor-pointer ${
                        isSelected ? "scale-110 z-30" : "hover:scale-105 z-20"
                      }`}
                    >
                      {/* Compact Pill Badge: Status Dot + ID (Capacity) */}
                      <div
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold shadow-2xl backdrop-blur-md border ${
                          isSelected
                            ? "bg-[#285C43] text-white border-emerald-300 ring-2 ring-emerald-400 shadow-[0_0_15px_rgba(40,92,67,0.9)]"
                            : isAvailable
                            ? "bg-[#241812]/90 text-[#F5EBDD] border-[#4B3023] hover:border-[#B87543]"
                            : "bg-[#2E1414]/90 text-[#F87171] border-[#592222]"
                        }`}
                      >
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            isAvailable ? "bg-[#4ADE80] shadow-[0_0_6px_rgba(74,222,128,0.8)]" : "bg-[#EF4444]"
                          }`}
                        />
                        <span>
                          {spot.label} ({capacity})
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* ── SECTION 5: BOTTOM-LEFT TOOLBAR ── */}
              <div className="absolute bottom-4 left-4 z-30 flex items-center gap-2 bg-[#17100C]/85 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-[#36251D] text-xs text-[#E9E0D1]">
                <button
                  onClick={() => setShowMapModal(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-[#2E1E17] transition-colors cursor-pointer text-[#E9E0D1]"
                >
                  <SvgIcons.BookOpen />
                  <span className="font-semibold text-[11px]">View Map</span>
                </button>
                <div className="w-[1px] h-4 bg-[#36251D]" />
                <button
                  onClick={resetSelection}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-[#2E1E17] transition-colors cursor-pointer text-[#E9E0D1]"
                >
                  <SvgIcons.RotateCcw />
                  <span className="font-semibold text-[11px]">Reset Selection</span>
                </button>
                <div className="w-[1px] h-4 bg-[#36251D]" />
                <button
                  onClick={toggleFullScreen}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-[#2E1E17] transition-colors cursor-pointer text-[#E9E0D1]"
                >
                  <SvgIcons.Maximize />
                  <span className="font-semibold text-[11px]">Full Screen</span>
                </button>
              </div>

              {/* ── SECTION 6: BOTTOM-CENTER RESERVATION BAR (#F5EBDD) ── */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 bg-[#F5EBDD] text-[#30241D] px-5 py-2.5 rounded-2xl border border-[#E9E0D1] shadow-2xl flex items-center gap-4 md:gap-6 text-xs">
                {/* Date */}
                <div className="flex items-center gap-2">
                  <SvgIcons.Calendar />
                  <div>
                    <p className="text-[9px] font-bold text-[#4B3023]/70 uppercase tracking-wider">Date</p>
                    <div className="flex items-center gap-1 font-bold text-xs text-[#30241D]">
                      <select
                        value={reservationDate}
                        onChange={(e) => onUpdateDraft({ date: e.target.value })}
                        className="bg-transparent font-bold text-xs text-[#30241D] outline-none cursor-pointer appearance-none pr-3"
                      >
                        {DATE_OPTIONS.map((d) => (
                          <option key={d} value={d} className="bg-[#F5EBDD] text-[#30241D]">
                            {d}
                          </option>
                        ))}
                      </select>
                      <SvgIcons.ChevronDown />
                    </div>
                  </div>
                </div>

                <div className="w-[1px] h-7 bg-[#4B3023]/20" />

                {/* Time */}
                <div className="flex items-center gap-2">
                  <SvgIcons.Clock />
                  <div>
                    <p className="text-[9px] font-bold text-[#4B3023]/70 uppercase tracking-wider">Time</p>
                    <div className="flex items-center gap-1 font-bold text-xs text-[#30241D]">
                      <select
                        value={reservationTime}
                        onChange={(e) => onUpdateDraft({ time: e.target.value })}
                        className="bg-transparent font-bold text-xs text-[#30241D] outline-none cursor-pointer appearance-none pr-3"
                      >
                        {TIME_SLOTS.map((t) => (
                          <option key={t} value={t} className="bg-[#F5EBDD] text-[#30241D]">
                            {t}
                          </option>
                        ))}
                      </select>
                      <SvgIcons.ChevronDown />
                    </div>
                  </div>
                </div>

                <div className="w-[1px] h-7 bg-[#4B3023]/20" />

                {/* Guests */}
                <div className="flex items-center gap-2">
                  <SvgIcons.Users />
                  <div>
                    <p className="text-[9px] font-bold text-[#4B3023]/70 uppercase tracking-wider">Guests</p>
                    <div className="flex items-center gap-1 font-bold text-xs text-[#30241D]">
                      <select
                        value={guestCount}
                        onChange={(e) => onUpdateDraft({ guests: Number(e.target.value) })}
                        className="bg-transparent font-bold text-xs text-[#30241D] outline-none cursor-pointer appearance-none pr-3"
                      >
                        {[1, 2, 3, 4, 5, 6, 8, 10].map((g) => (
                          <option key={g} value={g} className="bg-[#F5EBDD] text-[#30241D]">
                            {g}
                          </option>
                        ))}
                      </select>
                      <SvgIcons.ChevronDown />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: 29% WIDTH (SECTION 4: CREAM DETAILS PANEL #F5EBDD) */}
          <div className="w-full lg:w-[29%] bg-[#F5EBDD] text-[#30241D] rounded-3xl p-6 shadow-2xl flex flex-col justify-between border border-[#E9E0D1] max-h-[580px] overflow-hidden">
            <div className="flex flex-col h-full justify-between overflow-hidden">
              {/* Scrollable Content Region */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-4">
                {/* 1. Header: Table Name + Close Button */}
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-2xl font-bold text-[#30241D]">
                    {selectedTableObj.name}
                  </h3>
                  <button
                    onClick={() => onSelectTable("T1")}
                    className="w-7 h-7 rounded-full bg-[#E9E0D1] text-[#30241D] flex items-center justify-center font-bold hover:bg-[#D4C5B2] transition-colors cursor-pointer"
                  >
                    <SvgIcons.Close />
                  </button>
                </div>

                {/* 2. Wide Rounded Image Crop */}
                <div className="w-full h-36 rounded-2xl overflow-hidden bg-[#E9E0D1] shadow-inner shrink-0">
                  <img
                    src={`/images/cafe/tables/${selectedTableObj.id}.jpg`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/cafe/3d_cafe_master.jpg";
                    }}
                    alt={selectedTableObj.name}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {/* 3. Specs: Capacity, Seating Type & Location */}
                <div className="space-y-2 text-xs font-semibold text-[#4B3023]">
                  <div className="flex items-center gap-2.5">
                    <SvgIcons.Users />
                    <span>{selectedTableObj.seats} Guests Max</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <SvgIcons.Chair />
                    <span>{selectedTableObj.feature || "Window Table"}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <SvgIcons.Home />
                    <span>{selectedTableObj.zone || "Indoor Hall"}</span>
                  </div>
                  {selectedTableObj.amenities?.map((a) => (
                    <div key={a} className="flex items-center gap-2.5">
                      <SvgIcons.Check />
                      <span>{a}</span>
                    </div>
                  ))}
                </div>

                {/* 4. Short Description */}
                <p className="text-xs text-[#4B3023]/80 leading-relaxed">
                  {selectedTableObj.desc}
                </p>

                {/* Capacity Mismatch Warning */}
                {isCapacityMismatch && (
                  <div className="p-2.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 text-xs font-medium flex items-center gap-2">
                    <SvgIcons.Alert />
                    <span>Party size ({guestCount}) exceeds table capacity ({selectedTableObj.seats} seats).</span>
                  </div>
                )}

                {/* 5. Availability Status */}
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        isSelectedAvailable ? "bg-[#285C43] shadow-[0_0_6px_rgba(40,92,67,0.6)]" : "bg-red-500"
                      }`}
                    />
                    <span className="font-bold text-sm text-[#30241D]">
                      {isSelectedAvailable ? "Available" : "Unavailable / Reserved"}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#4B3023]/70 ml-5">
                    for {reservationDate} at {reservationTime}
                  </p>
                </div>
              </div>

              {/* 6. DEDICATED UNCLIPPED FOOTER BUTTON (ALWAYS FULLY VISIBLE) */}
              <div className="pt-3 mt-2 border-t border-[#E9E0D1] shrink-0">
                {isSelectedAvailable && !isCapacityMismatch ? (
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="w-full py-3.5 px-6 rounded-2xl bg-[#B87B4B] hover:bg-[#A3683A] text-white font-bold text-sm transition-all shadow-lg hover:shadow-xl cursor-pointer text-center"
                  >
                    Reserve This Table
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full py-3 px-4 rounded-2xl bg-[#E9E0D1] text-[#7A685B] font-bold text-xs text-center cursor-not-allowed"
                  >
                    {isCapacityMismatch ? "Party Size Too Large" : "Table Unavailable"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 3: REVIEW RESERVATION & ENTER GUEST DETAILS ── */}
      {currentStep === 3 && (
        <div className="flex-1 max-w-3xl mx-auto w-full p-6 animate-fade-in">
          <div className="bg-[#F5EBDD] text-[#30241D] rounded-3xl p-8 shadow-2xl border border-[#E9E0D1]">
            <h3 className="font-serif text-2xl font-bold mb-2">Review Your Reservation</h3>
            <p className="text-xs text-[#4B3023]/80 mb-6">
              Please verify your selected table details and provide your contact information.
            </p>

            {/* Selection Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#E9E0D1] mb-6 text-xs font-semibold">
              <div>
                <p className="text-[10px] text-[#4B3023]/60 uppercase">Table</p>
                <p className="text-sm font-bold">{selectedTableObj.name}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#4B3023]/60 uppercase">Date</p>
                <p className="text-sm font-bold">{reservationDate}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#4B3023]/60 uppercase">Time</p>
                <p className="text-sm font-bold">{reservationTime}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#4B3023]/60 uppercase">Guests</p>
                <p className="text-sm font-bold">{guestCount} Guests</p>
              </div>
            </div>

            {/* Guest Details Form */}
            <form onSubmit={handleConfirmBooking} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4B3023] mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eleanor Vance"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D4C5B2] text-xs font-medium outline-none bg-white text-[#30241D]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4B3023] mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D4C5B2] text-xs font-medium outline-none bg-white text-[#30241D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4B3023] mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="eleanor@example.com"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D4C5B2] text-xs font-medium outline-none bg-white text-[#30241D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4B3023] mb-1">Special Requests (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Anniversary celebration, high chair needed..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D4C5B2] text-xs font-medium outline-none bg-white text-[#30241D]"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#E9E0D1]">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-2.5 rounded-xl bg-[#E9E0D1] hover:bg-[#D4C5B2] text-[#30241D] font-bold text-xs cursor-pointer flex items-center gap-1.5"
                >
                  <SvgIcons.ArrowLeft /> Edit Choices
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#B87543] hover:bg-[#9C5E32] text-white font-bold text-xs shadow-lg cursor-pointer"
                >
                  Confirm Reservation →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── STEP 4: RESERVATION CONFIRMATION ── */}
      {currentStep === 4 && (
        <div className="flex-1 max-w-2xl mx-auto w-full p-6 animate-fade-in">
          <div className="bg-[#F5EBDD] text-[#30241D] rounded-3xl p-8 shadow-2xl text-center border border-[#E9E0D1]">
            <div className="w-14 h-14 rounded-full bg-[#285C43] text-white flex items-center justify-center mx-auto mb-4">
              <SvgIcons.Check />
            </div>
            <h3 className="font-serif text-3xl font-bold mb-1 text-[#30241D]">
              Reservation Confirmed!
            </h3>
            <p className="text-xs text-[#4B3023]/80 mb-6">
              We look forward to welcoming you to AJAB Café &amp; Restaurant.
            </p>

            <div className="p-4 rounded-2xl bg-[#E9E0D1] text-left text-xs space-y-2 mb-6">
              <div className="flex justify-between border-b border-[#D4C5B2] pb-2">
                <span className="font-bold">Booking Reference:</span>
                <span className="font-mono font-bold text-[#B87543]">{bookingRef}</span>
              </div>
              <div className="flex justify-between">
                <span>Guest Name:</span>
                <span className="font-bold">{guestName || "Guest"}</span>
              </div>
              <div className="flex justify-between">
                <span>Table Reserved:</span>
                <span className="font-bold">{selectedTableObj.name} ({selectedTableObj.zone})</span>
              </div>
              <div className="flex justify-between">
                <span>Date &amp; Time:</span>
                <span className="font-bold">{reservationDate} at {reservationTime}</span>
              </div>
              <div className="flex justify-between">
                <span>Party Size:</span>
                <span className="font-bold">{guestCount} Guests</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={onBack}
                className="px-6 py-2.5 rounded-xl bg-[#4B3023] text-white font-bold text-xs hover:bg-[#241812] transition-colors cursor-pointer"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 2D FLOOR PLAN MAP MODAL (VIEW MAP TOOLBAR ACTION) ── */}
      {showMapModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#F5EBDD] text-[#30241D] rounded-3xl p-6 max-w-3xl w-full border border-[#E9E0D1] shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif text-2xl font-bold">AJAB 2D Floor Plan Map</h3>
                <p className="text-xs text-[#4B3023]/70">Select any table on our schematic floor map.</p>
              </div>
              <button
                onClick={() => setShowMapModal(false)}
                className="w-8 h-8 rounded-full bg-[#E9E0D1] text-[#30241D] flex items-center justify-center font-bold hover:bg-[#D4C5B2]"
              >
                <SvgIcons.Close />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 my-4 max-h-[360px] overflow-y-auto">
              {tables.map((t) => {
                const isSelected = activeTableId === t.id;
                const isAvailable = t.status === "available";
                return (
                  <button
                    key={t.id}
                    disabled={!isAvailable}
                    onClick={() => {
                      onSelectTable(t.id);
                      setShowMapModal(false);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? "bg-[#285C43] text-white border-emerald-400 font-bold shadow-lg"
                        : isAvailable
                        ? "bg-white text-[#30241D] border-[#D4C5B2] hover:border-[#B87543]"
                        : "bg-[#E9E0D1]/50 text-[#9CA3AF] border-[#D4C5B2]/50 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{t.name}</span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isAvailable ? "bg-[#285C43]" : "bg-red-500"
                        }`}
                      />
                    </div>
                    <p className="text-[11px] opacity-80 mt-1">{t.seats} Seats · {t.zone}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
