const fs = require('fs');

console.log('=== WORKSHOP REGISTRATION & CANCELLATION WORKFLOW TEST ===\n');

// Mock browser environment
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
  location: { pathname: '/workshop-details.html', href: 'workshop-details.html?id=1', search: '?id=1' },
  matchMedia: () => ({ matches: false, addEventListener: () => {} }),
  dispatchEvent: () => {},
  addEventListener: () => {},
  CustomEvent: function(name, opts) { this.name = name; this.detail = opts ? opts.detail : null; },
  bootstrap: {
    Modal: {
      getInstance: () => ({ hide: () => {}, show: () => {} }),
      getOrCreateInstance: () => ({ hide: () => {}, show: () => {} })
    }
  }
};

const domElements = {};
function createMockElement(tag, id) {
  const el = {
    tagName: tag.toUpperCase(),
    className: '',
    id: id || '',
    dataset: {},
    style: {},
    _innerHTML: '',
    get innerHTML() { return this._innerHTML; },
    set innerHTML(val) { this._innerHTML = val; },
    textContent: '',
    children: [],
    attributes: {},
    setAttribute: function(k, v) { this.attributes[k] = String(v); if (k === 'id') { this.id = v; domElements[v] = this; } },
    getAttribute: function(k) { return this.attributes[k] || null; },
    removeAttribute: function(k) { delete this.attributes[k]; },
    classList: {
      classes: new Set(),
      add: function(c) { this.classes.add(c); },
      remove: function(c) { this.classes.delete(c); },
      contains: function(c) { return this.classes.has(c); }
    },
    appendChild: function(child) { this.children.push(child); return child; },
    querySelector: function(sel) {
      if (sel === '[data-cancel-confirm-msg]') return createMockElement('p');
      if (sel === '.confirm-cancel-action-btn') return createMockElement('button');
      if (sel === '[data-already-registered-alert]') return createMockElement('div');
      if (sel === '[data-registered-count-text]') return createMockElement('div');
      if (sel === '.cancel-this-registration-btn') return domElements['workshop-cancel-sidebar-btn'] || createMockElement('button');
      if (sel === '[data-registration-title]') return createMockElement('h6');
      if (sel === '[data-registration-details]') return createMockElement('p');
      if (sel === '[data-registration-form]') return createMockElement('form');
      if (sel === "button[type='submit']") return createMockElement('button');
      if (sel.startsWith("[name='")) return createMockElement('input');
      return createMockElement('div');
    },
    querySelectorAll: function() { return []; },
    addEventListener: function() {},
    focus: function() {}
  };
  if (id) domElements[id] = el;
  return el;
}

// Setup standard workshop-details DOM elements
const statusWrap = createMockElement('div', 'workshop-registered-status-wrap');
statusWrap.style.display = 'none';

const seatCountEl = createMockElement('div', 'workshop-registered-seat-count');
seatCountEl.textContent = '1 seat reserved';

const cancelSidebarBtn = createMockElement('button', 'workshop-cancel-sidebar-btn');
cancelSidebarBtn.setAttribute('data-workshop-id', '1');

const registerBtn = createMockElement('button', 'workshop-register-btn');
registerBtn.setAttribute('data-workshop-id', '1');

const seatsLeftEl = createMockElement('span', 'workshop-seats-left');
const seatsTotalEl = createMockElement('span', 'workshop-seats-total');
const seatsBarEl = createMockElement('div', 'workshop-seats-bar');

global.document = {
  documentElement: { setAttribute: () => {}, getAttribute: () => "light" },
  querySelectorAll: (sel) => {
    if (sel.includes('.workshop-register-btn')) return [registerBtn];
    return [];
  },
  querySelector: () => null,
  getElementById: (id) => {
    return domElements[id] || null;
  },
  head: { appendChild: () => {} },
  body: { appendChild: (el) => { if (el && el.id) domElements[el.id] = el; return el; } },
  createElement: (tag) => createMockElement(tag),
  addEventListener: () => {}
};

// Load data.js and main.js
eval(fs.readFileSync('js/data.js', 'utf8'));
eval(fs.readFileSync('js/main.js', 'utf8'));

const WorkshopReg = global.window.WorkshopReg;
const testWorkshop1 = global.window.AppData.workshops.find(w => w.id === 1);
const testWorkshop2 = global.window.AppData.workshops.find(w => w.id === 2);

console.log('--- TEST 1: Initial State Before Registration ---');
WorkshopReg.saveRegistrations([]);
WorkshopReg.updateUI(1);

console.log(`- Registered status wrap display: "${statusWrap.style.display}" (Expected: "none")`);
console.log(`- Register button display: "${registerBtn.style.display}" (Expected: "block")`);
console.log(`- Register button text: "${registerBtn.innerHTML}" (Expected: contains "Register Now")`);
if (statusWrap.style.display !== 'none' || registerBtn.style.display !== 'block' || !registerBtn.innerHTML.includes('Register Now')) {
  throw new Error("Test 1 Failed: Unregistered state invalid");
}

console.log('\n--- TEST 2: Successful Registration ---');
const initialSeatsLeft = parseInt(seatsLeftEl.textContent, 10);
const attendee1 = { name: "Alice Smith", email: "alice@example.com", phone: "555-0199" };
WorkshopReg.submit(testWorkshop1, attendee1);

console.log(`- Is Registered: ${WorkshopReg.isRegistered(1)} (Expected: true)`);
console.log(`- Registered status wrap display: "${statusWrap.style.display}" (Expected: "block")`);
console.log(`- Seat count message: "${seatCountEl.textContent}" (Expected: "1 seat reserved")`);
console.log(`- Register button display: "${registerBtn.style.display}" (Expected: "none")`);
console.log(`- Cancel button workshop ID: "${cancelSidebarBtn.getAttribute('data-workshop-id')}" (Expected: "1")`);
if (statusWrap.style.display !== 'block' || seatCountEl.textContent !== '1 seat reserved' || registerBtn.style.display !== 'none') {
  throw new Error("Test 2 Failed: Registered state invalid");
}

console.log('\n--- TEST 3: Confirmation Dialog Options ---');
const confirmModal = WorkshopReg.getConfirmModal();
console.log(`- Confirm Modal exists: ${Boolean(confirmModal)} (Expected: true)`);
console.log(`- Contains "Cancel Registration": ${confirmModal.innerHTML.includes("Cancel Registration")}`);
console.log(`- Contains "Keep Registration": ${confirmModal.innerHTML.includes("Keep Registration")}`);
console.log(`- Contains "Confirm Cancellation": ${confirmModal.innerHTML.includes("Confirm Cancellation")}`);
if (!confirmModal.innerHTML.includes("Keep Registration") || !confirmModal.innerHTML.includes("Confirm Cancellation")) {
  throw new Error("Test 3 Failed: Missing confirmation buttons");
}

console.log('\n--- TEST 4: Cancel Registration and Immediate Status Removal ---');
WorkshopReg.unregister(1);

console.log(`- Is Registered: ${WorkshopReg.isRegistered(1)} (Expected: false)`);
console.log(`- Registered status wrap display: "${statusWrap.style.display}" (Expected: "none")`);
console.log(`- Register button display: "${registerBtn.style.display}" (Expected: "block")`);
console.log(`- Register button text: "${registerBtn.innerHTML}" (Expected: contains "Register Now")`);
console.log(`- Stored registrations in localStorage: ${WorkshopReg.getRegistrations().length} (Expected: 0)`);
if (statusWrap.style.display !== 'none' || registerBtn.style.display !== 'block' || !registerBtn.innerHTML.includes('Register Now') || WorkshopReg.getRegistrations().length !== 0) {
  throw new Error("Test 4 Failed: Cancelled state not immediately reverted");
}

console.log('\n--- TEST 5: Page Refresh / Reload Persistence ---');
// Simulate reloading page
WorkshopReg.updateUI(1);
console.log(`- After reload, status wrap display: "${statusWrap.style.display}" (Expected: "none")`);
console.log(`- After reload, register button display: "${registerBtn.style.display}" (Expected: "block")`);
if (statusWrap.style.display !== 'none' || registerBtn.style.display !== 'block') {
  throw new Error("Test 5 Failed: Re-rendered state incorrectly shows registered status");
}

console.log('\n--- TEST 6: Multi-Workshop Isolation ---');
WorkshopReg.submit(testWorkshop1, attendee1);
const attendee2 = { name: "Bob Jones", email: "bob@example.com", phone: "555-0288" };
WorkshopReg.submit(testWorkshop2, attendee2);
console.log(`- WS 1 Registered: ${WorkshopReg.isRegistered(1)}, WS 2 Registered: ${WorkshopReg.isRegistered(2)}`);

// Cancel Workshop 1
WorkshopReg.unregister(1);
console.log(`- After cancelling WS 1: WS 1 Registered = ${WorkshopReg.isRegistered(1)} (Expected: false), WS 2 Registered = ${WorkshopReg.isRegistered(2)} (Expected: true)`);
if (WorkshopReg.isRegistered(1) || !WorkshopReg.isRegistered(2)) throw new Error("Test 6 Failed");

console.log('\n--- TEST 7: Re-Registration After Cancellation ---');
WorkshopReg.submit(testWorkshop1, attendee1);
console.log(`- Re-registered WS 1: ${WorkshopReg.isRegistered(1)} (Expected: true)`);
console.log(`- Status wrap display: "${statusWrap.style.display}" (Expected: "block")`);
console.log(`- Seat count message: "${seatCountEl.textContent}" (Expected: "1 seat reserved")`);
if (!WorkshopReg.isRegistered(1) || statusWrap.style.display !== 'block') {
  throw new Error("Test 7 Failed: Re-registration failed");
}

console.log('\n🎉 ALL WORKSHOP REGISTRATION STATUS & CANCELLATION TESTS PASSED PERFECTLY!');
