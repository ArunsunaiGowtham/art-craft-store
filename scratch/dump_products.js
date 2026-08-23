const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');

const content = fs.readFileSync('js/data.js', 'utf8');
let window = {};
eval(content);

const products = window.AppData.products;
const categories = window.AppData.categories;

console.log("Categories in AppData:");
categories.forEach(c => {
  const count = products.filter(p => p.category === c.slug).length;
  console.log(`- ${c.name} (slug: ${c.slug}): listed count ${c.productCount}, actual products ${count}`);
});

console.log("\nProducts by Category:");
const byCat = {};
products.forEach(p => {
  if (!byCat[p.category]) byCat[p.category] = [];
  byCat[p.category].push(p);
});

for (const [cat, prods] of Object.entries(byCat)) {
  console.log(`\n=== CATEGORY: ${cat.toUpperCase()} (${prods.length} items) ===`);
  prods.forEach(p => {
    console.log(`  [ID ${p.id}] "${p.name}" - $${p.price}`);
    console.log(`    Category: ${p.category} | CategoryLabel: ${p.categoryLabel}`);
    console.log(`    Image: ${p.image}`);
    console.log(`    Desc: ${p.description.substring(0, 70)}...`);
  });
}

// Write out JSON for python image download & verification
fs.writeFileSync('scratch/all_products_dump.json', JSON.stringify(products, null, 2));
console.log("\nWrote scratch/all_products_dump.json");
