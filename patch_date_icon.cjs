const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const dateInputRegex = /<input\s+type="date"[^>]*className="([^"]*)"[^>]*style=\{\{([^}]*)\}\}[^>]*\/>/s;
const match = content.match(dateInputRegex);

if (match) {
  const originalInput = match[0];
  const newMarkup = `
              <div className="relative">
                <style>{\`
                  .custom-date-input::-webkit-calendar-picker-indicator {
                    background: transparent;
                    bottom: 0;
                    color: transparent;
                    cursor: pointer;
                    height: auto;
                    left: 0;
                    position: absolute;
                    right: 0;
                    top: 0;
                    width: auto;
                  }
                \`}</style>
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={draft.date}
                  onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl border focus:outline-none font-bold text-sm transition-colors custom-date-input appearance-none"
                  style={{ backgroundColor: "#17100C", borderColor: "#4B3023", color: "#F5EBDD" }}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#E9E0D1", opacity: 0.5 }}>
                  <Icons.Calendar size={18} />
                </div>
`;

  // We need to replace the entire <div className="relative">...</div> around the input
  // Let's do a larger regex replace.
  const blockRegex = /<div className="relative">\s*<input\s+type="date"[\s\S]*?\/>\s*<\/div>/;
  if (blockRegex.test(content)) {
    content = content.replace(blockRegex, newMarkup.trim() + '\\n              </div>');
    fs.writeFileSync('src/App.tsx', content);
    console.log('Successfully injected custom calendar icon and style.');
  } else {
    console.log('Failed to match block regex.');
  }
} else {
  console.log('Failed to match date input regex.');
}
