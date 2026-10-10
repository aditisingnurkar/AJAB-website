const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `        {screen === "accessibility" && <CAccessibility setMode={setMode} />}
      </main>`;
const replacementStr = `        {screen === "accessibility" && <CAccessibility setMode={setMode} />}
        {selectedFood && ReactDOM.createPortal(<CProductModal item={selectedFood} onClose={() => setSelectedFood(null)} addToCart={addToCart} />, document.body)}
      </main>`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replacementStr);
  fs.writeFileSync('src/App.tsx', content);
  console.log('Successfully added CProductModal to CommonApp');
} else {
  console.log('Could not find target string. Here is where the main closing is:');
  const start = content.indexOf('function CommonApp');
  const end = content.indexOf('</main>', start);
  console.log(content.substring(end - 150, end + 20));
}
