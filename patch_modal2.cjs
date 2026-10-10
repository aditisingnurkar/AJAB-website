const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const start = content.indexOf('function CommonApp(');
const end = content.indexOf('</main>', start);
if (end !== -1) {
  const before = content.substring(0, end);
  const replacement = '{selectedFood && ReactDOM.createPortal(<CProductModal item={selectedFood} onClose={() => setSelectedFood(null)} addToCart={addToCart} />, document.body)}\n      </main>';
  const after = content.substring(end + 7);
  content = before + replacement + after;
  fs.writeFileSync('src/App.tsx', content);
  console.log('Successfully added CProductModal to CommonApp');
}
