const fs = require('fs');

console.log("=== VALIDATING FOOTER COLUMNS & NEWSLETTER POSITIONING ===");

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && !['404.html', 'coming-soon.html'].includes(f));
console.log(`Checking ${files.length} HTML files...`);

let allPass = true;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  const hasGrid = content.includes('class="footer-grid"');
  const hasCol1 = content.includes('<h5><i class="fas fa-palette me-2"></i>ArtCraft</h5>');
  const hasCol2 = content.includes('<h5>Shop</h5>');
  const hasCol3 = content.includes('<h5>Quick Links</h5>') && content.includes('about.html') && content.includes('workshops.html');
  const hasCol4 = content.includes('<h5>Newsletter</h5>') && content.includes('class="footer-newsletter"');
  
  if (hasGrid && hasCol1 && hasCol2 && hasCol3 && hasCol4) {
    console.log(`[PASS] ${file}: 4-column footer aligned with top headings`);
  } else {
    console.error(`[FAIL] ${file}: footer structure missing components`);
    allPass = false;
  }
});

const styleCss = fs.readFileSync('css/style.css', 'utf8');
let passCss = styleCss.includes('.footer-grid {') &&
              styleCss.includes('grid-template-columns: repeat(4, 1fr);') &&
              styleCss.includes('align-items: start;') &&
              styleCss.includes('.footer-newsletter .d-flex {');

console.log(`[${passCss ? "PASS" : "FAIL"}] CSS contains 4-column start alignment and inline newsletter input/button`);

if (allPass && passCss) {
  console.log("\nALL FOOTER & NEWSLETTER POSITIONING CHECKS PASSED!");
} else {
  process.exit(1);
}
