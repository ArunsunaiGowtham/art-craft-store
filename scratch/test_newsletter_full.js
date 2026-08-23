const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log("===============================================================");
console.log("=== NEWSLETTER FORM ALIGNMENT & VALIDATION VERIFICATION ===");
console.log("===============================================================\n");

let allPassed = true;

function check(title, condition, detail = '') {
  if (condition) {
    console.log(`[PASS] ${title}`);
  } else {
    console.error(`[FAIL] ${title} ${detail ? '(' + detail + ')' : ''}`);
    allPassed = false;
  }
}

// -------------------------------------------------------------
// 1. Check CSS Rules in css/style.css
// -------------------------------------------------------------
console.log("--- 1. Validating CSS Styles & Layout Properties ---");
const styleCss = fs.readFileSync('css/style.css', 'utf8');

check("Newsletter section heading and typography defined",
  styleCss.includes('.newsletter-section h2,') &&
  styleCss.includes('font-family: var(--font-heading);') &&
  styleCss.includes('text-align: center;')
);

check("Newsletter form desktop row layout and flex alignment",
  styleCss.includes('.newsletter-form {') &&
  styleCss.includes('flex-direction: row;') &&
  styleCss.includes('align-items: flex-start;') &&
  styleCss.includes('justify-content: center;') &&
  styleCss.includes('gap: 12px;') &&
  styleCss.includes('max-width: 480px;')
);

check("Newsletter input wrap takes available flex width",
  styleCss.includes('.newsletter-form .newsletter-input-wrap {') &&
  styleCss.includes('flex: 1 1 auto;') &&
  styleCss.includes('display: flex;') &&
  styleCss.includes('flex-direction: column;')
);

check("Newsletter input explicit height (48px) and border-radius",
  styleCss.includes('.newsletter-form .form-control {') &&
  styleCss.includes('height: 48px;') &&
  styleCss.includes('border-radius: var(--radius-xl);') &&
  styleCss.includes('box-sizing: border-box;')
);

check("Newsletter Subscribe button matches input height (48px)",
  styleCss.includes('.newsletter-form .btn {') &&
  styleCss.includes('height: 48px;') &&
  styleCss.includes('border-radius: var(--radius-xl);') &&
  styleCss.includes('white-space: nowrap;') &&
  styleCss.includes('box-sizing: border-box;')
);

check("Validation error positioned below input with full width",
  styleCss.includes('.newsletter-form .invalid-feedback,') &&
  styleCss.includes('.newsletter-form .field-error {') &&
  styleCss.includes('display: block !important;') &&
  styleCss.includes('width: 100%;') &&
  styleCss.includes('margin-top: 6px;')
);

check("Mobile responsive styles stack input and button vertically and center button",
  styleCss.includes('@media (max-width: 768px)') &&
  styleCss.includes('flex-direction: column !important;') &&
  styleCss.includes('align-self: center !important;') &&
  styleCss.includes('margin: 0 auto !important;')
);

// -------------------------------------------------------------
// 2. Check HTML Markup across all 12 Stay Creative Pages
// -------------------------------------------------------------
console.log("\n--- 2. Validating HTML Markup Across Pages ---");

const stayCreativePages = [
  'index.html',
  'home-2.html',
  'about.html',
  'blog.html',
  'blog-details.html',
  'brands.html',
  'cart.html',
  'checkout.html',
  'contact.html',
  'login.html',
  'pricing.html',
  'register.html'
];

stayCreativePages.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  const hasStayCreative = content.includes('Stay Creative');
  const hasForm = content.includes('class="newsletter-form"');
  const hasWrap = content.includes('class="newsletter-input-wrap"');
  const hasInput = content.includes('placeholder="Enter your email"');
  const hasButton = content.includes('Subscribe</button>');
  const hasCenteredContainer = content.includes('max-width:600px;') || content.includes('max-width: 600px;');
  
  check(`Page: ${file} markup structure`, 
    hasStayCreative && hasForm && hasWrap && hasInput && hasButton && hasCenteredContainer,
    `hasStayCreative:${hasStayCreative}, hasForm:${hasForm}, hasWrap:${hasWrap}, hasInput:${hasInput}, hasButton:${hasButton}`
  );
});

// Also check shop.html & product-details.html standalone newsletter forms
['shop.html', 'product-details.html'].forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const hasWrap = content.includes('class="newsletter-input-wrap"');
  check(`Page: ${file} input-wrap`, hasWrap);
});

// -------------------------------------------------------------
// 3. Simulated DOM & JS Validation Execution
// -------------------------------------------------------------
console.log("\n--- 3. Testing JavaScript Validation Behavior ---");

function createMockElement(tag, className = '') {
  let classes = new Set(className.split(' ').filter(Boolean));
  let attributes = {};
  let children = [];
  let parentElement = null;

  const el = {
    tagName: tag.toUpperCase(),
    value: '',
    textContent: '',
    style: {},
    get className() { return Array.from(classes).join(' '); },
    set className(val) { classes = new Set(val.split(' ').filter(Boolean)); },
    classList: {
      add: (...cls) => cls.forEach(c => classes.add(c)),
      remove: (...cls) => cls.forEach(c => classes.delete(c)),
      contains: (c) => classes.has(c)
    },
    getAttribute: (attr) => attributes[attr] || null,
    setAttribute: (attr, val) => { attributes[attr] = val; },
    hasAttribute: (attr) => attr in attributes,
    removeAttribute: (attr) => { delete attributes[attr]; },
    appendChild: (child) => {
      child.parentElement = el;
      children.push(child);
      return child;
    },
    remove: () => {
      if (parentElement) {
        parentElement.children = parentElement.children.filter(c => c !== el);
        parentElement = null;
      }
    },
    querySelector: (selector) => {
      // Basic mock selector matching
      for (let child of children) {
        if (selector.includes('.invalid-feedback') && child.classList.contains('invalid-feedback')) return child;
        if (selector.includes('.field-error') && child.classList.contains('field-error')) return child;
        if (selector.includes('input') && child.tagName === 'INPUT') return child;
      }
      return null;
    },
    closest: (selector) => {
      let cur = el.parentElement;
      while (cur) {
        if (selector === '.newsletter-input-wrap' && cur.classList.contains('newsletter-input-wrap')) return cur;
        if (selector === 'form' && cur.tagName === 'FORM') return cur;
        cur = cur.parentElement;
      }
      return null;
    },
    get children() { return children; },
    set children(arr) { children = arr; },
    get parentElement() { return parentElement; },
    set parentElement(p) { parentElement = p; }
  };
  return el;
}

// Build Mock DOM for Newsletter Form
const form = createMockElement('form', 'newsletter-form');
const inputWrap = createMockElement('div', 'newsletter-input-wrap');
const input = createMockElement('input', 'form-control');
input.setAttribute('type', 'email');
input.setAttribute('placeholder', 'Enter your email');
input.setAttribute('required', '');
const button = createMockElement('button', 'btn btn-accent');
button.setAttribute('type', 'submit');

form.appendChild(inputWrap);
inputWrap.appendChild(input);
form.appendChild(button);

// Load main.js validation logic in sandbox
const mainJsCode = fs.readFileSync('js/main.js', 'utf8');

// Test validateField directly by evaluating main.js functions
const mockStorage = {};
const mockDoc = {
  createElement: (tag) => createMockElement(tag),
  addEventListener: () => {},
  removeEventListener: () => {},
  querySelectorAll: () => [],
  querySelector: () => null,
  getElementById: () => null,
  documentElement: { setAttribute: () => {}, getAttribute: () => null }
};
const mockWin = {
  document: mockDoc,
  localStorage: {
    getItem: (k) => mockStorage[k] || null,
    setItem: (k, v) => { mockStorage[k] = v; },
    removeItem: (k) => { delete mockStorage[k]; },
    clear: () => {}
  },
  location: { href: '', pathname: '/' },
  showToast: () => {},
  addEventListener: () => {},
  matchMedia: () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} })
};

const sandbox = {
  window: mockWin,
  document: mockDoc,
  localStorage: mockWin.localStorage,
  location: mockWin.location,
  showToast: () => {},
  console: console
};
vm.createContext(sandbox);

vm.runInContext(mainJsCode, sandbox);

const validateField = sandbox.window.validateField;

// Test A: Empty field validation
input.value = '';
let isValidA = validateField(input);
let errorInWrapA = inputWrap.querySelector('.invalid-feedback');
check("Empty required email triggers validation error", !isValidA);
check("Error element placed inside .newsletter-input-wrap", errorInWrapA !== null);
check("Error text says 'This field is required'", errorInWrapA && errorInWrapA.textContent === 'This field is required');
check("Form direct children count is 2 (inputWrap + button, error not beside button)", form.children.length === 2);

// Test B: Invalid email format validation
input.value = 'not-an-email';
let isValidB = validateField(input);
let errorInWrapB = inputWrap.querySelector('.invalid-feedback');
check("Invalid email string triggers validation error", !isValidB);
check("Error text says 'Please enter a valid email'", errorInWrapB && errorInWrapB.textContent === 'Please enter a valid email');
check("Form direct children count remains 2 (button alignment untouched)", form.children.length === 2);

// Test C: Valid email resolves error
input.value = 'artist@example.com';
let isValidC = validateField(input);
let errorInWrapC = inputWrap.querySelector('.invalid-feedback');
check("Valid email passes validation", isValidC);
check("Error element removed from DOM", errorInWrapC === null);
check("Input has is-valid class", input.classList.contains('is-valid'));

console.log("\n===============================================================");
if (allPassed) {
  console.log("=== ALL NEWSLETTER FORM ALIGNMENT & VALIDATION TESTS PASSED! ===");
} else {
  console.error("=== SOME TESTS FAILED! ===");
  process.exit(1);
}
console.log("===============================================================");
