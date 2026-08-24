const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const styleCss = fs.readFileSync(path.join(rootDir, 'css', 'style.css'), 'utf8');
const variablesCss = fs.readFileSync(path.join(rootDir, 'css', 'variables.css'), 'utf8');
const pricingHtml = fs.readFileSync(path.join(rootDir, 'pricing.html'), 'utf8');
const contactHtml = fs.readFileSync(path.join(rootDir, 'contact.html'), 'utf8');

console.log('=== VERIFYING FAQ ACCORDION ARROW VISIBILITY IN DARK MODE ===\n');

const checks = [
  {
    name: 'variables.css defines light mode accordion icons',
    check: variablesCss.includes('--bs-accordion-btn-icon:') && variablesCss.includes('--bs-accordion-btn-active-icon:')
  },
  {
    name: 'variables.css defines dark mode accordion icons with high-contrast colors (#f0eff4 and #ff8a65)',
    check: variablesCss.includes('[data-theme="dark"]') &&
           variablesCss.includes('fill=\'%23f0eff4\'') &&
           variablesCss.includes('fill=\'%23ff8a65\'')
  },
  {
    name: 'style.css defines dark mode collapsed arrow with high contrast',
    check: styleCss.includes('[data-theme="dark"] .accordion-button::after') &&
           styleCss.includes('fill=\'%23f0eff4\'') &&
           styleCss.includes('opacity: 1 !important;')
  },
  {
    name: 'style.css defines dark mode expanded/active arrow with high contrast',
    check: styleCss.includes('[data-theme="dark"] .accordion-button:not(.collapsed)::after') &&
           styleCss.includes('fill=\'%23ff8a65\'') &&
           styleCss.includes('rotate(-180deg)')
  },
  {
    name: 'style.css custom accordion icon (.accordion-icon) has dark mode styles',
    check: styleCss.includes('[data-theme="dark"] .accordion-icon') &&
           styleCss.includes('[data-theme="dark"] .accordion-item-art.active .accordion-icon')
  },
  {
    name: 'pricing.html FAQ accordion structure intact',
    check: pricingHtml.includes('id="pricingFaqAccordion"') &&
           pricingHtml.includes('data-bs-target="#pricingFaq1"') &&
           pricingHtml.includes('data-bs-target="#pricingFaq6"')
  },
  {
    name: 'contact.html FAQ accordion structure intact',
    check: contactHtml.includes('id="contactFaqAccordion"') &&
           contactHtml.includes('data-bs-target="#contactFaq1"') &&
           contactHtml.includes('data-bs-target="#contactFaq4"')
  }
];

let allPassed = true;
checks.forEach(c => {
  if (c.check) {
    console.log(`  ✅ ${c.name}`);
  } else {
    console.error(`  ❌ ${c.name}`);
    allPassed = false;
  }
});

console.log('\n============================================================');
if (allPassed) {
  console.log('🎉 ALL FAQ ARROW DARK MODE CHECKS PASSED PERFECTLY!');
} else {
  process.exit(1);
}
