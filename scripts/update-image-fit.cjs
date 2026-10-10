const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

c = c.replace(/className="w-full h-full object-cover",/g, 'className="w-full h-full object-contain",');
c = c.replace(/className="w-full h-full object-cover transition-transform/g, 'className="w-full h-full object-contain transition-transform');
c = c.replace(/className="w-14 h-14 rounded-xl object-cover shrink-0"/g, 'className="w-14 h-14 rounded-xl object-contain shrink-0"');
c = c.replace(/className="w-full h-80 object-cover"/g, 'className="w-full h-80 object-contain"');
c = c.replace(/className="w-14 h-14 rounded-xl object-cover"/g, 'className="w-14 h-14 rounded-xl object-contain"');
c = c.replace(/className="w-full h-48 object-cover"/g, 'className="w-full h-48 object-contain"');
c = c.replace(/className="w-24 h-24 rounded-2xl object-cover shrink-0"/g, 'className="w-24 h-24 rounded-2xl object-contain shrink-0"');
c = c.replace(/className="w-full h-64 rounded-2xl object-cover"/g, 'className="w-full h-64 rounded-2xl object-contain"');
c = c.replace(/className="w-16 h-16 rounded-xl object-cover shrink-0"/g, 'className="w-16 h-16 rounded-xl object-contain shrink-0"');

fs.writeFileSync('src/App.tsx', c);
console.log('Replaced object-cover with object-contain for food images.');
