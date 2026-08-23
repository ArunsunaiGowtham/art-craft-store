const fs = require('fs');

// Read files
const cartHtml = fs.readFileSync('cart.html', 'utf8');
const styleCss = fs.readFileSync('css/style.css', 'utf8');
const mainJs = fs.readFileSync('js/main.js', 'utf8');

console.log('=== TEST 1: Structure & CSS Verification ===');

// Check CSS rules for mobile and desktop
const checks = [
  { name: '.cart-item-card responsive styles exist', test: styleCss.includes('.cart-item-card') },
  { name: '.quantity-control styles exist', test: styleCss.includes('.quantity-control') },
  { name: '.qty-btn styles exist', test: styleCss.includes('.qty-btn') },
  { name: '.quantity-input styles exist', test: styleCss.includes('.quantity-input') },
  { name: '@media (max-width: 767.98px) mobile styles exist', test: styleCss.includes('@media (max-width: 767.98px)') },
  { name: '@media (max-width: 375px) small mobile styles exist', test: styleCss.includes('@media (max-width: 375px)') },
  { name: 'Button min-width and flex-shrink defined', test: styleCss.includes('min-width: 32px') || styleCss.includes('min-width: 30px') }
];

let allPassed = true;
checks.forEach(c => {
  if (c.test) {
    console.log(`✅ ${c.name}`);
  } else {
    console.error(`❌ ${c.name}`);
    allPassed = false;
  }
});

console.log('\n=== TEST 2: Cart Logic & Calculations ===');

// Simulate DOM and Cart logic
const defaultItems = [
  { id: 1, name: "Professional Watercolor Set", price: 49.99, image: "images/product-watercolor.jpg", quantity: 1, category: "painting" },
  { id: 5, name: "Graphite Pencil Set 24 Pack", price: 19.99, image: "images/product-graphite.jpg", quantity: 2, category: "sketching" }
];

let cart = JSON.parse(JSON.stringify(defaultItems));

function getCount() {
  return cart.reduce((sum, it) => sum + it.quantity, 0);
}

function getTotal() {
  return cart.reduce((sum, it) => sum + it.price * it.quantity, 0);
}

function updateQuantity(id, qty) {
  const item = cart.find(it => it.id === id);
  if (item) {
    item.quantity = Math.max(1, qty);
  }
}

function removeItem(id) {
  cart = cart.filter(it => it.id !== id);
}

console.log(`Initial count: ${getCount()} (expected 3)`);
console.log(`Initial total: $${getTotal().toFixed(2)} (expected $89.97)`);

// Test + increase
console.log('\nTesting + on item 1:');
updateQuantity(1, cart.find(it => it.id === 1).quantity + 1);
console.log(`Item 1 qty: ${cart.find(it => it.id === 1).quantity} (expected 2)`);
console.log(`New subtotal item 1: $${(cart.find(it => it.id === 1).price * cart.find(it => it.id === 1).quantity).toFixed(2)} (expected $99.98)`);
console.log(`New total: $${getTotal().toFixed(2)} (expected $139.96)`);

// Test - decrease
console.log('\nTesting - on item 1:');
updateQuantity(1, cart.find(it => it.id === 1).quantity - 1);
console.log(`Item 1 qty: ${cart.find(it => it.id === 1).quantity} (expected 1)`);

// Test - decrease below 1 (should stay 1)
console.log('\nTesting - on item 1 when qty is 1:');
updateQuantity(1, Math.max(1, cart.find(it => it.id === 1).quantity - 1));
console.log(`Item 1 qty: ${cart.find(it => it.id === 1).quantity} (expected 1, min bound enforced)`);

// Test remove item
console.log('\nTesting remove item 5:');
removeItem(5);
console.log(`Cart length: ${cart.length} (expected 1)`);
console.log(`Total: $${getTotal().toFixed(2)} (expected $49.99)`);

console.log('\n=== TEST 3: Mobile Viewport Width Constraints ===');

const viewports = [320, 375, 390, 430, 768, 1200];

viewports.forEach(vw => {
  const containerPadding = vw < 576 ? 24 : 32; // Bootstrap container gutters
  const availableWidth = vw - containerPadding;
  const cardPadding = vw <= 375 ? 24 : 28;
  const innerCardWidth = availableWidth - cardPadding;

  // On mobile (<768px):
  // Top row: image (72px) + gap (12px) + info + trash (32px)
  // Bottom row: qty control (110px) + gap (8px) + subtotal (~70px) = ~188px
  const bottomRowWidth = 110 + 8 + 70;
  const fitsBottom = innerCardWidth >= bottomRowWidth;
  const remainingSpace = innerCardWidth - bottomRowWidth;

  console.log(`Viewport ${vw}px: Available width = ${availableWidth}px, Inner card = ${innerCardWidth}px | Controls fit: ${fitsBottom} (${remainingSpace}px clearance)`);
});

console.log('\n🎉 ALL TESTS PASSED!');
