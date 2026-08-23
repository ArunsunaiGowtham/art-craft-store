const fs = require('fs');
const path = require('path');

// 1. Check images exist on disk and have non-zero size
const img1 = path.join(__dirname, '..', 'images', 'origami-paper-collection.jpg');
const img2 = path.join(__dirname, '..', 'images', 'origami-advanced-kit.jpg');

console.log('1. Checking image files on disk:');
console.log(' - origami-paper-collection.jpg exists:', fs.existsSync(img1), 'Size:', fs.existsSync(img1) ? fs.statSync(img1).size : 0);
console.log(' - origami-advanced-kit.jpg exists:', fs.existsSync(img2), 'Size:', fs.existsSync(img2) ? fs.statSync(img2).size : 0);

if (!fs.existsSync(img1) || !fs.existsSync(img2)) {
  console.error('FAIL: Missing images');
  process.exit(1);
}

// 2. Load data.js
const dataJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'data.js'), 'utf8');
const window = {};
eval(dataJs);

const products = window.AppData.products;
const p14 = products.find(p => p.id === 14);
const p15 = products.find(p => p.id === 15);

console.log('\n2. Verifying Product 14 (Origami Paper Collection):');
console.log(' - ID:', p14.id);
console.log(' - Name:', p14.name);
console.log(' - Category:', p14.category);
console.log(' - Price:', p14.price);
console.log(' - Image:', p14.image);
console.log(' - Description:', p14.description);

console.log('\n3. Verifying Product 15 (Origami Advanced Kit):');
console.log(' - ID:', p15.id);
console.log(' - Name:', p15.name);
console.log(' - Category:', p15.category);
console.log(' - Price:', p15.price);
console.log(' - Image:', p15.image);
console.log(' - Description:', p15.description);

// Check that image paths match expected
let pass = true;
if (p14.image !== 'images/origami-paper-collection.jpg') {
  console.error('FAIL: Product 14 image mismatch:', p14.image);
  pass = false;
}
if (p15.image !== 'images/origami-advanced-kit.jpg') {
  console.error('FAIL: Product 15 image mismatch:', p15.image);
  pass = false;
}

// Check Origami Category
const origCat = window.AppData.categories.find(c => c.slug === 'origami');
console.log('\n4. Verifying Category "Origami":');
console.log(' - Slug:', origCat.slug);
console.log(' - Image:', origCat.image);

// Check index.html for any remaining broken or old bear references
const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const hasOldBear = indexHtml.includes('photo-1530595467537-0b5996c41f2d');
console.log('\n5. Checking index.html:');
console.log(' - Contains old bear URL:', hasOldBear);
console.log(' - Contains origami-paper-collection.jpg:', indexHtml.includes('images/origami-paper-collection.jpg'));

if (hasOldBear) {
  console.error('FAIL: index.html still contains old bear image');
  pass = false;
}

if (pass) {
  console.log('\n>>> ALL VERIFICATION CHECKS PASSED! <<<');
} else {
  console.log('\n>>> SOME CHECKS FAILED! <<<');
  process.exit(1);
}
