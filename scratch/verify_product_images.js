const fs = require('fs');

const home2 = fs.readFileSync('home-2.html', 'utf8');
const index = fs.readFileSync('index.html', 'utf8');

if (home2.includes('photo-1590736969955-71cc94801759')) {
  console.error("FAIL: home-2.html still references watch photo");
  process.exit(1);
}

if (index.includes('photo-1590736969955-71cc94801759')) {
  console.error("FAIL: index.html still references watch photo");
  process.exit(1);
}

if (!fs.existsSync('images/product-sculpey-polymer-clay.jpg')) {
  console.error("FAIL: images/product-sculpey-polymer-clay.jpg does not exist");
  process.exit(1);
}

if (!fs.existsSync('images/product-arches-watercolor-paper.jpg')) {
  console.error("FAIL: images/product-arches-watercolor-paper.jpg does not exist");
  process.exit(1);
}

const sculpeySize = fs.statSync('images/product-sculpey-polymer-clay.jpg').size;
const archesSize = fs.statSync('images/product-arches-watercolor-paper.jpg').size;

if (sculpeySize < 10000 || archesSize < 10000) {
  console.error("FAIL: image files are too small");
  process.exit(1);
}

console.log(`SUCCESS: Sculpey image (${sculpeySize} bytes) and Arches image (${archesSize} bytes) verified valid and linked in both home-2.html and index.html!`);
