const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// We will inject a CProgress component
const cProgressCode = `
function CProgress({ step }: { step: number }) {
  const steps = [
    { num: 1, label: "Date & Guests" },
    { num: 2, label: "Select Table" },
    { num: 3, label: "Review" },
    { num: 4, label: "Confirm" }
  ];

  return (
    <div className="hidden md:flex items-center gap-6 text-sm font-bold uppercase tracking-wider ml-auto">
      {steps.map((s, idx) => {
        const isCompletedOrActive = s.num <= step;
        const isLast = idx === steps.length - 1;
        
        return (
          <React.Fragment key={s.num}>
            <div className={\`flex items-center gap-2 \${isCompletedOrActive ? '' : 'opacity-50'}\`}>
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center" 
                style={{ 
                  backgroundColor: isCompletedOrActive ? '#FFFFFF' : '#1A100C', 
                  color: isCompletedOrActive ? '#120B08' : '#FFFFFF',
                  border: isCompletedOrActive ? 'none' : '1px solid #332018'
                }}
              >
                {s.num}
              </div>
              <span style={{ color: isCompletedOrActive ? '#FFFFFF' : 'inherit' }}>
                {s.label}
              </span>
            </div>
            {!isLast && (
              <div 
                className="w-8 h-[1px]" 
                style={{ backgroundColor: s.num < step ? '#FFFFFF' : '#332018' }}
              ></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
`;

// Inject before CDateTimeSelect
content = content.replace('function CDateTimeSelect', cProgressCode + '\nfunction CDateTimeSelect');

// Replace progress indicator in CDateTimeSelect
content = content.replace(
  /<div className="hidden md:flex items-center gap-6 text-sm font-bold uppercase tracking-wider">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/,
  '<CProgress step={1} />\n        </div>\n      </div>'
);

// Replace progress indicator in CSeats2D
content = content.replace(
  /<div className="flex items-center gap-2 md:gap-4 text-xs font-bold tracking-wider uppercase ml-14 md:ml-0">[\s\S]*?<\/div>\s*<\/div>\s*\{\/\* Main Content Area \*\/\}/,
  '<CProgress step={2} />\n      </div>\n\n      {/* Main Content Area */}'
);

// Add progress indicator to CReservation header
// CReservation currently has:
/*
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 animate-fade-in">
      <button onClick={() => navigate("seats")} className="text-sm font-semibold mb-6 cursor-pointer" style={{ color: C.muted }}>
        ← Change Table Selection
      </button>

      <h1 className="font-serif text-3xl font-bold mb-2" style={{ color: C.accent }}>Confirm Reservation Details</h1>
*/
// We'll wrap CReservation in a similar layout so it looks consistent!

fs.writeFileSync('src/App.tsx', content);
console.log('Injected CProgress and updated CDateTimeSelect and CSeats2D');
