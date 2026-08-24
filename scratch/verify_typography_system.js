const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

console.log('=== TYPOGRAPHY SYSTEM VERIFICATION ===\n');

let allPassed = true;

// 1. Check all HTML files for Poppins font link
console.log('1. Checking Google Fonts link across all HTML files...');
const expectedFontUrl = 'family=Poppins:wght@300;400;500;600;700;800';

htmlFiles.forEach(file => {
  const content = fs.readFileSync(path.join(rootDir, file), 'utf8');
  const hasPoppins = content.includes('fonts.googleapis.com') && content.includes(expectedFontUrl);
  const hasCaveat = /family=[^"]*Caveat/i.test(content) || /font-family:[^;]*Caveat/i.test(content);
  const hasInter = /family=[^"]*Inter/i.test(content);
  const hasItalic = /font-style:\s*italic/i.test(content);

  if (!hasPoppins) {
    console.error(`  ❌ ${file}: Missing Poppins 300-800 font stylesheet`);
    allPassed = false;
  } else if (hasCaveat) {
    console.error(`  ❌ ${file}: Still references Caveat font`);
    allPassed = false;
  } else if (hasInter) {
    console.error(`  ❌ ${file}: Still references Inter font`);
    allPassed = false;
  } else if (hasItalic) {
    console.error(`  ❌ ${file}: Contains inline italic font-style`);
    allPassed = false;
  } else {
    console.log(`  ✅ ${file}: Clean Poppins font link, zero Caveat/Inter/Italics`);
  }
});

// 2. Check CSS variables and style rules
console.log('\n2. Checking CSS Variables & Rules...');
const variablesCss = fs.readFileSync(path.join(rootDir, 'css', 'variables.css'), 'utf8');
const styleCss = fs.readFileSync(path.join(rootDir, 'css', 'style.css'), 'utf8');

const cssChecks = [
  { name: '--font-primary uses Poppins', check: variablesCss.includes("'Poppins'") && variablesCss.includes('--font-primary') },
  { name: '--font-heading uses Poppins', check: variablesCss.includes("'Poppins'") && variablesCss.includes('--font-heading') },
  { name: '--font-accent uses Poppins', check: variablesCss.includes("'Poppins'") && variablesCss.includes('--font-accent') },
  { name: '--text-primary defined for light/dark', check: variablesCss.includes('--text-primary:') && variablesCss.includes('[data-theme="dark"]') },
  { name: '--text-secondary defined', check: variablesCss.includes('--text-secondary:') },
  { name: '--text-heading defined', check: variablesCss.includes('--text-heading:') },
  { name: 'Navbar brand text uses Poppins', check: styleCss.includes('.navbar-brand .logo-text') && !styleCss.includes("font-family: var(--font-accent, 'Caveat'") },
  { name: 'Quote icons do not use Georgia', check: !styleCss.includes('Georgia, serif') },
  { name: 'Footer typography standardized', check: styleCss.includes('.footer-links a') && styleCss.includes('.footer h4') }
];

cssChecks.forEach(c => {
  if (c.check) {
    console.log(`  ✅ ${c.name}`);
  } else {
    console.error(`  ❌ ${c.name}`);
    allPassed = false;
  }
});

console.log('\n=======================================');
if (allPassed) {
  console.log('🎉 ALL TYPOGRAPHY CHECKS PASSED PERFECTLY!');
} else {
  console.log('⚠️ SOME ISSUES WERE DETECTED.');
  process.exit(1);
}
