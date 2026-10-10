const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

c = c.replace(
  '{screen === "food-details" && <CFoodDetails food={selectedFood} navigate={navigate} addToCart={addToCart} />}',
  ''
);

c = c.replace(
  'style={{ background: "linear-gradient(135deg, #B87342 0%, #9C5E32 100%)", color: "#FFFDF8" }}',
  'style={{ backgroundColor: "#B87342", color: "#FFFDF8" }}'
);

c = c.replace(
  'const [ingredientOverlayItem, setIngredientOverlayItem] = useState<FoodItem | null>(null);',
  'const [ingredientOverlayItem, setIngredientOverlayItem] = useState<FoodItem | null>(null);\n  const [productModalItem, setProductModalItem] = useState<FoodItem | null>(null);'
);

fs.writeFileSync('src/App.tsx', c);
console.log('Fixed TS errors');
