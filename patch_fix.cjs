const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Fix 1: Map icon style prop
content = content.replace(
  '<Icons.Map size={20} className="shrink-0 mt-1" style={{ color: C.accent }} />',
  '<span style={{ color: C.accent }} className="shrink-0 mt-1"><Icons.Map size={20} /></span>'
);

// Fix 2 & 3: C.background -> C.bg in the specific lines that failed
content = content.replace(
  'style={{ backgroundColor: C.background, border: `1.5px solid ${C.border}` }}',
  'style={{ backgroundColor: C.bg, border: `1.5px solid ${C.border}` }}'
);

content = content.replace(
  'style={{ backgroundColor: C.accent, color: C.background }}',
  'style={{ backgroundColor: C.accent, color: C.bg }}'
);

fs.writeFileSync('src/App.tsx', content);
console.log('Fixed TS errors');
