const fs = require('fs');

console.log('=== SHOPPING CART QUANTITY FUNCTIONALITY TEST ===\n');

// Mock browser environment with localStorage and window
const localStorageStore = {};
const localStorage = {
  getItem: (key) => localStorageStore[key] !== undefined ? localStorageStore[key] : null,
  setItem: (key, val) => { localStorageStore[key] = String(val); },
  removeItem: (key) => { delete localStorageStore[key]; },
  clear: () => { Object.keys(localStorageStore).forEach(k => delete localStorageStore[k]); }
};

global.localStorage = localStorage;
global.window = {
  localStorage: localStorage,
  location: { pathname: '/cart.html', href: 'cart.html', search: '' },
  matchMedia: () => ({ matches: false, addEventListener: () => {} }),
  dispatchEvent: () => {},
  CustomEvent: function(name, opts) { this.name = name; this.detail = opts ? opts.detail : null; }
};
global.document = {
  documentElement: {
    setAttribute: () => {},
    getAttribute: () => "light"
  },
  querySelectorAll: () => [],
  querySelector: () => null,
  getElementById: () => null,
  head: { appendChild: () => {} },
  body: { appendChild: () => {} },
  createElement: () => ({ setAttribute: () => {}, appendChild: () => {}, addEventListener: () => {}, style: {} }),
  addEventListener: () => {}
};

// Evaluate js/main.js to load real window.Cart
const mainJs = fs.readFileSync('js/main.js', 'utf8');
eval(mainJs);

const Cart = global.window.Cart;

// TEST 1: Initial state & Default Quantity
console.log('TEST 1: Add product with default quantity');
Cart.clear();
const prod1 = { id: 1, name: "Acrylic Paint Tubes", price: 34.99, image: "images/prod1.jpg", category: "painting" };
Cart.addItem(prod1, 1);

let items = Cart.getItems();
console.log(`Product 1 added: Qty = ${items[0].quantity} (Expected: 1)`);
console.log(`Subtotal = $${Cart.getTotal().toFixed(2)} (Expected: $34.99)`);
if (items[0].quantity !== 1 || Cart.getTotal() !== 34.99) throw new Error("Test 1 Failed");

// TEST 2: Incremental + clicks without limit (1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7)
console.log('\nTEST 2: Clicking + button sequentially (1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7)');
for (let target = 2; target <= 7; target++) {
  const newQty = Cart.changeQuantity(1, 1);
  const total = Cart.getTotal();
  const expectedTotal = Number((34.99 * target).toFixed(2));
  console.log(`Click + -> Qty: ${newQty} (Expected: ${target}), Subtotal: $${total.toFixed(2)} (Expected: $${expectedTotal.toFixed(2)})`);
  if (newQty !== target || Math.abs(total - expectedTotal) > 0.01) {
    throw new Error(`Test 2 Failed at step ${target}: Got Qty ${newQty}, Total $${total}`);
  }
}

// TEST 3: Decremental - clicks (7 -> 6 -> 5 -> 4 -> 3 -> 2 -> 1)
console.log('\nTEST 3: Clicking - button sequentially (7 -> 6 -> 5 -> 4 -> 3 -> 2 -> 1)');
for (let target = 6; target >= 1; target--) {
  const newQty = Cart.changeQuantity(1, -1);
  const total = Cart.getTotal();
  const expectedTotal = Number((34.99 * target).toFixed(2));
  console.log(`Click - -> Qty: ${newQty} (Expected: ${target}), Subtotal: $${total.toFixed(2)} (Expected: $${expectedTotal.toFixed(2)})`);
  if (newQty !== target || Math.abs(total - expectedTotal) > 0.01) {
    throw new Error(`Test 3 Failed at step ${target}: Got Qty ${newQty}, Total $${total}`);
  }
}

// TEST 4: Clicking - at quantity 1 (Must stay 1, cannot become 0 or negative)
console.log('\nTEST 4: Clicking - button at quantity 1');
const qtyAfterUnderflow1 = Cart.changeQuantity(1, -1);
console.log(`Click - at 1 -> Qty: ${qtyAfterUnderflow1} (Expected: 1)`);
const qtyAfterUnderflow2 = Cart.changeQuantity(1, -1);
console.log(`Click - again -> Qty: ${qtyAfterUnderflow2} (Expected: 1)`);
if (qtyAfterUnderflow1 !== 1 || qtyAfterUnderflow2 !== 1) throw new Error("Test 4 Failed: Quantity dropped below 1");

// TEST 5: Multiple products with distinct IDs and types (string vs number ID)
console.log('\nTEST 5: Multi-product operations with mixed ID types');
const prod2 = { id: "5", name: "Sculpting Clay Pack", price: 19.99, image: "images/prod2.jpg", category: "sculpting" };
const prod3 = { id: 12, name: "Detail Brushes Set", price: 12.50, image: "images/prod3.jpg", category: "painting" };
Cart.addItem(prod2, 1);
Cart.addItem(prod3, 3);

console.log(`Cart item count: ${Cart.getCount()} (Expected: 1 + 1 + 3 = 5)`);
console.log(`Cart total: $${Cart.getTotal().toFixed(2)} (Expected: $34.99 + $19.99 + $37.50 = $92.48)`);

Cart.changeQuantity("5", 2); // 1 + 2 = 3
Cart.changeQuantity(12, 1);  // 3 + 1 = 4
Cart.changeQuantity(1, 1);   // 1 + 1 = 2

console.log(`Updated Qty Prod 1: ${Cart.getItems().find(i => i.id == 1).quantity} (Expected: 2)`);
console.log(`Updated Qty Prod 2: ${Cart.getItems().find(i => i.id == 5).quantity} (Expected: 3)`);
console.log(`Updated Qty Prod 3: ${Cart.getItems().find(i => i.id == 12).quantity} (Expected: 4)`);

const finalTotal = Cart.getTotal();
const expectedFinalTotal = Number((34.99 * 2 + 19.99 * 3 + 12.50 * 4).toFixed(2));
console.log(`Total: $${finalTotal.toFixed(2)} (Expected: $${expectedFinalTotal.toFixed(2)})`);
if (Math.abs(finalTotal - expectedFinalTotal) > 0.01) throw new Error("Test 5 Failed");

// TEST 6: LocalStorage persistence
console.log('\nTEST 6: Persistence test (re-reading from storage)');
const rawJson = localStorage.getItem('cart');
const loadedCart = JSON.parse(rawJson);
console.log(`Loaded items from localStorage: ${loadedCart.length} items`);
loadedCart.forEach(i => console.log(`  - [ID ${i.id}] ${i.name}: Qty ${i.quantity}`));
if (loadedCart.length !== 3) throw new Error("Test 6 Failed");

console.log('\n🎉 ALL QUANTITY & CART TESTS PASSED PERFECTLY!');
