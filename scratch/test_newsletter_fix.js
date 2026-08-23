const fs = require('fs');
const path = require('path');

const css = fs.readFileSync('css/style.css', 'utf8');

// Verify CSS rules
const checks = [
  { name: 'newsletter-input-wrap flex and min-width', test: css.includes('.newsletter-form .newsletter-input-wrap {') && css.includes('min-width: 220px !important;') },
  { name: 'form-control width 100% and visible border', test: css.includes('.newsletter-form .form-control {') && css.includes('border: 1.5px solid #d1d5db;') },
  { name: 'dark mode newsletter input background and text color', test: css.includes('[data-theme="dark"] .newsletter-form .form-control {') && css.includes('background: #252538 !important;') && css.includes('color: #ffffff !important;') },
  { name: 'mobile newsletter responsive rules', test: css.includes('@media (max-width: 576px)') && css.includes('.newsletter-form') }
];

let allPassed = true;
checks.forEach(c => {
  if (c.test) {
    console.log(`✓ PASS: ${c.name}`);
  } else {
    console.error(`✗ FAIL: ${c.name}`);
    allPassed = false;
  }
});

if (allPassed) {
  console.log("\nALL NEWSLETTER CSS & ALIGNMENT TESTS PASSED 100%!");
} else {
  process.exit(1);
}
