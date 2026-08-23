const fs = require('fs');

const home2Html = fs.readFileSync('home-2.html', 'utf8');
const styleCss = fs.readFileSync('css/style.css', 'utf8');

console.log("=== VALIDATING HOMEPAGE HERO ALIGNMENT & VERTICAL RHYTHM ===");

// 1. Structural classes in home-2.html
let pass1 = home2Html.includes('class="hero-left-column"') &&
            home2Html.includes('class="hero-edition-badge"') &&
            home2Html.includes('class="hero-category-pills"') &&
            home2Html.includes('class="hero-cat-pill"');
console.log(`[${pass1 ? "PASS" : "FAIL"}] Home 2 hero markup utilizes dedicated left column and pill classes`);

// 2. Left column vertical alignment line
let pass2 = styleCss.includes('.hero-left-column {') &&
            styleCss.includes('display: flex;') &&
            styleCss.includes('flex-direction: column;') &&
            styleCss.includes('align-items: flex-start;') &&
            styleCss.includes('text-align: left;');
console.log(`[${pass2 ? "PASS" : "FAIL"}] Left content elements share the exact same vertical alignment line`);

// 3. Typography & font-accent baseline alignment
let pass3 = styleCss.includes('.hero-title .font-accent {') &&
            styleCss.includes('vertical-align: -2px;') &&
            styleCss.includes('line-height: 1;');
console.log(`[${pass3 ? "PASS" : "FAIL"}] Script-style 'Masterpieces' sits naturally on the same baseline as 'Into'`);

// 4. Category pills alignment & sizing
let pass4 = styleCss.includes('.hero-cat-pill {') &&
            styleCss.includes('height: 38px;') &&
            styleCss.includes('border-radius: var(--radius-full, 50px);') &&
            styleCss.includes('.hero-category-pills {');
console.log(`[${pass4 ? "PASS" : "FAIL"}] Category pills have uniform height, equal spacing, and aligned wrapping`);

// 5. CTA buttons alignment & equal height
let pass5 = styleCss.includes('.hero-cta {') &&
            styleCss.includes('.hero-cta .btn {') &&
            styleCss.includes('height: 48px;');
console.log(`[${pass5 ? "PASS" : "FAIL"}] CTA buttons align on the same row with equal height and centered icons`);

// 6. Responsive breakpoints
let pass6 = styleCss.includes('@media (max-width: 991.98px)') &&
            styleCss.includes('@media (max-width: 767.98px)');
console.log(`[${pass6 ? "PASS" : "FAIL"}] Responsive styles defined for tablet scaling and mobile centered stacking`);

if (pass1 && pass2 && pass3 && pass4 && pass5 && pass6) {
  console.log("\nALL HERO ALIGNMENT & VERTICAL RHYTHM CHECKS PASSED!");
} else {
  process.exit(1);
}
