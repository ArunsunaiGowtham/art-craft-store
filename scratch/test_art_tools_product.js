const fs = require('fs');

const dataCode = fs.readFileSync('js/data.js', 'utf8');
const mainCode = fs.readFileSync('js/main.js', 'utf8');

const sandbox = {
  window: {},
  document: {
    addEventListener: () => {},
    documentElement: { setAttribute: () => {} },
    querySelector: () => null,
    querySelectorAll: () => []
  }
};

eval(dataCode.replace(/window\.AppData/g, 'sandbox.window.AppData'));

const products = sandbox.window.AppData.products;
const categories = sandbox.window.AppData.categories;

console.log("=== VALIDATING NEW ART TOOLS PRODUCT ===");

// 1. Total products count
console.log(`Total products in catalog: ${products.length}`);
let pass1 = products.length === 29;
console.log(`[${pass1 ? "PASS" : "FAIL"}] Product catalog has 29 items`);

// 2. Art tools category product count
const artToolsProducts = products.filter(p => p.category === "art-tools");
console.log(`Art Tools products (${artToolsProducts.length}):`, artToolsProducts.map(p => `#${p.id} ${p.name}`));
let pass2 = artToolsProducts.length === 4;
console.log(`[${pass2 ? "PASS" : "FAIL"}] Exactly 4 products exist in Art Tools category`);

// 3. New product #29 validation
const p29 = products.find(p => p.id === 29);
let pass3 = p29 &&
            p29.name === "Artist Wooden Mixing Palette & Brushes" &&
            p29.category === "art-tools" &&
            p29.price > 0 &&
            p29.image &&
            p29.description &&
            p29.rating === 4.8 &&
            p29.inStock === true;
console.log(`[${pass3 ? "PASS" : "FAIL"}] Product #29 has complete valid properties`);

// 4. Image uniqueness
const images = products.map(p => p.image);
const uniqueImages = new Set(images);
let pass4 = images.length === uniqueImages.size;
console.log(`[${pass4 ? "PASS" : "FAIL"}] All 29 product images are 100% unique (0 duplicate images)`);

// 5. Category filter isolation
const otherCategories = ["painting", "sketching", "sculpting", "crafting", "origami", "student-supplies", "diy-materials"];
let isolationPass = true;
otherCategories.forEach(cat => {
  const catProds = products.filter(p => p.category === cat);
  if (catProds.some(p => p.id === 29)) {
    isolationPass = false;
  }
});
console.log(`[${isolationPass ? "PASS" : "FAIL"}] Product #29 does not appear under unrelated categories`);

// 6. Category metadata count
const artToolsCat = categories.find(c => c.slug === "art-tools");
let pass6 = artToolsCat && artToolsCat.productCount === 4;
console.log(`[${pass6 ? "PASS" : "FAIL"}] Art Tools category productCount is 4`);

if (pass1 && pass2 && pass3 && pass4 && isolationPass && pass6) {
  console.log("\nALL ART TOOLS PRODUCT VALIDATIONS PASSED!");
} else {
  process.exit(1);
}
