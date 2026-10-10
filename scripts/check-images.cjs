const fs = require('fs');
const path = require('path');

const guidePath = path.join(__dirname, '../MENU_IMAGE_GUIDE.md');
const publicDir = path.join(__dirname, '../public');

if (!fs.existsSync(guidePath)) {
  console.error("MENU_IMAGE_GUIDE.md not found.");
  process.exit(1);
}

const guideContent = fs.readFileSync(guidePath, 'utf8');
const blocks = guideContent.split(/(\d+\.\s+\*\*.*?\*\*)/).slice(1);

let missingCount = 0;
let foundCount = 0;

console.log("\n=============================================");
console.log("   AJAB IMAGE VALIDATION REPORT   ");
console.log("=============================================\n");

for (let i = 0; i < blocks.length; i += 2) {
  const titleLine = blocks[i];
  const content = blocks[i+1];
  
  const nameMatch = titleLine.match(/\d+\.\s+\*\*(.*?)\*\*/);
  const pathMatch = content.match(/\*\*Expected Path:\*\*\s+`([^`]+)`/);
  
  if (nameMatch && pathMatch) {
    const name = nameMatch[1];
    const expectedPath = pathMatch[1];
    const fullPath = path.join(publicDir, expectedPath);
    
    if (fs.existsSync(fullPath)) {
      console.log(`[FOUND]   ${name}`);
      console.log(`          -> ${expectedPath}`);
      foundCount++;
    } else {
      console.log(`[MISSING] ${name}`);
      console.log(`          -> Expected: ${expectedPath}`);
      missingCount++;
    }
  }
}

console.log("---------------------------------------------");
console.log(`\nSUMMARY: ${foundCount} Images Found, ${missingCount} Images Missing.`);
if (missingCount > 0) {
  console.log("Please check MENU_IMAGE_GUIDE.md for upload instructions.");
} else {
  console.log("All images are uploaded and verified!");
}
console.log("\n");
