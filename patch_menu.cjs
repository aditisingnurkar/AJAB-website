const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `{featuredDishes.map((item) => (`;
const start = content.indexOf(targetStr);
const end = content.indexOf('        {/* Heritage Pairing Combo Banner */}', start);

if (start !== -1 && end > start) {
  // We need to keep the closing </div> for the grid which is before the Heritage Pairing banner.
  // Wait, the grid closing div is right before the blank line before Heritage Pairing banner.
  const endOfMap = content.lastIndexOf('</div>', end);
  
  const replacement = `{featuredDishes.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl overflow-hidden flex flex-col justify-between transition-all hover:shadow-2xl group"
              style={{ backgroundColor: C.card, border: \`1px solid \${C.border}\` }}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#14100D]">
                <img
                  src={item.img}
                  alt={item.imgAlt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between" style={{ backgroundColor: C.card }}>
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="font-serif font-bold text-[22px] leading-tight" style={{ color: C.text }}>
                      {item.name}
                    </h3>
                    <p className="font-bold text-[18px] shrink-0" style={{ color: "#D49566" }}>
                      ₹{item.price}
                    </p>
                  </div>
                  
                  <p className="text-[13px] mb-5" style={{ color: C.muted }}>
                    {item.cal} kcal · {item.protein}g protein · {item.carbs}g carbs
                  </p>
                </div>

                <div className="pt-4 border-t flex gap-3" style={{ borderColor: C.border }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); setFood(item); }}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors text-center hover:bg-white/5"
                    style={{ color: C.text, border: \`1px solid \${C.border}\` }}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => addToCart(item)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all text-center hover:opacity-90 active:scale-95"
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
          ))}
        `;
  
  content = content.substring(0, start) + replacement + content.substring(endOfMap);
  fs.writeFileSync('src/App.tsx', content);
  console.log('Replaced featuredDishes mapping successfully');
} else {
  console.log('Could not find start or end block.', start, end);
}
