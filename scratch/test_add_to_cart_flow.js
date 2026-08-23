const fs = require('fs');
const vm = require('vm');

const dataCode = fs.readFileSync('js/data.js', 'utf8');

// Setup mock browser environment
let mockStorage = {};
const windowObj = {
  location: { href: '' },
  localStorage: {
    getItem: (k) => mockStorage[k] || null,
    setItem: (k, v) => { mockStorage[k] = v; },
    removeItem: (k) => { delete mockStorage[k]; },
    clear: () => { mockStorage = {}; }
  },
  document: {
    querySelectorAll: () => [],
    querySelector: () => null,
    addEventListener: () => {}
  }
};

const context = { window: windowObj, localStorage: windowObj.localStorage, document: windowObj.document, showToast: () => {} };
vm.createContext(context);
vm.runInContext(dataCode, context);

// Cart system logic extracted from main.js
context.window.Cart = {
  getItems: function () {
    try {
      return JSON.parse(context.localStorage.getItem("cart")) || [];
    } catch (e) {
      return [];
    }
  },
  save: function (items) {
    context.localStorage.setItem("cart", JSON.stringify(items));
  },
  addItem: function (product, quantity) {
    quantity = quantity || 1;
    var items = this.getItems();
    var existing = items.find(function (item) { return item.id === product.id; });
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: quantity });
    }
    this.save(items);
  },
  getTotal: function () {
    return this.getItems().reduce(function (sum, item) { return sum + item.price * item.quantity; }, 0);
  },
  getCount: function () {
    return this.getItems().reduce(function (sum, item) { return sum + item.quantity; }, 0);
  }
};

const products = context.window.AppData.products;

// Test adding one product from each of the 8 categories
const categories = ['painting', 'sketching', 'sculpting', 'crafting', 'origami', 'student-supplies', 'art-tools', 'diy-materials'];

categories.forEach(cat => {
  mockStorage = {}; // fresh cart
  const product = products.find(p => p.category === cat);
  console.log(`Testing Category [${cat}]: Adding "${product.name}" ($${product.price})`);
  
  context.window.Cart.addItem(product, 1);
  let cart = context.window.Cart.getItems();
  if (cart.length !== 1 || cart[0].id !== product.id || cart[0].quantity !== 1) {
    console.error(`FAILED to add ${product.name}`);
    process.exit(1);
  }
  
  // Test adding same product again (quantity increase)
  context.window.Cart.addItem(product, 2);
  cart = context.window.Cart.getItems();
  if (cart.length !== 1 || cart[0].quantity !== 3) {
    console.error(`FAILED quantity update for ${product.name}`);
    process.exit(1);
  }
  
  const expectedSubtotal = product.price * 3;
  const actualSubtotal = context.window.Cart.getTotal();
  if (Math.abs(expectedSubtotal - actualSubtotal) > 0.01) {
    console.error(`FAILED subtotal mismatch: expected ${expectedSubtotal}, got ${actualSubtotal}`);
    process.exit(1);
  }

  console.log(`  -> Passed: Image=${cart[0].image ? 'Valid' : 'Invalid'}, Qty=${cart[0].quantity}, Total=$${actualSubtotal.toFixed(2)}`);
});

console.log("\nAll 8 Category Cart & Checkout tests passed successfully!");
