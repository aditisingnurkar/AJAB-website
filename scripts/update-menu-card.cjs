const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

const startStr = '{filteredItems.map((item) => (';
const start = c.indexOf(startStr);

// We need to find the matching '))}</div>' for this map.
const endStr = '              ))}';
const end = c.indexOf(endStr, start);

if (start !== -1 && end !== -1) {
  const replacement = `{filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl overflow-hidden flex flex-col justify-between transition-all hover:shadow-xl hover:border-[#B87342]/60 hover:-translate-y-1 group"
                  style={{ backgroundColor: C.card, border: \`1px solid \${C.border}\` }}
                >
                  <div 
                    className="relative aspect-[4/3] overflow-hidden cursor-pointer"
                    onClick={() => setIngredientOverlayItem(item)}
                  >
                    <FoodImage
                      src={item.img}
                      alt={item.imgAlt}
                      name={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-serif font-bold text-xl leading-tight" style={{ color: C.text }}>
                          {item.name}
                        </h3>
                        <p className="font-bold text-lg shrink-0" style={{ color: "#D49566" }}>
                          ₹{item.price}
                        </p>
                      </div>

                      <p className="text-[13px] font-medium mt-1.5" style={{ color: C.muted }}>
                        {item.cal} kcal · {item.protein}g protein · {item.carbs}g carbs
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t flex gap-2" style={{ borderColor: C.border }}>
                      <button
                        onClick={() => { setFood(item); navigate("food-details"); }}
                        className="flex-1 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors text-center"
                        style={{ backgroundColor: C.cream, color: C.text, border: \`1px solid \${C.border}\` }}
                      >
                        Details
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); addToCart(item); }}
                        className="flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors text-center"
                        style={{
                          background: "linear-gradient(135deg, #B87342 0%, #9C5E32 100%)",
                          color: "#FFFDF8",
                        }}
                      >
                        + Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
`;
  c = c.substring(0, start) + replacement + c.substring(end);
  fs.writeFileSync('src/App.tsx', c);
  console.log('Replaced menu card successfully');
} else {
  console.log('Could not find start/end indices.', start, end);
}
