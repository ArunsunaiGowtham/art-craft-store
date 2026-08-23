const fs = require('fs');

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
  location: { pathname: '/workshops.html', href: 'workshops.html' },
  addEventListener: () => {},
  matchMedia: () => ({ matches: false, addEventListener: () => {} }),
  bootstrap: {
    Modal: {
      getOrCreateInstance: () => ({ show: () => {}, hide: () => {} })
    }
  }
};

const listeners = [];

function createMockElement(tag) {
  const el = {
    tagName: tag,
    style: {},
    className: '',
    classList: {
      add: (c) => { el.className += ' ' + c; },
      remove: (c) => { el.className = el.className.replace(c, '').trim(); },
      contains: (c) => el.className.includes(c)
    },
    dataset: {},
    attributes: {},
    setAttribute: (k, v) => { el.attributes[k] = v; },
    getAttribute: (k) => el.attributes[k] || null,
    removeAttribute: (k) => { delete el.attributes[k]; },
    querySelector: (sel) => createMockElement('div'),
    querySelectorAll: () => [],
    appendChild: () => {},
    addEventListener: (event, handler) => { listeners.push({ event, handler }); }
  };
  return el;
}

global.document = {
  documentElement: {
    setAttribute: () => {},
    getAttribute: () => 'light'
  },
  addEventListener: (event, handler) => {
    listeners.push({ event, handler });
  },
  getElementById: (id) => createMockElement('div'),
  querySelector: () => createMockElement('div'),
  querySelectorAll: () => [],
  createElement: (tag) => createMockElement(tag),
  body: createMockElement('body'),
  head: createMockElement('head')
};

// Load data and main
eval(fs.readFileSync('./js/data.js', 'utf8'));
eval(fs.readFileSync('./js/main.js', 'utf8'));

const workshop = global.window.AppData.workshops[0];
console.log("Testing Workshop Registration for:", workshop.title);

// 1. Submit Registration
global.window.WorkshopReg.submit(workshop, { name: "John", email: "john@example.com", phone: "555-1234" });
console.log("Is registered:", global.window.WorkshopReg.isRegistered(workshop.id));
console.log("Count:", global.window.WorkshopReg.getRegistrationCount(workshop.id));

if (!global.window.WorkshopReg.isRegistered(workshop.id)) {
  console.error("FAIL: Should be registered");
  process.exit(1);
}

// 2. Cancel / Unregister
global.window.WorkshopReg.unregister(workshop.id);
console.log("After unregister -> Is registered:", global.window.WorkshopReg.isRegistered(workshop.id));
console.log("After unregister -> Count:", global.window.WorkshopReg.getRegistrationCount(workshop.id));

if (global.window.WorkshopReg.isRegistered(workshop.id)) {
  console.error("FAIL: Should be unregistered");
  process.exit(1);
}

// 3. Register Again
global.window.WorkshopReg.submit(workshop, { name: "John", email: "john@example.com", phone: "555-1234" });
console.log("After registering again -> Count:", global.window.WorkshopReg.getRegistrationCount(workshop.id));

if (global.window.WorkshopReg.getRegistrationCount(workshop.id) !== 1) {
  console.error("FAIL: Count should be 1 after registering again");
  process.exit(1);
}

console.log("\nALL REGISTRATION & CANCEL TESTS PASSED SUCCESSFULLY!");
