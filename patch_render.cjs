const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = '{screen === "seats" && (\\n            <CSeats';
const targetStrCRLF = '{screen === "seats" && (\\r\\n            <CSeats';

const replaceStr = '{screen === "datetime-select" && (\\n            <CDateTimeSelect\\n              draft={reservation}\\n              setDraft={setReservation}\\n              navigate={navigate}\\n            />\\n          )}\\n          {screen === "seats" && (\\n            <CSeats';
const replaceStrCRLF = '{screen === "datetime-select" && (\\r\\n            <CDateTimeSelect\\r\\n              draft={reservation}\\r\\n              setDraft={setReservation}\\r\\n              navigate={navigate}\\r\\n            />\\r\\n          )}\\r\\n          {screen === "seats" && (\\r\\n            <CSeats';

if (content.includes(replaceStr) || content.includes(replaceStrCRLF)) {
  console.log("Already rendered!");
} else if (content.includes(targetStrCRLF)) {
  content = content.replace(targetStrCRLF, replaceStrCRLF);
  fs.writeFileSync('src/App.tsx', content);
  console.log("Updated with CRLF");
} else if (content.includes(targetStr)) {
  content = content.replace(targetStr, replaceStr);
  fs.writeFileSync('src/App.tsx', content);
  console.log("Updated with LF");
} else {
  // Try finding it manually
  const idx = content.indexOf('{screen === "seats" && (');
  if (idx !== -1) {
    console.log("Found without newline match");
    const before = content.substring(0, idx);
    const after = content.substring(idx);
    const renderBlock = `{screen === "datetime-select" && (\\n            <CDateTimeSelect\\n              draft={reservation}\\n              setDraft={setReservation}\\n              navigate={navigate}\\n            />\\n          )}\\n          `;
    content = before + renderBlock.replace(/\\n/g, '\\r\\n') + after;
    fs.writeFileSync('src/App.tsx', content);
    console.log("Updated via indexOf");
  } else {
    console.log("Target not found at all!");
  }
}
