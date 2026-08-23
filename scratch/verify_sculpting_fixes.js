const fs = require('fs');
const path = require('path');

// Mock window.AppData
global.window = {};
require('../js/data.js');

const products = window.AppData.products;
const sculptingProducts = products.filter(p => p.category === 'sculpting');

console.log(`\n========================================`);
console.log(`Sculpting Products Verification (${sculptingProducts.length} items)`);
console.log(`========================================\n`);

let allPassed = true;

sculptingProducts.forEach((p, idx) => {
  const num = idx + 1;
  console.log(`[Product #${num}] ID: ${p.id}`);
  console.log(`  Name: ${p.name}`);
  console.log(`  Category: ${p.category} (${p.categoryLabel})`);
  console.log(`  Price: $${p.price}`);
  console.log(`  Image: ${p.image}`);

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
  } else {
    console.error(`  ❌ ERROR: Invalid image format: ${p.image}`);
    allPassed = false;
  }
  console.log('');
});

// Check index.html
const indexHtml = fs.readFileSync('index.html', 'utf8');
if (indexHtml.includes('36-Colors-Plasticine')) {
  console.error('❌ ERROR: index.html still contains old Walmart image url');
  allPassed = false;
} else {
  console.log('✅ index.html does not contain old unrelated plasticine image');
}

if (indexHtml.includes('images/product-modeling-clay-pack.jpg')) {
  console.log('✅ index.html correctly references images/product-modeling-clay-pack.jpg');
}

if (allPassed) {
  console.log('\n🎉 ALL SCULPTING PRODUCT IMAGES VERIFIED SUCCESSFULLY!\n');
} else {
  console.error('\n❌ VERIFICATION FAILED!\n');
  process.exit(1);
}
