const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const newCDateTimeSelectComponent = `function CDateTimeSelect({
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
    <div className="w-full min-h-[calc(100vh-80px)] flex flex-col font-sans select-none overflow-y-auto" style={{ backgroundColor: "#17100C" }}>
      <div className="max-w-3xl mx-auto w-full py-12 px-6 flex-1 flex flex-col justify-center animate-fade-in">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl font-bold mb-3" style={{ color: "#F5EBDD" }}>Reserve Your Table</h1>
          <p className="text-sm font-medium" style={{ color: "#E9E0D1", opacity: 0.8 }}>Choose your date, time and party size to find the perfect seat.</p>
        </div>

        <div className="rounded-3xl p-8 shadow-2xl border" style={{ backgroundColor: "#281A13", borderColor: "#36251D" }}>
          
          {/* 4-Step Progress Indicator */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10 overflow-x-auto pb-2">
            
            {/* Step 1 */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="w-6 h-6 rounded-full font-bold text-[12px] flex items-center justify-center shadow-md" style={{ backgroundColor: "#B87543", color: "#FFF" }}>1</span>
              <span className="text-xs font-bold" style={{ color: "#F5EBDD" }}>Date &amp; Guests</span>
            </div>
            
            <div className="w-6 h-[1px]" style={{ backgroundColor: "#36251D" }}></div>
            
            {/* Step 2 */}
            <div className="flex items-center gap-2 shrink-0 opacity-60">
              <span className="w-6 h-6 rounded-full font-bold text-[12px] flex items-center justify-center border" style={{ borderColor: "#66493A", color: "#E9E0D1" }}>2</span>
              <span className="text-xs font-medium" style={{ color: "#E9E0D1" }}>Select Table</span>
            </div>

            <div className="w-6 h-[1px]" style={{ backgroundColor: "#36251D" }}></div>

            {/* Step 3 */}
            <div className="flex items-center gap-2 shrink-0 opacity-60 hidden sm:flex">
              <span className="w-6 h-6 rounded-full font-bold text-[12px] flex items-center justify-center border" style={{ borderColor: "#66493A", color: "#E9E0D1" }}>3</span>
              <span className="text-xs font-medium" style={{ color: "#E9E0D1" }}>Review</span>
            </div>

            <div className="w-6 h-[1px] hidden sm:block" style={{ backgroundColor: "#36251D" }}></div>

            {/* Step 4 */}
            <div className="flex items-center gap-2 shrink-0 opacity-60 hidden sm:flex">
              <span className="w-6 h-6 rounded-full font-bold text-[12px] flex items-center justify-center border" style={{ borderColor: "#66493A", color: "#E9E0D1" }}>4</span>
              <span className="text-xs font-medium" style={{ color: "#E9E0D1" }}>Confirm</span>
            </div>
            
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl text-sm font-bold border text-center" style={{ backgroundColor: "#2E1414", color: "#F87171", borderColor: "#592222" }}>
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider" style={{ color: "#E9E0D1", opacity: 0.8 }}>Date</label>
              <div className="relative">
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={draft.date}
                  onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl border focus:outline-none appearance-none font-bold text-sm transition-colors"
                  style={{ backgroundColor: "#17100C", borderColor: "#4B3023", color: "#F5EBDD" }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider" style={{ color: "#E9E0D1", opacity: 0.8 }}>Time</label>
              <div className="relative">
                <select
                  value={draft.time}
                  onChange={(e) => setDraft({ ...draft, time: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl border focus:outline-none appearance-none font-bold text-sm transition-colors"
                  style={{ backgroundColor: "#17100C", borderColor: "#4B3023", color: "#F5EBDD" }}
                >
                  <option value="" disabled style={{ color: "#E9E0D1", opacity: 0.5 }}>Select Time</option>
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
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#E9E0D1", opacity: 0.5 }}>
                  <Icons.ChevronDown size={18} />
                </div>
              </div>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider" style={{ color: "#E9E0D1", opacity: 0.8 }}>Guests</label>
              <div className="relative">
                <select
                  value={draft.guests}
                  onChange={(e) => setDraft({ ...draft, guests: Number(e.target.value) })}
                  className="w-full px-4 py-3.5 rounded-xl border focus:outline-none appearance-none font-bold text-sm transition-colors"
                  style={{ backgroundColor: "#17100C", borderColor: "#4B3023", color: "#F5EBDD" }}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#E9E0D1", opacity: 0.5 }}>
                  <Icons.ChevronDown size={18} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-between gap-4 pt-4 border-t" style={{ borderColor: "#36251D" }}>
            <button
              onClick={() => navigate("home")}
              className="px-6 py-3.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 border"
              style={{ backgroundColor: "#17100C", color: "#E9E0D1", borderColor: "#4B3023" }}
            >
              <Icons.ChevronDown size={16} className="rotate-90" />
              Back
            </button>
            <button
              onClick={handleContinue}
              className="px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-xl flex items-center justify-center sm:flex-1"
              style={{ backgroundColor: "#B87543", color: "#FFF" }}
            >
              Continue to Choose a Table
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}`;

// Extract the old component using regex or string manipulation
// since it starts with `function CDateTimeSelect({` and ends with `  );\\r?\\n}` before `function CSeats({`
const startIdx = content.indexOf('function CDateTimeSelect({');
const endIdx = content.indexOf('function CSeats({');

if (startIdx !== -1 && endIdx !== -1) {
  // Find the exact end of the CDateTimeSelect function (the last brace before CSeats)
  let componentEnd = content.lastIndexOf('}', endIdx - 1) + 1;
  
  content = content.substring(0, startIdx) + newCDateTimeSelectComponent + '\\n\\n' + content.substring(endIdx);
  fs.writeFileSync('src/App.tsx', content);
  console.log('Update complete.');
} else {
  console.log('Could not find CDateTimeSelect or CSeats.');
}
