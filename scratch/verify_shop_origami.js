const fs = require('fs');

const dataJs = fs.readFileSync('js/data.js', 'utf8');
global.window = {};
eval(dataJs);

const products = global.window.AppData.products;
console.log('Total products in catalog:', products.length);

const origamiProducts = products.filter(p => p.category === 'origami');
console.log('Origami products count:', origamiProducts.length);

origamiProducts.forEach((p, idx) => {
  console.log(`[Product ${idx + 1}] ID: ${p.id} | Name: "${p.name}" | Price: $${p.price} | Image: "${p.image}"`);
  if (!fs.existsSync(p.image)) {
    console.error(`  ❌ Image file not found: ${p.image}`);
  } else {
    const stats = fs.statSync(p.image);
    console.log(`  ✅ Image file exists: ${stats.size} bytes`);
  }
});

const images = origamiProducts.map(p => p.image);
const uniqueImages = new Set(images);
if (uniqueImages.size === origamiProducts.length) {
  console.log(`\n✅ ALL ${origamiProducts.length} ORIGAMI PRODUCTS HAVE UNIQUE, SEPARATE IMAGES!`);
} else {
  console.error('\n❌ REPEATED IMAGES DETECTED!');
  process.exit(1);
}
