const fs = require('fs');
let content = fs.readFileSync('src/data/tableData.ts', 'utf8');

// The required coords
const coords = {
  T1: {x: 14, y: 76},
  T2: {x: 31, y: 60},
  B2: {x: 35, y: 68},
  B1: {x: 43, y: 52},
  T3: {x: 51, y: 50},
  T4: {x: 58, y: 62},
  T5: {x: 84, y: 75}
};

for (const id of Object.keys(coords)) {
  const c = coords[id];
  // Regex to find the x and y for this specific table id block
  // We look for id: "T1", ... x: 14, y: 72,
  const regex = new RegExp(`(id:\\s*"${id}"[\\s\\S]*?x:\\s*)\\d+(,[\\s\\S]*?y:\\s*)\\d+(,)`);
  content = content.replace(regex, `$1${c.x}$2${c.y}$3`);
}

fs.writeFileSync('src/data/tableData.ts', content);
console.log('Updated tableData coordinates.');
