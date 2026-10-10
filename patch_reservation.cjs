const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const newCReservation = `function CReservation({ table, draft, setDraft, navigate }: { table: string | null; draft: ReservationDraft; setDraft: React.Dispatch<React.SetStateAction<ReservationDraft>>; navigate: (s: Screen) => void }) {
  const tableObj = tables.find((t) => t.id === table);

  return (
    <div className="w-full min-h-[calc(100vh-85px)] animate-fade-in flex flex-col" style={{ backgroundColor: C.bg, color: C.muted }}>
      
      {/* Heading Bar */}
      <div className="px-4 md:px-8 py-6 border-b flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ borderColor: C.border }}>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("seats")}
              className="w-10 h-10 flex items-center justify-center rounded-full transition-colors cursor-pointer"
              style={{ backgroundColor: C.card, border: \`1px solid \${C.border}\` }}
            >
              <Icons.ChevronDown size={18} className="rotate-90" />
            </button>
            <h1 className="font-serif text-3xl font-bold" style={{ color: C.accent }}>Review Your Reservation</h1>
          </div>
          <p className="text-sm ml-14 opacity-80">Verify your details and confirm your table.</p>
        </div>
        <CProgress step={3} />
      </div>

      <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-12">
        <CCard className="flex flex-col gap-6 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-dashed" style={{ borderColor: C.border }}>
            <div>
              <h2 className="font-serif text-2xl font-bold mb-1" style={{ color: C.accent }}>Table Details</h2>
              <p className="text-sm">Please verify your selected table details.</p>
            </div>
            <button onClick={() => navigate("seats")} className="text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg" style={{ backgroundColor: C.card, border: \`1px solid \${C.border}\` }}>
              Change Table
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl" style={{ backgroundColor: C.card }}>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-1">Table</div>
              <div className="font-semibold text-sm">{tableObj?.name || "T1"}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-1">Date</div>
              <div className="font-semibold text-sm">{draft.date}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-1">Time</div>
              <div className="font-semibold text-sm">{draft.time}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-1">Guests</div>
              <div className="font-semibold text-sm">{draft.guests} Guests</div>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-2">
            <h3 className="font-serif text-xl font-bold" style={{ color: C.accent }}>Contact Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-80">Your Full Name</label>
                <input
                  value={draft.customerName}
                  onChange={(e) => setDraft({ ...draft, customerName: e.target.value })}
                  placeholder="e.g. Aditi Sharma"
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:border-[#D49566]"
                  style={{ backgroundColor: C.bg, border: \`1px solid \${C.border}\`, color: C.muted }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-80">Phone Number</label>
                <input
                  value={draft.customerPhone}
                  onChange={(e) => setDraft({ ...draft, customerPhone: e.target.value })}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:border-[#D49566]"
                  style={{ backgroundColor: C.bg, border: \`1px solid \${C.border}\`, color: C.muted }}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-80">Special Requests (Optional)</label>
              <textarea
                value={draft.specialNotes}
                onChange={(e) => setDraft({ ...draft, specialNotes: e.target.value })}
                placeholder="Anniversary celebration, high chair needed..."
                rows={3}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:border-[#D49566] resize-none"
                style={{ backgroundColor: C.bg, border: \`1px solid \${C.border}\`, color: C.muted }}
              />
            </div>
          </div>

          <div className="mt-4 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: C.border }}>
            <button 
              onClick={() => navigate("seats")}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm transition-colors cursor-pointer"
              style={{ backgroundColor: C.card, color: C.muted, border: \`1px solid \${C.border}\` }}
            >
              Back
            </button>
            <button 
              onClick={() => navigate("reservation-confirm")}
              className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-sm transition-colors cursor-pointer"
              style={{ backgroundColor: C.accent, color: C.bg }}
            >
              Confirm Reservation &rarr;
            </button>
          </div>
        </CCard>
      </div>
    </div>
  );
}`;

content = content.replace(/function CReservation\(\{[\s\S]*?<\/div>\s*\);\s*\}/, newCReservation);

fs.writeFileSync('src/App.tsx', content);
console.log('Updated CReservation with header and progress indicator');
