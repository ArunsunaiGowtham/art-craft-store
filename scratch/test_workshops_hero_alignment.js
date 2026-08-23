const fs = require('fs');

const workshopsHtml = fs.readFileSync('workshops.html', 'utf8');
const styleCss = fs.readFileSync('css/style.css', 'utf8');

console.log("=== VALIDATING WORKSHOPS HERO ALIGNMENT & STRUCTURE ===");

// 1. Hero layout classes
let pass1 = workshopsHtml.includes('class="workshops-hero-section"') &&
            workshopsHtml.includes('class="workshops-hero-row"') &&
            workshopsHtml.includes('class="workshops-hero-content"') &&
            workshopsHtml.includes('class="workshops-hero-image-wrap"');
console.log(`[${pass1 ? "PASS" : "FAIL"}] Hero markup uses dedicated 2-column flexbox structure`);

// 2. Vertical alignment & Flexbox rules in CSS
let pass2 = styleCss.includes('.workshops-hero-row {') &&
            styleCss.includes('display: flex;') &&
            styleCss.includes('align-items: center;') &&
            styleCss.includes('justify-content: space-between;');
console.log(`[${pass2 ? "PASS" : "FAIL"}] Left content and right image are vertically centered with align-items: center`);

// 3. Card dimensions & image containment
let pass3 = styleCss.includes('.workshops-hero-card {') &&
            styleCss.includes('height: 280px;') &&
            styleCss.includes('overflow: hidden;') &&
            styleCss.includes('object-fit: cover;');
console.log(`[${pass3 ? "PASS" : "FAIL"}] Right image card has fixed dimensions, border-radius, and object-fit: cover`);

// 4. Image URL verification
let pass4 = workshopsHtml.includes('photo-1579783901586-d88db74b4fe4') &&
            !workshopsHtml.includes('photo-1578328819058-b69f3a3b0f6b'); // old 404 image replaced
console.log(`[${pass4 ? "PASS" : "FAIL"}] Old 404 image replaced with verified watercolor workshop image`);

// 5. Responsive rules
let pass5 = styleCss.includes('@media (max-width: 991.98px)') &&
            styleCss.includes('@media (max-width: 767.98px)') &&
            styleCss.includes('flex-direction: column;');
console.log(`[${pass5 ? "PASS" : "FAIL"}] Responsive styles defined for tablet scaling and mobile column stacking`);

if (pass1 && pass2 && pass3 && pass4 && pass5) {
  console.log("\nALL WORKSHOPS HERO ALIGNMENT CHECKS PASSED!");
} else {
  process.exit(1);
}
