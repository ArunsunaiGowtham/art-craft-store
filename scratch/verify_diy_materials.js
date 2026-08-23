const fs = require('fs');

const dataJs = fs.readFileSync('js/data.js', 'utf8');
global.window = {};
eval(dataJs);

const products = global.window.AppData.products;
console.log('Total products in catalog:', products.length);

const diyProducts = products.filter(p => p.category === 'diy-materials' || p.categoryLabel === 'DIY Materials');
console.log('DIY Materials products count:', diyProducts.length);

diyProducts.forEach((p, idx) => {
  console.log(`[Product ${idx + 1}] ID: ${p.id} | Name: "${p.name}" | Price: $${p.price} | Image: "${p.image}"`);
  if (p.image.startsWith('images/')) {
    if (!fs.existsSync(p.image)) {
      console.error(`  ❌ Image file not found: ${p.image}`);
    } else {
      const stats = fs.statSync(p.image);
      console.log(`  ✅ Local Image file exists: ${stats.size} bytes`);
    }
  } else {
    console.log(`  🌐 External Image URL: ${p.image.substring(0, 45)}...`);
  }
});

const images = diyProducts.map(p => p.image);
const uniqueImages = new Set(images);
if (uniqueImages.size === diyProducts.length) {
  console.log(`\n✅ ALL ${diyProducts.length} DIY MATERIALS PRODUCTS HAVE UNIQUE, SEPARATE IMAGES!`);
} else {
  console.error('\n❌ REPEATED IMAGES DETECTED!');
  process.exit(1);
}
