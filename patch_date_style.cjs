const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace the specific date input className to remove appearance-none
content = content.replace(
  /className="w-full px-4 py-3\.5 rounded-xl border focus:outline-none appearance-none font-bold text-sm transition-colors"/,
  'className="w-full px-4 py-3.5 rounded-xl border focus:outline-none font-bold text-sm transition-colors"'
);

// Add colorScheme to the date input style
content = content.replace(
  /style=\{\{ backgroundColor: "#17100C", borderColor: "#4B3023", color: "#F5EBDD" \}\}/,
  'style={{ backgroundColor: "#17100C", borderColor: "#4B3023", color: "#F5EBDD", colorScheme: "dark" }}'
);

fs.writeFileSync('src/App.tsx', content);
console.log('Fixed date input styles via regex.');
