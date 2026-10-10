const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add Close and Map to Icons
const iconsReplacement = `  Map: ({ size = 16, className = "" }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
  ),
  Close: ({ size = 16, className = "" }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  ),
  ChevronDown`;

content = content.replace('  ChevronDown', iconsReplacement);

// Fix style props on icons in CSeats2D
content = content.replace(
  '<Icons.Calendar size={16} style={{ color: C.accent }} />',
  '<Icons.Calendar size={16} className="text-[#D49566]" />'
);
content = content.replace(
  '<Icons.Clock size={16} style={{ color: C.accent }} />',
  '<Icons.Clock size={16} className="text-[#D49566]" />'
);
content = content.replace(
  '<Icons.Users size={16} style={{ color: C.accent }} />',
  '<Icons.Users size={16} className="text-[#D49566]" />'
);

fs.writeFileSync('src/App.tsx', content);
console.log('Fixed icon errors in App.tsx');
