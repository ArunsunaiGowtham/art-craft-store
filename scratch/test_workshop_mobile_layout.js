const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const cssContent = fs.readFileSync(path.join(rootDir, 'css', 'style.css'), 'utf8');
const indexContent = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
const mainJsContent = fs.readFileSync(path.join(rootDir, 'js', 'main.js'), 'utf8');
const workshopDetailsContent = fs.readFileSync(path.join(rootDir, 'workshop-details.html'), 'utf8');
const dataContent = fs.readFileSync(path.join(rootDir, 'js', 'data.js'), 'utf8');

// Evaluate AppData
const window = {};
eval(dataContent);
const workshops = window.AppData.workshops;

console.log('=================================================================');
console.log('VERIFYING WORKSHOP CARDS MOBILE LAYOUT & REGISTER BUTTONS');
console.log('=================================================================');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    failed++;
  }
}

// 1. Check CSS definitions for .workshop-card-action-row
assert(cssContent.includes('.workshop-card-action-row'), 'CSS includes .workshop-card-action-row selector');
assert(cssContent.includes('flex-wrap: nowrap !important'), 'CSS enforces flex-wrap: nowrap on workshop card bottom row');
assert(cssContent.includes('justify-content: space-between !important'), 'CSS enforces space-between on workshop card bottom row');
assert(cssContent.includes('.workshop-register-btn'), 'CSS includes .workshop-register-btn selector');

// 2. Check that .btn on mobile does NOT force 100% width on .workshop-register-btn
assert(
  cssContent.includes('.btn:not(.workshop-register-btn)'),
  'CSS @media (max-width: 768px) excludes .workshop-register-btn from full-width expansion'
);

// 3. Check CSS rules for mobile breakpoints (<768px, <480px, <360px)
assert(cssContent.includes('@media (max-width: 480px)'), 'CSS includes max-width 480px responsive breakpoint');
assert(cssContent.includes('@media (max-width: 360px)'), 'CSS includes max-width 360px extra-small mobile breakpoint');

// 4. Verify index.html upcoming workshops cards
console.log('\n--- Checking index.html Workshop Cards ---');
const indexCardMatches = indexContent.match(/class="[^"]*workshop-card-action-row[^"]*"/g) || [];
assert(indexCardMatches.length === 3, `index.html has 3 workshop cards with .workshop-card-action-row (Found: ${indexCardMatches.length})`);

const indexRegisterButtons = indexContent.match(/class="[^"]*workshop-register-btn[^"]*"/g) || [];
assert(indexRegisterButtons.length === 3, `index.html has 3 .workshop-register-btn buttons (Found: ${indexRegisterButtons.length})`);

const indexPriceWraps = indexContent.match(/class="[^"]*workshop-card-price-wrap[^"]*"/g) || [];
assert(indexPriceWraps.length === 3, `index.html has 3 .workshop-card-price-wrap elements (Found: ${indexPriceWraps.length})`);

// 5. Verify js/main.js workshop card template for workshops.html
console.log('\n--- Checking js/main.js Workshops Rendering ---');
assert(mainJsContent.includes('class="workshop-card-action-row'), 'main.js workshop template includes .workshop-card-action-row');
assert(mainJsContent.includes('class="workshop-card-price-wrap'), 'main.js workshop template includes .workshop-card-price-wrap');
assert(mainJsContent.includes('class="btn btn-primary btn-sm workshop-register-btn"'), 'main.js workshop template includes .workshop-register-btn');

// 6. Verify workshop-details.html related workshops
console.log('\n--- Checking workshop-details.html Related Cards ---');
assert(workshopDetailsContent.includes('workshop-card-action-row'), 'workshop-details.html includes .workshop-card-action-row');
assert(workshopDetailsContent.includes('workshop-card-price-wrap'), 'workshop-details.html includes .workshop-card-price-wrap');
assert(workshopDetailsContent.includes('workshop-register-btn'), 'workshop-details.html includes .workshop-register-btn');

// 7. Check all 12 workshops in AppData
console.log('\n--- Checking all 12 workshops from AppData ---');
assert(workshops.length === 12, `Total workshops is 12 (Found: ${workshops.length})`);

workshops.forEach((w) => {
  assert(w.id && w.title && w.price, `Workshop #${w.id} ("${w.title}") has valid title and price $${w.price}`);
});

console.log('\n=================================================================');
console.log(`TOTAL RESULTS: ${passed} passed, ${failed} failed.`);
console.log('=================================================================');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL WORKSHOP MOBILE LAYOUT & OVERLAP CHECKS PASSED PERFECTLY!');
}
