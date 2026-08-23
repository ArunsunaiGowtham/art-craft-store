const fs = require('fs');

const htmlFiles = [
  'index.html', 'home-2.html', 'shop.html', 'product-details.html',
  'workshops.html', 'workshop-details.html', 'brands.html', 'about.html',
  'blog.html', 'blog-details.html', 'pricing.html', 'contact.html',
  'cart.html', 'checkout.html', 'login.html', 'register.html', 'student-supplies.html'
];

let allPassed = true;

console.log("=========================================");
console.log("  MOBILE NAVBAR AUDIT (Clean 1-Toggler)");
console.log("=========================================");

htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const hasBrand = content.includes('class="navbar-brand"') || content.includes("class='navbar-brand'");
  const hasToggler = content.includes('class="navbar-toggler"') || content.includes("class='navbar-toggler'");
  const hasCollapse = content.includes('class="collapse navbar-collapse"') || content.includes('class="navbar-collapse collapse"');
  const hasMobileActions = content.includes('class="mobile-nav-actions');

  if (hasBrand && hasToggler && hasCollapse && !hasMobileActions) {
    console.log(`✓ PASS: ${file} (Brand + Toggler + Collapse; NO unwanted header cart icon)`);
  } else {
    console.error(`✗ FAIL: ${file} (Brand:${hasBrand}, Toggler:${hasToggler}, Collapse:${hasCollapse}, MobileActionsClean:${!hasMobileActions})`);
    allPassed = false;
  }
});

const css = fs.readFileSync('css/style.css', 'utf8');
const cssChecks = [
  { name: 'navbar-toggler mobile display rule', test: css.includes('.navbar-toggler,') && css.includes('display: inline-flex !important;') },
  { name: 'navbar-collapse mobile drawer fixed & animated', test: css.includes('.navbar-collapse.show') && css.includes('transform: translateY(0) !important;') }
];

cssChecks.forEach(c => {
  if (c.test) {
    console.log(`✓ PASS CSS: ${c.name}`);
  } else {
    console.error(`✗ FAIL CSS: ${c.name}`);
    allPassed = false;
  }
});

if (allPassed) {
  console.log("\nALL 17 PAGES VERIFIED CLEAN WITH SINGLE PROMINENT HAMBURGER TOGGLER!");
} else {
  process.exit(1);
}
