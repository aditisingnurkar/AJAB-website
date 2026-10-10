const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

c = c.replace(
  `{[
            ["Standard", "Regular AJAB website", () => setMode("common")],`,
  `{( [
            ["Standard", "Regular AJAB website", () => setMode("common")],`
);

c = c.replace(
  `["Visually Impaired", "High contrast & audio", () => setMode("vi")],
          ].map(([label, sub, action]) => (`,
  `["Visually Impaired", "High contrast & audio", () => setMode("vi")],
          ] as [string, string, () => void][]
          ).map(([label, sub, action]) => (`
);

fs.writeFileSync('src/App.tsx', c);
console.log('Replaced TS error');
