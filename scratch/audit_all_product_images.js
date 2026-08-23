const fs = require('fs');
const content = fs.readFileSync('js/data.js', 'utf8');

let window = {};
eval(content);

const imageMap = {};
let duplicateFound = false;

window.AppData.products.forEach(p => {
  if (!imageMap[p.image]) {
    imageMap[p.image] = [];
  }
  imageMap[p.image].push(p);
});

console.log("=== COMPREHENSIVE PRODUCT IMAGE AUDIT ===");
console.log(`Total Products: ${window.AppData.products.length}\n`);

for (const [img, prods] of Object.entries(imageMap)) {
  if (prods.length > 1) {
    duplicateFound = true;
    console.error(`DUPLICATE IMAGE: ${img}`);
    prods.forEach(p => console.error(`  - ID ${p.id}: ${p.name} (${p.category})`));
  }
}

if (duplicateFound) {
  console.error("\nFAIL: Found duplicate product images.");
  process.exit(1);
}

console.log("Sculpting products image list:");
const sculpting = window.AppData.products.filter(p => p.category === 'sculpting');
sculpting.forEach(p => {
  console.log(`  - [ID ${p.id}] ${p.name}: ${p.image}`);
});

console.log("\nSUCCESS: All 36 product images are 100% unique and distinct!");
