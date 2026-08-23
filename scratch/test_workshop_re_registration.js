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
const elements = [];

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

// Test 1st registration
const reg1 = global.window.WorkshopReg.submit(workshop, { name: "Alice", email: "alice@example.com", phone: "123" });
console.log("1st registration success:", reg1);
console.log("Count after 1st:", global.window.WorkshopReg.getRegistrationCount(workshop.id));

if (global.window.WorkshopReg.getRegistrationCount(workshop.id) !== 1) {
  console.error("FAIL: Registration count should be 1");
  process.exit(1);
}

// Test 2nd registration for the SAME workshop
const reg2 = global.window.WorkshopReg.submit(workshop, { name: "Bob", email: "bob@example.com", phone: "456" });
console.log("2nd registration for same workshop success:", reg2);
console.log("Count after 2nd:", global.window.WorkshopReg.getRegistrationCount(workshop.id));

if (global.window.WorkshopReg.getRegistrationCount(workshop.id) !== 2) {
  console.error("FAIL: Registration count should be 2");
  process.exit(1);
}

console.log("\nALL WORKSHOP RE-REGISTRATION TESTS PASSED SUCCESSFULLY!");
