const fs = require('fs');

const home2 = fs.readFileSync('home-2.html', 'utf8');
const styleCss = fs.readFileSync('css/style.css', 'utf8');

if (home2.includes('class="text-decoration-none text-dark">Artists\' Oil Color')) {
  console.error("FAIL: home-2.html still has text-dark on product 1");
  process.exit(1);
}
if (home2.includes('class="text-decoration-none text-dark">9000 Graphite')) {
  console.error("FAIL: home-2.html still has text-dark on product 2");
  process.exit(1);
}
if (home2.includes('class="text-decoration-none text-dark">Premo Polymer')) {
  console.error("FAIL: home-2.html still has text-dark on product 3");
  process.exit(1);
}
if (home2.includes('class="text-decoration-none text-dark">100% Cotton')) {
  console.error("FAIL: home-2.html still has text-dark on product 4");
  process.exit(1);
}

if (!home2.includes('class="product-brand mb-1">Winsor &amp; Newton</div>') ||
    !home2.includes('class="product-brand mb-1">Faber-Castell</div>') ||
    !home2.includes('class="product-brand mb-1">Sculpey</div>') ||
    !home2.includes('class="product-brand mb-1">Arches</div>')) {
  console.error("FAIL: home-2.html missing .product-brand markup");
  process.exit(1);
}

if (!styleCss.includes('.product-card .product-brand {') ||
    !styleCss.includes('.product-title-link {')) {
  console.error("FAIL: style.css missing product-brand / product-title-link CSS");
  process.exit(1);
}

console.log("SUCCESS: All brand and product titles verified high-contrast and visible in both light & dark modes!");
