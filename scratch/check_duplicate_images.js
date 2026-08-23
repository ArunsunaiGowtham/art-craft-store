const fs = require('fs');
const content = fs.readFileSync('js/data.js', 'utf8');

let window = {};
eval(content);

const imageMap = {};
window.AppData.products.forEach(p => {
  if (!imageMap[p.image]) {
    imageMap[p.image] = [];
  }
  imageMap[p.image].push(p);
});

console.log("Checking for duplicate product images in data.js:");
let duplicatesFound = false;
for (const [img, prods] of Object.entries(imageMap)) {
  if (prods.length > 1) {
    duplicatesFound = true;
    console.log(`\nDUPLICATE IMAGE (${img}):`);
    prods.forEach(p => console.log(`  - ID ${p.id}: "${p.name}" (Category: ${p.category})`));
  }
}

if (!duplicatesFound) {
  console.log("No duplicate image URLs found in data.js (except visually identical local vs remote URLs).");
}
