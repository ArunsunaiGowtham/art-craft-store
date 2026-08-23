const fs = require('fs');

console.log('=== PROFESSIONAL PRICING CARD & POPULAR BADGE VERIFICATION ===\n');

// 1. Check pricing.html
const pricingHtml = fs.readFileSync('pricing.html', 'utf8');

const htmlChecks = [
  ['Professional card has pricing-card and popular classes', pricingHtml.includes('pricing-card popular')],
  ['Professional card has orange border: 2px solid var(--primary)', pricingHtml.includes('border:2px solid var(--primary);')],
  ['Professional card has position:relative and overflow:visible', pricingHtml.includes('overflow:visible;') && pricingHtml.includes('position:relative;')],
  ['Popular badge exists with text "Most Popular"', pricingHtml.includes('class="popular-badge">Most Popular</div>')],
  ['Professional title is present', pricingHtml.includes('<h3 class="card-title">Professional</h3>')],
  ['Starter card is intact with title and features', pricingHtml.includes('<h3 class="card-title">Starter</h3>') && pricingHtml.includes('Access to basic workshops')],
  ['Workshop Bundle card is intact with title and features', pricingHtml.includes('<h3 class="card-title">Workshop Bundle</h3>') && pricingHtml.includes('30% store discount')],
  ['Prices and /month present on all 3 cards', pricingHtml.includes('$29') && pricingHtml.includes('$79') && pricingHtml.includes('$149') && (pricingHtml.match(/\/month/g) || []).length >= 3],
];

let htmlPass = true;
console.log('HTML Markup Checks:');
htmlChecks.forEach(([desc, passed]) => {
  if (!passed) htmlPass = false;
  console.log(`[${passed ? 'PASS' : 'FAIL'}] ${desc}`);
});

// 2. Check css/style.css
const styleCss = fs.readFileSync('css/style.css', 'utf8');

const cssChecks = [
  ['.pricing-card has position: relative and overflow: visible', styleCss.includes('.pricing-card {') && styleCss.includes('overflow: visible;')],
  ['.pricing-card.popular has border: 2px solid var(--primary)', styleCss.includes('.pricing-card.popular {') && styleCss.includes('border: 2px solid var(--primary')],
  ['.popular-badge is positioned absolute with top: -14px', styleCss.includes('.popular-badge {') && styleCss.includes('position: absolute;') && styleCss.includes('top: -14px;')],
  ['.popular-badge is centered with left: 50% and transform: translateX(-50%)', styleCss.includes('left: 50%;') && styleCss.includes('transform: translateX(-50%);')],
  ['.popular-badge has z-index: 5 for top layer rendering', styleCss.includes('z-index: 5;')],
  ['.popular-badge has orange background and white text', styleCss.includes('background: var(--primary') && styleCss.includes('color: #ffffff;')],
  ['.popular-badge has white-space: nowrap', styleCss.includes('white-space: nowrap;')],
  ['.pricing-card.popular .card-body has top padding to accommodate badge cleanly', styleCss.includes('.pricing-card.popular .card-body') && styleCss.includes('padding-top:')],
  ['Dark theme support for popular card and badge exists', styleCss.includes('[data-theme="dark"] .pricing-card.popular') && styleCss.includes('[data-theme="dark"] .popular-badge')],
];

console.log('\nCSS Styling Checks:');
let cssPass = true;
cssChecks.forEach(([desc, passed]) => {
  if (!passed) cssPass = false;
  console.log(`[${passed ? 'PASS' : 'FAIL'}] ${desc}`);
});

const allPassed = htmlPass && cssPass;
console.log('\nFinal Result:', allPassed ? 'ALL POPULAR BADGE & CARD CHECKS PASSED!' : 'SOME CHECKS FAILED!');
process.exit(allPassed ? 0 : 1);
