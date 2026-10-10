const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace('date: "2024-10-14",', 'date: "",');
content = content.replace('time: "7:30 PM",', 'time: "",');

fs.writeFileSync('src/App.tsx', content);
console.log('Fixed reservation initial state.');
