const fs = require('fs');

console.log('=== PAGINATION COMPONENT VERIFICATION ===\n');

// 1. Verify JS syntax
try {
  const mainJs = fs.readFileSync('js/main.js', 'utf8');
  new Function(mainJs);
  console.log('[PASS] js/main.js syntax is valid');
} catch (e) {
  console.error('[FAIL] js/main.js syntax error:', e.message);
  process.exit(1);
}

// 2. Test ShopFilter renderPagination output
global.window = {
  matchMedia: () => ({ matches: false, addEventListener: () => {} }),
  location: { pathname: '/shop.html', search: '' },
  scrollTo: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  scrollY: 0
};
function createMockEl() {
  return {
    innerHTML: '',
    value: '',
    style: {},
    querySelectorAll: function() { return []; },
    querySelector: function() { return createMockEl(); },
    classList: { add: function(){}, remove: function(){}, toggle: function(){}, contains: function(){ return false; } },
    setAttribute: function(){},
    getAttribute: function(){ return ''; },
    addEventListener: function(){},
    removeEventListener: function(){},
    focus: function(){},
    blur: function(){}
  };
}

global.document = {
  querySelector: function() { return createMockEl(); },
  querySelectorAll: function() { return []; },
  addEventListener: function() {},
  removeEventListener: function() {},
  getElementById: function() { return createMockEl(); },
  body: { classList: { add: function(){}, remove: function(){}, toggle: function(){}, contains: function(){ return false; } } },
  documentElement: { setAttribute: function(){}, getAttribute: function(){ return 'light'; } }
};
global.localStorage = { getItem: () => null, setItem: () => {} };

const dataJs = fs.readFileSync('js/data.js', 'utf8');
eval(dataJs);

const mainJs = fs.readFileSync('js/main.js', 'utf8');
eval(mainJs);

let capturedHtml = '';
const mockPaginationEl = {
  set innerHTML(val) { capturedHtml = val; },
  get innerHTML() { return capturedHtml; },
  querySelectorAll: function() { return []; }
};

document.querySelector = function(selector) {
  if (selector.includes('pagination')) return mockPaginationEl;
  return null;
};

window.ShopFilter.currentPage = 1;
window.ShopFilter.renderPagination(4);

console.log('\nGenerated Shop Pagination HTML:');
console.log(capturedHtml);

const checks = [
  ['Has 6 list items (Prev, 1, 2, 3, 4, Next)', (capturedHtml.match(/<li/g) || []).length === 6],
  ['Prev is disabled on page 1', capturedHtml.includes('disabled"><a class="page-link" href="#" data-page="0" aria-label="Previous">&laquo;')],
  ['Page 1 is active', capturedHtml.includes('active"><a class="page-link" href="#" data-page="1">1</a>')],
  ['Page 2, 3, 4 present', capturedHtml.includes('data-page="2">2</a>') && capturedHtml.includes('data-page="3">3</a>') && capturedHtml.includes('data-page="4">4</a>')],
  ['Next is enabled on page 1', capturedHtml.includes('<li class="page-item "><a class="page-link" href="#" data-page="2" aria-label="Next">&raquo;</a>')],
];

let shopPass = true;
checks.forEach(([desc, passed]) => {
  if (!passed) shopPass = false;
  console.log(`[${passed ? 'PASS' : 'FAIL'}] ${desc}`);
});

// 3. Verify CSS rules
const css = fs.readFileSync('css/style.css', 'utf8');
const cssChecks = [
  ['.pagination-wrapper exists and centers', css.includes('.pagination-wrapper') && css.includes('display: flex;') && css.includes('justify-content: center;')],
  ['.pagination has flex layout', css.includes('.pagination,') && css.includes('display: flex !important;')],
  ['.pagination has flex-direction: row', css.includes('flex-direction: row !important;')],
  ['.pagination has nowrap', css.includes('flex-wrap: nowrap !important;')],
  ['.pagination is centered', css.includes('justify-content: center !important;') && css.includes('align-items: center !important;')],
  ['.pagination has proper vertical margin and no gap', css.includes('margin: 40px auto 20px !important;') && css.includes('gap: 0 !important;')],
  ['.page-link has centered flex alignment', css.includes('display: flex;') && css.includes('align-items: center;') && css.includes('justify-content: center;')],
  ['.page-link has consistent width and height', css.includes('min-width: 48px;') && css.includes('width: 48px;') && css.includes('height: 44px;') && css.includes('padding: 0;')],
  ['.page-link has continuous margin-left: -1px', css.includes('margin-left: -1px;')],
  ['First child has left rounded corners only', css.includes('border-top-left-radius: var(--radius-sm, 6px) !important;') && css.includes('border-top-right-radius: 0 !important;')],
  ['Last child has right rounded corners only', css.includes('border-top-right-radius: var(--radius-sm, 6px) !important;') && css.includes('border-top-left-radius: 0 !important;')],
  ['Active item has blue background and white text', css.includes('background-color: var(--secondary, #3A7BDE) !important;') && css.includes('color: #ffffff !important;')],
  ['Disabled item has proper cursor and opacity', css.includes('cursor: not-allowed;') && css.includes('pointer-events: none;') && css.includes('opacity: 0.55;')],
  ['Focus state has accessible outline box-shadow', css.includes('box-shadow: 0 0 0 3px rgba(58, 123, 222, 0.25);')],
  ['Dark theme support exists', css.includes('[data-theme="dark"] .pagination .page-link')],
  ['Mobile media query for pagination exists with 38px dimensions', css.includes('min-width: 38px;') && css.includes('width: 38px;') && css.includes('height: 38px;') && css.includes('padding: 0;')],
];

console.log('\nCSS Rules Verification:');
let cssPass = true;
cssChecks.forEach(([desc, passed]) => {
  if (!passed) cssPass = false;
  console.log(`[${passed ? 'PASS' : 'FAIL'}] ${desc}`);
});

// 4. Verify HTML files structure
const shopHtml = fs.readFileSync('shop.html', 'utf8');
const blogHtml = fs.readFileSync('blog.html', 'utf8');

const htmlChecks = [
  ['shop.html has pagination-wrapper', shopHtml.includes('pagination-wrapper')],
  ['shop.html has nav with pagination list', shopHtml.includes('<ul class="pagination shop-pagination justify-content-center mb-0">')],
  ['blog.html has pagination-wrapper', blogHtml.includes('pagination-wrapper')],
];

console.log('\nHTML Structure Verification:');
let htmlPass = true;
htmlChecks.forEach(([desc, passed]) => {
  if (!passed) htmlPass = false;
  console.log(`[${passed ? 'PASS' : 'FAIL'}] ${desc}`);
});

const allPassed = shopPass && cssPass && htmlPass;
console.log('\nFinal Result:', allPassed ? 'ALL VERIFICATION CHECKS PASSED!' : 'SOME CHECKS FAILED!');
process.exit(allPassed ? 0 : 1);
