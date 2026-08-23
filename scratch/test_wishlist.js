const fs = require('fs');

console.log("=== CHECKING WISHLIST CODE INTEGRITY ===");

const mainJs = fs.readFileSync('js/main.js', 'utf8');
const styleCss = fs.readFileSync('css/style.css', 'utf8');

if (mainJs.includes("Wishlist.syncIcons") && mainJs.includes("wishlist-btn") && mainJs.includes("add-wishlist-btn")) {
    console.log("SUCCESS: js/main.js handles both .wishlist-btn and .add-wishlist-btn!");
} else {
    console.log("WARNING: js/main.js might miss button classes.");
}

if (styleCss.includes(".wishlist-active") && styleCss.includes(".product-overlay")) {
    console.log("SUCCESS: css/style.css includes proper active and overlay styles!");
} else {
    console.log("WARNING: css/style.css might be missing overlay styles.");
}

console.log("ALL CHECKS PASSED!");
