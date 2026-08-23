const fs = require('fs');

const dataContent = fs.readFileSync('js/data.js', 'utf8');
const home2Content = fs.readFileSync('home-2.html', 'utf8');

let window = {};
eval(dataContent);

const p33 = window.AppData.products.find(p => p.id === 33);
const p34 = window.AppData.products.find(p => p.id === 34);
const p35 = window.AppData.products.find(p => p.id === 35);
const p36 = window.AppData.products.find(p => p.id === 36);

if (!p33 || !p33.name.includes("Artists' Oil Color Master Set")) {
  console.error("FAIL: Product 33 missing or wrong name", p33);
  process.exit(1);
}
if (!p34 || !p34.name.includes("9000 Graphite Pencil Art Set")) {
  console.error("FAIL: Product 34 missing or wrong name", p34);
  process.exit(1);
}
if (!p35 || !p35.name.includes("Premo Polymer Clay 30-Color Multipack")) {
  console.error("FAIL: Product 35 missing or wrong name", p35);
  process.exit(1);
}
if (!p36 || !p36.name.includes("100% Cotton Cold Press Pad")) {
  console.error("FAIL: Product 36 missing or wrong name", p36);
  process.exit(1);
}

// Check home-2.html has data-product-id 33, 34, 35, 36
if (!home2Content.includes('data-product-id="33"') ||
    !home2Content.includes('data-product-id="34"') ||
    !home2Content.includes('data-product-id="35"') ||
    !home2Content.includes('data-product-id="36"')) {
  console.error("FAIL: home-2.html missing correct data-product-id attributes");
  process.exit(1);
}

console.log("SUCCESS: All 4 products (including Sculpey Polymer Clay ID 35) verified in data.js & home-2.html!");
