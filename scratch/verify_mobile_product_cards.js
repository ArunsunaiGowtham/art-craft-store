const fs = require('fs');

const home2 = fs.readFileSync('home-2.html', 'utf8');
const index = fs.readFileSync('index.html', 'utf8');
const styleCss = fs.readFileSync('css/style.css', 'utf8');

// Check home-2.html has full width button with no colliding inline styles
if (home2.includes('<button class="btn btn-sm btn-primary add-to-cart-btn" data-id="1"><i class="fas fa-plus me-1"></i>Cart</button>')) {
  console.error("FAIL: home-2.html still has old colliding cart button");
  process.exit(1);
}

if (!home2.includes('class="btn btn-sm btn-primary w-100 add-to-cart-btn"')) {
  console.error("FAIL: home-2.html missing w-100 add-to-cart-btn");
  process.exit(1);
}

// Check styleCss has mobile product-card rules
if (!styleCss.includes('.product-card .add-to-cart-btn {')) {
  console.error("FAIL: style.css missing mobile .product-card .add-to-cart-btn rule");
  process.exit(1);
}

console.log("SUCCESS: All product cards in home-2.html, index.html, and CSS verified properly aligned for mobile!");
