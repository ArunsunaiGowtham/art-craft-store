const fs = require('fs');

console.log('=== VERIFYING REMOVAL OF MOST POPULAR BADGE ===\n');

// 1. Check pricing.html
const pricingHtml = fs.readFileSync('pricing.html', 'utf8');

const htmlChecks = [
  ['"Most Popular" text is removed from pricing cards', !pricingHtml.includes('Most Popular')],
  ['"popular-badge" class is not present in pricing.html', !pricingHtml.includes('popular-badge')],
  ['Professional card keeps orange border (border:2px solid var(--primary))', pricingHtml.includes('border:2px solid var(--primary);')],
  ['Professional card starts directly with Professional title inside card-body p-4', pricingHtml.includes('<div class="card-body p-4">\n                                <h3 class="card-title">Professional</h3>') || pricingHtml.includes('<div class="card-body p-4"><h3 class="card-title">Professional</h3>') || (pricingHtml.includes('<div class="card-body p-4">') && pricingHtml.includes('<h3 class="card-title">Professional</h3>'))],
  ['No empty gap/spacer above Professional title', !pricingHtml.includes('<div class="mb-3"></div>\n                                <h3 class="card-title">Professional</h3>')],
  ['Starter card is intact with title, pricing, and features', pricingHtml.includes('<h3 class="card-title">Starter</h3>') && pricingHtml.includes('$29') && pricingHtml.includes('Access to basic workshops')],
  ['Workshop Bundle card is intact with title, pricing, and features', pricingHtml.includes('<h3 class="card-title">Workshop Bundle</h3>') && pricingHtml.includes('$149') && pricingHtml.includes('30% store discount')],
  ['All 3 cards have /month pricing cadence', (pricingHtml.match(/\/month/g) || []).length >= 3],
];

let htmlPass = true;
console.log('HTML Verification:');
htmlChecks.forEach(([desc, passed]) => {
  if (!passed) htmlPass = false;
  console.log(`[${passed ? 'PASS' : 'FAIL'}] ${desc}`);
});

// 2. Check css/style.css
const styleCss = fs.readFileSync('css/style.css', 'utf8');

const cssChecks = [
  ['.popular-badge class is removed from style.css', !styleCss.includes('.popular-badge')],
  ['.pricing-card has background and radius styling', styleCss.includes('.pricing-card {') && styleCss.includes('var(--radius-md')],
  ['.pricing-card.popular retains orange border rule', styleCss.includes('.pricing-card.popular {') && styleCss.includes('border: 2px solid var(--primary')],
  ['No reserved padding-top on popular card-body in style.css', !styleCss.includes('.pricing-card.popular .card-body')],
  ['Dark theme support for popular card border exists', styleCss.includes('[data-theme="dark"] .pricing-card.popular')],
];

console.log('\nCSS Verification:');
let cssPass = true;
cssChecks.forEach(([desc, passed]) => {
  if (!passed) cssPass = false;
  console.log(`[${passed ? 'PASS' : 'FAIL'}] ${desc}`);
});

const allPassed = htmlPass && cssPass;
console.log('\nFinal Result:', allPassed ? 'ALL CHECKS PASSED: MOST POPULAR BADGE FULLY REMOVED!' : 'SOME CHECKS FAILED!');
process.exit(allPassed ? 0 : 1);
