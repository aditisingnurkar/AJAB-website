const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Change CHome signature
c = c.replace(
  'function CHome({ navigate, addToCart }: { navigate: (s: Screen) => void; addToCart: (f: FoodItem) => void }) {',
  'function CHome({ navigate, addToCart, onOpenModal }: { navigate: (s: Screen) => void; addToCart: (f: FoodItem) => void; onOpenModal: (f: FoodItem) => void }) {'
);

// 2. Change setProductModalItem in CHome to onOpenModal
c = c.replace(
  'onClick={(e) => { e.stopPropagation(); setProductModalItem(item); }}',
  'onClick={(e) => { e.stopPropagation(); onOpenModal(item); }}'
);

// 3. Update CHome usage in App to pass onOpenModal
c = c.replace(
  '<CHome navigate={navigate} addToCart={addToCart} />',
  '<CHome navigate={navigate} addToCart={addToCart} onOpenModal={setProductModalItem} />'
);

// 4. Update the actual menu mapping in App
c = c.replace(
  'onClick={() => { setFood(item); navigate("food-details"); }}',
  'onClick={(e) => { e.stopPropagation(); setProductModalItem(item); }}'
);

fs.writeFileSync('src/App.tsx', c);
console.log('Fixed CHome and Menu navigation');
