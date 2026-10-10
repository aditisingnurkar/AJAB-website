const fs = require('fs');
let content = fs.readFileSync('src/components/CSeats2D.tsx', 'utf8');

content = content.replace(/\\`/g, '`');
content = content.replace(/\\\$/g, '$');

fs.writeFileSync('src/components/CSeats2D.tsx', content);
console.log('Fixed escaping in CSeats2D.tsx');
