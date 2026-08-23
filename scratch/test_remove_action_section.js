const fs = require('fs');

const home2Html = fs.readFileSync('home-2.html', 'utf8');

console.log("=== VALIDATING REMOVAL OF BOTTOM ACTION SECTION ===");

// 1. Featured card does not have Add to Cart or wishlist button
let pass1 = !home2Html.includes('add-to-cart-btn" data-product-id="1"') &&
            !home2Html.includes('class="btn btn-primary flex-grow-1 add-to-cart-btn"');
console.log(`[${pass1 ? "PASS" : "FAIL"}] 'Add to Cart' button removed completely from card`);

// 2. Heart button removed from the featured card
let pass2 = !home2Html.includes('<a href="shop.html" class="btn btn-outline"><i class="far fa-heart"></i></a>');
console.log(`[${pass2 ? "PASS" : "FAIL"}] Heart/favorite button removed completely from card`);

// 3. Card retains product information cleanly
let pass3 = home2Html.includes('Featured Studio Kit') &&
            home2Html.includes('$64.99') &&
            home2Html.includes('Deluxe Mixed-Media Studio Caddy') &&
            home2Html.includes('class="text-muted small mb-0"');
console.log(`[${pass3 ? "PASS" : "FAIL"}] Card maintains clean typography and natural flow with mb-0`);

if (pass1 && pass2 && pass3) {
  console.log("\nALL ACTION SECTION REMOVAL CHECKS PASSED!");
} else {
  process.exit(1);
}
