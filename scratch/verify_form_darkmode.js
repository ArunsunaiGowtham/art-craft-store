const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const styleCss = fs.readFileSync(path.join(rootDir, 'css', 'style.css'), 'utf8');
const variablesCss = fs.readFileSync(path.join(rootDir, 'css', 'variables.css'), 'utf8');

console.log('=== VERIFYING DARK MODE INPUT STYLES ===\n');

const checks = [
  { name: 'variables.css has --bs-body-color in light mode', check: variablesCss.includes('--bs-body-color: var(--text-primary);') },
  { name: 'variables.css has --bs-body-color in dark mode', check: variablesCss.includes('[data-theme="dark"]') && variablesCss.includes('--bs-body-color: var(--text-primary);') },
  { name: 'style.css form-control has !important color', check: styleCss.includes('.form-control') && styleCss.includes('color: var(--text-primary) !important;') },
  { name: 'style.css form-control:focus has !important color', check: styleCss.includes('.form-control:focus') && styleCss.includes('color: var(--text-primary) !important;') },
  { name: 'style.css [data-theme="dark"] form-control has light text color', check: styleCss.includes('[data-theme="dark"] .form-control') && styleCss.includes('color: #f0eff4 !important;') },
  { name: 'style.css [data-theme="dark"] form-control:focus has pure white text', check: styleCss.includes('[data-theme="dark"] .form-control:focus') && styleCss.includes('color: #ffffff !important;') },
  { name: 'style.css dark placeholder has high-contrast muted color', check: styleCss.includes('[data-theme="dark"] .form-control::placeholder') && styleCss.includes('color: #9e9eb8 !important;') }
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

console.log('\n=======================================');
if (allPassed) {
  console.log('🎉 ALL FORM DARK MODE CONTRAST CHECKS PASSED!');
} else {
  process.exit(1);
}
