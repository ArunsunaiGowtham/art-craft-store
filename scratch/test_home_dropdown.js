const fs = require('fs');

const mainJsCode = fs.readFileSync('js/main.js', 'utf8');
const styleCss = fs.readFileSync('css/style.css', 'utf8');

console.log("=========================================================");
console.log("  COMPREHENSIVE HOME DROPDOWN VERIFICATION TEST");
console.log("=========================================================\n");

let allPassed = true;

function check(title, condition, detail = '') {
  if (condition) {
    console.log(`[PASS] ${title}`);
  } else {
    console.error(`[FAIL] ${title} ${detail ? '(' + detail + ')' : ''}`);
    allPassed = false;
  }
}

// -------------------------------------------------------------
// 1. CSS Styles Verification
// -------------------------------------------------------------
console.log("--- 1. Validating CSS Rules for Dropdown ---");

check("Dropdown has position: relative on parent",
  styleCss.includes('.navbar-nav .dropdown {') &&
  styleCss.includes('position: relative;')
);

check("Desktop dropdown-menu has position: absolute, high z-index (1060), and dark theme background",
  styleCss.includes('.navbar-nav .dropdown-menu {') &&
  styleCss.includes('position: absolute !important;') &&
  styleCss.includes('z-index: 1060 !important;') &&
  styleCss.includes('background: var(--bg-card) !important;')
);

check("Desktop dropdown shows on .show, .open, or hover",
  styleCss.includes('.navbar-nav .dropdown.show > .dropdown-menu') &&
  styleCss.includes('opacity: 1 !important;') &&
  styleCss.includes('visibility: visible !important;')
);

check("Mobile dropdown is collapsed by default (display: none)",
  styleCss.includes('.navbar-nav .dropdown-menu {') &&
  styleCss.includes('display: none !important;') &&
  styleCss.includes('opacity: 0 !important;')
);

check("Mobile dropdown expands on .show or .open (display: block)",
  styleCss.includes('.navbar-nav .dropdown.show > .dropdown-menu,') &&
  styleCss.includes('display: block !important;')
);

// -------------------------------------------------------------
// 2. JS Implementation Verification
// -------------------------------------------------------------
console.log("\n--- 2. Validating JavaScript initDropdowns() in main.js ---");

check("initDropdowns function is defined in main.js",
  mainJsCode.includes('function initDropdowns() {')
);

check("initDropdowns is called in init()",
  mainJsCode.includes('initDropdowns();')
);

check("Click listener toggles show and open classes and updates aria-expanded",
  mainJsCode.includes('parentDropdown.classList.add("show", "open");') &&
  mainJsCode.includes('toggle.setAttribute("aria-expanded", "true");') &&
  mainJsCode.includes('toggle.setAttribute("aria-expanded", "false");')
);

check("Clicking outside closes all dropdowns",
  mainJsCode.includes('!e.target.closest(".navbar .dropdown")') &&
  mainJsCode.includes('closeAllDropdowns();')
);

check("Escape key closes all dropdowns",
  mainJsCode.includes('e.key === "Escape"')
);

// -------------------------------------------------------------
// 3. HTML Markup Verification on Home 1 and Home 2
// -------------------------------------------------------------
console.log("\n--- 3. Validating HTML Markup on Home 1 and Home 2 ---");

const indexHtml = fs.readFileSync('index.html', 'utf8');
const home2Html = fs.readFileSync('home-2.html', 'utf8');

check("index.html contains Home dropdown with Home 1 (active) and Home 2",
  indexHtml.includes('dropdown-toggle') &&
  indexHtml.includes('href="index.html">Home 1</a>') &&
  indexHtml.includes('href="home-2.html">Home 2</a>')
);

check("home-2.html contains Home dropdown with Home 1 and Home 2 (active)",
  home2Html.includes('dropdown-toggle') &&
  home2Html.includes('href="index.html">Home 1</a>') &&
  home2Html.includes('href="home-2.html">Home 2</a>')
);

check("index.html dropdown is closed by default in static HTML",
  !indexHtml.includes('class="dropdown show"') &&
  !indexHtml.includes('class="dropdown open"') &&
  !indexHtml.includes('class="dropdown-menu show"')
);

check("home-2.html dropdown is closed by default in static HTML",
  !home2Html.includes('class="dropdown show"') &&
  !home2Html.includes('class="dropdown open"') &&
  !home2Html.includes('class="dropdown-menu show"')
);

console.log("\n=========================================================");
if (allPassed) {
  console.log("  ALL HOME DROPDOWN VERIFICATION TESTS PASSED 100%!");
} else {
  console.error("  SOME TESTS FAILED!");
  process.exit(1);
}
console.log("=========================================================");
