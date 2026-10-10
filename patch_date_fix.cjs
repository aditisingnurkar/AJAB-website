const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Fix the initial state
const initialDraftStr = '  const [reservation, setReservation] = useState<ReservationDraft>({\\n    date: "2024-10-14",\\n    time: "7:30 PM",';
const initialDraftStrCRLF = '  const [reservation, setReservation] = useState<ReservationDraft>({\\r\\n    date: "2024-10-14",\\r\\n    time: "7:30 PM",';

const fixedDraftStr = '  const [reservation, setReservation] = useState<ReservationDraft>({\\n    date: "",\\n    time: "",';
const fixedDraftStrCRLF = '  const [reservation, setReservation] = useState<ReservationDraft>({\\r\\n    date: "",\\r\\n    time: "",';

if (content.includes(initialDraftStrCRLF)) {
  content = content.replace(initialDraftStrCRLF, fixedDraftStrCRLF);
} else {
  content = content.replace(initialDraftStr, fixedDraftStr);
}

// 2. Fix the date input appearance
const inputStr = 'className="w-full px-4 py-3.5 rounded-xl border focus:outline-none appearance-none font-bold text-sm transition-colors"\\n                  style={{ backgroundColor: "#17100C", borderColor: "#4B3023", color: "#F5EBDD" }}\\n                />';
const inputStrCRLF = 'className="w-full px-4 py-3.5 rounded-xl border focus:outline-none appearance-none font-bold text-sm transition-colors"\\r\\n                  style={{ backgroundColor: "#17100C", borderColor: "#4B3023", color: "#F5EBDD" }}\\r\\n                />';

const fixedInputStr = 'className="w-full px-4 py-3.5 rounded-xl border focus:outline-none font-bold text-sm transition-colors"\\n                  style={{ backgroundColor: "#17100C", borderColor: "#4B3023", color: "#F5EBDD", colorScheme: "dark" }}\\n                />';
const fixedInputStrCRLF = 'className="w-full px-4 py-3.5 rounded-xl border focus:outline-none font-bold text-sm transition-colors"\\r\\n                  style={{ backgroundColor: "#17100C", borderColor: "#4B3023", color: "#F5EBDD", colorScheme: "dark" }}\\r\\n                />';

if (content.includes(inputStrCRLF)) {
  content = content.replace(inputStrCRLF, fixedInputStrCRLF);
} else {
  content = content.replace(inputStr, fixedInputStr);
}

fs.writeFileSync('src/App.tsx', content);
console.log('Fixed date selection and initial state.');
