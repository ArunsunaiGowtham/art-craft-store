const fs = require('fs');

const dataJs = fs.readFileSync('js/data.js', 'utf8');
global.window = {};
eval(dataJs);

const appData = global.window.AppData;

console.log('=== APP DATA INTEGRITY AUDIT ===\n');

// 1. Products
console.log(`1. Products (${appData.products.length}):`);
const prodImages = new Set();
let prodDupes = 0;
appData.products.forEach(p => {
  if (prodImages.has(p.image)) {
    console.error(`   ❌ Duplicate product image: ${p.image} on "${p.name}"`);
    prodDupes++;
  }
  prodImages.add(p.image);
});
if (prodDupes === 0) console.log('   ✅ All product images are unique.');

// 2. Workshops
console.log(`\n2. Workshops (${appData.workshops.length}):`);
const wsImages = new Set();
let wsDupes = 0;
appData.workshops.forEach(w => {
  if (wsImages.has(w.image)) {
    console.error(`   ❌ Duplicate workshop image: ${w.image} on "${w.title}"`);
    wsDupes++;
  }
  wsImages.add(w.image);
});
if (wsDupes === 0) console.log('   ✅ All workshop images are unique.');

// 3. Blog Posts
console.log(`\n3. Blog Posts (${appData.blogPosts.length}):`);
const blogImages = new Set();
let blogDupes = 0;
appData.blogPosts.forEach(b => {
  if (blogImages.has(b.image)) {
    console.error(`   ❌ Duplicate blog post image: ${b.image} on "${b.title}"`);
    blogDupes++;
  }
  blogImages.add(b.image);
});
if (blogDupes === 0) console.log('   ✅ All blog post images are unique.');

// 4. Categories & Banner Check
console.log(`\n4. Categories (${appData.categories.length}):`);
appData.categories.forEach(c => {
  console.log(`   - ${c.name} (${c.slug}): banner = ${c.banner ? 'OK' : 'N/A'}`);
});

console.log('\n=== AUDIT COMPLETED SUCCESSFULLY ===');
