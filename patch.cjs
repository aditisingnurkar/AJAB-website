const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Update Screen type
content = content.replace(
  '| "order-confirm" | "seats" | "reservation" | "reservation-confirm"',
  '| "order-confirm" | "datetime-select" | "seats" | "reservation" | "reservation-confirm"'
);

// 2. Update navigation link in CommonApp
content = content.replace(
  '{ label: "Reserve", screen: "seats" },',
  '{ label: "Reserve", screen: "datetime-select" },'
);

// 3. Update CBtn in CommonApp
content = content.replace(
  '<CBtn label="Open Table Reservation Floor Plan" onClick={() => navigate("seats")} size="lg" />',
  '<CBtn label="Reserve a Table" onClick={() => navigate("datetime-select")} size="lg" />'
);

// 4. Render CDateTimeSelect in CommonApp
const renderOriginal = '{screen === "seats" && (\\n            <CSeats';
const renderOriginalCRLF = '{screen === "seats" && (\\r\\n            <CSeats';

const renderNew = '{screen === "datetime-select" && (\\n            <CDateTimeSelect\\n              draft={reservation}\\n              setDraft={setReservation}\\n              navigate={navigate}\\n            />\\n          )}\\n          {screen === "seats" && (\\n            <CSeats';
const renderNewCRLF = '{screen === "datetime-select" && (\\r\\n            <CDateTimeSelect\\r\\n              draft={reservation}\\r\\n              setDraft={setReservation}\\r\\n              navigate={navigate}\\r\\n            />\\r\\n          )}\\r\\n          {screen === "seats" && (\\r\\n            <CSeats';

if (content.includes(renderOriginalCRLF)) {
  content = content.replace(renderOriginalCRLF, renderNewCRLF);
} else {
  content = content.replace(renderOriginal, renderNew);
}

// 5. Add CDateTimeSelect component before CSeats
const cDateTimeSelectComponent = `
function CDateTimeSelect({
  draft,
  setDraft,
  navigate,
}: {
  draft: ReservationDraft;
  setDraft: React.Dispatch<React.SetStateAction<ReservationDraft>>;
  navigate: (s: Screen) => void;
}) {
  const [error, setError] = React.useState("");

  const handleContinue = () => {
    if (!draft.date) {
      setError("Please select a date.");
      return;
    }
    const today = new Date().toISOString().split("T")[0];
    if (draft.date < today) {
      setError("Please select a valid future date.");
      return;
    }
    if (!draft.time) {
      setError("Please select a time.");
      return;
    }
    if (!draft.guests || draft.guests < 1 || draft.guests > 20) {
      setError("Please select a valid number of guests (1-20).");
      return;
    }
    setError("");
    navigate("seats");
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 animate-fade-in min-h-[70vh] flex flex-col justify-center">
      <div className="text-center mb-10">
        <h1 className="font-serif text-4xl font-bold mb-3" style={{ color: C.accent }}>Reserve Your Table</h1>
        <p className="text-lg" style={{ color: C.muted }}>Choose when you'd like to visit us.</p>
      </div>

      <CCard className="space-y-6">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: C.accent, color: "#FFFDF8" }}>1</div>
            <span className="text-sm font-bold" style={{ color: C.accent }}>Date & Time</span>
          </div>
          <div className="w-12 h-0.5" style={{ backgroundColor: C.border }}></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: C.card, color: C.muted, border: \`1px solid \${C.border}\` }}>2</div>
            <span className="text-sm font-semibold" style={{ color: C.muted }}>Table Selection</span>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl text-sm font-bold border" style={{ backgroundColor: "#2B1416", color: "#F87171", borderColor: "#4E2125" }}>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold" style={{ color: C.text }}>Date</label>
            <div className="relative">
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={draft.date}
                onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border focus:outline-none appearance-none"
                style={{ backgroundColor: C.cream, borderColor: C.border, color: C.text }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold" style={{ color: C.text }}>Time</label>
            <div className="relative">
              <select
                value={draft.time}
                onChange={(e) => setDraft({ ...draft, time: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border focus:outline-none appearance-none"
                style={{ backgroundColor: C.cream, borderColor: C.border, color: C.text }}
              >
                <option value="">Select Time</option>
                <option value="6:00 PM">6:00 PM</option>
                <option value="6:30 PM">6:30 PM</option>
                <option value="7:00 PM">7:00 PM</option>
                <option value="7:30 PM">7:30 PM</option>
                <option value="8:00 PM">8:00 PM</option>
                <option value="8:30 PM">8:30 PM</option>
                <option value="9:00 PM">9:00 PM</option>
                <option value="9:30 PM">9:30 PM</option>
                <option value="10:00 PM">10:00 PM</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: C.muted }}>
                <Icons.ChevronDown size={16} />
              </div>
            </div>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="block text-sm font-bold" style={{ color: C.text }}>Guests</label>
            <div className="relative">
              <select
                value={draft.guests}
                onChange={(e) => setDraft({ ...draft, guests: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl border focus:outline-none appearance-none"
                style={{ backgroundColor: C.cream, borderColor: C.border, color: C.text }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: C.muted }}>
                <Icons.ChevronDown size={16} />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 flex flex-col-reverse sm:flex-row justify-between gap-4">
          <CBtn label="Back" variant="secondary" onClick={() => navigate("home")} size="lg" />
          <CBtn label="Continue to Table Selection" variant="primary" onClick={handleContinue} full size="lg" />
        </div>
      </CCard>
    </div>
  );
}

`;

if (!content.includes('function CDateTimeSelect')) {
  // Use regex to find function CSeats and insert before it
  const match = content.match(/function CSeats\(\{/);
  if (match) {
    const index = match.index;
    content = content.substring(0, index) + cDateTimeSelectComponent.replace(/\\n/g, '\\r\\n') + content.substring(index);
    fs.writeFileSync('src/App.tsx', content);
    console.log('Update complete.');
  } else {
    console.log('Could not find CSeats.');
  }
} else {
  console.log('CDateTimeSelect already exists.');
}
