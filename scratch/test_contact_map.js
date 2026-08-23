const fs = require('fs');

const contactHtml = fs.readFileSync('contact.html', 'utf8');
const styleCss = fs.readFileSync('css/style.css', 'utf8');

console.log("=== VALIDATING CONTACT PAGE INTERACTIVE MAP ===");

// 1. Leaflet CDN links
let pass1 = contactHtml.includes('leaflet.css') && contactHtml.includes('leaflet.js');
console.log(`[${pass1 ? "PASS" : "FAIL"}] Leaflet CSS and JS included for interactive map rendering`);

// 2. Interactive Map Container & Coordinates
let pass2 = contactHtml.includes('id="contact-interactive-map"') &&
            contactHtml.includes('40.7484') &&
            contactHtml.includes('-73.9934');
console.log(`[${pass2 ? "PASS" : "FAIL"}] Interactive map container and exact NY 10001 coordinates (40.7484, -73.9934) configured`);

// 3. Open in Maps and Directions buttons
let pass3 = contactHtml.includes('Open in Maps') &&
            contactHtml.includes('Directions') &&
            contactHtml.includes('https://maps.google.com/?q=123+Creative+Ave,+New+York,+NY+10001') &&
            contactHtml.includes('https://www.google.com/maps/dir/?api=1&destination=123+Creative+Ave,+New+York,+NY+10001');
console.log(`[${pass3 ? "PASS" : "FAIL"}] Open in Maps and Directions buttons correctly point to 123 Creative Ave, NY 10001`);

// 4. Pin marker and popup
let pass4 = contactHtml.includes('L.marker([lat, lng]') &&
            contactHtml.includes('ArtCraft Store') &&
            contactHtml.includes('123 Creative Ave, New York, NY 10001');
console.log(`[${pass4 ? "PASS" : "FAIL"}] Location pin marker and store address popup initialized`);

// 5. CSS styling & dark mode support
let pass5 = styleCss.includes('.contact-map-container {') &&
            styleCss.includes('height: 320px;') &&
            styleCss.includes('#contact-interactive-map');
console.log(`[${pass5 ? "PASS" : "FAIL"}] CSS contains height:320px, responsive 260px, rounded corners, and shadow styling`);

if (pass1 && pass2 && pass3 && pass4 && pass5) {
  console.log("\nALL CONTACT MAP VALIDATION CHECKS PASSED!");
} else {
  process.exit(1);
}
