const fs = require('fs');

const pdHtml = fs.readFileSync('product-details.html', 'utf8');

console.log("Checking product-details.html...");

// 1. Check if pd-thumbnails exists
if (pdHtml.includes('pd-thumbnails') || pdHtml.includes('thumbnail-row')) {
  console.error("❌ FAIL: thumbnail-row or pd-thumbnails still in product-details.html!");
  process.exit(1);
} else {
  console.log("✓ PASS: Hardcoded thumbnail strip removed from product-details.html");
}

// 2. Check if product-main-image exists
if (!pdHtml.includes('id="pd-main-image"')) {
  console.error("❌ FAIL: pd-main-image not found in product-details.html!");
  process.exit(1);
} else {
  console.log("✓ PASS: pd-main-image cleanly preserved for full product display");
}

// 3. Check for any syntax errors in JS
const jsMain = fs.readFileSync('js/main.js', 'utf8');
const jsData = fs.readFileSync('js/data.js', 'utf8');

let window = {
  location: { search: '?id=33' },
  document: { addEventListener: () => {} },
  addEventListener: () => {}
};

try {
  eval(jsData);
  console.log("✓ PASS: js/data.js evaluates without syntax errors");
} catch (e) {
  console.error("❌ FAIL: js/data.js syntax error:", e);
  process.exit(1);
}

console.log("\nALL VERIFICATIONS PASSED!");
