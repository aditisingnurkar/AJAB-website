const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');
const start = c.indexOf('{/* ── NUTRITION & ALLERGEN MODAL ── */}');
const endStr = '  {/* ── SEASONAL BANNER ── */}';
const end = c.indexOf(endStr);
if(start !== -1 && end !== -1) {
  const replacement = `      {/* ── INGREDIENT OVERLAY MODAL ── */}
      {ingredientOverlayItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
          onClick={() => setIngredientOverlayItem(null)}
        >
          <div
            className="w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
            style={{ backgroundColor: "#261D15", border: \`1px solid \${C.border}\` }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIngredientOverlayItem(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg cursor-pointer z-10 bg-black/50 text-white hover:bg-black/80"
              aria-label="Close"
            >
              ×
            </button>
            <div className="relative h-64 shrink-0 bg-[#1A130E]">
              <FoodImage
                src={ingredientOverlayItem.img}
                alt={ingredientOverlayItem.imgAlt}
                name={ingredientOverlayItem.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 overflow-y-auto">
              <h3 className="font-serif text-2xl font-bold mb-4" style={{ color: "#FFFDF8" }}>
                {ingredientOverlayItem.name}
              </h3>
              
              <div className="mb-4">
                <p className="font-serif text-lg italic mb-2" style={{ color: "#D49566" }}>Made with</p>
                <ul className="list-disc pl-5 space-y-1" style={{ color: "#FFFDF8" }}>
                  {ingredientOverlayItem.ingredients.map((ing, i) => (
                    <li key={i} className="text-sm">{ing}</li>
                  ))}
                </ul>
              </div>

              {ingredientOverlayItem.allergens && ingredientOverlayItem.allergens.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[#423122]">
                  <p className="text-xs italic" style={{ color: "#A08F81" }}>
                    Contains: {ingredientOverlayItem.allergens.join(", ")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

`;
  c = c.substring(0, start) + replacement + c.substring(end);
  fs.writeFileSync('src/App.tsx', c);
  console.log('Replaced modal successfully');
} else {
  console.log('Could not find start/end indices.', start, end);
}
