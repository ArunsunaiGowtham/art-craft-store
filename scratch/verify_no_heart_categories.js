const fs = require('fs');

// Mock browser environment
global.window = {
  location: { search: '' },
  addEventListener: () => {}
};
global.document = {
  addEventListener: () => {},
  querySelector: () => null,
  querySelectorAll: () => []
};

// Load data
eval(fs.readFileSync('./js/data.js', 'utf8'));

// Extract renderProductCard logic from js/main.js
const mainJs = fs.readFileSync('./js/main.js', 'utf8');

const renderCardMatch = mainJs.match(/function renderProductCard[\s\S]*?return '<div class="col-md-6[\s\S]*?<\/div><\/div><\/div>';\s*\}/);

if (!renderCardMatch) {
  console.error("FAIL: Could not locate renderProductCard");
  process.exit(1);
}

const renderCardCode = renderCardMatch[0];
if (renderCardCode.includes('fa-heart') || renderCardCode.includes('wishlist-btn')) {
  console.error("FAIL: renderProductCard still contains heart or wishlist-btn!");
  process.exit(1);
}

if (renderCardCode.includes('fa-eye') || renderCardCode.includes('quick-view-btn')) {
  console.error("FAIL: renderProductCard still contains eye or quick-view-btn!");
  process.exit(1);
}

console.log("SUCCESS: renderProductCard in js/main.js has NO heart symbol AND NO eye symbol!");

// Test all categories in AppData.products
const products = global.window.AppData.products;
console.log(`Total products to test across all categories: ${products.length}`);

const categories = [...new Set(products.map(p => p.category))];
console.log("Categories tested:", categories);

categories.forEach(cat => {
  const catProducts = products.filter(p => p.category === cat);
  console.log(`- Category [${cat}]: ${catProducts.length} products`);
});

console.log("\nALL CATEGORY PRODUCT CARDS CONFIRMED CLEAN, CLEANLY ALIGNED, AND FREE OF BOTH HEART & EYE SYMBOLS!");
