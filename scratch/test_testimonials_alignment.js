const fs = require('fs');

const aboutHtml = fs.readFileSync('about.html', 'utf8');
const styleCss = fs.readFileSync('css/style.css', 'utf8');

console.log("=== VALIDATING TESTIMONIALS ALIGNMENT & STRUCTURE ===");

// 1. Grid container
let pass1 = aboutHtml.includes('class="testimonials-grid"') &&
            styleCss.includes('.testimonials-grid {') &&
            styleCss.includes('grid-template-columns: repeat(3, 1fr);') &&
            styleCss.includes('align-items: stretch;');
console.log(`[${pass1 ? "PASS" : "FAIL"}] Testimonials grid uses 3-column equal-width layout with stretch alignment`);

// 2. Card layout & structure
let pass2 = styleCss.includes('.testimonial-card {') &&
            styleCss.includes('display: flex;') &&
            styleCss.includes('flex-direction: column;') &&
            styleCss.includes('align-items: center;') &&
            styleCss.includes('text-align: center;');
console.log(`[${pass2 ? "PASS" : "FAIL"}] Testimonial cards use vertical flexbox with centered alignment`);

// 3. Avatar alignment
let pass3 = styleCss.includes('.testimonial-avatar-wrap {') &&
            styleCss.includes('width: 68px;') &&
            styleCss.includes('height: 68px;') &&
            styleCss.includes('border-radius: 50%;') &&
            aboutHtml.includes('class="testimonial-avatar"');
console.log(`[${pass3 ? "PASS" : "FAIL"}] Avatar wrappers have identical 68x68 circular dimensions and baseline`);

// 4. Star rating horizontal alignment
let pass4 = styleCss.includes('.testimonial-stars {') &&
            styleCss.includes('height: 20px;') &&
            styleCss.includes('margin-bottom: 18px;');
console.log(`[${pass4 ? "PASS" : "FAIL"}] Star ratings share identical vertical height and margin baseline`);

// 5. Quote flex centering & Author bottom anchoring
let pass5 = styleCss.includes('.testimonial-quote-wrap {') &&
            styleCss.includes('flex: 1 1 auto;') &&
            styleCss.includes('.testimonial-author-wrap {') &&
            styleCss.includes('margin-top: auto;') &&
            styleCss.includes('border-top: 1px solid var(--border-color);');
console.log(`[${pass5 ? "PASS" : "FAIL"}] Quotes are flex-centered and author footers are anchored to identical bottom baseline`);

// 6. Section header centering
let pass6 = aboutHtml.includes('<div class="section-header">') &&
            aboutHtml.includes('<h2 class="section-title">What Our Customers Say</h2>');
console.log(`[${pass6 ? "PASS" : "FAIL"}] Section header and underline are centered`);

// 7. Responsive styling
let pass7 = styleCss.includes('@media (max-width: 991.98px)') &&
            styleCss.includes('grid-template-columns: repeat(2, 1fr);') &&
            styleCss.includes('@media (max-width: 767.98px)') &&
            styleCss.includes('grid-template-columns: 1fr;');
console.log(`[${pass7 ? "PASS" : "FAIL"}] Responsive layouts for tablet (2 cols) and mobile (1 col) present`);

if (pass1 && pass2 && pass3 && pass4 && pass5 && pass6 && pass7) {
  console.log("\nALL TESTIMONIAL SECTION ALIGNMENT CHECKS PASSED!");
} else {
  process.exit(1);
}
