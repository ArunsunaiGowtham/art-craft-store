const fs = require('fs');

const mainJs = fs.readFileSync('js/main.js', 'utf8');

console.log("==================================================");
console.log("  CHECKING ALL JAVASCRIPT HANDLERS IN js/main.js");
console.log("==================================================");

const features = [
  { name: "initMobileNav", regex: /function initMobileNav\s*\(/ },
  { name: "initThemeToggle", regex: /function initThemeToggle\s*\(/ },
  { name: "initRTL", regex: /function initRTL\s*\(/ },
  { name: "initSearchOverlay", regex: /function initSearchOverlay\s*\(/ },
  { name: "initBackToTop", regex: /function initBackToTop\s*\(/ },
  { name: "initCart", regex: /function initCart\s*\(|window\.ArtCraftCart/ },
  { name: "initQuickView", regex: /function initQuickView\s*\(/ },
  { name: "initProductFilters", regex: /function initProductFilters\s*\(/ },
  { name: "initWorkshopBooking", regex: /function initWorkshopBooking\s*\(|initWorkshops/ },
  { name: "initNewsletter", regex: /function initNewsletter\s*\(/ },
  { name: "initCheckout", regex: /function initCheckout\s*\(/ },
  { name: "initAuth", regex: /function initAuth\s*\(|initPasswordToggle/ }
];

features.forEach(f => {
  if (f.regex.test(mainJs)) {
    console.log(`✓ Handler exists: ${f.name}`);
  } else {
    console.error(`✗ Handler MISSING: ${f.name}`);
  }
});
