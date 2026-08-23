const fs = require('fs');
const path = require('path');

const dataJs = fs.readFileSync('js/data.js', 'utf8');
let window = {};
eval(dataJs);

const products = window.AppData.products;
const categories = window.AppData.categories;

console.log("=========================================");
console.log("  TOTAL CATALOG ACCURACY & INTEGRITY TEST");
console.log("=========================================\n");

let errors = [];

// 1. Check all categories
const validCategorySlugs = categories.map(c => c.slug);
console.log(`Auditing ${products.length} products across ${validCategorySlugs.length} categories:`);

products.forEach(p => {
  if (!validCategorySlugs.includes(p.category)) {
    errors.push(`Product ID ${p.id} ("${p.name}") has invalid category "${p.category}"`);
  }
  if (!p.image || p.image.trim() === '') {
    errors.push(`Product ID ${p.id} ("${p.name}") has empty image`);
  }
  if (p.image.startsWith('images/')) {
    if (!fs.existsSync(p.image)) {
      errors.push(`Product ID ${p.id} ("${p.name}") local image "${p.image}" does not exist`);
    }
  }
  if (typeof p.price !== 'number' || p.price <= 0) {
    errors.push(`Product ID ${p.id} ("${p.name}") has invalid price ${p.price}`);
  }
  if (!p.description || p.description.trim() === '') {
    errors.push(`Product ID ${p.id} ("${p.name}") has empty description`);
  }
});

// 2. Check duplicate images
const imgCounts = {};
products.forEach(p => {
  imgCounts[p.image] = (imgCounts[p.image] || 0) + 1;
});
for (const [img, count] of Object.entries(imgCounts)) {
  if (count > 1) {
    errors.push(`Duplicate image URL: "${img}" used by ${count} products`);
  }
}

// 3. Print breakdown by category
const categoryBreakdown = {};
products.forEach(p => {
  if (!categoryBreakdown[p.category]) categoryBreakdown[p.category] = [];
  categoryBreakdown[p.category].push(p);
});

for (const [cat, prods] of Object.entries(categoryBreakdown)) {
  console.log(`\n✓ Category [${cat.toUpperCase()}] - ${prods.length} Products:`);
  prods.forEach(p => {
    const imgType = p.image.startsWith('images/') ? `Local (${fs.statSync(p.image).size} bytes)` : 'Remote URL';
    console.log(`   - [ID ${p.id}] ${p.name} ($${p.price.toFixed(2)}) -> ${imgType}`);
  });
}

if (errors.length > 0) {
  console.error("\n❌ AUDIT FAILED with errors:");
  errors.forEach(e => console.error("  - " + e));
  process.exit(1);
} else {
  console.log("\n=========================================");
  console.log("  ALL CATEGORIES AND PRODUCTS VERIFIED 100% OK!");
  console.log("=========================================");
}
