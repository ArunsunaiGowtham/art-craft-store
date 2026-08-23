const fs = require('fs');

let locationHref = "shop.html";

// Mock localStorage
const storage = {};
const localStorageMock = {
  getItem: (key) => storage[key] || null,
  setItem: (key, val) => { storage[key] = val; },
  removeItem: (key) => { delete storage[key]; }
};

global.localStorage = localStorageMock;

// Mock window and document
global.window = {
  location: {
    pathname: '/shop.html',
    get href() { return locationHref; },
    set href(val) { locationHref = val; }
  },
  addEventListener: () => {},
  matchMedia: () => ({ matches: false, addEventListener: () => {} })
};

const listeners = [];
global.document = {
  documentElement: {
    setAttribute: () => {},
    getAttribute: () => 'light'
  },
  addEventListener: (event, handler) => {
    listeners.push({ event, handler });
  },
  getElementById: () => null,
  querySelector: () => null,
  querySelectorAll: () => [],
  createElement: (tag) => ({
    style: {},
    className: '',
    appendChild: () => {},
    addEventListener: () => {}
  }),
  body: {
    appendChild: () => {}
  },
  head: {
    appendChild: () => {}
  }
};

// Load data and main
eval(fs.readFileSync('./js/data.js', 'utf8'));
eval(fs.readFileSync('./js/main.js', 'utf8'));

// Test Cart.addItem
const testProduct = global.window.AppData.products[0];
console.log("Testing Cart.addItem for product:", testProduct.name);

const initialCount = global.window.Cart.getCount();
console.log("Initial cart item count:", initialCount);

global.window.Cart.addItem(testProduct, 2);

const newCount = global.window.Cart.getCount();
console.log("New cart item count after adding 2 units:", newCount);

if (newCount !== initialCount + 2) {
  console.error("FAIL: Cart item count did not increment correctly!");
  process.exit(1);
}

// Test simulate click on Add to Cart button
const clickHandler = listeners.find(l => l.event === 'click');
if (clickHandler) {
  const fakeEvent = {
    preventDefault: () => {},
    target: {
      closest: (sel) => {
        if (sel.includes('.add-to-cart-btn')) {
          return {
            closest: () => ({ getAttribute: () => "5" }),
            getAttribute: () => "5"
          };
        }
        return null;
      }
    }
  };

  locationHref = "shop.html";
  clickHandler.handler(fakeEvent);

  console.log("Location after Add to Cart click:", locationHref);

  if (locationHref === "checkout.html") {
    console.error("FAIL: Add to Cart button redirected to checkout.html!");
    process.exit(1);
  } else {
    console.log("SUCCESS: Add to Cart button stays on current page without redirecting to checkout!");
  }
}

console.log("\nALL ADD-TO-CART BEHAVIOR TESTS PASSED SUCCESSFULLY!");
