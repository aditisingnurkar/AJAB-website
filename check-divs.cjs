const fs = require('fs');
const content = fs.readFileSync('src/components/VirtualCafe3D.tsx', 'utf8');

let tags = [];
let lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  let openMatches = line.match(/<div[^>]*>/g);
  let closeMatches = line.match(/<\/div>/g);
  let selfClosingMatches = line.match(/<div[^>]*\/>/g);
  
  let opens = (openMatches ? openMatches.length : 0) - (selfClosingMatches ? selfClosingMatches.length : 0);
  let closes = closeMatches ? closeMatches.length : 0;
  
  if (opens > 0) {
    for (let j = 0; j < opens; j++) tags.push({ line: i + 1, type: 'open' });
  }
  if (closes > 0) {
    for (let j = 0; j < closes; j++) {
      if (tags.length > 0) {
        tags.pop();
      } else {
        console.log('Extra closing div at line', i + 1);
      }
    }
  }
}

if (tags.length > 0) {
  console.log('Unclosed divs:');
  tags.forEach(t => console.log('Line', t.line));
} else {
  console.log('All divs balanced.');
}
