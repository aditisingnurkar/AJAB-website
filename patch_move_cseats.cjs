const fs = require('fs');

let cseatsCode = fs.readFileSync('src/components/CSeats2D.tsx', 'utf8');
// Remove imports at the top
cseatsCode = cseatsCode.replace(/import .*?;\n/g, '');
// Remove interface ReservationDraft since it exists
cseatsCode = cseatsCode.replace(/interface ReservationDraft \{[^}]+\}\n/g, '');
// Remove const C = ... since it exists
cseatsCode = cseatsCode.replace(/const C = \{[^}]+\};\n/g, '');
// Remove 'export ' from function
cseatsCode = cseatsCode.replace('export function CSeats2D', 'function CSeats2D');

let appCode = fs.readFileSync('src/App.tsx', 'utf8');
// Remove the import I added earlier
appCode = appCode.replace('import { CSeats2D } from "./components/CSeats2D";', '');

// Append to App.tsx
appCode += '\n\n' + cseatsCode;

fs.writeFileSync('src/App.tsx', appCode);
console.log('Appended CSeats2D to App.tsx');

// delete CSeats2D.tsx
fs.unlinkSync('src/components/CSeats2D.tsx');
