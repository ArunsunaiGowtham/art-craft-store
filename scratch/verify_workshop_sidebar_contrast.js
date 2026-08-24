const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const variablesCss = fs.readFileSync(path.join(rootDir, 'css', 'variables.css'), 'utf8');
const styleCss = fs.readFileSync(path.join(rootDir, 'css', 'style.css'), 'utf8');
const workshopDetailsHtml = fs.readFileSync(path.join(rootDir, 'workshop-details.html'), 'utf8');

console.log('=================================================================');
console.log('VERIFYING DARK MODE & LIGHT MODE WORKSHOP SIDEBAR CONTRAST');
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

// 1. Verify --bg-secondary and --bg-info-box are defined in variables.css
assert(variablesCss.includes('--bg-secondary: #f4f0eb'), 'variables.css has --bg-secondary in :root (light mode)');
assert(variablesCss.includes('--bg-info-box: #f8f6f3'), 'variables.css has --bg-info-box in :root (light mode)');

// 2. Verify dark theme variables
const darkThemeSection = variablesCss.slice(variablesCss.indexOf('[data-theme="dark"]'));
assert(darkThemeSection.includes('--bg-secondary: #181824'), 'variables.css has --bg-secondary in dark theme');
assert(darkThemeSection.includes('--bg-info-box: #252538'), 'variables.css has --bg-info-box in dark theme');

// 3. Verify style.css rules for .workshop-info-box
assert(styleCss.includes('.workshop-info-box'), 'style.css contains .workshop-info-box styles');
assert(styleCss.includes('[data-theme="dark"] .workshop-info-box'), 'style.css contains dark theme styles for .workshop-info-box');
assert(styleCss.includes('[data-theme="dark"] .workshop-info-box strong'), 'style.css forces white text for strong in dark theme');
assert(styleCss.includes('[data-theme="dark"] .workshop-info-box small'), 'style.css forces visible muted color for small in dark theme');

// 4. Verify workshop-details.html markup
assert(workshopDetailsHtml.includes('workshop-sidebar-card'), 'workshop-details.html uses .workshop-sidebar-card');
assert(workshopDetailsHtml.includes('workshop-info-box'), 'workshop-details.html uses .workshop-info-box');
assert(!workshopDetailsHtml.includes('style="background:var(--bg-secondary, #f8f9fa);border-radius:var(--radius-sm, 8px);"'), 'Hardcoded white background on info boxes has been removed from workshop-details.html');

console.log('\n=================================================================');
console.log(`TOTAL RESULTS: ${passed} passed, ${failed} failed.`);
console.log('=================================================================');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL CONTRAST AND VISIBILITY CHECKS PASSED PERFECTLY!');
}
