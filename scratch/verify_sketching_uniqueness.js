const fs = require('fs');
const path = require('path');

global.window = {};
require('../js/data.js');

const products = window.AppData.products;
const sketchingProducts = products.filter(p => p.category === 'sketching');

console.log(`\n========================================`);
console.log(`Sketching Products Verification (${sketchingProducts.length} items)`);
console.log(`========================================\n`);

let allPassed = true;
const seenImages = new Map();

sketchingProducts.forEach((p, idx) => {
  const num = idx + 1;
  console.log(`[Product #${num}] ID: ${p.id}`);
  console.log(`  Name: ${p.name}`);
  console.log(`  Badge: ${p.badge || 'None'}`);
  console.log(`  Price: $${p.price}`);
  console.log(`  Image: ${p.image}`);

  if (seenImages.has(p.image)) {
    console.error(`  ❌ ERROR: Duplicate image! Also used in Product #${seenImages.get(p.image)}`);
    allPassed = false;
  } else {
    seenImages.set(p.image, num);
  }

  if (p.image.startsWith('images/')) {
    const fullPath = path.join(__dirname, '..', p.image);
    if (!fs.existsSync(fullPath)) {
      console.error(`  ❌ ERROR: Image file does not exist at ${fullPath}`);
      allPassed = false;
    } else {
      const stats = fs.statSync(fullPath);
      console.log(`  ✅ OK: Local file exists (${stats.size} bytes)`);
    }
  } else if (p.image.startsWith('http://') || p.image.startsWith('https://')) {
    console.log(`  ℹ️ Remote URL: ${p.image}`);
  }
  console.log('');
});

if (allPassed) {
  console.log('🎉 ALL SKETCHING PRODUCT IMAGES ARE UNIQUE AND VALID!\n');
} else {
  console.error('❌ VERIFICATION FAILED!\n');
  process.exit(1);
}
