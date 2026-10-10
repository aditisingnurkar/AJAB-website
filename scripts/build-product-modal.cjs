const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add productModalItem state
if (!c.includes('productModalItem')) {
  c = c.replace(
    'const [ingredientOverlayItem, setIngredientOverlayItem] = useState<FoodItem | null>(null);',
    'const [ingredientOverlayItem, setIngredientOverlayItem] = useState<FoodItem | null>(null);\n  const [productModalItem, setProductModalItem] = useState<FoodItem | null>(null);'
  );
}

// 2. Modify addToCart to accept quantity
c = c.replace(
  `const addToCart = (f: FoodItem) => {
    setCart((prev) => {
      const exist = prev.find((c) => c.id === f.id);
      return exist ? prev.map((c) => (c.id === f.id ? { ...c, qty: c.qty + 1 } : c)) : [...prev, { id: f.id, name: f.name, price: f.price, qty: 1, img: f.img }];
    });
  };`,
  `const addToCart = (f: FoodItem, quantity: number = 1) => {
    setCart((prev) => {
      const exist = prev.find((c) => c.id === f.id);
      return exist ? prev.map((c) => (c.id === f.id ? { ...c, qty: c.qty + quantity } : c)) : [...prev, { id: f.id, name: f.name, price: f.price, qty: quantity, img: f.img }];
    });
  };`
);

// 3. Change click handler on Details button to use the new modal
c = c.replace(
  `onClick={() => { setFood(item); navigate("food-details"); }}`,
  `onClick={(e) => { e.stopPropagation(); setProductModalItem(item); }}`
);

// 4. Find the location of CFoodDetails definition and replace it
const startStr = 'function CFoodDetails(';
const startIdx = c.indexOf(startStr);
const endIdx = c.indexOf('function CCart({');

if (startIdx !== -1 && endIdx !== -1) {
  const newModalDef = `function CProductModal({ item, onClose, addToCart }: { item: FoodItem, onClose: () => void, addToCart: (f: FoodItem, q: number) => void }) {
  const [activeTab, setActiveTab] = useState<"overview" | "nutrition" | "ingredients" | "allergens">("overview");
  const [qty, setQty] = useState(1);

  // Close on Escape key
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl flex flex-col relative shadow-2xl"
        style={{ backgroundColor: "#261D15", border: \`1px solid \${C.border}\` }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg cursor-pointer z-10 bg-black/50 text-white hover:bg-black/80 transition-colors"
          aria-label="Close modal"
        >
          ×
        </button>

        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row gap-6 p-6 border-b" style={{ borderColor: C.border }}>
          <div className="w-full sm:w-1/2 shrink-0 h-48 sm:h-auto rounded-xl overflow-hidden relative">
            <FoodImage src={item.img} alt={item.imgAlt} name={item.name} className="w-full h-full object-cover absolute inset-0" />
          </div>
          
          <div className="flex flex-col justify-between flex-1">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CTag label={item.category} />
                <CTag label={item.cuisine} />
              </div>
              <h2 className="font-serif text-3xl font-bold leading-tight" style={{ color: "#FFFDF8" }}>{item.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-2xl font-bold" style={{ color: "#D49566" }}>₹{item.price}</p>
                <FoodTypeBadge type={item.foodType} />
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center rounded-xl overflow-hidden" style={{ backgroundColor: "#1A130E", border: \`1px solid \${C.border}\` }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-2 font-bold cursor-pointer transition-colors hover:bg-white/5" style={{ color: "#D49566" }}>-</button>
                <span className="px-2 font-bold w-8 text-center" style={{ color: "#FFFDF8" }}>{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="px-4 py-2 font-bold cursor-pointer transition-colors hover:bg-white/5" style={{ color: "#D49566" }}>+</button>
              </div>
              <CBtn 
                label={\`Add \${qty} to Cart\`}
                onClick={() => { addToCart(item, qty); onClose(); }} 
                full 
                style={{ background: "linear-gradient(135deg, #B87342 0%, #9C5E32 100%)", color: "#FFFDF8" }}
              />
            </div>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex border-b overflow-x-auto hide-scrollbar" style={{ borderColor: C.border }}>
          {[
            { id: "overview", label: "Overview" },
            { id: "nutrition", label: "Nutrition" },
            { id: "ingredients", label: "Ingredients" },
            { id: "allergens", label: "Allergens" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="px-6 py-4 font-bold text-sm whitespace-nowrap border-b-2 transition-colors cursor-pointer"
              style={{
                borderColor: activeTab === tab.id ? "#D49566" : "transparent",
                color: activeTab === tab.id ? "#D49566" : "#A08F81"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENT */}
        <div className="p-6 overflow-y-auto flex-1 text-sm" style={{ color: "#FFFDF8" }}>
          {activeTab === "overview" && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-base" style={{ color: "#E0D7CD", lineHeight: 1.6 }}>{item.desc}</p>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 rounded-xl" style={{ backgroundColor: "#1A130E", border: \`1px solid \${C.border}\` }}>
                  <p className="text-xs uppercase font-bold tracking-wider mb-1" style={{ color: "#A08F81" }}>Dietary</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.dietary.map((d) => (
                      <span key={d} className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#122619] text-[#4ADE80] border border-[#1E4729]">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-4 rounded-xl flex flex-col justify-center" style={{ backgroundColor: "#1A130E", border: \`1px solid \${C.border}\` }}>
                  <p className="text-xs uppercase font-bold tracking-wider mb-1" style={{ color: "#A08F81" }}>Preparation</p>
                  <p className="font-bold text-[#E0D7CD]">Freshly prepared to order</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "nutrition" && (
            <div className="animate-fade-in">
              <p className="text-xs uppercase font-bold tracking-wider mb-4" style={{ color: "#A08F81" }}>Nutritional Information (Per Serving)</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Calories", val: \`\${item.cal} kcal\` },
                  { label: "Protein", val: \`\${item.protein}g\` },
                  { label: "Carbs", val: \`\${item.carbs}g\` },
                  { label: "Total Fat", val: \`\${item.fat}g\` },
                  { label: "Sat Fat", val: "N/A" },
                  { label: "Sugars", val: "N/A" },
                  { label: "Fibre", val: "N/A" },
                  { label: "Sodium", val: "N/A" }
                ].map((n, i) => (
                  <div key={i} className="p-3 rounded-xl text-center" style={{ backgroundColor: "#1A130E", border: \`1px solid \${C.border}\` }}>
                    <p className="text-[10px] uppercase font-bold" style={{ color: "#A08F81" }}>{n.label}</p>
                    <p className="font-bold text-sm mt-1" style={{ color: "#D49566" }}>{n.val}</p>
                  </div>
                ))}
              </div>
              <p className="text-[10px] italic mt-4" style={{ color: "#A08F81" }}>* Some exact values pending verification.</p>
            </div>
          )}

          {activeTab === "ingredients" && (
            <div className="animate-fade-in">
              <p className="text-xs uppercase font-bold tracking-wider mb-4" style={{ color: "#A08F81" }}>Base Ingredients</p>
              <ul className="list-disc pl-5 space-y-2">
                {item.ingredients.map((ing, i) => (
                  <li key={i} className="text-[#E0D7CD]">{ing}</li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "allergens" && (
            <div className="animate-fade-in space-y-4">
              <div>
                <p className="text-xs uppercase font-bold tracking-wider mb-2" style={{ color: "#A08F81" }}>Declared Allergens</p>
                {item.allergens.length > 0 ? (
                  <div className="p-4 rounded-xl border border-amber-800 bg-amber-950/30">
                    <p className="font-semibold text-amber-200">
                      Contains: {item.allergens.join(", ")}
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-emerald-800 bg-emerald-950/30">
                    <p className="font-semibold text-emerald-200">
                      No major allergens listed in base ingredients.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="p-4 rounded-xl" style={{ backgroundColor: "#1A130E", border: \`1px solid \${C.border}\` }}>
                <p className="text-xs uppercase font-bold tracking-wider mb-2" style={{ color: "#A08F81" }}>Cross-Contact Disclaimer</p>
                <p className="text-xs leading-relaxed" style={{ color: "#E0D7CD" }}>
                  Please be aware that our food may contain or come into contact with common allergens, such as dairy, eggs, wheat, soybeans, tree nuts, peanuts, fish, shellfish or wheat. While we take steps to minimize risk and safely handle the foods that contain potential allergens, please be advised that cross contamination may occur.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

\n\n`
  c = c.substring(0, startIdx) + newModalDef + c.substring(endIdx);
}

// 5. Render CProductModal in the main App
const renderStr = `{ingredientOverlayItem && (`;
if (!c.includes('<CProductModal')) {
  c = c.replace(renderStr, `{productModalItem && <CProductModal item={productModalItem} onClose={() => setProductModalItem(null)} addToCart={addToCart} />}\n\n      {ingredientOverlayItem && (`);
}

fs.writeFileSync('src/App.tsx', c);
console.log("Updated!");
