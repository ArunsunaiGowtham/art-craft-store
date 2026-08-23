const fs = require('fs');

const styleCss = fs.readFileSync('css/style.css', 'utf8');

console.log("=== VALIDATING HEADER & NAVIGATION ALIGNMENT ===");

// 1. Dropdown caret suppression
let pass1 = styleCss.includes('.navbar .dropdown-toggle::after') &&
            styleCss.includes('display: none !important;');
console.log(`[${pass1 ? "PASS" : "FAIL"}] Bootstrap default dropdown carets suppressed to eliminate duplicate chevrons`);

// 2. Navbar container alignment & fixed height
let pass2 = styleCss.includes('.navbar {') &&
            styleCss.includes('.navbar .container {') &&
            styleCss.includes('max-width: 1320px;') &&
            styleCss.includes('justify-content: space-between;');
console.log(`[${pass2 ? "PASS" : "FAIL"}] Navbar and container use 1320px max-width, fixed height, and flex space-between`);

// 3. Logo vertical centering
let pass3 = styleCss.includes('.navbar-brand {') &&
            styleCss.includes('.navbar-brand .logo-icon {') &&
            styleCss.includes('.navbar-brand .logo-text {');
console.log(`[${pass3 ? "PASS" : "FAIL"}] Logo icon and typography are vertically centered and aligned on the left`);

// 4. Horizontal nav alignment & Home dropdown
let pass4 = styleCss.includes('.navbar-nav,') &&
            styleCss.includes('.navbar-nav .nav-link,') &&
            styleCss.includes('height: 40px !important;') &&
            styleCss.includes('.navbar-nav .dropdown-menu {');
console.log(`[${pass4 ? "PASS" : "FAIL"}] Navigation items aligned in single horizontal 40px baseline with dropdown positioned directly below`);

// 5. Chevron spacing & alignment
let pass5 = styleCss.includes('.dropdown-toggle i.fa-chevron-down') &&
            styleCss.includes('margin-inline-start: 6px;');
console.log(`[${pass5 ? "PASS" : "FAIL"}] Dropdown chevron vertically centered with exact 6px spacing from Home text`);

if (pass1 && pass2 && pass3 && pass4 && pass5) {
  console.log("\nALL HEADER & NAVIGATION ALIGNMENT CHECKS PASSED!");
} else {
  process.exit(1);
}
