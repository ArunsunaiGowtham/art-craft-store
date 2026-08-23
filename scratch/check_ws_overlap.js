const fs = require('fs');
const path = require('path');

const dataContent = fs.readFileSync(path.join(__dirname, '..', 'js', 'data.js'), 'utf8');
const window = {};
eval(dataContent);

console.log('=== CHECKING REPEATED IMAGES ACROSS PRODUCTS & WORKSHOPS ===');
const prodImages = new Map();
window.AppData.products.forEach(p => {
  prodImages.set(p.image, `Product ${p.id}: ${p.name}`);
});

window.AppData.workshops.forEach(w => {
  if (prodImages.has(w.image)) {
    console.log(`⚠️ WS ${w.id} ("${w.title}") shares image with ${prodImages.get(w.image)}: ${w.image}`);
  } else {
    console.log(`✅ WS ${w.id} ("${w.title}") has unique image: ${w.image}`);
  }
});
