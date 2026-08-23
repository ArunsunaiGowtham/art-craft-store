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
function createMockElement(tag) {
  const el = {
    tagName: tag.toUpperCase(),
    className: '',
    id: '',
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
      if (sel === '.cancel-this-registration-btn') return createMockElement('button');
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
  return el;
}

global.document = {
  documentElement: { setAttribute: () => {}, getAttribute: () => "light" },
  querySelectorAll: () => [],
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

console.log('TEST 1: Initial empty state');
WorkshopReg.saveRegistrations([]);
console.log(`Registered for Workshop 1: ${WorkshopReg.isRegistered(1)} (Expected: false)`);
if (WorkshopReg.isRegistered(1)) throw new Error("Test 1 Failed");

console.log('\nTEST 2: Register for Workshop 1');
const attendee1 = { name: "Alice Smith", email: "alice@example.com", phone: "555-0199" };
WorkshopReg.submit(testWorkshop1, attendee1);
console.log(`Registered for Workshop 1: ${WorkshopReg.isRegistered(1)} (Expected: true)`);
console.log(`Count for Workshop 1: ${WorkshopReg.getRegistrationCount(1)} (Expected: 1)`);
if (!WorkshopReg.isRegistered(1) || WorkshopReg.getRegistrationCount(1) !== 1) throw new Error("Test 2 Failed");

console.log('\nTEST 3: Request Cancel Modal generation and confirmation options');
const confirmModal = WorkshopReg.getConfirmModal();
console.log(`Confirm Modal exists: ${Boolean(confirmModal)} (Expected: true)`);
console.log(`Modal HTML contains "Cancel Registration": ${confirmModal.innerHTML.includes("Cancel Registration")}`);
console.log(`Modal contains "Keep Registration" button: ${confirmModal.innerHTML.includes("Keep Registration")}`);
console.log(`Modal contains "Confirm Cancellation" button: ${confirmModal.innerHTML.includes("Confirm Cancellation")}`);
if (!confirmModal.innerHTML.includes("Keep Registration") || !confirmModal.innerHTML.includes("Confirm Cancellation")) {
  throw new Error("Test 3 Failed: Missing confirmation buttons");
}

console.log('\nTEST 4: Cancel Workshop 1');
WorkshopReg.unregister(1);
console.log(`Registered for Workshop 1: ${WorkshopReg.isRegistered(1)} (Expected: false)`);
console.log(`Count for Workshop 1: ${WorkshopReg.getRegistrationCount(1)} (Expected: 0)`);
console.log(`Total registrations in storage: ${WorkshopReg.getRegistrations().length} (Expected: 0)`);
if (WorkshopReg.isRegistered(1) || WorkshopReg.getRegistrations().length !== 0) throw new Error("Test 4 Failed");

console.log('\nTEST 5: Multi-workshop registration and isolated cancellation');
WorkshopReg.submit(testWorkshop1, attendee1);
const attendee2 = { name: "Bob Jones", email: "bob@example.com", phone: "555-0288" };
WorkshopReg.submit(testWorkshop2, attendee2);
console.log(`Registrations count: ${WorkshopReg.getRegistrations().length} (Expected: 2)`);
console.log(`WS 1 Registered: ${WorkshopReg.isRegistered(1)}, WS 2 Registered: ${WorkshopReg.isRegistered(2)}`);

// Cancel ONLY Workshop 1
WorkshopReg.unregister(1);
console.log(`After cancelling WS 1:`);
console.log(`  - WS 1 Registered: ${WorkshopReg.isRegistered(1)} (Expected: false)`);
console.log(`  - WS 2 Registered: ${WorkshopReg.isRegistered(2)} (Expected: true)`);
if (WorkshopReg.isRegistered(1) || !WorkshopReg.isRegistered(2)) throw new Error("Test 5 Failed");

console.log('\nTEST 6: Storage Persistence verification');
const savedRaw = localStorage.getItem("workshopRegistrations");
const parsed = JSON.parse(savedRaw);
console.log(`Saved items in localStorage: ${parsed.length} (Expected: 1, only WS 2)`);
console.log(`Remaining workshop ID in localStorage: ${parsed[0].workshopId} (Expected: 2)`);
if (parsed.length !== 1 || parsed[0].workshopId !== 2) throw new Error("Test 6 Failed");

console.log('\nTEST 7: Re-registration test');
WorkshopReg.submit(testWorkshop1, attendee1);
console.log(`Re-registered WS 1: ${WorkshopReg.isRegistered(1)} (Expected: true)`);
console.log(`Total active registrations: ${WorkshopReg.getRegistrations().length} (Expected: 2)`);
if (!WorkshopReg.isRegistered(1) || WorkshopReg.getRegistrations().length !== 2) throw new Error("Test 7 Failed");

console.log('\n🎉 ALL WORKSHOP REGISTRATION & CANCELLATION TESTS PASSED PERFECTLY!');
