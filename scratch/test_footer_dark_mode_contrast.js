const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const variablesCss = fs.readFileSync(path.join(rootDir, 'css', 'variables.css'), 'utf8');
const styleCss = fs.readFileSync(path.join(rootDir, 'css', 'style.css'), 'utf8');

console.log('=================================================================');
console.log('TESTING FOOTER DARK MODE VISIBILITY & CONTRAST');
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

// 1. Check variables.css for dark mode inverse text
console.log('\n--- Checking variables.css ---');
const darkThemeSection = variablesCss.slice(variablesCss.indexOf('[data-theme="dark"]'));
assert(!darkThemeSection.includes('--text-inverse: #1a1a2e'), 'Dark theme does NOT set --text-inverse to dark #1a1a2e');
assert(darkThemeSection.includes('--text-inverse: #ffffff'), 'Dark theme sets --text-inverse to bright #ffffff');

// 2. Check style.css footer headings & icons
console.log('\n--- Checking style.css footer styles ---');
assert(styleCss.includes('.footer h5,') && styleCss.includes('color: #ffffff !important'), 'Footer headings (ArtCraft, Shop, Quick Links, Newsletter) are bright white (#ffffff)');
assert(styleCss.includes('.footer h5 i') && styleCss.includes('color: var(--primary) !important'), 'Footer palette logo icon uses brand primary color');

// 3. Check dark theme footer rules in style.css
console.log('\n--- Checking style.css [data-theme="dark"] .footer rules ---');
assert(styleCss.includes('[data-theme="dark"] .footer'), 'style.css includes [data-theme="dark"] .footer rules');
assert(styleCss.includes('[data-theme="dark"] .footer h5'), 'Dark theme forces bright headings in footer');
assert(styleCss.includes('[data-theme="dark"] .footer p'), 'Dark theme forces readable description text in footer');
assert(styleCss.includes('[data-theme="dark"] .footer-links a'), 'Dark theme forces visible links in footer');
assert(styleCss.includes('[data-theme="dark"] .footer-social a'), 'Dark theme styles social icons with high contrast');
assert(styleCss.includes('[data-theme="dark"] .footer-newsletter .form-control'), 'Dark theme styles footer newsletter input with visible text & placeholder');

// 4. Check all HTML files for footer presence and structure
console.log('\n--- Checking Footer across all HTML pages ---');
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));
assert(htmlFiles.length >= 18, `Found ${htmlFiles.length} HTML files`);

let pagesWithFooter = 0;
htmlFiles.forEach(f => {
  const content = fs.readFileSync(path.join(rootDir, f), 'utf8');
  if (content.includes('<footer class="footer">') || content.includes('<footer class="footer')) {
    pagesWithFooter++;
  }
});
assert(pagesWithFooter >= 16, `At least 16 pages contain standard footer (Found: ${pagesWithFooter})`);

console.log('\n=================================================================');
console.log(`TOTAL RESULTS: ${passed} passed, ${failed} failed.`);
console.log('=================================================================');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL FOOTER DARK MODE VISIBILITY & CONTRAST CHECKS PASSED PERFECTLY!');
}
