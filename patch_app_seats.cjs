const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add import for CSeats2D
if (!content.includes('CSeats2D')) {
  content = content.replace(
    'import { VirtualCafe3D } from "./components/VirtualCafe3D";',
    'import { VirtualCafe3D } from "./components/VirtualCafe3D";\\nimport { CSeats2D } from "./components/CSeats2D";'
  );
}

// 2. Replace the CSeats rendering block in CommonApp
const oldRender = '{screen === "seats" && (\\n          <CSeats';
const oldRenderCRLF = '{screen === "seats" && (\\r\\n          <CSeats';
const newRender = '{screen === "seats" && (\\n          <CSeats2D';

if (content.includes(oldRenderCRLF)) {
  content = content.replace(oldRenderCRLF, newRender.replace(/\\n/g, '\\r\\n'));
} else {
  content = content.replace(oldRender, newRender);
}

fs.writeFileSync('src/App.tsx', content);
console.log('Patched App.tsx to use CSeats2D');
