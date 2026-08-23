const fs = require('fs');

const dataJs = fs.readFileSync('js/data.js', 'utf8');
global.window = {};
eval(dataJs);

const products = global.window.AppData.products;
console.log('Total Products in Catalog:', products.length);

// Group by category
const catMap = {};
products.forEach(p => {
  if (!catMap[p.category]) catMap[p.category] = [];
  catMap[p.category].push(p);
});

console.log('\n--- Category Breakdown ---');
Object.keys(catMap).forEach(cat => {
  console.log(`- ${cat}: ${catMap[cat].length} products`);
});

// Check for duplicate images across entire catalog
const allImages = products.map(p => p.image);
const imageCounts = {};
allImages.forEach(img => {
  imageCounts[img] = (imageCounts[img] || 0) + 1;
});

const duplicates = Object.keys(imageCounts).filter(img => imageCounts[img] > 1);
if (duplicates.length > 0) {
  console.error('\n❌ Warning: duplicate images found across entire catalog:');
  duplicates.forEach(d => console.error(`  - ${d} (used ${imageCounts[d]} times)`));
} else {
  console.log('\n✅ 100% UNIQUE IMAGES ACROSS THE ENTIRE 32-PRODUCT CATALOG!');
}
