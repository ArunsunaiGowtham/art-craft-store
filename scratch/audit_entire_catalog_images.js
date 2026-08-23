const fs = require('fs');
const path = require('path');

global.window = {};
require('../js/data.js');

const products = window.AppData.products;
console.log(`Auditing all ${products.length} products in catalog...`);

const imgMap = new Map();
let duplicatesFound = 0;

products.forEach(p => {
  if (imgMap.has(p.image)) {
    const orig = imgMap.get(p.image);
    console.warn(`⚠️ Duplicate image found between [ID ${orig.id}: ${orig.name}] and [ID ${p.id}: ${p.name}] -> ${p.image}`);
    duplicatesFound++;
  } else {
    imgMap.set(p.image, p);
  }
});

if (duplicatesFound === 0) {
  console.log(`✅ All ${products.length} products have unique, distinct images!`);
} else {
  console.log(`Found ${duplicatesFound} duplicate product image(s).`);
}
